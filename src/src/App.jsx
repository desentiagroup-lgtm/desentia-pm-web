import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', maxWidth:720, margin:'40px auto', padding:'0 16px'}}>
      <h1 style={{marginBottom:8}}>DeSentia Group — PM MVP</h1>
      <p style={{marginTop:0, color:'#555'}}>React + Vite starter. Deployed on Cloudflare Pages.</p>
      <div style={{border:'1px solid #eee', padding:16, borderRadius:12}}>
        <p>Replace this with your login or dashboard later.</p>
        <button onClick={() => setCount(c => c+1)}>Click test ({count})</button>
      </div>
    </div>
  )
}
