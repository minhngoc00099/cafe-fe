import CreateApiService from "../createApiService";

const api = CreateApiService();

const get = (params: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/category`,
        method: "GET",
        params: params
    });
};

const getById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/v1/category/${id}`,
        method: "GET",
    });
};

const create = (data: any) => {
    return api.makeAuthRequest({
        url: "/api/v1/category",
        method: "POST",
        data: data,
    });
};

const update = (id: Number, data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/category/${id}`,
        method: "PUT",
        data: data,
    });
};

const deleteById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/v1/category/${id}`,
        method: "DELETE",
    });
};

export const categoryServices = {
    get,
    getById,
    create,
    update,
    deleteById,
};
