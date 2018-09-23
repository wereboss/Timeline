var CLmap = [];


function loadCLJSON() {
  var tmpObj = [];
  var waitB = true;
  var waitI;
  //console.log("Inside loadJSON with url " + url);
  $.ajaxSetup({
    async: false
  });
  $.getJSON("Changelog.json", function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    $.each(data.ChangeLog, function(ini, it) {
      tmpObj.push(it);
    });
    //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj, null, 4));
    //console.log("tmpObj len " + tmpObj.length);
  });
  $.ajaxSetup({
    async: true
  });
  return tmpObj;

  //return loadJSON("Roadmap.json");
}

function renderChangelog() {
  CLmap = loadCLJSON();
  var mainTmpl = new MyTemplate($("#mytrender"), false, null);
  mainTmpl.renderMe();
}
