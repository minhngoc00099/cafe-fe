import createApiServices from "../createApiService";
const api = createApiServices();

const getProduct = (params: any) => {

  return api.makeAuthRequest({
    url: `/api/v1/product`,
    method: "GET",
    params: params

  });
};


const createProduct = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/product",
      method: "POST",
      data,
    });
  };

  const deleteProduct = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/product/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateProduct = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/product/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getProduct };
export { createProduct };
export { deleteProduct };
export { updateProduct };
