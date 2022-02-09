import { LightningElement, wire, track } from "lwc";
import getAuthentication from "@salesforce/apex/userAuthentication.getAccesstoken";
import addnewUserManagement from "@salesforce/apex/UserListingController.addnewUser";
import HideLightningHeader from "@salesforce/resourceUrl/HideLightningHeader";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";

import getallDepartments from "@salesforce/apex/UserListingController.getallDepartments";
import getallCustomers from "@salesforce/apex/UserListingController.getallCustomers";
import getalluserroles from "@salesforce/apex/UserListingController.getalluserroles";
import resetuserpin from "@salesforce/apex/UserListingController.resetuserpin";

import getallUsers from "@salesforce/apex/UserListingController.getallUsers";

import updateallUsers from "@salesforce/apex/UserListingController.updatednewUser";

import deactivateUsers from "@salesforce/apex/UserListingController.deactivateUser";

//   { label: 'Last Name', fieldName: 'last_name',sortable: true, },

const columns = [
  {label : "Active", fieldName: "is_active", sortable : true, type: "boolean",initialWidth: 100},
  {label : "Employee ID", fieldName: "employee_number", sortable: true, type: "text"},
  { label: "First Name", fieldName: "first_name", sortable: true, type: "text" },
  { label: "Last Name", fieldName: "last_name", sortable: true, type: "text" },
  { label: "Role", fieldName: "approle_name", sortable: true, type: "text" },
  {label: "Department", fieldName: "department_name", sortable: true, type: "text"},
  /*{
    label: "Created Date",
    fieldName: "created_date",
    type: "date",
    typeAttributes: {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }
  },*/
  {
    label: "Action",
    type: "button",
    typeAttributes: {
      label: "Update",
      title: "Click to Edit",
      name: "Update/Delete",
      iconName: "utility:edit",
      class: "btn_next"
    }
  }
  /*{
    label: "Reset Pin",
    type: "button",
    initialWidth: 130,
    typeAttributes: {
      label: "Reset Pin",
      title: "Reset Pin",
      name: "Resetpin",
      variant: "destructive-text",
      class: "btn_next"
    }
  }*/
];
export default class UserManagmentComponent extends LightningElement {
  @track columns = columns;
  @track showSpinner;
  @track record = {};
  @track rowOffset = 0;
  @track bShowModal = false;
  @track addmodal = false;
  @track defaultSortDirection = "asc";
  @track sortDirection = "asc";
  @track sortedBy;
  @track userdataList;
  @track showTable = false; //Used to render table after we get the data from apex controller
  @track recordsToDisplay = []; //Records to be displayed on the page
  @track rowNumberOffset; //Row number
  

  user = { pin: "", confirmpin: "" };

  @track newuser ;

  @track customerlist= [];

  @track userroleslist = [];
  @track actualpicturerequest;
  @track finalpin;

  @track checkBool = true;
  @track selection = " ";
  //finalpin = " "; //

  @track departmentlistoptions;

  resetpinmodal = false;
  pattern = '[0-9]{4}';
  @track isselectedcustomer = false;

  get tableheight(){
    var height = window.innerHeight*0.82 - 173.64;
    return `height: ${height}px;`;
  }
  /*@track tableheight;
  renderedCallback(){
    var height = window.innerHeight*0.82 - 173.64;
    this.tableheight = `height: ${height}px;`;
  }*/

  connectedCallback() {
    loadStyle(this, HideLightningHeader);
    this.loaddata();
  }

  loaddata() {
    this.setdepartmentvalues();
    this.getrolesfromserver();
    this.getuserlistfromserver();
  }


  getuserlistfromserver(event){
    this.showSpinner = true;
    this.showTable = false;
    getallUsers()
      .then((data) => {
        var userdata  = JSON.parse(data.responsebody).data.user;
        for(var i in userdata){
          if(userdata[i].approle_id !=null)
          {
          userdata[i].approle_id = userdata[i].approle_id.toString();
        }} 
        this.userdataList = userdata;
        this.showTable = true;
        this.showSpinner = false;
        this.error = undefined;
        
        // Setting Up User Data
      })
      .catch((error) => {
        this.error = error;
        this.userdataList = undefined;
      });
  }

