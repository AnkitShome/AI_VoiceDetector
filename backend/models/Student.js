import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   scholarId: { type: String, required: true, unique: true },
   department: { type: String, required: true },
});

export default mongoose.model('Student', StudentSchema);
