import React, { Component } from 'react';
import classes from './TripAcessAndMode.css';
import TripAccess from './TripAcess/TripAccess';
// import TripModal from '../../../../../Hoc/TripModal/TripModal';
//import CommentModal from '../../../../../Hoc/CommentModal/CommentModal';

class TripAcessAndMode extends Component{
    state={
        access:[{idi:1,showAdd:true,value:'',modeType:"access",inValue:{travelTime:'',travelDistance:'',fare:''},isValid:false}],
        egress:[{idi:1,showAdd:true,value:'',modeType:"egress",inValue:{travelTime:'',travelDistance:'',fare:''},isValid:false}],
        mainMode:[{value:'',inValue:{travelTime:'',travelDistance:'',fare:''},isValid:false,modeType:"mainMode"}]
    }
    componentDidMount(){
        // this.adjustLine(
        //     document.querySelectorAll("."+classes.TripAccessIcon), 
        //     document.querySelectorAll("."+classes.TripAccessIcon),
        //     document.getElementById('line')
        //   );
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.sendData!==this.props.sendData){
            const arrId=[this.state.access,this.state.egress,this.state.mainMode];
            const modeArr=[];
            arrId.forEach((mode)=>{
                const accessCopy=[...mode];
                const newAccessArray=[];
                const accessObj=accessCopy.forEach((item)=>{
                let newAccessObjectIn={accessMode:item.value,...item.inValue,modeType:item.modeType,isValid:item.isValid};
                newAccessArray.push(newAccessObjectIn);
            })
                modeArr.push(newAccessArray);
            })
          const finalAccessObject={
             mode:[ ...modeArr[0],...modeArr[1],...modeArr[2]]
            //   access:modeArr[0],
            //   egress:modeArr[1],
            //   mainMode:modeArr[2]
          }  
          this.props.tripAccessDataHandler(finalAccessObject);
          return true
        }
    }
    accessDataHandler=(name,value,idi)=>{
        if(name==="Access Mode"){
            const accessCopy=[...this.state.access];
            const accessCopyElementOld={...accessCopy[idi-1]};
            accessCopyElementOld.value=value;
            accessCopy[idi-1]=accessCopyElementOld;
            this.setState({access:accessCopy})
        }
        else if(name==="Egress Mode"){
            const accessCopy=[...this.state.egress];
            const accessCopyElementOld={...accessCopy[idi-1]};
            accessCopyElementOld.value=value;
            accessCopy[idi-1]=accessCopyElementOld;
            this.setState({egress:accessCopy})
        }
        else if(name==="Main Mode"){
            const accessCopy=[...this.state.mainMode];
            const accessCopyElementOld={...accessCopy[0]};
            accessCopyElementOld.value=value;
            accessCopy[0]=accessCopyElementOld;
            this.setState({mainMode:accessCopy})
        }
    }      
    accessDataInHandler=(name,valueType,value,idi,valid)=>{
        if(name==="Access Mode"){
            const accessCopy=[...this.state.access];
            const accessCopyElementOld={...accessCopy[idi-1]};
            const accessInvalueCopy={...accessCopyElementOld.inValue};
            accessCopyElementOld.isValid=valid;
            if(valueType==="Travel Time"){
                accessInvalueCopy.travelTime=value;
            }
            else if(valueType==="Travel Distance"){
                accessInvalueCopy.travelDistance=value;
            }
            else if(valueType==="Fare"){
                accessInvalueCopy.fare=value;
            }
            // else if(valueType==="Cost"){
            //     accessInvalueCopy.cost=value;
            // }
            accessCopyElementOld.inValue=accessInvalueCopy;
            accessCopy[idi-1]=accessCopyElementOld;
            this.setState({access:accessCopy})
        }
        else if(name==="Egress Mode"){
            const accessCopy=[...this.state.egress];
            const accessCopyElementOld={...accessCopy[idi-1]};
            const accessInvalueCopy={...accessCopyElementOld.inValue};
            accessCopyElementOld.isValid=valid;
            if(valueType==="Travel Time"){
                accessInvalueCopy.travelTime=value;
            }
            else if(valueType==="Travel Distance"){
                accessInvalueCopy.travelDistance=value;
            }
            else if(valueType==="Fare"){
                accessInvalueCopy.fare=value;
            }
            // else if(valueType==="Cost"){
            //     accessInvalueCopy.cost=value;
            // }
            accessCopyElementOld.inValue=accessInvalueCopy;
            accessCopy[idi-1]=accessCopyElementOld;
            this.setState({egress:accessCopy})
        }
        else if(name==="Main Mode"){
            const accessCopy=[...this.state.mainMode];
            const accessCopyElementOld={...accessCopy[0]};
            const accessInvalueCopy={...accessCopyElementOld.inValue};
            accessCopyElementOld.isValid=valid;
            if(valueType==="Travel Time"){
                accessInvalueCopy.travelTime=value;
            }
            else if(valueType==="Travel Distance"){
                accessInvalueCopy.travelDistance=value;
            }
            else if(valueType==="Fare"){
                accessInvalueCopy.fare=value;
            }
            // else if(valueType==="Cost"){
            //     accessInvalueCopy.cost=value;
            // }
            accessCopyElementOld.inValue=accessInvalueCopy;
            accessCopy[0]=accessCopyElementOld;
            this.setState({mainMode:accessCopy})
        }
    }
    addHandler=(idi,name)=>{
        if(name==="Access Mode"){
            
            const accessElementNew={idi:idi+1,showAdd:true,modeType:'access'};
            const accessCopy=[...this.state.access];
            const accessCopyElementOld={...accessCopy[idi-1]};
            accessCopyElementOld.showAdd=false;
            accessCopy[idi-1]=accessCopyElementOld;
            accessCopy.push(accessElementNew);
            this.setState({access:accessCopy})
        }
        else if(name==="Egress Mode"){
            
             const accessElementNew={idi:idi+1,showAdd:true,modeType:'egress'};
             const accessCopy=[...this.state.egress];
             const accessCopyElementOld={...accessCopy[idi-1]};
             accessCopyElementOld.showAdd=false;
             accessCopy[idi-1]=accessCopyElementOld;
             accessCopy.push(accessElementNew);
             this.setState({egress:accessCopy})
        }

    }
    render(){
        const tripAccess=this.state.access.map((acc,index)=>{
            return <TripAccess accessDataIn={this.accessDataInHandler} accessData={this.accessDataHandler} key={acc.idi} add={this.addHandler} accessName={"Access Mode"}  idi={acc.idi} showAdd={acc.showAdd}>
            </TripAccess>
        })
        const tripEgress=this.state.egress.map((egr,index)=>{
            return <TripAccess accessDataIn={this.accessDataInHandler} accessData={this.accessDataHandler} key={egr.idi} add={this.addHandler} accessName={"Egress Mode"}  idi={egr.idi} showAdd={egr.showAdd}>
            </TripAccess>
        })
        return(
            <div className={classes.TripAcessAndMode}>  
                 {tripAccess}
                <TripAccess mainMode={true} accessName={"Main Mode"} accessDataIn={this.accessDataInHandler} accessData={this.accessDataHandler}></TripAccess>
                {tripEgress}
            </div>
        )
    }
}

export default TripAcessAndMode;