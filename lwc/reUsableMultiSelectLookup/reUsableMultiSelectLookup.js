import { LightningElement, api, track } from 'lwc';

export default class ReUsableMultiSelectLookup extends LightningElement {

    @api IconName;
    @api label;
    //@api listtosearch;
    @api placeholdertext;
    //@api selectedrecords;
    @api limittoone;

    @api
    get disablecomponent() {
        return this.disableselection;
    }
    set disablecomponent(value){
        this.disableselection = value;
    }

    get pillstate(){
        if(this.disableselection){
            return 'slds-m-around_xx-small disablepill';
        }
        else{
            return 'slds-m-around_xx-small';
        }
    }


    @api
    get listtosearch() {
        return this.listtosearchlocal;
    }
    set listtosearch(value){
        var parsevalue = JSON.stringify(value);
        this.listtosearchlocal = JSON.parse(parsevalue);
    }
   
    @api
    get selectedrecords() {
        return this.lstSelectedRecords;
    }
    set selectedrecords(value){
        var parsevalue = JSON.stringify(value);
        this.lstSelectedRecords = JSON.parse(parsevalue);
    } 

    @track disableselection;
    @track listtosearchlocal;
    @track listOfSearchRecords;
    @track SearchKeyWord;
    @track Message;
    @track lstSelectedRecords = [];

    get showselected(){
        if(this.lstSelectedRecords != undefined){
            return this.lstSelectedRecords.length != 0;
        }
        else{
            return false;
        }
       
    }

    get showsearchresults(){
        if(this.listOfSearchRecords != undefined){
            return this.listOfSearchRecords.length != 0;
        }
        else{
            return false;
        }
        
    }

    connectedCallback(){
        var selectedrecords = [];
        if(this.selectedrecords!=undefined && this.selectedrecords.length != 0){
            for(var record in this.selectedrecords){
                selectedrecords.push(this.selectedrecords[record]);
            }
        }
        this.lstSelectedRecords = selectedrecords;
    }

    onItemSelected () {
        //alert(JSON.stringify(this.lstSelectedRecords));
        const evt = new CustomEvent ('itemselected', { detail : {userlist : this.lstSelectedRecords, type: this.label }});
        this.dispatchEvent (evt);
    }

    onblur(event){
        // on mouse leave clear the listOfSeachRecords & hide the search result component 
        setTimeout(function() {
            //your code to be executed after 1 second
        }, 100);
            this.listOfSearchRecords = null;
            this.SearchKeyWord;
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
          
        
     }

    onfocus(event){
        if(!this.disableselection){
            // show the spinner,show child search result component and call searchHelper function
        this.template.querySelector('[data-id="mySpinner"]').classList.remove('slds-show');
        this.listOfSearchRecords = null;
        this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
        this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
        // Get Default 5 Records order by Name 
        var getInputkeyWord = event.target.value;
        this.searchHelper(getInputkeyWord);
        }
    }

    keyPressController(event){
        
        this.template.querySelector('[data-id="mySpinner"]').classList.add('slds-show');
        // get the search Input keyword   
        var getInputkeyWord = event.target.value;
        this.SearchKeyWord = getInputkeyWord;
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the searchhelper 
        // else close the lookup result List part.   
        if(getInputkeyWord.length > 0){
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
            this.searchHelper(getInputkeyWord);
        }
        else{  
            this.listOfSearchRecords = null;
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        }

    }

    handleComponentEvent(event){
        this.SearchKeyWord = null;
        // get the selected object record from the COMPONENT event 
        if(this.limittoone){
            this.lstSelectedRecords = [];
            var listSelectedItems =  this.lstSelectedRecords;
            var selectedAccountGetFromEvent = event.detail;
            listSelectedItems.push(selectedAccountGetFromEvent);
            this.lstSelectedRecords = listSelectedItems;

        }else{
         var listSelectedItems =  this.lstSelectedRecords;
        var selectedAccountGetFromEvent = event.detail;
        listSelectedItems.push(selectedAccountGetFromEvent);
        this.lstSelectedRecords = listSelectedItems;
        } 
        
        this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-show');
        this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-hide');
        this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
        this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        this.onItemSelected();
    }

    clear(event){
        var selectedPillId = event.target.name;
        var AllPillsList = this.lstSelectedRecords; 
        for(var i = 0; i < AllPillsList.length; i++){
            if(AllPillsList[i].Id == selectedPillId){
                AllPillsList.splice(i, 1);
                this.lstSelectedRecords = AllPillsList;
            }  
        }
        this.SearchKeyWord = null;
        this.listOfSearchRecords = null;
        this.onItemSelected();
    }

    searchHelper(getInputkeyWord){
        
        let storeResponse = [];
        let listtosearchfor = this.listtosearchlocal;
        if(listtosearchfor.length != 0){
            let alreadyselectedrecords = this.lstSelectedRecords;
        if(getInputkeyWord == ''){
            if(listtosearchfor.length <= 5){
                for(var i in listtosearchfor){ //=0;i<=listtosearchfor.length-1;i++
                    if(!checkselected(listtosearchfor[i], alreadyselectedrecords)){
                    storeResponse.push(listtosearchfor[i]);
                    }
                }
            }
            else{
                for(var i in listtosearchfor){
                    if(storeResponse.length < 6){
                        if(!checkselected(listtosearchfor[i], alreadyselectedrecords)){
                            storeResponse.push(listtosearchfor[i]);
                            }
                    }
                    
                }
            }
            
        }
        else if(getInputkeyWord != undefined && getInputkeyWord !=''){
            let searchStr = getInputkeyWord.toLowerCase();
            listtosearchfor.forEach(function(record){
                var recordlower = record.Name.toLowerCase();
                if(recordlower.startsWith(searchStr)){
                    if(storeResponse.length < 5){
                    if(recordlower.match(searchStr)) {
                        const rec = record;
                        storeResponse.push(rec);
                    }
                }
                }
                
            });

        }
        else{

        }
        //debugger
        
        

        function checkselected(element, alreadyselectedrecords){
            var isselected = false;
            for(var selected in alreadyselectedrecords){
                if(alreadyselectedrecords[selected].Id == element.Id){
                    isselected = true;
                }
            }
            return isselected;
        }

        var refinedResponse = [];
        if(alreadyselectedrecords != undefined && alreadyselectedrecords.length !=0){
            
            for(var element in storeResponse){
                if(!checkselected(storeResponse[element], alreadyselectedrecords)){
                    refinedResponse.push(storeResponse[element]);
                }
            }
        }
        else{
            refinedResponse = storeResponse;
        }
        
        this.template.querySelector('[data-id="mySpinner"]').classList.remove('slds-show');
        if (refinedResponse.length == 0) {
            this.Message = 'Sorry No Records Found...';
        } else {
            this.Message = '';
           // set searchResult list with return value from server.
        }
        this.listOfSearchRecords = refinedResponse;

        }
        else{
            this.template.querySelector('[data-id="mySpinner"]').classList.remove('slds-show');
            this.Message = 'Sorry No Records to search from.';
            this.listOfSearchRecords = [];
        }

    }
}