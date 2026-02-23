import mongoose from "mongoose";


type connectionObject = {
    isConnected? : number
}

const connection: connectionObject = {}

// void in ts means idc what return ho rha hai where as in cpp it means nothing
async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already Connected Database")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '', {/*OPTIONS*/})

        connection.isConnected = db.connections[0].readyState
        console.log("Database Connected successfully")
    } catch (error) {
        console.log("Database Connection Failed" , error)
        process.exit(1)
    }
}

export default dbConnect