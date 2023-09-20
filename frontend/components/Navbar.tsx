"use client"
import { useUserQuery } from '@/generated/graphql';
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from "next/link" // next link is far superior to regular links

const Navbar = () => {
    const [{ data, fetching }] = useUserQuery();

    let body = null;

    if (fetching) {
        body = null;
    }
    else if (!data?.user) {
        body = (
            <>
                <NextLink href={"/login"} style={{ paddingRight: "5px" }}>
                    login
                </NextLink>
                <NextLink href={"/register"}>
                    register
                </NextLink>
            </>
        )
    } else {
        //I messed up the query...
        body = (
            <Box display={"flex"}>
                <Box pr={5}>{data.user.user?.username}</Box>
                <Button variant={"link"}>logout</Button>
            </Box>
        )
    }

    return (
        <Flex bg={'tomato'} p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}

export default Navbar