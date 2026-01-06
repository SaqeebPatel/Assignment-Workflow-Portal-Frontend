import React from 'react'
export default function Card({title,description,children}){
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {children}
    </div>
  )
}
