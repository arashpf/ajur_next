import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Success() {
  const router = useRouter()
  const { refId } = router.query

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#ecfdf5'}}>
      <div style={{background:'#fff',padding:40,borderRadius:12,boxShadow:'0 10px 25px rgba(0,0,0,0.1)',textAlign:'center',maxWidth:420}}>
        
        <div style={{fontSize:50,color:'#16a34a'}}>✓</div>

        <h1 style={{color:'#15803d',marginTop:10}}>
          پرداخت با موفقیت انجام شد
        </h1>

        <p style={{color:'#555',marginTop:10}}>
          ارتقای آگهی شما با موفقیت ثبت شد.
        </p>

        {refId && (
          <div style={{marginTop:20,background:'#f3f4f6',padding:12,borderRadius:8}}>
            شماره پیگیری: <b>{refId}</b>
          </div>
        )}

        <div style={{marginTop:25}}>
          <p>09382740488</p> <p>پشتیبانی</p>
        </div>

        <div style={{marginTop:25, backgroundColor:'lightgreen'}}>
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </div>

      </div>
    </div>
  )
}
