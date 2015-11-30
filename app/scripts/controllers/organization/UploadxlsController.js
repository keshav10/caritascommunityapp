(function (module) {
    mifosX.controllers = _.extend(module, {

        UploadxlsController: function (scope, location, http, API_VERSION, $upload, $rootScope, resourceFactory) {
            scope.offices = [];
            scope.submt = false;

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    officeId: scope.offices[0].id
                }
            });
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
            };


            scope.submit = function () {

                $upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/uploadxls/',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                    // to fix IE not refreshing the model
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    scope.submt = true;
                    location.path('/uploadxls/');
                });


            };

        }
    });

    mifosX.ng.application.controller('UploadxlsController', ['$scope','$location','$http','API_VERSION','$upload','$rootScope', 'ResourceFactory' ,mifosX.controllers.UploadxlsController]).run(function ($log) {

        $log.info("UploadxlsController initialized");
    });
}(mifosX.controllers || {}));

