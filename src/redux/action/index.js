export const ContarctAction = (Useraccount, txiContract,amount,recipt) => async (
    dispatch
  ) => {
     txiContract.methods
      .balanceOf(Useraccount)
      .call()
      .then((balance) => {   
        dispatch({
          type: "BALANCE",
          payload: balance,
        });
      });
      txiContract.methods
      .calculateBNBReward(Useraccount)
      .call()
      .then((reward) => {   
        dispatch({
          type: "USER_REWARD",
          payload: reward,
        });
      });
  };