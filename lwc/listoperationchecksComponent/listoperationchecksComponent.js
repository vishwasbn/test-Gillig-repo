import {LightningElement,track,wire} from 'lwc';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

import getAllOperationCheck from "@salesforce/apex/masterDataController.getOperationCheckList";
import getallDepartments from "@salesforce/apex/UserListingController.getallDepartments";
import getBuildStationCrewingData from "@salesforce/apex/CrewingScheduleController.getBuildStationCrewingData"; 

import { updateRecord,createRecord } from 'lightning/uiRecordApi';
import OPCK_OBJECT from "@salesforce/schema/Operation_Check_Master_Data__c"; 
import RECORD_ID from '@salesforce/schema/Operation_Check_Master_Data__c.Id';
import DEPARTMENT_ID from '@salesforce/schema/Operation_Check_Master_Data__c.Department_ID__c';
import BUILDSTATION_ID from '@salesforce/schema/Operation_Check_Master_Data__c.Build_Station_ID__c';
import DESCREPTION from '@salesforce/schema/Operation_Check_Master_Data__c.Operation_Description__c';
import SEQUENCE_NO from '@salesforce/schema/Operation_Check_Master_Data__c.Operation_Sequence_Number__c';
import IS_ACTIVE from '@salesforce/schema/Operation_Check_Master_Data__c.isActive__c';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import BUSMODE_FIELD from '@salesforce/schema/Operation_Check_Master_Data__c.Bus_Mode__c';
import TRANSMISSION_FIELD from '@salesforce/schema/Operation_Check_Master_Data__c.Transmission__c';
import VALUE_REQUIRED_INDICATOR from '@salesforce/schema/Operation_Check_Master_Data__c.Value_Required_Indicator__c';
import VALUE_DESCREPTION from '@salesforce/schema/Operation_Check_Master_Data__c.Value_Description__c';
const columns = [
    { label: "Active", fieldName: "isActive__c", sortable: true, type: "boolean", initialWidth: 100 },
    {
        label: 'Name',
        fieldName: 'Name',
        sortable: true,
        type: 'text',
    },
    {
        label: 'Operation Description',
        fieldName: 'Operation_Description__c',
        sortable: true,
        type: 'text',
    },
    {
        label: 'Department',
        fieldName: 'Department_ID__c',
        sortable: true,
        type: 'text',
    },
    {
        label: 'Buildstation',
        fieldName: 'Build_Station_ID__c',
        sortable: true,
        type: 'text',
    },
    {
        label: 'Bus Mode',
        fieldName: 'Bus_Mode__c',
        sortable: true,
        type: 'text',
    },
    {
        label: 'Transmission',
        fieldName: 'Transmission__c',
        sortable: true,
        type: 'text',
    },

    {
        label: 'Action',
        type: 'button',
        typeAttributes: {
            label: 'Update',
            title: 'Click to Edit',
            name: 'Update',
            iconName: 'utility:edit',
            class: 'btn_next'
        }
    },

];
export default class ListoperationchecksComponent extends LightningElement {
    @track columns = columns;
    @track showSpinner;
    @track record = {};
    @track rowOffset = 0;
    @track bShowModal = false;
    @track addnewmodal = false;
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy;
    @track opchklist = [];
    @track showTable = false; //Used to render table after we get the data from apex controller    
    @track recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset = 1; //Row number
    @track error;
    @track recordid;
    @track descreption=undefined;
    @track buildstation=undefined;
    @track department =undefined;
	@track sequence = undefined;
	@track isactive = false;

    @track transmissionpicklist;
    @track busmodepicklist;
    // @track newopck = {
    //     "bus_mode": undefined,
    //     "transmission": undefined
    // };

    get tableHeight() {
        var height = window.innerHeight * 0.82 - 247.59;
        return `height: ${height}px;`;
    }


    get returntrue() {
        return true;
    }

    connectedCallback() {
        this.loaddata();
        this.getdepartmentvalues();
    }

    get bsdisabled() {
        return this.newopckvalue.department_id == undefined;
    }

