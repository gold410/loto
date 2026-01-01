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
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // שמירת תלמידים במסד נתונים
        console.log('All Excel columns:', Object.keys(data[0] || {}));
        console.log('First 3 rows of Excel:', data.slice(0, 3));
        
        const students = data.map((row, index) => {
            const firstName = row.name || row.Name || row['שם פרטי'] || '';
            const lastName = row.lastName || row.LastName || row['שם משפחה'] || '';
            const fullName = `${firstName} ${lastName}`.trim() || `תלמיד ${index + 1}`;
            
            return {
                name: fullName,
                excelFile: req.file.filename
            };
        });
        
        console.log('Sample student data:', students.slice(0, 3));

        await Student.insertMany(students);

        res.json({ message: 'קובץ נשמר והנתונים הוספו', file: req.file.filename });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בהעלאת קובץ' });
    }
};

// קבלת כל קבצי Excel שנשמרו
const getAllFiles = async (req, res) => {
    try {
        const files = await Student.distinct('excelFile');
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בשליפת קבצים' });
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
        
        // בדיקה אם יש שם לתלמיד
        const winnerName = winner.name || 'תלמיד מספר ' + (students.indexOf(winner) + 1);
        console.log('Winner name:', winnerName);

        // שמירת הזוכה
        const newWinner = new Winner({ name: winnerName, excelFile: filename });
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

