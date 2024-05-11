import createApiServices from "../createApiService";
const api = createApiServices();

const getInvoiceDetail = (params: any) => {

  return api.makeAuthRequest({
    url: `/api/v1/invoice-detail`,
    method: "GET",
    params: params

  });
};


const createInvoiceDetail = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/invoice-detail",
      method: "POST",
      data,
    });
  };

  const deleteInvoiceDetail = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/invoice-detail/${Id}`,
      method: "DELETE",
    });
  };
  
  const updateInvoiceDetail = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/invoice-detail/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getInvoiceDetail };
export { createInvoiceDetail };
export { deleteInvoiceDetail };
export { updateInvoiceDetail };
