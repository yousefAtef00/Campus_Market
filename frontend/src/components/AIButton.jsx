import { useState, useRef, useEffect } from "react";

function AIButton({ setPage }) {
 const [pos, setPos] = useState({ x: window.innerWidth - 100, y: window.innerHeight / 2 - 30 });
  const [dragging, setDragging] = useState(false);
  const [pulse, setPulse] = useState(true);
  const offset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const btnRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const onMouseDown = (e) => {
    moved.current = false;
    setDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    moved.current = true;
    setPos({
      x: Math.min(Math.max(e.clientX - offset.current.x, 0), window.innerWidth - 60),
      y: Math.min(Math.max(e.clientY - offset.current.y, 0), window.innerHeight - 60),
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    if (!moved.current) setPage("Reviews");
  };

  const onTouchStart = (e) => {
    moved.current = false;
    setDragging(true);
    const touch = e.touches[0];
    offset.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y };
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    moved.current = true;
    const touch = e.touches[0];
    setPos({
      x: Math.min(Math.max(touch.clientX - offset.current.x, 0), window.innerWidth - 72),
      y: Math.min(Math.max(touch.clientY - offset.current.y, 0), window.innerHeight - 72),
    });
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (!moved.current) setPage("Reviews");
  };

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .ai-btn-inner { animation: bob 2.5s ease-in-out infinite; }
        .ai-eye {
          animation: eye-blink 3s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      <div
        ref={btnRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: 60,
          height: 60,
          zIndex: 9999,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        {pulse && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "#534AB7", opacity: 0.4,
            animation: "pulse-ring 1.2s ease-out infinite",
          }} />
        )}

        <div className="ai-btn-inner" style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #534AB7, #7F77DD)",
          boxShadow: dragging
            ? "0 8px 30px rgba(83,74,183,0.6)"
            : "0 4px 20px rgba(83,74,183,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "box-shadow 0.2s",
        }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect x="6" y="9" width="22" height="18" rx="4" fill="white" opacity="0.95"/>
            <line x1="17" y1="9" x2="17" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="17" cy="3" r="2" fill="#AFA9EC"/>
            <g className="ai-eye">
              <rect x="10" y="14" width="5" height="5" rx="1.5" fill="#534AB7"/>
              <rect x="19" y="14" width="5" height="5" rx="1.5" fill="#534AB7"/>
            </g>
            <rect x="11.5" y="15" width="1.5" height="1.5" rx="0.5" fill="white" opacity="0.7"/>
            <rect x="20.5" y="15" width="1.5" height="1.5" rx="0.5" fill="white" opacity="0.7"/>
            <rect x="11" y="22" width="12" height="2.5" rx="1.25" fill="#534AB7" opacity="0.5"/>
            <rect x="13" y="22" width="3" height="2.5" rx="1" fill="#534AB7"/>
            <rect x="18" y="22" width="3" height="2.5" rx="1" fill="#534AB7"/>
            <rect x="3" y="15" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
            <rect x="28" y="15" width="3" height="5" rx="1.5" fill="white" opacity="0.7"/>
          </svg>
        </div>

        <div style={{
          position: "absolute", bottom: "110%", left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a2e", color: "white",
          fontSize: 11, fontFamily: "sans-serif",
          padding: "4px 10px", borderRadius: 20,
          whiteSpace: "nowrap", pointerEvents: "none",
          opacity: dragging ? 0 : 1,
          transition: "opacity 0.2s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          🤖 AI helper
        </div>
      </div>
    </>
  );
}

export default AIButton;