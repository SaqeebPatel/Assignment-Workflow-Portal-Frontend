import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Gifting</Link>
        <nav className="space-x-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
        </nav>
      </div>
    </header>
  )
}
