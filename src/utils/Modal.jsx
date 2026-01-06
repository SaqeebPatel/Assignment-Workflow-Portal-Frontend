import React from 'react'
export default function Modal({open,onClose,children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg z-10 max-w-lg w-full">
        {children}
      </div>
    </div>
  )
}
