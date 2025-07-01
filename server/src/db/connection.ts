import mongoose from "mongoose";

const connectionDb = async (ConnectionString: string) => {
  try {
    const connectionInstance = await mongoose.connect(ConnectionString, {
      dbName: "Testing",
    });

    console.log(
      "Connected to DB:",
      connectionInstance.connection.db?.databaseName
    );
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectionDb;
