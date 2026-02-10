import { useSession } from "@clerk/nextjs";

export const useSessionHook = () => {
    const { session } = useSession();
    return session;
};
