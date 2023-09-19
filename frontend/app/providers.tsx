'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
    url: 'http://localhost:4000/',
    exchanges: [cacheExchange, fetchExchange],

});

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Provider value={client}>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </CacheProvider>
        </Provider>
    )
}