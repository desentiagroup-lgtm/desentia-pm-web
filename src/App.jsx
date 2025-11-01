import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Simple add-property form state
  const [form, setForm] = useState({
    name: '',
    address1: '',
    city: '',
    state: 'MD',
    postal_code: '',
  });

  // Load properties on page load
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id,name,address1,city,state,postal_code')
        .order('created_at', { ascending: false });
      if (error) setErr(error.message);
      else setProperties(data || []);
      setLoading(false);
    })();
  }, []);

  async function addProperty(e) {
    e.preventDefault();
    // minimal required fields for our schema
    const { data, error } = await supabase
      .from('properties')
      .insert([form])
      .select('id,name,address1,city,state,postal_code')
      .single();

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }
    setProperties((prev) => [data, ...prev]);
    setForm({ name: '', address1: '', city: '', state: 'MD', postal_code: '' });
  }

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '24px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>DeSentia Group — PM MVP</h1>
      <p style={{ marginTop: 0, color: '#555' }}>Properties connected to Supabase</p>

      {/* Add Property */}
      <form onSubmit={addProperty}
            style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Add a property</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input required placeholder="Name (e.g., 1821 Walbrook Ave)"
                 value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input required placeholder="Address 1"
                 value={form.address1} onChange={e=>setForm({...form, address1:e.target.value})}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 120px', gap: 8 }}>
            <input required placeholder="City"
                   value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/>
            <input required placeholder="State" value={form.state}
                   onChange={e=>setForm({...form, state:e.target.value})}/>
            <input required placeholder="ZIP"
                   value={form.postal_code} onChange={e=>setForm({...form, postal_code:e.target.value})}/>
          </div>
        </div>
        <button type="submit" style={{ marginTop: 10, padding: '8px 12px' }}>Save</button>
      </form>

      {/* List */}
      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>Error: {err}</p>}
      {!loading && !err && properties.length === 0 && <p>No properties yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {properties.map((p) => (
          <li key={p.id}
              style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <strong>{p.name || p.address1}</strong>
            <div style={{ color: '#555' }}>
              {p.address1}, {p.city}, {p.state} {p.postal_code}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
