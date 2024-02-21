import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, UseMiddleware, FieldResolver, Root, ObjectType } from "type-graphql";
import { User, Post } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { randomInt } from "crypto";



/* @ObjectType()
export class StrippedUser {
    @Field(() => String)
    username: string;
    @Field(() => Number)
    id: number;
} */

@InputType()
class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;
}

@ObjectType()
export class PaginatedPosts {
    @Field(() => [MyPost])
    posts: MyPost[];
    @Field()
    hasMore: boolean;
    @Field(() => Number)
    _id: number;
}
@ObjectType()
export class MyPost {
    @Field()
    id: number
    @Field()
    title: string
    @Field()
    text: string
    @Field()
    createdAt: Date
    @Field()
    updatedAt: Date
    @Field()
    points: number
    @Field(() => Int, { nullable: true })
    userId: number
}


@Resolver(MyPost)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) { //INFO: add new field that will only return first 50 characters of a post
        return root.text.slice(0, 50);
    }

    //optimized data loading for post with user
    @FieldResolver(() => User)
    async user(
        @Root() post: MyPost,
        @Ctx() { userLoader }: MyContext) {
        return userLoader.load(post.userId);
    }

    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(
        @Root() post: MyPost,
        @Ctx() { updootLoader, req }: MyContext) {
        if (!req.session.userId) return null;
        const updoot = await updootLoader.load({ postId: post.id, userId: req.session.userId });

        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req, p }: MyContext
    ) {
        const { userId } = req.session
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;

        /* const updoot = await p.updoot.findFirst({
            where: {
                AND: [
                    {
                        postId: postId,
                    },
                    {
                        userId: userId,
                    }
                ]
            }
        }); */


        try {
            const idString = `${userId}${postId}`;
            const id = Number(idString);
            await p.updoot.upsert({
                where: {
                    id: id
                },
                create: {
                    userId: userId,
                    postId: postId,
                    value: realValue,
                },
                update: {
                    value: realValue,
                },
            });
        } catch (error) {
            console.log(error);
        }

        return true;

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
            take: realLimitPlusOne, // Only return this many posts
            // skip: 1,
            where: {
                createdAt: {
                    lt: cursor ? new Date(cursor) : undefined, // Cursor can be null
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                updoods: {
                    select: {
                        value: true, // Include the 'value' field from updoots
                        userId: true,
                        postId: true,
                    },
                },
            },
        });



        // Calculate the sum of 'value' for each post's 'updoots'
        const postsWithUpdootSumAndTotal = posts.map((post) => {
            const sumOfUpdoots = post.updoods.reduce((total, updoot) => {
                return total + updoot.value;
            }, 0); // Initialize total to 0


            return {
                ...post,
                points: sumOfUpdoots,
            };
        });


        return {
            _id: randomInt(100),
            posts: postsWithUpdootSumAndTotal.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => MyPost, { nullable: true })
    async post(
        @Arg("id", () => Int) id: number,
        @Ctx() { p }: MyContext
    ): Promise<MyPost | null> {
        const post = await p.post.findFirst({
            where: {
                id
            },
            include: {
                updoods: {
                    select: {
                        value: true, // Include the 'value' field from updoots
                        userId: true,
                        postId: true,
                    },
                },
            },
        });

        if (!post) return null;

        const sumOfUpdoots = post.updoods.reduce((total, updoot) => {
            return total + updoot.value;
        }, 0);


        const postWithCountId = {
            ...post,
            points: sumOfUpdoots,
        };

        return postWithCountId;
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

    @Mutation(() => MyPost) // text snippet is on this type already
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Arg("id", () => Int) id: number,
        @Ctx() { p, req }: MyContext
    ): Promise<Post> {
        return await p.post.update({
            where: {
                id,
                userId: req.session.userId,
            },
            data: {
                title,
                text
            }
        });
    }
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { p, req }: MyContext
    ): Promise<Boolean> {
        await p.post.delete({
            where: {
                id,
                userId: req.session.userId
            },
        });
        return true;
    }
}