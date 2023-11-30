document.addEventListener('DOMContentLoaded', function() {
    // Get the summaryText parameter from the URL
    var urlParams = new URLSearchParams(window.location.search);
    var summaryText = urlParams.get('summaryText');

    // Set the summary text to the element with id "summarys"
    document.getElementById("summarys").innerHTML = summaryText;
});

