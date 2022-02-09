import { LightningElement, track } from "lwc";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import HideLightningHeader from "@salesforce/resourceUrl/HideLightningHeader";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getPicklistOptions from "@salesforce/apex/DiscrepancyDatabaseController.getPicklistOptions";
import getAllEcarddetailsfromServer from "@salesforce/apex/DiscrepancyDatabaseController.getAllEcarddetails";
import getAllDiscrepanciesfromServer from "@salesforce/apex/DiscrepancyDatabaseController.getAllDiscrepanciesdetails";

import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";
import getCompleteDefectCodes from "@salesforce/apex/ecardOperationsController.getDefectCodes";
import getDepartmentOperations from "@salesforce/apex/ecardOperationsController.getDepartmentOperations";

import raisenewDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.raisenewDiscrepancy";
import getAllComments from "@salesforce/apex/DiscrepancyDatabaseController.getAllComments";
import addnewComment from "@salesforce/apex/DiscrepancyDatabaseController.addnewComment";
import updateDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.updateDiscrepancy";

import getdiscrepancyimage from "@salesforce/apex/DiscrepancyDatabaseController.getdiscrepancyimage";
import getcrewingsuserslist from "@salesforce/apex/CrewingScheduleController.getcrewingsuserslist";
import deleteDiscOrShortage from "@salesforce/apex/ecardOperationsController.deleteDiscOrShortage";

import {permissions, modifieduserlist, getmoddeddate, getselectedformandetails, preassignforeman, preassignqc, setstatusfordisplay}  from 'c/userPermissionsComponent';
import getPermissions from "@salesforce/apex/userAuthentication.getPermissions";
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
import getStatusPicklistOptions from "@salesforce/apex/scheduleBoardController.getPicklistOptions";
import pubsub from 'c/pubsub' ;

export default class DiscrepancyDbComponent extends LightningElement {
  nodatadessert = noDatadessert;
  @track error; // to track the error occuring
  @track showSpinner; // to show loading spinner
  @track currentuserid = 2;
  @track loggedinuser;
  /*@track selectedview = 'Normal';
    @track previousview = 'Normal'; */

  @track alldiscrepancy = [];
  @track filtereddiscrepancy = [];

  // New Discrepancy variables
  @track ecardoptions = [];
  @track ecardnamechasislist = [];
  @track buildstationoptions = [];
  @track departmentoptions = [];
  @track defectoptions = [];
  @track priorityoptions = [
    { label: "High", value: "High" },
    { label: "Normal", value: "Normal" },
    { label: "Low", value: "Low" }
  ];
  @track newdiscrepancymodal = false;
  @track deptsupervisorforselecteddept;
  @track selecteddeptbsdetails;
  @track alldefectcode;
  @track paintdefects = [];
  @track otherdefects = [];
  @track newdiscrepancy;

  // For Filteration
  @track itemstosearch = ["Disney", "Suyati", "Gillig", "123232"];
  @track customernamechasislist = [];
  @track createdbyuserslist = [];
  @track assigneduserslist = [];
  @track selectedCustomer;
  @track selecteddepartement = "All Departments";
  @track departmentlist = [
    { label: "All Departments", value: "All Departments" }
  ];
  @track selecteddefect = "All Defect Code";
  @track defectlist = [{ label: "All Defect Code", value: "All Defect Code" }];
  @track selecteddisctype = "All Discrepancies";
  @track discrepancytypelist = [
    { label: "All Discrepancies", value: "All Discrepancies" },
    { label: "Normal Discrepancy", value: "buildstation" },
    { label: "Department Discrepancy", value: "department" },
    { label: "Downstream Discrepancy", value: "downstream" }
  ];
  @track selectedcreatedbyuser;
  @track selectedassignedtouser;
  @track selectedcreatedddate;

  // For Sorting
  @track sortedDirection = "asc";
  @track sortedColumn;
  @track previousColumn;

  // For Details View
  @track detailsmodal = false;
  @track selecteddiscrepancy;
  @track selecteddiscrepancycomments = [];
  @track qccapturerole=false;
  @track qccaptureaction=false;
  @track isdelenabled=false;
  @track busstatuslist =[{'label': 'WIP', 'value' : 'WIP'}];
  @track selectedBusStatus = 'WIP';
  @track isbusareaarray = false;
  @track departmentIdMap = [{'bus_area_discrepancy_enabled':true,
                            'label':'All Departments',
                            'value': '0'}];
  @track statusascomment = false;
  @track statuscommentmap = {
    "resolve": "Status changed to Resolved",
    "approve": "Status changed to Verified",
    "open": "Status changed to Open"
  };

  @track statuslistfiltervalue = [{ label: "All Defect Status", value: "All Defect Status" }, { label: "Open", value: "open" }, { label: "Resolved", value: "resolve" }, { label: "Verified", value: "approve" }];
  @track selectedstatus = "All Defect Status";
  @track discdepartmentchanged = false;
  @track enablediscupdate = false;
    

  // Use whenever a false attribute is required in Component.html
  get returnfalse() {
    return false;
  }

  get isdeletable(){
    return this.isdelenabled;
  }

  // Use whenever a true attribute is required in Component.html
  get returntrue() {
    return true;
  }

  get disctype() {
    var discrepancytypes = [
      { label: "Normal Discrepancy", value: "buildstation" },
      { label: "Department Discrepancy", value: "department" }
    ];
    return discrepancytypes;
  }

  get disclistempty() {
    return this.filtereddiscrepancy.length == 0;
  }
  get isdepartmentdisclistempty() {
    return this.filtereddepartmentdiscrepancy.length == 0;
  }

  // get disableprodforupdate() {
  //   var updatepermission=false;
  //   if(this.selecteddiscrepancy.discrepancy_type=='department'){
  //     updatepermission=this.permissionset.dept_discrepancy_update_prod.write;
  //   }else if(this.selecteddiscrepancy.discrepancy_type=='busarea')
  //   {
  //     updatepermission=this.permissionset.busarea_discrepancy_update_prod.write;
  //   }
  //   else{
  //     updatepermission=this.permissionset.discrepancy_update_prod.write;
  //   }
  //   // if (this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" && updatepermission ) {
  //   //   return true;
  //   // } else {
  //   //   return false;
  //   // }
  //   return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !updatepermission;
  // }
  get disableprodforupdate() {
    var updatepermission = false;
    var enablebutton = true;
    if (this.selecteddiscrepancy.discrepancy_type == 'department') {
      updatepermission = this.permissionset.dept_discrepancy_update_prod.write;
    } else if (this.selecteddiscrepancy.discrepancy_type == 'busarea') {
      updatepermission = this.permissionset.busarea_discrepancy_update_prod.write;
    }
    else {
      updatepermission = this.permissionset.discrepancy_update_prod.write;
    }
    if (this.discdepartmentchanged) {
      if (this.isbsrequired && this.selecteddiscrepancy.buildstation_id == null) {
        enablebutton = false;
      }
    }
    return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !updatepermission || !enablebutton;
  }

  get disableqcforupdate() {
    if (this.selecteddiscrepancy.discrepancy_status.toLowerCase() == "approve") {
      return true;
    } else {
      return false;
    }
  }

  get departmentnotselected(){
    if(this.newdiscrepancy.departmentid == undefined){
      return true;
    }else{
      return false;
    }
  }
  
  get ecardnotselected(){
    if(this.newdiscrepancy.ecardid == undefined){
      return true;
    }else{
      return false;
    }
  }

  //used to dispaly/hide the preview image colomn
  get isdepartmentPaint(){
    var isdepartmentpaintortrim = false;
    var departmentname = this.selecteddepartement;
    for(var i in this.departmentIdMap){
        if(this.departmentIdMap[i].label == departmentname){
            isdepartmentpaintortrim = this.departmentIdMap[i].bus_area_discrepancy_enabled;
        }
    }
    return isdepartmentpaintortrim;
}

  get enablediscdepartmentedit() {
    var updatepermission = false;
    if (this.loggedinuser.approle_id == 2 || this.loggedinuser.approle_id == 4 || this.loggedinuser.approle_id == 1) {
      updatepermission = true;
    }
    // if (this.selecteddiscrepancy.discrepancy_type == 'department') {
    //   updatepermission = this.permissionset.dept_discrepancy_update_prod.write;
    // } else if (this.selecteddiscrepancy.discrepancy_type == 'busarea') {
    //   updatepermission = this.permissionset.busarea_discrepancy_update_prod.write;
    // }
    // else {
    //   updatepermission = this.permissionset.discrepancy_update_prod.write;
    // }
    return this.selecteddiscrepancy.discrepancy_status.toLowerCase() == "open" && this.selecteddiscrepancy.discrepancy_type != "Bus Area" && updatepermission;
  }

