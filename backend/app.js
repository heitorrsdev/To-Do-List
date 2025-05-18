import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// Conexão com o banco
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Conectado ao MongoDB");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch(err => console.error("Erro ao conectar no MongoDB", err));
