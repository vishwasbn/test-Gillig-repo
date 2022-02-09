import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { NavigationMixin } from 'lightning/navigation';
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
import getOperationslist from "@salesforce/apex/ecardOperationsController.getOperationslist";
import getDepartmentOperations from "@salesforce/apex/ecardOperationsController.getDepartmentOperations";
import getDiscrepancylist from "@salesforce/apex/ecardOperationsController.getDiscrepancylist";
import getShortageslist from "@salesforce/apex/ecardOperationsController.getShortageslist";
import getCompleteDefectCodes from "@salesforce/apex/ecardOperationsController.getDefectCodes";
import insertOperationlog from "@salesforce/apex/ecardOperationsController.insertOperationlog";
import updateOperationlog from "@salesforce/apex/ecardOperationsController.updateOperationlog";
import raiseBsDiscrepancy from "@salesforce/apex/ecardOperationsController.raiseBsDiscrepancy";
import raiseDepartmentDiscrepancy from "@salesforce/apex/ecardOperationsController.raiseDepartmentDiscrepancy";
import raisenewShortage from "@salesforce/apex/ecardOperationsController.raisenewShortage";
import updatePartshortage from "@salesforce/apex/ecardOperationsController.updatePartshortage";
import deleteDiscOrShortage from "@salesforce/apex/ecardOperationsController.deleteDiscOrShortage";
import getAllComments from "@salesforce/apex/DiscrepancyDatabaseController.getAllComments";
import addnewComment from "@salesforce/apex/DiscrepancyDatabaseController.addnewComment";
import updateDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.updateDiscrepancy";
import getBusPartdetails from "@salesforce/apex/ecardOperationsController.getBusPartdetails";
import deleteTempAttachment from "@salesforce/apex/ecardOperationsController.deleteTempAttachment";
import pubsub from 'c/pubsub' ; 
import {modifieduserlist, getmoddeddate, getselectedformandetails, setstatusfordisplay}  from 'c/userPermissionsComponent';
import getcrewingsuserslist from "@salesforce/apex/CrewingScheduleController.getcrewingsuserslist";
import getPartshortagecauselist from "@salesforce/apex/ecardOperationsController.getPartshortageCauses";
import getAllpartsVendorlist from '@salesforce/apex/ecardOperationsController.getAllpartsVendorlist';
import getDefaultVendorandBuyer from '@salesforce/apex/ecardOperationsController.getDefaultVendorandBuyer';

//----Extension Imports Start-------//
import {getselectedbuildstationDetails, getmodifiedbuildstationlist, getmodifieddiscrepancylist, getmodifiedshortageslist,getmodifiedvalidationlist} from "./operationActionsExtended";
//----Extension Imports End-------//

export default class OperationActionsComponent extends NavigationMixin(LightningElement) {
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    @api department;
    @api selecteddepartmentId;
    @api busname;
    @api buschasisnumber;
    @api seq;
    @api operation;
    @api ecardid;
    @api departmentIdMap;
    @api permissionset;
    @api loggedinuser=undefined;
    @track currentuserempid=undefined;
    
    @track filter;
    @track filterapplied = false;
    @track filterlabelfordisplay;
    @track currentuserid = 2;

    @track currentuserlist;
    @track departmentId;
    @track departmentName;
    @track showSpinner;
    @track adddescrepancymodal;
    @track modifiedbuildstations = [];  // To store formatted operation details.
    @track showuserlist;
    @track filtereduserlist;
    @track partshortageaddmodal = false;
    @track addoperationaldescrepancymodal = false;
    @track discrepancylistmodal = false;
    @track alldefectcode;
    @track defectoptions = [];
    @track filteredbuildstation = undefined;
    @track builstationforfilters = [];

    @track departmentoptions;
    @track newoperationaldiscrepancy;
    @track thisdepartmentbuildstations = [];
    @track newdeptdiscrepancy;
    @track priorityoptions = [{"label":"High", "value":"High"}, {"label":"Normal", "value":"Normal"}, {"label":"Low", "value":"Low"}] ; 
    @track deptsupervisor = [];
    @track deptsupervisorforselecteddept;

    @track selectedusersList = [];
    @track modifieduserselection = [];
    @track completesearchlistUsers = [];
    @track selectedbuildstationId;
    @track fieldtoupdate;
    @track selecteduserslistfrommodal;
    @track buildstationoptions; 

    @track modifieddiscrepancyList = [];
    @track isdescripancybyrejection = false;

    @track paintdefects = [];
    @track otherdefects = [];

    @track discdetailsmodal = false;;
    @track selecteddiscrepancy;
    @track newdiscrepancymodal = false;

    @track modifiedshortageslist = [];
    @track partnumberlist;
    @track partnumberdetails;
    @track newpartshortage;
    @track placeholderforpartname;
    @track qccaptureaction=false;
    @track qccapturerole=false;
    @track validationshortage=false;
    @track vspartno;
    @track vsbuildstation;
    @track vsbs;
    @track vspartname;
    @track statusascomment = false;
    @track statuscommentmap = {
        "resolve": "Status changed to Resolved",
        "approve": "Status changed to Verified",
        "open": "Status changed to Open"
    };
    @track scheduleflow = false;
    @track scheduledata;

