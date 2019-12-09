
// action creators (include sync and async)
import io from 'socket.io-client'
import {AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RECEIVE_USER_LIST, RESET_USER,RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ} from "./action-types";
import {reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqChatMsgList, reqReadChatMsg} from "../api";


// sync actions
// error massage action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// register success action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

// receive user action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// reset user action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// receive user list
const receiveUserList = (users) => ({type: RECEIVE_USER_LIST, data: users}) 
// receive one chat msg
const receiveMsg = (chatMsg, userid)=>({type:RECEIVE_MSG, data: {chatMsg, userid}})
// receive chat msg list
const receiveMsgList = ({chatMsgs, users, userid})=>({type:RECEIVE_MSG_LIST, data: {chatMsgs, users, userid}})
// get read msg information
const msgRead = ({from, to, count})=>({type:MSG_READ, data: {from, to, count}})


// initialize connection with IO service and bind listener to receive msg from server
function initIO(userid, dispatch){
   // debugger
    // connect to IO service
    io.socket = io(`ws://localhost:3000?userid=${userid}`)
    // binding listener to receive msg from server
    io.socket.on('receiveMsg', function(chatMsg){
        console.log('Browser received msg-me', chatMsg)
        dispatch(receiveMsg(chatMsg, userid))
    })
}


async function getMsgList(dispatch, userid){
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0){
        const {chatMsgs, users} = result.data
        dispatch(receiveMsgList({chatMsgs, users, userid}))
    }
}


// async update msg read information
export const readMsg = (from) => {
    return async(dispatch, getState) => {
        const response = await reqReadChatMsg(from) // "from" is the chat target user
        const result = response.data
        if(result.code===0){
            const count = result.data
            const to = getState().user._id // "to" is the login user
            dispatch(msgRead({from, to, count}))
        }
    }
}

// async send msg
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        io.socket.emit('sendMsg', {from, to, content})
        console.log('Browser send msg to server-me', {from, to, content})
    }
}


// async register action
export const register = ({name, pwd, pwd2, type}) => {
// verify register data
    if(!name || !pwd || !type){
        return errorMsg('Please enter user name and password.')
    }
    if(pwd !== pwd2){
        return errorMsg('Please enter the same password.')
    }
    // if verify register data success , send async ajax request
    return dispatch => {
        reqRegister({name, pwd, type})
            .then(
                response => {
                    const result = response.data  // data:{code: 0, data: user} {code: 1, data: msg}
                    if(result.code===0){
                        // receive msg from server
                        initIO(result.data._id, dispatch)
                        getMsgList(dispatch, result.data._id)
                        dispatch(authSuccess(result.data))
                    }else{
                        dispatch(errorMsg(result.msg))
                    }
                }
            )
    }
}

//async login action
export const login = ({name, pwd}) => {
    if(!name || !pwd){
        return errorMsg('Please enter user name and password.')
    }
    return dispatch => {
        reqLogin({name, pwd})
            .then(
                response => {
                    const result = response.data  // data:{code: 0, data: user} {code: 1, data: msg}
                    if (result.code === 0) {
                        initIO(result.data._id, dispatch)
                        getMsgList(dispatch, result.data._id)
                        dispatch(authSuccess(result.data))
                    } else {
                        dispatch(errorMsg(result.msg))
                    }
                }
            )
    }
}

//async update users' information action
export const updateUser = (user) => {
    // send async request
    return dispatch => {
        reqUpdateUser(user)
            .then(
                response => {
                    const result = response.data
                    if(result.code === 0){
                        dispatch(receiveUser(result.data))
                    }else{
                        dispatch(resetUser(result.msg))
                    }
                }
            )
    }
}

// async get user action
export const getUser = () =>{
    return dispatch => {
        reqUser()
            .then(
                response => {
                    const result = response.data
                    if(result.code === 0){
                        initIO(result.data._id, dispatch)
                        getMsgList(dispatch, result.data._id)
                        dispatch(receiveUser(result.data))
                    }else{
                        dispatch(resetUser(result.msg))
                    }
                }
            )
    }
}

//async get user list action
export const getUserList = (type) => {
    return dispatch => {
        reqUserList(type)
            .then(
                response => {
                    const result = response.data
                    if(result.code === 0){
                        dispatch(receiveUserList(result.data))
                    }
                }
            )
    }
}


