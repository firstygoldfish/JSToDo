// Get data from loca storage
var data = new Object();
if(localStorage.getItem('ToDoTraxProjects')) {
    data = JSON.parse(localStorage.getItem("ToDoTraxProjects"));
    for (var projid in data) {
        var htmlcode = '<li id="PROJ_'+projid+'" class="list-group-item">\
        <button type="button" class="primary" aria-hidden="true" onclick="confirmRemove('+projid+')">\
        <i class="fa fa-times" aria-hidden="true"></i>\
        </button>\
        <button type="button" class="primary" aria-hidden="true" onclick="editProject('+projid+')">\
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>\
        </button>\
        '+data[projid].projname+'<span class="badge">'+data[projid].projcode+'</span>\
        </li>'
        $('#projectlist').append(htmlcode);
    }
}

// Get page function
var pagefunc = getParameterByName('func');
if (pagefunc != 'list') { $('#pagetitle').html(initCap(pagefunc) + ' Project'); }

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
    var projname = $('#newprojectname').val();
    var projcode = $('#newprojectcode').val();
    var projdesc = $('#newprojectdescription').val();

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
  window.location('projects.html?func=list');
});

// F U N C T I O N S============================================================

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
    window.location('newproject.html?func=edit&id='+projid);
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
