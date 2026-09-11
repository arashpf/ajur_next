import React from 'react';
import { IoCloseOutline, IoTrashOutline, IoCallOutline, IoCreateOutline,
  IoBusinessOutline, IoExpandOutline, IoLocationOutline, IoCashOutline,
  IoCardOutline, IoPricetagOutline, IoHomeOutline, IoWalletOutline, IoHammerOutline
} from 'react-icons/io5';
import styles from './styles.module.css';

const SingleContactModal = ({ 
  visible, 
  contact, 
  onClose, 
  onCall, 
  onEdit, 
  onDelete  // Add this prop
}) => {
  if (!contact) return null;

  const categoryColor = contact.category === 'خریداران' ? '#4CAF50' : 
                        contact.category === 'فروشندگان' ? '#2196F3' : 
                        contact.category === 'موجرین' ? '#FF9800' : 
                        contact.category === 'مستاجرین' ? '#9C27B0' : 
                        contact.category === 'نگهبانان' ? '#009688' : '#795548';

  const handleDelete = (contact) => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(`آیا از حذف مخاطب "${contact.name || 'بدون نام'}" اطمینان دارید؟`);
      if (ok) {
        onDelete(contact.id);
        onClose();
      }
    }
  };

  const iconMap = {
    'call-outline': IoCallOutline,
    'business-outline': IoBusinessOutline,
    'expand-outline': IoExpandOutline,
    'location-outline': IoLocationOutline,
    'cash-outline': IoCashOutline,
    'card-outline': IoCardOutline,
    'pricetag-outline': IoPricetagOutline,
    'home-outline': IoHomeOutline,
    'wallet-outline': IoWalletOutline,
    'hammer-outline': IoHammerOutline,
  };

  const renderDetailRow = (icon, label, value) => {
    if (!value) return null;
    const IconComponent = iconMap[icon] || IoCallOutline;

    return (
      <div className={styles.detailRow}>
        <IconComponent size={20} color="#5d4037" />
        <div className={styles.detailContent}>
          <div className={styles.detailLabel}>{label}</div>
          <div className={styles.detailValue}>{value}</div>
        </div>
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div className={styles.singleContactOverlay}>
      <div className={styles.singleContactContent}>
        <div className={styles.singleContactHeader}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none' }}><IoCloseOutline size={20} /></button>
          <div className={styles.singleContactTitle}>جزئیات مخاطب</div>
          <button onClick={() => handleDelete(contact)} style={{ background: 'transparent', border: 'none' }}><IoTrashOutline size={20} color="#f44336"/></button>
        </div>

        <div className={styles.singleContactScroll}>
          <div style={{ backgroundColor: categoryColor }} className={styles.contactCategory}>
            <div className={styles.contactCategoryText}>{contact.category}</div>
          </div>

          <div className={styles.contactNameSection}>
            <div className={styles.contactNameLarge}>{contact.name || 'بدون نام'}</div>
          </div>

          <div className={styles.contactDetails}>
            {renderDetailRow('call-outline', 'موبایل', contact.mobile)}
            {renderDetailRow('call-outline', 'تلفن', contact.phone)}
            {contact.propertyType && renderDetailRow('business-outline', 'نوع ملک', contact.propertyType)}
            {contact.area && renderDetailRow('expand-outline', 'متراژ', `${contact.area} متر`)}
            {contact.location && renderDetailRow('location-outline', 'موقعیت', contact.location)}
            {contact.budget && renderDetailRow('cash-outline', 'بودجه', `${contact.budget} تومان`)}
            {contact.paymentMethod && renderDetailRow('card-outline', 'نوع پرداخت', contact.paymentMethod)}
            {contact.cashDiscount && renderDetailRow('pricetag-outline', 'تخفیف نقدی', `${contact.cashDiscount}%`)}
            {contact.rentPrice && renderDetailRow('home-outline', 'اجاره', `${contact.rentPrice} تومان`)}
            {contact.deposit && renderDetailRow('wallet-outline', 'ودیعه', `${contact.deposit} تومان`)}
            {contact.salary && renderDetailRow('cash-outline', 'حقوق', `${contact.salary} تومان`)}
            {contact.expertise && renderDetailRow('hammer-outline', 'تخصص', contact.expertise)}
          </div>

          {contact.description && (
            <div className={styles.descriptionSection}>
              <div className={styles.sectionLabel}>توضیحات</div>
              <div className={styles.descriptionText}>{contact.description}</div>
            </div>
          )}

          <div className={styles.timeInfo}>
            <div className={styles.timeText}>ایجاد شده در: {contact.date} - {contact.time}</div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {(contact.mobile || contact.phone) && (
            <button className={styles.callButtonLarge} onClick={() => onCall(contact.mobile || contact.phone)}>
              <IoCallOutline size={18} color="white" />
              <span className={styles.callButtonText}>تماس</span>
            </button>
          )}

          <button className={styles.editButton} onClick={() => { onClose(); onEdit(contact); }}>
            <IoCreateOutline size={16} />
            <span className={styles.editButtonText}>ویرایش</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleContactModal;