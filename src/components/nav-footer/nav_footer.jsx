import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {TabBar} from 'antd-mobile'

const Item = TabBar.Item

class NavFooter extends Component {
    static propTypes = {
        navList: PropTypes.array.isRequired,  //props from dashboard.jsx
        unReadCount: PropTypes.number.isRequired
    }

    render () {
        const navList = this.props.navList.filter(nav=>!nav.hide)
        const {pathname} = this.props.location
        
        return (
            <TabBar>
                {
                    navList.map((nav, index)=>(
                        <Item
                            key={nav.path} //no need use index for identity
                            badge={nav.path === '/msg' ? this.props.unReadCount : 0}
                            title={nav.text}
                            icon={{uri: require(`./imgs/${nav.icon}.png`)}}
                            selectedIcon={{uri:require(`./imgs/${nav.icon}-active.png`)}}
                            selected={pathname===nav.path}
                            onPress={()=>{this.props.history.replace(nav.path)}}
                        />)
                    )
                }
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)