export type loggedInUserType = {
    id: string;
    clerkId: string;
    email: string;
    role: 'USER' | 'ADMIN'
    createdAt: Date;
    updatedAt: Date;
    name: string;
} | null | undefined
