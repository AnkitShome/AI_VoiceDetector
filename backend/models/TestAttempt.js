import mongoose from "mongoose";

const TestAttemptSchema = new mongoose.Schema({
   test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
   student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
   startedAt: { type: Date, default: Date.now },
   submittedAt: { type: Date, default: Date.now },
   answers: [
      {
         question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
         answer: { type: String }
      }
   ],

   score: { type: Number }
})

export default mongoose.model('TestAttempt', TestAttemptSchema);