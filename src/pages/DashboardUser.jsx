import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import DonationGraph from "../components/DonationGraph";

const DashboardUser = () => {
  const [userData, setUserData] = useState(null);
  const [totalBottles, setTotalBottles] = useState(0);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());

            const donationRef = collection(db, `users/${user.uid}/donations`);
            const snapshot = await getDocs(donationRef);

            let total = 0;
            const history = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.bottleCount) total += data.bottleCount;

              history.push({
                id: doc.id,
                bottleCount: data.bottleCount,
                timestamp: data.timestamp?.toDate()
              });
            });

            // Sort by most recent
            history.sort((a, b) => b.timestamp - a.timestamp);

            setTotalBottles(total);
            setDonationHistory(history);
          } else {
            console.error("User document not found.");
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading)
    return <p className="text-white text-center mt-5">Loading your dashboard...</p>;

  if (!userData)
    return <p className="text-danger text-center mt-5">No user data found.</p>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-white">Eco Volunteer Dashboard</h4>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="bg-dark text-white p-4 rounded shadow-lg">
        <h2 className="text-success text-center mb-4">
          🌱 Welcome, {userData.name}
        </h2>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25">
              <h5 className="text-light mb-2">👤 Your Info</h5>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Contact:</strong> {userData.contact}</p>
              <p><strong>Location:</strong> {userData.location}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25">
              <h5 className="text-light mb-2">🎯 Activity Summary</h5>
              <p><strong>Bottles Donated:</strong> {totalBottles}</p>
              <p><strong>Eco Points:</strong> {totalBottles}</p>
            </div>
          </div>
          
          <div className="col-md-12">
            <DonationGraph donationHistory={donationHistory} />
          </div>



        </div>

        <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25 mb-4">
          <h5 className="text-light mb-2">🌍 Community Impact</h5>
          <p>
            Your contributions are helping local communities clean their environment
            and support social causes. Stay tuned for updates on your impact!
          </p>
        </div>

        {donationHistory.length > 0 && (
  <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25">
    <h5 className="text-light mb-3">🕒 Donation History</h5>
    <table className="table table-dark table-striped table-hover">
      <thead>
        <tr>
          <th>Date & Time</th>
          <th>No. of Bottles</th>
        </tr>
      </thead>
      <tbody>
        {donationHistory.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.timestamp?.toLocaleString()}</td>
            <td>{entry.bottleCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>

      <div className="text-end mb-3">
        <button className="btn btn-outline-success" onClick={() => navigate("/donate")}>
          ➕ New Donation
        </button>
      </div>

      <style>
        {`
          .dashboard-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 255, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default DashboardUser;
