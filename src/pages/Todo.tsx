import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Todo 목록 불러오기
  const fetchTodos = async () => {
    try {
      const response = await axios.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Todo 추가
  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;
    try {
      const response = await axios.post('/todos', { title: newTodo, completed: false });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  // Todo 수정 모드 활성화
  const startEditingTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  // Todo 수정
  const handleUpdateTodo = async () => {
    if (!editingTodo) return;
    try {
      const response = await axios.put(`/todos/${editingTodo.id}`, {
        title: editingTodo.title,
        completed: editingTodo.completed,
      });
      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? response.data : todo))
      );
      setEditingTodo(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Todo 삭제
  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingTodo?.id === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                />
                <button onClick={handleUpdateTodo}>저장</button>
                <button onClick={() => setEditingTodo(null)}>취소</button>
              </div>
            ) : (
              <div>
                <span>{todo.title}</span>
                <button onClick={() => startEditingTodo(todo)}>수정</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;