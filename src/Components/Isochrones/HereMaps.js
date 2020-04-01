import React, { Component } from 'react';
import classes from './HereMaps.css'
import axios from 'axios'
class  HereMaps extends Component {
    constructor(props) {
        super(props);
        this.colorsArray=['rgb(255,0,0)','rgb(255,255,0)','rgb(0,255,0)'],
        //this.configArray=[{time:30,color:'rgba(255,0,0,.4)'},{time:15,color:'rgba(255,255,0,0.5)'},{time:5,color:'rgba(0,255,0,0.6)'}]
        this.platform = null;
        this.map = null;
        // this.imp={
        //   useCIT:true,
        //   app_id: props.app_id,
        //   app_code:props.app_code,
        //   useHTTPS:true,
        //   zoom: props.zoom,
        //   theme:props.theme,
        //   style: props.style,
        // }
        this.state = {
            configArray:[{time:30,color:'rgba(255,0,0,1)'},{time:15,color:'rgba(255,255,0,1)'},{time:5,color:'rgba(0,255,0,1)'}],
            nextUrl:'', 
            app_id: props.app_id,
            app_code: props.app_code,
            center: {
                lat: props.lat,
                lng: props.lng,
            },
            routingParams:{
              mode: 'fastest;car;traffic:enabled',
              // start: 'geo!28.7,77.1',
              rangetype: 'time'
            },
            mode:'',
            // citySelect:{
            //   searchText:'New Delhi'
            // },
            placeMarker:null,
            markerX:props.lat,
            markerY:props.lng,
            zoom: props.zoom,
            theme:props.theme,
            style: props.style,
            isolinePolygonArray:[]
        }
        //this.addMarkersToMap=this.addMarkersToMap.bind(this)
    }

    componentDidMount() {
        this.platform = new window.H.service.Platform(this.state);

        var layer = this.platform.createDefaultLayers();
        var container = document.getElementById('here-map');
        // console.log(layer)
        this.map = new window.H.Map(container, layer.satellite.traffic, {
            center: this.state.center,
            zoom: this.state.zoom,
          })
        
        
        var events = new window.H.mapevents.MapEvents(this.map);
        // eslint-disable-next-line
        this.behavior = new window.H.mapevents.Behavior(events);
        // eslint-disable-next-line
        this.ui = new window.H.ui.UI.createDefault(this.map, layer)
        this.addMarkersToMap(this.map,this.behavior);
        // this.req();  
      // console.log(bboxCont.getTopLeft())
      // var bbox=''+bboxCont.getTopLeft().lat+','+bboxCont.getTopLeft().lng+','+bboxCont.getBottomRight().lat+','+bboxCont.getBottomRight().lng+''
      // console.log(bbox) 
        // var placeMarker=new window.H.map.Marker(...bboxCont.getBottomRight)
        // placeMarker.draggable=true;
        // this.map.addObject(placeMarker);
    }

    componentWillReceiveProps(nextProps){
      if(this.props.lat!==nextProps.lat){
        var centerCopy={lat:nextProps.lat,lng:nextProps.lng}
        this.map.setCenter( centerCopy,true)
        this.map.setZoom(this.state.zoom,true)
        //this.map.removeObject(this.state.placeMarker)  
        this.setState({center:centerCopy},()=>{
          this.addMarkersToMap(this.map,this.behavior)
        })
      }
      if(this.props.timeBins!==nextProps.timeBins){
          var configArrayCopy=[];
          if(nextProps.timeBins.search(",")!==-1&&nextProps.timeBins.length>=3){
            var timeBinsStringArray=nextProps.timeBins.split(',');
              console.log(timeBinsStringArray);
              timeBinsStringArray.forEach((el,index)=>{
                  configArrayCopy.push({time:parseInt(el),color:this.colorsArray[index]});    
                })
            configArrayCopy.reverse();
            this.setState({configArray:configArrayCopy})
        }
      }
      if(this.props.pois!==nextProps.pois){
        console.log(this.map.getObjects())
        this.map.removeObjects(this.map.getObjects())
        // var url='https://places.sit.ls.hereapi.com/places/v1/discover/explore?app_id='+this.props.app_id+'&app_code='+this.props.app_code+'&in='+this.state.center.lat+','+this.state.center.lng+';r=150000&cat='
        var url='https://places.sit.ls.hereapi.com/places/v1/discover/explore?app_id='+this.props.app_id+'&app_code='+this.props.app_code+'&cat='
        this.getPois(nextProps.pois,url)
      }
      if(this.props.updatedFetchCount!==nextProps.updatedFetchCount){
        this.getPois('',this.state.nextUrl)
      }
      // if(this.props.mode!==nextProps.mode){
      //   this.setState({mode:nextProps.mode})
      // }
    }
    changeCoordinate=(event,map)=>{
        // var x= event.nativeEvent.offsetX;
        // var y= event.nativeEvent.offsetY
       // var coord=map.screenToGeo(x,y)
        // console.log(coord);        
    }
    changeTheme(theme, style) {
        var tiles = this.platform.getMapTileService({'type': 'base'});
        var layer = tiles.createTileLayer(
            'maptile',
            theme,
            256,
            'png',
            {'style': style}
        );
        this.map.setBaseLayer(layer);
    }
    addMarkersToMap(map,behavior){
        var placeMarker=new window.H.map.Marker({lat:this.state.center.lat, lng:this.state.center.lng})
        placeMarker.draggable=true;
        map.addObject(placeMarker);
        this.setState({placeMarker:placeMarker})
        this.dragEventHandler(map,behavior);
    }

