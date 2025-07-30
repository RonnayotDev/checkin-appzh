// pages/admin.tsx
"use client"

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const password = prompt("กรุณาใส่รหัสผ่านเพื่อเข้าถึงหน้า Admin:");
    if (password === "1234admin") { // ✅ เปลี่ยนรหัสผ่านตามที่ต้องการ
      setAuthenticated(true);
      const data = JSON.parse(localStorage.getItem('checkins') || '[]');
      setCheckins(data);
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
      window.location.href = "/"; // กลับหน้าแรกถ้ารหัสผิด
    }
  }, []);

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updated = [...checkins];
    updated[index].status = newStatus;
    setCheckins(updated);
    localStorage.setItem('checkins', JSON.stringify(updated));

    const webhookUrl = "https://discord.com/api/webhooks/1400046836131299348/j2g_XnSCSQotXrbQsngY4pKFIFL5wMjetjqCShnugMYijMzcts3imUuo-QwAKPkyd3iD";

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `📢 สถานะ Check-in ของ ${updated[index].name} ถูกเปลี่ยนเป็น: **${newStatus}**\nกิจกรรม: ${updated[index].activity}`,
      }),
    });

    alert('อัปเดตสถานะและส่งแจ้งเตือนแล้ว');
  };

  if (!authenticated) {
    return null; // ยังไม่แสดงอะไรจนกว่าจะผ่าน auth
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📋 ระบบจัดการ Check-in (Admin)</h1>
      {checkins.length === 0 ? (
        <p>ไม่มีข้อมูล Check-in</p>
      ) : (
        checkins.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>ชื่อ:</strong> {item.name}</p>
            <p><strong>กิจกรรม:</strong> {item.activity}</p>
            <p><strong>สถานะ:</strong> {item.status}</p>
            <img src={item.image} alt="check-in" style={{ maxWidth: '200px', marginTop: '1rem' }} />

            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => handleStatusChange(index, 'อนุมัติแล้ว')} style={{ marginRight: '1rem', background: '#4ade80', padding: '0.5rem 1rem' }}>
                ✅ อนุมัติ
              </button>
              <button onClick={() => handleStatusChange(index, 'ไม่อนุมัติ')} style={{ background: '#f87171', padding: '0.5rem 1rem' }}>
                ❌ ไม่อนุมัติ
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
