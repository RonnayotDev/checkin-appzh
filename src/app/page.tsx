'use client';

import { useState } from 'react';

const USERS = [
  "Panda Introvertboy", "Autswin Aftershock", "ART Charlotte",
  "Foy Cyril", "Hime Barbatos", "Dave Barbatos", "Beta Overdose",
  "Cherbi Kouzen", "Momo Barbatos", "Argo Baker", "Porch Phetkasem",
  "Jackie Notperfect", "Minnie Classic", "Leon Classic", "Pad Ravenwood",
  "Maboo Monstar", "Teddy Teletla", "Sickboy PhetKasem", "Justwyn Justwyn", "Itar Phetkasem"
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

    const webhookUrl = 'https://discord.com/api/webhooks/xxx'; // แก้ให้ใช้ webhook จริง
    const formData = new FormData();
    formData.append('file', image);
    formData.append('payload_json', JSON.stringify({
      content: `📋 Check-in ใหม่จาก ${name}\nกิจกรรม: ${activity}\nสถานะ: ${status}`
    }));

    await fetch(webhookUrl, {
      method: 'POST',
      body: formData
    });

    const localUrl = URL.createObjectURL(image);
    const newCheckin = {
      name, activity, status,
      image: localUrl,
      time: new Date().toISOString()
    };

    const oldData = JSON.parse(localStorage.getItem('checkins') || '[]');
    localStorage.setItem('checkins', JSON.stringify([newCheckin, ...oldData]));

    alert('ส่งข้อมูลเรียบร้อยแล้ว');
    setActivity('');
    setImage(null);
    setStatus('รอตรวจสอบ');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>✅ ฟอร์ม Check-in</h1>
      <form onSubmit={handleSubmit}>
        <label>ชื่อผู้ใช้</label>
        <select value={name} onChange={(e) => setName(e.target.value)}>
          {USERS.map(user => <option key={user}>{user}</option>)}
        </select>

        <label>กิจกรรม</label>
        <input value={activity} onChange={(e) => setActivity(e.target.value)} required />

        <label>อัปโหลดรูป</label>
        <input type="file" accept="image/*" onChange={(e) => {
          if (e.target.files?.[0]) setImage(e.target.files[0]);
        }} required />

        <label>สถานะ</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>รอตรวจสอบ</option>
          <option>อนุมัติแล้ว</option>
          <option>ไม่อนุมัติ</option>
        </select>

        <button type="submit">📤 ส่งข้อมูล Check-in</button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <a href={`/history?user=${encodeURIComponent(name)}`}>📄 ดูประวัติของฉัน</a><br />
        <a href="/admin">🛠️ เข้าสู่ระบบผู้ดูแล</a>
      </div>
    </div>
  );
}
