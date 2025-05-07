sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
    "use strict";

    return {
        sBaseUrl: "",

        init() {
            // Check if we're running in production by examining the URL
            const hostname = window.location.hostname;

            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                // Running locally
                console.log('Using local URL');
                this.sBaseUrl = "http://localhost:3300/api";
            } else {
                // Running in production (Railway)
                console.log('Using production URL');
                this.sBaseUrl = "https://countriesquizserver-production.up.railway.app/api"; 
            }
        },

        fetchRankingData: function () {
            return new Promise((resolve, reject) => {
                fetch(this.sBaseUrl + '/scores')
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
            return fetch(`${this.sBaseUrl}/scores`, {
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