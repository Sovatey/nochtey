import React, { useRef, useState, useEffect } from "react";
import bg from "../assets/floral-bg-minimal.png";
import "./InvitationText.css";
import text from "../assets/text.png";
import Divider, { DateDisplay, CountdownImage } from "./components";
import Timeline from "./Timeline";
import Location from "./Location";
import Footer from "./Footer";
import hoverSound from "../assets/sounds/music.weba";

export default function InvitationText() {
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-play when user first interacts with the page
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      if (audioRef.current && !isPlaying && soundEnabled) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("Music started automatically");
          })
          .catch((e) => {
            console.log("Auto-play blocked by browser:", e);
          });

        // Remove listeners after first successful interaction
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
      }
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [isPlaying, soundEnabled]);

  // Try to auto-play when user interacts and sound is enabled
  useEffect(() => {
    if (userInteracted && audioRef.current && !isPlaying && soundEnabled) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Auto-play after interaction failed:", error);
        }
      };
      playAudio();
    }
  }, [userInteracted, isPlaying, soundEnabled]);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);

    if (audioRef.current) {
      if (newSoundEnabled && userInteracted) {
        // Enable sound and try to play
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.log("Play failed:", e));
      } else {
        // Disable sound and pause
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setUserInteracted(true);
      }
    } catch (error) {
      console.log("Playback toggle failed:", error);
    }
  };

  const handleAudioEnd = () => {
    // Ensure looping
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Loop play failed:", e));
    }
  };

  const hearts = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 20,
    duration: 5 + Math.random() * 5,
    delay: Math.random() * 5,
  }));

  return (
    <section className="invitation">
      {/* Background Music - Auto play and loop */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        onEnded={handleAudioEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={hoverSound} type="audio/webm" />
        <source src="/sounds/music.mp3" type="audio/mpeg" />
      </audio>
      {/* Background */}
      <div
        className="invitation-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Falling hearts */}
      <div className="falling-hearts">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
            }}
          >
            💛
          </div>
        ))}
      </div>

      {/* Scrollable card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "80%",
          maxWidth: "500px",
          minHeight: "100vh",
          margin: "0 auto",
          padding: "4vmin 3vmin",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: 0,
          border: "none",
          boxShadow: "none",
          maxHeight: "90vh",
          overflowY: "auto",

          /* 🔥 Add these fixes */
          overflowX: "hidden",
          touchAction: "pan-y",

          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="scroll-container"
      >

        <h2
          style={{
            fontSize: "clamp(20px, 3vw, 24px)",
            color: "#b8860b",
            marginBottom: "2vmin",
          }}
        >
          សិរីមង្គលពិធីចូលចែចូវ
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Groom side */}
          <div className="animation-man" style={{ textAlign: "start", fontSize: "0.8rem" }}>
            <p>
              លោក <span style={{ fontWeight: "bold" }}>ប្រាក់ សុខា</span>
            </p>
            <p>
              លោកស្រី <span style={{ fontWeight: "bold" }}>យឹម សាមន</span>
            </p>
          </div>
          <span style={{ width: "0px" }}></span>
          {/* Bride side */}
          <div className="animation-woman" style={{ textAlign: "start", fontSize: "0.8rem" }}>
            <p>
              លោក <span style={{ fontWeight: "bold" }}>ហាយ វលក្ខណ៍</span>
            </p>
            <p>
              លោកស្រី <span style={{ fontWeight: "bold" }}>គាត ដាវី</span>
            </p>
          </div>
        </div>
        {/* <h2
          style={{
            fontSize: "clamp(16px, 3vw, 16px)",
            color: "#b8860b",
            marginBottom: "2vmin",
          }}
        >
          យើងខ្ញុំមានកិត្តិយស​ <br />
          សូមគោរពអញ្ជើញ
        </h2> */}
        <p
          style={{
            fontSize: "clamp(12px, 3vw, 12px)",
            margin: " 0",
            color: "#444",
          }}
        >
          សូមគោរពអញ្ជើញ ឯកឧត្តម អ្នកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា
          និងញាតិមិត្តអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស
          ដើម្បីប្រសិទ្ធិពរជ័យសិរីសួស្ដី ជ័យមង្គល ក្នុងពិធីចូលចែចូវ
          កូនប្រុស-ស្រី របស់យើងទាំងពីរ។
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Groom side */}
          <div className="animation-man" style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "bold", color: "#b8860b",fontSize: "0.95rem"  }}>កូនប្រុស</p>
            <p style={{ fontSize: "0.95rem" }}>ព្រី ណុច</p>
          </div>

          {/* Couple logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="animation"
          >
            <img
              src={text}
              alt="Couple Logo"
              style={{
                width: "100px",
                height: "auto",
                objectFit: "contain",
                margin: "0 10px",
              }}
            />
          </div>

          {/* Bride side */}
          <div className="animation-woman" style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "bold", color: "#b8860b",fontSize: "0.95rem"  }}>កូនស្រី</p>
            <p style={{ fontSize: "0.95rem" }}>ហែន សុវត្តី</p>
          </div>
        </div>

        <div className="animation">
          <DateDisplay />
        </div>
        <p
          style={{
            fontSize: "clamp(14px, 3vw, 14px)",
            margin: "20px 0",
            color: "#444",
          }}
        >
          ត្រូវនឹងថ្ងៃទី ១០ កើត ខែបុស្ស ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស ២៥៦៩ ស្ថិតនៅ{" "}
          <b>ភោជនីយដ្ឋានវ័នម៉រ (បន្ទប់ នាងសួស្ដី)</b>
        </p>
        <Divider />
        <div className="animation">
          <CountdownImage targetDate="2025-12-29T07:00:00" />
        </div>

        <Timeline />
        <div className="animation">
          <Location />
        </div>
        <Footer />
        {/* <div className="animation">
          <Footer />
        </div> */}
      </div>
    </section>
  );
}
