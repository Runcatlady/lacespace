"use strict";

$(document).ready(() => {
    const loadShoes = () => {
        const savedShoes = JSON.parse(localStorage.getItem("myShoes")) || [];
        const shoesListElement = $("#shoes_list");
    
        // Clear the container before appending new entries
        shoesListElement.html("");
    
        if (savedShoes.length === 0) {
            shoesListElement.html("<p>No shoes tracked yet. Add a shoe to get started.</p>");
            return;
        }
    
        savedShoes.forEach((shoe, index) => {
            const lastUpdated = new Date(shoe.lastUpdated).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).replace(/AM|PM/, match => match.toLowerCase());
    
            // Create a new paragraph element with the delete icon and text
            const shoeEntry = `
                <p>
                    <i class="fa-solid fa-delete-left fa-rotate-180 fa-2sm" 
                       style="color: #dc0425; margin-right: 5px; cursor: pointer;" 
                       data-index="${index}"></i>
                    ${shoe.name} - ${shoe.mileage} miles - Last updated: ${lastUpdated}
                </p>
            `;
    
            // Append the new entry to the container
            shoesListElement.append(shoeEntry);
        });
    
        // Attach click event listener to the delete icons
        $(".fa-delete-left").click(function () {
            const shoeIndex = $(this).data("index");
            removeShoe(shoeIndex);
        });
    };
    
    const removeShoe = (index) => {
        const shoes = JSON.parse(localStorage.getItem("myShoes")) || [];
        shoes.splice(index, 1); // Remove the shoe at the specified index
        localStorage.setItem("myShoes", JSON.stringify(shoes)); // Update localStorage
        loadShoes(); // Refresh the list
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
        const shoeName = $("#shoe").val().trim().toUpperCase();
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
