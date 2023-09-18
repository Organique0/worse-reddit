import { Resolver, Query } from "type-graphql";
import { Post } from "@generated/type-graphql"
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type MyContext = {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts({ prisma }: MyContext) {
        const posts = await prisma.post.findMany();
        return posts;
    }
}