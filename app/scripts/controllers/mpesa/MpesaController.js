(function (module) {
    mifosX.controllers = _.extend(module, {
        MpesaController: function ($q,$http,scope, resourceFactory, location,$modal,http) {
            scope.routeTo = function (id,mpesaamount) {
                location.path('/clientpayments/' + id+'/'+mpesaamount);
            };
            scope.status = false;
            scope.mobileNo = false;
            scope.TxnDate = false;
            scope.formData = {};
            scope.find = true;
            scope.mobileNosearch = "";
            scope.fromDateSearch = "";
            scope.toDateSearch = "";
            scope.statusSearch = "";
            scope.completetransaction = [];
            scope.searchStatus = [];
            scope.restrictDate = new Date();
            scope.currentScope;
            scope.Paidstatus=false;
            scope.transactionData=[];
            scope.TransactionDate;
            scope.clientId;
            scope.ReceiptNo;
            var deferred = $q.defer();
            $http.get("http://localhost:9292/mpesa/getunmappedtransactions").success(function(data) {
             deferred.resolve(data);
             scope.completetransaction=data;
             });

            scope.searchStatus = [
                {
                    "id": "1",
                    "name": "PAID"
                },
                {
                    "id": "2",
                    "name": "CMP"
                },
                {
                    "id": "3",
                    "name": "BM"
                }
            ];


            scope.changeStatus = function(status){
                this.formData.searchStatus1 = status;
                // alert("status" + status)
            };
            //scope.transactions={"id":5,"ipnId":2972,"origin":"MPESA","destination":"254700733153","timeStamp":null,"testMessage":"BM46ST941 Confirmed.on 6/7/11 at 10:49 PM Ksh8,723.00 received from RONALD NDALO 254722291067.Account Number 5FML59-01 New Utility balance is Ksh6,375,223.00","user":"123","password":"123","transactionCode":"BM46ST941","mobileNo":"9632587410","accountName":"5FML5901","transactionDate":"1307385000000","transactionTime":"10:49 PM","transactionAmount":"8723.000000","sender":"RONALD NDALO","status":"UT","clientId":13,"officeId":4};

            scope.showTransactionDetail = function (Id,Date,recNo) {
                  var params = {};
                scope.TransactionDate = Date;
                scope.clientId = Id;
                scope.ReceiptNo = recNo;
                var deferred = $q.defer();
                     $modal.open({
                    templateUrl:'showTxn.html',
                    controller: ClientDeleteCtrl
                          });
            };


            var ClientDeleteCtrl = function ($scope, $modalInstance) {
                alert("client id =" + scope.clientId);
                alert("tramsacton date :" + scope.TransactionDate);
                alert("receipt no:" + scope.ReceiptNo);
               $http.get("https://localhost:8443/mifosng-provider/api/v1/clients/"+scope.clientId+"/Mpesa?TransactionDate="+scope.TransactionDate+"&ReceiptNo="+scope.ReceiptNo).success(function(data) {
                   deferred.resolve(data);
                   $scope.transactionData = data;
                   alert($scope.transactionData);
               });
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
            });

    scope.Mpesasearch=function(){

    }


    mifosX.ng.application.controller('MpesaController', ['$q','$http','$scope', 'ResourceFactory', '$location', '$modal' ,'$http',mifosX.controllers.MpesaController]).run(function ($log) {
        $log.info("MpesaController initialized");
    });
}(mifosX.controllers || {}));