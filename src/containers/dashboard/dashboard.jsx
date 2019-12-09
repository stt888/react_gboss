// dashboard component
import React, {Component} from 'react'
import  {Route, Switch, Redirect} from 'react-router-dom'
import cookies from 'browser-cookies'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'

import CompanyInfo from "../company-info/company_info";
import GeniusInfo from "../genius-info/genius_info";
import {getUser} from '../../redux/actions'
import {getRedirectPath} from "../../utils";
import Company from '../company/company'
import Genius from '../genius/genius'
import Msg from '../msg/msg'
import User from '../user/user'
import NotFound from '../not_found/not_found'
import NavFooter from '../../components/nav-footer/nav_footer'
import Chat from '../chat/chat'

class Dashboard extends Component {

    navList = [
        {
            path: '/company', // route path
            component: Company,
            title: 'Genius List',
            icon: 'company',
            text: 'Genius', // for footnav using
        },
        {
            path: '/genius',
            component: Genius,
            title: 'Company List',
            icon: 'job',
            text: 'Company',
        },
        {
            path: '/msg',
            component: Msg,
            title: 'Message List',
            icon: 'msg',
            text: 'Message',
        },
        {
            path: '/user',
            component: User,
            title: 'User Center',
            icon: 'user',
            text: 'Me',
}
    ]

    componentDidMount(){
        const userid = cookies.get('userid')
        const {user} = this.props
        // if there's userid in cookie and there's not user data in redux
        if(!user._id && userid){
            this.props.getUser()
        }
    }

    render () {
        const pathname = this.props.location.pathname
        // check if user login (cookie id is exist)
        const userid = cookies.get('userid')
        if(!userid){
            return <Redirect to='/login'/>
        }

        // get user from the redux
        const {user} = this.props
        if(!user._id){
            return null
        }else{
            // automatically go to user page when request path
            if(pathname==='/'){ // cannot skip user information page
                const path = getRedirectPath(user.type, user.avatar)
                return <Redirect to={path}/>
            }

            // which nav need to be hidden
            if(user.type==='company'){
                this.navList[1].hide = true
            }else{
                this.navList[0].hide = true
            }
        }

        const currentNav = this.navList.find(nav=>nav.path===pathname)
        return (
            <div>
                
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path='/companyinfo' component={CompanyInfo}/>
                    <Route path='/geniusinfo' component={GeniusInfo}/>
                    <Route path='/company' component={Company}/>
                    <Route path='/genius' component={Genius}/>
                    <Route path='/msg' component={Msg}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route path='/user' component={User}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter unReadCount={this.props.unReadCount} navList={this.navList}/> : null}
            </div>
        )
    }
}

export default connect(
    state=> ({user: state.user, unReadCount: state.chat.unReadCount}),
    {getUser}
)(Dashboard)