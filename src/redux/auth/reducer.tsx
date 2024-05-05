import actions from "./actions";

const initAuth = {
    username: "",
    password: "",
};
const AuthReducer = (state: any = initAuth, action: any) => {
    switch (action.type) {
        case actions.types.USER_INFO:
            return {
                ...state,
                ...{
                    user_info: action.payload.data,
                },
            };

        default:
            return state;
    }
};
export default AuthReducer;
