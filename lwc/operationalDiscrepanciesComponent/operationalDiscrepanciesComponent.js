import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import { NavigationMixin } from 'lightning/navigation';

import getDepartmentDiscrepancies from "@salesforce/apex/ecardOperationsController.getDepartmentDiscrepancies";
import getAllComments from "@salesforce/apex/DiscrepancyDatabaseController.getAllComments";
import addnewComment from "@salesforce/apex/DiscrepancyDatabaseController.addnewComment";
import updateDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.updateDiscrepancy";

import getDepartmentShortages from "@salesforce/apex/ecardOperationsController.getDepartmentShortages";
import updatePartshortage from "@salesforce/apex/ecardOperationsController.updatePartshortage";

import getdiscrepancyimage from "@salesforce/apex/DiscrepancyDatabaseController.getdiscrepancyimage";
import getcrewingsuserslist from "@salesforce/apex/CrewingScheduleController.getcrewingsuserslist";
import getDiscrepancylist from "@salesforce/apex/ecardOperationsController.getDiscrepancylist";
import getShortageslist from "@salesforce/apex/ecardOperationsController.getShortageslist";
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
import {permissions, modifieduserlist, getmoddeddate, getselectedformandetails, preassignforeman, preassignqc, setstatusfordisplay}  from 'c/userPermissionsComponent';
import getPermissions from "@salesforce/apex/userAuthentication.getPermissions";
import deleteDiscOrShortage from "@salesforce/apex/ecardOperationsController.deleteDiscOrShortage";
import getPartshortagecauselist from "@salesforce/apex/ecardOperationsController.getPartshortageCauses";
import getAllpartsVendorlist from '@salesforce/apex/ecardOperationsController.getAllpartsVendorlist';
import getDefaultVendorandBuyer from '@salesforce/apex/ecardOperationsController.getDefaultVendorandBuyer';
export default class OperationalDiscrepanciesComponent extends NavigationMixin(LightningElement) {


    nodatadessert = noDatadessert;    
    @track department;
    @track selecteddepartmentId;
    @track busname;
    @track buschasisnumber;
    @track operation;
    @track ecardid;
    @track departmentIdMap;
    @track selectedBusLabel;
    @track loggedinuser;

    @track currentuserid = 2;

    @track selectedview = 'Discrepancies';
    @track previousview = 'Discrepancies';
    @track buildstationId;
    @track buildstationcode;
    @track  currentuserlist;
    @track departmentId;
    @track departmentName;
    @track showSpinner;
    @track priorityoptions = [{"label":"High", "value":"High"}, {"label":"Normal", "value":"Normal"}, {"label":"Low", "value":"Low"}] ; 
    // Descrepancy options
    @track modifieddiscrepancyList = []; // To store Formated Discrepancy List.
    @track isdescripancybyrejection = false; // To ensure if the Discrepancy modal was raised due to rejection of an operation.

    @track paintdefects = []; // To store the paint defect code details.
    @track otherdefects = []; // To store the other defect code details.

    @track discdetailsmodal = false;;
    @track selecteddiscrepancy;
    @track newdiscrepancymodal = false;
    @track qccapturerole = false;
    @track qccaptureaction = false;
    @track bussequence;
    @track seqdisplay;
    @track busSeqavailable;
    @track isbusareaarray = false;
    @track statusascomment = false;
    @track statuscommentmap = {
        "resolve": "Status changed to Resolved",
        "approve": "Status changed to Verified",
        "open": "Status changed to Open"
    };
    @track scheduleflow = false;
    @track scheduledata;
    @track shortgecauselist = [];
    @track partsvendorslist = [];
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
     
    // For Showing no data message when Discrepancy List is Empty.   
    get discrepancylistempty(){
        return this.modifieddiscrepancyList.length == 0;
    }

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

    get selectedtabdiscrepancy(){
        return this.selectedview == 'Discrepancies';
    }

    get selectedtabshortage(){
        return this.selectedview == 'Shortages';
    }


