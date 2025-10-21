import React, { useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page container mt-5">
      <h2 className="title mb-4">Welcome to <span className="brand">ClassMate</span></h2>

      <div className="button-group d-grid gap-3">
        <button className="btn btn-success" onClick={() => handleNavigation('/generate')}>
          Generate New Timetable
        </button>
        
        <button className="btn btn-info" onClick={() => handleNavigation('/faculty')}>
          Faculty Details
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
