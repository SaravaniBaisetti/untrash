import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 for toggling visibility

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        contact: form.contact,
        location: form.location,
        role: "eco-volunteer",
        createdAt: new Date(),
      });

      navigate("/dashboard-user");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5 text-white">
      <h2 className="text-success mb-4">Eco Volunteer Registration</h2>
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input type="tel" name="contact" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Create Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              onChange={handleChange}
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
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-success w-100 mt-3">Register</button>
      </form>
    </div>
  );
};

export default UserRegistration;
