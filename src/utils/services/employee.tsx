import createApiServices from "../createApiService";
const api = createApiServices();

const getEmployee =   (params: any,) => {
  return api.makeAuthRequest({
    url: `/api/v1/employee`,
    method: "GET",
    params
  });
};

const createEmployee = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/employee",
      method: "POST",
      data,
    });
  };

  const deleteEmployee = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/employee/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateEmployee = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/employee/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getEmployee };
export { createEmployee };
export { deleteEmployee };
export { updateEmployee };
