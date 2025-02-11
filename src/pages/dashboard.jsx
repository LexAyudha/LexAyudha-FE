import React, { useEffect, useState } from 'react' 
import { useParams } from 'react-router-dom'
import { Image } from 'antd';

export default function Dashboard() {
  // Add states, hooks, and other functions
  // Example: const [state, setState] = useState(initialState)
  // Example: useEffect(() => { /* effect logic */ }, [dependencies])
  // Example: const handleChange = () => { /* handle change logic */ }
    const { id } = useParams();
  return (
    <div className='la-container'>
       <h1>Dashboard</h1>
       <p>User ID: {id}</p>
    </div>
  )
}