import rateLimit from 'express-rate-limit';

const globalLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 6,
  handler: (req, res) => {
    return res.status(429).json({ message: 'Muitas requisições, tente novamente mais tarde.' });
  }
});

export default globalLimiter;
