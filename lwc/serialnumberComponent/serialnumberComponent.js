import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";


import getbuildstationPartSeriallogs from "@salesforce/apex/ecardOperationsController.getbuildstationPartSeriallogs";
import updateSerialNolog from "@salesforce/apex/ecardOperationsController.updateSerialNolog";

export default class SerialnumberComponent extends LightningElement {
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    @api department;
    @api selecteddepartmentId;
    @api busname;
    @api buschasisnumber;
    @api operation;
    @api ecardid;
    @api departmentIdMap;

    @api
    get filter(){
        return this.filterlocal;
    }
    set  filter(value){
        this.filterlocal = value;
        if(this.filterlocal != undefined){
            this.filterapplied = true;
        }
        else{
            this.filterapplied = false;
        }
        if(this.filterlocal == 'notfilled' || this.filterlocal == 'filled'){
            if(this.filterlocal == 'notfilled'){
                this.filterlabelfordisplay = `Not-Filled Items`;
            }else{
                this.filterlabelfordisplay = `${this.filterlocal} Items`;
            }
        }
        else{
            this.filterlabelfordisplay = undefined;
            this.filterlocal = undefined;
            this.filterapplied = false;
        }
        
    }
    
    @track filterlocal;
    @track filterapplied = false;
    @track filterlabelfordisplay;

    @track currentuserid = 2;

    @track  currentuserlist;
    @track departmentId;
    @track departmentName;
    @track showSpinner;

    // For Serial No log view view 
    @track selectedserialview = 'Drive%20Train';


    @track modifiedserialnologdata = [];
    @track serialnologdetail = false;
    @track selectedserialnolog;

    // Use whenever a false attribute is required in Component.html
    get returnfalse(){
        return false;
  }

  // Use whenever a true attribute is required in Component.html
  get returntrue(){
      return true;
  }

    // For Showing no data message when Serial Log List is Empty.   
    get serialloglistempty(){
        return this.modifiedserialnologdata.length == 0;
    }

    get isselecteddrive(){
        return this.selectedserialview == 'Drive%20Train';
    }
    get isselectedcamera(){
        return this.selectedserialview == 'Camera';
    }
    get isselectedtyre(){
        return this.selectedserialview == 'Tire';
    }
    get isselectedgeneral(){
        return this.selectedserialview == 'Other';
    }

    connectedCallback(){
        this.loadSerialNologdata();
    }

    // To modify the userlist from API to shown in userlistIconComponent.(Will need to incorporate picture link.)
    // List structure needs to contain [first_name, employee_id, appuser_name]
    // List returned will be of contain [name, userid, piclink, username, intials]
    getmodifiediserlist(userlist){
        var newuserlist = [];
        if(userlist!=undefined && userlist.length != 0){
            for(var count in userlist){
                var user = userlist[count];
                if(user != undefined){
                    var name = `${user.first_name}`; //${user.last_name}
                    var initials = name.match(/\b\w/g) || [];
                    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                     var newuser = {
                        name : `${name} (${user.employee_id})`,
                        Name : `${name} (${user.employee_id})`,
                        Id : user.employee_id,
                        userid : user.employee_id,
                        piclink:'',
                        username:user.appuser_name,
                        intials:initials
                    };
                    newuserlist.push(newuser); 
            }
            }
        }
        return newuserlist;
    }

    clearfilter(event){
        this.filterlocal = undefined;
        this.filterapplied = false;
        this.filterlabelfordisplay = undefined;
        this.loadSerialNologdata();
    }

