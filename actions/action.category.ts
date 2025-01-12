'use server'
import { prisma } from "@/lib/prisma"
import { getLoggedInUser, isAdmin } from "./action.user"
import { category } from "@/types/category"
import { Prisma } from "@prisma/client"


export const getAllCategories = async(page:number=1,limit:number=10,searchTerm:string="",sortOrder:'asc'|'desc'='asc')=>{
    try {
        let whereCondition:any={}
        
        if(searchTerm){
            whereCondition.name = {
                contains:searchTerm,
                mode:Prisma.QueryMode.insensitive
            }
        }


        const categoryCount = await prisma.category.count({where:whereCondition})
        const totalPages = Math.ceil(categoryCount/limit)

        const effectivePage = Math.min(page, Math.max(totalPages, 1));
        const effectiveSkip = (effectivePage - 1) * limit;

        const response = await prisma.category.findMany({
            where:whereCondition,
            skip:effectiveSkip,
            take:limit,
            orderBy:{
                name:sortOrder
            }
        })
        return {data:response,success:true,totalPages:totalPages}
        
    } catch (error) {
        console.log('error',error)
        
    }
}


export const createCategory = async (data:string)=>{
    console.log('data',data)
    try {
        const admin = await isAdmin()
        if(!admin){
            throw new Error('Unauthorize')
        }

        const response = await prisma.category.create({data:{name:data}})
        return {data:response,success:true}
    } catch (error) {
        console.log('error',error)
        
    }
}

export const deleteCategory = async (id:string)=>{
    try {
        const admin = await isAdmin()
        if(!admin){
            throw new Error('Unauthorize')
        }
         await prisma.category.delete({where:{id:id}})
        return {success:true}
    } catch (error) {
        console.log('error',error)
        
    }
}


export const updateCategory = async(categoryToEdit:category)=>{
    try {
        const admin = await isAdmin()
        if(!admin){
            throw new Error('Unauthorize')
        }
        const response = await prisma.category.update({where:{id:categoryToEdit.id},data:{name:categoryToEdit.name}})
        return {success:true,data:response}
        
    } catch (error) {
        console.log('error',error)
        
    }
}