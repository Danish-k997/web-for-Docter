import dotenv from "dotenv";
dotenv.config();
import {z} from "zod";


const config = ({
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGEL_USER:process.env.GOOGEL_USER,
  APP_PASSWORD: process.env.APP_PASSWORD,
  FORTEND_URL: process.env.FORTEND_URL,
});

const configSchema = z.object({
  MONGODB_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_SECRET: z.string().min(32),
  GOOGEL_USER: z.string().email(),
  APP_PASSWORD: z.string(),
  FORTEND_URL: z.string().url(),
});

const validation = configSchema.safeParse(config);
if (!validation.success) {
  console.error("Configuration validation failed:", validation.error.format());
  process.exit(1);
}


export default config;