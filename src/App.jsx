import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    address1: '',
    city: '',
    state: 'MD',
    postal_code: '',
  })

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setProperties(data)
    setLoading(false)
  }

  async function addProperty(e) {
    e.preventDefault()
    const { error } = await supabase.from('properties').insert([form])
    if (error) setError(error.message)
    else {
      setForm({ name: '', address1: '', city: '', state: 'MD', postal_code: '' })
      loadProperties()
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>🏠 DeSentia Group Property Dashboard</h1>

      <form onSubmit={addProperty} style={{ marginTop: 16 }}>
        <input
          name="name"
          placeholder="Property Name (optional)"
          value={form.name}
          onChange={handleChange}
        /><br />
        <input
          name="address1"
          placeholder="Address"
          value={form.address1}
          onChange={handleChange}
          required
        /><br />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        /><br />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        /><br />
        <input
          name="postal_code"
          placeholder="Postal Code"
          value={form.postal_code}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Save Property</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2 style={{ marginTop: 32 }}>Properties loaded from Supabase:</h2>
      {loading ? (
        <p>Loading…</p>
      ) : properties.length === 0 ? (
        <p>No properties found yet.</p>
      ) : (
        <ul>
          {properties.map((p) => (
            <li key={p.id}>
              {p.name ? `${p.name} — ` : ''}
              {p.address1}, {p.city}, {p.state} {p.postal_code}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
