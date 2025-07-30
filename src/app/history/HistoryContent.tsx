'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// --- CSS Styles for the History Page ---
const styles = `
  body {
    background-color: #121212;
    color: #E0E0E0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .history-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  .history-container h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: #FFFFFF;
  }
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .history-card {
    background-color: #1E1E1E;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    overflow: hidden;
  }
  .card-image {
    flex-shrink: 0;
  }
  .card-image img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #2C2C2C;
  }
  .card-content {
    flex-grow: 1;
  }
  .card-content p {
    margin: 0 0 0.75rem 0;
    color: #BBBBBB;
    font-size: 1rem;
  }
  .card-content p strong {
    color: #E0E0E0;
    min-width: 80px;
    display: inline-block;
  }
  .card-content .activity {
    font-size: 1.2rem;
    font-weight: bold;
    color: #FFFFFF;
    margin-bottom: 1rem;
  }
   .status-approved { color: #4CAF50; }
   .status-rejected { color: #F44336; }
   .status-pending { color: #FFC107; }

  .no-data {
    text-align: center;
    color: #888;
    margin-top: 3rem;
    font-size: 1.1rem;
  }
`;

// Helper function to get status color
const getStatusClass = (status: string) => {
    if (status === 'อนุมัติแล้ว') return 'status-approved';
    if (status === 'ไม่อนุมัติ') return 'status-rejected';
    return 'status-pending'; // รอตรวจสอบ
}

export default function HistoryContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const all = JSON.parse(localStorage.getItem('checkins') || '[]');
      const result = all.filter((item: any) => item.name === user);
      setFiltered(result);
    }
  }, [user]);

  if (!user) return <div className="no-data">ไม่พบชื่อผู้ใช้ที่ระบุ</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="history-container">
        <h2>📜 ประวัติของ {user}</h2>
        {filtered.length === 0 ? (
          <p className="no-data">ยังไม่มีข้อมูล Check-in สำหรับผู้ใช้นี้</p>
        ) : (
          <div className="history-list">
            {filtered.map((item, idx) => (
              <div key={idx} className="history-card">
                {item.image && (
                  <div className="card-image">
                    <img src={item.image} alt={`Activity: ${item.activity}`} />
                  </div>
                )}
                <div className="card-content">
                  <p className="activity">{item.activity}</p>
                  <p>
                    <strong>สถานะ:</strong>
                    <span className={getStatusClass(item.status)}>{item.status}</span>
                  </p>
                  <p>
                    <strong>เวลา:</strong>
                    {new Date(item.time).toLocaleString('th-TH', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
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