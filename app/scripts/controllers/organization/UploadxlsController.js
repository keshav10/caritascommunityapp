(function (module) {
    mifosX.controllers = _.extend(module, {
        UploadxlsController: function (scope, resourceFactory) {
            scope.submit = function(){
                resourceFactory.uploadxlSheetResource.create(this.file, function (data) {
                });
            };

        }
    });
    mifosX.ng.application.controller('UploadxlsController' ['$scope','ResourceFactory', mifosX.controllers.UploadxlsController]).run(function ($log) {
        $log.info("UploadxlsController initialized");
    });
}(mifosX.controllers || {}));

