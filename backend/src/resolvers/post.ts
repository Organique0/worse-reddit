import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, UseMiddleware, FieldResolver, Root, ObjectType } from "type-graphql";
import { Post, User } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { randomInt } from "crypto";
@InputType()
class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore: boolean;
    @Field(() => Number)
    _id: number;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) { //INFO: add new field that will only return first 50 characters of a post
        return root.text.slice(0, 50);
    }
    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        @Ctx() { p }: MyContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);//limit up to 50
        const realLimitPlusOne = realLimit + 1;

        const posts = await p.post.findMany({
            take: realLimitPlusOne, //only returns this many posts
            //skip: 1, 
            where: {
                createdAt: {
                    lt: cursor ? new Date(cursor) : undefined, //cursor can be null
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true,
            },
        });

        //console.log(posts.length);
        //console.log(realLimitPlusOne);
        //console.log(posts);
        return {
            _id: randomInt(100),
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
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