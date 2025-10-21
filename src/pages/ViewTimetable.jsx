// src/pages/ViewTimetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];

const ViewTimetable = () => {
  const [timetables, setTimetables] = useState([]);

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/timetables/");
      setTimetables(res.data);
    } catch (error) {
      console.error("Failed to load timetables:", error);
    }
  };

  // 📌 Download as PDF
  const handleDownloadPDF = (timetable) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(
      `Timetable - ${timetable.class_obj?.name || "Class"} (${timetable.name})`,
      14,
      15
    );

    // Table header
    const head = [["Day", ...PERIODS]];

    // Table body
    const body = DAYS.map((day) => [
      day,
      ...timetable.data[day].map((cell) =>
        cell.subject
          ? `${cell.subject}${
              cell.is_lab
                ? " [Lab]"
                : cell.is_mini
                ? " [Mini Project]"
                : cell.is_tutorial
                ? " [Tutorial]"
                : ""
            }\n${cell.faculty ? cell.faculty.name : ""}`
          : "-"
      ),
    ]);

    // Generate table
    doc.autoTable({
      startY: 25,
      head: head,
      body: body,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] }, // blue header
      styles: { fontSize: 9, cellPadding: 2 },
    });

    // Save PDF
    doc.save(`Timetable_${timetable.class_obj?.name || "Class"}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Saved Timetables</h2>

      {timetables.length === 0 ? (
        <p className="text-center text-gray-600">No timetables saved yet.</p>
      ) : (
        timetables.map((t, idx) => (
          <div
            key={idx}
            className="mb-10 border rounded-lg shadow-md p-4 bg-white"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-700">
                {t.class_obj?.name || "Class"} — {t.name}
              </h3>
              <button
                onClick={() => handleDownloadPDF(t)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
              >
                📥 Download PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-400 w-full text-sm text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 px-2 py-1">Day</th>
                    {PERIODS.map((p) => (
                      <th
                        key={p}
                        className="border border-gray-400 px-2 py-1"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day) => (
                    <tr key={day}>
                      <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-100">
                        {day}
                      </td>
                      {t.data[day].map((cell, pIdx) => (
                        <td
                          key={pIdx}
                          className={`border border-gray-400 px-2 py-1 ${
                            cell.is_lab
                              ? "bg-yellow-100"
                              : cell.is_mini
                              ? "bg-red-100"
                              : cell.is_tutorial
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <div className="font-medium">{cell.subject}</div>
                          {cell.faculty && (
                            <div className="text-xs text-gray-500">
                              {cell.faculty.name}
                            </div>
                          )}
                          {cell.is_lab && <div className="text-xs">[Lab]</div>}
                          {cell.is_mini && (
                            <div className="text-xs">[Mini Project]</div>
                          )}
                          {cell.is_tutorial && (
                            <div className="text-xs">[Tutorial]</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewTimetable;
