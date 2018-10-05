/**
 * JSON template processing class, which takes in incoming JSON object
 * and gets ready to transforms it into new output JSON function using
 * template.
 * @param {object} jsonObj      : Incoming JSON Data Object
 * @param {object} jsonTemplate : JSON Translation template (also JSON)
 * @returns {object}            : Primary processing object
 *
 */

function JSONTemplate(jsonObj, jsonTemplate) {
  //primary objects
  this.jsonObj = jsonObj;
  this.jsonTemplate = jsonTemplate;
  this.jsonOutput = {};
  this.parentObjStack = [];

  //initialize
  this.parentObjStack.push(this.jsonObj);

  //functions
  /**
   * Returns the actual object of the named object,from the parent object specified
   * @param {string} name     : name of the field to search
   * @param {object} parent   : the parent object to search the object in. use window for global vars/functions
   * @param {int} arrID       : array-index, when parent is an array
   *
   */
  this.name2obj = function(name, parent, arrID) {
    console.log("name2obj: str:" + name);
    if (parent) {
      if (arrID) {
        parent = parent[parseInt(arrID)];
      }
      if (name == "@this") {
        var alphaVal = parent;
      } else if (name == "@parent") {
        if (this.parentObjStack > 1) {
          var alphaVal = this.parentObjStack[this.parentObjStack.length - 2];
        } else {
          var alphaVal = {};
        }
      } else {
        var alphaVal = name.split(".").reduce(function(object, property) {
          return object[property];
        }, parent);
      }
      console.log("name2obj: About to return:" + JSON.stringify(alphaVal));
      return alphaVal;
    }
  };

  /**
   * processes current/child template object
   * @param {object} thisTempl    : current template object
   * @returns {object}            : translated JSON object
   */
  this.processObj = function(thisTempl) {
    var jsonObj = {};
    console.log(
      "processObj: parentObj" +
        JSON.stringify(jsonObj, null, 4) +
        ",Template:" +
        JSON.stringify(thisTempl, null, 4)
    );
    for (var property in thisTempl) {
      //console.log("property:" + property + ", value:" + JSON.stringify(this.jsTemplate[property],null,4));
      console.log(
        "processObj: before processing parentObj:" + JSON.stringify(jsonObj)
      );
      console.log("processObj: before processing property:" + property);
      //jsonObj[property] = {};
      var tObj = this.addProperty(property, thisTempl[property]);
      console.log(
        "processObj: after processing property:" +
          property +
          ",tObj:" +
          JSON.stringify(tObj)
      );
      jsonObj[property] = tObj;
    }
    return jsonObj;
  };

  /**
   *
   * @param {string} strProp        : Property name from template
   * @param {*} propObj             : Property Template object
   * @returns {object}              : returns the transformed value of the property
   */
  this.addProperty = function(strProp, propObj) {
    console.log(
      "addProperty: property:" +
        strProp +
        ",template object:" +
        JSON.stringify(propObj, null, 4)
    );
    var dataObj = {},
      propArr = [],
      thisObj = {},
      propTestFunc,
      propFormatterFunc,
      isArray = false,
      addArr = false;

    var currParent = this.parentObjStack[this.parentObjStack.length - 1];
    var oStr = propObj._source;
    var arrObj = this.name2obj(oStr, currParent);
    if (propObj._isArray) {
      isArray = propObj._isArray;
    }

    if (typeof arrObj == "object" && arrObj.length) {
      if (arrObj.length > 0) {
        addArr = true;
      }
    }

    if (propObj._findF) {
      var propFindFunc = window[propObj._findF];
    } else {
      var propFindFunc = function(val, jsOutArr) {
        return -1;
      };
    }
    if (propObj._filterF) {
      var propFilterFunc = window[propObj._filterF];
    } else {
      var propFilterFunc = function(val) {
        return true;
      };
    }
    if (propObj._formatF) {
      var propFormatterFunc = window[propObj._formatF];
    } else {
      var propFormatterFunc = function(val) {
        return val;
      };
    }
    if (isArray) {
      console.log("addProperty: Is Array:");
      if (propObj._obj) {
        console.log(
          "addProperty: found object:" + JSON.stringify(propObj._obj)
        );
        dataObj = [];
        var mySubTempl = propObj._obj;
        if (addArr) {
          for (let indobj = 0; indobj < arrObj.length; indobj++) {
            if (propFilterFunc(arrObj[indobj])) {
              console.log(
                "addProperty: found propTestFunc for Array obj:" +
                  arrObj[indobj]
              );
              var dataObjIndex = propFindFunc(arrObj[indobj], dataObj);
              if (dataObjIndex > -1) {
                this.parentObjStack.push(arrObj[indobj]);
                var childObj = {};
                childObj = this.processObj(mySubTempl, dataObj[dataObjIndex]);
                this.parentObjStack.pop();
                dataObj.push(childObj);
              } else {
                this.parentObjStack.push(arrObj[indobj]);
                var childObj = {};
                childObj = this.processObj(mySubTempl);
                this.parentObjStack.pop();
                dataObj.push(childObj);
              }
            }
          }
        }
        else {
            if (propFilterFunc(arrObj)) {
                console.log(
                  "addProperty: found propTestFunc for Array obj:" +
                    arrObj
                );
                var dataObjIndex = propFindFunc(arrObj, dataObj);
                if (dataObjIndex > -1) {
                  this.parentObjStack.push(arrObj);
                  var childObj = {};
                  childObj = this.processObj(mySubTempl, dataObj[dataObjIndex]);
                  this.parentObjStack.pop();
                  dataObj.push(childObj);
                } else {
                  this.parentObjStack.push(arrObj[indobj]);
                  var childObj = {};
                  childObj = this.processObj(mySubTempl);
                  this.parentObjStack.pop();
                  dataObj.push(childObj);
                }
              }       
        }
      } else {
        //not an object
        if (propObj._subst) {
          dataObj = [];
          var dStr = propObj._subst;
          var tmpObj = {};
          for (let indobj = 0; indobj < arrObj.length; indobj++) {
            if (propTestFunc(arrObj[indobj])) {
              dataObj.push(
                dStr.replace(
                  new RegExp("##" + strProp + "##", "g"),
                  propFormatterFunc(arrObj[indobj])
                )
              );
            }
          }
        } else {
          dataObj = {};
          for (let indobj = 0; indobj < arrObj.length; indobj++) {
            dataObj.push(propFormatterFunc(arrObj[indobj]));
          }
        }
      }
    } else {
      //Not an array
      if (propObj._subst) {
        dataObj = "";
        var dStr = propObj._subst;
        dataObj = dStr.replace(
          new RegExp("##" + strProp + "##", "g"),
          propFormatterFunc(arrObj)
        );
      } else {
        dataObj = {};
        var mySubTempl = propObj._obj;
        if (mySubTempl) {
          this.parentObjStack.push(arrObj);
          var childObj = {};
          childObj = this.processObj(mySubTempl);
          this.parentObjStack.pop();
          dataObj = propFormatterFunc(childObj);
        } else {
          dataObj = propFormatterFunc(arrObj);
        }
      }
    }
    console.log("addProperty: return obj:" + JSON.stringify(dataObj, null, 4));
    return dataObj;
  };
}
