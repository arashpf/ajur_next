import React, { useEffect, useState, useRef } from 'react';

export default function MagCards() {
  const PER_PAGE = 6;
  const PREVIEW_CHARS = 120;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    // initial load page 1 only
  loadPages(1, 1, false);

    // attach scroll handler (reads refs to avoid stale closures)
    function onScroll() {
      if (loadingRef.current || !hasMoreRef.current) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) {
        const next = pageRef.current + 1;
        // load two pages on scroll
  loadPages(next, 2, true);
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
    // run once on mount
  }, []);

  async function fetchPage(p) {
    try {
      const res = await fetch(`https://mag.ajur.app/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${p}`);
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

  // Capture previous scrollTop so we can restore after appending.
  // Restoring scrollTop is more stable for preserving the user's viewport
  // position when new content is appended below them.
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
      // remember the first new id so we can find it in the DOM after append
      const firstNewId = allNew[0].id;
      // Append once
      setPosts((s) => [...s, ...allNew]);

      // After DOM updates, try to bring the first newly appended card into view
      // when the load was triggered by user scroll. Otherwise restore prevScrollTop.
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // If user moved too far while loading, don't interfere.
            if (Math.abs(window.scrollY - prevScrollTop) > 120) return;

            if (scrollTriggered) {
              const el = document.querySelector(`a[data-post-id="${firstNewId}"]`);
              if (el) {
                const rect = el.getBoundingClientRect();
                // Put the element slightly below the top to show context
                const offset = 72; // px
                const target = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, window.scrollY + rect.top - offset));
                window.scrollTo({ top: target, behavior: 'smooth' });
              }
            } else {
              // non-user triggered loads should keep the user's previous scroll
              if (Math.abs(window.scrollY - prevScrollTop) < 4) {
                window.scrollTo({ top: prevScrollTop, behavior: 'auto' });
              }
            }
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
    // parse content HTML to get first paragraph and first image
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
    // fallback: try excerpt
    if (!desc && post?.excerpt?.rendered) {
      const exdoc = new DOMParser().parseFromString(post.excerpt.rendered, 'text/html');
      const p = exdoc.querySelector('p');
      desc = p ? p.textContent.trim() : '';
    }

    return {
      id: post.id,
      title,
      // keep full plain-text description and let CSS handle truncation
      desc: desc,
      img,
      link,
      date: post.date || null,
    };
  }

  // small presentational subcomponent for each article card
  function MagCard({ post }) {
    const [expanded, setExpanded] = React.useState(false);
    const full = stripHtml(post.desc || '');
    const preview = full.length > PREVIEW_CHARS ? full.slice(0, PREVIEW_CHARS).trimEnd() + '...' : full;

    return (
      <article className="magcard group flex flex-col bg-white rounded-xl overflow-hidden no-underline text-inherit border border-gray-100 shadow-md transition-transform duration-200 ease-out hover:translate-y-[-4px] hover:shadow-lg">
        <a data-post-id={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className="block">
          <div className="magcard-image bg-cover bg-center relative h-[204px] transition-transform duration-300 ease-out group-hover:scale-105" style={{ backgroundImage: post.img ? `url(${post.img})` : 'linear-gradient(#eee,#ddd)' }}>
            <div className="magcard-title absolute right-3 bottom-3 text-white bg-black/45 px-2.5 py-2 rounded-md text-[19px] leading-[1.2] max-w-[90%] text-right group-hover:text-white">{stripHtml(post.title)}</div>
          </div>
        </a>
        <div className="flex flex-col min-h-0">
          <div className={expanded ? 'magcard-desc-expanded p-3 text-base text-[#333] text-right' : 'p-3 text-base text-[#333] text-right'}>
            {expanded ? full : preview}
          </div>
          <div className="flex items-center justify-between gap-3 px-3 magcard-meta">
            <div className="text-right text-sm text-gray-500 pb-3">{post.date ? new Date(post.date).toLocaleDateString('fa-IR') : ''}</div>
            {full.length > PREVIEW_CHARS && (
              <button type="button" onClick={(e)=>{ e.preventDefault(); setExpanded(x=>!x); }} className="text-sm text-blue-500 hover:underline pb-3">{expanded ? 'بستن' : 'نمایش بیشتر'}</button>
            )}
          </div>
        </div>
  </article>
    );
  }

  return (
    <div className="magcards-container w-full mt-5 px-2 pb-[160px] mx-auto">
      <a href='https://mag.ajur.app/' target='blank'>
      <h3 className="text-right font-semibold text-[18px] text-blue-600 mb-3">مجله آجر</h3>
      </a>
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
  /* preview uses fixed-character truncation handled in JS */
  .magcard-desc-expanded { padding-bottom: 0.6em; }
  /* meta row (date and button) layout */
  .magcard-meta { background: #fff; position: relative; z-index: 3; }
      /* hover effects */
      .magcard { will-change: transform; }
      .magcard:hover { transform: translateY(-6px); }
      .magcard-image { transition: transform .25s ease-out; }
      .magcard:hover .magcard-image { transform: scale(1.05); }
      .magcard-title { transition: color .25s ease-out, background-color .25s ease-out; }
      `}</style>
    </div>
  );
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
}

// cleaned up: styles are now Tailwind classes inline in JSX
