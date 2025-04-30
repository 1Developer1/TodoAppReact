const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
const db = new sqlite3.Database('./backend/todos.db', (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  }
  console.log('SQLite veritabanına bağlandı.');
});

// Tablo oluşturma
db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  )`, (err) => {
    if (!err) {
      // Tablo oluşturulduktan sonra initial data ekle
      const initialTodos = [
        { title: 'Spor Ayakkabı Al', completed: 0 },
        { title: 'Raporu Tamamla', completed: 0 },
        { title: 'Anneyi Ara', completed: 1 }
      ];
  
      initialTodos.forEach(todo => {
        db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', 
          [todo.title, todo.completed]
        );
      });
    }
  });

// Tüm todaları getirme
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Yeni todo ekleme
app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', 
    [title, completed ? 1 : 0], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, title, completed });
    }
  );
});

// Todo güncelleme
app.put('/todos/:id', (req, res) => {
  const { title, completed } = req.body;
  db.run('UPDATE todos SET title = ?, completed = ? WHERE id = ?', 
    [title, completed ? 1 : 0, req.params.id], 
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, title, completed });
    }
  );
});

// Todo silme
app.delete('/todos/:id', (req, res) => {
  db.run('DELETE FROM todos WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id });
  });
});

// React frontend'ini serve et (build edilmiş dosyaları sunma)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Tüm diğer yolları index.html'e yönlendir
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
