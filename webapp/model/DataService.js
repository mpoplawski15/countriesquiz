sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
    "use strict";

    return {
        sBaseUrl: "",
        

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
            return fetch(`${this.sBaseUrl}/saveScore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        }
    };
});