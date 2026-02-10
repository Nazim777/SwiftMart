import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const login = async (credentials: any) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
};

export const register = async (data: any) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
};
