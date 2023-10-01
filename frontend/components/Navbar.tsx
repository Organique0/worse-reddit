"use client";
import { useLogoutMutation } from "@/graphql/mutations/logout.hooks";
import { useUserQuery } from "@/graphql/queries/user.hooks";
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import Link from "next/link";
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
                <Button variant={"link"} isLoading={false} onClick={logoutUser}>logout</Button>
            </Box >
        )
    }

    return (
        <Flex bg={'tomato'} p={4} position="sticky" top={0} zIndex={666} align={"center"}>
            <Flex align={"center"} maxW={800} flex={1} m={"auto"}>
                <Link href="/">
                    <Heading>worse red dit</Heading>
                </Link>

                <Flex ml={'auto'} align={"center"} gap={6}>
                    <Button variant={"unstyled"} bgColor={"purple.200"} px={5} color={"black"}>
                        <Link href={"/create-post"}>create post</Link>
                    </Button>
                    {body}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Navbar