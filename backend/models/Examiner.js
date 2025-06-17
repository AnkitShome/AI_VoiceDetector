import mongoose from 'mongoose';

const ExaminerSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   department: { type: String, required: true },
});

export default mongoose.model('Examiner', ExaminerSchema);
