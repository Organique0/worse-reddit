import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, UseMiddleware } from "type-graphql";
import { Post } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
@InputType()
class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;
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
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { p, req }: MyContext
    ): Promise<Post> {
        return await p.post.create({
            data: {
                ...input,
                userId: req.session.userId,
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