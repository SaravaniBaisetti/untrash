import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DashboardCafe = () => {
  const [cafeData, setCafeData] = useState(null);
  const [totalBottles, setTotalBottles] = useState(0);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "cafes", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCafeData(docSnap.data());

            const donationRef = collection(db, `cafes/${user.uid}/donations`);
            const snapshot = await getDocs(donationRef);

            let total = 0;
            const history = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.bottleCount) total += data.bottleCount;

              history.push({
                id: doc.id,
                bottleCount: data.bottleCount,
                timestamp: data.timestamp?.toDate(),
              });
            });

            history.sort((a, b) => b.timestamp - a.timestamp);

            setTotalBottles(total);
            setDonationHistory(history);
          } else {
            console.error("Cafe document not found.");
          }
        } catch (err) {
          console.error("Failed to fetch cafe data:", err);
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

  if (!cafeData)
    return <p className="text-danger text-center mt-5">No cafe data found.</p>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-white">Cafe / Restaurant Dashboard</h4>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="bg-dark text-white p-4 rounded shadow-lg">
        <h2 className="text-success text-center mb-4">
          ☕ Welcome, {cafeData.cafeName}
        </h2>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25">
              <h5 className="text-light mb-2">📍 Cafe Info</h5>
              <p><strong>Email:</strong> {cafeData.email}</p>
              <p><strong>Address:</strong> {cafeData.address || "N/A"}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25">
              <h5 className="text-light mb-2">📦 Collection Summary</h5>
              <p><strong>Bottles Collected:</strong> {totalBottles}</p>
              <p><strong>Reward Points:</strong> {totalBottles}</p>
            </div>
          </div>
        </div>

        <div className="p-3 dashboard-card border rounded bg-black bg-opacity-25 mb-4">
          <h5 className="text-light mb-2">🌟 Partner Impact</h5>
          <p>
            Your café is actively reducing plastic waste and supporting sustainable causes.
            We’ll soon show how much difference you've made.
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

export default DashboardCafe;