    tabClick(event) {
        this.selectedserialview = event.currentTarget.dataset.id;
        const allTabs = this.template.querySelectorAll('.slds-tabs_default__item');
        allTabs.forEach((elm, idx) => {
            elm.classList.remove("slds-is-active");
            elm.classList.remove("activetab");
        });
        event.currentTarget.classList.add('slds-is-active');
        event.currentTarget.classList.add('activetab');
        var element = event.currentTarget.firstChild.id;
    
        var selectedelementarea = element.substr(0, element.indexOf('_'));;
    
        const tabview = this.template.querySelectorAll('.slds-tabs_default__content');
        tabview.forEach((elm, idx) => {
            elm.classList.remove("slds-show");
            elm.classList.add("slds-hide");
        });
        this.template.querySelector(`.${selectedelementarea}`).classList.remove("slds-hide");
        this.template.querySelector(`.${selectedelementarea}`).classList.add("slds-show");
        this.loadSerialNologdata();
     }

    // Load Serial No log tab data and formatting based on the Ecard and Department selected from API.
    loadSerialNologdata(event){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        var deptmentId = this.departmentId;
        var selectedserialview = this.selectedserialview;
        var ecardidselectedserialview = {ecard_id:ecardid ,serial_number_type:selectedserialview};
        //alert(JSON.stringify(ecardidselectedserialview));
        getbuildstationPartSeriallogs({ecardserialtype:JSON.stringify(ecardidselectedserialview)})
              .then(data => {
                  this.showSpinner = true;
                  debugger
                  //alert(data.isError);
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation.',
                          message : 'Something unexpected occured. Please contact your Administrator'+data.operationlogresponse,
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                  }
                  else{
                    var seriallogdata = JSON.parse(data.responsebody).data;
                    var users = this.getmodifiediserlist(seriallogdata.users);
                    var moddedlogdatalist = [];
                    for(var log in seriallogdata.build_station_part_mapping){
                        var bspart = seriallogdata.build_station_part_mapping[log];
                        var attachmentcount = 0;
                        var hasattachments = false;
                        if(bspart.attachments_id != undefined){
                            attachmentcount = bspart.attachments_id.length;
                            if(attachmentcount > 0){
                                hasattachments = true;
                            }
                        }
                        var filterstatus = 'notfilled';
                        if(bspart.serial_no != null){
                            filterstatus = 'filled';
                        }
                        var moddedlogdata = {
                            filterstatus : filterstatus,
                            attachments_id : bspart.attachments_id,
                            attachmentcount : attachmentcount,
                            hasattachments : hasattachments,
                            brand : bspart.brand,
                            bus_area : bspart.bus_area,
                            buspart_name : bspart.buspart_name,
                            buspart_no : bspart.buspart_no,
                            manufacture : bspart.manufacture,
                            model_no : bspart.model_no,
                            serial_no : bspart.serial_no,
                            tyre_size_ply : bspart.tyre_size_ply,
                            tyre_psi : bspart.tyre_psi,
                            updated_date : bspart.updated_date,
                            ecard_id : seriallogdata.ecard_id,
                            buildstation_id : bspart.buildstation_id,
                            buildstation_part_mapping_id : bspart.buildstation_part_mapping_id,
                            buspart_id : bspart.buspart_id,
                            remarks : bspart.remarks,
                            serial_number_log_id : bspart.serial_number_log_id,
                            dat_serial_number_type : this.selectedserialview,
                            quantity : bspart.quantity,
                            updatedby_id : this.getmodifiediserlist([bspart.updatedby_id]),
                            users : users,
                            modified_date : bspart.modified_date
                        };
                        if(this.filterlocal != undefined){
                            if(this.filterlocal == moddedlogdata.filterstatus){
                                moddedlogdatalist.push(moddedlogdata);
                            }
                        }
                        else{
                            moddedlogdatalist.push(moddedlogdata);
                        }
                        //moddedlogdatalist.push(moddedlogdata);
                    }
                    this.modifiedserialnologdata = moddedlogdatalist;
                    this.showSpinner = false;
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
     
              });
        
        
     }


     showserialnologdetail(event){
        var buildstation_part_mapping_id = event.currentTarget.dataset.id;
        this.selectedserialnolog = this.getselectedserialnumberlog(buildstation_part_mapping_id);
        this.serialnologdetail = true;
     }

