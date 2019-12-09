import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from "../../redux/actions";
import UserList from '../../components/user-list/user_list'

class Genius extends Component {
    componentDidMount(){
        // async get company's user list
        this.props.getUserList('company')
    }

    render () {
        return <UserList userList={this.props.userList}/>
    }
}

export default connect(
    state => ({userList: state.userList}),
    {getUserList}
)(Genius)