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

function loadFields(url){
    var fArr = [];
    $.ajaxSetup({
        async: false
    });
    $.getJSON(url, function (data) {
        //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
        $.each(data.fields, function (ini, it) {
            fObj.push(it);
        });
        //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
        //console.log("tmpObj len " + tmpObj.length);
    });
    $.ajaxSetup({
        async: true
    });
    fobj.forEach(element => {
        fArr.push(element)
    });
}