    loaddata() {
        this.showSpinner = true;
        this.showTable = false;
        getAllOperationCheck()
            .then((data) => {
                console.log(data);
                this.opchklist = data;
                this.showTable = true;
                this.showSpinner = false;
                this.error = undefined;

            })
            .catch((error) => {
                this.error = error;
                const alertmessage = new ShowToastEvent({
                    title: "OP-CK Data fetch failed.",
                    message: "Something unexpected occured. Please contact your Administrator",
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            });
    }

    //Capture the event fired from the paginator component
    handlePaginatorChange(event) {
        this.recordsToDisplay = event.detail;
        if (this.recordsToDisplay[0] != undefined) {
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
        }
    }

    // Used to sort the columns
    sortBy(field, reverse, primer) {
        const key = primer ?
            function (x) {
                return primer(x[field]);
            } :
            function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const {
            fieldName: sortedBy,
            sortDirection
        } = event.detail;
        const cloneData = [...this.recordsToDisplay];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.recordsToDisplay = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    // Row Action event to show the details of the record

    // @track deptchangebsupdate;
    @track busmodeValue;
    handleRowAction(event) { 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.record = row ;
        if (actionName == 'Update') {
            var deprtmentId = this.getdepartmentId(this.record.Department_ID__c);            
            if (deprtmentId != undefined) {
                this.record.Department_ID_value = deprtmentId;
                this.loadbuildstationmappingdata(deprtmentId);
                this.bShowModal = true; // display modal window
            }
            else {
                const alertmessage = new ShowToastEvent({
                    title: "Can\'t update record.",
                    message: "The record is not in correct format.",
                    variant: "warning"
                });
                this.dispatchEvent(alertmessage);
            }
        } 
    }

    getdepartmentId(department_name) {
        var department_id;
        for (var item in this.departmentlistoptions) {
            if (this.departmentlistoptions[item].label == department_name) {
                department_id = this.departmentlistoptions[item].value;
            }
        }
        return department_id;
    }

    getdepartmentName(department_id) {
        var department_name;
        for (var item in this.departmentlistoptions) {
            if (this.departmentlistoptions[item].value == department_id) {
                department_name = this.departmentlistoptions[item].label;
            }
        }
        return department_name;
    }

    // to close modal window set 'bShowModal' tarck value as false
    closeModal() {
        this.bShowModal = false;
    }

    closeAddModal(){
        this.addnewmodal=false;
            
        // this.descreption=undefined;
        // this.buildstation=undefined;
        // this.department =undefined;
        // this.sequence = undefined;
		// this.isactive = false;
        // this.bm=undefined;
        // this.transmission=undefined;
        // this.isvaluerequired = undefined ;
        // this.valuedescreption = undefined
    }

    @track newopckvalue;
    addnewopckmodal(event) {
        var newopck = {
            "department_id": undefined,
            "buildstation_id": undefined,
            "busmodule_id": undefined,
            "transmission_id": undefined,
            "description": undefined,
            "is_value_required": false,
            "value_description": undefined,
            "sequence_no": undefined,
            "is_active": false
        }
        this.newopckvalue = newopck;
        this.buildstationlist = [];
        this.addnewmodal = true;
    }

    //UPDATE ACTION :  To Update the Changes made 
    @track deptupdated;
    updateopcktoserver() {
        const allValid = [...this.template.querySelectorAll('.updatevalidation')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        // if(this.record.Id != undefined && this.record["Department_ID__c"]!= undefined && this.record["Build_Station_ID__c"]!=undefined 
        // && this.record["Operation_Description__c"]!= undefined && this.record["Operation_Sequence_Number__c"]!=undefined && this.record["isActive__c"]!=undefined){
        if (allValid) {
            // for (var i in this.departmentlistoptions) {
            //     if (this.departmentlistoptions[i].value == this.dept) {
            //         this.deptupdated = this.departmentlistoptions[i].label;
            //     }
            // }
            const fields = {};
            fields[RECORD_ID.fieldApiName] = this.record.Id;
            fields[DEPARTMENT_ID.fieldApiName] = this.getdepartmentName(this.record.Department_ID_value);
            fields[BUILDSTATION_ID.fieldApiName] = this.record.Build_Station_ID__c;
            fields[DESCREPTION.fieldApiName] = this.record.Operation_Description__c;
            fields[SEQUENCE_NO.fieldApiName] = this.record.Operation_Sequence_Number__c;
            fields[IS_ACTIVE.fieldApiName] = this.record.isActive__c;
            fields[BUSMODE_FIELD.fieldApiName] = this.record.Bus_Mode__c == 'None' ? undefined : this.record.Bus_Mode__c;
            fields[TRANSMISSION_FIELD.fieldApiName] = this.record.Transmission__c;
            fields[VALUE_REQUIRED_INDICATOR.fieldApiName] = this.record.Value_Required_Indicator__c;
            fields[VALUE_DESCREPTION.fieldApiName] = this.record.Value_Description__c;
            console.log("Value Required? inside UPDATE ", this.record.Value_Required_Indicator__c);
            const recordInput = { fields: fields };
            updateRecord(recordInput).then(record => {
                const alertmessage = new ShowToastEvent({
                    title: "Record Updated",
                    message: "Record Updated Successfully! ",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.loaddata();
                this.bShowModal = false;
            }).catch(error => {
                const alertmessage = new ShowToastEvent({
                    title: "Failed to Update OP-CK",
                    message: "Something unexpected occured. Please contact your Administrator ",
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            });
        } else {
            const alertmessage = new ShowToastEvent({
                title: "Failed to Update OP-CK",
                message: "Please fill in the required values ",
                variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }
    }
    // UPDATE ACTION : To get the Changes in Input on UPDATE Action.
    @track bmNoneUpdate;
    updateopck(event) {
        // var targetName = event.target.name;
        // var targetval = event.target.value;
        // var dept;
        // var bs;
        // var des;
        // var seq;
        // var act;
        // var busmode;
        // var transmissionupdate;
        // var valuerequired;
        // var valuedes;
        // console.log("BM Inside Upadte VALUE CHANGE : ",this.record.Bus_Mode__c);
        // if(targetName=="Department_ID__c"){
        //     this.dept = targetval;
        //     this.selecteddepartment = event.target.value ;
        //     // this.deptchangebsupdate="Select Buildstation";
        //     this.loadbuildstationmappingdata();
        // }else if(targetName=="Build_Station_ID__c"){
        //     this.bs = targetval;
        // }else if(targetName=="Operation_Description__c"){
        //    this.des = targetval;
        // }else if(targetName=="Operation_Sequence_Number__c"){
        //     this.seq= targetval;
        // }else if(targetName=="isActive__c"){
        //    this.act = event.target.checked;
        // }else if(targetName=="Bus_Mode__c"){   
        //     if(event.target.value=="None"){
        //         this.busmode = '';
        //     }else{
        //         this.busmode = targetval; 
        //     }
        // }else if(targetName=="Transmission__c"){
        //     this.transmissionupdate = targetval;
        // }else if(targetName=="Value_Required_Indicator__c"){
        //     this.valuerequired = event.target.checked;
        //     console.log("Value Required?",this.valuerequired);
        // }else if(targetName=="Value_Description__c"){
        //     this.valuedes = targetval;
        // }
        var name = event.target.name;
        var value;
        if (event.target.type == 'checkbox' || event.target.type == 'toggle') {
            value = event.target.checked;
        } else {
            value = event.detail.value;
        }
        this.record[name] = value;
        if (name == 'Department_ID_value') {
            this.record.Build_Station_ID__c = undefined
            this.loadbuildstationmappingdata(value);
        }
    }

    //"Add New OP-CK":Add new OP-CK details
    // @track bm=undefined;//for bus mode
    // @track transmission=undefined;
    // @track isvaluerequired = false;
    // @track valuedescreption=undefined;

    get isvaluedescrequired() {
        return this.newopckvalue.is_value_required;
    }

    updatenewopck(event) {
        // if(event.target.name=="opck_descreption"){
        //     this.descreption = event.target.value ;
        // }else if(event.target.name=="opck_buildstationid"){
        //     this.buildstation = event.target.value ;
        // }else if(event.target.name=="opck_department"){
        //     this.department = event.target.value ;
        //     this.selecteddepartment = event.target.value ;
        //     this.loadbuildstationmappingdata(); // For loading BS for the Selected Department
        //     console.log(this.picklistValues);
        // }else if(event.target.name=="opck_sequenceno"){
        // 	this.sequence = event.target.value;
        // }else if(event.target.name=="opck_isactive"){
        // 	this.isactive = event.target.checked;
        // }else if(event.target.name== "opck_busmode"){
        //    if(event.target.value=="None"){
        //         this.bm = '';
        //     }else{
        //         this.bm = event.target.value ;
        //     }
        // }else if(event.target.name == "opck_transmission"){
        //     this.transmission = event.target.value ;
        //     console.log("Transmission Inside ONCHANGE in ADD NEW OP-CK :",this.transmission);
        // }else if(event.target.name =="opck_isvaluerequired"){
        //     this.isvaluerequired = event.target.checked;
        // }else if(event.target.name =="opck_valuedescreption"){
        //     this.valuedescreption = event.target.value;
        // }
        var name = event.target.name;
        var value;
        if (event.target.type == 'checkbox' || event.target.type == 'toggle') {
            value = event.target.checked;
        } else {
            value = event.detail.value;
        }
        this.newopckvalue[name] = value;
        if (name == 'department_id') {
            this.newopckvalue.buildstation_id = undefined
            this.loadbuildstationmappingdata(value);
        }
    }
    //"Add New OP-CK": To Update to Server on SAVE 
    @track departmentlabel;
    addnewopck(){
        var recordid;
        const allValid = [...this.template.querySelectorAll('.newopckvalidation')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        // if(this.department != undefined && this.buildstation != undefined && this.descreption != undefined && 
        //     this.sequence!=undefined && this.bm!=undefined && this.transmission!=undefined){
        if (allValid) {
            // for(var i in this.departmentlistoptions){
            //     if(this.departmentlistoptions[i].value==this.department){
            //         this.departmentlabel = this.departmentlistoptions[i].label;
            //     }
            // }
            // for (var i in this.departmentlistoptions) {
            //     if (this.departmentlistoptions[i].value == this.newopckvalue.department_id) {
            //         //this.departmentlabel = this.departmentlistoptions[i].label;
            //         this.newopckvalue['department_label'] = this.departmentlistoptions[i].label;
            //     }
            // }
            const fields = {
                'Department_ID__c': this.getdepartmentName(this.newopckvalue.department_id),
                'Build_Station_ID__c': this.newopckvalue.buildstation_id,
                'Operation_Description__c': this.newopckvalue.description,
                'Operation_Sequence_Number__c': this.newopckvalue.sequence_no,
                'isActive__c': this.newopckvalue.is_active,
                'Bus_Mode__c': this.newopckvalue.busmodule_id == 'None' ? undefined : this.newopckvalue.busmodule_id,
                'Transmission__c': this.newopckvalue.transmission_id,
                'Value_Required_Indicator__c': this.newopckvalue.is_value_required,
                'Value_Description__c': this.newopckvalue.value_description
            };

            console.log("Transmission Inside Save :", this.newopckvalue.transmission_id);
            const recordInput = { apiName: 'Operation_Check_Master_Data__c', fields };
            createRecord(recordInput).then(response => {
                recordid = response.id;

                const alertmessage = new ShowToastEvent({
                    title: "New OP-CK created successfully!",
                    message: `OP-CK has been created with Record Id :${recordid} `,
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);

                this.addnewmodal = false;
                if (recordid) {
                    // this.descreption=undefined;
                    //  this.buildstation=undefined;
                    //  this.department =undefined;
                    //  this.sequence = undefined;
                    //  this.isactive=false;
                    //  this.bm=undefined;
                    //  this.transmission=undefined;
                    //  this.isvaluerequired=false;
                    //  this.valuedescreption=undefined;
                    this.loaddata();
                }

            }).catch(error => {
                console.log("Inside Catch : ", error.body.message);
                const alertmessage = new ShowToastEvent({
                    title: "Failed to create new OP-CK",
                    message: "Something unexpected occured. Please contact your Administrator ",
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            })
        } else {
            const alertmessage = new ShowToastEvent({
                title: "Record cannot be created !",
                message: "Please fill the required values",
                variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }
    }

    //To get Department data to provide the Department options(in UPDATE and Add New OP-CK)
    @track departmentlistoptions;
	
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
           this.departmentlistoptions = departmentlistvaluesassembly ;
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

    //To get BS data for the selected department (in UPDATE and Add New OP-CK)
    @track selecteddepartment;
    @track buildstationlist=[];
    loadbuildstationmappingdata(selecteddeptid){
    this.showSpinner = true;
    //var selecteddeptid = this.selecteddepartment;
    //var selecteddeptid = this.newopckvalue.department_id;
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
          var buildstationdata = JSON.parse(result.responsebody).data.buildstations; 
            console.log("buildstationdata :",buildstationdata);
            var bsidlist = [];
          for(var i in buildstationdata){
              var bsid = {'value':buildstationdata[i].buildstation_code.toString(),
              'label':buildstationdata[i].buildstation_code.toString()} ;
              bsidlist.push(bsid);
          }
              this.buildstationlist = bsidlist;
              this.showSpinner = false;
       }           
   })
 .catch((error) => {
   const alertmessage = new ShowToastEvent({
     title: "Failed to get Build Station data.",
     message:"Something unexpected occured. Please contact your Administrator",
     variant: "error"
   });
   this.dispatchEvent(alertmessage);
   this.showSpinner = false;
 });
 
}

// Fetching Transmission picklist
@wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: TRANSMISSION_FIELD
})
trasmissionlistValues;

// Fetching Busmode picklist
@track bmpicklistvalue=[];
@track hasData=false;
//@track bmoriginaloptions=[];
//@track optionNone={'value':'None','label':'None'};
@wire(getPicklistValues, {
    recordTypeId: '012000000000000AAA',
    fieldApiName: BUSMODE_FIELD
})
picklistValues({data,error}){
    if (data) {
        var bs = { label: "None", value: "None"};
        this.bmpicklistvalue = JSON.parse(JSON.stringify(data.values));
        this.hasData=true;
        this.bmpicklistvalue.push(bs);
        console.log(this.bmpicklistvalue)
    } else if (error) {
        console.log(error);
        console.log('busmodelist error' + JSON.parse(this.bmpicklistvalue));
        }
    }
}