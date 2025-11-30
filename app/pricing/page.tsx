import { formatLocalized } from '@/lib/currency';
export default async function PricingPage() {
  const amount = 499;
  const formatted = formatLocalized(amount);
  return (
    <div className='card'>
      <h2>Upgrade to Premium</h2>
      <div style={{marginTop:12,padding:12,borderRadius:8,background:'rgba(0,0,0,0.03)'}}>
        <h3>Starter</h3>
        <div style={{fontSize:28,fontWeight:700,marginTop:6}}>{formatted}</div>
        <div className='small'>₹499 / month (base INR)</div>
        <button className='btn' style={{marginTop:12}}>Subscribe</button>
      </div>
      <div className='small' style={{marginTop:12}}>Built by <strong>KryptonPath.com</strong><br/>Queries: <strong>business@kryptonpath.com</strong><br/>3 free trials included.</div>
    </div>
  );
}
