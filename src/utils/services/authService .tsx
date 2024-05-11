
import CreateApiService from "../createApiService";

const api = CreateApiService();

const login = (data: any) => {
  return api.makeRequest({
    url: `/api/v1/auth/login`,
    method: "POST",
    data: data
  });
};

const register = (data: any) => {
  return api.makeRequest({
    url: `/api/v1/auth/register`,
    method: "POST",
    data: data
  });
};

const changepassword = (data: any) => {
  return api.makeRequest({
    url: "/api/v1/auth/change-password",
    method: "POST",
    data: data,
  });
};

export const authServices = {
  login, register, changepassword
};
