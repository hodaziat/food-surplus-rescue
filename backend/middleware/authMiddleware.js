const jwt = require('jsonwebtoken');

// 1. التحقق من وجود الـ Token وتطابق التشفير
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Zugriff verweigert. Kein Token bereitgestellt.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Ungültiges oder abgelaufenes Token.' });
  }
};

// 2. التحقق من أن المستخدم لديه صلاحية الأدمن
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.is_admin)) {
      next();
    } else {
      res.status(403).json({ message: 'Zugriff verweigert. Nur für Administratoren.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };