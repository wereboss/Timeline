const Q2M = [[], [11, 12, 1], [2, 3, 4], [5, 6, 7], [8, 9, 10]];
const M2Q = [0, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 1, 1];
const Mmm = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var OrgRDmap = [],
  RDmap = [],
  TimelineArr = [],
  ColorArr = ["yellow", "pink", "blue", "green"];

function assignColor(progID, type) {
  var cStr = "",
    cLen = ColorArr.length;
  cStr = ColorArr[progID % cLen];
  if (type == "Program") {
    return "bg-program-" + cStr + " f-16";
  } else {
    return "bg-feature-" + cStr + " f-14";
  }
}

function DateCol(dDateVal) {
  var tmpD = "";
  this.Qtr = M2Q[dDateVal.getMonth() + 1];
  this.QYr = dDateVal.getFullYear();
  this.Yr = dDateVal.getFullYear();
  this.Mth = dDateVal.getMonth() + 1;
  if (this.Mth == 11 || this.Mth == 12) {
    this.QYr += 1;
  }
  //this.DateVal = dDateVal;
  this.genMonthField = function() {
    //console.log("inside genMonthField:" + JSON.stringify(this));
    tmpD = "" + this.Yr;
    return [
      "" + Mmm[this.Mth] + "" + this.Yr,
      "" + Mmm[this.Mth] + "'" + tmpD.substr(-2, 2)
    ];
  };
  this.genQuarterField = function() {
    //console.log("inside genQuarterField:" + JSON.stringify(this));
    return ["", "Q" + this.Qtr + "'" + this.QYr];
  };
}

function Timeline() {
  this.Quarters = [];
  this.Months = [];
  this.processDate = function(dCol) {
    if (
      !this.Quarters.find(function(val, id, obj) {
        return val.Qtr == dCol.Qtr && val.QYr == dCol.QYr;
      })
    ) {
      this.Quarters.push(dCol);
    }
    if (
      !this.Months.find(function(val, id, obj) {
        return val.Mth == dCol.Mth && val.Yr == dCol.Yr;
      })
    ) {
      this.Months.push(dCol);
    }
  };
}

function genTimeline() {
  var dDate, minD, maxD, tmpQ, tmpM;
  TimelineArr = new Timeline();
  minD = new Date(Date.now());

  tmpQ = M2Q[minD.getMonth() + 1];
  tmpM = Q2M[tmpQ][0];
  if (tmpM - minD.getMonth() - 1 >= 10) {
    minD.setMonth(minD.getMonth() - 2);
  } else {
    minD.setMonth(minD.getMonth() + tmpM - minD.getMonth() - 1);
  }
  minD.setDate(1);
  maxD = new Date(minD);
  maxD.setFullYear(maxD.getFullYear() + 3);
  maxD.setDate(1);
  //console.log("minD:" + minD.toDateString() + ",maxD:" + maxD.toDateString());
  //alert("minD:" + minD.toDateString() + ",maxD:" + maxD.toDateString());
  dDate = minD;
  while (dDate <= maxD) {
    //alert("dDate:" + dDate.toDateString() + ",maxD:" + maxD.toDateString());
    var tmpDateCol = new DateCol(dDate);
    TimelineArr.processDate(tmpDateCol);
    dDate.setMonth(dDate.getMonth() + 1);
  }
  //console.log("genTimeline:" + JSON.stringify(TimelineArr,null,4));
}

function genColumnArr() {
  var dColArr = [
    [
      {
        field: "Title",
        title: "Title",
        align: "left",
        valign: "middle",
        rowspan: 2,
        cellStyle: function(value, row, index, field) {
          return {
            classes: "title-" + row.Type,
            css: { "min-width": "400px" }
          };
        }
      },
      {
        field: "Type",
        title: "Type",
        align: "left",
        valign: "middle",
        rowspan: 2,
        visible: false
      }
    ],
    []
  ];
  genTimeline();
  $.each(TimelineArr.Quarters, function(ind, val) {
    //console.log("per Quarter:" + JSON.stringify(val));
    var tmpQF = val.genQuarterField();
    //console.log("per Quarter tmpQF:" + JSON.stringify(tmpQF));
    dColArr[0].push({
      title: tmpQF[1],
      colspan: 3,
      align: "center",
      valign: "middle"
    });
  });
  $.each(TimelineArr.Months, function(ind2, val2) {
    var tmpMF = val2.genMonthField();
    dColArr[1].push({
      field: tmpMF[0],
      title: tmpMF[1],
      align: "center",
      valign: "middle",
      cellStyle: cFormatter
    });
  });
  //console.log("inside genColumnArr:" + JSON.stringify(dColArr, null, 4));
  return dColArr;
}

