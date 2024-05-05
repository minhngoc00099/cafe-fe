import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import stateSaga from "./state/saga";
import productSaga from "./product/saga";
import categorySaga from "./category/saga"
import comboSaga from "./combo/saga"
import orderSaga from "./order/saga"
import TableSaga from "./table_food/saga"
import InvoiceSaga from "./invoice/saga"
export default function* rootSaga() {
    yield all([
        authSaga(),
        stateSaga(),
        productSaga(),
        categorySaga(),
        comboSaga(),
        orderSaga(),
        TableSaga(),
        InvoiceSaga()
    ]);
}