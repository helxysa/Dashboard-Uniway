'use client'

import { useEffect, useState } from 'react'
import { FiUser, FiMail, FiBook, FiBookmark, FiCalendar } from 'react-icons/fi'

interface User {
  id: string
  name: string
  email: string
  course: string
  saved: string[]
  createdAt: {
    _seconds: number
    _nanoseconds: number
  }
  updatedAt: {
    _seconds: number
    _nanoseconds: number
  }
}

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://api-uniway-firebase.vercel.app/api/users')
        const data = await response.json()
        setUsers(data.users)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="ml-72 p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="ml-72 p-8 pb-16 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {users.length} {users.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow transition-shadow border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FiMail size={14} />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-700">
                <FiBook className="text-blue-600" size={16} />
                <span>{user.course}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <FiBookmark className="text-blue-600" size={16} />
                <span>{user.saved.length} posts salvos</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <FiCalendar className="text-blue-600" size={16} />
                <span>Desde {new Date(user.createdAt._seconds * 1000).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}