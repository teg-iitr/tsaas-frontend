import React, { Component } from 'react';
import classes from './MapControls.css'
import {InputLabel,Select,MenuItem,TextField} from '@material-ui/core'
// import AutoComplete from './AutoComplete'
import Button from '@material-ui/core/Button';
export default class MapControls extends Component{
    // componentWillReceiveProps(nextProps){
    //     if
    // }
   
    render(){
        const suggestionsArray=[
            "restaurant",
            "coffee-tea",
            'snacks-fast-food',
            'going-out',
            'sights-museums',
            "airport",
            'accommodation',
            'shopping',
            'leisure-outdoor',
            'administrative-areas-buildings',
            'natural-geographical',
            'petrol-station',
            'atm-bank-exchange',
            'toilet-rest-area',
            "hospital-health-care-facility"]
        const menuItems=suggestionsArray.map(element=>{
            return <MenuItem value={element}>{element}</MenuItem>
        })
        return(
            <div className={classes.ControlsContainer}>
                <div className={classes.Heading}>
                    <h2>Configuration</h2>
                </div>
                <div className={classes.FormControls}>
                    <div className={classes.CityInput}>
                        <input type='text' name="city" defaultValue="New Delhi" onChange={(event)=>this.props.inputHandler(event)}/> 
                        <Button style={{fontSize:'12px',padding:'3px',borderRadius:'0px',backgroundColor:'#449DD1'}} color="primary" onClick={this.props.cityEnteredHandler} variant="contained"  component="span">Fetch City Map</Button>   
                        {/* <button onClick={this.props.cityEnteredHandler}>Fetch city map</button>     */}
                    </div>
                    <div className={classes.Pois}>
                        <InputLabel id='selectMode'> Select Travel Mode</InputLabel>
                        <Select name='modes' onChange={event=>this.props.inputHandler(event)} labelId='selectMode' id='selectm' value={this.props.mode}>
                                {/* {menuItems} */}
                                <MenuItem value="pedestrian">Walk</MenuItem>
                                <MenuItem value="car">Car</MenuItem>
                                {/* <MenuItem value="publicTransport">PT</MenuItem> */}
                                {/* <MenuItem value="carHOV">Car HOV</MenuItem> */}
                                {/* <MenuItem value="truck">Truck</MenuItem> */}
                                {/* <MenuItem value="bicycle">Bicycle</MenuItem> */}
                                {/* <MenuItem value="publicTransport">PT</MenuItem> */}
                        </Select>
                    </div>
                    <div className={classes.Pois}>
                        <InputLabel id='selectModeTransition'> Select Route Preference</InputLabel>
                        <Select name='modePreference' onChange={event=>this.props.inputHandler(event)} labelId='selectModeTransition' id='selectmr'  value={this.props.modePreference}>
                                {/* {menuItems} */}
                                <MenuItem value="fastest">Fastest</MenuItem>
                                <MenuItem value="shortest">Shortest</MenuItem> 
                        </Select>
                    </div>
                    <div className={classes.Pois}>
                        <InputLabel id='selectTrafficState'> Select Traffic conditions on Roads</InputLabel>
                        <Select name='modeState' onChange={event=>this.props.inputHandler(event)} labelId='selectTrafficState' id='selectmr' value={this.props.modeState}>
                                {/* {menuItems} */}
                                <MenuItem value="enabled">Enabled</MenuItem>
                                <MenuItem value="disabled">Disabled</MenuItem>
                                
                        </Select>
                    </div>
                    <div className={classes.Pois}>
                        <InputLabel id='enterTimeBins'> Enter 'Comma-Seperated' Time Bins Values (min)</InputLabel>
                        {/* <Select name='pois' onChange={event=>this.props.inputHandler(event)} labelId='selectPois' id='selectp' value={this.props.pois}>
                                {menuItems}     
                        </Select> */}
                        <TextField name='timeBins' id=""  onChange={event=>this.props.inputHandler(event)} labelId="enterTimeBins" id='selecttb' value={this.props.timeBins}/>
                    </div>
                    <div className={classes.Pois}>
                        <InputLabel id='selectPois'> Select Point of interest from the list</InputLabel>
                        <Select name='pois' onChange={event=>this.props.inputHandler(event)} labelId='selectPois' id='selectp' value={this.props.pois}>
                                {menuItems}     
                        </Select>
                    </div>
                    
                    <div className={classes.Pois}>
                    <InputLabel id='selectPois'> Click to load more data</InputLabel>
                    <Button style={{fontSize:'12px',backgroundColor:'#449DD1'}}variant="contained" color="primary" onClick={this.props.fetchHandler} component="span">Fetch More data</Button>
                        {/* <button style={{padding:'7px',backgroundColor: 'aqua',border:'none'}} onClick={this.props.fetchHandler}>Fetch more data</button> */}
                    </div>
                    
                </div>
                
            </div>
        )
    }
}