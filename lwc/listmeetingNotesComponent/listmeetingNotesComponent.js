import {
	LightningElement,
	track
} from 'lwc';

import {
	ShowToastEvent
} from "lightning/platformShowToastEvent";

import getDepartmentdata from "@salesforce/apex/UserListingController.getallDepartments";
import getrepopresigneds3Url from "@salesforce/apex/ecardOperationsController.getrepopresigneds3Url";
import getAllMeetingNotes from "@salesforce/apex/ecardOperationsController.getAllMeetingNotes";
import addnewMeetingNote from "@salesforce/apex/ecardOperationsController.addnewMeetingNote";
import updateMeetingNote from "@salesforce/apex/ecardOperationsController.updateMeetingNote";
import deleteMeetingNote from "@salesforce/apex/ecardOperationsController.deleteMeetingNote";
import getFleetsdata from '@salesforce/apex/masterDataController.getFleetsdata';


const columns = [{
		label: 'Fleet',
		fieldName: 'fleet_name',
		sortable: true,
        type: 'text',
        intialwidth : 200,
	},
	{
		label: 'Department',
		initialWidth: 200,
		fieldName: 'department_name',
		sortable: true,
		type: 'text',
	},
	{
		label: 'File',
		//fieldName: 'meeting_note_url',
		initialWidth: 550,
		sortable: true,
		type: 'button',
		typeAttributes: {
			label: { fieldName: "meeting_note_url" },
			title: 'Click to Open',
			name: 'Open',
			class: 'btn_next'
		}
	},
	{
		label: 'Action',
		initialWidth: 200,
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

export default class ListmeetingNotesComponent extends LightningElement {
	@track columns = columns;
	@track showSpinner;
	@track record = {};
	@track rowOffset = 0;
	@track bShowModal = false;
	@track addmodal = false;
	@track defaultSortDirection = 'asc';
	@track sortDirection = 'asc';
	@track sortedBy;
	@track meetingnoteslist = [];
	@track showTable = false; //Used to render table after we get the data from apex controller    
	@track recordsToDisplay = []; //Records to be displayed on the page
	@track rowNumberOffset; //Row number
	@track error;

	newmeetingnote;
	departmentlistoptions = [];

	get returntrue() {
		return true;
	}

	connectedCallback() {
		this.loaddata();
		//this.getAllEcarddetails();
		this.getdepartmentvalues();
		this.getfleetsvalues();
	}

	loaddata() {
		this.showSpinner = true;
		this.showTable = false;
		getAllMeetingNotes()
			.then((data) => {
				var alldata = JSON.parse(data.responsebody).data.meeting_note;
				// Set table data
				for(var i in alldata){
					alldata[i].department_id = alldata[i].department_id.toString();
					alldata[i].fleet_id = alldata[i].fleet_id.toString();
				}
				this.meetingnoteslist = alldata;
				this.showTable = true;
				this.showSpinner = false;
				this.error = undefined;

			})
			.catch((error) => {
				this.error = error;
				const alertmessage = new ShowToastEvent({
					title: "Meeting Notes Data fetch failed.",
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
			if(this.record.meeting_note_url != ''){
				var s3files=[];
				s3files.push(this.record.meeting_note_url);
				var requestbody = {
				  's3_file_paths' : JSON.stringify(s3files)
				};
				this.gets3urls(JSON.stringify(requestbody));
			  }
		}

	}
	/*
	ecardnamechasislist = [];
	ecardoptions = [];
	//To get all Ecard Details from Server
	getAllEcarddetails(event) {
		getAllEcarddetailsfromServer()
			.then((result) => {
				var ecards = JSON.parse(result.response).data.ecard;
				var ecardoptions = [];
				for (var ec in ecards) {
					//${ecards[ec].first_name} ${ecards[ec].customer_name}
					var ecardopt = {
						label: `${ecards[ec].customer_name}`,
						value: ecards[ec].ecard_id.toString()
					};
					ecardoptions.push(ecardopt);
				}
				this.ecardoptions = ecardoptions;
				var ecardnamelist = [];
				for (var ecard in this.ecardoptions) {
					ecardnamelist.push(this.ecardoptions[ecard].label);
				}
				this.ecardnamechasislist = ecardnamelist;
			})
			.catch((error) => {
				const alertmessage = new ShowToastEvent({
					title: "Failed to fetch list of Bus.",
					message: "Something unexpected occured. Please contact your Administrator",
					variant: "error"
				});
				this.dispatchEvent(alertmessage);
			});
	}*/

	/*
	// Update Bus/Ecard selected in new record
	onbusselection(event) {
		if (event.detail.labelvalue == "Select a Bus") {
			var selectedbus = event.detail.selectedRecord;
			for (var ecard in this.ecardoptions) {
				if (selectedbus == this.ecardoptions[ecard].label) {
					this.newmeetingnote.ecard_id = this.ecardoptions[ecard].value;
				}
			}
		}
	}

	// On clearing the bus selection.
	onclearbus(event) {
		this.newmeetingnote.ecard_id = undefined;
	}*/

	// to close modal window set 'bShowModal' tarck value as false
	closeModal() {
		this.bShowModal = false;
	}

	closeAddModal() {
		this.addmodal = false;
	}

	addnew() {
		this.newmeetingnote = {
			"fleet_id": undefined,
			"department_id":undefined,
			"meeting_note_url": undefined
		};
		this.addmodal = true;
	}

	tracknewvaluechange(event) {
		this.newmeetingnote[event.target.name] = event.target.value;
	}

	addnewrecord(event) {
		// Check Validations
		const allValid = [...this.template.querySelectorAll('.newrecordvalidation')]
			.reduce((validSoFar, inputCmp) => {
				inputCmp.reportValidity();
				return validSoFar && inputCmp.checkValidity();
			}, true);
		if (allValid && this.newmeetingnote.fleet_id != undefined) {
			addnewMeetingNote({
					requestbody: JSON.stringify(this.newmeetingnote)
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
				'meeting_note_id' : this.record.meeting_note_id
			};
			deleteMeetingNote({
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
				"meeting_note_id": this.record.meeting_note_id,
				"meeting_note_url": this.record.meeting_note_url
			};
			updateMeetingNote({
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

	// Update Fleet selected in new record
	onfleetselection(event) {
		if (event.detail.labelvalue == "Select a Fleet") {
			var selectedfleet = event.detail.selectedRecord;
			for (var fleet in this.fleetlistoptions) {
				if (selectedfleet == this.fleetlistoptions[fleet].label) {
					this.newmeetingnote.fleet_id = this.fleetlistoptions[fleet].value;
				}
			}
		}
	}

	// On clearing the fleet selection.
	onclearfleet(event) {
		this.newmeetingnote.fleet_id = undefined;
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

}