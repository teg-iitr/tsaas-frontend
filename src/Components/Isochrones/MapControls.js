import React, { Component } from "react";
import classes from "./MapControls.css";
import {
  Slider,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import AutoComplete from "./AutoComplete";
import Button from "@material-ui/core/Button";
import { primaryCategories } from "./assets/categories";

import eatAndDrink from "./assets/eatAndDrink.json";
import goingOut from "./assets/goingOut.json";
import accommodations from "./assets/accommodations.json";
import shopping from "./assets/shopping.json";
import facilities from "./assets/facilities.json";
import areas from "./assets/areasAndBuildings.json";
import business from "./assets/businessAndServices.json";
import nature from "./assets/naturalAndGeographical.json";
import transport from "./assets/transport.json";
import sights from "./assets/sightsAndMuseums.json";
import leisure from "./assets/leisureAndOutdoor.json";
export default class MapControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestionsArray: [...primaryCategories],
      secArr: [],
      optionSelector: "0",
    };
    this.importsObj = {
      eatAndDrink,
      goingOut,
      accommodations,
      shopping,
      facilities,
      areas,
      business,
      nature,
      transport,
      sights,
      leisure,
    };
  }
  displayHandler = () => {};

  handleFiles = (e) => {
    const handleTextFiles = (content, delimiter) => {
      var lineData = content.split("\n");
      const objArr = [];
      const latArr = [],
        lngArr = [];
      lineData.forEach((el) => {
        var [title, latStr, lngStr, extra] = el.split(delimiter);
        var lat = parseFloat(latStr);
        var lng = parseFloat(lngStr);

        if (lat) {
          var locObj = { title, position: [lat, lng], extra };
          latArr.push(lat);
          lngArr.push(lng);
          objArr.push(locObj);
        }
      });
      this.props.handleFileInput({ objArr, latArr, lngArr });
    };

    const handleJSONFile = (objArr) => {
      var latArr = [];
      var lngArr = [];
      objArr.forEach(({ position }) => {
        latArr.push(position[0]);
        lngArr.push(position[1]);
      });
      this.props.handleFileInput({ objArr, latArr, lngArr });
    };
    var file = e.target.files[0];
    if (file) {
      var fileType = file.type;
      var f = new FileReader();

      switch (fileType) {
        case "text/plain": {
          f.onload = (e) => {
            handleTextFiles(e.target.result, "\t");
          };
          f.readAsText(file);
          break;
        }
        case "application/json":
          f.onload = (e) => {
            if (file.name.includes(".geo")) {
              console.log(JSON.parse(e.target.result));
              var objarr = [];
              JSON.parse(e.target.result).features.forEach(
                ({ geometry, properties }) => {
                  var obj = {
                    title: properties.title,
                    position: [...geometry.coordinates],
                  };
                  objarr.push(obj);
                }
              );
              handleJSONFile(objarr);
            } else {
              handleJSONFile(JSON.parse(e.target.result));
            }
          };
          f.readAsText(file);
          break;
        case "text/csv":
          f.onload = (e) => {
            handleTextFiles(e.target.result, ",");
          };
          f.readAsText(file);
          break;
        default:
          console.log(fileType);
          break;
      }
    }
  };
  newCategoriesHandler = (val) => {
    const req_arr = primaryCategories.filter((el) => {
      return el.code === val;
    });
    
    const newArr = this.importsObj[req_arr[0].arr];
    this.setState({ secArr: newArr });
  };
  optionSelectorHandler = (event) => {
    this.setState({ optionSelector: event.target.value });
  };
  render() {
    const menuItems = this.state.suggestionsArray.map((element) => {
      return (
        <MenuItem
          key={element.title}
          value={element.code ? element.code : element.id}
        >
          {element.title}
        </MenuItem>
      );
    });
    const menuItems1 = this.state.secArr.map((element) => {
      return (
        <MenuItem key={element.Title} value={element.Code}>
          {element.Title}
        </MenuItem>
      );
    });
    return (
      <div className={classes.ControlsContainer}>
        <div className={classes.Heading}>
          <h2>Configuration</h2>
        </div>
        <div className={classes.FormControls}>
          <div className={classes.CityInput}>
            <input
              type="text"
              name="city"
              defaultValue="New Delhi"
              onChange={(event) => this.props.inputHandler(event)}
            />
            <Button
              style={{
                fontSize: "12px",
                padding: "3px",
                borderRadius: "0px",
                backgroundColor: "#449DD1",
              }}
              color="primary"
              onClick={this.props.cityEnteredHandler}
              variant="contained"
              component="span"
            >
              Fetch City Map
            </Button>
          </div>
          <div className={classes.BoundingBox}>
            <p>
              {this.props.bbox ? this.props.bbox.getTop().toFixed(5) : null}
            </p>
            <div className={classes.BoundingBoxIn}>
              <p>
                {this.props.bbox ? this.props.bbox.getLeft().toFixed(5) : null}
              </p>
              <p>
                {this.props.bbox ? this.props.bbox.getRight().toFixed(5) : null}
              </p>
            </div>

            <p>
              {this.props.bbox ? this.props.bbox.getBottom().toFixed(5) : null}
            </p>
          </div>
          <div className={classes.Pois}>
            <InputLabel id="selectMode"> Select Travel Mode</InputLabel>
            <Select
              name="modes"
              onChange={(event) => this.props.inputHandler(event)}
              labelid="selectMode"
              id="selectm"
              value={this.props.mode}
            >
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
            <InputLabel id="selectModeTransition">
              {" "}
              Select Route Preference
            </InputLabel>
            <Select
              name="modePreference"
              onChange={(event) => this.props.inputHandler(event)}
              labelid="selectModeTransition"
              id="selectmr"
              value={this.props.modePreference}
            >
              {/* {menuItems} */}
              <MenuItem value="fastest">Fastest</MenuItem>
              <MenuItem value="shortest">Shortest</MenuItem>
            </Select>
          </div>
          <div className={classes.Pois}>
            <InputLabel id="selectTrafficState">
              {" "}
              Select Traffic conditions on Roads
            </InputLabel>
            <Select
              name="modeState"
              onChange={(event) => this.props.inputHandler(event)}
              labelid="selectTrafficState"
              id="selectmr"
              value={this.props.modeState}
            >
              {/* {menuItems} */}
              <MenuItem value="enabled">Enabled</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
            </Select>
          </div>

          {this.state.optionSelector === "0" ? (
            <div className={classes.pois}>
              <FormLabel component="legend">
                Select Source of Facilities
              </FormLabel>
              <RadioGroup
                aria-label="Select Source of Facilities"
                name="Select Source of Facilities"
                value={this.state.optionSelector}
                onChange={this.optionSelectorHandler}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Predefined Categories"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Upload a File (txt, csv, geojson)"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="Custom Search"
                />
              </RadioGroup>
            </div>
          ) : null}
          {this.state.optionSelector === "2" ? (
            <div className={classes.pois}>
              <Button style={{alignSelf:"center"}} variant="contained" component="label">
                Upload File
                <input
                  onChange={(e) => this.handleFiles(e)}
                  type="file"
                  id="inputFile"
                  style={{ display: "none" }}
                />
              </Button>
              <h6 style={{color:'grey',fontWeight:400,margin:'2px',width:'100%'}}>*File must be in csv, txt or geojson format and contain lat, long in the header/ dictionaries.</h6>
            </div>
          ) : null}
          {this.state.optionSelector === "1" ? (
            <div className={classes.Pois}>
              <Typography id="disabled-slider" gutterBottom>
                Select number of points to be loaded
              </Typography>
              <Slider
                name="noOfPoints"
                defaultValue={50}
                onChange={this.props.nosHandleChange}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
              />
            </div>
          ) : null}
          {this.state.optionSelector === "1" ? (
            <div className={classes.Pois}>
              <InputLabel id="selectPois"> Select Primary Category</InputLabel>
              <Select
                name="pois"
                onChange={(event) => {
                  this.props.inputHandler(event);
                  this.newCategoriesHandler(event.target.value);
                }}
                labelid="selectPois"
                id="selectp"
                value={this.props.pois}
              >
                {menuItems}
              </Select>
            </div>
          ) : null}
          {this.state.secArr.length > 0 ? (
            <div className={classes.Pois}>
              <InputLabel id="selectSecPois">
                {" "}
                Select secondary category
              </InputLabel>
              <Select
                name="secPois"
                onChange={(event) => {
                  this.props.inputHandler(event);
                }}
                labelid="selectSecPois"
                id="selectp"
                value={this.props.secPois}
              >
                {menuItems1}
              </Select>
            </div>
          ) : null}
          {this.state.optionSelector === "3" ? (
            <div className={classes.Pois}>
              <InputLabel>Custom Search</InputLabel>
              <AutoComplete
                lat={this.props.searchLat}
                lng={this.props.searchLng}
                selectedOption={this.props.selectedOption}
              />
            </div>
          ) : null}
          <div className={classes.Pois}>
            <InputLabel id="enterTimeBins">
              {" "}
              Enter 'Comma-Seperated' Time Bins (min) in ascending order
            </InputLabel>
            <TextField
              name="timeBins"
              onChange={(event) => this.props.inputHandler(event)}
              labelid="enterTimeBins"
              id="selecttb"
              value={this.props.timeBins}
            />
          </div>
          <div className={classes.Pois}>
            <Typography id="disabled-slider" gutterBottom>
              Transparency
            </Typography>
            <Slider
              defaultValue={50}
              onChange={this.props.transparencyChange}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    );
  }
}
