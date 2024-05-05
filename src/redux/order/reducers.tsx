import actions from "./actions";

const initState = {
    selectedOrder: {}
};

const OrderReducer = (state: any = initState, action: any) => {
    switch (action.type) {
        case actions.types.SELECTED_ORDER:
            return {
                ...state,
                selectedOrder: action.payload.data
            };
        
        default:
            return state;
    }
};



export default OrderReducer;