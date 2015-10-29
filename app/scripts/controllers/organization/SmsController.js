(function (module) {
    mifosX.controllers = _.extend(module, {
        SmsController: function (scope, resourceFactory, location) {
            scope.offices = [];
            scope.clients = [];
            scope.submt = false;
            scope.officeId1=1
            scope.hjk = false;
            scope.formData={};
            scope.mobileNo={};
            scope.selected=false;


            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    officeId: scope.offices[0].id
                }
            });

            scope.select=function(){
                scope.selected=false;
                scope.mobileNo=scope.formData.id;
                scope.formData.mobileNo=scope.mobileNo;

            }

            scope.selectAll = function(){
                scope.selected=true;
                var tempString = "";
                scope.mobileNo="";
                for (var l in scope.clients) {
                    scope.mobileNo= scope.mobileNo+scope.clients[l].mobileNo+",";
                }
                scope.formData.mobileNo= scope.mobileNo;
            }

            scope.clear=function(){
                scope.selected=false;
                scope.formData.mobileNo=" ";
                scope.formData.id="";
            }
            scope.cancle=function(){
                //scope.selected=false;
                scope.formData.messageText=" ";
            }
            var param={};
            param.officeId=scope.officeId1;
            var items = resourceFactory.clientResource.getAllClients(param, function (data) {
                scope.totalClients = data.totalFilteredRecords;
                scope.clients = data.pageItems;
            });


                     scope.fetchClientByOfficeId = function (officeId) {
                         scope.officeId1 = officeId;
                         var params={};
                         params.officeId=officeId;
                         scope.formData.mobileNo="";
                         scope.hjk = true;
                         var items = resourceFactory.clientResource.getAllClients(params, function (data) {
                             scope.totalClients = data.totalFilteredRecords;
                             scope.clients = data.pageItems;
                         });


                 }

            }


    });
    mifosX.ng.application.controller('SmsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.SmsController]).run(function ($log) {
        $log.info("SmsController initialized");
    });
}(mifosX.controllers || {}));