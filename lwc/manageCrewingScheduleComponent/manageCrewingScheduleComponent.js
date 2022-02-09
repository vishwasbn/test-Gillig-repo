import { LightningElement, track, api } from 'lwc';

import HideLightningHeader from "@salesforce/resourceUrl/HideLightningHeader";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";

import getallDepartments from "@salesforce/apex/UserListingController.getallDepartments";

import getDeparmentCrewingData from "@salesforce/apex/CrewingScheduleController.getDeparmentCrewingData";
import getUnassignedUsersofPool from "@salesforce/apex/CrewingScheduleController.getUnassignedUsersofPool";
import assignPoolUserstoDept from "@salesforce/apex/CrewingScheduleController.assignPoolUserstoDept"; 

import getBuildStationCrewingData from "@salesforce/apex/CrewingScheduleController.getBuildStationCrewingData"; 
import getUnassignedUsersofDepartment from "@salesforce/apex/CrewingScheduleController.getUnassignedUsersofDepartment"; 
import assignPoolUserstoBuildStation from "@salesforce/apex/CrewingScheduleController.assignPoolUserstoBuildStation"; 
import getallCrewAssignment from "@salesforce/apex/CrewingScheduleController.getcrewingadjustmentlist";
import createNewCrewAssignment from "@salesforce/apex/CrewingScheduleController.createcrewadjustment";
import updateCrewAssignment from "@salesforce/apex/CrewingScheduleController.updatecrewadjustment";


export default class ManageCrewingScheduleComponent extends LightningElement {

    showSpinner = false;
    selectedtab = 'Department Mapping';
    issuperuser = true;
    selecteddepartment = undefined;
    departmentlistoptions = [];
    completeuserdatalist = [];
    deptmappingdata = [];
    editdeptmapping = false;
    selecteddeptdetails = undefined;
    availableusers = [];
    availableusersforassignment = [];
    selectedusersfordept = [];
    allusers = [];
    assignedusersfrompool = [];
    editbuildstationmapping = false;
    currentuserdepartment=undefined;
    currentuserroleid = undefined;
    lockedusersavailable=false;
    @track employeelist = [];
    @track addnewcrewassignmentmodal = false;
    @track selectedcrewingadjustusers = [];
    @track selectedcrewiadjustmentwipdept;
    @track selectedcrewiadjustmentpooldept;
    @track selectedusersforcrewadjustment = [];
    @track assignmentcomment;
    @track crewadjustmentdate = {
        "start_date" : undefined,
        "end_date" : undefined
    }
    @track modifiedcrewingadjlist = [];
    @track allcrewingadjustmentlist = [];
    @track selectedEmployee;
    @track filteredcrewadjustment;
    @track pooldepartmentlist = [{ label: "All Pool Departments", value: "All Pool Departments" }];
    @track nonpooldepartmentlist = [{ label: "All Departments", value: "All Departments" }];
    @track selectepoolddepartement = 'All Pool Departments';
    @track selectednonpooldepartement = 'All Departments';
    @track is_active_data = true;
    @track createduserlist = [];
    @track is_deactivated = false;
    @track isupdated;
    
    get isDepButtonDisabled(){
        if(this.currentuserroleid != '1'){
            if (this.currentuserdepartment != this.selectednonassemblydepartment)
            return true;
            else
            return false;
        }
        else{
            // Admin User approleid == 1
            return false;
        }
        
    }
    get isBldstnButtonDisabled(){
        if(this.currentuserroleid != '1'){
            if (this.currentuserdepartment != this.selecteddepartment)
                return true;
            else
                return false;
        }
        else{
            return false;
        }
    }
    get isAdjustmentButtonDisabled() {
        return this.currentuserroleid != '1';
    }
    get iselecteddeptmapping(){
        return this.selectedtab == 'Department Mapping';
    }

    get isselectedworkcentremapping(){
        return this.selectedtab == 'Work Centre Mapping';
    }

    get isselectedcrewingadjustment(){
        return this.selectedtab == 'Crewing Adjustment';
    }

    get returntrue(){
        return true;
    }

    get returnfalse(){
        return false;
    }

    get selecteddepartmentname(){
        for(var i in this.departmentlistoptions){
            if(this.departmentlistoptions[i].value == this.selecteddepartment){
                return this.departmentlistoptions[i].label;
            }
        }
    }

