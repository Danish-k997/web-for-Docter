import app from "./app.js";
import connectDB from "./Config/db.js";
import config from "./Config/Config.js";


const PORT = config.PORT;


const StartServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
    process.exit(1);
  }
};

StartServer();
