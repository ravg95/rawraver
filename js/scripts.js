var currentDir = 0
var droppedFile = false
var boxInitText = ""
function loadFiles(dir) {
  var request = new XMLHttpRequest()
  currentDir = dir
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'http://127.0.0.1:8000/dir/'+dir, true)

  request.onload = function() {
     var data = JSON.parse(this.response)
     data.dirs.forEach(showDir);
     data.files.forEach(showFile);
     data.parents.forEach(makeNav);

     function showDir(value, index, array){
       const view = document.getElementById('files')
       const line = document.createElement('div')
       const ico = document.createElement('span')
       const link = document.createElement('a');
       link.setAttribute('onclick', 'loadNew('+value.id+')');
       link.appendChild(document.createTextNode(value.name));
       ico.setAttribute('class', 'fas fa-box')
       ico.setAttribute('style', 'margin-right: 11px;margin-left: 4px')
       line.setAttribute('class', 'list-group-item')
       line.appendChild(ico);
       line.appendChild(link);
       view.appendChild(line);

     }

     function showFile(value, index, array){
       const view = document.getElementById('files')
       const line = document.createElement('div')
       const ico = document.createElement('span')
       const link = document.createElement('a');
       link.setAttribute('onclick', 'dispFile('+value.id+')');
       // link.setAttribute('data-toggle', 'modal');
       // link.setAttribute('href', '#info');
       link.appendChild(document.createTextNode(value.name));
       ico.setAttribute('class', 'fas fa-wave-square')
       ico.setAttribute('style', 'margin-right: 10px')
       line.setAttribute('class', 'list-group-item')
       line.appendChild(ico);
       line.appendChild(link);
       view.appendChild(line);
     }

      function makeNav(value, index, array) {
        id = value[0];
        name = value[1];
        if(name == "")
          name = "Home";
        const view = document.getElementById('navigation');
        const line = document.createElement('div')
        const link = document.createElement('a');
        link.setAttribute('onclick', 'loadNew('+id+')');
        link.appendChild(document.createTextNode(name));
        if (id == dir ){
          line.setAttribute('class', 'breadcrumb-item active');
        } else {
          line.setAttribute('class', 'breadcrumb-item');
        }
        line.appendChild(link);
        view.appendChild(line)
     }
  }

  // Send request
  request.send()
  const spot = document.getElementById('addPlace');
  const addButton = document.createElement('button')
  addButton.setAttribute('class', 'btn btn-primary')
  addButton.setAttribute('style', 'margin:20px')
  addButton.setAttribute('onclick', 'addFile('+dir+')')
  addButton.innerHTML="Add file"

  const dirButton = document.createElement('button')
  dirButton.setAttribute('class', 'btn btn-secondary')
  dirButton.setAttribute('onclick', 'addDir()')
  dirButton.setAttribute('id', 'dbtn')
  dirButton.innerHTML="Create directory"

  spot.appendChild(addButton)
  spot.appendChild(dirButton)

  if(currentDir != 1){
    const delButton = document.createElement('button')
    delButton.setAttribute('class', 'btn btn-danger')
    delButton.setAttribute('style', 'margin:20px')
    delButton.setAttribute('onclick', 'delDir()')
    delButton.innerHTML="Delete directory"
    spot.appendChild(delButton)
  }


}

function clear(){
  var node= document.getElementById("files");
  node.querySelectorAll('*').forEach(n => n.remove());
  node= document.getElementById("navigation");
  node.querySelectorAll('*').forEach(n => n.remove());
  document.getElementById('addPlace').innerHTML=""
}

function loadNew(id){
  clear()
  loadFiles(id)
}

