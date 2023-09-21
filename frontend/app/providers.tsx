'use client'

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { useMemo } from 'react';
import { UrqlProvider, ssrExchange } from '@urql/next';
import { getUrqlClient } from '@/utils/createUrqlClient'


export function Providers({
    children
}: {
    children: React.ReactNode
}) {

    const [client, ssr] = useMemo(() => {
        const ssr = ssrExchange({ isClient: true });
        const client = getUrqlClient(ssr);

        return [client, ssr];
    }, []);

    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <UrqlProvider client={client} ssr={ssr}>
                    {children}
                </UrqlProvider>
            </ChakraProvider>
        </CacheProvider>

    )
}