import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import actions from "./actions";
import stateActions from "../state/actions"

function* listen() {
    // yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
}

export default function* mainSaga() {
    yield all([fork(listen)]);
}
