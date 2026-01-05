const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    name: String, // שמור גם מחרוזת מלאה לנוחות ותאימות לאחור
    excelFile: String, // שם הקובץ שממנו הגיע
});

module.exports = mongoose.model('Student', studentSchema);
