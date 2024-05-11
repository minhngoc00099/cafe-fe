import createApiServices from "../createApiService";
const api = createApiServices();

const getWorkShift = (params: any) => {

  return api.makeAuthRequest({
    url: `/api/v1/workshift`,
    method: "GET",
    params: params

  });
};


const createWorkShift = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/workshift",
      method: "POST",
      data,
    });
  };

  const createMany = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/workshift/createMany",
      method: "POST",
      data,
    });
  };

  const deleteWorkShift = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/workshift/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateWorkShift = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/workshift/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getWorkShift };
export { createMany };
export { createWorkShift };
export { deleteWorkShift };
export { updateWorkShift };
