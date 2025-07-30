'use client';

import { useState, useMemo } from 'react';

// --- CSS Styles for the new UI ---
const styles = `
  body {
    background-color: #121212;
    color: #E0E0E0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .form-container {
    background-color: #1E1E1E;
    padding: 2rem 2.5rem;
    border-radius: 12px;
    max-width: 550px;
    margin: 2rem auto;
    border: 1px solid #333;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .form-container h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: #FFFFFF;
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: #BBBBBB;
  }
  .form-input, .form-select {
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #2C2C2C;
    color: #E0E0E0;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }
  .file-upload-area {
    border: 2px dashed #444;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
  }
  .file-upload-area:hover {
    border-color: #4A90E2;
    background-color: #2a2a2a;
  }
  .file-upload-area span {
    color: #888;
  }
  .file-upload-input {
    display: none;
  }
  .image-preview {
    margin-top: 1rem;
    text-align: center;
  }
  .image-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid #444;
  }
  .submit-btn {
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
    margin-top: 1rem;
  }
  .submit-btn:hover {
    background-color: #357ABD;
  }
   .submit-btn:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
  .links-container {
    margin-top: 2rem;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  .links-container a {
    color: #4A90E2;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  .links-container a:hover {
    color: #82B3F4;
  }
`;

const USERS = [
  "Panda Introvertboy", "Autswin Aftershock", "ART Charlotte",
  "Foy Cyril", "Hime Barbatos", "Dave Barbatos", "Beta Overdose",
  "Cherbi Kouzen", "Momo Barbatos", "Argo Baker", "Porch Phetkasem",
  "Jackie Notperfect", "Minnie Classic", "Leon Classic", "Pad Ravenwood",
  "Maboo Monstar", "Teddy Teletla", "Sickboy PhetKasem", "Justwyn Justwyn", "Itar Phetkasem"
];

// Helper function to convert a File to a Base64 string for persistent storage
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


export default function CheckinForm() {
  const [name, setName] = useState(USERS[0]);
  const [activity, setActivity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState('รอตรวจสอบ');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a temporary URL for live image preview
  const imagePreviewUrl = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return null;
  }, [image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      alert("กรุณาเลือกรูปภาพก่อนส่ง");
      return;
    }
    setIsSubmitting(true);

    // --- Logic การทำงานยังคงเหมือนเดิม ---

    // 1. ส่งข้อมูลไป Discord
    const webhookUrl = 'https://discord.com/api/webhooks/1400046836131299348/j2g_XnSCSQotXrbQsngY4pKFIFL5wMjetjqCShnugMYijMzcts3imUuo-QwAKPkyd3iD';
    const formData = new FormData();
    formData.append('file', image);
    formData.append('payload_json', JSON.stringify({
      content: `📋 Check-in ใหม่จาก ${name}\nกิจกรรม: ${activity}\nสถานะ: ${status}`
    }));
    await fetch(webhookUrl, { method: 'POST', body: formData });

    // 2. บันทึกข้อมูลลง localStorage (ปรับปรุงให้รูปภาพใช้งานได้จริง)
    const imageBase64 = await toBase64(image); // แปลงรูปเป็น Base64
    const newCheckin = {
      name,
      activity,
      status,
      image: imageBase64, // บันทึกรูปในรูปแบบ Base64
      time: new Date().toISOString()
    };
    const oldData = JSON.parse(localStorage.getItem('checkins') || '[]');
    localStorage.setItem('checkins', JSON.stringify([newCheckin, ...oldData]));

    // 3. แจ้งเตือนและรีเซ็ตฟอร์ม
    alert('ส่งข้อมูลเรียบร้อยแล้ว');
    setActivity('');
    setImage(null);
    setStatus('รอตรวจสอบ');
    setIsSubmitting(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="form-container">
        <h1>✅ ฟอร์ม Check-in</h1>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="user-select">ชื่อผู้ใช้</label>
            <select id="user-select" className="form-select" value={name} onChange={(e) => setName(e.target.value)}>
              {USERS.map(user => <option key={user} value={user}>{user}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activity-input">กิจกรรม</label>
            <input
              id="activity-input"
              className="form-input"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="เช่น ออกกำลังกาย, ทำงาน"
              required
            />
          </div>

          <div className="form-group">
            <label>อัปโหลดรูป</label>
            <label htmlFor="file-upload" className="file-upload-area">
              <span>{image ? `✔️ เลือกไฟล์แล้ว: ${image.name}` : 'คลิกเพื่อเลือกไฟล์ หรือลากมาวาง'}</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="file-upload-input"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              required
            />
            {imagePreviewUrl && (
              <div className="image-preview">
                <img src={imagePreviewUrl} alt="Image preview" />
              </div>
            )}
          </div>

          {/* Status field is hidden for regular users as it's set by default */}
          <input type="hidden" value={status} />
          
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังส่ง...' : '📤 ส่งข้อมูล Check-in'}
          </button>
        </form>

        <div className="links-container">
          <a href={`/history?user=${encodeURIComponent(name)}`}>📄 ดูประวัติของฉัน</a>
          <a href="/admin">🛠️ เข้าสู่ระบบผู้ดูแล</a>
           <a href="/summary">📊 ดูสรุปรายวัน</a>
        </div>
      </div>
    </>
  );
}