// include some functions correspond with the server api

import ajax from './ajax'

// request register
export const reqRegister = (user) => ajax('/api/register', user, 'POST')

// request login
export const reqLogin = (user) => ajax('/api/login', user, 'POST')

// update user's information
export const reqUpdateUser = (user) => ajax('/api/update', user, 'POST')

// get user according to cookies
export const reqUser = () => ajax('/api/user')

// get user list according to user type
export const reqUserList = (type) =>ajax('/api/list', {type: type}, 'POST')

// get current user's all msg list
export const reqChatMsgList = () => ajax('/api/msglist')

// get read msg information
export const reqReadChatMsg = (from) => ajax('/api/readmsg', {from}, 'post')