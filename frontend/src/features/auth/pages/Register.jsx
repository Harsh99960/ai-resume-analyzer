import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const { handleRegister, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // now
  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister(formData);

    navigate("/");
  };

  return (
    <div className="auth-form">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Register to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <button type="submit">
            {!loading ? "Create Account" : "Loading..."}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>

      </div>
    </div>
  );
};

export default Register;


// import React from "react";
// import { useNavigate } from "react-router";
// import "../auth.form.scss";

// const Register = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="auth-form">
//       <div className="auth-card">

//         <div className="auth-header">
//           <h1>Create Account</h1>
//           <p>Register to get started</p>
//         </div>

//         <form>
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter your username"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Create a password"
//             />
//           </div>
//           <button type="submit">
//             Create Account
//           </button>
//         </form>

//         <div className="auth-switch">
//           Already have an account?{" "}
//           <span onClick={() => navigate("/login")}>
//             Login
//           </span>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Register;