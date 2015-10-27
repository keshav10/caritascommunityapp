(function (module) {
    mifosX.controllers = _.extend(module, {
        SmsController: function (scope, resourceFactory, location) {
            scope.offices = [];
            scope.clients = [];
            scope.submt = false;
            scope.officeId;

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    officeId: scope.offices[0].id
                }
            });

            scope.fetchClientByOfficeId = function(officeId){
                scope.officeId=officeId;
                var items = resourceFactory.clientResource.getAllClients({
                }, function (data) {
                    scope.clients = data;
                });

            }

        }
    });
    mifosX.ng.application.controller('SmsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.SmsController]).run(function ($log) {
        $log.info("SmsController initialized");
    });
}(mifosX.controllers || {}));