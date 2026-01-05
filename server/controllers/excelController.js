const XLSX = require('xlsx');
const Student = require('../models/Student');
const Winner = require('../models/Winner');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// הגדרת Multer להעלאת קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// העלאת קובץ Excel חדש
const uploadExcel = async (req, res) => {
    try {
        console.log('Starting file upload:', req.file.filename);
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // שמירת תלמידים במסד נתונים
        console.log('All Excel columns:', Object.keys(data[0] || {}));
        console.log('First 3 rows of Excel:', data.slice(0, 3));
        
        const students = data.map((row, index) => {
        let firstName = (row.include('שם'),row['שם'] || row.firstName || row.first_name || row.name || row.Name || '').toString().trim();
        let lastName = (row.include('משפחה'),row['משפחה'] || row.lastName || row.last_name || row.LastName || '').toString().trim();


            // אם יש רק שדה אחד עם שם מלא - נפריד לשם פרטי ומשפחה לפי רווח אחרון
            if (!lastName && firstName) {
                const parts = firstName.split(/\s+/).filter(Boolean);
                if (parts.length > 1) {
                    lastName = parts.slice(-1).join(' ');
                    firstName = parts.slice(0, -1).join(' ');
                }
            }

            // אם עדיין אין שם: נסה לחלץ שם מכל הערכים בשורה (כל העמודות)
            if (!firstName && !lastName) {
                const combined = Object.values(row)
                    .map(v => v == null ? '' : v.toString().trim())
                    .filter(Boolean)
                    .join(' ');
                if (combined) {
                    const parts = combined.split(/\s+/).filter(Boolean);
                    if (parts.length > 1) {
                        firstName = parts.slice(0, -1).join(' ');
                        lastName = parts.slice(-1).join(' ');
                    } else {
                        firstName = combined;
                        lastName = '';
                    }
                }
            }

            const fullName = `${firstName} ${lastName}`.trim() || `תלמיד ${index + 1}`;

            return {
                firstName,
                lastName,
                name: fullName,
                excelFile: req.file.filename
            };
        });
        console.log('All Excel columns:', Object.keys(data[0] || {}));
        console.log('First row:', data[0]);

        console.log('Sample student data:', students.slice(0, 3));
        console.log('Total students to insert:', students.length);

        await Student.insertMany(students);
        console.log('Successfully inserted students for file:', req.file.filename);

        res.json({ message: 'קובץ נשמר והנתונים הוספו', file: req.file.filename });
    } catch (err) {
        console.error('Error in uploadExcel:', err);
        res.status(500).json({ error: 'שגיאה בהעלאת קובץ: ' + err.message });
    }
};

// קבלת כל קבצי Excel שנשמרו
const getAllFiles = async (req, res) => {
    try {
        console.log('Getting all files...');
        const files = await Student.distinct('excelFile');
        console.log('Found files:', files);
        res.json(files);
    } catch (err) {
        console.error('Error in getAllFiles:', err);
        res.status(500).json({ error: 'שגיאה בשליפת קבצים: ' + err.message });
    }
};

// מחיקת קובץ Excel כולל תלמידים שלו
const deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;

        // מחיקת תלמידים מקובץ זה
        await Student.deleteMany({ excelFile: filename });

        // מחיקת הקובץ עצמו
        fs.unlinkSync(path.join(__dirname, '../uploads', filename));

        res.json({ message: 'קובץ נמחק בהצלחה' });
    } catch (err) {
        res.status(500).json({ error: 'שגיאה במחיקת הקובץ' });
    }
};