function dispFile(id){
  $('.modal').modal('show')
  boxInitText = document.getElementById('boxLabel').innerHTML
  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'http://127.0.0.1:8000/file/'+id, true)

  request.onload = function() {
    var data = JSON.parse(this.response)
    const tit = document.getElementById('infoTitle');
    tit.appendChild(document.createTextNode(data.name));
    const bod = document.getElementById('infoText');

    const r1 = document.createElement('div')
    const r1c1 = document.createElement('div')
    const r1c2 = document.createElement('div')
    r1.setAttribute('class', 'row');
    r1c1.setAttribute('class', 'col');
    r1c2.setAttribute('class', 'col');
    r1c1.innerHTML = "Title:"
    r1c2.innerHTML = data.title
    r1.appendChild(r1c1);
    r1.appendChild(r1c2);
    bod.appendChild(r1);

    const r2 = document.createElement('div')
    const r2c1 = document.createElement('div')
    const r2c2 = document.createElement('div')
    r2.setAttribute('class', 'row');
    r2c1.setAttribute('class', 'col');
    r2c2.setAttribute('class', 'col');
    r2c1.innerHTML = "Artist:"
    r2c2.innerHTML = data.artist
    r2.appendChild(r2c1);
    r2.appendChild(r2c2);
    bod.appendChild(r2);

    const r3 = document.createElement('div')
    const r3c1 = document.createElement('div')
    const r3c2 = document.createElement('div')
    r3.setAttribute('class', 'row');
    r3c1.setAttribute('class', 'col');
    r3c2.setAttribute('class', 'col');
    r3c1.innerHTML = "Album:"
    r3c2.innerHTML = data.album
    r3.appendChild(r3c1);
    r3.appendChild(r3c2);
    bod.appendChild(r3);

    const r4 = document.createElement('div')
    const r4c1 = document.createElement('div')
    const r4c2 = document.createElement('div')
    r4.setAttribute('class', 'row');
    r4c1.setAttribute('class', 'col');
    r4c2.setAttribute('class', 'col');
    r4c1.innerHTML = "Year:"
    r4c2.innerHTML = data.year
    r4.appendChild(r4c1);
    r4.appendChild(r4c2);
    bod.appendChild(r4);

    const r5 = document.createElement('div')
    const r5c1 = document.createElement('div')
    const r5c2 = document.createElement('div')
    r5.setAttribute('class', 'row');
    r5c1.setAttribute('class', 'col');
    r5c2.setAttribute('class', 'col');
    r5c1.innerHTML = "Format:"
    r5c2.innerHTML = data.format
    r5.appendChild(r5c1);
    r5.appendChild(r5c2);
    bod.appendChild(r5);

    const r6 = document.createElement('div')
    const r6c1 = document.createElement('div')
    const r6c2 = document.createElement('div')
    r6.setAttribute('class', 'row');
    r6c1.setAttribute('class', 'col');
    r6c2.setAttribute('class', 'col');
    r6c1.innerHTML = "Size:"
    r6c2.innerHTML = data.size+" MB"
    r6.appendChild(r6c1);
    r6.appendChild(r6c2);
    bod.appendChild(r6);

    modalFooterButtons(data.id, data.directory_id)

    modalAddPlayer(data.path)

  }
  // Send request
  request.send()

}

function deleteFile(id, dir){
  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'http://127.0.0.1:8000/file/'+id+'/delete', true)
  request.send()
  loadNew(dir)
}

function play(x) {
  x.play();
}

function pause(x) {
  x.pause();
}

function addFile(dir){
    $('.modal').modal('show')
    boxInitText = document.getElementById('boxLabel').innerHTML
    document.getElementById('box').style.display = 'block';
    const tit = document.getElementById('infoTitle');
    tit.appendChild(document.createTextNode("Add file"));
    const bod = document.getElementById('infoText');
    bod.innerHTML = ""

    const r1 = document.createElement('div')
    const r1c1 = document.createElement('div')
    const r1c2 = document.createElement('div')
    r1.setAttribute('class', 'row');
    r1.setAttribute('style', 'margin: 2px');
    r1c1.setAttribute('class', 'col');
    r1c2.setAttribute('class', 'col');
    r1c1.innerHTML = "Title:"
    r1c2.innerHTML = "<input type='text' name='title'>"
    r1.appendChild(r1c1);
    r1.appendChild(r1c2);
    bod.appendChild(r1);

    const r2 = document.createElement('div')
    const r2c1 = document.createElement('div')
    const r2c2 = document.createElement('div')
    r2.setAttribute('class', 'row');
    r2.setAttribute('style', 'margin: 2px');
    r2c1.setAttribute('class', 'col');
    r2c2.setAttribute('class', 'col');
    r2c1.innerHTML = "Artist:"
    r2c2.innerHTML = "<input type='text' name='artist'>"
    r2.appendChild(r2c1);
    r2.appendChild(r2c2);
    bod.appendChild(r2);

    const r3 = document.createElement('div')
    const r3c1 = document.createElement('div')
    const r3c2 = document.createElement('div')
    r3.setAttribute('class', 'row');
    r3.setAttribute('style', 'margin: 2px');
    r3c1.setAttribute('class', 'col');
    r3c2.setAttribute('class', 'col');
    r3c1.innerHTML = "Album:"
    r3c2.innerHTML = "<input type='text' name='album'>"
    r3.appendChild(r3c1);
    r3.appendChild(r3c2);
    bod.appendChild(r3);

    const r4 = document.createElement('div')
    const r4c1 = document.createElement('div')
    const r4c2 = document.createElement('div')
    r4.setAttribute('class', 'row');
    r4.setAttribute('style', 'margin: 2px');
    r4c1.setAttribute('class', 'col');
    r4c2.setAttribute('class', 'col');
    r4c1.innerHTML = "Year:"
    r4c2.innerHTML = "<input type='text' name='year'>"
    r4.appendChild(r4c1);
    r4.appendChild(r4c2);
    bod.appendChild(r4);


    const butt = document.createElement('button')
    butt.setAttribute('class', 'btn btn-primary')
    butt.setAttribute('onclick', 'addSubmit()')
    butt.innerHTML="Save"

    const foot = document.getElementById('infoFooter')
    foot.appendChild(butt)


    var $form = $('.box');


    if (isAdvancedUpload) {

      var $input = $form.find('input[type="file"]')
      $label = document.getElementById('boxLabel')
      showFiles = function(file) {
        $label.innerHTML=file.name
      };
      $form.addClass('has-advanced-upload');
      $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        $form.addClass('is-dragover');
      })
      .on('dragleave dragend drop', function() {
        $form.removeClass('is-dragover');
      })
      .on('drop', function(e) {
        droppedFile = e.originalEvent.dataTransfer.files[0]; // the files that were dropped
        showFiles( droppedFile );
      });

      $input.on('change', function(e) {
        droppedFile = e.target.files[0];
        showFiles(droppedFile);
      });

    }

}

