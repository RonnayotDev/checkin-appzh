'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HistoryContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('checkins') || '[]');
    const result = all.filter((item: any) => item.name === user);
    setFiltered(result);
  }, [user]);

  if (!user) return <div>ไม่พบชื่อผู้ใช้</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📜 ประวัติของ {user}</h2>
      {filtered.length === 0 ? <p>ยังไม่มีข้อมูล</p> :
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {filtered.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '1rem', background: '#eee', padding: '1rem' }}>
              <p><strong>กิจกรรม:</strong> {item.activity}</p>
              <p><strong>สถานะ:</strong> {item.status}</p>
              <p><strong>เวลา:</strong> {new Date(item.time).toLocaleString()}</p>
              {item.image && <img src={item.image} width={200} />}
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
