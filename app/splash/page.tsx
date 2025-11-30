import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => { const t = setTimeout(()=>router.push('/login'), 1400); return ()=>clearTimeout(t); }, [router]);
  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <picture>
        <source srcSet='/splash-dark.png' media='(prefers-color-scheme: dark)' />
        <img src='/splash-light.png' width={320} alt='Splash' />
      </picture>
      <div className='small' style={{marginTop:12}}>Powered by KryptonPath.com</div>
    </div>
  );
}
