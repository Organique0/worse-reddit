import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Redis } from "ioredis";
import session from "express-session";
import RedisStore from "connect-redis";
import "reflect-metadata";
//array of auto-generated resolvers
//import { resolvers } from "@generated/type-graphql"; 
import { buildSchema } from "type-graphql";
import { prisma } from "../lib/dbClient";
//my own resolvers
import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import { MyContext } from "./types";
import sendEmail from "../utils/sendEmail";
import { createUserLoader } from "../utils/createUserLoader";
import { createUpdootLoader } from "../utils/createUpdootLoader";

const main = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    app.set("trust proxy", 1);

    app.use(
        cors({
            origin: process.env.CLIENT_URL ? process.env.CLIENT_URL : "http://localhost:4000",
            credentials: true,
        })
    );

    const redis = new Redis({
        port: 18643,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,

    });;

    // Initialize store.
    const redisStore = new RedisStore({
        client: redis,
        prefix: "myapp:",
        disableTouch: true,
    })

    //await sendEmail("grabnar.luka@gmail.com", "hello world");


    // Initialize sesssion storage.
    app.use(
        session({
            name: "hello",
            store: redisStore,
            resave: false, // required: force lightweight session keep alive (touch)
            saveUninitialized: false, // recommended: only save session when data exists
            secret: "asdfgasdfgasdfg",
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                secure: false, //only works with https
                sameSite: "lax",
            }
        })
    )

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false,
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    app.use('/',

        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }): Promise<MyContext> => ({ p: prisma, req, res, redis, userLoader: createUserLoader(), updootLoader: createUpdootLoader() }),
        })
    );
    const port = process.env.PORT || 8080;
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server at http://localhost:4000/`);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })