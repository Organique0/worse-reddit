import { PrismaClient, Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { Request, Response, Express } from "express"
import { Redis } from "ioredis";
import { createUserLoader } from "utils/createUserLoader"
import { createUpdootLoader } from "utils/createUpdootLoader"

export type MyContext = {
    p: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    req: Request;
    res: Response;
    redis: Redis
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>
}