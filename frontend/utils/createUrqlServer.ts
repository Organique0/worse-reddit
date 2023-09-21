//REMEMBER:
//The main difference between client and server URQL code are the IMPORTS.
//I don not know exactly why but otherwise it does not work properly
//This is how it is done in the official documentation
import { createClient, fetchExchange } from '@urql/core';
import { registerUrql } from '@urql/next/rsc';
import { cacheExchange } from '@urql/exchange-graphcache';


const getUrlServer = () => {
    return createClient({
        url: 'http://localhost:4000/',
        //Cookies do not get set without this line.
        fetchOptions: {
            credentials: "include" as const,
        },
        exchanges: [cacheExchange({
            updates: {
                Mutation: {

                }
            }
        }), fetchExchange],
    });
};

export const { getClient } = registerUrql(getUrlServer);