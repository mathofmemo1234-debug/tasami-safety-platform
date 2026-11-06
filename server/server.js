import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'tasami.sqlite');
const db = new DatabaseSync(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    sector TEXT,
    service_type TEXT,
    notes TEXT,
    status TEXT DEFAULT 'جديد',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_type TEXT NOT NULL,
    area_sqm REAL,
    floors INTEGER,
    hazard_level TEXT,
    estimated_cost REAL,
    contact_phone TEXT,
    contact_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ SQLite Database initialized at:', dbPath);

// Routes
// 1. Submit consultation request
app.post('/api/consultations', (req, res) => {
  try {
    const { name, company, email, phone, sector, service_type, notes } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'الاسم، البريد الإلكتروني، ورقم الجوال حقول مطلوبة.' });
    }

    const stmt = db.prepare(`
      INSERT INTO consultations (name, company, email, phone, sector, service_type, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, company || '', email, phone, sector || 'عام', service_type || 'استشارة عامة', notes || '');

    res.status(201).json({
      success: true,
      message: 'تم استلام طلب الاستشارة بنجاح، سيتواصل معكم فريقنا الاستشاري خلال 24 ساعة.',
      consultationId: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('Error in /api/consultations:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة الطلب.' });
  }
});

// 2. Get all consultations (for management / admin view)
app.get('/api/consultations', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM consultations ORDER BY id DESC LIMIT 50`);
    const rows = stmt.all();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'فشل استرجاع طلبات الاستشارة.' });
  }
});

// 3. Submit contact message
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'الاسم، البريد الإلكتروني، والرسالة حقول مطلوبة.' });
    }

    const stmt = db.prepare(`
      INSERT INTO messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, phone || '', subject || 'استفسار عام', message);

    res.status(201).json({
      success: true,
      message: 'شكراً لتواصلك معنا، تم استلام رسالتك وسنرد في أقرب وقت.',
      messageId: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('Error in /api/messages:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرسالة.' });
  }
});

// 4. Save safety calculator quote
app.post('/api/quotes', (req, res) => {
  try {
    const { project_type, area_sqm, floors, hazard_level, estimated_cost, contact_phone, contact_name } = req.body;
    const stmt = db.prepare(`
      INSERT INTO quotes (project_type, area_sqm, floors, hazard_level, estimated_cost, contact_phone, contact_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      project_type || 'تجاري',
      Number(area_sqm) || 0,
      Number(floors) || 1,
      hazard_level || 'متوسط',
      Number(estimated_cost) || 0,
      contact_phone || '',
      contact_name || ''
    );

    res.status(201).json({
      success: true,
      quoteId: Number(result.lastInsertRowid),
      message: 'تم حفظ التقدير الأولي بنجاح.'
    });
  } catch (error) {
    console.error('Error in /api/quotes:', error);
    res.status(500).json({ error: 'فشل حفظ التقدير.' });
  }
});

// 5. System stats summary
app.get('/api/stats', (req, res) => {
  try {
    const consultCount = db.prepare('SELECT COUNT(*) as count FROM consultations').get().count;
    const msgCount = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;
    const quoteCount = db.prepare('SELECT COUNT(*) as count FROM quotes').get().count;

    res.json({
      activeClients: 500,
      completedProjects: 1200,
      yearsExperience: 10,
      consultationsSubmitted: consultCount,
      messagesReceived: msgCount,
      quotesCalculated: quoteCount
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإحصاءات.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Tasami Backend API running on http://localhost:${PORT}`);
});
