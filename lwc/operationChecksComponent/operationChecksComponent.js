import { LightningElement , api, track} from 'lwc';
import getdepartmentopcheckDetails from "@salesforce/apex/ecardOperationsController.getdepartmentopcheckDetails";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pubsub from 'c/pubsub' ; 
import updateopchecks from "@salesforce/apex/ecardOperationsController.updateopchecks";

export default class OpertaionChecksComponent extends LightningElement {
    @api busname;
    @api buschasisnumber;
    @api operation;
    @api ecardid;
    @api departmentIdMap;
    @api permissionset;
    @api isverified;
    @api departmentoptions;
    
    @track departmentId;
    @track departmentName;
    @track showSpinner=false;
    @track opckdetails=[];
    @track alldepts=false;
    @track filterlocal;
    @track check=true;
    @track firsttime=true;
    @track handlefirst=true;
    @track source=undefined;
    @track selecteddepartmentIdlocal;
    @track departmentlocal;
    @track filterlabellocal=undefined;
        
    @api
    get filter(){
        return this.filterlocal;
    }
    set  filter(value){
      this.filterlocal = value;
      if(this.filterlocal!=undefined){
        this.filterlabellocal=this.filter=='approve'?'APPROVED ITEMS':'OPEN ITEMS';
        this.getopcheckdeatils();
      }
    }
    get isopckpresent(){
        //return this.opckdetails.length!=0;
        return true;
    }
    @api
    get selecteddepartmentId(){
      return this.selecteddepartmentIdlocal;
    }
    set  selecteddepartmentId(value){
      this.selecteddepartmentIdlocal = value;
      this.getopcheckdeatils();
    }
    @api
    get department(){
      return this.departmentlocal;
    }
    set  department(value){
      this.departmentlocal = value;
    }

    //To check if user have new discrepancy add access or prod user
    get addrepetitionbtn() {
      return this.permissionset.dept_discrepancy_new.write;
    }

    get filterapplied(){
      return this.filterlocal!=undefined;
    }
    // When clearing the Bus Overview filter making filter as undefined.
    clearfilter(event){
          this.filterlocal = undefined;
          this.filterlabellocal=undefined;
          pubsub.fire('applyfilters', undefined );
          this.getopcheckdeatils();
    }
    
    /*async handleloadopcheck(messageFromEvt){
      var valueforfilters = JSON.parse(messageFromEvt);
      this.filterlocal=valueforfilters.filterstatus;
      this.departmentId=valueforfilters.departmentid;
      await this.getopcheckdeatils();
      if(this.filter!=undefined){
        var status=this.filter=='approve'?true:false;
        this.opckdetails=this.filterrecords(status,this.tmpopckdetails);
      }else{
        this.opckdetails=this.tmpopckdetails;
      } 
    }*/
    //opckdetails=[]; //
    /*connectedCallback(){
        console.log('Inside Operation Checks');
        if(this.check){
          this.register();
          this.check=false;
        }  
        if(this.firsttime){
          let message = {
            "departmentid" : this.departmentId,
            "filterstatus" : this.filter
          };
          this.source='connected';
          //this.handleloadopcheck(JSON.stringify(message));
          this.firsttime=false;
        }
        if(this.filter!=undefined){
          var status=this.filter=='approve'?true:false;
          this.opckdetails=this.filterrecords(status,this.tmpopckdetails);
        }else{
          this.opckdetails=this.tmpopckdetails;
        } 
    }*/    
  updateopckitem(event){
    this.selectedopcheckid = event.target.title;
    for(var i in this.opckdetails){
      for(var j in this.opckdetails[i].op_check)
        if(this.opckdetails[i].op_check[j].operation_check_id==this.selectedopcheckid){
            this.selectedopchek=this.opckdetails[i].op_check[j];
            this.selectedopchek.op_check_value=event.target.value;
        }
    }
    this.uploadopchecktoserver(this.selectedopchek);  
  }  
  @track tmpopckdetails=[];
  async getopcheckdeatils(){	
    // to get Operations Check details from server	
    console.log('Inside getopcheckdeatils method');
    this.showSpinner = true;
    var departentid= this.selecteddepartmentId;
    this.alldepts=false;
    if(departentid==0)	{
      departentid=null;
      this.alldepts=true;
    }
    var ecarddepartmentid = {	
        ecard_id :  this.ecardid,	
        department_id : departentid
    };	

    await getdepartmentopcheckDetails({ecarddepartmentid:JSON.stringify(ecarddepartmentid)})	
            .then(data => {	
                if(data.isError){	
                    const alertmessage = new ShowToastEvent({	
                        title : 'Sorry we could not fetch Operations Check details.',	
                        message : 'Something unexpected occured. Please contact your Administrator',	
                        variant : 'error'	
                    });	
                    this.dispatchEvent(alertmessage);	
                }	
                else{	
                  var deptopchks=JSON.parse(data.responsebody).data;

                  if(departentid==null){
                    this.tmpopckdetails = deptopchks.departments;	
                  }
                  else{
                    var modifiedopcklist=[];
                    var opchecks=deptopchks.op_check;
                    var modifiedopckdetails = {
                      department_id : departentid,
                      department_name : this.department,
                      op_check : opchecks
                    }
                    modifiedopcklist.push(modifiedopckdetails);
                    this.tmpopckdetails=modifiedopcklist;
                  }                 
                  if(this.filter!=undefined){
                    var status=this.filter=='approve'?true:false;
                    this.opckdetails=this.filterrecords(status,this.tmpopckdetails);
                  }else{
                    this.opckdetails=this.tmpopckdetails;
                  } 
                  this.showSpinner = false;	
                }	
                  
            }).catch(error => {	
            this.error = error;	
            const alertmessage = new ShowToastEvent({	
                title : 'Sorry we could not fetch Operations Check details.',	
                message : 'Something unexpected occured. Please contact your Administrator',	
                variant : 'error'	
            });	
            this.dispatchEvent(alertmessage);	
              
            });	
    }
    
