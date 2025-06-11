import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
   title: { type: String, require: true },
   description: String,
   created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   start_time: { type: Date, required: true },
   end_time: { type: Date, required: true }
}, { timestamps: true })

export default mongoose.model('Test', testSchema);