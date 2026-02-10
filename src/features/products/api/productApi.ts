import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const getProducts = async () => {
    const response = await apiClient.get(ENDPOINTS.PRODUCTS);
    return response.data;
};
