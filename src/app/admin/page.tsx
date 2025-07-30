'use client';
import { useEffect, useState } from 'react';

const ADMIN_PASSWORD = 'bbt191'; // 🔒 กำหนดรหัสผ่านที่นี่
// ✨ 1. ใส่ Webhook URL ของคุณที่นี่
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1400046836131299348/j2g_XnSCSQotXrbQsngY4pKFIFL5wMjetjqCShnugMYijMzcts3imUuo-QwAKPkyd3iD';

// --- CSS Styles for Admin Page (คงเดิม) ---
const styles = `
  body {
    background-color: #121212;
    color: #E0E0E0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  /* ... CSS ทั้งหมดจากโค้ดเดิม ... */
  .admin-page-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  .admin-header h1 {
    font-size: 1.8rem;
    color: #FFFFFF;
  }
  .logout-btn {
    background-color: #F44336;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  .logout-btn:hover {
    background-color: #D32F2F;
  }
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  .login-box {
    background-color: #1E1E1E;
    padding: 2.5rem;
    border-radius: 12px;
    border: 1px solid #333;
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  .login-box h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  .login-input {
    width: 100%;
    padding: 0.8rem 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #2C2C2C;
    color: #E0E0E0;
    font-size: 1rem;
  }
  .login-button {
    width: 100%;
    padding: 0.9rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: #FFFFFF;
    background-color: #4A90E2;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .login-button:hover {
    background-color: #357ABD;
  }
  .admin-card {
    background-color: #1E1E1E;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    align-items: start;
  }
  .admin-card-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #2C2C2C;
  }
  .admin-card-details p {
    margin: 0 0 0.8rem 0;
  }
  .status-select {
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #2C2C2C;
    color: #E0E0E0;
    font-size: 0.9rem;
  }
  .no-records {
    color: #888;
    text-align: center;
    padding: 3rem;
  }
`;

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin-auth');
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
      sessionStorage.setItem('admin-auth', 'true');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('admin-auth');
  };

  // ✨ 2. แก้ไขฟังก์ชันนี้ให้เป็น async และเพิ่มการส่งแจ้งเตือน
  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedRecords = [...records];
    const updatedRecord = updatedRecords[index];
    
    // อัปเดตสถานะใน object
    updatedRecord.status = newStatus;
    
    // อัปเดต State และ localStorage
    setRecords(updatedRecords);
    localStorage.setItem('checkins', JSON.stringify(updatedRecords));

    // ✨ 3. สร้างข้อความและส่งแจ้งเตือนไปยัง Discord
    const notificationMessage = `🔔 **[Admin]** อัปเดตสถานะ Check-in\n👤 **ผู้ใช้:** ${updatedRecord.name}\n📝 **กิจกรรม:** ${updatedRecord.activity}\n✅ **สถานะใหม่:** ${newStatus}`;

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: notificationMessage,
            }),
        });
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
        // สามารถแจ้งเตือนผู้ใช้ว่าส่งไม่สำเร็จได้ (ทางเลือก)
        // alert('ไม่สามารถส่งการแจ้งเตือนไปยัง Discord ได้');
    }
  };

  // --- ส่วนของ JSX ทั้งหมดคงเดิม ไม่มีการเปลี่ยนแปลง ---
  if (!isAuthorized) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-container">
          <div className="login-box">
            <h2>🔐 เข้าสู่ระบบผู้ดูแล</h2>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="ใส่รหัสผ่าน"
              className="login-input"
            />
            <button onClick={handleLogin} className="login-button">เข้าสู่ระบบ</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page-container">
        <div className="admin-header">
          <h1>🛠️ ระบบผู้ดูแล</h1>
          <button onClick={handleLogout} className="logout-btn">ออกจากระบบ</button>
        </div>
        {records.length === 0 ? (
          <p className="no-records">ยังไม่มีรายการ Check-in</p>
        ) : (
          <div>
            {records.map((item, i) => (
              <div key={i} className="admin-card">
                <div className="admin-card-image">
                   {item.image && <img src={item.image} alt="uploaded" />}
                </div>
                <div className="admin-card-details">
                  <p><strong>ชื่อ:</strong> {item.name}</p>
                  <p><strong>กิจกรรม:</strong> {item.activity}</p>
                  <p>
                    <strong>เวลา:</strong>{' '}
                    {new Date(item.time).toLocaleString('th-TH', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                  </p>
                  <p>
                    <strong>สถานะ:</strong>{' '}
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(i, e.target.value)}
                      className="status-select"
                    >
                      <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                      <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
                      <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                    </select>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}