import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa6'; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./registration.css"

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [UserName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [userError, setuserError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePassword = () => {
    setShowRePassword(!showRePassword);
  };

  const validatePhone = (value) => {
    setPhone(value);
    
    const phoneRegex = /^\d{10}$/;
    if (!value) {
      setPhoneError("Phone number is required");
    } else if (!phoneRegex.test(value)) {
      setPhoneError("Please enter a valid 10-digit phone number");
    } else {
      setPhoneError("");
    }
  };

  const validateUser = (value) => {
    setUserName(value);

    if (!value) {
      setuserError("UserName is required");
    } else {
      setuserError(""); 
    }
  }

  const validatePassword = (value) => {
    setPassword(value);
    
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
    
    if (rePassword && value !== rePassword) {
      setRePasswordError("Passwords do not match");
    } else if (rePassword) {
      setRePasswordError("");
    }
  };

  const validateRePassword = (value) => {
    setRePassword(value);
    
    if (!value) {
      setRePasswordError("Please confirm your password");
    } else if (value !== password) {
      setRePasswordError("Passwords do not match");
    } else {
      setRePasswordError("");
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    validateUser(UserName);
    validatePhone(phone);
    validatePassword(password);
    validateRePassword(rePassword);

    if (
      userError || phoneError || passwordError || rePasswordError ||
      !UserName || !phone || !password || !rePassword
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        username: UserName,
        phone_number: phone,
        password: password,
        password2: rePassword,
      };

      console.log('Sending registration data:', payload);

      const response = await axios.post(import.meta.env.VITE_REGISTER_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log('Registration response:', response.data);

      if (response.status === 200) {
        localStorage.setItem('pendingUsername', UserName);
        alert("Registration successful! Please complete your account details.");
        navigate("/CreateAccount");
      }

    } catch (error) {
      console.error('Registration error:', error); 
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessage = "";

        for (let field in errorData) {
          if (Array.isArray(errorData[field])) {
            errorMessage += `${field}: ${errorData[field].join(" ")}\n`;
          } else {
            errorMessage += `${field}: ${errorData[field]}\n`;
          }
        }

        alert("Registration failed:\n" + errorMessage);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="Reg-heading">
        <h2>Registration</h2>
      </div>
      <form className="registration-from" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>UserName*</label>
          <input 
            type="text" 
            value={UserName} 
            onChange={(e) => validateUser(e.target.value)} 
            className={userError ? "input-error" : ""}
          />
          {userError && <span className="error-message">{userError}</span>}
        </div>
        
        <div className="form-group">
          <label>Phone No*</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => validatePhone(e.target.value)} 
            className={phoneError ? "input-error" : ""}
          />
          {phoneError && <span className="error-message">{phoneError}</span>}
        </div>
        
        <div className="form-group">
          <label>Enter Password*</label>
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => validatePassword(e.target.value)}
              className={passwordError ? "input-error" : ""}
            />
            <span className="eye-icon1" onClick={togglePassword}>
              {showPassword ? <FaEye /> : <FaEyeSlash />} 
            </span>
          </div>
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        
        <div className="password-container">
          <label>Re-Enter Password*</label>
          <div className="password-input-container">
            <input 
              type={showRePassword ? "text" : "password"}
              value={rePassword} 
              onChange={(e) => validateRePassword(e.target.value)}
              className={rePasswordError ? "input-error" : ""}
            />
            <span className="eye-icon2" onClick={toggleRePassword}>
              {showRePassword ? <FaEye /> : <FaEyeSlash />} 
            </span>
          </div>
          {rePasswordError && <span className="error-message">{rePasswordError}</span>}
        </div>
        
       <div className="re-btn">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
       <button className="previous-btn" onClick={() => navigate('/')}>Previous</button>
    </div>
  );
}

export default Registration;