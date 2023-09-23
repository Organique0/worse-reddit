"use client";
import { useUserQuery } from '@/graphql/queries/user.hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react'

const useIsAuth = () => {
    const router = useRouter();
    const path = usePathname();

    //auto redirect if not logged in
    const [{ data, fetching }] = useUserQuery();
    useEffect(() => {
        if (!fetching && !data?.user) {
            router.replace("/login?next=" + path);
        }
    }, [fetching, data, router]);
}
export default useIsAuth;