const types = {
    USER_INFO: "auth/user_info",
  };
  const action = {
    userInfo: (data: any) => {
      return {
        type: types.USER_INFO,
        payload: { data },
      };
    },
  };
  
  const actions = {
    types,
    action,
  };
  
  export default actions;
  export const AuthActions = action;
  