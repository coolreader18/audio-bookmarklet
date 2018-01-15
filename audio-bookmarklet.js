/* @bookmarklet @preserve
 * @name Audio Bookmarklet Bookmarklet
 * @author coolreader18
 */

fetch(location.href).then(async res => {
  var binary = '',
  bytes = new Uint8Array(await res.clone().arrayBuffer());
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  var win = open("", "audioBookmarklet", "status=no,height=100,innerWidth=300");
  win.document.write(
`<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
a {
  font-family: 'Roboto', sans-serif;
  font-color: #0288d1;
}
</style>
<a href='javascript:(function(w,i){w[i]=w[i]||Object.create(new Audio,{src:"data:${(await res.clone().blob()).type};base64,${btoa(binary)}",onended:function(e){u(e.currentTarget)}});var a=w[i];a.paused?a.play():u(a);function u(b){b.pause();b.currentTime=0}})(window.audiobookmarklet=window.audiobookmarklet||{},"${Math.random().toString(36).substr(2,7)}")'>${decodeURIComponent(res.url.split("/").slice(-1)[0].split('.').slice(0, -1).join("."))}</a>`);
  win.addEventListener("blur", () => {
    win.close();
  })
})
