import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const MagCards = dynamic(() => import('../../components/workers/MagCards'), { ssr: false });

export default function AssistantButtons() {
	const router = useRouter();
	const buttons = [
		{ key: 'phonebook', link: '/phonebook', label: 'دفترچه تلفن', color: '#f1c40f', icon: PhoneIcon },
		{ key: 'files', link: '/panel', label: 'فایل‌ها', color: '#2ecc71', icon: FilesIcon },
		{ key: 'comissionfee', link: '/comissioncalc', label: 'محاسبه کمیسیون', color: '#1abc9c', icon: EyeIcon },
		{ key: 'management', link: '/panel/department-entro', label: 'مدیریت', color: '#e67e22', icon: GearIcon },
		{ key: 'filebank', link: '/filebank', label: 'بانک فایل', color: '#3498db', icon: DownloadIcon },
		{ key: 'education', link: '/education', label: 'آموزش', color: '#9b59b6', icon: GraduationIcon },
		{ key: 'views', link: '/G-ads/landing-page', label: 'افزایش بازدید', color: '#1abc9c', icon: EyeIcon },
		{ key: 'marketing', link: '/marketing', label: 'بازاریابی آجر', color: '#1abc9c', icon: EyeIcon },
	];

	const [showTop, setShowTop] = React.useState(false);

	React.useEffect(() => {
		function onScroll() {
			setShowTop(window.scrollY > 300);
		}
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}


	function handleClick(link) {
		if (link) router.push(link);
	}

	return (
		<div dir="rtl" style={container}>
			<div className="assistant-grid-responsive">
				{buttons.map((b) => (
					<button key={b.key} className="assistant-card-responsive" aria-label={b.label}
						onClick={() => handleClick(b.link)}>
						<div className="assistant-icon-circle" style={{ background: b.color }} aria-hidden>
							<b.icon />
						</div>
						<div className="assistant-label">{b.label}</div>
					</button>
				))}
			</div>
			<style>{`
					.assistant-grid-responsive {
						display: grid;
						/* mobile: 2 columns x 4 rows */
						grid-template-columns: repeat(2, 1fr);
						grid-auto-rows: auto;
						gap: 14px;
						width: 100%;
						max-width: 420px;
					}
					/* desktop: 4 columns x 2 rows */
					@media (min-width: 900px) {
						.assistant-grid-responsive {
							grid-template-columns: repeat(4, 1fr);
							max-width: 1000px;
						}
					}
						.assistant-card-responsive {
							display: flex;
							/* force visual left-to-right so icon stays left even inside an RTL page */
							direction: ltr;
							flex-direction: row;
							align-items: center;
							gap: 14px;
							padding: 16px;
							background: #fff;
							border-radius: 14px;
							box-shadow: 0 6px 18px rgba(0,0,0,0.06);
							border: 1px solid rgba(0,0,0,0.03);
							cursor: pointer;
							text-align: right;
							width: 100%;
						}
					.assistant-icon-circle {
						width: 46px;
						height: 46px;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex: 0 0 46px;
						margin-left: 0;
						margin-right: 0;
					}
						.assistant-label {
							font-size: 16px;
							color: #222;
							font-family: inherit;
							margin-right: 4px;
							flex: 1;
							/* keep Persian text right-aligned */
							direction: rtl;
							text-align: right;
						}
				`}</style>
			<MagCards />
			{showTop && (
				<button aria-label="بازگشت به بالا" onClick={scrollToTop} style={scrollTopBtn}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="#fff" />
					</svg>
				</button>
			)}
		</div>
	);
}

// ---------- Icons (simple inline SVG components) ----------
function FilesIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 2v6h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function PhoneIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.52.3 1.03.54 1.52a1 1 0 0 1-.23 1.09L7.7 7.7a15 15 0 0 0 6 6l1.35-1.35a1 1 0 0 1 1.09-.23c.49.24 1 .42 1.52.54a1 1 0 0 1 .75 1V21z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function DownloadIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M7 10l5 5 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 15V3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function GraduationIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M22 12l-10 6L2 12l10-6 10 6z" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 6v6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 12v6a6 6 0 0 0 12 0v-6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function EyeIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx="12" cy="12" r="3" fill="#fff" />
		</svg>
	);
}

function GearIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.28 17.7l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.3 4.28A2 2 0 0 1 7.12 1.45l.06.06a1.65 1.65 0 0 0 1.82.33h.09c.5-.2 1.05-.2 1.55 0h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 0 1 19.7 4.3l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.2.5.2 1.05 0 1.55v.09a1.65 1.65 0 0 0 .33 1.82l.06.06A2 2 0 0 1 19.4 15z" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

// ---------- Styles ----------
const container = {
	// keep full width but don't vertically center; place items near the top like the screenshot
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'flex-start',
	padding: '12px 16px',
	paddingTop: '20px',
	background: 'transparent',
};

const scrollTopBtn = {
	position: 'fixed',
	right: '18px',
	// raised a bit to sit above common mobile bottom navbars
	bottom: '78px',
	width: '48px',
	height: '48px',
	borderRadius: '50%',
	background: '#e74c3c',
	border: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
	cursor: 'pointer',
	zIndex: 1200,
};


