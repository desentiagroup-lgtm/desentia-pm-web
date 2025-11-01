import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  useEffect(() => {
    supabase
      .from('test_table')
      .select('*')
      .then((res) => console.log('Supabase data:', res))
      .catch((err) => console.error('Supabase error:', err));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h1>DeSentia Group — PM MVP</h1>
      <p>React + Supabase connected!</p>
    </div>
  );
}
