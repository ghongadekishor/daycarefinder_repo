import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Footer from "./components/Footer";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Landing from "./pages/Landing";
import Header from "./components/Header";
import Reviews from "./pages/Reviews";
import Activities from "./pages/Activities";
import Admission from "./pages/Admission";
import KidsDashboard from "./pages/KidsDashboard";
import DayCareDashboard from "./pages/DayCareDashboard";
import DaycareRegistration from "./pages/DaycareRegistration";


const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        <Route path="/admin-panel" element={<AdminPanel/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/reviews/:id" element={<Reviews/>}/>
        <Route path="/activities/:id" element={<Activities/>}/>
        <Route path="/admission/:id" element={<Admission/>}/>
        <Route path="/kids-dashboard" element={<KidsDashboard/>}/>
        <Route path="/daycare-dashboard/:id" element={<DayCareDashboard/>}/>
        <Route path="/daycare-registration" element={<DaycareRegistration/>}/>
      </Routes>
    </Router>
    <Footer/>
    <ToastContainer />
    </React.Fragment>
  );
}

export default App;
