"use server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "./action.user";
import { productTypeForCreateAndEdit } from "@/types/product";
import { Prisma } from '@prisma/client';



export const getAllProducts = async (
  page: number = 1,
  limit: number = 4,
  searchTerm: string = "",
  filters: {
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: string[];
    stockStatus?: 'inStock' | 'outOfStock' | 'all';
  } = {},
  sortOrder: "asc" | "desc" = "asc"
) => {
  console.log('sortOrder',sortOrder)
  try {
    

   
    let whereConditions: any = {};

    
    if (searchTerm) {
      whereConditions.name = {
        contains: searchTerm,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    
    if (filters.minPrice !== 0 || filters.maxPrice !== 1500) {
      whereConditions.price = {
        ...(filters.minPrice !== 0 && { gte: filters.minPrice }),
        ...(filters.maxPrice !== 1500 && { lte: filters.maxPrice }),
      };
    }

    
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      whereConditions.categories = {
        some: {
          categoryId: {
            in: filters.categoryIds
          }
        }
      };
    }

   
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      whereConditions.stock = filters.stockStatus === 'inStock' 
        ? { gt: 0 }
        : { equals: 0 };
    }



    const totalProducts = await prisma.product.count({
      where: whereConditions,
    });


    const totalPages = Math.ceil(totalProducts / limit);
    
    // Adjust page number if it exceeds total pages
    const effectivePage = Math.min(page, Math.max(totalPages, 1));
    const effectiveSkip = (effectivePage - 1) * limit;



    const response = await prisma.product.findMany({
      where: whereConditions,
      skip: effectiveSkip,
      take: limit,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: sortOrder 
      }
    });

    



    return {
      products: response,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: effectivePage,
      appliedFilters: {
        searchTerm,
        ...filters,
      }
    };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};




export const createProduct = async (
  productData: productTypeForCreateAndEdit
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const response = await prisma.product.create({
      data: {
        name: productData.name,
        url: productData.url,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categories: {
          create: productData.categories?.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return { data: response, success: true };
  } catch (error) {
    console.log('error',error)
    throw error
  }
};

export const updateProduct = async (
  productData: productTypeForCreateAndEdit
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
    const response = await prisma.product.update({
      where: { id: productData?.id },
      data: {
        name: productData.name,
        stock: productData.stock,
        url: productData.url,
        description: productData.description,
        price: productData.price,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return { data: response, success: true };
  } catch (error) {
    console.log("error", error);
    throw error
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    const response = await prisma.product.delete({ where: { id: productId } });
    return { data: response, success: true };
  } catch (error) {
    console.log("error", error);
    throw error
  }
};

export const getProduct = async (productId: string) => {
  try {
    const response = await prisma.product.findUnique({
      where: { id: productId },
      include: { categories: { include: { category: true } } },
    });
    return {data:response,success:true}
  } catch (error) {
    console.log('error',error)
    throw error
  }
};
