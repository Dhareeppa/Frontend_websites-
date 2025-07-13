Money Pay 💸

Money Pay is a modern, responsive banking application built with React. It provides users with a seamless interface for account creation, authentication, money transfers, and transaction history management. With a focus on user experience and security, it leverages JWT-based authentication and integrates with a backend API for robust functionality.
📑 Table of Contents

Features
Demo
Technologies
Project Structure
Installation
Usage
API Endpoints
Contributing
License
Contact

✨ Features

User Registration: Create an account with username, phone number, and password.
KYC Account Creation: Submit detailed information (name, address, PAN, AADHAR, profile image).
Login Options: Sign in using username/password or phone number with OTP.
Forgot Password: Reset passwords via email-based OTP verification.
Dashboard: 
View account details (name, balance, account number).
Send and receive money.
Check current balance.
Track transaction history.


Responsive UI: Built with Tailwind CSS and custom styles for cross-device compatibility.
Secure Authentication: Uses JWT tokens for secure API interactions.

🎥 Demo
(Add a link to a live demo if available, e.g., hosted on Vercel, Netlify, or a video walkthrough)Live Demo | Video Walkthrough
🛠 Technologies

Frontend: React 18, React Router, Context API
HTTP Client: Axios
UI Components: React Icons, React Phone Input, React OTP Input
Styling: Tailwind CSS, Custom CSS
Build Tool: Vite
Dependencies:
react-phone-input-2
react-otp-input
axios
react-icons



📂 Project Structure
Frontend_websites-/
├── src/
│   ├── assets/                     # Images (logo1.jpg, logo2.jpg)
│   ├── context/                    # Authentication context
│   │   └── Authcontext.jsx
│   ├── components/                 # React components
│   │   ├── Home.jsx                # Landing page
│   │   ├── login.jsx               # Login page
│   │   ├── Registration-from.jsx   # Registration form
│   │   ├── CreateAccount.jsx       # Account creation with KYC
│   │   ├── forgetPassword.jsx      # Password reset
│   │   ├── MainHome.jsx            # User dashboard
│   │   ├── UI/
│   │   │   └── ImageUpload.jsx     # Image upload component
│   ├── css/                        # Component-specific styles
│   │   ├── MainHome.css
│   │   ├── login.css
│   │   ├── registration.css
│   │   ├── CreateAccount.css
│   │   ├── ForgetPassword.css
├── .env                            # Environment variables
├── package.json
├── vite.config.js
├── README.md

🚀 Installation

Clone the Repository:
git clone https://github.com/Dhareeppa/Frontend_websites-.git
cd Frontend_websites-


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory with the following:
VITE_API_CREATE_ACCOUNT_URL=<backend-api-create-account-url>
VITE_USER_LOGGED_API_URL=<backend-api-user-data-url>
VITE_RECEIVE_TRANSACTION_API_URL=<backend-api-receive-transaction-url>
VITE_GET_TRANSACTION_API_URL=<backend-api-transaction-history-url>
VITE_TRANSACTION_SEND_API_URL=<backend-api-send-transaction-url>


Run the Application:
npm run dev

Open http://localhost:5173 in your browser.

Build for Production:
npm run build



🖥 Usage

Home Page: Enter a phone number and verify with OTP to start account creation.
Registration: Provide username, phone number, and password.
Account Creation: Complete KYC details (name, address, PAN, AADHAR, profile image).
Login: Use username/password or phone number with OTP to log in.
Forgot Password: Reset password via email OTP verification.
Dashboard:
Account Details: View user info and balance.
Send Money: Transfer funds to another account.
Receive Money: View incoming transactions.
Check Balance: See current account balance.
Transaction History: Review all transactions.



🔗 API Endpoints
The application interacts with a backend API via the following endpoints (configured in .env):

VITE_API_CREATE_ACCOUNT_URL: Register and create user account.
VITE_USER_LOGGED_API_URL: Fetch logged-in user data.
VITE_RECEIVE_TRANSACTION_API_URL: Retrieve received transactions.
VITE_GET_TRANSACTION_API_URL: Fetch transaction history.
VITE_TRANSACTION_SEND_API_URL: Send money to another account.

Note: Ensure the backend API is running and endpoints are correctly configured.
🤝 Contributing
We welcome contributions! Follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

Please read CONTRIBUTING.md for more details (if available).
📜 License
This project is licensed under the MIT License.
📬 Contact

Repository: github.com/Dhareeppa/Frontend_websites-
Issues: Report a bug or feature request
Author: Dhareeppa (GitHub)


Built with 💖 using React and Vite. Happy banking!