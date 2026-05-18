import mongoose from 'mongoose';

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Fast searching ke liye indexing compulsory hai
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: { 
    type: String, 
    required: true // Format: "10:00" (24-hour format standard hai validation ke liye)
  },
  endTime: { 
    type: String, 
    required: true // Format: "15:00"
  },
  location: { 
    type: String, 
    required: true,
    trim: true // Extra spaces remove karne ke liye
  }
}, { timestamps: true });


doctorScheduleSchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

const DoctorSchedule = mongoose.model('DoctorSchedule', doctorScheduleSchema);
export default DoctorSchedule;