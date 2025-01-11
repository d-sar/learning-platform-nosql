const express = require('express');
const router = express.Router();

const courseRoutes = require('./courseRoutes');
const studentRoutes = require('./studentRoutes');

router.use('/courses', courseRoutes);
//router.use('/students', studentRoutes);

module.exports = router;
