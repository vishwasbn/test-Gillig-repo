import { LightningElement } from 'lwc';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

import workcenterconfig from '@salesforce/resourceUrl/EcardConfigureWorkCenter';
export default class MasterDataComponent extends LightningElement {

    configpdf=undefined;

    connectedCallback(){
        this.configpdf=workcenterconfig;
        loadStyle(this, HideLightningHeader);
    }
}