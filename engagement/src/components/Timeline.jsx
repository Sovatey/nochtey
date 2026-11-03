import React, { useRef, useEffect } from "react";
import "./Timeline.css";

const events = [
  { time: "07:30", title: "ជួបជុំភ្ញៀវកិត្តិយស" },
  { time: "08:00", title: "ពិធីចែចូវ និងបំពាក់ចិញ្ចៀន" },
  { time: "09:30", title: "ពិធីសែនព្រេនដូនតា និង ចងដៃ" },
  { time: "10:00", title: "ទទួលភ្ញៀវកិត្តិយសពិសាភោជនាហារ" },
];

export default function Timeline() {
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in-visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline container">
      <h3 className="timeline-title">របៀបវារះកម្មវិធី</h3>
      <div className="timeline-list">
        {events.map((ev, idx) => (
          <div
            key={idx}
            className="timeline-item"
            ref={(el) => (timelineRefs.current[idx] = el)}
          >
            <div className="timeline-time">{ev.time}</div>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h4 className="slide-right-title">{ev.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
