let initState = {};

export const UserReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "BALANCE":
      return {
        ...state,
        balance: payload,
      };
    case "USER_REWARD":
      
      return {
        ...state,
        reward: payload,
      };

    default:
      return state;
  }
};