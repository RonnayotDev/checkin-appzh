'use client';
import { useEffect, useState } from 'react';

const ADMIN_PASSWORD = '1234'; // 🔒 กำหนดรหัสผ่านที่นี่

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin-auth');
    if (savedAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const data = JSON.parse(localStorage.getItem('checkins') || '[]');
      setRecords(data);
    }
  }, [isAuthorized]);

  const handleLogin = () => {
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      localStorage.setItem('admin-auth', 'true'); // ✅ จำการล็อกอินไว้
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...records];
    updated[index].status = newStatus;
    setRecords(updated);
    localStorage.setItem('checkins', JSON.stringify(updated));
  };

  if (!isAuthorized) {
    return (
      <div style={{ padding: '2rem', background: '#121212', color: 'white' }}>
        <h2>🔐 เข้าสู่ระบบผู้ดูแล</h2>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="ใส่รหัสผ่าน"
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <button onClick={handleLogin}>เข้าสู่ระบบ</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#121212', color: 'white' }}>
      <h1>🛠️ ระบบผู้ดูแล</h1>
      {records.length === 0 ? (
        <p>ไม่มีรายการ</p>
      ) : (
        <ul>
          {records.map((item, i) => (
            <li
              key={i}
              style={{
                marginBottom: '1rem',
                borderBottom: '1px solid gray',
                paddingBottom: '1rem',
              }}
            >
              <p>
                <strong>ชื่อ:</strong> {item.name}
              </p>
              <p>
                <strong>กิจกรรม:</strong> {item.activity}
              </p>
              <p>
                <strong>เวลา:</strong>{' '}
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>สถานะ:</strong>{' '}
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(i, e.target.value)}
                >
                  <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                  <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
                  <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                </select>
              </p>
              {item.image && (
                <img
                  src={item.image}
                  width={200}
                  alt="uploaded"
                  style={{ marginTop: '0.5rem', borderRadius: '8px' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
