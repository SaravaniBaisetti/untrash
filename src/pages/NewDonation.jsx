import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, collection, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import LocationPicker from "../components/LocationPicker";


const NewDonation = () => {
  const [bottles, setBottles] = useState("");
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState(null);

  // Cloudinary config
  const CLOUD_NAME = "dpo9l8uvo"; // <-- Replace this
  const UPLOAD_PRESET = "Untrash-donations"; // <-- Your unsigned preset

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    try {
      const refPath = role === "cafe" ? "cafes" : "users";
      const donationRef = collection(db, `${refPath}/${user.uid}/donations`);

      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          imageUrl = data.secure_url;
        } else {
          throw new Error("Image upload failed.");
        }
      }
       
      await addDoc(donationRef, {
       bottleCount: parseInt(bottles),
       timestamp: serverTimestamp(),
       proofImage: imageUrl || null,
       pickupLocation: pickupLocation || null, // <- add this line
      });

      

      alert("✅ Donation added successfully!");

      setTimeout(() => {
        navigate(role === "cafe" ? "/dashboard-cafe" : "/dashboard-user");
      }, 300);
    } catch (err) {
      alert("❌ Error saving donation: " + err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/login");

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const cafeDoc = await getDoc(doc(db, "cafes", user.uid));

        if (userDoc.exists()) setRole("user");
        else if (cafeDoc.exists()) setRole("cafe");
        else alert("No user role found.");
      } catch (e) {
        console.error("Error detecting user role:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <p className="text-white text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5 text-white">
      <h2 className="text-success mb-4">📦 Add a New Donation</h2>
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg">
        <div className="mb-3">
          <label className="form-label">Number of Plastic Bottles</label>
          <input
            type="number"
            className="form-control"
            value={bottles}
            onChange={(e) => setBottles(e.target.value)}
            required
            min={1}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload a Photo (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">📍 Pickup Location</label>
          <LocationPicker onLocationSelect={(location) => setPickupLocation(location)} />
         </div>


        <button type="submit" className="btn btn-success w-100">
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default NewDonation;
