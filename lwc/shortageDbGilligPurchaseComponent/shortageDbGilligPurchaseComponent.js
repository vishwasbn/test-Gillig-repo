import { LightningElement, track } from "lwc";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import HideLightningHeader from "@salesforce/resourceUrl/HideLightningHeader";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getPicklistOptions from "@salesforce/apex/DiscrepancyDatabaseController.getPicklistOptions";
import getAllEcarddetailsfromServer from "@salesforce/apex/DiscrepancyDatabaseController.getAllEcarddetails";
import getAllDiscrepanciesfromServer from "@salesforce/apex/DiscrepancyDatabaseController.getAllDiscrepanciesdetails";

import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";
import getDepartmentOperations from "@salesforce/apex/ecardOperationsController.getDepartmentOperations";

import getAllComments from "@salesforce/apex/DiscrepancyDatabaseController.getAllComments";
import addnewComment from "@salesforce/apex/DiscrepancyDatabaseController.addnewComment";
import updateDiscrepancy from "@salesforce/apex/DiscrepancyDatabaseController.updateDiscrepancy";

import getcrewingsuserslist from "@salesforce/apex/CrewingScheduleController.getcrewingsuserslist";
import deleteDiscOrShortage from "@salesforce/apex/ecardOperationsController.deleteDiscOrShortage";

import {permissions, modifieduserlist, getmoddeddate, getselectedformandetails, preassignforeman, preassignqc, setstatusfordisplay}  from 'c/userPermissionsComponent';
import getPermissions from "@salesforce/apex/userAuthentication.getPermissions";
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
import getStatusPicklistOptions from "@salesforce/apex/scheduleBoardController.getPicklistOptions";

import getPartshortagecauselist from "@salesforce/apex/ecardOperationsController.getPartshortageCauses";
import getShortageslist from "@salesforce/apex/ecardOperationsController.getShortageslist";//to-do
import getAllShortageslist from "@salesforce/apex/ecardOperationsController.getAllPartshortages";//added
import getAllpartsVendorlist from '@salesforce/apex/ecardOperationsController.getAllpartsVendorlist';
import getDefaultVendorandBuyer from '@salesforce/apex/ecardOperationsController.getDefaultVendorandBuyer';
import updatePartshortage from "@salesforce/apex/ecardOperationsController.updatePartshortage";

export default class ShortageDbGilligPurchaseComponent extends LightningElement {
  nodatadessert = noDatadessert;
  @track error; // to track the error occuring
  @track showSpinner; // to show loading spinner
  @track currentuserid = 2;
  @track loggedinuser;

  @track alldiscrepancy = [];
  @track filteredshortages = [];

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
  @track createduserslist = [];
  @track selectedCustomer;
  @track selecteddepartement = "All Departments";
  @track departmentlist = [
    { label: "All Departments", value: "All Departments" }
  ];
  @track selectedstatus = "All Status";
  @track statuslist = [{ label: "All Shortage Status", value: "All Status" }, { label: "Open", value: "open" }, { label: "Resolved", value: "resolve" }, { label: "Verified", value: "approve" }];
  @track selectedbuyer = "All Buyer";
  @track buyerlist = [
    { label: "All Buyer", value: "All Buyer" }
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
    return this.filteredshortages.length == 0;
  }
  get isdepartmentdisclistempty() {
    return this.filtereddepartmentdiscrepancy.length == 0;
  }