  // To get user roles from server
  getrolesfromserver(event) {
    getalluserroles()
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Sorry we could not fetch user roles.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
        } else {
          var userroles = JSON.parse(data.responsebody).data.roles;
          var userroleoptions = [];
          for (var role in userroles) {
            var userrole = {
              label: userroles[role].approle_name,
              value: userroles[role].approle_id.toString()
            };
            userroleoptions.push(userrole);
          }
          this.userroleslist = userroleoptions;
        }
      })
      .catch((error) => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
          title: "Sorry we could not fetch user roles..",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
        this.showSpinner = false;
      });
  }


  // To get user customers from server
  getcustomerlistfromserver(event) {
    getallCustomers()
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Sorry we could not fetch Customerlist.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
        } else {
          var customerlist = JSON.parse(data.responsebody).data.customer;
          var customeroptions = [];
          for (var cus in customerlist) {
            var customer = {
              label: customerlist[cus].customer_name,
              value: customerlist[cus].customer_id.toString()
            };
            customeroptions.push(customer);
          }
          this.customerlist = customeroptions;
        }
      })
      .catch((error) => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
          title: "Sorry we could not fetch Customerlist",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
        this.showSpinner = false;
      });
  }

  //Capture the event fired from the paginator component
  handlePaginatorChange(event) {
    this.recordsToDisplay = event.detail;
    this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
  }

  // Used to sort the columns
  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    return function (a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.recordsToDisplay];

    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.recordsToDisplay = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  // Row Action event to show the details of the record
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    if(row.department_id != null){
      row.department_id = row.department_id.toString();
    }
    else{
      row.department_id = '00000';
    }
    if(row.approle_id == '7' || row.approle_id == '6'){
      this.isdepartmentrequired = false;
    } 
    else{
      this.isdepartmentrequired = true;
    }
    if(row.customer_id != null){
      row.customer_id = row.customer_id.toString();
      this.isselectedcustomer = true;
    }
    else{
      this.isselectedcustomer = false;
    }
    this.record = row;
    if (actionName == "Resetpin") {
      this.resetpinmodal = true;
    } else {
      this.bShowModal = true;
    } // display modal window
  }
  
  togglebutton(event){
    var status=confirm("Are you sure you want to continue this action?");
    if(status){
    
    var deactivatedata={
      appuser_id:this.record.appuser_id,
      is_active: event.target.checked
      };
      deactivateUsers({ requestbody: JSON.stringify(deactivatedata) })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Sorry we could not complete the operation.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
        } else {
          const alertmessage = new ShowToastEvent({
            title: " Success",
            message: "User status change successfull.",
            variant: "success"
          });
          this.dispatchEvent(alertmessage);
          this.bShowModal = false;
          this.showSpinner = false;
          this.loaddata();
          
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
        this.showSpinner = false;
      });
  
  
  }


    

  }
  closeresetpinModal() {
    this.resetpinmodal = false;
  }

  // to close modal window set 'bShowModal' tarck value as false
  closeModal() {
    this.bShowModal = false;
    this.loaddata();
  }

  closeAddModal() {
    this.addmodal = false;
  }
  updateuservalue(event)
  {
    this.record[event.target.name]= event.target.value;
    if(this.record.approle_id == '7' || this.record.approle_id == '6'){
      this.isdepartmentrequired = false;
    } 
    else{
      this.isdepartmentrequired = true;
    }
    if(this.record.approle_id == '6'){
      this.isselectedcustomer=true;
      this.getcustomerlistfromserver();
    }
    else{
      this.isselectedcustomer=false;
    }
  }
  
  
  updateuserbutton(event){
    // Check Validations
    const allValid = [...this.template.querySelectorAll('.updateuservalidation')]
    .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
    }, true);
    if (allValid) {

      var updateduserData={
      appuser_id:this.record.appuser_id,
      pin:this.record.pin,
      first_name:this.record.first_name,
      last_name:this.record.last_name,
      department_id:this.record.department_id=='00000'?null:this.record.department_id,
      approle_id: this.record.approle_id,
      appuser_name:this.record.appuser_name,
      employee_number : this.record.employee_number,
      customer_id : this.record.customer_id
      };
      this.showSpinner = true;
      updateallUsers({ requestbody: JSON.stringify(updateduserData) })
          .then((data) => {
            if (data.isError) {
              if(data.errorMessage == 202){
                const alertmessage = new ShowToastEvent({
                  title: "Sorry we could not complete the operation.",
                  message: JSON.parse(data.responsebody).data.validation_message,
                  variant: "error"
                });
                this.dispatchEvent(alertmessage);
                this.showSpinner = false;
              }
              else{
                const alertmessage = new ShowToastEvent({
                  title: "Sorry we could not complete the operation.",
                  message:
                    "Something unexpected occured. Please contact your Administrator",
                  variant: "error"
                });
                this.dispatchEvent(alertmessage);
                this.showSpinner = false;
              }
              
            } else {
              const alertmessage = new ShowToastEvent({
                title: " Succcessfull",
                message: "User Updated succeessfully.",
                variant: "success"
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              this.bShowModal = false;
              this.loaddata();
              
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
            this.showSpinner = false;
          });
        }
        else{
          const alertmessage = new ShowToastEvent({
            title: "Please complete all the required fields and Validations.",
            message:
              "Please enter all valid data.",
            variant: "warning"
          });
          this.dispatchEvent(alertmessage);
        }
  }

  addnewUser() {
    this.isselectedcustomer = false;
    this.newuser = {
      employee_number : undefined,
      appuser_name: undefined,
      first_name: undefined,
      last_name: undefined,
      pin: undefined,
      approle_id: undefined,
      department : '00000',
      customername : undefined
    };
    this.addmodal = true;
  }

  handleChanges(event) {
    var targetvalue = event.target.value;
    var targetname = event.target.name;
    this.newuser[targetname] = targetvalue;
  }

  // pin confirmation function

  checkpassword(event) {
    //this.user[event.target.name] = event.target.value;

    let inputFirstName = this.template.querySelector(".confirmpin");
    if (this.user.pin != this.user.confirmpin) {
      //set an error
      this.checkBool = true;

      inputFirstName.setCustomValidity(" PIN UNMATCH");
      inputFirstName.reportValidity();
    } else {
      //reset an error
      this.checkBool = false;

      inputFirstName.setCustomValidity("");
      inputFirstName.reportValidity();
    }

    this.finalpin = this.user.confirmpin;
  }

  isdepartmentrequired = true;
  updateuserfields(event) {
    this.newuser[event.target.name] = event.target.value;
    if(this.newuser.approle_id == '6'){
      this.isselectedcustomer = true;
      this.isdepartmentrequired = false;
      this.newuser.department = '00000';
      this.getcustomerlistfromserver();
    }
    else if(this.newuser.approle_id == '7'){
      this.isdepartmentrequired = false;
      this.isselectedcustomer = false;
      this.newuser.department = '00000';
    }
    else{
      this.isselectedcustomer = false;
      this.isdepartmentrequired = true;
    }
  }
  
  @track newpin;
  // Update new pin value
  updatepinvalue(event){
    this.newpin = event.target.value;
  }
  

  // user managemnt add user button click
  handleClick(event) {
    // Check Validations
    const allValid = [...this.template.querySelectorAll('.newuservalidation')]
    .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
    }, true);
    if (allValid) {
    var actualuserData = {
      is_active : true,
      employee_number : this.newuser.employee_number,
      appuser_name: this.newuser.employee_number,
      pin: this.newuser.pin,
      user_type:"E",
      first_name: this.newuser.first_name,
      last_name: this.newuser.last_name,
      approle_id: this.newuser.approle_id,
      department_id :this.newuser.department=='00000'?null:this.newuser.department
    };
    if(this.newuser.customername !=undefined){
      actualuserData["customer_id"] = this.newuser.customername;
    }
    else{
      actualuserData["customer_id"] = null;
    }
    addnewUserManagement({ requestbody: JSON.stringify(actualuserData) })
      .then((data) => {
        //debugger
        if (data.isError) {
          if(data.errorMessage == 202){
            const alertmessage = new ShowToastEvent({
              title: "Sorry we could not complete the operation.",
              message: JSON.parse(data.responsebody).data.validation_message,
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
            this.showSpinner = false;
          }
          else{
            const alertmessage = new ShowToastEvent({
              title: "Sorry we could not complete the operation.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
            this.showSpinner = false;
          }
        } else {
          const alertmessage = new ShowToastEvent({
            title: " Succcessfull",
            message: "User Added successfully.",
            variant: "success"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
          this.addmodal = false;
          this.loaddata();
          
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
        this.showSpinner = false;
      });
    }
    else{
      const alertmessage = new ShowToastEvent({
        title: "Please fill in all the required fields.",
        message:
          "Please fill in all the required fields.",
        variant: "warning"
      });
      this.dispatchEvent(alertmessage);
    }
  }

  // Update newPIN to Server
  updatepintoserver(event){
    var actualuserData = {
      pin: this.newpin,
      user_Name: this.record.appuser_name
      
    };
    //alert(actualuserData);
    // console.log(actualuserData.appuser_name);
    resetuserpin({ requestbody: JSON.stringify(actualuserData) })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Sorry we could not complete the operation.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
        } else {
          const alertmessage = new ShowToastEvent({
            title: " Succcessfull",
            message: "PIN Updated succeessfully.",
            variant: "success"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
          this.resetpinmodal = false;
          this.loaddata();
          
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
        this.showSpinner = false;
      });
  }

  // To get Department data from Server
  setdepartmentvalues(event) {
    
    getallDepartments()
      .then((result) => {
        var departmentlistvalues = [];
        var nodepartmentoption = {label:'---None---', value:'00000'};
        departmentlistvalues.push(nodepartmentoption);
        var departmentsvalues = JSON.parse(result.responsebody).data.departments;
        for(var i in departmentsvalues){
          var option = {
            value : departmentsvalues[i].department_id.toString(),
            label : departmentsvalues[i].department_name,
          };
          departmentlistvalues.push(option);
        }
        this.departmentlistoptions = departmentlistvalues ;
       
      })
      .catch((error) => {
        this.showSpinner = true;
        const alertmessage = new ShowToastEvent({
          title: "Department data fetch failed.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }
}