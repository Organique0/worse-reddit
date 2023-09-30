import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, UseMiddleware, FieldResolver, Root, ObjectType } from "type-graphql";
import { User, Post } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { randomInt } from "crypto";


@ObjectType()
export class StrippedUser {
    @Field(() => String)
    username: string;
    @Field(() => Number)
    id: number;
}

@InputType()
class PostInput {
    @Field()
    title: string;

    @Field()
    text: string;
}

@ObjectType()
export class PaginatedPosts {
    @Field(() => [PostWithUser])
    posts: PostWithUser[];
    @Field()
    hasMore: boolean;
    @Field(() => Number)
    _id: number;
}
@ObjectType()
export class PostWithUser {
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
    //i don't know. here I am saying that we only return username and id for a user in the post
    @Field()
    user: StrippedUser
    @Field()
    points: number
    @Field(() => Int, { nullable: true })
    voteStatus: number | null;
}


@Resolver(PostWithUser)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) { //INFO: add new field that will only return first 50 characters of a post
        return root.text.slice(0, 50);
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
                    id: id,
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
                user: {
                    select: {
                        username: true,
                        id: true,
                    },
                },
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

            let voteStatus = null;

            post.updoods.map((updoot) => {
                if ((updoot.userId === post.userId) && (updoot.postId === post.id)) {
                    voteStatus = updoot.value
                }
            })

            return {
                ...post,
                points: sumOfUpdoots,
                voteStatus: voteStatus
            };
        });


        return {
            _id: randomInt(100),
            posts: postsWithUpdootSumAndTotal.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => PostWithUser, { nullable: true })
    async post(
        @Arg("id", () => Int) id: number,
        @Ctx() { p }: MyContext
    ): Promise<PostWithUser | null> {
        const post = await p.post.findFirst({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                updoods: {
                    select: {
                        value: true,
                        userId: true,
                        postId: true
                    },
                },
            }
        });

        if (!post) return null;

        const sumOfUpdoots = post.updoods.reduce((total, updoot) => {
            return total + updoot.value;
        }, 0);

        let voteStatus = null;
        const x = post.updoods.map((updoot) => {
            if ((updoot.userId === post.userId) && (updoot.postId === post.id)) {
                voteStatus = updoot.value
            }
        })

        const postWithCountId = {
            ...post,
            points: sumOfUpdoots,
            voteStatus: voteStatus
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