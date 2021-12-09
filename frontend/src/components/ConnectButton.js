
import {Button,Text} from '@chakra-ui/react';
const ConnectButton = ({connected, connectFunc}) => {
    async function  callConnect() {
        await connectFunc();
    }
    
    return (
        connected===""?
        <Button colorScheme="blue" variant="outline" onClick={callConnect}>
            Connect to Metamask
        </Button>
        :
        <Text color={'black'}>
            
            Connected to {connected}
            
            </Text>
    )
}

export default ConnectButton
