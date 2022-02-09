import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import noDatadessert from "@salesforce/resourceUrl/nodatadessert";

import getDepartmentDiscrepancies from "@salesforce/apex/ecardOperationsController.getDepartmentDiscrepancies";
import deleteDiscOrShortage from "@salesforce/apex/ecardOperationsController.deleteDiscOrShortage";
import getAllComments from "@salesforce/apex/DiscrepancyDatabaseController.getAllComments";
import addnewComment from "@salesforce/apex/DiscrepancyDatabaseController.addnewComment";
import updateDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.updateDiscrepancy";
import getdiscrepancyimage from "@salesforce/apex/DiscrepancyDatabaseController.getdiscrepancyimage";
import getDiscrepancylist from "@salesforce/apex/ecardOperationsController.getDiscrepancylist";
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
import {modifieduserlist, getmoddeddate, getselectedformandetails, preassignforeman, preassignqc, setstatusfordisplay}  from 'c/userPermissionsComponent';

export default class OpreationActionPaintComponent extends LightningElement {
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    imageparams = {"x":50, "y" : 50};

    
    @api department;
    //@api selecteddepartmentId;
    @api busname;
    @api buschasisnumber;
    @api operation;
    @api ecardid;
    @api departmentIdMap;
    @api permissionset;

    @api
    get selecteddepartmentId() {
        return this.departmentid;
    }
    set selecteddepartmentId(value){
        this.departmentid = value;
        this.loadDiscrepancydata();
    }
    @track isdelenabled;  
    get isdeletable(){
        return this.isdelenabled;
    }
    @track departmentid;
    @track currentuserid = 2;
    @track showSpinner = false;
    @track  currentuserlist;
    @track adddescrepancymodal;
    @track discdetailsmodal = false;;
    @track selecteddiscrepancy;
    @track filteredbuildstation = 'All BuildStations';
    @track modifieddiscrepancyList = [];

    @track showpreviewimage = false;
    @track setdiscrepancypoint;
    @track loggedinuser;
    @track qccapturerole=false;
    @track qccaptureaction=false;

     // For Showing no data message when Discrepancy List is Empty.   
     get discrepancylistempty(){
        return this.modifieddiscrepancyList.length == 0;
    }

     

    // Use whenever a false attribute is required in Component.html
    get returnfalse(){
          return false;
    }

    // Use whenever a true attribute is required in Component.html
    get returntrue(){
        return true;
    }

    // Disable/Enable Production User For Selected Discrepancy
    get disableprodforselecteddiscrepancy(){
        if(this.selecteddiscrepancy.discrepancy_status != 'open'){
            return true;
        }
        else{
            return false;
        }
    }

    // Disable/Enable QC User For Selected Discrepancy
    get disableqcforselecteddiscrepancy(){
        if(this.selecteddiscrepancy.discrepancy_status == 'approve'){
            return true;
        }
        else{
            return false;
        }
    }

    connectedCallback(){
        this.departmentid = this.selecteddepartmentId;
        this.getloggedinuser();
        this.loadDiscrepancydata();
        //alert('Fresh Load');
    }

