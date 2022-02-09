import { LightningElement, api, track } from 'lwc';

export default class UserlistIconComponent extends LightningElement {

    //@api userlist;
    @api buildstationid;
    @api type;
    @api sizeforsingleusericon;

    @track displaylist;
    @track listcountgreater;
    @track singleuser;
    @track count;
    @track hasuser;
    @track usernames = [];
    @track showlist = false;

    @api
    get userlist() {
        return this.displaylist;
    }
    set userlist(value){
        this.displaylist = value;
        if((this.displaylist != undefined)){
            if(this.displaylist.length != 0){
                this.hasuser = true;
            if(this.displaylist.length == 1){
                this.singleuser = this.displaylist[0];
                this.listcountgreater =  false;
            }
            if(this.displaylist.length > 1){
                this.singleuser = this.displaylist[0];
                this.count = this.displaylist.length -1;
                this.listcountgreater =  true;
            }
         }
        else{
            this.hasuser = false;
        }
    }
    }

    
    connectedCallback(){
        //debugger 
        
    }

    showuserlist(event){
        this.usernames = [];
        for(var i in this.displaylist){
            console.log('User Name:', JSON.stringify(this.displaylist[i]));
            this.usernames.push(this.displaylist[i].fullname);
        }
        this.showlist = true;
    }

    hideuserlist(event){
        this.showlist = false;
    }

    selectuser(event){
        const modifyevent = new CustomEvent(
            "modify",
            {
                detail : {userlist: this.userlist, actionlabel: 'modify', buildstationid: this.buildstationid, type: this.type} 
                
            }
        );
        this.dispatchEvent(modifyevent);

    }
    
    addnewuser(event){
        const modifyevent = new CustomEvent(
            "addnew",
            {
                detail : {userlist: [], actionlabel: 'addnew', buildstationid: this.buildstationid, type: this.type} 
                
            }
        );
        this.dispatchEvent(modifyevent);
    }
    

}