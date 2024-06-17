import mongoose from "mongoose";

export const connectDb = (URI) => {
  const options = {
   dbName:"DBS"
  };

  mongoose.connect(URI, options)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};
