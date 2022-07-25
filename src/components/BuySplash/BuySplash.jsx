import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { PreSallAddress, PresallAbi ,xtokenAdd, xtokenAbi, ntokenAdd, ntokenAbi } from '../utils/preSall';
import { faucetContractAddress, faucetContractAbi, faucetTokenAddress, faucetTokenAbi } from "../utils/Faucet";
import { loadWeb3 } from "../api";
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import bigInt from "big-integer";
// import { useTranslation } from "react-i18next";




let webSupply = new Web3("https://api.avax.network/ext/bc/C/rpc");


function BuySplash() {
    // const { t, i18n } = useTranslation();
    let [calsplash, setcalSplash] = useState(0)
    let [balanceOf, setbalanceOf] = useState(0)
    let [CheckWhiteList, setCheckWhiteList] = useState([])
    let [OnChangeValue, setOnChangeValue] = useState(0)
    let [hardcap, sethardcap] = useState('Checking...')
    let [softcap, setsoftcap] = useState('Checking...')






    let getdata = useRef()
    let withDrawValue = useRef()



    let AddAdress_Value = useRef()
    let RemoveAdress_Value = useRef()
    const getMaxBal = async () => {
        try{
            let acc = await loadWeb3();

            if (acc == "No Wallet") {
              toast.error("No Wallet Connected")
            } else {
                const web3 = window.web3;
                let xContract = new web3.eth.Contract(xtokenAbi, xtokenAdd);
                let bal = await xContract.methods.balanceOf(acc).call();
                bal = web3.utils.fromWei(bal);
                if(bal == 0){
                    toast.error("your remaning balance is zero")
                }else{

                    getdata.current.value = bal;
                }
            }
        }catch(e){
            console.error("error while get max bal");
        }
    }

    const buySwap = async () => {
        try{
            let acc = await loadWeb3();

            if (acc == "No Wallet") {
              toast.error("No Wallet Connected")
            } else {
                let balValue = getdata.current.value;
                if(balValue > 0){
                const web3 = window.web3;
                const xContract = new web3.eth.Contract(xtokenAbi, xtokenAdd);
                const swapToken = new web3.eth.Contract(PresallAbi, PreSallAddress);

                let contractBal = await swapToken.methods.contractbalance().call();
                let withOutDecimal = web3.utils.fromWei(contractBal);
                if( parseFloat(withOutDecimal) >=  parseFloat(balValue)){
                  let dummy =  await xContract.methods.approve(PreSallAddress, web3.utils.toWei(balValue)).send({
                        from:acc
                    })
                    await swapToken.methods.swaptokens(web3.utils.toWei(balValue)).send({
                        from:acc
                    })

                }else{
                    toast.error("Contract out of funds");
                }


            }else{
                toast.error("Balance is Low or Click on Max")
            }
            }
        }catch(e){
            console.error("error while buy swap", e);
        }
    }

    const Buy = async () => {
        try {
            const web3 = window.web3;

            let inputvalue = getdata.current.value;

if(inputvalue>0)
{
            let input_value_here =web3.utils.toWei(inputvalue)
                        let acc = await loadWeb3()
            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);
            let return_Value = await preSall.methods.whitelist(acc).call();

            if (return_Value == true) {

                let limit_here = await preSall.methods.limit(acc).call();
                let limit_parWallet_here = await preSall.methods.limitperwallet().call();
                limit_here = parseFloat(web3.utils.fromWei(limit_here))
                limit_parWallet_here =parseFloat(web3.utils.fromWei(limit_parWallet_here) );
                let LimitPlusInput=(limit_here + +inputvalue);
                if (LimitPlusInput <= limit_parWallet_here) {
                    
                    let calSp = await preSall.methods.calculateSplashforWT(input_value_here).call();
                    calSp= web3.utils.fromWei(calSp)
                    
        
                    await preSall.methods.Buy(input_value_here).send({
                        from: acc,
                        value: calSp

                    })
                } else {
                    toast.error("MAX Limit Exceed")

                }

            }
            else {
                toast.error("You are not WhiteListed")

            }
}else{
    toast.error("Entered Value Must be greater than 0")
}
            

        }
        catch (e) {

            console.log("error while Buying", e);
            toast.error("Transaction Falied")        }

    }

    const Onchange_here = async () => {
        const web3 = window.web3;

        let inputvalue = getdata.current.value;
       
   
        let acc = await loadWeb3()

        let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);
        
        if(inputvalue>0){
            inputvalue = web3.utils.toWei(inputvalue)
            inputvalue=parseFloat(inputvalue);
            let CalSp = await preSall.methods.calculateSplashforWT(inputvalue.toString()).call();
            let calsplash_fromwei = web3.utils.fromWei(CalSp);
            calsplash_fromwei =web3.utils.fromWei(calsplash_fromwei)
            setOnChangeValue(calsplash_fromwei)
    
        }
        else{
            setOnChangeValue(0)

        }

      



    }


    let balace_here

    const contractBalance = async () => {

        

        try {


            const web3 = window.web3;
            let preSall = new webSupply.eth.Contract(PresallAbi, PreSallAddress);
            balace_here = await preSall.methods.checkContractBalance().call();
            balace_here = webSupply.utils.fromWei(balace_here)
            setbalanceOf(balace_here)


            if (balace_here >= 650) {
                sethardcap('Reached')


            }
            else {
                sethardcap('Not Reached')

            }

            if (balace_here >= 360) {
                setsoftcap('Reached')


            }
            else {
                setsoftcap('Not Reached')

            }

        }
        catch (e) {

            console.log("Error While Fetching Balance", e);
        }




    }


    const WithdrawAVAX = async () => {
        const web3 = window.web3;

        let withDraw_valu_here = withDrawValue.current.value;
     



        try {
            if (withDraw_valu_here <= balanceOf && withDraw_valu_here > 0) {

                let acc = await loadWeb3()
                let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

                await preSall.methods.WithdrawAVAX(web3.utils.toWei(withDraw_valu_here)).send({
                    from: acc

                })

            }
            else {
                toast.error("Insufficient Balance")

            }

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }


    const addAdress_here = async () => {

        try {
            let acc = await loadWeb3()
            const web3 = window.web3;

            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

            let listingPrice = await preSall.methods.ListingPrice().call();
         


            await preSall.methods.addaddressWhitelist().send({
                from: acc,
                value: listingPrice

            })

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }




    
    const addAddressesToWhitelist = async () => {

        try {
            let acc = await loadWeb3()
            const web3 = window.web3;
            let AddAdressValu_add = AddAdress_Value.current.value;
            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

            await preSall.methods.addAddressToWhitelist(AddAdressValu_add).send({
                from: acc

            })

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }
    useEffect(() => {

        setInterval(() => {
            
        }, 1000);
    }, []);



    const { t, i18n } = useTranslation();
    return (
        <div className="images">
            <div className="router-view">
                <div className="container landing-page">
                    <div className="row mb-4 mt-2">
                        <div className="container col-xl-12">
                            <div className="home-text text-center row">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <span class="luck-title notranslate fw-bold" style={{fontFamily:"Jost"}}>
                                                
                                                {t("SWAP.1")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row mb-4 mt-2'>
                            
                        <div className="container col-12 col-xl-6 col-lg-6 mb-12">
                            <div className='row'>
                                <div className='col'>
                                    <div className="card  text-white"
                                        style={{ backgroundColor: "#4e2e4b" }}>
                                        <div className="card-body">
                                            <div className="landing-page">
                                                <div className="text-left">
                                                    <h3>
                                                        <p className="notrans.late fst-italic text-center" style={{ fontSize: "30px" }}>
                                                            
                                                            {t("SWAP.1")}
                                                            </p>
                                                    </h3>
                                                </div>
                                                <div className="mt-5">
                                                    <div id="buddy-input">
                                                        <fieldset className="form-group" id="__BVID__216">
                                                            <h3>
                                                                <legend
                                                                    tabIndex={-1}
                                                                    className="bv-no-focus-ring col-form-label pt-1 fst-italic"
                                                                    id="__BVID__216__BV_label_"
                                                                >
                                                                    <p style={{ lineHeight: "40%" }}>
                                                                        {t("EstimatereceivedSplash.1")}

                                                                    </p>
                                                                </legend>
                                                            </h3>
                                                            <div className='row'>

                                                            
                                                            <div className='col-lg-10 col-8 col-sm-10'>
                                                                <input

                                                                    ref={getdata}

                                                                    disabled
                                                                    type="Number"
                                                                    placeholder="0"
                                                                    className="form-control"
                                                                    id="__BVID__217"

                                                                />
                                                                
                                                            </div>
                                                            <div className='col-1'>
                                                                <button className='btn btn-light' 
                                                                onClick={getMaxBal}
                                                                >MAX</button></div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                                <div className='row d-flex justify-content-center mt-5'>
                                                    <div className='col-md-6 col-11' >
                                                        <div className="d-grid gap-2">
                                                            <button className='btn fst-italic  mt-2 fw-bold p-2' size="lg" style={{ backgroundColor: "#86ad74", color: "white", fontSize: "25px" }} 
                                                            onClick={() => buySwap()} >
                                                                
                                                                {t("SWAP.1")}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
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
    )
}

export default BuySplash