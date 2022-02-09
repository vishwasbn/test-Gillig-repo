import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import getmeetingnotes from "@salesforce/apex/ecardOperationsController.getmeetingnotes";
import getrepopresigneds3Url from "@salesforce/apex/ecardOperationsController.getrepopresigneds3Url";

export default class MeetingNoteComponent extends LightningElement {
    nodatadessert = noDatadessert;     // No Data Image(Static Resource).
    @track selecteddeptformodals;
    @api departmentid;
    @api ecardid;
    @track showmeetingnotes = false;
    @api departmentoptions;
    @track showqcchecklist = false;
    @track meetingnotes = [];
    get ismeetingnotespresent() {
        return this.meetingnotes.length == 0;
    }
    // Show Meeting List Modal.
    fetchmeetingnotes(event) {
        if (this.selecteddeptformodals == undefined) {
            this.selecteddeptformodals = this.departmentid;
        }
        var ecardid = this.ecardid;
        var deptmentId = this.selecteddeptformodals;
        var ecardiddeptid = { ecard_id: ecardid, dept_id: deptmentId };
        this.showmeetingnotes = true;
        getmeetingnotes({ ecardiddeptid: JSON.stringify(ecardiddeptid) })
            .then((data) => {
                if (data.isError) {
                    this.showmessage('Failed to fetch Meeting Notes.', 'Something unexpected occured. Please contact your Administrator.', 'error');
                } else {
                    var meetingnotelist = JSON.parse(data.responsebody).data.meeting_note;
                    var meetingnotelists = [];
                    if (meetingnotelist.length != 0) {
                        for (var mnote in meetingnotelist) {
                            var mnotes = meetingnotelist[mnote];
                            var filename = mnotes.meeting_note_url.substring(
                                mnotes.meeting_note_url.lastIndexOf("/") + 1
                            );
                            mnotes["filename"] = filename;
                            meetingnotelists.push(mnotes);
                        }
                    }
                    this.meetingnotes = meetingnotelists;
                    this.showmeetingnotes = true;
                }
            })
            .catch((error) => {
                this.showmessage('Failed to fetch Meeting Notes.', 'Something unexpected occured. Please contact your Administrator.', 'error');
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
    // Hide Meeting Notes Modal.
    hidemeetingnotes(event) {
        this.showmeetingnotes = false;
        this.selecteddeptformodals = undefined;
    }
    // To handle the department change for QC Checklist and Help Documents across the tabs.
    handleDepartmentchange(event) {
        this.selecteddeptformodals = event.detail.value;
        if (this.showmeetingnotes) {
            this.fetchmeetingnotes();
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
    // Hide Meeting Notes Modal.
    hidemeetingnotes(event) {
        this.showmeetingnotes = false;
        this.selecteddeptformodals = undefined;
    }
}