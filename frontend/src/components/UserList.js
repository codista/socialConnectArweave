import { Box} from "@chakra-ui/react"

const UserList = ({users}) => {
    return (
        <Box>
            {JSON.stringify(users)}
        </Box>
    )
}

export default UserList