  get enablediscbsedit(){
    return this.enablediscdepartmentedit && this.discdepartmentchanged;
  }

  get departmentid(){
    return this.selecteddiscrepancy.department_id.toString();
  }

  get isbsrequired(){
    return this.selecteddiscrepancy.discrepancy_type != 'Department';
  }

  // //used to display/hide the shortage button
  // get disablediscbtn() {
  //   if (this.permissionset != undefined) {
  //     return !this.permissionset.discrepancy_new.write;
  //   }
  //   else return false;
  // }

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

  connectedCallback() {
    loadStyle(this, HideLightningHeader);
    this.getloggedinuser();
    this.getPermissionsfromserver();
    this.setdepartmentidmap();
    this.showSpinner = true;
    this.loaddataforview(event);
    pubsub.register('operationrefresh', this.refreshDiscrepancy.bind(this));
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

  /* To change view from Normal Discrepancy to Departmental Discrepancy.
    changeview(event){
        this.selectedview = event.currentTarget.dataset.label;
        event.target.variant = 'brand';
        if(this.selectedview != this.previousview){
            var element = this.template.querySelector('[data-label="' + this.previousview +'"]');
            element.variant = '';
            this.previousview = event.currentTarget.dataset.label;
        }
        this.loaddataforview(event);
    } */

  // Load Data from Server.
  loaddataforview(event) {
    var today = new Date();
    var start = today;
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
    this.showSpinner = true;
    var statuslist = [];
    if (this.selectedBusStatus != 'All Bus Status') {
      statuslist.push(this.selectedBusStatus.replaceAll(" ", "%20"));
    }
    else{
      statuslist = null;
    }
    var statusparm = { bus_status: statuslist};
    getAllDiscrepanciesfromServer({ecardbusstatus : JSON.stringify(statusparm)})
      .then((response) => {
        if (response.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Discrepancy List.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
          throw "Data fetch failed";
        } else {
          today = new Date();
          time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
          var elapsed = today. getTime() - start;
          console.log('Discrepancy DB :- Time after excuting API call :', time );
          console.log('Discrepancy DB :- Time Difference in milliseconds:', elapsed);
          let completediscrepancydata = JSON.parse(response.responsebody).data.discrepancylog;
          var moddeddiscrepancydata = [];
          var customernamechasislist = [];
          var createdbyuserslist = [];
          var assigneduserslist=[];
          for (var disc in completediscrepancydata) {
            var discrepancy = completediscrepancydata[disc];
            var isdepartmentdiscrepancy = false;
            if (discrepancy.discrepancy_type == "department") {
              isdepartmentdiscrepancy = true;
            }
            var isdownstreamdiscrepancy = false;
            if (discrepancy.discrepancy_type == "downstream") {
              isdownstreamdiscrepancy = true;
            }
            // alert(isdepartmentdiscrepancy);
            var selectedprodlist = this.getselectedformandetails(discrepancy);
            var allprodlist = this.modifyuserlistfordisplay(discrepancy.prod);
            var allqclist = this.modifyuserlistfordisplay(discrepancy.qc);
            var assigend_qc_id = this.modifyuserlistfordisplay([
              discrepancy.assigend_qc_id
            ]);
            var created_by = this.modifyuserlistfordisplay([
              discrepancy.createdby_id
            ]);
            var raised_date = this.getmoddeddate(discrepancy.raised_date);
            var createdbyname;
            var displaycreatedbyname;
            var createdbyempid=undefined;
            if (created_by != undefined && created_by.length != 0) {
              if (created_by[0] != undefined) {
                displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${raised_date}`;
                createdbyname = `${created_by[0].name}`;
                createdbyempid= `${created_by[0].userid}`;
              }
            }

            allprodlist = this.updateprodlistwithall(
              selectedprodlist,
              allprodlist
            );

            var raisedby_name;
            var displayraisebyname;
            if (assigend_qc_id != undefined && assigend_qc_id.length != 0) {
              if (assigend_qc_id[0] != undefined) {
                displayraisebyname = `${assigend_qc_id[0].name} (${assigend_qc_id[0].userid})`;
                raisedby_name = `${assigend_qc_id[0].name} (${assigend_qc_id[0].userid})`;
              }
            }
            var resolved_status_updatedby = this.modifyuserlistfordisplay([
              discrepancy.resolved_status_updatedby_id
            ]);
            var verifiedby = this.modifyuserlistfordisplay([
              discrepancy.verifiedby_id
            ]);
            var assigneduser = [];
            if (discrepancy.discrepancy_status.toLowerCase() == "open") {
              assigneduser = selectedprodlist;
            } else if (discrepancy.discrepancy_status.toLowerCase() == "resolve") {
              assigneduser = assigend_qc_id;
            } else if (discrepancy.discrepancy_status.toLowerCase() == "approve") {
              assigneduser = assigend_qc_id;
            } else {
              assigneduser = selectedprodlist;
            }
            var hasbusareapicture = false;
            if(discrepancy.bus_area_picture_id != undefined){
                hasbusareapicture = true;
            }
            var discrepancytype = discrepancy.discrepancy_type;
                if(discrepancy.discrepancy_type == 'busarea' ){
                    discrepancytype = 'Bus Area';
                }

            var bsavailable=discrepancy.buildstation_code=='9999'?false:true;
            //alert(discrepancy.modified_date);    
            var is_deletable=false;
            if((createdbyempid==this.loggedinuser.appuser_id) && (discrepancy.discrepancy_status.toLowerCase()=="open")){
              is_deletable=true;
            }    
            var modeddiscrepancy = {
              modified_date : discrepancy.modified_date,
              hasbusareapicture : hasbusareapicture,
              bus_area : discrepancy.bus_area,
              bus_area_picture_id : discrepancy.bus_area_picture_id,
              buildstation_code: discrepancy.buildstation_code,
              buildstation_id: discrepancy.buildstation_id,
              busstatus_id: discrepancy.busstatus_id,
              busstatus_name: discrepancy.busstatus_name,
              chassis_no: discrepancy.chassis_no,
              component: discrepancy.component,
              first_name: discrepancy.first_name,
              last_name: discrepancy.last_name,
              customername: `${discrepancy.customer_name}`,
              customernamewithchasis: `${discrepancy.customer_name}, ${discrepancy.chassis_no}`,
              cut_off_date: discrepancy.cut_off_date,
              dat_defect_code_id: discrepancy.dat_defect_code_id,
              defect_codename: `${discrepancy.defect_code}, ${discrepancy.defect_name}`,
              defect_code: discrepancy.defect_code,
              defect_name: discrepancy.defect_name,
              defect_type: this.capitalize(discrepancy.defect_type),
              department_id: discrepancy.department_id,
              department_name: discrepancy.department_name,
              description: discrepancy.discrepancy,
              discrepancy_priority: this.capitalize(
                discrepancy.discrepancy_priority
              ),
              discrepancy_statusdisplay: setstatusfordisplay(
                discrepancy.discrepancy_status.toLowerCase()
              ),
              discrepancy_status: discrepancy.discrepancy_status.toLowerCase(),
              discrepancy_type: this.capitalize(discrepancytype),
              isdepartmentdiscrepancy: isdepartmentdiscrepancy,
              isdownstreamdiscrepancy: isdownstreamdiscrepancy,
              isdeletable:is_deletable,
              ecard_discrepancy_log_id: discrepancy.ecard_discrepancy_log_id,
              ecard_discrepancy_log_number:discrepancy.discrepancy_log_number,
              ecard_id: discrepancy.ecard_id,
              ecard_operation_log_id: discrepancy.ecard_operation_log_id,
              has_part_shortage: discrepancy.has_part_shortage,
              resolved_date: this.getmoddeddate(discrepancy.resolved_date),
              disc_bsavailable:bsavailable,
              workcenter_name: discrepancy.workcenter_name,
              workcenter_code: discrepancy.workcenter_code,
              part_avilable: discrepancy.part_avilable,
              raised_date_display: this.getmoddeddate(discrepancy.raised_date),
              raised_date: discrepancy.raised_date,
              raised_status_updated_date:
              discrepancy.raised_status_updated_date,
              root_cause: discrepancy.root_cause,
              verified_date: discrepancy.verified_date,
              verified_status_updated_date:
                discrepancy.verified_status_updated_date,
              selectedprodlist: selectedprodlist,
              allprodlist: allprodlist,
              allqclist: allqclist,
              assigend_qc_id: assigend_qc_id,
              resolved_status_updatedby: resolved_status_updatedby,
              verifiedby: verifiedby,
              assigneduser: assigneduser,
              created_by: created_by,
              createdbyname: createdbyname,
              displaycreatedbyname: displaycreatedbyname,
              filtered: "",
              formatteddatetosearch: this.getformatedsearchformat(
                discrepancy.raised_date
              ),
              status_bgcolor: this.getStatusColor(discrepancy.discrepancy_status)
            };
            if (modeddiscrepancy.createdbyname != undefined) {
              createdbyuserslist.push(modeddiscrepancy.createdbyname);
            }
            if (modeddiscrepancy.assigneduser.length > 0) {
              for(var i in modeddiscrepancy.assigneduser){
                if(modeddiscrepancy.assigneduser[i].Name != undefined){
                  assigneduserslist.push(modeddiscrepancy.assigneduser[i].Name);
                }
              }
              /*for(var i in modeddiscrepancy.selectedprodlist){
                if(modeddiscrepancy.selectedprodlist[i].Name != undefined){
                  assigneduserslist.push(modeddiscrepancy.selectedprodlist[i].Name);
                }
              }*/
            }
            customernamechasislist.push(modeddiscrepancy.customername);
            customernamechasislist.push(modeddiscrepancy.chassis_no);
            moddeddiscrepancydata.push(modeddiscrepancy);
          }
          this.createdbyuserslist = Array.from(new Set(createdbyuserslist));
          this.assigneduserslist = Array.from(new Set(assigneduserslist));
          this.customernamechasislist = Array.from(
            new Set(customernamechasislist)
          );
          this.alldiscrepancy = moddeddiscrepancydata;
          this.filtereddiscrepancy = moddeddiscrepancydata;
          this.showSpinner = false;
          var pageload = new Date();
          time = pageload.getHours() + ":" + pageload.getMinutes() + ":" + pageload.getSeconds()+":"+pageload.getMilliseconds();
          elapsed = pageload. getTime() - today;
          console.log('E-Card :- Time after Page Load :', time );
          console.log('E-Card :- Time Page Load in milliseconds:', elapsed);
          this.applyfilterchanges();
        }
      })
      .catch((error) => {
        this.error = error;
        //alert('Some error has occured please contact your Admin' + JSON.stringify(error));
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Discrepancy List.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }

  // Update PROD list with users not in scheduled
  updateprodlistwithall(selectedprod, allprod) {
    function checkifexisting(element, searcharray) {
      var elementexisting = true;
      for (var i in searcharray) {
        if (searcharray[i].Id == element) {
          elementexisting = false;
        }
      }
      return elementexisting;
    }
    var updatedprodlist = [];
    if (allprod != undefined && allprod.length != 0) {
      updatedprodlist = JSON.parse(JSON.stringify(allprod));
    }
    if (selectedprod != undefined && selectedprod.length != 0) {
      for (var i in selectedprod) {
        if (checkifexisting(selectedprod[i].Id, updatedprodlist)) {
          updatedprodlist.push(selectedprod[i]);
        }
      }
    }
    return updatedprodlist;
  }

  // Capitalize string passe
  capitalize(text) {
    if (typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Set date format for searching
  getformatedsearchformat(datetoformat) {
    var formatteddate = undefined;
    if (datetoformat != undefined) {
      formatteddate = new Date(datetoformat);
      var month = formatteddate.getMonth() + 1;
      var newmonth = month <= 9 ? "0" + month : month;
      var date = formatteddate.getDate();
      var newdate = date <= 9 ? "0" + date : date;
      var year = formatteddate.getFullYear();
      return `${year}-${newmonth}-${newdate}`;
    } else {
      return undefined;
    }
  }

  // Get stringified modded date
  getmoddeddate(date) {
    var formatteddate = undefined;
    if (date != undefined) {
      var jsdate = new Date(date);
      var hours = jsdate.getHours();
      var minutes = jsdate.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return (
        jsdate.getMonth() +
        1 +
        "/" +
        jsdate.getDate() +
        "/" +
        jsdate.getFullYear() +
        ", " +
        strTime
      );
    }
    return formatteddate;
  }

  // To modify userlist for Display purposes.
  modifyuserlistfordisplay(userlist) {
    var newuserlist = [];
    if (userlist.length != 0 && userlist != undefined) {
      for (var count in userlist) {
        var user = userlist[count];
        if (user != undefined) {
          var name = `${user.first_name} ${user.last_name}`; // 
          var dispname=`${user.first_name} ${user.last_name} (${user.employee_number})`;
          var emp_id=`${user.employee_number}`;
          var initials = name.match(/\b\w/g) || [];
          initials = (
            (initials.shift() || "") + (initials.pop() || "")
          ).toUpperCase();
          var newuser = {
            Id: user.employee_id,
            Name: `${user.first_name} (${user.employee_number})`,
            name: `${user.first_name} (${user.employee_number})`,
            fullname : name,
            displayname:dispname,
						empid:emp_id,
            userid: user.employee_id,
            piclink: "",
            username: user.appuser_name,
            intials: initials
          };
          newuserlist.push(newuser);
        }
      }
    }
    return newuserlist;
  }

  // To get the forman details in a list format from API structure.
  getselectedformandetails(discrepancyobj) {
    var users = [];
    for (var i = 0; i < 5; i++) {
      if (discrepancyobj[`forman${i + 1}_id`] != undefined) {
        users.push(discrepancyobj[`forman${i + 1}_id`]);
      }
    }
    return this.modifyuserlistfordisplay(users);
  }

  // To sort Normal Discrepancy Table
  sortdiscrepancytable(event) {
    var previousSorted = this.previousColumn;
    if (previousSorted != undefined) {
      if (event.currentTarget.dataset.id != previousSorted) {
        const element = this.template.querySelector(
          '[data-id="' + previousSorted + '"]'
        );
        element.iconName = "";
        this.previousColumn = event.currentTarget.dataset.id;
      } else {
        this.previousColumn = event.currentTarget.dataset.id;
      }
    } else {
      this.previousColumn = event.currentTarget.dataset.id;
    }

    if (this.sortedColumn === event.currentTarget.dataset.id) {
      this.sortedDirection = this.sortedDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortedDirection = "asc";
    }
    var reverse = this.sortedDirection === "asc" ? 1 : -1;
    let table = JSON.parse(JSON.stringify(this.filtereddiscrepancy));
    table.sort((a, b) => {
      return a[event.currentTarget.dataset.id] >
        b[event.currentTarget.dataset.id]
        ? 1 * reverse
        : -1 * reverse;
    });
    this.filtereddiscrepancy = table;
    this.sortedColumn = event.currentTarget.dataset.id;

    if (this.sortedDirection === "asc") {
      event.target.iconName = "utility:chevronup";
    }
    if (this.sortedDirection === "desc") {
      event.target.iconName = "utility:chevrondown";
    }
  }

  // To load picklist values for view on request.
  loadpicklistvalues(event) {
    var picklistname = event.target.name;
    if (event.target.options.length == 1) {
      getPicklistOptions({ picklistName: picklistname })
        .then((data) => {
          if (data.isError) {
            const alertmessage = new ShowToastEvent({
              title: "Picklist data value failed to fetch.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
            throw "Data fetch failed";
          } else {
            var options = data.options;
            if (picklistname == "departments") {
              this.departmentlist = options;
            }
          }
        })
        .catch((error) => {
          this.error = error;
          //alert('Some error has occured please contact your Admin' + JSON.stringify(error));
          const alertmessage = new ShowToastEvent({
            title: "Picklist data value failed to fetch.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        });
    }
  }

  setdepartmentidmap() {
    getDepartmentdata({ authdata: '' })
      .then(result => {
        for (var dept in result.departmentPickList) {
          var deprtmentopt = result.departmentPickList[dept];
          if (deprtmentopt.value != 'None') {
            this.departmentIdMap.push(deprtmentopt);
          }
        }
      })
      .catch(error => {
        this.showSpinner = true;
        const alertmessage = new ShowToastEvent({
          title: 'Department data fetch failed.',
          message: 'Something unexpected occured. Please contact your Administrator',
          variant: 'error'
        });
        this.dispatchEvent(alertmessage);
      });
  }

  // Handle Department Change
  handledepartmentchange(event) {
    this.selecteddepartement = event.detail.value;
    this.applyfilterchanges(event);
  }

  // Handle Defect Change
  handledefectchange(event) {
    this.selecteddefect = event.detail.value;
    this.applyfilterchanges(event);
  }
  // Handle Discrepancy status Change
  handlediscrepancystatuschange(event) {
    this.selectedstatus = event.detail.value;
    this.applyfilterchanges(event);
  }

  // Handle Defect Change
  handledisctypechange(event) {
    this.selecteddisctype = event.detail.value;
    this.applyfilterchanges(event);
  }

  handlecreateddatechange(event) {
    // this.selectedcreatedddate = this.getformatedsearchformat(
    //   event.target.value
    // );
    this.selectedcreatedddate = event.target.value;//
    // alert(this.selectedcreatedddate);
    this.applyfilterchanges(event);
  }

  // On Customer Name/Chasis Number selection
  oncustomerselection(event) {
    if (event.detail.labelvalue == "Customer") {
      this.selectedCustomer = event.detail.selectedRecord;
    }
    this.applyfilterchanges(event);
  }

  // On clearing the customer selection.
  onclearcustomer(event) {
    this.selectedCustomer = undefined;
    this.applyfilterchanges(event);
  }

  // On selecting created by user filter
  oncreatedbyselect(event) {
    if (event.detail.labelvalue == "Created By") {
      //this.selectedassignedtouser= event.detail.selectedRecord;
      this.selectedcreatedbyuser = event.detail.selectedRecord;
    }
    this.applyfilterchanges(event);
  }

  // On clearing the created by user selection.
  onclearcreatedby(event) {
    this.selectedcreatedbyuser = undefined;
    //this.selectedassignedtouser = undefined;
    this.applyfilterchanges(event);
  }

  // To Apply the filter changes and reflect in the view.
  applyfilterchanges(event) {
    var selecteddepartment = this.selecteddepartement;
    var selectedcustomer = this.selectedCustomer;
    var selecteddisctype = this.selecteddisctype;
    var selecteddefect = this.selecteddefect;
    var selectedcreateddate = this.selectedcreatedddate;
    var selectedcreatedby = this.selectedcreatedbyuser;
    var selectedassignedto = this.selectedassignedtouser;
    this.showSpinner = true;
    var selectedstatus = this.selectedstatus
    var filtereddiscrepancies = [];
    var completedata = JSON.parse(JSON.stringify(this.alldiscrepancy));
    for (var discr in completedata) {
      var discrepancy = completedata[discr];
      var discfilter = discrepancy.filtered;
      if (selectedcustomer != undefined) {
        if (
          discrepancy.customername == selectedcustomer ||
          discrepancy.chassis_no == selectedcustomer
        ) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
      if (
        selecteddepartment != undefined &&
        selecteddepartment != "All Departments"
      ) {
        if (discrepancy.department_name == selecteddepartment) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
      if (
        selecteddisctype != undefined &&
        selecteddisctype != "All Discrepancies"
      ) {
        if (discrepancy.discrepancy_type == this.capitalize(selecteddisctype)) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
      if (selecteddefect != undefined && selecteddefect != "All Defect Code") {
        if (discrepancy.dat_defect_code_id == selecteddefect) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
    if (selectedstatus != undefined && selectedstatus != "All Defect Status") {
        if (discrepancy.discrepancy_status.toLowerCase() == selectedstatus.toLowerCase()) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      } 
      if (selectedcreateddate != undefined && selectedcreateddate != "") {
        if (discrepancy.formatteddatetosearch == selectedcreateddate) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
      if (selectedcreatedby != undefined) {
        if (discrepancy.createdbyname == selectedcreatedby) {
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }
      if ((selectedassignedto != undefined)) {
        var assignedprodnamematch=false;
        for(var i in discrepancy.selectedprodlist){
          if(discrepancy.selectedprodlist[i].Name==selectedassignedto){
            assignedprodnamematch=true;
          }
        }
        if ((discrepancy.assigneduser.length>0) && ((discrepancy.assigneduser[0].Name == selectedassignedto)||assignedprodnamematch)) {
          debugger;
        } else {
          discrepancy.filtered = discfilter + " invisible";
        }
      }

      //alert(discrepancy.filtered);
      if (!discrepancy.filtered.includes("invisible")) {
        filtereddiscrepancies.push(discrepancy);
      }
    }
    this.filtereddiscrepancy = [];
    this.filtereddiscrepancy = filtereddiscrepancies;
    this.showSpinner = false;
  }

  //To get all Ecard Details from Server
  getAllEcarddetails(event) {
    getAllEcarddetailsfromServer()
      .then((result) => {
        var ecards = JSON.parse(result.response).data.ecard;
        var ecardoptions = [];
        for (var ec in ecards) {
          //${ecards[ec].first_name} ${ecards[ec].customer_name}
          var ecardopt = {
            label: `${ecards[ec].chassis_no} (${ecards[ec].customer_name})`,
            value: ecards[ec].ecard_id.toString()
          };
          ecardoptions.push(ecardopt);
        }
        this.ecardoptions = ecardoptions;
        var ecardnamelist = [];
        for (var ecard in this.ecardoptions) {
          ecardnamelist.push(this.ecardoptions[ecard].label);
        }
        this.ecardnamechasislist = ecardnamelist;
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch list of Bus.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }

  // To show Add new discrepancy modal and set the default values.
  addnewdiscrepancymodal(event) {
    this.s3tempurlfornewdiscrepancy = [];
    this.fetchcompletedefectList();
    this.getAllEcarddetails();
    var todaydate = new Date();
    let newdiscrepancy = {
      description: null,
      date: this.getmoddeddate(todaydate),
      type: "buildstation",
      ecardid: undefined,
      departmentid: undefined,
      buildstation_id: undefined,
      priority: "Normal",
      defectcode: undefined,
      qclist: [],
      prodlist: [],
      allQClist: [],
      allPRODlist: []
    };
    this.newdiscrepancy = newdiscrepancy;
    this.buildstationrequired=true;
    this.newdiscrepancymodal = true;
  }

  @track buildstationrequired=true;
  // Update New Discrepancy values
  modifynewdiscrepancyvalues(event) {
    var targetvalue = event.target.value;
    var targetname = event.target.name;
    //this.deptid=undefined;
    this.newdiscrepancy[targetname] = targetvalue;
    if (targetname == "type") {
      this.buildstationrequired = targetvalue=='department'?false:true;
      var emptylist = [];
      this.newdiscrepancy.departmentid = undefined;
      this.newdiscrepancy.buildstation_id = undefined;
      this.newdiscrepancy.defectcode = undefined;
      this.newdiscrepancy.qclist = emptylist;
      this.newdiscrepancy.prodlist = emptylist;
      this.newdiscrepancy.allQClist = emptylist;
      this.newdiscrepancy.allPRODlist = emptylist;
    }
    if (targetname == "departmentid") {
      //this.deptid=targetvalue;
      this.newdiscrepancy.departmentid = targetvalue;
      if (this.newdiscrepancy.ecardid != undefined) {
        this.moddifydefectpickvalues(targetvalue);
        var ecardid = this.newdiscrepancy.ecardid;
        var departmentId = targetvalue;
        var ecardiddeptid = { ecard_id: ecardid, dept_id: departmentId };
        getDepartmentOperations({
          ecardiddeptid: JSON.stringify(ecardiddeptid)
        })
          .then((data) => {
            var prod_supervisor = this.getmodifiediserlist(
              data.builstationMapWrapper.prod_supervisor
            );
            this.deptsupervisorforselecteddept = prod_supervisor;
            this.buildstationoptions = data.buildstationList;
            this.selecteddeptbsdetails = this.getcompleteBuilstationlist(data);
            this.newdiscrepancy.buildstation_id = undefined;
          })
          .catch((error) => {
            this.error = error;
            const alertmessage = new ShowToastEvent({
              title: "Failed to fetch Build Station Details.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
          });
      } else {
        this.newdiscrepancy.departmentid = undefined;
        const alertmessage = new ShowToastEvent({
          title: "Select a Bus.",
          message: "Please select a Bus before selecting Department.",
          variant: "warning"
        });
        this.dispatchEvent(alertmessage);
      }
    }
    if (targetname == "buildstation_id") {
      var buildstationdetails = this.selecteddeptbsdetails;
      var buildstationId = targetvalue;
      var selectedbuildstation;
      for (var bs in buildstationdetails) {
        if (
          buildstationId.toString() ==
          buildstationdetails[bs].buildstation_id.toString()
        ) {
          selectedbuildstation = buildstationdetails[bs];
        }
      }
      this.newdiscrepancy.buildstation_id = selectedbuildstation.buildstation_id.toString();
      // Set Prod and QC also
      //var alluserdata = this.completeuserslist;
      var allPRODlist = [];
      var allQClist = [];
      var PRODlist = [];
      if (selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0) {
        allQClist = selectedbuildstation.QClist;
      }
      if (this.newdiscrepancy.type == "department") {
        if (this.deptsupervisorforselecteddept.length != 0) {
          allPRODlist = this.deptsupervisorforselecteddept;
        }
        PRODlist = this.deptsupervisorforselecteddept;
      } else {
        if (selectedbuildstation.PRODlist!=null && selectedbuildstation.PRODlist.length != 0) {
          allPRODlist = selectedbuildstation.PRODlist;
        }
        PRODlist = selectedbuildstation.selectedprod;
      }
      var QClist = selectedbuildstation.selectedqc;
      this.newdiscrepancy.qclist = QClist;
      this.newdiscrepancy.prodlist = PRODlist;
      this.newdiscrepancy.allPRODlist = allPRODlist;
      if(this.newdiscrepancy.allPRODlist.length==0){
          var userdetails=[];
           getcrewingsuserslist({deptid:this.newdiscrepancy.departmentid})
           .then((result) => {
           userdetails = JSON.parse(result.responsebody).data.user;
           this.newdiscrepancy.allPRODlist = userdetails.length>0?modifieduserlist(userdetails):userdetails;
           })
           .catch((error) => {
           });
      }
      this.newdiscrepancy.allQClist = allQClist;
    }
  }

  // Update Bus/Ecard selected in new disscrepancy
  onbusselection(event) {
    if (event.detail.labelvalue == "Select a Bus") {
      var selectedbus = event.detail.selectedRecord;
      for (var ecard in this.ecardoptions) {
        if (selectedbus == this.ecardoptions[ecard].label) {
          this.newdiscrepancy.ecardid = this.ecardoptions[ecard].value;
        }
      }
    }
  }

  // On clearing the bus selection.
  onclearbus(event) {
    var emptylist = [];
    this.newdiscrepancy.ecardid = undefined;
    this.newdiscrepancy.departmentid = undefined;
    this.newdiscrepancy.buildstation_id = undefined;
    this.newdiscrepancy.defectcode = undefined;
    this.newdiscrepancy.qclist = emptylist;
    this.newdiscrepancy.prodlist = emptylist;
    this.newdiscrepancy.allQClist = emptylist;
    this.newdiscrepancy.allPRODlist = emptylist;
  }

  // Update PROD And QC on New Discrepancy
  updateuserselectonnewdesc(event) {
    var detail = event.detail;
    //alert(JSON.stringify(detail));
    if (detail.type == "QC") {
      this.newdiscrepancy.qclist = detail.userlist;
    }
    if (detail.type == "PROD") {
      this.newdiscrepancy.prodlist = detail.userlist;
    }
  }

  // To hide the new Discrepancy modal
  hidenewdiscrepancymodal(event) {
    this.newdiscrepancymodal = false;
    this.deletetempattachments();
    
  }

  // Add new Discrepancy to Server
  addnewdiscrepancytoserver(event) {
    // Check Validations
    const allValid = [
      ...this.template.querySelectorAll(".newdiscvalidation")
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);
    if (allValid) {
      //Submit information on Server
      event.target.disabled = true;
      var newdiscrepancyvalues = this.newdiscrepancy;
      if (newdiscrepancyvalues.type=='department' && newdiscrepancyvalues.buildstation_id==undefined){
        newdiscrepancyvalues.buildstation_id=null;
      }
      var newdiscrequestbody = {
        discrepancy_type: newdiscrepancyvalues.type,
        discrepancy_priority: newdiscrepancyvalues.priority,
        discrepancy_status: "open",
        //"has_part_shortage": false,
        ecard_id: newdiscrepancyvalues.ecardid,
        department_id: newdiscrepancyvalues.departmentid,
        discrepancy: newdiscrepancyvalues.description,
        dat_defect_code_id: newdiscrepancyvalues.defectcode,
        buildstation_id: newdiscrepancyvalues.buildstation_id
      };

      /*if (newdiscrepancyvalues.qclist.length != 0) {
        newdiscrequestbody["assigend_qc_id"] =
          newdiscrepancyvalues.qclist[0].Id;
      }*/
      /*if(this.qccapturerole){
        newdiscrequestbody["qc_approvedby_id"] =  this.loggedinuser.appuser_id;
        //this.qccaqccaptureaction = false;
      }*/
      var disctype = newdiscrepancyvalues.type;
      //if(disctype == 'buildstation'){
        if(this.s3tempurlfornewdiscrepancy.length != 0){
            newdiscrequestbody["s3_file_paths"] = JSON.stringify(this.s3tempurlfornewdiscrepancy);
        }
        else{
            newdiscrequestbody["s3_file_paths"] = null;
        }
   // }
      var withforemans = this.updateformans(
        JSON.stringify(newdiscrequestbody),
        newdiscrepancyvalues.prodlist
      );
      //alert(JSON.stringify(withforemans));
      raisenewDiscrepancy({
        requestbody: JSON.stringify(withforemans),
        discrepancytype: disctype
      })
        .then((data) => {
          if (data.isError) {
            const alertmessage = new ShowToastEvent({
              title: "Sorry we could not complete the operation.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
            event.target.disabled = false;
          } else {
            const alertmessage = new ShowToastEvent({
              title: "Added new Discrepancy",
              message: "A new discrepancy was successfully raised.",
              variant: "success"
            });
            this.dispatchEvent(alertmessage);
            event.target.disabled = true;
            this.newdiscrepancymodal = false;
            this.loaddataforview();
          }
        })
        .catch((error) => {
          this.error = error;
          event.target.disabled = false;
          const alertmessage = new ShowToastEvent({
            title: "Sorry we could not complete the operation.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        });
    } else {
      const alertmessage = new ShowToastEvent({
        title: "Please fill all required fields.",
        message: "Please fill required and update all blank form entries",
        variant: "warning"
      });
      this.dispatchEvent(alertmessage);
    }
  }

  // To Update the responsebody with selected formanIds from List Views.
  updateformans(responsebody, formanlist) {
    var newresponse = JSON.parse(responsebody);
    var newformanlist;
    if (formanlist.length > 5) {
      newformanlist = formanlist.slice(0, 5);
    } else {
      newformanlist = formanlist;
    }
    for (var i = 0; i < newformanlist.length; i++) {
      newresponse[`forman${i + 1}_id`] = newformanlist[i].userid;
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

  // Get Department picklist from server
  getdepartmentPicklist(event) {
    // var authorisationdata = "Parameter to be removed from Apex Class";
    // getDepartmentdata({ authdata: authorisationdata })
    //   .then((result) => {
    //     var departmentlistvalues = result.departmentPickList;
    //     var deptpickvalues = [];
    //     for(var dept in departmentlistvalues){
    //       var deprtmentopt = departmentlistvalues[dept];
    //       if(deprtmentopt.value != 'None'){
    //          deptpickvalues.push(deprtmentopt);
    //       }
    //     }
    //     this.departmentoptions = deptpickvalues;
    //   })
    //   .catch((error) => {
    //     const alertmessage = new ShowToastEvent({
    //       title: "Department data fetch failed.",
    //       message:
    //         "Something unexpected occured. Please contact your Administrator",
    //       variant: "error"
    //     });
    //     this.dispatchEvent(alertmessage);
    //   });
    var options = [];
    for (var i in this.departmentIdMap) {
      if (this.departmentIdMap[i].value != 'None' && this.departmentIdMap[i].label != 'ALL DEPARTMENTS' && this.departmentIdMap[i].label != 'All Departments') {
        if (!this.departmentIdMap[i].bus_area_discrepancy_enabled) {
          options.push(this.departmentIdMap[i]);
        }
      }
    }
    this.departmentoptions = options;
  }

  // To modify the userlist from API to shown in userlistIconComponent.(Will need to incorporate picture link.)
  // List structure needs to contain [first_name, employee_id, appuser_name]
  // List returned will be of contain [name, userid, piclink, username, intials]
  getmodifiediserlist(userlist) {
    var newuserlist = [];
    if (userlist.length != 0) {
      for (var count in userlist) {
        var user = userlist[count];
        var name = `${user.first_name} ${user.last_name}`;
        var dispname=`${user.first_name} ${user.last_name} (${user.employee_number})`;
        var emp_id=`${user.employee_number}`;
        var initials = name.match(/\b\w/g) || [];
        initials = (
          (initials.shift() || "") + (initials.pop() || "")
        ).toUpperCase();
        var newuser = {
          Name: user.name,
          name: user.name,
          fullname : name,
          displayname:dispname,
					empid:emp_id,
          Id: user.employee_id,
          userid: user.employee_id,
          piclink: "",
          username: user.appuser_name,
          intials: initials
        };
        newuserlist.push(newuser);
      }
    }
    return newuserlist;
  }

  // To get Complete Defect List from API.
  fetchcompletedefectList(event) {
    if(this.defectlist.length == 1){
      getCompleteDefectCodes()
      .then((data) => {
        if(data.isError){
          this.error = error;
          const alertmessage = new ShowToastEvent({
            title: "Defect Data fetch failed.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
      }
      else{
        var alldefects = JSON.parse(data.responsebody).data.defects;
        var alldefectcodes = [{ label: "All Defect Code", value: "All Defect Code" }];
        for (var defect in alldefects) {
          if(alldefects[defect].is_active){
            var option = {
              label:
                alldefects[defect].defect_code +
                ", " +
                alldefects[defect].defect_name,
              value: alldefects[defect].dat_defect_code_id.toString(),
              defectname: alldefects[defect].defect_name,
              defecttype: alldefects[defect].defect_type
            };
            alldefectcodes.push(option);
            if (alldefects[defect].defect_type != "paint") {
              this.otherdefects.push(option);
              //this.defectoptions.push(option);
            } else {
              this.paintdefects.push(option);
            }
          }
        }
        this.defectlist = alldefectcodes;
      }
      })
      .catch((error) => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
          title: "Defect Data fetch failed.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
    }
    
  }

  // To modify defect picklist values based on Department Selection
  moddifydefectpickvalues(deptcode) {
    var defecttype = 'department';
    var deptlist = JSON.parse(JSON.stringify(this.departmentoptions));
    for(var i in deptlist){
        if(deptlist[i].value === deptcode.toString()){
              defecttype = deptlist[i].defect_type;
        }
    }
    if (defecttype == 'paint') {
      this.defectoptions = this.paintdefects;
    } else {
      this.defectoptions = this.otherdefects;
    }
  }

  // For getting Buildstation Details on department/ecardId change for new Discrepancy.
  getcompleteBuilstationlist(data) {
    let workstationdata = data.builstationMapWrapper.workcenter;
    var prod_supervisor = this.modifyuserlistfordisplay(
      data.builstationMapWrapper.prod_supervisor
    );
    this.deptsupervisorforselecteddept = prod_supervisor;
    let modifiedworkstationdata = [];
    var QC = this.modifyuserlistfordisplay(data.builstationMapWrapper.qc);
    if (workstationdata.length != 0) {
      for (var wc in workstationdata) {
        let workcentre = workstationdata[wc];
        let workcenter_id = workcentre.workcenter_id;
        let workcentername = workcentre.workcentername;
        for (var bs in workcentre.buildstation) {
          var buildstation = workcentre.buildstation[bs];
          var PROD = this.modifyuserlistfordisplay(buildstation.prod);
          var selectedprod = this.getselectedformandetails(buildstation);
          var selectedqc = this.modifyuserlistfordisplay([
            buildstation.qc_approvedby_id
          ]);
          var modifiedwsdata = {
            workcenter_id: workcenter_id,
            ecard_operation_log_id: buildstation.ecard_operation_log_id,
            workcentername: workcentername,
            operation: buildstation.operation,
            hasdescrepancy:
              buildstation.has_descrepancy != undefined
                ? buildstation.has_descrepancy
                : false,
            buildstation_id: buildstation.buildstation_id,
            buildstation_code: buildstation.buildstation_code,
            selectedprod: selectedprod,
            selectedqc: selectedqc,
            PRODlist: PROD,
            QClist: QC
          };
          modifiedworkstationdata.push(modifiedwsdata);
        }
      }
    }
    return modifiedworkstationdata;
  }

  // For Showing the Details Modal
  showdetails(event) {
    this.enablediscupdate = false;
    this.discdepartmentchanged = false;
    var selecteddiscrepancylogid = event.currentTarget.dataset.id;
    for (var i in this.alldiscrepancy) {
      if (
        this.alldiscrepancy[i].ecard_discrepancy_log_id ==
        selecteddiscrepancylogid
      ) {
        this.selecteddiscrepancy = this.alldiscrepancy[i];
      }
    }
            //crewing Sajith
        
            if(this.selecteddiscrepancy.allprodlist.length==0){
              var departmentId=this.selecteddiscrepancy.department_id;
              var userdetails=[];
               getcrewingsuserslist({deptid:departmentId})
               .then((result) => {
               userdetails = JSON.parse(result.responsebody).data.user;
               userdetails = this.removeDuplicates(userdetails);//todo
               this.selecteddiscrepancy.allprodlist = userdetails.length>0?modifieduserlist(userdetails):userdetails;
               })
               .catch((error) => {
               });
          }
            //Crewing End
    this.getselecteddiscrepancycomments(selecteddiscrepancylogid);
    this.isdelenabled=false;
    if(this.selecteddiscrepancy.isdeletable || (this.permissionset.discrepancy_delete.write && this.selecteddiscrepancy.discrepancy_status.toLowerCase() =='open')){
            this.isdelenabled=true;
    }
    this.getdepartmentPicklist();
    this.detailsmodal = true;
  }

  // For Hiding the Details Modal
  hidediscrepancydetail(event) {
    this.detailsmodal = false;
  }

  // Update other fields of selected discrepancy
  updateselecteddiscrepancy(event) {
    var targetvalue = event.target.value;
    var targetname = event.target.name;
    this.selecteddiscrepancy[targetname] = targetvalue;
  }

  // Update user selection of selected discrepancy
  updateuserselection(event) {
    var detail = event.detail;
    // alert(JSON.stringify(detail.userlist));
    //alert(JSON.stringify(detail));
    if (detail.type == "QC") {
      this.selecteddiscrepancy.assigend_qc_id = detail.userlist;
    }
    if (detail.type == "PROD") {
      this.selecteddiscrepancy.selectedprodlist = detail.userlist;
    }
    this.updatediscrepancytoserver();
  }

  // Add new Comment to Discreepancy
  addnewdiscrepancycomment(event) {
    var ecarddiscrepancylogid = event.detail.uniqueId;
    var newcommentbody = {
      ecard_discrepancy_log_id: event.detail.uniqueId,
      /*"commentedby_id": event.detail.loggedinuserid,*/

      discrepancy_comments: event.detail.commenttext
    };
    //alert(JSON.stringify(newcommentbody));
    addnewComment({ requestbody: JSON.stringify(newcommentbody) })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to add Comments.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          const alertmessage = new ShowToastEvent({
            title: "Comment saved successfully.",
            message: "Your Comment was recorded successfully.",
            variant: "success"
          });
          this.dispatchEvent(alertmessage);
          this.getselecteddiscrepancycomments(ecarddiscrepancylogid);
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to add Comments.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
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

  // Get Comments of selected discrepancy
  getselecteddiscrepancycomments(selecteddiscrepancylogid) {
    var requesthead = selecteddiscrepancylogid.toString();
    getAllComments({ discrepancylogid: requesthead })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Comments.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var commentsresponse = JSON.parse(data.response).data
            .discrepancycomments;
          var commentlist = [];
          if (commentsresponse.length != 0) {
            for (var comment in commentsresponse) {
              var com = commentsresponse[comment];
              if (
                com.commentedby_id != null &&
                com.commentedby_id != undefined
              ) {
                var name = `${com.commentedby_id.first_name} ${com.commentedby_id.last_name}`;
                var dispname=`${com.commentedby_id.first_name} ${com.commentedby_id.last_name} (${com.commentedby_id.employee_number})`;
                var emp_id=`${com.commentedby_id.employee_number}`;
                var initials = name.match(/\b\w/g) || [];
                initials = (
                  (initials.shift() || "") + (initials.pop() || "")
                ).toUpperCase();
                var moddedcomment = {
                  created_by: name,
                  initials: initials,
                  fullname : name,
                  displayname:dispname,
						      empid:emp_id,
                  commentedbyid: com.commentedby_id.employee_number,
                  commentedusername: com.commentedby_id.appuser_name,
                  commenttext: com.discrepancy_comments,
                  ecard_discrepancy_comments_id:
                    com.ecard_discrepancy_comments_id,
                  created_date: com.created_date
                };
                commentlist.push(moddedcomment);
              }
            }
          }
          this.selecteddiscrepancycomments = commentlist;
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Comments.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }

  get disablecomponentdates() {
    return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open" || !this.permissionset.dept_discrepancy_update.write;
  }

  // Handle Discrepancy Actions
  handlediscrepancyactions(event) {
    var action = event.detail.action;
    var passedallvalidation = true;
    if (action == "Reject") {
      this.qccaptureaction=true;
      this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
        "open"
      ); // reject
      this.selecteddiscrepancy.discrepancy_status = "open"; //reject
    }
    if (action == "Verify") {
      this.qccaptureaction=true;
      this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
        "approve"
      );
      this.selecteddiscrepancy.discrepancy_status = "approve";
    }
    if (action == "Mark as done") {
      this.qccaptureaction=false;
      // Check Validations
      if (this.selecteddiscrepancy.defect_type == "Department") {
        const allValid = [
          ...this.template.querySelectorAll(".checkvalid")
        ].reduce((validSoFar, inputCmp) => {
          inputCmp.reportValidity();
          return validSoFar && inputCmp.checkValidity();
        }, true);
        if (allValid) {
          this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
            "resolve"
          );
          this.selecteddiscrepancy.discrepancy_status = "resolve";
          this.isdelenabled=false;
        } else {
          passedallvalidation = false;
          const alertmessage = new ShowToastEvent({
            title: "Fill all required fields.",
            message: "Please fill in all the required fields..",
            variant: "warning"
          });
          this.dispatchEvent(alertmessage);
        }
      } else {
        this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
          "resolve"
        );
        this.selecteddiscrepancy.discrepancy_status = "resolve";
      }
    }
    if (action == "Cancel") {
      this.qccaptureaction=true;
      this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
        "open"
      );
      this.selecteddiscrepancy.discrepancy_status = "open";
    }
    if (action == "Cancel Verified") {
      this.qccaptureaction=true;
      this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
        "resolve"
      );
      this.selecteddiscrepancy.discrepancy_status = "resolve";
    }
    if (action == "Cancel Rejected") {
      this.qccaptureaction=true;
      this.selecteddiscrepancy.discrepancy_statusdisplay = setstatusfordisplay(
        "resolve"
      );
      this.selecteddiscrepancy.discrepancy_status = "resolve";
    }
    if (passedallvalidation) {
      this.statusascomment = true;
      this.updatediscrepancytoserver();
    }
  }

  activeSections = ["Details"];
  // For toogle sections within modal
  togglesection(event) {}

    // To update the discrepancy changes to server.
    updatediscrepancytoserver(event) {
      //alert(JSON.stringify(this.selecteddiscrepancy));    
      var discrepancytobeupdated = this.selecteddiscrepancy;
      if (discrepancytobeupdated.buildstation_id == 'Unknown') {
        discrepancytobeupdated.buildstation_id = null;
      }
      var responsebody = {
        ecard_discrepancy_log_id: discrepancytobeupdated.ecard_discrepancy_log_id,
        ecard_id: discrepancytobeupdated.ecard_id,
        department_id: discrepancytobeupdated.department_id,
        component: discrepancytobeupdated.component,
        cut_off_date: new Date(discrepancytobeupdated.cut_off_date),
        root_cause: discrepancytobeupdated.root_cause,
        discrepancy_status: discrepancytobeupdated.discrepancy_status,
        discrepancy_type: discrepancytobeupdated.discrepancy_type,
        discrepancy: discrepancytobeupdated.description,
        modified_date: discrepancytobeupdated.modified_date,
        buildstation_id: discrepancytobeupdated.buildstation_id
      };
      /*if (discrepancytobeupdated.assigend_qc_id.length != 0) {
        responsebody["assigend_qc_id"] =
          discrepancytobeupdated.assigend_qc_id[0].Id;
      }*/
      if (this.qccaptureaction && this.qccapturerole) {
        responsebody["assigend_qc_id"] = this.loggedinuser.appuser_id;
        this.qccaqccaptureaction = false;
      }
      var requestwithforman = this.updateformans(
        JSON.stringify(responsebody),
        discrepancytobeupdated.selectedprodlist
      );

      updateDiscrepancy({ requestbody: JSON.stringify(requestwithforman) })
        .then((data) => {
          if (data.isError) {
            if (data.errorMessage == 202) {
              const alertmessage = new ShowToastEvent({
                title: "Sorry we could not complete the operation.",
                message: JSON.parse(data.responsebody).data.validation_message,
                variant: "error"
              });
              this.dispatchEvent(alertmessage);
              this.detailsmodal = false;
              this.loaddataforview();
            }
            else {
              const alertmessage = new ShowToastEvent({
                title: "Sorry we could not complete the operation.",
                message:
                  "Something unexpected occured. Please contact your Administrator",
                variant: "error"
              });
              this.dispatchEvent(alertmessage);
              this.detailsmodal = false;
              this.loaddataforview();
            }
          } else {
            const alertmessage = new ShowToastEvent({
              title: "Record Update Successfull.",
              message: "The Record was updated Successfully",
              variant: "success"
            });
            this.dispatchEvent(alertmessage);
            this.enablediscupdate = false;
            this.discdepartmentchanged = false;
            this.selecteddiscrepancy['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date;
            //this.detailsmodal = false;
            if (this.statusascomment) {
              this.statusascomment = false;
              var response = JSON.parse(data.operationlogresponse).data;
              this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
            }
            this.loaddataforview();
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

  @track showpreviewimage = false;
  @track previewimageexist = false;
    @track discrepancyimage ;
    @track parentdivdimensions;
    @track showspinnerwithmodal = false;
    previewimage(event){
        var selecteddiscrepancylogid = event.target.dataset.id;
        for (var i in this.alldiscrepancy) {
          if (
            this.alldiscrepancy[i].ecard_discrepancy_log_id ==
            selecteddiscrepancylogid
          ) {
            this.selecteddiscrepancy = this.alldiscrepancy[i];
          }
        }
        var selecteddiscrepancy = this.selecteddiscrepancy;
        if(selecteddiscrepancy.bus_area_picture_id != undefined){
        getdiscrepancyimage({buspictureid:selecteddiscrepancy.bus_area_picture_id})
        .then(data => {
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
        else { /** This condition is to take care of historical Discrepancy point as object - can be removed from next release */
          this.setdiscrepancypoint = `top: ${bus_area.y * zoomScale}px;left: ${bus_area.x * zoomScale}px;background: ${discrepancycolor};`;
        }
        this.previewimageexist = true;
        this.showspinnerwithmodal = false;
    }

    hidepreviewimage(event){
        this.showpreviewimage = false;
        this.previewimageexist = false;
    }

    @track s3tempurlfornewdiscrepancy = [];
    gets3tempurls(event){
        this.s3tempurlfornewdiscrepancy = event.detail.tempurllist;
       // alert(JSON.stringify(this.s3tempurlfornewdiscrepancy));
    }

    deletetempattachments(event){
        if(this.s3tempurlfornewdiscrepancy.length != 0){
            var requestbody = {
                "s3_file_paths" : JSON.stringify(this.s3tempurlfornewdiscrepancy)
            };
            deleteTempAttachment({requestbody:JSON.stringify(requestbody)})
                  .then(data => {
                      if(data.isError){
                          const alertmessage = new ShowToastEvent({
                              title : 'Sorry we could not complete the operation.',
                              message : 'Something unexpected occured. Please contact your Administrator',
                             variant : 'error'
                        });
                        this.dispatchEvent(alertmessage);
                        
                      }
                      else{
                          // alert('Tempattachments deleted.');
                        /*var responsestatus = JSON.parse(data.responsebody).data.success;
                        if(responsestatus){
    
                        } */
                       //Should we show a toast message for deleteing temp attachment ?
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
    }
    deletediscrepancy(event){
      var status=confirm("Discrepancies once deleted can not be retrieved. Are you sure you want to continue this action?");
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
                    message: "Discrepancy deleted successfully.",
                    variant: "success"
                  });
                  this.dispatchEvent(alertmessage);
                  this.loaddataforview(event);
                  this.detailsmodal = false;
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
  //Added to refresh the Discrepancydblist after adding new Discrepancy
  refreshDiscrepancy() {
    this.loaddataforview();
  }

  // used to load the busStatus picklist
  loadstatuspicklistvalues(event) {
    var picklistname = event.target.name;
    if (event.target.options.length == 1) {
      getStatusPicklistOptions({ picklistName: picklistname })
        .then((data) => {
          if (data.isError) {
            const alertmessage = new ShowToastEvent({
              title: "Picklist data value failed to fetch.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
            throw "Data fetch failed";
          } else {
            var options = data.options;
            if (picklistname == 'busstatus') {
              for (var i = 0; i < options.length; i++) {
                if (options[i].value === 'Staging' || options[i].value === 'Sold') {
                  options.splice(i, 1);
                }
              }
              this.busstatuslist = options;
            }
          }
        })
        .catch((error) => {
          this.error = error;
          const alertmessage = new ShowToastEvent({
            title: "Picklist data value failed to fetch.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        });
    }
  }
  // To handle  when filter on Bus Status is selected.
  handlebusstatuschange(event) {
    this.selectedBusStatus = event.detail.value;
    this.loaddataforview();
  }
  //removeduplicate user
  removeDuplicates(objectArray) {
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
    return newArray;
  }

  // Generic function to Show alert toasts.
  showmessage(title, message, variant) {
    const alertmessage = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(alertmessage);
  }

  async modifyselecteddiscrepancy(event) {
    var targetvalue = event.target.value;
    var targetname = event.target.name;
    this.selecteddiscrepancy[targetname] = targetvalue;
    this.enablediscupdate = true;
    if (targetname == 'department_id') {
      // this.selecteddiscrepancy.departmentid = targetvalue;
      this.discdepartmentchanged = true;
      this.selecteddiscrepancy.department_id = targetvalue;//
      for (var i in this.departmentIdMap) {
        if (this.departmentIdMap[i].value == targetvalue) {
          this.selecteddiscrepancy.department_name = this.departmentIdMap[i].label;
        }
      }
      this.selecteddiscrepancy.disc_bsavailable = false;
      // Set Prod and QC also
      this.selecteddiscrepancy.allprodlist = [];
      this.selecteddiscrepancy.selectedprodlist = [];//
      if (this.selecteddiscrepancy.ecard_id != undefined) {
        this.moddifydefectpickvalues(targetvalue);
        var ecardid = this.selecteddiscrepancy.ecard_id;
        var departmentId = targetvalue;
        var ecardiddeptid = { ecard_id: ecardid, dept_id: departmentId };
        var bs = { label: "Unknown", value: "Unknown", workcentreId: 0, workcentreName: "0000" };//Vishwas
        await getDepartmentOperations({ ecardiddeptid: JSON.stringify(ecardiddeptid) })
          .then(data => {
            var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
            this.deptsupervisorforselecteddept = prod_supervisor;
            //this.selecteddiscrepancy.allPRODlist = prod_supervisor;
            this.selecteddiscrepancy.allprodlist = prod_supervisor;
            this.buildstationoptions = data.buildstationList;
            this.buildstationoptions.push(bs);//Vishwas
            this.selecteddeptbsdetails = this.getcompleteBuilstationlist(data);
            // this.selecteddiscrepancy.buildstation_id = undefined;
            this.selecteddiscrepancy.buildstation_id = null;//
          }).catch(error => {
            this.error = error;
            this.showmessage('Failed to fetch Build Station Details.', 'Something unexpected occured. Please contact your Administrator.', 'error');
          });
      }
      else {
        this.selecteddiscrepancy.departmentid = undefined;
        this.showmessage('Select a Bus.', 'Please select a Bus before selecting Department.', 'warning');
      }
    }
    if (targetname == 'buildstation_id') {
      var buildstationdetails = this.selecteddeptbsdetails;
      var buildstationId = targetvalue;
      var selectedbuildstation;
      for (var bs in buildstationdetails) {
        if (buildstationId.toString() == buildstationdetails[bs].buildstation_id.toString()) {
          selectedbuildstation = buildstationdetails[bs];
        }
      }
      //this.newdiscrepancy.buildstation_id = selectedbuildstation.buildstation_id.toString();
      this.selecteddiscrepancy.buildstation_id = buildstationId == 'Unknown' ? this.selecteddiscrepancy.buildstation_id : selectedbuildstation.buildstation_id.toString();
      if (buildstationId != 'Unknown') {
        this.selecteddiscrepancy.disc_bsavailable = true;
        this.selecteddiscrepancy.buildstation_code = selectedbuildstation.buildstation_code;
        this.selecteddiscrepancy.workcenter_code = selectedbuildstation.workcentername;
        this.selecteddiscrepancy.workcenter_name = selectedbuildstation.workcentername;
      }
      // Set Prod and QC also
      var allPRODlist = [];
      var allQClist = [];
      var PRODlist = [];
      if (buildstationId != 'Unknown' && selectedbuildstation.QClist != null && selectedbuildstation.QClist.length != 0) {
        allQClist = selectedbuildstation.QClist;
      }
      if (this.selecteddiscrepancy.discrepancy_type == 'Department') {
        if (this.deptsupervisorforselecteddept.length != 0) {
          allPRODlist = this.deptsupervisorforselecteddept;
        }
        PRODlist = this.deptsupervisorforselecteddept;
      }
      else if (buildstationId != 'Unknown') {
        if (selectedbuildstation.PRODlist != null && selectedbuildstation.PRODlist.length != 0) {
          allPRODlist = selectedbuildstation.PRODlist;
        }
        PRODlist = selectedbuildstation.selectedprod;
      }
      var QClist = buildstationId == 'Unknown' ? [] : selectedbuildstation.selectedqc;
      this.selecteddiscrepancy.qclist = QClist;
      this.selecteddiscrepancy.selectedprodlist = PRODlist;
      // this.selecteddiscrepancy.allPRODlist = allPRODlist;
      this.selecteddiscrepancy.allprodlist = allPRODlist;//
      // this.selecteddiscrepancy.allQClist = allQClist;
      this.selecteddiscrepancy.allqclist = allQClist;//
    }
    if (this.selecteddiscrepancy.allprodlist.length == 0) {
      var userdetails = [];
      await getcrewingsuserslist({ deptid: this.selecteddiscrepancy.department_id })//departmentid
        .then((result) => {
          userdetails = JSON.parse(result.responsebody).data.user;
          this.selecteddiscrepancy.allprodlist = userdetails.length > 0 ? modifieduserlist(userdetails) : userdetails;
        })
        .catch((error) => {
        });
    }
  }
  handlediscdeptupdateaction(event) {
    const allValid = [...this.template.querySelectorAll('.deptchangevalidation')]
      .reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      }, true);
    if (allValid) {
      var discrepancytobeupdated = this.selecteddiscrepancy;
      if (discrepancytobeupdated.buildstation_id == undefined || discrepancytobeupdated.buildstation_id == 'Unknown') {
        discrepancytobeupdated.buildstation_id = null;
      }
      this.updatediscrepancytoserver();
    }
    else {
      this.showmessage('Please fill required fields.', 'Please fill required and update all blank form entries.', 'warning');
    }
  }

  getStatusColor(status) {
    //var discrepancycolor = '#ff3b30';
    var discrepancycolor = '';
    if(status.toLowerCase() == 'resolve'){
        discrepancycolor = '#e8bb07';
    }
    if(status.toLowerCase() == 'approve'){
        discrepancycolor = '#34c759';
    }
    var bgColor = `background-color: ${discrepancycolor};`;
    return bgColor;
}
}