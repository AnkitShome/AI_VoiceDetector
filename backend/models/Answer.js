import mongoose from "mongoose";

const answerSchema = new Schema({
   student_test_id: { type: Schema.Types.ObjectId, ref: 'StudentTest', required: true },
   question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
   audio_file_path: { type: String, required: true },
   transcript_text: { type: String },
   score: { type: Number }
});

export default mongoose.model('Answer', answerSchema);