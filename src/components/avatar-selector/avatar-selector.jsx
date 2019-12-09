
// avatar icon selector component

import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import {PropTypes} from "prop-types";

class AvatarSelector extends Component {
    static propTypes = {
        setAvatar: PropTypes.func.isRequired
    }

    state={
        icon: null,
        text: ''
    }

    constructor(props){
        super(props)
        this.avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
                .split(',').map(text=>({
                icon:require(`../../assets/imgs/${text}.png`),
                text
            }))
    }

    selectAvatar = (item) => {
        this.setState({icon: item.icon}) //update current component's state
        this.props.setAvatar(item.text)  //update parents's component state
    }

    render () {
        const {icon} = this.state
        const gridHeader = icon ? (<p> Icon Chosen: <img style={{width:20}} src={icon} alt='avatar'/></p>) : 'Please choose icon: '
        return (
            <List renderHeader= {()=> gridHeader}>
                <Grid
                    data={this.avatarList}
                    columnNum={5}
                    onClick={(item)=>this.selectAvatar(item)}
                />
            </List>
        )
    }
}

export default AvatarSelector