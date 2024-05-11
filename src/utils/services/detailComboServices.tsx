import CreateApiService from "../createApiService";

const api = CreateApiService();

const get = (params: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/detail-combo`,
        method: "GET",
        params: params
    });
};

const getById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/v1/detail-combo/${id}`,
        method: "GET",
    });
};

const create = (data: any) => {
    return api.makeAuthRequest({
        url: "/api/v1/detail-combo",
        method: "POST",
        data: data,
    });
};

const update = (id: Number, data: any) => {
    return api.makeAuthRequest({
        url: `/api/v1/detail-combo/${id}`,
        method: "PUT",
        data: data,
    });
};

const deleteById = (id: Number) => {
    return api.makeAuthRequest({
        url: `/api/v1/detail-combo/${id}`,
        method: "DELETE",
    });
};

export const detailcomboServices = {
    get,
    getById,
    create,
    update,
    deleteById,
};
