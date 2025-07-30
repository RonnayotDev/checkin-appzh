"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("user");
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem("checkins") || "[]");
    if (username) {
      const userData = allData.filter((item: any) => item.name === username);
      setRecords(userData);
    }
  }, [username]);

  return (
    <div style={{ padding: "2rem", color: "white", background: "#121212" }}>
      <h1>📜 ประวัติการ Check-in ของ {username}</h1>
      {records.length === 0 ? (
        <p>ไม่พบข้อมูล</p>
      ) : (
        <ul>
          {records.map((item, index) => (
            <li key={index} style={{ marginBottom: "1rem" }}>
              <strong>กิจกรรม:</strong> {item.activity}<br />
              <strong>สถานะ:</strong> {item.status}<br />
              <strong>เวลา:</strong> {new Date(item.time).toLocaleString()}<br />
              {item.image && (
                <img src={item.image} alt="uploaded" width={150} style={{ marginTop: "0.5rem" }} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