    get todaysdate(){
        var today = new Date();
        var dt = today.getFullYear()+'-'+((today.getMonth() + 1) <= 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1))+'-'+( (today.getDate()) <= 9 ? "0" + (today.getDate()) : (today.getDate()));
        return dt;
    }

    get enableeditonpartname(){
        return this.newpartshortage.buspart_no != 'Part No. Not Found';
    }

    get disctype(){
        var discrepancytypes = [{'label':'Normal Discrepancy', 'value':'buildstation'}, 
                                {'label':'Department Discrepancy', 'value':'department'}
                               ];
                               return discrepancytypes;
                }
  @track isdelenabled;  
  @track newdiscrepancy;
  @track selecteddeptbsdetails = [];
  @track buildstationfornewdisc;
  @track shortgecauselist = [];
  @track partsvendorslist = [];
  @track timeoutId = 0;
  @track isupdated = false;
  @track carrieroptions = [
    { "label": "UPS", "value": "UPS" },
    { "label": "UPS 2ND DAY", "value": "UPS 2ND DAY" },
    { "label": "UPS NDA", "value": "UPS NDA"    },
    { "label": "UPS NDA EARLY AM", "value": "UPS NDA EARLY AM" },
    { "label": "FEDEX", "value": "FEDEX"    },
    { "label": "FEDEX 2ND DAY", "value": "FEDEX 2ND DAY" },
    { "label": "FEDEX NDA", "value": "FEDEX NDA" },
    { "label": "COURIER", "value": "COURIER" },
    { "label": "VENDOR TRUCK", "value": "VENDOR TRUCK" },
    { "label": "OTHER", "value": "OTHER" }
  ];
    
    // To show tabs based on the operation selected from operationsComponent.
    get isdeletable(){
        return this.isdelenabled;
    }
    get isSelectedOperations(){
        return this.operation === 'Operations';
    }
    
    get isSelectedDiscrepancies(){
        return this.operation === 'Discrepancies';
    }

    get isSelectedShortages(){
        return this.operation === 'Shortages';
    }

    get isSelectedSlnologs(){
        return this.operation === 'Serial No. Logs';
    }
    get isSelectedATP(){
        return this.operation === 'ATP';
    }
    get isSelectedOpCk(){
        return this.operation === 'Operation Checks';
    }
    // To show tabs based on the operation selected from operationsComponent.
  
    // To show/hide Paint Department for Discrepancy tab if selected department is Paint.(Need to modify to Department Code)
    get isdepartmentPaint(){
        var isdepartmentpaintortrim = false;
        for(var i in this.departmentIdMap){
            if(this.departmentIdMap[i].value == this.departmentId){
                isdepartmentpaintortrim = this.departmentIdMap[i].bus_area_discrepancy_enabled;
            }
        }
        return isdepartmentpaintortrim;
    }

    // For Showing no data message when Operations List is Empty.
    get operationlistempty(){
        return this.modifiedbuildstations.length == 0;
    }

    // For Showing no data message when Discrepancy List is Empty.   
    get discrepancylistempty(){
        return this.modifieddiscrepancyList.length == 0;
    }

    // For Showing no data message when Parshortage is empty
    get shortageslistempty(){
        return this.modifiedshortageslist.length == 0;
    }
    
    // For setting the limit on reUsableMultiSelectLookup when type is QC in user selection.  
    get setuserlimit(){
        return this.fieldtoupdate == 'QC';
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
    get disableprodforselecteddiscrepancy() {
        var updatepermission = false;
        if (this.selecteddiscrepancy.discrepancy_type == 'department') {
            updatepermission = this.permissionset.dept_discrepancy_update_prod.write;
        } else {
            updatepermission = this.permissionset.discrepancy_update_prod.write;
        }
        return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !updatepermission;
    }

    // Disable/Enable QC User For Selected Discrepancy
    get disableqcforselecteddiscrepancy(){
        if(this.selecteddiscrepancy.discrepancy_status.toLowerCase() == 'approve'){
            return true;
        }
        else{
            return false;
        }
    }

    // Disable/Enable QC User For Selected shortage
    get disableqcforselectedshortage(){
        if(this.selectedshortage.discrepancy_status.toLowerCase() == 'approve'){
            return true;
        }
        else{
            return false;
        }
    }

    // Disable/Enable Production User For Selected Shortage
    get disableprodforselectedshortage() {
        return !this.permissionset.shortage_update_prod.write || this.selectedshortage.discrepancy_status.toLowerCase() != "open";
    }
    // To know when the ALL DEPARTMENT operation is selected and make required changes in UI.
    get isalldepartment(){
        return this.departmentName == 'ALL DEPARTMENTS';
    }
    //To check if user have new discrepancy add access or prod user
    get addrepetitionbtn() {
        return this.permissionset.dept_discrepancy_new.write;
    }

    get disablevendorselection(){
        return this.partsvendorslist.length == 0 ;
    }
    
    
    get disablebuyercode(){
        return this.newpartshortage.buyer_code == undefined;
    }
    
    //TO disable the selected part shortage fields from edit
    get disableeditshortage() {
        return this.permissionset.shortage_update.write != true || this.selectedshortage.discrepancy_status.toLowerCase() != "open"; //corrected
    }
    //to disable ops discrepancy / shortage button
    get enableoperationdisc() {
        return this.permissionset.shortage_new.write && this.permissionset.discrepancy_new.write;
    }
    // Sets the functions/data on intial load.
    connectedCallback(){
        this.getloggedinuser();
        this.getscheduleflowdata();
        var options = [];
        for(var i in this.departmentIdMap){
            if(this.departmentIdMap[i].value != 'None' && this.departmentIdMap[i].label != 'ALL DEPARTMENTS'){
                options.push(this.departmentIdMap[i]);
            }
        }
        this.departmentoptions = options;
        this.departmentName = this.department;
        if(this.departmentName == 'ALL DEPARTMENTS'){
            this.departmentId = this.departmentoptions[0].value;
        }
        else{
            this.departmentId = this.selecteddepartmentId;
        }
        this.showSpinner = true;
        this.qccaptureaction=false;
        this.fetchcompletedefectList(event);
        if(this.operation === 'Operations'){
            this.loadOperationsdata(event);
        }
        if(this.operation === 'Discrepancies'){
            this.loadDiscrepancydata(event);
        }
        if(this.operation === 'Shortages'){
            this.loadShortagesdata(event);
        }
        if(this.operation === 'Serial No. Logs'){
            this.showSpinner = false;
        }
        if(this.operation === 'ATP'){
            this.showSpinner = false;
        }
        if(this.operation==='Operation Checks'){
            this.showSpinner = false;
        }
        pubsub.register('operationrefresh', this.refreshoperation.bind(this));
        pubsub.register('refreshdata', this.refreshoperation.bind(this));
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
            this.currentuserempid=this.loggedinuser.appuser_id;
        })
        .catch((error) => {
        });//sajith
    }

    //To set the data from the schedule page flow navigation
    getscheduleflowdata() {
        var scheduleflowdata = JSON.parse(localStorage.getItem('scheduleflowdata'));
        if (scheduleflowdata != undefined || scheduleflowdata != null) {
            this.scheduleflow = true;
            this.scheduledata = scheduleflowdata;
            localStorage.removeItem('scheduleflowdata');
        }
    }

    // To set the Bus Overview filters based on the applyfilter method fired and values.
    applyfilters(messageFromEvt){
        var valueforfilters = JSON.parse(messageFromEvt);
        this.filter = valueforfilters.filterstatus;
        var labeltodisplay;
        if(this.filter == 'approve'){
            labeltodisplay = `Verified Items`;
        }
        if(this.filter == 'notverified'){
            labeltodisplay = `Not Verified Items`;
        }
        else if(this.filter == 'resolve'){
            labeltodisplay = `Resolved Items`;
        }
        else if(this.filter == 'reject'){
            labeltodisplay = `Disc./Short. Items`;
        }
        else{
            labeltodisplay = `${this.filter} Items`;
        }
        this.filterlabelfordisplay = labeltodisplay;
        this.filterapplied = true;
     }

     // When clearing the Bus Overview filter making filter as undefined.
     clearfilter(event){
        this.filter = undefined;
        this.filterapplied = false;
        this.messageFromEvt = undefined;
        pubsub.fire('applyfilters', undefined );
        this.departmentchanged(this.departmentId, this.departmentName, this.operation, undefined);
     }

    messageFromEvt = undefined;
    //department=undefined; //Vishwas Commented
    // To trigger a Department/Operation change and reload the data based on selected department and tab.
    @api
    departmentchanged(departmentId, departmentName, operation, messageFromEvt) {
        if(messageFromEvt != undefined){
            this.messageFromEvt = messageFromEvt;
            this.applyfilters(messageFromEvt);
        }
        if(departmentName == 'ALL DEPARTMENTS'){
            this.departmentId = this.departmentoptions[0].value;
        }
        else{
            this.departmentId = departmentId;
        }
        this.departmentName = departmentName;
        this.department=departmentName;//back func change-sajith
        
        this.showSpinner = true;
        this.filteredbuildstation = 'All BuildStations';
        if(this.filter == 'notfilled' || this.filter == 'filled' || this.filter == 'reject'){
            if(operation != 'Serial No. Logs' && (this.filter == 'notfilled' || this.filter == 'filled')){
                this.filter = undefined;
                this.filterapplied = false;
            }
            if(operation != 'Operations' && this.filter == 'reject'){
                this.filter = undefined;
                this.filterapplied = false;
            }
        }
        if(operation === 'Operations'){
            this.loadOperationsdata(event);
        }
        if(operation === 'Discrepancies'){
            this.loadDiscrepancydata(event);
        }
        if(operation === 'Shortages'){
            this.loadShortagesdata(event);
        }
        if(operation === 'Serial No. Logs'){
            this.showSpinner = false;
        }
        if(operation === 'ATP'){
            this.showSpinner = false;
        }
        if(operation === 'Operation Checks'){
            this.showSpinner = false;
        }
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
    

    // To get Complete Defect List from Server. 
    fetchcompletedefectList(event){
        getCompleteDefectCodes()
        .then(data => {
            if(data.isError){
                this.error = error;
                this.showmessage('Defect Data fetch failed.','Something unexpected occured. Please try again or contact your Administrator.','error');  
            }
            else{
            this.defectoptions = [];
            this.otherdefects = [];
            this.paintdefects = [];
            this.alldefectcode = [];
            this.alldefectcode = JSON.parse(data.responsebody).data.defects;
            var alldefects = this.alldefectcode;
            for(var defect in alldefects){
                if(alldefects[defect].is_active){
                    var option = {
                        label : alldefects[defect].defect_code + ', '+ alldefects[defect].defect_name,
                        value : alldefects[defect].dat_defect_code_id.toString(),
                        defectname : alldefects[defect].defect_name,
                        defecttype : alldefects[defect].defect_type 
                    };
                    if(this.alldefectcode[defect].defect_type != 'paint'){
                        this.otherdefects.push(option);
                        this.defectoptions.push(option);
                    }
                    else{
                        this.paintdefects.push(option);
                    }
                }
            }
        }
        })
        .catch(error => {
            this.error = error;
            this.showmessage('Defect Data fetch failed.','Something unexpected occured. Please try again or contact your Administrator.','error');
        });
    }

    // To modify defect picklist values based on Department Selection
    moddifydefectpickvalues(deptcode){
        var defecttype = 'department';
        var deptlist = JSON.parse(JSON.stringify(this.departmentoptions));
        for(var i in deptlist){
            if(deptlist[i].value === deptcode.toString()){
              defecttype = deptlist[i].defect_type;
            }
        }
        if (defecttype == 'paint') {
            this.defectoptions = this.paintdefects;
        }
        else{
            this.defectoptions = this.otherdefects;
        }
    }
    // Get Department Code Shortened
    getdepartmentcode(departmentid){
        var departmentcode = '-';
        for(var i in this.departmentIdMap){
            if(this.departmentIdMap[i].value != 'None' && this.departmentIdMap[i].label != 'ALL DEPARTMENTS'){
                if(this.departmentIdMap[i].value == departmentid.toString()){
                    var departmentname = this.departmentIdMap[i].label;
                    departmentcode = departmentname.split('-')[0];
                }
            }
        }
        return departmentcode;
    }

    // Load Operations tab data and formatting based on the Ecard and Department selected from API.
    loadOperationsdata(event){
        var ecardid = this.ecardid;
        var deptmentId;
        if(this.departmentName == 'ALL DEPARTMENTS'){
            this.departmentId = this.departmentoptions[0].value;
            deptmentId = null;
        }else{
            deptmentId = this.departmentId;
        }
        var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
        this.showSpinner = true;
        // Getting the data from API
        getOperationslist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var buildstationlist = [];
            if(this.departmentName == 'ALL DEPARTMENTS'){
                var departmentlist = JSON.parse(data.responsebody).data.department;
                for(var dept in departmentlist){
                    var thisdeptbuildstations = getmodifiedbuildstationlist(departmentlist[dept],this.ecardid,this.departmentIdMap);
                    buildstationlist.push(...thisdeptbuildstations)
                }
            }
            else{
                var departmentdata = JSON.parse(data.responsebody).data;
                var thisdeptbuildstations = getmodifiedbuildstationlist(departmentdata,this.ecardid,this.departmentIdMap);
                buildstationlist.push(...thisdeptbuildstations)
            }
            var modifiedworkstationdatawithindex=[];
                for(var i in buildstationlist){
                    if(this.filter != undefined){
                        if(this.filter == buildstationlist[i].status){
                                var index = {index:Number(i)+1};
                                let modifiedws = Object.assign(index,buildstationlist[i]);
                                modifiedworkstationdatawithindex.push(modifiedws);
                            }       
                    }
                    else{
                        var index = {index:Number(i)+1};
                        let modifiedws = Object.assign(index,buildstationlist[i]);
                        modifiedworkstationdatawithindex.push(modifiedws);
                        
                    }
                }
                this.modifiedbuildstations = modifiedworkstationdatawithindex;
                this.showSpinner = false;
        })
        .catch(error => {
            this.error = error;
            this.showmessage('Failed to fetch Build Station operations data.','Something unexpected occured. Please try again or contact your Administrator.','error');
                        
        });
    }
    // Load Discrepancy tab data and formatting based on the Ecard and Department selected from API.
    loadDiscrepancydata(event){
        var ecardid = this.ecardid;
        var deptmentId;
        if(this.departmentName == 'ALL DEPARTMENTS'){
            this.departmentId = this.departmentoptions[0].value;
            deptmentId = null;
        }else{
            deptmentId = this.departmentId;
        }
        var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
        // Get Data from API.
        getDiscrepancylist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var discrepancylist = [];
            if(this.departmentName == 'ALL DEPARTMENTS'){
                var departmentlist = JSON.parse(data.responsebody).data.department;
                for(var dept in departmentlist){
                    var thisdeptdiscrepancy = getmodifieddiscrepancylist(departmentlist[dept],this.busname,this.buschasisnumber,this.departmentIdMap,this.currentuserempid);
                    discrepancylist.push(...thisdeptdiscrepancy)
                }
            }
            else{
                var departmentdata = JSON.parse(data.responsebody).data;
                var thisdeptdiscrepancy = getmodifieddiscrepancylist(departmentdata,this.busname,this.buschasisnumber,this.departmentIdMap,this.currentuserempid);
                discrepancylist.push(...thisdeptdiscrepancy)
            }
            var modifieddiscrepancyList=[];
                for(var i in discrepancylist){
                    if(this.filter != undefined){
                        if(this.filter == discrepancylist[i].discrepancy_status.toLowerCase()){
                            modifieddiscrepancyList.push(discrepancylist[i]);
                        }
                    }
                    else{
                        modifieddiscrepancyList.push(discrepancylist[i]);
                    }
                }
                this.modifieddiscrepancyList = modifieddiscrepancyList;
                this.showSpinner = false;
                this.error = undefined;
            //
            
        })
        .catch(error => {
            this.error = error;
            this.showmessage('Data fetch failed.','Something unexpected occured. Please try again or contact your Administrator.','error');
        }); 
         //this.showSpinner = false;
    }

    // Load Part Shortage tab data and formatting based on the Ecard and Department selected from API.
    loadShortagesdata(event){
        var ecardid = this.ecardid;
        var deptmentId;
        if(this.departmentName == 'ALL DEPARTMENTS'){
            this.departmentId = this.departmentoptions[0].value;
            deptmentId = null;
        }else{
            deptmentId = this.departmentId;
        }
        var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
        // Get Data from API.
        getShortageslist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var shortageslist = [];
            if(this.departmentName == 'ALL DEPARTMENTS'){
                var departmentlist = JSON.parse(data.responsebody).data.department;
                for(var dept in departmentlist){
                    var thisdeptshortage = getmodifiedshortageslist(departmentlist[dept],this.departmentIdMap,this.currentuserempid);
                    shortageslist.push(...thisdeptshortage)
                }
            }
            else{
                var departmentdata = JSON.parse(data.responsebody).data;
                var thisdeptshortage = getmodifiedshortageslist(departmentdata,this.departmentIdMap,this.currentuserempid);
                shortageslist.push(...thisdeptshortage);
            }
            var modifiedshortagesList=[];
                for(var i in shortageslist){
                    if(this.filter != undefined){
                        if(this.filter == shortageslist[i].discrepancy_status.toLowerCase()){
                            modifiedshortagesList.push(shortageslist[i]);
                        }
                    }
                    else{
                        modifiedshortagesList.push(shortageslist[i]);
                    }
                }
                this.modifiedshortageslist = modifiedshortagesList;
                this.loadpartshotcauselist();
                this.showSpinner = false;
                this.error = undefined;
            //
        })
        .catch(error => {
            this.error = error;
            this.showmessage('Data fetch failed.','Something unexpected occured. Please try again or contact your Administrator.','error');
        }); 
        
    }

    // To store the data selected from User Selection modal and format to selecteduserslistfrommodal.
    updateselecteduser(event){
        var detail = event.detail;
        this.selecteduserslistfrommodal = detail.userlist;
    }
    
    @track disableuserselection=false;
    // To set the selected users and search list for User selection modal in Operations Tab.
    usermodification(event){
        this.disableuserselection = false;
        this.selectedbuildstationId = null;
        this.selectedbuildstationId = event.detail.buildstationid;
        var currentuserlist = event.detail.userlist;
        this.fieldtoupdate = event.detail.type;
        let selectedbuildstation = getselectedbuildstationDetails(this.selectedbuildstationId,this.modifiedbuildstations); 
        if(this.fieldtoupdate == 'QC'){
            this.completesearchlistUsers = selectedbuildstation.QClist;
            if (selectedbuildstation.status == 'approve' || selectedbuildstation.status == 'reject' || !this.permissionset.operation_update_qc.write) {
                this.disableuserselection = true;
            }
        }
        else if(this.fieldtoupdate == 'PROD'){
            this.completesearchlistUsers = selectedbuildstation.PRODlist;
            if(this.completesearchlistUsers.length==0){
                var userdetails=[];
                getcrewingsuserslist({deptid:selectedbuildstation.department_id})
                .then((result) => {
			        userdetails = JSON.parse(result.responsebody).data.user;
                    userdetails = this.removeDuplicates(userdetails);//todo
                    this.completesearchlistUsers = userdetails.length>0?modifieduserlist(userdetails):userdetails;
                })
                .catch((error) => {
                });
            }
            if (selectedbuildstation.status != 'open' || !this.permissionset.operation_update_prod.write) {//vishwas
                this.disableuserselection = true;
            }
        }
        else{
            this.completesearchlistUsers = [];
        }

        if (event.detail.actionlabel == "modify") {
            this.selectedusersList = currentuserlist;
            this.showuserlist = true;
        }
        if(event.detail.actionlabel == "addnew"){
            this.selectedusersList = [];
            this.showuserlist = true;
        }
    }

    // To update the user selected from modal back to the data source. Update on user select modal.
    updatebuidstationusers(event){
        this.qccaptureaction=false;
        var modalist = this.selecteduserslistfrommodal;
        var validlist = false;
        if(modalist != undefined){
            if(modalist.length == 0 || modalist.length > 5){
                validlist = true;
            }
            else{
                validlist = false;
            }
        }
        if(validlist){
            this.showmessage('Select users accordingly.','Please select atleast one user or a maximum of 5 users for PROD.','warning');
        }
        else{
            var updateduserlist = this.selecteduserslistfrommodal;
            if(this.fieldtoupdate == 'PROD' || this.fieldtoupdate == 'QC'){
                // var buidstationdata = this.modifiedbuildstations;
                 for(var bs in this.modifiedbuildstations){
                     if(this.modifiedbuildstations[bs].buildstation_id == this.selectedbuildstationId){
                      if(this.fieldtoupdate == 'PROD'){
                        this.modifiedbuildstations[bs].selectedprod  = updateduserlist;
                      }
                      if(this.fieldtoupdate == 'QC'){
                        //this.modifiedbuildstations[bs].selectedqc = updateduserlist;
                       }
                     }
                    }
                this.updatebuildstationtoServer(this.selectedbuildstationId);
            }
            this.showuserlist = false;
        }
    }
    //Cancel operation on user select modal. Hides the modal.
    hideuserlist(event){
        this.showuserlist = false;
    }

    // Updating Department Discrepancy Values
    updatedeptdiscvalues(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.newdeptdiscrepancy[targetname] = targetvalue;
        if(targetname == 'departmentid'){
            var ecardid = this.ecardid;
            var departmentId = targetvalue;
            this.moddifydefectpickvalues(targetvalue);
             var ecardiddeptid = {ecard_id:ecardid ,dept_id:departmentId};
            getDepartmentOperations({ecardiddeptid:JSON.stringify(ecardiddeptid)})
            .then(data => {
                var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
                this.deptsupervisorforselecteddept = prod_supervisor;
                this.buildstationoptions =  data.buildstationList;
                this.thisdepartmentbuildstations = this.getcompleteBuilstationlist(data);
                this.newdeptdiscrepancy.buildstation_id = undefined;
                var selectedbuildstation = this.thisdepartmentbuildstations[0];
                // Set Prod and QC also
                var allPRODlist = [];
                var allQClist = [];
                if(selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
                  allQClist = selectedbuildstation.QClist;
                }
                
                if(this.deptsupervisorforselecteddept.length != 0){
                 allPRODlist = this.deptsupervisorforselecteddept;
                }
               

                var PRODlist = this.deptsupervisorforselecteddept;
                var QClist = selectedbuildstation.selectedqc;
                var emptylist = [];
                this.newdeptdiscrepancy.qclist = emptylist;
                this.newdeptdiscrepancy.prodlist = emptylist;
                this.newdeptdiscrepancy.allPRODlist = allPRODlist;
                this.newdeptdiscrepancy.allQClist = allQClist;
             }).catch(error => {
            this.error = error;
            this.showmessage('Data fetch failed.','Something unexpected occured. Please contact your Administrator.','error');
            });
        }
        if(targetname == 'buildstation_id'){
            var buildstationId = targetvalue;
            var selectedbuildstation;
            for(var bs in this.thisdepartmentbuildstations){
                if(buildstationId.toString() == this.thisdepartmentbuildstations[bs].buildstation_id.toString()){
                 selectedbuildstation = this.thisdepartmentbuildstations[bs];
                }
            }
            this.newdeptdiscrepancy.buildstation_id = selectedbuildstation.buildstation_id.toString();
            
        }
    }
    // For getting Buildstation Details on department change for Department Discrepancy.
    getcompleteBuilstationlist(data){
        let workstationdata = data.builstationMapWrapper.workcenter; 
        var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
        this.deptsupervisorforselecteddept = prod_supervisor;
        let modifiedworkstationdata = [];
        var QC  = modifieduserlist(data.builstationMapWrapper.qc);
        if(workstationdata.length != 0){
            for(var wc in workstationdata){
                let workcentre = workstationdata[wc];
                let workcenter_id = workcentre.workcenter_id;
                let workcentername = workcentre.workcentername;
                for(var bs in workcentre.buildstation){
                    var buildstation = workcentre.buildstation[bs];
                    var modifiedvalidationlist = getmodifiedvalidationlist(buildstation);
                    var PROD = modifieduserlist(buildstation.prod);
                    var selectedprod = getselectedformandetails(buildstation);
                    var selectedqc = modifieduserlist([buildstation.qc_approvedby_id]);
                    var bsstatus;
                    if(buildstation.status == null){
                        bsstatus = 'open';
                    }
                    else{
                        bsstatus = buildstation.status; 
                    }
                    // Since dummydata
                    var s = buildstation.buildstation_code;
                    var bscode ;
                    if(s.includes('.')){
                        bscode = s.substring(0, s.indexOf('.')+5);
                    }
                    else{
                        bscode= s;
                    }
                    var modifiedwsdata = {
                        workcenter_id : workcenter_id,
                        ecard_operation_log_id : buildstation.ecard_operation_log_id,
                        workcentername : workcentername,
                        operation : buildstation.operation,
                        hasdescrepancy: buildstation.has_descrepancy != undefined ?  buildstation.has_descrepancy : false,
                        status    : bsstatus,
                        buildstation_id : buildstation.buildstation_id,
                        buildstation_code : bscode,
                        validationlist : modifiedvalidationlist,
                        selectedprod : selectedprod,
                        selectedqc : selectedqc,
                        PRODlist : PROD,
                        QClist : QC
                    };
                    modifiedworkstationdata.push(modifiedwsdata);
                }
            }
        }
        return modifiedworkstationdata;
    }
    // Update the values of QC and PROD when changed in Departmental Discrepancy Modal.
    updateuserselectondeptdesc(event){
        var detail = event.detail;
        if(detail.type == 'QC'){
            this.newdeptdiscrepancy.qclist = detail.userlist;
        }
        if(detail.type == 'Production Supervisor'){
            this.newdeptdiscrepancy.prodlist = detail.userlist;
        }
    }
    // Hide Add Departmental Discrepancy Modal
    hideDescrepancyAdd(event){
        this.adddescrepancymodal = false;
        this.deletetempattachments();
    }
    // For updating Operational Discrepancy values on update from modal.
    updateoperationaldiscvalues(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.newoperationaldiscrepancy[targetname] = targetvalue;
    }
    // To Update the values of QC and PROD when changed in Operational Discrepancy Modal.
    updateuserselectonopdesc(event){
        var detail = event.detail;
        if(detail.type == 'QC'){
            //this.newoperationaldiscrepancy.qclist = detail.userlist;
        }
        if(detail.type == 'PROD'){
            this.newoperationaldiscrepancy.prodlist = detail.userlist;
        }
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

    // Handle Status Change (Action) for Operations Tab.
    handleopertionaction(event){
        var action = event.detail.action;
        var selectedbsid = event.detail.buildstationid;
        var ecard_id = this.ecardid;
        var departmentid = this.departmentId;
        var todaydate = new Date();
        let selectedbuildstation = getselectedbuildstationDetails(selectedbsid,this.modifiedbuildstations); 
        this.buildstationfornewdisc = [{'label':selectedbuildstation.buildstation_code, 'value':selectedbsid.toString()}];
        this.moddifydefectpickvalues(departmentid);
        var allPRODlist = [];
        var allQClist = [];
        if(selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
            allQClist = selectedbuildstation.QClist;
        }
        if(selectedbuildstation.PRODlist!=null && selectedbuildstation.PRODlist.length != 0){
            allPRODlist = selectedbuildstation.PRODlist;
        }
        var PRODlist = selectedbuildstation.selectedprod;
        var QClist = selectedbuildstation.selectedqc;
        var statuswithin;
        if (action == "Reject") {
        }
        else{
            if(action == 'Mark as done'){
                statuswithin = 'resolve';
                this.qccaptureaction=false;
            }
            if(action == 'Verify'){
               statuswithin = 'approve';
               this.qccaptureaction=true;
    
            }
            if(action == 'Cancel'){
               statuswithin = 'open';
               this.qccaptureaction=true;
            }
            if(action == 'Cancel Verified'){
               //statuswithin = 'resolve';
               statuswithin = 'open';
               this.qccaptureaction=true;
            }
            if(action == 'Cancel Rejected'){
               //statuswithin = 'resolve';
               statuswithin = 'open';
               this.qccaptureaction=true;
            }
            // Update Buid Stations locally
            for(var bs in this.modifiedbuildstations){
                  if(this.modifiedbuildstations[bs].buildstation_id == selectedbsid){
                     this.modifiedbuildstations[bs].status = statuswithin;
                    }
            } 
            // Update Buildstation changes to server.
            this.updatebuildstationtoServer(selectedbsid);    
        }
    }

    @track selectedtabopdiscrepnacy = 'discrepancy';
    // to show the tab when posting op.discrepancy
    get isselecteddiscrepancy(){
        return this.selectedtabopdiscrepnacy == 'discrepancy';
    }

    // To traverse between New Discrepancy/New Shortage tab when raising from Operations Tab.
    tabClick(event) {
        //this.deletetempattachments();
        this.selectedtabopdiscrepnacy = event.currentTarget.dataset.id;
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
        
     }

    // Raising Operational Discrepancy and Setting discrepancy defaults.
    async showopdiscrepancymodal(event){
        this.selectedtabopdiscrepnacy = 'discrepancy';
        this.s3tempurlfornewdiscrepancy = [];
        this.isdescripancybyrejection = false;
        var selectedbsid = event.currentTarget.dataset.id;
        var ecard_id = this.ecardid;
        var departmentid = this.departmentId;
        this.moddifydefectpickvalues(departmentid);
        var todaydate = new Date();
        let selectedbuildstation = getselectedbuildstationDetails(selectedbsid,this.modifiedbuildstations);
        var PRODlist = selectedbuildstation.selectedprod;
        var QClist = selectedbuildstation.selectedqc;
        var allPRODlist = [];
        var allQClist = [];
        if(selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
            allQClist = selectedbuildstation.QClist;
        }
        if(selectedbuildstation.PRODlist!=null && selectedbuildstation.PRODlist.length != 0){         
            allPRODlist =selectedbuildstation.PRODlist;
        }
        if(allPRODlist.length==0){
            var userdetails=[];
            await  getcrewingsuserslist({deptid:this.departmentId})
             .then((result) => {
             userdetails = JSON.parse(result.responsebody).data.user;
             userdetails = this.removeDuplicates(userdetails);//todo
             })
             .catch((error) => {
             });
            allPRODlist = userdetails.length>0?modifieduserlist(userdetails):userdetails;
        }
        var selectedbus = `${this.busname}, ${this.buschasisnumber}`;
            this.newoperationaldiscrepancy = {
                ecard_id : ecard_id,
                description : null,
                selectedbus : selectedbus,
                departmentid : selectedbuildstation.department_id.toString(),//departmentid
                ecard_operation_log_id : selectedbuildstation.ecard_operation_log_id,
                busname : this.busname,
                buschasisnumber : this.buschasisnumber,
                date : getmoddeddate(todaydate),
                priority : 'Normal',
                defectcode : undefined,
                buildstation_id : selectedbsid,
                buildstation_code : selectedbuildstation.buildstation_code,
                operation : selectedbuildstation.operation,
                prodlist : PRODlist,
                qclist : QClist,
                allPRODlist : allPRODlist,
                allQClist : allQClist
            };
        this.buildstationfornewdisc = [{'label':selectedbuildstation.buildstation_code, 'value':selectedbsid.toString()}];
        this.getbuspartdetails(ecard_id, selectedbsid);
        var newpartshortage = {
            'buspart_id' : null,
            'buspart_no' : undefined,
            'buspart_name' : undefined,
            'quantity' : undefined,
            'po_no' : undefined,
            'cut_off_date' : undefined,
            'selectedbus' : selectedbus,
            'discrepancy_type': 'partshortage',
            'department_id' : departmentid,
            'ecard_id' : ecard_id,
            'priority' : 'Normal',
            'buildstation_id' : selectedbsid, 
            'buschasisnumber' : this.buschasisnumber,
            'date' : getmoddeddate(todaydate),
            'qclist' : QClist,
            'allQClist' : allQClist,
            'prodlist' : PRODlist,
            'allPRODlist' : allPRODlist,
            'is_b_whs_kit': false,
            'is_long_term': false,
            'is_ship_short': false
        };   
        this.newpartshortage = newpartshortage;
        this.addoperationaldescrepancymodal = true;
    }    
    // Hide Operational Discrepancy Tab and refresh view.
    hideoperationalDescrepancyAdd(event){
        this.addoperationaldescrepancymodal = false;
        this.deletetempattachments();
        this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
        
    }
    // Adding the Discrepancy to the Server.
    addnewopdiscrepancy(event){
         // Check Validations
        const allValid = [...this.template.querySelectorAll('.validValue')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        let qcprodcheck = true;
        if(this.newoperationaldiscrepancy.qclist.length == 0 || this.newoperationaldiscrepancy.prodlist.length == 0){
            qcprodcheck = false;
        }
        // && qcprodcheck
        if (allValid) {
            //Submit information on Server
            event.target.disabled = true;
            var newoperationaldiscrepancy = this.newoperationaldiscrepancy;
            let selectedbsid = this.newoperationaldiscrepancy.buildstation_id;
        // If descrepancy by caused by rejection need to update the buildstation status
        var newdiscrequestbody = {
            "discrepancy_type": "buildstation",
            "discrepancy_priority": newoperationaldiscrepancy.priority,
            "discrepancy_status": "open",
            "ecard_id": newoperationaldiscrepancy.ecard_id,
            "department_id": newoperationaldiscrepancy.departmentid,
            "discrepancy": newoperationaldiscrepancy.description,
            "buildstation_id" : newoperationaldiscrepancy.buildstation_id,
            "dat_defect_code_id" : newoperationaldiscrepancy.defectcode
        };
        
        if(newoperationaldiscrepancy.qclist.length != 0){
            newdiscrequestbody["assigend_qc_id"] =  newoperationaldiscrepancy.qclist[0].Id;
        }

        if(this.s3tempurlfornewdiscrepancy.length != 0){
            newdiscrequestbody["s3_file_paths"] = JSON.stringify(this.s3tempurlfornewdiscrepancy);
        }
        else{
            newdiscrequestbody["s3_file_paths"] = null;
        }
        var withforemans = this.updateformans(JSON.stringify(newdiscrequestbody),newoperationaldiscrepancy.prodlist);
            raiseBsDiscrepancy({requestbody:JSON.stringify(withforemans)})
              .then(data => {
                  if(data.isError){
                    event.target.disabled = false;  
                    this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                  }
                  else{
                    this.showmessage('Added new Build Station Discrepancy.','A build station discrepancy was successfully raised.','success');
                    this.addoperationaldescrepancymodal = false;
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                    
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
     
              });

        //}
        } else {
            this.showmessage('Please fill all required fields.','Please fill required and update all blank form entries.','warning');
        }
    }
    // Showing the Discrepancy within operation modal.
    showdiscrepancylistmodal(event){
        var selectedbsid = event.currentTarget.dataset.id;
        let selectedbuildstation = getselectedbuildstationDetails(selectedbsid, this.modifiedbuildstations);
        var requireddata = {
            department: selectedbuildstation.departmentcode,
            selecteddepartmentId: selectedbuildstation.department_id,
            busname: this.busname,
            ecardid: this.ecardid,
            buschasisnumber: this.buschasisnumber,
            bussequence: this.seq,
            buildstationId: selectedbsid,
            buildstationcode: selectedbuildstation.buildstation_code,
            departmentIdMap: this.departmentIdMap,
            scheduleflow: this.scheduleflow,
            scheduledata: this.scheduledata
        };
        var filterconditions = JSON.stringify(requireddata);
        localStorage.removeItem('requiredfilters');
        localStorage.setItem('requiredfilters', filterconditions);
        // Navigate to a specific CustomTab.
        this[NavigationMixin.Navigate]({
             type: 'standard__navItemPage',
             attributes: {
                     apiName: 'Selected_Discrepancies'
             }    
    });
    }

    // Showing the Discrepancy within operation modal.
    canceldiscrepancylistmodal(event){
        this.discrepancylistmodal = false;
    }

    // Update Changes on Build Station Operation to Server for Operations Tab (PUT/POST)
    updatebuildstationtoServer(buildstationid){
        let selectedbuildstation = getselectedbuildstationDetails(buildstationid,this.modifiedbuildstations);
        
        if(selectedbuildstation.ecard_operation_log_id == null){
            var requestbody = {
                    "ecard_id": this.ecardid,
                    "department_id": this.departmentId,
                    "workcenter_id": selectedbuildstation.workcenter_id,
                    "buildstation_id": selectedbuildstation.buildstation_id,
                    "status": selectedbuildstation.status,
                    "modified_date" : selectedbuildstation.modified_date
             };
             //if(selectedbuildstation.selectedqc.length != 0){
            if(this.qccaptureaction && this.qccapturerole){
                requestbody["qc_approvedby_id"] =  this.loggedinuser.appuser_id;
                this.qccaqccaptureaction = false;
            }
            var requestbodywithforeman = this.updateformans(JSON.stringify(requestbody),selectedbuildstation.selectedprod);
            insertOperationlog({requestbody:JSON.stringify(requestbodywithforeman)})
              .then(data => {
                  if(data.isError){
                    if(data.errorMessage == 202){
                        this.showmessage('Sorry we could not complete the operation.',JSON.parse(data.responsebody).data.validation_message,'error');  
                    }
                    else{
                      this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                    }
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                  else{
                    this.showmessage('Record Update Successful.','The record was successfully updated.','success');
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                    
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
             });
        }
        else{
            // PUT
            var requestbody = {
                "ecard_operation_log_id": selectedbuildstation.ecard_operation_log_id,
                "status": selectedbuildstation.status,
                "modified_date" : selectedbuildstation.modified_date
            };
            /*if(selectedbuildstation.selectedqc.length != 0){
                requestbody["qc_approvedby_id"] =  selectedbuildstation.selectedqc[0].userid;
            }*/
            if(this.qccaptureaction && this.qccapturerole){
                requestbody["qc_approvedby_id"] =  this.loggedinuser.appuser_id;
                this.qccaqccaptureaction = false;
            }
           var requestbodywithforeman = this.updateformans(JSON.stringify(requestbody),selectedbuildstation.selectedprod);
           updateOperationlog({requestbody:JSON.stringify(requestbodywithforeman)})
              .then(data => {
                  if(data.isError){
                    if(data.errorMessage == 202){
                        this.showmessage('Sorry we could not complete the operation.',JSON.parse(data.responsebody).data.validation_message,'error');  
                    }
                    else{
                      this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                    }
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                  else{
                    this.showmessage('Record Update Successful.','The record was successfully updated.','success');
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                    
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
             });
        }
    }

    // Adding Departmental Discrepancy to Server.
    addDepartmentaldiscrepancy(event){
        // Check Validations
         const allValid = [...this.template.querySelectorAll('.validValueDepartment')]
         .reduce((validSoFar, inputCmp) => {
                     inputCmp.reportValidity();
                     return validSoFar && inputCmp.checkValidity();
         }, true);
        let qcprodcheck = true;
        if(this.newdeptdiscrepancy.qclist.length == 0 || this.newdeptdiscrepancy.prodlist.length == 0){
         qcprodcheck = false;
        }
        // && qcprodcheck
        if (allValid) {
            event.target.disabled = true;
            let newdeptdiscr = this.newdeptdiscrepancy;
            newdeptdiscr.buildstation_id=newdeptdiscr.buildstation_id==undefined?null:newdeptdiscr.buildstation_id;
         //Submit information on Server
         var newdiscrequestbody = {
            "discrepancy_type": "department",
            "discrepancy_priority": newdeptdiscr.priority,
            "discrepancy_status": "open",
            "ecard_id": newdeptdiscr.ecard_id,
            "department_id": newdeptdiscr.departmentid,
            "discrepancy": newdeptdiscr.description,
            "dat_defect_code_id" : newdeptdiscr.defectcode,
            "buildstation_id" : newdeptdiscr.buildstation_id   
           };
           if(newdeptdiscr.qclist.length != 0){
            newdiscrequestbody["assigend_qc_id"] =  newdeptdiscr.qclist[0].Id;
        }
        if(this.s3tempurlfornewdiscrepancy.length != 0){
            newdiscrequestbody["s3_file_paths"] = JSON.stringify(this.s3tempurlfornewdiscrepancy);
        }
        else{
            newdiscrequestbody["s3_file_paths"] = null;
        }
        var withforemans = this.updateformans(JSON.stringify(newdiscrequestbody),newdeptdiscr.prodlist);
        raiseDepartmentDiscrepancy({requestbody:JSON.stringify(withforemans)})
              .then(data => {
                  if(data.isError){
                    event.target.disabled = false;
                    this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                  }
                  else{
                    this.showmessage('Added new Department Discrepancy.','A new department discrepancy was successfully raised.','success');
                    event.target.disabled = false;
                    this.adddescrepancymodal = false;
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                    
              }).catch(error => {
              this.error = error;
              event.target.disabled = false;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
     
              });
        }
        else {
            this.showmessage('Please fill all required fields.','Please fill required and update all blank form entries.','warning');
        } 
    }

    // Capitalize string passed Display purposes.
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
        this.statusascomment = true;
        if(action == 'Mark as done'){
            // Check Validations
            this.qccaptureaction=false;
            if(this.selecteddiscrepancy.isdepartmentdiscrepancy){
              this.showmessage('Please fill all required fields.','Please fill required and update all blank form entries.','warning');
              this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
              this.isdelenabled=false;
              if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status.toLowerCase() =='open')){
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
                this.qccaptureaction=true;
            }
            if(action == 'Verify'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('approve');
                this.selecteddiscrepancy.discrepancy_status ='approve';
                this.qccaptureaction=true;
            }
            if(action == 'Cancel'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open');
                this.selecteddiscrepancy.discrepancy_status ='open';
            }
            if(action == 'Cancel Verified'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
                this.qccaptureaction=true;
            }
            if(action == 'Cancel Rejected'){
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
                this.qccaptureaction=true;
            }
            this.updatediscrepancytoserver();
        }
        // Need to call the update to server
    }
    // To show Discrepancy Details view
    async showdiscdetails(event){
        var selecteddiscrepancylogid = event.currentTarget.dataset.id;
        for(var i in this.modifieddiscrepancyList){
            if(this.modifieddiscrepancyList[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selecteddiscrepancy = this.modifieddiscrepancyList[i];
            }
        }
        if(this.selecteddiscrepancy.prod.length==0){
            var userdetails=[];
            await getcrewingsuserslist({deptid:this.selecteddiscrepancy.departmentid})
                        .then((result) => {
                userdetails = JSON.parse(result.responsebody).data.user;
                userdetails = this.removeDuplicates(userdetails);//todo
                this.selecteddiscrepancy.prod = userdetails.length>0?modifieduserlist(userdetails):userdetails;
            })
            .catch((error) => {
            });
        }
        this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
        this.isdelenabled=false;
        if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status.toLowerCase() =='open')){
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
                this.showmessage('Failed to add Comments.','Something unexpected occured. Please contact your Administrator.','error');
            }
            else{
                this.showmessage('Comment saved successfully.','Your Comment was recorded successfully.','success');
                this.getselecteddiscrepancycomments(ecarddiscrepancylogid);
            }
           
        })
        .catch(error => {
            this.showmessage('Failed to add Comments.','Something unexpected occured. Please contact your Administrator.','error');
        });
        

    }

    // Add the discrepancy status change as comment
    addstatusasdiscrepancycomment(discrepancylogid,commenttext){
        var ecarddiscrepancylogid = discrepancylogid;
        var newcommentbody = {
            "ecard_discrepancy_log_id"  : discrepancylogid,             
            /*"commentedby_id": event.detail.loggedinuserid,*/               
            "discrepancy_comments": commenttext
        };
        //alert(JSON.stringify(newcommentbody)); 
        addnewComment({requestbody:JSON.stringify(newcommentbody)})
        .then(data => {
            if(data.isError){
                //this.showmessage('Failed to add Comments.','Something unexpected occured. Please contact your Administrator.','error');
            }
            else{
                //this.showmessage('Comment saved successfully.','Your Comment was recorded successfully.','success');
                this.getselecteddiscrepancycomments(ecarddiscrepancylogid);
            }
           
        })
        .catch(error => {
            //this.showmessage('Failed to add Comments.','Something unexpected occured. Please contact your Administrator.','error');
        });
        

    }
    
    // Get Comments of selected discrepancy
    getselecteddiscrepancycomments(selecteddiscrepancylogid){
        var requesthead =  selecteddiscrepancylogid.toString();
        getAllComments({discrepancylogid:requesthead})
        .then(data => {
            if(data.isError){
                this.showmessage('Failed to fetch Comments.','Something unexpected occured. Please contact your Administrator.','error');
            }
            else{
                var commentsresponse = JSON.parse(data.response).data.discrepancycomments;
                var commentlist = [];
                if(commentsresponse.length !=0){
                    for(var comment in commentsresponse){
                        var com = commentsresponse[comment];
                        if(com.commentedby_id !=null && com.commentedby_id !=undefined){
                            var name = `${com.commentedby_id.first_name} ${com.commentedby_id.last_name}`;
                            var dispname=`${com.commentedby_id.first_name} ${com.commentedby_id.last_name} (${com.commentedby_id.employee_number})`;
                            var emp_id=`${com.commentedby_id.employee_number}`;
                            var initials = name.match(/\b\w/g) || [];
                            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                            var moddedcomment = {
                                created_by : name,
                                initials : initials,
                                fullname : name,
                                displayname:dispname,
						        empid:emp_id,
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
            this.showmessage('Failed to fetch Comments.','Something unexpected occured. Please contact your Administrator.','error');
        });
    }
    // Update user selection of selected discrepancy
    updateuserselection(event){
        var detail = event.detail;
        if(detail.type == 'QC'){
            this.selecteddiscrepancy.assigend_qc_id = detail.userlist;
        }
        if(detail.type == 'PROD'){
            this.selecteddiscrepancy.assignedprod = detail.userlist;
        }
        this.updatediscrepancytoserver();
    }

    // To disable fields like Component, Cut In Date, Root Cause once Department discrepancy is Marked as Done. 
    get disablecomponentdates(){
        return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !this.permissionset.dept_discrepancy_update.write;//vishwas
    }

    // Handle discrepancy status change from modal
    handlediscrepancyactions(event){
        var action = event.detail.action;
        var passedallvalidation = true;
        if (action == "Reject") {
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
            this.selecteddiscrepancy.discrepancy_status ='open'; //reject
        }
        if(action == 'Verify'){
            this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('approve');
            this.selecteddiscrepancy.discrepancy_status ='approve';
            this.qccaptureaction=true;
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
                this.showmessage('Fill all required fields.','Please fill in all the required fields.','warning');
            }
            }
            else{
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('open');
                this.selecteddiscrepancy.discrepancy_status ='open';
            }
            
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
        if(passedallvalidation){
            this.statusascomment = true;
            this.updatediscrepancytoserver();
        }
    }

    // Update other fields of selected discrepancy
    updateselecteddiscrepancy(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.selecteddiscrepancy[targetname] = targetvalue;
    }

    // To update the discrepancy changes to server.
    updatediscrepancytoserver(event){
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
            "modified_date" : discrepancytobeupdated.modified_date,
            "buildstation_id": discrepancytobeupdated.buildstation_id
        };
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
                        this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    }
                    else{
                      this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                      this.discdetailsmodal = false;
                      this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    }
                } else {
                    this.selecteddiscrepancy['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date;  
                    this.showmessage('Record Updated.','Record updated Successfully.','success');
                    if (this.statusascomment) {
                        this.statusascomment = false;
                        var response = JSON.parse(data.operationlogresponse).data;
                        this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
                    }
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                }
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
     
              });
    }

    // Section for Part Shortage Actions and Operations.
    // To get the Bus Part Details
    getbuspartdetails(ecardid, buildstationid){
        // Get Bus Part Details
        var ecardidbuildstation = {
            "ecard_id" : ecardid,
            "build_station_id" : buildstationid
        };
        getBusPartdetails({ecardidbuildstationid : JSON.stringify(ecardidbuildstation)})
       .then(data => {
                  if(data.isError){
                    this.showmessage('Sorry we could not fetch the parts list.','Something unexpected occured. Please contact your Administrator.','error');
                  }
                  else{
                      var partsdata = JSON.parse(data.responsebody).data;
                      var partnumberlist = [];
                      var partdetails = [];
                      var nopartfound = {
                        "buspart_id": null,
                        "buspart_name": undefined,
                        "buspart_no": 'Part No. Not Found',
                        "product_category": null,
                        "unit_of_measure": undefined
                      };
                     partnumberlist.push('Part No. Not Found');
                     partdetails.push(nopartfound);
                      if(partsdata.bus_parts.length != 0){
                        for(var index in partsdata.bus_parts){
                            partdetails.push(partsdata.bus_parts[index]);
                            partnumberlist.push(partsdata.bus_parts[index].buspart_no + ' ('+partsdata.bus_parts[index].buspart_name +')');
                        }
                      }
                      this.partnumberdetails = partdetails;
                      this.partnumberlist = partnumberlist;
                  }
             }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
     
              });
    }

    get buildstationselectedpart(){
        if(this.newpartshortage.buildstation_id != undefined){
            return true;
        }
        else{
            return false;
        }
    }
    // When Selecting a partnumber filling the description accordingly.
    onpartnumberselection(event){
        if (event.detail.selectedRecord != undefined) {
            this.newpartshortage.buspart_no = event.detail.selectedRecord;
            var partnoname=event.detail.selectedRecord;
            var selectedbuspart = partnoname.substring(0,partnoname.indexOf(' '));
            for(var i in this.partnumberdetails){
                if(selectedbuspart == this.partnumberdetails[i].buspart_no){
                    this.newpartshortage.buspart_name = this.partnumberdetails[i].buspart_name;
                    this.newpartshortage.buspart_id = this.partnumberdetails[i].buspart_id;
                }
            }
            if (event.detail.incident != undefined && event.detail.incident == 'selection') {
                this.getPartsVendorBuyerDetails(selectedbuspart, this.newpartshortage, 'addnew');
                this.getVendorlistforparts(selectedbuspart);
            }
        }else{
            this.newpartshortage.buspart_no = 'Part No. Not Found';
            this.newpartshortage.buspart_name = undefined;
            this.newpartshortage.buspart_id = null;
            //this.template.querySelector('[data-id="partmnumbersearch"]').connectedCallback();
        }
    }

    // When clearing a selected partnumber.
    onpartnumberclear(event){
        this.newpartshortage.buspart_no = undefined;
        this.newpartshortage.buspart_name = undefined;
        this.clearpartsvendordetails();
    }

    //To update other fields on user selection
    updatenewpartshortage(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.newpartshortage[targetname] = targetvalue;
        if(targetname == 'department_id'){
            var ecardid = this.ecardid;
            var departmentId = targetvalue;
            var ecardiddeptid = {ecard_id:ecardid ,dept_id:departmentId};
            getDepartmentOperations({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
            this.deptsupervisorforselecteddept = prod_supervisor;
            this.buildstationoptions =  data.buildstationList;
            this.thisdepartmentbuildstations = this.getcompleteBuilstationlist(data);
            var selectedbuildstation = this.thisdepartmentbuildstations[0];
            this.newpartshortage.buildstation_id = undefined;
            this.clearpartsvendordetails();//new requirement
            // Set Prod and QC also
            
            if(selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
                this.newpartshortage.allQClist = selectedbuildstation.QClist;
            }
            if(this.deptsupervisorforselecteddept.length != 0){
                this.newpartshortage.allPRODlist = this.deptsupervisorforselecteddept;
            }
            this.newpartshortage.qclist = [];
            this.newpartshortage.prodlist = this.deptsupervisorforselecteddept;
            
        }).catch(error => {
            this.error = error;
            this.showmessage('Data fetch failed.','Something unexpected occured. Please contact your Administrator.','error');
        });
        }
        if(targetname == 'buildstation_id'){
            var buildstationdetails = this.thisdepartmentbuildstations;
            var buildstationId = targetvalue;
            var selectedbuildstation;
            for(var bs in buildstationdetails){
                if(buildstationId.toString() == buildstationdetails[bs].buildstation_id.toString()){
                 selectedbuildstation = buildstationdetails[bs];
                }
            }
            this.newpartshortage.buildstation_id = this.newpartshortage.buildstation_id=='Unknown'?-1:selectedbuildstation.buildstation_id.toString();
            // Reset Part Number data
            this.onpartnumberclear();
            //this.template.querySelector('c-operation-actions-component').clear();
            if(this.template.querySelector('[data-id="partmnumbersearch"]') != null){
                this.template.querySelector('[data-id="partmnumbersearch"]').clear();
            } 
            if(buildstationId!='Unknown'){
                this.getbuspartdetails(this.ecardid, this.newpartshortage.buildstation_id);
            }else{
                var partnumberlist = [];
                var partdetails = [];
                var nopartfound = {
                        "buspart_id": null,
                        "buspart_name": undefined,
                        "buspart_no": 'Part No. Not Found',
                        "product_category": null,
                        "unit_of_measure": undefined
                    };
                partnumberlist.push('Part No. Not Found');
                partdetails.push(nopartfound);
				this.partnumberdetails = partdetails;
                this.partnumberlist = partnumberlist;
                this.onpartnumberselection(event);
            }
            // Set Prod and QC also
            
            var allPRODlist = [];
            var allQClist = [];
            var PRODlist = [];
            if(buildstationId!='Unknown' && selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
                allQClist = selectedbuildstation.QClist;
            }
            
                if(buildstationId!='Unknown' && selectedbuildstation.PRODlist!=null && selectedbuildstation.PRODlist.length != 0){
                    allPRODlist = selectedbuildstation.PRODlist;
                }
                PRODlist = buildstationId!='Unknown'?selectedbuildstation.selectedprod:[];
           
            var QClist = buildstationId!='Unknown'?selectedbuildstation.selectedqc:[];
            this.newpartshortage.qclist = QClist;
            this.newpartshortage.prodlist = PRODlist;
            this.newpartshortage.allPRODlist = allPRODlist;
            this.newpartshortage.allQClist = allQClist;
        }
    }

    // Update user selection on new Part Shortage
    updateuserselectonnewpartshortage(event){
        var detail = event.detail;
        if(detail.type == 'QC'){
            this.newpartshortage.qclist = detail.userlist;
        }
        if(detail.type == 'PROD'){
            this.newpartshortage.prodlist = detail.userlist;
        }
    }

    // Add New Part Shortage to Server 
    addnewpartshortage(event){
        // Check Validations
        const allValid = [...this.template.querySelectorAll('.partshortagevalidation')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid && this.newpartshortage.buspart_no != undefined) {
         //Submit information on Server
         event.target.disabled = true;
         var partshortageaddmodalvalues = this.newpartshortage;
         var ispartavailable = true;
         var part_shortage;
         if(partshortageaddmodalvalues.buspart_no == 'Part No. Not Found'){
            ispartavailable = false;
            part_shortage = {
                "buspart_id": null,
                "quantity": partshortageaddmodalvalues.quantity, 
                "po_no" : partshortageaddmodalvalues.po_no,
                "custom_part_name" : partshortageaddmodalvalues.buspart_name
               };
         }
         else{
            part_shortage = {
                "buspart_id": partshortageaddmodalvalues.buspart_id, 
                "quantity": partshortageaddmodalvalues.quantity, 
                "po_no" : partshortageaddmodalvalues.po_no
               };
         }
            part_shortage['buyer'] = partshortageaddmodalvalues.buyer == undefined ? null : partshortageaddmodalvalues.buyer;
            part_shortage['planner_code'] = partshortageaddmodalvalues.planner_code == undefined ? null : partshortageaddmodalvalues.planner_code;
            part_shortage['vendor_number'] = partshortageaddmodalvalues.vendor_number == undefined ? null : partshortageaddmodalvalues.vendor_number;
            if (partshortageaddmodalvalues.vendor_name == undefined) {
                if (this.partsvendorslist.length > 0) {
                    part_shortage['vendor_name'] = this.partsvendorslist[0].vendor_name;
                    part_shortage['vendor_number'] = this.partsvendorslist[0].vendor_number;
                }
                else
                    part_shortage['vendor_name'] = null;
            }
            else {
                for (var item in this.partsvendorslist) {
                    var vendordetails = this.partsvendorslist[item];
                    if (vendordetails.vendor_number == partshortageaddmodalvalues.vendor_number) {
                        part_shortage['vendor_name'] = vendordetails.vendor_name;
                    }

                }
            }
            part_shortage['carrier_text'] = partshortageaddmodalvalues.carrier_text == undefined ? null : partshortageaddmodalvalues.carrier_text;
            part_shortage['carrier_arrival_text'] = partshortageaddmodalvalues.carrier_arrival_text == undefined ? null : partshortageaddmodalvalues.carrier_arrival_text;
            part_shortage['shortage_cause_id'] = partshortageaddmodalvalues.shortage_cause_id == undefined ? null : partshortageaddmodalvalues.shortage_cause_id;
            part_shortage['tracking'] = partshortageaddmodalvalues.tracking == undefined ? null : partshortageaddmodalvalues.tracking;
            part_shortage['date_received'] = partshortageaddmodalvalues.date_received == undefined ? null : this.modifydate(partshortageaddmodalvalues.date_received);
            part_shortage['is_b_whs_kit'] = partshortageaddmodalvalues.is_b_whs_kit == undefined ? null : partshortageaddmodalvalues.is_b_whs_kit;
            part_shortage['is_long_term'] = partshortageaddmodalvalues.is_long_term == undefined ? null : partshortageaddmodalvalues.is_long_term;
            part_shortage['is_ship_short'] = partshortageaddmodalvalues.is_ship_short == undefined ? null : partshortageaddmodalvalues.is_ship_short;
            part_shortage['remarks'] = partshortageaddmodalvalues.remarks == undefined ? null : partshortageaddmodalvalues.remarks;
         var bsid= partshortageaddmodalvalues.buildstation_id==-1?null:partshortageaddmodalvalues.buildstation_id;
         var newpartshortagebody = {
                "component": null,  
                "cut_off_date": new Date(partshortageaddmodalvalues.cut_off_date),
                "dat_defect_code_id": "21",
                "department_id": partshortageaddmodalvalues.department_id,
                "discrepancy": partshortageaddmodalvalues.buspart_name,
                "discrepancy_priority": partshortageaddmodalvalues.priority,
                "discrepancy_status": "open",
                "discrepancy_type": "partshortage", 
                "ecard_id": partshortageaddmodalvalues.ecard_id,  
                "root_cause": null,
                "buildstation_id" : bsid,
                "part_shortage" : part_shortage
            };
            if(partshortageaddmodalvalues.qclist.length != 0){
                newpartshortagebody["assigend_qc_id"] =  partshortageaddmodalvalues.qclist[0].Id;
            }
            if(this.s3tempurlfornewdiscrepancy.length != 0){
                newpartshortagebody["s3_file_paths"] = JSON.stringify(this.s3tempurlfornewdiscrepancy);
            }
            else{
                newpartshortagebody["s3_file_paths"] = null;
            }
            
            var withforemans = this.updateformans(JSON.stringify(newpartshortagebody),partshortageaddmodalvalues.prodlist);
            raisenewShortage({requestbody:JSON.stringify(withforemans)})
              .then(data => {
                  if(data.isError){
                    this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                    event.target.disabled = false;
                  }
                  else{
                    this.showmessage('Added new Shortage.','A new shortage was successfully raised.','success');
                    this.partshortageaddmodal = false;
                    this.addoperationaldescrepancymodal = false;
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                  }
                    
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
              event.target.disabled = false;
              });
           
        }
        else{
            this.showmessage('Please fill all required fields.','Please fill required and update all blank form entries.','warning');
        }
    }

    @track selectedshortage;
    @track partshortagedetailsmodal = false;
    // To Show Part Shortage Detail
    async showpartshortagedetail(event){
        this.isupdated = false;
        var selecteddiscrepancylogid = event.currentTarget.dataset.id;
        for(var i in this.modifiedshortageslist){
            if(this.modifiedshortageslist[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selectedshortage = this.modifiedshortageslist[i];
            }
        }
        if(this.selectedshortage.allprodlist.length==0){
            var userdetails=[];
            await getcrewingsuserslist({deptid:this.selectedshortage.departmentid})
                        .then((result) => {
                userdetails = JSON.parse(result.responsebody).data.user;
                userdetails = this.removeDuplicates(userdetails);//todo
                this.selectedshortage.allprodlist = userdetails.length>0?modifieduserlist(userdetails):userdetails;
            })
            .catch((error) => {
            });
        }
        this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
        this.getVendorlistforparts(this.selectedshortage.buspart_no);
        if (this.selectedshortage.vendor_name == null) {
            this.getPartsVendorBuyerDetails(this.selectedshortage.buspart_no, this.selectedshortage, 'update');
        }
        if (this.selectedshortage.buyer != null && this.selectedshortage.planner_code != null) {
            this.selectedshortage.buyer_code = this.selectedshortage.buyer + ' / ' + this.selectedshortage.planner_code;
        }
        this.isdelenabled=false;
        if(this.selectedshortage.isdeletable || (this.permissionset.shortage_delete.write && this.selectedshortage.discrepancy_status.toLowerCase() =='open')){
            this.isdelenabled=true;
        }
        this.partshortagedetailsmodal = true;

    }

    // To Hide Part Shortage Detail.
    hidepartshortagedetail(event){
        this.partshortagedetailsmodal = false;
    }

    // Update selected shortage fields.
    updateselectedshortage(event) {
        this.isupdated = true;
        var targetvalue;
        if (event.target.type == "checkbox") {
            targetvalue = event.target.checked;
        }
        else {
            targetvalue = event.target.value;
        }
        var targetname = event.target.name;
        this.selectedshortage[targetname] = targetvalue;
        // this.updatepartshortage(event);//timer triggered
    }

    updatepartshortage(event) {
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => { this.updatepartshortagetoserver(); }, 1000);
    }

    
    // Update user selection of selected shortage.
     updateuserpartshortage(event){
        var detail = event.detail;
        if(detail.type == 'QC'){
            this.selectedshortage.assigend_qc_id = detail.userlist;
        }
        if(detail.type == 'PROD'){
            this.selectedshortage.assignedprod = detail.userlist;
        }
        this.updatepartshortagetoserver();
        // Update to server
    }

    // To handle Part Shortage Actions.
    partshortageactionshandler(event){
        var action = event.detail.action;
        var selecteddiscrepancylogid = event.detail.buildstationid;
        for(var i in this.modifiedshortageslist){
            if(this.modifiedshortageslist[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selectedshortage = this.modifiedshortageslist[i];
            }
        }
        this.statusascomment = true;
        if(action == 'Mark as done'){
            this.qccaptureaction=false;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
            this.isdelenabled=false;
            if(this.selectedshortage.isdeletable || (this.permissionset.shortage_delete.write && this.selectedshortage.discrepancy_status.toLowerCase() =='open')){
                this.isdelenabled=true;
            }
            
        }
        else{
            if (action == "Reject") {
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
                this.selectedshortage.discrepancy_status ='open'; //reject
                this.qccaptureaction=true;
            }
            if(action == 'Verify'){
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('approve');
                this.selectedshortage.discrepancy_status ='approve';
                this.qccaptureaction=true;
            }
            if(action == 'Cancel'){
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open');
                this.selectedshortage.discrepancy_status ='open';
                this.qccaptureaction=true;
            }
            if(action == 'Cancel Verified'){
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selectedshortage.discrepancy_status ='resolve';
                this.qccaptureaction=true;
            }
            if(action == 'Cancel Rejected'){
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selectedshortage.discrepancy_status ='resolve';
                this.qccaptureaction=true;
            }
            
        }
        this.updatepartshortagetoserver();
        // update changes to server.
    }

    // Handle actions from Part Shortage Detail modal.
    handlepartshortageactions(event){
        var action = event.detail.action;
        var passedallvalidation = true;
        if (action == "Reject") {
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
            this.selectedshortage.discrepancy_status ='open'; //reject
            this.qccaptureaction=true;
        }
        if(action == 'Verify'){
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('approve');
            this.selectedshortage.discrepancy_status ='approve';
            this.qccaptureaction=true;
        }
        if(action == 'Mark as done'){
            this.qccaptureaction=false;
           this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
           this.selectedshortage.discrepancy_status ='resolve';
           this.isdelenabled=false;
           this.selectedshortage.isdeletable =false;
         }
        if(action == 'Cancel'){
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open');
            this.selectedshortage.discrepancy_status ='open';
            this.qccaptureaction=true;
        }
        if(action == 'Cancel Verified'){
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
            this.qccaptureaction=true;
        }
        if(action == 'Cancel Rejected'){
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
            this.qccaptureaction=true;
        }
        
        // Update to server
        this.statusascomment = true;
        this.updatepartshortagetoserver();
        
    }

    // To update the Part Shortage changes to server.
    updatepartshortagetoserver(event){
        
        var discrepancytobeupdated = this.selectedshortage;
        var part_shortage;
         if(discrepancytobeupdated.buspart_no == 'Part No. Not Found'){
            //ispartavailable = false;
            part_shortage = {
                "buspart_id": null,//partshortageaddmodalvalues.buspart_id, 
                "quantity": discrepancytobeupdated.quantity, 
                "po_no" : discrepancytobeupdated.po_no,
                "custom_part_name" : discrepancytobeupdated.buspart_name,
                "part_shortage_id": discrepancytobeupdated.part_shortage_id
               };
         }
         else{
            part_shortage = {
                "buspart_id": discrepancytobeupdated.buspart_id, 
                "quantity": discrepancytobeupdated.quantity, 
                "po_no" : discrepancytobeupdated.po_no,
                "part_shortage_id": discrepancytobeupdated.part_shortage_id
               };
         }
        part_shortage['buyer'] = discrepancytobeupdated.buyer == undefined ? null : discrepancytobeupdated.buyer;
        part_shortage['planner_code'] = discrepancytobeupdated.planner_code == undefined ? null : discrepancytobeupdated.planner_code;
        part_shortage['vendor_number'] = discrepancytobeupdated.vendor_number == undefined ? null : discrepancytobeupdated.vendor_number;
        if (discrepancytobeupdated.vendor_name == undefined) {
            if (this.partsvendorslist.length > 0) {
                part_shortage['vendor_name'] = this.partsvendorslist[0].vendor_name;
                part_shortage['vendor_number'] = this.partsvendorslist[0].vendor_number;
            }
            else
                part_shortage['vendor_name'] = null;
        }
        else {
            part_shortage['vendor_name'] = discrepancytobeupdated.vendor_name;
        }
        part_shortage['carrier_text'] = discrepancytobeupdated.carrier_text == undefined ? null : discrepancytobeupdated.carrier_text;
        part_shortage['carrier_arrival_text'] = discrepancytobeupdated.carrier_arrival_text == undefined ? null : discrepancytobeupdated.carrier_arrival_text;
        part_shortage['shortage_cause_id'] = discrepancytobeupdated.shortage_cause_id == undefined ? null : discrepancytobeupdated.shortage_cause_id;
        part_shortage['tracking'] = discrepancytobeupdated.tracking == undefined ? null : discrepancytobeupdated.tracking;
        part_shortage['date_received'] = discrepancytobeupdated.date_received == undefined ? null : this.modifydate(discrepancytobeupdated.date_received);
        part_shortage['is_b_whs_kit'] = discrepancytobeupdated.is_b_whs_kit == undefined ? null : discrepancytobeupdated.is_b_whs_kit;
        part_shortage['is_long_term'] = discrepancytobeupdated.is_long_term == undefined ? null : discrepancytobeupdated.is_long_term;
        part_shortage['is_ship_short'] = discrepancytobeupdated.is_ship_short == undefined ? null : discrepancytobeupdated.is_ship_short;
        part_shortage['remarks'] = discrepancytobeupdated.remarks == undefined ? null : discrepancytobeupdated.remarks;
        var responsebody = {
            "ecard_discrepancy_log_id": discrepancytobeupdated.ecard_discrepancy_log_id,
            "ecard_id" : discrepancytobeupdated.ecard_id,
            "department_id" : discrepancytobeupdated.department_id,
            "component" : discrepancytobeupdated.component,
            "cut_off_date" : discrepancytobeupdated.cut_off_date != null ? new Date(discrepancytobeupdated.cut_off_date) : discrepancytobeupdated.cut_off_date,
            "root_cause" : discrepancytobeupdated.root_cause,
            "discrepancy_status" : discrepancytobeupdated.discrepancy_status,
            "discrepancy_type" : discrepancytobeupdated.discrepancy_type,
            "discrepancy" : discrepancytobeupdated.discrepancy,
            "part_shortage" : part_shortage,
            "modified_date" : discrepancytobeupdated.modified_date,
            "buildstation_id": discrepancytobeupdated.buildstation_id,
            
        };
        if(this.qccaptureaction && this.qccapturerole){
            responsebody["assigend_qc_id"] =  this.loggedinuser.appuser_id;
            this.qccaqccaptureaction = false;
        }
        var requestwithforman = this.updateformans(JSON.stringify(responsebody),discrepancytobeupdated.assignedprod);
        
        updatePartshortage({requestbody:JSON.stringify(requestwithforman)})
              .then(data => {
                if (data.isError) {
                    if(data.errorMessage == 202){
                        this.showmessage('Sorry we could not complete the operation.',JSON.parse(data.responsebody).data.validation_message,'error');  
                        this.partshortagedetailsmodal = false;
                        this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    }
                    else{
                         this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                         this.partshortagedetailsmodal = false;
                         this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    }
                   } 
                   else {
                            this.selectedshortage['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date;  
                            this.isupdated = false;
                            if (this.statusascomment) {
                                this.statusascomment = false;
                                var response = JSON.parse(data.operationlogresponse).data;
                                this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
                            }
                            this.showmessage('Record Updated.','Record updated Successfully.','success');
                            this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    }
              }).catch(error => {
              this.error = error;
              this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
             });
    }

    // For General Discrepancy raising similar to Discrepancy DB.
    
    // Update New Discrepancy values.
    @track buildstationrequired = true;

    @track selecteddeptformodals;
    @track qcchecklists = [];
    @track showqcchecklist = false;
    get isqcchecklistpresent(){
        return this.qcchecklists.length == 0;
    }
    @track showmeetingnotes = false;
    @track meetingnotes = [];
    get ismeetingnotespresent(){
        return this.meetingnotes.length == 0;
    }

    @track helpdocumntslist = [];
    @track showhelpdocuments = false;
    get ishelpdocpresent(){
        return this.helpdocumntslist.length == 0;
    }

    @track showattachments = false;
    @track attachmentrequireddetails;
    @track selectedbuildstationforattachments;
    // Show Attachment Modal for Operations.
    showattachmentsmodal(event){
        var buildstationid = event.target.dataset.id;
        this.selectedbuildstationforattachments = buildstationid;
        let buildstationdetails = getselectedbuildstationDetails(buildstationid,this.modifiedbuildstations);
        var attachmentreqdetails = {
            "ecard_id" : this.ecardid,
            "department_id" :this.departmentId,
            "buildstation_id" :buildstationid,
            "operationlog_id" : buildstationdetails.ecard_operation_log_id,
            "buildstation_code" : buildstationdetails.buildstation_code
        };
        this.attachmentrequireddetails = attachmentreqdetails;
        this.showattachments = true;
    }
    // Hide Attachment Modal for Operations.
    hideattachmentsmodal(event){
        this.showattachments = false;
    }

    @track s3tempurlfornewdiscrepancy = [];
    // Get the temporary urls from the attachmenttempComponent.
    gets3tempurls(event){
        this.s3tempurlfornewdiscrepancy = event.detail.tempurllist;
    }
    // If attachments are added and then cancelled for a new discrepancy/partshortage to delete those attachments.
    deletetempattachments(event){
        if(this.s3tempurlfornewdiscrepancy.length != 0){
            var requestbody = {
                "s3_file_paths" : JSON.stringify(this.s3tempurlfornewdiscrepancy)
            };
            deleteTempAttachment({requestbody:JSON.stringify(requestbody)})
                  .then(data => {
                      if(data.isError){
                        this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                        
                      }
                      else{
                          
                       //Should we show a toast message for deleteing temp attachment ?
                      }
                        
                  }).catch(error => {
                  this.error = error;
                  this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                  });
        
        }
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
                    this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
                    this.discdetailsmodal = false;
                    this.partshortagedetailsmodal=false;
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
    
    refreshoperation(){
       this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
    }

    //To load the partshortage cause list
    loadpartshotcauselist() {
        getPartshortagecauselist()
            .then(data => {
                if (data.isError) {
                    this.showmessage('Sorry we could not fetch the Shortage Cause List operation.',
                        'Something unexpected occured. Please try again or contact your Administrator.',
                        'error');
                }
                else {
                    var causelist = JSON.parse(data.responsebody).data.shortagecauses;
                    var modifiedcauselist = [];
                    for (var item in causelist) {
                        causelist[item]['label'] = causelist[item].shortage_cause_name;
                        causelist[item]['value'] = causelist[item].shortage_cause_id.toString();
                        modifiedcauselist.push(causelist[item]);
                    }
                    this.shortgecauselist = modifiedcauselist;
                }

            }).catch(error => {
                this.error = error;
                this.showmessage('Sorry we could not complete Shortage Cause List operation.',
                    'Something unexpected occured. Please try again or contact your Administrator.',
                    'error');
            });
    }

    @track vendornamelist = [];
    //to get default vendor and buyers details for selected part
    getVendorlistforparts(selectedpartno) {
        getAllpartsVendorlist({ partNumber: selectedpartno })
            .then(data => {
                if (data.isError) {
                    this.showmessage('Sorry we could not fetch Vendor List for Shortage operation.',
                        'Something unexpected occured. Please try again or contact your Administrator.',
                        'error');
                }
                else {
                    var partsvendorlist = JSON.parse(data.responsebody).data.vendors;
                    var modifiedpartsvendorlist = [];
                    var vendornamelist = [];
                    for (var item in partsvendorlist) {
                        partsvendorlist[item]['label'] = partsvendorlist[item].vendor_name;
                        partsvendorlist[item]['value'] = partsvendorlist[item].vendor_number;
                        modifiedpartsvendorlist.push(partsvendorlist[item]);
                        vendornamelist.push(partsvendorlist[item].vendor_name);
                    }
                    this.partsvendorslist = modifiedpartsvendorlist;
                    this.vendornamelist = vendornamelist;
                }

            }).catch(error => {
                this.error = error;
                this.showmessage('Sorry we could not complete Vendor List for Shortage operation.',
                    'Something unexpected occured. Please try again or contact your Administrator.',
                    'error');
            });
    }
    //to get default vendor and buyers details for selected part is not already selected
    getPartsVendorBuyerDetails(selectedpartno, shortagedata, operation) {
        getDefaultVendorandBuyer({ partNumber: selectedpartno })
            .then(data => {
                if (data.isError) {
                    this.showmessage('Sorry we could not fetch the default Buyer and Vendor details operation.',
                        'Something unexpected occured. Please try again or contact your Administrator.',
                        'error');
                }
                else {
                    var result = JSON.parse(data.responsebody).data;
                    var selectedshortage = shortagedata;
                    // Only assigne if the value is not emnpty
                    Object.keys(result).forEach(function (key) {
                        if (result[key] != '') {
                            selectedshortage[key] = result[key];
                        }
                    })
                    if(operation == 'addnew'){
                        this.newpartshortage = selectedshortage;
                        if (this.newpartshortage.buyer != undefined && this.newpartshortage.planner_code != undefined) {
                            this.newpartshortage.buyer_code = this.newpartshortage.buyer + ' / ' + this.newpartshortage.planner_code;
                        }
                    }else{
                        this.selectedshortage = selectedshortage;
                    }
                }

            }).catch(error => {
                this.error = error;
                this.showmessage('Sorry we could not complete the default Buyer and Vendor details.',
                    'Something unexpected occured. Please try again or contact your Administrator.',
                    'error');
            });
    }

    // Update vendor selected in shortage
    onvendorselection(event) {
        var selectedvendor = event.detail.selectedRecord;
        this.selectedshortage.vendor_name = selectedvendor;
        this.selectedshortage.vendor_number = null;
        for (var item in this.partsvendorslist) {
            if (selectedvendor == this.partsvendorslist[item].label) {
                this.selectedshortage.vendor_number = this.partsvendorslist[item].value;
            }
        }
        if (event.detail.incident == 'selection') {
            this.updatepartshortage(event);//timer triggered
        }
    }

    // On clearing the vendor selection. added
    onclearvendor(event) {
        this.selectedshortage.vendor_name = null;
        this.selectedshortage.vendor_number = null;
        this.updatepartshortage(event);//timer triggered
    }

    // To update new shortage checkbox
    updatenewpartshortagecheckbox(event) {
        var targetvalue = event.target.checked;
        var targetname = event.target.name;
        this.newpartshortage[targetname] = targetvalue;
    }
    
    //To clear partvendor and buyer details
    clearpartsvendordetails() {
        this.newpartshortage['buyer'] = undefined;
        this.newpartshortage['planner_code'] = undefined;
        this.newpartshortage['vendor_number'] = undefined;
        this.newpartshortage['buyer_code'] = undefined;
        this.newpartshortage['vendor_name'] = undefined;
        this.partsvendorslist = [];
    }
    //To create custome date formate 2021-07-14 to 2021-07-14 00:00:00
    modifydate(date){
        var formatteddate = undefined;
        if(date != undefined){
            var jsdate = new Date(date);
            return jsdate.getFullYear() + "-" + (jsdate.getMonth()+1) + "-" + jsdate.getDate() + " " + "00:00:00";
        }
        return formatteddate;
    }

    //removeduplicate user
    removeDuplicates(objectArray) {
        console.log(objectArray);
        // Declare a new array
        let newArray = [];
        // Declare an empty object
        let uniqueObject = {};
        var objTitle;
        // Loop for the array elements
        for (let item in objectArray) {
            // Extract the title
            objTitle = objectArray[item]['appuser_name'];
            // Use the title as the index
            uniqueObject[objTitle] = objectArray[item];
        }
        // Loop to push unique object into array
        for (let item in uniqueObject) {
            newArray.push(uniqueObject[item]);
        }
        // Display the unique objects
        console.log(newArray);
        return newArray;
    }
}