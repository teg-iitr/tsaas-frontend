import React, { Component } from "react";
import classes from "./HereMaps.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import colorsArray from "./assets/colors";
class HereMaps extends Component {
  constructor(props) {
    super(props);
    this.colorsArray = [...colorsArray];
    this.platform = null;
    this.map = null;
    this.state = {
      configArray: [
        { time: 30, color: "rgba(255,0,0,1)" },
        { time: 15, color: "rgba(255,255,0,1)" },
        { time: 5, color: "rgba(0,255,0,1)" },
      ],
      nextUrl: "",
      apikey: props.apikey,
      center: {
        lat: props.lat,
        lng: props.lng,
      },
      routingParams: {
        mode: "fastest;car;traffic:enabled",
        rangetype: "time",
      },
      mode: "",
      placeMarker: null,
      markerX: props.lat,
      markerY: props.lng,
      zoom: props.zoom,
      theme: props.theme,
      style: props.style,
      isolinePolygonArray: [],
      transparency: props.transparency,
      query: "",
      boundingBox: null,
      isolinePolygonData: [],
      geoPointsArr:[]
    };
  }

  componentDidMount() {
    this.platform = new window.H.service.Platform(this.state);
    var layer = this.platform.createDefaultLayers();
    var container = document.getElementById("here-map");
    this.map = new window.H.Map(container, layer.vector.normal.map, {
      center: this.state.center,
      zoom: this.state.zoom,
    });
    var events = new window.H.mapevents.MapEvents(this.map);
    this.behavior = new window.H.mapevents.Behavior(events);
    this.ui = new window.H.ui.UI.createDefault(this.map, layer);
    this.addMarkersToMap(this.map, this.behavior);
    setTimeout(()=>{
      var bbox = this.map.getViewModel().getLookAtData().bounds.getBoundingBox();
    this.props.boundingBoxHandler(bbox);
    var initialDiffX=Math.abs(bbox.getLeft()-bbox.getRight())
    var initialDiffY=Math.abs(bbox.getTop()-bbox.getBottom())
    this.setState({ boundingBox: bbox,initialDiffX,initialDiffY });
    },500)    
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.searchValue!==nextProps.searchValue){
      this.refreshMap()
      nextProps.searchPosArr.forEach(el=>{
        this.getisoline(el.position,el.title)
      })
    }
    if(this.props.fileInput!==nextProps.fileInput){
      const {objArr,latArr,lngArr}=nextProps.fileInput
       this.prepareIsochroneFromFiles(objArr,latArr,lngArr)
    }
    if (this.props.transparency !== nextProps.transparency) {
      this.setState({ transparency: nextProps.transparency }, () => {
        this.changeTransparency(nextProps.transparency);
      });
    }
    if (this.props.lat !== nextProps.lat) {
      var centerCopy = { lat: nextProps.lat, lng: nextProps.lng };
      this.map.setCenter(centerCopy, true);

      this.setState(
        {
          center: centerCopy,
          markerX: centerCopy.lat,
          markerY: centerCopy.lng,
        },
        () => {
          this.props.coordHandler(nextProps.lat,nextProps.lng)
          this.addMarkersToMap(this.map, this.behavior);
        }
      );
      setTimeout(() => {
        var bbox = this.map
          .getViewModel()
          .getLookAtData()
          .bounds.getBoundingBox();
        this.props.boundingBoxHandler(bbox);

        this.setState({ boundingBox: bbox });
      }, 300);
    }

