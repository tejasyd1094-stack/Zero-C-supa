"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(()=> setMounted(true), []);
  const current = theme === 'system' ? systemTheme : theme;

  return (
    <header className='header'>
      <div className='logo'><img src='/logo.png' width={36} height={36} alt='logo' /><div style={{fontWeight:700}}>Zero Conflict</div></div>
      <div style={{flex:1}} />
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <a href='/pricing' className='small'>Pricing</a>
        <button className='small' onClick={()=> setTheme(current === 'dark' ? 'light' : 'dark')}>{mounted ? (current==='dark' ? 'Light' : 'Dark') : 'Theme'}</button>
      </div>
    </header>
  );
}
