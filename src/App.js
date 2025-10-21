import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/adminlogin.jsx';
import Home from './pages/Home.jsx'; // You can create this later
import FacultyDetails from './pages/FacultyDetails.jsx';
import TimetableGenerator from './pages/TimetableGenerator.jsx';
import ShowClasses from "./pages/ShowClasses.jsx";
import ClassActions from "./pages/ClassActions.jsx";
import ViewTimetable from "./pages/ViewTimetable.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty" element={<FacultyDetails />} />
        <Route path="/generate" element={<TimetableGenerator />} /> {/* ✅ New route */}
        <Route path="/classes" element={<ShowClasses />} />
        <Route path="/class/:id" element={<ClassActions />} />
       <Route path="/view-timetable/:id" element={<ViewTimetable />} /> 
      </Routes>
    </Router>
  );
}

export default App;
