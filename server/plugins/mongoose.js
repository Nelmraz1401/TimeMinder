import mongoose from "mongoose";
const config = useRuntimeConfig();

export default async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log(`
--- PLUGINS --- 
| DB connection established.
| ${ config.MONGO_URL }
---
`);
  } catch (err) {
    // 
  }
};