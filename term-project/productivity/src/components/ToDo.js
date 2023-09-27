import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const TodoList = ( {setScore}) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleToggleTodo = (index) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo, i) => {
        if (i === index) {
          if (!todo.completed) {
            setScore((prevScore) => prevScore + 50);
          } else {
            setScore((prevScore) => prevScore - 50);
          }
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return updatedTodos;
    });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <p className="desc-p">Add the tasks to-do tasks here! Try to finish the tasks for the day to get a good day report. Each to-do task gets you 50 points.</p>
      <div className="todo-adder">
      <input
        type="text"
        className="todo-adder-text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Enter a new todo"
      />
      <div> 
        <button className="productivity-btn" onClick={handleAddTodo}>Add Todo</button></div>
   
      </div>
    
      <div className="todo-tasks">
      {todos.map((todo, index) => (
          <li key={index}>
            
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(index)}
            />
         
            
            <div>
            {todo.text}
            </div>
            
            <button onClick={() => handleDeleteTodo(index)}><FaTrashAlt /></button>
          </li>
        ))}
        
      </div>
     
    </div>
  );
};

export default TodoList;
