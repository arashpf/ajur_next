// parts/EmptyState.js
import React from 'react';
import { IoSearchOutline, IoPeopleOutline } from 'react-icons/io5';

const EmptyState = ({ isSearching = false, searchQuery = '' }) => {
  return (
    <div style={styles.container}>
      {isSearching ? <IoSearchOutline size={64} color="#9e9e9e" /> : <IoPeopleOutline size={64} color="#9e9e9e" />}
      <div style={styles.title}>
        {isSearching ? 'نتیجه‌ای یافت نشد' : 'هیچ مخاطبی وجود ندارد'}
      </div>
      <div style={styles.description}>
        {isSearching 
          ? `هیچ مخاطبی برای "${searchQuery}" یافت نشد`
          : 'برای شروع، مخاطب جدیدی اضافه کنید'
        }
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: '20px',
  },
};

export default EmptyState;