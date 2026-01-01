const mongoose=require("mongoose")

const connectDB=async()=>{
try{
await mongoose.connect(process.env.MONGODB_URI)
}
catch(ex){
console.log(`connect db fail`+ex.message)
}
}

module.exports=connectDB