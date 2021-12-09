import { Box,HStack,Text,Table,Tr,Tbody,Td,TableCaption} from "@chakra-ui/react"

const UserList = ({users,title}) => {
    let tdstyle = {textAlign:'left'};
    let lbStyle={fontWeight: 'bold'};
    console.log("rendering users:" + JSON.stringify(users));
    return (
        
        <Box>
            <Text>{title}</Text>
            <Table m={5} variant='striped' size="sm"overflow="hidden" >
            
                    <Tbody>
            {(Array.isArray(users))?users.map((user) => (<Tr key = {user.address} >
                                    <Td style={tdstyle}><Text style={lbStyle}>User Address:</Text></Td>
                                    <Td style={tdstyle}><Text>{user.address}</Text></Td>
                                    <Td style={tdstyle}><Text style={lbStyle}>User Address Type:</Text></Td>
                                    <Td style={tdstyle}><Text>{user.addressType}</Text></Td>
                                    <Td style={tdstyle}><Text style={lbStyle}>Alias:</Text></Td>
                                    <Td style={tdstyle}><Text>{user.alias}</Text></Td>
                                </Tr>
                
                )):''}
                </Tbody>
                </Table>
        </Box>
    )
}

export default UserList
