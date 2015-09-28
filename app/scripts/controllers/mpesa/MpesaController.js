(function (module) {
    mifosX.controllers = _.extend(module, {
        MpesaController: function ($q,$http,scope, resourceFactory, location) {
            scope.routeTo = function (id,mpesaamount) {
                location.path('/clientpayments/' + id+'/'+mpesaamount);
            };
            scope.completetransaction=[];
            var deferred = $q.defer();
            $http.get("http://localhost:9292/mpesa/getunmappedtransactions").success(function(data) {
             deferred.resolve(data);
             scope.completetransaction=data;
             });
            //scope.transactions={"id":5,"ipnId":2972,"origin":"MPESA","destination":"254700733153","timeStamp":null,"testMessage":"BM46ST941 Confirmed.on 6/7/11 at 10:49 PM Ksh8,723.00 received from RONALD NDALO 254722291067.Account Number 5FML59-01 New Utility balance is Ksh6,375,223.00","user":"123","password":"123","transactionCode":"BM46ST941","mobileNo":"9632587410","accountName":"5FML5901","transactionDate":"1307385000000","transactionTime":"10:49 PM","transactionAmount":"8723.000000","sender":"RONALD NDALO","status":"UT","clientId":13,"officeId":4};
        }
            });

    mifosX.ng.application.controller('MpesaController', ['$q','$http','$scope', 'ResourceFactory', '$location', mifosX.controllers.MpesaController]).run(function ($log) {
        $log.info("MpesaController initialized");
    });
}(mifosX.controllers || {}));