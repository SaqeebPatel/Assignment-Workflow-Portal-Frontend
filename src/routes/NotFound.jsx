import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl mb-4 font-bold">404</h1>
      <p>Page not found.</p>
      <Link to="/" className="underline mt-4 inline-block">Go Home</Link>
    </div>
  )
}
