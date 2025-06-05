"use client"

import { Menu, X, Search, User, LogOut } from "lucide-react"

interface HeaderProps {
  isMenuOpen: boolean
  toggleMenu: () => void
}

export function Header({ isMenuOpen, toggleMenu }: HeaderProps) {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleMenu} className="mr-4 md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-xl">Your App</span>
      </div>

      <div className="flex items-center space-x-4">
        <Search size={20} className="text-gray-500" />
        <User size={20} className="text-gray-500" />
        <LogOut size={20} className="text-gray-500" />
      </div>
    </header>
  )
}
