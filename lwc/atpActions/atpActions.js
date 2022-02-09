import { LightningElement,api, track} from 'lwc';

export default class AtpActions extends LightningElement {
    @api permitteduser;
    @track isoklocal;
    @track qcuserlistlocal;
    @api name;

    @api uniqueid;
    test;
    
    @api
    get isok() {
        return this.isoklocal;
    }
    set isok(value){
        this.isoklocal = value;
    }
    @api
    get qcuserlist(){
        return this.qcuserlistlocal;
    }
    set qcuserlist(value){
        this.qcuserlistlocal=value;
    }
    get isqcselected(){
        //alert(this.qcuserlistlocal.length);
        this.test=JSON.stringify(this.qcuserlistlocal);
        return this.qcuserlistlocal.length==0;
    }
    @track disabledlocal;
    @api
    get disabled(){
        //alert(!this.disabledlocal);
        return !this.disabledlocal;
    }
    set disabled(value){
        this.disabledlocal=value;
    }

    actiontriggered(event){
        if(event.target.name=='ok'){
            this.isoklocal=true;
        }else{
            this.isoklocal=false;
        }
        const statuschange = new CustomEvent(
            "statuschange",
            {
                detail : {
                    "uniqueid":this.uniqueid,
                    "status":this.isoklocal
                } 
            }
        );
        this.dispatchEvent(statuschange);
    }
}