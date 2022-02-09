import { LightningElement, track } from 'lwc';
import BusImage from "@salesforce/resourceUrl/DefaultEcardImage";
//import getPartNumberValidation from '@salesforce/apex/ecardListController.getPartNumberValidation';
import getEcarddataWrapper from '@salesforce/apex/ecardListController.getEcarddataWrapper';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getPicklistOptions from "@salesforce/apex/scheduleBoardController.getPicklistOptions";
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";

import searchpartnumber from "@salesforce/apex/partnumberValidationsController.searchpartnumber";
import getpartnumbersearchlogs from "@salesforce/apex/partnumberValidationsController.getpartnumbersearchlogs";

export default class PartnumberValidationComponent extends LightningElement {
    busImage = BusImage;
    nodatadessert = noDatadessert;
    @track error; // to track the error occuring 
    @track showSpinner; // to show loading spinner
    @track showTable = false; //Used to render table after we get the data from apex controller 
    @track filteredecards = [];
    @track completeecarddata;
    @track showops = false;
    // For Filters
    @track selectedBusType = 'All Bus Type';
    @track selectedBusStatus = 'WIP';
    @track selectedBusPropulsion = 'All Propulsion Types';
    @track selectedCustomer;
    @track itemstosearch = []; // list of customer and chasis number
    @track busstatuslist =[{'label': 'WIP', 'value' : 'WIP'}];
    @track bustypelist = [{'label': 'All Bus Type', 'value' : 'All Bus Type'}];
    @track buspropulsionlist = [{'label': 'All Propulsion Types', 'value' : 'All Propulsion Types'}];
    @track partShortageFilter = false;
    @track discrepancyFilter = false;

    // For Sorting
    @track sortedDirection = 'asc';
    @track sortedColumn;
    @track previousColumn;
    //For Operations View
    @track selectedEcardId;
    @track selectedEcardSequence;
    @track selectedEcardSequenceAvailable;
    @track selectedBusLabel;
    @track selectedBusChasis;
    @track selectedBusName;
    @track selectedview='Operations';
    @track previousview = 'Operations';
    @track status = 'WIP';
    @track retaincustomer;


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


    connectedCallback(){
      loadStyle(this, HideLightningHeader);
      this.showSpinner = true;
      this.decideview(event);
     }

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
          this.selectedEcardSequence = ecardid.bus_relative_seq;
          this.selectedEcardSequenceAvailable = ecardid.sequanceavailable;
          this.selectedBusLabel = `${ecardid.BusName}, ${ecardid.ChasisNumber}`;
          this.selectedBusChasis = ecardid.ChasisNumber;
          this.selectedBusName = ecardid.BusName;
          localStorage.removeItem('ecardid');
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

