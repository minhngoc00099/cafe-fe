import actions from "./actions";

const initState = {
    products: {
        count: 0,
        data: []
    },
    params: {}
};

const ProductReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case actions.types.LOAD_DATA:
            return {
                ...state,
                params: action.payload.params
            };
        case actions.types.LOAD_DATA_SUCCESS:
            return {
                ...state,
                loaittbs: action.payload.data
            }

        default:
            return state;
    }
};



export default ProductReducer;