const modifieduserlist = (userlist) => {
    var newuserlist = [];
        if(userlist!=undefined && userlist.length != 0){
            for(var count in userlist){
                var user = userlist[count];
                if(user != undefined){
                    var name = `${user.first_name} ${user.last_name}`;
                    var dispname=`${user.first_name} ${user.last_name} (${user.employee_number})`;
                    var emp_id=`${user.employee_number}`;
                    var initials = name.match(/\b\w/g) || [];
                    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase(); 
                     var newuser = {
                        name : `${user.first_name} (${user.employee_number})`,
                        Name : `${user.first_name} (${user.employee_number})`,
                        fullname : name,
                        displayname:dispname,
                        empid:emp_id,
                        Id : user.employee_id,
                        userid : user.employee_id,
                        piclink:'',
                        username:user.appuser_name,
                        intials:initials
                    };
                    newuserlist.push(newuser); 
            }
            }
        }
        return newuserlist;
    
};

const preassignforeman = (obj) => {
    var users = [];
        for(var i in obj){
            if(i<5){
                users.push(obj[i]); 
            }
        }
        return users;
};

const setstatusfordisplay = (text) => {
    if (typeof text !== 'string') {
        return '';
    }
    else{
        if(text == 'approve'){
            text = 'Verified';
        }
        else if(text == 'resolve'){
            text = 'Resolved';
        }
        else if(text == 'reject'){
            text = 'Rejected';
        }
        else{

        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    
};

const preassignqc = (obj) => {
    var users = [];
        if(obj[0] != undefined){
                users.push(obj[0]);
        }
        return users;
};

const getselectedformandetails = (obj) => {
    var users = [];
        for(var i=0; i<5;i++){
            if(obj[`forman${i+1}_id`] != undefined){
                users.push(obj[`forman${i+1}_id`]);
            }
         }
        return modifieduserlist(users);
};

const getmoddeddate = (date) => {
    var formatteddate = undefined;
        if(date != undefined){
            var jsdate = new Date(date);
            var hours = jsdate.getHours();
            var minutes = jsdate.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return jsdate.getMonth()+1 + "/" + jsdate.getDate() + "/" + jsdate.getFullYear() + ", " + strTime;
        }
        return formatteddate;
    
};

const permissions = (permissionsconfig) => {
    
    function setnewpermissions(accesspermission){
        var newaccess = {"read":false, "write": false};
        if(accesspermission.access == 'all'){
            newaccess['read'] = true;
            newaccess['write'] = true;
        }
        else if(accesspermission.access == 'read'){
            newaccess['read'] = true;
            newaccess['write'] = false;
        }
        else{
            newaccess['read'] = false;
            newaccess['write'] = false;
        }
        return newaccess;
    }
    let modifiedpermission = {};
    var permissionfromserver = permissionsconfig.data.authorization;
    var allpermissionitems = Object.keys(permissionfromserver);
    for(var i in allpermissionitems){
        modifiedpermission[allpermissionitems[i]] = setnewpermissions(permissionfromserver[allpermissionitems[i]]);
    }
    return modifiedpermission;
};

export { permissions, modifieduserlist, getmoddeddate, getselectedformandetails, preassignforeman, preassignqc, setstatusfordisplay };