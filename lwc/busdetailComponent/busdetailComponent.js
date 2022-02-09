import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import pubsub from 'c/pubsub' ; 


import getmeetingnotes from "@salesforce/apex/ecardOperationsController.getmeetingnotes";
import getoverviewDetails from "@salesforce/apex/ecardOperationsController.getoverviewDetails";
import getecardDetails from "@salesforce/apex/ecardOperationsController.getecardDetails";
import updateecardDetails from "@salesforce/apex/ecardOperationsController.updateecardDetails";

import getpresigneds3Url from "@salesforce/apex/ecardOperationsController.getpresigneds3Url";
import uploadVINlabel from "@salesforce/apex/ecardOperationsController.uploadVINlabel";
import uploadEmissionlabel from "@salesforce/apex/ecardOperationsController.uploadEmissionlabel";
import deleteEmissionlabel from "@salesforce/apex/ecardOperationsController.deleteEmissionlabel";
import deleteVinlabel from "@salesforce/apex/ecardOperationsController.deleteVinlabel";




export default class BusdetailComponent extends LightningElement {
  nodatadessert = noDatadessert; // No Data Image(Static Resource).
  @api selectedBusLabel;
  @api ecardid;
  @api bussequence;

  @track showbusoverview = false;
  @track selectedview = "busstatus";

  @track overviewdata;
  @track ecarddetails;
  @track meetingnotes = [];
  @track selecteddepartment;
  @track departmentlist = [];
  @track qcchecklists = [];
  @track attachmentlists = [];

  @track hasvinpicture=false;
  @track hasemissionpicture=false;
  @track vinurl;
  @track emissionurl;
  @track showSpinnerwinlabel = true;
  @track sequenceavailable;

  get ismeetingnotespresent() {
    return this.meetingnotes.length == 0;
  }

  get isqcchecklistpresent() {
    return this.qcchecklists.length == 0;
  }

  get isselectedmoreinfo(){
    return this.selectedview == "overview";
  }

  get isattachmentpresent() {
    return this.attachmentlists.length == 0;
  }

  //Sajith
  get acceptedFormats() {
    return ['.png','.jpg','.jpeg'];
  }

