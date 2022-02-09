import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import noDatadessert from "@salesforce/resourceUrl/nodatadessert";
import getqcchecklist from "@salesforce/apex/ecardOperationsController.getqcchecklist";
import getrepopresigneds3Url from "@salesforce/apex/ecardOperationsController.getrepopresigneds3Url";

export default class QcCheckList extends LightningElement {

  nodatadessert = noDatadessert;     // No Data Image(Static Resource).

  @track showqcchecklist = false;
  @api ecardid;
  @track selecteddeptformodals;
  @api departmentid;//
  @api departmentoptions;//
  @track qcchecklists = [];//

  get isqcchecklistpresent() {
    return this.qcchecklists.length == 0;
  }

  showqccheclist(event) {
    if (this.selecteddeptformodals == undefined) {
      this.selecteddeptformodals = this.departmentid;
    }
    var ecardid = this.ecardid;
    var deptmentId = this.selecteddeptformodals;
    var ecardiddeptid = { ecard_id: ecardid, dept_id: deptmentId };
    this.showqcchecklist = true;
    getqcchecklist({ ecardiddeptid: JSON.stringify(ecardiddeptid) })
      .then((data) => {
        if (data.isError) {
          this.showmessage('Failed to fetch QC Check List.', 'Something unexpected occured. Please contact your Administrator.', 'error');
        } else {
          var qcchecklist = JSON.parse(data.responsebody).data.qc_check_list;
          var qcchecklists = [];
          if (qcchecklist.length != 0) {
            for (var checklist in qcchecklist) {
              var qccheck = qcchecklist[checklist];
              var filename = qccheck.qc_check_list_url.substring(
                qccheck.qc_check_list_url.lastIndexOf("/") + 1
              );
              qccheck["filename"] = filename;
              qcchecklists.push(qccheck);
            }
          }
          this.qcchecklists = qcchecklists;
          this.showqcchecklist = true;
        }
      })
      .catch((error) => {
        this.showmessage('Failed to fetch QC Check List.', 'Something unexpected occured. Please contact your Administrator.', 'error');
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
  // Hide QC Check list Modal.
  hideqcchecklist(event) {
    this.showqcchecklist = false;
    this.selecteddeptformodals = undefined;
  }
  // To handle the department change for QC Checklist and Help Documents across the tabs.
  handleDepartmentchange(event) {
    this.selecteddeptformodals = event.detail.value;
    if (this.showqcchecklist) {
      this.showqccheclist();
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