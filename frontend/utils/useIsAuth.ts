"use client";
import { useUserQuery } from '@/graphqlApollo/generated';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react'

const useIsAuth = () => {
    const router = useRouter();
    const path = usePathname();

    //auto redirect if not logged in
    const { data, loading } = useUserQuery();
    useEffect(() => {
        if (!loading && !data?.user) {
            router.replace("/login?next=" + path);
        }
    }, [loading, data, router]);
}
export default useIsAuth;