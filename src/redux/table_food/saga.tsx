import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import stateActions from "../state/actions"
import { tableServices } from "../../utils/services/tableServices";
function* saga_loadData() {
    try {
        let _params: Promise<any> = yield select((state: any) => state.table.params)
        let params: any = _params
        yield put(stateActions.action.loadingState(true))
        let _response: Promise<any> = yield tableServices.get({
            ...params
        })
        let response: any = _response
        if (response.status) {
            yield put(actions.action.loadDataSucces(response.data))
        } else {
            yield put(actions.action.loadDataSucces({
                count: 0,
                data: []
            }))
        }

        yield put(stateActions.action.loadingState(false))

    } catch (err: any) {
        console.log(err)
    }
}
function* listen() {
     yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
}

export default function* mainSaga() {
    yield all([fork(listen)]);
}
