import { LightningElement, api, track } from 'lwc';
import uploadNewAttachment from "@salesforce/apex/ecardOperationsController.uploadNewAttachment";
import getSlnoFiles from "@salesforce/apex/ecardOperationsController.getSlnoFiles";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import uploadNewAttachmenttoEcard from "@salesforce/apex/ecardOperationsController.uploadNewAttachmenttoEcard";
import getecardattachments from "@salesforce/apex/ecardOperationsController.getecardattachments";

import uploadAttachmenttoEcardOperationlog from "@salesforce/apex/ecardOperationsController.uploadAttachmenttoEcardOperationlog";
import getecardoperationlogattachments from "@salesforce/apex/ecardOperationsController.getecardoperationlogattachments";

import uploadAttachmenttoDiscrepancylog from "@salesforce/apex/ecardOperationsController.uploadAttachmenttoDiscrepancylog";
import getdiscrepancylogattachments from "@salesforce/apex/ecardOperationsController.getdiscrepancylogattachments";

import deleteEcardOperationattachment from "@salesforce/apex/ecardOperationsController.deleteEcardOperationattachment";
import deleteEcardattachment from "@salesforce/apex/ecardOperationsController.deleteEcardattachment"; 
import deleteSerialnoattachment from "@salesforce/apex/ecardOperationsController.deleteSerialnoattachment"; 
import deleteDiscrepancyattachment from "@salesforce/apex/ecardOperationsController.deleteDiscrepancyattachment"; 

export default class AttachmentsSectionComponent extends LightningElement {

   
    @api ecardid;
    @api buildstationid;
    @api type;
    @api buspartid;
    @api serialnumbertype;
    @api departmentid;
    @api permissionset;

    @api
    get uniqueid() {
        //this.getFilesfromserver();
        return this.uniqueidlocal;
    }
    set uniqueid(value){
        this.uniqueidlocal = value;
        //this.getFilesfromserver();
    }

    get acceptedFormats() {
        return ['.png','.jpg','.jpeg'];
    }
    //enable/disable attachment btn based on role acess
    get disableattachment() {
        return !this.permissionset.ecard_attachments.write;
    }

    @track uniqueidlocal;
    @track attachmentlist = [];
    @track showSpinner=false;

    get attachmentsize(){
        return this.attachmentlist.length;
    }

    connectedCallback(){
        this.getFilesfromserver();
    }