    loaddata(){
      var today = new Date();
      var start = today;
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
      console.log('PartNumber Validation :- Time before excuting API call :', time );
      var statuslist=[];
      if(this.status!='All Bus Status'){
        statuslist.push(this.status.replaceAll(" ", "%20"));
      }
      //getPartNumberValidation()
      var statusparm={bus_status:statuslist};
      getEcarddataWrapper({status : JSON.stringify(statusparm)})
        .then(data => {
          today = new Date();
          time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+":"+today.getMilliseconds();
          var elapsed = today. getTime() - start;
          console.log('PartNumber Validation :- Time after excuting API call :', time );
          console.log('PartNumber Validation :- Time Difference in milliseconds:', elapsed);          
            // Setting up data to view End
            let moddedecardlist = [];
            let searchlist = [];
            for (var index in data.ecarddata) {
                var ecard = data.ecarddata[index];
                searchlist.push(ecard.customer_name);
                searchlist.push(ecard.chassis_no);
                var formatteddate = new Date(ecard.schedule_date).valueOf();
                var seqavailable=data.ecarddata[index].bus_relative_seq!=undefined?true:false;
                var imgdefault=(ecard.curb_side_image_url=="" || ecard.curb_side_image_url==null )?true:false;
                var source = { styleclass: ' ', validecard:' ',formattedscheduledate: formatteddate,defaultimage: imgdefault,sequanceavailable:seqavailable};
                let modifiedecard = Object.assign(source,ecard);
                moddedecardlist.push(modifiedecard);
            }
            this.itemstosearch = Array.from(new Set(searchlist));
            this.completeecarddata = moddedecardlist;
            this.filteredecards = moddedecardlist;
            // Setting up data to view End
            // Setting Up Filter Data Start
            var filters = data.filters;
            if(filters!=undefined){
              function getoptions(dataList){
                var options = [];
                for (var bustype in dataList) {
                    var option = {
                     label: dataList[bustype],
                     value: dataList[bustype]
                    };
                 options.push(option);
                }
                return options;
            }
            this.buspropulsionlist = getoptions(filters.buspropulsionList);
            this.busstatuslist = getoptions(filters.busstatusList);
            this.bustypelist = getoptions(filters.bustypeList);
            }
            
            // Setting Up Filter Data End
            
            
            this.showSpinner = false;
            var pageload = new Date();
            time = pageload.getHours() + ":" + pageload.getMinutes() + ":" + pageload.getSeconds()+":"+pageload.getMilliseconds();
            elapsed = pageload. getTime() - today;
            console.log('PartNumber Validation :- Time after Page Load :', time );
            console.log('PartNumber Validation :- Time Page Load in milliseconds:', elapsed);
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

    handleallFilterchanges(event){
        var selectedbustype = this.selectedBusType;
        var selectedcustomer = this.selectedCustomer;
        var selectedpropulsion = this.selectedBusPropulsion
        var selectedbusstatus = this.selectedBusStatus;
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

    onclearcustomer(event) {
        this.selectedCustomer = undefined;
        this.retaincustomer = undefined;
        this.handleallFilterchanges(event);
      }

    handleSearch(event) {
        if (event.detail.labelvalue == "Customer") {
            this.selectedCustomer = event.detail.selectedRecord;
            this.retaincustomer = event.detail.selectedRecord;
         }
        this.handleallFilterchanges(event);
      }

    handlebuspropulsionchange(event){
      this.selectedBusPropulsion = event.detail.value;
      this.handleallFilterchanges(event);
      }

    handlebusstatuschange(event){
     this.selectedBusStatus = event.detail.value;
     this.status = event.detail.value;
     this.loaddata();
     //this.handleallFilterchanges(event);
      }
      
    handlebustypechange(event) {
      this.selectedBusType = event.detail.value;
      this.handleallFilterchanges(event);
      }

    onPartShortageselection(event) {
      this.partShortageFilter = event.target.checked;
      this.handleallFilterchanges(event);
      }
  
    onDiscrepancyselection(event) {
      this.discrepancyFilter = event.target.checked;
      this.handleallFilterchanges(event);
      }

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

    @track partnumbersearchdata = [];
    @track searchkeyword ;

    get ispartnumbersearchempty(){
        return this.partnumbersearchdata.length == 0;
    }

    onsearchchange(event){
        this.searchkeyword = event.target.value;
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
           this.searchforpartnumber();
        }
    }

    showOperations(event){
      this.showops = true;
      this.showTable = false;
      let chasis = event.currentTarget.dataset.id;
      let customer = event.currentTarget.dataset.label;
      this.selectedEcardId = event.currentTarget.dataset.value;
      this.selectedBusChasis = chasis;
      this.selectedBusName = customer;
      this.selectedBusLabel = `${customer}, ${chasis}`;
      this.selectedEcardSequence = event.currentTarget.dataset.sequence;
      this.selectedEcardSequenceAvailable = event.currentTarget.dataset.seqavailable;  
      this.getpartnumberhistory();
    }

    getpartnumberhistory(event){
        this.showSpinner = true;
        var ecardid = this.selectedEcardId;
        getpartnumbersearchlogs({ecardid:ecardid})
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
            this.searchkeyword = undefined;
               var partnumberdata = JSON.parse(data.responsebody).data.part_no_validation;
               var partnumberdatalist = [];
               for(var pnumber in partnumberdata){
                  partnumberdatalist.push(partnumberdata[pnumber]);
               }
               this.partnumbersearchdata = partnumberdatalist;
               this.showSpinner = false;
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
    

    searchforpartnumber(event){
        
        if(this.searchkeyword == '' || this.searchkeyword == undefined || this.searchkeyword.match(/^ *$/) !== null) {
            const alertmessage = new ShowToastEvent({
                title : 'Please enter a Part Number to search.',
                message : 'Please enter some values before searching',
                variant : 'warning'
            });
            this.dispatchEvent(alertmessage);
        }
        else{
            var requestbody = {
                "ecard_id": this.selectedEcardId,
                "search_text": this.searchkeyword
              };
              searchpartnumber({requestbody:JSON.stringify(requestbody)})
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
                        title : 'Search Successful.',
                        message : 'Please see the list for search results.',
                        variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                     this.getpartnumberhistory();
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

    showEcardList(event){
        this.showops = false;
        this.showTable = true;
        this.selectedview='Operations';
        this.previousview = 'Operations';
        this.connectedCallback();
      }



    // Show Bus Overview
    showbusDetails(event){
      this.showbusoverview = true;
    }

  // Hide Bus Overview
  hidebusDetails(event){
      this.showbusoverview = false;
  }


}