document.addEventListener('DOMContentLoaded', function () {
    // Get the value from the source element
    var sourceValue = document.getElementById('textBox').innerHTML;

    console.log("sourceValue:", sourceValue);
    // Set the value in the destination element
    try {
        var t = document.getElementById('copyTextBox');
        t.innerHTML = sourceValue;
    } catch (error) {
        console.log(error);
    }
});