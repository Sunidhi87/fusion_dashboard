import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['OSINT', 'HUMINT', 'IMINT'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, required: true },
  reliability: { type: String },
  imageUrl: { type: String },
  tags: [{ type: String }]
});

export default mongoose.model('IntelligenceNode', nodeSchema);
