import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smart_hundi_secret_key_2026';

// Default Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword123',
  name: 'Sri Temple Chief Administrator',
  role: 'SUPER_ADMIN'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      { username: ADMIN_CREDENTIALS.username, role: ADMIN_CREDENTIALS.role, name: ADMIN_CREDENTIALS.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Admin credentials! Use: admin / adminpassword123'
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
});

export default router;
