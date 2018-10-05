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
var CLmap = [];
var chgTemplate = [],
  newChangeLog = {};
var ChangeLog = {
  MonthList: [
    {
      Month: "Aug 2018",
      ChangeList: [
        { Title: "Change One", Desc: "Change One Desc", Countries: "SG,HK" },
        { Title: "Change two", Desc: "Change two Desc", Countries: "SG,HK" },
        {
          Title: "Change three",
          Desc: "Change three Desc",
          Countries: "SG,HK"
        },
        { Title: "Change four", Desc: "Change four Desc", Countries: "SG,HK" }
      ]
    },
    {
      Month: "Sep 2018",
      ChangeList: [
        { Title: "Change One", Desc: "Change One Desc", Countries: "SG,HK" },
        { Title: "Change two", Desc: "Change two Desc", Countries: "SG,HK" },
        {
          Title: "Change three",
          Desc: "Change three Desc",
          Countries: "SG,HK"
        },
        { Title: "Change four", Desc: "Change four Desc", Countries: "SG,HK" }
      ]
    },
    {
      Month: "Oct 2018",
      ChangeList: [
        { Title: "Change One", Desc: "Change One Desc", Countries: "SG,HK" },
        { Title: "Change two", Desc: "Change two Desc", Countries: "SG,HK" },
        {
          Title: "Change three",
          Desc: "Change three Desc",
          Countries: "SG,HK"
        },
        { Title: "Change four", Desc: "Change four Desc", Countries: "SG,HK" }
      ]
    }
  ]
};

function loadCLJSON() {
  var tmpObj = [];
  var waitB = true;
  var waitI;
  console.log("Inside loadJSON");
  $.ajaxSetup({
    async: false
  });
  $.getJSON("ChangeList.json", function(data) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    CLmap = $.extend(true, {}, data);
    //console.log("StringiFy CLmap:" + JSON.stringify(CLmap, null, 4));
    //console.log("tmpObj len " + tmpObj.length);
  });
  $.getJSON("dummy.json", function(data1) {
    //console.log("StringiFy JSON Data" + JSON.stringify(data.d.results));
    chgTemplate = $.extend(true, {}, data1);
    //console.log("StringiFy chgTemplate:" + JSON.stringify(chgTemplate, null, 4));
    //console.log("tmpObj len " + tmpObj.length);
  });
  $.ajaxSetup({
    async: true
  });
  return tmpObj;

  //return loadJSON("Roadmap.json");
}

function monthListFilter(val) {
  return val;
}

function monthListFind(val,jsOutArr) {
  return -1;
  if(typeof jsOutArr == "object" && jsOutArr.length){
    return jsOutArr.findIndex(function (element, index, array){
      return (monthFormatter(val.RelDate) == element.Month)
    });
  }
}

function monthFormatter(val) {
  if (val) {
    var milli = val.replace(/\/Date\((-?\d+)\)\//, "$1");
    var d = new Date(parseInt(milli));
    var m = d.getMonth();
    m += 1;
    return "" + Mmm[m] + "-" + d.getFullYear();
  } else {
    return "";
  }
}

$(function() {
  loadCLJSON();
  //var fTemp = window["loadCLJSON"];
  //fTemp();
  //debugger;
  //console.log(JSON.stringify(window["loadCLJSON"]));

  var mainTmpl = new JSONTemplate(CLmap, chgTemplate);
  newChangeLog = mainTmpl.processObj(chgTemplate);
  console.log("newChangeLog:" + JSON.stringify(newChangeLog,null,4));
});
