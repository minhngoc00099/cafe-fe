const types = {
    lOAD_DATA: "invoice/load_data",
    LOAD_DATA_SUCCESS: "invoice/load_data_success",
};

const action = {
    loadData(params: any) {
        return {
            type: types.lOAD_DATA,
            payload: { params }
        };
    },

    loadDataSuccess(data: any) {
        return {
            type: types.LOAD_DATA_SUCCESS,
            payload: { data }
        }
    }

};
const actions = {
    types,
    action,
};
export default actions;
export const InvoiceActions = action;
