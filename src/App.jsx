import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // simple form state
  const [form, setForm] = useState({
    name: '',
    address1: '',
    city: '',
    state: 'MD',
    postal_code: '',
  });

  // load properties
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

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function addProperty(e) {
    e.preventDefault();
    setErr(null);

    // minimal validation
    if (!form.address1 || !form.city || !form.state || !form.postal_code) {
      setErr('Please fill in address, city, state, and postal code.');
      return;
    }

    const { error } = await supabase.from('properties').insert([
      {
        name: form.name || null,
        address1: form.address1,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
      },
    ]);

    if (error) {
      setErr(error.message);
      return;
    }

    // clear and reload
    setForm({ name: '', address1: '', city: '', state: 'MD', postal_code: '' });
    const { data } = await supabase
      .from('properties')
      .select('id,name,address1,city,state,postal_code')
      .order('created_at', { ascending: false });
    setProperties(data || []);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>🏠 DeSentia Group Property Dashboard</h1>

      {/* Add Property Form */}
      <div style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Add a property</h2>
        <form onSubmit={addProperty}>
          <div style={{ display: 'grid', gap: 12 }}>
            <input name="name" placeholder="Name (optional)"
              value={form.name} onChange={onChange} />
            <input name="address1" placeholder="Street address"
              value={form.address1} onChange={onChange} required />
            <input name="city" placeholder="City"
              value={form.city} onChange={onChange} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input name="state" placeholder="State" value={form.state} onChange={onChange} required />
              <input name="postal_code" placeholder="Postal code"
                value={form.postal_code} onChange={onChange} required />
            </div>
            <button type="submit">Save property</button>
          </div>
        </form>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </div>

      {/* List */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Properties loaded from Supabase:</h2>
        {loading ? (
          <p>Loading…</p>
        ) : properties.length === 0 ? (
          <p>No properties found yet.</p>
        ) : (
          <ul>
            {properties.map(p => (
              <li key={p.id}>
                <strong>{p.name || 'Untitled'}</strong> — {p.address1}, {p.city}, {p.state} {p.postal_code}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
        </ul>
      )}
    </div>
  );
}
