import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const getProfile = async () => {
    const response = await apiClient.get(ENDPOINTS.AUTH.LOGIN); // Placeholder
    return response.data;
};
