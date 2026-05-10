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
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
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

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
