import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { FcCurrencyExchange } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "react-otp-input";
import logo1 from "../../assets/logo1.jpg";

function AppHome() {
  const [showOtpInput, setshowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(""); 

  const navigate = useNavigate();

  const isPhoneValid = phoneNumber.length >= 12 && /^[0-9]+$/.test(phoneNumber);
  const isOtpValid = otp.length === 6;

  const handlePhoneNumber = (value) => {
    setPhoneNumber(value);
  };

  const handlePhoneSubmit = (event) => {
    event.preventDefault();
    
    if(!isPhoneValid) {
      alert("Invalid phone number");
      return;
    }
    setshowOtpInput(true);
  };
  
  const onOtpSubmit = () => {
    console.log("Login successfully");
  };

  const renderInput = (props) => {
    return <input {...props} />;
  };

  

  return (
    <div className="container">
      <img src={logo1} alt="Logo" className="logo1" />
      <div className="heading">
        <h2 className="main-heading">
          <FcCurrencyExchange /> Welcome to Money Pay
        </h2>
        <p className="sub-heading">Internet Banking</p>
      </div>
      <div className="userAccount">
        <button onClick={() => navigate("/login")} className="login-btn">
          Login
        </button>
        <FaCircleUser className="user_icon" size={35} onClick={() => navigate("/login")} />
      </div>
      <div className="phone-container">
        <h3>Create Account</h3>
        <h3 className="account-headline">Enter your mobile number</h3>
        <p className="account">
         "To use Vailed, the mobile number linked to your bank account must be correct."
        </p>
        <PhoneInput
          country={"in"}
          value={phoneNumber}
          onChange={handlePhoneNumber}
          inputProps={{
            name: "phone",
            required: true,
            placeholder: "10 Digit Mobile Number",
          }}
        />
        <button className="verify-button" onClick={handlePhoneSubmit} disabled={!isPhoneValid}>
         {showOtpInput ? "Resend" : "Verify"}
        </button>
        {showOtpInput && (
          <div>
            <p className="otpnumber">Enter OTP {phoneNumber}</p>
            <OtpInput 
              value={otp} 
              onChange={setOtp}
              numInputs={6}
              separator={<span>-</span>}
              renderInput={(props) => <input {...props} className="otp-box" />} 
            />
          </div>
        )}
        <button className="proceed" onClick={() => navigate('./Registration')} disabled={!isOtpValid}>
          Proceed
        </button>
        <p className="terms" id="terms-id">
          By proceeding, you agree to the <a href="#">Terms & Conditions</a>.
        </p>    
      </div>
    </div>
  );
}

export default AppHome;
