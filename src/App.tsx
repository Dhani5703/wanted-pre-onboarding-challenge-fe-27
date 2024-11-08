import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import TodoPage from './pages/Todo'

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/todo" element={<TodoPage />} />
    </Routes>
  </Router>
  )
}

export default App