    getloggedinuser(){
        EcardLogin()
        .then((result) => {
            this.loggedinuser=result.data.user;
            if(this.loggedinuser.approle_id==1 || this.loggedinuser.approle_id==4){
                this.qccapturerole=true;
            }else{
                this.qccapturerole=false;
            }
        })
        .catch((error) => {
        });//sajith
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
                    var name = `${user.first_name} ${user.last_name}`;
                    var dispname=`${user.first_name} ${user.last_name} (${user.employee_number})`;
                    var emp_id=`${user.employee_number}`;
                    var initials = name.match(/\b\w/g) || [];
                    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                     var newuser = {
                        name : `${user.first_name} (${user.employee_number})`,
                        Name : `${user.first_name} (${user.employee_number})`,
                        fullname : name,
                        displayname:dispname,
						empid:emp_id,
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

    // To refine selected userlist from API to show in userlistIconCompoent
    // Inputs required include Complete user List valid for selection and List of selected user ids.
    getselectedmodifieduserlist(allproduserlist, selecteduserids){
        var selecteduserlist = [];
        if(selecteduserids.length != 0){
            if(allproduserlist.length != 0){
                for(var i in allproduserlist){
                    if(selecteduserids.includes(allproduserlist[i].employee_id)){
                        selecteduserlist.push(allproduserlist[i]);
                    }
                }
            }
        }
        return this.getmodifiediserlist(selecteduserlist);
    }

    // Get stringified modded date
    getmoddeddate(date){
        var formatteddate = undefined;
        if(date != undefined){
            var jsdate = new Date(date);
            var hours = jsdate.getHours();
            var minutes = jsdate.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return jsdate.getMonth()+1 + "/" + jsdate.getDate() + "/" + jsdate.getFullYear() + ", " + strTime;
        }
        return formatteddate;
    }

    // To get the forman details in a list format from API structure.
    getselectedformandetails(obj){
        var users = [];
        for(var i=0; i<5;i++){
            if(obj[`forman${i+1}_id`] != undefined){
                users.push(obj[`forman${i+1}_id`]);
            }
         }
        return this.getmodifiediserlist(users);
    }

     // To modify the Department Discrepancy data for Ecard App and related components.
     getmodifieddiscrepancylist(departmentdata){
        var departmentid = departmentdata.department_id;
        var departmentqc = this.getmodifiediserlist(departmentdata.qc);
        var discrepancylogs = departmentdata.discrepancylog;
        var modifieddiscrepancyList = [];
        var prod_supervisor = this.getmodifiediserlist(departmentdata.prod_supervisor);
        this.deptsupervisor = prod_supervisor;
        for(var disc in discrepancylogs){
            var index = Number(disc)+1;
            var moddedprod = this.getmodifiediserlist(discrepancylogs[disc].prod);
            var assignedprod = this.getselectedformandetails(discrepancylogs[disc]);
            var assigend_qc_id = this.getmodifiediserlist([discrepancylogs[disc].assigend_qc_id]);
            var verifiedby = this.getmodifiediserlist([discrepancylogs[disc].verifiedby_id]);
            var resolved_status_updatedby_id = this.getmodifiediserlist([discrepancylogs[disc].resolved_status_updatedby_id]);
            var created_by = this.getmodifiediserlist([discrepancylogs[disc].createdby_id]);
            var raised_date = this.getmoddeddate(discrepancylogs[disc].raised_date);
            var createdbyname;
            var createdbyempid=undefined;
            var displaycreatedbyname;
            var customernamewithchasis = `${this.busname}, ${this.buschasisnumber}`;
            var department_name = this.selecteddepartment;
            var is_deletable=false;
            if(created_by != undefined && created_by.length != 0){
                 if(created_by[0]!=undefined){
                     displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${raised_date}`;
                     createdbyname = `${created_by[0].name} (${created_by[0].userid})`;
                     createdbyempid= `${created_by[0].userid}`;
                 }
            }
            if((createdbyempid==this.loggedinuser.appuser_id) && (discrepancylogs[disc].discrepancy_status=="open")){
                is_deletable=true;
            }
            var isdepartmentdiscrepancy = false;
            if(discrepancylogs[disc].discrepancy_type == 'department'){
                // assignedprod = prod_supervisor;
                moddedprod = prod_supervisor;
                isdepartmentdiscrepancy = true;
            }
            var hasbusareapicture = false;
            if(discrepancylogs[disc].bus_area_picture_id != undefined){
                hasbusareapicture = true;
            }
            var discrepancytype = discrepancylogs[disc].discrepancy_type;
                if(discrepancylogs[disc].discrepancy_type == 'busarea' ){
                    discrepancylogs[disc].discrepancy_type = 'Bus Area';
                }
            var qc_avilable=assigend_qc_id.length!=0?true:false;
            var moddeddiscrepancy = {
                index: index,
                hasbusareapicture : hasbusareapicture,
                departmentid : departmentid,
                //departmentcode : this.getdepartmentcode(departmentid),
                modified_date : discrepancylogs[disc].modified_date,
                bus_area : discrepancylogs[disc].bus_area,
                bus_area_picture_id : discrepancylogs[disc].bus_area_picture_id,
                ecard_discrepancy_log_id : discrepancylogs[disc].ecard_discrepancy_log_id,
                isdepartmentdiscrepancy : isdepartmentdiscrepancy,
                isdeletable:is_deletable,
                created_by : created_by,
                createdbyname : createdbyname,
                displaycreatedbyname : displaycreatedbyname,
                discrepancy_priority : discrepancylogs[disc].discrepancy_priority,
                customernamewithchasis : customernamewithchasis,
                first_name : discrepancylogs[disc].first_name,
                last_name : discrepancylogs[disc].last_name,
                ecard_id : discrepancylogs[disc].ecard_id,
                customername : `${discrepancylogs[disc].customer_name}`,//`${discrepancylogs[disc].first_name} ${discrepancylogs[disc].last_name}`,
                chassis_no : discrepancylogs[disc].chassis_no,
                department_name : discrepancylogs[disc].department_name,
                department_id : discrepancylogs[disc].department_id,
                busstatus_name : discrepancylogs[disc].busstatus_name, 
                workcenter_name : discrepancylogs[disc].workcenter_name,
                assigend_qc_id : discrepancylogs[disc].assigend_qc_id,
                buildstation_code: discrepancylogs[disc].buildstation_code,
                buildstation_id: discrepancylogs[disc].buildstation_id,
                dat_defect_code_id : discrepancylogs[disc].dat_defect_code_id,
                dat_discrepancy_code_id: discrepancylogs[disc].dat_discrepancy_code_id,
                defect_code : discrepancylogs[disc].defect_code,
                defect_name : discrepancylogs[disc].defect_name,
                defect_type : this.capitalize(discrepancylogs[disc].defect_type),
                defect_codename : `${discrepancylogs[disc].defect_code}, ${discrepancylogs[disc].defect_name}`,
                discrepancy: discrepancylogs[disc].discrepancy,
                discrepancy_name: discrepancylogs[disc].discrepancy_name,
                discrepancy_status: discrepancylogs[disc].discrepancy_status,
                discrepancy_statusdisplay : setstatusfordisplay(discrepancylogs[disc].discrepancy_status),
                discrepancy_type: this.capitalize(discrepancylogs[disc].discrepancy_type),
                root_cause : discrepancylogs[disc].root_cause,
                component : discrepancylogs[disc].component,
                cut_off_date : discrepancylogs[disc].cut_off_date,
                raised_date : discrepancylogs[disc].raised_date,
                raised_date_display : raised_date,
                resolved_status_updatedby_id : resolved_status_updatedby_id,
                ecard_discrepancy_log_number:discrepancylogs[disc].discrepancy_log_number,
                verifiedby : verifiedby,
                prod : moddedprod,
                qc : departmentqc,
                assignedprod : assignedprod,
                qcavailable:qc_avilable,
                assigend_qc_id : assigend_qc_id

            };
            modifieddiscrepancyList.push(moddeddiscrepancy);
        }
        return modifieddiscrepancyList;
}

 // Load Discrepancy tab data and formatting based on the Ecard and Department selected from API.
 loadDiscrepancydata(event){
    var ecardid = this.ecardid;
    var deptmentId = this.selecteddepartmentId;
    var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
    // Get Data from API.
    getDiscrepancylist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
    .then(data => {
        var discrepancylist = [];
        var modifieddiscrepancyList = [];
        var departmentdata = JSON.parse(data.responsebody).data;
        var thisdeptdiscrepancy = this.getmodifieddiscrepancylist(departmentdata);
        discrepancylist.push(...thisdeptdiscrepancy)
        this.modifieddiscrepancyList = discrepancylist;
        this.showSpinner = false;
        this.error = undefined;
    })
    .catch(error => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
            title : 'Data fetch failed.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
        
    }); 
     //this.showSpinner = false;
}

   
    // Capitalize string passed
    capitalize(text){
        if (typeof text !== 'string') return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

      // Handle Status Change (Action) for Discrepancy Tab.
      discrepancyactionshandler(event){
        var action = event.detail.action;
        var selecteddiscrepancylogid = event.detail.buildstationid;
        for(var i in this.modifieddiscrepancyList){
            if(this.modifieddiscrepancyList[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selecteddiscrepancy = this.modifieddiscrepancyList[i];
            }
        }
        
        
        if(action == 'Mark as done'){
            // Check Validations
            if(this.selecteddiscrepancy.isdepartmentdiscrepancy){
                const alertmessage = new ShowToastEvent({
                    title : 'Fill all required fields.',
                    message : 'Please fill in all the required fields..',
                   variant : 'warning'
              });
              this.dispatchEvent(alertmessage);
              this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
              this.isdelenabled=false;
              if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status =='open')){
                  this.isdelenabled=true;
              }
              this.discdetailsmodal = true;
            }
            else{
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
                this.updatediscrepancytoserver();
            }
            
        }
        else{
            if (action == "Reject") {
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
                this.selecteddiscrepancy.discrepancy_status ='open'; //reject
            }
            if(action == 'Verify'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('approve');
                this.selecteddiscrepancy.discrepancy_status ='approve';
            }
            if(action == 'Cancel'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open');
                this.selecteddiscrepancy.discrepancy_status ='open';
            }
            if(action == 'Cancel Verified'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
            }
            if(action == 'Cancel Rejected'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
            }
            this.updatediscrepancytoserver();
        }
        
        // Need to call the update to server
    }


    // To show Discrepancy Details view
    showdiscdetails(event){
        var selecteddiscrepancylogid = event.currentTarget.dataset.id;
        for(var i in this.modifieddiscrepancyList){
            if(this.modifieddiscrepancyList[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selecteddiscrepancy = this.modifieddiscrepancyList[i];
            }
        }
        this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
        this.isdelenabled=false;
        if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status =='open')){
            this.isdelenabled=true;
        }
        this.discdetailsmodal = true;
    }

    // For Hiding the Details Modal
    hidediscrepancydetail(event){
        this.discdetailsmodal = false;
    }

    @track selecteddiscrepancycomments = [];
     // Add new Comment to Discreepancy
     addnewdiscrepancycomment(event){
        var ecarddiscrepancylogid = event.detail.uniqueId;
        var newcommentbody = {
            "ecard_discrepancy_log_id"  : event.detail.uniqueId,             
            /*"commentedby_id": event.detail.loggedinuserid,*/               
            "discrepancy_comments": event.detail.commenttext
        };
        //alert(JSON.stringify(newcommentbody)); 
        addnewComment({requestbody:JSON.stringify(newcommentbody)})
        .then(data => {
            if(data.isError){
                const alertmessage = new ShowToastEvent({
                title : 'Failed to add Comments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            }
            else{
                const alertmessage = new ShowToastEvent({
                    title : 'Comment saved successfully.',
                    message : 'Your Comment was recorded successfully.',
                    variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                this.getselecteddiscrepancycomments(ecarddiscrepancylogid);
            }
           
        })
        .catch(error => {
            const alertmessage = new ShowToastEvent({
                title : 'Failed to add Comments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        });
        

    }

    // Get Comments of selected discrepancy
    getselecteddiscrepancycomments(selecteddiscrepancylogid){
        var requesthead =  selecteddiscrepancylogid.toString();
        getAllComments({discrepancylogid:requesthead})
        .then(data => {
            if(data.isError){
                const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch Comments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            }
            else{
                debugger
                var commentsresponse = JSON.parse(data.response).data.discrepancycomments;
                var commentlist = [];
                if(commentsresponse.length !=0){
                    for(var comment in commentsresponse){
                        var com = commentsresponse[comment];
                        if(com.commentedby_id !=null && com.commentedby_id !=undefined){
                            var name = `${com.commentedby_id.first_name} ${com.commentedby_id.last_name}`;
                            var initials = name.match(/\b\w/g) || [];
                            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                            var moddedcomment = {
                                created_by : name,
                                initials : initials,
                                commentedbyid : com.commentedby_id.employee_number,
                                commentedusername : com.commentedby_id.appuser_name,
                                commenttext : com.discrepancy_comments,
                                ecard_discrepancy_comments_id : com.ecard_discrepancy_comments_id,
                                created_date : com.created_date
                            };
                            commentlist.push(moddedcomment);
                        }
                   }
                }
                this.selecteddiscrepancycomments = commentlist;
            }
           
        })
        .catch(error => {
            const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch Comments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        });
    }


    // Update user selection of selected discrepancy
    updateuserselection(event){
        var detail = event.detail;
        // alert(JSON.stringify(detail.userlist));
        //alert(JSON.stringify(detail));
        if(detail.type == 'QC'){
            this.selecteddiscrepancy.assigend_qc_id = detail.userlist;
        }
        if(detail.type == 'PROD'){
            this.selecteddiscrepancy.assignedprod = detail.userlist;
        }
        this.updatediscrepancytoserver();
    }

    get disablecomponentdates(){
        return this.selecteddiscrepancy.discrepancy_status != 'open';
    }

    // Handle status change from modal
    handlediscrepancyactions(event){
        var action = event.detail.action;
        var passedallvalidation = true;
        if (action == "Reject") {
            this.qccaptureaction=true;
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
            this.selecteddiscrepancy.discrepancy_status ='open'; //reject
        }
        if(action == 'Verify'){
            this.qccaptureaction=true;
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('approve');
            this.selecteddiscrepancy.discrepancy_status ='approve';
        }
        if(action == 'Mark as done'){
            this.qccaptureaction=false;
            // Check Validations
            if(this.selecteddiscrepancy.defect_type == 'Department'){
                const allValid = [...this.template.querySelectorAll('.checkvalid')].reduce((validSoFar, inputCmp) => {
                    inputCmp.reportValidity();
                    return validSoFar && inputCmp.checkValidity();
            }, true);
            if (allValid) {
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
                this.isdelenabled=false;
                this.selecteddiscrepancy.isdeletable=false;
            }
            else{
                passedallvalidation = false;
                const alertmessage = new ShowToastEvent({
                    title : 'Fill all required fields.',
                    message : 'Please fill in all the required fields..',
                   variant : 'warning'
              });
              this.dispatchEvent(alertmessage);
            }
            }
            else{
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
            }
            
        }
        if(action == 'Cancel'){
            this.qccaptureaction=false;
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open');
            this.selecteddiscrepancy.discrepancy_status ='open';
        }
        if(action == 'Cancel Verified'){
            this.qccaptureaction=true;
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selecteddiscrepancy.discrepancy_status ='resolve';
        }
        if(action == 'Cancel Rejected'){
            this.qccaptureaction=true;
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selecteddiscrepancy.discrepancy_status ='resolve';
        }
        if(passedallvalidation){
             this.updatediscrepancytoserver();
        }
    }

    // Update other fields of selected discrepancy
    updateselecteddiscrepancy(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.selecteddiscrepancy[targetname] = targetvalue;
    }

     // To Update the responsebody with selected formanIds from List Views.
     updateformans(responsebody, formanlist){
        var newresponse = JSON.parse(responsebody);
        var newformanlist;
        if(formanlist.length > 5){
            newformanlist = formanlist.slice(0, 5);
        }
        else{
            newformanlist = formanlist;
        }
        for(var i=0;i<newformanlist.length;i++){
            newresponse[`forman${i+1}_id`] = newformanlist[i].userid;
            }
        
        return newresponse;
     }

     // Generic function to Show alert toasts.
    showmessage(title, message, variant){
        const alertmessage = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });
        this.dispatchEvent(alertmessage);
    }

    // To update the discrepancy changes to server.
    updatediscrepancytoserver(event){
        //alert(JSON.stringify(this.selecteddiscrepancy));
        var discrepancytobeupdated = this.selecteddiscrepancy;
        var responsebody = {
            "ecard_discrepancy_log_id": discrepancytobeupdated.ecard_discrepancy_log_id,
            "ecard_id" : discrepancytobeupdated.ecard_id,
            "department_id" : discrepancytobeupdated.department_id,
            "component" : discrepancytobeupdated.component,
            "cut_off_date" : new Date(discrepancytobeupdated.cut_off_date),
            "root_cause" : discrepancytobeupdated.root_cause,
            "discrepancy_status" : discrepancytobeupdated.discrepancy_status,
            "discrepancy_type" : discrepancytobeupdated.discrepancy_type,
            "discrepancy" : discrepancytobeupdated.discrepancy,
            "modified_date" : discrepancytobeupdated.modified_date
        };
        /*if(discrepancytobeupdated.assigend_qc_id.length != 0){
            responsebody["assigend_qc_id"] =  discrepancytobeupdated.assigend_qc_id[0].Id;
        }*/
        if(this.qccaptureaction && this.qccapturerole){
            responsebody["assigend_qc_id"] =  this.loggedinuser.appuser_id;
            this.qccaqccaptureaction = false;
        }
        var requestwithforman = this.updateformans(JSON.stringify(responsebody),discrepancytobeupdated.assignedprod);
   
        updateDiscrepancy({requestbody:JSON.stringify(requestwithforman)})
              .then(data => {
                if (data.isError) {
                    if(data.errorMessage == 202){
                        this.showmessage('Sorry we could not complete the operation.',JSON.parse(data.responsebody).data.validation_message,'error');  
                        this.discdetailsmodal = false;
                        this.loadDiscrepancydata();
                    }
                    else{
                      this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                      this.discdetailsmodal = false;
                      this.loadDiscrepancydata();
                    }
                } else {
                    this.selecteddiscrepancy['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date;  
                    this.showmessage('Record Updated.','Record updated Successfully.','success');
                    this.loadDiscrepancydata();
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


    // To add new shortage
    showReportShortageAdd(event){
        const addshortage = new CustomEvent(
            "addshortage",
            {
                detail : {} 
                
            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(addshortage);
    }

    // To add new discrepancy
    addnewdiscrepancymodal(event){
        const adddiscrepancy = new CustomEvent(
            "adddiscrepancy",
            {
                detail : {} 
                
            }
        );
        this.dispatchEvent(adddiscrepancy);
    }

    // To show QC checklist
    showqccheclist(event){
        const showqccheclist = new CustomEvent(
            "showqccheclist",
            {
                detail : {} 
                
            }
        );
        this.dispatchEvent(showqccheclist);
    }

    // To show gethelpdocuments
    gethelpdocuments(event){
        const gethelpdocuments = new CustomEvent(
            "gethelpdocuments",
            {
                detail : {} 
                
            }
        );
        this.dispatchEvent(gethelpdocuments);
    }

    // Show Add Discrepancy Modal
    showDescrepancyAdd(event){
        this.adddescrepancymodal = true;
    }

    // Hide Add Discrepancy Modal
    hideDescrepancyAdd(event){
        this.adddescrepancymodal = false;
    }

    @track previewimageexist = false;
    @track discrepancyimage ;
    @track parentdivdimensions;
    @track showspinnerwithmodal = false;
    previewimage(event){
        debugger
        var selecteddiscrepancylogid = event.target.dataset.id;
        for(var i in this.modifieddiscrepancyList){
            if(this.modifieddiscrepancyList[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selecteddiscrepancy = this.modifieddiscrepancyList[i];
            }
        }
        var selecteddiscrepancy = this.selecteddiscrepancy;
        if(selecteddiscrepancy.bus_area_picture_id != undefined){
        getdiscrepancyimage({buspictureid:selecteddiscrepancy.bus_area_picture_id})
        .then(data => {
            debugger
            if(data.isError){
                const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch Bus Image.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            }
            else{
                var imagedata = JSON.parse(data.operationlogresponse).data;
                this.discrepancyimage = imagedata.bus_area_picture.s3_image_uri;
                var imagedimensions = this.getImagesize(this.discrepancyimage);
                this.showspinnerwithmodal = true;
                /*debugger
                var discrepancycolor = '#ff3b30';
                if(this.selecteddiscrepancy.discrepancy_status == 'resolve'){
                    discrepancycolor = '#e8bb07';
                }
                if(this.selecteddiscrepancy.discrepancy_status == 'approve'){
                    discrepancycolor = '#34c759';
                }
                var bus_area = this.selecteddiscrepancy.bus_area;
                this.setdiscrepancypoint =`top: ${bus_area.y}px;left: ${bus_area.x}px;background: ${discrepancycolor};`;
                this.previewimageexist = true; */
                this.showpreviewimage = true; 
            }
           
        })
        .catch(error => {
            const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch Bus Image.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        });
    
        }
        else{
            //this.setdiscrepancypoint =`display:none;`;
            this.previewimageexist = false;
            this.showpreviewimage = true;
        }
       
    }

    
    getMeta(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = url;
        });
    }

    
    async getImagesize(url) {
        let img = await this.getMeta(url);
        let imagedimensions = {
            "height" : img.height,
            "width" : img.width
        };
        debugger
        var discrepancycolor = '#ff3b30';
        if(this.selecteddiscrepancy.discrepancy_status == 'open'){
            discrepancycolor = '#e8bb07';
        }
        if(this.selecteddiscrepancy.discrepancy_status == 'approve'){
            discrepancycolor = '#34c759';
        }
        var maxwidth = 1200; 
        var maxheight = 380;
        var parentdivheight;
        var parentdivwidth;
        var zoomScale = 1.0;
        if(imagedimensions.width < maxwidth && imagedimensions.height < maxheight){
            parentdivheight = imagedimensions.height;
            parentdivwidth = imagedimensions.width;
            zoomScale = 1.0
        }
        else{
            let widthRatio = maxwidth / imagedimensions.width;
            let heightRatio = maxheight / imagedimensions.height;
            let bestFitRatio = Math.min(widthRatio, heightRatio);
            parentdivwidth = imagedimensions.width * bestFitRatio;
            parentdivheight = imagedimensions.height * bestFitRatio
            zoomScale = bestFitRatio
        }
        var bus_area = this.selecteddiscrepancy.bus_area;
        this.parentdivdimensions = `height: ${parentdivheight}px; weight: ${parentdivwidth}px`;
        this.setdiscrepancypoint =`top: ${bus_area.y*zoomScale}px;left: ${bus_area.x*zoomScale}px;background: ${discrepancycolor};`;
        this.previewimageexist = true;
        this.showspinnerwithmodal = false;
    }

    hidepreviewimage(event){
        this.showpreviewimage = false;
    }

    deletediscshortage(event){
        var status=confirm("Discrepancy/Shortage once deleted can not be retrieved. Are you sure you want to continue this action?");
		var discrepancyid = event.target.name;
        if(status){
            var datatodelete={
                id: JSON.stringify(discrepancyid)
            };
                deleteDiscOrShortage({ requestbody: JSON.stringify(datatodelete) })
                .then((data) => {
                  if (data.isError) {
                    const alertmessage = new ShowToastEvent({
                      title: "Sorry we could not complete the operation.",
                      message:
                        "Something unexpected occured. Please contact your Administrator",
                      variant: "error"
                    });
                    this.dispatchEvent(alertmessage);
                  } else {
                    const alertmessage = new ShowToastEvent({
                      title: " Success",
                      message: "Discrepancy/Shortage deleted successfully.",
                      variant: "success"
                    });
                    this.dispatchEvent(alertmessage);
                    this.loadDiscrepancydata();
                    this.discdetailsmodal = false;
                  }
                })
                .catch((error) => {
                  this.error = error;
                  const alertmessage = new ShowToastEvent({
                    title: "Sorry we could not complete the operation.",
                    message:
                      "Something unexpected occured. Please contact your Administrator",
                    variant: "error"
                  });
                  this.dispatchEvent(alertmessage);
                });
        }

    }

}