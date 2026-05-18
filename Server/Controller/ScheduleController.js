import DoctorSchedule from "../models/ScheduleModel.js";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const normalizeText = (value) => String(value || "").trim();

export const addschedule = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const dayOfWeek = normalizeText(req.body.dayOfWeek);
    const startTime = normalizeText(req.body.startTime);
    const endTime = normalizeText(req.body.endTime);
    const location = normalizeText(req.body.location);

    if (!dayOfWeek || !startTime || !endTime || !location) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!DAYS.includes(dayOfWeek)) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a valid day" });
    }

    if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Time must be in HH:mm format" });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ success: false, message: "End time must be after start time" });
    }

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorId, dayOfWeek },
      { startTime, endTime, location },
      { new: true, upsert: true, runValidators: true },
    );

    return res
      .status(200)
      .json({ success: true, message: "Schedule updated", data: schedule });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getschedule = async (req, res) => {
  try {
    const schedules = await DoctorSchedule.find()
      .populate('doctorId', 'username email role')
      .select('dayOfWeek startTime endTime location doctorId updatedAt')
      .lean();

    const dayOrder = new Map(DAYS.map((day, index) => [day, index]));
    schedules.sort((a, b) => {
      const dayDiff = dayOrder.get(a.dayOfWeek) - dayOrder.get(b.dayOfWeek);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    return res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

