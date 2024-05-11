import CreateApiService from "../createApiService";

const api = CreateApiService();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/supplier`,
    method: "GET",
    params: params
  });
};

const getById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/supplier/${id}`,
    method: "GET",
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/supplier",
    method: "POST",
    data: data,
  });
};

const update = (id: Number, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/supplier/${id}`,
    method: "PUT",
    data: data,
  });
};

const deleteById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/supplier/${id}`,
    method: "DELETE",
  });
};

export const supplierServices = {
  get,
  getById,
  create,
  update,
  deleteById,
};
