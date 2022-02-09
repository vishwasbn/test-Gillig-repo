import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getDepartmentOperations from "@salesforce/apex/ecardOperationsController.getDepartmentOperations";
import getcrewingsuserslist from "@salesforce/apex/CrewingScheduleController.getcrewingsuserslist";
import {modifieduserlist, getmoddeddate, getselectedformandetails}  from 'c/userPermissionsComponent';
import getBusPartdetails from "@salesforce/apex/ecardOperationsController.getBusPartdetails";
import deleteTempAttachment from "@salesforce/apex/ecardOperationsController.deleteTempAttachment";
import raisenewShortage from "@salesforce/apex/ecardOperationsController.raisenewShortage";
import pubsub from 'c/pubsub' ;

export default class NewShortageComponent extends LightningElement {
    @api buttonlabel;
    @api modalheading;
    @api ecardid;
    @api busname;
    @api buschasisnumber;
    @api departmentid;
    @api buildstationrequired;
    @api departmentIdMap;
    @api department;
    @api buildstationid;
    @api permissionset;
    @api partnumber;
    @api bstationcode;
    @api partname;
    @api partid;
    @api bstationid;

    @track partshortageaddmodal=false;
    @track modifiedshortageslist = [];
    @track partnumberlist;
    @track partnumberdetails;
    @track newpartshortage;
    /*@track newpartshortage={
        'buspart_id' : undefined,
        'buspart_no' : undefined,
        'buspart_name' : undefined,
        'quantity' : undefined,
        'po_no' : undefined,
        'cut_off_date' : undefined,
        'selectedbus' : undefined,
        'discrepancy_type': 'partshortage',
        'department_id' : this.departmentid != undefined ? this.departmentid.toString() : this.departmentid,
        'ecard_id' : this.ecardid,
        'priority' : 'Normal',
        'buildstation_id' : this.buildstationid, 
        'buschasisnumber' : this.buschasisnumber,
        'date' : undefined,
        'qclist' : [],
        'allQClist' : [],
        'prodlist' : [],
        'allPRODlist' : []
    };*/
    @track deptsupervisorforselecteddept;
    @track buildstationoptions; 
    @track thisdepartmentbuildstations = [];
    @track priorityoptions = [{"label":"High", "value":"High"}, {"label":"Normal", "value":"Normal"}, {"label":"Low", "value":"Low"}] ;
    // Use whenever a false attribute is required in Component.html
    get returnfalse(){
        return false;
    }

    // Use whenever a true attribute is required in Component.html
    get returntrue(){
      return true;
    }   

    get enableeditonpartname(){
        return this.newpartshortage.buspart_no != 'Part No. Not Found';
    }

