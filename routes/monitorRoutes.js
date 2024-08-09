import express from 'express';
import SystemUsage from '../models/SystemUsage.js';

const router = express.Router();

// Endpoint untuk mendapatkan statistik penggunaan RAM dan CPU
router.get('/stats', async (req, res) => {
    try {
        // Ambil data terkecil dan terbesar
        const [smallestCpu, largestCpu] = await Promise.all([
            SystemUsage.find().sort({ 'cpu.usagePercent': 1 }).limit(1),
            SystemUsage.find().sort({ 'cpu.usagePercent': -1 }).limit(1)
        ]);

        const [smallestRam, largestRam] = await Promise.all([
            SystemUsage.find().sort({ 'ram.usagePercent': 1 }).limit(1),
            SystemUsage.find().sort({ 'ram.usagePercent': -1 }).limit(1)
        ]);

        // Ambil data terakhir kali diinput
        const lastEntry = await SystemUsage.findOne().sort({ timestamp: -1 });

        res.json({
            smallestCpu: smallestCpu[0] || null,
            largestCpu: largestCpu[0] || null,
            smallestRam: smallestRam[0] || null,
            largestRam: largestRam[0] || null,
            lastEntry: lastEntry || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error });
    }
});

export default router;
