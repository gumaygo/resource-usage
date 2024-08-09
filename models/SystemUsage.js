import mongoose from 'mongoose';

const systemUsageSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    ram: {
        total: { type: Number, required: true },
        used: { type: Number, required: true },
        usagePercent: { type: Number, required: true }
    },
    cpu: {
        total: { type: Number, required: true },
        used: { type: Number, required: true },
        usagePercent: { type: Number, required: true }
    }
});

const SystemUsage = mongoose.model('SystemUsage', systemUsageSchema);

export default SystemUsage;
