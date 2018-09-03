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
const T2BG = {
  RoadmapMajor: "blue",
  RoadmapMinor: "blue",
  TimelineEnhancement: "pink",
  TimelineFix: "yellow"
};
const S2S = {
  Scheduled: "fas fa-calendar-alt",
  Proposed: "far fa-square",
  Implemented: "fas fa-check",
  Fix:"fas fa-band-aid",
  Enhancement:"far fa-star",
  Major:"fas fa-plus-square",
  Minor:"fas fa-minus-square"
};

var gJSONArr = [];

function QPair(qnum, ynum) {
  this.Qtr = qnum;
  this.Yr = ynum;
}

function calcQuarter(dateobj) {
  var qpairobj;
  var milli = dateobj.replace(/\/Date\((-?\d+)\)\//, "$1");
  var d = new Date(parseInt(milli));
  var m = d.getMonth();
  m += 1;
  qpairobj = new QPair(M2Q[m], d.getFullYear());
  /*
  console.log(
    "calcQuarter date:" + dateobj + ", m:" + m + ",q:" + qpairobj.Qtr
  );
  */
  return qpairobj;
}

function Quarter(qnum, ynum) {
  this.Qtr = qnum;
  this.Yr = ynum;
  this.RoadmapItems = [];
  this.TimelineItems = [];

  this.addItem = function(rmObj) {
    if (rmObj.ItemType == "Roadmap") {
      this.RoadmapItems.push(rmObj);
    } else {
      this.TimelineItems.push(rmObj);
    }
  };
}
function QuarterArr() {
  this.qArr = [];
  this.findQuarter = function(qpairObj) {
    return this.qArr.findIndex(function(val, ind, itobj) {
      return val.Qtr == qpairObj.Qtr && val.Yr == qpairObj.Yr;
    });
  };
  this.addObjToQtrs = function(rtObj) {
    var qpair = calcQuarter(rtObj.RelDate);
    var qArrIndex = this.findQuarter(qpair);
    if (qArrIndex < 0) {
      var qObj = new Quarter(qpair.Qtr, qpair.Yr);
      qObj.addItem(rtObj);
      this.qArr.push(qObj);
    } else {
      this.qArr[qArrIndex].addItem(rtObj);
    }
  };
  this.sortMe = function() {
    this.qArr.sort(function(a, b) {
      if (a.Yr != b.Yr) {
        return a.Yr - b.Yr;
      } else {
        return a.Qtr - b.Qtr;
      }
    });
  };
}
function drawScreen(jsObj) {
  var itArr = jsObj;
  var qtrArr = [],
    monArr = [];
  var hObjTopC = $("#TopRowContainer"),
    strSampleRow = $("#SampleRow").html(),
    strRoadmapItem = $("#RoadmapItem").html(),
    strMonthItem = $("#MonthItem").html();
  //console.log("str:" + strMonthItem);
  qtrArr = new QuarterArr();
  //console.log(JSON.stringify(itArr,null,4));
  $.each(itArr, function(ind, item) {
    qtrArr.addObjToQtrs(item);
  });
  qtrArr.sortMe();
  //console.log("qtrArr" + JSON.stringify(qtrArr, null, 4));

  $("#TopRowContainer > .card").remove();

  $.each(qtrArr.qArr, function(inde, ite) {
    //console.log("qArr item:" + JSON.stringify(ite, null, 4));
    /*
    console.log(
      "Inside foreach quarter " +
        ite.Qtr +
        " with Roadmap:" +
        ite.RoadmapItems.length +
        " with Timelines:" +
        ite.TimelineItems.length
    );
    */
    var strRI = "",
      strTI = "",
      strTIS;
    var strSR = strSampleRow.replace(
      "##QuarterTitle##",
      "Q" + ite.Qtr + " '" + ite.Yr
    );
    $.each(ite.RoadmapItems, function(jind, jite) {
      //console.log("Inside foreach roadmapitem " + JSON.stringify(jite));
      strRI += strRoadmapItem
        .replace("##Header##", jite.Title)
        .replace("##Content##", jite.Desc)
        .replace("##color##", T2BG[jite.ItemType + jite.ItemSubType])
        .replace("##countries##", jite.Countries)
        .replace("##stagesymbol##", S2S[jite.Stage])
        .replace("##arrID##", jite.Id);
    });
    monArr = Q2M[ite.Qtr];
    strTIS = "";
    $.each(monArr, function(mind, mite) {
      //console.log("Inside foreach month " + JSON.stringify(mite));
      var tiObj = [];
      tiObj = ite.TimelineItems.filter(function(val, aind, arro) {
        var di = new Date(
          parseInt(val.RelDate.replace(/\/Date\((-?\d+)\)\//, "$1"))
        );
        return di.getMonth() == mite - 1;
      });
      //console.log("timeline items for month" + mite + ":" + JSON.stringify(tiObj));
      strTI = "";
      $.each(tiObj, function(tiind, tiitem) {
        //console.log("Inside foreach timelineitems " + JSON.stringify(tiitem));
        strTI += strRoadmapItem
          .replace("##Header##", tiitem.Title)
          .replace("##Content##", tiitem.Desc)
          .replace("##color##", T2BG[tiitem.ItemType + tiitem.ItemSubType])
          .replace("##countries##", tiitem.Countries)
          .replace("##stagesymbol##", S2S[tiitem.Stage])
          .replace("##arrID##", tiitem.Id);
      });
      strTIS += strMonthItem
        .replace("##BulletItem##", Mmm[mite])
        .replace("##TimelineItems##", strTI);
      //console.log("strTIS M:" + mite + "~" + strTIS);
    });
    strSR = strSR
      .replace("##RoadmapItems##", strRI)
      .replace("##MonthItems##", strTIS);
    //console.log("appending html:" + strSR);
    hObjTopC.append(strSR);
  });
}

function filterBy(filtext) {
  //console.log("inside filterBy:" + filtext);
  var filObj = [],
    newArr;
  gJSONArr = loadJSON("Timeline3.json" + "");
  filObj = gJSONArr;
  console.log("loadJSON length:" + filObj.length);
  if (filtext.trim().length > 0) {
    newArr = filObj.filter(function(val, ind, arro) {
      var bFound = false;
      //console.log("inside arr filter:" + JSON.stringify(val));
      for (var pty in val) {
        //console.log("inside for pty:" + pty + "of type:" + (typeof val[pty]) + " with type:" + val[pty] );
        if (
          typeof val[pty] == "string" &&
          val[pty].toUpperCase().indexOf(filtext.toUpperCase()) > -1
        ) {
          console.log(
            "Found for pty:" +
              pty +
              "of type:" +
              typeof val[pty] +
              " with type:" +
              val[pty]
          );
          bFound = true;
          break;
        }
      }
      return bFound;
    });
  } else {
    newArr = filObj;
  }
  console.log("newArr length:" + newArr.length);
  drawScreen(newArr);
}

function refreshModal(clickedID) {
  /*
    alert(JSON.stringify(gJSONArr.find(function(curr, index, arr){
        return curr.Id == clickedID;
    })));
    */
  var tmpObj = gJSONArr.find(function(curr, ind, arr) {
    return curr.Id == clickedID;
  });
  $("#DisplayModal .mele[updateField='Title']").text(tmpObj.Title);
  $("#DisplayModal .mele[updateField='Detail']").text(tmpObj.Details);
  $("#DisplayModal .mele[updateField='Countries']").text(tmpObj.Countries);
  $("#DisplayModal .mele[updateField='Tags']").text(tmpObj.Tags);
  $("#DisplayModal .mele[updateField='ItemSubType']").text(tmpObj.ItemSubType);
  $("#DisplayModal .mele[updateField='Stage']").text(tmpObj.Stage);
  $("#DisplayModal .mele[updateField='TypeSymbol']").html('<i class="' + S2S[tmpObj.ItemSubType] + '"></i>');
  $("#DisplayModal .mele[updateField='StageSymbol']").html('<i class="' + S2S[tmpObj.Stage] + '"></i>');
  var di = new Date(
    parseInt(tmpObj.RelDate.replace(/\/Date\((-?\d+)\)\//, "$1"))
  );
  $("#DisplayModal .mele[updateField='RelDate']").text(di.toDateString());
}

$(function() {
  //var jsObj = [];
  gJSONArr = loadJSON("Timeline3.json" + "");
  drawScreen(gJSONArr);

  $("#filterbox").keypress(function(ev) {
    var keycode = ev.keyCode ? ev.keyCode : ev.which;
    if (keycode == "13") {
      console.log($("#filterbox").val());
      filterBy($("#filterbox").val());
    }
  });

  $(".detailclick").click(function() {
    var clickedID = 0;
    /*
    alert(
      "clicked on:" +
        parseInt($(this).attr("arrID"))
    );
    */
    if ($(this).attr("arrID")) {
      clickedID = $(this).attr("arrID");
    }
    refreshModal(parseInt(clickedID));
    $("#DisplayModal").modal("show");
  });
});
