import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import gethelpdocument from "@salesforce/apex/ecardOperationsController.gethelpdocument";
import getrepopresigneds3Url from "@salesforce/apex/ecardOperationsController.getrepopresigneds3Url";

export default class HelpComponent extends LightningElement {
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    @track showhelpdocuments = false;
    @track selecteddeptformodals;
    @api departmentoptions;
    @api departmentid;
    @api ecardid;
    @track helpdocumntslist = [];
    get ishelpdocpresent() {
        return this.helpdocumntslist.length == 0;
    }
    // Show Help Documents Modal.
    gethelpdocuments(event) {
        if (this.selecteddeptformodals == undefined) {
            this.selecteddeptformodals = this.departmentid;
        }
        var ecardid = this.ecardid;
        var deptmentId = this.selecteddeptformodals;
        var ecardiddeptid = { ecard_id: ecardid, dept_id: deptmentId };
        this.showhelpdocuments = true;
        gethelpdocument({ ecardiddeptid: JSON.stringify(ecardiddeptid) })
            .then((data) => {
                if (data.isError) {
                    this.showmessage('Failed to fetch Help Documents.', 'Something unexpected occured. Please contact your Administrator.', 'error');
                } else {
                    var helpdoclist = JSON.parse(data.responsebody).data.help_document;
                    var helpdoclists = [];
                    if (helpdoclist.length != 0) {
                        for (var hdoc in helpdoclist) {
                            var helpdoc = helpdoclist[hdoc];
                            var filename = helpdoc.help_document_url.substring(
                                helpdoc.help_document_url.lastIndexOf("/") + 1
                            );
                            helpdoc["filename"] = filename;
                            helpdoclists.push(helpdoc);
                        }
                    }
                    this.helpdocumntslist = helpdoclists;
                    this.showhelpdocuments = true;
                }
            })
            .catch((error) => {
                this.showmessage('Failed to fetch Help Documents.', 'Something unexpected occured. Please contact your Administrator.', 'error');
            });
    }
    // Generic function to Show alert toasts.
    showmessage(title, message, variant) {
        const alertmessage = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(alertmessage);
    }
    // Hide Help Document Modal.
    hidehelpdocument(event) {
        this.showhelpdocuments = false;
        this.selecteddeptformodals = undefined;
    }
    // To handle the department change for QC Checklist and Help Documents across the tabs.
    handleDepartmentchange(event) {
        this.selecteddeptformodals = event.detail.value;
        if (this.showhelpdocuments) {
            this.gethelpdocuments();
        }
    }
    openfile(event) {
        var filepath = event.target.name;
        if (filepath != undefined && filepath != '') {
            var s3files = [];
            s3files.push(filepath);
            var requestbody = {
                's3_file_paths': JSON.stringify(s3files)
            };
            this.gets3urls(JSON.stringify(requestbody));
        }

    }
    // To get s3URL
    gets3urls(requestbody) {
        getrepopresigneds3Url({ requestbody: requestbody })
            .then((data) => {
                if (data.isError) {
                    const alertmessage = new ShowToastEvent({
                        title: "Failed to fetch Label Images.",
                        message:
                            "Something unexpected occured. Please contact your Administrator",
                        variant: "error"
                    });
                    this.dispatchEvent(alertmessage);
                } else {
                    var presigned_urls = JSON.parse(data.responsebody).data.presigned_url;
                    console.log('Presigned URL ::' + presigned_urls[0].s3url);
                    window.open(presigned_urls[0].s3url, '_blank');
                }
            })
            .catch((error) => {
                const alertmessage = new ShowToastEvent({
                    title: "Failed to fetch Label Images.",
                    message:
                        "Something unexpected occured. Please contact your Administrator",
                    variant: "error"
                });
                this.dispatchEvent(alertmessage);
            });
    }
}