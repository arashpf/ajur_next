import React, { useEffect, useState, useRef } from 'react';

export default function MagCards() {
  const PER_PAGE = 6;
  const PREVIEW_CHARS = 120;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [snackbar, setSnackbar] = useState({ show: false, message: '' });
  const loadingRef = useRef(false);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  // Snackbar timeout effect
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  useEffect(() => {
    loadPages(1, 1, false);

    function onScroll() {
      if (loadingRef.current || !hasMoreRef.current) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) {
        const next = pageRef.current + 1;
        loadPages(next, 2, true);
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function fetchPage(p) {
    try {
      // Include author data in the request
      const res = await fetch(`https://mag.ajur.app/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${p}&_embed=author`);
      if (!res.ok) return [];
      const data = await res.json();
      return data;
    } catch (e) {
      return [];
    }
  }

  async function loadPages(startPage, count = 1, scrollTriggered = false) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const pagesToLoad = [];
    for (let i = 0; i < count; i++) pagesToLoad.push(startPage + i);

    const prevScrollTop = typeof window !== 'undefined' ? window.scrollY : 0;

    let anyResults = false;
    const allNew = [];
    for (const p of pagesToLoad) {
      const data = await fetchPage(p);
      if (Array.isArray(data) && data.length > 0) {
        anyResults = true;
        const parsed = data.map(normalizePost);
        allNew.push(...parsed);
        setPage(p);
        pageRef.current = p;
      }
    }

    if (allNew.length > 0) {
      setPosts((s) => [...s, ...allNew]);

      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (Math.abs(window.scrollY - prevScrollTop) > 120) return;
            window.scrollTo({ top: prevScrollTop, behavior: 'auto' });
          });
        });
      }
    }

    if (!anyResults) {
      setHasMore(false);
      hasMoreRef.current = false;
    }

    setLoading(false);
    loadingRef.current = false;
  }

  function normalizePost(post) {
    const title = post?.title?.rendered || '';
    const link = post?.link || '#';
    const content = post?.content?.rendered || '';
    
    // Get author name from embedded data
    const authorName = post?._embedded?.author?.[0]?.name || 'نویسنده ناشناس';
    
    let desc = '';
    let img = null;
    try {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const p = doc.querySelector('p');
      desc = p ? p.textContent.trim() : '';
      const imgEl = doc.querySelector('img');
      if (imgEl) {
        img = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || null;
      }
    } catch (e) {
      // ignore
    }
    
    if (!desc && post?.excerpt?.rendered) {
      const exdoc = new DOMParser().parseFromString(post.excerpt.rendered, 'text/html');
      const p = exdoc.querySelector('p');
      desc = p ? p.textContent.trim() : '';
    }

    return {
      id: post.id,
      title,
      desc: desc,
      img,
      link,
      date: post.date || null,
      author: authorName, // Add author to normalized post
    };
  }

  // Share function
  const handleShare = async (link, title) => {
    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: stripHtml(title),
          url: link,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(link);
        setSnackbar({ show: true, message: 'لینک کپی شد' });
      }
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSnackbar({ show: true, message: 'لینک کپی شد' });
    }
  };

  function MagCard({ post }) {
    const [expanded, setExpanded] = React.useState(false);
    const full = stripHtml(post.desc || '');
    const preview = full.length > PREVIEW_CHARS ? full.slice(0, PREVIEW_CHARS).trimEnd() + '...' : full;

    return (
      <article className="magcard group flex flex-col bg-white rounded-xl overflow-hidden no-underline text-inherit border border-gray-100 shadow-md transition-transform duration-200 ease-out">
        <a data-post-id={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className="block">
          <div 
  className="magcard-image bg-cover bg-center relative h-[190px] rounded-bl-xl rounded-br-xl" 
  style={{ backgroundImage: post.img ? `url(${post.img})` : 'linear-gradient(#eee,#ddd)' }}
>
  <div className="magcard-title absolute right-3 bottom-3 text-white bg-black/45 px-2.5 py-2 rounded-md text-[17px] leading-[1.2] max-w-[90%] text-right group-hover:text-white">
    {stripHtml(post.title)}
  </div>
</div>
        </a>
        <div className="flex flex-col min-h-0">
          <div className={expanded ? 'magcard-desc-expanded p-3 text-base text-[#333] text-right' : 'p-3 text-base text-[#333] text-right'}>
            {expanded ? full : preview}
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-3 magcard-meta border-t border-gray-100">
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleShare(post.link, post.title); 
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                title="اشتراک گذاری"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {/* Author Name */}
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                {post.author}
              </span>
              
              {/* Date */}
              <span>
                {post.date ? new Date(post.date).toLocaleDateString('fa-IR') : ''}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="magcards-container w-full mt-5 px-2 pb-[160px] mx-auto">
      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {snackbar.message}
        </div>
      )}

      <div className="magcards-grid grid grid-cols-1 gap-4">
        {posts.map((p) => (
          <MagCard key={p.id} post={p} />
        ))}
      </div>
      {loading && <div className="mt-5 pb-2 text-center text-gray-500">در حال بارگذاری...</div>}
      {!hasMore && <div className="mt-5 pb-2 text-center text-gray-500">موردی برای نمایش وجود ندارد.</div>}
      <style>{`
        .magcards-container { max-width: 420px; }
        @media (min-width: 900px) { .magcards-container { max-width: 1000px; } .magcards-grid { grid-template-columns: 1fr 1fr; } }
        .magcard-desc-expanded { padding-bottom: 0.6em; }
        .magcard-meta { background: #fff; position: relative; z-index: 3; }
  .magcard { will-change: transform; }
  /* Subtler hover: smaller lift, softer shadow */
  .magcard:hover { transform: translateY(-3px); box-shadow: 0 10px 18px rgba(2,6,23,0.06); }
  .magcard-image { transition: transform .35s cubic-bezier(.2,.8,.2,1); }
  .magcard:hover .magcard-image { transform: scale(1.03); }
        .magcard-title { transition: color .25s ease-out, background-color .25s ease-out; }
        
        /* Snackbar animation */
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}