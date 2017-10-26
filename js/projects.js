// Get data from loca storage
var data = new Object();
tempData = {
  projid : 0,
  projname: 'ToDo',
  projcode: 'ToDo',
  projdesc: 'General ToDo Tasks. Not directly linked to a project.'
};
if(localStorage.getItem('ToDoTraxProjects')) {
    data = JSON.parse(localStorage.getItem("ToDoTraxProjects"));
    data[0] = tempData;
    generateProjectElements();
} else {
  data[0] = tempData;
  generateProjectElements();
}

// Get page function
var pagefunc = getParameterByName('func');
if (pagefunc != 'list' && pagefunc != undefined) { $('#pagetitle').html(initCap(pagefunc) + ' Project'); }
if (pagefunc == 'new') { $('#newprojectname').focus(); }

if (pagefunc == 'edit') {
  // Populate edit values
  var projid = getParameterByName('id');
  $('#newprojectname').val(data[projid].projname);
  $('#newprojectcode').val(data[projid].projcode);
  $('#newprojectdescription').val(data[projid].projdesc);
} else if (pagefunc == 'new') {
  // Generate new ID
  projid = new Date().getTime();
  $('#newprojectid').val(projid);
}

$('#saveproject').click( function() {
    var procErrors = 0;
    var projname = $('#newprojectname').val();
    var projcode = $('#newprojectcode').val();
    var projdesc = $('#newprojectdescription').val();

    // Form Validation
    if (projname.length == 0) {
      alert('Project Name Missing');
      $('#newprojectname').focus();
      return;
    }
    if (projcode.length == 0) {
      alert('Project Short Code Missing');
      $('#newprojectcode').focus();
      return;
    }
    if (pagefunc == 'new') {
      if (checkProjectExist(projname) != 0) {
        alert('Project Already Exists');
        $('#newprojectname').focus();
        return;
      }
    }

    if (procErrors == 0) {
      tempData = {
        projid : projid,
        projname: projname,
        projcode: projcode,
        projdesc: projdesc
      };

      //alert ('Name:'+projname+' code:'+projcode+' description:'+projdesc);

      // Saving element in local storage
      data[projid] = tempData;
      saveData(data);
      window.location.replace('projects.html?func=list');
    }
});

// F U N C T I O N S============================================================

// GENERATE PROJECT ELEMENTS
function generateProjectElements() {
  for (var projid in data) {
      var htmlcode = '<li id="PROJ_'+projid+'" class="list-group-item"><strong>'+data[projid].projname+'</strong>&nbsp;<span class="badge">'+data[projid].projcode+'</span></br>&nbsp;<span class="pull-left">';
      if (projid != 0) { // Don't allow changing the TODO project (as its default)
        htmlcode += '<button type="button" class="btn btn-danger btn-xs" aria-hidden="true" data-toggle="tooltip" title="Delete" onclick="confirmRemove('+projid+')">\
        <i class="fa fa-times" aria-hidden="true"></i>\
        </button>\
        <button type="button" class="btn btn-default btn-xs" aria-hidden="true" data-toggle="tooltip" title="Edit" onclick="editProject('+projid+')">\
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\
        </button>&nbsp;';
      }/* else {
        htmlcode += '<button type="button" class="btn btn-danger btn-xs" aria-hidden="true">\
        <i class="fa fa-window-close" aria-hidden="true"></i></button>\
        <button type="button" class="btn btn-default btn-xs" aria-hidden="true">\
        <i class="fa fa-window-close" aria-hidden="true"></i>\
        </button>&nbsp;';
      }*/
      htmlcode += '<button type="button" class="btn btn-primary btn-xs" aria-hidden="true" data-toggle="tooltip" title="Filter Tasks" onclick="window.location.replace(\'tasks.html?func=list&filter='+projid+'\')">\
      <i class="fa fa-filter" aria-hidden="true"></i>\
      </button>&nbsp;</span>\
      </li>'
      $('#projectlist').append(htmlcode);
    }
}

// CHECK FOR DUPLICATE PROJECT
function checkProjectExist(projname) {
  var projFound = 0;
  for (var projid in data) {
    if (data[projid].projname.toLowerCase() == projname.toLowerCase()) {
      projFound++;
    }
  }
  return projFound;
}

// SAVE DATA TO LOCAL STORAGE
function saveData(newdata) {
  localStorage.setItem("ToDoTraxProjects", JSON.stringify(newdata));
}

// CONFIRM DELETE
function confirmRemove(projid) {
$('#confirm').modal({
      backdrop: 'static',
      keyboard: false
    })
    .one('click', '#delete', function(e) {
      removeProject(projid);
    });
}

// REMOVE PROJECT
function removeProject(projid) {
    //Build new object that excludes the current project
    var deldata = new Object();
    for (var currprojid in data) {
        if(currprojid != projid) {
            deldata[currprojid] = data[currprojid];
        }
    }
    saveData(deldata);
    $('#PROJ_'+projid).remove();
}

// EDIT PROJECT
function editProject(projid) {
    window.location.replace('newproject.html?func=edit&id='+projid);
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
