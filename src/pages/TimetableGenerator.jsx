import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TimetableGenerator.css";
import { useNavigate } from "react-router-dom";
import { writeFileXLSX, utils } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function TimetableGenerator() {
  const [classList, setClassList] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all classes from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/classes/")
      .then((res) => {
        const initialSelection = {};
        (res.data || []).forEach((cls) => {
          initialSelection[cls.id] = { selected: false, tutorial: false };
        });
        setSelectedClasses(initialSelection);
        setClassList(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
      });
  }, []);

  // Handle class selection checkbox
  const handleSelectClass = (clsId) => {
    setSelectedClasses((prev) => ({
      ...prev,
      [clsId]: {
        ...prev[clsId],
        selected: !prev[clsId].selected,
        tutorial: prev[clsId].selected ? false : prev[clsId].tutorial,
      },
    }));
  };

  // Generate timetables
  const handleGenerate = async () => {
    const classesToSend = classList
      .filter((cls) => selectedClasses[cls.id]?.selected)
      .map((cls) => ({
        id: cls.id,
        tutorial: selectedClasses[cls.id]?.tutorial || false,
      }));

    if (classesToSend.length === 0) {
      alert("⚠️ Select at least one class");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/timetables/generate/",
        { classes: classesToSend }
      );

      setTimetables(res.data.timetables || []);
      alert("✅ Timetables generated successfully!");
    } catch (err) {
      console.error("Generate error:", err.response?.data || err);
      alert(
        `❌ Failed to generate timetable: ${
          err.response?.data?.error || "Server error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Download all timetables as Excel
  const downloadExcel = () => {
    if (timetables.length === 0) return;

    const wb = utils.book_new();

    timetables.forEach((tt) => {
      const ws_data = [];
      const header = ["Day / Period", "P1", "P2", "P3", "P4", "P5", "P6", "P7"];
      ws_data.push(header);

      Object.entries(tt.data || {}).forEach(([day, periods]) => {
        const row = [day, ...periods.map((p) => p.subject || "-")];
        ws_data.push(row);
      });

      const ws = utils.aoa_to_sheet(ws_data);
      utils.book_append_sheet(wb, ws, tt.class_name);
    });

    writeFileXLSX(wb, "All_Timetables.xlsx");
  };

  // Download all timetables as PDF
  const downloadPDF = () => {
    if (timetables.length === 0) return;

    const doc = new jsPDF();

    timetables.forEach((tt, index) => {
      if (index > 0) doc.addPage();
      doc.text(tt.class_name, 14, 15);

      const tableColumn = ["Day / Period", "P1", "P2", "P3", "P4", "P5", "P6", "P7"];
      const tableRows = [];

      Object.entries(tt.data || {}).forEach(([day, periods]) => {
        const row = [day, ...periods.map((p) => p.subject || "-")];
        tableRows.push(row);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
    });

    doc.save("All_Timetables.pdf");
  };

  return (
    <div className="timetable-container">
      <div className="back-container">
        <button className="back-button" onClick={() => navigate("/home")}>
          ⬅ Back to Home
        </button>
      </div>

      <h1>📅 Advanced Timetable Generator</h1>

     {/* Class selection with only "Select" checkbox */}
<div className="input-group">
  <label>Select Classes:</label>
  <table className="class-selection-table">
    <thead>
      <tr>
        <th>Class</th>
        <th>Select</th>
      </tr>
    </thead>
    <tbody>
      {classList.map((cls) => (
        <tr key={cls.id}>
          <td>{cls.name}</td>
          <td>
            <input
              type="checkbox"
              checked={selectedClasses[cls.id]?.selected || false}
              onChange={() => handleSelectClass(cls.id)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Generate button */}
      <button
        className="generate-btn"
        onClick={handleGenerate}
        disabled={loading || Object.values(selectedClasses).every((c) => !c.selected)}
      >
        {loading ? "⏳ Generating..." : "🚀 Generate Timetables"}
      </button>

      {/* Timetable display */}
      {timetables.length > 0 &&
        timetables.map((tt, i) => (
          <div key={i} className="tt-card">
            <h3>{tt.class_name}</h3>
            <table className="tt-table">
              <thead>
                <tr>
                  <th>Day / Period</th>
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <th key={idx}>P{idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tt.data || {}).map(([day, periods]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    {periods.map((p, idx) => (
                      <td
                        key={idx}
                        className={
                          p.is_lab
                            ? "lab-period"
                            : p.is_tutorial
                            ? "tutorial-period"
                            : ""
                        }
                      >
                        <strong>{p.subject || "-"}</strong>
                        <br />
                        <small>{p.faculty_name || p.faculty || "N/A"}</small>
                        {p.is_lab && " [Lab]"}
                        {p.is_tutorial && " [Tutorial]"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* Download buttons */}
      {timetables.length > 0 && (
        <div className="download-btns">
          <button onClick={downloadPDF}>📄 Download All PDF</button>
          <button onClick={downloadExcel}>📊 Download All Excel</button>
        </div>
      )}
    </div>
  );
}
