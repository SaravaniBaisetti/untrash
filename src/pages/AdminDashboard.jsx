import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DonationGraph from "../components/DonationGraph";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCafes: 0,
    totalBottles: 0,
  });
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [userList, setUserList] = useState([]);
  const [cafeList, setCafeList] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    minBottles: "",
    maxBottles: "",
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const cafesSnap = await getDocs(collection(db, "cafes"));

      setUserList(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCafeList(cafesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      let totalBottles = 0;
      const allDonations = [];

      for (const user of usersSnap.docs) {
        const userData = user.data();
        const userDonations = await getDocs(collection(db, `users/${user.id}/donations`));
        userDonations.forEach((donationDoc) => {
          const data = donationDoc.data();
          if (!data.bottleCount) return;
          totalBottles += data.bottleCount;
          allDonations.push({
            role: "User",
            name: userData.name || "Unknown",
            count: data.bottleCount,
            date: data.timestamp?.toDate(),
            imageUrl: data.imageUrl || data.proofImage || null,
            pickupLocation: data.pickupLocation || null,
            path: `users/${user.id}/donations/${donationDoc.id}`,
          });
        });
      }

      for (const cafe of cafesSnap.docs) {
        const cafeData = cafe.data();
        const cafeDonations = await getDocs(collection(db, `cafes/${cafe.id}/donations`));
        cafeDonations.forEach((donationDoc) => {
          const data = donationDoc.data();
          if (!data.bottleCount) return;
          totalBottles += data.bottleCount;
          allDonations.push({
            role: "Cafe",
            name: cafeData.cafeName || "Unnamed Cafe",
            count: data.bottleCount,
            date: data.timestamp?.toDate(),
            imageUrl: data.imageUrl || data.proofImage || null,
            pickupLocation: data.pickupLocation || null,
            path: `cafes/${cafe.id}/donations/${donationDoc.id}`,
          });
        });
      }

      allDonations.sort((a, b) => b.date - a.date);

      setStats({
        totalUsers: usersSnap.size,
        totalCafes: cafesSnap.size,
        totalBottles,
      });
      setDonations(allDonations);
      setFilteredDonations(allDonations);

      const donationHistory = allDonations.map((d) => ({
  timestamp: d.date,
  bottleCount: d.count,
}));
setGraphData(donationHistory);

    } catch (error) {
      console.error("❌ Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const deleteDonation = async (path) => {
    try {
      const [col1, id1, col2, id2] = path.split("/");
      await deleteDoc(doc(db, col1, id1, col2, id2));
      fetchData();
    } catch (err) {
      console.error("❌ Failed to delete donation:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  };

  const deleteCafe = async (id) => {
    try {
      await deleteDoc(doc(db, "cafes", id));
      fetchData();
    } catch (err) {
      console.error("❌ Failed to delete cafe:", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...donations];
    const { role, minBottles, maxBottles, startDate, endDate } = filters;

    if (role) filtered = filtered.filter((d) => d.role === role);
    if (minBottles) filtered = filtered.filter((d) => d.count >= parseInt(minBottles));
    if (maxBottles) filtered = filtered.filter((d) => d.count <= parseInt(maxBottles));
    if (startDate) filtered = filtered.filter((d) => d.date && d.date >= new Date(startDate));
    if (endDate) filtered = filtered.filter((d) => d.date && d.date <= new Date(endDate));

    setFilteredDonations(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <p className="text-white text-center mt-5">Loading admin dashboard...</p>;
  }

  return (
    <motion.div className="container my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white">Admin Dashboard</h3>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="p-4 bg-success text-white rounded shadow text-center clickable" style={{ cursor: "pointer" }} onClick={() => setView("users")}>
            <h5>Total Users</h5>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-primary text-white rounded shadow text-center clickable" style={{ cursor: "pointer" }} onClick={() => setView("cafes")}>
            <h5>Total Cafés</h5>
            <h2>{stats.totalCafes}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-warning text-dark rounded shadow text-center clickable" style={{ cursor: "pointer" }} onClick={() => setView("dashboard")}>
            <h5>Total Bottles Donated</h5>
            <h2>{stats.totalBottles}</h2>
          </div>
        </div>
      </div>

      {view === "users" && (
        <div className="bg-dark text-white p-4 rounded shadow mb-4">
          <h5 className="mb-3">👥 Registered Users</h5>
          <ul className="list-group">
            {userList.map(user => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{user.name || "Unnamed User"}</span>
                <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "cafes" && (
        <div className="bg-dark text-white p-4 rounded shadow mb-4">
          <h5 className="mb-3">🏪 Registered Cafes</h5>
          <ul className="list-group">
            {cafeList.map(cafe => (
              <li key={cafe.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{cafe.cafeName || "Unnamed Cafe"}</span>
                <button className="btn btn-sm btn-danger" onClick={() => deleteCafe(cafe.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "dashboard" && (
        <motion.div className="bg-dark text-white p-4 rounded shadow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          
          <DonationGraph donationHistory={graphData} />

          <h5 className="mb-3">🔍 Filter Donations</h5>
<div className="row mb-3 align-items-end">
  <div className="col-md-2">
    <label className="form-label text-white">Role</label>
    <select name="role" className="form-select" value={filters.role} onChange={handleFilterChange}>
      <option value="">All Roles</option>
      <option value="User">User</option>
      <option value="Cafe">Cafe</option>
    </select>
  </div>

  <div className="col-md-2">
    <label className="form-label text-white">Min Bottles</label>
    <input type="number" name="minBottles" placeholder="0" className="form-control" value={filters.minBottles} onChange={handleFilterChange} />
  </div>

  <div className="col-md-2">
    <label className="form-label text-white">Max Bottles</label>
    <input type="number" name="maxBottles" placeholder="100+" className="form-control" value={filters.maxBottles} onChange={handleFilterChange} />
  </div>

  <div className="col-md-3">
    <label className="form-label text-white">Start Date</label>
    <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleFilterChange} />
  </div>

  <div className="col-md-3">
    <label className="form-label text-white">End Date</label>
    <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleFilterChange} />
  </div>
</div>

<button
  className="btn btn-success w-100 mb-3 rounded-pill fw-bold shadow-sm"
  onClick={applyFilters}
>
  🔍 Apply Filters
</button>

          <h5 className="mb-3">📦 All Donations</h5>
          {filteredDonations.length === 0 ? (
            <p>No donations found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Donor</th>
                    <th>Role</th>
                    <th>Bottle Count</th>
                    <th>Image</th>
                    <th>Pickup Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.date?.toLocaleDateString()} {entry.date?.toLocaleTimeString()}</td>
                      <td>{entry.name}</td>
                      <td>{entry.role}</td>
                      <td>{entry.count}</td>
                      <td>
                        {entry.imageUrl ? (
                          <a href={entry.imageUrl} target="_blank" rel="noopener noreferrer" className="text-info">View</a>
                        ) : (
                          "-"
                        )}
                      </td>
                      
                      <td>
                        {entry.pickupLocation ? (
                        <a
                        href={`https://www.google.com/maps?q=${entry.pickupLocation.lat},${entry.pickupLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-warning"
                        >
                        View Location
                       </a>
                        ) : (
                         "-"
                        )}
                      </td>



                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteDonation(entry.path)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;