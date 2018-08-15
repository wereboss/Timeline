function HTemplate(start, end, hasEnd = false) {
  this.start = start;
  this.end = end;
  this.hasEnd = hasEnd;
  this.fieldMerge = function(fieldName, fieldValue, isStart = true) {
    var str = "";
    if (isStart) {
      str = start;
      return str.replace("#" + fieldName + "#", fieldValue);
    } else {
      str = end;
      return str.replace("#" + fieldName + "#", fieldValue);
    }
  };
}
function FieldTemplate(fieldName, fieldHTML) {
  this.fieldName = fieldName;
  this.fieldHTML = new HTemplate(fieldHTML.start, fieldHTML.end);
  this.fieldHTML.start = fieldHTML.fieldMerge("FNAME", "#" + fieldName + "#");
  if (fieldHTML.hasEnd) {
    this.fieldHTML.end = fieldHTML.fieldMerge(
      "FNAME",
      "#" + fieldName + "#",
      false
    );
  }
  this.hasEnd = fieldHTML.hasEnd;
  this.renderFieldHTML = function(val, isStart) {
    var str = "";
    str = this.fieldHTML.fieldMerge(fieldName, val, isStart);
  };
}

function FieldSet(fieldArr,fieldOrder){
    this.fieldArr = [];
    fieldArr.forEach(element => {
        this.fieldArr.push(element);
    });
    this.fieldOrder = [];
    fieldOrder.forEach(currentItem => {
        this.fieldOrder.push(currentItem);
    });
}

function loadFieldSet(url){
    var fArr = [];
    var tObj, tFSObj, hObj, aObj = [];
    $.ajaxSetup({
        async: false
    });
    $.getJSON(url, function (data) {
        //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
        $.each(data.fields, function (ini, it) {
            hObj = new HTemplate(it.fieldHTML.start,it.fieldHTML.end,it.fieldHTML.hasEnd);
            tObj = new FieldTemplate(it.fieldName,hObj);
            fArr.push(tObj);
        });
        data.fieldOrder.forEach(currentItem => {
           aObj.push(currentItem); 
        });
        tFSObj = new FieldSet(fArr,tObj);
        //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
        //console.log("tmpObj len " + tmpObj.length);
        return tFSObj;
    });
    $.ajaxSetup({
        async: true
    });
}
