document.addEventListener('DOMContentLoaded', function() {
    update_prediction();
});

async function update_prediction() {
    var urlParams = new URLSearchParams(window.location.search);
    try {
        var demPerc = urlParams.get('demPerc');
        var repPerc = urlParams.get('repPerc');

        if (demPerc > repPerc) {
            document.getElementById("prediction").innerHTML = ((demPerc-0.50)*100).toFixed(2) + "% more Democratic";
        }
        else {
            document.getElementById("prediction").innerHTML = ((repPerc-0.50)*100).toFixed(2) + "% more Republican";
        }
    } catch (error) {
        console.log(error);
    }
}

export { update_prediction };