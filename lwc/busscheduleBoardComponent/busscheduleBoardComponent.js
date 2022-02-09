import { LightningElement, track, api, wire } from "lwc";
import BusImage from "@salesforce/resourceUrl/DefaultEcardImage";
import noSchedulesImage from "@salesforce/resourceUrl/noSchedulesImage";
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

import getScheduleBoardData from "@salesforce/apex/scheduleBoardController.getScheduleBoardData";
import getPicklistOptions from "@salesforce/apex/scheduleBoardController.getPicklistOptions";
import getecardDetails from "@salesforce/apex/ecardOperationsController.getecardDetails";
import getDepartmentdata from "@salesforce/apex/masterDataController.getDepartmentdata";
export default class BusscheduleBoardComponent extends NavigationMixin(LightningElement) {
  //@api bus;
  @track selectedBus;
  @track selectedCustomer;
  @track todaysDate;
  @track formattedtodaysDate;
  @track selectedBusType = 'All Bus Type';
  @track selectedBusStatus = 'All Bus Status';
  @track selectedBusPropulsion = 'All Propulsion Types';
  @track formattedselectedDate;
  @track backlimit;
  @track frontlimit;
  @track showdetail = false;
  @track activearticles;
  @track showfilterdetail;
  @track showSpinner = true;
  @track selectedBusDetail;
  @track scheduletimings = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM'];

 
  @track dateFieldValue;
  @track authorisationdata;
  @track mapData = [];
  @track customerlist = [];
  @track busstatuslist =[{'label': 'All Bus Status', 'value' : 'All Bus Status'}];
  @track bustypelist = [{'label': 'All Bus Type', 'value' : 'All Bus Type'}];
  @track buspropulsionlist = [{'label': 'All Propulsion Types', 'value' : 'All Propulsion Types'}];
  @track completebusschedule = [];
  @track error;
  @track selectedDays = [];
  @track selectedMonthYear = '';
  @track itemstosearch = [];
  @track partShortageFilter = false;
  @track discrepancyFilter = false;
  busImage = BusImage;
  noschedulesImage = noSchedulesImage;
  @track departmentnameidMap;
  @track departmentlistoptions;
  @track selecteddepartment;
  @track selecteddepartmentid = '1';
  @track rawscheduledbusdata = [];

   // Use whenever a false attribute is required in Component.html
   get returnfalse(){
    return false;
}

// Use whenever a true attribute is required in Component.html
get returntrue(){
  return true;
}

  get showmessage(){
    if(this.mapData.length == 0){
        return false;
    }
    else{
        return true;
    }
}

  get shownodatamessage(){
      var showmessage = false;
      for(var i in this.mapData){
          if(this.mapData[i].value !=undefined){
            if(this.mapData[i].value.length == 0 && !showmessage){
                showmessage = true;
            }
          }
          
        }
        //alert(showmessage);
        return showmessage;
  }

  
  
  /*connectedCallback(){
    loadStyle(this, HideLightningHeader);
    this.setdepartmentvalues();
    this.loadscheduleboarddata();
 }*/ //Unused code commented

    connectedCallback() {
        loadStyle(this, HideLightningHeader);
        this.setdepartmentvalues();
        this.decideview();
    }

    //Added to facilitate property initialisation when navigating from ecardview
    decideview() {
        var scheduledata = JSON.parse(localStorage.getItem('scheduledata'));
        if (scheduledata == undefined || scheduledata == null) {
            this.loadscheduleboarddata();
        }
        else {
            this.itemstosearch = scheduledata.itemstosearch;
            this.bustypelist = scheduledata.bustypelist;
            this.buspropulsionlist = scheduledata.buspropulsionlist;
            this.busstatuslist = scheduledata.busstatuslist;
            this.selectedBusType = scheduledata.selectedbustype;
            this.selectedCustomer = scheduledata.selectedcustomer;
            this.selectedDate = scheduledata.selectedDate;
            this.selectedBusPropulsion = scheduledata.selectedpropulsion;
            this.selectedBusStatus = scheduledata.selectedbusstatus;
            this.partShortageFilter = scheduledata.partShortageFilter;
            this.discrepancyFilter = scheduledata.discrepancyFilter;
            this.completebusschedule = scheduledata.completebusschedule;
            this.selectedDays = scheduledata.selectedDays;
            this.formattedselectedDate = scheduledata.formattedselectedDate;
            this.formattedtodaysDate = scheduledata.formattedtodaysDate;
            this.dateFieldValue = scheduledata.dateFieldValue;
            this.backlimit = scheduledata.backlimit;
            this.todaysDate = scheduledata.todaysDate;
            this.frontlimit = scheduledata.frontlimit;
            this.selecteddepartmentid = scheduledata.selecteddepartmentid;
            localStorage.removeItem('scheduledata');
            this.handleallFilterchanges();
        }
    }

  getschedulemapdata(schedulelist, dayslist){
    let map = [];
    for(var i in dayslist){
        var buslistforday = [];
        var day = dayslist[i];
        for(var ecard in schedulelist){
            if(schedulelist[ecard].schedule_date_key === day){
                buslistforday.push(schedulelist[ecard]);
            }
        }
        map.push({'key': day, 'value' :buslistforday});
    }
    return map;
  }

