import React, {Component} from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const RadioItem = Radio.RadioItem

class Register extends Component {
    //initial state attributes
    state = {
        name: '', //user name
        pwd: '',
        pwd2:'',
        type: 'company' //user type
    }

    handleChange=(name, val)=>{
        this.setState({
            [name]: val
        })
    }

    //route to login page
    goLogin =() =>{
        this.props.history.replace('/login')
    }

    // handle register
    handleRegister=()=>{
        // trigger async register action
        this.props.register(this.state)
    }


    render () {
        // in order to receive the message to show up, need to receive user from actions
        const {user} = this.props

        // If user's redirectTo has value, need to jump to another path
        if(user.redirectTo){
            return <Redirect to={user.redirectTo}/>
        }

        return (
            <div>
                <NavBar> GUIGU JOBBANK </NavBar>
                <Logo/>

                <WingBlank>
                    {/*show up the message if it has*/}
                    {user.msg ? <p className='error-msg'>{user.msg}</p> : ''}
                    <List>
                        <InputItem onChange={(val)=>{this.handleChange('name',val)}}>UserName: </InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={(val)=>{this.handleChange('pwd',val)}}>Password: </InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={(val)=>{this.handleChange('pwd2',val)}}>Confirm p/s:</InputItem>
                        <WhiteSpace/>
                        <RadioItem checked={this.state.type==='genius'} onClick={(val)=>{this.handleChange('type','genius')}}>Genius</RadioItem>
                        <RadioItem checked={this.state.type==='company'} onClick={(val)=>{this.handleChange('type','company')}}>Company</RadioItem>
                        <Button type='primary' onClick={this.handleRegister}>Register</Button>
                        <Button onClick={this.goLogin}>Login</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}


export default connect(
    state => ({user: state.user}),
    {register}
)(Register)