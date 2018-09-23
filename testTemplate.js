var testObjSing = {
    testObjtext: "SampleReplaceText",
    testObjnum: 10,
    testObjbool: true
  };
  var testObj = {
      testFirstChildText: "Sample First Text",
    testFirChildArr: [
      {
        testObjtext: "SampleReplaceText 1",
        testObjnum: 10,
        testObjbool: true,
        testDeepArr:[{
          "num":1,
          "name":"one"
        },{
          "num":2,
          "name":"two"
        },{
          "num":3,
          "name":"three"
        }]
      },
      {
        testObjtext: "SampleReplaceText 2",
        testObjnum: 20,
        testObjbool: true,
        testDeepArr:[{
          "num":4,
          "name":"four"
        },{
          "num":5,
          "name":"five"
        },{
          "num":6,
          "name":"six"
        }]
      },
      {
        testObjtext: "SampleReplaceText 3",
        testObjnum: 30,
        testObjbool: true,
        testDeepArr:[{
          "num":7,
          "name":"seven"
        },{
          "num":8,
          "name":"eight"
        },{
          "num":9,
          "name":"nine"
        }]
      }
    ],
    testSecondChildText:"Sample Second Text",
    testSecChildArr: [
      {
        testObjtext: "SampleSecText 1",
        testObjnum: 10,
        testObjbool: true
      },
      {
        testObjtext: "SampleSecText 2",
        testObjnum: 20,
        testObjbool: true
      },
      {
        testObjtext: "SampleSecText 3",
        testObjnum: 30,
        testObjbool: true
      },
      {
        testObjtext: "SampleSecText 4",
        testObjnum: 40,
        testObjbool: true
      },
      {
        testObjtext: "SampleSecText 5",
        testObjnum: 50,
        testObjbool: true
      }
    ]
  
  };

  $(function() {
    var mainTmpl = new SimpTemplate($("#mytrender"));
    mainTmpl.processHtml($("#mytrender"))
  });

