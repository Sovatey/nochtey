import countdownImage from "../assets/both.jpg";
import React, { useState, useEffect } from "react";

// Divider (default export)
export default function Divider() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 0",
                gap: "12px",
            }}
        >
            {/* Left line + dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "goldenrod",
                    }}
                />
                <div
                    style={{
                        width: "60px", // shorter line
                        height: "2px",
                        background: "linear-gradient(to right, goldenrod, transparent)",
                    }}
                />
            </div>

            {/* Center 4-point star */}
            <div
                style={{
                    width: "20px",
                    height: "20px",
                    background: "goldenrod",
                    clipPath:
                        "polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)",
                    filter: "drop-shadow(0 0 6px gold)",
                    animation: "spin 5s linear infinite",
                }}
            />

            {/* Right line + dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                    style={{
                        width: "60px",
                        height: "2px",
                        background: "linear-gradient(to left, goldenrod, transparent)",
                    }}
                />
                <div
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "goldenrod",
                    }}
                />
            </div>

            <style>
                {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}

// DateDisplay (named export)
export function DateDisplay() {

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                // margin: "20px 0",
                fontFamily: "Noto Sans Khmer, sans-serif",
            }}
        >
            {/* Month above */}
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>ធ្នូ</div>

            {/* Middle row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "400px",
                    gap: "20px",
                }}
            >
                {/* Day name with lines */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "100px", height: "2px", background: "goldenrod" }} />
                    <div>ថ្ងៃ ចន្ទ</div>
                    <div style={{ width: "100px", height: "2px", background: "goldenrod" }} />
                </div>

                {/* Big date */}
                <div style={{ fontSize: "30px", fontWeight: "bold" }}>២៩</div>

                {/* Time with lines */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "100px", height: "2px", background: "goldenrod" }} />
                    <div>ម៉ោង ៨ ព្រឹក</div>
                    <div style={{ width: "100px", height: "2px", background: "goldenrod" }} />
                </div>
            </div>

            {/* Year below */}
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>២០២៥</div>
        </div>

    );
}

export function CountdownImage({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = new Date(targetDate) - now;

      if (distance <= 0) {
        clearInterval(interval);
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "400px", margin: "20px 0" }}>
      {/* Image */}
      <img
        src={countdownImage}
        alt="Countdown"
        style={{ width: "100%", display: "block", borderRadius: "8px" }}
      />

      {/* Countdown overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "14px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {/* {`${timeLeft.days}ថ្ងៃ : ${timeLeft.hours}ម៉ោង : ${timeLeft.minutes}នាទី : ${timeLeft.seconds}វិនាទី`} */}
         {isFinished ? (
          <span className="happy-text">
            <span>💍 Happy Engagement Day! 💖</span>
            <br />
            <span>29-12-2025</span>
          </span>
        ) : (
          <span>
            {timeLeft.days}ថ្ងៃ : {timeLeft.hours}ម៉ោង : {timeLeft.minutes}នាទី
            : {timeLeft.seconds}វិនាទី
          </span>
        )}
      </div>
    </div>
  );
}