    // Disable/Enable Production User For Selected Discrepancy
    get disableprodforselecteddiscrepancy() {
        var updatepermission = false;
        if (this.selecteddiscrepancy.discrepancy_type == 'department') {
            updatepermission = this.permissionset.dept_discrepancy_update_prod.write;
        } else if (this.selecteddiscrepancy.discrepancy_type == 'busarea') {
            updatepermission = this.permissionset.busarea_discrepancy_update_prod.write;
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

    //To show preview image col for Paint discrepancy only
    get isdepartmentPaint(){
        var isdepartmentpaintortrim = false;
        var departmentid = this.departmentId.toString();
        for(var i in this.departmentIdMap){
            if(this.departmentIdMap[i].value == departmentid){
                isdepartmentpaintortrim = this.departmentIdMap[i].bus_area_discrepancy_enabled;
            }
        }
        return isdepartmentpaintortrim;
    }

    @track isdelenabled;
    get isdeletable(){
        return this.isdelenabled;
    }
    wiredPermissions;
    permissionset;
    getPermissionsfromserver(event){
        getPermissions()
          .then((data) => {
            this.wiredPermissions = JSON.parse(data.responsebody);
            this.permissionset = permissions(this.wiredPermissions);
            this.error = undefined;
          })
          .catch((error) => {
            this.error = error;
            this.wiredPermissions = undefined;
          });
      }

    //To disable parts vendor list dropdown
    get disablevendoredit() {
        return this.partsvendorslist.length == 0 || this.selectedshortage.discrepancy_status.toLowerCase() =="approve";
    }
    //To disable the new part shortage fields from edit
    get disableeditshortage(){
        return this.permissionset.shortage_update.write != true || this.selectedshortage.discrepancy_status.toLowerCase() != "open"; //corrected
    }
    // Sets the functions/data on intial load.
    connectedCallback(){
        //debugger
      this.getloggedinuser();
      this.getPermissionsfromserver();
      loadStyle(this, HideLightningHeader);
      var requireddata = JSON.parse(localStorage.getItem('requiredfilters'));
      if(requireddata == undefined || requireddata == null){
        this.showSpinner = true;
      }
      else{
        
        this.busname =  requireddata.busname;
        this.buschasisnumber =  requireddata.buschasisnumber;
        this.ecardid = requireddata.ecardid;
        this.departmentId = requireddata.selecteddepartmentId;
        this.departmentName = requireddata.department;
        this.buildstationId = requireddata.buildstationId;
        this.buildstationcode =  requireddata.buildstationcode;
        this.bussequence =  requireddata.bussequence;
        this.seqdisplay =this.bussequence!=undefined?"\("+this.bussequence+"\)":"";
        this.busSeqavailable=this.bussequence!=undefined?true:false;
        this.selectedBusLabel = `${requireddata.busname}, ${requireddata.buschasisnumber},${this.seqdisplay}`;
        this.departmentIdMap = requireddata.departmentIdMap;
        this.scheduleflow = requireddata.scheduleflow;
        this.scheduledata = requireddata.scheduledata; 
        //localStorage.removeItem('requiredfilters');
        this.showSpinner = true;
        if(this.selectedview == 'Discrepancies'){
            this.loadDiscrepancydata();
        }
        if(this.selectedview == 'Shortages'){
            this.loadShortagesdata();
        }
      }
       
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

    changeview(event){
        this.selectedview = event.currentTarget.dataset.label;
        event.target.variant = 'brand';
        if(this.selectedview != this.previousview){
          var element = this.template.querySelector('[data-label="' + this.previousview +'"]');
          element.variant = '';
          this.previousview = event.currentTarget.dataset.label;
          this.connectedCallback();
         // this.template.querySelector('c-operations-component').operationchanged(this.selectedview);
        }
      }


    

    // To modify defect picklist values based on Department Selection
    moddifydefectpickvalues(deptcode){
        if(deptcode.toString() == '109'){
            this.defectoptions = this.paintdefects;
        }
        else{
            this.defectoptions = this.otherdefects;
        }
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
                        Id : user.employee_id,
                        empid:emp_id,
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

    // To get the formanIds(PROD user Ids) in a list format from API structure.
    getformanIds(discrepancyobj){
        var userids = [];
        for(var i=0; i<5;i++){
            if(discrepancyobj[`forman${i+1}_id`] != undefined){
                userids.push(discrepancyobj[`forman${i+1}_id`]);
            }
         }
        return userids;
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
            var qc_avilable=assigend_qc_id.length!=0?true:false;
            var verifiedby = this.getmodifiediserlist([discrepancylogs[disc].verifiedby_id]);
            var resolved_status_updatedby_id = this.getmodifiediserlist([discrepancylogs[disc].resolved_status_updatedby_id]);
            var created_by = this.getmodifiediserlist([discrepancylogs[disc].createdby_id]);
            var raised_date = this.getmoddeddate(discrepancylogs[disc].raised_date);
            var createdbyname;
            var createdbyempid=undefined;
            var is_deletable=false;
            var displaycreatedbyname;
            var customernamewithchasis = `${this.busname}, ${this.buschasisnumber}`;
            var department_name = this.selecteddepartment;
            if(created_by != undefined && created_by.length != 0){
                 if(created_by[0]!=undefined){
                     displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${raised_date}`;
                     createdbyname = `${created_by[0].name} (${created_by[0].userid})`;
                     createdbyempid=`${created_by[0].userid}`;
                 }
            }
            if((createdbyempid==this.loggedinuser.appuser_id) && (discrepancylogs[disc].discrepancy_status.toLowerCase()=="open")){
                is_deletable=true;
            }
            var isdepartmentdiscrepancy = false;
            if(discrepancylogs[disc].discrepancy_type == 'department'){
                // assignedprod = prod_supervisor;
                moddedprod = prod_supervisor;
                isdepartmentdiscrepancy = true;
            }
            var isdownstreamdiscrepancy = false;
            if (discrepancylogs[disc].discrepancy_type == "downstream") {
                isdownstreamdiscrepancy = true;
            }
            var hasbusareapicture = false;
            if(discrepancylogs[disc].bus_area_picture_id != undefined){
                hasbusareapicture = true;
            }
            var discrepancytype = discrepancylogs[disc].discrepancy_type;
                if(discrepancylogs[disc].discrepancy_type == 'busarea' ){
                    discrepancylogs[disc].discrepancy_type = 'Bus Area';
                }
            var moddeddiscrepancy = {
                index: index,
                hasbusareapicture : hasbusareapicture,
                departmentid : departmentid,
                //departmentcode : this.getdepartmentcode(departmentid),
                modified_date : discrepancylogs[disc].modified_date,
                bus_area : discrepancylogs[disc].bus_area,
                bus_area_picture_id : discrepancylogs[disc].bus_area_picture_id,
                ecard_discrepancy_log_id : discrepancylogs[disc].ecard_discrepancy_log_id,
                ecard_discrepancy_log_number: discrepancylogs[disc].discrepancy_log_number,
                isdepartmentdiscrepancy : isdepartmentdiscrepancy,
                isdownstreamdiscrepancy: isdownstreamdiscrepancy,
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
                qcavailable:qc_avilable,
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
                discrepancy_status: discrepancylogs[disc].discrepancy_status.toLowerCase(),
                discrepancy_statusdisplay : setstatusfordisplay(discrepancylogs[disc].discrepancy_status.toLowerCase()),
                discrepancy_type: this.capitalize(discrepancylogs[disc].discrepancy_type),
                root_cause : discrepancylogs[disc].root_cause,
                component : discrepancylogs[disc].component,
                cut_off_date : discrepancylogs[disc].cut_off_date,
                raised_date : discrepancylogs[disc].raised_date,
                raised_date_display : raised_date,
                resolved_status_updatedby_id : resolved_status_updatedby_id,
                verifiedby : verifiedby,
                prod : moddedprod,
                qc : departmentqc,
                assignedprod : assignedprod,
                assigend_qc_id : assigend_qc_id
            };
            modifieddiscrepancyList.push(moddeddiscrepancy);
        }
        return modifieddiscrepancyList;
}

    // Load Discrepancy tab data and formatting based on the Ecard and Department selected from API.
    loadDiscrepancydata(event){
        var ecardid = this.ecardid;
        var deptmentId = this.departmentId;
        var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
        // Get Data from API.
        getDiscrepancylist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var discrepancylist = [];
            var modifieddiscrepancyList = [];
            var departmentdata = JSON.parse(data.responsebody).data;
            var thisdeptdiscrepancy = this.getmodifieddiscrepancylist(departmentdata);
            discrepancylist.push(...thisdeptdiscrepancy)
            for(var i in discrepancylist){
                if(discrepancylist[i].buildstation_id == this.buildstationId){
                    modifieddiscrepancyList.push(discrepancylist[i]);
                }
            }
            this.modifieddiscrepancyList = modifieddiscrepancyList;
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

    // To modify the Department Shortages data for Ecard App and related components.
    getmodifiedshortageslist(departmentdata){
        //var departmentqc = this.getmodifiediserlist(departmentdata.qc);
            var departmentid = departmentdata.department_id;
            var shortagelogs = departmentdata.discrepancylog;
            var modifiedshortagesList = [];
            var prod_supervisor = this.getmodifiediserlist(departmentdata.prod_supervisor);
            this.deptsupervisor = prod_supervisor;
            for(var disc in shortagelogs){
                var index = Number(disc)+1;
                var shortageobj = shortagelogs[disc];
                var created_by = this.getmodifiediserlist([shortageobj.createdby_id]);
                var raised_date = this.getmoddeddate(shortageobj.raised_date);
                var createdbyname;
                var displaycreatedbyname;
                var createdbyempid=undefined;
                if(created_by != undefined && created_by.length != 0){
                     if(created_by[0]!=undefined){
                         displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${raised_date}`;
                         createdbyname = `${created_by[0].name} (${created_by[0].userid})`;
                         createdbyempid= `${created_by[0].userid}`;
                     }
                }
                var is_deletable=false;
                if((createdbyempid==this.loggedinuser.appuser_id) && (shortageobj.discrepancy_status.toLowerCase()=="open")){
                    is_deletable=true;
                }
                var partname;
                if(shortageobj.buspart_id != null ){
                    partname = shortageobj.buspart_name;
                }
                else{
                    partname = shortageobj.custom_part_name;
                }
                var moddedshortage = {
                    index: index,
                    departmentid : departmentid,
                    //departmentcode : this.getdepartmentcode(departmentid),
                    createdbyname : createdbyname,
                    displaycreatedbyname : displaycreatedbyname,
                    modified_date : shortageobj.modified_date,
                    buildstation_code :  shortageobj.buildstation_code,
                    buildstation_id :  shortageobj.buildstation_id,
                    part_shortage_id : shortageobj.part_shortage_id,
                    buspart_id : shortageobj.buspart_id,
                    buspart_name : partname, //shortageobj.buspart_name,
                    custom_part_name : shortageobj.custom_part_name,
                    buspart_no : shortageobj.buspart_no,
                    busstatus_id : shortageobj.busstatus_id,
                    busstatus_name : shortageobj.busstatus_name,
                    chassis_no : shortageobj.chassis_no,
                    component : shortageobj.component,
                    createdby_id : this.getmodifiediserlist([shortageobj.createdby_id]),
                    defect_codename : `${shortageobj.defect_code}, ${shortageobj.defect_name}`,
                    discrepancy_statusdisplay : setstatusfordisplay(shortageobj.discrepancy_status.toLowerCase()),
                    discrepancy_type: this.capitalize(shortageobj.discrepancy_type),
                    cut_off_date : shortageobj.cut_off_date,
                    displaycutoffdate : this.getmoddeddate(shortageobj.cut_off_date),
                    dat_defect_code_id : shortageobj.dat_defect_code_id,
                    defect_code : shortageobj.defect_code,
                    defect_name : shortageobj.defect_name,
                    defect_type : shortageobj.defect_type,
                    department_id : shortageobj.department_id,
                    department_name : shortageobj.department_name,
                    discrepancy : shortageobj.discrepancy,
                    isdeletable:is_deletable,
                    discrepancy_priority : this.capitalize(shortageobj.discrepancy_priority),
                    discrepancy_status : shortageobj.discrepancy_status.toLowerCase(),
                    ecard_discrepancy_area_id : shortageobj.ecard_discrepancy_area_id,
                    ecard_discrepancy_log_id : shortageobj.ecard_discrepancy_log_id,
                    ecard_discrepancy_log_number: shortageobj.discrepancy_log_number,
                    ecard_id : shortageobj.ecard_id,
                    ecard_operation_log_id : shortageobj.ecard_operation_log_id,
                    first_name : shortageobj.first_name,
                    last_name :  shortageobj.last_name,
                    customername : `${shortageobj.customer_name}`,//`${shortageobj.first_name} ${shortageobj.last_name}`,
                    has_part_shortage : shortageobj.has_part_shortage,
                    assignedprod : this.getselectedformandetails(shortageobj),
                    part_avilable : shortageobj.part_avilable,
                    po_no : shortageobj.po_no,
                    allprodlist : this.getmodifiediserlist(shortageobj.prod),
                    allqclist : this.getmodifiediserlist(shortageobj.qc),
                    quantity : shortageobj.quantity,
                    assigend_qc_id : this.getmodifiediserlist([shortageobj.assigend_qc_id]),
                    raised_date : shortageobj.raised_date,
                    raised_date_display : this.getmoddeddate(shortageobj.raised_date),
                    raised_status_updated_date : shortageobj.raised_status_updated_date,
                    resolved_date : shortageobj.resolved_date,
                    resolved_status_updatedby_id : this.getmodifiediserlist([shortageobj.resolved_status_updatedby_id]),
                    resolved_status_updated_date : shortageobj.resolved_status_updated_date,
                    root_cause : shortageobj.root_cause,
                    verifiedby_id : this.getmodifiediserlist([shortageobj.verifiedby_id]),
                    verified_date : shortageobj.verified_date,
                    verified_status_updated_date : shortageobj.verified_status_updated_date,
                    workcenter_code : shortageobj.workcenter_code,
                    workcenter_name : shortageobj.workcenter_name,
                    buyer : shortageobj.buyer,
                    carrier_arrival_text : shortageobj.carrier_arrival_text,
                    carrier_text : shortageobj.carrier_text,
                    date_received : shortageobj.date_received,
                    is_b_whs_kit : shortageobj.is_b_whs_kit,
                    is_long_term : shortageobj.is_long_term,
                    is_ship_short: shortageobj.is_ship_short,
                    remarks: shortageobj.remarks,
                    planner_code : shortageobj.planner_code,
                    shortage_cause_id : shortageobj.shortage_cause_id != null ? shortageobj.shortage_cause_id.toString() : null,
                    tracking : shortageobj.tracking,
                    vendor_name : shortageobj.vendor_name,
                    vendor_number : shortageobj.vendor_number
                };
                modifiedshortagesList.push(moddedshortage);
            }
            return modifiedshortagesList;
    }

    @track modifiedshortageslist = [];
    // Load Part Shortage tab data and formatting based on the Ecard and Department selected from API.
    loadShortagesdata(event){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        var deptmentId = this.departmentId;
        var ecardiddeptid = {ecard_id:ecardid ,dept_id:deptmentId};
        // Get Data from API.
        getShortageslist({ecardiddeptid:JSON.stringify(ecardiddeptid)})
        .then(data => {
            var shortageslist = [];
            var modifiedshortagelist = [];
            var departmentdata = JSON.parse(data.responsebody).data;
            var thisdeptshortage = this.getmodifiedshortageslist(departmentdata);
            shortageslist.push(...thisdeptshortage);
            for(var i in shortageslist){
                if(shortageslist[i].buildstation_id == this.buildstationId){
                    modifiedshortagelist.push(shortageslist[i]);
                }
            }
            this.modifiedshortageslist = modifiedshortagelist;
            this.loadpartshotcauselist();
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

    // Capitalize string passe
    capitalize(text){
        if (typeof text !== 'string') return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
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
                            var dispname=`${com.commentedby_id.first_name} ${com.commentedby_id.last_name} (${com.commentedby_id.employee_number})`;
                            var emp_id=`${com.commentedby_id.employee_number}`;
                            var initials = name.match(/\b\w/g) || [];
                            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                            var moddedcomment = {
                                created_by : name,
                                initials : initials,
                                commentedbyid : com.commentedby_id.employee_number,
                                commentedusername : com.commentedby_id.appuser_name,
                                commenttext : com.discrepancy_comments,
                                fullname : name,
                                displayname:dispname,
						        empid:emp_id,
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

    // Add the discrepancy status change as comment
    addstatusasdiscrepancycomment(discrepancylogid, commenttext) {
        var ecarddiscrepancylogid = discrepancylogid;
        var newcommentbody = {
            "ecard_discrepancy_log_id": discrepancylogid,
            "discrepancy_comments": commenttext
        };
        addnewComment({ requestbody: JSON.stringify(newcommentbody) })
            .then(data => {
                if (data.isError) {
                    this.showmessage('Failed to add Comments.', 'Something unexpected occured. Please contact your Administrator.', 'error');
                }
                else {
                    this.getselecteddiscrepancycomments(ecarddiscrepancylogid);
                }
            })
            .catch(error => {
                this.showmessage('Failed to add Comments.', 'Something unexpected occured. Please contact your Administrator.', 'error');
            });
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
            this.qccaptureaction=false;
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
              if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status.toLowerCase() =='open')){
                  this.isdelenabled=true;
              }
              this.discdetailsmodal = true;
            }
            else{
                this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selecteddiscrepancy.discrepancy_status ='resolve';
                this.isdelenabled=false;
                this.updatediscrepancytoserver();
            }
            
        }
        else{
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
            this.updatediscrepancytoserver();
        }
        

        // Need to call the update to server
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
        return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !this.permissionset.dept_discrepancy_update.write;//vishwas
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
                this.isdelenabled=false;
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
            "modified_date" : discrepancytobeupdated.modified_date,
            "buildstation_id": discrepancytobeupdated.buildstation_id
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
                    if (this.statusascomment) {
                        this.statusascomment = false;
                        var response = JSON.parse(data.operationlogresponse).data;
                        this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
                    }
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
        
        /* for(var i=0; i<5;i++){
            if(newformanlist[i]!=undefined){
                newresponse[`forman${i+1}_id`] = newformanlist[i].userid;
            }
            else{
                newresponse[`forman${i+1}_id`] = null;
            }
        }    */
        return newresponse;
     }

     // To Update the responsebody with selected formanIds from Pop up Views.
     updateformansformultiselect(responsebody, formanlist){
        var newresponse = JSON.parse(responsebody);
        var newformanlist;
        if(formanlist.length > 5){
            newformanlist = formanlist.slice(0, 5);
        }
        else{
            newformanlist = formanlist;
        }
        for(var i=0;i<newformanlist.length;i++){
            newresponse[`forman${i+1}_id`] = newformanlist[i].Id;
            }

        /* for(var i=0; i<5;i++){
            if(newformanlist[i]!=undefined){
                newresponse[`forman${i+1}_id`] = newformanlist[i].Id;
            }
            else{
                newresponse[`forman${i+1}_id`] = null;
            }
        }    */
        return newresponse;
     }


     // Part Shortage Section

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
            this.getPartsVendorBuyerDetails(this.selectedshortage.buspart_no);
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
    
    // Update user selection of selected shortage
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

    // To handle Part Shortage Actions
    partshortageactionshandler(event){
        var action = event.detail.action;
        var selecteddiscrepancylogid = event.detail.buildstationid;
        for(var i in this.modifiedshortageslist){
            if(this.modifiedshortageslist[i].ecard_discrepancy_log_id == selecteddiscrepancylogid){
                this.selectedshortage = this.modifiedshortageslist[i];
            }
        }
        
        
        if(action == 'Mark as done'){
            this.qccaptureaction=false;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
            this.isdelenabled=false;
            this.selectedshortage.isdeletable =false;
            
        }
        else{
            if (action == "Reject") {
                this.qccaptureaction=true;
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
                this.selectedshortage.discrepancy_status ='open'; //reject
            }
            if(action == 'Verify'){
                this.qccaptureaction=true;
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('approve');
                this.selectedshortage.discrepancy_status ='approve';
            }
            if(action == 'Cancel'){
                this.qccaptureaction=true;
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open');
                this.selectedshortage.discrepancy_status ='open';
            }
            if(action == 'Cancel Verified'){
                this.qccaptureaction=true;
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selectedshortage.discrepancy_status ='resolve';
            }
            if(action == 'Cancel Rejected'){
                this.qccaptureaction=true;
                this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
                this.selectedshortage.discrepancy_status ='resolve';
            }
            
        }
        this.statusascomment = true;
        this.updatepartshortagetoserver();
        // update changes to server.
    }

    // Handle actions from Modal
    handlepartshortageactions(event){
        var action = event.detail.action;
        var passedallvalidation = true;
        if (action == "Reject") {
            this.qccaptureaction=true;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open'); // reject
            this.selectedshortage.discrepancy_status ='open'; //reject
        }
        if(action == 'Verify'){
            this.qccaptureaction=true;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('approve');
            this.selectedshortage.discrepancy_status ='approve';
        }
        if(action == 'Mark as done'){
           this.qccaptureaction=false;
           this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
           this.selectedshortage.discrepancy_status ='resolve';
           this.isdelenabled=false;
           this.selectedshortage.isdeletable =false;
         }
        if(action == 'Cancel'){
            this.qccaptureaction=true;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('open');
            this.selectedshortage.discrepancy_status ='open';
        }
        if(action == 'Cancel Verified'){
            this.qccaptureaction=true;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
        }
        if(action == 'Cancel Rejected'){
            this.qccaptureaction=true;
            this.selectedshortage.discrepancy_statusdisplay = setstatusfordisplay('resolve');
            this.selectedshortage.discrepancy_status ='resolve';
        }
        
        // Update to server
        this.statusascomment = true;
        this.updatepartshortagetoserver();
        
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

    // To update the Part Shortage  changes to server.
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
            //"has_part_shortage" : discrepancytobeupdated.has_part_shortage,
            //"part_avilable" : discrepancytobeupdated.part_avilable
        };
        /*if(discrepancytobeupdated.assigend_qc_id.length != 0){
            responsebody["assigend_qc_id"] =  discrepancytobeupdated.assigend_qc_id[0].Id;
        }*/
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
                        this.loadShortagesdata();
                    }
                    else{
                         this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                         this.partshortagedetailsmodal = false;
                         this.loadShortagesdata();
                    }
                   } 
                   else {
                            this.selectedshortage['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date; 
                            this.isupdated = false; 
                            this.showmessage('Record Updated.','Record updated Successfully.','success');
                            if (this.statusascomment) {
                                this.statusascomment = false;
                                var response = JSON.parse(data.operationlogresponse).data;
                                this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
                            }
                            this.loadShortagesdata();
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

      @track showpreviewimage = false;
      @track previewimageexist = false;
      @track discrepancyimage ;
      @track parentdivdimensions;
      @track showspinnerwithmodal = false;
      previewimage(event){
          debugger
          var selecteddiscrepancylogid = event.target.dataset.id;
          for (var i in this.modifieddiscrepancyList) {
            if (
              this.modifieddiscrepancyList[i].ecard_discrepancy_log_id ==
              selecteddiscrepancylogid
            ) {
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
          if(this.selecteddiscrepancy.discrepancy_status.toLowerCase() == 'resolve'){
              discrepancycolor = '#e8bb07';
          }
          if(this.selecteddiscrepancy.discrepancy_status.toLowerCase() == 'approve'){
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
          this.isbusareaarray = Array.isArray(bus_area);
          /** this is to consider the array of the paint discrepancy point - new implementation*/
          if (this.isbusareaarray) {
              var buspointlist = [];
              for (var i in bus_area) {
                  var style = `top: ${bus_area[i].y * zoomScale}px;left: ${bus_area[i].x * zoomScale}px;background: ${discrepancycolor};`;
                  buspointlist.push({ index: i, style: style });
              }
              this.setdiscrepancypoint = buspointlist;
          }
          else {/** This condition is to take care of historical Discrepancy point as object - can be removed from next release */
              this.setdiscrepancypoint = `top: ${bus_area.y * zoomScale}px;left: ${bus_area.x * zoomScale}px;background: ${discrepancycolor};`;
          }
          this.previewimageexist = true;
          this.showspinnerwithmodal = false;
      }
  
      hidepreviewimage(event){
          this.showpreviewimage = false;
          this.previewimageexist = false;
      }

     navigatebacktoecard(event){
        var requireddata = {
            department : this.department,
            selecteddepartmentId : this.departmentId,
            BusName : this.busname,
            ecardid : this.ecardid,
            busSequence : this.bussequence,
            busSeqavailable :this.busSeqavailable,
            ChasisNumber : this.buschasisnumber,
            scheduleflow : this.scheduleflow,
            scheduledata : this.scheduledata,
            
        };
        var filterconditions = JSON.stringify(requireddata);
        localStorage.setItem('ecardid', filterconditions);
        // Navigate to a specific CustomTab.
        this[NavigationMixin.Navigate]({
             type: 'standard__navItemPage',
             attributes: {
            // CustomTabs from managed packages are identified by their
            // namespace prefix followed by two underscores followed by the
            // developer name. E.g. 'namespace__TabName'
                     apiName: 'E_Cards'
             }
        /*,
        state: {
            ecardSelected: this.selectedBus
        }*/
    });
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
                    this.discdetailsmodal = false;
                    this.partshortagedetailsmodal=false;
                    if(this.selectedview == 'Discrepancies'){
                        this.loadDiscrepancydata();
                    }
                    if(this.selectedview == 'Shortages'){
                        this.loadShortagesdata();
                    }
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

    //To load the partshortage cause list
    loadpartshotcauselist() {
        getPartshortagecauselist()
            .then(data => {
                if (data.isError) {
                    this.showmessage('Sorry we could not fetch Shortage Cause List operation.',
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
    //To get default vendor and buyers details for selected part
    getVendorlistforparts(selectedpartno) {
        getAllpartsVendorlist({ partNumber: selectedpartno })
            .then(data => {
                if (data.isError) {
                    this.showmessage('Sorry we could not fetch Vendor List for Parts operation.',
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
                this.showmessage('Sorry we could not complete Vendor List for Parts operation.',
                    'Something unexpected occured. Please try again or contact your Administrator.',
                    'error');
            });
    }
    //to get default vendor and buyers details for selected part is not already selected
    getPartsVendorBuyerDetails(selectedpartno){
        getDefaultVendorandBuyer({partNumber : selectedpartno})
        .then(data => {
            if (data.isError) {
                this.showmessage('Sorry we could not fetch the default Buyer and Vendor details operation.',
                    'Something unexpected occured. Please try again or contact your Administrator.',
                    'error');
            }
            else {
                var result = JSON.parse(data.responsebody).data;
                var selectedshortage = this.selectedshortage;
                // Only assigne if the value is not emnpty
                Object.keys(result).forEach(function(key) {
                    if(result[key] != '') {
                        selectedshortage[key] = result[key];
                    }
                })
                this.selectedshortage = selectedshortage;
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