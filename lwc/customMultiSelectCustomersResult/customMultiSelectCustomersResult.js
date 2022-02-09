import { LightningElement, track, api } from 'lwc';

export default class CustomMultiSelectCustomersResult extends LightningElement {

    @api IconName;
    @api oRecord;

    selectRecord(event){
        event.preventDefault();
    const selectedRecord = new CustomEvent(
        "select",
        {
            detail : this.oRecord
        }
    );
    /* eslint-disable no-console */
    
    this.dispatchEvent(selectedRecord);
    }


}