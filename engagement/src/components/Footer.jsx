import React from "react";
import "./Footer.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          សូមអរគុណដែលចូលរួមក្នុងពិធីរបស់យើង <br />
          Thank you for celebrating with us
        </p>
        <small style={{ fontWeight: "bold" }}>
          ណុច & វត្តី{" "}
          <span
            style={{ color: "#DAA520", fontWeight: "bolder", fontSize: 20 }}
          >
            •
          </span>{" "}
          ២៩ ធ្នូ ២០២៥
        </small>
      </div>
    </footer>
  );
}
