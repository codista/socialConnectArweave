import { 
    Box,
    Text,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Button,
    VStack,
    Select,
    FormErrorMessage,
    useColorModeValue} from "@chakra-ui/react"
import {useState,useEffect} from "react";  
import { Formik,Form,Field } from 'formik'; 
import UserList from "./UserList"
import {makeAPICall,APP_NAMESPACE,signMessage} from "./../lib/api"
import {AddUserToList,updateUserStatus} from "./../lib/helpers"


const UserActions = ({provider}) => {

    async function unfollowf(user)  {
        if (!provider) {
            console.error("submitting unfollow while not connected");
            
            return;
        }

        // eslint-disable-next-line
        let message = "Unfollow"+" "+user.address+" "+APP_NAMESPACE;
        let signature= await signMessage(provider,message);    
        let signerAddress = await provider.getSigner().getAddress();   
        let ret=await makeAPICall("Unfollow",{sourceAddress:signerAddress,
                                            target:user.address,
                                            namespace:APP_NAMESPACE,
                                            targetType:user.addressType,
                                            sig:signature
                                            });
        if ('status' in ret && ret.status=="OK") {
           console.log("Unfollow succeeded");
           alert("Succesfuly unfollowed "+user.address+" (the UI will be updated soon when the transaction is fully mined)")

           //update followings list state
           let newFollowings=updateUserStatus(user.address,"Pending Upfollow",followings);
            console.log('followings after update status: '+JSON.stringify(newFollowings));
           setFollowings(newFollowings);
        }
        else {
            console.error("problem following"+JSON.stringify(ret));
            alert("Oops, something went wrong");
        }
    }

    const  onSubmitFollow = async (values,actions) => {    
        if (!provider) {
            console.error("submitting while not connected");
            actions.setSubmitting(false);
            return;
        }

        //sign message
        // eslint-disable-next-line
        let message = "Follow"+" "+values.address+" "+APP_NAMESPACE;
        let signature= await signMessage(provider,message);    
        let signerAddress = await provider.getSigner().getAddress();   
        let ret=await makeAPICall("follow",{sourceAddress:signerAddress,
                                            target:values.address,
                                            namespace:APP_NAMESPACE,
                                            targetType:values.addressType,
                                            alias:values.alias,
                                            sig:signature
                                            });
        if ('status' in ret && ret.status=="OK") {
           console.log("follow succeeded");
           console.log('followings before adding pending: '+JSON.stringify(followings));
           
           //update followings list state
           let newFollowings=AddUserToList({address: values.address,
            addressType: values.addressType,
            alias: values.alias,
            status: "Pending Follow"},followings);
            console.log('followings after addind pending: '+JSON.stringify(newFollowings));
           setFollowings(newFollowings);
        }
        else {
            console.error("problem following"+JSON.stringify(ret));
            alert("Oops, something went wrong");
        }
        actions.setSubmitting(false);
    }

    const  getFollowings = async (provider) => {
        // eslint-disable-next-line
        if (!provider) return Array();
        let signerAddress = await provider.getSigner().getAddress(); 
        let ret=await makeAPICall("followings",{target:signerAddress,namespace:APP_NAMESPACE,targetType:"Eth"});
        console.log("got followings is useractions "+JSON.stringify(ret));
        if ('status' in ret && ret.status=="OK" && 'users' in ret) {
            return ret.users;
        }
        else {
            console.error("problem retrieving followings");
            alert("Oops, something went wrong");
            return [];
        }
        
    }

    //eslint-disable-next-line
    const [followings,setFollowings] =useState(Array());
    const [fetchingFollowings,setFetchingFollowings] =useState(false);

    useEffect(() => {
        const getFoll = async (provider) => {
            if (provider!==null) {
                setFetchingFollowings(true);
                const followings = await getFollowings(provider);
                setFetchingFollowings(false);
                if (Array.isArray(followings)){
                    setFollowings(followings);
                }
            }
        }
        getFoll(provider);
    },[provider])

    function validateAddress(value) {
        let error
        if (!value) {
        error = "Contract address is required"
        } else if (!/^0x[A-Fa-f0-9]+$/i.test(value)) {
        error = "This needs to be a valid ethereum address"
        }
        return error
    }

    function validateAlias(value) {
        let error
        if (value && !/^[a-zA-Z]+$/i.test(value)) {
            error = "Only letters allowed"
        }
        return error
    }

    let ctrlStle = {marginTop:'25px'};
    return (
        (provider!=null)?
        <VStack
        p={5}
        maxW={{ lg: "6xl" }}
        alignItems="center"
        justifyContent="center"
        >
            <Box
                bg={'white'}
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
                initialValues={{ address: "",addressType:"Eth",alias:" "}}
                onSubmit={(values, actions) => {
                setTimeout(() => {
                    //alert(JSON.stringify(values, null, 2))
                    onSubmitFollow(values, actions);
                    
                }, 1000)
                }}
            >
                {(props) => (
                    <Form >
                        <Field name="address" validate={validateAddress}>
                            {({ field, form }) => (
                            <FormControl style={ctrlStle}  isRequired isInvalid={form.errors.address && form.touched.address} >
                                <FormLabel htmlFor="address">Address to Follow</FormLabel>
                                <Input {...field} id="address" placeholder="address" />
                                <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                                <FormHelperText>Ethereum address for which to retrieve followers.</FormHelperText>
                            </FormControl>
                            )}
                        </Field>

                        <Field name="addressType" >
                            {({ field, form }) => (
                            <FormControl style={ctrlStle}  isRequired isInvalid={form.errors.addressType && form.touched.addressType} >
                                <FormLabel htmlFor="addressType">Type of Address</FormLabel>
                                <Select {...field} id="addressType"  >
                                     <option value='Eth'>Ethereum</option>
                                     <option value='Arweave'>Arweave</option>
                                </Select>
                                
                                <FormHelperText>Type of Address to Follow (Ethereum or Arweave)</FormHelperText>
                            </FormControl>
                            )}
                        </Field>

                        <Field name="alias" validate={validateAlias}>
                            {({ field, form }) => (
                            <FormControl style={ctrlStle}   isInvalid={form.errors.alias && form.touched.alias} >
                                <FormLabel htmlFor="alias">Alias</FormLabel>
                                <Input {...field} id="alias" placeholder="alias" />
                                <FormErrorMessage>{form.errors.alias}</FormErrorMessage>
                                <FormHelperText>Alias for Followed Address.</FormHelperText>
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
                                Follow
                            </Button>
                        </Box>  
                    </Form>
                )}
            </Formik>
            
            
            </Box>
            <Box
                bg={'white'}
                mx={{ lg: 8 }}
                display={{ lg: "flex" }}
                w="full"
                shadow={{ lg: "lg" }}
                rounded={{ lg: "lg" }}
                alignItems="center"
                justifyContent="center"
            >
            <UserList users={followings} title="Your Follwings:" unfollow={true} unfollowFunc={unfollowf} /> 
            </Box>
        </VStack> 
                            :<Text>Please connect to Metamask to manage your social connections.</Text>
    )
}

export default UserActions