     cancelserialnodetail(event){
         this.serialnologdetail = false;
     }

     async updateuserselection(event){
        var detail = event.detail;
        
        //if(detail.type == 'QC'){
            this.selectedserialnolog.updatedby_id = detail.userlist;
        //}
        await this.updateserialnumberlogtoserver();
     }

     getselectedserialnumberlog(buildstation_part_mapping_id){
         var selectedserialnolog;
         for(var i in this.modifiedserialnologdata){
            if(this.modifiedserialnologdata[i].buildstation_part_mapping_id == buildstation_part_mapping_id){
                selectedserialnolog =  this.modifiedserialnologdata[i];
            }
         }
         return selectedserialnolog;
     }

     async updateserialnumberlog(event){
         var buildstation_part_mapping_id = event.target.title;
         this.selectedserialnolog = this.getselectedserialnumberlog(buildstation_part_mapping_id);
         var valuetoupdate = event.target.name;
         //this.selectedserialnolog[valuetoupdate] = event.target.value;
         this.selectedserialnolog[valuetoupdate] = event.target.value == '' ? null : event.target.value;
         await this.updateserialnumberlogtoserver();
           
     }
     async updateserialnumberlogtoserver(event){ 
        var serialnumbertoupdate = this.selectedserialnolog;
        //if(serialnumbertoupdate.updatedby_id.length != 0 ){
            var requestbody = {
                "ecard_id" : serialnumbertoupdate.ecard_id,
                "buspart_id" : serialnumbertoupdate.buspart_id,
                "serial_no" : serialnumbertoupdate.serial_no,
                "model_no" : serialnumbertoupdate.model_no,
                "dat_serial_number_type" : serialnumbertoupdate.dat_serial_number_type,
                "tyre_size_ply" : serialnumbertoupdate.tyre_size_ply,
                "tyre_psi" : serialnumbertoupdate.tyre_psi,
                "manufacture" : serialnumbertoupdate.manufacture,
                "brand" : serialnumbertoupdate.brand,
                "bus_area" : serialnumbertoupdate.bus_area,
                "remarks" : serialnumbertoupdate.remarks,
                "modified_date" : serialnumbertoupdate.modified_date
             };
            this.showSpinner = true;
            //alert(JSON.stringify(requestbody));
            await updateSerialNolog({requestbody:JSON.stringify(requestbody)})
            .then(data => {
                if(data.isError){
                    if (data.errorMessage == 202) {
                        const alertmessage = new ShowToastEvent({
                            //title: "Sorry we could not complete the operation.",
                            title: "Duplicated Serial Number.",
                            message: "Couldn’t update data, "+JSON.parse(data.responsebody).data.validation_message,
                            variant: "error"
                        });
                        this.dispatchEvent(alertmessage);
                        this.loadSerialNologdata();
                    } else {
                        const alertmessage = new ShowToastEvent({
                            title: "Sorry we could not complete the operation.",
                            message: 'Please contact the System Administrator.',
                            variant: "error"
                        });
                        this.dispatchEvent(alertmessage);
                        this.loadSerialNologdata();
                    }
            }
            else{
                const alertmessage = new ShowToastEvent({
                    title : 'Record update Successfull',
                    message : 'Record updated suceessfully.',
                    variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                this.showSpinner = false;
                this.loadSerialNologdata();
        
             }
        
            }).catch(error => {
            this.error = error;
            const alertmessage = new ShowToastEvent({
                title : 'Sorry we could not complete the operation.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            this.showSpinner = false;
            });
     /*   }
        else{
            const alertmessage = new ShowToastEvent({
                title : 'A user is required.',
                message : 'Please select a user (QC or PROD to complete the update)',
               variant : 'warning'
          });
          this.dispatchEvent(alertmessage);
          
        }*/
        
        
     }

}