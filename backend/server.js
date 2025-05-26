const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret Key (production'da environment variable kullanın)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Veritabanı bağlantısı
const db = new sqlite3.Database('todos.db', (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  }
  console.log('SQLite veritabanına bağlandı.');
});

// Tabloları oluşturma
db.serialize(() => {
  // Users tablosu
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Todos tablosu - user_id eklendi
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (!err) {
      // Test kullanıcısı ve todos ekleme
      const testPassword = bcrypt.hashSync('123456', 10);
      db.run('INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)', 
        ['testuser', 'test@example.com', testPassword], function(err) {
          if (!err && this.lastID) {
            // Test todosları ekleme
            const testTodos = [
              { title: 'Spor Ayakkabı Al', completed: 0 },
              { title: 'Raporu Tamamla', completed: 0 },
              { title: 'Anneyi Ara', completed: 1 }
            ];
            
            testTodos.forEach(todo => {
              db.run('INSERT OR IGNORE INTO todos (title, completed, user_id) VALUES (?, ?, ?)', 
                [todo.title, todo.completed, this.lastID]
              );
            });
          }
        }
      );
    }
  });
});

// JWT Middleware - Token doğrulama
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes

// Kullanıcı kaydı
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Kullanıcı adı veya email zaten kullanımda' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        const token = jwt.sign(
          { id: this.lastID, username, email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({
          message: 'Kullanıcı başarıyla oluşturuldu',
          token,
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server hatası' });
  }
});

// Kullanıcı girişi
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir' });
  }

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Geçersiz şifre' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Giriş başarılı',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: 'Server hatası' });
    }
  });
});

// Token doğrulama endpoint'i
app.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Todo Routes (Artık authentication gerekli)

// Tüm todosları getirme (sadece kullanıcının kendi todosları)
app.get('/todos', authenticateToken, (req, res) => {
  db.all('SELECT * FROM todos WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Yeni todo ekleme
app.post('/todos', authenticateToken, (req, res) => {
  const { title, completed } = req.body;
  db.run('INSERT INTO todos (title, completed, user_id) VALUES (?, ?, ?)', 
    [title, completed ? 1 : 0, req.user.id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, title, completed, user_id: req.user.id });
    }
  );
});

// Todo güncelleme
app.put('/todos/:id', authenticateToken, (req, res) => {
  const { title, completed } = req.body;
  
  // Önce todo'nun kullanıcıya ait olup olmadığını kontrol et
  db.get('SELECT * FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, todo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo bulunamadı veya size ait değil' });
    }
    
    db.run('UPDATE todos SET title = ?, completed = ? WHERE id = ? AND user_id = ?', 
      [title, completed ? 1 : 0, req.params.id, req.user.id], 
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: req.params.id, title, completed });
      }
    );
  });
});

// Todo silme
app.delete('/todos/:id', authenticateToken, (req, res) => {
  // Önce todo'nun kullanıcıya ait olup olmadığını kontrol et
  db.get('SELECT * FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, todo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo bulunamadı veya size ait değil' });
    }
    
    db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id });
    });
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});