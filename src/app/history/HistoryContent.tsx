'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HistoryContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const storedData = localStorage.getItem('checkins');
    const checkins = storedData ? JSON.parse(storedData) : [];
    const filteredData = checkins.filter((item: any) => item.name === user);
    setFiltered(filteredData);
  }, [user]);

  if (!user) {
    return <div>ไม่พบชื่อผู้ใช้งาน</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>ประวัติของ {user}</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map((item, index) => (
          <li key={index} style={{ marginBottom: '1rem', background: '#eee', padding: '1rem', borderRadius: '8px' }}>
            <div><strong>กิจกรรม:</strong> {item.activity}</div>
            <div><strong>สถานะ:</strong> {item.status}</div>
            <div><strong>เวลา:</strong> {item.timestamp}</div>
            {item.image && <img src={item.image} alt="upload" width={100} style={{ marginTop: '0.5rem' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
