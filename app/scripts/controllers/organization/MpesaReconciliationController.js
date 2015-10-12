(function (module) {
    mifosX.controllers = _.extend(module, {
        MpesaReconciliationController: function ($q,$http,scope, resourceFactory, location,http,dateFilter,$modal) {
            scope.routeTo = function (id, mpesaamount, mpetxnsacode, txnDate, txnId) {
                location.path('/clientpayments/' + id + '/' + mpesaamount + '/' + mpetxnsacode + '/' + txnDate + '/' + txnId);
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
            scope.toDateSearch=new Date();


            var deferred = $q.defer();
            $http.get("http://localhost:9292/mpesa/getunmappedtransactions?offset="+1+"&limit="+1).success(function (data) {
                deferred.resolve(data);
                scope.completetransaction = data;
            });
            scope.searchStatus = [
                {
                    "id": "1",
                    "name": "PAID"
                },
                {
                    "id":"2",
                    "name":"CMP"
                },
                {
                    "id": "3",
                    "name": "BM"
                },
                {
                    "id": "4",
                    "name":"UNMP"
                },
                {
                    "id":"5",
                    "name":"Select Option"
                }

            ];


            scope.Mpesasearch=function() {
               // alert("search Id"+scope.formData.searchStatus1) ;
                scope.fromDate = dateFilter(scope.fromDateSearch, 'yyyy-MM-dd');
                scope.toDate = dateFilter(scope.toDateSearch, 'yyyy-MM-dd');
                scope.searcText=scope.mobileNosearch;
                if(scope.mobileNosearch!=null) {
                    var n =scope.mobileNosearch;
                    var p= n.indexOf(0)
                    if(p==0){
                        scope.searcText=254+ n.substring(1, n.length)
                        alert(scope.searcText);
                    }
                }
                scope.text = "";
                  if (scope.formData.searchStatus1 == "1") {
                        scope.text = 'PAID';
                    }
                    else if (scope.formData.searchStatus1 == "3") {
                        scope.text = 'BM';
                    }
                  else if (scope.formData.searchStatus1 == "4") {
                      scope.text = 'UNMP';
                  }
                  else if (scope.formData.searchStatus1 == "2") {
                      scope.text = 'CMP';
                  }
                  else if(scope.formData.searchStatus1=="5"){
                      scope.text= "";
                  }
                  else{
                      scope.text = 'CMP';
                  }

                http({
                    method: 'GET',
                    url: 'http://localhost:9292/mpesa/Search?status='+ scope.text+'&FromDate='+ scope.fromDate+'&ToDate='+scope.toDate+'&mobileNo='+scope.searcText
                }).success(function (data) {
                    deferred.resolve(data);
                    scope.completetransaction=data;
                });

            };

            //scope.transactions={"id":5,"ipnId":2972,"origin":"MPESA","destination":"254700733153","timeStamp":null,"testMessage":"BM46ST941 Confirmed.on 6/7/11 at 10:49 PM Ksh8,723.00 received from RONALD NDALO 254722291067.Account Number 5FML59-01 New Utility balance is Ksh6,375,223.00","user":"123","password":"123","transactionCode":"BM46ST941","mobileNo":"9632587410","accountName":"5FML5901","transactionDate":"1307385000000","transactionTime":"10:49 PM","transactionAmount":"8723.000000","sender":"RONALD NDALO","status":"UT","clientId":13,"officeId":4};
            scope.showTransactionDetail1 = function (Id,Date,recNo) {
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
                 $http.get("https://localhost:8443/mifosng-provider/api/v1/clients/"+scope.clientId+"/Mpesa?TransactionDate="+scope.TransactionDate+"&ReceiptNo="+scope.ReceiptNo).success(function(data) {
                    deferred.resolve(data);
                    $scope.transactionData = data;
                });
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });

    mifosX.ng.application.controller('MpesaReconciliationController', ['$q','$http','$scope', 'ResourceFactory', '$location','$http','dateFilter','$modal', mifosX.controllers.MpesaReconciliationController]).run(function ($log) {
        $log.info("MpesaReconciliationController initialized");
    });
}(mifosX.controllers || {}));
