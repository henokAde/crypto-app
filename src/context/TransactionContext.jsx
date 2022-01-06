import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";

import {ethers} from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;
const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)
    // console.log({provider, signer, transactionContract});
    return transactionContract
};

export const TransactionProvider = ({children}) =>{

    const [connectedAccount, setConnectedAccount] = useState("");
    const [formData, setFormData] = useState({addressTo:'', amount: '', keyword:'', message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) =>{
            setFormData((prevState) => ({ ...prevState, [name]: e.target.value}))
    }

    const checkIfWalletIsConnected = async() =>{

        try {
            
            if(!ethereum) return toast("Please install metamask");
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length) {
                setConnectedAccount(accounts[0]);
    
                // get All transactions
            } else{
                console.log("no account found");
            }
            // console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object")
        }
    }

    const connectWallet = async () =>{
        try {
            if(!ethereum) return toast("Please install metamask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setConnectedAccount(accounts[0])
            toast.success("Wallet connected");
            await window.location.reload
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object")
        }
    }
    const sendTransaction = async (e) => {
        try {
          if (ethereum) {
            // e.preventDefault();
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: connectedAccount,
                to: addressTo,
                gas: "0x5208",
                value: parsedAmount._hex,
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockain(addressTo, parsedAmount, message, keyword);
    
            setIsLoading(true);
            // console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            // console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
            toast.success("transaction send")
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            setTransactionCount(transactionsCount.toNumber());
          } else {
            console.log("No ethereum object");
            
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    useEffect(() => {
        checkIfWalletIsConnected()
       
    }, []);
    return(
        <TransactionContext.Provider value={{connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}
