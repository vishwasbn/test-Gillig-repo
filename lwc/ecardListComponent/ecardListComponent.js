import { LightningElement, track } from 'lwc';
import BusImage from "@salesforce/resourceUrl/DefaultEcardImage";
import getEcarddataWrapper from '@salesforce/apex/ecardListController.getEcarddataWrapper';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getPicklistOptions from "@salesforce/apex/scheduleBoardController.getPicklistOptions";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import getecardpdf from '@salesforce/apex/ecardListController.getecardpdf';
import pubsub from 'c/pubsub' ; 

import docraptorkey from '@salesforce/label/c.EcardDocraptorkey';

import {permissions}  from 'c/userPermissionsComponent';
import getPermissions from "@salesforce/apex/userAuthentication.getPermissions";

export default class EcardListComponent extends LightningElement {
    busImage = BusImage;
    nodatadessert = noDatadessert;
    @track error; // to track the error occuring 
    @track showSpinner; // to show loading spinner
    @track showTable = false; //Used to render table after we get the data from apex controller.
    @track filteredecards = []; // Used to store the filtered ECard list.
    @track completeecarddata; // To store the complete data from server of Ecard list.
    @track showops = false;  // To decide between displaying ecard detial and detail view.
    // For Filters
    @track selectedBusType = 'All Bus Type';
    @track selectedBusStatus = 'WIP';
    @track selectedBusPropulsion = 'All Propulsion Types';
    @track selectedCustomer;
    @track customer;
    @track itemstosearch = []; // list of customer and chasis number
    @track busstatuslist =[{'label': 'WIP', 'value' : 'WIP'}];
    @track bustypelist = [{'label': 'All Bus Type', 'value' : 'All Bus Type'}];
    @track buspropulsionlist = [{'label': 'All Propulsion Types', 'value' : 'All Propulsion Types'}];
    @track partShortageFilter = false;
    @track discrepancyFilter = false;
    @track retaincustomer;
    @track fromshowEcardList=false;

    // For Sorting
    @track sortedDirection = 'asc';
    @track sortedColumn;
    @track previousColumn;
    //For Operations View
    @track selectedEcardId;
    @track selectedBusLabel;
    @track selectedBusChasis;
    @track selectedBusName;
    @track selectedview='Operations';
    @track previousview = 'Operations';
    @track status = 'WIP';


    @track showbusoverview;

     // Use whenever a false attribute is required in Component.html
     get returnfalse(){
      return false;
    }

    // Use whenever a true attribute is required in Component.html
     get returntrue(){
     return true;
     }


    get isSelectedOperations(){
      return this.selectedview === 'Operations';
    }
    get isSelectedDiscrepancies(){
      return this.selectedview === 'Discrepancies';
    }
    get isSelectedShortages(){
      return this.selectedview === 'Shortages';
    }
    get isSelectedSlnologs(){
      return this.selectedview === 'Serial No. Logs';
    }

    get isecardlistempty(){
      //alert(this.filteredecards.length);
      return this.filteredecards.length == 0;
    }

    // To get the app permissions from server to handle access within the component.
    wiredPermissions;
    permissionset;
    getPermissionsfromserver(event){
        getPermissions()
          .then((data) => {
            this.wiredPermissions = JSON.parse(data.responsebody);
            this.permissionset = permissions(this.wiredPermissions);
            this.error = undefined;
          })
          .catch((error) => {
            this.error = error;
            this.wiredPermissions = undefined;
          });
      }

    // Loads the default data for intial view of the component.  
    connectedCallback(){
      loadStyle(this, HideLightningHeader);
      this.register();
      this.getPermissionsfromserver();
      this.decideview(event);
      }

