import { useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import Register from "./Register";
import axios from 'axios';
import { auth } from "../firebaseConfig"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = ({ onClose }) => {
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();



  const saveUserToSessionStorage = (userData) => {
    if (userData) {
      sessionStorage.clear(); // Clear previous data to allow multiple users
      sessionStorage.setItem("user", JSON.stringify({
        _id: userData.userId || "",
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        
        address:{// Handle missing phone
        street: userData.address?.street || "", 
        apartment: userData.address?.apartment || "",
        houseNo: userData.address?.houseNo || "",
        city: userData.address?.city || "",
        state: userData.address?.state || "",
        country: userData.address?.country || "",
        postalCode: userData.address?.postalCode || ""}
      }));
      
    } else {
      console.error("userData is undefined or null");
    }
  };
  

  const handleLogin =async (e) => {
    e.preventDefault();
    try {
       const response=  await axios.post('/api/auth/login', { email, password});
  
        
        saveUserToSessionStorage(response.data);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
  };

  const handleGoogleLogin =async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      console.log("Google Login ID Token:", idToken);
      const response = await axios.post(`${process.env.REACT_APP_BACK_PORT}/api/auth/login-google`, { firebaseToken: idToken });
      setSuccess('Login successful!');
      console.log(response.data)
      saveUserToSessionStorage(response.data); // Store user in localStorage
      

    } catch (error) {
      console.error(error);
      setError("Google login failed.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-[#1572A1] text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full focus:outline-none ml-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full focus:outline-none ml-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red">{error}</p>}
          {success && <p className="text-green">{success}</p>}
          <button className="bg-[#1572A1] text-white w-full py-2 rounded hover:bg-[#125a80]"
          >
            Login
          </button>
        </form>

        <p className="text-center my-2">OR</p>
        <button
          className="bg-red-500 text-white w-full py-2 rounded flex justify-center items-center space-x-2"
          onClick={handleGoogleLogin}
        >
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
          <span>Login with Google</span>
        </button>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <button onClick={() => setShowRegister(true)} className="text-[#1572A1] font-semibold focus:outline-none">
            Sign up
          </button>
          {showRegister && <Register onClose={() => {setShowRegister(false) } } />}
        </p>
      </div>
    </div>
  );
};

export default Login;
