import React,{Component} from 'react';
import Axios from 'axios';
import PTHome from './PTHome';
// import PrivacyPolicy from '../PrivacyPolicy/PrivacyPolicy'
import HostName from '../../assets/globalvaribles/GlobalVariables';
// require('dotenv').config();
class StartSurvey extends Component{
    state={
        showSideDrawer:false,
        displayComponent:false,
        collegeName:'',
        collegeURL:'' ,
        surveyTypeID:''
    }
    componentWillMount(){
        Axios.defaults.xsrfCookieName = 'csrftoken'
        Axios.defaults.xsrfHeaderName = 'X-CSRFToken'
        Axios.get(HostName+"college/")
        .then(Response=>{
               const collegeArr= Response.data.filter(item=>{
                   
                return ((item.collegeURL===this.props.match.url.split('/')[2]));
           })
           if(collegeArr.length===1){
               this.setState({
                   displayComponent:true,
                   collegeName:collegeArr[0].collegeName,
                   collegeURL:collegeArr[0].collegeURL,
                   surveyTypeID:collegeArr[0].surveyTypeID})
           }
           else{
            //    multiple entries for the same URL, should not happen.
           }
        })
    }
    SideDrawerClosedHandler=()=>{
        this.setState({showSideDrawer:false})
    }
    SideDrawerToggleHandler=()=>{
        this.setState((prevState)=>{
            return{showSideDrawer:!prevState.showSideDrawer}
        })
    }
    onClickHandler=()=>{  
        Axios.defaults.xsrfCookieName = 'csrftoken'
        Axios.defaults.xsrfHeaderName = 'X-CSRFToken'
        Axios.post(HostName+"survey/",{surveyType:'pts'}).then(response=>{
            const surveyID=response.data.surveyID
            // console.log()
            if(this.props.match.url.split('/').length===2){
                // this.props.history.push({pathname:"/demo/hhs"+surveyID+"/family"})
                this.props.history.push({pathname:this.props.match.url+"/demopt/"+surveyID+"/pts-main"})
            }
            else{this.props.history.push({pathname:this.props.match.url+"/"+surveyID+"/pts-main"})}
        })
        .catch(e=>console.log("network not connected"))
            
    }
    
    render(){    
        let showElement;
        // console.log(this.props.match.url.split('/'))
        if(this.props.match.url.split('/')[1]==='pts'){
            showElement=<PTHome 
            collegeURL={'demopt'} 
            // collegeID={'1'} 
            // collegeName={this.state.collegeName}
            surveyTypeID={'2'}
            showSideDrawer={this.state.showSideDrawer} SideDrawerToggleHandler={this.SideDrawerToggleHandler} SideDrawerClosedHandler={this.SideDrawerClosedHandler}  submitClicked={this.onClickHandler}></PTHome>
        }
        else{
                showElement=null
        }
        const element=this.state.displayComponent ? <PTHome 
        collegeName={this.state.collegeName} 
        collegeURL={this.state.collegeURL} 
        surveyTypeID={this.state.surveyTypeID} 
        showSideDrawer={this.state.showSideDrawer} SideDrawerToggleHandler={this.SideDrawerToggleHandler} SideDrawerClosedHandler={this.SideDrawerClosedHandler}  submitClicked={this.onClickHandler}></PTHome>:showElement;
    return element
    }
}
export default StartSurvey;