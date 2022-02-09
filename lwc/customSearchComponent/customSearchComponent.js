import { LightningElement, api, track } from 'lwc';

export default class CustomSearchComponent extends LightningElement {

    @api IconName;
    @api listtoSearch;
    @api label;
    @api placeholdertext;
    @track Message;
    @track SearchKeyWord;
    @track listOfSearchRecords;
    @track selectedRecord;
    @api showlabel;
    @api showicon;
    @api isrequired;
    @api selectedcustomer;
   
    get showlabelvariant(){
        if(this.showlabel){
            return 'standard';
        }
        else{
            return 'label-hidden';
        }
    }
    
    get condition() {
        if(this.listOfSearchRecords !=undefined){
         if(this.listOfSearchRecords.length>0)
            return true;
         }
        else{
            return false;
        }
    }
    renderedCallback(){
        if(this.selectedcustomer!=undefined){
            this.selectedRecord=this.selectedcustomer;
            this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-show');
            this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-hide');
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
            this.template.querySelector('[data-id="lookupField"]').classList.add('slds-hide');
            this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-show');
            const selectedRecord = new CustomEvent(
            "select",
            {
                detail : {selectedRecord: this.selectedRecord, labelvalue: this.label} 
            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(selectedRecord);
        }
    }
    onfocusmethod(event){
        var getInputkeyWord = event.target.value;
        if(getInputkeyWord == '' || getInputkeyWord == undefined){
            this.template.querySelector('[data-id="mySpinner"]').classList.add('slds-show');
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
            var intiallist = [];
            // Get Default 5 Records 
            for(var count in this.listtoSearch){
                if(this.listtoSearch.length < 5){
                    intiallist.push(this.listtoSearch[count]);
                }
                else{
                    if(intiallist.length < 5){
                        intiallist.push(this.listtoSearch[count]);
                    }
                }
                
            }
            this.listOfSearchRecords = intiallist; 
        }else{
            this.keyPressController(event);
        }
            
     }

     searchHelper(event, getInputkeyWord) {
        this.template.querySelector('[data-id="mySpinner"]').classList.remove('slds-show');
        if(getInputkeyWord != undefined){
            let searchStr = getInputkeyWord.toLowerCase();
            var searchedList = [];
            this.listtoSearch.forEach(function(record){
                var recordlower = record.toLowerCase();
                //if(recordlower.startsWith(searchStr)){
                if(recordlower.includes(searchStr)){
                    if(searchedList.length < 10){
                    if(recordlower.match(searchStr)) {
                        const rec = record;
                        searchedList.push(rec);
                    }
                }
                }
                
            });
         
            if (searchedList.length == 0) {
                this.Message = 'No Result Found...';
            } else {
                this.Message = '';
            }
            this.listOfSearchRecords = searchedList;
        }
    }

    onblurmethod(event){    
        setTimeout(() => {
            this.listOfSearchRecords = [];
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        }, 500); 
         
        
    }

    keyPressController(event) {
        //debugger
        // get the search Input keyword   
          var getInputkeyWord = event.target.value;
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
         if( getInputkeyWord.length > 0 ){
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
             this.searchHelper(event,getInputkeyWord);
        }
         else{  
             this.listOfSearchRecords = [];
             this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
             this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
             
           }
     }

     
  // function for clear the Record Selaction 
    @api
    clear(event){
        this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-hide');
        this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-show');

        this.template.querySelector('[data-id="lookupField"]').classList.add('slds-show');
        this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-hide');
        this.SearchKeyWord = null;
        this.listOfSearchRecords = [];
        this.selectedRecord = null;    
        const selectedRecord = new CustomEvent(
            "clear",
            {
                detail : {selectedRecord: this.selectedRecord, labelvalue: this.label} 
                
            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(selectedRecord);
    }

    hanldeSelect(event){
        
        this.selectedRecord = event.detail;
        this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-show');
        this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-hide');
        this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
        this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        this.template.querySelector('[data-id="lookupField"]').classList.add('slds-hide');
        this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-show');
        const selectedRecord = new CustomEvent(
            "select",
            {
                detail : {selectedRecord: this.selectedRecord, labelvalue: this.label, incident: 'selection'} 
                
            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(selectedRecord);
        
    }

      
    
}