import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data);
      }
    }
    fetchProperties();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 20 }}>
      <h1>🏠 DeSentia Group Property Dashboard</h1>
      <p>Properties loaded from Supabase:</p>
      <ul>
        {properties.length > 0 ? (
          properties.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> – {p.address1}, {p.city}, {p.state}
            </li>
          ))
        ) : (
          <p>No properties found yet.</p>
        )}
      </ul>
    </div>
  );
}
