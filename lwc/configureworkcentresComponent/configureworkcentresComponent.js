import { LightningElement, track } from 'lwc';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import Factorylayout from "@salesforce/resourceUrl/Factorylayout";


export default class ConfigureworkcentresComponent extends LightningElement {
    factorylayoutimage  = Factorylayout;
    showSpinner = false;
    parentdivdimensions;
    

    connectedCallback(){
       this.showSpinner = true;
       this.getImagesize(this.factorylayoutimage);
    }

    getMeta(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = url;
        });
    }

    
    async getImagesize(url) {
        let img = await this.getMeta(url);
        let imagedimensions = {
            "height" : img.height,
            "width" : img.width
        };
        var maxwidth = 2197.5; 
        var maxheight = 1014;
        var parentdivheight;
        var parentdivwidth;
        var zoomScale = 1.0;
        if(imagedimensions.width < maxwidth && imagedimensions.height < maxheight){
            parentdivheight = imagedimensions.height;
            parentdivwidth = imagedimensions.width;
            zoomScale = 1.0
        }
        else{
            let widthRatio = maxwidth / imagedimensions.width;
            let heightRatio = maxheight / imagedimensions.height;
            let bestFitRatio = Math.min(widthRatio, heightRatio);
            parentdivwidth = imagedimensions.width * bestFitRatio;
            parentdivheight = imagedimensions.height * bestFitRatio
            zoomScale = bestFitRatio
        }
        this.parentdivdimensions = `height: ${parentdivheight}px; weight: ${parentdivwidth}px`;
        this.showSpinner = false;
        
    }

}