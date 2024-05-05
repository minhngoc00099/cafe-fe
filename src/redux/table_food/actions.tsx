import { type } from "os";

const types = {
    LOAD_DATA: "table_food/load_data",
    LOAD_DATA_SUCCESS: "table_food/load_data_success"

};

const action = {
    loadData: (params: any) => {
        return {
            type: types.LOAD_DATA,
            payload: { params },
        };
    },
    loadDataSucces: (data: any) => {
        return {
            type: types.LOAD_DATA_SUCCESS,
            payload: { data },
        }
    }
};

const actions = {
    types,
    action,
};

export default actions;
export const TableFoodActions = action;