import React from "react";

export default function FileRequest({ onCallClick, onActionClick }) {
  const handleCallClick =
    onCallClick ||
    (() => {
      window.location.href = "tel:+989382740488";
    });

  const handleActionClick =
    onActionClick ||
    (() => {
      console.log("ثبت درخواست فایل clicked");
    });

  return (
    <section className="fr-wrapper" dir="rtl">
      <div className="fr-content">
        <div className="fr-copy">
          <h2 className="fr-title">
            از جستجو خسته شدی؟{" "}
          </h2>
          <p className="fr-subtitle">یک بار بسپار ، بقیش با آجر</p>
        </div>

        <div className="fr-ctas">
          <button
            type="button"
            className="fr-cta fr-cta-primary"
            onClick={handleActionClick}
          >
            <svg
              className="fr-cta-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>ثبت درخواست</span>
          </button>

          <button
            type="button"
            className="fr-cta fr-cta-call"
            onClick={handleCallClick}
          >
            <svg
              className="fr-cta-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.38 1.77.78 2.58a2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6 6l1.5-1.5a2 2 0 0 1 2.11-.45c.81.4 1.68.66 2.58.78A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>تماس با آجر</span>
          </button>
        </div>
      </div>

      <style jsx>{`
  .fr-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 24px auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .fr-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 24px 32px;
    border: 1px solid rgba(185, 28, 28, 0.08);
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.97),
      rgba(255, 248, 248, 0.94)
    );
    box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
    text-align: center;
  }

  .fr-copy {
    width: 100%;
    max-width: 760px;
    padding-inline: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .fr-title {
    margin: 0;
    color: #111827;
    font-size: clamp(20px, 2.8vw, 30px);
    font-weight: 800;
    line-height: 1.9;
    letter-spacing: -0.3px;
    text-align: center;
  }

  .fr-highlight {
    color: #c9363e;
    white-space: nowrap;
  }

  .fr-subtitle {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: clamp(13px, 1.6vw, 16px);
    font-weight: 500;
    line-height: 1.9;
    text-align: center;
  }

  .fr-ctas {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
  }

  .fr-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 42px;
    padding: 10px 16px;
    border: 1px solid transparent;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition: all 160ms ease;
  }

  .fr-cta:hover {
    transform: translateY(-2px);
  }

  .fr-cta:active {
    transform: translateY(0);
  }

  .fr-cta-primary {
    color: #fff;
    background: linear-gradient(135deg, #c9363e, #a91f2a);
    box-shadow: 0 6px 16px rgba(185, 28, 28, 0.16);
  }

  .fr-cta-call {
    color: #15803d;
    background: #fff;
    border-color: rgba(21, 128, 61, 0.18);
  }

  .fr-cta-call:hover {
    background: #f0fdf4;
    box-shadow: 0 6px 16px rgba(21, 128, 61, 0.1);
  }

  .fr-cta-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 700px) {
    .fr-wrapper {
      margin: 18px auto;
      padding: 0 12px;
    }

    .fr-content {
      gap: 14px;
      padding: 20px 18px;
      border-radius: 16px;
    }

    .fr-copy {
      max-width: 100%;
      padding-inline: 12px;
    }

    .fr-title {
      font-size: 19px;
      line-height: 1.95;
    }

    .fr-subtitle {
      font-size: 13px;
      line-height: 1.9;
    }

    .fr-ctas {
      flex-direction: column;
      gap: 8px;
    }

    .fr-cta {
      width: 100%;
      max-width: 240px;
      min-height: 40px;
      font-size: 12px;
    }
  }
`}</style>

    </section>
  );
}
