import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, X, ListTodo, Calendar, Tag } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'normal'
    }
    
    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditValue(todo.text)
  }

  const saveEdit = (id) => {
    if (!editValue.trim()) {
      deleteTodo(id)
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editValue.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500'
      case 'medium': return 'border-yellow-500'
      default: return 'border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ListTodo className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Todo List</h1>
          </div>
          <p className="text-white/80">高效管理你的每日任务</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="p-6 border-b border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="添加新任务..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                添加
              </button>
            </div>
          </form>

          {/* Stats & Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  总计：<strong className="text-gray-900">{stats.total}</strong>
                </span>
                <span className="text-gray-600">
                  进行中：<strong className="text-blue-600">{stats.active}</strong>
                </span>
                <span className="text-gray-600">
                  已完成：<strong className="text-green-600">{stats.completed}</strong>
                </span>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  {filter === 'all' ? '暂无任务，添加一个开始吧！' : 
                   filter === 'active' ? '没有进行中的任务' : '没有已完成的任务'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`todo-item flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                      todo.completed ? 'bg-gray-50' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white checkmark-animation'
                          : 'border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4" />}
                    </button>

                    {/* Todo Text */}
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo.id)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        autoFocus
                        className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startEdit(todo)}
                        className={`flex-1 cursor-pointer transition-all ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="编辑"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {stats.completed > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={clearCompleted}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                清除已完成任务 ({stats.completed})
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>双击任务可编辑 · 数据自动保存到本地</p>
          <p className="mt-1">Built with React + Vite + Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default App
