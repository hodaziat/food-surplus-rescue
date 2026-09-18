const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Food Surplus Rescue Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});