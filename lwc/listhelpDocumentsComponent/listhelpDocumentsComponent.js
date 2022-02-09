import {
	LightningElement,
	track
} from 'lwc';

import {
	ShowToastEvent
} from "lightning/platformShowToastEvent";

import getDepartmentdata from "@salesforce/apex/UserListingController.getallDepartments";
import getFleetsdata from '@salesforce/apex/masterDataController.getFleetsdata';
import getAllHelpDocs from "@salesforce/apex/ecardOperationsController.getAllHelpDocs";
import addnewHelpDocs from "@salesforce/apex/ecardOperationsController.addnewHelpDocs";
import updateHelpDocs from "@salesforce/apex/ecardOperationsController.updateHelpDocs";
import deleteHelpDocs from "@salesforce/apex/ecardOperationsController.deleteHelpDocs";
import getrepopresigneds3Url from "@salesforce/apex/ecardOperationsController.getrepopresigneds3Url";

const columns = [{
    label: 'Fleet',
    fieldName: 'fleet_name',
    sortable: true,
    type: 'text',
},
{
    label: 'Department',
    fieldName: 'department_name',
    sortable: true,
    type: 'text',
},
{
    label: 'File',
    //fieldName: 'help_document_url',
    sortable: true,
	type: 'button',
	typeAttributes: {
		label: { fieldName: "help_document_url" },
		title: 'Click to Open',
		name: 'Open',
		class: 'btn_next'
	}
},
{
    label: 'Action',
    type: 'button',
    typeAttributes: {
        label: 'Update/Delete',
        title: 'Click to Edit',
        name: 'Update',
        iconName: 'utility:edit',
        class: 'btn_next'
    }
},

];
export default class ListhelpDocumentsComponent extends LightningElement {
    @track columns = columns;
	@track showSpinner;
	@track record = {};
	@track rowOffset = 0;
	@track bShowModal = false;
	@track addmodal = false;
	@track defaultSortDirection = 'asc';
	@track sortDirection = 'asc';
	@track sortedBy;
	@track helpdoclist = [];
	@track showTable = false; //Used to render table after we get the data from apex controller    
	@track recordsToDisplay = []; //Records to be displayed on the page
	@track rowNumberOffset = 1; //Row number
	@track error;

	newhelpdoc;
	departmentlistoptions = [];

	get returntrue() {
		return true;
	}

	connectedCallback() {
		this.loaddata();
		this.getfleetsvalues();
		this.getdepartmentvalues();
	}

	loaddata() {
		this.showSpinner = true;
		this.showTable = false;
		getAllHelpDocs()
			.then((data) => {
				var alldata = JSON.parse(data.responsebody).data.help_document;
				// Set table data
				for(var i in alldata){
					alldata[i].department_id = alldata[i].department_id.toString();
					alldata[i].fleet_id = alldata[i].fleet_id.toString();
				}
				this.helpdoclist = alldata;
				this.showTable = true;
				this.showSpinner = false;
				this.error = undefined;

			})
			.catch((error) => {
				this.error = error;
				const alertmessage = new ShowToastEvent({
					title: "Help Document Data fetch failed.",
					message: "Something unexpected occured. Please contact your Administrator",
					variant: "error"
				});
				this.dispatchEvent(alertmessage);
			});
	}

	//Capture the event fired from the paginator component
	handlePaginatorChange(event) {
		this.recordsToDisplay = event.detail;
		if(this.recordsToDisplay[0] != undefined){
			this.rowNumberOffset = this.recordsToDisplay[0].rowNumber - 1;
		}
	}


	fleetList = [];
	fleetlistoptions = [];
	fleetlisttosearch = [];
	getfleetsvalues(event){
		var authdata='Need to be deleted from apex';
		getFleetsdata({authdata:authdata})
        .then(data => {
			var fleetlisttosearch = ["ALL FLEETS"];
		    var fleetoptions=[{"value":"0","label":"ALL FLEETS"}];
			this.fleetList = data.objectdata;
			for(var i in this.fleetList){
				var fleet = {
					'value' : this.fleetList[i].fleet_id.toString(),
					'label' : this.fleetList[i].fleet_name
				};
				fleetoptions.push(fleet);
				fleetlisttosearch.push(this.fleetList[i].fleet_name);
			}
			this.fleetlisttosearch = fleetlisttosearch;
			this.fleetlistoptions = fleetoptions;
            this.error = undefined;
            
        })
        .catch(error => {
            this.error = error;
			this.fleetList = undefined;
			this.fleetlistoptions = [];
        });
	}

