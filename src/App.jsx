import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase setup
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
  const [query, setQuery] = useState('')

  // Load all properties from Supabase
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
    else setProperties(data || [])
    setLoading(false)
  }

  // Add new property
  async function addProperty(e) {
    e.preventDefault()
    const { name, address1, city, state, postal_code } = form
    const { error } = await supabase.from('properties').insert([
      { name, address1, city, state, postal_code },
    ])
    if (error) {
      alert(error.message)
      return
    }
    setForm({ name: '', address1: '', city: '', state: 'MD', postal_code: '' })
    loadProperties()
  }

  // Delete property
  async function deleteProperty(id) {
    if (!confirm('Delete this property?')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  // Handle form field changes
  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Filter properties
  const filtered = properties.filter((p) => {
    const text = `${p.name ?? ''} ${p.address1 ?? ''} ${p.city ?? ''} ${p.state ?? ''} ${
      p.postal_code ?? ''
    }`.toLowerCase()
    return text.includes(query.toLowerCase())
  })

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto' }}>
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
        <button type="submit" style={{ marginTop: 8 }}>Save Property</button>
      </form>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name, address, or city"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', marginTop: 16 }}
      />

      <h2 style={{ marginTop: 32 }}>Properties loaded from Supabase:</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p>No properties found.</p>}

      <ul>
        {filtered.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <b>{p.name || p.address1}</b> — {p.address1}, {p.city}, {p.state} {p.postal_code}
            <button
              onClick={() => deleteProperty(p.id)}
              style={{
                marginLeft: 10,
                background: '#d9534f',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