  loadscheduleboarddata(){
    this.showSpinner = true;
    getScheduleBoardData({ departmentid: this.selecteddepartmentid})
     .then((result) => {
         if(result.isError){
             const alertmessage = new ShowToastEvent({
                 title: "Schedule Board data fetch failed.",
                 message:JSON.parse(result.responsebody).data.validation_message,
                 variant: "error"
             });
             this.dispatchEvent(alertmessage);
             this.showSpinner = false;
         }
         else{
             var modifiedscheduledata = [];
             var searchList = [];
             var dayslist = [];
             var scheduleboarddata = JSON.parse(result.responsebody).data.ecard;
             this.rawscheduledbusdata = scheduleboarddata;//
             for(var i in scheduleboarddata){
                var scheduledatelocal; 
                var schedule_date_key;
                var busscheduledate;
                if(this.selecteddepartmentid==undefined || this.selecteddepartmentid==0){
                    busscheduledate=scheduleboarddata[i].schedule_date;
                    scheduledatelocal = new Date(scheduleboarddata[i].schedule_date);
                    schedule_date_key = scheduledatelocal.getFullYear()+'-'+((scheduledatelocal.getMonth() + 1) <= 9 ? "0" + (scheduledatelocal.getMonth() + 1) : (scheduledatelocal.getMonth() + 1))+'-'+( (scheduledatelocal.getDate()) <= 9 ? "0" + (scheduledatelocal.getDate()) : (scheduledatelocal.getDate()));
                 }else{
                    busscheduledate=scheduleboarddata[i].department_schedule_time; 
                    scheduledatelocal = new Date(scheduleboarddata[i].department_schedule_time);
                    schedule_date_key = scheduledatelocal.getFullYear()+'-'+((scheduledatelocal.getMonth() + 1) <= 9 ? "0" + (scheduledatelocal.getMonth() + 1) : (scheduledatelocal.getMonth() + 1))+'-'+( (scheduledatelocal.getDate()) <= 9 ? "0" + (scheduledatelocal.getDate()) : (scheduledatelocal.getDate())); 
                 }
                 
                 var seqavailable=scheduleboarddata[i].bus_relative_seq!=undefined?true:false;
                 var imgdefault=(scheduleboarddata[i].curb_side_image_url=="" || scheduleboarddata[i].curb_side_image_url==null )?true:false;
                 var modifiedecardddata = {
                    ac_system_pdi: scheduleboarddata[i].ac_system_pdi,
                    actual_delivery_date: scheduleboarddata[i].actual_delivery_date,
                    bus_start_date: scheduleboarddata[i].bus_start_date,
                    bus_image_url:scheduleboarddata[i].curb_side_image_url,
                    defaultimage:imgdefault,
                    busPropulsion: scheduleboarddata[i].buspropulsion_name,
                    busStatus: scheduleboarddata[i].busstatus_name,
                    busType: scheduleboarddata[i].bustype_name,
                    busChassisno: scheduleboarddata[i].chassis_no,
                    busCoachno: scheduleboarddata[i].coach_no,
                    coach_weight_unladen: scheduleboarddata[i].coach_weight_unladen,
                    completed_date: scheduleboarddata[i].completed_date,
                    customer_id: scheduleboarddata[i].customer_id,
                    customer_name: scheduleboarddata[i].customer_name,
                    busSequence: scheduleboarddata[i].bus_relative_seq,
                    busSeqavailable:seqavailable,
                    department_entered_time: scheduleboarddata[i].department_entered_time,
                    dept_entered_time_str: scheduleboarddata[i].dept_entered_time_str,
                    ecardid: scheduleboarddata[i].ecard_id,
                    busEnddate: scheduleboarddata[i].end_date,
                    front_axle_weight: scheduleboarddata[i].front_axle_weight,
                    busHasDiscrepancy: scheduleboarddata[i].has_discrepancy,
                    has_outofstation_discrepancy: scheduleboarddata[i].has_outofstation_discrepancy,
                    busHasPartshortage: scheduleboarddata[i].has_part_shortage,
                    io_program: scheduleboarddata[i].io_program,
                    odometer: scheduleboarddata[i].odometer,
                    busDiscrepancytotal: scheduleboarddata[i].open_discrepancy_total != null ? scheduleboarddata[i].open_discrepancy_total : 0,
                    busoutofStationtotal: scheduleboarddata[i].outofstation_discrepancy_total != null ? scheduleboarddata[i].outofstation_discrepancy_total : 0,
                    busPartshortagetotal: scheduleboarddata[i].part_shortage_total  != null ? scheduleboarddata[i].part_shortage_total : 0,
                    //busScheduledate: scheduleboarddata[i].schedule_date,
                    busScheduledate: busscheduledate,
                    scheduled_delivery_date: scheduleboarddata[i].scheduled_delivery_date,
                    busStartdate: scheduleboarddata[i].start_date,
                    workcenter_id: scheduleboarddata[i].workcenter_id,
                    workcenter_name: scheduleboarddata[i].workcenter_name,
                    busFormattedscheduledate : schedule_date_key,
                    schedule_date_key : schedule_date_key
                 };
                 dayslist.push(schedule_date_key);
                 searchList.push(scheduleboarddata[i].chassis_no);
                 searchList.push(scheduleboarddata[i].customer_name);
                 modifiedscheduledata.push(modifiedecardddata)
             }
             var uniquesearchlist = Array.from(new Set(searchList));
             var uniquekeys = Array.from(new Set(dayslist));
             var mappedscheduledata = this.getschedulemapdata(modifiedscheduledata, uniquekeys);
             var data = {
                'searchlist' : uniquesearchlist,
                'scheduleBoarddata' : mappedscheduledata,
                'keylist' : uniquekeys
             };
             this.loaddata(data);
             this.showSpinner = false;
         }
         
   })
   .catch((error) => {
     const alertmessage = new ShowToastEvent({
       title: "Schedule Board data fetch failed.",
       message:"Something unexpected occured. Please contact your Administrator",
       variant: "error"
     });
     this.dispatchEvent(alertmessage);
     this.showSpinner = false;
   });
  }
 
