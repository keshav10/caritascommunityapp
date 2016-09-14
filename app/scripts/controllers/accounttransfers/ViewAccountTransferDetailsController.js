(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccountTransferDetailsController: function (scope, resourceFactory, location, routeParams, $rootScope) {

            resourceFactory.accountTransferResource.get({transferId: routeParams.id}, function (data) {
                scope.transferData = data;
            });
            scope.id = $rootScope.savingsId;
        }
    });
    mifosX.ng.application.controller('ViewAccountTransferDetailsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$rootScope', mifosX.controllers.ViewAccountTransferDetailsController]).run(function ($log) {
        $log.info("ViewAccountTransferDetailsController initialized");
    });
}(mifosX.controllers || {}));
