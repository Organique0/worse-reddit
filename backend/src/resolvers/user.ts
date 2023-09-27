import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, Field, ObjectType, FieldResolver, Root } from "type-graphql";
import { User, Post } from "@generated/type-graphql";
import argon2 from "argon2";
import { MyContext } from "src/types";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import validateRegister from "../../utils/validateRegister";
import sendEmail from "../../utils/sendEmail";
import { v4 } from "uuid";
//import { MyPost } from "./post";

//this is here so that typescript does not complain
declare module "express-session" {
    interface Session {
        userId: number;
    }
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

//for some reason the generated types do not have relations
//so we need to create types ourselves
@ObjectType()
export class UserWithPosts {
    @Field()
    id: number
    @Field()
    username: string
    @Field()
    email: string
    @Field()
    createdAt: Date
    @Field()
    updatedAt: Date
    @Field(() => [Post])
    posts: Post[]
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver(UserWithPosts) //not sure on this
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        if (req.session.userId === user.id) {
            return user.email
        }
        return "";
    }


    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { p, redis }: MyContext
    ) {
        const user = await p.user.findFirst({
            where: { email: email },
        });
        if (!user) return true;

        const token = v4();
        await redis.set('forgot-password:' + token, user.id, 'EX', 1000 * 60 * 60 * 34 * 3); //store for 3 days
        sendEmail(email, `
            <a href="http://localhost:3000/change-password/${token}">Reset Password</a>
        `)

        return true;
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { p, redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length < 5) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "Password must be at least 5 characters"
                }]
            }
        }

        const userId = await redis.get('forgot-password:' + token)
        if (!userId) {
            return {
                errors: [{
                    field: 'newPassword',
                    message: 'token expired',
                }]
            }
        }

        const user = await p.user.findFirst({
            where: {
                id: parseInt(userId),
            }
        });

        if (!user) {
            return {
                errors: [{
                    field: 'token',
                    message: 'user no longer exists',
                }]
            }
        }

        user.password = await argon2.hash(newPassword);

        await p.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: user.password,
            }
        });

        await redis.del('forgot-password:' + token)

        req.session.userId = user.id; // auto login the user

        return { user };
    }


    @Query(() => [UserWithPosts], { nullable: true })
    async users(
        @Ctx() { p }: MyContext)
        : Promise<UserWithPosts[]> {
        const users = await p.user.findMany({
            include: {
                posts: true,
            },
        });
        return users;
    }


    @Query(() => UserWithPosts, { nullable: true })
    async user(
        @Ctx() { p, req }: MyContext
    ): Promise<UserWithPosts | null> {

        if (!req.session.userId) return null;

        return await p.user.findFirstOrThrow({
            where: {
                id: req.session.userId,
            },
            include: {
                posts: true,
            }
        })

    }


    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { p, req }: MyContext
    ): Promise<UserResponse> {
        const errors = await validateRegister(options, p);
        if (errors) {
            return { errors };
        }

        try {
            const hashedPassword = await argon2.hash(options.password)
            const user = await p.user.create({
                data: {
                    email: options.email,
                    username: options.username,
                    password: hashedPassword,
                }
            });
            req.session.userId = user.id;
            return { user };
        } catch (error) {
            return {
                errors: [{
                    field: 'username',
                    message: 'Something went wrong'
                }]
            }
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { p, req }: MyContext
    ): Promise<UserResponse> {
        const user = await p.user.findFirst({
            where: {
                OR: [
                    {
                        username: usernameOrEmail,
                    },
                    {
                        email: usernameOrEmail
                    }
                ]
            }
        });
        if (!user) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'username or email does not exist'
                }]
            }
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'Incorrect password'
                }]
            }
        }
        req.session.userId = user.id;
        //console.log(req.session.id);

        return {
            user,
        };
    }


    @Mutation(() => User)
    async updateUser(
        @Arg("id") id: number,
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { p }: MyContext
    ): Promise<User> {
        return await p.user.update({
            where: {
                id
            },
            data: {
                username,
                password
            }
        });
    }


    @Mutation(() => User)
    async deleteUser(
        @Arg("id") id: number,
        @Ctx() { p }: MyContext
    ): Promise<Boolean> {
        await p.user.delete({
            where: {
                id
            },
        });
        return true;
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            res.clearCookie("hello");
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }

}