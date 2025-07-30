"use client";

import { useState } from 'react';
import Head from 'next/head';
import styles from './styles/Home.module.css';

const USERS = [
  "Panda Introvertboy",
  "Autswin Aftershock",
  "ART Charlotte",
  "Foy Cyril",
  "Hime Barbatos",
  "Dave Barbatos",
  "Beta Overdose",
  "Cherbi Kouzen",
  "Momo Barbatos",
  "Argo Baker",
  "Porch Phetkasem",
  "Jackie Notperfect",
  "Minnie Classic",
  "Leon Classic",
  "Pad Ravenwood",
  "Maboo Monstar",
  "Teddy Teletla",
  "Sickboy PhetKasem",
  "Justwyn Justwyn",
  "Itar Phetkasem",
];

export default function CheckinForm() {
  const [name, setName] = useState(USERS[0]);
  const [activity, setActivity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState('รอตรวจสอบ');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      alert("กรุณาเลือกรูปภาพก่อนส่ง");
      return;
    }

    const webhookUrl = "https://discord.com/api/webhooks/1400046836131299348/j2g_XnSCSQotXrbQsngY4pKFIFL5wMjetjqCShnugMYijMzcts3imUuo-QwAKPkyd3iD";
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "payload_json",
      JSON.stringify({
        content: `📋 Check-in ใหม่จาก ${name}\nกิจกรรม: ${activity}\nสถานะ: ${status}`,
      })
    );

    await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    alert("ส่งข้อมูลเรียบร้อยแล้ว!");
    const existingData = JSON.parse(localStorage.getItem("checkins") || "[]");
    const newData = {
      name,
      activity,
      status,
      image: URL.createObjectURL(image),
      time: new Date().toISOString(),
    };
    localStorage.setItem("checkins", JSON.stringify([newData, ...existingData]));

    setActivity("");
    setImage(null);
    setStatus("รอตรวจสอบ");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Check-in App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>✅ ตรวจสอบการ Check-in</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>ชื่อผู้ใช้</label>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {USERS.map((user) => (
              <option key={user}>{user}</option>
            ))}
          </select>

          <label>กิจกรรม</label>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />

          <label>อัปโหลดรูปภาพยืนยัน</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
              }
            }}
            required
          />

          <label>สถานะ</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>รอตรวจสอบ</option>
            <option>อนุมัติแล้ว</option>
            <option>ไม่อนุมัติ</option>
          </select>

          <button type="submit">📤 ส่งข้อมูล Check-in</button>
        </form>

        <a
          href={`/history?user=${encodeURIComponent(name)}`}
          style={{ color: "#facc15", marginTop: "1rem", display: "inline-block" }}
        >
          ประวัติการ Check-in →
        </a>
        <a
          href="/admin"
          style={{ color: "#facc15", marginTop: "1rem", display: "inline-block" }}
        >
          เข้าสู่ระบบ Admin →
        </a>
      </main>
    </div>
  );
}
