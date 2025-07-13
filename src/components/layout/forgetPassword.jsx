import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6'; 
import "./ForgetPassword.css"

function ForgetPassword() {
    const [Email, setEmail] = useState("")
    const [Otp, setOtp] = useState("")
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    const toggleRePassword = () => {
        setShowRePassword(!showRePassword);
    };

    const validateEmail = (value) => {
        setEmail(value);
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            setEmailError("Email is required");
            setIsEmailValid(false);
        } else if (!emailRegex.test(value)) {
            setEmailError("Please enter a valid email address");
            setIsEmailValid(false);
        } else {
            setEmailError("");
            setIsEmailValid(true);
        }
    };
    
    const handleVerifyClick = () => {
        // In a real app, this would call an API to send/resend OTP
        setShowOtpInput(true);
        console.log(`${showOtpInput ? "Resending" : "Sending"} OTP to ${Email}`);
        // Here you would add code to send OTP to the email
    };

    const validateOtp = (value) => {
        setOtp(value);
        
        const otpRegex = /^\d{6}$/;
        if (!value) {
            setOtpError("OTP is required");
        } else if (!otpRegex.test(value)) {
            setOtpError("Please enter a valid 6-digit OTP");
        } else {
            setOtpError("");
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        validateEmail(Email);
        validateOtp(Otp);
        validatePassword(password);
        validateRePassword(rePassword);
        if (!emailError && !otpError && !passwordError && !rePasswordError &&
            Email && Otp && password && rePassword) {
            navigate('/login');
        }
    };

    return (
        <div className="Forget-container">
            <h2 className="forget-head">Forget Password</h2>
            <form className="forget-pass" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email*</label>
                    <input 
                        type="email" 
                        value={Email} 
                        onChange={(e) => validateEmail(e.target.value)} 
                        className={emailError ? "input-error" : ""}
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                </div>
                <button 
                    type="button"
                    className="verify" 
                    disabled={!isEmailValid}
                    onClick={handleVerifyClick}
                >
                    {showOtpInput ? "Resend" : "Verify"}
                </button>
                <div className="form-group">
                    <label>Enter OTP*</label>
                    <input 
                        type="text" 
                        value={Otp} 
                        onChange={(e) => validateOtp(e.target.value)} 
                        className={otpError ? "input-error" : ""}
                    />
                    {otpError && <span className="error-message">{otpError}</span>}
                </div>
                <div className="form-group">
                    <label>Enter Password*</label>
                    <div className="password-field">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => validatePassword(e.target.value)} 
                            className={passwordError ? "input-error" : ""}
                        />
                        <span className="eye1" onClick={togglePassword}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />} 
                        </span>
                    </div>
                    {passwordError && <span className="error-message">{passwordError}</span>}
                </div>
                <div className="form-group">
                    <label>Re-Enter Password*</label>
                    <div className="password-field">
                        <input 
                            type={showRePassword ? "text" : "password"} 
                            value={rePassword} 
                            onChange={(e) => validateRePassword(e.target.value)} 
                            className={rePasswordError ? "input-error" : ""}
                        />
                        <span className="eye2" onClick={toggleRePassword}>
                            {showRePassword ? <FaEye /> : <FaEyeSlash />} 
                        </span>
                    </div>
                    {rePasswordError && <span className="error-message">{rePasswordError}</span>}
                </div>
                <button type="submit" className="submit-button">Change Password</button>
            </form>
        </div>
    )
}

export default ForgetPassword