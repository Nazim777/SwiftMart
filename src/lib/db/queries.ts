import { prisma } from './prisma';

// Example query
export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};
