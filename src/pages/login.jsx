import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const cafeDoc = await getDoc(doc(db, "cafes", user.uid));

      if (userDoc.exists()) {
        navigate("/dashboard-user");
      } else if (cafeDoc.exists()) {
        navigate("/dashboard-cafe");
      } else {
        setError("User not found in database.");
      }
    } catch (err) {
      setError("Invalid credentials or user not registered.");
    }
  }; */








  /* below code is Recently Added Handle Submit code (along with Admin dashboard redirection ) */

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an Admin
    const adminRef = doc(db, "Admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      console.log("Redirecting to Admin dashboard");
      navigate("/dashboard-admin");
      return;
    }

    // Check if user is a Volunteer
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Redirecting to User dashboard");
      navigate("/dashboard-user");
      return;
    }

    // Check if user is a Cafe
    const cafeRef = doc(db, "cafes", user.uid);
    const cafeSnap = await getDoc(cafeRef);

    if (cafeSnap.exists()) {
      console.log("Redirecting to Cafe dashboard");
      navigate("/dashboard-cafe");
      return;
    }

    // If none found
    setError("User role not found in the database.");
  } catch (err) {
    console.error("Login error:", err);
    setError("Invalid credentials or user not registered.");
  }
};












  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <form
        onSubmit={handleSubmit}
        className="bg-dark text-white p-5 rounded shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-success text-center mb-4">🔐 Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Email address</label>
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

        <button type="submit" className="btn btn-success w-100 mb-3">
          Login
        </button>

        <hr className="border border-light" />

        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => navigate("/register-user")}
          >
            📋 Register as Eco Volunteer
          </button>
          <button
            type="button"
            className="btn btn-outline-warning"
            onClick={() => navigate("/register-cafe")}
          >
            ☕ Register Your Café / Restaurant
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