    getFilesfromserver(event){
        this.showSpinner = true;
       if(this.type == 'serialnumber'){
        if(this.uniqueidlocal != undefined){
            var serialnumberlogid = this.uniqueidlocal;
            getSlnoFiles({serialnumberlogid:serialnumberlogid})
            .then(data => {
                if(data.isError){
                    const alertmessage = new ShowToastEvent({
                    title : 'Failed to fetch the Attachments.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                    variant : 'error'
                });
                this.dispatchEvent(alertmessage);
        
             }
            else{
                var attachments = JSON.parse(data.responsebody).data.target_picture_validation;
                var attachmentlist = [];
                for(var i in attachments){
                    var attachmentmodded = {
                        "Id" : attachments[i].serial_number_log_attachment_id,
                        "url" : attachments[i].s3_image_uri,
                        "name" : ''
                    };
                    attachmentlist.push(attachmentmodded);
                    //attachmentlist.push(attachments[i]);
                }
                this.attachmentlist = attachmentlist;
                this.showSpinner = false;
            }
    
            }).catch(error => {
            this.error = error;
            const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch the Attachments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        
        });
        }
        else{
            this.showSpinner = false;
        }
       }
       if(this.type == 'busdetail'){
        var ecardid = this.ecardid;
        getecardattachments({ecardid:ecardid})
        .then(data => {
            if(data.isError){
                const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch the Attachments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
    
         }
        else{
            var attachments = JSON.parse(data.responsebody).data.EcardAttachment;
            var attachmentlist = [];
            for(var i in attachments){
                var attachmentmodded = {
                    "Id" : attachments[i].ecard_attachment_id,
                    "url" : attachments[i].s3_image_uri,
                    "name" : ''
                };
                attachmentlist.push(attachmentmodded);
            }
            this.attachmentlist = attachmentlist; 
            this.showSpinner = false;
        }

        }).catch(error => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
            title : 'Failed to fetch the Attachments.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
    
    });
       }
       if(this.type == 'operationlog'){
        if(this.uniqueidlocal != undefined){
            var operationlogid = this.uniqueidlocal;
            getecardoperationlogattachments({operationlogid:operationlogid})
            .then(data => {
                if(data.isError){
                    const alertmessage = new ShowToastEvent({
                    title : 'Failed to fetch the Attachments.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                    variant : 'error'
                });
                this.dispatchEvent(alertmessage);
        
             }
            else{
                var attachments = JSON.parse(data.responsebody).data.OperationLogAttachment;
                var attachmentlist = [];
                for(var i in attachments){
                    var attachmentmodded = {
                        "Id" : attachments[i].ecard_operation_log_attachment_id,
                        "url" : attachments[i].s3_image_uri,
                        "name" : ''
                    };
                    attachmentlist.push(attachmentmodded);
                    //attachmentlist.push(attachments[i]);
                }
                this.attachmentlist = attachmentlist; 
                this.showSpinner = false;
            }
    
            }).catch(error => {
            this.error = error;
            const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch the Attachments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
        
        });
        }
        else{
            this.showSpinner = false;
        }
       }
       if(this.type == 'discrepancy'){
        var discrepancylogid = this.uniqueidlocal;
        getdiscrepancylogattachments({discrepancylogid:discrepancylogid})
        .then(data => {
            if(data.isError){
                const alertmessage = new ShowToastEvent({
                title : 'Failed to fetch the Attachments.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
    
         }
        else{
            var attachments = JSON.parse(data.responsebody).data.DiscrepancyAttachment;
            var attachmentlist = [];
            for(var i in attachments){
                var attachmentmodded = {
                    "Id" : attachments[i].ecard_discrepancy_log_attachment_id,
                    "url" : attachments[i].s3_image_uri,
                    "name" : ''
                };
                attachmentlist.push(attachmentmodded);
            }
            this.attachmentlist = attachmentlist; 
            this.showSpinner = false;
        }

        }).catch(error => {
        this.error = error;
        const alertmessage = new ShowToastEvent({
            title : 'Failed to fetch the Attachments.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
    
    });
       }
        
        
    }

    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;

    handleupload(event){
        this.filesUploaded = event.target.files;
        this.fileName = event.target.files[0].name;
        this.file = this.filesUploaded[0];
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            this.uploadfilestoserver();
        });
        this.fileReader.readAsDataURL(this.file);
    }

    uploadfilestoserver(event){
        this.showSpinner = true;
        if(this.type == 'serialnumber'){
            var requestbody = {
                "ecard_id" : this.ecardid,
                "buspart_id" : this.buspartid,
                "dat_serial_number_type" : this.serialnumbertype,
                "serial_number_log_attachment_encoded_string" : this.fileContents
            };
            uploadNewAttachment({requestbody:JSON.stringify(requestbody)})
                  .then(data => {
                      if(data.isError){
                          const alertmessage = new ShowToastEvent({
                              title :  'Sorry we could not complete the operation. Please try to attach an image file only.',
                              message : 'Something unexpected occured. Please contact your Administrator',
                             variant : 'error'
                        });
                        this.dispatchEvent(alertmessage);
                        
                      }
                      else{
                          const alertmessage = new ShowToastEvent({
                              title : 'Upload Succcessfull',
                              message : 'File uploaded successfully.',
                             variant : 'success'
                        });
                        this.dispatchEvent(alertmessage);
                        this.showSpinner = false;
                        this.getFilesfromserver();
                        this.refreshtofetchuniqueidlocal();
                      }
                        
                  }).catch(error => {
                  this.error = error;
                   const alertmessage = new ShowToastEvent({
                        title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                        message : 'Something unexpected occured. Please contact your Administrator',
                       variant : 'error'
                  });
                  this.dispatchEvent(alertmessage);
                  this.showSpinner = false;
                  });
        }
        if(this.type == 'busdetail'){
            var requestbody = {
                "ecard_id" : this.ecardid,
                "attachment_encoded_string" : this.fileContents
            };
            uploadNewAttachmenttoEcard({requestbody:JSON.stringify(requestbody)})
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
                              title : 'Upload Succcessfull',
                              message : 'File uploaded successfully.',
                             variant : 'success'
                        });
                        this.dispatchEvent(alertmessage);
                        this.showSpinner = false;
                        this.getFilesfromserver();
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
        if(this.type == 'operationlog'){
            var requestbody = {
                "ecard_id" : this.ecardid,
                "department_id" : this.departmentid,
                "buildstation_id" : this.buildstationid,
                "attachment_encoded_string" : this.fileContents
            };
            uploadAttachmenttoEcardOperationlog({requestbody:JSON.stringify(requestbody)})
                  .then(data => {
                      if(data.isError){
                          const alertmessage = new ShowToastEvent({
                              title :'Sorry we could not complete the operation. Please try to attach an image file only.',
                              message : 'Something unexpected occured. Please contact your Administrator',
                             variant : 'error'
                        });
                        this.dispatchEvent(alertmessage);
                        
                      }
                      else{
                          const alertmessage = new ShowToastEvent({
                              title : 'Upload Succcessfull',
                              message : 'File uploaded successfully.',
                             variant : 'success'
                        });
                        this.dispatchEvent(alertmessage);
                        if(this.uniqueidlocal != undefined ){
                            this.showSpinner = false;
                            this.getFilesfromserver();
                        }
                        else{
                            this.showSpinner = false;
                            this.uniqueidlocal = JSON.parse(data.responsebody).data.ecard_operation_log_id;
                            this.getFilesfromserver();
                            this.refreshtofetchuniqueidlocal();
                        }
                        
                        
                       
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
        if(this.type == 'discrepancy'){
            var requestbody = {
                "ecard_discrepancy_log_id" : this.uniqueidlocal,
                "attachment_encoded_string" : this.fileContents
            };
            uploadAttachmenttoDiscrepancylog({requestbody:JSON.stringify(requestbody)})
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
                              title : 'Upload Succcessfull',
                              message : 'File uploaded successfully.',
                             variant : 'success'
                        });
                        this.dispatchEvent(alertmessage);
                        this.getFilesfromserver();
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

    refreshtofetchuniqueidlocal(event){
        const onnewadded = new CustomEvent(
            "newadded",
            {
                detail : {} 
                
            }
        );
        this.dispatchEvent(onnewadded);
    }

    deleteattachment(event){
        var uniqueid = event.target.dataset.id;
        var status = confirm("Are you sure you want to delete this file ?");
		if (status) {
            if(this.type == 'serialnumber'){
                var requestbody = {
                    "serial_number_log_attachment_id" : uniqueid
                };
                deleteSerialnoattachment({requestbody:JSON.stringify(requestbody)})
                      .then(data => {
                          if(data.isError){
                              const alertmessage = new ShowToastEvent({
                                  title :  'Sorry we could not complete the operation. Please try to attach an image file only.',
                                  message : 'Something unexpected occured. Please contact your Administrator',
                                 variant : 'error'
                            });
                            this.dispatchEvent(alertmessage);
                            
                          }
                          else{
                              const alertmessage = new ShowToastEvent({
                                  title : 'Delete Succcessfull',
                                  message : 'File deleted successfully.',
                                 variant : 'success'
                            });
                            this.dispatchEvent(alertmessage);
                            this.showSpinner = false;
                            this.getFilesfromserver();
                            this.refreshtofetchuniqueidlocal();
                           
                          }
                            
                      }).catch(error => {
                      this.error = error;
                       const alertmessage = new ShowToastEvent({
                            title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                            message : 'Something unexpected occured. Please contact your Administrator',
                           variant : 'error'
                      });
                      this.dispatchEvent(alertmessage);
                      this.showSpinner = false;
                      });
            }
            if(this.type == 'busdetail'){
                var requestbody = {
                    "ecard_attachment_id" : uniqueid
                };
                deleteEcardattachment({requestbody:JSON.stringify(requestbody)})
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
                                  message : 'File deleted successfully.',
                                 variant : 'success'
                            });
                            this.dispatchEvent(alertmessage);
                            this.showSpinner = false;
                            this.getFilesfromserver();
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
            if(this.type == 'operationlog'){
                var requestbody = {
                    "ecard_operation_log_attachment_id" : uniqueid
                };
                deleteEcardOperationattachment({requestbody:JSON.stringify(requestbody)})
                      .then(data => {
                          if(data.isError){
                              const alertmessage = new ShowToastEvent({
                                  title :'Sorry we could not complete the operation. Please try to attach an image file only.',
                                  message : 'Something unexpected occured. Please contact your Administrator',
                                 variant : 'error'
                            });
                            this.dispatchEvent(alertmessage);
                            
                          }
                          else{
                              const alertmessage = new ShowToastEvent({
                                  title : 'Delete Succcessfull',
                                  message : 'File deleted successfully.',
                                 variant : 'success'
                            });
                            this.dispatchEvent(alertmessage);
                            if(this.uniqueidlocal != undefined ){
                                this.showSpinner = false;
                                this.getFilesfromserver();
                            }
                            else{
                                this.showSpinner = false;
                                this.uniqueidlocal = JSON.parse(data.responsebody).data.ecard_operation_log_id;
                                this.getFilesfromserver();
                                this.refreshtofetchuniqueidlocal();
                            }
                            
                            
                           
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
            if(this.type == 'discrepancy'){
                var requestbody = {
                    "ecard_discrepancy_log_attachment_id" : uniqueid
                };
                deleteDiscrepancyattachment({requestbody:JSON.stringify(requestbody)})
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
                                  message : 'File deleted successfully.',
                                 variant : 'success'
                            });
                            this.dispatchEvent(alertmessage);
                            this.getFilesfromserver();
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
        
    }



    
}