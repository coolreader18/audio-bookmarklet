function files(e) {
  e.preventDefault();
  var dt = e.dataTransfer;
  if (dt.items) {
    for (var i=0; i < dt.items.length; i++) {
      if (dt.items[i].kind == "file") {
        dothing(dt.items[i].getAsFile());
      }
    }
  } else {
    for (var i=0; i < dt.files.length; i++) {
      dothing(dt.files[i]);
    }
  }
  function dothing(file) {
    var fr = new FileReader();
    fr.onload = data => {
      var res = document.querySelector("#result");
      res.href = `javascript:(function(w,i){w[i]=w[i]||{a:new Audio("${data.currentTarget.result}"),p:!1};var o=w[i];o.p?(o.a.pause(),o.a.currentTime=0,o.p=!1):(o.a.play(),o.p=!0)})(window,"${Math.random().toString(36).substr(2,7)}")`
      res.innerHTML = file.name.split('.').slice(0, -1).join(".");
    };
    fr.readAsDataURL(file);
  }
}
function dragover(e) {
  e.preventDefault();
}
function dragend(e) {
  var dt = e.dataTransfer;
  if (dt.items) {
    for (var i = 0; i < dt.items.length; i++) {
      dt.items.remove(i);
    }
  } else {
    e.dataTransfer.clearData();
  }
}
