"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Home,
  Heart,
  Sparkles,
  User,
  ChevronUp,
  Bell,
  Download,
  LifeBuoy,
  Building2,
  Megaphone,
  Archive,
  Users,
} from "lucide-react"
import styles from "../styles/AIOverlayComponent.module.css"

const AIOverlayComponent = () => {
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false)
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false)
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [overlayHeight, setOverlayHeight] = useState(0)
  const [activeNavButton, setActiveNavButton] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const overlayRef = useRef(null)

  const notifications = [
    {
      id: 1,
      title: "پیام جدید از مشتری",
      category: "پیام",
      count: 3,
      details: "احمد رضایی در مورد ملک شما سوال دارد",
      time: "5 دقیقه پیش",
    },
    {
      id: 2,
      title: "بازدید جدید از آگهی",
      category: "بازدید",
      count: 12,
      details: "آگهی آپارتمان تهران 12 بازدید جدید داشته",
      time: "10 دقیقه پیش",
    },
    {
      id: 3,
      title: "پیشنهاد قیمت جدید",
      category: "قیمت",
      count: 2,
      details: "2 پیشنهاد قیمت برای ملک شما ثبت شد",
      time: "1 ساعت پیش",
    },
    {
      id: 4,
      title: "تایید مدارک",
      category: "مدارک",
      count: 1,
      details: "مدارک شما تایید و آگهی منتشر شد",
      time: "2 ساعت پیش",
    },
  ]

  const totalNotificationCount = notifications.reduce((sum, notif) => sum + notif.count, 0)

  useEffect(() => {
    if (!isNotificationExpanded && isAIOverlayOpen) {
      const interval = setInterval(() => {
        setCurrentNotificationIndex((prev) => (prev + 1) % notifications.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isNotificationExpanded, isAIOverlayOpen, notifications.length])

  const handleDragStart = (e) => {
    setIsDragging(true)
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragStartY(clientY)
    if (overlayRef.current) {
      setOverlayHeight(overlayRef.current.offsetHeight)
    }
  }

  const handleDragMove = (e) => {
    if (!isDragging) return

    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - dragStartY

    if (deltaY > 0) {
      const newHeight = Math.max(0, overlayHeight - deltaY)
      if (overlayRef.current) {
        overlayRef.current.style.height = `${newHeight}px`
        overlayRef.current.style.opacity = `${newHeight / overlayHeight}`
      }
    }
  }

  const handleDragEnd = (e) => {
    if (!isDragging) return

    setIsDragging(false)
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    const deltaY = clientY - dragStartY

    if (deltaY > 100) {
      setIsAIOverlayOpen(false)
    }

    if (overlayRef.current) {
      overlayRef.current.style.height = ""
      overlayRef.current.style.opacity = ""
    }
  }

  const handleDragHandleClick = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsAIOverlayOpen(false)
      setIsClosing(false)
    }, 300)
  }

  const handleAIButtonClick = () => {
    if (isAIOverlayOpen) {
      setIsClosing(true)
      setTimeout(() => {
        setIsAIOverlayOpen(false)
        setIsClosing(false)
      }, 300)
    } else {
      setIsAIOverlayOpen(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e)
    const handleMouseUp = (e) => handleDragEnd(e)
    const handleTouchMove = (e) => handleDragMove(e)
    const handleTouchEnd = (e) => handleDragEnd(e)

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, dragStartY, overlayHeight])

  return (
    <div className={styles.container}>
      {isAIOverlayOpen && <div className={styles.backdrop} />}

      <div className={styles.navigationWrapper}>
        <div className={styles.navigationContainer}>
          <div
            className={`${styles.navigationBackground} ${isAIOverlayOpen ? styles.navigationBackgroundActive : ""}`}
          ></div>

          <div className={`${styles.navigationContent} ${isAIOverlayOpen ? styles.navigationContentActive : ""}`}>
            <button onClick={() => setActiveNavButton(0)} className={styles.navButton}>
              <Home className={styles.navIcon} />
            </button>

            <button onClick={() => setActiveNavButton(1)} className={styles.navButton}>
              <Heart className={styles.navIcon} />
            </button>

            <div className={styles.aiButtonWrapper}>
              <button
                onClick={handleAIButtonClick}
                className={`${styles.aiButton} ${isAIOverlayOpen ? styles.aiButtonActive : ""} ${isClosing ? styles.aiButtonClosing : ""}`}
              >
                <div className={styles.aiButtonBackground1}></div>
                <div className={styles.aiButtonBackground2}></div>
                <div className={styles.aiButtonBackground3}></div>
                <div className={styles.aiButtonBackground4}></div>
                <div className={styles.aiButtonBackground5}></div>
                <div className={styles.aiButtonBackground6}></div>
                <div className={styles.aiButtonBorder}></div>
                <Sparkles className={`${styles.aiButtonIcon} ${isAIOverlayOpen ? styles.aiButtonIconActive : ""}`} />
              </button>

              {totalNotificationCount > 0 && (
                <div className={styles.notificationBadge}>
                  <span className={styles.notificationText}>
                    {totalNotificationCount > 99 ? "99+" : totalNotificationCount}
                  </span>
                </div>
              )}

              {!isAIOverlayOpen && (
                <div className={styles.chevronUp}>
                  <ChevronUp className={styles.chevronIcon} />
                </div>
              )}
            </div>

            <button onClick={() => setActiveNavButton(2)} className={styles.navButton}>
              <Search className={styles.navIcon} />
            </button>

            <button onClick={() => setActiveNavButton(3)} className={styles.navButton}>
              <User className={styles.navIcon} />
            </button>
          </div>

          {isAIOverlayOpen && (
            <div
              ref={overlayRef}
              className={`${styles.overlay} ${isClosing ? styles.overlayClosing : styles.overlayOpen}`}
            >
              <div
                className={styles.dragHandle}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onClick={handleDragHandleClick}
              >
                <div className={styles.dragBar}></div>
              </div>

              <div className={styles.overlayContent}>
                <div className={styles.overlayScrollArea}>
                  <div
                    className={styles.notificationCard}
                    onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
                  >
                    {!isNotificationExpanded ? (
                      <div className={styles.notificationSummary}>
                        <div className={styles.notificationHeader}>
                          <Bell className={styles.bellIcon} />
                          <span className={styles.notificationTitle}>اعلانات</span>
                          <div className={styles.notificationCount}>{totalNotificationCount}</div>
                        </div>
                        <span className={styles.notificationPreview}>
                          {notifications[currentNotificationIndex].title}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.notificationExpanded}>
                        <div className={styles.notificationExpandedHeader}>
                          <div className={styles.notificationHeader}>
                            <Bell className={styles.bellIcon} />
                            <span className={styles.notificationTitle}>اعلانات</span>
                          </div>
                          <ChevronUp
                            className={`${styles.chevronIcon} ${isNotificationExpanded ? styles.chevronRotated : ""}`}
                          />
                        </div>
                        {notifications.map((notif) => (
                          <div key={notif.id} className={styles.notificationItem}>
                            <div className={styles.notificationItemHeader}>
                              <span className={styles.notificationItemTitle}>{notif.title}</span>
                              <span className={styles.notificationTime}>{notif.time}</span>
                            </div>
                            <p className={styles.notificationDetails}>{notif.details}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                      <div className={styles.featureIconGreen}>
                        <Building2 className={styles.featureIcon} />
                      </div>
                      <div className={styles.featureTitle}>آگهی‌های من</div>
                      <div className={styles.featureSubtitle}>مدیریت املاک</div>
                    </div>

                    <div className={styles.featureCard}>
                      <div className={styles.featureIconOrange}>
                        <Megaphone className={styles.featureIcon} />
                      </div>
                      <div className={styles.featureTitle}>بازاریابی هوشمند</div>
                      <div className={styles.featureSubtitle}>تبلیغات گوگل</div>
                    </div>

                    <div className={styles.featureCard}>
                      <div className={styles.featureIconPurple}>
                        <Archive className={styles.featureIcon} />
                      </div>
                      <div className={styles.featureTitle}>آرشیو هوشمند</div>
                      <div className={styles.featureSubtitle}>سازماندهی املاک</div>
                    </div>

                    <div className={styles.featureCard}>
                      <div className={styles.featureIconCyan}>
                        <Users className={styles.featureIcon} />
                      </div>
                      <div className={styles.featureTitle}>معرفی دوستان</div>
                      <div className={styles.featureSubtitle}>کسب درآمد</div>
                    </div>
                  </div>

                  <div className={styles.aiChatCard}>
                    <div className={styles.aiChatHeader}>
                      <div className={styles.aiChatIcon}>
                        <Sparkles className={styles.aiChatIconSparkles} />
                      </div>
                      <span className={styles.aiChatTitle}>گفتگو با هوش مصنوعی</span>
                    </div>
                    <div className={styles.aiChatGrid}>
                      <button className={styles.aiChatButton}>
                        <div className={styles.aiChatButtonTitle}>جستجو هوشمند</div>
                        <div className={styles.aiChatButtonSubtitle}>پیدا کردن بهترین املاک</div>
                      </button>
                      <button className={styles.aiChatButton}>
                        <div className={styles.aiChatButtonTitle}>مشاوره املاک</div>
                        <div className={styles.aiChatButtonSubtitle}>راهنمایی خرید و فروش</div>
                      </button>
                      <button className={styles.aiChatButton}>
                        <div className={styles.aiChatButtonTitle}>ارزیابی قیمت</div>
                        <div className={styles.aiChatButtonSubtitle}>تخمین قیمت ملک شما</div>
                      </button>
                      <button className={styles.aiChatButton}>
                        <div className={styles.aiChatButtonTitle}>تحلیل بازار</div>
                        <div className={styles.aiChatButtonSubtitle}>بررسی روند قیمت‌ها</div>
                      </button>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                      <Download className={styles.actionButtonIcon} />
                      <span className={styles.actionButtonText}>دانلود اپ</span>
                    </button>
                    <button className={styles.actionButton}>
                      <LifeBuoy className={styles.actionButtonIcon} />
                      <span className={styles.actionButtonText}>پشتیبانی</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIOverlayComponent
