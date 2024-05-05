import actions from "./actions";

const initState = {
    params: {},
    tablefood: {
        TotalPage: 0,
        data: []
    }
};

const OrderReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case actions.types.LOAD_DATA:
            return {
                ...state,
                params: action.payload.params
            };
        case actions.types.LOAD_DATA_SUCCESS:
            return {
                ...state,
                tablefood: action.payload.data
            };
            
        default:
            return state;
    }
};



export default OrderReducer;