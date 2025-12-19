import { useState, useEffect } from 'react'
import Generator from "./components/generator.jsx";
import Login from './components/Login.jsx'
import API from './api.jsx'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setIsAuthenticated(true)
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`
      })
      .catch(() => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      })
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (token) => {
    setIsAuthenticated(true)
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    delete API.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="header">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="logout-container">
            <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
          </div>
          <Generator />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  )
}
