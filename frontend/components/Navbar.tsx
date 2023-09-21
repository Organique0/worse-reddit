"use client";
import { useLogoutMutation } from "@/graphql/mutations/logout.hooks";
import { useUserQuery } from "@/graphql/queries/user.hooks";
import { Box, Button, Flex } from '@chakra-ui/react'
import NextLink from "next/link" // next link is far superior to regular links
import { useRouter } from "next/navigation";


const Navbar = () => {
    const [{ data, fetching }] = useUserQuery();
    const [, logout] = useLogoutMutation();
    const router = useRouter();

    function logoutUser() {
        logout({});
        router.push("/");
    }


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
        body = (
            <Box display={"flex"}>
                <Box pr={5}>{data?.user.username}</Box>
                <Button variant={"link"} isLoading={false} onClick={async () => { await logoutUser() }}>logout</Button>
            </Box >
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