import createApiServices from "../createApiService";
const api = createApiServices();

const getMaterial =  (params: any,) => {
  // if(!params.search){
  //   params.search =""
  // }
  return api.makeAuthRequest({
    // url: `/api/v1/material?search=${params.search}`,
    url: `/api/v1/material`,
    method: "GET",
    params : params
  });
};

const createMaterial = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/material",
      method: "POST",
      data,
    });
  };

  const deleteMaterial = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/material/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateMaterial = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/material/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getMaterial };
export { createMaterial };
export { deleteMaterial };
export { updateMaterial };
