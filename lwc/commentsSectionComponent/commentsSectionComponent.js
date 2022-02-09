import { LightningElement, track, api } from 'lwc';
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";

export default class CommentsSectionComponent extends LightningElement {
    nodatadessert = noDatadessert;
    @api uniqueId;
    @api loggedinuserid;

    @api
    get commentlist() {
        return this.localcommentlist;
    }
    set commentlist(value){
        //alert('Loading commentlist');
        this.newcommenttext = undefined;
        var parsevalue = JSON.stringify(value);
        var locallist = JSON.parse(parsevalue);
        if(locallist.length !=0 && locallist !=undefined){
            for(var i in locallist){
                locallist[i].index = i;
            }
        }
        this.localcommentlist = locallist;
    } 

    get addnewcommentdisable(){
        if(this.newcomment){
            return true;
        }
        else{
            return false;
        }
    }

    get commentssize(){
        return this.localcommentlist.length;
    }
    get savenewcommentbtn(){
        if(this.newcommenttext == undefined || this.newcommenttext == ''){
            return true;
        }
        else{
            return false;
        }
    }

    get hascomments(){
        return this.localcommentlist.length == 0;
    }
    @track localcommentlist;
    @track newcomment=false;
    @track newcommenttext;


    addnewcomment(event){
        this.newcommenttext = undefined;
        this.newcomment = true;
    }

    cancelnewcomment(event){
        this.newcomment = false;
    }

    oncommentchange(event){
        this.newcommenttext = event.target.value;
    }

    savenewcomment(event){
        //alert(this.newcommenttext);
        this.newcomment = false;
        const addcommentevent = new CustomEvent(
            "addcomment",
            {
                detail : {commenttext: this.newcommenttext, uniqueId: this.uniqueId, loggedinuserid: this.loggedinuserid} 
                
            }
        );
        this.dispatchEvent(addcommentevent);
    }

}