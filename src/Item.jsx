import React, { useState } from 'react';
import styles from './TodoApp.module.css';
import { motion } from 'framer-motion';

function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const handleEditSubmit = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.4 }}
      className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
      
    >
      <button onClick={() => onToggle(todo.id)} className={`${styles.checkButton} ${todo.completed ? styles.checkButtonActive : ''}`}>✓</button>

      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={styles.editInput}
          />
          <button onClick={handleEditSubmit} className={styles.saveButton}>Save</button>
        </div>
      ) : (
        <span className={`${styles.todoText} ${todo.completed ? styles.completedText : ''}`}>
          {todo.title}
        </span>
      )}

      <div className={styles.actionButtons}>
        <button onClick={() => setIsEditing(!isEditing)} className={styles.editButton}>✎</button>
        <button onClick={() => onDelete(todo.id)} className={styles.deleteButton}>🗑️</button>
      </div>
    </motion.div>
  );
}

export default TodoItem;
