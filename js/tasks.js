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
        var htmlcode = '<div class="panel panel-default"> \
                <div class="panel-heading"> \
                <h4 class="panel-title"><button type="button" class="primary" aria-hidden="true">\
                <i class="fa fa-times" aria-hidden="true"></i>\
                </button>&nbsp;<button type="button" class="primary" aria-hidden="true">\
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\
                </button>&nbsp;<span class="badge">'+getProjCode(data[taskid].taskproj)+'</span>&nbsp;\
                <a class="collapsed" data-toggle="collapse" data-parent="#tasklist" href="#TASK_'+taskid+'">'+data[taskid].taskname+'</a></h4> \
                </div>                 \
                <div id="TASK_'+taskid+'" class="panel-collapse collapse"> \
                <div class="panel-body">'+data[taskid].taskdesc+'</div> \
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
} else if (pagefunc == 'new') {
  // Generate new ID
  taskid = new Date().getTime();
  $('#newtaskid').val(taskid);
}

$('#saveproject').click( function() {
    var taskproj = $('#newprojectoption').find(":selected").val();
    var taskname = $('#newtaskname').val();
    var taskdesc = $('#newtaskdescription').val();

  tempData = {
    taskid: taskid,
    taskproj: taskproj,
    taskname: taskname,
    taskdesc: taskdesc
  };

  //alert ('Name:'+projname+' code:'+projcode+' description:'+projdesc);

  // Saving element in local storage
  data[taskid] = tempData;
  saveData(data);
  window.location('tasks.html?func=list');
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
function editProject(taskid) {
    window.location('newtask.html?func=edit&id='+taskid);
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
