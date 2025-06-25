import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
   title: { type: String, required: true },
   examiner: { type: mongoose.Schema.Types.ObjectId, ref: 'Examiner', required: true },
   department: { type: String },
   sharedLinkId: { type: String, unique: true },
   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
   startTime: { type: Date, required: true },
   endTime: { type: Date, required: true },
}, { timestamps: true });

const Test = mongoose.model('Test', TestSchema);
export default Test;
