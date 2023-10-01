import DataLoader from "dataloader";
import { PrismaClient, User } from "@prisma/client";

export const createUserLoader = () => new DataLoader<number, User>(async (userIds) => {
    const p = new PrismaClient();
    const users = await p.user.findMany({
        where: {
            id: {
                in: userIds as number[],
            }
        }
    });
    const userIdToUser: Record<number, User> = {};
    users.forEach(user => {
        userIdToUser[user.id] = user;
    })

    return userIds.map(userId => userIdToUser[userId]);
});