import createApiServices from "../createApiService";
const api = createApiServices();

const getDeChInventory =  (params: any,) => {
  if(!params.search){
    params.search =""
  }
  return api.makeAuthRequest({
    url: `/api/v1/detail-check-inventor?search=${params.search}`,
    method: "GET",
  });
};

const createDeChInventory = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/detail-check-inventor",
      method: "POST",
      data,
    });
  };

  const deleteDeChInventory = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/detail-check-inventor/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateDeChInventory = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/detail-check-inventor/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getDeChInventory };
export { createDeChInventory };
export { deleteDeChInventory };
export { updateDeChInventory };
