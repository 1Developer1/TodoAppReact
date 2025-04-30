import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import TodoItem from './Item';
import styles from './TodoApp.module.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
// Redux ile ilgili importlar
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTodosAction, 
  addTodoAction, 
  deleteTodoAction, 
  toggleTodoAction, 
  editTodoAction,
  setLoadingAction,
  setErrorAction
} from './redux/todoReducer';

const TodoApp = () => {
  // Redux state'ini çekme
  const todos = useSelector(state => state.todos);
  const loading = useSelector(state => state.loading);
  const error = useSelector(state => state.error);
  
  // Dispatch fonksiyonu
  const dispatch = useDispatch();
  
  const { register, handleSubmit, reset } = useForm();

  // Verileri çekme - Redux kullanarak
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch(setLoadingAction(true));
      try {
        const response = await axios.get('http://localhost:5000/todos');
        dispatch(fetchTodosAction(response.data));
      } catch (error) {
        console.error('Todoları yükleme hatası:', error);
        dispatch(setErrorAction('Todoları yükleme hatası: ' + error.message));
      }
    };
    fetchTodos();
  }, [dispatch]);

  // Yeni todo ekleme - Redux kullanarak
  const onSubmit = async (data) => {
    const title = data.newTodoTitle.trim();
    if (!title) return;
    
    dispatch(setLoadingAction(true));
    try {
      const response = await axios.post('http://localhost:5000/todos', { title, completed: false });
      dispatch(addTodoAction(response.data));
      reset();
    } catch (error) {
      console.error('Todo ekleme hatası:', error);
      dispatch(setErrorAction('Todo ekleme hatası: ' + error.message));
    }
  };

  // Todo silme - Redux kullanarak
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      dispatch(deleteTodoAction(id));
    } catch (error) {
      console.error('Todo silme hatası:', error);
      dispatch(setErrorAction('Todo silme hatası: ' + error.message));
    }
  };

  // Todo durumunu değiştirme - Redux kullanarak
  const toggleTodo = async (id) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    try {
      const response = await axios.put(`http://localhost:5000/todos/${id}`, {
        ...todoToToggle,
        completed: !todoToToggle.completed
      });
      dispatch(toggleTodoAction(response.data));
    } catch (error) {
      console.error('Todo güncelleme hatası:', error);
      dispatch(setErrorAction('Todo güncelleme hatası: ' + error.message));
    }
  };

  // Todo düzenleme - Redux kullanarak
  const editTodo = async (id, newTitle) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    try {
      const response = await axios.put(`http://localhost:5000/todos/${id}`, { 
        ...todoToEdit, 
        title: newTitle 
      });
      dispatch(editTodoAction(response.data));
    } catch (error) {
      console.error('Todo düzenleme hatası:', error);
      dispatch(setErrorAction('Todo düzenleme hatası: ' + error.message));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🚀 React Todo App with Redux</h1>

      {/* Loading ve error durumunu gösterme */}
      {loading && <p className={styles.statusMessage}>Yükleniyor...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.inputContainer}>
        <input
          {...register('newTodoTitle')}
          placeholder="Enter a new todo"
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>+ Add</button>
      </form>

      <div className={styles.todoList}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} onToggle={toggleTodo} onEdit={editTodo} />
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link 
          to="/stats"
          state={{ todos: todos }}
          className={styles.linkButton}
        >
          Go to Statistics
        </Link>
      </div>
    </div>
  );
};

export default TodoApp;