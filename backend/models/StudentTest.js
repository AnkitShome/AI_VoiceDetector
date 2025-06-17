import mongoose from "mongoose";

const studentTestSchema = new Schema({
   student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   test_id: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
   submitted_at: { type: Date },
   status: { type: String, enum: ['attempted', 'not attempted'], default: 'not attempted' }
}, { timestamps: ture });

export default mongoose.model('StudentTest', studentTestSchema);