import mongoose from "mongoose";

const StudentTestSchema = new mongoose.Schema({
   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
   testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
   startedAt: { type: Date, default: Date.now },
   submittedAt: { type: Date },
   status: { type: String, enum: ['attempted', 'not attempted'], default: 'not attempted' }
}, { timestamps: true });

const StudentTest = mongoose.model('StudentTest', StudentTestSchema);
export default StudentTest;
