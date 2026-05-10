import mongoose from "mongoose"; 

                                             
const SessionSchema = new mongoose.Schema({
   User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [ true, "Please provide a user"]
   }, 
   refreshtoken: {
    type: String,
    required: [true, "Please provide a refresh token"]
   },
    Ip: {
      type: String,
      required: [true, "Please provide a Ip"]
    },
    UserAgent: {
      type:String,
      required: [true, "Please provide a UserAgent"]
    
    },
    revoked: {
      type: Boolean,
      default: false
    },

},
{
  timestamps: true
}
)

const Sessionmodal = mongoose.model("Session", SessionSchema)  

export default Sessionmodal;  

