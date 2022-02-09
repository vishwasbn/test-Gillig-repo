import { LightningElement, track, api } from 'lwc';
import sampleimage from "@salesforce/resourceUrl/PictureValidationSample";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import pubsub from 'c/pubsub' ;

import uploadTargetPicture from "@salesforce/apex/ecardOperationsController.uploadTargetPicture";
import uploadSourcePicture from "@salesforce/apex/ecardOperationsController.uploadSourcePicture";
import deleteTargetPicture from "@salesforce/apex/ecardOperationsController.deleteTargetPicture";
import getTargetImage from "@salesforce/apex/ecardOperationsController.getTargetImage";
import getTargetandActualImage from "@salesforce/apex/ecardOperationsController.getTargetandActualImage";
import getbuildstationopcheckDetails  from "@salesforce/apex/ecardOperationsController.getbuildstationopcheckDetails";
import getbuildstationPartDetails from "@salesforce/apex/ecardOperationsController.getbuildstationPartDetails";
import getbuildstationbm35Details from "@salesforce/apex/ecardOperationsController.getbuildstationbm35Details";
import getbuildstationpcoDetails  from "@salesforce/apex/ecardOperationsController.getbuildstationpcoDetails";
import updateopchecks from "@salesforce/apex/ecardOperationsController.updateopchecks";

export default class ShowValidationiconsComponent extends LightningElement {
    //opckdetails=this.opck.opcklist;
    opckdetails=[];
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    apppermissions;
    clicks=0;
    @track has_op_check;	
    @track has_operation_check;
    @track registerevent=false;

    @api ecardid;
    @api busname;
    @api buschasisnumber;
    @api departmentid;
    @api departmentIdMap;
    @api department;
    @api selecteddepartmentid;

    @api permissionset;
    @api
    get validations() {
        return this.validationslocal;
    }
    set validations(value){
        var validations = JSON.parse(JSON.stringify(value));
        this.validationslocal = validations;
        this.has8410 = this.validationslocal.has8410;
        this.has_bm35 = this.validationslocal.has_bm35;
        this.has_pco = this.validationslocal.has_pco;
        this.has_op_check = this.validationslocal.has_op_check;	
        this.has_operation_check = this.validationslocal.has_operation_check;
        this.hasdiscrepancy = this.validationslocal.hasdiscrepancy;
        this.haspicvalidation = this.validationslocal.validation_pic_required;
        
    }

    @api
    get buildstationdetails() {
        return this.buildstationdetailslocal;
    }
    set buildstationdetails(value){
        var buildstation = JSON.parse(JSON.stringify(value));
        this.buildstationdetailslocal = buildstation;
        this.buildstationdata = this.buildstationdetailslocal;
        this.buildstationcode = this.buildstationdetailslocal.buildstation_code;
        this.buildstationstatus=this.buildstationdetailslocal.status;

    }

    //to show icons respective to list
    @track validationslocal;
    @track buildstationdetailslocal;
    @track buildstationstatus;
    @track has8410;
    @track has_pco;
    @track has_bm35;
    @track hasdiscrepancy;
    @track haspicvalidation;
    @track variabletodebug1;
    @track variabletodebug2;
    @track selectedoperation;

    // For Picture validation
    @track showpicvalmodal;
    
    @track encodedimage;

    @track buildstationid;

    // For BuildStation Validation
    @track showBuildStationmodal;
    @track buildstationcode;

    // For PCO Validation
    @track showPCOmodal;

    // For BM35 Validation
    @track showBM35modal;

    // For OP-CK Validation
    @track showopckmodal

    // For Discrepancy Validation
    @track showdiscrepancymodal;

    @track targetimage = undefined;
    @track currentstep;
    @track uploadedimage;
    @track buildstationdata;
    @track istargetimagepresent = false;
    @track isactualimagepresent = false;
    @track actualimagepresentinserver =false;
    @track loggedinuserqc = true;

    @track showSpinner=false;
    @track applytarget = false;

    @track buildstationpartslist = [];
    @track buildstationbm35details=[];
    @track buildstationpcodetails=[];
    @track currentvalidation;
    

    get isbuildstationpartlistempty(){
        return this.buildstationpartslist.length == 0 ;
    }

    get isbuildstationbm35listempty(){
        return this.buildstationbm35details.length == 0 ;
    }

    get isbuildstationpcolistempty(){
        return this.buildstationpcodetails.length == 0 ;
    }

    get acceptedFormats() {
        return ['.png','.jpg','.jpeg'];
    }

