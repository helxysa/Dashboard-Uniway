'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon: string
}

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/pages/dashboard', title: 'Dashboard', icon: 'bx-home-alt' },
    { href: '/pages/usuarios', title: 'Usuários', icon: 'bx-user' },
    { href: '/pages/vagas', title: 'Vagas', icon: 'bx-briefcase' }
  ]

  const NavLink = ({ href, children, icon }: NavLinkProps) => {
    const isActive = pathname === href
    
    return (
      <Link 
        href={href}
        className={`
          group flex items-center w-full px-4
          py-4 rounded-xl transition-all duration-500 ease-in-out
          hover:scale-102 transform text-lg
          ${isActive 
            ? 'bg-purple-100 text-purple-700 shadow-sm font-semibold' 
            : 'text-gray-800 hover:bg-purple-50 hover:text-purple-600 hover:font-medium'
          }
        `}
      >
        <i className={`
          bx ${icon} text-2xl transform transition-transform duration-300
          group-hover:rotate-6 ${isActive ? 'text-purple-600' : ''}
        `}></i>
        <div className="flex flex-1 items-center ml-4 opacity-0 animate-fadeIn">
          <span>{children}</span>
        </div>
      </Link>
    )
  }

  return (
    <aside className="
      w-72 bg-white fixed h-full left-0 top-0
      border-r border-gray-200 shadow-lg p-5 pt-8
      transition-all ease-in-out
    ">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center
          transform transition-all duration-300 hover:rotate-6 hover:scale-110 shadow-md">
          <span className="text-white font-bold text-xl">U</span>
        </div>
        <h1 className="font-bold text-2xl text-gray-800 transition-all duration-300">
          Uniway
        </h1>
      </div>

      <nav className="space-y-4">
        {menuItems.map((item) => (
          <NavLink 
            key={item.href}
            href={item.href}
            icon={item.icon}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

