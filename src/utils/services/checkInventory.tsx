import createApiServices from "../createApiService";
const api = createApiServices();

const getChInventory =  (params: any,) => {
  if(!params.search){
    params.search =""
  }
  return api.makeAuthRequest({
    url: `/api/v1/check-inventor?search=${params.search}`,
    method: "GET",
  });
};

const createChInventory = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/check-inventor",
      method: "POST",
      data,
    });
  };

  const deleteChInventory = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/check-inventor/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateChInventory = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/check-inventor/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getChInventory };
export { createChInventory };
export { deleteChInventory };
export { updateChInventory };
