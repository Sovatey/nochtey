import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./Location.css";
import locationImage from "../assets/location.png";

export default function Location() {
  // Set the location coordinates
  const center = {
    lat: 11.5822823, // replace with your latitude
    lng: 104.9049916, // replace with your longitude
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA0Ifgai8ryDULDIqNOZmX8L7XZlzu4_D8", // ← replace with your API key
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <section className="location container">
      <h3 className="location-title">ទីតាំងកម្មវិធី</h3>
      <img
        src={locationImage}
        alt="Countdown"
        style={{ width: "100%", display: "block", borderRadius: "8px" }}
        onClick={() =>
          window.open(
            "https://www.google.com/maps/place/One+More+Restaurant+Boeung+%E2%80%8BKak/@11.5820667,104.9083864,16.41z/data=!4m6!3m5!1s0x310951443e15d2a1:0xbdcb73c15fc62f8d!8m2!3d11.5822771!4d104.9075719!16s%2Fg%2F11fp7sxwc2?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D",
            "_blank"
          )
        }
      />
      <button
        className="open-location-btn"
        onClick={() =>
          window.open(
            "https://www.google.com/maps/place/One+More+Restaurant+Boeung+%E2%80%8BKak/@11.5820667,104.9083864,16.41z/data=!4m6!3m5!1s0x310951443e15d2a1:0xbdcb73c15fc62f8d!8m2!3d11.5822771!4d104.9075719!16s%2Fg%2F11fp7sxwc2?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D",
            "_blank"
          )
        }
      >
        បើកមើលក្នុង Google Map
      </button>
    </section>
  );
}
