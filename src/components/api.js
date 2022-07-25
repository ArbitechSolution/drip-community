import Web3 from "web3";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let accounts;

   const getAccounts = async () => {
    const web3 = window.web3;
    try {
        accounts = await web3.eth.getAccounts();
        return accounts;
    } catch (error) {
        console.log("Error while fetching acounts: ", error);
        return null;
    }
};
export const loadWeb3 = async () => {

    let isConnected = false;
    try {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
           await window.web3.eth.getChainId((err, netId) => {
                
                switch (netId.toString()) {
                  case "43114":
                    isConnected=true;
                    break;
                  default:
                    console.log("wrong netWork");
                                 
                }
                
                
              }
             );
             if (isConnected == true) {    
                let accounts = await getAccounts();
                return accounts[0];
                
            }
        } 
        else {
            let res= "No Wallet";
            return res;
        }  
    }catch (error) {
        let res= "No Wallet";

        return res
       
    }
}
