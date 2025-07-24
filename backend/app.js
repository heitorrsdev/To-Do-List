import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import rateLimiter from './middlewares/rateLimiter.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use(rateLimiter);

app.use('/api', userRoutes);
app.use('/api', taskRoutes);

// Conexão com o banco
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Conectado ao MongoDB');
  app.listen(3000, () => console.log('Servidor rodando na porta 3000\n'));
}).catch(err => console.error('Erro ao conectar no MongoDB', err));
