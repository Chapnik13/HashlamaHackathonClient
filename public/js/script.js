var myApp = angular.module("dashboard", ["chart.js"])
myApp.controller("dashboardCtrl", function ($scope, $interval, $http) {
    $scope.labels =  new Array(45);
    $scope.series = ['Series A'];
    $scope.data = new Array(45);
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.currentTime = new Date().toLocaleTimeString();
    $scope.temp = 0;
      $interval(function () {
        //data.
        $scope.currentTime = new Date().toLocaleTimeString();
        var m = $scope.data;
        m.shift();
        m.push(Math.random()*100);
        $scope.data = m;
        $http({
          method: 'GET',
          url: '/weather'
       }).then(function (success){
        $scope.temp = success.data;    
       },function (error){
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

 myApp.controller("Temperature", function($scope, $http) {
 });