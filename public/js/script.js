var myApp = angular.module("dashboard", ["chart.js"])
myApp.controller("dashboardCtrl", function ($scope, $interval, $http) {
    $scope.labels =  new Array(45);
    $scope.series = ['Series A'];
    $scope.data = new Array(45);
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.currentTime = new Date().toLocaleTimeString();
    $scope.tilt = '0';
    $interval(function () {
        //data.
        $scope.currentTime = new Date().toLocaleTimeString();
        $http({
          method: 'GET',
          url: '/arduino'
       }).then(function (success){
         console.log(success.data);
          var jsonData =  success.data;
          console.log('json', jsonData);

          var m = $scope.data;
          m.shift();
          var k = jsonData.Sound;
          $scope.tilt = jsonData.Tilt ? 'Tilted' : 'Not tilted';
          // field (expected): type, ID, sound, light, tilt
          // console.log('sound value', k)
          m.push(k);
          $scope.data = m;
       }, function (error){
       });
    }, 150);

    $interval(function () {
       $http({
          method: 'GET',
          url: '/image'
       }).then(function (success){
          var jsonData =  success.data;
          $scope.image = jsonData.Bitmap;
       }, function (error){
       });
    }, 200);
    

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
  });
