import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (go up two levels from src/config/)
const envPath = join(__dirname, '../../.env');

console.log("📍 Loading .env from:", envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("❌ Error loading .env file:", result.error);
} else {
    console.log("✅ .env file loaded successfully");
}

// Verify critical variables
console.log("\n=================================");
console.log("🔍 ENVIRONMENT VARIABLES LOADED:");
console.log("=================================");
console.log("PORT:", process.env.PORT || "❌ MISSING");
console.log("MONGO_URL:", process.env.MONGO_URL || "❌ MISSING");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ MISSING");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✓ Present" : "❌ MISSING");
console.log("=================================\n");

export default result;