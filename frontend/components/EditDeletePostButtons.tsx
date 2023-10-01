"use client"
import { useDeletePostMutation } from '@/graphql/mutations/deletePost.hooks';
import { useUserQuery } from '@/graphql/queries/user.hooks';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react'

interface EditDeletePostButtonsProps {
    id: number,
    userId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, userId }) => {
    const [, deletePost] = useDeletePostMutation();
    const [{ data: user }] = useUserQuery();

    if (user?.user?.id !== userId) {
        return null
    }
    return (
        <Flex gap={4}>
            <Link href={"/post/edit/" + id}>
                <IconButton icon={<EditIcon />} aria-label="delete post" />
            </Link>
            <IconButton icon={<DeleteIcon />} aria-label="delete post" colorScheme='red' onClick={() => {
                deletePost({ id: id })
            }} />
        </Flex>
    );
}