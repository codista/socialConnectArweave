import React from 'react';
import {useState} from 'react';
import {
  ChakraProvider,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  theme,
} from '@chakra-ui/react';
import Header from "./components/Header"
import { ethers } from "ethers";
import { requestUserConnect } from "./bootstrap/initialize"
import SocialActions from "./components/SocialActions"
import Followers from "./components/Followers"
import Followings from "./components/Followings"

import {useEffect,useCallback} from "react"

function App() {
  const [connectedAccount,setConnectedAccount] = useState("");
  const [ethersProvider,setEthersProvider] = useState(null);
    

  async function initProvider(prov)
  {
    const ethProv = new ethers.providers.Web3Provider(prov, "any");
    setEthersProvider(ethProv);
    let address = await ethProv.getSigner().getAddress();
    setConnectedAccount(address);
  }
  

  async function hadleConnection(forced) {
    let provider = await requestUserConnect(forced);
    if (provider!==null) {
      initProvider(provider);
    }
  }
  
  async function handleAccountsChanged(accounts)
  {
    let provider = await requestUserConnect(false);
    if (provider!==null) {
        const ethProv = new ethers.providers.Web3Provider(provider, "any");
        setEthersProvider(ethProv);
        let address = await ethProv.getSigner().getAddress();
        setConnectedAccount(address);
    }
  }

  useEffect(() => {
    async function initcon() {
      let provider = await requestUserConnect(false);
      if (provider!==null) {
          const ethProv = new ethers.providers.Web3Provider(provider, "any");
          setEthersProvider(ethProv);
          let address = await ethProv.getSigner().getAddress();
          setConnectedAccount(address);
      }
    }
    initcon();
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    // eslint-disable-next-line
    }  ,[]);


  async function connectToMetamask()
  {
    await hadleConnection(true);
  }

  

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="l">
        <Header connected={connectedAccount} connectFunc={connectToMetamask}/>
        
        <Box bgGradient="linear(to-b, #e3f4fa, white)" minH="1000" width="100%">
            
            <Tabs  colorScheme="blue"  padding="20" >
              <TabList>
                <Tab>Follow/Unfollow</Tab>
                <Tab>Find Address Followers</Tab>
                <Tab>Find Address Followings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SocialActions provider={ethersProvider} />
                </TabPanel>
                <TabPanel>
                  <Followers />
                </TabPanel>
                <TabPanel>
                  <Followings />
                </TabPanel>
              </TabPanels>
            </Tabs>
            
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
