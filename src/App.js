import React from 'react';
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

function App() {
  return (
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
  );
}

export default App;
