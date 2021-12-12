import { Box,Button,Text,Table,Tr,Tbody,Td,TableCaption} from "@chakra-ui/react"



const UserList = ({users,title,unfollow,unfollowFunc}) => {
    let tdstyle = {textAlign:'left'};
    let lbStyle={fontWeight: 'bold'};


    
    console.log(`rendering users: title :${title}, users:${JSON.stringify(users)}`);
    return (
        
        <Box >
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
                                    <Td style={tdstyle}><Text style={lbStyle}>Status:</Text></Td>
                                    <Td style={tdstyle}><Text color={(user.status.includes("Pending"))?'red':'green'}>{user.status}</Text></Td>
                                    {(unfollow && (user.status.includes("Pending")==false))?<Td><Button colorScheme="blue" variant="outline" onClick={()=>{unfollowFunc(user)}}>Unfollow</Button></Td>:''}
                                </Tr>
                
                )):''}
                </Tbody>
                </Table>
        </Box>
    )
}

export default UserList
