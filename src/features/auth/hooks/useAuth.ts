import { useUser } from "@clerk/nextjs";

export const useAuth = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    return { user, isLoaded, isSignedIn };
};
