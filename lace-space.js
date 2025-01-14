"use strict";

$(document).ready(() => {
    const loadShoes = () => {
        const savedShoes = JSON.parse(localStorage.getItem("myShoes")) || [];
        let displayText = savedShoes
            .map(shoe => {
                const lastUpdated = new Date(shoe.lastUpdated).toLocaleString();
                return `* ${shoe.name} - ${shoe.mileage} miles - Last updated: ${lastUpdated}`;
            })
            .join("<br>");
        
        if (displayText === "") {
            displayText = "No shoes tracked yet. Add a shoe to get started.";
        }

        $("#shoes_list").html(displayText);
    };

    const checkMileageAlert = (shoes) => {
        let shoesToRemove = [];

        shoes.forEach(shoe => {
            if (shoe.mileage >= 450) {
                const confirmRemoval = confirm(
                    `The shoe "${shoe.name}" has reached ${shoe.mileage} miles. Would you like to remove it?`
                );
                if (confirmRemoval) {
                    shoesToRemove.push(shoe.name);
                }
            }
        });

        if (shoesToRemove.length > 0) {
            const remainingShoes = shoes.filter(shoe => !shoesToRemove.includes(shoe.name));
            localStorage.setItem("myShoes", JSON.stringify(remainingShoes));
        }
    };

    $("#save_shoes").click(() => {
        const shoeName = $("#shoe").val().trim().toLowerCase();
        const mileage = $("#miles").val();

        if (shoeName === "") {
            alert("Please enter a shoe name.");
            $("#shoe").focus();
            return;
        }
        if (mileage === "" || isNaN(mileage) || mileage < 0) {
            alert("Please enter valid miles.");
            $("#miles").focus();
            return;
        }

        const shoes = JSON.parse(localStorage.getItem("myShoes")) || [];
        const todayISO = new Date().toLocaleString();

        const existingShoe = shoes.find(shoe => shoe.name === shoeName);
        if (existingShoe) {
            existingShoe.mileage += parseFloat(mileage);
            existingShoe.lastUpdated = todayISO;
        } else {
            shoes.push({
                name: shoeName,
                mileage: parseFloat(mileage),
                lastUpdated: todayISO
            });
        }

        localStorage.setItem("myShoes", JSON.stringify(shoes));
        checkMileageAlert(shoes);

        $("#shoe").val("");
        $("#miles").val("");

        loadShoes();
    });

    $("#clear_shoes").click(() => {
        localStorage.removeItem("myShoes");
        $("#shoes_list").text("No shoes tracked yet. Add a shoe to get started.");
        $("#shoe").focus();
    });

    loadShoes();
    $("#shoe").focus();
});