	// To get Department data from Server
	getdepartmentvalues(event) {
		getDepartmentdata()
		  .then((result) => {
			//debugger
			var departmentlistvalues = [{"value":"000","label":"ALL DEPARTMENTS"}];
			var departmentsvalues = JSON.parse(result.responsebody).data.departments;

            for(var i in departmentsvalues){
                var option = {
                    'value': departmentsvalues[i].department_id.toString(),
                    'label': departmentsvalues[i].department_name,
                };
                if(departmentsvalues[i].is_assembly_line){
                    departmentlistvalues.push(option);
                }
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
	handleRowAction(event) {
		const actionName = event.detail.action.name;
		const row = event.detail.row;
		this.record = row;
		if(actionName=='Update'){
			this.bShowModal = true; // display modal window
		}else if(actionName=='Open'){
			if(this.record.help_document_url != ''){
				var s3files=[];
				s3files.push(this.record.help_document_url);
				var requestbody = {
				  's3_file_paths' : JSON.stringify(s3files)
				};
				this.gets3urls(JSON.stringify(requestbody));
			  }
		}
	}

	
	// to close modal window set 'bShowModal' tarck value as false
	closeModal() {
		this.bShowModal = false;
	}

	closeAddModal() {
		this.addmodal = false;
	}

	addnew() {
		this.newhelpdoc = {
			"fleet_id": undefined,
			"department_id": undefined,
			"help_document_url" : undefined
		};
		this.addmodal = true;
	}

	// Update Fleet selected in new record
	onfleetselection(event) {
		if (event.detail.labelvalue == "Select a Fleet") {
			var selectedfleet = event.detail.selectedRecord;
			for (var fleet in this.fleetlistoptions) {
				if (selectedfleet == this.fleetlistoptions[fleet].label) {
					this.newhelpdoc.fleet_id = this.fleetlistoptions[fleet].value;
				}
			}
		}
	}

	// On clearing the fleet selection.
	onclearfleet(event) {
		this.newhelpdoc.fleet_id = undefined;
	}

	tracknewvaluechange(event) {
		this.newhelpdoc[event.target.name] = event.target.value;
	}

	addnewrecord(event) {
		// Check Validations
		const allValid = [...this.template.querySelectorAll('.newrecordvalidation')]
			.reduce((validSoFar, inputCmp) => {
				inputCmp.reportValidity();
				return validSoFar && inputCmp.checkValidity();
			}, true);
		if (allValid && this.newhelpdoc.fleet_id != undefined) {
			addnewHelpDocs({
					requestbody: JSON.stringify(this.newhelpdoc)
				})
				.then((data) => {
					if (data.isError) {
						if (data.errorMessage == 202) {
							const alertmessage = new ShowToastEvent({
								title: "Sorry we could not complete the operation.",
								message: JSON.parse(data.responsebody).data.validation_message,
								variant: "error"
							});
							this.dispatchEvent(alertmessage);
						} else {
							const alertmessage = new ShowToastEvent({
								title: "Sorry we could not complete the operation.",
								message: 'Please contact the System Administrator.',
								variant: "error"
							});
							this.dispatchEvent(alertmessage);
						}
					} else {
						const alertmessage = new ShowToastEvent({
							title: " Success",
							message: "Record added successfully.",
							variant: "success"
						});
						this.dispatchEvent(alertmessage);
						this.addmodal = false;
						this.showSpinner = false;
						this.loaddata();

					}
				})
				.catch((error) => {
					this.error = error;
					const alertmessage = new ShowToastEvent({
						title: "Sorry we could not complete the operation.",
						message: "Something unexpected occured. Please contact your Administrator",
						variant: "error"
					});
					this.dispatchEvent(alertmessage);
					this.showSpinner = false;
				});

		} else {
			const alertmessage = new ShowToastEvent({
				title: "Please fill in all the required fields.",
				message: "Please fill in all the required fields.",
				variant: "warning"
			});
			this.dispatchEvent(alertmessage);
		}
	}

	deleterecord(event) {
		var status = confirm("Are you sure you want to delete this record ?");
		if (status) {
			var deactivatedata = {
				'help_document_id' : this.record.help_document_id
			};
			deleteHelpDocs({
					requestbody: JSON.stringify(deactivatedata)
				})
				.then((data) => {
					if (data.isError) {
						const alertmessage = new ShowToastEvent({
							title: "Sorry we could not complete the operation.",
							message: "Something unexpected occured. Please contact your Administrator",
							variant: "error"
						});
						this.dispatchEvent(alertmessage);
						this.showSpinner = false;
					} else {
						const alertmessage = new ShowToastEvent({
							title: " Success",
							message: "Record Deleted Successfully.",
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
						message: "Something unexpected occured. Please contact your Administrator",
						variant: "error"
					});
					this.dispatchEvent(alertmessage);
					this.showSpinner = false;
				});
		}
	}

	trackchangeonupdate(event) {
		this.record[event.target.name] = event.target.value;
	}

	updaterecord(event) {
		// Check Validations
		const allValid = [...this.template.querySelectorAll('.updatevalidation')]
			.reduce((validSoFar, inputCmp) => {
				inputCmp.reportValidity();
				return validSoFar && inputCmp.checkValidity();
			}, true);
		if (allValid) {
			var requestbody = {
				"help_document_id": this.record.help_document_id,
				"help_document_url": this.record.help_document_url
			};
			updateHelpDocs({
					requestbody: JSON.stringify(requestbody)
				})
				.then((data) => {
					if (data.isError) {
						if (data.errorMessage == 202) {
							const alertmessage = new ShowToastEvent({
								title: "Sorry we could not complete the operation.",
								message: JSON.parse(data.responsebody).data.validation_message,
								variant: "error"
							});
							this.dispatchEvent(alertmessage);
						} else {
							const alertmessage = new ShowToastEvent({
								title: "Sorry we could not complete the operation.",
								message: 'Please contact the System Administrator.',
								variant: "error"
							});
							this.dispatchEvent(alertmessage);
						}
					} else {
						const alertmessage = new ShowToastEvent({
							title: " Success",
							message: "Record updated successfully.",
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
						message: "Something unexpected occured. Please contact your Administrator",
						variant: "error"
					});
					this.dispatchEvent(alertmessage);
					this.showSpinner = false;
				});

		} else {
			const alertmessage = new ShowToastEvent({
				title: "Please fill in all the required fields.",
				message: "Please fill in all the required fields/validations.",
				variant: "warning"
			});
			this.dispatchEvent(alertmessage);
		}
	}
	
	// To get s3URL
	gets3urls(requestbody){
			getrepopresigneds3Url({ requestbody: requestbody })
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
				  //var vinandemissionurl = this.vinandemissionurl;
				  var presigned_urls = JSON.parse(data.responsebody).data.presigned_url;
				  console.log('Presigned URL ::' +presigned_urls[0].s3url);
				  window.open(presigned_urls[0].s3url,'_blank');
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
}