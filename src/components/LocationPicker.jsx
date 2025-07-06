// src/components/LocationPicker.jsx
import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 17.385044, // Default to Hyderabad
  lng: 78.486671,
};

const LocationPicker = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState(centerDefault);
  const [markerPosition, setMarkerPosition] = useState(centerDefault);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBPKNUXxABPEHHp7FJYuNG2-dhzccixxwY", // 💡 Replace with your real API key
    libraries: ["places"],
  });

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    onLocationSelect({ lat, lng });
  }, [onLocationSelect]);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
      onLocationSelect({ lat, lng });
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search location"
          className="form-control mb-3"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={onMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
};

export default React.memo(LocationPicker);
