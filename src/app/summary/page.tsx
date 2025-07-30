// app/summary/page.tsx

'use client';

import { useEffect, useState } from 'react';

// ✨ 1. ใส่ Webhook URL ของคุณที่นี่
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1400046836131299348/j2g_XnSCSQotXrbQsngY4pKFIFL5wMjetjqCShnugMYijMzcts3imUuo-QwAKPkyd3iD';

// --- CSS Styles for the Summary Page (คงเดิม) ---
const styles = `
  /* ... CSS ทั้งหมดจากโค้ดเดิม ... */
  .summary-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .header-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .send-discord-btn {
    background-color: #5865F2; /* Discord Blurple */
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  .send-discord-btn:hover {
    background-color: #4752C4;
  }
  .send-discord-btn:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
  /* ... ส่วนที่เหลือของ CSS คงเดิม ... */
`;

const ALL_USERS = [
  "Panda Introvertboy", "Autswin Aftershock", "ART Charlotte",
  "Foy Cyril", "Hime Barbatos", "Dave Barbatos", "Beta Overdose",
  "Cherbi Kouzen", "Momo Barbatos", "Argo Baker", "Porch Phetkasem",
  "Jackie Notperfect", "Minnie Classic", "Leon Classic", "Pad Ravenwood",
  "Maboo Monstar", "Teddy Teletla", "Sickboy PhetKasem", "Justwyn Justwyn", "Itar Phetkasem"
];

const toYYYYMMDD = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function DailySummaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [summary, setSummary] = useState<{ checkedIn: any[]; missing: string[] }>({
    checkedIn: [],
    missing: [],
  });
  // ✨ 2. เพิ่ม State สำหรับจัดการสถานะการส่ง
  const [isSending, setIsSending] = useState(false);


  useEffect(() => {
    // ... โค้ดใน useEffect คงเดิม ...
    const allCheckins = JSON.parse(localStorage.getItem('checkins') || '[]');
    const targetDateStr = toYYYYMMDD(selectedDate);
    const todaysCheckins = allCheckins.filter((item: any) => toYYYYMMDD(new Date(item.time)) === targetDateStr);
    const checkedInNames = new Set(todaysCheckins.map((item: any) => item.name));
    const missingNames = ALL_USERS.filter(user => !checkedInNames.has(user));
    setSummary({ checkedIn: todaysCheckins, missing: missingNames });
  }, [selectedDate]);

  // ✨ 3. ฟังก์ชันสำหรับสร้างและส่ง Embed ไปยัง Discord
  const handleSendToDiscord = async () => {
    setIsSending(true);

    const checkedInList = summary.checkedIn.map(item => `- ${item.name}`).join('\n') || 'ไม่มี';
    const missingList = summary.missing.map(name => `- ${name}`).join('\n') || 'ไม่มี (ทุกคน Check-in ครบ)';
    
    const embed = {
      title: `📊 สรุป Check-in ประจำวันที่ ${selectedDate.toLocaleDateString('th-TH', { dateStyle: 'long' })}`,
      color: 3447003, // สีฟ้า
      fields: [
        {
          name: `✅ Check-in แล้ว (${summary.checkedIn.length} คน)`,
          value: "```" + checkedInList + "```", // ใช้ code block เพื่อให้อ่านง่าย
          inline: true,
        },
        {
          name: `❌ ยังไม่ Check-in (${summary.missing.length} คน)`,
          value: "```" + missingList + "```",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'ส่งจากระบบสรุปผล',
      },
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      alert('ส่งข้อมูลสรุปเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Failed to send summary to Discord:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูลสรุป');
    }

    setIsSending(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="summary-container">
        <div className="summary-header">
          <h1>📊 สรุป Check-in รายวัน</h1>
          {/* ✨ 4. จัดกลุ่มปุ่มควบคุม และเพิ่มปุ่มส่ง Discord */}
          <div className="header-controls">
            <input
              type="date"
              className="date-picker"
              value={toYYYYMMDD(selectedDate)}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <button
              className="send-discord-btn"
              onClick={handleSendToDiscord}
              disabled={isSending}
            >
              {isSending ? 'กำลังส่ง...' : '🚀 ส่งสรุปไปที่ Discord'}
            </button>
          </div>
        </div>

        {/* ... ส่วนที่เหลือของ JSX คงเดิม ... */}
        <div className="summary-grid">
           {/* ... */}
        </div>
      </div>
    </>
  );
}