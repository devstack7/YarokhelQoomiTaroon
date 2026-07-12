import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Vision from './components/Vision';
import Leadership from './components/Leadership';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ShuraMembers from './pages/ShuraMembers';
import ShuraManagement from './pages/ShuraManagement';
import GalleryManagement from './pages/GalleryManagement';
import ContactMessages from './pages/ContactMessages';
import FundsLogin from './pages/FundsLogin';
import FundsDashboard from './pages/FundsDashboard';
import FundsViewer from './pages/FundsViewer';
import PersonManagement from './pages/PersonManagement';
import CategoryManagement from './pages/CategoryManagement';
import Heritage from './pages/Heritage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={
          <div className="App">
            <Navbar />
            <Hero />
            <Stats />
            <About />
            <Vision />
            <Leadership />
            <Gallery />
            <Contact />
            <Footer />
          </div>
        } />
        
        {/* Heritage Page */}
        <Route path="/heritage" element={<Heritage />} />
        
        {/* Admin Routes */}
        <Route path="/yqt-admin/login" element={<AdminLogin />} />
        <Route path="/yqt-admin/dashboard" element={<AdminDashboard />} />
        <Route path="/yqt-admin/shura" element={<ShuraManagement />} />
        <Route path="/yqt-admin/gallery" element={<GalleryManagement />} />
        <Route path="/yqt-admin/messages" element={<ContactMessages />} />
        
        {/* Shura Members Public Page */}
        <Route path="/shura-members" element={<ShuraMembers />} />
        
        {/* Funds Management Routes */}
        <Route path="/funds/login" element={<FundsLogin />} />
        <Route path="/funds/dashboard" element={<FundsDashboard />} />
        <Route path="/funds/view" element={<FundsViewer />} />
        <Route path="/funds/persons" element={<PersonManagement />} />
        <Route path="/funds/categories" element={<CategoryManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
