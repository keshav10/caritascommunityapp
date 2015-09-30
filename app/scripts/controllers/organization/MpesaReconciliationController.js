(function (module) {
    mifosX.controllers = _.extend(module, {
        MpesaReconciliationController: function ($q,$http,scope, resourceFactory, location,http,dateFilter) {
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
            //scope.searchStatus1 = {};
            scope.currentScope;
            var deferred = $q.defer();
            $http.get("http://localhost:9292/mpesa/getunmappedtransactions").success(function (data) {
                deferred.resolve(data);
                scope.completetransaction = data;
            });
           // scope.set = function () {
               /* scope.status1 = ['PAID', 'CMP', 'BM'];*/
           // }

           // scope.select = function () {

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
                alert("status" + status)
            }
      //  }
         //   scope.select();
                //   scope.set();

             scope.cancel=function(){
                 scope.status=false;
                 scope.mobileNo=false;
                 scope.TxnDate=false;
                 scope.find=true;
             }
            scope.search=function(query){
               if(query=='status'){
                   scope.status=true;
                   scope.mobileNo=false;
                   scope.TxnDate=false;
                   scope.find=false;
               }
                if(query=='TxnDate'){
                    scope.TxnDate=true;
                    scope.status=false;
                    scope.mobileNo=false;
                    scope.find=false;
                }
                if(query=='mobileNo'){
                    scope.status=false;
                    scope.mobileNo=true;
                    scope.TxnDate=false;
                    scope.find=false;
                }
            }
            scope.FindByTxnDate=function(){
                scope.fromDate=dateFilter(scope.fromDateSearch, 'yyyy-MM-dd');
                scope.toDate=dateFilter(scope.toDateSearch, 'yyyy-MM-dd');
                alert(scope.fromDate);
                alert(scope.toDate);
                http({
                    method: 'GET',
                    url: 'http://localhost:9292/mpesa/FindbyTransactionDate?FromDate='+ scope.fromDate+'&ToDate='+scope.toDate
                }).success(function (data) {
                    deferred.resolve(data);
                    scope.completetransaction=data;
                });
            }

            scope.FinByStatus=function(){
                scope.text='';
                if(this.formDate.searchStatus1 == "1"){
                    scope.text='PAID';
                }
                else if(this.formDate.searchStatus1 == "2"){
                    scope.text='CMP';
                }
                else
                {
                    scope.text='BM';
                }
                http({
                    method: 'GET',
                    url: 'http://localhost:9292/mpesa/FindbyStatus?status='+ scope.text
                }).success(function (data) {
                    deferred.resolve(data);
                    scope.completetransaction=data;
                });

            }
            scope.FindByMobileNo=function(){
                scope.searcText=scope.mobileNosearch;
                http({
                    method: 'GET',
                    url: 'http://localhost:9292/mpesa/FindbyMobileNo?mobileNo=' + scope.searcText
                }).success(function (data) {
                    deferred.resolve(data);
                    scope.completetransaction=data;
                });
                alert(scope.searcText);
            }

            //scope.transactions={"id":5,"ipnId":2972,"origin":"MPESA","destination":"254700733153","timeStamp":null,"testMessage":"BM46ST941 Confirmed.on 6/7/11 at 10:49 PM Ksh8,723.00 received from RONALD NDALO 254722291067.Account Number 5FML59-01 New Utility balance is Ksh6,375,223.00","user":"123","password":"123","transactionCode":"BM46ST941","mobileNo":"9632587410","accountName":"5FML5901","transactionDate":"1307385000000","transactionTime":"10:49 PM","transactionAmount":"8723.000000","sender":"RONALD NDALO","status":"UT","clientId":13,"officeId":4};
        }
    });

    mifosX.ng.application.controller('MpesaReconciliationController', ['$q','$http','$scope', 'ResourceFactory', '$location','$http','dateFilter', mifosX.controllers.MpesaReconciliationController]).run(function ($log) {
        $log.info("MpesaReconciliationController initialized");
    });
}(mifosX.controllers || {}));
