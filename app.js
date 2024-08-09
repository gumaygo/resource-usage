import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import monitorRoutes from './routes/monitorRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB connection string from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Terhubung ke MongoDB');
}).catch((error) => {
    console.error('Gagal terhubung ke MongoDB', error);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use monitor routes
app.use('/api/monitor', monitorRoutes);

// Start monitoring system
import('./monitorSystem.js');

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
