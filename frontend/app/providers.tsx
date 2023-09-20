'use client'

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { useMemo } from 'react';
import { UrqlProvider, ssrExchange } from '@urql/next';
import { getClient } from '@/utils/createUrqlClient'


export function Providers({
    children
}: {
    children: React.ReactNode
}) {

    const [client, ssr] = useMemo(() => {
        const ssr = ssrExchange();
        const client = getClient();

        return [client, ssr];
    }, []);

    return (
        <UrqlProvider client={client} ssr={ssr}>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </CacheProvider>
        </UrqlProvider >
    )
}