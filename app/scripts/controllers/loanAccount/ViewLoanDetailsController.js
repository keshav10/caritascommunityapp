
(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanDetailsController: function (scope, routeParams, resourceFactory, location, route, http, $modal, dateFilter, API_VERSION, $sce, $rootScope) {
            scope.loandocuments = [];
            scope.report = false;
            scope.hidePentahoReport = true;
            scope.formData = {};

            scope.date = {};
            scope.date.payDate = new Date();
            scope.hideAccrualTransactions = false;
            scope.isHideAccrualsCheckboxChecked = true;
            scope.loandetails = [];
            scope.editId = null;
            scope.editgroupId = null;
            scope.repaymentscheduleReport=false;
            scope.showAddInvestment = true;

            scope.routeToAddInvestment = function () {
                scope.showAddInvestment = false;
            };

            scope.notFullAmountInvested = false;
            scope.fullAmountInvested = false;

            scope.ToEdit = function(id,groupId,amount,startdate){

                scope.editId = id;
                scope.editgroupId = groupId;
                scope.formData.investedAmounts = amount;
                scope.oldAmount = amount;
                scope.formData.startDate = startdate;
                resourceFactory.groupResource.getAllGroups(function (data) {
                    scope.groups = data;
                });

                    for(var i in scope.groups){
                        if(scope.groups[i].id == scope.editgroupId)
                        {
                            scope.formData.ids = scope.groups[i].id;
                        }
                    }

                scope.selectSaving(groupId);


            };

            scope.routeToSaving = function (saving_id) {
                location.path('/viewsavingaccount/' + saving_id);
            };

            scope.updateCheckBoxStatus = function (){
                scope.isHideAccrualsCheckboxChecked = !scope.isHideAccrualsCheckboxChecked;
            };
            scope.routeTo = function (loanId, transactionId, transactionTypeId) {
                if (transactionTypeId == 2 || transactionTypeId == 4 || transactionTypeId == 1) {
                    location.path('/viewloantrxn/' + loanId + '/trxnId/' + transactionId);
                }
                ;
            };

            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.loandetails.transactions){
                    scope.loandetails.transactions[i][dateFieldName] = new Date(scope.loandetails.transactions[i].date);
                }
            };

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "addloancharge":
                        location.path('/addloancharge/' + accountId);
                        break;
                    case "addcollateral":
                        location.path('/addcollateral/' + accountId);
                        break;
                    case "assignloanofficer":
                        location.path('/assignloanofficer/' + accountId);
                        break;
                    case "modifyapplication":
                        location.path('/editloanaccount/' + accountId);
                        break;
                    case "approve":
                        location.path('/loanaccount/' + accountId + '/approve');
                        break;
                    case "reject":
                        location.path('/loanaccount/' + accountId + '/reject');
                        break;
                    case "withdrawnbyclient":
                        location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.LoanAccountResource.delete({loanId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/loanaccount/' + accountId + '/undoapproval');
                        break;
                    case "disburse":
                        location.path('/loanaccount/' + accountId + '/disburse');
                        break;
                    case "disbursetosavings":
                        location.path('/loanaccount/' + accountId + '/disbursetosavings');
                        break;
                    case "undodisbursal":
                        location.path('/loanaccount/' + accountId + '/undodisbursal');
                        break;
                    case "makerepayment":
                        location.path('/loanaccount/' + accountId + '/repayment');
                        break;
                    case "prepayment":
                        location.path('/loanaccount/' + accountId + '/prepayloan');
                        break;
                    case "waiveinterest":
                        location.path('/loanaccount/' + accountId + '/waiveinterest');
                        break;
                    case "writeoff":
                        location.path('/loanaccount/' + accountId + '/writeoff');
                        break;
                    case "recoverypayment":
                        location.path('/loanaccount/' + accountId + '/recoverypayment');
                        break;
                    case "close-rescheduled":
                        location.path('/loanaccount/' + accountId + '/close-rescheduled');
                        break;
                    case "transferFunds":
                        if (scope.loandetails.clientId) {
                            location.path('/accounttransfers/fromloans/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/loanaccount/' + accountId + '/close');
                        break;
                    case "createguarantor":
                        location.path('/guarantor/' + accountId);
                        break;
                    case "listguarantor":
                        location.path('/listguarantors/' + accountId);
                        break;
                    case "recoverguarantee":
                        location.path('/loanaccount/' + accountId + '/recoverguarantee');
                        break;
                    case "unassignloanofficer":
                        location.path('/loanaccount/' + accountId + '/unassignloanofficer');
                        break;
                    case "loanscreenreport":
                        location.path('/loanscreenreport/' + accountId);
                        break;
                }
            };

            scope.delCharge = function (id) {
                $modal.open({
                    templateUrl: 'delcharge.html',
                    controller: DelChargeCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
            };

            var DelChargeCtrl = function ($scope, $modalInstance, ids) {
                $scope.delete = function () {
                    resourceFactory.LoanAccountResource.delete({loanId: routeParams.id, resourceType: 'charges', chargeId: ids}, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all',exclude: 'guarantors'}, function (data) {
                scope.loandetails = data;
                scope.recalculateInterest = data.recalculateInterest || true;
                scope.isWaived = scope.loandetails.repaymentSchedule.totalWaived > 0;
                scope.date.fromDate = new Date(data.timeline.actualDisbursementDate);
                scope.date.toDate = new Date();
                scope.status = data.status.value;
                scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
                scope.decimals = data.currency.decimalPlaces;
                if (scope.loandetails.charges) {
                    scope.charges = scope.loandetails.charges;
                    for (var i in scope.charges) {
                        if (scope.charges[i].paid || scope.charges[i].waived || scope.charges[i].chargeTimeType.value == 'Disbursement' || scope.loandetails.status.value != 'Active') {
                            var actionFlag = true;
                        }
                        else {
                            var actionFlag = false;
                        }
                        scope.charges[i].actionFlag = actionFlag;
                    }

                    scope.chargeTableShow = true;
                }
                else {
                    scope.chargeTableShow = false;
                }

                if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                    scope.choice = true;
                }
                if (data.status.value == "Submitted and pending approval") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.addloancharge",
                            icon: "icon-plus-sign",
                            taskPermissionName: 'CREATE_LOANCHARGE'
                        },
                        {
                            name: "button.approve",
                            icon: "icon-ok",
                            taskPermissionName: 'APPROVE_LOAN'
                        },
                        {
                            name: "button.modifyapplication",
                            icon: "icon-edit",
                            taskPermissionName: 'UPDATE_LOAN'
                        },
                        {
                            name: "button.reject",
                            icon: "icon-remove",
                            taskPermissionName: 'REJECT_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: "button.assignloanofficer",
                                taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                            },
                            {
                                name: "button.withdrawnbyclient",
                                taskPermissionName: 'WITHDRAW_LOAN'
                            },
                            {
                                name: "button.delete",
                                taskPermissionName: 'DELETE_LOAN'
                            },
                            {
                                name: "button.addcollateral",
                                taskPermissionName: 'CREATE_COLLATERAL'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            }
                        ]

                    };
                }

                if (data.status.value == "Approved") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.assignloanofficer",
                            icon: "icon-user",
                            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                        },
                        {
                            name: "button.disburse",
                            icon: "icon-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        },
                        {
                            name: "button.disbursetosavings",
                            icon: "icon-flag",
                            taskPermissionName: 'DISBURSETOSAVINGS_LOAN'
                        },
                        {
                            name: "button.undoapproval",
                            icon: "icon-undo",
                            taskPermissionName: 'APPROVALUNDO_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: "button.addloancharge",
                                taskPermissionName: 'CREATE_LOANCHARGE'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            }
                        ]

                    };
                }

                if (data.status.value == "Active") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.addloancharge",
                            icon: "icon-plus-sign",
                            taskPermissionName: 'CREATE_LOANCHARGE'
                        },
                        {
                            name: "button.makerepayment",
                            icon: "icon-dollar",
                            taskPermissionName: 'REPAYMENT_LOAN'
                        },
                        {
                            name: "button.undodisbursal",
                            icon: "icon-undo",
                            taskPermissionName: 'DISBURSALUNDO_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: "button.waiveinterest",
                                taskPermissionName: 'WAIVEINTERESTPORTION_LOAN'
                            },
                            {
                                name: "button.writeoff",
                                taskPermissionName: 'WRITEOFF_LOAN'
                            },
                            {
                                name: "button.close-rescheduled",
                                taskPermissionName: 'CLOSEASRESCHEDULED_LOAN'
                            },
                            {
                                name: "button.close",
                                taskPermissionName: 'CLOSE_LOAN'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.recoverguarantee",
                                taskPermissionName: 'RECOVERGUARANTEES_LOAN'
                            }
                        ]

                    };

                    if (data.canDisburse) {
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.disburse",
                            icon: "icon-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        });
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.disbursetosavings",
                            icon: "icon-flag",
                            taskPermissionName: 'DISBURSETOSAVINGS_LOAN'
                        });
                    }
                    //loan officer not assigned to loan, below logic
                    //helps to display otherwise not
                    if (!data.loanOfficerName) {
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.assignloanofficer",
                            icon: "icon-user",
                            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                        });
                    }

                    if(scope.recalculateInterest){
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.prepayment",
                            icon: "icon-money",
                            taskPermissionName: 'REPAYMENT_LOAN'
                        });
                    }
                }
                if (data.status.value == "Overpaid") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.transferFunds",
                            icon: "icon-exchange",
                            taskPermissionName: 'CREATE_ACCOUNTTRANSFER'
                        }
                    ]
                    };
                }
                if (data.status.value == "Closed (written off)") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.recoverypayment",
                            icon: "icon-briefcase",
                            taskPermissionName: 'RECOVERYPAYMENT_LOAN'
                        }
                    ]
                    };
                }
            });

            resourceFactory.loanResource.getAllNotes({loanId: routeParams.id,resourceType:'notes'}, function (data) {
                scope.loanNotes = data;
            });

            scope.saveNote = function () {
                resourceFactory.loanResource.save({loanId: routeParams.id, resourceType: 'notes'}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.loanNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            };

            scope.getLoanDocuments = function () {
                resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function (data) {
                    for (var i in data) {
                        var loandocs = {};
                        loandocs = API_VERSION + '/loans/' + data[i].parentEntityId + '/documents/' + data[i].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[i].docUrl = loandocs;
                    }
                    scope.loandocuments = data;
                });

            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_loan'}, function (data) {
                scope.loandatatables = data;
            });

            scope.dataTableChange = function (datatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }

                });
            };

            scope.export = function (parameter) {

                scope.viewLoanReport = true;
                scope.viewTransactionReport = false;
                scope.report = true;
                scope.printbtn = false;
                scope.viewReport = false;
                scope.repaymentscheduleReport=false;

            };



            scope.viewJournalEntries = function(){
                location.path("/searchtransaction/").search({loanId: scope.loandetails.id});
            };

            scope.viewLoanDetails = function () {
                scope.report = false;
                scope.hidePentahoReport = true;
                scope.viewReport = false;
                scope.repaymentscheduleReport=false;
            };

            scope.viewLoanCollateral = function (collateralId){
                location.path('/loan/'+scope.loandetails.id+'/viewcollateral/'+collateralId).search({status:scope.loandetails.status.value});
            };

            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.loandetails.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.loandetails.id);
                }
            };

            scope.viewLoanChargeDetails = function (chargeId) {
                location.path('/loan/'+scope.loandetails.id+'/viewcharge/'+chargeId).search({loanstatus:scope.loandetails.status.value});
            };

            scope.viewprintdetails = function () {
                //scope.printbtn = true;
                scope.repaymentscheduleReport=false;
                scope.report = true;
                scope.viewTransactionReport = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Client Loan Account Schedule");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                scope.startDate = dateFilter(scope.date.fromDate, 'yyyy-MM-dd');
                scope.endDate = dateFilter(scope.date.toDate, 'yyyy-MM-dd');
                var paramName = "R_startDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.startDate)+ "&";
                paramName = "R_endDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.endDate)+ "&";
                paramName = "R_selectLoan";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.loandetails.accountNo);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);
                
            };

            scope.viewloantransactionreceipts = function (transactionId) {
                //scope.printbtn = true;
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewLoanReport = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Loan Transaction Receipt");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                var paramName = "R_transactionId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(transactionId);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

            };
             scope.viewloantransactionjournalentries = function(transactionId){
                var transactionId = "L" + transactionId;
                 if(scope.loandetails.clientId != null && scope.loandetails.clientId != ""){
                     location.path('/viewtransactions/' + transactionId).search({productName: scope.loandetails.loanProductName,loanId:scope.loandetails.id,clientId: scope.loandetails.clientId,
                         accountNo: scope.loandetails.accountNo,clientName: scope.loandetails.clientName});
                 }else{
                     location.path('/viewtransactions/' + transactionId).search({productName: scope.loandetails.loanProductName,loanId:scope.loandetails.id,accountNo: scope.loandetails.accountNo,
                         groupId :scope.loandetails.group.id,groupName :scope.loandetails.group.name});

                 }

            };

            scope.printReport = function () {
                window.print();
                window.close();
            }

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.LoanDocumentResource.delete({loanId: scope.loandetails.id, documentId: documentId}, '', function (data) {
                    scope.loandocuments.splice(index, 1);
                });
            };

            scope.downloadDocument = function (documentId) {

            };
            
            /*scope.transactionSort = {
                column: 'date',
                descending: true
            };    */
            scope.changeTransactionSort = function(column) {
                var sort = scope.transactionSort;
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = true;
                }
            };

            scope.showEdit = function(disbursementDetail){
                if((!disbursementDetail.actualDisbursementDate || disbursementDetail.actualDisbursementDate == null)
                    && scope.status =='Approved'){
                    return true;
                }
                return false;
            };

            scope.showApprovedAmountBasedOnStatus = function () {
                if (scope.status == 'Submitted and pending approval' || scope.status == 'Withdrawn by applicant' || scope.status == 'Rejected') {
                    return false;
                }
                return true;
            };
            scope.showDisbursedAmountBasedOnStatus = function(){
              if(scope.status == 'Submitted and pending approval' ||scope.status == 'Withdrawn by applicant' || scope.status == 'Rejected' ||
                scope.status == 'Approved'){
                  return false;
              }
              return true;
            };

            scope.checkStatus = function(){
                if(scope.status == 'Active' || scope.status == 'Closed (obligations met)' || scope.status == 'Overpaid' ||
                    scope.status == 'Closed (rescheduled)' || scope.status == 'Closed (written off)'){
                    return true;
                }
                return false;
            };

            scope.showAddDeleteTrancheButtons = function(action){
                scope.return = true;
                if(scope.status == 'Closed (obligations met)' || scope.status == 'Overpaid' ||
                    scope.status == 'Closed (rescheduled)' || scope.status == 'Closed (written off)' ||
                    scope.status =='Submitted and pending approval'){
                    scope.return = false;
                }
                scope.totalDisbursedAmount = 0;
                scope.count = 0;
                for(var i in scope.loandetails.disbursementDetails){
                    if(scope.loandetails.disbursementDetails[i].actualDisbursementDate != null){
                        scope.totalDisbursedAmount += scope.loandetails.disbursementDetails[i].principal;
                    }
                    else{
                        scope.count +=  1;
                    }
                }
                if(scope.totalDisbursedAmount == scope.loandetails.approvedPrincipal || scope.return == false){
                    return false;
                }
                if(scope.count == 0 && action == 'deletedisbursedetails'){
                    return false;
                }

                return true;
            };



              // this code for investment from loan side to adding the loan to particular saving investment


                        scope.formDate = {};
                        scope.groups = [];
                        scope.names = [];
                        scope.loans = [];
                        resourceFactory.groupResource.getAllGroups(function (data) {
                            scope.groups = data;
                        });

                       scope.gotoBack = function () {
                           scope.showAddInvestment = true;
                           route.reload();
                       };

                    scope.investedAmountFormDb = null;

                    resourceFactory.loanInvestmentResource.get({loanId: routeParams.id}, function (data) {
                        scope.loanInvestment = data;
                        scope.investedAmountFromDb = data.investedAmount;
                     });


            // following code is for closing the investment

              scope.toClose = function(saving_id, investmentAmount, start_date){
                       $modal.open({
                           templateUrl: 'closeLoanInvestment.html',
                           controller: CloseLoanInvestCtrl
                       });
                       scope.savingId = saving_id;
                       scope.investedAmount = investmentAmount;
                       scope.startDate = new Date(start_date);
                   }

                 var CloseLoanInvestCtrl = function($scope, $modalInstance, $route){
                 $scope.savingId = routeParams.id;
                 $scope.closeInvestmentData = {};
                 $scope.closeInvestmentData.closeDate = new Date();
                 $scope.cancel = function () {
                    $modalInstance.close();
                 };

                 $scope.closeInvestment = function (){
                    $scope.closeInvestmentData.savingId = scope.savingId;
                    $scope.closeInvestmentData.loanId = routeParams.id;
                    var reqDate = dateFilter($scope.closeInvestmentData.closeDate, 'dd MMMM yyyy');
                    $scope.closeInvestmentData.closeDate = reqDate;
                    var sDate = dateFilter(scope.startDate, 'dd MMMM yyyy')
                    $scope.closeInvestmentData.startDate = sDate;
                    resourceFactory.loanInvestmentResourceClose.save({loanId: routeParams.id}, this.closeInvestmentData, function(data){
                       $route.reload();
                    })
                     $modalInstance.close();
                 }
             }

            // following function delete the investment

                    scope.routeToDelete = function (saving_id, investedAmount, start_date) {

                        scope.minimumBalance = null;
                        scope.investedAmount = investedAmount;
                        scope.savingId = saving_id;
                        scope.minimumBalanceRequired=0;
                        scope.temp = 0;

                        scope.deleteInvestment = {};
                        scope.stDate = new Date(start_date);
                        var sttDate = dateFilter(scope.stDate, 'yyyy-MM-dd');
                        scope.startDate = sttDate;
                        scope.deleteInvestment.startDate = scope.startDate;
                        scope.deleteInvestment.savingId = scope.savingId;

                         resourceFactory.loanInvestmentResourceDelete.save({loanId: routeParams.id},
                         this.deleteInvestment,
                         function (data) {
                        route.reload();
                    });
                }


               scope.selectSaving = function (id) {
                   scope.loan = [];
                   resourceFactory.groupAccountResource.get({groupId: id}, function (data) {
                       if (data.savingsAccounts) {
                           scope.names = data.savingsAccounts;
                           for (var i = 0; i < scope.names.length; i++) {
                               scope.name = scope.names[i].productName;
                               scope.acno = scope.names[i].accountNo;
                               scope.fullname = scope.acno + '-' + scope.name;
                               if(scope.names[i].status.value == 'Active')
                               scope.loan.push({productName: scope.fullname, Id: scope.names[i].id});
                           }
                       }
                       else {
                           scope.names = null;
                           scope.loans = null;
                       }
                       scope.loans = scope.loan;
                       for(var i in scope.loans) {
                           if(scope.loans[i].Id == scope.editId) {
                               scope.formData.Ids = scope.loans[i].Id;
                               scope.oldSavingId = scope.formData.Ids;
                           }
                       }
                   });
               };
               scope.loanData = [];
               scope.loanInvestment = [];
               scope.loanDetailsForInvestment = [];
               resourceFactory.loanInvestmentResource.get({loanId: routeParams.id}, function (data) {
                   scope.loanInvestment = data;

                   resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all',exclude: 'guarantors'}, function (data) {
                       scope.loanDetailsForInvestment = data;

                       if(scope.loanInvestment != null){
                           //following code for color coding for investment tracker

                           var sum = 0;
                           scope.isAmountInvested = false;

                           for (var i in scope.loanInvestment) {
                               if (scope.loanInvestment[i].investedAmount) {
                                   sum = sum + parseInt(scope.loanInvestment[i].investedAmount);
                                   scope.isAmountInvested = true;
                               }
                           }

                           if(sum > 0) {
                               if ((sum < scope.loanDetailsForInvestment.principal) && (scope.isAmountInvested == true)) {
                                   scope.notFullAmountInvested = true;
                               }
                               else if ((sum == scope.loanDetailsForInvestment.principal) && (scope.isAmountInvested == true)) {
                                   scope.fullAmountInvested = true;
                               }
                           }
                       }

                   });


               });

            // following function will add the investment and once it add the minimum required balance of invester is getting increase

              scope.addInvestment = function (Id) {
                  scope.ifNoFunds = false;
                  scope.lessloanamount = false;
                  scope.accountexists = false;
                  scope.enterInvestmentAmount = false;

                      resourceFactory.savingsResource.get({
                          accountId: scope.formData.Id,
                          associations: 'all'
                      }, function (data) {
                          scope.savingData = data;
                          scope.minimumBalanceRequired = scope.savingData.minRequiredBalance;
                          var check = 0;

                          resourceFactory.savingsInvestmentResource.get({savingId: scope.savingData.id},function (data) {

                              scope.savingsInvestment = data;
                              for (var i in scope.savingsInvestment) {
                                  if (scope.savingsInvestment[i].investedAmount) {
                                      check = check + parseInt(scope.savingsInvestment[i].investedAmount);
                                  }
                              }
                              var sum = 0;

                              for (var i in scope.loanInvestment) {
                                  if (scope.loanInvestment[i].investedAmount) {
                                      sum = sum + parseInt(scope.loanInvestment[i].investedAmount);
                                  }
                              }

                              if(scope.formData.investedAmount <= (scope.savingData.summary.accountBalance - scope.minimumBalanceRequired)
                                  || scope.minimumBalanceRequired == null) {
                                  if (scope.formData.investedAmount <= scope.loandetails.principal - sum) {

                                      if (scope.loanInvestment.length == 0) {
                                          scope.loanInvestment.push({
                                              name: scope.savingData.groupName,
                                              productname: scope.savingData.savingsProductName,
                                              accountno: scope.savingData.accountNo,
                                              savingamount: scope.savingData.summary.accountBalance,
                                              saving_id: scope.savingData.id,
                                              investedAmount: scope.formData.investedAmount,
                                              startDate: scope.formData.startDate
                                          });
                                      }
                                      else {
                                          var count = 0;
                                          for (var i = 0; i < scope.loanInvestment.length; i++) {
                                             if(scope.loanInvestment[i].startDate == scope.formData.startDate) {
                                                 if (scope.loanInvestment[i].saving_id == scope.savingData.id) {
                                                     count++;
                                                     scope.accountexists = true;
                                                 }
                                             }
                                          }
                                          if (count == 0) {
                                              scope.loanInvestment.push({
                                                  name: scope.savingData.groupName,
                                                  productname: scope.savingData.savingsProductName,
                                                  accountno: scope.savingData.accountNo,
                                                  savingamount: scope.savingData.summary.accountBalance,
                                                  saving_id: scope.savingData.id,
                                                  investedAmount: scope.formData.investedAmount,
                                                  startDate: scope.formData.startDate
                                              });
                                          }
                                      }
                                  }
                                  else {

                                      if(scope.formData.investedAmount == null || scope.formData.investedAmount == 0 ){
                                          scope.enterInvestmentAmount = true;
                                      }
                                      else{
                                          scope.lessloanamount = true;
                                      }

                                  }
                              }
                              else{
                                  scope.ifNoFunds = true;

                              }
                          });
                      });

                };

            scope.UpdateData = function(){
                scope.sDate = new Date(this.formData.startDate);
                scope.startDateForUpdate = dateFilter(scope.sDate, 'yyyy-MM-dd');
                resourceFactory.loanInvestmentResource.update({loanId: routeParams.id, savingId: this.formData.Ids, oldSavingId: this.oldSavingId,oldAmount: this.oldAmount,
                     investedAmounts: this.formData.investedAmounts,
                     startDate: scope.startDateForUpdate}, function (data) {
                    scope.changes = data;
                    route.reload();
                });
            }



                scope.submitData = function () {
                    scope.savingId = [];
                    scope.investedAmounts = [];
                    scope.startDate = [];
                    scope.savingData =[];


                    for (var i = 0; i < scope.loanInvestment.length; i++) {
                        scope.savingId.push(scope.loanInvestment[i].saving_id);
                        scope.investedAmounts.push(scope.loanInvestment[i].investedAmount);

                        scope.sDate = new Date(this.loanInvestment[i].startDate);
                        var investmentStartDate = dateFilter(scope.sDate,scope.df);
                        scope.startDate.push(investmentStartDate);

                    }

                   /* for(var i=0; i<scope.savingId; i++){


                        scope.minimumBalance = null;

                        scope.id = scope.savingId[i];
                        scope.amountIndex = i;
                        scope.minimumBalanceRequired=0;
                        scope.temp = 0;

                        resourceFactory.savingsResource.get({accountId: scope.id, associations: 'all'}, function (data) {
                            scope.savingData = data;
                            scope.updateSavingJson={};
                            scope.updateSavingJson.locale = scope.optlang.code;

                            scope.temp = scope.savingData.minRequiredBalance + scope.investedAmounts[ scope.amountIndex];

                            scope.updateSavingJson.minRequiredBalance = scope.temp;
                            resourceFactory.savingsResource.update({'accountId':  scope.id},scope.updateSavingJson, function (data){
                                //  location.path('/viewsavingaccount/' + routeParams.id);
                            })

                        })


                    }
*/
                    scope.loanId = routeParams.id;
                    resourceFactory.loanInvestmentResource.save({
                        savingId: this.savingId,
                        loanId: this.loanId,
                        investedAmounts: this.investedAmounts,
                        startDate: this.startDate
                    }, function (data) {
                        scope.showAddInvestment = true;
                        route.reload();
                    });
            };

            scope.viewrepaymentScheduledetails = function () {
                scope.repaymentscheduleReport=true;
                scope.report = true;
                scope.viewTransactionReport = false;
                scope.viewReport = true;
               // scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Loan Repayment schedule");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                var  paramName = "R_selectLoan";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.loandetails.accountNo);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetail = $sce.trustAsResourceUrl(scope.baseURL);

            };
        }
    });

    mifosX.ng.application.controller('ViewLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$modal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ViewLoanDetailsController]).run(function ($log) {
        $log.info("ViewLoanDetailsController initialized");
    });
}(mifosX.controllers || {}));
