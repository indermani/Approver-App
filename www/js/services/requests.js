angular
    .module('ApproverApp')
    .factory('RequestFactory', RequestFactory);

RequestFactory.$inject = ['$http', 'ServerUrl', 'SettingsFactory'];

function RequestFactory($http, ServerUrl, SettingsFactory) {
    return {
        getReuqests: getReuqests,
        getRequest: getRequest,
        updateStatus: updateStatus
    };

    function getReuqests(query) {
        return $http.get(ServerUrl + 'request?' + $.param(query)).then(
            function (data) {
                angular.forEach(data.data, function (r) {
                    r.data = JSON.parse(JSON.parse(r.uploadedData).body.data);
                });
                return data.data;
            });
    }

    function getRequest(requestId) {
        return $http.get(ServerUrl + 'request/' + requestId + '/').then(
            function (data) {
                data.data.data = JSON.parse(JSON.parse(data.data.uploadedData).body.data);
                return data.data;
            });
    }

    function updateStatus(requestId, docstatus, approvedData) {
        // Get raw data
        getRequest(requestId).then(function (request) {
            // Drill down to data part
            request = JSON.parse(request.uploadedData);
            request_body = request.body;

            // Update
            request_body.data = JSON.stringify(approvedData);
            request_body.sid = SettingsFactory.getSid();

            //Recreate request
            request.body = request_body;
            approvedData = JSON.stringify(request);

            console.log(approvedData);

            return $http.put(ServerUrl + 'request/' + requestId + '/', {
                docstatus: docstatus,
                approvedData: approvedData
            }).then(
                function (data) {
                    console.log(data.data);
                });
            alert(requestId + '\n' + docstatus + '\n' + JSON.stringify(approvedData));

        });

    }
}