    // To decide the view between Ecard list or detail of the selected Ecard.  
    decideview(event){
      // Show List or Operations
      //debugger
      var ecardid = JSON.parse(localStorage.getItem('ecardid'));
      if(ecardid == undefined || ecardid == null){
          this.showops = false;
          this.showTable = true;
          this.loaddata();
      }
      else{
          this.showops = true;
          this.showTable = false;
          this.selectedEcardId = ecardid.ecardid;
          this.selectedBusLabel = `${ecardid.BusName}, ${ecardid.ChasisNumber}`;
          this.selectedBusChasis = ecardid.ChasisNumber;
          this.selectedBusName = ecardid.BusName;
          this.sequence = ecardid.busSequence!=undefined?ecardid.busSequence.replace(/[{()}]/g, ''):'';
          this.sequanceavailable=ecardid.busSeqavailable;
          localStorage.removeItem('ecardid');
          localStorage.setItem('opsecardid', JSON.stringify(ecardid));
          this.showSpinner = false;
      }
    }
    // In order to reduce the callout limit we are fetching the picklist values of filter only on focus.
    loadpicklistvalues(event){
      var picklistname = event.target.name;
      if(event.target.options.length == 1){
        getPicklistOptions({picklistName:picklistname})
        .then(data => {
         if(data.isError){
            const alertmessage = new ShowToastEvent({
                title : 'Data fetch failed.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            throw 'Data fetch failed';
         }
         else{
             var options = data.options;
             if(picklistname == 'bustype'){
                this.bustypelist = options;
             }
             if(picklistname == 'buspropulsions'){
                this.buspropulsionlist = options;
             }
             if(picklistname == 'busstatus'){
                //this.busstatuslist = options;
                for( var i = 0; i < options.length; i++){ 
                  if ( options[i].value === 'Staging' || options[i].value === 'Sold' ) { 
                    options.splice(i, 1); 
                  }
                }
                this.busstatuslist = options;
             }
         }
     })
     .catch(error => {
        this.error = error;
        //alert('Some error has occured please contact your Admin' + JSON.stringify(error));
        const alertmessage = new ShowToastEvent({
            title : 'Data fetch failed.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
        
     });
      }
    }
    // Load the list view of Ecards.
    loaddata(){
      var today = new Date();
      var start = today;
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
      console.log('E-Card :- Time before excuting API call :', time );
      this.showSpinner = true;
      var statuslist=[];
      if(this.status!='All Bus Status'){
        statuslist.push(this.status.replaceAll(" ", "%20"));
      }
      var statusparm={bus_status:statuslist};
        getEcarddataWrapper({status : JSON.stringify(statusparm)})
        .then(data => {
            today = new Date();
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
            var elapsed = today. getTime() - start;
            console.log('E-Card :- Time after excuting API call :', time );
            console.log('E-Card :- Time Difference in milliseconds:', elapsed);
            // Setting up data to view End
            let moddedecardlist = [];
            let searchlist = [];
            for (var index in data.ecarddata) {
                var ecard = data.ecarddata[index];
                var seqavailable=ecard.bus_relative_seq!=undefined?true:false;
                var imgdefault=(ecard.curb_side_image_url=="" || ecard.curb_side_image_url==null )?true:false;
                var showwc=true;
                if( ecard.workcenter_name =='9999' || ecard.workcenter_name =='0' ||  
                    ecard.workcenter_name == undefined || ecard.workcenter_name ==null){
                  showwc=false;
                }                
                searchlist.push(ecard.customer_name);
                searchlist.push(ecard.chassis_no);
                var formatteddate = new Date(ecard.schedule_date).valueOf();
                var source = { styleclass: ' ', 
                               validecard:' ',
                               showworkcenter:showwc,
                               formattedscheduledate: formatteddate,
                               defaultimage:imgdefault,
                               sequanceavailable:seqavailable
                              };
                let modifiedecard = Object.assign(source,ecard);
                //modifiedecard.seqavailable=seqavailable;
                moddedecardlist.push(modifiedecard);
            }
            this.itemstosearch = Array.from(new Set(searchlist));
            this.completeecarddata = moddedecardlist;
            this.filteredecards = moddedecardlist;
            // Setting up data to view End
            this.showSpinner = false;
            var pageload = new Date();
            time = pageload.getHours() + ":" + pageload.getMinutes() + ":" + pageload.getSeconds()+":"+pageload.getMilliseconds();
            elapsed = pageload. getTime() - today;
            console.log('E-Card :- Time after Page Load :', time );
            console.log('E-Card :- Time Page Load in milliseconds:', elapsed);
            this.error = undefined;
            
        })
        .catch(error => {
            this.error = error;
            const alertmessage = new ShowToastEvent({
              title : 'Data fetch failed.',
              message : 'Something unexpected occured. Please contact your Administrator',
              variant : 'error'
          });
          this.dispatchEvent(alertmessage);  
        });
      }
    // To handle all the filter changes and filter the ecard list based on the filter conditions.  
    handleallFilterchanges(event){
        var selectedbustype = this.selectedBusType;
        var selectedcustomer = this.selectedCustomer;
        var selectedpropulsion = this.selectedBusPropulsion
        var selectedbusstatus = this.selectedBusStatus;
        if(this.fromshowEcardList){
          this.loaddata();
          this.fromshowEcardList=false;
        }
        //var partShortageFilter = this.partShortageFilter;
        //var discrepancyFilter = this.discrepancyFilter;
        this.showSpinner = true;
        var filteredecardlist = [];
        var completedata = JSON.parse(JSON.stringify(this.completeecarddata));
        for (var index in completedata) {
                var ecard = completedata[index];
                var ecardStyle = ecard.styleclass;
                if (selectedcustomer != undefined) {
                    if (ecard.customer_name == selectedcustomer || ecard.chassis_no == selectedcustomer) {

                    } else {
                        ecard.styleclass = ecardStyle + ' makeinvisible';
                        }
                }
                if (selectedbustype != undefined && selectedbustype != 'All Bus Type') {
                    if (ecard.bustype_name == selectedbustype) {

                    } else {
                        ecard.styleclass = ecardStyle + ' makeinvisible';
                       }
                }
                if (selectedbusstatus != undefined && selectedbusstatus != 'All Bus Status') {
                  if (ecard.busstatus_name == selectedbusstatus) {

                  } else {
                    ecard.styleclass = ecardStyle + ' makeinvisible';
                  }
              }
              if (selectedpropulsion != undefined && selectedpropulsion != 'All Propulsion Types') {
                if (ecard.buspropulsion_name == selectedpropulsion) {

                } else {
                    ecard.styleclass = ecardStyle + ' makeinvisible';
                }
            }
              
            /*  if(partShortageFilter){
                if (ecard.hasPartshortage != partShortageFilter) {
                     ecard.styleclass = ecardStyle + ' makeinvisible';
                } else {
                   
                }
              }
              if(discrepancyFilter){
                if (ecard.hasDiscrepancy != discrepancyFilter) {
                    ecard.styleclass = ecardStyle + ' makeinvisible';
                } else {
                   
                }
              }
              if(partShortageFilter && discrepancyFilter){
                if ((ecard.hasPartshortage != partShortageFilter) && (ecard.hasDiscrepancy != discrepancyFilter)) {
                    ecard.styleclass = ecardStyle + ' makeinvisible';
                } else {
                   
                }
            } */
            // setting up filteredbus
              if(!ecard.styleclass.includes("makeinvisible"))
              filteredecardlist.push(ecard);
            }
        this.filteredecards = filteredecardlist;
        this.showSpinner = false;
     }

    // To handle when a selected customer/chassis number needs to be cleared.
    onclearcustomer(event) {
        this.selectedCustomer = undefined;
        this.retaincustomer =undefined;
        this.handleallFilterchanges(event);
      }
    // To handle the search result when a customer is selected from the list.
    handleSearch(event) {
        if (event.detail.labelvalue == "Customer") {
            this.selectedCustomer = event.detail.selectedRecord;
            this.retaincustomer=event.detail.selectedRecord;
         }
        this.handleallFilterchanges(event);
      }

    // To handle  when filter on Bus Propulsion is selected.  
    handlebuspropulsionchange(event){
      this.selectedBusPropulsion = event.detail.value;
      this.handleallFilterchanges(event);
      }

    // To handle  when filter on Bus Status is selected.
    handlebusstatuschange(event){
     this.selectedBusStatus = event.detail.value;
     this.status = event.detail.value;
     this.loaddata();
     //this.handleallFilterchanges(event);
      }
      
    // To handle  when filter on Bus Type is selected.  
    handlebustypechange(event) {
      this.selectedBusType = event.detail.value;
      this.handleallFilterchanges(event);
      }

    // To handle  when filter on Part Shortage is selected.  
    onPartShortageselection(event) {
      this.partShortageFilter = event.target.checked;
      this.handleallFilterchanges(event);
      }
  
    // To handle  when filter on Discrepancy is selected.  
    onDiscrepancyselection(event) {
      this.discrepancyFilter = event.target.checked;
      this.handleallFilterchanges(event);
      }

    // To handle sort on columns in Bus/Ecard view. 
    sort(event) {
        var previousSorted = this.previousColumn;
        if(previousSorted !=undefined){
            if(event.currentTarget.dataset.id != previousSorted){
               const element = this.template.querySelector('[data-id="' + previousSorted +'"]');
               element.iconName = '';
               this.previousColumn = event.currentTarget.dataset.id;
            }
            else{
                this.previousColumn = event.currentTarget.dataset.id;
            }
        }
        else{
            this.previousColumn = event.currentTarget.dataset.id;
        }
        
        
        if(this.sortedColumn === event.currentTarget.dataset.id){
            this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';
        }else{
            this.sortedDirection = 'asc';
        }        
        var reverse = this.sortedDirection === 'asc' ? 1 : -1;
        let table = JSON.parse(JSON.stringify(this.filteredecards));
        table.sort((a,b) => {return a[event.currentTarget.dataset.id] > b[event.currentTarget.dataset.id] ? 1 * reverse : -1 * reverse});
        this.sortedColumn = event.currentTarget.dataset.id;        
        this.filteredecards = table;
        if(this.sortedDirection === 'asc'){
            event.target.iconName='utility:chevronup';
        }
        if(this.sortedDirection === 'desc'){
            event.target.iconName='utility:chevrondown';
        }

    } 

    // Used to change the style and get data for the tab selected. (Operations/Discrepancies/Shortages/Serial No.logs)
    changeview(event){
      this.selectedview = event.currentTarget.dataset.label;
      event.target.variant = 'brand';
      if(this.selectedview != this.previousview){
        var element = this.template.querySelector('[data-label="' + this.previousview +'"]');
        element.variant = '';
        this.previousview = event.currentTarget.dataset.label;
        this.template.querySelector('c-operations-component').operationchanged(this.selectedview);
      }
    }

    // To register the event fired from Bus Overview component
    register(){
      console.log('event registered ');
      pubsub.register('applyfilters', this.applyfilters.bind(this));
    }

    // To change the tab selected when a filter from Bus Overview is been applied.
    applyfilters(messageFromEvt){
      if(messageFromEvt != undefined){
        var valueforfilters = JSON.parse(messageFromEvt);
      this.selectedview = valueforfilters.view;
      var ele = this.template.querySelector('[data-label="' + this.selectedview +'"]');
      ele.variant = 'brand';
      if(this.selectedview != this.previousview){
        var element = this.template.querySelector('[data-label="' + this.previousview +'"]');
        element.variant = '';
        this.previousview = valueforfilters.view;
        this.template.querySelector('c-operations-component').operationchanged(this.selectedview, messageFromEvt);
      }
      else{
        this.template.querySelector('c-operations-component').operationchanged(this.selectedview, messageFromEvt);
      }
      }
      else{
        this.template.querySelector('c-operations-component').operationchanged(this.selectedview, undefined);
      }
      
    }

    // To show the operations/details tab of a Selected Ecard.
    @track sequence;
    @track sequanceavailable;
    showOperations(event){
      this.showops = true;
      this.showTable = false;
      let chasis = event.currentTarget.dataset.id;
      let customer = event.currentTarget.dataset.label;
      this.customer = customer;
      this.sequence = event.currentTarget.dataset.sequence;
      this.sequanceavailable=this.sequence==undefined?false:true;
      this.selectedEcardId = event.currentTarget.dataset.value;
      this.selectedBusChasis = chasis;
      this.selectedBusName = customer;
      this.selectedBusLabel = `${customer}, ${chasis}`;
    }

    // To show the Ecard list when redirecting back from a detail of an Ecard.
    showEcardList(event){
        this.showops = false;
        this.showTable = true;
        this.selectedview='Operations';
        this.previousview = 'Operations';
        if(this.filteredecards.length!=0){
          this.fromshowEcardList=true;
          this.handleallFilterchanges(event);
        }
        else{
          this.connectedCallback();
        }
        
      }

    async downloadecard(event){
      var ecardid=event.currentTarget.dataset.id;
      var pdfurl=undefined;
      this.showSpinner = true;
      debugger;
      await getecardpdf({ ecardid: ecardid })
      .then((data) => {
          if (data.isError) {
              const alertmessage = new ShowToastEvent({
              title: "Failed to fetch Ecard PDF url.",
              message:"Something unexpected occured. Please contact your Administrator",
              variant: "error"
          });
          this.dispatchEvent(alertmessage);
          } else {
              debugger;
              var pdfdetails = JSON.parse(data.responsebody).data;
              var htmlcontent= pdfdetails.EcardHtml;
              //var pdfname='E Card-'+this.selectedBusChasis;
              var pdfname=this.customer+'-'+this.selectedBusChasis;
              var pdfkey=docraptorkey;
              //this.createAndDownloadDoc("EpXT7CZoif55g1igYsn", {
              this.createAndDownloadDoc(pdfkey, {  
                  //test: true,
                  type: "pdf",
                  name: pdfname,
                  document_content: htmlcontent
              });              
              this.showSpinner = false;
          }   
      })
      .catch((error) => {
          const alertmessage = new ShowToastEvent({
          title: "Failed to fetch Ecard PDF url.",
          message:"Something unexpected occured. Please contact your Administrator",
          variant: "error"
          });
          this.dispatchEvent(alertmessage);
          this.showSpinner = false;
      });
      }
      // Creates an HTML form with doc_attrs set, submits it. If successful
      // this will force the browser to download a file. On failure it shows
      // the DocRaptor error directly.
      createAndDownloadDoc (api_key, doc_attrs) {
          var makeFormElement = function(name, value) {
            var element = document.createElement("textarea")
            element.name = name
            element.value = value
            return element
          }
      
          var form = document.createElement("form")
          form.action = "https://docraptor.com/docs"
          form.method = "post"
          form.style.display = "none"
      
          form.appendChild(makeFormElement("user_credentials", api_key))
      
          for (var key in doc_attrs) {
            if (key == "prince_options") {
              for (var option in doc_attrs.prince_options) {
                form.appendChild(makeFormElement("doc[prince_options][" + option + "]", doc_attrs.prince_options[option]))
              }
            } else {
              form.appendChild(makeFormElement("doc[" + key + "]", doc_attrs[key]))
            }
          }
          document.body.appendChild(form);
          form.submit()
        }

}