import React, { useState} from 'react';
import {useContext} from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6'; 
import { MdError } from "react-icons/md";
import { FcCurrencyExchange } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import logo2 from "../../assets/logo2.jpg";
import "./login.css";
import AuthContext from '../../context/Authcontext';
import { useNavigate } from "react-router-dom";



function Login() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", phoneNumber: "" }); 
  const [otp, setOtp] = useState(""); 
  const [showOtpInput, setshowOtpInput] = useState(false);
  const [Isloading, setIsloading] = useState(false);
  const [loginError, setloginError] = useState("");

  const navigate = useNavigate();
  

  let {loginUser} = useContext(AuthContext)

  
  
  const isPhoneValid = phoneNumber.length >= 12 && /^[0-9]+$/.test(phoneNumber);
  const isOtpValid = otp.length === 6;
  

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

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


  const handleLogin = async (e) => {
    e.preventDefault(); 
    let newErrors = { UserName: "", password: "" };

    if (!UserName.trim()) {
      newErrors.UserName = "Please enter a valid Email to continue.";
    }
    if (!password.trim()) {
      newErrors.password = "Please enter a valid Password.";
    }

    setErrors(newErrors);

    if (!newErrors.user && !newErrors.password) {
      setIsloading(true);
      setloginError("")
      try {
        const success = await loginUser(e)
      } catch (error) {
        setloginError("An error occurred during login");
      } finally {
        setIsloading(false);
      }

    }
  };
  
  return (
    <div className='container-form'>
      <img src={logo2} alt="Logo" className="logo2" />
      <div className="headline">
      <h2 className="main-heading"><FcCurrencyExchange /> MoneyPay</h2>
      </div>
      <div>
        {isLoginActive ? (
          <div className="auth-tab">
            <form onSubmit={(e) => handleLogin(e)}>

              <h3>Login to your account</h3> 
              <label>User Name: </label>
              <input
                type="text"
                placeholder="Enter User Name"
                value={UserName}
                name='username'
                onChange={(e) => setUserName(e.target.value)}
                className={errors.UserName ? "error-border" : ""}
              />
              {errors.UserName && <span className="error-text"><MdError />{errors.UserName}</span>}

              <label>Password: </label>
              <div className="password-container">
                <input 
                  id="password-container"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "error-border" : ""}
                />
                
                <span className="eye-icon" onClick={handleClick}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />} 
                </span>
                {errors.password && <span className="error-text"><MdError />{errors.password}</span>}
              </div>

              <div className="btn">
                <button className="forgetpass" onClick={() => navigate("/forgetPassword")}>FORGET PASSWORD?</button>
                <button id="loginbutton" type="submit">
                  {Isloading ? "Loggedin..." : "LOG IN"}
                </button> 
              </div>
              <button id='withPhone' type='button' 
                onClick={() => setIsLoginActive(false)}>LOG IN WITH PHONE</button>
            </form>
          </div>
        ) : (
          <div className="toggle-phone">
            <form>
              <h3>Login to your account</h3>
              <label>Phone no.</label>
              <PhoneInput
                country={"in"}
                value={phoneNumber}
                onChange={handlePhoneNumber}
                className={errors.phoneNumber ? "error-border" : ""}
                inputProps={{
                  name: "phone",
                  required: true,
                  placeholder: "10 Digit Mobile Number",
                }}
              />
              <div className="btn-phone">
                <button id="otp-button" type="submit" onClick={handlePhoneSubmit} disabled={!isPhoneValid}>GET OTP</button>
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
                      <button className="comfirm" disabled={!isOtpValid} onClick={() => navigate('/mainhome')}>COMFIRM</button>
                    </div>
                 )}
                <button id="email-button" type="button"
                  onClick={() => setIsLoginActive(true)}>
                  LOG IN WITH UserName
                </button> 
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;