import { Resolver, Query, Arg, Int, Args, Mutation, Ctx, InputType, Field, ObjectType } from "type-graphql";
import { User } from "@generated/type-graphql";
import argon2 from "argon2";
import { MyContext } from "src/types";

//this is here so that typescript does not complain
declare module "express-session" {
    interface Session {
        userId: number;
    }
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


    @Query(() => UserResponse, { nullable: true })
    async user(
        @Ctx() { p, req }: MyContext
    ): Promise<UserResponse | null> {

        if (!req.session.userId) return null;

        try {
            const user = await p.user.findFirstOrThrow({
                where: {
                    id: req.session.userId,
                }
            })
            return { user };
        } catch (error) {
            return {
                errors: [{
                    field: "username",
                    message: "There was an error. Maybe the user with this id does not exist?",
                }]
            }
        }
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { p, req }: MyContext
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
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { p, req }: MyContext
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
}