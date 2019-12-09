//company information component

import React, {Component} from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {updateUser} from '../../redux/actions'

class CompanyInfo extends Component {
    state = {
        avatar: '',
        desc: '',
        title: '',
        company: '',
        money: ''
    }

    handleChange=(name,val)=>{
        this.setState({[name]:val})
    }

    setAvatar = (avatar)=>{
        this.setState({avatar})
    }

    render () {
        // jump to company page if complete information
        const {user} = this.props
        if(user.avatar){
            return <Redirect to='/company'/>
        }

        return (
            <div>
                <NavBar>Company Information</NavBar>
                <AvatarSelector setAvatar={this.setAvatar}/>
                <InputItem onChange={val=>this.handleChange('title', val)}>Position: </InputItem>
                <InputItem onChange={val=>this.handleChange('company', val)}>Company: </InputItem>
                <InputItem onChange={val=>this.handleChange('money', val)}>Salary: </InputItem>
                <TextareaItem
                    title = 'Requirement:'
                    rows = {3}
                    onChange = {val=>{this.handleChange('desc',val)}}
                />
                <Button type='primary' onClick={()=>this.props.updateUser(this.state)}>Save</Button>
            </div>
        )
    }
}

export default connect(
    state=> ({user: state.user}),
    {updateUser}
)(CompanyInfo)