import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
   title: { type: String, required: true },
   examiner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   department: { type: String }, 
   sharedLinkId: { type: String,unique:true }, 
   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
   createdAt: { type: Date, default: Date.now },
   start_time: { type: Date, required: true },
   end_time: { type: String, required: true }
});

export default mongoose.model('Test', TestSchema);