// בחירת זוכה רנדומלי מקובץ מסוים
const drawWinner = async (req, res) => {
    try {
        const { filename } = req.params;
        console.log('Drawing winner for file:', filename);
        
        const students = await Student.find({ excelFile: filename });
        console.log('Found students:', students.length);
        
        if (students.length === 0) return res.status(404).json({ error: 'אין תלמידים בקובץ זה' });

        const winner = students[Math.floor(Math.random() * students.length)];
        console.log('Selected winner:', winner);
        
        // בנייה של שם מלא מתוך שדות firstName/lastName אם קיימים
        let winnerName = `${(winner.firstName || '').trim()} ${(winner.lastName || '').trim()}`.trim();

        // אם אין first/last - נסה להשתמש ב-name
        if (!winnerName && winner.name) {
            const parts = winner.name.split(/\s+/).filter(Boolean);
            if (parts.length > 1) {
                winner.firstName = parts.slice(0, -1).join(' ');
                winner.lastName = parts.slice(-1).join(' ');
            } else {
                winner.firstName = winner.name;
                winner.lastName = '';
            }
            winnerName = winner.name;
        }

        // אם עדיין אין שם - נסה לחלץ מכל שדה פנימי שעשוי להכיל טקסט
        if (!winnerName) {
            const combined = Object.keys(winner)
                .map(k => (winner[k] == null ? '' : winner[k].toString().trim()))
                .filter(Boolean)
                .join(' ');
            if (combined) {
                const parts = combined.split(/\s+/).filter(Boolean);
                if (parts.length > 1) {
                    winner.firstName = parts.slice(0, -1).join(' ');
                    winner.lastName = parts.slice(-1).join(' ');
                } else {
                    winner.firstName = combined;
                    winner.lastName = '';
                }
                winnerName = `${winner.firstName} ${winner.lastName}`.trim();
            }
        }

        // אם אין שום דבר - נוחתים לברירת מחדל (ונרשום לוג עזר)
        if (!winnerName) {
            console.warn('No name found for selected winner. Students count:', students.length, 'Selected winner doc:', winner);
            winnerName = 'תלמיד מספר ' + (students.indexOf(winner) + 1);
        }
        
        // תיקון אותיות עבריות שגויות
        winnerName = winnerName.replace(/\u05E0\u05BC/g, 'ן'); // נ + דגש -> ן
        winnerName = winnerName.replace(/\u05DE\u05BC/g, 'ם'); // מ + דגש -> ם
        winnerName = winnerName.replace(/\u05DB\u05BC/g, 'ך'); // כ + דגש -> ך
        winnerName = winnerName.replace(/\u05E4\u05BC/g, 'ף'); // פ + דגש -> ף
        winnerName = winnerName.replace(/\u05E6\u05BC/g, 'ץ'); // צ + דגש -> ץ
        // תיקון תווים נוספים
        winnerName = winnerName.replace(/\u05DC/g, 'ל'); // ל
        winnerName = winnerName.replace(/\u05E0/g, 'נ'); // נ
        winnerName = winnerName.replace(/\u05DE/g, 'מ'); // מ
        // החלפת תווים בעייתיים ישירות
        winnerName = winnerName.replace(/[\u05DC-\u05E0]/g, (match) => {
            const code = match.charCodeAt(0);
            if (code === 1508) return 'ן'; // תיקון ישיר לקוד 1508
            if (code === 1491) return 'ן'; // תיקון ישיר לקוד 1491
            return match;
        });
        // תיקון כללי לתווים לא עבריים שאמורים להיות ן
        winnerName = winnerName.replace(/[^\u0590-\u05FF\u0020-\u007F]/g, (match) => {
            // אם זה תו לא עברי ולא אנגלי, נחליף ל-ן
            return 'ן';
        });
        
        console.log('Winner name after correction:', winnerName);

        // שמירת הזוכה עם שדות firstName/lastName
        const newWinner = new Winner({
            name: winnerName,
            firstName: winner.firstName || '',
            lastName: winner.lastName || '',
            excelFile: filename
        });
        await newWinner.save();
        console.log('Saved winner:', newWinner);

        res.json({ name: winnerName, excelFile: filename, date: newWinner.date });
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בבחירת זוכה' });
    }
};

// מחיקת כל התלמידים (לבדיקה)
const deleteAllStudents = async (req, res) => {
    try {
        await Student.deleteMany({});
        res.json({ message: 'כל התלמידים נמחקו' });
    } catch (err) {
        res.status(500).json({ error: 'שגיאה במחיקה' });
    }
};

// סקריפט מיגרציה: השלם שדות firstName/lastName מבסיס הנתונים הקיים
const migrateStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        let updated = 0;
        for (const s of students) {
            let changed = false;

            // אם חסרים first/last אבל יש name - נפרק
            if ((!s.firstName || !s.lastName) && s.name) {
                const parts = s.name.split(/\s+/).filter(Boolean);
                if (parts.length > 1) {
                    if (!s.firstName) s.firstName = parts.slice(0, -1).join(' ');
                    if (!s.lastName) s.lastName = parts.slice(-1).join(' ');
                    changed = true;
                } else {
                    if (!s.firstName) s.firstName = s.name;
                    if (!s.lastName) s.lastName = '';
                    changed = true;
                }
            }

            // אם יש first/last אבל אין name - נבנה
            if (!s.name && (s.firstName || s.lastName)) {
                s.name = `${s.firstName || ''} ${s.lastName || ''}`.trim();
                changed = true;
            }

            if (changed) {
                await s.save();
                updated++;
            }
        }
        res.json({ message: `Updated ${updated} students` });
    } catch (err) {
        console.error('Error in migrateStudents:', err);
        res.status(500).json({ error: 'שגיאה במיגרציה' });
    }
};

// שליפת כל הזוכים
const getAllWinners = async (req, res) => {
    try {
        const winners = await Winner.find().sort({ date: -1 });
        res.json(winners);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בשליפת הזוכים' });
    }
};

module.exports = {
    uploadExcel,
    upload,
    getAllFiles,
    deleteFile,
    drawWinner,
    getAllWinners,
    deleteAllStudents
};

