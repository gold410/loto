const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController');
const { upload } = excelController;

router.post('/upload', upload.single('file'), excelController.uploadExcel);
router.get('/files', excelController.getAllFiles);
router.delete('/files/:filename', excelController.deleteFile);
router.delete('/students/all', excelController.deleteAllStudents);

router.get('/draw/:filename', excelController.drawWinner);
router.get('/winners', excelController.getAllWinners);

module.exports = router;
