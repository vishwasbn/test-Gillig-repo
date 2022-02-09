import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import uploadTempAttachment from "@salesforce/apex/ecardOperationsController.uploadTempAttachment";
import deleteTempAttachment from "@salesforce/apex/ecardOperationsController.deleteTempAttachment";


export default class AttachmenttempComponent extends LightningElement {
    @track attachmentlist = [];
    @track attachmentsurllist = [];
    @track showSpinner = false;

    get acceptedFormats() {
        return ['.png','.jpg','.jpeg'];
    }

    get attachmentsize(){
        return this.attachmentlist.length;
    }

    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    currentfileread;
    handleupload(event){
        this.filesUploaded = event.target.files;
        this.fileName = event.target.files[0].name;
        this.file = this.filesUploaded[0];
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            this.currentfileread = this.fileReader.result;
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            this.uploadtempAttachment();
        });
        this.fileReader.readAsDataURL(this.file);
    }

    uploadtempAttachment(event){
        this.showSpinner = true;
        var requestbody = {
            "attachment_encoded_string" : this.fileContents
        };
        uploadTempAttachment({requestbody:JSON.stringify(requestbody)})
              .then(data => {
                  if(data.isError){
                      const alertmessage = new ShowToastEvent({
                          title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                          message : 'Something unexpected occured. Please contact your Administrator',
                         variant : 'error'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                  }
                  else{
                    /*const alertmessage = new ShowToastEvent({
                          title : 'Upload Succcessfull',
                          message : 'File uploaded successfully.',
                         variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    // this.getFilesfromserver(); */
                    var s3tempurl = JSON.parse(data.responsebody).data.s3_image_path;
                    this.attachmentsurllist.push(s3tempurl);
                    var tempattachmentlist = JSON.parse(JSON.stringify(this.attachmentlist));
                    var index = tempattachmentlist.length+1;
                    var newattachmentadded = {'index':index,'url':this.currentfileread,'s3tempurl':s3tempurl};
                    tempattachmentlist.push(newattachmentadded);
                    this.attachmentlist = tempattachmentlist;
                    this.relatetodiscrepancy();
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
              this.showSpinner = false;
              });
    }

    relatetodiscrepancy(event){
        const newfileupload = new CustomEvent(
            "newfileupload",
            {
                detail : {tempurllist: this.attachmentsurllist} 
                
            }
        );
        this.dispatchEvent(newfileupload);
        //alert(JSON.stringify(this.attachmentsurllist));
    }

    
    deleteattachment(event){
        var urltobedelete = event.target.dataset.id;
        var newurllist = [];
        var newattachmentlist = [];
        for(var attachment in this.attachmentlist){
            if(this.attachmentlist[attachment].s3tempurl != urltobedelete){
                newattachmentlist.push(this.attachmentlist[attachment]);
                newurllist.push(this.attachmentlist[attachment].s3tempurl);
            }
        }
        this.attachmentsurllist = newurllist;
        this.attachmentlist = newattachmentlist;
        var s3urlarray = [urltobedelete];
        var requestbody = {
            "s3_file_paths" : JSON.stringify(s3urlarray)
        };
        deleteTempAttachment({requestbody:JSON.stringify(requestbody)})
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
                    /*var responsestatus = JSON.parse(data.responsebody).data.success;
                    if(responsestatus){

                    } */
                    this.relatetodiscrepancy();
                  }
                    
              }).catch(error => {
              this.error = error;
               const alertmessage = new ShowToastEvent({
                    title : 'Sorry we could not complete the operation. Please try to attach an image file only.',
                    message : 'Something unexpected occured. Please contact your Administrator',
                   variant : 'error'
              });
              this.dispatchEvent(alertmessage);
              });
    }

}