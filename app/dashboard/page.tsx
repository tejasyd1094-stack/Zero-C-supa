"use client";
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [situation,setSituation]=useState('');
  const [between,setBetween]=useState('Manager');
  const [mode,setMode]=useState('Email');
  const [extra,setExtra]=useState('');
  const [script,setScript]=useState('');
  const [trialsLeft,setTrialsLeft]=useState<number|null>(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ (async()=>{
    const email = localStorage.getItem('zc_email') || '';
    if (!email) return setTrialsLeft(3);
    const res = await fetch('/api/usage', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
    if (res.ok) { const j = await res.json(); setTrialsLeft(Math.max(0, 3 - (j.count||0))); }
  })() },[]);

  async function generate() {
    const email = localStorage.getItem('zc_email') || prompt('Enter your email for demo:') || '';
    if (!email) return alert('Email required');
    localStorage.setItem('zc_email',email);
    setLoading(true);
    const res = await fetch('/api/generate', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, situation, between, mode, extra })});
    const j = await res.json();
    setLoading(false);
    if (!res.ok) return alert(j.error || 'Error');
    setScript(j.script||'');
    const usageRes = await fetch('/api/usage', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
    const usage = await usageRes.json(); setTrialsLeft(Math.max(0, 3 - (usage.count||0)));
  }

  return (
    <div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <img src='/logo.png' width={48} alt='logo' />
        <div><div style={{fontWeight:700}}>Zero Conflict — Script Generator</div><div className='small'>Generate calm, solution-focused messages</div></div>
      </div>
      <div style={{height:12}} />
      <div className='card'>
        <textarea className='input' placeholder='Describe your situation...' value={situation} onChange={(e)=>setSituation(e.target.value)} style={{minHeight:100}} />
        <select className='input' value={between} onChange={(e)=>setBetween(e.target.value)}><option>Manager</option><option>Colleague</option><option>Direct Report</option><option>Customer</option><option>Vendor</option></select>
        <select className='input' value={mode} onChange={(e)=>setMode(e.target.value)}><option>Email</option><option>Verbal</option><option>Teams</option><option>WhatsApp</option><option>Slack</option></select>
        <textarea className='input' placeholder='Extra context: tone, desired outcome...' value={extra} onChange={(e)=>setExtra(e.target.value)} style={{minHeight:60}} />
        <button className='btn' onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate Script'}</button>
        {trialsLeft !== null && <div className='small' style={{marginTop:8}}>Free trials left: {trialsLeft}</div>}
      </div>
      {script && <div className='card' style={{marginTop:12}}><h3>Your Script</h3><pre style={{whiteSpace:'pre-wrap'}}>{script}</pre></div>}
    </div>
  );
}
