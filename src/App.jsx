import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) {
        console.error('Error:', error);
      } else {
        setProperties(data);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>🏠 DeSentia Group Property Dashboard</h1>
      <p>Properties loaded from Supabase:</p>
      {properties.length === 0 ? (
        <p>No properties found yet.</p>
      ) : (
        <ul>
          {properties.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.address1}, {p.city}, {p.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
