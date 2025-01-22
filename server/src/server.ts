import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config({
    path: "./.env"
});

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    try {
        prisma.$connect();
        console.log(`Server is running on port ${PORT}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Internal Server Error", error);
    }
});
