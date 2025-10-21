import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/faculty.css";

const FacultyDashboard = () => {
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isLab, setIsLab] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const [weight, setWeight] = useState(1);

  // Editing states
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingFacultyName, setEditingFacultyName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingSubjectName, setEditingSubjectName] = useState("");
  const [editingSubjectFaculty, setEditingSubjectFaculty] = useState("");
  const [editingSubjectClass, setEditingSubjectClass] = useState("");
  const [editingIsLab, setEditingIsLab] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(false);
  const [editingWeight, setEditingWeight] = useState(1);

  useEffect(() => {
    fetchFaculties();
    fetchClasses();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/faculty/");
      setFaculties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/classes/");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFaculty = async () => {
    if (!facultyName) return alert("Enter faculty name");
    try {
      await axios.post("http://127.0.0.1:8000/api/faculty/", { name: facultyName });
      setFacultyName("");
      fetchFaculties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    if (!subjectName || !selectedFaculty || !selectedClass) return alert("Fill all fields");
    try {
      await axios.post("http://127.0.0.1:8000/api/subjects/", {
        name: subjectName,
        faculty: selectedFaculty,
        class_obj: selectedClass,
        is_lab: isLab,
        tutorial: tutorial,
        weight: weight,
      });
      setSubjectName("");
      setSelectedFaculty("");
      setSelectedClass("");
      setIsLab(false);
      setTutorial(false);
      setWeight(1);
      fetchFaculties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty? This will also delete all associated subjects.")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/faculty/${id}/`);
      fetchFaculties();
    } catch (err) {
      console.error(err);
      alert("Error deleting faculty. Please try again.");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}/`);
      fetchFaculties();
    } catch (err) {
      console.error(err);
    }
  };

  // Faculty Edit
  const handleEditFaculty = (faculty) => {
    setEditingFaculty(faculty.id);
    setEditingFacultyName(faculty.name);
  };

  const handleUpdateFaculty = async () => {
    if (!editingFacultyName) return alert("Enter faculty name");
    try {
      await axios.put(`http://127.0.0.1:8000/api/faculty/${editingFaculty}/`, {
        name: editingFacultyName
      });
      setEditingFaculty(null);
      setEditingFacultyName("");
      fetchFaculties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEditFaculty = () => {
    setEditingFaculty(null);
    setEditingFacultyName("");
  };

  // Subject Edit
  const handleEditSubject = (subject) => {
    setEditingSubject(subject.id);
    setEditingSubjectName(subject.name);
    setEditingSubjectFaculty(subject.faculty?.id || subject.faculty);
    setEditingSubjectClass(subject.class_obj?.id);
    setEditingIsLab(subject.is_lab);
    setEditingTutorial(subject.tutorial);
    setEditingWeight(subject.weight || 1);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubjectName || !editingSubjectFaculty || !editingSubjectClass) {
      return alert("Fill all fields");
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/subjects/${editingSubject}/`, {
        name: editingSubjectName,
        faculty: editingSubjectFaculty,
        class_obj: editingSubjectClass,
        is_lab: editingIsLab,
        tutorial: editingTutorial,
        weight: editingWeight,
      });
      setEditingSubject(null);
      setEditingSubjectName("");
      setEditingSubjectFaculty("");
      setEditingSubjectClass("");
      setEditingIsLab(false);
      setEditingTutorial(false);
      setEditingWeight(1);
      fetchFaculties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEditSubject = () => {
    setEditingSubject(null);
    setEditingSubjectName("");
    setEditingSubjectFaculty("");
    setEditingSubjectClass("");
    setEditingIsLab(false);
    setEditingTutorial(false);
    setEditingWeight(1);
  };

  return (
    <div className="faculty-container">
      <div className="dashboard-header">
        <h1>Faculty & Subjects Dashboard</h1>
        <button className="back-button" onClick={() => navigate("/home")}>⬅ Back to Home</button>
      </div>

      {/* Add Faculty */}
      <div className="faculty-form">
        <input
          type="text"
          placeholder="Faculty Name"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
        />
        <button onClick={handleAddFaculty}>Add Faculty</button>
      </div>

      {/* Add Subject */}
      <div className="faculty-form">
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
          <option value="">Select Faculty</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isLab}
            onChange={(e) => setIsLab(e.target.checked)}
          />
          Is Lab
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={tutorial}
            onChange={(e) => setTutorial(e.target.checked)}
          />
          Has Tutorial
        </label>
        <div className="weight-input">
          <label>Weight:</label>
          <input
            type="number"
            min={1}
            max={10}
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
          />
        </div>
        <button onClick={handleAddSubject}>Add Subject</button>
      </div>

      {/* Faculty Cards */}
      {faculties.map((faculty) => (
        <div className="faculty-card" key={faculty.id}>
          <div className="faculty-header">
            {editingFaculty === faculty.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingFacultyName}
                  onChange={(e) => setEditingFacultyName(e.target.value)}
                  className="edit-input"
                />
                <div className="form-actions">
                  <button className="save-btn" onClick={handleUpdateFaculty}>Save</button>
                  <button className="cancel-btn" onClick={handleCancelEditFaculty}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="faculty-title">
                <h3>{faculty.name}</h3>
                <div className="faculty-actions">
                  <button className="edit-btn" onClick={() => handleEditFaculty(faculty)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteFaculty(faculty.id)}>Delete Faculty</button>
                </div>
              </div>
            )}
          </div>

          {/* Subjects List */}
          <div className="subjects-list">
            {(faculty.subjects || []).length > 0 ? (
              (faculty.subjects || []).map((subject) => (
                <div key={subject.id} className="subject-tag">
                  {editingSubject === subject.id ? (
                    <div className="subject-edit-form">
                      <input
                        type="text"
                        value={editingSubjectName}
                        onChange={(e) => setEditingSubjectName(e.target.value)}
                        placeholder="Subject Name"
                        className="edit-input"
                      />
                      <select 
                        value={editingSubjectFaculty} 
                        onChange={(e) => setEditingSubjectFaculty(e.target.value)}
                        className="edit-input"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                      <select 
                        value={editingSubjectClass} 
                        onChange={(e) => setEditingSubjectClass(e.target.value)}
                        className="edit-input"
                      >
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editingIsLab}
                          onChange={(e) => setEditingIsLab(e.target.checked)}
                        />
                        Is Lab
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editingTutorial}
                          onChange={(e) => setEditingTutorial(e.target.checked)}
                        />
                        Has Tutorial
                      </label>
                      <div className="weight-input">
                        <label>Weight:</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={editingWeight}
                          onChange={(e) => setEditingWeight(parseInt(e.target.value) || 1)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-actions">
                        <button className="save-btn" onClick={handleUpdateSubject}>Save</button>
                        <button className="cancel-btn" onClick={handleCancelEditSubject}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="subject-content">
                      <span className="subject-info">
                        {subject.name} ({subject.class_obj?.name}) 
                        {subject.is_lab ? " (Lab)" : ""} 
                        {subject.tutorial ? " (Tutorial)" : ""} 
                        [Weight: {subject.weight}]
                      </span>
                      <div className="subject-actions">
                        <button className="edit-btn" onClick={() => handleEditSubject(subject)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <span className="no-subjects">No subjects</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacultyDashboard;
