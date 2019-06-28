import React from 'react';
import Logo from '../../assets/icons/Logo.png'
import classes from './Logo.css'
const logo=props=>(
    <div className={classes.Logo} style={{height:props.height}}>
        <img src={Logo}></img>
        <div style={{fontSize:props.fontSize}} className={classes.LogoText}>
        <p>Traffic Survey</p>
        <p>As A Service</p>
        </div>
    </div>
)
export default logo;