import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import "reflect-metadata";
import { resolvers } from "@generated/type-graphql";
import { buildSchema } from "type-graphql";
import { prisma } from "../lib/dbClient";



const app = express();
const httpServer = http.createServer(app);

const main = async () => {

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            validate: false,
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();


    app.use(
        '/',
        cors<cors.CorsRequest>(),
        bodyParser.json(),

        expressMiddleware(server, {
            context: async () => ({ prisma }),
        }),
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