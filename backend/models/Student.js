import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   scholarId: { type: String, required: true, unique: true },
   department: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);
export default Student;
