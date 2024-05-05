import actions from "./actions";
const initState = {
    invoices: {
        TotalPage: 0,
        data: []
    },
    params: {}
};
const invoiceReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case actions.types.lOAD_DATA:
            return {
                ...state,
                params: action.payload.params
            };
        case actions.types.LOAD_DATA_SUCCESS:
            return {
                ...state,
                invoices: action.payload.data
            }

        default:
            return state;
    }
};

export default invoiceReducer;
