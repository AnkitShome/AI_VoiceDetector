import mongoose from 'mongoose';

const VoiceSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: String,
  originalName: String,
  submittedAt: Date,
});

const VoiceSubmission = mongoose.model('VoiceSubmission', VoiceSubmissionSchema);
export default VoiceSubmission;