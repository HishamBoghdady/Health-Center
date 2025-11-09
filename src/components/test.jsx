import React, { useState, useMemo } from "react";
import { TextField } from "@mui/material";

export default function PatientTable({ patient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("");
  const [filtredDate, setFiltredDate] = useState({ start: "", end: "" });

  // ----------------- الفلترة -----------------
  const filteredPatients = useMemo(() => {
    return patient.filter((p) => {
      // البحث بالاسم
      const matchName = p.PersonalData.Name.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

      // فلترة الحالة
      const matchCondition =
        selected === ""
          ? true
          : p.EnteryData.Condition.toLowerCase().includes(
              selected.toLowerCase()
            );

      // فلترة بالتاريخ
      if (filtredDate.start && filtredDate.end) {
        // ✅ EntryTime بصيغة ISO (صالح لـ new Date)
        const entryDate = new Date(p.EnteryData.EntryTime);
        const startDate = new Date(filtredDate.start);
        const endDate = new Date(filtredDate.end);

        // إزالة الوقت للمقارنة الصحيحة
        entryDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const matchDate = entryDate >= startDate && entryDate <= endDate;
        return matchName && matchCondition && matchDate;
      }

      return matchName && matchCondition;
    });
  }, [patient, searchTerm, selected, filtredDate]);

  // ----------------- الواجهة -----------------
  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {/* البحث بالاسم */}
        <TextField
          label="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* فلترة الحالة */}
        <TextField
          label="Condition"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        />

        {/* تاريخ البداية */}
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={filtredDate.start}
          onChange={(e) =>
            setFiltredDate({ ...filtredDate, start: e.target.value })
          }
        />

        {/* تاريخ النهاية */}
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={filtredDate.end}
          onChange={(e) =>
            setFiltredDate({ ...filtredDate, end: e.target.value })
          }
        />
      </div>

      {/* ✅ جدول عرض البيانات */}
      <table border="1" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Entry Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((p, i) => (
              <tr key={i}>
                <td>{p.PersonalData.Name}</td>
                <td>{p.EnteryData.Condition}</td>
                <td>{p.EnteryData.EntryTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
