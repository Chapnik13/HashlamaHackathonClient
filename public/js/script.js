var myApp = angular.module("dashboard", ["chart.js"])
myApp.controller("dashboardCtrl", function ($scope, $interval, $http) {
    $scope.labels =  new Array(45);
    $scope.series = ['Series A'];
    $scope.data = new Array(45);
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    };
    
    $scope.inputIDs = {
      availableOptions: [
        {id: '1', name: 'Option A'},
        {id: '2', name: 'Option B'},
        {id: '3', name: 'Option C'}
      ],
      selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
      };

      $http({
        method: 'GET',
        url: '/IDS',
     }).then(function (success){
        // console.log(success.data);
        var jsonData =  success.data;
        if(jsonData != null && (!angular.equals({}, jsonData))){
            $scope.inputIDs = jsonData;
        }
      }, function (error){
      });

    
    
   //$scope.inputIDs = [];

    $scope.currentTime = new Date().toLocaleTimeString();
    $scope.tilt = 0;
    $scope.light = 0;
    $interval(function () {
        //data.
        $scope.currentTime = new Date().toLocaleTimeString();
        var urlTmp =  '/arduino/' + $scope.inputIDs.selectedOption.id;
        $http({
          method: 'GET',
          url: urlTmp,
       }).then(function (success){
          // console.log(success.data);
          var jsonData =  success.data;
          if(jsonData != null && !angular.equals({}, jsonData)){
            console.log('json', jsonData);
            console.log('data', success.data);

            var m = $scope.data;
            m.shift();
            var k = jsonData.Sound;
            $scope.tilt = jsonData.Tilt ? 'Tilted' : 'Not tilted';
            $scope.light = jsonData.Light != null ? jsonData.Light : 0;
            // field (expected): type, ID, sound, light, tilt
            // console.log('sound value', k)
            m.push(k);
            $scope.data = m;
          }
       }, function (error){
       });
    }, 150);

    $interval(function () {
      var urlTmp =  '/image/' + $scope.inputIDs.selectedOption.id;

       $http({
          method: 'GET',
          url: urlTmp,
       }).then(function (success){
          var jsonData =  success.data;
          //console.log('image json', jsonData);
          $scope.image = jsonData.Image;
          var det = jsonData.Detection;
          $scope.humanDetected = det == 0 ? 'No Humans Detected.' : det + ' humans detected.';
       }, function (error){
       });
    }, 200);
    

  });
