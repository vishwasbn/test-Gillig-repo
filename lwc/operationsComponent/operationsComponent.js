import { LightningElement, track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getAuthentication from "@salesforce/apex/userAuthentication.getAccesstoken";
import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";
import pubsub from 'c/pubsub' ; 



export default class OperationsComponent extends LightningElement {

    @api busname;
    @api buschasisnumber;
    @api bseqence;
    @api selectedoperation;
    @api ecardid;
    @api permissionset;
    @api currentbusdepartment ; // Phase 1.1 : To get the Current Department of the Selected Bus

    @track authorisationdata;
    @track departmentlist = [];
    @track selecteddepartment;
    @track selecteddepartmentid;
    @track nextdepartment;
    @track previousdepartment;
    @track departmentlistoptions;
    @track departmentnameidMap;

    @track showSpinner;
    

    @track showoperations;

    // For popovers
    @track showbusoverview;
    @track adddescrepancymodal;
    

   /* get departmentid(){
        if(this.this.departmentnameidMap != undefined){
            var departmentselected = this.selecteddepartment ;
            var departmentid;
            for(var dept in this.departmentnameidMap){
                var thisdept = this.departmentnameidMap[dept];
                if(departmentselected == thisdept.label){
                    departmentid =  thisdept.value;
                }
            }
        }
        return departmentid;
     } */

    

    connectedCallback(){
        this.showSpinner = true;
        //this.register();
        console.log(this.bseqence);
        this.autentication(event);
        this.setdepartmentvalues(event);
        //
    }

    register(){
        console.log('event registered ');
        pubsub.register('applyfilters', this.applyfilters.bind(this));
    }

    applyfilters(messageFromEvt){
      //  debugger
       var valueforfilters = JSON.parse(messageFromEvt);
       this.selectedoperation = valueforfilters.view;
       this.selecteddepartmentid = '0';
       this.departmentchanged(event);
    }


    

    autentication(event){
        const authdata = undefined;//localStorage.getItem('authenticationdata');
      if(authdata == undefined || authdata == null){
        getAuthentication()
        .then(result => {
            var authdataresult = JSON.stringify(result);
            this.authorisationdata = authdataresult;
            localStorage.setItem('authenticationdata', authdataresult);
            //this.loaddata(authdataresult);

        })
        .catch(error => {
            alert('Authentication failed');
        });
        
      }
      else{
        var authdataresult = localStorage.getItem('authenticationdata');
        this.authorisationdata = authdataresult;
        //this.loaddata(authdataresult);
      }
    }

    setdepartmentvalues(event){
        var busdepartment = this.currentbusdepartment ; // Phase 1.1 : To trcak current department of the selected Bus
        let authorisationdata = this.authorisationdata;
        
        getDepartmentdata({authdata:authorisationdata})
        .then(result => {
            
            var departmentlistvalues = ['ALL DEPARTMENTS'];
            var departmentidnewmap = [{'bus_area_discrepancy_enabled':false,
                                        'label':'ALL DEPARTMENTS',
                                        'value': '0'}];
            for(var dept in result.departmentPickList){
                var deprtmentopt = result.departmentPickList[dept];
                if(deprtmentopt.value != 'None'){
                    departmentidnewmap.push(deprtmentopt);
                }
            }
            this.departmentnameidMap = departmentidnewmap;
            this.departmentlistoptions = departmentidnewmap;
            var opsecardid = JSON.parse(localStorage.getItem('opsecardid'));
            console.log('Ecard Details ::'+opsecardid);
            if(opsecardid!=null && opsecardid!=undefined){
                this.selecteddepartmentid=opsecardid.selecteddepartmentId.toString();
                var i=0;
                for(var dept in this.departmentnameidMap){
                    if(this.selecteddepartmentid==this.departmentnameidMap[dept].value){
                        this.selecteddepartment = this.departmentnameidMap[dept].label;        
                        this.nextdepartment = this.departmentnameidMap[i+1].value; 
                        break;
                    }
                    i++;
                }
                localStorage.removeItem('opsecardid');
            } /*else{
                this.selecteddepartment = this.departmentnameidMap[1].label;
                this.selecteddepartmentid = this.departmentnameidMap[1].value; // 1 for 1st department
                this.nextdepartment = this.departmentnameidMap[2].value; 
            }*/ // Phase 1.1 : End - To get the department id 
            else if(busdepartment != undefined && busdepartment!=null){ 
                this.selecteddepartment = busdepartment;
                
                var i=0;
                for(var dept in this.departmentnameidMap){
                    
                   if(this.selecteddepartment == this.departmentnameidMap[dept].label){
                        this.selecteddepartmentid = this.departmentnameidMap[dept].value ;
                        this.selecteddepartment = this.departmentnameidMap[dept].label;  
                        if ([i + 1] != this.departmentnameidMap.length) {
                            this.nextdepartment = this.departmentnameidMap[i + 1].value;
                        }
                        break;
                    } 
                     i++ ;
                }
            }else {
                this.selecteddepartment = this.departmentnameidMap[13].label;
                this.selecteddepartmentid = this.departmentnameidMap[13].value; 
            } 
              // Phase 1.1 : Start - To get the department id 
  

            for(var dept in result.objectdata){
                departmentlistvalues.push(result.objectdata[dept].department_name);
            }
            this.departmentlist = departmentlistvalues;
            /*
            this.departmentnameidMap = result.departmentPickList;
            for(var dept in result.objectdata){
                departmentlistvalues.push(result.objectdata[dept].department_name);
            }
            this.departmentlist = departmentlistvalues;
            this.departmentlistoptions = getoptions(this.departmentlist);
            this.selecteddepartment = this.departmentlistoptions[0].value;
            this.selecteddepartmentid = this.departmentnameidMap[1].value;
            this.nextdepartment = this.departmentlistoptions[1].value;
            //alert(this.selecteddepartmentid);
            function getoptions(dataList){
                var options = [];
                for (var data in dataList) {
                    var option = {
                        label: dataList[data],
                        value: dataList[data]
                    };
                    options.push(option);
                  }
                  return options;
            } */
            this.showSpinner = false;
            this.showoperations = true;
        })
        .catch(error => {
            this.showSpinner = true;
            const alertmessage = new ShowToastEvent({
                title : 'Department data fetch failed.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        });
   
    }

    

    get disableprev(){
        if(this.selecteddepartment == this.departmentlist[0] || this.selecteddepartment == 'ALL DEPARTMENTS'){
            return true;
        }
        else{
            return false;
        }
    }

    get disablenext(){
        var length = this.departmentlist.length;
        var lastdept = this.departmentlist[length-1];
        if(this.selecteddepartment == lastdept){
            return true;
        }
        else{
            return false;
        }
    }

    
    // To set the current selected department
    handleDepartmentchange(event){
        this.selecteddepartmentid = event.detail.value;
        this.departmentchanged(event);
    }

    //select next department
    gonextdept(event){
        //debugger
        var currentdepartment = this.selecteddepartment;
        var alldepartmentlist = this.departmentlist;
        var nextindex = alldepartmentlist.indexOf(currentdepartment);
        if(nextindex != -1){
            this.selecteddepartment = alldepartmentlist [nextindex+1];
        }
            for(var dept in this.departmentnameidMap){
                var thisdept = this.departmentnameidMap[dept];
                if(this.selecteddepartment == thisdept.label){
                    this.selecteddepartmentid =  thisdept.value;
                }
            }
        this.departmentchanged(event);
    }

    // select previous department
    gopreviousdept(event){
        //debugger
        var currentdepartment = this.selecteddepartment;
        var alldepartmentlist = this.departmentlist;
        var previndex = alldepartmentlist.indexOf(currentdepartment);
        if(previndex != -1){
            this.selecteddepartment = alldepartmentlist [previndex-1];
            
        }
        for(var dept in this.departmentnameidMap){
            var thisdept = this.departmentnameidMap[dept];
            if(this.selecteddepartment == thisdept.label){
                this.selecteddepartmentid =  thisdept.value ;
            }
        }
        this.departmentchanged(event);

    }

    get onlyalldepartment(){
        var optionvalues = [{label:'ALL DEPARTMENTS',value:'ALL DEPARTMENTS'}];
        return optionvalues;
    }

    get isdepartmentcommon(){
        return (this.selectedoperation == 'Serial No. Logs' || this.selectedoperation == 'ATP');
    }

    messageFromEvt = undefined;
    @api
    operationchanged(selectedoperation, messageFromEvt){
        this.messageFromEvt = messageFromEvt;
        this.selectedoperation = selectedoperation;
        if(this.messageFromEvt != undefined){
            this.selecteddepartmentid = '0';
        }
        this.departmentchanged(event);
    }

    departmentchanged(event){
        //this.getPermissionsfromserver();
        var departmentselected;
        var selecteddepartmentid = this.selecteddepartmentid;
            for(var dept in this.departmentnameidMap){
                var thisdept = this.departmentnameidMap[dept];
                if(selecteddepartmentid == thisdept.value){
                    departmentselected =  thisdept.label;
                }
            }
        this.selecteddepartment = departmentselected;
        this.template.querySelector('c-operation-actions-component').departmentchanged(selecteddepartmentid, this.selecteddepartment,this.selectedoperation, this.messageFromEvt);
        if(this.selectedoperation==='Operation Checks'){
            var filter=undefined;
            if(this.messageFromEvt!=undefined){
                var msg=JSON.parse(this.messageFromEvt);
                filter=msg.filterstatus;
             }
            let message = {
                "departmentid" : this.selecteddepartmentid,
                "departmentname" : this.selecteddepartment,
                "filterstatus" : filter
              };
            pubsub.fire('opckdeptchanged', JSON.stringify(message) );  
        }
    }


    // Show Bus Overview
    showbusDetails(event){
        this.showbusoverview = true;
    }

    // Hide Bus Overview
    hidebusDetails(event){
        this.showbusoverview = false;
    }

    // Show Add Discrepancy Modal
    showDescrepancyAdd(event){
        this.adddescrepancymodal = true;
    }

    // Hide Add Discrepancy Modal
    hideDescrepancyAdd(event){
        this.adddescrepancymodal = false;
    }
}