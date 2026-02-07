//this file's job is to make sure that DB connection is ready, and handling connection,disconnection shutdowns etc.(like a switch that on and offs database)

import { prisma } from "./prisma/prisma.client";

export async function connectToPostgressDB():Promise<void> {
    try {
        await prisma.$connect()
        console.log(`successfully connected to db`)        
    } catch (error) {
        console.log(`db connection is'nt succesful. ${error}`)
        process.exit(1)        //terminate the process
    }
}
export async function disconnectToPostgressDB():Promise<void> {
    await prisma.$disconnect()
    console.log(`successfully disconnected from db`)  
    
}