document.addEventListener("DOMContentLoaded", function() {
    var copyButton = document.getElementById("copyButton");

    if (copyButton) {
        copyButton.addEventListener("click", function() {
            var copyText = document.getElementById("summarys");

            if (copyText) {
                var range = document.createRange();
                range.selectNode(copyText);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);

                document.execCommand("copy");

                window.getSelection().removeAllRanges();

                alert("Copied the text: " + copyText.innerText);
            } else {
                console.error("Element with ID 'summarys' not found.");
            }
        });
    } else {
        console.error("Element with ID 'copyButton' not found.");
    }
});