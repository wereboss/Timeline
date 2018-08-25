function mifyDate(m, y) {
  var nY, nStr;
  if (y > 2000) {
    nY = y - 2000;
  } else {
    nY = y - 1900;
  }
  nStr = "M" + m + "'" + nY;
  return nStr;
}
function getRel(tldata) {
  var arrRel = [];
  var mStr = "",
    nYear = 0;
  tldata.forEach(element => {
    mStr = mifyDate(element.RelMonth, element.RelYear);
    if (arrRel.indexOf(mStr) < 0) {
      arrRel.push(mStr);
    }
  });
  arrRel.sort(function(a, b) {
    var m1, m2, y1, y2;
    m1 = Number(a.substring(1, a.indexOf("'")));
    m2 = Number(b.substring(1, b.indexOf("'")));
    y1 = Number(a.substring(a.indexOf("'") + 1, a.length - 1));
    y2 = Number(b.substring(b.indexOf("'") + 1, b.length - 1));
    //console.log("m1:" + m1 + ",m3:" + m2 + ",y1:" + y1 + ",y2:" + y2);
    if (y1 == y2) {
      return m1 - m2;
    } else {
      return y1 - y2;
    }
  });
  return arrRel;
}

function drawScreen(jObj) {
  var TLdata = [],
    relArr = [],
    itArr = [],
    ctryArr = [],
    tagArr = [],
    eleObj,
    tmpStr = "";

  var tmHTML = "";
  TLdata = jObj;
  //TLdata = loadJSON(url + params);
  //console.log(TLdata.length);
  relArr = getRel(TLdata);
  //console.log(relArr.length);
  relArr.forEach(currentItem => {
    //console.log("for release:" + currentItem);
    tmHTML += '<li class="timeline-inverted">';
    tmHTML +=
      '<div class="timeline-badge primary rel">' +
      currentItem +
      "</div>" +
      '<div class="timeline-panel">';
    itArr = TLdata.filter(function(item) {
      //console.log("inside filter" + JSON.stringify(item));
      return this == mifyDate(item.RelMonth, item.RelYear);
    }, currentItem);
    //console.log(itArr.length);
    itArr.forEach(cItem => {
      //console.log("inside itArr each item:" + JSON.stringify(cItem));
      tmHTML += '<div class="timeline-heading">';
      tmHTML += '<div class="row">';
      tmHTML += '<div class="col-sm-8">';
      tmHTML += '<h4 class="timeline-title">';
      if (cItem.Type == "Enhancement") {
        tmHTML += '<i class="fas fa-star logowarning"></i>  ';
      } else {
        tmHTML += '<i class="fas fa-band-aid logodanger"></i>  ';
      }
      tmHTML += cItem.Title + "</h4>";
      tmHTML += "</div>";
      tmHTML += '<div class="col-sm-4" style="text-align: right;">';
      tmpStr = cItem.Countries;
      ctryArr = tmpStr.split(",");
      //console.log(JSON.stringify(ctryArr));
      ctryArr.forEach(cCtry => {
        tmHTML +=
          '<div class="btn btn-outline-secondary btn-sm" onclick=filterCountry("' +
          cCtry.trim() +
          '")>' +
          cCtry.trim() +
          "</div>";
      });
      tmHTML += "</div></div></div>";
      tmHTML += '<div class="timeline-body">';
      tmHTML += '<div class="row"><div class="col-sm-12">';
      tmHTML += "<p>" + cItem.Desc + "</p></div></div>";
      tmHTML +=
        '<div class="row" style="margin-bottom: 20px;"><div class="col-sm-10">';
      tmpStr = cItem.Tags;
      tagArr = tmpStr.split(",");
      //console.log(JSON.stringify(tagArr));
      tagArr.forEach(tItem => {
        //console.log("-" + tItem + "-");
        tmHTML +=
          '<h6 class="badge badge-pill badge-info infoshade" onclick="filterTags(' + "'" +
          tItem + "')" +
          '">' +
          tItem +
          "</h6>";
        console.log(
          '<h6 class="badge badge-pill badge-info infoshade" onclick="filterTags(' + "'" +
          tItem + "')" +
          '">' +
          tItem +
          "</h6>"
        );
      });
      tmHTML += "</div>";
      tmHTML += '<div class="col-sm-2">';
      tmHTML += "</div></div></div>";
    });
    tmHTML += "</div>";
    tmHTML += "</li>";
  });
  eleObj = $("ul.timeline").first();
  eleObj.html(tmHTML);
}

$(function() {
  var jsObj = [];
  jsObj = loadJSON("Timeline.json" + "");
  drawScreen(jsObj);
});

function filterCountry(ctry) {
  var jData = [],
    nData = [];

  jData = loadJSON("Timeline.json" + "");
  if (ctry == "All") {
    drawScreen(jData);
  } else {
    nData = jData.filter(function(val, index) {
      return val.Countries.indexOf(ctry) > -1;
    });

    drawScreen(nData);
  }
}

function filterTags(tag) {
  var jData = [],
    nData = [];
  console.log("tag:" + tag);
  jData = loadJSON("Timeline.json" + "");
  if (tag == "All") {
    drawScreen(jData);
  } else {
    nData = jData.filter(function(val, index) {
      return val.Tags.indexOf(tag.trim()) > -1;
    });

    drawScreen(nData);
  }
}
