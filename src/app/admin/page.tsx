"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem("checkins") || "[]");
    setRecords(allData);
  }, []);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...records];
    updated[index].status = newStatus;
    setRecords(updated);
    localStorage.setItem("checkins", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "2rem", color: "white", background: "#121212" }}>
      <h1>🛠️ หน้าผู้ดูแลระบบ</h1>
      {records.length === 0 ? (
        <p>ไม่มีข้อมูล Check-in</p>
      ) : (
        <ul>
          {records.map((item, index) => (
            <li key={index} style={{ marginBottom: "1.5rem", borderBottom: "1px solid gray", paddingBottom: "1rem" }}>
              <strong>ชื่อ:</strong> {item.name}<br />
              <strong>กิจกรรม:</strong> {item.activity}<br />
              <strong>เวลา:</strong> {new Date(item.time).toLocaleString()}<br />
              <strong>สถานะ:</strong>{" "}
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
                <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
              </select>
              {item.image && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img src={item.image} alt="uploaded" width={200} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}