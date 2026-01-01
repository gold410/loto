const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    excelFile: String, // שם הקובץ שממנו הגיע
});

module.exports = mongoose.model('Student', studentSchema);
