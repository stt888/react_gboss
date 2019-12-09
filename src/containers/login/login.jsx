import React, {Component} from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import  {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'


class Login extends Component {
    //initial state attributes
    state = {
        name: '', //user name
        pwd: ''
    }

    handleChange=(name, val)=>{
        this.setState({
            [name]: val
        })
    }

    //route to register page
    goRegister =() =>{
        this.props.history.replace('/register')
    }

    // handle register
    handleLogin=()=>{
        this.props.login(this.state)
    }


    render () {
        const {user} = this.props
        if(user.redirectTo){
            return <Redirect to={user.redirectTo}/>
        }

        return (
            <div>
                <NavBar> TSUN JOBBANK </NavBar>
                <Logo/>

                <WingBlank>
                    {user.msg ? <p className='error-msg'>{user.msg}</p> : null}
                    <List>
                        <InputItem onChange={(val)=>{this.handleChange('name',val)}}>UserName: </InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' onChange={(val)=>{this.handleChange('pwd',val)}}>Password: </InputItem>
                        <WhiteSpace/>

                        <Button type='primary' onClick={this.handleLogin}>Login</Button>
                        <Button onClick={this.goRegister}>Please Register</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)