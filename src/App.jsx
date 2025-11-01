import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase setup (must be set in Cloudflare Pages > Settings > Environment variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // add form
  const [form, setForm] = useState({
    name: '',
    address1: '',
    city: '',
    state: 'MD',
    postal_code: '',
  })

  // search
  const [query, setQuery] = useState('')

  // edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
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
    else setProperties(data || [])
    setLoading(false)
  }

  // ------- ADD -------
  function handleAddChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function addProperty(e) {
    e.preventDefault()
    const { name, address1, city, state, postal_code } = form
    const { error } = await supabase
      .from('properties')
      .insert([{ name, address1, city, state, postal_code }])
    if (error) return alert(error.message)
    setForm({ name: '', address1: '', city: '', state: 'MD', postal_code: '' })
    loadProperties()
  }

  // ------- DELETE -------
  async function deleteProperty(id) {
    if (!confirm('Delete this property?')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) return alert(error.message)
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  // ------- EDIT -------
  function startEdit(p) {
    setEditingId(p.id)
    setEditForm({
      name: p.name ?? '',
      address1: p.address1 ?? '',
      city: p.city ?? '',
      state: p.state ?? 'MD',
      postal_code: p.postal_code ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function handleEditChange(e) {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  async function saveEdit(id) {
    const { error } = await supabase
      .from('properties')
      .update({
        name: editForm.name,
        address1: editForm.address1,
        city: editForm.city,
        state: editForm.state,
        postal_code: editForm.postal_code,
      })
      .eq('id', id)

    if (error) return alert(error.message)

    // Optimistic UI refresh
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...editForm } : p))
    )
    setEditingId(null)
  }

  // ------- FILTER -------
  const filtered = properties.filter(p => {
    const text = `${p.name ?? ''} ${p.address1 ?? ''} ${p.city ?? ''} ${p.state ?? ''} ${p.postal_code ?? ''}`.toLowerCase()
    return text.includes(query.toLowerCase())
  })

  // ------- UI -------
  const inputStyle = { width: '100%', margin: '6px 0', padding: 8 }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 760, margin: '0 auto' }}>
      <h1>🏠 DeSentia Group Property Dashboard</h1>

      {/* Add form */}
      <form onSubmit={addProperty} style={{ marginTop: 12 }}>
        <input name="name" placeholder="Property Name (optional)" value={form.name} onChange={handleAddChange} style={inputStyle} />
        <input name="address1" placeholder="Address" value={form.address1} onChange={handleAddChange} required style={inputStyle} />
        <input name="city" placeholder="City" value={form.city} onChange={handleAddChange} required style={inputStyle} />
        <input name="state" placeholder="State" value={form.state} onChange={handleAddChange} required style={inputStyle} />
        <input name="postal_code" placeholder="Postal Code" value={form.postal_code} onChange={handleAddChange} required style={inputStyle} />
        <button type="submit" style={{ marginTop: 6 }}>Save Property</button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, address, city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ ...inputStyle, marginTop: 16 }}
      />

      <h2 style={{ marginTop: 24 }}>Properties loaded from Supabase:</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p>No properties found.</p>}

      <ul style={{ paddingLeft: 18 }}>
        {filtered.map(p => (
          <li key={p.id} style={{ marginBottom: 12 }}>
            {editingId === p.id ? (
              <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
                <input name="name" placeholder="Property Name" value={editForm.name} onChange={handleEditChange} style={inputStyle} />
                <input name="address1" placeholder="Address" value={editForm.address1} onChange={handleEditChange} style={inputStyle} />
                <input name="city" placeholder="City" value={editForm.city} onChange={handleEditChange} style={inputStyle} />
                <input name="state" placeholder="State" value={editForm.state} onChange={handleEditChange} style={inputStyle} />
                <input name="postal_code" placeholder="Postal Code" value={editForm.postal_code} onChange={handleEditChange} style={inputStyle} />
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => saveEdit(p.id)}>Save</button>
                  <button onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <b>{p.name || p.address1}</b> — {p.address1}, {p.city}, {p.state} {p.postal_code}
                <button onClick={() => startEdit(p)} style={{ marginLeft: 10 }}>Edit</button>
                <button
                  onClick={() => deleteProperty(p.id)}
                  style={{ marginLeft: 8, background: '#d9534f', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
