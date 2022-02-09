import { LightningElement, api} from 'lwc';

export default class CustomSearchResultComponent extends LightningElement {

@api IconName;
@api searchItem;
@api showicon;

selectRecord(event){
    event.preventDefault();
    const selectedRecord = new CustomEvent(
        "select",
        {
            detail : this.searchItem
        }
    );
    /* eslint-disable no-console */
    //console.log( this.record.Id);
    /* fire the event to be handled on the Parent Component */
    this.dispatchEvent(selectedRecord);
}
}