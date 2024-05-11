import createApiServices from "../createApiService";
const api = createApiServices();

const getShipment =   (params: any,) => {
  return api.makeAuthRequest({
    url: `/api/v1/shipment`,
    method: "GET",
    params
  });
};

const createShipment = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/shipment",
      method: "POST",
      data,
    });
  };

  const deleteShipment = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/shipment/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateShipment = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/shipment/${Id}`,
      method: "PUT",
      data,
    });
  };


  const uploadExcelShipment = (data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/shipment/upload-excel`,
      method: "POST",
      data,
    })
  }
  

export { getShipment };
export { createShipment };
export { deleteShipment };
export { updateShipment };
export {uploadExcelShipment}
