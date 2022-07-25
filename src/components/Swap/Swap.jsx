import React, { useState, useRef, useEffect } from "react";
import coin from "../../images/coin.png";
import balance from "../../images/iconWhite (1).png";
import Web3 from "web3";
import drops from "../../images/coinwhite.png";
import avax from '../../images/avax.png'
import { ToastContainer, toast } from "react-toastify";
import van from "../../images/van.png";
import contact from "../../images/contact (2).png";
import transfer from "../../images/transfer.png";
import { useTranslation } from "react-i18next";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "react-bootstrap/Button";
import Chart from "./Chart";
import axios from "axios";
import price from "crypto-price";
import Unit from "cryptocurrency-unit-convert"
import { loadWeb3 } from "../api";
import { faucetTokenAddress, faucetTokenAbi } from "../utils/Faucet";
import {
  fountainContractAddress,
  fountainContractAbi,
} from "../utils/Fountain";
// import { useState } from "react";
import "./Swap.css";
import bigInt from "big-integer";
const webSupply = new Web3("https://api.avax.network/ext/bc/C/rpc");
const Swap = ({setOneTokenPrice}) => {
  let [boxOne, setBoxOne] = useState(false);
  let [tripType, setTripType] = useState(1);
  let [tripType1, setTripType1] = useState(1);
  let [enteredVal, setEnteredval] = useState(0);
  let [estimate, setEstimate] = useState();
  let [estimateDrip, setEstimateDrip] = useState();
  let [minRecievedDrip, setMinRecievedDrip] = useState();
  let [minRecieved, setMinrecieved] = useState();
  let [tenPerVal, setTenperVal] = useState(0);
  let [userDripBalance, setuserDripBalance] = useState(0);
  let [usersBalance, setUsersBalance] = useState(0);
  let [bnbPrice, setBnbPrice] = useState(0);
  let [dripUsdtprice, setdripUsdtPrice] = useState(0);
  let [usdtPrice, setUsdPrice] = useState(0);
  let [isToogle, setisToogle] = useState(false);
  //New States for BnB Contract balanace and Drip C-bal
  let [cBnbBalance, setCbnbBalance] = useState(0);
  let [cDripBalance, setCdripBalance] = useState(0);

  // states for B by D
  let [division, setDivision] = useState(0);
  let [oneDripPrice, setOnedripPrice] = useState(0);
  // state for sell without
  let [withouttofixed, setWithoutToFixed] = useState(0);
  // states for belowfooter swap
  let [tSupllyDrip, setTsupplyDrip] = useState(0);
  let [tSupllyFountain, setTsupplyFountain] = useState(0);
  let [tTransactionsFountain, setTtransactionFountain] = useState(0);
  let [croValue, setCroValue] = useState(0);
  const { t, i18n } = useTranslation();
  const inputEl = useRef();
  let inputE2 = useRef();
  // for radio inputs Buy splash
  let mYentered = useRef();
  // for radio inputs Sell splash
  let mYEnter1 = useRef();

  const getData = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
      } else {
        const web3 = window.web3;
        let tokenContractOf = new web3.eth.Contract(
          faucetTokenAbi,
          faucetTokenAddress
        );
        let balance = await web3.eth.getBalance(acc);
        balance = web3.utils.fromWei(balance);
        balance = parseFloat(balance).toFixed(7);
        setUsersBalance(balance);

        let dripBalance = await tokenContractOf.methods.balanceOf(acc).call();
        dripBalance = web3.utils.fromWei(dripBalance);
        dripBalance = parseFloat(dripBalance).toFixed(7);
        setuserDripBalance(dripBalance);
      }
    } catch (e) {
      console.log("Error while fetching Api", e);
    }
  };
  const getDataWitoutMetamask = async () => {
    try {

      let usdValue = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=AVAXUSDT")
      let currentBnB = usdValue.data.price;
      let contractOf = new webSupply.eth.Contract(
        fountainContractAbi,
        fountainContractAddress
      );

      let tokenContractOf = new webSupply.eth.Contract(
        faucetTokenAbi,
        faucetTokenAddress
      );

      let contractFBalance = await webSupply.eth.getBalance(
        fountainContractAddress
      );
      contractFBalance = webSupply.utils.fromWei(contractFBalance);
      contractFBalance = parseFloat(contractFBalance).toFixed(7);

      let contractFdripBalance = await tokenContractOf.methods
        .balanceOf(fountainContractAddress)
        .call();
      contractFdripBalance = webSupply.utils.fromWei(contractFdripBalance);
      contractFdripBalance = parseFloat(contractFdripBalance).toFixed(7);

      let supplyDrip = await tokenContractOf.methods.totalSupply().call();
      supplyDrip = webSupply.utils.fromWei(supplyDrip);
      supplyDrip = parseFloat(supplyDrip).toFixed(7);

      let fonutainDrip = await contractOf.methods.totalSupply().call();
      fonutainDrip = webSupply.utils.fromWei(fonutainDrip);
      fonutainDrip = parseFloat(fonutainDrip).toFixed(7);

      let transactionFountain = await contractOf.methods.totalTxs().call();

      let converted = currentBnB * contractFBalance;
      converted = parseFloat(converted).toFixed(7);

      let covertedDrip = contractFBalance / contractFdripBalance;
      let BdividedByD = covertedDrip;
      BdividedByD = parseFloat(BdividedByD).toFixed(7);
      let priceOfoneDrip = covertedDrip * currentBnB;
      priceOfoneDrip = parseFloat(priceOfoneDrip).toFixed(7);

      covertedDrip = covertedDrip * currentBnB;
      covertedDrip = parseFloat(covertedDrip).toFixed(7);
      covertedDrip = contractFdripBalance * covertedDrip;
      covertedDrip = parseFloat(covertedDrip).toFixed(7);

      setUsdPrice(currentBnB);
      setdripUsdtPrice(covertedDrip);
      setBnbPrice(converted);

      setCbnbBalance(contractFBalance);
      setCdripBalance(contractFdripBalance);
      setDivision(BdividedByD);
      setOnedripPrice(priceOfoneDrip);
      setOneTokenPrice(priceOfoneDrip)
      setTsupplyDrip(supplyDrip);
      setTsupplyFountain(fonutainDrip);
      setTtransactionFountain(transactionFountain);
    } catch (e) {
      console.log("error while get data without metamask",e);
    }
  };
  const addMaxBalance = async () => {
    try{
    let acc = await loadWeb3();

    if (acc == "No Wallet") {
      toast.error("No Wallet Connected")
    } else {
      const web3 = window.web3;
      let tokenContractOf = await new web3.eth.Contract(
        faucetTokenAbi,
        faucetTokenAddress
      );
      let dripBalance = await tokenContractOf.methods.balanceOf(acc).call();
      dripBalance = webSupply.utils.fromWei(dripBalance);
      inputE2.current.value = dripBalance;
      dripBalance = parseFloat(dripBalance).toFixed(7);
      setuserDripBalance(dripBalance);
      await enterBuyAmount2();
    }
  }catch(e){
    console.log("error while get max balance",e);
  }
  };
  const enterBuyAmount1 = async () => {
    try{
    let myvalue = inputEl.current.value;
    let contractOf = new webSupply.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );
    if (myvalue > 0) {
      myvalue = webSupply.utils.toWei(myvalue);
      setEnteredval(myvalue);

      

      let tokensInputPrice = await contractOf.methods
        .getBnbToTokenInputPrice(myvalue)
        .call();
     
      tokensInputPrice = webSupply.utils.fromWei(tokensInputPrice);
      tokensInputPrice = parseFloat(tokensInputPrice).toFixed(7);

      let miniumrcvd = (tripType * tokensInputPrice) / 100;
      let percentValue = tokensInputPrice - miniumrcvd;
      percentValue = parseFloat(percentValue).toFixed(7);

      setEstimate(tokensInputPrice);
      setMinrecieved(percentValue);
    } else {
      setEstimate();
      setMinrecieved();
    }
  }catch(e){
    console.log("error while getting data against entered amount",e);
  }
  };
  const enterRadioAmount1 = async () => {
    try{

    let myMultiplyValue = 1;
    let myvalue = inputEl.current.value;

    const web3 = window.web3;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);
      setEnteredval(myvalue);

      let tokensInputPrice = await contractOf.methods
        .getBnbToTokenInputPrice(myvalue)
        .call();
      tokensInputPrice = web3.utils.fromWei(tokensInputPrice);
      tokensInputPrice = parseFloat(tokensInputPrice).toFixed(7);

      let miniumrcvd = (myMultiplyValue * tokensInputPrice) / 100;
      let percentValue = tokensInputPrice - miniumrcvd;
      percentValue = parseFloat(percentValue).toFixed(7);
      setEstimate(tokensInputPrice);
      setMinrecieved(percentValue);
    } else {
      setEstimate();
      setMinrecieved();
    }
  }catch(e){
    console.log("Error while Getting data against selected radio button",e)
  }
  };
  const enterRadioAmount3 = async () => {
    try{

 
    let myMultiplyValue = 3;
    const web3 = window.web3;
    let myvalue = inputEl.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);
      setEnteredval(myvalue);

      let tokensInputPrice = await contractOf.methods
        .getBnbToTokenInputPrice(myvalue)
        .call();
      tokensInputPrice = web3.utils.fromWei(tokensInputPrice);
      tokensInputPrice = parseFloat(tokensInputPrice).toFixed(7);

      let miniumrcvd = (myMultiplyValue * tokensInputPrice) / 100;
      let percentValue = tokensInputPrice - miniumrcvd;
      percentValue = parseFloat(percentValue).toFixed(7);

      setEstimate(tokensInputPrice);
      setMinrecieved(percentValue);
    } else {
      setEstimate();
      setMinrecieved();
    }
  }catch(e){
    console.log("Error while getting amount against selected radio button",e);
  }
  };
  const enterRadioAmount5 = async () => {
    try{
    let myMultiplyValue = 5;

    const web3 = window.web3;
    let myvalue = inputEl.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );
    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);
      setEnteredval(myvalue);

      let tokensInputPrice = await contractOf.methods
        .getBnbToTokenInputPrice(myvalue)
        .call();
      tokensInputPrice = web3.utils.fromWei(tokensInputPrice);
      tokensInputPrice = parseFloat(tokensInputPrice).toFixed(7);

      let miniumrcvd = (myMultiplyValue * tokensInputPrice) / 100;
      let percentValue = tokensInputPrice - miniumrcvd;
      percentValue = parseFloat(percentValue).toFixed(7);

      setEstimate(tokensInputPrice);
      setMinrecieved(percentValue);
    } else {
      setEstimate();
      setMinrecieved();
    }
  }catch(e){
    console.log("Error while getting amount against selected radio button",e);
  }
  };
  const myOnchangeInputBuySwap = async () => {
    try
    {

    
    let myCurrentVal = mYentered.current.value;
    if (myCurrentVal < 100) {
      if (myCurrentVal >= 1) {
        setTripType(myCurrentVal);

        const web3 = window.web3;
        let myvalue = inputEl.current.value;
        let contractOf = new web3.eth.Contract(
          fountainContractAbi,
          fountainContractAddress
        );

        if (myvalue > 0) {
          myvalue = web3.utils.toWei(myvalue);
          setEnteredval(myvalue);

          let tokensInputPrice = await contractOf.methods
            .getBnbToTokenInputPrice(myvalue)
            .call();
          tokensInputPrice = web3.utils.fromWei(tokensInputPrice);
          tokensInputPrice = parseFloat(tokensInputPrice).toFixed(7);

          let miniumrcvd = (myCurrentVal * tokensInputPrice) / 100;
          let percentValue = tokensInputPrice - miniumrcvd;
          percentValue = parseFloat(percentValue).toFixed(7);

          setEstimate(tokensInputPrice);
          setMinrecieved(percentValue);
          setTripType(myCurrentVal);
        } else {
          setEstimate();
          setMinrecieved();
        }
      } else {
        toast.error("Slippage cannot be less than 1");
      }
    } else {
      toast.error("Slippage Cannot be over 100");
    }
  }catch(e){
    console.log("Error while getting values against entered amount" );
  }
  };
  const myRadioSellSplash1 = async () => {
    try{
    let myValFormul = 1;
    const web3 = window.web3;
    let myvalue = inputE2.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);

      setEnteredval(myvalue);
      let tokensOutputPrice = await contractOf.methods
        .getTokenToBnbInputPrice(myvalue)
        .call();
      tokensOutputPrice = web3.utils.fromWei(tokensOutputPrice);

      let tenPercentVal = (tokensOutputPrice * 10) / 100;
      tenPercentVal = tokensOutputPrice - tenPercentVal;
      // tenPercentVal = web3.utils.fromWei(tenPercentVal);
      let miniumrcvdDrip = (myValFormul * tenPercentVal) / 100;
      let percentValue = tenPercentVal - miniumrcvdDrip;
      setWithoutToFixed(percentValue);

      percentValue = parseFloat(percentValue).toFixed(7);
      tenPercentVal = parseFloat(tenPercentVal).toFixed(7);
      tokensOutputPrice = parseFloat(tokensOutputPrice).toFixed(7);

      percentValue = parseFloat(percentValue).toFixed(7);
      setMinRecievedDrip(percentValue);
      setEstimateDrip(tokensOutputPrice);
      setTenperVal(tenPercentVal);
    } else {
      setEstimateDrip(0);
      setMinRecievedDrip(0);
      setTenperVal(0);
    }
  }catch(e){
    console.log("Error while getting amount against selected radio button",e);
  }
  };
  const myRadioSellSplash3 = async () => {
   try{
    let myValFormul = 3;
    const web3 = window.web3;
    let myvalue = inputE2.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);

      setEnteredval(myvalue);
      let tokensOutputPrice = await contractOf.methods
        .getTokenToBnbInputPrice(myvalue)
        .call();
      tokensOutputPrice = web3.utils.fromWei(tokensOutputPrice);

      let tenPercentVal = (tokensOutputPrice * 10) / 100;
      tenPercentVal = tokensOutputPrice - tenPercentVal;
  
      let miniumrcvdDrip = (myValFormul * tenPercentVal) / 100;
      let percentValue = tenPercentVal - miniumrcvdDrip;
      setWithoutToFixed(percentValue);

      percentValue = parseFloat(percentValue).toFixed(7);
      tenPercentVal = parseFloat(tenPercentVal).toFixed(7);


      tokensOutputPrice = parseFloat(tokensOutputPrice).toFixed(7);

      percentValue = parseFloat(percentValue).toFixed(7);
      setMinRecievedDrip(percentValue);
      setEstimateDrip(tokensOutputPrice);
      setTenperVal(tenPercentVal);
    } else {
      setEstimateDrip(0);
      setMinRecievedDrip(0);
      setTenperVal(0);
    }
  }catch(e){
    console.log("Error while getting amount against selected radio button",e);
  }
  };
  const enterBuyAmount2 = async () => {
    try{
    const web3 = window.web3;
    let myvalue = inputE2.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);

      setEnteredval(myvalue);
      let tokensOutputPrice = await contractOf.methods
        .getTokenToBnbInputPrice(myvalue)
        .call();
      tokensOutputPrice = web3.utils.fromWei(tokensOutputPrice);
      let tenPercentVal = (tokensOutputPrice * 10) / 100;
      tenPercentVal = tokensOutputPrice - tenPercentVal;

      let miniumrcvdDrip = (tripType1 * tenPercentVal) / 100;
      let percentValue = tenPercentVal - miniumrcvdDrip;
      setWithoutToFixed(percentValue);
      percentValue = parseFloat(percentValue).toFixed(7);
      tenPercentVal = parseFloat(tenPercentVal).toFixed(7);
      tokensOutputPrice = parseFloat(tokensOutputPrice).toFixed(7);

      percentValue = parseFloat(percentValue).toFixed(7);
      setMinRecievedDrip(percentValue);
      setEstimateDrip(tokensOutputPrice);
      setTenperVal(tenPercentVal);
    } else {
      setEstimateDrip(0);
      setMinRecievedDrip(0);
      setTenperVal(0);
    }
  }catch(e){
    console.log("Error while getting values against entered amoount",e);
  }
  };
  const myOnchangeInputSellSplash = async () => {
   try{
    let iEntered = mYEnter1.current.value;
    if (iEntered < 100) {
      if (iEntered >= 1) {
        setTripType1(iEntered);
        const web3 = window.web3;
        let myvalue = inputE2.current.value;
        let contractOf = new web3.eth.Contract(
          fountainContractAbi,
          fountainContractAddress
        );

        if (myvalue > 0) {
          myvalue = web3.utils.toWei(myvalue);

          setEnteredval(myvalue);
          let tokensOutputPrice = await contractOf.methods
            .getTokenToBnbInputPrice(myvalue)
            .call();
          tokensOutputPrice = web3.utils.fromWei(tokensOutputPrice);

          let tenPercentVal = (tokensOutputPrice * 10) / 100;
          tenPercentVal = tokensOutputPrice - tenPercentVal;
          let miniumrcvdDrip = (iEntered * tenPercentVal) / 100;
          let percentValue = tenPercentVal - miniumrcvdDrip;
      setWithoutToFixed(percentValue);

          percentValue = parseFloat(percentValue).toFixed(7);
          tenPercentVal = parseFloat(tenPercentVal).toFixed(7);
          tokensOutputPrice = parseFloat(tokensOutputPrice).toFixed(7);

          percentValue = parseFloat(percentValue).toFixed(7);
          setMinRecievedDrip(percentValue);
          setEstimateDrip(tokensOutputPrice);
          setTenperVal(tenPercentVal);
        } else {
          setEstimateDrip(0);
          setMinRecievedDrip(0);
          setTenperVal(0);
        }
      } else {
        toast.error("Slippage Cannot be less than 1");
      }
    } else {
      toast.error("Slippage cannot be Over 100");
    }
  }catch(e){
    console.log("Error while getting values against entered amount",e);
  }
  };
  const myRadioSellSplash5 = async () => {

    try{
    let myValFormul = 5;
    const web3 = window.web3;
    let myvalue = inputE2.current.value;
    let contractOf = new web3.eth.Contract(
      fountainContractAbi,
      fountainContractAddress
    );

    if (myvalue > 0) {
      myvalue = web3.utils.toWei(myvalue);

      setEnteredval(myvalue);
      let tokensOutputPrice = await contractOf.methods
        .getTokenToBnbInputPrice(myvalue)
        .call();
      tokensOutputPrice = web3.utils.fromWei(tokensOutputPrice);

      let tenPercentVal = (tokensOutputPrice * 10) / 100;
      tenPercentVal = tokensOutputPrice - tenPercentVal;

      let miniumrcvdDrip = (myValFormul * tenPercentVal) / 100;
      let percentValue = tenPercentVal - miniumrcvdDrip;
      setWithoutToFixed(percentValue);
      
      percentValue = parseFloat(percentValue).toFixed(7);
      tenPercentVal = parseFloat(tenPercentVal);
      tokensOutputPrice = parseFloat(tokensOutputPrice).toFixed(7);

      percentValue = parseFloat(percentValue).toFixed(7);
      setMinRecievedDrip(percentValue);
      setEstimateDrip(tokensOutputPrice);
      setTenperVal(tenPercentVal);
    } else {
      setEstimateDrip(0);
      setMinRecievedDrip(0);
      setTenperVal(0);
    }
  }catch(e){
      console.log("Error while getting amount against selected radio button",e);
    }
  };
  const swapBnbtoToken = async () => {
    await enterBuyAmount1();
    try {
      const web3 = window.web3;
      let acc = await loadWeb3();
      if(acc == "No Wallet"){
        toast.error("No Wallet Connected")
      }else {let myvalue = inputEl.current.value;
      if (parseFloat(myvalue) > 0) {
        if (parseFloat(usersBalance) > parseFloat(myvalue)) {
          myvalue = web3.utils.toWei(myvalue);
          let contractOf = new web3.eth.Contract(
            fountainContractAbi,
            fountainContractAddress
          );
          let tokensInputPrice = await contractOf.methods
            .getBnbToTokenInputPrice(myvalue)
            .call();
          let miniumrcvd = (tripType * tokensInputPrice) / 100;
          let percentValue = tokensInputPrice - miniumrcvd;
          percentValue = percentValue.toString();
          let b = bigInt(percentValue);
          let convertValue = b.value.toString();

          if (percentValue > 0) {
            let trHash = ""
            await contractOf.methods
              .bnbToTokenSwapInput(convertValue)
              .send({
                from: acc,
                value: myvalue.toString(),
              })
              .on("transactionHash",async(hash)=>{
                let data = {
                  hash:hash,
                  toAddress :fountainContractAddress,
                  fromAddress : acc,
                  id:acc,
                  amount:inputEl.current.value.toString()
                }
               await axios.post("https://splash-test-app.herokuapp.com/api/users/postEvents",data);
              })
      
            toast.success("Transaction confirmed");
          } else {
            toast.error("Please Select Slippage Tolerance");
          }
        } else {
          toast.error(
            "Entered Amount is greater than Your balance. Please Recharge."
          );
        }
      } else {
        toast.error("Seems Like You Forgot to Enter Amount");
      }}
    } catch (e) {
      console.log("Error ; ", e);
      toast.error("Transaction Failed");
    }
  };

  const bnbSwapSell = async () => {

    await enterBuyAmount2();
    try {
      let acc = await loadWeb3();
      const web3 = window.web3;
     
      let myvalue = inputE2.current.value;
      myvalue = parseFloat(myvalue);
      // minRecievedDrip
      
      if (myvalue >= 1) {
        let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
          
           
        if (parseFloat(userDripBalance) >= myvalue) {
          myvalue = myvalue.toString();
          let myAllowance = await tokenContractOf.methods
            .allowance(acc, fountainContractAddress)
            .call();
          if (myAllowance > 0) {
            let myvalue1 = web3.utils.toWei(myvalue);

            if (parseFloat(myAllowance) >= parseFloat(myvalue1)) {
          
              let val = withouttofixed.toString()
              let parameter = web3.utils.toWei(val);

              let contractOf = new web3.eth.Contract(
                fountainContractAbi,
                fountainContractAddress
              );

              if (parameter > 0) {
                let c = bigInt(myvalue1);
                c = c.value.toString();
                await contractOf.methods
                  .tokenToBnbSwapInput(myvalue1, parameter)
                  .send({
                    from: acc,
                  })
                  .on("transactionHash",async(hash)=>{
                    let data = {
                      hash:hash,
                      toAddress :fountainContractAddress,
                      fromAddress : acc,
                      id:acc,
                      amount:inputE2.current.value.toString()
                    }
                    await axios.post("https://splash-test-app.herokuapp.com/api/users/postEvents",data);
                  })
                
                 

                toast.success("Transaction Confirmed");
              } else {
                toast.error("Please Select Slippage Tolerance");
              }
            } else {
              toast.error(
                "Oops You Entered Value Greater than your approval amount"
              );
            }
          } else {
            toast.error("It Seems Like you Dont Have ApprovedToken");
          }
        } else {
          toast.error("In Sufficient balance please recharge");
        }
      
      } else {
        toast.error("Amount cannot be less than 1");
      }
    } catch (e) {
      console.log("Failed With :", e);
      toast.error(" Transaction Failed");
    }
  };

  const show = () => {
    setBoxOne(!boxOne);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [data, setdata] = React.useState(null);

  const handleClickon = (event) => {
    setdata(event.currentTarget);
  };

  const handleCloseon = () => {
    setdata(null);
  };

  const opento = Boolean(data);
  const idto = opento ? "simple-popover" : undefined;

  const getToogle = async (e) => {
    try {
      const web3 = window.web3;
      let acc = await loadWeb3();
      let myvalue = inputE2.current.value;
      if (myvalue > 0) {
        let myvalue1 = web3.utils.toWei(myvalue);
    
        let tokenContractOf = new web3.eth.Contract(
          faucetTokenAbi,
          faucetTokenAddress
        );
            
           
        setisToogle(true);
              await tokenContractOf.methods
                .approve(fountainContractAddress, web3.utils.toWei(myvalue1))
                .send({
                  from: acc,
                });
              toast.success("Transaction Confirmed");
              setisToogle(false);
            
      } else {
        toast.error("Looks Like You Forgot to Enter Amount");
      }
    } catch (e) {
      console.log("Error While approving ", e);
      toast.error("Oops you cancelled transaction");
      setisToogle(false);
    }
  };
  setInterval(() => {
    getData();
  }, 1000);
  useEffect(() => {
    getDataWitoutMetamask();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="images">
      <div id="fountain">
        <div className="container">
          <div className="landing-page">
            <div className="row mb-4 mt-2">
              <div className="container col-xl-12">
                <div className="home-text text-center row">
                  <div className="container">
                    <div className="row">
                      <div className="col">
                        <span className="luck-title  notranslate fw-bold">
                          
                          <b style={{fontFamily:"Jost"}}>{t("TheWell.1")}</b>
                          
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4 mt-2">
                  <div className="container col-md-3 col-sm-12 text-center">
                    <div className="price-top-part">
                      <img src={coin} alt="" width="60px" />
                      <h5
                        className="mb-0 font-weight-semibold color-theme-1 mb-2 mt-3 fst-italic"
                        style={{ color: "#7c625a", fontSize: "20px" }}
                      >
                        {t("Price.1")}
                      </h5>
                      <p className="text-large mb-2 text-white fst-italic">
                        <span
                          className="notranslate"
                          style={{ color: "#ab9769", fontSize: "20px" }}
                        >
                          {" "}
                          {t("AVAX/Splash.1")} {division}
                        </span>
                      </p>
                      <p className="text-small fst-italic" style={{ backgroundColor: "#4e2e4b" }}>
                        {t("AVAX/Splash.1")} ≈ {oneDripPrice} {t("USDT.1")}
                      </p>
                    </div>
                  </div>
                  <div className="container col-md-3 col-sm-12 text-center">
                    <div className="price-top-part">
                      <img src={avax} alt="" width="70px" />
                      <h5
                        className="mb-0 font-weight-semibold color-theme-1 mb-2 mt-3 fst-italic"
                        style={{ color: "#7c625a" }}
                      >
                        {t("AVAXBalance.1")}
                      </h5>
                      <p className="text-large mb-2 text-white fst-italic">
                        <span
                          className="notranslate"
                          style={{ color: "#ab9769", fontSize: "20px" }}
                        >
                          {cBnbBalance}
                        </span>
                      </p>
                      <p className="text-small fst-italic" style={{ backgroundColor: "#4e2e4b" }}>
                        {t("AVAX.1")} ≈{bnbPrice} {t("USDT.1")}
                      </p>
                    </div>
                  </div>
                  <div className="container col-md-3 col-sm-12 text-center">
                    <div className="price-top-part">
                      <img src={balance} alt="" width="60px" />
                      <h5
                        className="mb-0 font-weight-semibold color-theme-1 mb-2 mt-3  fst-italic"
                        style={{ color: "#7c625a" }}
                      >
                        {t("SplashBalance.1")}{" "}
                      </h5>
                      <p className="text-large  mb-2 text-white fst-italic">
                        <span
                          className="notranslate"
                          style={{ color: "#ab9769", fontSize: "20px" }}
                        >
                          {cDripBalance}
                        </span>
                      </p>
                      <p className="text-small fst-italic" style={{ backgroundColor: "#4e2e4b" }}>
                        {t("Splash.1")} ≈{dripUsdtprice}
                        {t("USDT.1")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4 mt-2">
              <div className="container col-12 col-xl-6 col-lg-6 col-md-6 mb-4">
                <div
                  className="card  text-white"
                  style={{ backgroundColor: "#4e2e4b" }}
                >
                  <div className="card-body">
                    
                    <div className="landing-page">
                      <div className="text-left">
                        <h3>
                          <p
                            className="notranslate fst-italic"
                            style={{ fontSize: "20px" }}
                          >
                            {t("BuySplash.1")}
                          </p>
                        </h3>
                      </div>
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-3 text-left fst-italic">
                              <label>
                                <p>{t("Amount.1")}</p>
                              </label>
                            </div>
                            <div className="col-9 text-right fst-italic user2">
                              {" "}
                              <p>
                                {t("AVAXBalance.1")}:
                                </p>
                                <p className="user-balance text-white fst-italic">
                                  {" "}
                                  {usersBalance}
                                </p>
                             
                            </div>
                          </div>
                          <div role="group" className="input-group">
                            <input
                              ref={inputEl}
                              onChange={() => enterBuyAmount1()}
                              type="number"
                              placeholder="AVAX"
                              className="form-control"
                              id="__BVID__90"
                            />
                            <div className="input-group-append">
                              <div
                                className="dropdown b-dropdown btn-group"
                                id="__BVID__91"
                              >
                                <Button
                                  aria-describedby={id}
                                  variant="info"
                                  onClick={handleClickon}
                                  style={{
                                    backgroundColor: "#86ad74",
                                    border: "1px solid #86ad74",
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 16 16"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    role="img"
                                    aria-label="gear fill"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="bi-gear-fill b-icon bi"
                                    style={{ width: "16px", height: "16px" }}
                                  >
                                    <g>
                                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"></path>
                                    </g>
                                  </svg>
                                </Button>
                                <Popover
                                  className="popoverhere"
                                  id={idto}
                                  open={opento}
                                  anchorEl={data}
                                  onClose={handleCloseon}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                  }}
                                >
                                  <Typography sx={{ p: 2 }}>
                                    {" "}
                                    <ul
                                      role="menu"
                                      tabIndex={1}
                                      className="Ullist"
                                    >
                                      <li role="presentation">
                                        <div
                                          role="group"
                                          className="form-group"
                                          id="__BVID__101"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          <label
                                            htmlFor="dropdown-sell-slippage-config"
                                            className="d-block"
                                            id="__BVID__101__BV_label_"
                                          >
                                            {t("Slippagetolerance.1")}
                                          </label>
                                          <div>
                                            <div
                                              role="radiogroup"
                                              tabIndex={-1}
                                              className="pt-2 bv-no-focus-ring"
                                              id="__BVID__102"
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-evenly",
                                              }}
                                            >
                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  setTripType("1");
                                                  await enterRadioAmount1();
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType}
                                                  name="tripType"
                                                  checked={tripType === "1"}
                                                />
                                                1%
                                              </div>

                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  setTripType("3");
                                                  await enterRadioAmount3();
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType}
                                                  name="tripType"
                                                  checked={tripType === "3"}
                                                />
                                                3%
                                              </div>

                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  setTripType("5");
                                                  await enterRadioAmount5();
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType}
                                                  name="tripType"
                                                  checked={tripType === "5"}
                                                />
                                                5%
                                              </div>
                                            </div>
                                            <div
                                              role="group"
                                              className="input-group"
                                            >
                                              <input
                                                type="number"
                                                ref={mYentered}
                                                className="form-control"
                                                onChange={async () =>
                                                  await myOnchangeInputBuySwap()
                                                }
                                            
                                              />
                                              <div className="input-group-append">
                                                <button
                                                  type="button"
                                                  className="btn btn-secondary btn-sm"
                                                >
                                                  %
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </Typography>
                                </Popover>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 text-left fst-italic">
                              <small className="form-text">
                                <p>
                                  {t("Estimatereceived.1")}: {estimate}
                                </p>
                              </small>

                              <small className="form-text fst-italic">
                                <p>
                                  {t("Minimumreceived.1")}: {minRecieved}
                                </p>{" "}
                              </small>
                            </div>
                            <div className="col-6 text-right fst-italic">
                              <small className="form-text">
                                <p>
                                  {t("Slippagetolerance.1")}: {tripType}%{" "}
                                </p>
                              </small>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="row justify-content-end">
                        <div className="col-12 text-left">
                          <button
                            onClick={() => swapBnbtoToken()}
                            type="button"
                            className="btn btn-outline-light"
                          >
                            {t("Buy.1")}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p />
                  </div>
                </div>
              </div>
              <div className="container col-12 col-xl-6 col-lg-6 col-md-6 mb-4">
                <div
                  className="card "
                  style={{ backgroundColor: "#4e2e4b", color: "#dacc79" }}
                >
                  <div className="card-body">
                    <div className="landing-page">
                      <div className="text-left">
                        <h3>
                          <span className="notranslate fst-italic">
                            <p style={{ fontSize: "20px" }}>
                              {t("SELLSplash.1")}
                            </p>
                          </span>
                        </h3>
                      </div>
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-3 text-left fst-italic">
                              <label>
                                <p>{t("Amount.1")}</p>
                              </label>
                            </div>
                            <div className="col-9 text-right fst-italic">
                              {" "}
                              <p>
                                {t("SplashBalance.1")}:
                                <label className="user-balance text-white fst-italic">
                                  {userDripBalance}
                                </label>{" "}
                              </p>
                            </div>
                          </div>
                          <div role="group" className="input-group">
                            <input
                              ref={inputE2}
                              type="number"
                              placeholder="Splash"
                              className="form-control"
                              id="__BVID__99"
                              onChange={() => enterBuyAmount2()}
                            />
                            <div className="input-group-append">
                              <button
                                onClick={() => addMaxBalance()}
                                type="button"
                                className="btn btn-info"
                                style={{
                                  backgroundColor: "#86ad74",
                                  border: "1px solid #86ad74",
                                }}
                              >
                                {t("Max.1")}
                              </button>
                              <div
                                className="dropdown b-dropdown btn-group"
                                id="__BVID__100"
                              >
                                <Button
                                  aria-describedby={id}
                                  variant="info"
                                  onClick={handleClick}
                                  style={{
                                    backgroundColor: "#86ad74",
                                    border: "1px solid #86ad74",
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 16 16"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    role="img"
                                    aria-label="gear fill"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="bi-gear-fill b-icon bi"
                                    style={{ width: "16px", height: "16px" }}
                                  >
                                    <g>
                                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"></path>
                                    </g>
                                  </svg>
                                </Button>
                                <Popover
                                  className="popoverhere2"
                                  id={id}
                                  open={open}
                                  anchorEl={anchorEl}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                  }}
                                >
                                  <Typography sx={{ p: 2 }}>
                                    <ul
                                      role="menu"
                                      tabIndex={1}
                                      className="Ullist"
                                    >
                                      <li role="presentation">
                                        <div
                                          role="group"
                                          className="form-group"
                                          id="__BVID__101"
                                          style={{ whiteSpace: "nowrap" }}
                                        >
                                          <label
                                            htmlFor="dropdown-sell-slippage-config"
                                            className="d-block"
                                            id="__BVID__101__BV_label_"
                                          >
                                            {t("Slippagetolerance.1")}
                                          </label>
                                          <div>
                                            <div
                                              role="radiogroup"
                                              tabIndex={-1}
                                              className="pt-2 bv-no-focus-ring"
                                              id="__BVID__102"
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-evenly",
                                              }}
                                            >
                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  await myRadioSellSplash1();
                                                  setTripType1("1");
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType1}
                                                  name="tripType1"
                                                  checked={tripType1 === "1"}
                                                />
                                                1%
                                              </div>

                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  await myRadioSellSplash3();
                                                  setTripType1("3");
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType1}
                                                  name="tripType"
                                                  checked={tripType1 === "3"}
                                                />
                                                3%
                                              </div>

                                              <div
                                                className="radio-btn"
                                                onClick={async () => {
                                                  await myRadioSellSplash5();
                                                  setTripType1("5");
                                                }}
                                              >
                                                <input
                                                  type="radio"
                                                  value={tripType1}
                                                  name="tripType"
                                                  checked={tripType1 === "5"}
                                                />
                                                5%
                                              </div>
                                            </div>
                                            <div
                                              role="group"
                                              className="input-group"
                                            >
                                              <input
                                                type="number"
                                                ref={mYEnter1}
                                                max={50}
                                                className="form-control"
                                                onChange={async () =>
                                                  await myOnchangeInputSellSplash()
                                                }
                                               
                                              />
                                              <div className="input-group-append">
                                                <button
                                                  type="button"
                                                  className="btn btn-secondary btn-sm"
                                                >
                                                  %
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </Typography>
                                </Popover>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 text-left fst-italic">
                              <small className="form-text">
                                <p style={{ lineHeight: "120%" }}>
                                  {t("Estimatereceived.1")}:{tenPerVal}
                                </p>
                              </small>
                              <small className="form-text fst-italic">
                                <p
                                  id="swapp20"
                                >
                                  {t("Minimumreceived.1")}:{minRecievedDrip}
                                </p>
                              </small>
                              <small className="form-text text-left">
                                <p
                                  id="swapp21"
                                >
                                  {t("10%Taxisappliedonsells.1")}
                                </p>
                              </small>
                            </div>
                            <div className="col-6 text-right fst-italic">
                              <small className="form-text">
                                <p
                                  id="swapp2"
                                >
                                  {t("Slippagetolerance.1")}: {tripType1}%
                                </p>
                              </small>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="row justify-content-end">
                        <div className="col-12 text-left">
                          <button
                            onClick={() => bnbSwapSell()}
                            type="button"
                            className="btn btn-outline-light"
                          >
                            {t("Sell.1")}
                          </button>
                          <div
                            className="allowanceSelect"
                            style={{ float: "right" }}
                          >
                            <div className="custom-control custom-switch b-custom-control-lg">
                              <input
                                type="checkbox"
                                name="check-button"
                                className="custom-control-input"
                                id="__BVID__107"
                                checked={isToogle}
                                onChange={getToogle}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="__BVID__107"
                              >
                                {" "}
                                <p>{t("ApproveSplash.1")}</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4 mt-2">
              <div className="container col-12 text-center">
                <div className="row mb-4 mt-2">
                  <div className="container col-12 text-center ">
                    <h1 className="fw-bold">
                      <b style={{fontFamily:"Jost"}}>

                      {t("Chart.1")}
                      </b>
                      </h1>
                  </div>

                 
                </div>
                <div>

                  <iframe 
                  width="100%"
                  height="600"
                  src="https://splassivetracker.web.app/"
                  >

                  </iframe>
                </div>
              </div>
            </div>
            <div className="row mb-4 mt-2">
              <div className="container col-12 text-center">
                <h1 className="fw-bold">
                  <b style={{fontFamily:"Jost"}}>

                  {t("Stats.1")}
                  </b>
                  </h1>
                <p style={{ color: "white", fontSize: "20px" }}>
                  {t(
                    "TheWellisthebestwaytoexchangevalueintheSplashNetwork!Herearethenumbers.1"
                  )}
                  ...
                </p>
              </div>
              <div className="container col-12 col-xl-4 col-lg-4 col-md-4 text-center">
                <div className="price-top-part">
                  <img src={van} alt="" className="" width="60px" />
                  <h5
                    className="mb-0 font-weight-semibold color-theme-1 mb-2 fst-italic"
                    style={{ color: "#7c625a" }}
                  >
                    {t("Supply.1")}
                  </h5>
                  <p className="text-large mb-2 text-white fst-italic">
                    <span
                      className="notranslate"
                      style={{ color: "#ab9769", fontSize: "20px" }}
                    >
                      {tSupllyDrip}
                    </span>
                  </p>
                  <p className="text-small fst-italic">{t("Splash.1")}</p>
                </div>
              </div>
              <div className="container col-12 col-xl-4 col-lg-4 col-md-4 text-center">
                <div className="price-top-part">
                  <img src={contact} alt="" className=""
                  style={{ width: "130px", backgroungColor: "white"}} 
                  />
                  <h5
                    className="mb-0 font-weight-semibold color-theme-1 mb-2 mt-2"
                    style={{ color: "#7c625a" }}
                  >
                    {t("ContractBalance.1")}
                  </h5>
                  <p className="text-large mb-2 text-white">
                    <span
                      className="notranslate"
                      style={{ color: "#ab9769", fontSize: "20px" }}
                    >
                      {tSupllyFountain}
                    </span>
                  </p>
                  <p className="text-small"> {t("DROPS.1")} ({t("Splash.1")} / {t("LOCKED.1")})</p>
                </div>
              </div>
              <div className="container col-12 col-xl-4 col-lg-4 col-md-4 text-center">
                <div className="price-top-part">
                  <img src={transfer} alt="" width="60px" className="" />
                  <h5
                    className="mb-0 font-weight-semibold color-theme-1 mb-2 mt-2"
                    style={{ color: "#7c625a" }}
                  >
                    {t("Tranactions.1")}
                  </h5>
                  <p className="text-large mb-2 text-white">
                    <span
                      className="notranslate"
                      style={{ color: "#ab9769", fontSize: "20px" }}
                    >
                      {tTransactionsFountain}
                    </span>
                  </p>
                  <p className="text-small">{t("Txs.1")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="header">
              <div>
                <svg
                  data-v-ab5e3c86
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 24 150 28"
                  preserveAspectRatio="none"
                  shapeRendering="auto"
                  className="waves"
                >
                  <defs data-v-ab5e3c86>
                    <path
                      data-v-ab5e3c86
                      id="gentle-wave"
                      d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                  </defs>
                  <g data-v-ab5e3c86 className="parallax">
                    <use
                      data-v-ab5e3c86
                      xlinkHref="#gentle-wave"
                      x={48}
                      y={0}
                      fill="rgba(255,255,255,0.7"
                    />
                    <use
                      data-v-ab5e3c86
                      xlinkHref="#gentle-wave"
                      x={48}
                      y={3}
                      fill="rgba(255,255,255,0.5)"
                    />
                    <use
                      data-v-ab5e3c86
                      xlinkHref="#gentle-wave"
                      x={48}
                      y={5}
                      fill="rgba(255,255,255,0.3)"
                    />
                    <use
                      data-v-ab5e3c86
                      xlinkHref="#gentle-wave"
                      x={48}
                      y={7}
                      fill="#fff"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
