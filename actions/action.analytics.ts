"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { isAdmin } from "./action.user";

export async function getDashboardStats() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorize");
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      productStats,
      recentOrders,
      paymentStats,
      monthlyStats,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // New users this month
      prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),

      // New users last month
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Total orders
      prisma.order.count(),

      // Orders this month
      prisma.order.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),

      // Orders last month
      prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Total revenue from successful payments
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      }),

      // Revenue this month
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Revenue last month
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Product stats
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
        orderBy: {
          orderItems: {
            _count: "desc",
          },
        },
        take: 5,
      }),

      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          payment: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }),

      // Payment stats
      prisma.payment.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Monthly stats for the last 6 months
      prisma.order.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: {
            gte: subMonths(now, 6),
          },
        },
        _count: true,
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        growth:
          ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100,
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        growth: ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        thisMonth: revenueThisMonth._sum.amount || 0,
        growth:
          (((revenueThisMonth._sum.amount || 0) -
            (revenueLastMonth._sum.amount || 0)) /
            (revenueLastMonth._sum.amount || 1)) *
          100,
      },
      topProducts: productStats,
      recentOrders,
      paymentStats,
      monthlyStats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
}