    if (this.props.timeBins !== nextProps.timeBins) {
      var configArrayCopy = [];
      if (
        nextProps.timeBins.search(",") !== -1 &&
        nextProps.timeBins.length >= 3 &&
        nextProps.timeBins[nextProps.timeBins.length - 1] !== ","
      ) {
        var timeBinsStringArray = nextProps.timeBins.split(",");
        var x = 1 / (timeBinsStringArray.length - 1);
        timeBinsStringArray.forEach((el, index) => {
          configArrayCopy.push({
            time: parseInt(el, 10),
            color: this.calculateRGB(index * x),
          });
         
        });
        configArrayCopy.reverse();

        this.setState({ configArray: configArrayCopy });
      }
    }
    var url =
      "https://browse.search.hereapi.com/v1/browse?apikey=" +
      process.env.REACT_APP_PLACES_API_KEY +
      "&at=" +
      this.state.markerX +
      "," +
      this.state.markerY +
      "&categories=";
    if (this.props.pois !== nextProps.pois) {
      this.map.removeObjects(this.map.getObjects());
      this.setState({ isolinePolygonArray: [], isolinePolygonData: [],geoPointsArr:[] });
      this.getPois(nextProps.pois, url);
    }
    if (this.props.secPois !== nextProps.secPois) {
      this.setState({ isolinePolygonArray: [], isolinePolygonData: [],geoPointsArr:[] });
      this.map.removeObjects(this.map.getObjects());
      this.getPois(nextProps.secPois, url);
    }
    if (this.props.updatedFetchCount !== nextProps.updatedFetchCount) {
      this.getPois("", this.state.nextUrl);
    }
  }
  addMarkersToMap(map, behavior) {
    var placeMarker = new window.H.map.Marker({
      lat: this.state.center.lat,
      lng: this.state.center.lng,
    });
    placeMarker.draggable = true;
    map.addObject(placeMarker);
    this.setState({ placeMarker: placeMarker },()=>{
    });
    this.dragEventHandler(map, behavior);
  }

  dragEventHandler = (map, behavior) => {
    map.addEventListener(
      "dragstart",
      (ev) => {
        var target = ev.target,
          pointer = ev.currentPointer;
        if (target instanceof window.H.map.Marker) {
          var targetPosition = map.geoToScreen(target.getGeometry());
          target["offset"] = new window.H.math.Point(
            pointer.viewportX - targetPosition.x,
            pointer.viewportY - targetPosition.y
          );
          behavior.disable();
        }
      },
      false
    );
    map.addEventListener(
      "dragend",
      (ev) => {
        var target = ev.target;
        if (target instanceof window.H.map.Marker) {
          behavior.enable();
        }
      },
      false
    );

    map.addEventListener(
      "drag",
      (ev) => {
        var target = ev.target,
          pointer = ev.currentPointer;
        if (target instanceof window.H.map.Marker) {
          target.setGeometry(
            map.screenToGeo(
              pointer.viewportX - target["offset"].x,
              pointer.viewportY - target["offset"].y
            )
          );
          var crd = map.screenToGeo(pointer.viewportX, pointer.viewportY);
          this.setState({ markerX: crd.lat, markerY: crd.lng },()=>{
            this.props.coordHandler(crd.lat,crd.lng)
          });
        }
        var bbox = this.map
          .getViewModel()
          .getLookAtData()
          .bounds.getBoundingBox();
        this.props.boundingBoxHandler(bbox);

        this.setState({ boundingBox: bbox });
      },
      false
    );
  };

  changeTransparency = (value) => {
    this.state.isolinePolygonArray.forEach((el) => {
      var style = { ...el.getStyle() };
      var color = el.getStyle().fillColor;
      // var strokeCol=el.getStyle().strokeColor
      var col = color.split(",");
      var colstr = "";
      col[col.length - 1] = "" + this.state.transparency / 100 + ")";
      colstr = col.join();
      style.fillColor = colstr;
      style.strokeColor = colstr;
      el.setStyle({ ...style });
    });
  };
  handleChange = (event, newValue) => {
    this.setState({ transparency: newValue }, () => {
      this.changeTransparency(newValue);
    });
  };
  getPois = (pois, url) => {
    axios
      .get(
        url +
          pois +
          "&limit=" +
          (this.props.noOfPoints ? this.props.noOfPoints : 50)
      )
      .then((Response) => {
        var posArr=[]
        Response.data.items.forEach((element) => {
          
          posArr.push(new window.H.geo.Point(element.position.lat, element.position.lng))
          let pos = [element.position.lat, element.position.lng];
          this.getisoline(pos, element.title);
        });
        this.setState({geoPointsArr:posArr})
      })
      .catch((e) => {
        console.log(e);
      });
  };
  onResult = (result) => {
    var locations = result.Response.View[0].Result.Place.Locations[0],
      position;
    position = {
      lat: locations[0].Location.DisplayPosition.Latitude,
      lng: locations[0].Location.DisplayPosition.Longitude,
    };
    this.setState({ lat: position.lat, lng: position.lng });
  };

  getisoline = (position, title) => {
    var router = this.platform.getRoutingService();
    var placeMarker = new window.H.map.Marker({
      lat: position[0],
      lng: position[1],
    });
    placeMarker.setData(title);
    placeMarker.addEventListener("tap", (evt) => {
      var bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
        content: evt.target.getData(),
      });
      this.ui.addBubble(bubble);
    });
    this.map.addObject(placeMarker);
    var modeParams =
      "" +
      this.props.modePreference +
      ";" +
      this.props.mode +
      ";traffic:" +
      this.props.modeState;
    var rp = this.state.routingParams;
    var start = "geo!" + position[0] + "," + position[1];
    var isolinePolygonDataArray = [...this.state.isolinePolygonData];
    isolinePolygonDataArray.push({ title, position });
    this.setState({ isolinePolygonData: isolinePolygonDataArray });
    this.state.configArray.forEach((el, index) => {
      router.calculateIsoline(
        {
          mode: modeParams,
          start: start,
          range: el.time * 60,
          rangetype: rp.rangetype,
        },
        (result) => {
          this.onResult1(result, el.color, index, position, title, el.time);
        },
        function (e) {
          console.log(e);
        }
      );
    });
  };
  onResult1 = (result, color, zIndex, position, title, timeBin) => {
    var col = color.split(",");
    var colstr = "";
    col[col.length - 1] = "" + this.state.transparency / 100 + ")";
    colstr = col.join();
    var customStyle = {
      strokeColor: colstr,
      fillColor: colstr,
      lineWidth: 1,
      lineCap: "square",
      lineJoin: "bevel",
    };
    var isolineCoords = result.response.isoline[0].component[0].shape,
      linestring = new window.H.geo.LineString(),
      isolinePolygon;
    //isolineCenter;
    // Add the returned isoline coordinates to a linestring:
    isolineCoords.forEach((coords) => {
      linestring.pushLatLngAlt.apply(linestring, coords.split(","));
    });
    isolinePolygon = new window.H.map.Polygon(linestring, {
      style: customStyle,
    });
    isolinePolygon.setData({ title, position, timeBin });

    isolinePolygon.setZIndex(zIndex);

    var isolinePolygonArrayCopy = [...this.state.isolinePolygonArray];
    isolinePolygonArrayCopy.push(isolinePolygon);
    this.setState({ isolinePolygonArray: isolinePolygonArrayCopy });
    this.map.addObject(isolinePolygon);
  };

  selectedOption = (value) => {
    var query = value.split("- ");
    this.setState({ query: query[1] });
  };
  refreshMap = () => {
    this.map.removeObjects(this.map.getObjects());
    this.setState({ isolinePolygonArray: [], isolinePolygonData: [],geoPointsArr:[]});
  };
  downloadMap = () => {
    var arr = [],pointsArr=[];
    
    this.state.isolinePolygonArray.forEach((el) => {
      arr.push(el.toGeoJSON());
    });
    this.state.geoPointsArr.forEach(el=>{
      
      
      var format={
        "type": "Feature",
        "properties": {

        },
        "geometry": {
          ...el.toGeoJSON()
        }}
        pointsArr.push(format)
    })
    var reqStr={
      "type": "FeatureCollection",
      "features": [...arr,...pointsArr]
    }
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reqStr));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data.geo.json");
  };
  
  prepareIsochroneFromFiles=(objArr,latArr,lngArr)=>{
    var lngMin = Math.min(...lngArr);
    var latMin = Math.min(...latArr);
    var latMax = Math.max(...latArr);
    var lngMax = Math.max(...lngArr);
    var setbox = new window.H.geo.Rect(latMax,lngMin,latMin,lngMax);
    this.map.getViewModel().setLookAtData({
      bounds: setbox
    });
    this.props.boundingBoxHandler(setbox);
    this.setState({ boundingBox: setbox});
    objArr.forEach((el) => {
      this.getisoline(el.position, el.title);
    });
  }
  calculateRGB = (n) => {
    var rgb = [];
    var R = parseInt(Math.min(255, 2 * 255 * n), 10);
    var G = parseInt(Math.min(255, 2 * 255 * (1 - n)), 10);
    var B = 0;
    rgb = [R, G, B];
    rgb.push(1); // corresponding to alpha
    return "rgba(" + rgb.join() + ")";
  };
  render() {
    const legend = this.state.configArray.map((el) => {
      return (
        <div className={classes.LegendItemContainer}>
          <div
            style={{ width: "20px", height: "20px", background: el.color }}
          ></div>
          <p>{el.time} mins</p>
        </div>
      );
    });
    return (
      <div className={classes.MapContainer}>
        <div
          className={classes.Heremap}
          id="here-map"
          style={{ width: "100%", height: "100%", background: "black" }}
        />
        <div className={classes.LegendContainer}>
          <h3 style={{ textAlign: "center" }}>Legend</h3>
          {legend}
        </div>
        <div className={classes.MapLeftControls}>
          <div className={classes.MapLeftControlsIn}>
            <div className={classes.RefreshButtonContainer}>
              <Button
                onClick={this.refreshMap}
                style={{ fontSize: "12px", backgroundColor: "#449DD1" }}
                variant="contained"
                color="primary"
                component="span"
              >
                Refresh Map
              </Button>
              <a
                className={classes.AnchorStyle}
                style={{ fontSize: "12px", backgroundColor: "#449DD1" }}
                onClick={() => this.downloadMap()}
                id="downloadAnchorElem"
              >
                Export Data
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HereMaps;