  uploadvintoserver(){
    var requestbody = {
      "ecard_id" : this.ecardid,
      "attachment_encoded_string" : this.uploadedimagevin
    };
    uploadVINlabel({requestbody:JSON.stringify(requestbody)})
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
                    const alertmessage = new ShowToastEvent({
                      title : 'VIN Label Uploaded.',
                      message : 'The Ecard VIN Label updated successfully.',
                     variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                this.getvinandemissionattachment(); 
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

  uploademissiontoserver(){
    var requestbody = {
      "ecard_id" : this.ecardid,
      "attachment_encoded_string" : this.uploadedimage
    };
    uploadEmissionlabel({requestbody:JSON.stringify(requestbody)})
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
                    const alertmessage = new ShowToastEvent({
                      title : 'Emission Label Uploaded.',
                      message : 'The Ecard VIN Label updated successfully.',
                     variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                  this.getvinandemissionattachment(); 
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

  deletevinpicturelabel(){
    var status = confirm("Are you sure you want to delete this file ?");
		if (status) {
    var requestbody = {
      "ecard_id" : this.ecardid
    };
    deleteVinlabel({requestbody:JSON.stringify(requestbody)})
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
                    const alertmessage = new ShowToastEvent({
                      title : 'VIN Label Deleted.',
                      message : 'The Ecard VIN Label deleted successfully.',
                     variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                this.hasvinpicture=false;
                this.vinurl=null;
                  this.getvinandemissionattachment(); 
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

  deleteemissionpicture(){
    var status = confirm("Are you sure you want to delete this file ?");
		if (status) {
    var requestbody = {
      "ecard_id" : this.ecardid
    };
    deleteEmissionlabel({requestbody:JSON.stringify(requestbody)})
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
                    const alertmessage = new ShowToastEvent({
                      title : 'Emission Label Deleted.',
                      message : 'The Ecard Emission Label deleted successfully.',
                     variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                this.hasemissionpicture=false;
                this.emissionurl=null;
                  this.getvinandemissionattachment(); 
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


  uploadedimagevin;
  filesUploadedvin = [];
  filevin;
  fileContentsvin;
  fileReadervin;
  contentvin;
  filenamevin;

  // getting file from the local machine into the file loader. 
  handlevinlabelupload(event) {
          this.filesUploadedvin = event.target.files;
          console.log('@@@VIN Files ::'+JSON.stringify(this.filesUploadedvin));
          this.fileNamevin = event.target.files[0].name;
          this.filevin = this.filesUploadedvin[0];
          // create a FileReader object 
          this.fileReadervin= new FileReader();
          // set onload function of FileReader object  
          this.fileReadervin.onloadend = (() => {
              this.fileContentsvin = this.fileReadervin.result;
              //this.vinurl=this.uploadedimagevin;
              let base64 = 'base64,';
              this.contentvin = this.fileContentsvin.indexOf(base64) + base64.length;
              this.fileContentsvin = this.fileContentsvin.substring(this.contentvin);
              this.uploadedimagevin = this.fileContentsvin;
              this.uploadvintoserver();
             // 
          });
  
          this.fileReadervin.readAsDataURL(this.filevin);
          this.hasvinpicture=true;
          //this.currentstep = 'two';
          //this.enableuploadbutton = false;      
  }
  filesUploaded = [];
  file;
  fileContents;
  fileReader;
  content;

  // getting file from the local machine into the file loader. 
  handleemissionslabelupload(event) {
          this.filesUploaded = event.target.files;
          console.log('@@@Emissions Files ::'+JSON.stringify(this.filesUploaded));
          this.fileName = event.target.files[0].name;
          this.file = this.filesUploaded[0];
          // create a FileReader object 
          this.fileReader= new FileReader();
          // set onload function of FileReader object  
          this.fileReader.onloadend = (() => {
              this.fileContents = this.fileReader.result;
              //this.emissionurl=this.uploadedimage;
              let base64 = 'base64,';
              this.content = this.fileContents.indexOf(base64) + base64.length;
              this.fileContents = this.fileContents.substring(this.content);
              this.uploadedimage = this.fileContents;
              this.uploademissiontoserver();
             // 
          });
  
          this.fileReader.readAsDataURL(this.file);
          this.hasemissionpicture=true;
          //this.enableuploadbutton = false;

      
  }
//Sajith
  connectedCallback() {
    this.loadview();
  }

  loadview(event) {
    
   this.sequenceavailable=this.bussequence!=undefined?true:false;

    if (this.selectedview == "busstatus") {
      this.getoverviewdetailsfromserver();
    }
    if (this.selectedview == "overview") {
      this.getbusdetailsfromserver();
    }
    //if (this.selectedview == "meetingnotes") {
    //  this.getmeetingnotesfromserver();
    //}
    if (this.selectedview == "vinemission") {
      this.getvinandemissionattachment();
    }
    if (this.selectedview == "attachments") {

    }
    this.getbusdetailsfromserver();
  }

  tabClick(event) {
    this.selectedview = event.currentTarget.dataset.id;
    const allTabs = this.template.querySelectorAll(".slds-tabs_default__item");
    allTabs.forEach((elm, idx) => {
      elm.classList.remove("slds-is-active");
      elm.classList.remove("activetab");
    });
    event.currentTarget.classList.add("slds-is-active");
    event.currentTarget.classList.add("activetab");
    var element = event.currentTarget.firstChild.id;

    var selectedelementarea = element.substr(0, element.indexOf("_"));

    const tabview = this.template.querySelectorAll(
      ".slds-tabs_default__content"
    );
    tabview.forEach((elm, idx) => {
      elm.classList.remove("slds-show");
      elm.classList.add("slds-hide");
    });
    this.template
      .querySelector(`.${selectedelementarea}`)
      .classList.remove("slds-hide");
    this.template
      .querySelector(`.${selectedelementarea}`)
      .classList.add("slds-show");
    this.loadview();
  }

  // Show Bus Overview
  showbusDetails(event) {
    this.showbusoverview = true;
    this.loadview();
  }

  // Hide Bus Overview
  hidebusDetails(event) {
    this.showbusoverview = false;
  }

  vinandemissionurl = {
    'chassis_image_url' : null,
    'vin_image_url' :null
  };
  // To get the attachments for VIN and Emission
  getvinandemissionattachment(event){
    this.showSpinnerwinlabel = true;
    var ecardid = this.ecardid;
    getecardDetails({ ecardid: ecardid })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch E Card Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var ecarddetails = JSON.parse(data.responsebody).data.ecard;
          var s3_file_paths = [];
          if(ecarddetails.chassis_image_url != null){
            s3_file_paths.push(ecarddetails.chassis_image_url);
            this.vinandemissionurl.chassis_image_url = ecarddetails.chassis_image_url;
          }
          if(ecarddetails.vin_image_url != null){
            s3_file_paths.push(ecarddetails.vin_image_url);
            this.vinandemissionurl.vin_image_url = ecarddetails.vin_image_url;
          }
          if(s3_file_paths.length != 0){
            var requestbody = {
              's3_file_paths' : JSON.stringify(s3_file_paths)
            };
            this.gets3urls(JSON.stringify(requestbody));
          }
          else{
            this.showSpinnerwinlabel = false;
          }

        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch E Card Details.",
          message:"Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      }); 
  }

  // To get s3URL
  gets3urls(requestbody){
    getpresigneds3Url({ requestbody: requestbody })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Label Images.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var vinandemissionurl = this.vinandemissionurl;
          var presigned_urls = JSON.parse(data.responsebody).data.presigned_url;
          for(var i in presigned_urls){
              if(vinandemissionurl.vin_image_url == presigned_urls[i].s3path){
                this.vinurl = presigned_urls[i].s3url;
                this.hasvinpicture = true;
              }
              if(vinandemissionurl.chassis_image_url == presigned_urls[i].s3path){
                this.emissionurl = presigned_urls[i].s3url;
                this.hasemissionpicture = true;
              }
          }
          this.showSpinnerwinlabel = false;
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Label Images.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }

  // To get overview details from the server
  getoverviewdetailsfromserver(event){
    var ecardid = this.ecardid.toString();
    getoverviewDetails({ ecardid: ecardid })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Overview Data.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var overviewdata = JSON.parse(data.responsebody).data;
          for(var type in overviewdata){
            var obj = overviewdata[type];
            Object.keys(obj).forEach(function(key) {
              if(obj[key] === null) {
                  obj[key] = 0;
              }
          })
          }
          if(overviewdata!=null && (overviewdata.operation_log==null || overviewdata.operation_log==undefined)){
            console.log("Error operation_log==null");
            console.log('Ecard ID:' +ecardid);
            console.log(JSON.stringify(overviewdata));
          }
          this.overviewdata = overviewdata;
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Overview Data.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }

  /* To get the meeting notes from server
  getmeetingnotesfromserver(event) {
    var ecardid = this.ecardid.toString();
    getmeetingnotes({ ecardid: ecardid })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Meeting Notes.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var meeting_note = JSON.parse(data.responsebody).data.meeting_note;
          var meetingnotes = [];
          if (meeting_note.length != 0) {
            for (var note in meeting_note) {
              var meetingnote = meeting_note[note];
              var filename = meetingnote.meeting_note_url.substring(
                meetingnote.meeting_note_url.lastIndexOf("/") + 1
              );
              meetingnote["filename"] = filename;
              meetingnotes.push(meetingnote);
            }
          }
          this.meetingnotes = meetingnotes;
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Meeting Notes.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      });
  }*/

  

  // To get Bus Details from server.
  getbusdetailsfromserver(event) {
    var ecardid = this.ecardid;
    getecardDetails({ ecardid: ecardid })
      .then((data) => {
        if (data.isError) {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch E Card Details.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        } else {
          var ecarddetails = JSON.parse(data.responsebody).data.ecard;
          this.ecarddetails = ecarddetails;
          if(ecarddetails.workcenter_name ==='9999' || ecarddetails.workcenter_name==='0'){
            this.ecarddetails.workcenter_name='';
          }
        }
      })
      .catch((error) => {
        const alertmessage = new ShowToastEvent({
          title: "Failed to fetch E Card Details.",
          message:
            "Something unexpected occured. Please contact your Administrator",
          variant: "error"
        });
        this.dispatchEvent(alertmessage);
      }); 
  }

  // Update busdetails
  updateecarddetail(event){
    var targetvalue = event.target.value;
    var targetname = event.target.name;
    this.ecarddetails[targetname] = targetvalue;
    this.updateecarddetailstoserver();
  }

  // Update budetails to Server
  updateecarddetailstoserver(event){
    var requestbody = {
      "ecard_id" : this.ecarddetails.ecard_id,
      "ac_system_pdi" : this.ecarddetails.ac_system_pdi,
      "completed_date" : new Date(this.ecarddetails.completed_date),
      "coach_weight_unladen" : this.ecarddetails.coach_weight_unladen,
      "front_axle_weight" : this.ecarddetails.front_axle_weight,
      "odometer" : this.ecarddetails.odometer,
      "io_program" : this.ecarddetails.io_program,
      "coach_no" : this.ecarddetails.coach_no
    };
    updateecardDetails({requestbody:JSON.stringify(requestbody)})
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
                    const alertmessage = new ShowToastEvent({
                      title : 'Ecard details updated.',
                      message : 'The ecard detail was updated successfully.',
                     variant : 'success'
                });
                this.dispatchEvent(alertmessage);
                   
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

  // Handle Department Change
  handleDepartmentchange(event) {
    this.selecteddepartment = event.detail.value;
    if (this.selectedview == "attachments") {
       // Function to fetch Attachments from server
    }
  }

  // To show the detail view of filtered item
  showfiltereddata(event){
    var viewtobeselected = event.currentTarget.dataset.label; //Possible values => Operations, Discrepancies, Shortages, Serial No. Logs
    var statustobefiltered = event.currentTarget.dataset.id;
    this.showbusoverview = false;
    let message = {
      "view" : viewtobeselected,
      "filterstatus" : statustobefiltered,
      "ecardid" : this.ecardid
    };
    pubsub.fire('applyfilters', JSON.stringify(message) );
  }

}