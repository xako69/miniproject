import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/ShowClasses.css';
import { useNavigate } from "react-router-dom";

export default function ShowClasses() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/classes/");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="container mt-5">
      <h2>Available Classes</h2>
      <ul className="list-group">
        {classes.map((c) => (
          <li
            key={c.id}
            className="list-group-item list-group-item-action"
            onClick={() => handleClassClick(c.id)}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
