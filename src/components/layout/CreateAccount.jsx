import React, { useState } from "react";
import { MdError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FileImageUpload from '../UI/ImageUpload';
import axios from "axios";
import "./CreateAccount.css";


function CreateAccount() {
    const [FirstName, setFirstName] = useState("");
    const [MiddleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [Dateofbirth, setDateofbirth] = useState("")
    const [CurrentAddress, setCurrentAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [panCard, setPanCard] = useState("");
    const [AADHARCard, setAADHARCard] = useState("");
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [AADHARError, setAADHARError] = useState("");
    const [pancardError, setpancardError] = useState("");
    const [imageError, setImageError] = useState("");
    const [Isloading, setIsloading] = useState(false);

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        FirstName: "", 
        MiddleName: "", 
        lastName: "", 
        Dateofbirth:"",
        CurrentAddress: "", 
        phoneNumber: "", 
        panCard: "", 
        AADHARCard: "",
        image: ""
    });
    
    
    const handleImageUpload = (file) => {
        const validationError = validateImage(file);
        if (validationError) {
            setImage(null);
            setImageError(validationError);
        } else {
            setImage(file);
            setImageError("");
        }
    };


    const validatePhone = (value) => {
        setPhoneNumber(value);
        
        const phoneRegex = /^\d{10}$/;
        if (!value) {
          setPhoneError("Phone number is required");
        } else if (!phoneRegex.test(value)) {
          setPhoneError("Please enter a valid 10-digit phone number");
        } else {
          setPhoneError("");
        }
    };
    
    const validateAADHARCard = (value) => {
        setAADHARCard(value);
        
        const AADHARcardRegex = /^\d{12}$/;
        if (!value) {
            setAADHARError("AADHARCard number is required");
        } else if (!AADHARcardRegex.test(value)) {
            setAADHARError("Please enter a valid 12-digit AADHARCard number");
        } else {
            setAADHARError("");
        }
    };

    const validatePancard = (value) => {
        setPanCard(value);
        
        const pancardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!value) {
            setpancardError("PAN card number is required");
        } else if (!pancardRegex.test(value)) {
            setpancardError("Please enter a valid PAN card number (e.g., ABCDE1234F)");
        } else {
            setpancardError("");
        }
    };

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSizeInBytes = 2 * 1024 * 1024; 
    
        if (!file) {
            return "Please upload an image.";
        }
        if (!allowedTypes.includes(file.type)) {
            return "Only JPEG and PNG formats are allowed.";
        }
        if (file.size > maxSizeInBytes) {
            return "Image size must be less than or equal to 2MB.";
        }
        return ""; 
    };
    


    const handleForm = async (e) => {
        e.preventDefault(); 
        
        
        const username = localStorage.getItem('pendingUsername');
        if (!username) {
            alert('Please complete user registration first');
            navigate('/Registration'); 
            return;
        }

        let newErrors = {
            FirstName: "", 
            MiddleName: "", 
            lastName: "", 
            Dateofbirth:"", 
            CurrentAddress: "", 
            phoneNumber:"", 
            panCard:"", 
            AADHARCard:"", 
            image:""
        };
    
        if (!FirstName.trim()) newErrors.FirstName = "Please enter a valid FirstName to continue.";
        if (!MiddleName.trim()) newErrors.MiddleName = "Please enter a valid MiddleName continue.";
        if (!lastName.trim()) newErrors.lastName = "Please enter a valid LastName continue.";
        if (!Dateofbirth.trim()) newErrors.Dateofbirth = "Please enter a valid Date of Birth to continue.";
        if (!CurrentAddress.trim()) newErrors.CurrentAddress = "Please enter a valid Address to continue.";
        if (!phoneNumber.trim()) validatePhone(phoneNumber);
        if (!panCard.trim()) validatePancard(panCard);
        if (!AADHARCard.trim()) validateAADHARCard(AADHARCard);
    
        const imageValidationMsg = validateImage(image);
        if (imageValidationMsg) {
            newErrors.image = imageValidationMsg;
            setImageError(imageValidationMsg);
        } else {
            setImageError("");
        }
    
        setErrors(newErrors);
        const hasErrors = Object.values(newErrors).some(error => error !== "");
        if (hasErrors) return;
    
        try {
            setIsSubmitting(true);
            setIsloading(true);

            const formData = new FormData();
            formData.append('username', username); 
            formData.append('first_name', FirstName);
            formData.append('middle_name', MiddleName);
            formData.append('last_name', lastName);
            formData.append('date_of_birth', Dateofbirth);
            formData.append('current_address', CurrentAddress);
            formData.append('phone_number', phoneNumber);
            formData.append('pan_card', panCard);
            formData.append('aadhar_card', AADHARCard);

            if (image) {
                formData.append('profile_image', image);
            }

            console.log('Sending data:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            
            const response = await axios.post(import.meta.env.VITE_API_CREATE_ACCOUNT_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Server response:', response.data);

            if (response.status === 201) {
                localStorage.removeItem('pendingUsername');
                alert('Account created successfully!');
                navigate('/login'); 
            }

        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert('There was an error submitting the form. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
            setIsloading(false);
        }
    };
    
    return(
        <div className="Account-Container">
            <div className="fromheading">
              <h2>Create Account</h2>
            </div>
            <form onSubmit={handleForm}>
                <div className="Account-from">
                    <div className="input-form">
                        <label>FirstName *</label>
                        <input type="text"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                        {errors.FirstName && <span className="error-message"><MdError />{errors.FirstName}</span>}
                    </div>
                    <div>
                        <label>MiddleName *</label>
                        <input type="text" 
                        value={MiddleName}
                        onChange={(e) => setMiddleName(e.target.value)}/>
                        {errors.MiddleName && <span className="error-message"><MdError />{errors.MiddleName}</span>}
                    </div>
                    <div>
                        <label>LastName *</label>
                        <input type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}/>
                        {errors.lastName && <span className="error-message"><MdError />{errors.lastName}</span>}
                    </div>
                    <div>
                        <label>Date of Birth *</label>
                        <input type="date" 
                        value={Dateofbirth}
                        onChange={(e) => setDateofbirth(e.target.value)} className="date"/>
                        {errors.Dateofbirth && <span className="error-message"><MdError />{errors.Dateofbirth}</span>}
                    </div>
                    <div>
                        <label>Current Address *</label>
                        <input type="text"
                        value={CurrentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)} />
                        {errors.CurrentAddress && <span className="error-message"><MdError />{errors.CurrentAddress}</span>}
                    </div>
                    <div>
                        <label>Phone Number *</label>
                        <input type="text" 
                        value={phoneNumber}
                        onChange={(e) => validatePhone(e.target.value)} 
                        className={phoneError? "input-error" : ""}
                        />
                        {phoneError && <span className="error-message"><MdError />{phoneError}</span>}
                    </div>
                    <div>
                        <label>PanCard Number *</label>
                        <input type="text"
                        value={panCard}
                       onChange={(e) => validatePancard(e.target.value)} 
                       className={pancardError? "input-error" : ""}
                       />
                       {pancardError && <span className="error-message"><MdError />{pancardError}</span>}
                    </div>
                    <div>
                        <label>AADHAR Number *</label>
                        <input type="text" 
                        value={AADHARCard}
                        onChange={(e) => validateAADHARCard(e.target.value)} 
                        className={AADHARError ? "input-error" : ""}/>
                       {AADHARError && <span className="error-message"><MdError />{AADHARError}</span>}
                    </div>                  
                </div>
                <div className="ImageUpload">
                    <label>Profile Image *</label>
                    <FileImageUpload onImageUpload={handleImageUpload} /><br />
                    {imageError && <span className="error-message"><MdError />{imageError}</span>}
                </div>
                <div className="Nextbutton">
                    <button type="submit" id="next" disabled={isSubmitting}>
                        {Isloading ? "Creating Account..." : "NEXT"}
                    </button>
                </div>
            </form>
            <div className="previous" onClick={() => navigate('/Registration')}>Previous</div>
        </div>
    );
}

export default CreateAccount;