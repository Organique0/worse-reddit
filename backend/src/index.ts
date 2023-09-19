import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from "redis";
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


const main = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    app.set("trust proxy", 1);

    app.use(
        cors({
            origin: "http://localhost:3000/",
            credentials: true,
        })
    );

    // Initialize client.
    const redisClient = createClient({
        password: "DX4OZiCgFbHhDEBRaJzfqY9TLhW3qUYG",
        socket: {
            host: 'redis-18643.c293.eu-central-1-1.ec2.cloud.redislabs.com',
            port: 18643
        }
    })
    redisClient.connect().catch(console.error)

    // Initialize store.
    const redisStore = new RedisStore({
        client: redisClient,
        prefix: "myapp:",
        disableTouch: true,
    })

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
            context: async ({ req, res }): Promise<MyContext> => ({ p: prisma, req, res }),
        })
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:3000/`);
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