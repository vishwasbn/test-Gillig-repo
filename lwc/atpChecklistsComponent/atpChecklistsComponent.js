import { LightningElement, api, track} from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getAttachmentChecklist from '@salesforce/apex/AtpChecklistsController.getAttachmentChecklist';
import updateAttachmentChecklist from '@salesforce/apex/AtpChecklistsController.updateAttachmentChecklist';
import getFinalAcceptance from '@salesforce/apex/AtpChecklistsController.getFinalAcceptance';
import updateFinalAcceptance from '@salesforce/apex/AtpChecklistsController.updateFinalAcceptance';
import getAntiLockBraketestList from '@salesforce/apex/AtpChecklistsController.getAntiLockBraketestList';
import updateAntiLockBraketest from '@salesforce/apex/AtpChecklistsController.updateAntiLockBraketest';
import getAcceptanceTestList from '@salesforce/apex/AtpChecklistsController.getAcceptanceTestList';
import updateAcceptanceTest from '@salesforce/apex/AtpChecklistsController.updateAcceptanceTest';
import pubsub from 'c/pubsub' ; 
import EcardLogin from "@salesforce/apex/userAuthentication.EcardLogin";
export default class ATPCheckLists extends LightningElement {

    @api department;
    @api selecteddepartmentId;
    @api busname;
    @api buschasisnumber;
    @api operation;
    @api ecardid;
    @api departmentIdMap;
    @api departmentoptions;
    @api departmentid;
    @api permissionset;
    @api isverified;

    @track departmentId;
    @track departmentName;
    @track showSpinner;
    @track selectedatpview = 'attachment';
    @track buttonLabel='New Attachment Checklist Item';
    @track attachmentchecklistdata;
    @track finalacceptancedata;
    @track buttonenabled=true;
    @track newattchmentmodal;
    @track qclist=undefined;
    @track allQClist=undefined;
    @track returntrue;
    @track updateuserselectonnewdesc;
    @track action;
    @track description;
    @track qcselectmodal;
    @track qccapturerole=false;
    @track loggedinuser;
    @track filterlocal;
    @track filterlabellocal;
    @track newdiscrepancymodal=false;
    
    
    @api
    get filter(){
        return this.filterlocal;
    }
    set  filter(value){
      this.filterlocal = value;
      if(this.filterlocal!=undefined){
        this.filterlabellocal=this.filter=='approve'?'APPROVED ITEMS':'OPEN ITEMS';
        this.loadAtpChecklistsdata();
      }
    }
    get isattachmentchecklistpresent(){
        return this.attachmentchecklist.length == 0;
    }
    get isselectedattachment(){
        return this.selectedatpview == 'attachment';
    }
    get isselectedatpworksheet(){
        return this.selectedatpview == 'atpworksheet';
    }
    get isselectedantilockbreak(){
        return this.selectedatpview == 'antilock';
    }
    get isselectedfinalacceptance(){
        return this.selectedatpview == 'finalacceptance';
    }
    get setuserlimit(){
        return true;
    }
    get disablerequired(){
        return !this.permissionset.atp.write;
    }
    get disablenewattchmentitem(){
        if(this.permissionset.atp.write && this.availableattchmentidlist.length > 0){
            return false;
        }else{
            return true;
        }
    }
    get filterapplied(){
        return this.filterlocal!=undefined;
    }

    connectedCallback(){
        this.getloggedinuser();
        this.loadAtpChecklistsdata();
        this.departmentId = this.selecteddepartmentId;
    }
    getloggedinuser(){
        EcardLogin()
        .then((result) => {
            this.loggedinuser=result.data.user;
            if(this.loggedinuser.approle_id==1 || this.loggedinuser.approle_id==4){
                this.qccapturerole=true;
            }else{
                this.qccapturerole=false;
            }
        })
        .catch((error) => {
        });//sajith
    }

