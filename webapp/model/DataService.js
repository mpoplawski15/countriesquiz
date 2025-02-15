sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
    "use strict";

    return {
        sBaseUrl: "http://localhost:3300",
        

        fetchRankingData: function () {
            return new Promise((resolve, reject) => {
                fetch(this.sBaseUrl + '/getAllScores')
                    .then(response => response.json())
                    .then(data => {
                        const model = new JSONModel(data);
                        resolve(model);
                    })
                    .catch(error => {
                        console.error("Error fetching data:", error);
                        reject(error);
                    });
            });
        },

        saveData: function (data) {
            return fetch(`${this.baseUrl}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json());
        }
    };
});