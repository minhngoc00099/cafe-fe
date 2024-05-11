import createApiServices from "../createApiService";
const api = createApiServices();

const getCustomer = (params: any,) => {
  return api.makeAuthRequest({
    url: `/api/v1/customer`,
    method: "GET",
    params: params
  });
};

const createCustomer = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/customer",
      method: "POST",
      data,
    });
  };

  const deleteCustomer = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/customer/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateCustomer = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/customer/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getCustomer };
export { createCustomer };
export { deleteCustomer };
export { updateCustomer };
