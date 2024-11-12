import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      // 먼저 토큰을 가져와서 Authorization 헤더 설정
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
  
      // 그 후에 Todo 목록을 가져오기
      const response = await axios.get('http://localhost:8080/todos');
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Todo 추가
  const handleAddTodo = async () => {
    if (newTitle.trim() === '' || newContent.trim() === '') {
      setError('제목과 내용을 입력하세요.');
      return;
    }
    try {
      // 먼저 토큰을 가져와서 Authorization 헤더 설정
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        'http://localhost:8080/todos',
        { title: newTitle, content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰 헤더에 추가
          },
        }
      );
      
      setTodos([...todos, response.data.data]); // 성공 시 새로운 할 일 추가
      console.log(response.data.data)
      setNewTitle(''); // 입력 필드 초기화
      setNewContent('');
      setError(null); // 에러 초기화
    } catch (error) {
      console.error(error);
      setError('Todo 추가에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="할 일 내용"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button onClick={handleAddTodo}>추가</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <ul >
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title }</h3>
            <p>{todo.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
