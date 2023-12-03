document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.getElementById("backButton");

    if (backButton) {
        backButton.addEventListener("click", goBackToPopup);
    } else {
        console.error("Element with ID 'backButton' not found.");
    }
});

function goBackToPopup() {
    // Use the browser's history API to navigate back
    window.history.back();
}