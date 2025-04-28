import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar/Navbar";
import { Form } from "./Components/form/Form";
import Videos from "./Components/testimonialVideos/Testimonial";
import TrainerAdmin from "./Components/Admin-panel/Form";
import TrainerShowcase from "./Components/TrainersPanel/Trainershowcase";
import TestimonialAdminPanel from "./Components/Admin-panel/Testimonial";
import ConsultationSection from "./Components/Hero/SectionB";
import Hero from "./Components/Hero/Hero";
import StuckSection from "./Components/Hero/Stuck";
import Owner from "./Components/Hero/Owner";
import Footer from "./Components/Hero/Footer";

function HomePage() {
  
  

  return (
    <>
      <Navbar />
      <Hero/>
      <StuckSection/>
     
     
      <ConsultationSection/>
      
      
      <Owner/>
      <Footer/>
      
    </>
  );
}

function Mycard(){
  return(



    <>
    <Videos />
    <Form />
    <TrainerShowcase/>
    <Footer/>
    </>
  )
}

function AdminPage() {
  return (
    <>
      <TrainerAdmin/>
      <TestimonialAdminPanel/>
      
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
