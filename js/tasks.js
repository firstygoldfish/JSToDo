// Get page function
var pagefunc = getParameterByName('func');
var pagefilter = getParameterByName('filter');

// Get Project data from loca storage
var projdata = new Object();
tempData = {
  projid : 0,
  projname: 'ToDo',
  projcode: 'ToDo',
  projdesc: 'General ToDo Tasks. Not directly linked to a project.'
};

if(localStorage.getItem('ToDoTraxProjects')) {
    projdata = JSON.parse(localStorage.getItem("ToDoTraxProjects"));
    projdata[0] = tempData;
} else {
  projdata[0] = tempData;
}

// update page elements
if (pagefunc != 'list') {
  $('#pagetitle').html('Task : ' + initCap(pagefunc));
  for (var projid in projdata) {
    $('#newtaskproject').append($('<option></option>').attr('value',projid).text(projdata[projid].projname));
  }
}
if (pagefunc == 'new') { $('#newtaskname').focus(); }

var data = new Object();
// Get Task data from local storage
if(localStorage.getItem('ToDoTraxTasks')) {
    data = JSON.parse(localStorage.getItem("ToDoTraxTasks"));
    var sortdata = new Array();
    for (var taskid in data) {
      if (pagefunc == 'list') {
        // Full List ordered by due date
        if (pagefilter == undefined) {
          $('#pagetitle').html('Tasks View  (Sort : Due Date)');
          sortdata[taskid] = changeDate(data[taskid].taskdue);
        } else {
          // Filter by project
          $('#pagetitle').html('Tasks View  (Project : ' + projdata[pagefilter].projname + ' / Sort : Due Date)');
          if (data[taskid].taskproj == pagefilter) {
            sortdata[taskid] = changeDate(data[taskid].taskdue);
          }
        }
      }
    }
    // Sort by due date then generate the elements in order
    keysSorted = Object.keys(sortdata).sort(function(a,b){return sortdata[a]-sortdata[b]});
    for (var i=0; i < keysSorted.length; i++ ) {
      generateTaskElement(keysSorted[i]);
    }
}

if (pagefunc == 'edit') {
  // Populate edit values
  var taskid = getParameterByName('id');
  $('#newtaskproject').val(data[taskid].taskproj);
  $('#newtaskname').val(data[taskid].taskname);
  $('#newtaskdescription').val(data[taskid].taskdesc);
  $('#newtaskduedate').val(data[taskid].taskdue);
  $('#newtaskcreatedate').val(data[taskid].taskcreated);
  $('#newtasknotes').val(data[taskid].tasknotes);
  $('#tasknotes').show();
} else if (pagefunc == 'new') {
  // Generate new ID
  taskid = new Date().getTime();
  $('#newtaskid').val(taskid);
  $('#newtaskcreatedate').val(formattedDate());
}

$('#savetask').click( function() {
    var taskproj = $('#newtaskproject').find(":selected").val();
    var taskname = $('#newtaskname').val();
    var taskdesc = $('#newtaskdescription').val();
    var taskdue = $('#newtaskduedate').val();
    var taskcreated = $('#newtaskcreatedate').val();
    if (pagefunc == 'new') {
      var tasknotes = "";
    } else {
      var tasknotes = $('.fs-editable').html();
    }

    // Form Validation
    if (taskname.length == 0) {
      alert('Task Name Missing');
      $('#newtaskname').focus();
      return;
    }
    if (checkTaskExist(taskname) != 0) {
      alert('Task Already Exists');
      $('#newtaskname').focus();
      return;
    }

    tempData = {
      taskid: taskid,
      taskproj: taskproj,
      taskname: taskname,
      taskdesc: taskdesc,
      taskdue: taskdue,
      taskcreated: taskcreated,
      tasknotes: tasknotes
    };

    //alert ('Name:'+projname+' code:'+projcode+' description:'+projdesc);

    // Saving element in local storage
    data[taskid] = tempData;
    saveData(data);
    window.location.replace('tasks.html?func=list');
});

// Setup data picker - For add / edit
if (pagefunc != 'list') {
  $('#sandbox-container .input-group.date').datepicker({
      language: "en-GB",
      format: "dd/mm/yyyy",
      daysOfWeekHighlighted: "1,2,3,4,5",
      autoclose: true,
      todayHighlight: true
  });
}

// F U N C T I O N S============================================================

// CHECK FOR DUPLICATE TASK
function checkTaskExist(taskname) {
  var projFound = 0;
  for (var taskid in data) {
    if (data[taskid].taskname.toLowerCase() == taskname.toLowerCase()) {
      projFound++;
    }
  }
  return projFound;
}

function generateTaskElement(taskid) {
  var duemsg = "";
  if (data[taskid].taskdue == undefined || data[taskid].taskdue == "") {
    duemsg = "No Due Date";
  } else {
    duemsg = 'Due: ' + data[taskid].taskdue;
  }
  var htmlcode = '<div id="TASK_'+taskid+'" class="panel panel-default"> \
            <div class="panel-heading"> <h4 class="panel-title">\
            <button type="button" class="btn btn-danger" aria-hidden="true" onclick="confirmRemove('+taskid+')">\
            <i class="fa fa-times" aria-hidden="true"></i>\
            </button>\
            <button type="button" class="btn btn-default" aria-hidden="true" onclick="editTask('+taskid+')">\
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\
            </button>&nbsp;&nbsp;<br/><span class="badge">'+getProjCode(data[taskid].taskproj)+'</span>&nbsp;\
            <a style="display:inline-block; padding-top:10px;" class="collapsed" data-toggle="collapse" data-parent="#tasklist" href="#TASKDET_'+taskid+'">'+data[taskid].taskname+'</a></h4> \
            </div> \
            <div id="TASKDET_'+taskid+'" class="panel-collapse collapse"> \
            <div class="panel-body"><span class="badge">'+duemsg+'</span>&nbsp;'+data[taskid].taskdesc+'</div> \
            </div> \
            </div> '
    $('#tasklist').append(htmlcode);
}

// SAVE DATA TO LOCAL STORAGE
function saveData(newdata) {
  localStorage.setItem("ToDoTraxTasks", JSON.stringify(newdata));
}

// CONFIRM DELETE
function confirmRemove(taskid) {
$('#confirm').modal({
      backdrop: 'static',
      keyboard: false
    })
    .one('click', '#delete', function(e) {
      removeProject(taskid);
    });
}

// REMOVE PROJECT
function removeProject(taskid) {
    //Build new object that excludes the current project
    var deldata = new Object();
    for (var currtaskid in data) {
        if(currtaskid != taskid) {
            deldata[currtaskid] = data[currtaskid];
        }
    }
    saveData(deldata);
    $('#TASK_'+taskid).remove();
}

// EDIT PROJECT
function editTask(taskid) {
    window.location.replace('newtask.html?func=edit&id='+taskid);
}

// GET URL PARAMETERS
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// INITCAP extension to STRING
function initCap (msg) {
  if (msg.length > 0) {
   return msg.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
  }
};

// Format date
function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year}`;
}

// Return project code of ToDo for project 0 as not a project
function getProjCode(projid) {
  if (projid == 0) { return 'ToDo'; }
  if (projdata[projid] == undefined) {
    return 'DELETED PROJECT'; // As we delete projects but leave tasks (just in case)
  } else {
    return projdata[projid].projcode;
  }
}

// Change to mathematical order date to order dates easily
function changeDate(indate) {
  if (indate == undefined) { indate = "31/12/3000"; }
  var outdate = indate.substring(6,9) + indate.substring(3,4) + indate.substring(0,1);
  return outdate;
}
