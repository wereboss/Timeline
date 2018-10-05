var foo = { 'bar': { 'alpha': 'beta' } };

var objPath = "bar.alpha";

var alphaVal = objPath.split('.')
  .reduce(function (object, property) {

    return object[property];
  }, foo);

// alphaVal === "beta"

,
      "ChangeList": {
        "_source": "@this",
        "_type": "array",
        "_arrPush": true,
        "_testF": "changeListTest",
        "_arrObj": {
          "ChangeID": {
            "_source": "Id",
            "_type": "number",
            "_arrKey": true
          },
          "Title": {
            "_source": "Title",
            "_type": "text"
          },
          "Desc": {
            "_source": "Desc",
            "_type": "text"
          },
          "Countries": {
            "_source": "Countries",
            "_type": "text"
          }
        }
      }