    get stepone(){
        return this.currentstep == 'one';
    }

    get steptwo(){
        return this.currentstep == 'two';
    }

    get picvalidationoptional(){
        if(this.buildstationstatus=='approve' && this.buildstationdata.picture_validation_id == undefined){
            return true;
        }
        if(this.buildstationdata.picture_validation_target_image_id == undefined){
            if(this.buildstationdata.picture_validation_id == undefined){
                return true;
            }
        }
        return false;
    }

    get picvalidationrequired(){
        if(this.buildstationstatus=='approve'){
            return false;
        }
        if(this.buildstationdata.picture_validation_target_image_id != undefined){
            if(this.buildstationdata.picture_validation_id == undefined){
                return true;
            }
            else{
                return false;
            } 
        }
        return false;
    }

    get imageuploaded(){
        if(this.buildstationdata.picture_validation_id != undefined){
                return true;
        }
        else{
            return false;
        } 
    }

    get enableuploadbutton(){
        if(this.targetchanged || this.actualchanged){
            return false;
        }
        else{
            return true;
        }
        /*if(this.applytarget){
            return false;
        }
        else if(this.isactualimagepresent){
            return true;
        }
        else{
            //return this.currentstep != 'two';
            return (this.actualchanged || this.targetchanged);
        }*/
    }

    get enabledeletebutton(){
        if(this.isactualimagepresent && this.buildstationdata.status == 'approve'){
            return false;
        }
        else{
            if(this.isactualimagepresent){
                return true;
            }
            else{
                return this.currentstep == 'two';
            }
        }
        
    }
    get istargetdelete(){
        return this.istargetimagepresent && this.permissionset.target_image_delete.write;
    }
    
    /*connectedCallback(){
        
        this.has8410 = this.validationslocal.has8410;
        this.has_bm35 = this.validationslocal.has_bm35;
        this.has_pco = this.validationslocal.has_pco;
        this.hasdiscrepancy = this.validationslocal.hasdiscrepancy;
        this.haspicvalidation = this.validationslocal.validation_pic_required;
        this.buildstationdata = this.buildstationdetailslocal;
        this.buildstationcode = this.buildstationdetailslocal.buildstation_code;
        
    } */

    // Handle Picture Validation.
    handlevalidation(event){
        let clickedAction = event.target.title;
        this.currentvalidation=event.target.title;
        /*if(this.registerevent==false){
            this.register();
            this.registerevent=true;
        }*/
        
        if(clickedAction == 'Picture Validation'){
            this.currentstep = 'one';
            if(this.buildstationdata.ecard_operation_log_id != undefined){
                if(this.buildstationdata.picture_validation_target_image_id != undefined){
                    this.istargetimagepresent = true;
                    this.getactualimagefromserver();
                }
                else{
                    if(this.buildstationdata.picture_validation_id !=undefined){
                        this.istargetimagepresent = false;
                        this.getactualimagefromserver();
                    }
                    else{
                        this.istargetimagepresent = false;
                        //this.getactualimagefromserver();
                        this.showpicvalmodal = true;
                    }
                    
                }
            }
            else{
                if(this.buildstationdata.picture_validation_target_image_id != undefined){
                    this.istargetimagepresent = true;
                     this.gettargetimagefromServer();
                    //this.getactualimagefromserver();
                }
                else{
                    this.istargetimagepresent = false; 
                    this.showpicvalmodal = true;
                }
                
            }
            
            
            
        }
        if(clickedAction == 'BuildStation'){
            this.getbuildstationdetails();
        }
        if(clickedAction == 'PCO'){
            this.getpcodetails();
        }
        if(clickedAction == 'BM35'){
            this.getbm35details();
        }
        if(clickedAction == 'Discrepancy'){
            this.showdiscrepancymodal = true;
        }
        if(clickedAction == 'OP-CK'){
            this.getopcheckdeatils();
        }

    }

    // Hide Picture Validation modal.
    cancelpicturevalidation(event){
        if(this.actualchanged){
            this.isactualimagepresent=false;
            this.actualchanged=false;
        }
        if(this.targetchanged){
            this.targetchanged=false;
            this.istargetimagepresent=false;
        }
        this.showpicvalmodal = false;
    }

