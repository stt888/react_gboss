import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from "../../redux/actions";
import UserList from '../../components/user-list/user_list'


class Company extends Component {

    
    componentDidMount(){
        // async get genius' user list
        this.props.getUserList('genius')
    }

    render () {
        return <UserList userList={this.props.userList}/>
        
    }
}

export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Company)