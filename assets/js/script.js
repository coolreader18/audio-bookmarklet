function files(e) {
  e.preventDefault();
  var dt = e.dataTransfer;
  if (dt.items) {
    for (var i=0; i < dt.items.length; i++) {
      var item = dt.items[i];
      if (item.kind == "file") {
        doFile(item.getAsFile());
      } else if (item.type == "text/uri-list") {
        doURL(item);
      }
    }
  } else {
    for (var i=0; i < dt.files.length; i++) {
      dothing(dt.files[i]);
    }
  }
  function doFile(file) {
    var fr = new FileReader();
    fr.onload = data => {
      process(data.currentTarget.result, file.name);
    };
    fr.readAsDataURL(file);
  }
  function doURL(url) {
    url.getAsString(str => fetch(str).then(async data => {
      var binary = '',
      bytes = new Uint8Array(await data.clone().arrayBuffer()),
      blob = await data.clone().blob();
      for (var i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[ i ]);
      }
      process(`data:${blob.type};base64,${window.btoa(binary)}`, data.url.split("/")[-1]);
    }));
  }
  function process(data, name) {
    var res = document.querySelector("#result");
    res.href = `javascript:(function(w,i){w[i]=w[i]||{a:new Audio("${data}"),p:!1};var o=w[i];o.p?(o.a.pause(),o.a.currentTime=0,o.p=!1):(o.a.play(),o.p=!0)})(window,"${Math.random().toString(36).substr(2,7)}")`
    res.innerHTML = name.split('.').slice(0, -1).join(".");
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
