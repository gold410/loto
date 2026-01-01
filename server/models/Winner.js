const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now },
    excelFile: String, // הקובץ ממנו נבחר
});

module.exports = mongoose.model('Winner', winnerSchema);
