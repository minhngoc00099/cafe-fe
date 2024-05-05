import { type } from "os";

const types = {
    SELECTED_ORDER: "order/selected-order"
};

const action = {
    selectedOrder: (data: any) => {
        return {
            type: types.SELECTED_ORDER,
            payload: { data },
        };
    },
};

const actions = {
    types,
    action,
};

export default actions;
export const OrderActions = action;