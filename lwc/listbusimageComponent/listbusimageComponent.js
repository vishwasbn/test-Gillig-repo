import { LightningElement, track } from 'lwc';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import addbusimage from "@salesforce/apex/masterDataController.addbusimage";
import getfleetimageurls from "@salesforce/apex/masterDataController.getfleetimageurls"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class listbusimageComponent extends LightningElement {
    itemstosearch = [];
    selectedfleetrecord;
    selectedfleetid;
    error;
    showSpinner;
    showTable = false;
    filteredfleets = [];
    completefleetdata;
    existingcurbsideurl=undefined;
    existingstreetsideurl=undefined;
    get returntrue(){
        return true;
    }
    get returnfalse(){
        return false;
    }
    // To handle the search result when a fleet is selected from the list.
    handleSearch(event) {
        if (event.detail.labelvalue == "Fleet") {
            this.selectedfleetid = event.detail.selectedRecord;
            this.selectedfleetrecord=event.detail.selectedRecord;
        }
        this.handleallFilterchanges(event);
    }
    // To handle when a selected fleet to be cleared.
    onclearfleet(event) {
        this.selectedfleetid = undefined;
        this.selectedfleetrecord=undefined;
        this.handleallFilterchanges(event);
    }
    // To handle all the filter changes and filter the fleet list based on the filter conditions.  
    handleallFilterchanges(event){
        this.showSpinner = true;
        var filteredfleetlist = [];
        var completedata = JSON.parse(JSON.stringify(this.completefleetdata));
        for (var index in completedata) {
            var fleet = completedata[index];
            var fleetStyle = fleet.styleclass;
            if (this.selectedfleetid != undefined) {
                if (fleet.fleet_name == this.selectedfleetrecord) {
                    } else {
                        fleet.styleclass = fleetStyle + ' makeinvisible';
                    }
            }
            // setting up filteredbus
            if(!fleet.styleclass.includes("makeinvisible"))
                filteredfleetlist.push(fleet);
        }
            this.filteredfleets = filteredfleetlist;
            this.showSpinner = false;
    }

    // Load the list view of Ecards.
    async loaddata(){
        this.showSpinner = true;
        await getfleetimageurls()
                .then(data => {
                  // Setting up data to view End
                  let moddfleetslist = [];
                  let searchlist = [];
                  let completedata=JSON.parse(data.responsebody).data;
                  for (var index in completedata) {
                    var fleetdata = completedata[index];               
                    searchlist.push(fleetdata.fleet_name);
                    //searchlist.push(fleetdata.fleet_id);
                    var source = { styleclass: ' ' 
                                 };
                    let modifiedfleet = Object.assign(source,fleetdata);
                    moddfleetslist.push(modifiedfleet);
                  }
                  this.itemstosearch = Array.from(new Set(searchlist));
                  this.completefleetdata = moddfleetslist;
                  this.filteredfleets = moddfleetslist;
                  if(this.selectedfleetid !=undefined){
                      this.handleallFilterchanges();
                  }
                  // Setting up data to view End
                  this.showSpinner = false;
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
    
    connectedCallback(){
        loadStyle(this, HideLightningHeader);
        this.showTable = true;
        this.loaddata();
    }

    updatecurbsideimageurl(event){ 
        var fleetid = event.target.dataset.id;
        var fleetcurbsideimgurl=event.target.value;
        if(this.existingcurbsideurl!=fleetcurbsideimgurl){
            var requestbody = {
                    "fleet_id" : fleetid,
                    "curb_side_image_url" : fleetcurbsideimgurl,
                    "street_side_image_url":""
                };
                this.showSpinner = true;
                addbusimage({requestbody:JSON.stringify(requestbody)})
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
                        title : 'Record update Successful',
                        message : 'Curbside image URL updated successfully.',
                        variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.loaddata();
                    //this.handleallFilterchanges();
            
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
     }

     updatestreetsideimageurl(event){ 
        var fleetid = event.target.dataset.id;
        var fleetstreetsideimgurl=event.target.value;
        if(this.existingcurbsideurl!=fleetstreetsideimgurl){
            var requestbody = {
                    "fleet_id" : fleetid,
                    "curb_side_image_url" : "",
                    "street_side_image_url": fleetstreetsideimgurl
                };
                this.showSpinner = true;
                addbusimage({requestbody:JSON.stringify(requestbody)})
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
                        title : 'Record update Successful',
                        message : 'Streetside image URL updated successfully.',
                        variant : 'success'
                    });
                    this.dispatchEvent(alertmessage);
                    this.showSpinner = false;
                    this.loaddata();
            
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
     }

     handleCurbSideInputFocus(event){
        this.existingcurbsideurl=event.target.value;
     }
     handleStreetSideInputFocus(event){
        this.existingstreetsideurl=event.target.value;
     }

}