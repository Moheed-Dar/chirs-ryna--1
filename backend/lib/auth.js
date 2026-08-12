import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';
const JWT_EXPIRE = '7d';

// Generate JWT Token (✅ tokenVersion add kiya production security ke liye)
export const generateToken = (userId, tokenVersion = 0) => {
  return jwt.sign({ id: userId, tokenVersion }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate Reset Token
export const generateResetToken = () => {
  const resetToken = jwt.sign(
    { 
      code: Math.random().toString(36).substring(2, 8).toUpperCase() 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
  return resetToken;
};