function modalFooterButtons(id, dir){
  const foot = document.getElementById('infoFooter')


  const b2 = document.createElement('button')
  b2.setAttribute('class', 'btn btn-secondary')
  b2.innerHTML="Edit"

  const b3 = document.createElement('button')
  b3.setAttribute('class', 'btn btn-danger')
  b3.setAttribute('data-dismiss', 'modal')
  b3.setAttribute('onclick', 'deleteFile('+id+','+dir+')');
  b3.innerHTML="Delete"

  const b4 = document.createElement('button')
  b4.setAttribute('class', 'btn btn-primary')
  b4.setAttribute('data-dismiss', 'modal')
  b4.innerHTML="Ok"

  foot.appendChild(b2)
  foot.appendChild(b3)
  foot.appendChild(b4)
}

function modalAddPlayer(path){
  const ply = document.getElementById('playerId');

  const player = document.getElementById('player')
  player.setAttribute('src', "/Users/rafal/PythonProjects/rawraver/storage/rock/Super Tramp/04_-_Breakfast_In_America.mp3");

  const b1 = document.createElement('button')
  b1.setAttribute('onclick', 'play('+player+')')
  b1.setAttribute('class','btn btn-success btn-sm ')

  b1.innerHTML="Play"

  const b2 = document.createElement('button')
  b2.setAttribute('onclick', 'pause('+player+')')
  b2.setAttribute('class','btn btn-danger btn-sm ')
  b2.innerHTML="Pause"

  ply.appendChild(b1)
  ply.appendChild(b2)
}

function addSubmit() {
  form = document.getElementById("addForm")

  form.submit = function() {
    if (isAdvancedUpload) {

      var formData = new FormData(form);

      $.ajax({
          type: "POST",
          url: 'http://127.0.0.1:8000/file/add/'+currentDir,
          data: formData,
          dataType: 'json',
          cache: false,
          contentType: false,
          processData: false,
          complete: function() {
           $('.box').removeClass('is-uploading');
           $('.modal').modal('hide')
           loadNew(currentDir)
          },
          success: function(data) {
           $('.box').addClass( data.success == true ? 'is-success' : 'is-error' );
           if (!data.success) $errorMsg.text(data.error);
          },
          error: function() {
           // Log the error, show an alert, whatever works for you
          }
        });
      return false;
    }
  }
  form.submit()
}

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

$('.modal').on('hide.bs.modal', function (e) {
  document.getElementById('infoTitle').innerHTML=""
  document.getElementById('infoText').innerHTML = ""
  document.getElementById('playerId').querySelectorAll('*').forEach(n => n.remove());
  document.getElementById('infoFooter').querySelectorAll('*').forEach(n => n.remove());
  document.getElementById('box').style.display = 'none';
  document.getElementById('boxLabel').innerHTML=boxInitText
})

$(function() {
    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg','9.jpg', '10.jpg', '11.jpg', '12.jpg'];
    ret = './images/' + images[Math.floor(Math.random() * images.length)]
    document.body.background = ret
});

function addDir(){

  const spot = document.getElementById('addPlace');
  spot.innerHTML = ""
  const inField = document.createElement('input')
  inField.setAttribute('type', 'text')
  inField.setAttribute('id', 'infield')
  inField.setAttribute('value', 'Directory name')
  inField.setAttribute('style', 'margin:20px')
  inField.setAttribute('onfocus', "this.value=''")

  const okButton = document.createElement('button')
  okButton.setAttribute('class', 'btn btn-primary')
  okButton.setAttribute('onclick', 'addDirReq()')
  okButton.innerHTML="Create"

  spot.appendChild(inField)
  spot.appendChild(okButton)

}

function addDirReq(){
  var name = document.getElementById('infield').value

  var formData = new FormData();
  formData.append('name', name)

  $.ajax({
      type: "POST",
      url: 'http://127.0.0.1:8000/dir/add/'+currentDir,
      data: formData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      complete: function() {
        loadNew(currentDir);
      }
    });
}

function delDir(){
  var request = new XMLHttpRequest()
  var parent = false
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'http://127.0.0.1:8000/dir/delete/'+currentDir, true)

  request.onload = function() {
     var data = JSON.parse(this.response)
     parent = data.parent
     loadNew(parent)
  }
  request.send()

}
