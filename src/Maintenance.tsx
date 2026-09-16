import React from "react";

export default function Maintenance() {
  return (
    <div className="maintenance-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
          background: #0f172a;
        }

        .maintenance-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(30, 58, 138, 0.35),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(212, 175, 55, 0.18),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #0f172a 0%,
              #172554 50%,
              #111827 100%
            );
          overflow: hidden;
          position: relative;
        }

        .maintenance-page::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 50%;
          top: -180px;
          right: -120px;
        }

        .maintenance-page::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 50%;
          bottom: -160px;
          left: -100px;
        }

        .maintenance-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 720px;
          padding: 55px 40px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 25px 70px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .church-logo {
          width: 92px;
          height: 92px;
          margin: 0 auto 24px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #1e3a8a,
            #2563eb
          );
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow:
            0 15px 35px rgba(30,58,138,0.35);
          font-size: 42px;
          animation: float 3s ease-in-out infinite;
        }

        .church-name {
          margin: 0 0 10px;
          color: #d4af37;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .maintenance-icon {
          font-size: 64px;
          line-height: 1;
          margin: 20px 0;
        }

        .maintenance-title {
          margin: 0;
          font-size: clamp(30px, 6vw, 48px);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .maintenance-title span {
          color: #d4af37;
        }

        .maintenance-text {
          max-width: 570px;
          margin: 22px auto 0;
          color: #cbd5e1;
          font-size: 16px;
          line-height: 1.8;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 30px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          color: #e2e8f0;
          font-size: 14px;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #d4af37;
          box-shadow: 0 0 12px rgba(212,175,55,0.8);
          animation: pulse 1.8s infinite;
        }

        .maintenance-footer {
          margin-top: 38px;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .maintenance-footer strong {
          color: #cbd5e1;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.35);
            opacity: 0.65;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .maintenance-page {
            padding: 16px;
          }

          .maintenance-card {
            padding: 40px 22px;
            border-radius: 22px;
          }

          .church-logo {
            width: 76px;
            height: 76px;
            border-radius: 20px;
            font-size: 34px;
          }

          .maintenance-icon {
            font-size: 52px;
          }

          .maintenance-text {
            font-size: 15px;
          }
        }
      `}</style>

      <main className="maintenance-card">
        <div className="church-logo" aria-label="GKI Petrus Waena">
          ✝
        </div>

        <div className="church-name">
          GKI Petrus Waena
        </div>

        <div className="maintenance-icon">
          🛠️
        </div>

        <h1 className="maintenance-title">
          Sedang Dalam <span>Pengembangan</span>
        </h1>

        <p className="maintenance-text">
          Website GKI Petrus Waena sedang dalam proses
          pengembangan dan penyempurnaan.
          <br />
          Kami sedang mempersiapkan sistem agar dapat
          memberikan pelayanan informasi yang lebih baik.
        </p>

        <div className="status">
          <span className="status-dot"></span>
          Sistem sementara dalam pengembangan
        </div>

        <div className="maintenance-footer">
          <strong>GKI Petrus Waena</strong>
          <br />
          Sistem Informasi &amp; Database Jemaat
          <br />
          © 2026 GKI Petrus Waena
        </div>
      </main>
    </div>
  );
}
