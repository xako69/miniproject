import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ClassActions.css';


export default function ClassActions() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Class Actions</h2>
      <div className="d-grid gap-3">
        <button className="btn btn-primary" onClick={() => navigate(`/view-timetable/${id}`)}>View Timetable</button>
        <button className="btn btn-warning" onClick={() => navigate(`/edit-timetable/${id}`)}>Edit Timetable</button>
        <button className="btn btn-danger" onClick={() => alert("Delete timetable logic here")}>Delete Timetable</button>
        <button className="btn btn-success" onClick={() => alert("Download timetable logic here")}>Download Timetable</button>
      </div>
    </div>
  );
}
