import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const DynamicContactForm = ({ visible, onClose, onSave, isEditing, initialData = null, categories = [] }) => {
  const defaultCategory = initialData?.category || (categories?.[0]?.id) || 'خریداران';

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [formData, setFormData] = useState(() => ({
    name: '',
    mobile: '',
    phone: '',
    description: '',
    category: defaultCategory,
    propertyType: '',
    budget: '',
    paymentMethod: 'نقد',
    cashDiscount: '',
    exchangeDetails: '',
    area: '',
    location: '',
    rooms: '',
    rentPrice: '',
    deposit: '',
    rentalPeriod: '',
    salary: '',
    workHours: '',
    expertise: '',
    ...initialData
  }));

  // Prevent duplicate submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setActiveCategory(initialData.category || defaultCategory);
    } else if (visible) {
      // reset form for new contact
      setFormData(prev => ({ ...prev, name: '', mobile: '', phone: '', description: '', category: defaultCategory }));
      setActiveCategory(defaultCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, visible]);

  if (!visible) return null;

  const categoryFields = {
    'خریداران': [
      { key: 'propertyType', label: 'نوع ملک مورد نظر', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'تجاری'] },
      { key: 'area', label: 'متراژ مورد نظر (متر)', type: 'number' },
      { key: 'location', label: 'منطقه/محله مورد نظر', type: 'text' },
      { key: 'budget', label: 'بودجه (تومان)', type: 'number' },
      { key: 'paymentMethod', label: 'شرایط پرداخت', type: 'select', options: ['نقد', 'اقساط', 'تهاتر'] },
      { key: 'cashDiscount', label: 'تخفیف نقدی (%)', type: 'number' },
      { key: 'exchangeDetails', label: 'جزئیات تهاتر', type: 'textarea' },
      { key: 'rooms', label: 'تعداد خواب', type: 'number' },
    ],
    'فروشندگان': [
      { key: 'propertyType', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'تجاری'] },
      { key: 'area', label: 'متراژ (متر)', type: 'number' },
      { key: 'location', label: 'آدرس ملک', type: 'text' },
      { key: 'budget', label: 'قیمت پیشنهادی (تومان)', type: 'number' },
      { key: 'paymentMethod', label: 'شرایط فروش', type: 'select', options: ['نقد', 'اقساط', 'تهاتر'] },
    ],
    'موجرین': [
      { key: 'propertyType', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'تجاری'] },
      { key: 'area', label: 'متراژ (متر)', type: 'number' },
      { key: 'location', label: 'آدرس ملک', type: 'text' },
      { key: 'rentPrice', label: 'اجاره ماهانه (تومان)', type: 'number' },
      { key: 'deposit', label: 'ودیعه (تومان)', type: 'number' },
      { key: 'rentalPeriod', label: 'مدت اجاره', type: 'select', options: ['کوتاه مدت', 'بلند مدت'] },
    ],
    'مستاجرین': [
      { key: 'propertyType', label: 'نوع ملک مورد نظر', type: 'select', options: ['آپارتمان', 'ویلا', 'تجاری'] },
      { key: 'area', label: 'متراژ مورد نظر (متر)', type: 'number' },
      { key: 'location', label: 'منطقه مورد نظر', type: 'text' },
      { key: 'rentPrice', label: 'حداکثر اجاره (تومان)', type: 'number' },
      { key: 'deposit', label: 'حداکثر ودیعه (تومان)', type: 'number' },
      { key: 'rentalPeriod', label: 'مدت اجاره', type: 'select', options: ['کوتاه مدت', 'بلند مدت'] },
    ],
    'نگهبانان': [
      { key: 'expertise', label: 'تخصص‌ها', type: 'text' },
      { key: 'workHours', label: 'ساعات کاری', type: 'select', options: ['روزکاری', 'شبکاری', '۲۴ ساعته'] },
      { key: 'salary', label: 'حقوق درخواستی (تومان)', type: 'number' },
    ],
    'متفرقه': [
      { key: 'expertise', label: 'تخصص/نوع خدمات', type: 'text' },
    ]
  };

  const handleInputChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const renderField = (field) => {
    if (field.condition === false) return null;
    const value = formData[field.key] || '';

    if (field.type === 'text' || field.type === 'number') {
      return (
        <input
          key={field.key}
          className={styles.textInput}
          value={value}
          onChange={(e) => handleInputChange(field.key, field.type === 'number' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value)}
          placeholder={field.label}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          key={field.key}
          className={styles.textInput}
          style={{ height: 80 }}
          value={value}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          placeholder={field.label}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.key} className={styles.selectContainer}>
          <div className={styles.selectLabel}>{field.label}</div>
          <div className={styles.selectOptions}>
            {field.options.map(option => (
              <button
                key={option}
                type="button"
                className={`${styles.selectOption} ${value === option ? styles.selectOptionActive : ''}`}
                onClick={() => handleInputChange(field.key, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const handleSave = async () => {
    if (isSubmitting) return; // prevent double submissions

    if (!formData.name?.trim() && !formData.mobile?.trim()) {
      if (typeof window !== 'undefined') window.alert('لطفا حداقل نام یا شماره موبایل را وارد کنید');
      return;
    }

    const payload = {
      ...formData,
      category: activeCategory,
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      id: initialData?.id || Date.now().toString(),
    };

    try {
      setIsSubmitting(true);
      // Support both sync and async onSave handlers
      await Promise.resolve(onSave(payload));
    } catch (err) {
      console.error('Error in onSave:', err);
    } finally {
      // Keep disabled state cleared so user can retry if parent doesn't close the modal
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.formTitle}>{isEditing ? 'ویرایش مخاطب' : 'افزودن مخاطب جدید'}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22 }}>×</button>
        </div>

        <div>
          <div className={styles.categorySection}>
            <div className={styles.sectionLabel}>دسته‌بندی</div>
            <div className={styles.categoryScroll}>
              {categories.map(category => (
                <button key={category.id} type="button" className={styles.categoryButton} style={{ backgroundColor: activeCategory === category.id ? category.color : '#f0e6d2' }} onClick={() => { setActiveCategory(category.id); handleInputChange('category', category.id); }}>{category.name}</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>اطلاعات پایه</div>
            <input className={styles.textInput} value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="نام و نام خانوادگی" />
            <input className={styles.textInput} value={formData.mobile} onChange={(e) => handleInputChange('mobile', e.target.value.replace(/[^0-9]/g, ''))} placeholder="شماره موبایل *" />
            <input className={styles.textInput} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))} placeholder="تلفن ثابت" />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>اطلاعات {activeCategory}</div>
            {categoryFields[activeCategory]?.map(renderField)}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>توضیحات تکمیلی</div>
            <textarea className={styles.textInput} style={{ height: 80 }} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="توضیحات اضافی" />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={onClose} disabled={isSubmitting}>انصراف</button>
          <button type="button" className={`${styles.actionButton} ${styles.addButton}`} onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? 'در حال بروزرسانی...' : 'در حال افزودن...') : (isEditing ? 'بروزرسانی' : 'افزودن')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicContactForm;