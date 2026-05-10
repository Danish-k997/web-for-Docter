import dotenv from "dotenv";
dotenv.config();

const config = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGEL_CLIENT_ID: process.env.GOOGEL_CLIENT_ID,
  GOOGEL_CLIENT_SECRET: process.env.GOOGEL_CLIENT_SECRET,
  GOOGEL_REFRESH_TOKEN: process.env.GOOGEL_REFRESH_TOKEN,
  GOOGEL_USER:process.env.GOOGEL_USER
};

if (!config.MONGODB_URL) {
  throw new Error("Missing MONGODB_URL environment variable");
}

if (!config.PORT) {
  throw new Error("Missing PORT environment variable");
}

if (!config.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
} 

if (!config.GOOGEL_CLIENT_ID) {
  throw new Error("Missing GOOGEL_CLIENT_ID environment variable");
  
}
if (!config.GOOGEL_CLIENT_SECRET) {
  throw new Error("Missing GOOGEL_CLIENT_SECRET environment variable");
} 
if (!config.GOOGEL_REFRESH_TOKEN) {
  throw new Error("Missing GOOGEL_REFRESH_TOKEN environment variable");
} 
if (!config.GOOGEL_USER) {
  throw new Error("Missing GOOGEL_USER environment variable");
} 


export default config;