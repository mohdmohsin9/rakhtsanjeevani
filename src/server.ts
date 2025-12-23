import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import connectDB from './config/db';
import languageRoutes from './routes/language.routes';
import profileRoutes from './routes/profile.routes';
import bloodRequestRoutes from './routes/bloodRequest.routes';

const app = express();
const PORT = process.env.PORT || 4000;


connectDB();

app.use(cors());
app.use(express.json());


app.use('/api', authRoutes);
app.use("/api", languageRoutes);
app.use("/api", profileRoutes);
app.use("/api",bloodRequestRoutes)

app.get('/', (_req, res) => {
  res.send('Rakht Sanjeevani OTP API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
