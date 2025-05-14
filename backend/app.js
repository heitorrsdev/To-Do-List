import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());
app.use("/api", taskRoutes);

// Conecte ao banco
mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado ao MongoDB");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch(err => console.error("Erro ao conectar no MongoDB", err));
