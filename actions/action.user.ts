'use server'
import { auth, currentUser } from '@clerk/nextjs/server'
import {prisma} from '../lib/prisma'
import { revalidatePath } from 'next/cache'
import { Role } from '@prisma/client';


export const syncUser = async()=>{
    console.log('user syncing ..........................')
    try {
        const {userId}= await auth()
        const user = await currentUser()
        if(!userId && user) return

        if(userId && user){
            const existingUser = await prisma.user.findUnique({
                where:{clerkId:userId}
            })
            if(existingUser) {
                return existingUser
            }

            const dbUser =await prisma.user.create({
            data:{
                clerkId:userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                email: user.emailAddresses[0].emailAddress,
            }
            })
            return dbUser
        }

    } catch (error) {

        console.log('error',error)
        
    }
}


export const getLoggedInUser = async()=>{

    try {
        const {userId} = await auth()
        if(userId){
            const user = await prisma.user.findUnique({
                where:{clerkId:userId}
            })
            return user

        }
        
    } catch (error) {
        console.log('error',error)
    }
}


type updateUserData = {
    name:string;
    email:string
}
export const updateUser = async(userData:updateUserData)=>{
    try {
        const {userId} =await auth()
        if(userId){
            const response = await prisma.user.update({where:{clerkId:userId},data:{
                name:userData.name,
                email:userData.email
            }})
            revalidatePath('/profile')
            return response
        }
       
    } catch (error) {
        console.log('error',error)
    }

}


export const deleteUser = async()=>{
    try {
        const {userId} = await auth()
        if(userId){
            const response = await prisma.user.delete({where:{clerkId:userId}})
            revalidatePath('/profile')
            return response
        }
    } catch (error) {
        console.log('error',error)
        
    }
} 

export const isAdmin = async()=>{
    const user = await getLoggedInUser()
    return user?.role==='ADMIN'
}








export async function getUsers() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    return await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
          }
        },
        _count: {
          select: {
            orders: true,
            payments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}



export async function updateUserRole(userId: string, role: Role) {
    try {
        const admin = await isAdmin();
        if (!admin) {
          throw new Error("Unauthorized");
        }
  
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
  
      revalidatePath('/admin/users');
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  }
  