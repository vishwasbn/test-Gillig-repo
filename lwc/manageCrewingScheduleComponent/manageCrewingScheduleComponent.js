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
    get iselecteddeptmapping(){
        return this.selectedtab == 'Department Mapping';
    }

    get isselectedworkcentremapping(){
        return this.selectedtab == 'Work Centre Mapping';
    }

    get selecteddepartmentname(){
        for(var i in this.departmentlistoptions){
            if(this.departmentlistoptions[i].value == this.selecteddepartment){
                return this.departmentlistoptions[i].label;
            }
        }
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
                     crewingdata[i].assigned_emp = this.modifieduserlist(crewingdata[i].assigned_emp);
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
                 this.availableusersforassignmentdept = modifiedunassignedusersdata;
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
                    title: "Users assignment Success.",
                    message:"Users assigned to department successfully.",
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
                    buildstationcrewdata[i]['assinged_emp'] = this.modifieduserlist(buildstationcrewdata[i].assinged_emp);
                    var assignedemployees = []; 
                     for(var emp in buildstationcrewdata[i].assinged_emp){
                         assignedemployees.push(buildstationcrewdata[i].assinged_emp[emp].value);
                     }
                     buildstationcrewdata[i]['selectedusers'] = assignedemployees;
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
                this.availableusersforassignmentbs = modifiedunassignedusersdata;
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

    updatebscrewmapping(event){
        var selecteddepartment =  this.selectedbsdata;
        var selecteduserids = [];
        for(var i in this.availableusersforassignmentbs){
            if(this.selectedbsdata.selectedusers.includes(this.availableusersforassignmentbs[i].value)){
                selecteduserids.push(this.availableusersforassignmentbs[i].Id);
            }
        }
        var requestbody = {
            "department_id" : this.selecteddepartment,
            "buildstation_id" : selecteddepartment.buildstation_id,
            "mapped_employees" : JSON.stringify(selecteduserids)
        };
        assignPoolUserstoBuildStation({requestbody:JSON.stringify(requestbody)})
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
                    title: "Users assignment Success.",
                    message:"Users assigned to department successfully.",
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
           message:"Something unexpected occured. Please contact your Administrator",
           variant: "error"
         });
         this.dispatchEvent(alertmessage);
       });
        
    }

    

}