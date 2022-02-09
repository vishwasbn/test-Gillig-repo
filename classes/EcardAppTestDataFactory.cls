/* Test Class for Ecard App Operations and related services */

@istest
public class EcardAppTestDataFactory {
    
    // Test Method for User Authentication
    public static testmethod void EcardLoginTest() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        Test.setMock(HttpCalloutMock.class, logindata);
        userAuthentication.EcardLogin();
        userAuthentication.getAccess();
        userAuthentication.getRefreshtoken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEzNjU0NjksIm5iZiI6MTYwMTM2NTQ2OSwianRpIjoiNDc1NzYzOTAtYzJkZi00MGE2LWJjNzYtNjdiZTEyODA1ZGQzIiwiZXhwIjoxNjAzOTU3NDY5LCJpZGVudGl0eSI6eyJpc19hY3RpdmUiOnRydWUsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiYXBwdXNlcl9pZCI6MTIsImRlcGFydG1lbnRfaWQiOm51bGwsImFwcHJvbGVfaWQiOjV9LCJ0eXBlIjoicmVmcmVzaCJ9.1kYzdHWByB8r85ZXOO4Ws1cUmQRkHqXkQ6tVASkkd8w');
        userAuthentication.getData(System.Label.EcardAppendpoint,'GET','','');
        
    } 
    // Test Method for User Permissions
    public static testmethod void EcardUserPermissionsTest() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiZWQ3ZWEyOTYtNDEyMS00MTAyLTg5ZTYtYWFkZGQ4ZGYxNTg5IiwiZXhwIjoxNjAxMjg5NjI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hXgIOxq2hFvFx_rrsBpql0VoWr1iqVMu1-cktHasGqY","expiry_token":1601289624,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiYjk4YjM1ZTItOTAxOC00MjUxLWIzMWQtNTYyZmFiYjQzMTBkIiwiZXhwIjoxNjAzODc5ODI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwidHlwZSI6InJlZnJlc2gifQ.pVmOXf3GQtSUA5VEj0kRQcFS8B5V7_PTkvUxrIiqccU"},"user":{"approle_id":1,"appuser_id":877,"department_code":null,"department_id":null,"is_active":true}}}',null);
        SingleRequestMock permissionsdata = new SingleRequestMock(200,'SUCCESS','{"data":{"authorization":{"all_access":{"access":"all"},"bus_ecard_status":{"access":"all"},"bus_information":{"access":"all"},"bus_informations_details":{"access":"all"},"bus_moreinfo":{"access":"all"},"busarea_discrepancy_new":{"access":"all"},"busarea_discrepancy_open":{"access":"all"},"busarea_discrepancy_resolve":{"access":"all"},"busarea_discrepancy_update":{"access":"all"},"dept_discrepancy_new":{"access":"all"},"dept_discrepancy_open":{"access":"all"},"dept_discrepancy_resolved":{"access":"all"},"dept_discrepancy_update":{"access":"all"},"discrepancy":{"access":"all"},"discrepancy_db":{"access":"all"},"discrepancy_new":{"access":"all"},"discrepancy_open":{"access":"read"},"discrepancy_outofstation":{"access":"all"},"discrepancy_resolved":{"access":"all"},"discrepancy_update":{"access":"all"},"ecard":{"access":"all"},"ecard_attachments":{"access":"all"},"heatmap":{"access":"all"},"help":{"access":"all"},"meeting_notes":{"access":"all"},"no_access":{"access":"none"},"operation":{"access":"all"},"operation_open":{"access":"all"},"operation_resolved":{"access":"all"},"operation_update":{"access":"read"},"partno_validation":{"access":"all"},"picvalidation_actual_add":{"access":"all"},"picvalidation_applytofleet":{"access":"all"},"qc_checklist":{"access":"all"},"schedule":{"access":"all"},"serail_no_log":{"access":"all"},"settings":{"access":"all"},"shortage":{"access":"all"},"shortage_new":{"access":"all"},"shortage_open":{"access":"all"},"shortage_resolved":{"access":"all"},"shortage_update":{"access":"all"}}}}',null);
        SingleRequestMock alldepartmentdata = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/userauthorization/15',permissionsdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/alldepartments',alldepartmentdata);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        userAuthentication.getPermissions();
        UserListingController.getallDepartments();
    } 
    
    // Test Method for User List
    public static testmethod void UserListTest() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock userlist = new SingleRequestMock(200,'SUCCESS','{"data":{"user":[{"approle_id":1,"approle_name":"Admin","appuser_id":12,"appuser_name":"11112","department_id":102,"department_name":"CHASSIS DEPARTMENT-4B","first_name":"Carls","is_active":true,"last_name":"Berg","pin":"1234"},{"approle_id":2,"approle_name":"DepartmentSupervisor","appuser_id":13,"appuser_name":"11113","department_id":103,"department_name":"CHASSIS DEPARTMENT-4C","first_name":"William","is_active":true,"last_name":"Jose","pin":"1234"},{"approle_id":3,"approle_name":"ECardAnalyst","appuser_id":15,"appuser_name":"11115","department_id":104,"department_name":"BODY DEPARTMENT-05A","first_name":"Christopher","is_active":true,"last_name":"Don","pin":"1234"}]}}',null);
        SingleRequestMock customerlist = new SingleRequestMock(200,'SUCCESS','{"data":{"customer":[{"customer_id":1,"customer_name":"Disney,LA"},{"customer_id":2,"customer_name":"Atlanta,GA"}]}}',null);  
        SingleRequestMock roleslist = new SingleRequestMock(200,'SUCCESS','{"data":{"roles":[{"approle_id":1,"approle_name":"Admin"},{"approle_id":2,"approle_name":"DepartmentSupervisor"},{"approle_id":3,"approle_name":"ECardAnalyst"},{"approle_id":4,"approle_name":"QC"},{"approle_id":5,"approle_name":"Production"},{"approle_id":6,"approle_name":"Customer"},{"approle_id":7,"approle_name":"Guest"}]}}',null);     
        SingleRequestMock addnewuserresult = new SingleRequestMock(200,'SUCCESS','{appuser_name: "Ajay",first_name: "Krishna R",last_name: "Krishna R",pin: 12345,approle_id: 3,department : 101,customername : 1}',null); 
        SingleRequestMock resetuserpinresult = new SingleRequestMock(200,'SUCCESS','{"status":success}',null);
        SingleRequestMock deactivateuserresult = new SingleRequestMock(200,'SUCCESS','{success}',null);
        SingleRequestMock deactivateuserresulterror = new SingleRequestMock(401,'NOT FOUND','{exception}',null);
        SingleRequestMock updateuserresult = new SingleRequestMock(200,'SUCCESS','Keep the valid result here.',null);
        SingleRequestMock alldepartmentdata = new SingleRequestMock(200,'SUCCESS','{{"data": {"departments": [{"bus_area_discrepancy_enabled": false,"created_date": "2020-12-09T07:45:25.086189+00:00","createdby_id": null,"defect_type": "department","department_id": 21,"department_name": "03 - ELECTRICAL","factory_id": 1,"guid": null,"is_assembly_line": true,"modified_date": "2021-03-12T12:30:33.255626+00:00","modifiedby_id": null,"reference_key": "03"},{"bus_area_discrepancy_enabled": false,                "created_date": "2020-09-25T06:01:57.619806+00:00","createdby_id": null,"defect_type": "department","department_id": 1,"department_name": "04A - CHASSIS","factory_id": 1,"guid": null,"is_assembly_line": true, "modified_date": "2021-03-12T12:30:33.255626+00:00","modifiedby_id": null,"reference_key": "04A"}]}}',null);
        
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',userlist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/customers',customerlist);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/userroles',roleslist);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/addnewUser',addnewuserresult);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/resetuserpin',resetuserpinresult);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',deactivateuserresult);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/alldepartments',alldepartmentdata);
        //endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',deactivateuserresulterror);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',updateuserresult);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        UserListingController.getallUsers();
        UserListingController.getallCustomers();
        UserListingController.getalluserroles();
        UserListingController.addnewUser('Pass the valid stringified JSON body here.');
        UserListingController.resetuserpin('Pass the valid stringified JSON body here.');
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',deactivateuserresult);  
        HttpCalloutMock multiCalloutMock1 = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock1);
        UserListingController.updatednewUser('Pass the valid stringified JSON body here.');
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',updateuserresult);
        HttpCalloutMock multiCalloutMock2 = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock2);
        UserListingController.deactivateUser('{appuser_id:15,is_active:true}');
        System.debug('@@@ getallDepartments Call from Test Class');
        UserListingController.getallDepartments();
        
    } 
    
    public static testmethod void UserListTestNegative() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock userlist = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock customerlist = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock roleslist = new SingleRequestMock(404,'ERROR','NOT FOUND',null);     
        SingleRequestMock addnewuserresult = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock resetuserpinresult = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock deactivateuserresult = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock deactivateuserresulterror = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock updateuserresult = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',userlist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/customers',customerlist);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/userroles',roleslist);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/addnewUser',addnewuserresult);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/resetuserpin',resetuserpinresult);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',deactivateuserresult);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',updateuserresult);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        UserListingController.getallUsers();
        UserListingController.getallCustomers();
        UserListingController.getalluserroles();
        UserListingController.addnewUser('Pass the valid stringified JSON body here.');
        UserListingController.resetuserpin('Pass the valid stringified JSON body here.');
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',deactivateuserresult);  
        HttpCalloutMock multiCalloutMock1 = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock1);
        UserListingController.updatednewUser('Pass the valid stringified JSON body here.');
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/user',updateuserresult);
        HttpCalloutMock multiCalloutMock2 = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock2);
        UserListingController.deactivateUser('{appuser_id:15,is_active:true}');
    } 
    
    // Test Method for Ecard List View
    public static testmethod void EcardListviewTest(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock ecardsdata = new SingleRequestMock(200,'SUCCESS','{"data":{"ecard":[{"ac_system_pdi":"Air 10122","actual_delivery_date":null,"bus_start_date":"2020-08-09T05:55:14.296623+00:00","buspropulsion_name":"Hybrid Electric","busstatus_name":"On Delivery","bustype_name":"Trolley","chassis_no":"876903","coach_no":"G945678932","coach_weight_unladen":"38","completed_date":"2020-08-10T04:59:36+00:00","customer_name":"Disney,LA","ecard_id":7,"end_date":null,"front_axle_weight":"test. axle weight","has_discrepancy":true,"has_part_shortage":true,"io_program":"Test I/o program","odometer":"876777","open_discrepancy_total":31,"part_shortage_total":17,"schedule_date":"2020-08-18T02:57:11+00:00","scheduled_delivery_date":null,"start_date":"2020-08-12T07:04:53.176864+00:00","workcenter_id":105,"workcenter_name":"4800"},{"ac_system_pdi":null,"actual_delivery_date":null,"bus_start_date":"2020-08-09T05:55:14.296623+00:00","buspropulsion_name":"Battery Electric","busstatus_name":"Out of Factory","bustype_name":"Trolley","chassis_no":"435218","coach_no":"G545678932","coach_weight_unladen":"Utest","completed_date":"2020-07-30T00:00:00+00:00","customer_name":"Disney,LA","ecard_id":9,"end_date":null,"front_axle_weight":"Utest","has_discrepancy":true,"has_part_shortage":true,"io_program":"Utest","odometer":"Utest","open_discrepancy_total":192,"part_shortage_total":195,"schedule_date":"2020-08-17T00:57:11+00:00","scheduled_delivery_date":null,"start_date":"2020-08-12T07:04:53.176864+00:00","workcenter_id":106,"workcenter_name":"405"}]}}',null);
        SingleRequestMock ecardpdf = new SingleRequestMock(200,'SUCCESS','{"data":{"EcardPdfUrl":"https://docraptor.com/download/31b6310d-a52a-437f-a7aa-8bdabdb3026a"}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecards/WIP',ecardsdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/generate_html/1',ecardpdf);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        ecardListController.getEcarddataWrapper('WIP');
        ecardListController.getecardpdf('1');
    }
    public static testmethod void EcardListviewNegativeTest(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock ecardsdata = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
        SingleRequestMock ecardpdf = new SingleRequestMock(500,'ERROR','Something went wrong. Please try again later',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecards',ecardsdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/generate_html/101',ecardpdf);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        //ecardListController.getEcarddataWrapper();
        ecardListController.getecardpdf('101');
        ecardListController.DataWrapperforEcardList testlist=new ecardListController.DataWrapperforEcardList();
    }
    public static testmethod void EcardOperationsTest1(){
                   SingleRequestMock getOperationslist = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"has_discrepancy":true,"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}],"qc":[{"appuser_name":"11112","employee_id":2,"first_name":"Carls"},{"appuser_name":"11113","employee_id":3,"first_name":"William"}],"workcenter":[{"buildstation":[{"buildstation_code":"4065","buildstation_id":159,"buildstationmapping_id":1227,"ecard_operation_log_id":420,"fleet_id":1,"forman1_id":{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"has_bm35":true,"has_buildpaper":null,"has_discrepancy":null,"has_discrepancy_logged":true,"has_epcpco":null,"has_help_document":null,"has_pco":true,"has_shortage_logged":true,"has_validation_pic":null,"operation":"INSTL FRT THRESHOLD HEATER","picture_validation_id":178,"picture_validation_target_image_id":166,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju "},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul"}],"qc_approvedby_id":{"appuser_name":"11116","employee_id":5,"first_name":"Ben ","last_name":"Calton"},"qc_updatedby_id":5,"status":"reject","validation_pic_required":null}],"workcenter_id":93,"workcentername":"4055"}]}}',null);
 
        
    }
    // Test Method for Ecard Operations 
    public static testmethod void EcardOperationsTestI(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock getOperationslist = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"has_discrepancy":true,"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}],"qc":[{"appuser_name":"11112","employee_id":2,"first_name":"Carls"},{"appuser_name":"11113","employee_id":3,"first_name":"William"}],"workcenter":[{"buildstation":[{"buildstation_code":"4065","buildstation_id":159,"buildstationmapping_id":1227,"ecard_operation_log_id":420,"fleet_id":1,"forman1_id":{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"has_bm35":true,"has_buildpaper":null,"has_discrepancy":null,"has_discrepancy_logged":true,"has_epcpco":null,"has_help_document":null,"has_pco":true,"has_shortage_logged":true,"has_validation_pic":null,"operation":"INSTL FRT THRESHOLD HEATER","picture_validation_id":178,"picture_validation_target_image_id":166,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju "},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul"}],"qc_approvedby_id":{"appuser_name":"11116","employee_id":5,"first_name":"Ben ","last_name":"Calton"},"qc_updatedby_id":5,"status":"reject","validation_pic_required":null}],"workcenter_id":93,"workcentername":"4055"}]}}',null);
        SingleRequestMock getDefectCodes = new SingleRequestMock(200,'SUCCESS','{"data":{"defects":[{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":2,"defect_code":"170","defect_name":"Dents","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":3,"defect_code":"180","defect_name":"Sand Marks","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":4,"defect_code":"190","defect_name":"Fish Eye","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":5,"defect_code":"200","defect_name":"Scratch","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":6,"defect_code":"210","defect_name":"Overspray","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-06-17T09:12:35.915022+00:00","createdby_id":null,"dat_defect_code_id":7,"defect_code":"230","defect_name":"Water Marks","defect_type":"paint","guid":null,"modified_date":null,"modifiedby_id":null}]}}',null);  
        SingleRequestMock ecarddiscrepancy = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"discrepancylog":[{"assigend_qc_id":null,"buildstation_code":"4080","buildstation_id":162,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":21,"defect_code":"10","defect_name":"Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"Test Des1","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":497,"ecard_id":7,"ecard_operation_log_id":426,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-18T04:43:08+00:00","raised_status_updated_date":"2020-08-18T04:43:08.180212+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"},{"assigend_qc_id":null,"buildstation_code":"4065","buildstation_id":159,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"CharlieA","employee_id":2652,"first_name":"Charlie","last_name":"Ababseh"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":22,"defect_code":"11","defect_name":"Alr Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"jjj","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":496,"ecard_id":7,"ecard_operation_log_id":420,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-17T18:31:44+00:00","raised_status_updated_date":"2020-08-17T18:31:44.999590+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"}],"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}]}}',null); 
        SingleRequestMock sample = new SingleRequestMock(200,'SUCCESS','',null); 
        SingleRequestMock getShortageslist = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"discrepancylog":[{"assigend_qc_id":null,"buildstation_code":"4080","buildstation_id":162,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":21,"defect_code":"10","defect_name":"Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"Test Des1","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":497,"ecard_id":7,"ecard_operation_log_id":426,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-18T04:43:08+00:00","raised_status_updated_date":"2020-08-18T04:43:08.180212+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"},{"assigend_qc_id":null,"buildstation_code":"4065","buildstation_id":159,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"CharlieA","employee_id":2652,"first_name":"Charlie","last_name":"Ababseh"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":22,"defect_code":"11","defect_name":"Alr Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"jjj","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":496,"ecard_id":7,"ecard_operation_log_id":420,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-17T18:31:44+00:00","raised_status_updated_date":"2020-08-17T18:31:44.999590+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"}],"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}]}',null); 
        SingleRequestMock insertOperationlog = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"discrepancylog":[{"assigend_qc_id":null,"buildstation_code":"4080","buildstation_id":162,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":21,"defect_code":"10","defect_name":"Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"Test Des1","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":497,"ecard_id":7,"ecard_operation_log_id":426,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-18T04:43:08+00:00","raised_status_updated_date":"2020-08-18T04:43:08.180212+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"},{"assigend_qc_id":null,"buildstation_code":"4065","buildstation_id":159,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"CharlieA","employee_id":2652,"first_name":"Charlie","last_name":"Ababseh"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":22,"defect_code":"11","defect_name":"Alr Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"jjj","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":496,"ecard_id":7,"ecard_operation_log_id":420,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-17T18:31:44+00:00","raised_status_updated_date":"2020-08-17T18:31:44.999590+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"}],"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}]}',null); 
        SingleRequestMock updateOperationlog = new SingleRequestMock(200,'SUCCESS','{"data":{"department_id":101,"discrepancylog":[{"assigend_qc_id":null,"buildstation_code":"4080","buildstation_id":162,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":21,"defect_code":"10","defect_name":"Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"Test Des1","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":497,"ecard_id":7,"ecard_operation_log_id":426,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-18T04:43:08+00:00","raised_status_updated_date":"2020-08-18T04:43:08.180212+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"},{"assigend_qc_id":null,"buildstation_code":"4065","buildstation_id":159,"bus_area":null,"bus_area_picture_id":null,"busstatus_id":9,"busstatus_name":"On Delivery","chassis_no":"876903","component":null,"createdby_id":{"appuser_name":"CharlieA","employee_id":2652,"first_name":"Charlie","last_name":"Ababseh"},"customer_name":"Disney,LA","cut_off_date":null,"dat_defect_code_id":22,"defect_code":"11","defect_name":"Alr Leak","defect_type":"department","department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","discrepancy":"jjj","discrepancy_priority":"Normal","discrepancy_status":"open","discrepancy_type":"department","ecard_discrepancy_log_id":496,"ecard_id":7,"ecard_operation_log_id":420,"forman1_id":null,"forman2_id":null,"forman3_id":null,"forman4_id":null,"forman5_id":null,"image_url":null,"prod":[{"appuser_name":"aaugustine","employee_id":1,"first_name":"Anju ","last_name":"Jacob"},{"appuser_name":"11115","employee_id":4,"first_name":"Christopher","last_name":"Don"},{"appuser_name":"22222","employee_id":6,"first_name":"Paul","last_name":"Roza"}],"raised_date":"2020-08-17T18:31:44+00:00","raised_status_updated_date":"2020-08-17T18:31:44.999590+00:00","resolved_date":null,"resolved_status_updated_date":null,"resolved_status_updatedby_id":null,"root_cause":null,"verified_date":null,"verified_status_updated_date":null,"verifiedby_id":null,"workcenter_code":null,"workcenter_name":"4055"}],"prod_supervisor":[{"appuser_name":"ManrajB","employee_id":2932,"first_name":"Manraj","last_name":"Banwait"}]}',null); 
        SingleRequestMock raiseBsDiscrepancy = new SingleRequestMock(200,'SUCCESS','{"ecard_discrepancy_log_id": 0,"discrepancy_type": "string","discrepancy_priority": "string","discrepancy_status": "string","has_part_shortage": true,"ecard_id": 0,"ecard_operation_log_id": 0,"ecard_discrepancy_area_id": 0}',null); 
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        //string 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/defectcode',getDefectCodes); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingdetails/{"ecard_id":"7","dept_id":101}',getOperationslist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancy/{"ecard_id":"7","dept_id":101}',ecarddiscrepancy);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy',getShortageslist); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',insertOperationlog); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',updateOperationlog); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',raiseBsDiscrepancy); 

	    HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        ecardOperationsController.getOperationslist('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getDepartmentOperations('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getDefectCodes(); 
        ecardOperationsController.getDiscrepancylist('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getDepartmentDiscrepancies('{"ecard_id":"7","dept_id":101}'); 
        ecardOperationsController.getShortageslist('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.insertOperationlog('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.updateOperationlog('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.raiseBsDiscrepancy('{"ecard_discrepancy_log_id": 0,"discrepancy_type": "string","discrepancy_priority": "string","discrepancy_status": "string","has_part_shortage": true,"ecard_id": 0,"ecard_operation_log_id": 0,"ecard_discrepancy_area_id": 0');
        ecardOperationsController.raisenewShortage('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.raiseDepartmentDiscrepancy('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getBusPartdetails('{"ecard_id":"7","build_station_id":101}');
        ecardOperationsController.updatePartshortage('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadTargetPicture('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadSourcePicture('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getTargetImage('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getTargetandActualImage('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getbuildstationPartSeriallogs('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getTargetandActualImage('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadNewAttachment('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getSlnoFiles('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getmeetingnotes('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getqcchecklist('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.gethelpdocument('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getecardattachments('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadNewAttachmenttoEcard('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getecardoperationlogattachments('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadAttachmenttoEcardOperationlog('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getdiscrepancylogattachments('{"s3_image_path":"filename.jpeg"}'); 
        ecardOperationsController.uploadAttachmenttoDiscrepancylog('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.uploadTempAttachment('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.deleteTempAttachment('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getbuildstationPartDetails('{"ecard_id":"7","buildstation_part-mapping_id":null,"dept_id":101}');
        ecardOperationsController.getoverviewDetails('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.getecardDetails('{"ecard_id":"7","dept_id":101}');
        ecardOperationsController.updateecardDetails('{"ecard_id":"7","dept_id":101}');
        //ecardOperationsController.updateecardDetails(NULL);
        
        
        ecardOperationsController.getDepartmentShortages('"ecard_id":"7"');
        ecardOperationsController.addnewDefectcode('"ecard_id":"7"');
        ecardOperationsController.updateDefectcode('"ecard_id":"7"');
        ecardOperationsController.updateDefectstatus('"ecard_id":"7"');
        ecardOperationsController.getAllMeetingNotes();
        ecardOperationsController.addnewMeetingNote('"meeting_note_id":"4"');
        ecardOperationsController.updateMeetingNote('"meeting_note_id":"5"');
        ecardOperationsController.deleteMeetingNote('"meeting_note_id":"6"');
        ecardOperationsController.deleteTargetPicture('{"fleet_id" : 222,"buildstation_id" : 183}');
        /*ecardOperationsController.getAllHelpDocs();
        ecardOperationsController.addnewHelpDocs('"ecard_id":"7"');
        ecardOperationsController.updateHelpDocs('"ecard_id":"7"');
        ecardOperationsController.deleteHelpDocs('"ecard_id":"7"');
        ecardOperationsController.addnewQCChecklists('"ecard_id":"7"');
        ecardOperationsController.getQCChecklists();
        ecardOperationsController.updateQCChecklists('"ecard_id":"7"');
        ecardOperationsController.deleteQCChecklists('{"qc_check_list_id" : 4}');
        ecardOperationsController.deleteEcardOperationattachment('{"ecard_atttachment_id" : 4}');
        ecardOperationsController.deleteEcardattachment('"ecard_id":"7"'); */
    }
    
    // Test Method for Ecard Operations 
    public static testmethod void EcardOperationsTestII(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock getOperationslist = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
        SingleRequestMock getDefectCodes = new SingleRequestMock(500,'ERROR','Something went wrong. Please try again later',null);
        SingleRequestMock ecarddiscrepancy = new SingleRequestMock(500,'ERROR','Something went wrong. Please try again later',null);
        SingleRequestMock sample = new SingleRequestMock(403,'ERROR','API key is missing.',null);
        SingleRequestMock getShortageslist = new SingleRequestMock(401,'ERROR','Incorrect username or password.',null);
        SingleRequestMock insertOperationlog = new SingleRequestMock(415,'ERROR','Content-Type header specified in HTTP request is not supported:',null);
        SingleRequestMock updateOperationlog = new SingleRequestMock(401,'ERROR','Incorrect username or password.',null);
        SingleRequestMock raiseBsDiscrepancy = new SingleRequestMock(403,'ERROR','API key is missing.',null);
        SingleRequestMock qcchecklistError = new SingleRequestMock(403,'ERROR','API key is missing.',null);
        
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        //string 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/defectcode',getDefectCodes); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingdetails/{"ecard_id":"7","dept_id":101}',getOperationslist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancy/{"ecard_id":"7","dept_id":101}',ecarddiscrepancy);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy',getShortageslist); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',insertOperationlog); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',updateOperationlog); 
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardoperationlog/{"ecard_id":"7","dept_id":101}',raiseBsDiscrepancy); 
        
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        ecardOperationsController.getOperationslist('NEGATIVE TEST');
        ecardOperationsController.getDefectCodes();
        ecardOperationsController.addnewDefectcode('"ecard_id":"7"');
        ecardOperationsController.updateDefectcode('"ecard_id":"7"');
        ecardOperationsController.updateDefectstatus('"ecard_id":"7"');
        ecardOperationsController.updateSerialNolog('"ecard_id":"7"');
        ecardOperationsController.getDiscrepancylist('NEGATIVE TEST');
        ecardOperationsController.getShortageslist('NEGATIVE TEST');
        
        ecardOperationsController.deleteSerialnoattachment('{"ecard_operation_log_attachment_id":"16"}');
        ecardOperationsController.deleteDiscrepancyattachment('{"ecard_operation_log_attachment_id":"16"}');
        ecardOperationsController.getpresigneds3Url('{"ecard_operation_log_attachment_id":"16"}');
        ecardOperationsController.uploadVINlabel('{"ecard_operation_log_attachment_id":"16"}'); 
        ecardOperationsController.uploadEmissionlabel('{"ecard_operation_log_attachment_id":"16"}'); 
        ecardOperationsController.deleteEmissionlabel('{"ecard_operation_log_attachment_id":"16"}'); 
        ecardOperationsController.deleteVinlabel('{"ecard_operation_log_attachment_id":"16"}'); 

        ecardOperationsController.getAllHelpDocs();
        ecardOperationsController.addnewHelpDocs('"ecard_id":"7"');
        ecardOperationsController.updateHelpDocs('"ecard_id":"7"');
        ecardOperationsController.deleteHelpDocs('"ecard_id":"7"');
        ecardOperationsController.addnewQCChecklists('"ecard_id":"7"');
        ecardOperationsController.getQCChecklists();
        ecardOperationsController.updateQCChecklists('"ecard_id":"7"');
        ecardOperationsController.deleteQCChecklists('{"qc_check_list_id" : 4}');
        ecardOperationsController.deleteEcardOperationattachment('{"ecard_atttachment_id" : 4}');
        ecardOperationsController.deleteEcardattachment('"ecard_id":"7"');
    }
    
    // Test Method for Ecard Operations 
    public static testmethod void EcardOperationsTestIII(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock addbusimage = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
        SingleRequestMock getrepopresigneds3Url=new SingleRequestMock(200,'SUCCESS','{"data": {"presigned_url": [{"s3path": "http://africau.edu/images/default/sample1.pdf","s3url": "https://ecard-qa.s3.amazonaws.com/EcardRepository/http%3A//africau.edu/images/default/sample1.pdf?AWSAccessKeyId=AKIAYVCUL7AQHMO4LPLN&Signature=YupEgDiS0HHwUFJFXGiTr082948%3D&Expires=1607414339"}]}}',null);
        SingleRequestMock getbuildstationbm35Details=new SingleRequestMock(200,'SUCCESS','{"data": {"buildstations_mapping_adon": []}}',null);
        SingleRequestMock getbuildstationpcoDetails=new SingleRequestMock(200,'SUCCESS','{"data": {"buildstations_mapping_adon": []}}',null);
        SingleRequestMock getbuildstationopcheckDetails=new SingleRequestMock(200,'SUCCESS','{"data": {"buildstations_mapping_adon": []}}',null);
        SingleRequestMock getdepartmentopcheckDetails=new SingleRequestMock(200,'SUCCESS','{"data": {"buildstations_mapping_adon": []}}',null);
        SingleRequestMock updateopchecks=new SingleRequestMock(200,'SUCCESS','{"data":{"op_check":{"buildstation_id":102,"created_date":"2020-12-08T07:41:31+00:00","createdby_id":238,"ecard_id":129,"guid":"7ad4e8c6-c838-4351-a047-70009bbef09e","modified_date":null,"modifiedby_id":null,"op_check_status":true,"op_check_value":null,"operation_check_id":244,"operation_check_log_id":620,"verifiedby_id":238}}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/repositorybucketfileurl',getrepopresigneds3Url);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingbm35details/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationbm35Details);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingpcodetails/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationpcoDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationopcheckDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck_by_ecardid_department_id/{"ecard_id":"339","department_id":null}',getdepartmentopcheckDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck',updateopchecks);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        ecardOperationsController.deleteDiscOrShortage('{"id":"986"}');
        ecardOperationsController.addbusimage('{"ecard_id":"7","ecard_image_url":"http://pngimg.com/uploads/bus/bus_png8615.png"}');
        ecardOperationsController.getrepopresigneds3Url('{"s3_file_paths":"[\"http://africau.edu/images/default/sample1.pdf\"]"}');
        ecardOperationsController.getbuildstationbm35Details('{"ecard_id": "129", "build_station_id": "54"}');
        ecardOperationsController.getbuildstationpcoDetails('{"ecard_id": "129", "build_station_id": "54"}');
        ecardOperationsController.getbuildstationopcheckDetails('{"ecard_id": "129", "build_station_id": "54"}');
        ecardOperationsController.getdepartmentopcheckDetails('{"ecard_id":"339","department_id":null}');
        ecardOperationsController.updateopchecks('{"ecard_id":"129","buildstation_id":"102","operation_check_id":"244","op_check_value":null,"op_check_status":true}');
        
    }
    public static testmethod void EcardOperationsTestIIINegative(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock discdelete = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
		SingleRequestMock addbusimage = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        SingleRequestMock getrepopresigneds3Url=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock getbuildstationbm35Details=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock getbuildstationpcoDetails=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock getbuildstationopcheckDetails=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock getdepartmentopcheckDetails=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock updateopchecks=new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock ecardpdf = new SingleRequestMock(200,'SUCCESS','{"data":{"EcardPdfUrl":"https://docraptor.com/download/31b6310d-a52a-437f-a7aa-8bdabdb3026a"}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/discrepancy/{"id":"986"}',discdelete);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/addfleetimage/{"fleet_id":"0001","fleet_image_url":null}',addbusimage);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/repositorybucketfileurl',getrepopresigneds3Url);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingbm35details/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationbm35Details);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstationmappingpcodetails/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationpcoDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck/{"ecard_id": "129", "build_station_id": "54"}',getbuildstationopcheckDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck_by_ecardid_department_id/{"ecard_id":"339","department_id":null}',getdepartmentopcheckDetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/operationcheck',updateopchecks);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        ecardOperationsController.addbusimage('{"fleet_id":"0001","fleet_image_url":null}');
        ecardOperationsController.deleteDiscOrShortage('{"id":"986"}');
        ecardOperationsController.getrepopresigneds3Url('{"s3_file_paths":"[\"http://africau.edu/images/default/sample1.pdf\"]"}');
        ecardOperationsController.getbuildstationbm35Details('{ecard_id: "129", build_station_id: 54}');
        ecardOperationsController.getbuildstationpcoDetails('{"ecard_id": "129", "build_station_id": "54"}');
        ecardOperationsController.getbuildstationopcheckDetails('{"ecard_id": "129", "build_station_id": "54"}');
        ecardOperationsController.getdepartmentopcheckDetails('{"ecard_id":"339","department_id":null}');
        ecardOperationsController.updateopchecks('{"ecard_id":"129","buildstation_id":"102","operation_check_id":"244","op_check_value":null,"op_check_status":true}');
    }
    // Test Method for Masterdata views
    public static testmethod void getMasterdataTest() {
        string authdata = '{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiYWM5NTU5YjMtZGIyZC00MjhkLWE0MWEtMjAyNTA4OTRhNGY3IiwiZXhwIjoxNTkxMzY5ODY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.hCO8CbXyGB3fDUpdXEoq3OTDUhEOGKD4nxcT-WcL0Zs","expiry_token":1591369864,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiMTkwNDhjNWYtYWRhYS00MDM2LTkzMWItMzk4YWQwNjUyZTdhIiwiZXhwIjoxNTkzOTYwMDY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sInR5cGUiOiJyZWZyZXNoIn0.C6p8kS9krMMoTNPAfyb6sybAv49rEtlXoIiW2me_wa0"}';
        
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock buspropulsion = new SingleRequestMock(200,
                                                                'SUCCESS',
                                                                '{"data":{"buspropulsion":[{"buspropulsion_id":1,"buspropulsion_name":"CNG"},{"buspropulsion_id":2,"buspropulsion_name":"Diesel"},{"buspropulsion_id":3,"buspropulsion_name":"Hybrid Electric"},{"buspropulsion_id":4,"buspropulsion_name":"Battery Electric"},{"buspropulsion_id":5,"buspropulsion_name":"BAE"}]}}',
                                                                null);
        
        SingleRequestMock busstatus = new SingleRequestMock(200,
                                                            'SUCCESS',
                                                            '{"data":{"busstatus":[{"busstatus_id":1,"busstatus_name":"Staging"},{"busstatus_id":2,"busstatus_name":"WIP"},{"busstatus_id":3,"busstatus_name":"Out of Factory"},{"busstatus_id":4,"busstatus_name":"Ready Row"},{"busstatus_id":5,"busstatus_name":"Sold"},{"busstatus_id":6,"busstatus_name":"Out for Test"},{"busstatus_id":7,"busstatus_name":"Altoona"},{"busstatus_id":8,"busstatus_name":"Road Test"},{"busstatus_id":9,"busstatus_name":"On Delivery"},{"busstatus_id":10,"busstatus_name":"Repair Shop"},{"busstatus_id":11,"busstatus_name":"PDI"},{"busstatus_id":12,"busstatus_name":"In Service"}]}}',
                                                            null);
        SingleRequestMock bustype = new SingleRequestMock(200,
                                                          'SUCCESS',
                                                          '{"data":{"bustype":[{"bustype_id":4,"bustype_name":"Low Floor"},{"bustype_id":5,"bustype_name":"Low Floor Plus"},{"bustype_id":6,"bustype_name":"BRT"},{"bustype_id":7,"bustype_name":"BRT Plus"},{"bustype_id":2,"bustype_name":"Commuter"},{"bustype_id":1,"bustype_name":"Trolley"},{"bustype_id":3,"bustype_name":"Other"}]}}',
                                                          null);
        
        
        Test.setMock(HttpCalloutMock.class, buspropulsion);
        masterDataController.getBusPropulsionsdata(authdata);
        Test.setMock(HttpCalloutMock.class, busstatus);
        masterDataController.getBusStatusdata(authdata);
        Test.setMock(HttpCalloutMock.class, bustype);
        masterDataController.getBusTypedata(authdata);
        SingleRequestMock factory = new SingleRequestMock(200,
                                                          'SUCCESS',
                                                          '{"data":[{"created_date":"2020-05-08T06:03:22.158366+00:00","createdby_id":null,"factory_id":1,"factory_name":"Fact1","guid":"a0315187-5796-49b7-9d9c-2102ac538f07","modified_date":null,"modifiedby_id":null}]}',
                                                          null);
        Test.setMock(HttpCalloutMock.class, factory);
        masterDataController.getFactorydata(authdata);
        SingleRequestMock departments = new SingleRequestMock(200,
                                                              'SUCCESS',
                                                              '{"data":{"departments":[{"created_date":"2020-05-29T00:28:49.056228+00:00","createdby_id":null,"department_id":101,"department_name":"CHASSIS DEPARTMENT-4A","factory_id":1,"guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-05-29T00:32:20.405640+00:00","createdby_id":null,"department_id":102,"department_name":"CHASSIS DEPARTMENT-4B","factory_id":1,"guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-05-29T00:35:50.986147+00:00","createdby_id":null,"department_id":103,"department_name":"CHASSIS DEPARTMENT-4C","factory_id":1,"guid":null,"modified_date":null,"modifiedby_id":null},{"created_date":"2020-05-29T00:40:52.856008+00:00","createdby_id":null,"department_id":104,"department_name":"BODY DEPARTMENT-05A","factory_id":1,"guid":null,"modified_date":null,"modifiedby_id":null}]}}',
                                                              null);
        
        
        SingleRequestMock fleets = new SingleRequestMock(200,
                                                         'SUCCESS',
                                                         '{"data":[{"created_date":"2020-05-08T06:03:22.158366+00:00","createdby_id":null,"factory_id":1,"fleet_id":1,"fleet_name":"Fleet1","guid":null,"modified_date":null,"modifiedby_id":null}]}',
                                                         null);
        SingleRequestMock workcenters = new SingleRequestMock(200,
                                                              'SUCCESS',
                                                              '{"data":[{"created_date":"2020-05-29T01:02:35.605666+00:00","createdby_id":null,"department_id":109,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"workcenter_code":null,"workcenter_id":169,"workcenter_name":"770"},{"created_date":"2020-05-29T01:02:52.995999+00:00","createdby_id":null,"department_id":110,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"workcenter_code":null,"workcenter_id":170,"workcenter_name":"327"},{"created_date":"2020-05-29T01:03:02.126277+00:00","createdby_id":null,"department_id":110,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"workcenter_code":null,"workcenter_id":171,"workcenter_name":"328"},{"created_date":"2020-05-29T01:03:19.646756+00:00","createdby_id":null,"department_id":110,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"workcenter_code":null,"workcenter_id":172,"workcenter_name":"329"}]}',
                                                              null);
        SingleRequestMock login = new SingleRequestMock(200,
                                                        'SUCCESS',
                                                        '{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTE2MTAzNjksIm5iZiI6MTU5MTYxMDM2OSwianRpIjoiNmMyNmY3NDQtNGZmMC00MGU3LWJiODAtMDM1Mzg3MGRiNjAyIiwiZXhwIjoxNTkxNjEyMTY5LCJpZGVudGl0eSI6eyJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwdXNlcl9pZCI6MiwibGFzdF9uYW1lIjoiam9zZSIsImFwcHJvbGVfaWQiOjEsInVzZXJfdHlwZSI6ImVtcCIsImFwcHVzZXJfbmFtZSI6IjEyMzQ1In0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.5nTvBfX7ELHnv7NFaD2kCGslowuiV5r1EhUUkQ3a0VA","expiry_token":1591612169,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTE2MTAzNjksIm5iZiI6MTU5MTYxMDM2OSwianRpIjoiZWE1NDAxZjMtY2ZjNi00NTAwLThlMjUtZDRkNTI0OTIwZDI2IiwiZXhwIjoxNTk0MjAyMzY5LCJpZGVudGl0eSI6eyJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwdXNlcl9pZCI6MiwibGFzdF9uYW1lIjoiam9zZSIsImFwcHJvbGVfaWQiOjEsInVzZXJfdHlwZSI6ImVtcCIsImFwcHVzZXJfbmFtZSI6IjEyMzQ1In0sInR5cGUiOiJyZWZyZXNoIn0.sx2UNH9re5eW_4Ed-uc5YXDaLL0vxkuetF9kGDJ5ShY"},"user":{"approle_id":1,"appuser_id":2,"appuser_name":"12345","first_name":"Tom","last_name":"jose","user_type":"emp"}}}',
                                                        null);
        SingleRequestMock refresh = new SingleRequestMock(200,
                                                          'SUCCESS',
                                                          '{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTE2MTU4NTIsIm5iZiI6MTU5MTYxNTg1MiwianRpIjoiY2E5ZTQ0OTgtYTc4Yi00ZmQ3LTljYTktZjBjY2QxMzVhYjEyIiwiZXhwIjoxNTkxNjE3NjUyLCJpZGVudGl0eSI6eyJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwdXNlcl9pZCI6MiwibGFzdF9uYW1lIjoiam9zZSIsImFwcHJvbGVfaWQiOjEsInVzZXJfdHlwZSI6ImVtcCIsImFwcHVzZXJfbmFtZSI6IjEyMzQ1In0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.1ZgOSCxwinmeipp9Mh0Ae-yjAUPXyaZ7A8k-GXfRdGE","expiry_token":1591617652}',
                                                          null);
        
        
        
        SingleRequestMock buildstations = new SingleRequestMock(200,
                                                                'SUCCESS',
                                                                '{"data":[{"buildstation_code":"4070","buildstation_id":160,"created_date":"2020-05-29T00:30:53.795514+00:00","createdby_id":null,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"operation":"WHEEL WELL PIPING"},{"buildstation_code":"4075","buildstation_id":161,"created_date":"2020-05-29T00:31:02.416088+00:00","createdby_id":null,"factory_id":null,"guid":null,"modified_date":null,"modifiedby_id":null,"operation":"INSTL STEERING GEAR"}]}',
                                                                null);
        
        
        
        
        Map<String, HttpCalloutMock> endpoint2TestResp =
            new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/login',login);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/departments',departments);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/factories',factory);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/fleets',fleets);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/workcenters',workcenters);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstations',buildstations);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/refresh',refresh);
        
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        masterDataController.getWorkcentredata(authdata);
        masterDataController.getFleetsdata(authdata);
        masterDataController.getBuildstationsdata(authdata);
        
    }
    
    // Test Method for Masterdata views
    public static testmethod void masterdataTestNegative() {
        string authdata = '{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiYWM5NTU5YjMtZGIyZC00MjhkLWE0MWEtMjAyNTA4OTRhNGY3IiwiZXhwIjoxNTkxMzY5ODY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.hCO8CbXyGB3fDUpdXEoq3OTDUhEOGKD4nxcT-WcL0Zs","expiry_token":1591369864,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiMTkwNDhjNWYtYWRhYS00MDM2LTkzMWItMzk4YWQwNjUyZTdhIiwiZXhwIjoxNTkzOTYwMDY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sInR5cGUiOiJyZWZyZXNoIn0.C6p8kS9krMMoTNPAfyb6sybAv49rEtlXoIiW2me_wa0"}';
        SingleRequestMock logindata = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock buspropulsion = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock busstatus = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock bustype = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
		SingleRequestMock addbusimage = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
		SingleRequestMock getfleetimageurls = new SingleRequestMock(404,'ERROR','NOT FOUND',null); 
        
        Test.setMock(HttpCalloutMock.class, buspropulsion);
        masterDataController.getBusPropulsionsdata(authdata);
        Test.setMock(HttpCalloutMock.class, busstatus);
        masterDataController.getBusStatusdata(authdata);
        Test.setMock(HttpCalloutMock.class, bustype);
        masterDataController.getBusTypedata(authdata);
        SingleRequestMock factory = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        Test.setMock(HttpCalloutMock.class, factory);
        masterDataController.getFactorydata(authdata);
        SingleRequestMock departments = new SingleRequestMock(404,'ERROR','NOT FOUND',null);

        SingleRequestMock fleets = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock workcenters = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock login = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock refresh = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        SingleRequestMock buildstations = new SingleRequestMock(404,'ERROR','NOT FOUND',null);
        Map<String, HttpCalloutMock> endpoint2TestResp =
        new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/',login);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/login',login);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/departments',departments);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/factories',factory);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/fleets',fleets);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/workcenters',workcenters);  
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buildstations',buildstations);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/refresh',refresh);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/addfleetimage',addbusimage);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/fleets',getfleetimageurls);
        
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        //masterDataController.getWorkcentredata(authdata);
        //masterDataController.getFleetsdata(authdata);
        masterDataController.getBuildstationsdata(authdata);
		//masterDataController.addbusimage('{"fleet_id":"0001","fleet_image_url":null}');
        masterDataController.getfleetimageurls();
    }
    
    // Test Method for Schedule Board Component
    public static testmethod void getDatawrapperforScheduleBoardTest() {
        string authdata = '{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiYWM5NTU5YjMtZGIyZC00MjhkLWE0MWEtMjAyNTA4OTRhNGY3IiwiZXhwIjoxNTkxMzY5ODY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.hCO8CbXyGB3fDUpdXEoq3OTDUhEOGKD4nxcT-WcL0Zs","expiry_token":1591369864,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTEzNjgwNjQsIm5iZiI6MTU5MTM2ODA2NCwianRpIjoiMTkwNDhjNWYtYWRhYS00MDM2LTkzMWItMzk4YWQwNjUyZTdhIiwiZXhwIjoxNTkzOTYwMDY0LCJpZGVudGl0eSI6eyJsYXN0X25hbWUiOiJqb3NlIiwiYXBwdXNlcl9uYW1lIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiVG9tIiwiYXBwcm9sZV9pZCI6MSwidXNlcl90eXBlIjoiZW1wIiwiYXBwdXNlcl9pZCI6Mn0sInR5cGUiOiJyZWZyZXNoIn0.C6p8kS9krMMoTNPAfyb6sybAv49rEtlXoIiW2me_wa0"}';
        
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock scheduledata = new SingleRequestMock(200,
                                                               'SUCCESS',
                                                               '{"data":{"ecard":[{"buspropulsion_name":"Diesel","busstatus_name":"Staging","bustype_name":"Trolley","chassis_no":"chassis_no-C-1234","coach_no":"coach_no-Ko091","end_date":null,"first_name":"jack","has_discrepancy":null,"has_part_shortage":null,"open_discrepancy_total":null,"part_shortage_total":null,"schedule_date":"2020-05-08T09:57:11.220870+00:00","start_date":"2020-05-18T09:16:16.451155+00:00"},{"buspropulsion_name":"CNG","busstatus_name":"Out for Test","bustype_name":"Trolley","chassis_no":"chassis_no-C-123","coach_no":"coach_no-Ko09","end_date":null,"first_name":"jack","has_discrepancy":false,"has_part_shortage":null,"open_discrepancy_total":null,"part_shortage_total":null,"schedule_date":"2020-05-08T09:57:11.220870+00:00","start_date":"2020-05-18T09:16:16.451155+00:00"}]}}',
                                                               null);
        SingleRequestMock deptscheduledata = new SingleRequestMock(200,
                                                               'SUCCESS',
                                                               '{"data":{"ecard":[{"buspropulsion_name":"Diesel","busstatus_name":"Staging","bustype_name":"Trolley","chassis_no":"chassis_no-C-1234","coach_no":"coach_no-Ko091","end_date":null,"first_name":"jack","has_discrepancy":null,"has_part_shortage":null,"open_discrepancy_total":null,"part_shortage_total":null,"schedule_date":"2020-05-08T09:57:11.220870+00:00","start_date":"2020-05-18T09:16:16.451155+00:00"},{"buspropulsion_name":"CNG","busstatus_name":"Out for Test","bustype_name":"Trolley","chassis_no":"chassis_no-C-123","coach_no":"coach_no-Ko09","end_date":null,"first_name":"jack","has_discrepancy":false,"has_part_shortage":null,"open_discrepancy_total":null,"part_shortage_total":null,"schedule_date":"2020-05-08T09:57:11.220870+00:00","start_date":"2020-05-18T09:16:16.451155+00:00"}]}}',
                                                               null);
        SingleRequestMock buspropulsion = new SingleRequestMock(200,
                                                                'SUCCESS',
                                                                '{"data":{"buspropulsion":[{"buspropulsion_id":1,"buspropulsion_name":"CNG"},{"buspropulsion_id":2,"buspropulsion_name":"Diesel"},{"buspropulsion_id":3,"buspropulsion_name":"Hybrid Electric"},{"buspropulsion_id":4,"buspropulsion_name":"Battery Electric"},{"buspropulsion_id":5,"buspropulsion_name":"BAE"}]}}',
                                                                null);
        
        SingleRequestMock busstatus = new SingleRequestMock(200,
                                                            'SUCCESS',
                                                            '{"data":{"busstatus":[{"busstatus_id":1,"busstatus_name":"Staging"},{"busstatus_id":2,"busstatus_name":"WIP"},{"busstatus_id":3,"busstatus_name":"Out of Factory"},{"busstatus_id":4,"busstatus_name":"Ready Row"},{"busstatus_id":5,"busstatus_name":"Sold"},{"busstatus_id":6,"busstatus_name":"Out for Test"},{"busstatus_id":7,"busstatus_name":"Altoona"},{"busstatus_id":8,"busstatus_name":"Road Test"},{"busstatus_id":9,"busstatus_name":"On Delivery"},{"busstatus_id":10,"busstatus_name":"Repair Shop"},{"busstatus_id":11,"busstatus_name":"PDI"},{"busstatus_id":12,"busstatus_name":"In Service"}]}}',
                                                            null);
        SingleRequestMock bustype = new SingleRequestMock(200,
                                                          'SUCCESS',
                                                          '{"data":{"bustype":[{"bustype_id":4,"bustype_name":"Low Floor"},{"bustype_id":5,"bustype_name":"Low Floor Plus"},{"bustype_id":6,"bustype_name":"BRT"},{"bustype_id":7,"bustype_name":"BRT Plus"},{"bustype_id":2,"bustype_name":"Commuter"},{"bustype_id":1,"bustype_name":"Trolley"},{"bustype_id":3,"bustype_name":"Other"}]}}',
                                                          null);
        
        SingleRequestMock bustypeerror = new SingleRequestMock(401,
                                                               'ERROR',
                                                               '',
                                                               null);
        
        
        Map<String, HttpCalloutMock> endpoint2TestResp =
            new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardschedule',scheduledata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddepartmentschedule/',deptscheduledata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/buspropulsions',buspropulsion);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/busstatus',busstatus);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/bustype',bustype); 
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        scheduleBoardController.getScheduleBoardData(null);
        scheduleBoardController.getScheduleBoardData('1');
        scheduleBoardController.getPicklistOptions('buspropulsions');
        scheduleBoardController.getPicklistOptions('busstatus');
        scheduleBoardController.getPicklistOptions('bustype');
        
    }
    
    // Positive Test Method for CrewingScheduleController
    public static testmethod void CrewingSchedulePositiveTest(){
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
        SingleRequestMock crewingassigneddeptdata = new SingleRequestMock(200,'SUCCESS','{"data":{"department":[{"assigned_emp":[],"dept_id":1,"dept_name":"04A - CHASSIS"},{"assigned_emp":[],"dept_id":2,"dept_name":"04B - CHASSIS"}]}}',null);
        SingleRequestMock crewingunassigneddeptdata = new SingleRequestMock(200,'SUCCESS','{"data":{"department":[{"assigned_emp":[],"dept_id":1,"dept_name":"04A - CHASSIS"},{"assigned_emp":[],"dept_id":2,"dept_name":"04B - CHASSIS"}]}}',null);
        SingleRequestMock permissionsdata = new SingleRequestMock(200,'SUCCESS','{"data":{"authorization":{"all_access":{"access":"all"},"bus_ecard_status":{"access":"all"},"bus_information":{"access":"all"},"bus_informations_details":{"access":"all"},"bus_moreinfo":{"access":"all"},"busarea_discrepancy_new":{"access":"all"},"busarea_discrepancy_open":{"access":"all"},"busarea_discrepancy_resolve":{"access":"all"},"busarea_discrepancy_update":{"access":"all"},"dept_discrepancy_new":{"access":"all"},"dept_discrepancy_open":{"access":"all"},"dept_discrepancy_resolved":{"access":"all"},"dept_discrepancy_update":{"access":"all"},"discrepancy":{"access":"all"},"discrepancy_db":{"access":"all"},"discrepancy_new":{"access":"all"},"discrepancy_open":{"access":"read"},"discrepancy_outofstation":{"access":"all"},"discrepancy_resolved":{"access":"all"},"discrepancy_update":{"access":"all"},"ecard":{"access":"all"},"ecard_attachments":{"access":"all"},"heatmap":{"access":"all"},"help":{"access":"all"},"meeting_notes":{"access":"all"},"no_access":{"access":"none"},"operation":{"access":"all"},"operation_open":{"access":"all"},"operation_resolved":{"access":"all"},"operation_update":{"access":"read"},"partno_validation":{"access":"all"},"picvalidation_actual_add":{"access":"all"},"picvalidation_applytofleet":{"access":"all"},"qc_checklist":{"access":"all"},"schedule":{"access":"all"},"serail_no_log":{"access":"all"},"settings":{"access":"all"},"shortage":{"access":"all"},"shortage_new":{"access":"all"},"shortage_open":{"access":"all"},"shortage_resolved":{"access":"all"},"shortage_update":{"access":"all"}}}}',null);
        SingleRequestMock buildstationdata = new SingleRequestMock(200,'SUCCESS','{"data":{"buildstations":[{"actual_department_code":null,"assigned_department_id":null,"assinged_emp":null,"buildstation_code":"4065","buildstation_id":167,"employee_id":null,"employee_number":null,"first_name":null,"last_name":null,"operation":"INSTL FRT THRESHOLD HEATER"},{"actual_department_code":null,"assigned_department_id":null,"assinged_emp":null,"buildstation_code":"4007","buildstation_id":112,"employee_id":null,"employee_number":null,"first_name":null,"last_name":null,"operation":"CHASSIS STUD WELD"}]}}',null);
        SingleRequestMock unassigneddeptusers = new SingleRequestMock(200,'SUCCESS','{"data":{"employee":[]}}',null);
        SingleRequestMock getDeparmentCrewingData = new SingleRequestMock(200,'SUCCESS','{"data":{"employee":[]}}',null);
        SingleRequestMock getcrewingsuserslist = new SingleRequestMock(200,'SUCCESS','{"data":{"user":[{"appuser_name":"90000","employee_id":883,"employee_number":"90000","first_name":"JithinFroman","last_name":"Forman"}]}}',null);
        SingleRequestMock getcrewingadjustmentdata = new SingleRequestMock(200,'SUCCESS','{"data":[{"assigned_department_id":1,"created_date":"2021-11-18T11:09:31+00:00","createdby_id":{"appuser_name":"andrel","employee_id":193,"employee_number":"62563","first_name":"Andre","last_name":"Leonardo"},"crewing_adj_comments":"test data","crewing_adj_end_date":"2021-11-30T12:30:00+00:00","crewing_adj_start_date":"2021-11-21T12:30:00+00:00","crewingadjustment_id":81,"deactivate_date":"2021-11-13T12:30:00+00:00","employee_id":896,"employee_name":"63054","employee_number":"63054","first_name":"Khoi","last_name":"Trinh","modified_date":null,"modifiedby_id":null,"original_department_id":13},{"assigned_department_id":1,"created_date":"2021-11-18T11:09:03+00:00","createdby_id":{"appuser_name":"andrel","employee_id":193,"employee_number":"62563","first_name":"Andre","last_name":"Leonardo"},"crewing_adj_comments":"test data","crewing_adj_end_date":"2021-11-30T12:30:00+00:00","crewing_adj_start_date":"2021-11-21T12:30:00+00:00","crewingadjustment_id":80,"deactivate_date":"2021-11-13T12:30:00+00:00","employee_id":896,"employee_name":"63054","employee_number":"63054","first_name":"Khoi","last_name":"Trinh","modified_date":null,"modifiedby_id":null,"original_department_id":13}]}',null);
        SingleRequestMock createNewAdjustmentassignment = new SingleRequestMock(200,'SUCCESS','{"data":"success"}',null);
        SingleRequestMock updateAdjustmentassignment = new SingleRequestMock(200,'SUCCESS','{"data":{"assigned_department_id":1,"created_date":"2021-11-22T09:10:07+00:00","createdby_id":18,"crewing_adj_comments":"test data","crewing_adj_end_date":"2021-11-23T12:30:00+00:00","crewing_adj_start_date":"2021-11-22T12:30:00+00:00","crewingadjustment_id":100,"deactivate_date":null,"employee_id":811,"employee_name":"60748","guid":"848de005-0181-4369-9f3a-6323430a0b49","modified_date":"2021-11-22T09:20:58.373694+00:00","modifiedby_id":18,"original_department_id":12}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/userauthorization/15',permissionsdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedpoolcrewingschedules/22A',crewingassigneddeptdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/unassignedpoolcrewingschedules/22A',crewingunassigneddeptdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedcrewingschedules/1',buildstationdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/unassignedcrewingschedules/1',unassigneddeptusers);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/crewingsuser/1',getcrewingsuserslist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedpoolcrewingschedules/1',getDeparmentCrewingData);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/all_crewing_adjustment',getcrewingadjustmentdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/crewingadjustment',createNewAdjustmentassignment);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/update_crewing_adjustment',updateAdjustmentassignment);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        CrewingScheduleController.getDeparmentCrewingData('1');
        CrewingScheduleController.getUnassignedUsersofPool('22');
        CrewingScheduleController.getBuildStationCrewingData('1');
        CrewingScheduleController.getUnassignedUsersofDepartment('1');
        CrewingScheduleController.assignPoolUserstoBuildStation('{"department_id":"1","buildstation_id":166,"mapped_employees":"[492]"}');
        CrewingScheduleController.assignPoolUserstoDept('{"department_id":1,"department_code":"22A","mapped_employees":"[812,492,811]"}');
        CrewingScheduleController.getcrewingsuserslist('1');
        CrewingScheduleController.createcrewadjustment('{"employee_id":[811],"employee_name":["60748"],"crewing_adj_start_date":"2021-11-22 12:30:00","crewing_adj_end_date":"2021-11-23 12:30:00","crewing_adj_comments":"test data","deactivate_date":null,"assigned_department_id":1,"original_department_id":12}');
        CrewingScheduleController.updatecrewadjustment('{"crewingadjustment_id":100,"employee_id":811,"employee_name":"60748","crewing_adj_start_date":"2021-11-22 12:30:00","crewing_adj_end_date":"2021-11-23 12:30:00","crewing_adj_comments":"test data","deactivate_date":null,"assigned_department_id":1,"original_department_id":12}');
    }
    // Negative Test Method for CrewingScheduleController
    public static testmethod void CrewingScheduleNegativeTest(){
        SingleRequestMock logindata = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
        SingleRequestMock crewingassigneddeptdata = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
        SingleRequestMock crewingunassigneddeptdata = new SingleRequestMock(500,'ERROR','Something went wrong. Please try again later',null);
        SingleRequestMock permissionsdata = new SingleRequestMock(403,'ERROR','API key is missing.',null);
        SingleRequestMock buildstationdata = new SingleRequestMock(401,'ERROR','Incorrect username or password.',null);
        SingleRequestMock unassigneddeptusers = new SingleRequestMock(415,'ERROR','Content-Type header specified in HTTP request is not supported:',null);
        SingleRequestMock getcrewingsuserslist = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
        SingleRequestMock getDeparmentCrewingData = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/userauthorization/15',permissionsdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedpoolcrewingschedules/22A',crewingassigneddeptdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/unassignedpoolcrewingschedules/22A',crewingunassigneddeptdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedcrewingschedules/1',buildstationdata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/unassignedcrewingschedules/1',unassigneddeptusers);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/crewingsuser/1',getcrewingsuserslist);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/assignedpoolcrewingschedules/1',getDeparmentCrewingData);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        CrewingScheduleController.getDeparmentCrewingData('1');
        CrewingScheduleController.getUnassignedUsersofPool('22');
        CrewingScheduleController.getBuildStationCrewingData('1');
        CrewingScheduleController.getUnassignedUsersofDepartment('1');
        CrewingScheduleController.assignPoolUserstoBuildStation('ERROR TEST');
        CrewingScheduleController.assignPoolUserstoDept('ERROR TEST');
        CrewingScheduleController.getcrewingsuserslist('1');
    }

        // Positive Test Method for AtpChecklistController
        public static testmethod void AtpChecklistPositiveTest(){
            SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
            SingleRequestMock attachmentdata = new SingleRequestMock(200,'SUCCESS','{"data":{"attachment_check_list":[{"attachment_check_list_id":1,"attachment_check_list_name":"Weigh Slip / Green Sheet","created_date":"2020-09-23T00:41:08.931000+00:00","createdby_id":null,"guid":null,"is_custom":false,"modified_date":null,"modifiedby_id":null,"verified_date":null,"verified_qc_id":null,"verified_status":null}],"qc_users":[{"appuser_name":"carlosm","employee_id":238,"employee_number":"61775","first_name":"Carlos","last_name":"Martin"}]}}',null);
            SingleRequestMock finalacceptancedata = new SingleRequestMock(200,'SUCCESS','{"data":{"final_acceptance":[{"created_date":"2020-09-23T09:37:22.483000+00:00","createdby_id":null,"final_acceptance_id":1,"final_acceptance_name":"Plate Installed","guid":"61b11dd8-fd80-11ea-924f-06c7d0acc18f","modified_date":null,"modifiedby_id":null,"verified_date":null,"verified_qc_id":null,"verified_status":null}],"qc_users":[{"appuser_name":"carlosm","employee_id":238,"employee_number":"61775","first_name":"Carlos","last_name":"Martin"}]}}',null);
            SingleRequestMock antilockbraketestdata = new SingleRequestMock(200,'SUCCESS','{"data":{"qc_users":[{"appuser_name":"carlosm","employee_id":238,"employee_number":"61775","first_name":"Carlos","last_name":"Martin"}],"rock_well":[{"anti_lock_brake_test":[{"anti_lock_brake_test_group_id":1,"anti_lock_brake_test_id":1,"anti_lock_brake_test_name":"Modulator Valve Cycle : Left Front (A) Steer Axle","created_date":"2020-09-23T14:15:08.510000+00:00","createdby_id":null,"guid":"2f6ad89c-fda7-11ea-924f-06c7d0acc18f","modified_date":null,"modifiedby_id":null,"verified_date":null,"verified_qc_id":null,"verified_status":null}],"anti_lock_brake_test_group_id":1,"anti_lock_brake_test_group_name":"Valve Function Test: Identification"}]}}',null);
            SingleRequestMock acceptancetestdata = new SingleRequestMock(200,'SUCCESS','{"data":{"acceptance_test":[{"acceptance_test":[{"acceptance_test_id":1,"acceptance_test_name":"Verify Primary Screen gauges match Programming Spec and display proper values.","created_date":"2020-09-24T04:53:14.835000+00:00","createdby_id":null,"guid":"dae9fdae-fe21-11ea-a8d8-06c7d0acc18f","modified_date":null,"modifiedby_id":null,"verified_date":null,"verified_qc_id":null,"verified_status":null}],"acceptance_test_group_id":1,"acceptance_test_group_name":"General Functions"}],"qc_users":[{"appuser_name":"carlosm","employee_id":238,"employee_number":"61775","first_name":"Carlos","last_name":"Martin"}]}}',null);
            Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/attachmentchecklist/1',attachmentdata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/finalacceptancelog/1',finalacceptancedata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/antilockbraketest/1',antilockbraketestdata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/acceptancetest/1',acceptancetestdata);
            HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
            Test.setMock(HttpCalloutMock.class, multiCalloutMock);
            AtpChecklistsController.getAttachmentChecklist('1');
            AtpChecklistsController.getFinalAcceptance('1');
            AtpChecklistsController.getAntiLockBraketestList('1');
            AtpChecklistsController.getAcceptanceTestList('1');
            AtpChecklistsController.updateAttachmentChecklist('"{\"ecard_id\":\"106\",\"verified_qc_id\":\"180\",\"verified_status\":false,\"custom_attachment_check_list_info\":\"Weigh Slip / Green Sheet\",\"attachment_check_list_id\":1}"');
            AtpChecklistsController.updateFinalAcceptance('"{\"ecard_id\":\"106\",\"verified_qc_id\":\"180\",\"verified_status\":false,\"final_acceptance_id\":1}"');
            AtpChecklistsController.updateAntiLockBraketest('"{\"ecard_id\":\"106\",\"verified_qc_id\":\"275\",\"verified_status\":false,\"anti_lock_brake_test_id\":1}"');
            AtpChecklistsController.updateAcceptanceTest('"{\"ecard_id\":\"106\",\"verified_qc_id\":\"275\",\"verified_status\":false,\"acceptance_test_id\":1}"');
        }
        // Negative Test Method for AtpChecklistController
        public static testmethod void AtpChecklistNegativeTest(){
            SingleRequestMock logindata = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
            SingleRequestMock attachmentdata = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
            SingleRequestMock finalacceptancedata = new SingleRequestMock(500,'ERROR','Something went wrong. Please try again later',null);
            SingleRequestMock antilockbraketestdata = new SingleRequestMock(403,'ERROR','API key is missing.',null);
            SingleRequestMock acceptancetestdata = new SingleRequestMock(401,'ERROR','Incorrect username or password.',null);
            Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/attachmentchecklist/1',attachmentdata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/finalacceptancelog/1',finalacceptancedata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/antilockbraketest/1',antilockbraketestdata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/acceptancetest/1',acceptancetestdata);
            HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
            Test.setMock(HttpCalloutMock.class, multiCalloutMock);
            AtpChecklistsController.getAttachmentChecklist('1');
            AtpChecklistsController.getFinalAcceptance('1');
            AtpChecklistsController.getAntiLockBraketestList('1');
            AtpChecklistsController.getAcceptanceTestList('1');
            AtpChecklistsController.updateAttachmentChecklist('ERROR TEST');
            AtpChecklistsController.updateFinalAcceptance('ERROR TEST');
            AtpChecklistsController.updateAntiLockBraketest('ERROR TEST');
            AtpChecklistsController.updateAcceptanceTest('ERROR TEST');
        }
            // Positive Test Method for partnumberValidationsController
        public static testmethod void partValidationPositiveTest(){
            SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZjY5ZmVmNzUtZmExMi00NTJjLWI5YzYtNGRkNjBiMTU1MzJmIiwiZXhwIjoxNTk3NjUxNDAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.6-CudXdIUlCE7x08x76Cw6Udlzk-KmYHMQmqinIRoxs","expiry_token":1597651402,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTc2NDk2MDIsIm5iZiI6MTU5NzY0OTYwMiwianRpIjoiZDNlYmQwZjYtYzYzNC00NWI1LTk1OTQtOGI3YTQ5M2Y4OGJjIiwiZXhwIjoxNjAwMjQxNjAyLCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjoxNSwiYXBwcm9sZV9pZCI6M30sInR5cGUiOiJyZWZyZXNoIn0.f4c3msgn6zb6Yz3quuYadF0CIL7yK43TWksJryPpQqk"},"user":{"approle_id":3,"appuser_id":15}}}',null);
            SingleRequestMock partsearch = new SingleRequestMock(200,'SUCCESS','{"data":{"part_no_validation":[]}}',null);
            Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/partnumbervalidation/1',partsearch);
            HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
            Test.setMock(HttpCalloutMock.class, multiCalloutMock);
            partnumberValidationsController.getpartnumbersearchlogs('1');
            partnumberValidationsController.searchpartnumber('{"ecard_id":"163","search_text":"abcd"}');
        }
    // Negative Test Method for partnumberValidationsController
        public static testmethod void partValidationNegativeTest(){
            SingleRequestMock logindata = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
            SingleRequestMock partsearch = new SingleRequestMock(400,'ERROR','Missing Content-Type HTTP header',null);
            Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
            endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/partnumbervalidation/1',partsearch);
            HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
            Test.setMock(HttpCalloutMock.class, multiCalloutMock);
            partnumberValidationsController.getpartnumbersearchlogs('1');
        }
    // Test Method for DiscrepancyDatabaseController
    public static testmethod void DiscrepancyDatabaseControllerTest() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiZWQ3ZWEyOTYtNDEyMS00MTAyLTg5ZTYtYWFkZGQ4ZGYxNTg5IiwiZXhwIjoxNjAxMjg5NjI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hXgIOxq2hFvFx_rrsBpql0VoWr1iqVMu1-cktHasGqY","expiry_token":1601289624,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiYjk4YjM1ZTItOTAxOC00MjUxLWIzMWQtNTYyZmFiYjQzMTBkIiwiZXhwIjoxNjAzODc5ODI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwidHlwZSI6InJlZnJlc2gifQ.pVmOXf3GQtSUA5VEj0kRQcFS8B5V7_PTkvUxrIiqccU"},"user":{"approle_id":1,"appuser_id":877,"department_code":null,"department_id":null,"is_active":true}}}',null);
        SingleRequestMock getAllEcarddetails = new SingleRequestMock(200,'SUCCESS','{"data":{"authorization":{"all_access":{"access":"all"},"bus_ecard_status":{"access":"all"},"bus_information":{"access":"all"},"bus_informations_details":{"access":"all"},"bus_moreinfo":{"access":"all"},"busarea_discrepancy_new":{"access":"all"},"busarea_discrepancy_open":{"access":"all"},"busarea_discrepancy_resolve":{"access":"all"},"busarea_discrepancy_update":{"access":"all"},"dept_discrepancy_new":{"access":"all"},"dept_discrepancy_open":{"access":"all"},"dept_discrepancy_resolved":{"access":"all"},"dept_discrepancy_update":{"access":"all"},"discrepancy":{"access":"all"},"discrepancy_db":{"access":"all"},"discrepancy_new":{"access":"all"},"discrepancy_open":{"access":"read"},"discrepancy_outofstation":{"access":"all"},"discrepancy_resolved":{"access":"all"},"discrepancy_update":{"access":"all"},"ecard":{"access":"all"},"ecard_attachments":{"access":"all"},"heatmap":{"access":"all"},"help":{"access":"all"},"meeting_notes":{"access":"all"},"no_access":{"access":"none"},"operation":{"access":"all"},"operation_open":{"access":"all"},"operation_resolved":{"access":"all"},"operation_update":{"access":"read"},"partno_validation":{"access":"all"},"picvalidation_actual_add":{"access":"all"},"picvalidation_applytofleet":{"access":"all"},"qc_checklist":{"access":"all"},"schedule":{"access":"all"},"serail_no_log":{"access":"all"},"settings":{"access":"all"},"shortage":{"access":"all"},"shortage_new":{"access":"all"},"shortage_open":{"access":"all"},"shortage_resolved":{"access":"all"},"shortage_update":{"access":"all"}}}}',null);
        SingleRequestMock getAllDiscrepanciesdetails = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
		SingleRequestMock getAllComments = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
		SingleRequestMock addnewComment = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
		SingleRequestMock getPicklistOptions = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
		SingleRequestMock raisenewDiscrepancy = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
		SingleRequestMock getdiscrepancyimage = new SingleRequestMock(200,'SUCCESS','{"data":{"departments":[{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":9,"department_name":"09 - BODY ELECTRICAL","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"09"},{"bus_area_discrepancy_enabled":false,"created_date":"2020-09-25T06:01:57.619806+00:00","createdby_id":null,"defect_type":"department","department_id":10,"department_name":"10 - DECALS/LIFT-U ","factory_id":1,"guid":null,"is_assembly_line":true,"modified_date":null,"modifiedby_id":null,"reference_key":"10"}]}}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardschedule',getAllEcarddetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancydb',getAllDiscrepanciesdetails);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancycomments',getAllComments);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/discrepancycomments',addnewComment);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/departments',getPicklistOptions);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddepartmentdiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardbuildstationdiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/busareapicturebyid',getdiscrepancyimage);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        DiscrepancyDatabaseController.getAllEcarddetails();
		DiscrepancyDatabaseController.getAllDiscrepanciesdetails('Test');
		DiscrepancyDatabaseController.getAllComments('123');
		DiscrepancyDatabaseController.addnewComment('Test Req Body');
		DiscrepancyDatabaseController.getPicklistOptions('departments');
		DiscrepancyDatabaseController.raisenewDiscrepancy('Test','Dept');
		DiscrepancyDatabaseController.updateDiscrepancy('Test');
		DiscrepancyDatabaseController.getdiscrepancyimage('Test');
    } 
    // Test Method for User Permissions
    public static testmethod void DiscrepancyDatabaseControllerTestNegative() {
        SingleRequestMock logindata = new SingleRequestMock(200,'SUCCESS','{"data":{"token":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiZWQ3ZWEyOTYtNDEyMS00MTAyLTg5ZTYtYWFkZGQ4ZGYxNTg5IiwiZXhwIjoxNjAxMjg5NjI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hXgIOxq2hFvFx_rrsBpql0VoWr1iqVMu1-cktHasGqY","expiry_token":1601289624,"refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDEyODc4MjQsIm5iZiI6MTYwMTI4NzgyNCwianRpIjoiYjk4YjM1ZTItOTAxOC00MjUxLWIzMWQtNTYyZmFiYjQzMTBkIiwiZXhwIjoxNjAzODc5ODI0LCJpZGVudGl0eSI6eyJhcHB1c2VyX2lkIjo4NzcsImFwcHJvbGVfaWQiOjEsImRlcGFydG1lbnRfY29kZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJkZXBhcnRtZW50X2lkIjpudWxsfSwidHlwZSI6InJlZnJlc2gifQ.pVmOXf3GQtSUA5VEj0kRQcFS8B5V7_PTkvUxrIiqccU"},"user":{"approle_id":1,"appuser_id":877,"department_code":null,"department_id":null,"is_active":true}}}',null);
        SingleRequestMock getAllEcarddetails = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
        SingleRequestMock getAllDiscrepanciesdetails = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
		SingleRequestMock getAllComments = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
		SingleRequestMock addnewComment = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
		SingleRequestMock getPicklistOptions = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
		SingleRequestMock raisenewDiscrepancy = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
		SingleRequestMock getdiscrepancyimage = new SingleRequestMock(404,'ERROR','<title>404 Not Found</title>}',null);
        Map<String, HttpCalloutMock> endpoint2TestResp = new Map<String,HttpCalloutMock>();
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/sflogin',logindata);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardschedule',getAllEcarddetails);
        endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancydb',getAllDiscrepanciesdetails);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancycomments',getAllComments);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/discrepancycomments',addnewComment);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/departments',getPicklistOptions);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddepartmentdiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecardbuildstationdiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/ecarddiscrepancy',raisenewDiscrepancy);
		endpoint2TestResp.put(System.Label.EcardAppendpoint+'api/busareapicturebyid',getdiscrepancyimage);
        HttpCalloutMock multiCalloutMock = new MultiRequestMock(endpoint2TestResp);
        Test.setMock(HttpCalloutMock.class, multiCalloutMock);
        DiscrepancyDatabaseController.getAllEcarddetails();
		DiscrepancyDatabaseController.getAllDiscrepanciesdetails('Test');
		DiscrepancyDatabaseController.getAllComments('123');
		DiscrepancyDatabaseController.addnewComment('Test Req Body');
		DiscrepancyDatabaseController.getPicklistOptions('departments');
		DiscrepancyDatabaseController.raisenewDiscrepancy('Test','Dept');
		DiscrepancyDatabaseController.updateDiscrepancy('Test');
		DiscrepancyDatabaseController.getdiscrepancyimage('Test');
    } 
    
    public static testmethod void DepartmentDataTest() {
		DepartmentData ddata=new DepartmentData();
		DepartmentData.parse('{"data":[{"created_date":"2020-09-25T06:01:50.424657+00:00","createdby_id":null,"factory_id":1,"factory_name":"Gillig","guid":null,"modified_date":null,"modifiedby_id":null}]}');
    } 
    public static testmethod void DataWrapperEcardTest() {
        DataWrapperEcard.defects defwrap=new DataWrapperEcard.defects();
        defwrap.created_date='10/10/2020';
	   	defwrap.createdby_id='1234';
	   	defwrap.dat_defect_code_id=123;
       	defwrap.defect_code='123';
       	defwrap.defect_name='Test Defect';
       	defwrap.defect_type='Dept';
       	defwrap.guid='test';
       	defwrap.modified_date='12/12/2020';
       	defwrap.modifiedby_id='1234';
        DataWrapperEcard.departments deptwrap=new DataWrapperEcard.departments();
        deptwrap.created_date='10/10/2020';
        deptwrap.defect_type='Dept';
        deptwrap.reference_key='1234';
        deptwrap.is_assembly_line=true;
        deptwrap.guid='1234';
        deptwrap.factory_id=123;
        deptwrap.department_name='4A';
        deptwrap.modified_date='10/10/2020';
        deptwrap.department_id=1;
        deptwrap.modifiedby_id='123';
        deptwrap.createdby_id ='123';      
    } 
}