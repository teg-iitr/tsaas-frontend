import React, { Component } from 'react';
import HereMaps from './HereMaps';
class MainMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        theme: 'normal.day',
        lat:"26.9124",
        lng:"75.7873",
        value:null
      }
    this.onChange = this.onChange.bind(this);
}
inputHandler=(event)=>{
  this.setState({value:event.target.value});
  console.log(this.state.value);
  return this.state.value;
}
onChange(evt) {
    evt.preventDefault();
}
  render() {
    return (
      <div className="MainMap">
        <HereMaps
          app_id='wvzQzqmPlU1T9tjf0YLU'
          app_code='b_is4SmSRfh8e0-Mr2-low'
          lat={this.state.lat}
          lng={this.state.lng}
          zoom="12"
          theme={ this.state.theme}
          inputChange={(event)=>this.inputHandler(event)}
          searchArea={this.props.searchText}
          autocompleteArrayHandler={this.props.autocompleteArrayHandler}
          markerQuery={this.props.markerQuery}
        ></HereMaps>
        {/* <ThemeSelector changeTheme={ this.onChange } /> */}
      </div>
    );
  }
}
export default MainMap;
