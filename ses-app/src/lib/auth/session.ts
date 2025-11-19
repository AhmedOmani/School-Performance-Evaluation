import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
}

export async function requireAuth() {
    const user = await getCurrentUser();    
    if (!user) throw new Error("Unauthorized");
    return user;
}

export async function requireSystemManager() {
    const user = await requireAuth();
    if (user.role !== "SYSTEM_MANAGER") {
        throw new Error("Forbidden: System Manager access required");
    }
    return user;
}