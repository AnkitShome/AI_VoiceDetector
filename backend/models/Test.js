import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
   title: { type: String, required: true },
   examinerId: { type: mongoose.Schema.Types.ObjectId, ref: "Examiner", required: true },
   department: { type: String },
   sharedLinkId: { type: String, unique: true },
   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
   createdAt: { type: Date, default: Date.now },
   startTime: { type: Date, required: true },
   endTime: { type: Date, required: true }
}, { timestamps: true });

// TestSchema.index({ examinerId: 1 });
// TestSchema.index({ department: 1 });

const Test = mongoose.model('Test', TestSchema);
export default Test;