    get today() {
        var today = new Date();
        var dt = today.getFullYear() + '-' + ((today.getMonth() + 1) <= 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + ((today.getDate()) <= 9 ? "0" + (today.getDate()) : (today.getDate()));
        return dt;
    }

    get showdeactivedate(){
        return this.selectedassignment.deactivation_date != null;
    }

    get disabletoggle() {
        return this.currentuserroleid != '1' || !this.selectedassignment.is_active;
    }

    get disableassignupdate(){
        return this.currentuserroleid != '1' ||  !this.selectedassignment.is_applicable;
    }

    connectedCallback() {
        loadStyle(this, HideLightningHeader);
        this.loaddata();
    }

    loaddata(event){
        this.getdepartmentvalues();
    }

    // To change views betweeen Work Centre Mapping/ Department Mapping
    changeview(event){
        if(event.target.dataset.label == 'deptmapping'){
            this.selectedtab = 'Department Mapping';
            this.getdepartmentcrewingdata(this.selectedpooldeptname);
        }
        else if(event.target.dataset.label == 'workmapping'){
            this.selectedtab = 'Work Centre Mapping';
            this.loadbuildstationmappingdata();
        }
        else{
            this.selectedtab = 'Crewing Adjustment';
            this.loadcrewadjustmentdata();
            //to-do load new page and related data
        }
    }

    departmentlistnonassembly = [];
    selectednonassemblydepartment = [];
    selectedpooldeptname;
     // To get Department data from Server
     getdepartmentvalues(event) {
        getallDepartments()
        .then((result) => {
            var departmentlistvaluesnonassembly = [];
            var departmentlistvaluesassembly = [];
            var departmentsvalues = JSON.parse(result.responsebody).data.departments;

            for(var i in departmentsvalues){
                var option = {
                    'value': departmentsvalues[i].department_id.toString(),
                    'label': departmentsvalues[i].department_name,
                };
                if(departmentsvalues[i].is_assembly_line){
                    departmentlistvaluesassembly.push(option);
                }
                else{
                    departmentlistvaluesnonassembly.push(option)
                }
            }
            this.selecteddepartment =  departmentlistvaluesassembly[0].value;
            this.selectednonassemblydepartment = departmentlistvaluesnonassembly[0].value;
            this.departmentlistnonassembly = departmentlistvaluesnonassembly;
            this.departmentlistoptions = departmentlistvaluesassembly ;
            this.selectedpooldeptname = departmentlistvaluesnonassembly[0].label;
            this.getdepartmentcrewingdata(this.selectedpooldeptname);
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Department data fetch failed.",
          message:"Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
     }

     modifieduserlist(userlist){
        var newuserlist = [];
           if(userlist!=undefined && userlist.length != 0){
               for(var count in userlist){
                   var user = userlist[count];
                   if(user != undefined){
                       var name = `${user.first_name} ${user.last_name}`;
                       var emp_id=`${user.employee_number}`;
                       var dispname=`${user.first_name} ${user.last_name} (${user.employee_number})`;
                       var initials = name.match(/\b\w/g) || [];
                       initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                        var newuser = {
                           name : `${name} (${user.employee_number})`,
                           Name : `${name} (${user.employee_number})`,
                           fullname : name,
                           displayname:dispname,
                           empid:emp_id,
                           Id : user.emp_id,
                           userid : user.emp_id,
                           piclink: '',
                           username: null,
                           intials: initials,
                           label : `${name} (${user.employee_number})`,
                           value : `${name} (${user.employee_number})`,
                           buildstationid : user.buildstation_id!=undefined?user.buildstation_id:null
                       };
                       newuserlist.push(newuser); 
               }
               }
           }
           return newuserlist;
       
        }

        
    // On changing Pool Department
    onpooldepartmentchange(event){
        this.selectednonassemblydepartment = event.target.value;
        for(var i in this.departmentlistnonassembly){
            if(this.departmentlistnonassembly[i].value == this.selectednonassemblydepartment){
                this.selectedpooldeptname = this.departmentlistnonassembly[i].label;
            }
        }
        this.getdepartmentcrewingdata(this.selectedpooldeptname);
    }    

      // To get Department Crewing data from Server
    getdepartmentcrewingdata(selectednonpooldept) {
        this.showSpinner = true;
        getDeparmentCrewingData({selectednonpooldept : selectednonpooldept})
         .then((result) => {
             if(result.isError){
                 const alertmessage = new ShowToastEvent({
                     title: "Department crewing  data fetch failed.",
                     message:JSON.parse(result.responsebody).data.validation_message,
                     variant: "error"
                 });
                 this.dispatchEvent(alertmessage);
                 this.showSpinner = false;
             }
             else{
                 var modifiedcrewingdata = [];
                 var crewingdata = JSON.parse(result.responsebody).data.department;
                 this.currentuserroleid = result.user_role_id;
                 if(result.user_department_id!=null){
                     this.currentuserdepartment=result.user_department_id;
                 }
                 for(var i in crewingdata){
                     crewingdata[i]['index'] = Number(i)+1;
                    //  crewingdata[i].assigned_emp = this.modifieduserlist(crewingdata[i].assigned_emp);
                     const assigned_emp = this.modifieduserlist(crewingdata[i].assigned_emp);
                     crewingdata[i].assigned_emp = this.removeDuplicates(assigned_emp);
                     var assignedemployees = [];
                     var employeeswithbuildstation=[]; 
                     for(var emp in crewingdata[i].assigned_emp){
                         assignedemployees.push(crewingdata[i].assigned_emp[emp].value);
                         if(crewingdata[i].assigned_emp[emp].buildstationid!=null){
                            employeeswithbuildstation.push(crewingdata[i].assigned_emp[emp].value);    
                         }
                     }
                     crewingdata[i]['selectedusers'] = assignedemployees;
                     crewingdata[i]['isusersavailable'] = assignedemployees.length!=0;
                     crewingdata[i]['lockedusers']=employeeswithbuildstation;
                     crewingdata[i].lockedusersavailable=employeeswithbuildstation.length>0?true:false;
                     modifiedcrewingdata.push(crewingdata[i]);
                 }
                 this.deptmappingdata = modifiedcrewingdata;
                 this.showSpinner = false;
             }
             
       })
       .catch((error) => {
         const alertmessage = new ShowToastEvent({
           title: "Department crewing  data fetch failed.",
           message:"Something unexpected occured. Please contact your Administrator",
           variant: "error"
         });
         this.dispatchEvent(alertmessage);
         this.showSpinner = false;
       });
      }
 
     // On modify of Department Crewing Data - Fetch Unassigned users.
     selecteddeptforpoolcrew;
     userswithbuildstationassigned=[];
     availableusersforassignmentdept = [];
     modifyassignments(event){
        var selecteddepartmentid = event.target.dataset.id;
        for(var i in this.deptmappingdata){
            if(this.deptmappingdata[i].dept_id == selecteddepartmentid){
                this.selecteddeptforpoolcrew = this.deptmappingdata[i];
            }
        }
         getUnassignedUsersofPool({selectednonpooldept : this.selectedpooldeptname})
         .then((result) => {
             if(result.isError){
                 const alertmessage = new ShowToastEvent({
                     title: "Unassigned userlist data fetch failed.",
                     message:JSON.parse(result.responsebody).data.validation_message,
                     variant: "error"
                 });
                 this.dispatchEvent(alertmessage);
             }
             else{
                 var modifiedunassignedusersdata = [];
                 var unassignedusersdata = JSON.parse(result.responsebody).data.employee;
                 modifiedunassignedusersdata = this.modifieduserlist(unassignedusersdata);
                 for(var i in this.selecteddeptforpoolcrew.assigned_emp){
                     modifiedunassignedusersdata.push(this.selecteddeptforpoolcrew.assigned_emp[i]);
                 }
                //  this.availableusersforassignmentdept = modifiedunassignedusersdata;
                this.availableusersforassignmentdept = this.removeDuplicates(modifiedunassignedusersdata);
                 this.editdeptmapping = true;
             }
             
         })
       .catch((error) => {
         const alertmessage = new ShowToastEvent({
           title: "Unassigned userlist data fetch failed.",
           message:"Something unexpected occured. Please contact your Administrator",
           variant: "error"
         });
         this.dispatchEvent(alertmessage);
       });
      }
 
     // Modify the user selection and track selected employee list.
     selectedusersfordeptpool =[];
     updateuserassignmentsdeptmapping(event) {
         var selectedusers = event.detail.value;
         this.selectedusersfordeptpool = selectedusers;
         this.selecteddeptforpoolcrew.selectedusers = selectedusers;
      }
 
 
     // To close the Department Employee Assignment Modal
      closedeptmapmodal(event){
         this.editdeptmapping = false;
      }
 
     
     // To update the newly assigned users to server
     updatedeptmapping(event){
        var selecteddepartment =  this.selecteddeptforpoolcrew;
        var selecteduserids = [];
        for(var i in this.availableusersforassignmentdept){
            if(this.selecteddeptforpoolcrew.selectedusers.includes(this.availableusersforassignmentdept[i].value)){
                selecteduserids.push(this.availableusersforassignmentdept[i].Id);
            }
        }
        var requestbody = {
            "department_id" : selecteddepartment.dept_id,
            "department_code" : this.selectedpooldeptname,
            "mapped_employees" : JSON.stringify(selecteduserids)
        };
        assignPoolUserstoDept({requestbody:JSON.stringify(requestbody)})
         .then((result) => {
             if(result.isError){
                 const alertmessage = new ShowToastEvent({
                     title: "User Assignment Failed.",
                     message:JSON.parse(result.responsebody).data.validation_message,
                     variant: "error"
                 });
                 this.dispatchEvent(alertmessage);
             }
             else{
                const alertmessage = new ShowToastEvent({
                    title: "User Assignment Success.",
                    message:"User(s) assigned to department successfully.",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.editdeptmapping = false;
                this.getdepartmentcrewingdata(this.selectedpooldeptname);
             }
             
         })
       .catch((error) => {
         const alertmessage = new ShowToastEvent({
           title: "User Assignment Failed.",
           message:"Something unexpected occured. Please contact your Administrator",
           variant: "error"
         });
         this.dispatchEvent(alertmessage);
       });
    }

      // Department Data Change
      ondepartmentchange(event){
        this.selecteddepartment = event.target.value;
        this.loadbuildstationmappingdata();
      }

      moddedbuildstationcrewdata = []; 
      loadbuildstationmappingdata(){
          this.showSpinner = true;
          var selecteddeptid = this.selecteddepartment;
          getBuildStationCrewingData({deptid : selecteddeptid.toString()})
         .then((result) => {
             if(result.isError){
                 const alertmessage = new ShowToastEvent({
                     title: "Failed to get Build Station Crew data.",
                     message:JSON.parse(result.responsebody).data.validation_message,
                     variant: "error"
                 });
                 this.dispatchEvent(alertmessage);
                 this.showSpinner = false;
             }
             else{
                var buildstationcrewdata = JSON.parse(result.responsebody).data.buildstations; 
                var modifiedbscrewdata = [];
                for(var i in buildstationcrewdata){
                    buildstationcrewdata[i]['index'] = Number(i)+1;
                    // buildstationcrewdata[i]['assinged_emp'] = this.modifieduserlist(buildstationcrewdata[i].assinged_emp);
                    const assigned_emp = this.modifieduserlist(buildstationcrewdata[i].assinged_emp);
                    buildstationcrewdata[i]['assinged_emp'] = this.removeDuplicates(assigned_emp);
                    var assignedemployees = []; 
                     for(var emp in buildstationcrewdata[i].assinged_emp){
                         assignedemployees.push(buildstationcrewdata[i].assinged_emp[emp].value);
                     }
                     buildstationcrewdata[i]['selectedusers'] = assignedemployees;
                     buildstationcrewdata[i]['assignedusers'] = assignedemployees;//to tack new assigned/unassigned user while modifying the assignement for BS
                     buildstationcrewdata[i]['isusersavailable'] = assignedemployees.length!=0;
                     modifiedbscrewdata.push(buildstationcrewdata[i]);
                }
                this.moddedbuildstationcrewdata = modifiedbscrewdata;
                this.showSpinner = false;
             }
             
         })
       .catch((error) => {
         const alertmessage = new ShowToastEvent({
           title: "Failed to get Build Station Crew data.",
           message:"Something unexpected occured. Please contact your Administrator",
           variant: "error"
         });
         this.dispatchEvent(alertmessage);
         this.showSpinner = false;
       });

      }
     
      selectedbsdata;
      availableusersforassignmentbs = [];
      modifybuildstationassignment(event){
        var selectedbuildstationid = event.target.dataset.id;
        for(var i in this.moddedbuildstationcrewdata){
            if(this.moddedbuildstationcrewdata[i].buildstation_id == selectedbuildstationid){
                this.selectedbsdata = this.moddedbuildstationcrewdata[i];
            }
        }
        getUnassignedUsersofDepartment({deptid : this.selecteddepartment.toString()})
        .then((result) => {
            if(result.isError){
                const alertmessage = new ShowToastEvent({
                    title: "Unassigned userlist data fetch failed.",
                    message:JSON.parse(result.responsebody).data.validation_message,
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            }
            else{
                //
                var modifiedunassignedusersdata = [];
                var unassignedusersdata = JSON.parse(result.responsebody).data.employee;
                modifiedunassignedusersdata = this.modifieduserlist(unassignedusersdata);
                for(var i in this.selectedbsdata.assinged_emp){
                    modifiedunassignedusersdata.push(this.selectedbsdata.assinged_emp[i]);
                }
                this.availableusersforassignmentbs = this.removeDuplicates(modifiedunassignedusersdata);
                //
                this.editbuildstationmapping = true;
            }
            
        })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Unassigned userlist data fetch failed.",
          message:"Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
        
      }

      
     // Modify the user selection and track selected employee list.
     selectedusersforbspool =[];
     updatebsusers(event) {
         var selectedusers = event.detail.value;
         this.selectedusersforbspool = selectedusers;
         this.selectedbsdata.selectedusers = selectedusers;
      } 


    cancelbuildstationassignmentmodal(event){
        this.editbuildstationmapping = false;
    }

    updatebscrewmapping(event) {
        var selecteddepartment = this.selectedbsdata;
        var selecteduser = [];
        var unassigneduser = []
        var selecteduserids = [];
        var unassigneduserids = [];
        //To track new assignment/unassignment
        unassigneduser = this.selectedbsdata.assignedusers.filter(user => !this.selectedbsdata.selectedusers.includes(user));
        selecteduser = this.selectedbsdata.selectedusers.filter(user => !this.selectedbsdata.assignedusers.includes(user));
        //Get the id for the assigned user and unassigned user
        for (var i in this.availableusersforassignmentbs) {
            if (selecteduser.includes(this.availableusersforassignmentbs[i].value)) {
                selecteduserids.push(this.availableusersforassignmentbs[i].Id);
            }
            if (unassigneduser.includes(this.availableusersforassignmentbs[i].value)) {
                unassigneduserids.push(this.availableusersforassignmentbs[i].Id);
            }
        }
        var requestbody = {
            "department_id": this.selecteddepartment,
            "buildstation_id": selecteddepartment.buildstation_id,
            "mapped_employees": JSON.stringify(selecteduserids),
            "unmapped_employees": JSON.stringify(unassigneduserids)
        };
        assignPoolUserstoBuildStation({ requestbody: JSON.stringify(requestbody) })
            .then((result) => {
                if (result.isError) {
                    const alertmessage = new ShowToastEvent({
                        title: "User Assignment Failed.",
                        message: JSON.parse(result.responsebody).data.validation_message,
                        variant: "error"
                    });
                    this.dispatchEvent(alertmessage);
                }
                else {
                    const alertmessage = new ShowToastEvent({
                        title: "User Assignment Success.",
                        message: "User(s) successfully assigned to build station(s).",
                        variant: "success"
                    });
                    this.dispatchEvent(alertmessage);
                    this.editbuildstationmapping = false;
                    this.loadbuildstationmappingdata();
                }

            })
            .catch((error) => {
                const alertmessage = new ShowToastEvent({
                    title: "User Assignment Failed.",
                    message: "Something unexpected occured. Please contact your Administrator",
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            });
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
            objTitle = objectArray[item]['empid'];
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

    onemployeeselect(event) {
        this.selectedEmployee = event.detail.selectedRecord;
        this.applyfilterchanges(event);
    }

    onclearemployee(event) {
        this.selectedEmployee = undefined;
        this.applyfilterchanges(event);
    }

    newassignmentmodal(event) {
        var nonassembly_label;
        if (event.target.name == 'crew_adjustment') {
            this.selectedcrewiadjustmentpooldept = this.selectednonassemblydepartment;
            this.selectedcrewiadjustmentwipdept = this.selecteddeptforpoolcrew.dept_id.toString();
            this.availableusersforcrewassignment = this.availableusersforassignmentdept;
            this.selectedcrewingadjustusers = this.selecteddeptforpoolcrew.selectedusers;
            nonassembly_label = this.selectedpooldeptname;
        }
        else {
            this.selectedcrewiadjustmentpooldept = this.departmentlistnonassembly[0].value;
            nonassembly_label = this.departmentlistnonassembly[0].label;
            this.selectedcrewiadjustmentwipdept = undefined;
            this.selectedcrewingadjustusers = [];
            this.loadnonloaborpooluser(nonassembly_label);
        }
        this.assignmentcomment = undefined;
        this.crewadjustmentdate = {
            "start_date": undefined,
            "end_date": undefined
        }
        this.addnewcrewassignmentmodal = true;
    }

    closenewcrewassignmentmodal() {
        this.addnewcrewassignmentmodal = false;
    }

    updatecrewingadjustmentusers(event) {
        var selectedusers = event.target.value;
        this.selectedusersforcrewadjustment = selectedusers;//dummy
        this.selectedcrewingadjustusers = selectedusers;         
    }

    onlaborpooldepartmentchange(event) {
        this.selectedcrewiadjustmentpooldept = event.target.value;
        var selectedpooldeptname;
        for(var i in this.departmentlistnonassembly){
            if(this.departmentlistnonassembly[i].value == this.selectedcrewiadjustmentpooldept){
                selectedpooldeptname = this.departmentlistnonassembly[i].label;
            }
        }
        this.loadnonloaborpooluser(selectedpooldeptname);
    }

    onnonpooldepartmentchange(event) {
        this.selectedcrewiadjustmentwipdept = event.target.value;
    }

    // On modify of Department Crewing Data - Fetch Unassigned users.
    @track availableusersforcrewassignment = [];
    loadnonloaborpooluser(selectedpooldeptname){
        getUnassignedUsersofPool({selectednonpooldept : selectedpooldeptname})
        .then((result) => {
            if(result.isError){
                const alertmessage = new ShowToastEvent({
                    title: "Unassigned userlist data fetch failed.",
                    message:JSON.parse(result.responsebody).data.validation_message,
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            }
            else{
                var modifiedunassignedusersdata = [];
                var unassignedusersdata = JSON.parse(result.responsebody).data.employee;
                modifiedunassignedusersdata = this.modifieduserlist(unassignedusersdata);
                // this.availableusersforcrewassignment = modifiedunassignedusersdata;
                this.availableusersforcrewassignment = this.removeDuplicates(modifiedunassignedusersdata);
                this.selectedcrewingadjustusers = [];
            }
            
        })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Unassigned userlist data fetch failed.",
          message:"Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
     }

    updateassignmentcomment(event) {
        this.assignmentcomment = event.target.value;
    }

    updateassignmentdate(event) {
        var name = event.target.name;
        this.crewadjustmentdate[name] = event.target.value;
    }

    //To create custome date formate 2021-07-14 to 2021-07-14 00:00:00
    modifydate(date) {
        if (date != undefined && date != null) {
            var jsdate = new Date(date);
            // return jsdate.getFullYear() + "-" + (jsdate.getMonth() + 1) + "-" + jsdate.getDate() + " " + "00:00:00";//todo
            return jsdate.getFullYear() + "-" + (jsdate.getMonth() + 1) + "-" + jsdate.getDate() + " " + jsdate.getHours() + ":" + jsdate.getMinutes() + ":" + jsdate.getSeconds()
        }
        else {
            return null;
        }
    }

    createnewassignment() {
        const allValid = [...this.template.querySelectorAll('.fieldvalidation')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            var selecteduserids = [];
            var selectedusername = [];
            for(var i in this.availableusersforcrewassignment){
                if(this.selectedcrewingadjustusers.includes(this.availableusersforcrewassignment[i].value)){
                    selecteduserids.push(this.availableusersforcrewassignment[i].userid);
                    // selectedusername.push(this.availableusersforcrewassignment[i].empid);
                    selectedusername.push(this.availableusersforcrewassignment[i].Name);//fullname
                }
            }
            var assignment_comment;
            if (this.assignmentcomment == undefined || this.assignmentcomment == null) {
                assignment_comment = '';
            }
            else {
                assignment_comment = this.assignmentcomment
            }
            var requestbody = {
                'employee_id': selecteduserids,
                'employee_name': selectedusername,
                // 'crewing_adj_start_date': this.modifydate(this.crewadjustmentdate.start_date),
                // 'crewing_adj_end_date': this.modifydate(this.crewadjustmentdate.end_date),
                'crewing_adj_start_date': this.crewadjustmentdate.start_date,
                'crewing_adj_end_date': this.crewadjustmentdate.end_date,
                'crewing_adj_comments': assignment_comment,
                'deactivate_date': null,//to-do
                // 'deactivate_date': this.modifydate(this.crewadjustmentdate.end_date),
                'assigned_department_id': Number(this.selectedcrewiadjustmentwipdept),
                'original_department_id': Number(this.selectedcrewiadjustmentpooldept)
            };
            createNewCrewAssignment({ requestbody: JSON.stringify(requestbody) })
                .then(data => {
                    if (data.isError) {
                        // event.target.disabled = false;
                        this.showmessage('Sorry we could not add new Crewing Assignment.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
                    }
                    else {
                        var unassigned_id = JSON.parse(data.responsebody)['date_conflict'];
                        var success_msg = JSON.parse(data.responsebody)['data'];
                        var message = '';
                        if (unassigned_id != undefined) {
                            for (var item in this.availableusersforcrewassignment) {
                                if (unassigned_id.includes(this.availableusersforcrewassignment[item].userid)) {
                                    message = message + " " + this.availableusersforcrewassignment[item].value;
                                }
                            }
                            this.showmessage('Crewing adjustment already exists/overlapping dates.', 'Crewing Assignment not added for '+`${message}`, 'warning');
                        }
                        if (success_msg != undefined) {
                            this.showmessage('Added new Crewing Adjustment.', 'A new Crewing Adjustment was successfully created.', 'success');
                        }

                        this.addnewcrewassignmentmodal = false;
                        this.loadcrewadjustmentdata();
                    }

                }).catch(error => {
                    this.error = error;
                    // event.target.disabled = false;
                    this.showmessage('Sorry we could not complete add new Crewing Assignment.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
                });
        }
        else {
            const alertmessage = new ShowToastEvent({
                title: "Please verify your input.",
                message: "Please provide valid inputs for the Crewing Assignment.",
                variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }
    }

    loadcrewadjustmentdata() {
        this.showSpinner = true;
        getallCrewAssignment()
            .then(data => {
                var todaydate = new Date();
                var crewassignmentlist = JSON.parse(data.responsebody).data;
                var modcrewassignmentlist = [];
                var employeelist = [];
                var createduserlist = [];         //v       
                for (var item in crewassignmentlist) {
                    var index = Number(item) + 1;
                    var assignmentobj = crewassignmentlist[item];
                    var employeeid = {
                        "appuser_name": assignmentobj.first_name,
                        "employee_id": assignmentobj.employee_id,
                        "employee_number": assignmentobj.employee_number,
                        "first_name": assignmentobj.first_name,
                        "last_name": assignmentobj.last_name
                    };
                    var employee_id = this.modifieduserlist([employeeid]);
                    var created_by = this.modifieduserlist([assignmentobj.createdby_id]);
                    var modified_by = this.modifieduserlist([assignmentobj.modifiedby_id])
                    var created_date = this.getmoddeddate(assignmentobj.created_date);
                    var createdbyname;
                    var displaycreatedbyname;
                    var createdbyempid = undefined;
                    var pool_department;
                    var assigned_department;
                    if (created_by != undefined && created_by.length != 0) {
                        if (created_by[0] != undefined) {
                            displaycreatedbyname = `${created_by[0].name} (${created_by[0].userid}) on ${created_date}`;
                            //createdbyname = `${created_by[0].name} (${created_by[0].userid})`;//to-do
                            createdbyname = `${created_by[0].name}`;
                            createdbyempid = `${created_by[0].userid}`;
                        }
                    }
                    var employeename;
                    if (employee_id != undefined && employee_id.length != 0) {
                        if (employee_id[0] != undefined) {
                            employeename = `${employee_id[0].name}`;
                        }
                    }
                    var modifiedbyname;
                    if (modified_by != undefined && modified_by.length != 0) {
                        if (modified_by[0] != undefined) {
                            modifiedbyname = `${modified_by[0].name}`;
                        }
                    }
                    var classname = "";
                    var is_active = true; //to track if deactivated by supervisor
                    var is_applicable = true; //to track if the assignment is considered
                    if (assignmentobj.crewing_adj_deactivate_dt != null) {
                        is_active = false;
                        // if (new Date(this.getisodate(todaydate)) > new Date(this.getisodate(assignmentobj.deactivate_date))) {
                        // if (this.getisodate(todaydate) > this.changeDateFormat(assignmentobj.crewing_adj_deactivate_dt)) {
                        // if (new Date(this.getisodate(todaydate)) > new Date(assignmentobj.crewing_adj_deactivate_dt)) {
                        if (this.getisodate(todaydate) < assignmentobj.crewing_adj_deactivate_dt) {
                        }
                        else {
                            is_applicable = false;
                            classname = "inactive";
                        }
                    }
                    else {
                        // if (new Date(this.getisodate(todaydate)) > new Date(this.getisodate(assignmentobj.crewing_adj_end_date))) {
                        // if (this.getisodate(todaydate) > this.changeDateFormat(assignmentobj.crewing_adj_end_date)) {
                        if (new Date(this.getisodate(todaydate)) > new Date(assignmentobj.crewing_adj_end_date)) {
                            is_active = false;
                            is_applicable = false;
                            classname = "inactive";
                        }
                    }
                    
                    for (var i in this.departmentlistnonassembly) {
                        if (this.departmentlistnonassembly[i].value == assignmentobj.original_department_id.toString()) {
                            pool_department = this.departmentlistnonassembly[i].label;
                        }
                    }
                    for (var i in this.departmentlistoptions) {
                        if (this.departmentlistoptions[i].value == assignmentobj.assigned_department_id.toString()) {
                            assigned_department = this.departmentlistoptions[i].label;
                        }
                    }
                    var modified = false;
                    if(assignmentobj.modified_date != undefined && assignmentobj.modified_date != null){
                        modified = true
                    }
                    var moddedcrewassignemnet = {
                        index: index,
                        created_by: created_by,
                        employee_id: employee_id,
                        modifiedby_id: modified_by,
                        employeename: employeename,
                        createdbyname: createdbyname,
                        modifiedbyname: modifiedbyname,
                        displaycreatedbyname: displaycreatedbyname,
                        original_department_id: assignmentobj.original_department_id,
                        original_departmen_code: this.getdepartmentcode(assignmentobj.original_department_id, this.departmentlistnonassembly),
                        original_department_name: pool_department,
                        assigned_department_id: assignmentobj.assigned_department_id != null ? assignmentobj.assigned_department_id.toString() : assignmentobj.assigned_department_id,
                        assigned_department_code: this.getdepartmentcode(assignmentobj.assigned_department_id, this.departmentlistoptions),
                        assigned_department_name: assigned_department,
                        // createdbyname: createdbyname,
                        // displaycreatedbyname: displaycreatedbyname,
                        modified_date: assignmentobj.modified_date,
                        // createdby_id: modifieduserlist([assignmentobj.created_date]),
                        is_active: is_active,
                        is_modified: modified,
                        is_applicable: is_applicable,
                        classname: classname,
                        crewingadjustment_id: assignmentobj.crewingadjustment_id,
                        employee_id: assignmentobj.employee_id,
                        employee_name: assignmentobj.employee_name,
                        created_date: assignmentobj.created_date,
                        created_date_display: this.getmoddeddate(assignmentobj.created_date),
                        modified_date: assignmentobj.modified_date,
                        modified_date_display: this.getmoddeddate(assignmentobj.modified_date),
                        crewing_adj_comments: assignmentobj.crewing_adj_comments,
                        crewing_startdate: assignmentobj.crewing_adj_start_date,
                        // crewing_startdate_display: this.getmoddeddate(assignmentobj.crewing_adj_start_date),
                        crewing_startdate_display: this.changeDateFormat(assignmentobj.crewing_adj_start_date),
                        crewing_enddate: assignmentobj.crewing_adj_end_date,
                        // crewing_enddate_display: this.getmoddeddate(assignmentobj.crewing_adj_end_date),
                        crewing_enddate_display: this.changeDateFormat(assignmentobj.crewing_adj_end_date),
                        deactivation_date: assignmentobj.crewing_adj_deactivate_dt,
                        // deactivation_date_display: this.getmoddeddate(assignmentobj.deactivate_date),
                        deactivation_date_display: this.changeDateFormat(assignmentobj.crewing_adj_deactivate_dt),
                        filtered: ""
                    };
                    
                    modcrewassignmentlist.push(moddedcrewassignemnet);
                    employeelist.push(moddedcrewassignemnet.employeename);
                    createduserlist.push(moddedcrewassignemnet.createdbyname);
                }

                let crewingdata = JSON.parse(JSON.stringify(modcrewassignmentlist));
                crewingdata.sort((a, b) => {
                    return a['employeename'] > b['employeename'] ? 1 : -1;
                });
                // modcrewassignmentlist.sort((a, b) => {
                //     // return a.crewingadjustment_id - b.crewingadjustment_id;
                //     // return b.crewingadjustment_id - a.crewingadjustment_id;
                //     return a.employeename - b.employeename;
                // });
                this.employeelist = Array.from(new Set(employeelist));
                this.createduserlist = Array.from(new Set(createduserlist));
                this.modifiedcrewingadjlist = crewingdata;
                this.allcrewingadjustmentlist = crewingdata;
                // this.modifiedcrewingadjlist = modcrewassignmentlist;
                // this.allcrewingadjustmentlist = modcrewassignmentlist;
                this.showSpinner = false;
                this.error = undefined;
                this.applyfilterchanges();
                //
            })
            .catch(error => {
                this.error = error;
                this.showmessage('Crewing Adjustment Data fetch failed.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
            });
    }

    // Get stringified modded date
    getmoddeddate(date) {
        var formatteddate = undefined;
        if (date != undefined) {
            var jsdate = new Date(date);
            var dtmonth = jsdate.getMonth() + 1;
            dtmonth = dtmonth < 10 ? "0" + dtmonth : dtmonth;
            var dtday = jsdate.getDate();
            dtday = dtday < 10 ? "0" + dtday : dtday;
            return (

                // jsdate.getDate() +
                // "/" +
                // dtmonth +
                // "/" +
                // jsdate.getFullYear() 
                dtmonth +
                "-" +
                dtday +
                "-" +
                jsdate.getFullYear()
            );
        }
        return formatteddate;
    }

    // Get stringified modded date
    getisodate(date) {
        var formatteddate = undefined;
        if (date != undefined) {
            // var jsdate = new Date(date);
            // var dtmonth = jsdate.getMonth() + 1;
            // return (

            //     jsdate.getFullYear() +
            //     "-" +
            //     dtmonth +
            //     "-" +
            //     jsdate.getDate()
            // );
            formatteddate = new Date(date);
            var month = formatteddate.getMonth() + 1;
            var newmonth = month <= 9 ? "0" + month : month;
            var date = formatteddate.getDate();
            var newdate = date <= 9 ? "0" + date : date;
            var year = formatteddate.getFullYear();
            return `${year}-${newmonth}-${newdate}`;
        }
        else {
            return formatteddate;
        }
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
    
    applyfilterchanges(event) {       
        var selectepoolddepartement = this.selectepoolddepartement;
        var selectednonpooldepartement = this.selectednonpooldepartement;
        var selectedEmployee = this.selectedEmployee;
        var is_active_data = this.is_active_data;
        // var selectedstartdate = this.getmoddeddate(this.selectedstartdate);
        // var selectedenddate = this.getmoddeddate(this.selectedenddate);
        var selectedstartdate = this.selectedstartdate;
        var selectedenddate = this.selectedenddate;
        var selectedCreteduser = this.selectedCreteduser;
        this.showSpinner = true;
        var filteredcrewadjustment = [];
        var completedata = JSON.parse(JSON.stringify(this.allcrewingadjustmentlist));
        for (var item in completedata) {
            var assignment = completedata[item];
            var discfilter = assignment.filtered;
            if (selectedEmployee != undefined) {
                if (
                    assignment.employeename == selectedEmployee
                ) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            if (selectedCreteduser != undefined) {
                if (
                    assignment.createdbyname == selectedCreteduser
                ) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            if (selectedstartdate != undefined && selectedstartdate != "") {
                if (assignment.crewing_startdate == selectedstartdate) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            if (selectedenddate != undefined && selectedenddate != "") {
                if (assignment.crewing_enddate == selectedenddate) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            if (selectepoolddepartement != undefined && selectepoolddepartement != 'All Pool Departments') {
                if (
                    assignment.original_department_id.toString() == selectepoolddepartement
                ) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            if (selectednonpooldepartement != undefined && selectednonpooldepartement != 'All Departments') {
                if (
                    assignment.assigned_department_id.toString() == selectednonpooldepartement
                ) {
                } else {
                    assignment.filtered = discfilter + " invisible";
                }
            }
            
            if (assignment.is_applicable == is_active_data) {
            } else {
                assignment.filtered = discfilter + " invisible";
            }
            if (!assignment.filtered.includes("invisible")) {
                filteredcrewadjustment.push(assignment);
            }
        }
        this.filteredcrewadjustment = [];
        this.filteredcrewadjustment = filteredcrewadjustment;
        this.showSpinner = false;
    }
    
    loadpicklist(event) {
        if (event.target.options.length == 1) {
            getallDepartments()
                .then((result) => {
                    var departmentlistvaluesnonassembly = [];
                    var departmentlistvaluesassembly = [];
                    departmentlistvaluesassembly.push({ label: "All Departments", value: "All Departments" });
                    departmentlistvaluesnonassembly.push({ label: "All Pool Departments", value: "All Pool Departments" });
                    var departmentsvalues = JSON.parse(result.responsebody).data.departments;

                    for (var i in departmentsvalues) {
                        var option = {
                            'value': departmentsvalues[i].department_id.toString(),
                            'label': departmentsvalues[i].department_name.split('-')[0],
                        };
                        if (departmentsvalues[i].is_assembly_line) {
                            departmentlistvaluesassembly.push(option);
                        }
                        else {
                            departmentlistvaluesnonassembly.push(option);
                        }
                    }
                    
                    this.pooldepartmentlist = departmentlistvaluesnonassembly;
                    this.nonpooldepartmentlist = departmentlistvaluesassembly;
                })
                .catch((error) => {
                    const alertmessage = new ShowToastEvent({
                        title: "Department data fetch failed.",
                        message: "Something unexpected occured. Please contact your Administrator",
                        variant: "error"
                    });
                    this.dispatchEvent(alertmessage);
                });
        }
    }
    handlepooldepartmentchange(event){
        this.selectepoolddepartement = event.target.value;
        this.applyfilterchanges();
    }
    handledepartmentchange(event){
        this.selectednonpooldepartement = event.target.value;
        this.applyfilterchanges();
    }

    ondatafilterselection(event){
        this.is_active_data = event.target.checked;
        this.applyfilterchanges();
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

    @track selectedassignment = [];
    @track assignmentdetailmodal = false;
    showassignmentdetail(event) {
        this.isupdated = false;
        this.is_deactivated = false;
        var selecteassignmentid = event.currentTarget.dataset.id;
        var selectedassignment = []; 
        for (var i in this.modifiedcrewingadjlist) {
            if (this.modifiedcrewingadjlist[i].crewingadjustment_id == selecteassignmentid) {
                selectedassignment = this.modifiedcrewingadjlist[i];
            }
        }
        this.selectedassignment = selectedassignment;
        this.assignmentdetailmodal = true;
    }
    hideassignmentdetail(){
        this.selectedassignment = undefined;
        this.assignmentdetailmodal = false;
        this.loadcrewadjustmentdata();
    }
    updateassignment() {
        const allValid = [...this.template.querySelectorAll('.updatevalidation')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            var updateassignmentvalues = this.selectedassignment;
            var requestbody = {
                'crewingadjustment_id': updateassignmentvalues.crewingadjustment_id,
                'employee_id': updateassignmentvalues.employee_id,
                'employee_name': updateassignmentvalues.employee_name,
                // 'crewing_adj_start_date': this.modifydate(updateassignmentvalues.crewing_startdate),
                // 'crewing_adj_end_date': this.modifydate(updateassignmentvalues.crewing_enddate),
                'crewing_adj_start_date': updateassignmentvalues.crewing_startdate,
                'crewing_adj_end_date': updateassignmentvalues.crewing_enddate,
                'crewing_adj_comments': updateassignmentvalues.crewing_adj_comments,
                // 'deactivate_date': this.modifydate(updateassignmentvalues.deactivation_date),
                'deactivate_date': updateassignmentvalues.deactivation_date,
                'assigned_department_id': Number(updateassignmentvalues.assigned_department_id),
                'original_department_id': updateassignmentvalues.original_department_id
            };
            updateCrewAssignment({ requestbody: JSON.stringify(requestbody) })
                .then(data => {
                    if (data.isError) {
                        // event.target.disabled = false;
                        this.showmessage('Sorry we could not update Assignment.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
                    }
                    else {
                        
                        this.isupdated = false;
                        var response_msg = JSON.parse(data.responsebody).data;
                        var update_conflict = JSON.parse(data.responsebody).employee_exist;//
                        if (response_msg == 'Date Conflict') {
                            this.showmessage('Crewing adjustment already exists/overlapping dates.', 'Can not update the Crewing Assignment for ' + `${this.selectedassignment.employeename}`, 'warning');
                            this.assignmentdetailmodal = false;
                        }
                        else if (update_conflict != undefined) {//
                            // this.showmessage('Unsuccessful.', `${update_conflict}`, 'warning');//
                            this.showmessage('Unsuccessful.', 'Update unsuccessful. Employee is assigned to build station(s) in a different department', 'warning');
                            this.assignmentdetailmodal = false;//
                        }//
                        else {
                            if(this.is_deactivated){
                                this.showmessage('Crewing Assignment has been deactivated.', 'The Crewing Assignment was deactivated Successfully.', 'success');
                                this.is_deactivated = false;
                            }
                            else{
                                this.showmessage('Assignment Updated.', 'The Crewing Assignment was updated Successfully.', 'success');
                                this.assignmentdetailmodal = false;
                            }                            
                        }
                        this.loadcrewadjustmentdata();
                        // this.showmessage('Assignment Updated.', 'The Crew Adjustment Assignment was updated Successfully.', 'success');
                        // this.assignmentdetailmodal = false;
                        // this.loadcrewadjustmentdata();
                    }
                }).catch(error => {
                    this.error = error;
                    // event.target.disabled = false;
                    this.showmessage('Sorry we could not complete update Assignment.', 'Something unexpected occured. Please try again or contact your Administrator.', 'error');
                });
        }
        else {
            const alertmessage = new ShowToastEvent({
                title: "Please verify your input.",
                message: "Please provide valid inputs for the Assignment.",
                variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }
    }
    // updateselectedassignment(event) {
    //     var name = event.target.name;
    //     var value;
    //     if (event.target.name == "is_active") {
    //         value = event.target.checked;
    //         var deactivedate = new Date();
    //         this.selectedassignment.deactivation_date = deactivedate.getFullYear() + "-" + (deactivedate.getMonth() + 1) + "-" + deactivedate.getDate();
    //         this.is_deactivated = true;
    //     }
    //     else {
    //         value = event.target.value;
    //     }
    //     this.selectedassignment[name] = value;
    //     if (event.target.name == "is_active") {
    //         this.updateassignment();
    //     }
    // }

    updateselectedassignment(event) {
        var name = event.target.name;
        var value;
        if (name == "is_active") {
            var status = confirm("Are you sure you want to deactivate the crewing adjustment?");
            if (status) {
                value = event.target.checked;
                this.selectedassignment[name] = value;
                var deactivedate = new Date();
                this.selectedassignment.deactivation_date = deactivedate.getFullYear() + "-" + (deactivedate.getMonth() + 1) + "-" + deactivedate.getDate();
                this.is_deactivated = true;
                this.updateassignment();
            }else{
                event.target.checked = true;
            }

        }
        else if(name == "crewing_startdate"){
            // if(new Date() > new Date(event.target.value)){ 
            //     var today = this.getisodate(new Date())
            //     this.showmessage('Invalid Start Date.', 'Value must be '+`${today}`+' or later', 'warning');
            // }else{
            //     this.selectedassignment[name] = event.target.value;
            //     this.isupdated = true;
            // }
            if (this.getisodate(new Date()) > event.target.value) {
                this.isupdated = false;
                var today = this.getisodate(new Date())
                this.showmessage('Invalid Start Date.', 'Value must be ' + `${today}` + ' or later', 'warning');
            } else {
                this.selectedassignment[name] = event.target.value;
                this.isupdated = true;
            }
        }
        else {
            value = event.target.value;
            this.selectedassignment[name] = value;
            this.isupdated = true;
        }
    }

    navigatetocrewadjustment(event) {
        this.closedeptmapmodal(event);
        this.selectedtab = 'Crewing Adjustment';
        this.loadcrewadjustmentdata(event);
        this.newassignmentmodal(event);
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

    @track selectedstartdate;
    @track selectedenddate;
    @track selectedCreteduser;
    handlestartdatechange(event) {
        this.selectedstartdate = this.getformatedsearchformat(
            event.target.value
        );
        this.applyfilterchanges();
    }
    handleenddatechange(event) {
        this.selectedenddate = this.getformatedsearchformat(
            event.target.value
        );
        this.applyfilterchanges();
    }
    oncreateduserselect(event) {
        this.selectedCreteduser = event.detail.selectedRecord;
        this.applyfilterchanges(event);
    }
    onclearuserselect(event) {
        this.selectedCreteduser = undefined;
        this.applyfilterchanges(event);
    }

    @track previousColumn;
    @track sortedColumn;
    @track sortedDirection = 'asc';
    // To handle sort on columns in Bus/Ecard view. 
    sort(event) {
        var previousSorted = this.previousColumn;
        if (previousSorted != undefined) {
            if (event.currentTarget.dataset.id != previousSorted) {
                const element = this.template.querySelector('[data-id="' + previousSorted + '"]');
                element.iconName = '';
                this.previousColumn = event.currentTarget.dataset.id;
            }
            else {
                this.previousColumn = event.currentTarget.dataset.id;
            }
        }
        else {
            this.previousColumn = event.currentTarget.dataset.id;
        }


        if (this.sortedColumn === event.currentTarget.dataset.id) {
            this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortedDirection = 'asc';
        }
        var reverse = this.sortedDirection === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(this.filteredcrewadjustment));
        table.sort((a, b) => { return a[event.currentTarget.dataset.id] > b[event.currentTarget.dataset.id] ? 1 * reverse : -1 * reverse });
        this.sortedColumn = event.currentTarget.dataset.id;
        this.filteredcrewadjustment = table;
        if (this.sortedDirection === 'asc') {
            event.target.iconName = 'utility:chevronup';
        }
        if (this.sortedDirection === 'desc') {
            event.target.iconName = 'utility:chevrondown';
        }

    }

    //convert date deom YYYY-MM-DD to MM-DD-YYYY
    changeDateFormat(inputDate) {
        if (inputDate != undefined || inputDate != null) {
            // expects Y-m-d
            var splitDate = inputDate.split('-');
            if (splitDate.count == 0) {
                return null;
            }

            var year = splitDate[0];
            var month = splitDate[1];
            var day = splitDate[2];

            return month + '-' + day + '-' + year;
        }
        else
            return null;
    }

    // refreshes the Crewing adjustment page
    handlerefresh(event) {
        this.selectepoolddepartement = 'All Pool Departments';
        this.selectednonpooldepartement = 'All Departments';
        this.selectedEmployee = undefined;
        this.is_active_data = true;
        this.selectedstartdate = undefined;
        this.selectedenddate = undefined;
        this.selectedCreteduser = undefined;
        // this.template.querySelector('c-custom-search-component').clear(event);
        const searchbox = this.template.querySelectorAll('c-custom-search-component');
        searchbox.forEach((elm, idx) => {
            elm.clear(event);
        });
        this.loadcrewadjustmentdata();
    }
    
}