    /*register(){
      console.log('Dept Change event registered ');
      pubsub.register('opckdeptchanged', this.handleloadopcheck.bind(this));
    }*/

    @track selectedopchek=[];
    @track selectedopcheckid;
    existingrowstatuschange(event){
        this.selectedopcheckid = event.detail.uniqueid;
        for(var i in this.opckdetails){
          for(var j in this.opckdetails[i].op_check)
            if(this.opckdetails[i].op_check[j].operation_check_id==this.selectedopcheckid){
                this.selectedopchek=this.opckdetails[i].op_check[j];
                this.selectedopchek.op_check_status=event.detail.status;
            }
        }
        if(this.selectedopchek.value_required && 
           (this.selectedopchek.op_check_value==null || this.selectedopchek.op_check_value=="") &&
           this.selectedopchek.op_check_status){
            const alertmessage = new ShowToastEvent({
            title : 'Value Required.',
            message : 'Value required to update status, Please enter a value',
            variant : 'warning'
            });
            this.dispatchEvent(alertmessage);
            this.getopcheckdeatils(this.ecardid,this.departmentId,this.filterlocal);
    
        }else{
            this.uploadopchecktoserver(this.selectedopchek);
        }
    }

    uploadopchecktoserver(opck){
        var opcheckrecord = {
			"ecard_id":this.ecardid,
			"buildstation_id": opck.buildstation_id,
			"operation_check_id": opck.operation_check_id,
			"op_check_value": opck.op_check_value,
      "op_check_status": opck.op_check_status
        };
        //alert(JSON.stringify(opcheckrecord));
        this.showSpinner = true;
        updateopchecks({requestbody:JSON.stringify(opcheckrecord)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                      const alertmessage = new ShowToastEvent({
                          title : 'Upload Succcessfull',
                          message : 'Operation Check uploaded successfully.',
                         variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.refreshtheoperationlist();
                    this.showpicvalmodal = false; 
                  }
                    
              }).catch(error => {
              this.error = error;/*
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;*/
              });
    }
    filterrecords(opckstatus,opcklist){
      var moddeptopcklist=[];
      for(var i in opcklist){
        var modopcklist=[];
        for(var j in opcklist[i].op_check){
          var opck=opcklist[i].op_check[j];
          if(opck.op_check_status==opckstatus){
            modopcklist.push(opck);
          }
        }
        if(modopcklist.length!=0){
            var modifiedopckdetails = {
            department_code : opcklist[i].department_code,  
            department_id :   opcklist[i].department_id,  
            department_name : opcklist[i].department_name,
            op_check : modopcklist
          }
          moddeptopcklist.push(modifiedopckdetails);
        }
      }
      return moddeptopcklist;
    }
}