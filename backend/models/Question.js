import mongoose from "mongoose";

const questionSchema = new Schema({
   test_id: { type: mongoose.Types.ObjectId, ref: 'Test', required: true },
   question_text: { type: String, required: true }
}, { timestamps: ture })

export default mongoose.model('Question', questionSchema)