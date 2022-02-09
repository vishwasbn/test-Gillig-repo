import { LightningElement , track} from 'lwc';
import getAuthentication from "@salesforce/apex/userAuthentication.getAccesstoken";
import getBuildstationsdata from '@salesforce/apex/masterDataController.getBuildstationsdata';

const columns = [
     { label: 'Build Station Code', fieldName: 'buildstation_code',sortable: true, type: 'text', },
     { label: 'Operation', fieldName: 'operation',sortable: true, type : 'text',},
     {
         label: "Created Date",
         fieldName: "created_date",
         type: "date",
         sortable: true,
         typeAttributes:{
             year: "numeric",
             month: "short",
             day: "2-digit",
             hour: "2-digit",
             minute: "2-digit"
         }
     },
     /*{label: 'Action', type: 'button', initialWidth: 180, typeAttributes:
                 { label: 'Update/Delete', title: 'Click to Edit', name: 'Update/Delete', iconName: 'utility:edit', class: 'btn_next'}},
     {
         label: 'Edit',
         type: 'button-icon',
         initialWidth: 75,
         typeAttributes: {
             name:'Edit',
             iconName: 'utility:edit_form',
             title: 'Edit',
             variant: 'border-filled',
             alternativeText: 'Edit'
         }
     },*/
 ];


export default class ListbuildStationsComponent extends LightningElement {
    @track columns = columns;
    @track showSpinner;
    @track record = {};
    @track rowOffset = 0;
    @track bShowModal = false;
    @track addmodal = false;
    @track defaultSortDirection = 'asc';
    @track sortDirection = 'asc';
    @track sortedBy;
    @track buildstationList;
    @track factoryoptions;
    @track defaultFactory = 'None';
    @track showTable = false; //Used to render table after we get the data from apex controller    
    @track recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset; //Row number
    //@track customerlist = ['Ajay','Arjun','Abhiraj','Ben','Alan','Navaneeth'];
    get tableHeight() {
        var height = window.innerHeight * 0.82 - 247.59;
        return `height: ${height}px;`;
    }

    connectedCallback(){
        //alert('connectedCallback');
          // Get Authentication Details
          const authdata = undefined;//localStorage.getItem('authenticationdata');
          if(authdata == undefined || authdata == null){
            getAuthentication()
            .then(result => {
                this.showSpinner = true;
                var authdataresult = JSON.stringify(result);
                this.authorisationdata = authdataresult;
                localStorage.setItem('authenticationdata', authdataresult);
                this.loaddata(authdataresult);
    
            })
            .catch(error => {
                
            });
            
          }
          else{
            var authdataresult = localStorage.getItem('authenticationdata');
            this.authorisationdata = authdataresult;
            this.loaddata(authdataresult);
          }
          
    
      }

      loaddata(authorisationdata){
        getBuildstationsdata({authdata:authorisationdata})
        .then(data => {
            debugger
            //alert('Inside Wire');
            
            // Set the access token
            const accesstokenlatest = data.latestaccesstoken;
            var authdata = JSON.parse(localStorage.getItem('authenticationdata'));
            authdata.access_token = accesstokenlatest;
            var authdataresult = JSON.stringify(authdata);
            localStorage.setItem('authenticationdata', authdataresult);
            // Set the access token

            // Set table data
            this.buildstationList = data.objectdata;
            this.factoryoptions = data.factoryPickList;
            this.showTable = true;
            //this.userdataList = data.userdata;
            // Set table data
            this.showSpinner = false;
    
            this.error = undefined;
            // Setting Up User Data
        })
        .catch(error => {
            this.error = error;
            this.buildstationList = undefined;
        });
    }
    
    //Capture the event fired from the paginator component
    handlePaginatorChange(event){
        this.recordsToDisplay = event.detail;
        this.rowNumberOffset = this.recordsToDisplay[0].rowNumber-1;
    }
      

    // Used to sort the columns
    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
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
        this.bShowModal = true; // display modal window
    }
 
    // to close modal window set 'bShowModal' tarck value as false
    closeModal() {
        this.bShowModal = false;
    }

    closeAddModal() {
        this.addmodal = false;
    }

    addnew(){
        this.addmodal = true;
    }
}