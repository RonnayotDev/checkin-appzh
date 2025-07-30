"use client";

import { useEffect, useState } from "react";

type CheckinData = {
  name: string;
  activity: string;
  status: string;
  image: string;
  time: string;
};

export default function HistoryPage() {
  const [data, setData] = useState<CheckinData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("checkins");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return (
    <main style={styles.container}>
      <h1 style={styles.header}>📋 ประวัติการ Check-in</h1>
      {data.length === 0 ? (
        <p>ยังไม่มีข้อมูล</p>
      ) : (
        data.map((item, idx) => (
          <div key={idx} style={styles.card}>
            <img src={item.image} alt="uploaded" style={styles.image} />
            <p><b>ชื่อ:</b> {item.name}</p>
            <p><b>กิจกรรม:</b> {item.activity}</p>
            <p><b>สถานะ:</b> {item.status}</p>
            <p><small>{new Date(item.time).toLocaleString()}</small></p>
          </div>
        ))
      )}
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "white",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "sans-serif"
  },
  header: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem"
  },
  card: {
    background: "#1e1e1e",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem"
  },
  image: {
    maxWidth: "100%",
    borderRadius: "6px",
    marginBottom: "1rem"
  }
};