    get buildstationselectedpart(){
        if(this.newpartshortage.buildstation_id != undefined){
            return true;
        }
        else{
            return false;
        }
    }
    // To show Report shortage addition Modal
    async showReportShortageAdd(event) {
        var selectedbus = `${this.busname}, ${this.buschasisnumber}`;
        var ecardid = this.ecardid;
        var options = [];
        for (var i in this.departmentIdMap) {
            if (this.departmentIdMap[i].value != 'None' && this.departmentIdMap[i].label != 'ALL DEPARTMENTS') {
                options.push(this.departmentIdMap[i]);
            }
        }
        this.departmentoptions = options;
        this.departmentName = this.department;
        if (this.departmentName == 'ALL DEPARTMENTS') {
            this.departmentid = this.departmentoptions[0].value;
        }
        else {
            this.departmentid = this.departmentid;
        }
        var departmentId = this.departmentid;
        var ecardiddeptid = { ecard_id: ecardid, dept_id: departmentId };
        var allPRODlist = [];
        var allQClist = [];
        var PRODlist = [];
        var QClist = [];
        var emptylist = [];
        var bs = { label: "Unknown", value: "Unknown", workcentreId: 0, workcentreName: "0000" }
        await getDepartmentOperations({ ecardiddeptid: JSON.stringify(ecardiddeptid) })
            .then(data => {
                var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
                this.deptsupervisorforselecteddept = prod_supervisor;
                this.buildstationoptions = data.buildstationList;
                this.buildstationoptions.push(bs);
                this.thisdepartmentbuildstations = this.getcompleteBuilstationlist(data);
                /*var selectedbuildstation = this.thisdepartmentbuildstations[0];
                // Set Prod and QC also

                if (selectedbuildstation.QClist != null && selectedbuildstation.QClist.length != 0) {
                    allQClist = selectedbuildstation.QClist;
                }
                if (selectedbuildstation.PRODlist != null && selectedbuildstation.PRODlist.length != 0) {
                    allPRODlist = selectedbuildstation.PRODlist;
                }
                QClist = selectedbuildstation.selectedqc;*/
                PRODlist = this.deptsupervisorforselecteddept;
                var todaydate = new Date();
                //this.moddifydefectpickvalues(departmentId);   
                var partno = undefined;
                var buildstation = undefined;
                var buildstationid = undefined;
                var partname = undefined;
                var partid = null;
                partno = this.partnumber;
                buildstation = this.bstationcode;
                buildstationid = this.bstationid != undefined ? this.bstationid.toString() : this.bstationid;
                partname = this.partname;
                partid = this.partid;
                //Start - prod listing for BS
                var buildstationdetails = this.thisdepartmentbuildstations;
                var selectedbsstation;
                if (buildstationid != undefined) {
                    for (var item in buildstationdetails) {
                        if (buildstationid.toString() == buildstationdetails[item].buildstation_id.toString()) {
                            selectedbsstation = buildstationdetails[item];
                        }
                    }
                }
                if (buildstationid != undefined && selectedbsstation.PRODlist != null) {//&& selectedbsstation.PRODlist.length != 0
                    PRODlist = selectedbsstation.PRODlist;
                }
                //End - prod listing for BS
                var newpartshortage = {
                    'buspart_id': partid,
                    'buspart_no': partno,
                    'buspart_name': partname,
                    'quantity': undefined,
                    'po_no': undefined,
                    'cut_off_date': undefined,
                    'selectedbus': selectedbus,
                    'discrepancy_type': 'partshortage',
                    'department_id': departmentId.toString(),
                    'ecard_id': ecardid,
                    'priority': 'Normal',
                    'buildstation_id': buildstationid,
                    'buschasisnumber': this.buschasisnumber,
                    'date': getmoddeddate(todaydate),
                    'qclist': [],
                    'allQClist': allQClist,
                    'prodlist': [],
                    'allPRODlist': PRODlist
                };
                this.newpartshortage = newpartshortage;
            }).catch(error => {
                this.error = error;
                this.showmessage('Data fetch failed.', 'Something unexpected occured. Please contact your Administrator.', 'error');
            });
        if (this.newpartshortage.allPRODlist.length == 0) {
            var userdetails = [];
            await getcrewingsuserslist({ deptid: this.departmentid })
                .then((result) => {
                    userdetails = JSON.parse(result.responsebody).data.user;
                    this.newpartshortage.allPRODlist = userdetails.length > 0 ? modifieduserlist(userdetails) : userdetails;
                })
                .catch((error) => {
                });
        }

        this.partshortageaddmodal = true;

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
                    var modifiedvalidationlist = this.getmodifiedvalidationlist(buildstation);
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

    // Generic function to Show alert toasts.
    showmessage(title, message, variant){
        const alertmessage = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });
        this.dispatchEvent(alertmessage);
    }

    getmodifiedvalidationlist(buidstationdata){
        var validationsitems = { 
        has_validation_pic: buidstationdata.has_validation_pic != undefined ?  buidstationdata.has_validation_pic : false,
        has_bm35: buidstationdata.has_bm35 != undefined ?  buidstationdata.has_bm35 : false,
        has_op_check: buidstationdata.has_op_check != undefined ?  buidstationdata.has_op_check : false,
        has_operation_check: buidstationdata.has_operation_check != undefined ?  buidstationdata.has_operation_check : false,
        has_pco: buidstationdata.has_pco != undefined ?  buidstationdata.has_pco : false,
        hasdiscrepancy: false, // Passing false because the view has changed = new column introduced
        has8410: true,  // Passing true value to show Build Station Code.
        validation_image_uri : buidstationdata.validation_image_uri,
        picture_validation_id : buidstationdata.picture_validation_id,
        validation_pic_required : buidstationdata.validation_pic_required != undefined ?  buidstationdata.validation_pic_required : true
       };
        return validationsitems;
    }

    // When clearing a selected partnumber.
    onpartnumberclear(event) {
        this.newpartshortage.buspart_no = undefined;
        this.newpartshortage.buspart_name = undefined;
        if (this.partnumberlist == undefined && (event != undefined && event.target.dataset.id == 'partmnumbersearch')) {
            this.getbuspartdetails(this.ecardid, this.newpartshortage.buildstation_id);
        }
    }
    
     //To update other fields on user selection
    async updatenewpartshortage(event){
        var targetvalue = event.target.value;
        var targetname = event.target.name;
        this.newpartshortage[targetname] = targetvalue;
        if(targetname == 'department_id'){
            var ecardid = this.ecardid;
            var departmentId = targetvalue;
            this.newpartshortage.department_id = departmentId;
            this.newpartshortage.allPRODlist = [];
            var bs = { label: "Unknown", value: "Unknown", workcentreId: 0, workcentreName: "0000" };
            var ecardiddeptid = {ecard_id:ecardid ,dept_id:departmentId};
            await getDepartmentOperations({ecardiddeptid:JSON.stringify(ecardiddeptid)})
            .then(data => {
                var prod_supervisor = modifieduserlist(data.builstationMapWrapper.prod_supervisor);
                this.deptsupervisorforselecteddept = prod_supervisor;
                this.buildstationoptions =  data.buildstationList;
                this.buildstationoptions.push(bs);
                this.thisdepartmentbuildstations = this.getcompleteBuilstationlist(data);
                var selectedbuildstation = this.thisdepartmentbuildstations[0];
                this.newpartshortage.buildstation_id = undefined;
                this.newpartshortage.buspart_name = undefined;
                // Set Prod and QC also
                
                if(selectedbuildstation.QClist!=null && selectedbuildstation.QClist.length != 0){
                    this.newpartshortage.allQClist = selectedbuildstation.QClist;
                }
                if(this.deptsupervisorforselecteddept.length != 0){
                    this.newpartshortage.allPRODlist = this.deptsupervisorforselecteddept;
                }
                this.newpartshortage.qclist = [];
                //this.newpartshortage.prodlist = this.deptsupervisorforselecteddept;
                
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
        if (this.newpartshortage.allPRODlist.length == 0) {
            var userdetails = [];
            await getcrewingsuserslist({ deptid: this.newpartshortage.department_id })
                .then((result) => {
                    userdetails = JSON.parse(result.responsebody).data.user;
                    this.newpartshortage.allPRODlist = userdetails.length > 0 ? modifieduserlist(userdetails) : userdetails;
                })
                .catch((error) => {
                });
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
    
    // To hide Report shortage addition Modal
    hideReportShortageAdd(event){
        this.partshortageaddmodal = false;
        this.deletetempattachments();
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
        }else{
            this.newpartshortage.buspart_no = 'Part No. Not Found';
            this.newpartshortage.buspart_name = undefined;
            this.newpartshortage.buspart_id = null;
            //this.template.querySelector('[data-id="partmnumbersearch"]').connectedCallback();
        }
    }
    @track s3tempurlfornewdiscrepancy = [];
    // Get the temporary urls from the attachmenttempComponent.
    gets3tempurls(event){
        this.s3tempurlfornewdiscrepancy = event.detail.tempurllist;
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
                    pubsub.fire('refreshdata', undefined );
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
                      }
                        
                  }).catch(error => {
                  this.error = error;
                  this.showmessage('Sorry we could not complete the operation.','Something unexpected occured. Please try again or contact your Administrator.','error');
                  });
        
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

}