  getselectedWeek(event, selectedDate) {
      this.formattedselectedDate = "";
      this.selectedMonthYear = "";
      var monthyear;
      var activeday;

      var selectedUTCDate = selectedDate.getDate();
      var selectedatesetours = selectedDate.setHours(0, 0, 0, 0);

      function getweekdays(date, selectedDate) {
          var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          var monthArray = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
          ];
          var i;
          var weekdaysArray = [];
          var formattedDays = [];
          for (i = 0; i < 7; i++) {
              var day = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + i
              );
              weekdaysArray.push(day);
          }
          for (var j in weekdaysArray) {
              var dateofweek = weekdaysArray[j];
              var day = dayArray[dateofweek.getDay()];
              var d = dateofweek.getDate();
              var m = monthArray[dateofweek.getMonth()];
              var month = dateofweek.getMonth()+1;
              var y = dateofweek.getFullYear();
              //var formatteddate = day + ", " + (d <= 9 ? "0" + d : d) + "/" + m + "/" + y;
              var formatteddate = y+'-'+(month <= 9 ? "0" + month : month)+'-'+(d <= 9 ? "0" + d : d);
             // if (selectedatesetours.valueOf() === weekdaysArray[j].valueOf()) {
                //debugger
                if(selectedUTCDate === weekdaysArray[j].getDate()){
                  activeday = formatteddate;
                  monthyear = m+' '+y;
                  // alert(activeday);
              }

              formattedDays.push(formatteddate);
          }
          return formattedDays;
      }

      function firstDayOfWeek(dateObject, firstDayOfWeekIndex) {
          const dayOfWeek = dateObject.getDay(),
              firstDayOfWeek = new Date(dateObject),
              diff =
              dayOfWeek >= firstDayOfWeekIndex ?
              dayOfWeek - firstDayOfWeekIndex :
              6 - dayOfWeek;

          firstDayOfWeek.setDate(dateObject.getDate() - diff);
          firstDayOfWeek.setHours(0, 0, 0, 0);
          //alert(firstDayOfWeek);
          return firstDayOfWeek;
      }

      var currentweek = getweekdays(
          firstDayOfWeek(selectedDate, 1),
          selectedDate
      );
      this.selectedDays = currentweek;
      this.formattedselectedDate = activeday;
      this.selectedMonthYear = monthyear;
      //
  }

 loaddata(data){
        //this.showSpinner = true;
        this.itemstosearch = data.searchlist;
        //start - added to enable filter capture for the depatment change handler
        var today = new Date();
        this.formattedtodaysDate = today.getFullYear() + '-' + ((today.getMonth() + 1) <= 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + ((today.getDate()) <= 9 ? "0" + (today.getDate()) : (today.getDate()));
        this.todaysDate = this.todaysDate != undefined ? this.todaysDate : today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        var scheduleBoarddata = data.scheduleBoarddata;
        this.completebusschedule = []; //empty the complete list - avoid old value if the response value is empty 
        for (var i in scheduleBoarddata) {
            this.completebusschedule.push({
                value: scheduleBoarddata[i].value,
                key: scheduleBoarddata[i].key
            });
        }
        this.handleallFilterchanges();
        //End - added to enable filter capture for the depatment change handler
        /*var today = new Date();
        this.formattedtodaysDate = today.getFullYear()+'-'+((today.getMonth() + 1) <= 9 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1))+'-'+( (today.getDate()) <= 9 ? "0" + (today.getDate()) : (today.getDate()));
        this.todaysDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        var scheduleBoarddata = data.scheduleBoarddata;
        var dateselected = new Date();
        dateselected.setHours(12);
        this.getselectedWeek(event, dateselected);
        var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var mapdata = [];
        // this.completebusschedule = data.scheduleBoarddata;

        for(var i in data.scheduleBoarddata){
            var styleclass = "slds-size_1-of-8 calendercell";
            var selectedDay = "";
            var todayclass = "";
            this.completebusschedule.push({
                value: data.scheduleBoarddata[i].value,
                key: data.scheduleBoarddata[i].key
            }); 
            if (this.selectedDays.includes(data.scheduleBoarddata[i].key)) {
                if (this.formattedselectedDate == data.scheduleBoarddata[i].key) {
                    styleclass = styleclass.replace("slds-size_1-of-8", "slds-size_2-of-8");
                    selectedDay = " active"; //slds-size_1-of-4
                }
                if(this.formattedtodaysDate == data.scheduleBoarddata[i].key){
                    todayclass = ' currentday ';
                }
                var busscheduleforday = [];
                var styleclassbus = 'innerbusbox';

                for (var bus in data.scheduleBoarddata[i].value) {
                    var activedaybus=false;
                    if(styleclass.includes('slds-size_2-of-8')){
                        activedaybus = true;
                    }
                    var outerbusclass = 'slds-box busbox';
                    var busdetails = data.scheduleBoarddata[i].value[bus];
                    var dategeneric = new Date(busdetails.busScheduledate).valueOf();
                    var imgdefault=(busdetails.curb_side_image_url=="" || busdetails.curb_side_image_url==null )?true:false;
                    var buswithstyle = {
                        key: data.scheduleBoarddata[i].key,
                        activeday:activedaybus,
                        outerbusclass: outerbusclass,
                        styleClass: styleclassbus,
                        BusName: busdetails.customer_name,
                        bus_image_url: busdetails.curb_side_image_url,
                        defaultimage:imgdefault,
                        busSeqavailable:busdetails.busSeqavailable,
                        busSequence:busdetails.busSequence,
                        ChasisNumber: busdetails.busChassisno,
                        ScheduledDatenonformattted: busdetails.busScheduledate,
                        ScheduledDate: dategeneric,
                        ScheduledTime: dategeneric,
                        BusType: busdetails.busType,
                        BusStatus : busdetails.busStatus,
                        BusPropulsion : busdetails.busPropulsion,
                        Discrepancytotal : busdetails.busDiscrepancytotal,
                        hasDiscrepancy : busdetails.busHasDiscrepancy,
                        PartShortagetotal : busdetails.busPartshortagetotal,
                        hasPartshortage : busdetails.busHasPartshortage,
                        OutofStationtotal : busdetails.busoutofStationtotal,
                        ecardid : busdetails.ecardid
                    };
                    busscheduleforday.push(buswithstyle);
                }
                //var d = new Date(data.scheduleBoarddata[i].key);
                //var n = d.toUTCString();
                var thisdate = new Date(data.scheduleBoarddata[i].key);
                var date = thisdate.getUTCDate();
                var formatted =(date <= 9 ? "0" + date : date);
                var day = dayArray[thisdate.getUTCDay()];
                mapdata.push({
                    date:formatted,
                    day:day,
                    value: busscheduleforday,
                    key: data.scheduleBoarddata[i].key,
                    styledclass: styleclass + selectedDay + todayclass
                });
            }

        }
        // Align design
        var modifiedlist = this.builddummydata(mapdata);
        // Align design
        this.mapData = modifiedlist;
        this.setLimits(event,new Date()); */
        this.setLimits(event,new Date());
        //this.showSpinner = false;
        //this.error = undefined;
    }

 setLimits(event, today){
    //debugger
    function firstDayOfWeek(dateObject, firstDayOfWeekIndex) {
        const dayOfWeek = dateObject.getDay(),
            firstDayOfWeek = new Date(dateObject),
            diff =
            dayOfWeek >= firstDayOfWeekIndex ?
            dayOfWeek - firstDayOfWeekIndex :
            6 - dayOfWeek;

        firstDayOfWeek.setDate(dateObject.getDate() - diff);
        firstDayOfWeek.setHours(0, 0, 0, 0);
        //alert(firstDayOfWeek);
        return firstDayOfWeek;
    }
     var firstday =  firstDayOfWeek(today, 1);
     var startdate = new Date();
     startdate = startdate.setDate(firstday.getDate() - 84);
     var enddate = new Date();
     enddate = enddate.setDate(firstday.getDate() + 89);
     var backdate = new Date(startdate);
     var futuredate = new Date(enddate);
        
        this.backlimit =
            backdate.getFullYear() +
            "-" +
            (backdate.getMonth() + 1) +
            "-" +
            backdate.getDate();
        this.frontlimit =
            futuredate.getFullYear() +
            "-" +
            (futuredate.getMonth() + 1) +
            "-" +
            futuredate.getDate();
    // this.backlimit = new Date(startdate);
    // this.frontlimit = new Date(enddate);


 }

     loadpicklistvalues(event){
      var picklistname = event.target.name;
      if(event.target.options.length == 1){
        getPicklistOptions({picklistName:picklistname})
        .then(data => {
         if(data.isError){
            const alertmessage = new ShowToastEvent({
                title : 'Data fetch failed.',
                message : 'Something unexpected occured. Please contact your Administrator',
                variant : 'error'
            });
            this.dispatchEvent(alertmessage);
            throw 'Data fetch failed';
         }
         else{
             var options = data.options;
             if(picklistname == 'bustype'){
                this.bustypelist = options;
             }
             if(picklistname == 'buspropulsions'){
                this.buspropulsionlist = options;
             }
             if(picklistname == 'busstatus'){
                this.busstatuslist = options;
             }

         }

     })
     .catch(error => {
        this.error = error;
        //alert('Some error has occured please contact your Admin' + JSON.stringify(error));
        const alertmessage = new ShowToastEvent({
            title : 'Data fetch failed.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
        
     });
      }
    }

  onclearcustomer(event) {
    this.selectedCustomer = undefined;
    this.handleallFilterchanges(event);
  }

  handleDateChange(event) {
      this.dateFieldValue = event.target.value;
      this.handleallFilterchanges(event);
  }

  handleFilter(event) {

      if (event.detail.labelvalue == "Customer") {
          this.selectedCustomer = event.detail.selectedRecord;
      }
      this.handleallFilterchanges(event);
  }

  onPartShortageselection(event) {
      // alert(event.target.checked);
      this.partShortageFilter = event.target.checked;
      this.handleallFilterchanges(event);
  }

  onDiscrepancyselection(event) {
      // alert(event.target.checked);
      this.discrepancyFilter = event.target.checked;
      this.handleallFilterchanges(event);
  }

  getbusDetails(event) {
      //selectedBusDetail
      this.selectedBus = event.currentTarget.dataset.id;
      var selectedBusChasis = event.currentTarget.dataset.id;
      /*var thisweekdata = this.mapData;
      for (var key in thisweekdata) {
          for (var keyvalue in thisweekdata[key].value) {
              var busdata = thisweekdata[key].value[keyvalue];
              if (busdata.ChasisNumber == selectedBusChasis) {
                  this.selectedBusDetail = busdata;
              }

          }

      }*/
      var ecardid = event.currentTarget.dataset.id;
      getecardDetails({ ecardid: ecardid })
        .then((data) => {
          if (data.isError) {
            const alertmessage = new ShowToastEvent({
              title: "Failed to fetch E Card Details.",
              message:
                "Something unexpected occured. Please contact your Administrator",
              variant: "error"
            });
            this.dispatchEvent(alertmessage);
          } else {
            var ecarddetails = JSON.parse(data.responsebody).data.ecard;
            var bussequence=ecarddetails.bus_relative_seq!=undefined?'\('+ecarddetails.bus_relative_seq+'\)':'';
            var seqavailable=ecarddetails.bus_relative_seq!=undefined?true:false;
            var modifieddetails = {
                    ac_system_pdi: ecarddetails.ac_system_pdi,
                    actual_delivery_date: ecarddetails.actual_delivery_date,
                    bus_start_date: ecarddetails.bus_start_date,
                    BusPropulsion: ecarddetails.buspropulsion_name,
                    BusStatus: ecarddetails.busstatus_name,
                    BusType: ecarddetails.bustype_name,
                    ChasisNumber: ecarddetails.chassis_no,
                    busSequence: bussequence,
                    busSeqavailable:seqavailable,
                    busCoachno: ecarddetails.coach_no,
                    coach_weight_unladen: ecarddetails.coach_weight_unladen,
                    completed_date: ecarddetails.completed_date,
                    customer_id: ecarddetails.customer_id,
                    BusName: ecarddetails.customer_name,
                    department_entered_time: ecarddetails.department_entered_time,
                    dept_entered_time_str: ecarddetails.dept_entered_time_str,
                    ecardid:ecarddetails.ecard_id,
                    busEnddate: ecarddetails.end_date,
                    front_axle_weight: ecarddetails.front_axle_weight,
                    busHasDiscrepancy: ecarddetails.has_discrepancy,
                    has_outofstation_discrepancy: ecarddetails.has_outofstation_discrepancy,
                    busHasPartshortage: ecarddetails.has_part_shortage,
                    io_program: ecarddetails.io_program,
                    odometer: ecarddetails.odometer,
                    Discrepancytotal: ecarddetails.open_discrepancy_total != null ? ecarddetails.open_discrepancy_total : 0,
                    OutofStationtotal: ecarddetails.outofstation_discrepancy_total != null ? ecarddetails.outofstation_discrepancy_total : 0,
                    PartShortagetotal: ecarddetails.part_shortage_total  != null ? ecarddetails.part_shortage_total : 0,
                    ScheduledDate: ecarddetails.schedule_date,
                    scheduled_delivery_date: ecarddetails.scheduled_delivery_date,
                    busStartdate: ecarddetails.start_date,
                    workcenter_id: ecarddetails.workcenter_id,
                    selecteddepartmentId : this.selecteddepartmentid,
                    workcenter_name: ecarddetails.workcenter_name,
            }; 
            this.selectedBusDetail = modifieddetails;
            this.showdetail = true;
          }
        })
        .catch((error) => {
          const alertmessage = new ShowToastEvent({
            title: "Failed to fetch E Card Details.",
            message:
              "Something unexpected occured. Please contact your Administrator",
            variant: "error"
          });
          this.dispatchEvent(alertmessage);
        }); 
  
  }

  closeModal(event) {
      this.showdetail = false;
  }

  applyfilter(event) {
      var selectedcustomer = this.selectedCustomer;
      var mapdata = [];
      var thisweekdata = this.mapData;
      var styleclass = "slds-size_1-of-8 calendercell";

      for (var key in thisweekdata) {
          var selectedDay = '';
          if (this.formattedselectedDate == thisweekdata[key].key) {
              selectedDay = " active";
              styleclass = styleclass.replace("slds-size_1-of-8", "slds-size_2-of-8");
              // slds-size_1-of-4
              //alert(key);
          }
          var filteredList = [];
          for (var keyvalue in thisweekdata[key].value) {
              //debugger
              var busdata = thisweekdata[key].value[keyvalue];
              var busStyle = busdata.styleClass;
              var outerbusclass = busdata.outerbusclass;
              if (busdata.BusName == selectedcustomer) {

              } else {
                  busdata.styleClass = busStyle + ' makeinvisible';
                  busdata.outerbusclass = outerbusclass + ' makeinvisible';

              }
              filteredList.push(busdata);
          }
          mapdata.push({
              value: filteredList,
              key: thisweekdata[key].key,
              styledclass: styleclass + selectedDay
          })
      }
      this.mapData = mapdata;
     }

  showfilters(event) {

      var classList = this.template.querySelector(".filterdiv").classList.value;
      if (classList.includes('slds-show')) {
          this.template.querySelector(".filterdiv").classList.add('slds-hide');
          this.template.querySelector(".filterdiv").classList.remove('slds-show');
      } else {
          this.template.querySelector(".filterdiv").classList.remove('slds-hide');
          this.template.querySelector(".filterdiv").classList.add('slds-show');
      }
  }

  onnext(event){
    var currentdateSelected;
    if(this.dateFieldValue!=undefined){
      currentdateSelected = this.dateFieldValue;
    }
    else{
      currentdateSelected = this.todaysDate;
    }
   // debugger
    var nextweekdate = new Date(currentdateSelected);
    nextweekdate.setDate(nextweekdate.getDate() + 7);
    var enddatelimit = new Date(this.frontlimit); 
    if(nextweekdate <= enddatelimit){
        var nextweekselect = nextweekdate.getFullYear() +
              "-" +
              (nextweekdate.getMonth() + 1) +
              "-" +
              nextweekdate.getDate();
    this.dateFieldValue = nextweekselect;
    this.todaysDate = nextweekselect;
    this.handleallFilterchanges(event);
    }
    else{
        const alertmessage = new ShowToastEvent({
            title: 'Sorry',
            message: 'You have reached the end of Schedule Board'
        });
        this.dispatchEvent(alertmessage);
    }
   
  }

  onprevious(event){
    var currentdateSelected;
    if(this.dateFieldValue!=undefined){
      currentdateSelected = this.dateFieldValue;
    }
    else{
      currentdateSelected = this.todaysDate;
    }
    
    var prevweekdate = new Date(currentdateSelected);
    prevweekdate.setDate(prevweekdate.getDate() - 7);
    var startdatelimit = new Date(this.backlimit); 
    if(startdatelimit <= prevweekdate){
        var prevweekselect = prevweekdate.getFullYear() +
              "-" +
              (prevweekdate.getMonth() + 1) +
              "-" +
              prevweekdate.getDate();
    this.dateFieldValue = prevweekselect;
    this.todaysDate = prevweekselect;
    this.handleallFilterchanges(event);
    }
    else{
        const alertmessage = new ShowToastEvent({
            title: 'Sorry',
            message: 'You have reached the start of Schedule Board'
        });
        this.dispatchEvent(alertmessage);
    }
    
  }

  selectthisdate(event){
    this.dateFieldValue = event.currentTarget.dataset.id;
    this.handleallFilterchanges(event);
  }

  handleallFilterchanges(event) {
    var selectedbustype = this.selectedBusType;
    var selectedcustomer = this.selectedCustomer;
    var selectedDate = this.dateFieldValue;
    var selectedpropulsion = this.selectedBusPropulsion
    var selectedbusstatus = this.selectedBusStatus;
    var partShortageFilter = this.partShortageFilter;
    var discrepancyFilter = this.discrepancyFilter;
    if (selectedDate == undefined) {
        selectedDate = this.todaysDate;
    }
    //
    var selectedday = selectedDate.split('-').pop();
    var dateselected = new Date(selectedDate);
    dateselected.setDate(selectedday);
    this.getselectedWeek(event, dateselected);
    this.showSpinner = true;
    this.mapData = [];
    var thisweekdata = []; 
    
    var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (var key in this.completebusschedule) {
      var styleclass = "slds-size_1-of-8 calendercell";
        if (this.selectedDays.includes(this.completebusschedule[key].key)) {
            var selectedDay = "";
            var todayclass = "";
            if (this.formattedselectedDate == this.completebusschedule[key].key) {
              styleclass = styleclass.replace("slds-size_1-of-8", "slds-size_2-of-8");
                selectedDay = " active"; // slds-size_1-of-4
                //alert(key);
            }
            if(this.formattedtodaysDate == this.completebusschedule[key].key){
                todayclass = ' currentday ';
            }
            var busscheduleforday = [];
            var styleclassbus = 'innerbusbox';
            for (var bus in this.completebusschedule[key].value) {

                var activedaybus=false;
                    if(styleclass.includes('slds-size_2-of-8')){
                        activedaybus = true;
                    }
                var outerbusclass = 'slds-box busbox';
                var busdetails = this.completebusschedule[key].value[bus];
                var dategeneric = new Date(busdetails.busScheduledate).valueOf();
                var imgdefault = (busdetails.curb_side_image_url == "" || busdetails.curb_side_image_url == null) ? true : false;
                var buswithstyle = {
                    activeday:activedaybus,
                    outerbusclass: outerbusclass,
                    styleClass: styleclassbus,
                    BusName: busdetails.customer_name,
                    ChasisNumber: busdetails.busChassisno,
                    ScheduledDate: dategeneric,
                    ScheduledTime: dategeneric,
                    BusType: busdetails.busType,
                    BusStatus : busdetails.busStatus,
                    BusPropulsion : busdetails.busPropulsion,
                    Discrepancytotal : busdetails.busDiscrepancytotal,
                    hasDiscrepancy : busdetails.busHasDiscrepancy,
                    PartShortagetotal : busdetails.busPartshortagetotal,
                    hasPartshortage : busdetails.busHasPartshortage,
                    OutofStationtotal : busdetails.busoutofStationtotal,
                    bus_image_url:busdetails.bus_image_url,
                    //defaultimage:busdetails.defaultimage,
                    defaultimage: imgdefault,
                    ecardid: busdetails.ecardid,
                    busSeqavailable: busdetails.busSeqavailable,
                    busSequence: busdetails.busSequence,
                    key: this.completebusschedule[key].key,
                    ScheduledDatenonformattted: busdetails.busScheduledate
                };
                busscheduleforday.push(buswithstyle);
            }
            var filteredbuslist = [];
            for (var bus in busscheduleforday) {
                var busdata = busscheduleforday[bus];
                var busStyle = busdata.styleClass;
                var outerbusclass = busdata.outerbusclass;
                if (selectedcustomer != undefined) {
                    if (busdata.BusName == selectedcustomer || busdata.ChasisNumber == selectedcustomer) {

                    } else {
                        busdata.styleClass = busStyle + ' makeinvisible';
                        busdata.outerbusclass = outerbusclass + ' makeinvisible';
                    }
                }
                if (selectedbustype != undefined && selectedbustype != 'All Bus Type') {
                    if (busdata.BusType == selectedbustype) {

                    } else {
                        busdata.styleClass = busStyle + ' makeinvisible';
                        busdata.outerbusclass = outerbusclass + ' makeinvisible';
                    }
                }
                if (selectedbusstatus != undefined && selectedbusstatus != 'All Bus Status') {
                  if (busdata.BusStatus == selectedbusstatus) {

                  } else {
                      busdata.styleClass = busStyle + ' makeinvisible';
                      busdata.outerbusclass = outerbusclass + ' makeinvisible';
                  }
              }
              if (selectedpropulsion != undefined && selectedpropulsion != 'All Propulsion Types') {
                if (busdata.BusPropulsion == selectedpropulsion) {

                } else {
                    busdata.styleClass = busStyle + ' makeinvisible';
                    busdata.outerbusclass = outerbusclass + ' makeinvisible';
                }
            }
              
              if(partShortageFilter){
                if (busdata.hasPartshortage != partShortageFilter) {
                    busdata.styleClass = busStyle + ' makeinvisible';
                    busdata.outerbusclass = outerbusclass + ' makeinvisible';
                } else {
                   
                }
              }
              if(discrepancyFilter){
                if (busdata.hasDiscrepancy != discrepancyFilter) {
                    busdata.styleClass = busStyle + ' makeinvisible';
                    busdata.outerbusclass = outerbusclass + ' makeinvisible';
                } else {
                   
                }
              }
              if(partShortageFilter && discrepancyFilter){
                if ((busdata.hasPartshortage != partShortageFilter) && (busdata.hasDiscrepancy != discrepancyFilter)) {
                    busdata.styleClass = busStyle + ' makeinvisible';
                    busdata.outerbusclass = outerbusclass + ' makeinvisible';
                } else {
                   
                }
              }
              // setting up filteredbus
              if(!busdata.styleClass.includes("makeinvisible"))
              filteredbuslist.push(busdata);
            }
            // busscheduleforday
            var thisdate = new Date(this.completebusschedule[key].key);
            var date = thisdate.getUTCDate();
            var formatted =(date <= 9 ? "0" + date : date);
            var day = dayArray[thisdate.getUTCDay()];
            thisweekdata.push({
              day:day,
              date:formatted,
              value: filteredbuslist,
              key: this.completebusschedule[key].key,
              styledclass: styleclass + selectedDay + todayclass
          });
            
        }
    }
    //debugger
    // Building dummy data
    var filteredlist = this.builddummydata(thisweekdata);
    // Building dummy data
    //debugger
    this.mapData = filteredlist;      
      if (event != undefined && event.detail.labelvalue == "Customer") {//this.mapData.length == 0 &&
          if (!this.isdataexist(this.mapData)) {
              this.getSearchedbusscheduledate(event);
          }
      }
    this.showSpinner = false;

    this.error = undefined;
    //
}   

handlebuspropulsionchange(event){
    this.selectedBusPropulsion = event.detail.value;
    this.handleallFilterchanges(event);
}

builddummydata(filteredweekdata){
    //debugger

    function buiddata(requiredcount, activedaybus){
        var dummdataarray = [];
        for(var i=0;i<requiredcount;i++){
            var randomkey = Math.floor(Math.random() * 1000);
            var buswithstyle = {
                activeday:activedaybus,
                outerbusclass: 'innerbusbox makeinvisible',
                styleClass: 'innerbusbox makeinvisible',
                BusName: '',
                ChasisNumber: randomkey,
                ScheduledDate: '',
                ScheduledTime: '',
                BusType: '',
                BusStatus : ''
            }; 
            dummdataarray.push(buswithstyle);
        }
        return dummdataarray;
    }


    var highestdatalength=0;
    var completeweekdata = []
    for(var count in filteredweekdata){
        if(highestdatalength <= filteredweekdata[count].value.length){
            highestdatalength = filteredweekdata[count].value.length;
        }
        
    }
   // debugger
    var weekselected = this.selectedDays;

    function getBusView(busListkey){
        var busdata = null;
        for(var busday in filteredweekdata){
            if(filteredweekdata[busday].key == busListkey){
                busdata = filteredweekdata[busday];
            }
        }
        return busdata;
    }

    for(var weekday in weekselected){
        var hasbusdata = getBusView(weekselected[weekday]);
        if(hasbusdata != null){
            completeweekdata.push({day:hasbusdata.day,
                date:hasbusdata.date,
                value: hasbusdata.value,
                key: hasbusdata.key,
                styledclass: hasbusdata.styledclass});

        }
        else{
            var styleclass = "slds-size_1-of-8 calendercell";
                var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var selectedDay = "";
                var todayclass = '';
                    if (this.formattedselectedDate == weekselected[weekday]) {
                      styleclass = styleclass.replace("slds-size_1-of-8", "slds-size_2-of-8");
                        selectedDay = " active"; // slds-size_1-of-4
                        //alert(key);
                    }
                    if(this.formattedtodaysDate == weekselected[weekday]){
                        todayclass = ' currentday ';
                    }
                    var busscheduleforday = [];
                    var styleclassbus = 'innerbusbox';
                    var thisdate = new Date(weekselected[weekday]);
                    var date = thisdate.getUTCDate();
                    var formatted =(date <= 9 ? "0" + date : date);
                    var day = dayArray[thisdate.getUTCDay()];
                    completeweekdata.push({day:day,
                            date:formatted,
                            value: busscheduleforday,
                            key: weekselected[weekday],
                            styledclass: styleclass+selectedDay+todayclass});

        }

    }

    
    
    filteredweekdata = completeweekdata;
    //debugger
    // Build dummy data
    for(var count in filteredweekdata){
        if(filteredweekdata[count].value.length < highestdatalength){
            var countreq = highestdatalength - filteredweekdata[count].value.length;
            if(filteredweekdata[count].styledclass.includes('active')){
                var dummydata = buiddata(countreq,true);
                for(var dummy in dummydata){
                    filteredweekdata[count].value.push(dummydata[dummy]);
                }
            }
            else{
                var dummydata = buiddata(countreq,false);
                for(var dummy in dummydata){
                    filteredweekdata[count].value.push(dummydata[dummy]);
                } 
            }
            
        }
    }
    
    return filteredweekdata;


}

handlebusstatuschange(event){
  this.selectedBusStatus = event.detail.value;
  this.handleallFilterchanges(event);
}

handlebustypechange(event) {
      this.selectedBusType = event.detail.value;
      this.handleallFilterchanges(event);
      

}

navigateToEcard() {
    //Start - store filter values while navigating to ecardview
    var requireddata = {
        scheduleboard: true,
        selectedbustype: this.selectedBusType,
        selectedcustomer: this.selectedCustomer,
        selectedDate: this.dateFieldValue,
        selectedpropulsion: this.selectedBusPropulsion,
        selectedbusstatus: this.selectedBusStatus,
        partShortageFilter: this.partShortageFilter,
        discrepancyFilter: this.discrepancyFilter,
        completebusschedule: this.completebusschedule,
        selectedDays: this.selectedDays,
        formattedselectedDate: this.formattedselectedDate,
        formattedtodaysDate: this.formattedtodaysDate,
        dateFieldValue: this.dateFieldValue,
        backlimit: this.backlimit,
        todaysDate: this.todaysDate,
        frontlimit: this.frontlimit,
        selectedCustomer: this.selectedCustomer,
        itemstosearch: this.itemstosearch,
        bustypelist: this.bustypelist,
        buspropulsionlist: this.buspropulsionlist,
        busstatuslist: this.busstatuslist,
        selecteddepartmentid: this.selecteddepartmentid,
        ecardid: this.selectedBusDetail
    }
    //End - store filter values while navigating to ecardview
    //var ecardid = JSON.stringify(this.selectedBusDetail); //Commented
    var ecardid = JSON.stringify(requireddata); //added
    localStorage.setItem('ecardid', ecardid);
    // Navigate to a specific CustomTab.
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            // CustomTabs from managed packages are identified by their
            // namespace prefix followed by two underscores followed by the
            // developer name. E.g. 'namespace__TabName'
            apiName: 'E_Cards'
        }
        /*,
        state: {
            ecardSelected: this.selectedBus
        }*/
    });
}

