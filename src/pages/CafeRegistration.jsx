import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CafeRegistration = () => {
  const [cafeName, setCafeName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Add toggle state

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "cafes", user.uid), {
        uid: user.uid,
        cafeName,
        email,
        address,
        role: "cafe",
        createdAt: new Date(),
      });

      alert("✅ Cafe registered successfully!");
      navigate("/dashboard-cafe");
    } catch (err) {
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-white">
      <h2 className="mb-4 text-success">Register Your Cafe / Restaurant</h2>

      <form onSubmit={handleRegister} className="bg-dark p-4 rounded shadow-lg">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Cafe Name</label>
          <input
            type="text"
            className="form-control"
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Cafe Address (optional)</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Registering..." : "Register Cafe"}
        </button>
      </form>
    </div>
  );
};

export default CafeRegistration;
