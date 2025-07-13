import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppHome from "./components/layout/Home";  
import Login from "./components/layout/login";
import CreateAccount from "./components/layout/CreateAccount";
import Registration from "./components/layout/Registration-from";
import ForgetPassword from "./components/layout/forgetPassword";
import MainHome from "./components/layout/MainHome";
import PrivateRoute from "./utils/privateRoute";
import { AuthProvider } from "./context/Authcontext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/MainHome" element={<MainHome />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