async setdepartmentvalues(){
        
    //let authorisationdata = this.authorisationdata;
    
    await getDepartmentdata(null)
    .then(result => {  
        /*var departmentlistvalues = ['ALL DEPARTMENTS'];
        var departmentidnewmap = [{'bus_area_discrepancy_enabled':false,
                                    'label':'ALL DEPARTMENTS',
                                    'value': '0'}];*/
        var departmentlistvalues = [];
        var departmentidnewmap = [];
        for(var dept in result.departmentPickList){
            var deprtmentopt = result.departmentPickList[dept];
            if(deprtmentopt.value != 'None'){
                departmentidnewmap.push(deprtmentopt);
            }
        }
        this.departmentnameidMap = departmentidnewmap;
        this.departmentlistoptions = departmentidnewmap;
        //this.selecteddepartment = this.departmentnameidMap[1].label;
        //this.selecteddepartmentid = this.departmentnameidMap[1].value; // 1 for 1st department
        //this.nextdepartment = this.departmentnameidMap[1].value; 
        for(var dept in result.objectdata){
            departmentlistvalues.push(result.objectdata[dept].department_name);
        }
        this.departmentlist = departmentlistvalues;
        
        this.showSpinner = false;
        this.showoperations = true;
    })
    .catch(error => {
        this.showSpinner = true;
        const alertmessage = new ShowToastEvent({
            title : 'Department data fetch failed.',
            message : 'Something unexpected occured. Please contact your Administrator',
            variant : 'error'
        });
        this.dispatchEvent(alertmessage);
    });
    
}
    // To set the current selected department
    handledepartmentchange(event){
        this.selecteddepartmentid = event.detail.value;
        this.loadscheduleboarddata()
        //this.departmentchanged(event);
    }

    //when searching for a bus under the filter conditions takes you directly to date of the bus schedule.
    getSearchedbusscheduledate(event) {
        for (var item in this.rawscheduledbusdata) {
            if (this.rawscheduledbusdata[item].chassis_no == this.selectedCustomer) {
                var busdetails = this.rawscheduledbusdata[item];
                var selectedbustype = this.selectedBusType;
                var selectedpropulsion = this.selectedBusPropulsion
                var selectedbusstatus = this.selectedBusStatus;
                var partShortageFilter = this.partShortageFilter;
                var discrepancyFilter = this.discrepancyFilter;
                var busdata = "";
                if (selectedbustype != undefined && selectedbustype != 'All Bus Type') {
                    if (busdetails.bustype_name != selectedbustype) {
                        busdata = busdata + ' makeinvisible';
                    }
                }
                if (selectedbusstatus != undefined && selectedbusstatus != 'All Bus Status') {
                    if (busdetails.busstatus_name != selectedbusstatus) {
                        busdata = busdata + ' makeinvisible';
                    }
                }
                if (selectedpropulsion != undefined && selectedpropulsion != 'All Propulsion Types') {
                    if (busdetails.buspropulsion_name != selectedpropulsion) {
                        busdata = busdata + ' makeinvisible';
                    }
                }

                if (partShortageFilter) {
                    if (busdetails.has_part_shortage != partShortageFilter) {
                        busdata = busdata + ' makeinvisible';
                    }
                }
                if (discrepancyFilter) {
                    if (busdetails.has_discrepancy != discrepancyFilter) {
                        busdata = busdata + ' makeinvisible';
                    }
                }
                if (partShortageFilter && discrepancyFilter) {
                    if ((busdetails.has_part_shortage != partShortageFilter) && (busdata.has_discrepancy != discrepancyFilter)) {
                        busdata = busdata + ' makeinvisible';
                    }
                }
                if (!busdata.includes("makeinvisible")) {
                    var scheduledatelocal = new Date(busdetails.department_schedule_time);//schedule_date
                    var schedule_date_key = scheduledatelocal.getFullYear() + '-' + ((scheduledatelocal.getMonth() + 1) <= 9 ? "0" + (scheduledatelocal.getMonth() + 1) : (scheduledatelocal.getMonth() + 1)) + '-' + ((scheduledatelocal.getDate()) <= 9 ? "0" + (scheduledatelocal.getDate()) : (scheduledatelocal.getDate()));
                    event.target.value = schedule_date_key;
                    event.detail.labelvalue = "";
                    this.todaysDate = schedule_date_key;
                    this.handleDateChange(event);
                }
            }
        }
    }

    //check if the bus data available withing the week data
    isdataexist(scheduledata) {
        for (var entry in scheduledata) {
            if (scheduledata[entry].value.length != 0) {
                return true;
            }
        }
        return false;
    }

}