  get disableprodforupdate() {
    return !this.permissionset.shortage_update_prod.write || this.selectedshortage.discrepancy_status.toLowerCase() != "open";//added
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

  //used to display/hide the shortage button
  get disableshortgbtn() {
    if (this.permissionset != undefined) {
      return !this.permissionset.shortage_new.write;
    }
    else return false;
  }

  get returntrue() {
    return true;
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

  connectedCallback() {
    loadStyle(this, HideLightningHeader);
    this.getloggedinuser();
    this.loadpartshotcauselist();
    this.getPermissionsfromserver();
    this.setdepartmentidmap();
    this.showSpinner = true;
    this.loadShortagesdata();//to-do
  
  }

  @track currentuserempid;
  getloggedinuser(){
    EcardLogin()
    .then((result) => {
        this.loggedinuser=result.data.user;
        if(this.loggedinuser.approle_id==1 || this.loggedinuser.approle_id==4){
            this.qccapturerole=true;
        }else{
            this.qccapturerole=false;
        }
        this.currentuserempid=this.loggedinuser.appuser_id;//to-do
    })
    .catch((error) => {
    });//sajith
  }

  loadShortagesdata(event) {
    this.showSpinner = true;
    var statuslist = [];
    if (this.selectedBusStatus != 'All Bus Status') {
      statuslist.push(this.selectedBusStatus.replaceAll(" ", "%20"));
    }
    else {
      statuslist = null;
    }
    var statusparm = { bus_status: statuslist };
    getAllShortageslist({ ecardbusstatus: JSON.stringify(statusparm) })
      .then(data => {
        var shortageslist = [];

        var customernamechasislist = [];
        var createduserslist = [];
        var buyerlist = [];//
          var shortagelogs = JSON.parse(data.responsebody).data.discrepancylog;
          var modshortagesList = [];

          for (var disc in shortagelogs) {
            var index = Number(disc) + 1;
            var shortageobj = shortagelogs[disc];
            var created_by = modifieduserlist([shortageobj.createdby_id]);
            var raised_date = getmoddeddate(shortageobj.raised_date);
            var createdbyname;
            var displaycreatedbyname;
            var createdbyempid = undefined;
            if (created_by != undefined && created_by.length != 0) {
              if (created_by[0] != undefined) {
                displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${raised_date}`;
                createdbyname = `${created_by[0].name}`;
                createdbyempid = `${created_by[0].userid}`;
              }
            }
            var is_deletable = false;
            if ((createdbyempid == this.currentuserempid) && (shortageobj.discrepancy_status.toLowerCase() == "open")) {
              is_deletable = true;
            }
            var partname;
          
            if (shortageobj.buspart_no != null) { //remove this component
              partname = shortageobj.buspart_name;
            }
            else {
              partname = shortageobj.custom_part_name;
            }
            var bsavailable = shortageobj.buildstation_code == '9999' ? false : true;
            var qc_avilable = shortageobj.assigend_qc_id != null ? true : false;
            var moddedshortage = {
              index: index,
              departmentid: shortageobj.department_id,
              departmentcode: this.getdepartmentcode(shortageobj.department_id, this.departmentIdMap),
              createdbyname: createdbyname,
              displaycreatedbyname: displaycreatedbyname,
              modified_date: shortageobj.modified_date,
              buildstation_code: shortageobj.buildstation_code,
              buildstation_id: shortageobj.buildstation_id,
              disc_bsavailable: bsavailable,
              part_shortage_id: shortageobj.part_shortage_id,
              buspart_id: shortageobj.buspart_id,
              buspart_name: partname, //shortageobj.buspart_name,
              custom_part_name: shortageobj.custom_part_name,
              buspart_no: shortageobj.buspart_no,
              busstatus_id: shortageobj.busstatus_id,
              busstatus_name: shortageobj.busstatus_name,
              chassis_no: shortageobj.chassis_no,
              component: shortageobj.component,
              createdby_id: modifieduserlist([shortageobj.createdby_id]),
              defect_codename: `${shortageobj.defect_code}, ${shortageobj.defect_name}`,
              discrepancy_statusdisplay: setstatusfordisplay(shortageobj.discrepancy_status.toLowerCase()),
              discrepancy_type: this.capitalize(shortageobj.discrepancy_type),
              cut_off_date: shortageobj.cut_off_date,
              displaycutoffdate: getmoddeddate(shortageobj.cut_off_date),
              dat_defect_code_id: shortageobj.dat_defect_code_id,
              defect_code: shortageobj.defect_code,
              defect_name: shortageobj.defect_name,
              defect_type: shortageobj.defect_type,
              isdeletable: is_deletable,
              department_id: shortageobj.department_id,
              department_name: shortageobj.department_name,
              discrepancy: shortageobj.discrepancy,
              discrepancy_priority: this.capitalize(shortageobj.discrepancy_priority),
              discrepancy_status: shortageobj.discrepancy_status.toLowerCase(),
              ecard_discrepancy_area_id: shortageobj.ecard_discrepancy_area_id,
              ecard_discrepancy_log_id: shortageobj.ecard_discrepancy_log_id,
              ecard_discrepancy_log_number: shortageobj.discrepancy_log_number,
              ecard_id: shortageobj.ecard_id,
              ecard_operation_log_id: shortageobj.ecard_operation_log_id,
              first_name: shortageobj.first_name,
              last_name: shortageobj.last_name,
              customername: `${shortageobj.customer_name}`,//`${shortageobj.first_name} ${shortageobj.last_name}`,
              has_part_shortage: shortageobj.has_part_shortage,
              assignedprod: getselectedformandetails(shortageobj),
              part_avilable: shortageobj.part_avilable,
              buyer_code_avilable: (shortageobj.buyer == null || shortageobj.planner_code == null) ? false : true,
              po_no: shortageobj.po_no,
              allprodlist: modifieduserlist(shortageobj.prod),
              allqclist: modifieduserlist(shortageobj.qc),
              quantity: shortageobj.quantity,
              assigend_qc_id: modifieduserlist([shortageobj.assigend_qc_id]),
              qcavailable: qc_avilable,
              raised_date: getmoddeddate(shortageobj.raised_date),
              raised_date_display: getmoddeddate(shortageobj.raised_date),
              raised_status_updated_date: shortageobj.raised_status_updated_date,
              resolved_date: shortageobj.resolved_date,
              resolved_status_updatedby_id: modifieduserlist([shortageobj.resolved_status_updatedby_id]),
              resolved_status_updated_date: shortageobj.resolved_status_updated_date,
              root_cause: shortageobj.root_cause,
              verifiedby_id: modifieduserlist([shortageobj.verifiedby_id]),
              verified_date: shortageobj.verified_date,
              verified_status_updated_date: shortageobj.verified_status_updated_date,
              workcenter_code: shortageobj.workcenter_code,
              workcenter_name: shortageobj.workcenter_name,
              filtered: "",
              created_by: created_by,
              buyer: shortageobj.buyer,
              carrier_arrival_text: shortageobj.carrier_arrival_text,
              carrier_text: shortageobj.carrier_text,
              date_received: shortageobj.date_received,
              is_b_whs_kit: shortageobj.is_b_whs_kit,
              is_long_term: shortageobj.is_long_term,
              is_ship_short: shortageobj.is_ship_short,
              planner_code: shortageobj.planner_code,
              shortage_cause_id: shortageobj.shortage_cause_id != null ? shortageobj.shortage_cause_id.toString() : null,
              tracking: shortageobj.tracking,
              trk:(shortageobj.tracking == null || shortageobj.tracking == undefined) ? "No":"Yes",
              vendor_name: shortageobj.vendor_name,
              vendor_number: shortageobj.vendor_number,
              bus_start_date : getmoddeddate(shortageobj.bus_start_date),
              remarks : shortageobj.remarks,
              bus_relative_seq : shortageobj.bus_relative_seq
            };

            if (moddedshortage.created_by.length > 0) {
              for (var i in moddedshortage.created_by) {
                if (moddedshortage.created_by[i].Name != undefined) {
                  createduserslist.push(moddedshortage.created_by[i].Name);
                }
              }
            }
            modshortagesList.push(moddedshortage);
            customernamechasislist.push(shortageobj.chassis_no);
            customernamechasislist.push(shortageobj.customer_name);
            if (shortageobj.buyer != null) {
              buyerlist.push(shortageobj.buyer);
            }
          }
          shortageslist.push(...modshortagesList);
        
        this.customernamechasislist = Array.from(new Set(customernamechasislist));
        this.createduserslist = Array.from(new Set(createduserslist));
        var modifiedbuyerlist = Array.from(new Set(buyerlist));
        this.createbuyerpicklist(modifiedbuyerlist);
        var modifiedshortagesList = [];
        for (var i in shortageslist) {
          modifiedshortagesList.push(shortageslist[i]);
          
          if (this.shortgecauselist.length > 0) {
          for (var item in modifiedshortagesList) {
            for (var entry in this.shortgecauselist) {
              if (modifiedshortagesList[item].shortage_cause_id == this.shortgecauselist[entry].value) {
                modifiedshortagesList[item]['shortage_cause_value'] = this.shortgecauselist[entry].label;
              }
            }
          }
        }
          
        }
        this.modifiedshortageslist = modifiedshortagesList;
        this.allshortages = modifiedshortagesList;
        this.loadpartshotcauselist();
        this.showSpinner = false;
        this.error = undefined;
        this.applyfilterchanges();
        //
      })
      .catch(error => {
        this.error = error;
        this.showmessage('Data fetch failed.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
      });

  }

  createbuyerpicklist(buyerlist) {
    var picklist = [{ label: "All Buyer", value: "All Buyer" }];
    for (var item in buyerlist) {
      var option = {
        "label": buyerlist[item],
        "value": buyerlist[item]
      };
      picklist.push(option);
    }
    this.selectedbuyer = "All Buyer";
    this.buyerlist = picklist;
  }

  @track allshortages;
  @track shortgecauselist = [];
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
              )
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
          this.filteredshortages = moddeddiscrepancydata;
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
    let table = JSON.parse(JSON.stringify(this.filteredshortages));
    table.sort((a, b) => {
      return a[event.currentTarget.dataset.id] >
        b[event.currentTarget.dataset.id]
        ? 1 * reverse
        : -1 * reverse;
    });
    this.filteredshortages = table;
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

  // Handle Shortage status Change
  handleshortgstatuschange(event) {
    this.selectedstatus = event.detail.value;
    this.applyfilterchanges(event);
  }

  // Handle Defect Change
  handledisctypechange(event) {
    this.selectedbuyer = event.detail.value;
    this.applyfilterchanges(event);
  }

  handlecreateddatechange(event) {
    this.selectedcreatedddate = this.getformatedsearchformat(
      event.target.value
    );
    //alert(this.selectedcreatedddate);
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

  @track shipshortfilter;
  //handle toggle button change for shipshort filter
  onshipshortselection(event) {
    this.shipshortfilter = event.target.checked;
    this.applyfilterchanges(event);
  }

  // On selecting created by user filter
  oncreatedbyselect(event) {
    if (event.detail.labelvalue == "Created By") {
      // this.selectedassignedtouser= event.detail.selectedRecord;//to-do
      this.selectedcreatedbyuser = event.detail.selectedRecord;
    }
    this.applyfilterchanges(event);
  }

  // On clearing the created by user selection.
  onclearcreatedby(event) {
    this.selectedcreatedbyuser = undefined;
    // this.selectedassignedtouser = undefined;//to-do
    this.applyfilterchanges(event);
  }

  // To Apply the filter changes and reflect in the view.
  applyfilterchanges(event) {
    var selecteddepartment = this.selecteddepartement;
    var selectedcustomer = this.selectedCustomer;
    var selectedbuyer = this.selectedbuyer;
    var selectedstatus = this.selectedstatus;
    var shipshortfilter = this.shipshortfilter;
    // var selectedcreateddate = this.selectedcreatedddate;
    var selectedcreatedby = this.selectedcreatedbyuser;
    // var selectedassignedto = this.selectedassignedtouser;
    this.showSpinner = true;
    var filteredshortages = [];
    var completedata = JSON.parse(JSON.stringify(this.allshortages));
    for (var shortg in completedata) {
      var shortage = completedata[shortg];
      var discfilter = shortage.filtered;
      if (selectedcustomer != undefined) {
        if (
          shortage.customername == selectedcustomer ||
          shortage.chassis_no == selectedcustomer
        ) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }
      if (
        selecteddepartment != undefined &&
        selecteddepartment != "All Departments"
      ) {
        if (shortage.department_name == selecteddepartment) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }
      if (
        selectedbuyer != undefined &&
        selectedbuyer != "All Buyer"
      ) {
        // if (shortage.buyer == this.capitalize(selectedbuyer)) {
        if (shortage.buyer == selectedbuyer) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }
      if (selectedstatus != undefined && selectedstatus != "All Status") {
        if (shortage.discrepancy_status.toLowerCase() == selectedstatus) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }
      if (shipshortfilter) {
        if (shortage.is_ship_short == shipshortfilter) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }
      // if (selectedcreateddate != undefined && selectedcreateddate != "") {
      //   if (shortage.formatteddatetosearch == selectedcreateddate) {
      //   } else {
      //     shortage.filtered = discfilter + " invisible";
      //   }
      // }
      if (selectedcreatedby != undefined) {
        if (shortage.createdbyname == selectedcreatedby) {
        } else {
          shortage.filtered = discfilter + " invisible";
        }
      }

      if (!shortage.filtered.includes("invisible")) {
        filteredshortages.push(shortage);
      }
    }
    this.filteredshortages = [];
    this.filteredshortages = filteredshortages;
    this.showSpinner = false;
  }

  //To get all Ecard Details from Server
  getAllEcarddetails(event) {
    getAllEcarddetailsfromServer()
      .then((result) => {
        var ecards = JSON.parse(result.response).data.ecard;
        var ecardoptions = [];
        for (var ec in ecards) {
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

    return newresponse;
  }

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

  //TO disable the selected part shortage fields from edit
  get disableeditshortage() {
    return this.permissionset.shortage_update.write != true || this.selectedshortage.discrepancy_status.toLowerCase() != "open"; //corrected
  }

  //to display shortage details
  @track selectedshortage;
  @track partshortagedetailsmodal = false;
  // To Show Part Shortage Detail
  async showpartshortagedetail(event) {
    var selectepartshortagelogid = event.currentTarget.dataset.id;
    for (var i in this.modifiedshortageslist) {
      if (this.modifiedshortageslist[i].ecard_discrepancy_log_id == selectepartshortagelogid) {
        this.selectedshortage = this.modifiedshortageslist[i];
      }
    }
    if (this.selectedshortage.allprodlist.length == 0) {
      var userdetails = [];
      await getcrewingsuserslist({ deptid: this.selectedshortage.departmentid })
        .then((result) => {
          userdetails = JSON.parse(result.responsebody).data.user;
          this.selectedshortage.allprodlist = userdetails.length > 0 ? modifieduserlist(userdetails) : userdetails;
        })
        .catch((error) => {
        });
    }
    this.getselecteddiscrepancycomments(selectepartshortagelogid);
    this.getVendorlistforparts(this.selectedshortage.buspart_no);
    if (this.selectedshortage.vendor_name == null) { //to-do list in partsvendor list
      this.getPartsVendorBuyerDetails(this.selectedshortage.buspart_no, this.selectedshortage);
    }
    if (this.selectedshortage.buyer != null && this.selectedshortage.planner_code != null) {
      this.selectedshortage.buyer_code = this.selectedshortage.buyer + ' / ' + this.selectedshortage.planner_code;
    }
    this.isdelenabled = false;
    if (this.selectedshortage.isdeletable || (this.permissionset.shortage_delete.write && this.selectedshortage.discrepancy_status.toLowerCase() == 'open')) {
      this.isdelenabled = true;
    }
    this.partshortagedetailsmodal = true;

  }

  // To Hide Part Shortage Detail.
  hidepartshortagedetail(event) {
    this.partshortagedetailsmodal = false;
  }

  // Update selected shortage fields.
  updateselectedshortage(event) {
    var targetvalue;
    if (event.target.type == "checkbox") {
      targetvalue = event.target.checked;
    }
    else {
      targetvalue = event.target.value;
    }
    var targetname = event.target.name;
    this.selectedshortage[targetname] = targetvalue;
    this.updatedisable=false;
    //this.updatepartshortage(event);//timer triggered
  }


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

    
  updatepartshortage(event) {
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => { this.updatepartshortagetoserver(); }, 1000);
  }
  
    update(){
      this.updatepartshortage();//timer triggered
    }

  // To update the Part Shortage changes to server.
  updatepartshortagetoserver(event) {

   if(this.selectedshortage.vendor_name == null && this.selectedshortage.vendor_number == null){
      if(this.partsvendorslist.length>0){
        this.selectedshortage.vendor_name = this.partsvendorslist[0].label ; 
        this.selectedshortage.vendor_number = this.partsvendorslist[0].value;
      }
    } 
    var discrepancytobeupdated = this.selectedshortage;
    var part_shortage;
    if (discrepancytobeupdated.buspart_no == 'Part No. Not Found') {
      //ispartavailable = false;
      part_shortage = {
        "buspart_id": null,//partshortageaddmodalvalues.buspart_id, 
        "quantity": discrepancytobeupdated.quantity,
        "po_no": discrepancytobeupdated.po_no,
        "custom_part_name": discrepancytobeupdated.buspart_name,
        "part_shortage_id": discrepancytobeupdated.part_shortage_id
      };
    }
    else {
      part_shortage = {
        "buspart_id": discrepancytobeupdated.buspart_id,
        "quantity": discrepancytobeupdated.quantity,
        "po_no": discrepancytobeupdated.po_no,
        "part_shortage_id": discrepancytobeupdated.part_shortage_id
      };
    }

    part_shortage['buyer'] = discrepancytobeupdated.buyer == undefined ? null : discrepancytobeupdated.buyer;
    part_shortage['planner_code'] = discrepancytobeupdated.planner_code == undefined ? null : discrepancytobeupdated.planner_code;
    part_shortage['vendor_number'] = discrepancytobeupdated.vendor_number == undefined ? null : discrepancytobeupdated.vendor_number;
    part_shortage['vendor_name'] = discrepancytobeupdated.vendor_name == undefined ? null : discrepancytobeupdated.vendor_name;
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
      "ecard_id": discrepancytobeupdated.ecard_id,
      "department_id": discrepancytobeupdated.department_id,
      "component": discrepancytobeupdated.component,
      "cut_off_date": discrepancytobeupdated.cut_off_date != null ? new Date(discrepancytobeupdated.cut_off_date) : discrepancytobeupdated.cut_off_date,
      "root_cause": discrepancytobeupdated.root_cause,
      "discrepancy_status": discrepancytobeupdated.discrepancy_status,
      "discrepancy_type": discrepancytobeupdated.discrepancy_type,
      "discrepancy": discrepancytobeupdated.discrepancy,
      "part_shortage": part_shortage,
      "modified_date": discrepancytobeupdated.modified_date

    };
    if (this.qccaptureaction && this.qccapturerole) {
      responsebody["assigend_qc_id"] = this.loggedinuser.appuser_id;
      this.qccaqccaptureaction = false;
    }
    var requestwithforman = this.updateformans(JSON.stringify(responsebody), discrepancytobeupdated.assignedprod);

    updatePartshortage({ requestbody: JSON.stringify(requestwithforman) })
      .then(data => {
        if (data.isError) {
          if (data.errorMessage == 202) {
            this.showmessage('Sorry we could not complete the operation.', JSON.parse(data.responsebody).data.validation_message, 'error');
            this.partshortagedetailsmodal = false;
            //this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
            this.loadShortagesdata();
          }
          else {

            this.showmessage('Sorry we could not complete the operation.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
            this.partshortagedetailsmodal = false;
            //this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
            this.loadShortagesdata();
          }
        }
        else {
          this.selectedshortage['modified_date'] = JSON.parse(data.operationlogresponse).data.modified_date;
          if (this.statusascomment) {
            this.statusascomment = false;
            var response = JSON.parse(data.operationlogresponse).data;
            this.addstatusasdiscrepancycomment(response.ecard_discrepancy_log_id, this.statuscommentmap[`${response.discrepancy_status.toLowerCase()}`]);
          }
          this.showmessage('Record Updated.', 'Record updated Successfully.', 'success');
          //this.departmentchanged(this.departmentId, this.departmentName, this.operation, this.messageFromEvt);
          this.loadShortagesdata();
        }
      }).catch(error => {
        this.error = error;
        this.showmessage('Sorry we could not complete the operation.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
      });
  }

  // Add new Comment to Discreepancy
  addnewshortcomment(event) {
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

  deletediscshortage(event) {
    var status = confirm("Discrepancy/Shortage once deleted can not be retrieved. Are you sure you want to continue this action?");
    var discrepancyid = event.target.name;
    if (status) {
      var datatodelete = {
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
            this.loadShortagesdata();
            this.partshortagedetailsmodal = false;
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

  // Generic function to Show alert toasts.
  showmessage(title, message, variant) {
    const alertmessage = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(alertmessage);
  }

  get disablecomponentdates() {
    return this.selecteddiscrepancy.discrepancy_status.toLowerCase() != "open";
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
      modified_date : discrepancytobeupdated.modified_date
    };

    if(this.qccaptureaction && this.qccapturerole){
      responsebody["assigend_qc_id"] =  this.loggedinuser.appuser_id;
      this.qccaqccaptureaction = false;
  }
    var requestwithforman = this.updateformans(
      JSON.stringify(responsebody),
      discrepancytobeupdated.selectedprodlist
    );

    updateDiscrepancy({ requestbody: JSON.stringify(requestwithforman) })
      .then((data) => {
        if (data.isError) {
          if(data.errorMessage == 202){
            const alertmessage = new ShowToastEvent({
                title: "Sorry we could not complete the operation.",
                message: JSON.parse(data.responsebody).data.validation_message,
                variant: "error"
              });
              this.dispatchEvent(alertmessage);
              this.detailsmodal = false;
              this.loaddataforview();
          }
          else{
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
            title: "Record Update Successful.",
            message: "The Record was updated Successfully",
            variant: "success"
          });
          this.dispatchEvent(alertmessage);
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
    this.loadShortagesdata();
  }

  getdepartmentcode(departmentid, departmentIdMap) {
    var departmentcode = '-';
    for (var i in departmentIdMap) {
      if (departmentIdMap[i].value != 'None' && departmentIdMap[i].label != 'ALL DEPARTMENTS') {
        if (departmentIdMap[i].value == departmentid.toString()) {
          var departmentname = departmentIdMap[i].label;
          departmentcode = departmentname.split('-')[0];
        }
      }
    }
    return departmentcode;
  }

  @track partsvendorslist = [];
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
    this.updatedisable=false;
  }

  // On clearing the vendor selection. added
  @track updatedisable=true;
  onclearvendor(event) {
    this.selectedshortage.vendor_name = null ; 
    this.selectedshortage.vendor_number = null;
    this.updatedisable=false;
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
}