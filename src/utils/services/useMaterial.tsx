import createApiServices from "../createApiService";
const api = createApiServices();

const getUseMaterial = (params: any) => {

  return api.makeAuthRequest({
    url: `/api/v1/use-material`,
    method: "GET",
    params: params

  });
};


const createUseMaterial = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/use-material",
      method: "POST",
      data,
    });
  };

  const createMany = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/use-material/createMany",
      method: "POST",
      data,
    });
  };

  const deleteUseMaterial = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/use-material/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateUseMaterial = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/use-material/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getUseMaterial };
export { createMany };
export { createUseMaterial };
export { deleteUseMaterial };
export { updateUseMaterial };
