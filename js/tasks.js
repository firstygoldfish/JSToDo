// Get data from loca storage
var projdata = new Object();
var data = new Object();
if(localStorage.getItem('ToDoTraxProjects')) {
    projdata = JSON.parse(localStorage.getItem("ToDoTraxProjects"));
    console.log('Projects Loaded');
}
if(localStorage.getItem('ToDoTraxTasks')) {
    data = JSON.parse(localStorage.getItem("ToDoTraxTasks"));
    console.log('Tasks Loaded');
    for (var taskid in data) {
      var duemss = "";
      if (data[taskid].taskdue == undefined) {
        duemsg = "N/A";
      } else {
        duemsg = data[taskid].taskdue;
      }
        var htmlcode = '<div id="TASK_'+taskid+'" class="panel panel-default"> \
                <div class="panel-heading"> \
                <h4 class="panel-title"><button type="button" class="primary" aria-hidden="true" onclick="confirmRemove('+taskid+')">\
                <i class="fa fa-times" aria-hidden="true"></i>\
                </button>&nbsp;<button type="button" class="primary" aria-hidden="true" onclick="editTask('+taskid+')">\
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\
                </button>&nbsp;<span class="badge">'+getProjCode(data[taskid].taskproj)+'</span>&nbsp;\
                <a class="collapsed" data-toggle="collapse" data-parent="#tasklist" href="#TASKDET_'+taskid+'">'+data[taskid].taskname+'</a></h4> \
                </div>                 \
                <div id="TASKDET_'+taskid+'" class="panel-collapse collapse"> \
                <div class="panel-body"><span class="badge">Due: '+duemsg+'</span>&nbsp;'+data[taskid].taskdesc+'</div> \
                </div> \
                </div> '
        $('#tasklist').append(htmlcode);
    }
}

function getProjCode(projid) {
  if (projid == 0) { return 'ToDo'; }
  return projdata[projid].projcode;
}
// Get page function
var pagefunc = getParameterByName('func');
if (pagefunc != 'list') {
  $('#pagetitle').html(initCap(pagefunc) + ' Task');
  for (var projid in projdata) {
    $('#newprojectoption').append($('<option></option>').attr('value',projid).text(projdata[projid].projname));
  }
}

if (pagefunc == 'edit') {
  // Populate edit values
  var taskid = getParameterByName('id');
  $('#newtaskproj').val(data[taskid].taskproj);
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

$('#OLDsaveproject').click( function() {
  alert('HERE');
  alert('EDIT='+$('.fs-editable').html());
});

$('#saveproject').click( function() {
    var taskproj = $('#newprojectoption').find(":selected").val();
    var taskname = $('#newtaskname').val();
    var taskdesc = $('#newtaskdescription').val();
    var taskdue = $('#newtaskduedate').val();
    var taskcreated = $('#newtaskcreatedate').val();
    if (pagefunc == 'new') {
      var tasknotes = "";
    } else {
      var tasknotes = $('.fs-editable').html();
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

// Setup data picker
$('#sandbox-container .input-group.date').datepicker({
    language: "en-GB",
    daysOfWeekHighlighted: "1,2,3,4,5",
    autoclose: true,
    todayHighlight: true
});

// F U N C T I O N S============================================================

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
   return msg.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
};

// Format date
function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${month}/${day}/${year}`;
}
