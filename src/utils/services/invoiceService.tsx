import CreateApiService from "../createApiService";

const api = CreateApiService();

const get = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice`,
    method: "GET",
    params
  });
};


const getInvoiceByIdTable = (id_table: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/invoice/detail-by-id-table/${id_table}`,
      method: "GET",
     
    });
  };

const getById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "GET",
  });
};

const create = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/invoice",
    method: "POST",
    data: data,
  });
};

const update = (id: Number, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "PUT",
    data: data,
  });
};

const deleteById = (id: Number) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/${id}`,
    method: "DELETE",
  });
};

const combineInvoice  = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/invoice/combine-inovice",
    method: "POST",
    data: data,
  });
}

const splitInvoice  = (data: any) => {
  return api.makeAuthRequest({
    url: "/api/v1/invoice/split-order",
    method: "POST",
    data: data,
  });
}

const paymentInvoice = (id: any, data: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/payment/${id}`,
    method: "POST",
    data: data,
  });
}

const getOrverView = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/over-view/get`,
    method: "GET",
    params: params
  });
};

const getRevenueOverview = () => {
  return api.makeAuthRequest({
    url: `/api/v1/invoice/over-view/revenue-overview`,
    method: "GET",
    // params: params
  });
};

export const invoiceServices = {
  get,
  getById,
  create,
  update,
  deleteById,
  getInvoiceByIdTable,
  combineInvoice,
  splitInvoice,
  paymentInvoice,
  getOrverView,
  getRevenueOverview
};
