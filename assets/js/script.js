function files(e) {
  e.preventDefault();
  var dt = e.dataTransfer;
  startPreload();
  if (dt.items) {
    for (var i = 0; i < dt.items.length; i++) {
      var item = dt.items[i];
      if (item.kind == "file") {
        doFile(item.getAsFile());
      } else if (item.type == "text/uri-list") {
        doURL(item);
      }
    }
  } else {
    for (var i = 0; i < dt.files.length; i++) {
      doFile(dt.files[i]);
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
    url.getAsString(function(str) {
      var xhr = Object.create(new XMLHttpRequest(), {
        responseType: "blob",
        onload: function(e) {
          var fr = Object.create(new FileReader(), {
            onload: function(ab) {
              var binary = "",
                bytes = new Uint8Array(ab.currentTarget.result);
              for (var i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              process(
                `data:${blob.type};base64,${window.btoa(binary)}`,
                xhr.responseURL.split("/").slice(-1)[0]
              );
            }
          }),
            blob = e.currentTarget.response;
          fr.readAsArrayBuffer(blob);
        },
        onerror: function() {
          alert(new Error("Couldn't connect"));
          stopPreload();
        },
        withCredentials: true
      });
      xhr.open("GET", str);
      xhr.send();
    });
  }
  function process(data, name) {
    var res = document.querySelector("#result");
    res.href = `javascript:\
(function(w,i){w[i]=w[i]||Object.assign(new Audio,{\
src:${JSON.stringify(data)},\
onended:function(e){u(e.currentTarget)}\
});var a=w[i];a.paused?a.play():u(a);\
function u(b){b.pause();b.currentTime=0}})(\
window.audiobookmarklet=window.audiobookmarklet||{},${JSON.stringify(
        Math.random()
          .toString(36)
          .substr(2, 7)
      )})`;
    res.textContent = name
      .split(".")
      .slice(0, -1)
      .join(".");
    stopPreload();
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
function startPreload() {
  document.querySelector("#preloader").style.display = "flex";
}
function stopPreload() {
  document.querySelector("#preloader").style.display = "none";
}
