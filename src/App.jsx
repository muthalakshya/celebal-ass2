import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TodoApp from './components/TodoApp'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<TodoApp/>} />
    </Routes>
  )
}

export default App
