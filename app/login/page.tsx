"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [email,setEmail] = useState('');
  async function send() {
    if (!email || !email.includes('@')) return alert('Enter a valid email');
    const res = await fetch('/api/auth/magiclink', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, redirectTo: window.location.origin + '/dashboard' }) });
    if (res.ok) { alert('Magic link sent. Check your email.'); localStorage.setItem('zc_email', email); } else { alert('Failed to send magic link'); }
  }
  return (
    <div className='card'>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src='/logo.png' width={48} alt='logo' />
        <div><div style={{fontWeight:700}}>Zero Conflict</div><div className='small'>Passwordless login</div></div>
      </div>
      <input className='input' placeholder='you@company.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
      <button className='btn' onClick={send}>Send Magic Link</button>
      <div className='small' style={{marginTop:8}}>Demo: Magic link via Supabase when configured.</div>
    </div>
  );
}
