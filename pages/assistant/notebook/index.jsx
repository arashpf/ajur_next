import React, { useState, useEffect } from "react";
import {
  IoSettingsOutline,
  IoSearch,
  IoClose,
  IoCloudOffline,
} from "react-icons/io5";
import NoHeaderLayout from "../../../components/layouts/noHeaderLayout";
import MuiSnackbarProvider from "../../../components/MuiSnackbarProvider";
import { useRouter } from "next/router";

const AsyncStorage = {
  getItem: async (k) =>
    typeof window !== "undefined" ? localStorage.getItem(k) : null,
  setItem: async (k, v) =>
    typeof window !== "undefined" ? localStorage.setItem(k, v) : null,
  removeItem: async (k) =>
    typeof window !== "undefined" ? localStorage.removeItem(k) : null,
};

const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("id_token");
  }
  return null;
};

// Web helpers and shims for previously React Native APIs
const showAlert = (title, message, opts = {}) => {
  const text = title + (message ? "\n" + message : "");
  if (
    typeof window !== "undefined" &&
    typeof window.__showSnackbar === "function"
  ) {
    // map opts.severity if provided, otherwise use 'info' or 'error' heuristics
    const severity =
      opts.severity ||
      (title && title.toLowerCase().includes("خطا")
        ? "error"
        : title && title.toLowerCase().includes("هشدار")
        ? "warning"
        : "success");
    window.__showSnackbar(text, { severity, duration: opts.duration || 4000 });
  } else if (typeof window !== "undefined") {
    window.alert(text);
  } else {
    console.log("[ALERT]", title, message);
  }
};

const openURL = async (url) => {
  // Return a boolean-like promise so callers using .then(...) work both on web
  // and native-like shims. window.open returns a Window object or null if
  // blocked; use that to determine success when available.
  if (typeof window !== "undefined") {
    try {
      const opened = window.open(url, "_blank");
      // Some browsers block popups and return null
      return Promise.resolve(!!opened);
    } catch (e) {
      console.log("Unable to open URL:", url, e);
      return Promise.resolve(false);
    }
  } else {
    // Non-browser environment (server) — just log and report failure
    console.log("openURL:", url);
    return Promise.resolve(false);
  }
};

const openSettings = () => {
  // No direct equivalent on web; inform the user
  showAlert(
    "راهنما",
    "برای مدیریت دسترسی‌ها، از تنظیمات سیستم یا مرورگر استفاده کنید"
  );
};

// Provide a lightweight Alert and Linking shim so existing call sites keep working
const Alert = { alert: (t, m) => showAlert(t, m) };
const Linking = { openURL, openSettings, canOpenURL: async (u) => true };

// Contacts are not available on web; provide graceful no-op implementations
const Contacts = {
  requestPermission: async () => "denied",
  addContact: async () => {
    throw new Error("Contacts not supported on web");
  },
};

// Detect desktop vs mobile. Returns true for desktop-like devices.
const isDesktop = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // common mobile indicators
  const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i;
  return !mobileRegex.test(ua);
};

// Import services
import ApiService from "./services/apiService";
import Cookies from "js-cookie";

// Import components
import IntroSlider from "../../../components/common/IntroSlider/IntroSlider";
import CategoryTabs from "./parts/CategoryTabs";
import ContactCard from "./parts/ContactCard";
import EmptyState from "./parts/EmptyState";
import DynamicContactForm from "./parts/DynamicContactForm";
import SingleContactModal from "./parts/SingleContactModal";
import AboutModal from "./parts/AboutModal";
import SaveToPhoneModal from "./parts/SaveToPhoneModal";

