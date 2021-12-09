import { Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Stack,
    Button,
    Text,
    VStack,
    FormErrorMessage,
    useColorModeValue} from "@chakra-ui/react"
import {useState} from "react";  
import { Formik,Form,Field } from 'formik'; 
import UserList from "./UserList"
import {makeAPICall,APP_NAMESPACE} from "./../lib/api"

const Followings = () => {
    const  onSubmit = async (values,actions) => {
        //AddAppraisalFunc(values);
        let ret=await makeAPICall("followings",{target:values.address,namespace:APP_NAMESPACE});
        if ('status' in ret && ret.status=="OK" && 'users' in ret) {
            setFollowings(ret.users);
        }
        else {
            console.error("problem retrieving followings");
            alert("Oops, something went wrong");
        }
        actions.setSubmitting(false);
    }
    // eslint-disable-next-line
    const [followings,setFollowings] =useState(Array());

    function validateAddress(value) {
        let error
        if (!value) {
        error = "Contract address is required"
        } else if (!/^0x[A-Fa-f0-9]+$/i.test(value)) {
        error = "This needs to be a valid ethereum address"
        }
        return error
    }
    return (
        <VStack
        p={5}
        maxW={{ lg: "6xl" }}
        alignItems="center"
        justifyContent="center"
        >
            <Box
                bg={useColorModeValue("white", "gray.800")}
                mx={{ lg: 8 }}
                display={{ lg: "flex" }}
                p={5}
                w="full"
                shadow={{ lg: "lg" }}
                rounded={{ lg: "lg" }}
                alignItems="center"
                justifyContent="center"
            >
            <Formik 
                initialValues={{ nftContract: "", NFTId: "",NFTMarketplace: "",minVoters: "",minExpertLevel:"",payout:"0.001"}}
                onSubmit={(values, actions) => {
                setTimeout(() => {
                    //alert(JSON.stringify(values, null, 2))
                    onSubmit(values, actions);
                    
                }, 1000)
                }}
            >
                {(props) => (
                    <Form >
                        <Field name="address" validate={validateAddress}>
                            {({ field, form }) => (
                            <FormControl isRequired isInvalid={form.errors.address && form.touched.address} >
                                <FormLabel htmlFor="address">Address</FormLabel>
                                <Input {...field} id="address" placeholder="address" />
                                <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                                <FormHelperText>Ethereum address for which to retrieve followings.</FormHelperText>
                            </FormControl>
                            )}
                        </Field>

                        <Box w={{ lg: "100%" }}
                            m={5}
                            alignItems="center"
                            justifyContent="center"
                        >        
                            <Button type="submit"
                                isLoading={props.isSubmitting}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                bg: 'blue.500',
                                }}>
                                Submit
                            </Button>
                        </Box>  
                    </Form>
                )}
            </Formik>
            
            
            </Box>
            <Box
                bg={useColorModeValue("white", "gray.800")}
                mx={{ lg: 8 }}
                display={{ lg: "flex" }}
                w="full"
                shadow={{ lg: "lg" }}
                rounded={{ lg: "lg" }}
                alignItems="center"
                justifyContent="center"
            >
            <UserList users={followings} title="Followings:" /> 
            </Box>
        </VStack> 
          
    )
}

export default Followings
