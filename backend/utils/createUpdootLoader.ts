import DataLoader from "dataloader";
import { PrismaClient, Updoot, User } from "@prisma/client";

export const createUpdootLoader = () => new DataLoader<{ postId: number; userId: number }, Updoot | null>(async (keys) => {
    const p = new PrismaClient();

    const postIds = keys.map((key) => key.postId);
    const userIds = keys.map((key) => key.userId);

    const updoots = await p.updoot.findMany({
        where: {
            postId: { in: postIds },
            userId: { in: userIds },
        },
    });
    const updootsIdsToUpdoot: Record<string, Updoot> = {};

    updoots.forEach((updoot) => {
        updootsIdsToUpdoot[`${updoot.userId}| ${updoot.postId}`] = updoot;
    });


    return keys.map(key => updootsIdsToUpdoot[`${key.userId}| ${key.postId}`])
});