    dragEventHandler=(map,behavior)=>{
      map.addEventListener('dragstart', (ev)=> {
        var target = ev.target;
        if (target instanceof window.H.map.Marker) {
          behavior.disable();
        }
      }, false);
    
    
      // re-enable the default draggability of the underlying map
      // when dragging has completed
      map.addEventListener('dragend',(ev)=> {
        var target = ev.target;
        // this.getisoline()
        
        if (target instanceof window.mapsjs.map.Marker) {
          behavior.enable();
        }
      }, false);
    
      // Listen to the drag event and move the position of the marker
      // as necessary
       map.addEventListener('drag',(ev)=> {
        var target = ev.target,
            pointer = ev.currentPointer;
        if (target instanceof window.mapsjs.map.Marker) {
          target.setPosition(map.screenToGeo(pointer.viewportX, pointer.viewportY));
          var crd=map.screenToGeo(pointer.viewportX, pointer.viewportY)
          this.setState({markerX:crd.lat,markerY:crd.lng})  
          // var routingParamsCopy={...this.state.routingParams}
          // routingParamsCopy.start="geo!"+String(crd.lat)+","+String(crd.lng)
          // this.setState({routingParams:routingParamsCopy})
          //console.log(routingParamsCopy.start)
        }
      }, false);
    }

    getPois=(pois,url)=>{
      // console.log("run")
      var bboxCont=this.map.getViewBounds()
      var bbox=''+bboxCont.getTopLeft().lng+','+bboxCont.getBottomRight().lat+','+bboxCont.getBottomRight().lng+','+bboxCont.getTopLeft().lat+''
      //axios.get('https://places.sit.ls.hereapi.com/places/v1/discover/explore?app_id='+this.props.app_id+'&app_code='+this.props.app_code+'&in='+bbox+'&cat='+pois)
      
      axios.get(url+pois,{headers:{'X-Map-Viewport':bbox}})
      .then(Response=>{
        if(Response.data.next||Response.data.results.next){
          console.log("run1")
          if(Response.data.results){
            this.setState({nextUrl:Response.data.results.next})  
            Response.data.results.items.forEach(element => {
              this.getisoline(element.position,element.title)
            })
          }
          else if(Response.data.next||Response.data.previous){
            
            this.setState({nextUrl:Response.data.next})  
            Response.data.items.forEach(element => {
              this.getisoline(element.position,element.title)
            })
          }
          //this.setState({nextUrl:Response.data.results.next})
            
        }
        else{
          console.log("run2")
          alert("no more results")
          Response.data.results.items.forEach(element => {
            this.getisoline(element.position,element.title)
          }) 
        }
        
        ;
      })
      .catch(e=>{
        console.log(e)
      })}
    onResult = (result)=> {
      var locations = result.Response.View[0].Result.Place.Locations[0],
          position
        position = {
          lat: locations[0].Location.DisplayPosition.Latitude,
          lng: locations[0].Location.DisplayPosition.Longitude
        };
        this.setState({lat:position.lat,lng:position.lng})
    };
     
      onResult1 = (result,color,zIndex)=> {
        
        //var sys='rgba('+Math.floor(255*Math.random())+','+Math.floor(255*Math.random()) + ',' +Math.floor(255*Math.random()) +',0.4)'
        var customStyle = {
          // strokeColor: 'red',
          fillColor: color,
          // fillColor:'red',
          lineWidth: 1,
          lineCap: 'square',
          lineJoin: 'bevel',
        };
        // var center = new window.H.geo.Point(
        //     result.response.center.latitude,
        //     result.response.center.longitude)
          var isolineCoords = result.response.isoline[0].component[0].shape,
          linestring = new window.H.geo.LineString(),
          isolinePolygon
          //isolineCenter;
        
        
        
        
        // Add the returned isoline coordinates to a linestring:
        isolineCoords.forEach((coords)=> {
        linestring.pushLatLngAlt.apply(linestring, coords.split(','));
      });

        isolinePolygon = new window.H.map.Polygon(linestring,{style:customStyle});
        isolinePolygon.setZIndex(zIndex)
        this.map.addObject(isolinePolygon)
      };
       getisoline=(position,title)=>{
         var router=this.platform.getRoutingService()
        var placeMarker=new window.H.map.Marker({lat:position[0],lng:position[1]})
        placeMarker.setData(title)
        placeMarker.addEventListener('tap',(evt)=>{
          var bubble=new window.H.ui.InfoBubble(evt.target.getGeometry(),{
            content:evt.target.getData()
          })
          this.ui.addBubble(bubble)
        })
        this.map.addObject(placeMarker);
        var modeParams=''+this.props.modePreference+';'+this.props.mode+';traffic:'+this.props.modeState
        var rp=this.state.routingParams
        var start='geo!'+position[0]+','+position[1]
         this.state.configArray.forEach((el,index)=>{
          router.calculateIsoline({mode:modeParams,start:start,range:(el.time*60),rangetype:rp.rangetype},(result)=> {
            this.onResult1(result,el.color,index)},function(e){console.log(e)})
         })
        }
    render() {
        const legend=this.state.configArray.map(el=>{
            return(
                <div className={classes.LegendItemContainer}>
                    <div style={{width:'20px',height:'20px',background:el.color}}></div>
                    <p>{el.time} mins</p>
                </div>
            )
        })
        return (
            <div className={classes.MapContainer}>
            <div id="here-map" onClick={(event)=>this.changeCoordinate(event,this.map)} style={{width: '100%', height: '100%', background: 'black'}} />
                <div className={classes.LegendContainer}>
                    <h3 style={{textAlign:'center'}}>Legend</h3>
                    {legend}
                </div> 
            {/* <input type="text" value={this.props.value} onChange={()=>{
                let text=this.props.inputChange;
                ()=>this.req();                
                }}></input> */}
            </div>
        );
    }
}
export default HereMaps;