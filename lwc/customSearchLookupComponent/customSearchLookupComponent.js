import { LightningElement, api, track } from 'lwc';

export default class CustomSearchLookupComponent extends LightningElement {

    @api IconName;
    @api label;
    @api placeholdertext;
    @track Message;
    @track SearchKeyWord;
    @track listOfSearchRecords;
    @track selectedRecord;
    @api showlabel;
    @api showicon;
    @api isrequired;
    // @track enableaddbutton = false;//Vishwas
    
    @track disableselection;

    @track selectedcustomerlocal;
    @api
    get selectedcustomer(){
        return this.selectedcustomerlocal;
    }
    set selectedcustomer(value) {
        this.selectedcustomerlocal = value;
        this.clrcustomvenderentry();
    }

    @track listtoSearchlocal;
    @api
    get listtoSearch() {
        return this.listtoSearchlocal;
    }
    set listtoSearch(value) {
        var parsevalue = JSON.stringify(value);
        this.listtoSearchlocal = JSON.parse(parsevalue);
    }

    @api
    get disablecomponent() {
        return this.disableselection;
    }
    set disablecomponent(value){
        this.disableselection = value;
    }

    get showlabelvariant() {
        if (this.showlabel) {
            return 'standard';
        }
        else {
            return 'label-hidden';
        }
    }

    get pillstate(){
        if(this.disableselection){
            return 'pillSize disablepill';
        }
        else{
            return 'pillSize';
        }
    }

    get condition() {
        if (this.listOfSearchRecords != undefined) {
            if (this.listOfSearchRecords.length > 0)
                return true;
        }
        else {
            return false;
        }
    }

    get addiconclass() {
        if (this.showlabel) {
            return 'inputiconsize slds-m-top_large';
        }
        else {
            return 'inputiconsize';
        }
    }

    get enableaddbutton() {
        if (this.inputkeyWord != null && this.inputkeyWord != undefined) {
            return this.inputkeyWord.length > 0;
        } else
            return false;
    }

    renderedCallback() {
        if (this.selectedcustomerlocal != undefined) {
            this.selectedRecord = this.selectedcustomerlocal;
            this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-show');
            this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-hide');
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
            this.template.querySelector('[data-id="lookupField"]').classList.add('slds-hide');
            this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-show');
            const selectedRecord = new CustomEvent(
                "select",
                {
                    detail: { selectedRecord: this.selectedRecord, labelvalue: this.label }
                }
            );
            /* eslint-disable no-console */
            //console.log( this.record.Id);
            /* fire the event to be handled on the Parent Component */
            this.dispatchEvent(selectedRecord);
        }
        else {
            this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-hide');
            this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-show');
            this.template.querySelector('[data-id="lookupField"]').classList.add('slds-show');
            this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-hide');
            //this.SearchKeyWord = null;
            //this.listOfSearchRecords = [];
            // this.selectedRecord = null;
        }
    }
    onfocusmethod(event) {
        if (!this.disableselection) {
            var getInputkeyWord = event.target.value;
            if (getInputkeyWord == '' || getInputkeyWord == undefined) {
                this.template.querySelector('[data-id="mySpinner"]').classList.add('slds-show');
                this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
                this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
                var intiallist = [];
                // Get Default 5 Records 
                for (var count in this.listtoSearchlocal) {
                    if (this.listtoSearchlocal.length < 5) {
                        intiallist.push(this.listtoSearchlocal[count]);
                    }
                    else {
                        if (intiallist.length < 5) {
                            intiallist.push(this.listtoSearchlocal[count]);
                        }
                    }

                }
                this.listOfSearchRecords = intiallist;
            } else {
                this.keyPressController(event);
            }
        }

    }

    searchHelper(event, getInputkeyWord) {
        this.template.querySelector('[data-id="mySpinner"]').classList.remove('slds-show');
        if (getInputkeyWord != undefined) {
            let searchStr = getInputkeyWord.toLowerCase();
            var searchedList = [];
            this.listtoSearchlocal.forEach(function (record) {
                var recordlower = record.toLowerCase();
                //if(recordlower.startsWith(searchStr)){
                if (recordlower.includes(searchStr)) {
                    if (searchedList.length < 10) {
                        if (recordlower.match(searchStr)) {
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

    onblurmethod(event) {
        setTimeout(() => {
            this.listOfSearchRecords = [];
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        }, 500);


    }

    @track inputkeyWord; //vishwas
    keyPressController(event) {
        //debugger
        // get the search Input keyword   
        var getInputkeyWord = event.target.value;
        this.inputkeyWord = getInputkeyWord;//vishwas
        this.SearchKeyWord = getInputkeyWord; //Vishwas
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if (getInputkeyWord.length > 0) {
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-open');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-close');
            this.searchHelper(event, getInputkeyWord);
            // this.enableaddbutton = true;//Vishwas
        }
        else {
            this.listOfSearchRecords = [];
            this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
            this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
            // this.enableaddbutton = false;//Vishwas
        }
    }

    addcustomvendor(event){
        console.log('Custom value selected');
        this.hanldeSelect(event);
    }

    clrcustomvenderentry() {
        this.inputkeyWord = null;
        this.SearchKeyWord = undefined; //Vishwas
    }


    // function for clear the Record Selaction 
    @api
    clear(event) {
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
                detail: { selectedRecord: this.selectedRecord, labelvalue: this.label }

            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(selectedRecord);
    }

    hanldeSelect(event) {
        if (event.currentTarget.name == 'custom_vendor') {
            this.selectedRecord = this.inputkeyWord;
        }
        else {
            this.selectedRecord = event.detail;
        }
        // this.selectedRecord = event.detail;
        this.template.querySelector('[data-id="lookup-pill"]').classList.add('slds-show');
        this.template.querySelector('[data-id="lookup-pill"]').classList.remove('slds-hide');
        this.template.querySelector('[data-id="searchRes"]').classList.add('slds-is-close');
        this.template.querySelector('[data-id="searchRes"]').classList.remove('slds-is-open');
        this.template.querySelector('[data-id="lookupField"]').classList.add('slds-hide');
        this.template.querySelector('[data-id="lookupField"]').classList.remove('slds-show');
        const selectedRecord = new CustomEvent(
            "select",
            {
                detail: { selectedRecord: this.selectedRecord, labelvalue: this.label, incident: 'selection' }

            }
        );
        /* eslint-disable no-console */
        //console.log( this.record.Id);
        /* fire the event to be handled on the Parent Component */
        this.dispatchEvent(selectedRecord);
        this.SearchKeyWord = null; //Vishwas

    }



}