import mongoose from "mongoose";

const connectionDb =async(ConnectionString:string)=>{
 try{
  const connectionInstance = await mongoose.connect(ConnectionString)
  console.log(connectionInstance.connection.db?.databaseName)
 }
 catch(error){
  console.log("error connecting mongoose database",error)
  process.exit(1)
 }
}

export default connectionDb