    loadAtpChecklistsdata(event){
        switch(this.selectedatpview) {
            case 'attachment':
                this.loadattachmentdata();
                break;
            case 'atpworksheet':
                this.loadatdata();
                break;
            case 'antilock':
                this.loadabsdata();
                break;
            case 'finalacceptance':
                this.loadfinalacceptancedata();
                break;
            default:
              // code block
          } 

        /*  
        if(this.selectedatpview==='attachment'){
            this.loadattachmentdata();
        }
        if(this.selectedatpview==='finalacceptance'){
            this.loadfinalacceptancedata();
        }
        if(this.selectedatpview==='antilock'){
            this.loadabsdata();
        }
        if(this.selectedatpview==='atpworksheet'){
            this.loadatdata();
        }*/
        
    }

    modifyuserlistfordisplay(userlist) {
        var newuserlist = [];
        if (userlist != undefined && userlist != null && userlist.length != 0) {
          for (var count in userlist) {
            var user = userlist[count];
            if (user != undefined) {
              var name = `${user.first_name} ${user.last_name}`;
              var initials = name.match(/\b\w/g) || [];
              initials = (
                (initials.shift() || "") + (initials.pop() || "")
              ).toUpperCase();
              var newuser = {
                Id: user.employee_id,
                Name: `${name} (${user.employee_number})`,
                name: `${name} (${user.employee_number})`,
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

    availabeqcforattachment=[];
    availableattchmentidlist=[]; 
    attachmentchecklist=[]; 

    loadattachmentdata(){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        getAttachmentChecklist({ ecardid: ecardid })
        .then((data) => {
            if (data.isError) {
            const alertmessage = new ShowToastEvent({
                title: "Failed to fetch Attachment Checklist Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                debugger;
                var attachmentdetails = JSON.parse(data.responsebody).data;
                var modifiedatpdetails=[];
                var attachmentidlist=[];
                var status=undefined;
                if(this.filter!=undefined){
                    status=this.filter=='approve'?true:false;
                }
                for(var i in attachmentdetails.attachment_check_list){
                    let atpitem=attachmentdetails.attachment_check_list[i];
                    if(atpitem.attachment_check_list_name !=null){
                        atpitem['modifiedqc']=this.modifyuserlistfordisplay([atpitem.verified_qc_id]);
                        atpitem['qcavailable']=atpitem.verified_qc_id!=null?true:false;
                        atpitem['requiredtitle']=atpitem.is_applicable?"YES":"NO";
                        atpitem.verified_status=atpitem.verified_status==null?false:atpitem.verified_status;
                        //filter the items based on status
                        if(status!=undefined){
                            if(atpitem.verified_status==status && atpitem.is_applicable){
                                modifiedatpdetails.push(atpitem);    
                            }
                        }
                        //If no filter specified, include all the items
                        else{
                            modifiedatpdetails.push(atpitem);
                        }
                    }else{
                        attachmentidlist.push(atpitem.attachment_check_list_id);
                    }
                }
                this.availableattchmentidlist=attachmentidlist;
                this.availabeqcforattachment=this.modifyuserlistfordisplay(attachmentdetails.qc_users);
                this.attachmentchecklist=modifiedatpdetails;
                this.showSpinner = false;
            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Attachment Checklist Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 
    }

    tabClick(event) {
        this.selectedatpview = event.currentTarget.dataset.id;
        this.buttonLabel=this.getButtonLabel(this.selectedatpview)
        this.buttonenabled=(this.buttonLabel==='New Attachment Checklist Item')?true:false;
        const allTabs = this.template.querySelectorAll('.slds-tabs_default__item');
        allTabs.forEach((elm, idx) => {
            elm.classList.remove("slds-is-active");
            elm.classList.remove("activetab");
        });
        event.currentTarget.classList.add('slds-is-active');
        event.currentTarget.classList.add('activetab');
        var element = event.currentTarget.firstChild.id;
    
        var selectedelementarea = element.substr(0, element.indexOf('_'));;
    
        const tabview = this.template.querySelectorAll('.slds-tabs_default__content');
        tabview.forEach((elm, idx) => {
            elm.classList.remove("slds-show");
            elm.classList.add("slds-hide");
        });
        this.template.querySelector(`.${selectedelementarea}`).classList.remove("slds-hide");
        this.template.querySelector(`.${selectedelementarea}`).classList.add("slds-show");
        this.loadAtpChecklistsdata();
     }

    getButtonLabel(selectedtab){
        var blabel='';
        switch(selectedtab) {
            case 'attachment':
                blabel='New Attachment Checklist Item';
                break;
            case 'atpworksheet':
                blabel='New ATP Worksheet Item';
                break;
            case 'antilock':
                blabel='New Anti-Lock Break Item';
                break;
            case 'finalacceptance':
                blabel='New Final Acceptance Item';
                break;
            default:
              // code block
          } 
          return blabel;
    }
    //QC User Selection start
    @track selectedusersList = [];
    @track modifieduserselection = [];
    @track completesearchlistUsers = [];
    @track selectedbuildstationId;
    @track fieldtoupdate;
    @track selecteduserslistfrommodal;
    @track buildstationoptions;
    @track showuserlist=false;
    selectedattachmentlistid;
    selectedattachment;

    get disableuserselection(){
        return this.selectedattachment.verified_status;
    }
    // To set the selected users and search list for User selection modal in Operations Tab.
    usermodification(event){
        this.selectedattachmentlistid = null;
        this.selectedattachmentlistid = event.detail.buildstationid;
        var currentuserlist = event.detail.userlist;
        for(var i in this.attachmentchecklist){
            if(this.attachmentchecklist[i].attachment_check_list_id==this.selectedattachmentlistid){
                this.selectedattachment=this.attachmentchecklist[i];
            }
        }

        this.showuserlist = true;
    }
    existingrowstatuschange(event){
        this.selectedattachmentlistid = event.target.name=='applicable'?event.target.dataset.id:event.detail.uniqueid;
        for(var i in this.attachmentchecklist){
            if(this.attachmentchecklist[i].attachment_check_list_id==this.selectedattachmentlistid){
                this.selectedattachment=this.attachmentchecklist[i];
                if(event.target.type!="checkbox"){
                    this.selectedattachment.verified_status=event.detail.status;
                }else{
                    this.selectedattachment.is_applicable=event.target.checked;
                }
                break;

            }
        }
        this.updateqcuserstoserver();
    }
    updateqcuserstoserver(){
        //if(this.selectedattachment.modifiedqc.length>0){
            var attachmentname=null;
            attachmentname=this.selectedattachment.attachment_check_list_name;
            var requestbody={
                "ecard_id":this.ecardid,
                //"verified_qc_id":this.selectedattachment.modifiedqc[0].Id.toString(),
                "verified_qc_id" : this.loggedinuser.appuser_id,
                "verified_status":this.selectedattachment.verified_status,
                "is_applicable":this.selectedattachment.is_applicable,
                "custom_attachment_check_list_info":attachmentname,
                "attachment_check_list_id":this.selectedattachment.attachment_check_list_id
            };
            this.showuserlist=false;
            this.updateattachmenttoserver(JSON.stringify(requestbody));
        /*}
        else{
            const alertmessage = new ShowToastEvent({
            title: "Select users accordingly.",
            message:"Please select atleast one QC user.",
            variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }*/
    }

    hideuserlist(){
        this.showuserlist = false;
        this.loadAtpChecklistsdata();
    }

    newattachmentlistitem;
    addnewlistitem(event){
        this.newattachmentlistitem={
            "ecard_id":this.ecardid,
            //"verified_qc_id":null,
            "verified_qc_id" : this.loggedinuser.appuser_id,
            "verified_status":false,
            "custom_attachment_check_list_info":undefined,
            "attachment_check_list_id":this.availableattchmentidlist[0],
            "selectedqcuserlist":[]
        };
        this.newattchmentmodal=true;
    }

    updatenewattachmentitemname(event){
        this.newattachmentlistitem[event.target.name]=event.target.value;    
    }

    updateselecteduser(event){
        if(event.detail.userlist.length !=0){
            this.newattachmentlistitem.selectedqcuserlist=event.detail.userlist;
            //alert(JSON.stringify(this.newattachmentlistitem.selectedqcuserlist));
        }
    }
    updatetablerowqcuserlist(event){
        this.selectedattachment.modifiedqc=event.detail.userlist;
    }

    addnewattachmentchecklist(){
        if(this.newattachmentlistitem.custom_attachment_check_list_info != undefined){
            debugger;
            var requestbody={
                "ecard_id":this.newattachmentlistitem.ecard_id,
                //"verified_qc_id":this.newattachmentlistitem.selectedqcuserlist[0].Id.toString(),
                "verified_qc_id" : this.loggedinuser.appuser_id,
                "verified_status":this.newattachmentlistitem.verified_status,
                "is_applicable":true,
                "custom_attachment_check_list_info":this.newattachmentlistitem.custom_attachment_check_list_info,
                "attachment_check_list_id":this.newattachmentlistitem.attachment_check_list_id
            };
            this.newattchmentmodal=false;
            this.updateattachmenttoserver(JSON.stringify(requestbody));
        }
        else{
                const alertmessage = new ShowToastEvent({
                title: "Fill all required fields.",
                message:"All fields are required to save the list item",
                variant: "warning"
                });
                this.dispatchEvent(alertmessage);
        }
    }

    hidenewattachmentlist(){
        this.newattchmentmodal=false;
    }

    updateattachmenttoserver(requestbody){
        updateAttachmentChecklist({ requestbody: requestbody })
        .then((data) => {
            if (data.isError) {
            const alertmessage = new ShowToastEvent({
                title: "Failed to update Attachment Checklist Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                const alertmessage = new ShowToastEvent({
                    title: "Updated Successfully.",
                    message:"Updated Attachment Checklist Details",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.loadattachmentdata();

            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to update Attachment Checklist Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 

    }
    // Final Acceptance related Methods Start
    availabeqcforfa=[];
    falist=[]; 

	loadfinalacceptancedata(){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        debugger;
        getFinalAcceptance({ ecardid: ecardid })
        .then((data) => {
            if (data.isError) {
				const alertmessage = new ShowToastEvent({
                title: "Failed to fetch Final Acceptance Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                debugger;
                var fadetails = JSON.parse(data.responsebody).data;
                var modifiedatpdetails=[];
                var status=undefined;
                if(this.filter!=undefined){
                    status=this.filter=='approve'?true:false;
                }
                for(var i in fadetails.final_acceptance){
                    let atpitem=fadetails.final_acceptance[i];
                    if(atpitem.final_acceptance_name !=null){
                        atpitem['modifiedqc']=this.modifyuserlistfordisplay([atpitem.verified_qc_id]);
                        atpitem['qcavailable']=atpitem.verified_qc_id!=null?true:false;
                        atpitem['requiredtitle']=atpitem.is_applicable?"YES":"NO";
                        atpitem.verified_status=atpitem.verified_status==null?false:atpitem.verified_status;
                        if(status!=undefined){
                            if(atpitem.verified_status==status && atpitem.is_applicable){
                                modifiedatpdetails.push(atpitem);    
                            }
                        }//If no filter specified, include all the items
                        else{
                            modifiedatpdetails.push(atpitem);
                        }
                    }
                }
                this.availabeqcforfa=this.modifyuserlistfordisplay(fadetails.qc_users);
                this.falist=modifiedatpdetails;
                this.showSpinner = false;
            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Final Acceptance Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 
    }
    //Method to handle FA QC user selection - Enable user selection popup
	selectedfarowid;
    selectedfa;
	showfauserlist
	fausermodification(event){
        this.selectedfarowid = null;
        this.selectedfarowid = event.detail.buildstationid;
        var currentuserlist = event.detail.userlist;
        for(var i in this.falist){
            if(this.falist[i].final_acceptance_id==this.selectedfarowid){
                this.selectedfa=this.falist[i];
            }
        }
        this.showfauserlist = true;
    }	
	
	get disablefauserselection(){
        return this.selectedfa.verified_status;
    }
	
	updatefatablerowqcuserlist(event){
        //alert(JSON.stringify(event.detail.userlist));
        this.selectedfa.modifiedqc=event.detail.userlist;
    }
	
	updatefaqcuserstoserver(){
        //if(this.selectedfa.modifiedqc.length>0){
            var requestbody={
                "ecard_id":this.ecardid,
                //"verified_qc_id":this.selectedfa.modifiedqc[0].Id.toString(),
                "verified_qc_id" : this.loggedinuser.appuser_id,
                "verified_status":this.selectedfa.verified_status,
                "is_applicable":this.selectedfa.is_applicable,
                "final_acceptance_id":this.selectedfa.final_acceptance_id
            };
            this.showfauserlist=false;
            //alert(JSON.stringify(requestbody));
            this.updatefatoserver(JSON.stringify(requestbody));
        /*}else{
                const alertmessage = new ShowToastEvent({
                title: "Select users accordingly.",
                message:"Please select atleast one QC user.",
                variant: "warning"
                });
                this.dispatchEvent(alertmessage);
        }*/

    }
	
	updatefatoserver(requestbody){
        updateFinalAcceptance({ requestbody: requestbody })
        .then((data) => {
            if (data.isError) {
            const alertmessage = new ShowToastEvent({
                title: "Failed to update Final Acceptance Checklist Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                const alertmessage = new ShowToastEvent({
                    title: "Updated Successfully.",
                    message:"Updated Final Acceptance Checklist Details",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.loadfinalacceptancedata();

            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to update Attachment Checklist Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 

    }

    farowstatuschange(event){
        //this.selectedfarowid = event.detail.uniqueid;
        this.selectedfarowid = event.target.name=='applicable'?event.target.dataset.id:event.detail.uniqueid;
        for(var i in this.falist){
            if(this.falist[i].final_acceptance_id==this.selectedfarowid){
                this.selectedfa=this.falist[i];
                if(event.target.type!="checkbox"){
                    this.selectedfa.verified_status=event.detail.status;
                }else{
                    this.selectedfa.is_applicable=event.target.checked;
                }   
            }
        }
        this.updatefaqcuserstoserver();
    }
	//Methods related to Final Acceptance user selection modal - Start
	
	//Method to close the FA QC Selection modal
	hidefauserlist(){
		this.showfauserlist = false;
        this.loadAtpChecklistsdata();
	}
	//Methods related to Final Acceptance user selection modal - End

    //Final Acceptance User Selection End
    //Rockwell - ABS - Start
    allinstructions = [{
		"anti_lock_brake_test_group_id": 1,
		"instructions": [{
				"step_index": 1,
				"instruction": "Clear stored faults with Pro-Link STORED FAULT menu."
			},
			{
				"step_index": 2,
				"instruction": "Record the  ECU information from Pro-Link PROGRAM ID menu"
			}
		]
	},
	{
		"anti_lock_brake_test_group_id": 2,
		"instructions": [{
			"step_index": 3,
			"instruction": "Component test for Sensors. Check the location and voltage output of each sensor. The AC voltage output should be greater than .5 volts @ 30 rpm."
		}]
	},
	{
		"anti_lock_brake_test_group_id": 3,
		"instructions": [{
			"step_index": 4,
			"instruction": "Miscellaneous Component Testing"
		}]
	},
	{
		"anti_lock_brake_test_group_id": 4,
		"instructions": [{
			"step_index": 5,
			"instruction": "Air System Function and Leak Test"
		}]
	}
    ];
    rockwelabchecklists = [];
    availabeqcforabs=[];
    loadabsdata(){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        debugger;
        getAntiLockBraketestList({ ecardid: ecardid })
        .then((data) => {
            if (data.isError) {
				const alertmessage = new ShowToastEvent({
                title: "Failed to fetch Rockwell ABS Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                debugger;
                var absdetails = JSON.parse(data.responsebody).data;
                var modifiedatpdetails=[];
                var status=undefined;
                if(this.filter!=undefined){
                    status=this.filter=='approve'?true:false;
                }
                for(var i in absdetails.rock_well){
                    let atpitem=absdetails.rock_well[i];
                    let antilockbreaktest=[];
                    for(var j in this.allinstructions){
                        if(this.allinstructions[j].anti_lock_brake_test_group_id==atpitem.anti_lock_brake_test_group_id){
                            atpitem['instructions']=this.allinstructions[j].instructions;
                        }
                    }
                    for(var k in atpitem.anti_lock_brake_test){
                        atpitem.anti_lock_brake_test[k]['modifiedqc']=this.modifyuserlistfordisplay([atpitem.anti_lock_brake_test[k].verified_qc_id]);
                        atpitem.anti_lock_brake_test[k]['qcavailable']=atpitem.anti_lock_brake_test[k].verified_qc_id!=null?true:false;
                        atpitem.anti_lock_brake_test[k]['requiredtitle']=atpitem.anti_lock_brake_test[k].is_applicable?"YES":"NO";
                        atpitem.anti_lock_brake_test[k].verified_status=atpitem.anti_lock_brake_test[k].verified_status==null?false:atpitem.anti_lock_brake_test[k].verified_status;
                        atpitem.anti_lock_brake_test[k].slno=parseInt(k)+1;
                        if(status!=undefined){
                            if(atpitem.anti_lock_brake_test[k].verified_status==status && atpitem.anti_lock_brake_test[k].is_applicable){
                                antilockbreaktest.push(atpitem.anti_lock_brake_test[k]);
                            }
                        }else{
                            antilockbreaktest.push(atpitem.anti_lock_brake_test[k]);
                        }
                    }        
                    atpitem.anti_lock_brake_test=antilockbreaktest;
                    modifiedatpdetails.push(atpitem);
                }
                this.availabeqcforabs=this.modifyuserlistfordisplay(absdetails.qc_users);
                this.rockwelabchecklists=modifiedatpdetails;
                this.showSpinner = false;
            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Rockwell ABS Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 
    }
    //Handle Rockwell-ABS user selection 
	selectedabsrowid;
    selectedabs;
	showabsuserlist
	absusermodification(event){
        this.selectedabsrowid = null;
        this.selectedabsrowid = event.detail.buildstationid;
        var hit = false;
        var currentuserlist = event.detail.userlist;
        for(var i in this.rockwelabchecklists){
            var matchid=-1;
            for(var j in this.rockwelabchecklists[i].anti_lock_brake_test){
                matchid=this.rockwelabchecklists[i].anti_lock_brake_test[j].anti_lock_brake_test_id;    
                if(matchid==this.selectedabsrowid){
                    this.selectedabs=this.rockwelabchecklists[i].anti_lock_brake_test[j];
                    hit=true;
                    break;
                }
            }
            if(hit){
                break;
            }
        }
        this.showabsuserlist = true;
    }	

    updateabsqcuserstoserver(){
        //if(this.selectedabs.modifiedqc.length>0){
            var requestbody={
                "ecard_id":this.ecardid,
                //"verified_qc_id":this.selectedabs.modifiedqc[0].Id.toString(),
                "verified_qc_id" : this.loggedinuser.appuser_id,
                "verified_status":this.selectedabs.verified_status,
                "is_applicable":this.selectedabs.is_applicable,
                "anti_lock_brake_test_id":this.selectedabs.anti_lock_brake_test_id
            };
            this.showabsuserlist=false;
            //alert(JSON.stringify(requestbody));
            this.updateabstoserver(JSON.stringify(requestbody));
        /*}
        else{
            const alertmessage = new ShowToastEvent({
            title: "Select users accordingly.",
            message:"Please select atleast one QC user.",
            variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }*/
    }

    updateabstoserver(requestbody){
        updateAntiLockBraketest({ requestbody: requestbody })
        .then((data) => {
            if (data.isError) {
            const alertmessage = new ShowToastEvent({
                title: "Failed to update Rockwell ABS Checklist Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                const alertmessage = new ShowToastEvent({
                    title: "Updated Successfully.",
                    message:"Updated Rockwell ABS Checklist Details",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.loadabsdata();

            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to update Rockwell ABS Checklist Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 

    }
    existingabsrowstatuschange(event){
        //this.selectedabsrowid = event.detail.uniqueid;
        this.selectedabsrowid = event.target.name=='applicable'?event.target.dataset.id:event.detail.uniqueid;
        var hit=false;
        for(var i in this.rockwelabchecklists){
            var matchid=-1;
            for(var j in this.rockwelabchecklists[i].anti_lock_brake_test){
                matchid=this.rockwelabchecklists[i].anti_lock_brake_test[j].anti_lock_brake_test_id;    
                if(matchid==this.selectedabsrowid){
                    this.selectedabs=this.rockwelabchecklists[i].anti_lock_brake_test[j];
                    hit=true;
                    break;
                }
            }
            if(hit){
                break;
            }
        }
        if(event.target.type!="checkbox"){
            this.selectedabs.verified_status=event.detail.status;
        }else{
            this.selectedabs.is_applicable=event.target.checked;
        }
        this.updateabsqcuserstoserver();
    }

    //Rockwell -ABS User Selection Modal Methods
    get disableabsuserselection() {
        return this.selectedabs.verified_status;
    }

    hideabsuserlist(){
		this.showabsuserlist = false;
        this.loadAtpChecklistsdata();
    }
    updateabstablerowqcuserlist(event){
        //alert(JSON.stringify(event.detail.userlist));
        this.selectedabs.modifiedqc=event.detail.userlist;
    }
    //Rockwell - ABS - End
    //Acceptance Test Cheklist - Start
    atpchecklists = [];
    availabeqcforat=[];
    loadatdata(){
        this.showSpinner = true;
        var ecardid = this.ecardid;
        debugger;
        getAcceptanceTestList({ ecardid: ecardid })
        .then((data) => {
            if (data.isError) {
				const alertmessage = new ShowToastEvent({
                title: "Failed to fetch Acceptance Test Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                debugger;
                var atdetails = JSON.parse(data.responsebody).data;
                var modifiedatpdetails=[];
                var status=undefined;
                if(this.filter!=undefined){
                        status=this.filter=='approve'?true:false;
                }
                for(var i in atdetails.acceptance_test){
                    let atpitem=atdetails.acceptance_test[i];
                    let acceptancetest=[];
                    for(var k in atpitem.acceptance_test){
                        atpitem.acceptance_test[k]['modifiedqc']=this.modifyuserlistfordisplay([atpitem.acceptance_test[k].verified_qc_id]);
                        atpitem.acceptance_test[k]['qcavailable']=atpitem.acceptance_test[k].verified_qc_id!=null?true:false;
                        atpitem.acceptance_test[k]['requiredtitle']=atpitem.acceptance_test[k].is_applicable?"YES":"NO";
                        atpitem.acceptance_test[k].verified_status=atpitem.acceptance_test[k].verified_status==null?false:atpitem.acceptance_test[k].verified_status;
                        atpitem.acceptance_test[k].slno=parseInt(k)+1;
                        if(status!=undefined){
                            if(atpitem.acceptance_test[k].verified_status==status && atpitem.acceptance_test[k].is_applicable){
                                acceptancetest.push(atpitem.acceptance_test[k]);
                            }
                        }else{
                            acceptancetest.push(atpitem.acceptance_test[k]);
                        }
                    }                    
                    atpitem.acceptance_test=acceptancetest;
                    modifiedatpdetails.push(atpitem);
                }
                this.availabeqcforat=this.modifyuserlistfordisplay(atdetails.qc_users);
                this.atpchecklists=modifiedatpdetails;
                this.showSpinner = false;
            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to fetch Acceptance Test Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 
    }
    //Handle Acceptance Test user selection 
	selectedatrowid;
    selectedat;
	showatuserlist
	atusermodification(event){
        this.selectedatrowid = null;
        this.selectedatrowid = event.detail.buildstationid;
        var hit = false;
        var currentuserlist = event.detail.userlist;
        for(var i in this.atpchecklists){
            var matchid=-1;
            for(var j in this.atpchecklists[i].acceptance_test){
                matchid=this.atpchecklists[i].acceptance_test[j].acceptance_test_id;    
                if(matchid==this.selectedatrowid){
                    this.selectedat=this.atpchecklists[i].acceptance_test[j];
                    hit=true;
                    break;
                }
            }
            if(hit){
                break;
            }
        }
        this.showatuserlist = true;
    }	

    updateatqcuserstoserver(){
        //if(this.selectedat.modifiedqc.length>0){
            var requestbody={
                "ecard_id":this.ecardid,
                //"verified_qc_id":this.selectedat.modifiedqc[0].Id.toString(),
                "verified_qc_id" : this.loggedinuser.appuser_id,
                "verified_status":this.selectedat.verified_status,
                "is_applicable":this.selectedat.is_applicable,
                "acceptance_test_id":this.selectedat.acceptance_test_id
            };
            this.showatuserlist=false;
            this.updateattoserver(JSON.stringify(requestbody));
        /*}
        else{
            const alertmessage = new ShowToastEvent({
            title: "Select users accordingly.",
            message:"Please select atleast one QC user.",
            variant: "warning"
            });
            this.dispatchEvent(alertmessage);
        }*/
    }

    updateattoserver(requestbody){
        updateAcceptanceTest({ requestbody: requestbody })
        .then((data) => {
            if (data.isError) {
            const alertmessage = new ShowToastEvent({
                title: "Failed to update Acceptance Test Checklist Details.",
                message:"Something unexpected occured. Please contact your Administrator",
                variant: "error"
            });
            this.dispatchEvent(alertmessage);
            } else {
                const alertmessage = new ShowToastEvent({
                    title: "Updated Successfully.",
                    message:"Updated Acceptance Test Checklist Details",
                    variant: "success"
                });
                this.dispatchEvent(alertmessage);
                this.loadatdata();

            }   
        })
        .catch((error) => {
            const alertmessage = new ShowToastEvent({
            title: "Failed to update Acceptance Test Details.",
            message:"Something unexpected occured. Please contact your Administrator",
            variant: "error"
            });
            this.dispatchEvent(alertmessage);
        }); 

    }
    existingatrowstatuschange(event){
        //this.selectedatrowid = event.detail.uniqueid;
        this.selectedatrowid = event.target.name=='applicable'?event.target.dataset.id:event.detail.uniqueid;
        var hit=false;
        for(var i in this.atpchecklists){
            var matchid=-1;
            for(var j in this.atpchecklists[i].acceptance_test){
                matchid=this.atpchecklists[i].acceptance_test[j].acceptance_test_id;    
                if(matchid==this.selectedatrowid){
                    this.selectedat=this.atpchecklists[i].acceptance_test[j];
                    hit=true;
                    break;
                }
            }
            if(hit){
                break;
            }
        }
        if(event.target.type!="checkbox"){
            this.selectedat.verified_status=event.detail.status;
        }else{
            this.selectedat.is_applicable=event.target.checked;
        }
        this.updateatqcuserstoserver();
    }

    //Acceptance Test User Selection Modal Methods
    get disableatuserselection() {
        return this.selectedat.verified_status;
    }

    hideatuserlist(){
		this.showatuserlist = false;
        this.loadAtpChecklistsdata();
    }
    updateattablerowqcuserlist(event){
        this.selectedat.modifiedqc=event.detail.userlist;
    }
    //Acceptance Test Checklist - End
    clearfilter(event){
        this.filterlocal = undefined;
        this.filterlabellocal=undefined;
        pubsub.fire('applyfilters', undefined );
        this.loadAtpChecklistsdata();
    }
    addnewdiscrepancymodal(event){
        this.newdiscrepancymodal=true;
    }

}