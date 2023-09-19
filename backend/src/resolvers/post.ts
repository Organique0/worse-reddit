import { Resolver, Query, Arg, Int, Args, Mutation, Ctx } from "type-graphql";
import { Post } from "@generated/type-graphql"
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type MyContext = {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts({ prisma }: MyContext): Promise<Post[]> {
        const posts = await prisma.post.findMany();
        return posts;
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg("id", () => Int) id: number,
        { prisma }: MyContext
    ): Promise<Post | null> {
        return await prisma.post.findFirst({
            where: {
                id
            }
        });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Ctx() { prisma }: MyContext
    ): Promise<Post> {
        return await prisma.post.create({
            data: {
                title,
                text
            }
        });
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg("title") title: string,
        @Arg("id") id: number,
        @Ctx() { prisma }: MyContext
    ): Promise<Post> {
        return await prisma.post.update({
            where: {
                id
            },
            data: {
                title
            }
        });
    }
    @Mutation(() => Post)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { prisma }: MyContext
    ): Promise<Boolean> {
        await prisma.post.delete({
            where: {
                id
            },
        });
        return true;
    }
}