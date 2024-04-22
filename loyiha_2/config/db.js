const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.set('strictQuery', false)
    const connecting = await mongoose.connect(process.env.MONGO_URI)

    if (connecting.error) {
        console.error("An error occurred connecting to MongoDB:", connecting.error);
    } else {
        console.log(`MongoDB is connected to this MONGO_URI : ${connecting.connection.host}`.bgBlue);
    }
}


module.exports = connectDB