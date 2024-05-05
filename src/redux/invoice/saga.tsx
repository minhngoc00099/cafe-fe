import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import { invoiceServices } from "../../utils/services/invoiceService";
import actions from "./actions";
import stateActions from "../state/actions"

function* saga_loadData() {
    try {
        let _params: Promise<any> = yield select((state: any) => state.invoice.params)
        let params: any = _params
        const nowDate = new Date()
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
        yield put(stateActions.action.loadingState(true))
        let _response: Promise<any> = yield invoiceServices.get({
            ...params,
             time_start: yesterdayDate,
            time_end: nowDate,
           ...(params?.status ? params?.status : { status: [0, 1],}),
            createdAt: "DESC"
        })
        let response: any = _response
        if (response.status) {
            yield put(actions.action.loadDataSuccess(response.data))
        } else {
            yield put(actions.action.loadDataSuccess({
                TotalPage: 0,
                data: []
            }))
        }

        yield put(stateActions.action.loadingState(false))

    } catch (err: any) {
        console.log(err)
        yield put(actions.action.loadDataSuccess({
            TotalPage: 0,
            data: []
        }))
    }
}
function* listen() {
    yield takeEvery(actions.types.lOAD_DATA, saga_loadData);
}

export default function* mainSaga() {
    yield all([fork(listen)]);
}
