
export function AddUserToList(user,userlist) {
    if (!Array.isArray(userlist)) {return userlist;}
    if (userlist.findIndex(element=>element.address==user.address)!=-1) {return userlist;}
    let newUserList  = userlist.slice(); //create new array so that state updates will re-render the list.
    newUserList[newUserList.length]=user;
    console.log(`new user list inside is ${newUserList}`);
    return newUserList;
}

export function updateUserStatus(address,newstatus,userlist) {
    if (!Array.isArray(userlist)) {return userlist;}
    let index=userlist.findIndex(element=>element.address==address);
    if (index==-1) {return userlist;}
    let newUserList  = userlist.slice(); //create new array so that state updates will re-render the list.
    newUserList[index].status=newstatus;
    console.log(`new user list inside update is ${newUserList}`);
    return newUserList;

}

export function canFollow(address,userList) {
    if (!Array.isArray(userList)) {return false;}
    let index=userList.findIndex(element=>element.address==address);
    return (index==-1); //only allow following users not already in follow list
}

export function canUnfollow(address,userList) {
    if (!Array.isArray(userList)) {return false;}
    let index=userList.findIndex(element=>element.address==address);
    if (index==-1) return false;
    if (userList[index].status=="Pending Unfollow") return false; //no doble sending upfollow

    return true;
    
}