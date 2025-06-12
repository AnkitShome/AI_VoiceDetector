import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
   title: { type: String, required: true },
   examiner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   department: { type: String }, // optional, for dept-based sharing
   sharedLinkId: { type: String }, // optional link for public access
   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   createdAt: { type: Date, default: Date.now },
   start_time: { type: Date, required: true },
   end_time: { type: String, required: true }
});

export default mongoose.model('Test', TestSchema);