    // To get the target image from Server for Picture validation.
    gettargetimagefromServer(event){
        // to get target image from server
        var ecardbuildstationId = {
            ecard_id :  this.buildstationdata.ecard_id,
            buildstation_id : this.buildstationdata.buildstation_id
        };
        //var targetimageid = JSON.stringify(ecardbuildstationId);
        
        getTargetImage({ecardbuildstationId:JSON.stringify(ecardbuildstationId)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not fetch the target image.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                    var targetimagedata = JSON.parse(data.responsebody).data;
                    this.targetimage =  targetimagedata.target_picture_validation.target_image_uri;
                    this.uploadedtargetimage =  targetimagedata.target_picture_validation.target_image_uri;
                    console.log('target image url'+this.targetimage);
                    this.showSpinner = false;
                    this.showpicvalmodal = true;
                    
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              });
             
    }

    // To get the target/actual image from server for Picture validation.
    getactualimagefromserver(event){
        var operationlogid = this.buildstationdata.ecard_operation_log_id;
        getTargetandActualImage({operationlogid:operationlogid})
              .then(data => {
                  debugger
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not fetch the target image.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                    var imagedata = JSON.parse(data.responsebody).data;
                    if(imagedata.target_picture_validation == null){ //&& imagedata == undefined
                        this.gettargetimagefromServer();
                    }
                    else{
                        if(imagedata.target_picture_validation.validation_image_uri == null){
                            this.istargetimagepresent = false;
                        }
                        else{
                            this.targetimage =  imagedata.target_picture_validation.validation_image_uri;
                            //this.uploaded=imagedata.target_picture_validation.validation_image_uri;
                            this.uploadedtargetimage=imagedata.target_picture_validation.validation_image_uri;
                        }
                        if(imagedata.target_picture_validation.source_image_uri != undefined){
                            this.currentstep = 'two';
                            //this.enableuploadbutton = false;
                            this.uploadedimage = imagedata.target_picture_validation.source_image_uri; 
                            console.log('actual image url'+this.uploadedimage);
                            this.isactualimagepresent = true;
                            this.actualimagepresentinserver=true;
                            this.showpicvalmodal = true;
                        }
                        else{
                            this.showpicvalmodal = true;
                        }
                        this.showSpinner = false;
                    }
                    
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              });
    }

    actualchanged=false;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    targetchanged=false;
    targetfileName;
    targetfilesUploaded =[];
    targetfile;
    targetfileReader;
    targetfileContents;
    uploadedtargetimage;
    targetcontent;

