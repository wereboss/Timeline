function SimpTemplate(jsele) {
  this.jsele = jsele;
  this.jsObj = {};

  this.string2obj = function(str, parent, arrID) {
    //console.log("Inside new string2obj:" + str);
    if (parent) {
      //console.log("arrID:" + arrID);
      if (arrID) {
        var pn = parent[parseInt(arrID)];
        var fn = pn[str];
      } else {
        var fn = parent[str];
      }
      if (typeof fn == "function") {
        throw new Error("function found");
      }
      //console.log("About to return:" + JSON.stringify(fn));
      return fn;
    }
  };

  this.jsObj = this.string2obj($(this.jsele).attr("myt-obj"), window);
  this.jsQ = [];
  this.jsQ.push(this.jsObj);

  this.processHtml = function(jsNode, arrID) {
    var currJSData = this.jsQ[this.jsQ.length - 1];

    var childJS = $(jsNode).children();
    //console.log("inside processHtml:" + JSON.stringify(currJSData) + "& arrID:" + arrID);
    arr2ID = $(jsNode).attr("myt-parrid");
    if (arrID) {
      //console.log("inside processHtml recieved  arrID:" + arrID);
    }
    for (let injs = 0; injs < childJS.length; injs++) {
      var cType = $(childJS[injs]).attr("myt-type");
      if (arrID) {
        $(childJS[injs]).attr("myt-parrid", arrID);
      }
      //console.log("under child with type:" + cType);
      switch (cType) {
        case "obj":
          var thisObj = this.string2obj(
            $(jsNode).attr("myt-obj"),
            currJSData,
            arr2ID
          );
          //console.log("inside html type:" + $(jsNode).attr("myt-obj"));
          this.jsQ.push(thisObj);
          this.processHtml(childJS[injs]);
          this.jsQ.pop();
          break;
        case "text":
          this.processText(childJS[injs]);
          break;
        case "array":
          this.processArray(childJS[injs]);
          break;
        default:
          //console.log("inside default type:" + $(childJS[injs]).attr("myt-parrid"));
          this.processHtml(childJS[injs], $(childJS[injs]).attr("myt-parrid"));
          break;
      }
    }
  };

  this.processArray = function(jsNode) {
    var qData = this.jsQ[this.jsQ.length - 1];
    var sData = this.string2obj(
      $(jsNode).attr("myt-obj"),
      qData,
      $(jsNode).attr("myt-parrid")
    );
    if (sData) {
      //console.log("inside processArry:" + JSON.stringify(sData));
      var eleChildArr = [];
      var eleArr = $(jsNode).children();
      for (let inda = 0; inda < eleArr.length; inda++) {
        $(eleArr[inda]).attr("myt-parrid", 0);
        eleChildArr.push(eleArr[inda]);
      }
      for (let indC = 1; indC < sData.length; indC++) {
        for (let indD = 0; indD < eleChildArr.length; indD++) {
          var tmpE = $(eleChildArr[indD]).clone();
          $(tmpE).attr("myt-parrid", indC);
          $(tmpE).appendTo(jsNode);
        }
      }
      this.jsQ.push(sData);
      this.processHtml(jsNode);
      this.jsQ.pop();
    }
  };

  this.processText = function(jsNode) {
    var qData = this.jsQ[this.jsQ.length - 1];
    var sData = this.string2obj(
      $(jsNode).attr("myt-obj"),
      qData,
      $(jsNode).attr("myt-parrid")
    );
    var eText = $(jsNode).text();
    //console.log("inside processText:" + sData);
    $(jsNode).text(
      eText.replace(
        new RegExp("##" + $(jsNode).attr("myt-obj") + "##", "g"),
        sData
      )
    );
  };
}

