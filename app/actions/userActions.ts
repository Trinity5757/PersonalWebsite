import { connectDB } from "../lib/connectDB";
import { User } from "@/app/models/Users";
import { IUser } from "@/app/models/Users";

export async function getUserById(id: string) {
    try {
        await connectDB();
        const user = await User.findOne({ id });;
        return user as IUser; 
    } catch (error) {
        console.error('Failed to fetch user by id:', error);
        throw new Error('Failed to fetch user.');
    }
}