    // getting file from the local machine into the file loader. 
    handletargetchange(event){
        this.targetfilesUploaded = event.target.files;
        this.targetfileName = event.target.files[0].name;
        this.targetfile = this.targetfilesUploaded[0];
        this.targetfileReader= new FileReader();
        this.targetfileReader.onloadend = (() => {
            this.targetfileContents = this.targetfileReader.result;
            this.uploadedtargetimage = this.targetfileReader.result;
            let base64 = 'base64,';
            this.targetcontent = this.targetfileContents.indexOf(base64) + base64.length;
            this.targetfileContents = this.targetfileContents.substring(this.targetcontent);
            this.istargetimagepresent=true;
        });
        this.targetfileReader.readAsDataURL(this.targetfile);
        this.targetchanged = true;
        this.applytarget =true;
    }
    handleFilesChange(event) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
            this.file = this.filesUploaded[0];
            // create a FileReader object 
            this.fileReader= new FileReader();
            // set onload function of FileReader object  
            this.fileReader.onloadend = (() => {
                this.fileContents = this.fileReader.result;
                this.uploadedimage = this.fileReader.result;
                let base64 = 'base64,';
                this.content = this.fileContents.indexOf(base64) + base64.length;
                this.fileContents = this.fileContents.substring(this.content);
                this.isactualimagepresent=true;
               // 
            }); 
            this.fileReader.readAsDataURL(this.file);
            this.actualchanged=true;
            //this.currentstep = 'two';
            //this.enableuploadbutton = false;
    }

    // To move back to step one which is the intial view where we upload actual image.
    goback(event){
        this.isactualimagepresent = false;
        this.actualchanged=false;
        if(this.actualimagepresentinserver){
            const alertmessage = new ShowToastEvent({
            title : 'Actual image can only be replced.',
            message : 'Actual image can only be replced, Please select a replacement image',
            variant : 'warning'
            });
            this.dispatchEvent(alertmessage);
        }
        this.currentstep = 'one';
    }

    // Upload image to server and apply to fleet.
    uploadImage(event){
        if(this.actualchanged){
                this.uploadactualpicturetoserver();
        }
        if(this.targetchanged){
            this.uploadtargetpicturetoserver();
        }
        /*        
        if(this.applytarget){
            this.fileContents = this.template.querySelector('.imagepreview').src;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            this.uploadtargetpicturetoserver();
        }*/
       
    }

    // Upload actual image to server.
    uploadactualpicturetoserver(event){
        var actualpicturerequest = {
            "picture_validation_target_image_id" : this.buildstationdata.picture_validation_target_image_id,
            "department_id" : this.buildstationdata.department_id,
            "buildstation_id" : this.buildstationdata.buildstation_id,
            "ecard_id" : this.buildstationdata.ecard_id,
            "validation_image_encoded_string" : this.fileContents
        };
        //alert(JSON.stringify(actualpicturerequest));
        this.showSpinner = true;
        uploadSourcePicture({requestbody:JSON.stringify(actualpicturerequest)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                      const alertmessage = new ShowToastEvent({
                          title : 'Upload Succcessfull',
                          message : 'Image uploaded successfully.',
                         variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.refreshtheoperationlist();
                    this.showpicvalmodal = false; 
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              });
    }

    // Applying to fleet.
    uploadtargetpicturetoserver(event){
        var targetpicturerequest = {
            "buildstation_id" : this.buildstationdata.buildstation_id,
            "source_ecard_id" : this.buildstationdata.ecard_id,
            "validation_image_encoded_string" : this.targetfileContents
        };
        this.showSpinner = true;
        uploadTargetPicture({requestbody:JSON.stringify(targetpicturerequest)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                      const alertmessage = new ShowToastEvent({
                          title : 'Upload Succcessfull',
                          message : 'Image applied to fleet successfully.',
                         variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.refreshtheoperationlist();
                    this.showpicvalmodal = false; 
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              });
    }

    // To check the option of apply to fleet applied or not.
    applytocompletefleet(event){
        this.applytarget = event.target.checked;
        //alert();
    }

    // To refresh the operation list of Parent component.
    refreshtheoperationlist(event){
        const modifyevent = new CustomEvent(
            "updateoperationlist",
            {
                detail : {value : 'Refresh the component'} 
                
            }
        );
        this.dispatchEvent(modifyevent);
    }

    @track showSpinnerforbuildstation = false;
    // To get the buildstation list of the selected operation.
    getbuildstationdetails(event){
         // to get part details from server
         this.showSpinnerforbuildstation = true;
         var ecardbuildstationId = {
            ecard_id :  this.buildstationdata.ecard_id,
            build_station_id : this.buildstationdata.buildstation_id
        };
        getbuildstationPartDetails({ecardbuildstationId:JSON.stringify(ecardbuildstationId)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not fetch Parts details.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    
                  }
                  else{
                    var buildstationpartsdata = JSON.parse(data.responsebody).data.bus_part_detail;
                    this.buildstationpartslist = this.getmodifiedlist(buildstationpartsdata);
                    this.showSpinnerforbuildstation = false;
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

        this.showBuildStationmodal = true;
    }
    // To get the buildstation BM35 detail list of the selected operation.
    getbm35details(event){
        // to get BM35 details from server
        this.showSpinner = true;
        var ecardbuildstationId = {
           ecard_id :  this.buildstationdata.ecard_id,
           build_station_id : this.buildstationdata.buildstation_id
       };
       getbuildstationbm35Details({ecardbuildstationId:JSON.stringify(ecardbuildstationId)})
             .then(data => {
                 if(data.isError){
                     const alertmessage = new ShowToastEvent({
                         title : 'Sorry we could not fetch BM35 details.',
                         message : 'Something unexpected occured. Please contact your Administrator',
                        variant : 'error'
                   });
                   this.dispatchEvent(alertmessage);
                   
                 }
                 else{
                   var bm35data = JSON.parse(data.responsebody).data.buildstations_mapping_adon;
                   this.buildstationbm35details = this.getmodifiedlist(bm35data);
                   this.showSpinner = false;
                 }
                   
             }).catch(error => {
             this.error = error;
              const alertmessage = new ShowToastEvent({
                   title : 'Sorry we could not fetch BM35 details.',
                   message : 'Something unexpected occured. Please contact your Administrator',
                  variant : 'error'
             });
             this.dispatchEvent(alertmessage);
            
             });
       this.showBM35modal = true;
   }

   // To get the buildstation PCO detail list of the selected operation.
   getpcodetails(event){
        // to get PCO details from server
        this.showSpinner = true;
        var ecardbuildstationId = {
        ecard_id :  this.buildstationdata.ecard_id,
        build_station_id : this.buildstationdata.buildstation_id
        };
        getbuildstationpcoDetails({ecardbuildstationId:JSON.stringify(ecardbuildstationId)})
                .then(data => {
                    if(data.isError){
                        const alertmessage = new ShowToastEvent({
                            title : 'Sorry we could not fetch PCO details.',
                            message : 'Something unexpected occured. Please contact your Administrator',
                            variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    
                    }
                    else{
                    var pcodata = JSON.parse(data.responsebody).data.buildstations_mapping_adon;
                    this.buildstationpcodetails = this.getmodifiedlist(pcodata);
                    this.showSpinner = false;
                    }
                    
                }).catch(error => {
                this.error = error;
                const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not fetch PCO details.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                    variant : 'error'
                });
                this.dispatchEvent(alertmessage);
                
                });
        this.showPCOmodal = true;
    }

    cancelbuildstationmodal(event){
        this.showBuildStationmodal = false;
    }

    cancelPCOmodal(event){
        this.showPCOmodal = false;
    }

    cancelBM35modal(event){
        this.showBM35modal = false;
    }

    cancelopckmodal(event){
        this.showopckmodal = false;
    }

    canceldiscrepancymodal(event){
        this.showdiscrepancymodal = false;
    }
    
    rotate(){
        this.clicks=this.clicks+1;
        switch(this.clicks%4){
            case 1:
                this.template.querySelector('.targetImage').classList.add('rotate90');
                this.template.querySelector('.targetImage').classList.remove('rotate180');  
                this.template.querySelector('.targetImage').classList.remove('rotate270'); 
                break;
            case 2:
                this.template.querySelector('.targetImage').classList.remove('rotate90');
                this.template.querySelector('.targetImage').classList.add('rotate180');  
                this.template.querySelector('.targetImage').classList.remove('rotate270'); 
                break;
            case 2:
                this.template.querySelector('.targetImage').classList.remove('rotate90');
                this.template.querySelector('.targetImage').classList.remove('rotate180');  
                this.template.querySelector('.targetImage').classList.add('rotate270'); 
                break;    
            default:
                this.template.querySelector('.targetImage').classList.remove('rotate90');
                this.template.querySelector('.targetImage').classList.remove('rotate180');  
                this.template.querySelector('.targetImage').classList.remove('rotate270'); 
                break;
        }
    }

    getopcheckdeatils(event){	
        // to get Operations Check details from server	
        this.showSpinner = true;	
        var ecardbuildstationId = {	
            ecard_id :  this.buildstationdata.ecard_id,	
            build_station_id : this.buildstationdata.buildstation_id	
        };	
        getbuildstationopcheckDetails({ecardbuildstationId:JSON.stringify(ecardbuildstationId)})	
                .then(data => {	
                    if(data.isError){	
                        const alertmessage = new ShowToastEvent({	
                            title : 'Sorry we could not fetch Operations Check details.',	
                            message : 'Something unexpected occured. Please contact your Administrator',	
                            variant : 'error'	
                    });	
                    this.dispatchEvent(alertmessage);	
                    	
                    }	
                    else {
                        debugger;
                        var opcheckdata = JSON.parse(data.responsebody).data.op_check;	
                        this.opckdetails=opcheckdata;
                        this.showSpinner = false;
                    } 	
                    	
                }).catch(error => {	
                this.error = error;	
                const alertmessage = new ShowToastEvent({	
                    title : 'Sorry we could not fetch Operations Check details.',	
                    message : 'Something unexpected occured. Please contact your Administrator',	
                    variant : 'error'	
                });	
                this.dispatchEvent(alertmessage);	
                	
                });	
                this.showSpinner = false;	
                this.showopckmodal = true;	
        }	
    @track selectedopchek=[];
    @track selectedopcheckid;
    existingrowstatuschange(event){
        this.selectedopcheckid = event.detail.uniqueid;
        for(var i in this.opckdetails){
            if(this.opckdetails[i].operation_check_id==this.selectedopcheckid){
                this.selectedopchek=this.opckdetails[i];
                this.selectedopchek.op_check_status=event.detail.status;
            }
        }
        if(this.selectedopchek.value_required && 
           (this.selectedopchek.op_check_value==null || this.selectedopchek.op_check_value=="") &&
           this.selectedopchek.op_check_status){
            const alertmessage = new ShowToastEvent({
            title : 'Value Required.',
            message : 'Value required to update status, Please enter a value',
            variant : 'warning'
            });
            this.dispatchEvent(alertmessage);
            this.getopcheckdeatils();
    
        }else{
            this.uploadopchecktoserver(this.selectedopchek);
            //this.getopcheckdeatils();
        }
    }

    uploadopchecktoserver(opck){
        var opcheckrecord = {
			"ecard_id":this.buildstationdata.ecard_id,
			"buildstation_id": this.buildstationdata.buildstation_id,
			"operation_check_id": opck.operation_check_id,
			"op_check_value": opck.op_check_value,
            "op_check_status": opck.op_check_status
        };
        //alert(JSON.stringify(opcheckrecord));
        this.showSpinner = true;
        updateopchecks({requestbody:JSON.stringify(opcheckrecord)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                      const alertmessage = new ShowToastEvent({
                          title : 'Upload Succcessfull',
                          message : 'Operation Check uploaded successfully.',
                         variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.refreshtheoperationlist();
                    this.showpicvalmodal = false; 
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              this.showSpinner = false;
              });
    }
    updateopckitem(event){
        this.selectedopcheckid=event.target.title;
        for(var i in this.opckdetails){
            if(this.opckdetails[i].operation_check_id==this.selectedopcheckid){
                this.selectedopchek=this.opckdetails[i];
                this.selectedopchek.op_check_value=event.target.value;
                break;
            }
        }
        this.uploadopchecktoserver(this.selectedopchek);  
    }
    /*createshortage(event){
        let partno=event.target.dataset.id;
        let bscode=event.target.name;
        let partname=event.target.value;
        let partid=event.target.title;
        let message = {
            "partno" : partno,
            "buildstation" : bscode,
            "buildstation_id" : this.buildstationdata.buildstation_id,
            "partname": partname,
            "part_id" : partid
          };
        const addshortage = new CustomEvent(
            "addshortage",
            {
                detail : {message: message} 
            }
        );
        this.dispatchEvent(addshortage);
        //pubsub.fire('addshortage', JSON.stringify(message) );
    }*/ //Vishwas
    handlemodalaction(messageFromEvt){
        if(messageFromEvt != undefined){
            var message = JSON.parse(messageFromEvt);
            if(message.action=="close modal"){
                switch(this.currentvalidation){
                    case 'BuildStation' :
                        this.showBuildStationmodal=false;
                        break;
                    case 'BM35' :
                        this.showBM35modal=false;
                        break;    
                    case 'PCO' :
                        this.showPCOmodal=false;
                        break;
                }
            }else if(message.action=="show modal"){
                switch(this.currentvalidation){
                    case 'BuildStation' :
                        this.showBuildStationmodal=true;
                        this.showBM35modal=false;
                        this.showPCOmodal=false;
                        break;
                    case 'BM35' :
                        this.showBuildStationmodal=false;
                        this.showBM35modal=true;
                        this.showPCOmodal=false;
                        break;    
                    case 'PCO' :
                        this.showBuildStationmodal=false;
                        this.showBM35modal=false;
                        this.showPCOmodal=true;
                        break;
                }
            }
        }
    }
    /*register(){
        console.log('Modal Action registered ');
        pubsub.register('modalaction', this.handlemodalaction.bind(this));
    }
    unregister(){
        console.log('Modal Action registered ');
        pubsub.unregister('modalaction', 'handlemodalaction');
    }*/
    getmodifiedlist(validationdata){
        var validationitemlist=validationdata;
        var modifiedList = validationitemlist.map(row => ({
            ...row,
            displyitemnumber: 'Test'
          }));
        var displyitemnumber;
        for(var li in modifiedList){
            var vd=modifiedList[li];
            if(vd.lvl==2){
                displyitemnumber=' ->'+ vd.buspart_no;
            }else if(vd.lvl==3){
                displyitemnumber=' -->'+ vd.buspart_no;
            }else{
                displyitemnumber    =vd.buspart_no;
            }
            vd.displyitemnumber=displyitemnumber;
        }
        return modifiedList;
    }
    deletetargetimage(event){
        this.showSpinner = true;
        var requestbody = {
            "fleet_id" : event.target.dataset.name,
            "buildstation_id" : event.target.dataset.id
        };
        deleteTargetPicture({requestbody:JSON.stringify(requestbody)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    
                  }
                  else{
                      const alertmessage = new ShowToastEvent({
                          title : 'Delete Succcessfull',
                          message : 'Target Image deleted successfully from fleet.',
                          variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.refreshtheoperationlist();
                    this.istargetimagepresent=false;
                    this.showSpinner = false;
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              //this.showSpinner = false;
              });
    }

}