import User from "../models/User.js";
import bcrypt from "bcryptjs";
import isValidEmail from "../utils/validation.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ message: "Preencha todos os campos" });
    if (isValidEmail(email)) return res.status(400).json({ message: "Email inválido" });

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) return res.status(400).json({ message: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro no registro" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const match = await bcrypt.compare(password, user.password);

    if (!user || !match) return res.status(400).json({ message: "Credenciais inválidas" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
};

