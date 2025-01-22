import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface Requests {
    OK: 200;
    CREATED: 201;
    BAD_REQUEST: 400;
    UNAUTHORIZED: 401;
    NOT_FOUND: 404;
    DUPLICATE: 409;
    INTERNAL_SERVER_ERROR: 500;
}

const STATUS: Requests = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    DUPLICATE: 409,
    INTERNAL_SERVER_ERROR: 500,
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        if(!firstName || !lastName || !username || !email || !password) {
            res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
            return;
        }

        const existingUsername = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(existingUsername) {
            res.status(STATUS.DUPLICATE).json({ message: "User already exists" });
            return;
        }

        const existingEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(existingEmail) {
            res.status(STATUS.DUPLICATE).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword
            }
        })
        res.status(STATUS.CREATED).json({ createUser });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(!user) {
            res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            res.status(STATUS.UNAUTHORIZED).json({ message: "Invalid Password" });
            return;
        }

        res.status(STATUS.OK).json({ message: "Login successful", user });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}
