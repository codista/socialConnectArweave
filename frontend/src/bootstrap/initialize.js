
import detectEthereumProvider from '@metamask/detect-provider';


export async function requestUserConnect(bForced)
{
    
    const provider = await detectEthereumProvider();
    let accounts=null;
    console.log("start connect");
    if (provider) {
        console.log("got provider.");
        // From now on, this should always be true:
        // provider === window.ethereum
        if (provider !== window.ethereum)
        {
            console.log('must have another provider than metamask');
            return null;
        }
        try {
            accounts = await window.ethereum.request({ method: 'eth_accounts' });
        }
        catch(err)  {
            console.error(err);
        }

        if (accounts===null || accounts.length===0)
        {
            if (!bForced) return null;
            else {
                try {
                    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                }
                catch(err)  {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                    } else {
                        console.error(err);
                    }   
                    return null; 
                };
                if (accounts.length===0)
                {
                    // MetaMask is locked or the user has not connected any accounts
                    console.log('Please connect to MetaMask.');
                    return null; 
                }
            }
        }
        //const prov = new ethers.providers.Web3Provider(window.ethereum, "any");
        //console.log("acounts is "+accounts);
        const chainId = await provider.request({ method: 'eth_chainId' });
        let id = parseInt(chainId,10);
        
        if (chainId!=="0x1")
        { 
            alert("Only Ethereum mainnet is supported. Please change to mainnet on Metamask and connect again.");
            return null;
        }
        return provider;
    }
    else {
        console.log("failed");
        return null;
    }
} 
