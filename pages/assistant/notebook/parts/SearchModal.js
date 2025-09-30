import React, { useState, useEffect, useRef } from "react";
import {
  IoClose,
  IoSearch,
  IoCloseCircle,
  IoSearchOutline,
  IoCallOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";
import styles from "./styles.module.css";

const SearchModal = ({ visible, onClose, notes = [], onCall, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (text) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length > 1) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        const results = notes.filter((note) => {
          const searchableText = `
            ${note.name || ""}
            ${note.mobile || ""}
            ${note.phone || ""}
            ${note.description || ""}
            ${note.category || ""}
          `.toLowerCase();

          return searchableText.includes(text.toLowerCase());
        });

        setSearchResults(results);
        setIsSearching(false);
      }, 1000);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Reset when closed
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case "خریداران":
        return "#4CAF50";
      case "فروشندگان":
        return "#2196F3";
      case "موجرین":
        return "#FF9800";
      case "مستاجرین":
        return "#9C27B0";
      case "نگهبانان":
        return "#009688";
      default:
        return "#795548";
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.searchModalOverlay}>
      <div className={styles.searchModalContent}>
        {/* Header */}
        <div className={styles.searchModalHeader}>
          <h3 className={styles.searchModalTitle}>جستجوی مخاطبین</h3>
          <button
            onClick={onClose}
            className={styles.iconButton}
            aria-label="بستن"
          >
            <IoClose size={24} color="#5d4037" />
          </button>
        </div>

        {/* Search Input */}
        <div className={styles.searchInputContainer}>
          <IoSearch size={20} color="#8d6e63" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجو بر اساس نام، شماره، توضیحات..."
            autoFocus
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setIsSearching(false);
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                  searchTimeoutRef.current = null;
                }
              }}
              className={styles.iconButton}
              aria-label="پاک کردن"
            >
              <IoCloseCircle size={20} color="#8d6e63" />
            </button>
          ) : null}
        </div>

        {/* Results */}
        <div className={styles.searchResultsContainer}>
          {isSearching ? (
            <div className={styles.searchLoading}>
              <div className={styles.spinner}></div>
              <span className={styles.searchLoadingText}>در حال جستجو...</span>
            </div>
          ) : searchQuery.length > 1 && searchResults.length === 0 ? (
            <div className={styles.searchEmpty}>
              <IoSearchOutline size={48} color="#d7ccc8" />
              <span className={styles.searchEmptyText}>نتیجه‌ای یافت نشد</span>
            </div>
          ) : (
            <div className={styles.scrollArea}>
              {searchResults.map((note) => (
                <div
                  key={note.id}
                  className={styles.searchResultItem}
                  onClick={() => {
                    onEdit(note);
                    onClose();
                  }}
                >
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultName}>
                      {note.name || "بدون نام"}
                    </div>
                    <div className={styles.searchResultDetails}>
                      {note.mobile && (
                        <button
                          className={styles.searchResultPhone}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCall(note.mobile);
                          }}
                        >
                          <IoPhonePortraitOutline size={14} color="#4CAF50" />
                          <span className={styles.searchResultText}>
                            {note.mobile}
                          </span>
                        </button>
                      )}
                      {note.phone && (
                        <button
                          className={styles.searchResultPhone}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCall(note.phone);
                          }}
                        >
                          <IoCallOutline size={14} color="#2196F3" />
                          <span className={styles.searchResultText}>
                            {note.phone}
                          </span>
                        </button>
                      )}
                    </div>
                    {note.description && (
                      <div className={styles.searchResultDescription}>
                        {note.description}
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.searchResultCategory}
                    style={{ backgroundColor: getCategoryColor(note.category) }}
                  >
                    {note.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
