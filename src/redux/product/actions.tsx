import { type } from "os";

const types = {
    LOAD_DATA: "/product/load-data",
    LOAD_DATA_SUCCESS: "/product/load-data-success",
    SELECTED_PAGE: "product/selected-page",
    ADD_PRODUCT: "/product/add-product",
    SET_INFO_PRODUCT: "/product/set-info-product",
    DELETE_PRODUCT: "/product/delete-product",
};

const action = {
    loadData(params: any) {
        return {
            type: types.LOAD_DATA,
            payload: { params }
        };
    },
    loadDataSuccess: (products: any) => {
        return {
            type: types.LOAD_DATA_SUCCESS,
            payload: { products },
        };
    },
    setSelectedPage: (selectedPage: any) => {
        return {
            type: types.SELECTED_PAGE,
            payload: { selectedPage },
        };
    },
    addProduct: () => {
        return {
            type: types.SELECTED_PAGE,
        }
    },
    setInfoProduct: (infoProduct: any) => {
        return {
            type: types.ADD_PRODUCT,
            payload: { infoProduct }
        }
    },
    deleteProduct: (productId: any) => {
        return {
            type: types.DELETE_PRODUCT,
        }
    }
};

const actions = {
    types,
    action,
};

export default actions;
export const ProductActions = action;