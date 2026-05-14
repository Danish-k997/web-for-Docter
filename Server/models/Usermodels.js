import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    index: true,
  },
  Verified:{
    type:Boolean,
    default:false
  },
  role:{
    type:String,
    default:"user"
  }
});

UserSchema.index({ email: 1, password: 1 });
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
