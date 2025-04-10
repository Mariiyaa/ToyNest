import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebaseConfig"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Register = ({ onClose }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone:"",
    address:{// Handle missing phone
    street: "", 
    apartment: "",
    houseNo:  "",
    city: "",
    state: "",
    country:"",
    postalCode: ""}
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister =async (e) => {
    e.preventDefault();
    const {name, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
        await axios.post('/api/auth/register', { name ,email, password});
  
        setSuccess('Signup successful!');
        
        
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    
  };

  const handleGoogleSignup = async () => {
    setError(""); // Reset error state
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
  
      console.log("Google Login ID Token:", idToken); // Check if token is being received
  
      const response = await axios.post(
        '/api/auth/register-google', 
        { firebaseToken: idToken } // Ensure token is sent correctly
      );
  
      if (response.data && response.data.user) {
        console.log("User Email:", response.data.user.email);
      }
    } catch (error) {
      let errorMessage = "Google sign-up failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-[#1572A1] text-center font-comfortaa">Sign Up</h2>

        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div className="flex items-center border rounded px-3 py-2">
            <User className="text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full focus:outline-none ml-2 font-comfortaa"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full focus:outline-none ml-2 font-comfortaa"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full focus:outline-none ml-2 font-comfortaa"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full focus:outline-none ml-2 font-comfortaa"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red font-comfortaa">{error}</p>}
          {success && <p className="text-green font-comfortaa">{success}</p>}
          <button className="bg-[#1572A1] text-white w-full py-2 rounded hover:bg-[#125a80] font-comfortaa">
            Sign Up
          </button>
          
        </form>

        <p className="text-center my-2 font-comfortaa">OR</p>
        <button
          className="bg-red-500 text-white w-full py-2 rounded flex justify-center items-center space-x-2 font-comfortaa"
         onClick={handleGoogleSignup}
        >
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Register;