const NoteBook = () => {
  const [showIntroSlider, setShowIntroSlider] = useState(false);
  const [activeCategory, setActiveCategory] = useState("همه");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSavePhoneModal, setShowSavePhoneModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContactData, setNewContactData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [previousCategory, setPreviousCategory] = useState("همه");
  const [validatingToken, isValidatingToken] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Error handling should be in useEffect, not in render
    if (typeof window !== "undefined") {
      const handleError = (event) => {
        if (event.error?.message?.includes("swiper")) {
          event.preventDefault();
          console.warn("Swiper error suppressed:", event.error);
        }
      };

      window.addEventListener("error", handleError);

      return () => {
        window.removeEventListener("error", handleError);
      };
    }
  }, []);

  const introSlides = [
    {
      id: 1,
      title: "دفترچه تلفن اختصاصی املاک ",
      description: "راهکاری متفاوت و هوشمندانه برای مدیریت مشتریان املاک",
      lottieSource: require("./assets/lottie/one.json"),
      color: "#4CAF50",
    },
    {
      id: 2,
      title: "دفترچه تلفنی هوشمند",
      description: "یادآوری پیگیری مشتریان به صورت هوشمند",
      lottieSource: require("./assets/lottie/two.json"),
      color: "#2196F3",
    },
    {
      id: 3,
      title: "دیگه نگران پاک شدن شماره مشتری هات نباش",
      description:
        "دسترسی یکپارچه از روی وب و اپ ، روی هر دستگاهی ، حتی اگه موبایلتو گم کنی !",
      lottieSource: require("./assets/lottie/three.json"),
      color: "#FF9800",
    },
    {
      id: 4,
      title: "جستجو هوشمندانه ",
      description: "جستجو روی نام ، توضیحات شماره و غیره",
      lottieSource: require("./assets/lottie/four.json"),
      color: "#9C27B0",
    },
  ];

  const categories = [
    { id: "همه", name: "همه", color: "#607D8B" },
    { id: "خریداران", name: "خریداران", color: "#4CAF50" },
    { id: "فروشندگان", name: "فروشندگان", color: "#2196F3" },
    { id: "موجرین", name: "موجرین", color: "#FF9800" },
    { id: "مستاجرین", name: "مستاجرین", color: "#9C27B0" },
    { id: "نگهبانان", name: "نگهبانان", color: "#009688" },
    { id: "متفرقه", name: "متفرقه", color: "#795548" },
  ];

  useEffect(() => {
    const initializeApp = async () => {
      await checkFirstTimeVisit();
      await loadToken();
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (userToken) {
      loadContacts();
    }
  }, [userToken]);

  const loadToken = async () => {
    try {
      // prefer localStorage but fall back to cookies for tokens set by other pages
      let token = await AsyncStorage.getItem("id_token");
      if (!token && typeof window !== "undefined") {
        token = Cookies.get("id_token") || null;
      }
      console.log("Token loaded:", !!token);
      setUserToken(token);

      if (!token) {
        // Redirect to login when no token is found
        const currentPath =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/panel/notebook";
        router.replace(
          `/panel/auth/login?next=${encodeURIComponent(currentPath)}`
        );
        return;
      }
    } catch (error) {
      console.error("Error loading token:", error);
      setHasError(true);

      // Also redirect on error
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/panel/notebook";
      router.replace(
        `/panel/auth/login?next=${encodeURIComponent(currentPath)}`
      );
    }
  };

  const checkFirstTimeVisit = async () => {
    try {
      const hasSeenIntro = await AsyncStorage.getItem("hasSeenFileBankIntro");
      if (hasSeenIntro === null) {
        setShowIntroSlider(true);
      }
    } catch (error) {
      console.error("Error checking intro status:", error);
    }
  };

  const loadContacts = async () => {
    setRefreshing(false);
    if (!userToken) {
      console.log("No token available, skipping contacts load");
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);

      console.log("Loading contacts from API with token...");
      const response = await ApiService.getContacts();

      if (response.data && Array.isArray(response.data)) {
        setNotes(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setNotes(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setNotes([]);
        setHasError(true);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      setHasError(true);

      if (error.response?.status === 401) {
        // Token is invalid, redirect to login
        Alert.alert("خطا", "توکن نامعتبر است. لطفا مجدداً وارد شوید");
        await AsyncStorage.removeItem("id_token");
        setUserToken(null);

        const currentPath =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/panel/notebook";
        router.replace(
          `/panel/auth/login?next=${encodeURIComponent(currentPath)}`
        );
      } else if (error.code === "NETWORK_ERROR") {
        Alert.alert("خطا", "اتصال اینترنت برقرار نیست");
      } else {
        Alert.alert("خطا", "در دریافت مخاطبین مشکلی پیش آمده است");
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  const handleSearch = () => {
    setPreviousCategory(activeCategory);
    setActiveCategory("همه");
    setIsSearching(true);
  };

  const handleSearchCancel = () => {
    setIsSearching(false);
    setSearchQuery("");
    setActiveCategory(previousCategory);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Improved duplicate check - better handling for editing
  const isDuplicateContact = (name, mobile, excludeId = null) => {
    if (!name.trim() && !mobile.trim()) return false;

    return notes.some((note) => {
      // Skip the contact we're editing
      if (excludeId && note.id === excludeId) return false;

      const nameMatch =
        name &&
        note.name &&
        note.name.trim().toLowerCase() === name.trim().toLowerCase();

      const mobileMatch = mobile && note.mobile && note.mobile === mobile;

      return nameMatch || mobileMatch;
    });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      activeCategory === "همه" || note.category === activeCategory;

    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase();
    const searchableFields = [
      note.name || "",
      note.mobile || "",
      note.phone || "",
      note.description || "",
      note.category || "",
    ];

    return (
      matchesCategory &&
      searchableFields.some((field) => field.toLowerCase().includes(query))
    );
  });

  // Reset form when opening for new contact
  const handleAddButtonPress = () => {
    setSelectedNote(null); // Clear any previous selection
    setNewContactData(null); // Clear any pending contact data
    setShowAddModal(true);
  };

  const handleAddNote = async (data) => {
    if (!userToken) {
      Alert.alert("خطا", "لطفا ابتدا وارد شوید");
      return;
    }

    if (!data.name.trim() && !data.mobile.trim()) {
      Alert.alert("خطا", "لطفا حداقل نام یا شماره موبایل را وارد کنید");
      return;
    }

    // For NEW contacts only: Check for duplicates
    if (!selectedNote && isDuplicateContact(data.name, data.mobile)) {
      Alert.alert("خطا", "مخاطبی با این نام یا شماره موبایل از قبل وجود دارد");
      return;
    }

    // For EDITING: Check for duplicates but exclude the current contact
    if (
      selectedNote &&
      isDuplicateContact(data.name, data.mobile, selectedNote.id)
    ) {
      Alert.alert("خطا", "مخاطبی با این نام یا شماره موبایل از قبل وجود دارد");
      return;
    }

    try {
      const contactData = {
        ...data,
        date: new Date().toLocaleDateString("fa-IR"),
        time: new Date().toLocaleTimeString("fa-IR"),
        category: data.category || activeCategory,
      };

      // If editing existing contact
      if (selectedNote) {
        await handleUpdateNote(contactData);
        return;
      }

      // If adding new contact
      setNewContactData(contactData);

      // If we're on desktop, skip asking to save to phone and save only to server
      if (isDesktop()) {
        const saved = await saveContactToAPI(contactData);
        if (saved) {
          Alert.alert("موفقیت", "مخاطب با موفقیت در سرور ذخیره شد");
        }
        // close add modal and cleanup
        setNewContactData(null);
        setShowAddModal(false);
        return;
      }

      // On mobile, ask whether to save to phone as well
      setShowSavePhoneModal(true);
    } catch (error) {
      console.error("Error preparing contact:", error);
      Alert.alert("خطا", "آماده‌سازی مخاطب با مشکل مواجه شد");
    }
  };

  const saveContactToAPI = async (contactData) => {
    try {
      console.log("Saving contact to API with token:", userToken);
      const response = await ApiService.createContact(contactData);

      let savedContact;
      if (response.data && response.data.id) {
        savedContact = response.data;
      } else if (response.data && response.data.data && response.data.data.id) {
        savedContact = response.data.data;
      } else {
        savedContact = { ...contactData, id: Date.now().toString() };
      }

      setNotes((prev) => [savedContact, ...prev]);
      return true;
    } catch (error) {
      console.error("Error saving contact to API:", error);

      const offlineContact = {
        ...contactData,
        id: `offline-${Date.now()}`,
        offline: true,
      };
      setNotes((prev) => [offlineContact, ...prev]);

      Alert.alert(
        "هشدار",
        "مخاطب به صورت موقت ذخیره شد. بعداً همگام‌سازی خواهد شد"
      );
      return false;
    }
  };

  const updateContactInAPI = async (contactId, contactData) => {
    try {
      console.log("Updating contact in API:", contactId);
      const response = await ApiService.updateContact(contactId, contactData);

      let updatedContact;
      if (response.data && response.data.id) {
        updatedContact = response.data;
      } else if (response.data && response.data.data && response.data.data.id) {
        updatedContact = response.data.data;
      } else {
        updatedContact = { ...contactData, id: contactId };
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === contactId ? updatedContact : note))
      );

      return true;
    } catch (error) {
      console.error("Error updating contact in API:", error);
      Alert.alert("خطا", "بروزرسانی مخاطب با مشکل مواجه شد");
      return false;
    }
  };

  // Improved phone contact saving with better error handling
  const saveToPhoneContacts = async (contact) => {
    try {
      // Check if we have at least one phone number
      if (!contact.mobile && !contact.phone) {
        Alert.alert("خطا", "شماره تلفنی برای ذخیره وجود ندارد");
        return false;
      }

      // Request permission
      const permission = await Contacts.requestPermission();

      if (permission === "authorized") {
        const newContact = {
          givenName: contact.name || "مخاطب جدید",
          familyName: "", // Optional: you can add family name if needed
          phoneNumbers: [],
        };

        // Add mobile number if exists
        if (contact.mobile) {
          newContact.phoneNumbers.push({
            label: "mobile",
            number: contact.mobile.replace(/\s/g, ""), // Remove spaces from number
          });
        }

        // Add phone number if exists
        if (contact.phone) {
          newContact.phoneNumbers.push({
            label: "home",
            number: contact.phone.replace(/\s/g, ""), // Remove spaces from number
          });
        }

        // Add note/description if exists
        if (contact.description) {
          newContact.note = contact.description;
        }

        // Save contact to phone
        await Contacts.addContact(newContact);

        Alert.alert("موفقیت", "مخاطب با موفقیت در گوشی ذخیره شد");
        return true;
      } else if (permission === "denied") {
        // Handle denied permission with better guidance
        Alert.alert(
          "مجوز دسترسی",
          "برای ذخیره مخاطب در گوشی، نیاز به مجوز دسترسی به مخاطبین دارید. لطفاً از طریق تنظیمات برنامه، مجوز دسترسی را فعال کنید.",
          [
            { text: "بعداً", style: "cancel" },
            {
              text: "تنظیمات",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return false;
      } else {
        // User didn't grant permission
        Alert.alert("مجوز نیاز است", "ذخیره مخاطب در گوشی نیاز به مجوز دارد");
        return false;
      }
    } catch (error) {
      console.error("Error saving to phone contacts:", error);

      // More specific error messages
      if (error.message?.includes("permission")) {
        Alert.alert("خطای دسترسی", "مجوز دسترسی به مخاطبین داده نشده است");
      } else if (error.message?.includes("exists")) {
        Alert.alert("تکراری", "این مخاطب از قبل در گوشی شما وجود دارد");
      } else {
        Alert.alert("خطا", "ذخیره مخاطب در گوشی با مشکل مواجه شد");
      }

      return false;
    }
  };

  const handleSaveToPhone = async () => {
    if (!newContactData) return;

    try {
      // First save to API
      const apiSuccess = await saveContactToAPI(newContactData);

      if (apiSuccess) {
        // Then try to save to phone
        const phoneSuccess = await saveToPhoneContacts(newContactData);

        if (!phoneSuccess) {
          // If phone save fails, still show success for API save
          Alert.alert("موفقیت", "مخاطب در سرور ذخیره شد اما در گوشی ذخیره نشد");
        }
      }
    } catch (error) {
      console.error("Error in save process:", error);
      Alert.alert("خطا", "ذخیره مخاطب با مشکل مواجه شد");
    } finally {
      setShowSavePhoneModal(false);
      setNewContactData(null);
      setShowAddModal(false);
    }
  };

  const handleSkipSaveToPhone = async () => {
    if (!newContactData) return;

    try {
      // Only save to API, not to phone
      await saveContactToAPI(newContactData);
      Alert.alert("موفقیت", "مخاطب با موفقیت در سرور ذخیره شد");
    } catch (error) {
      console.error("Error saving to API:", error);
      Alert.alert("خطا", "ذخیره مخاطب با مشکل مواجه شد");
    } finally {
      setShowSavePhoneModal(false);
      setNewContactData(null);
      setShowAddModal(false);
    }
  };

  const handleCancelSave = () => {
    setShowSavePhoneModal(false);
    setNewContactData(null);
    Alert.alert("انصراف", "افزودن مخاطب لغو شد");
  };

  const handleDeleteNote = async (id) => {
    try {
      if (!userToken) {
        Alert.alert("خطا", "لطفا ابتدا وارد شوید");
        return;
      }

      console.log("Deleting contact ID:", id);

      const response = await ApiService.deleteContact(id);
      console.log("Delete response:", response?.data);

      const data = response?.data || {};

      // Support a few possible response shapes
      const success =
        data.success === true || data.status === "success" || data?.deleted;

      if (success) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(null);
          setShowContactModal(false);
        }

        if (selectedNote && selectedNote.id === id) {
          setSelectedNote(null);
          setShowAddModal(false);
        }

        Alert.alert("موفقیت", data.message || "مخاطب با موفقیت حذف شد");
      } else {
        console.warn("Delete failed:", data);
        Alert.alert("خطا", data.message || "حذف مخاطب با مشکل مواجه شد");
      }
    } catch (error) {
      console.error("Delete error:", error);

      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        "حذف مخاطب با مشکل مواجه شد";
      if (
        error?.code === "ECONNABORTED" ||
        error?.message?.includes("timeout")
      ) {
        Alert.alert(
          "خطا",
          "درخواست حذف با زمان‌بندی خاتمه یافت. دوباره تلاش کنید"
        );
      } else if (error?.message?.toLowerCase?.().includes("network")) {
        Alert.alert("خطا", "اتصال اینترنت برقرار نیست");
      } else {
        Alert.alert("خطا", serverMsg);
      }
    }
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowAddModal(true);
  };

  const handleUpdateNote = async (data) => {
    if (!selectedNote) return;

    if (!data.name.trim() && !data.mobile.trim()) {
      Alert.alert("خطا", "لطفا حداقل نام یا شماره موبایل را وارد کنید");
      return;
    }

    try {
      const updatedData = {
        ...data,
        date: new Date().toLocaleDateString("fa-IR"),
        time: new Date().toLocaleTimeString("fa-IR"),
      };

      await updateContactInAPI(selectedNote.id, updatedData);

      setSelectedNote(null);
      setShowAddModal(false);
      Alert.alert("موفقیت", "مخاطب با موفقیت بروزرسانی شد");
    } catch (error) {
      console.error("Error updating contact:", error);
      Alert.alert("خطا", "بروزرسانی مخاطب با مشکل مواجه شد");
    }
  };

  const callNumber = (number) => {
    if (!number) return;

    // Just open a tel: link
    window.location.href = `tel:${number}`;
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (isSearching && category !== "همه") {
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  const renderHeader = () => {
    if (isSearching) {
      return (
        <div style={styles.searchHeader}>
          <input
            style={styles.searchInput}
            placeholder="جستجو در همه مخاطبین..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            autoFocus
          />
          <button
            onClick={handleSearchCancel}
            style={{ background: "transparent", border: "none" }}
          >
            <IoClose />
          </button>
        </div>
      );
    }

    return (
      <div style={styles.header}>
        <button
          onClick={() => setShowAboutModal(true)}
          style={{ background: "transparent", border: "none" }}
        >
          <IoSettingsOutline />
        </button>
        <div style={styles.headerTitle}>دفترچه تلفن</div>
        <button
          onClick={handleSearch}
          disabled={!userToken}
          style={{ background: "transparent", border: "none" }}
        >
          <IoSearch color={userToken ? "#5d4037" : "#ccc"} />
        </button>
      </div>
    );
  };

  return (
    <MuiSnackbarProvider>
      <div style={styles.container}>
        <IntroSlider
          visible={showIntroSlider}
          onClose={() => setShowIntroSlider(false)}
          slides={introSlides}
        />

        {renderHeader()}

        <div style={styles.notebookContainer}>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {isLoading && !refreshing ? (
            <div style={styles.centerContainer}>
              <div style={{ fontSize: 24 }}>⏳</div>
              <div style={styles.loadingText}>در حال بارگذاری مخاطبین...</div>
            </div>
          ) : hasError ? (
            <div style={styles.centerContainer}>
              <IoCloudOffline size={64} color="#f44336" />
              <div style={styles.errorText}>
                {userToken ? "خطا در دریافت مخاطبین" : "لطفا ابتدا وارد شوید"}
              </div>
              <button style={styles.retryButton} onClick={loadContacts}>
                <span style={styles.retryButtonText}>تلاش مجدد</span>
              </button>
            </div>
          ) : (
            <div style={styles.notesList}>
              {filteredNotes.map((note) => (
                <ContactCard
                  key={note.id}
                  note={note}
                  categories={categories}
                  onEdit={handleEditNote}
                  onSaveToContacts={() => saveToPhoneContacts(note)}
                  onDelete={handleDeleteNote}
                  onCall={callNumber}
                  onViewDetails={handleViewDetails}
                />
              ))}
              {filteredNotes.length === 0 && !hasError && (
                <EmptyState
                  isSearching={!!searchQuery.trim()}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          )}
        </div>

        {/* Add FAB */}
        <button
          style={{
            ...(styles.addFab || {}),
            ...(!userToken ? styles.disabledFab : {}),
          }}
          onClick={handleAddButtonPress}
          disabled={!userToken}
        >
          <span style={styles.fabIcon}>＋</span>
        </button>

        {/* Dynamic Contact Form Modal */}
        {/* <DynamicContactForm
        visible={showAddModal}
        onClose={() => {
          setSelectedNote(null); // Clear selection when closing
          setShowAddModal(false);
        }}
        onSave={handleAddNote}
        isEditing={!!selectedNote}
        initialData={selectedNote} // Will be null for new contacts
        categories={categories.filter(cat => cat.id !== 'همه')}
      /> */}

        <DynamicContactForm
          visible={showAddModal}
          onClose={() => {
            setSelectedNote(null);
            setShowAddModal(false);
          }}
          onSave={handleAddNote}
          isEditing={!!selectedNote}
          initialData={selectedNote} // This will be null for new contacts
          categories={categories.filter((cat) => cat.id !== "همه")}
          key={selectedNote ? `edit-${selectedNote.id}` : "add-new"} // Add this line to force re-render
        />

        {/* Single Contact Modal */}
        <SingleContactModal
          visible={showContactModal}
          contact={selectedContact}
          onClose={() => setShowContactModal(false)}
          onCall={callNumber}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
        />

        {/* About Modal */}
        <AboutModal
          visible={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />

        {/* Save to Phone Modal - Only show for new contacts */}
        <SaveToPhoneModal
          visible={showSavePhoneModal && !selectedNote}
          contact={newContactData}
          onSave={handleSaveToPhone}
          onSkip={handleSkipSaveToPhone}
          onCancel={handleCancelSave}
        />
      </div>
    </MuiSnackbarProvider>
  );
};
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#085283ff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #d7ccc8",
    backgroundColor: "white",
  },
  searchHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #d7ccc8",
    backgroundColor: "white",
  },
  searchInput: {
    flex: 1,
    marginRight: "12px",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    textAlign: "right",
    border: "none",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#5d4037",
  },
  notebookContainer: {
    minHeight: "60vh",
    backgroundColor: "#085283ff",
    padding: "12px",
  },
  notesList: {
    padding: "0 12px",
    paddingBottom: "100px", // extra space for bottom navbar / FAB
  },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  loadingText: {
    marginTop: "12px",
    fontSize: "16px",
    color: "#5d4037",
  },
  errorText: {
    fontSize: "18px",
    color: "#f44336",
    marginTop: "16px",
    marginBottom: "20px",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  },
  addFab: {
    position: "fixed",
    bottom: "85px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    backgroundColor: "#4CAF50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    border: "none",
    cursor: "pointer",
  },
  disabledFab: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  fabIcon: {
    fontSize: "30px",
    color: "white",
    fontWeight: "bold",
  },
};

export default NoteBook;

NoteBook.getLayout = function (page) {
  return <NoHeaderLayout>{page}</NoHeaderLayout>;
};
