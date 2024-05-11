import createApiServices from "../createApiService";
const api = createApiServices();

const getPosition = () => {
  return api.makeAuthRequest({
    url: "/api/v1/position",
    method: "GET",
  });
};
const createPosition = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/position",
      method: "POST",
      data,
    });
  };

  const deletePosition = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/position/${Id}`,
      method: "DELETE",
    });
  };
  
  const updatePosition = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/position/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getPosition };
export { createPosition };
export { deletePosition };
export { updatePosition };
