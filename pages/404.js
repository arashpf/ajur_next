import React from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <Head>
        <title>صفحه پیدا نشد - 404</title>
        <meta name="description" content="صفحه مورد نظر یافت نشد" />
      </Head>

      <main className={styles.main}>
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h1>404 - صفحه مورد نظر پیدا نشد</h1>
          <p>متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
          <Link 
      href="/"
      style={{ 
        display: 'inline-block', 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '5px'
      }}
    >
      بازگشت به صفحه اصلی
    </Link>
          
        </div>
      </main>
    </div>
  );
}