function loadRJSON() {
  var tmpObj = [];
  var waitB = true;
  var waitI;
  //console.log("Inside loadJSON with url " + url);
  $.ajaxSetup({
    async: false
  });
  $.getJSON("Roadmap.json", function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    $.each(data.Roadmap, function(ini, it) {
      tmpObj.push(it);
    });
    //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
    //console.log("tmpObj len " + tmpObj.length);
  });
  $.ajaxSetup({
    async: true
  });
  return tmpObj;

  //return loadJSON("Roadmap.json");
}

function loadTable() {
  return loadRJSON();
}

//JSON loading functions
function loadJSON(url) {
  var tmpObj = [];
  var waitB = true;
  var waitI;
  //console.log("Inside loadJSON with url " + url);
  $.ajaxSetup({
    async: false
  });
  $.getJSON(url, function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    $.each(data.d.results, function(ini, it) {
      tmpObj.push(it);
    });
    //console.log("StringiFy tmpObj" + JSON.stringify(tmpObj));
    //console.log("tmpObj len " + tmpObj.length);
  });
  $.ajaxSetup({
    async: true
  });
  return tmpObj;
}

function dFormatter(index, row, element) {
  //debugger;
  //$(".glyphicon-plus").addClass("fas fa-plus");
  //$(".glyphicon-minus").addClass("fas fa-minus");
  //  console.log("index:" + index + ",row:" + JSON.stringify(row,null,4) + ",element:" + JSON.stringify(element,null,4));
  return row.Title + " detail text";
}

function dFilter(index, row) {
  //debugger;
  if (row.Type != "Program") {
    return true;
  } else {
    return false;
  }
}

function rowFormatter(row, index) {
  //console.log(JSON.stringify(row));
  //var cStr = assignColor(row.ProgramId, row.Type);
  //console.log("Color:" + cStr);
  if (row.Type == "Program") {
    return {
      classes:
        "bg-program-" + ColorArr[row.ProgramId % ColorArr.length] + " f-16"
    };
  } else {
    return {
      classes:
        "bg-feature-" + ColorArr[row.ProgramId % ColorArr.length] + " f-14"
    };
  }
}

function cFormatter(value, row, index, field) {
  //console.log(value);
  //var cStr = assignColor(row.ProgramId, "Program");

  if (value && row.Type == "Feature") {
    return {
      classes: "bg-value-" + ColorArr[row.ProgramId % ColorArr.length]
    };
  } else {
    return {
      classes: ""
    };
  }
}

function renderRoadmap() {
  var colArr = genColumnArr();
  RDmap = loadTable();
  OrgRDmap = RDmap;
  //RDmap = loadJSON("Roadmap.json");

  //console.log("RDMap:" + JSON.stringify(RDmap, null, 4));

  $("#Rtable").bootstrapTable({
    data: RDmap,
    icons: {
      detailOpen: "fas fa-plus fa-xs logogrey icon-plus",
      detailClose: "fas fa-minus fa-xs logogrey icon-minus"
    },
    columns: colArr,
    detailView: true,
    detailFormatter: dFormatter,
    detailFilter: dFilter,
    rowStyle: rowFormatter,
    classes: "table",
    idField: "Id",
    uniqueId: "Id"
  });

  RDmap.forEach(element => {
    if (element.Type != "Program") {
      $("#Rtable").bootstrapTable("hideRow", { uniqueId: element.Id });
    }
  });

  $("#Rtable").on("click-row.bs.table", function(e, row, $element, field) {
    //debugger;
    /*
    console.log(
      "Values row:" +
        JSON.stringify(row, null, 4) +
        ",Element:" +
        $element.html() +
        ",Field:" +
        field
    );
    */
    if (row.Type == "Program") {
      var bShow = false,
        idList = row.IdList;
      console.log(
        "Clicked Program:" + row.Title + "IdList:" + JSON.stringify(idList)
      );
      var hiddenRows = $("#Rtable").bootstrapTable("getHiddenRows", false);
      if (hiddenRows.length > 0) {
        hiddenRows.findIndex(function(currentValue, index, arr) {
          if (currentValue.ProgramId == row.ProgramId) {
            bShow = true;
            return true;
          }
        });
      }
      if (bShow) {
        row.IdList.forEach(element => {
          $("#Rtable").bootstrapTable("showRow", { uniqueId: element });
        });
      } else {
        row.IdList.forEach(element => {
          $("#Rtable").bootstrapTable("hideRow", { uniqueId: element });
        });
      }

      console.log("getHiddenRows:" + JSON.stringify(hiddenRows));
    } else {
      console.log(
        "Clicked Feature or something else:" +
          row.Title +
          "Program:" +
          row.ProgramId
      );
    }
    //$(".glyphicon-plus").addClass("fas fa-plus");
    //$(".glyphicon-minus").addClass("fas fa-minus");
    //$detail.text(AMdata[index].Desc);
  });
}

$(function() {
  renderRoadmap();
  renderChangelog();
});
