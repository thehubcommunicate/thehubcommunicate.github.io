import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Space from "./pages/Space";
import About from "./pages/About";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import AIAssistant from "./components/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space" element={<Space />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/community" element={<Community />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
