import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Icon} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'
import {sendMsg, readMsg} from "../../redux/actions"

const Item = List.Item

class Chat extends Component {

    state = {
        content: ''
    }

    handleChange=(content)=>{
        this.setState({content})
    }

    send=()=>{
        const content = this.state.content.trim()
        //console.log(content)
        if(content){
            const from = this.props.user._id  // the login user
            const to = this.props.match.params.userid // asked to chat with user
            this.props.sendMsg({from, to, content})
            this.setState({content:''})
            
        }
    }

    componentDidMount(){
        window.scrollTo(0, document.body.scrollHeight)
    }
    
    componentWillUnmount(){
        const from = this.props.match.params.userid
        this.props.readMsg(from)
    }
    componentDidUpdate(){
        window.scrollTo(0, document.body.scrollHeight)
    }

    render () {
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat
        if(!users[user._id]) {
            return null
            }

        const targetId = this.props.match.params.userid
        const meId = user._id
        const chat_id = [targetId, meId].sort().join('_')
        const msgs = chatMsgs.filter(msg => msg.chat_id === chat_id)
        const targetIcon = users[targetId] ? require(`../../assets/imgs/${users[targetId].avatar}.png`) : null
        const meIcon = require(`../../assets/imgs/${user.avatar}.png`)        

        return (
            <div id='chat-page'>
                <NavBar 
                    className="stick-top" 
                    icon={<Icon type="left"/>} 
                    onLeftClick={()=>{this.props.history.goBack()
                }}>
                    {users[targetId].name} 
                </NavBar>
                <List style={{marginTop:50, marginBottom:50}}>
                    {/* <QueueAnim type='left' delay={100}> */}
                        {msgs.map((msg)=>{
                            if(msg.to===meId){
                                return (<Item 
                                    key={msg._id}
                                    thumb={targetIcon}>
                                    {msg.content}
                                    </Item>)
                            }else{
                                return (<Item
                                    key={msg._id}
                                    className='chat-me'
                                    extra={<img src={meIcon} alt='icon'/>}>
                                    {msg.content}
                                    </Item>)
                            }

                        })}
                    {/* </QueueAnim> */}
                </List>
                <div className='am-tab-bar'>
                    <InputItem 
                        placeholder='Message' 
                        extra={<span onClick={this.send}>Send</span>}  
                        value={this.state.content}
                        onChange={val=>{this.handleChange(val)}} />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)