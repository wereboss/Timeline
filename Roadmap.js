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
  TimelineArr = [];

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
  console.log("minD:" + minD.toDateString() + ",maxD:" + maxD.toDateString());
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
            classes: "",
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
      valign: "middle"
    });
  });
  console.log("inside genColumnArr:" + JSON.stringify(dColArr, null, 4));
  return dColArr;
  /*
  return [
    [
      {
        field: "Title",
        title: "Title",
        align: "left",
        valign: "middle",
        rowspan: 2
      },
      {
        field: "Type",
        title: "Type",
        align: "left",
        valign: "middle",
        rowspan: 2
      },
      {
        title: "Q2'2018",
        colspan: 3,
        align: "center",
        valign: "middle"
      },
      {
        title: "Q3'2018",
        colspan: 3,
        align: "center",
        valign: "middle"
      },
      {
        title: "Q4'2018",
        colspan: 3,
        align: "center",
        valign: "middle"
      },
      {
        title: "Q1'2019",
        colspan: 3,
        align: "center",
        valign: "middle"
      }
    ],
    [
      {
        field: "Feb2018",
        title: "Feb'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Mar2018",
        title: "Mar'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Apr2018",
        title: "Apr'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "May2018",
        title: "May'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Jun2018",
        title: "Jun'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Jul2018",
        title: "Jul'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Aug2018",
        title: "Aug'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Sep2018",
        title: "Sep'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Oct2018",
        title: "Oct'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Nov2018",
        title: "Apr'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Dec2018",
        title: "Apr'18",
        align: "center",
        valign: "middle"
      },
      {
        field: "Jan2019",
        title: "Jan'19",
        align: "left",
        valign: "middle"
      }
    ]
  ];
  */
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
  return "sample detail text";
}

function dFilter(index, row) {
  //debugger;
  return true;
}

function rowFormatter(row, index) {
    console.log(JSON.stringify(row));
  if (row.Type == "Program") {
    return {
      classes: "bg-program"
    };
  } else {
    return {
      classes: ""
    };
  }
}

$(function() {
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
    rowStyle: rowFormatter
  });
});
