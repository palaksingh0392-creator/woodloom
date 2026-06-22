import "dotenv/config";

const values = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

const missing = Object.entries(values)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.log("Cloudinary is not ready.");
  console.log(`Missing: ${missing.join(", ")}`);
  console.log("Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env and Vercel.");
  process.exitCode = 1;
} else {
  console.log("Cloudinary environment variables are present.");
  console.log(`Cloud name: ${values.cloudName}`);
  console.log("API key: configured");
  console.log("API secret: configured");
}
