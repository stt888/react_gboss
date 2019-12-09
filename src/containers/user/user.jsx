import React, {Component} from 'react'
import {Result, List, WhiteSpace, Modal} from 'antd-mobile'
import browserCookies from 'browser-cookies'
import {connect} from 'react-redux'
import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class User extends Component {

    handleLogout = () => {
        Modal.alert('Log Off', 'Confirm to exist?', [
            {
                text: 'Cancel',
                onPress: ()=> console.log('Cancel.')},
            {
                text: 'Confirm',
                onPress: ()=> {
                    browserCookies.erase('userid')
                    this.props.resetUser()
                }
            }
            ])
    }

    render () {
        const {name, avatar, title, desc, money, company} = this.props.user

        return (
            <div>
                <Result style={{marginTop: 30}}
                    img={<img src={require(`../../assets/imgs/${avatar}.png`)} style={{width:50}} alt='avatar'/>}
                    title={name}
                    message={company}
                />
                <List renderHeader={()=>'Related Information:'}>
                    <Item multipleLine>
                        <Brief>Position: {title}</Brief>
                        <Brief>Description: {desc} </Brief>
                        {money ? <Brief>Salary: {money} </Brief> : null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Item onClick={this.handleLogout}>Sign Out</Item>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {resetUser}
)(User)