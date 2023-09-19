import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, ObjectType } from "type-graphql";
import { User } from "@generated/type-graphql";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import argon2 from "argon2";

type MyContext = {
    p: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users(
        @Ctx() { p }: MyContext)
        : Promise<User[]> {
        const users = await p.user.findMany();
        return users;
    }

    @Query(() => User, { nullable: true })
    async user(
        @Arg("id", () => Int) id: number,
        @Ctx() { p }: MyContext
    ): Promise<User | null> {
        return await p.user.findFirst({
            where: {
                id
            }
        });
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { p }: MyContext
    ): Promise<UserResponse> {

        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "length must be greater than 2",
                }]
            }
        }
        if (options.username.length <= 3) {
            return {
                errors: [{
                    field: "password",
                    message: "length must be greater than 3",
                }]
            }
        }

        const existing = await p.user.findFirst({
            where: {
                username: options.username
            }
        })

        if (existing) {
            return {
                errors: [{
                    field: 'username',
                    message: 'Username already exists'
                }]
            }
        }

        try {
            const hashedPassword = await argon2.hash(options.password)
            const user = await p.user.create({
                data: {
                    username: options.username,
                    password: hashedPassword,
                }
            });
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
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { p }: MyContext
    ): Promise<UserResponse> {
        const user = await p.user.findFirst({
            where: {
                username: options.username,
            }
        })
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'Username does not exist'
                }]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'Incorrect password'
                }]
            }
        }

        return {
            user
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
}