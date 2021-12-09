import React from 'react'
import ConnectButton from "./ConnectButton"
import { HStack,Box,Text,Flex ,Image} from "@chakra-ui/react"
const Header = ({connected,connectFunc}) => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            m={2}
            p={0}
            pl={30}
            pr={30}
            bg={["primary.500", "primary.500", "transparent", "transparent"]}
            color={["white", "white", "primary.700", "primary.700"]}>

            <Box w="400px" color={["black", "black", "primary.500", "primary.500"]}>
                <Text fontSize='3xl' color='tomato'>Social Connect App</Text>
                
                </Box>
           
            <Box><ConnectButton  connected={connected} connectFunc={connectFunc} /></Box>    
        </Flex>
    )
}

export default Header
