import os from 'os';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SystemUsage from './models/SystemUsage.js';

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

// Fungsi untuk mendapatkan penggunaan CPU
function getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const used = total - idle;
    const usagePercent = (used / total) * 100;

    return { total, used, usagePercent };
}

// Fungsi untuk mendapatkan penggunaan RAM
function getRamUsage() {
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const usagePercent = (usedRam / totalRam) * 100;

    return { totalRam, usedRam, usagePercent };
}

// Fungsi untuk mencatat data ke dalam database
async function logData() {
    const ramUsage = getRamUsage();
    const cpuUsage = getCpuUsage();

    const data = new SystemUsage({
        ram: {
            total: ramUsage.totalRam,
            used: ramUsage.usedRam,
            usagePercent: ramUsage.usagePercent.toFixed(2)
        },
        cpu: {
            total: cpuUsage.total,
            used: cpuUsage.used,
            usagePercent: cpuUsage.usagePercent.toFixed(2)
        }
    });

    try {
        await data.save();
        console.log('Data berhasil disimpan:', data);
    } catch (error) {
        console.error('Gagal menyimpan data', error);
    }
}

// Interval untuk mencatat data setiap 1 menit
setInterval(logData, 60 * 1000);
