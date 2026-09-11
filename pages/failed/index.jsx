import Link from 'next/link'

export default function Failed() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fef2f2'}}>
      <div style={{background:'#fff',padding:40,borderRadius:12,boxShadow:'0 10px 25px rgba(0,0,0,0.1)',textAlign:'center',maxWidth:420}}>
        
        <div style={{fontSize:50,color:'#dc2626'}}>✕</div>

        <h1 style={{color:'#b91c1c',marginTop:10}}>
          پرداخت ناموفق بود
        </h1>

        <p style={{color:'#555',marginTop:10}}>
          پرداخت انجام نشد. لطفاً دوباره تلاش کنید.
        </p>

        <div style={{marginTop:25,backgroundColor:'lightgray'}}>
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </div>

      </div>
    </div>
  )
}
