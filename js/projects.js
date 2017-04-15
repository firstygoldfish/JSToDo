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
        </button>&nbsp;\
        '+data[projid].projname+'<span class="badge">'+data[projid].projcode+'</span>\
        </li>'
        $('#projectlist').append(htmlcode); 
    }
}

// Get page Name
//var pagename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
//alert(pagename);

projid = new Date().getTime();
$('#newprojectid').val(projid);

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
  window.location('projects.html');
});

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
    alert('Edit Project:' + projid);
}

