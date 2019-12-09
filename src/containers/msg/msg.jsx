import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

// get last msg function   
function getLastMsgs(chatMsgs, userid){
    // separate msgs by group by chat_id, and keep the last msg as value in each group. The result will be put in an object named lastMsgsObj:{chat_id1: lastMsg1, chat_id2: lastMsg2...}
    const lastMsgsObj = {}
    // iterate chatMsgs
    chatMsgs.forEach(msg => {
        msg.unReadCount = 0
        // count msg
        if(!msg.read&&msg.to===userid){
            msg.unReadCount=1 //for later user
        }
        // check if the current msg is the last msg
        const chatId = msg.chat_id 
        const savedLastMsg = lastMsgsObj[chatId]
        // if last msg is not exist
        if(!savedLastMsg){
            // save msg as last msg
            lastMsgsObj[chatId] = msg
        }else{
            // compare create time, if bigger, then replace
            if(msg.create_time>savedLastMsg.create_time){
                lastMsgsObj[chatId] = msg
                msg.unReadCount+=savedLastMsg.unReadCount //keep original saved number plus 1. As msg.unReadCount is 1.(saved number+1)
            }else{
                savedLastMsg.unReadCount += msg.unReadCount // here only check if msg read or not. If read already, the msg.unReadCount is 0. If not, will be 1)
            }
        }
    })
    // get all the value which is last msg to form an array
    const lastMsgs = Object.values(lastMsgsObj)
    // sort the array by create time
    lastMsgs.sort(function(msg1, msg2){
        return msg2.create_time - msg1.create_time
    })

    // return last msgs
    return lastMsgs
}

class Msg extends Component {
    render() {
        const {user, chat} = this.props
        const {users, chatMsgs} = chat
        const meId = user._id
        // get all the last msg from all users
        const lastMsgs = getLastMsgs(chatMsgs, meId)

        return (
            <List style={{marginTop:50, marginBottom:50}}>
                {lastMsgs.map(lastMsg=>{
                    const targetId = lastMsg.to===meId ? lastMsg.from : lastMsg.to
                    const targetUser = users[targetId]
                    const targetAvatarIcon = targetUser.avatar ? require(`../../assets/imgs/${targetUser.avatar}.png`) : null
                    return (
                        <Item
                            key = {lastMsg._id}
                            extra={<Badge text={lastMsg.unReadCount}/>}
                            thumb={targetAvatarIcon}
                            arrow='horizontal'
                            onClick = {()=>this.props.history.push(`/chat/${targetId}`)}
                            >
                            {lastMsg.content}
                            <Brief>{targetUser.name}</Brief>
                        </Item>
                    )
                })
                }
            </List>
        )
    }
}
export default connect(
    state => ({user: state.user, chat: state.chat})
)(Msg)