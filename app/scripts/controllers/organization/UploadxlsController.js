(function (module) {
    mifosX.controllers = _.extend(module, {
        UploadxlsController: function (scope,$http) {


            scope.uploadFile = function (file1) {


                $http({
                    url: "https://localhost:8443/mifosng-provider/api/v1/uploadxls",
                    method: "POST",
                    data: file1,
                    headers: {'Content-Type': undefined,'X-Mifos-Platform-TenantId': 'caritas'}


                });
            };

        }
    });
    mifosX.ng.application.controller('UploadxlsController', ['$scope','$http' ,mifosX.controllers.UploadxlsController]).run(function ($log) {
        $log.info("UploadxlsController initialized");
    });
}(mifosX.controllers || {}));

