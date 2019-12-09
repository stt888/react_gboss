// according to the old state and action to produce new state returned
import {combineReducers} from 'redux'
import {AUTH_SUCCESS, ERROR_MSG, RESET_USER, RECEIVE_USER, RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ } from "./action-types";
import {getRedirectPath} from "../utils";

// reducer for maneging user
const initUser = {
    name: '',
    type: '',
    msg: '',
    redirectTo: '' // the path for automatically jump to
}

function user(state=initUser, action){
    switch(action.type){
        case AUTH_SUCCESS:
            const user = action.data
            return {...user, redirectTo: getRedirectPath(user.type, user.avatar)}
        case ERROR_MSG:
            return {...state, msg: action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser, msg: action.data}
        default:
            return state
    }
}

// reducer for maneging user list
const initUserList = []

function userList(state=initUserList, action){
    switch (action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

// reducer for managing chat data
const initChat = {
    chatMsgs: [],
    users: {},  // {name, avatar}
    unReadCount: 0
}

function chat(state=initChat, action){
    switch(action.type){
        case RECEIVE_MSG:
            var {chatMsg, userid}= action.data
            return {
                chatMsgs: [...state.chatMsgs, chatMsg],
                users: state.users,
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to===userid)
            }
        case RECEIVE_MSG_LIST:
            var {users, chatMsgs, userid} = action.data
            return {
                chatMsgs: chatMsgs,
                users: users,
                unReadCount: chatMsgs.reduce((preTotal, msg) => { // msg sent to me and not read yet
                    return preTotal + (!msg.read&&msg.to===userid ? 1 : 0)
                  }, 0)
            }
        case MSG_READ:
            const {count, from, to} = action.data    
            return {
            chatMsgs: state.chatMsgs.map(msg => {
                if(msg.from===from && msg.to===to && !msg.read) {
                // msg.read = true  // cannot modify state directly
                return {...msg, read: true}
                } else {
                return msg
                }
            }),
            users: state.users,
            unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}

export default combineReducers(
    {
       user,
       userList,
       chat
    }
)