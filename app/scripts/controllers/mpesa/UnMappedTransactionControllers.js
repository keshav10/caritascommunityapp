(function (module) {
    mifosX.controllers = _.extend(module, {
        UnMappedTransactioncontrollers: function (scope, resourceFactory, location) {

        }
    });

            mifosX.ng.application.controller('UnMappedTransactioncontrollers', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.UnMappedTransactioncontrollers]).run(function ($log) {
                $log.info("UnMappedTransactioncontrollers initialized");
            });
        }(mifosX.controllers || {}));
     