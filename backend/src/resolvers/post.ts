import { Resolver, Query, Arg, Int, Args, Mutation, Ctx } from "type-graphql";
import { Post } from "@generated/type-graphql";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type MyContext = {
    p: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(
        @Ctx() { p }: MyContext
    ): Promise<Post[]> {
        const posts = await p.post.findMany();
        return posts;
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg("id", () => Int) id: number,
        @Ctx() { p }: MyContext
    ): Promise<Post | null> {
        return await p.post.findFirst({
            where: {
                id
            }
        });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Ctx() { p }: MyContext
    ): Promise<Post> {
        return await p.post.create({
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
        @Ctx() { p }: MyContext
    ): Promise<Post> {
        return await p.post.update({
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
        @Ctx() { p }: MyContext
    ): Promise<Boolean> {
        await p.post.delete({
            where: {
                id
            },
        });
        return true;
    }
}