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
                    //url: $rootScope.hostUrl + API_VERSION + '/uploadxls/',
                    url : 'https://52.19.21.68:8443/mifosng-provider/api/v1/uploadxls/',
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

               // alert('response is :', +$rootScope.successfulResponses);
            };

        }

    });

    mifosX.ng.application.controller('UploadxlsController', ['$scope','$location','$http','API_VERSION','$upload','$rootScope', 'ResourceFactory' ,mifosX.controllers.UploadxlsController]).run(function ($log) {

        $log.info("UploadxlsController initialized");
    });
}(mifosX.controllers || {}));

