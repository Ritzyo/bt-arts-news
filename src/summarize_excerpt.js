document.getElementById("summarize-excerpt-button").addEventListener("click", summarize_excerpt);

// window.onload = function() {
//     summarize_excerpt();
//     console.log("!!! page loaded !!!");
// };

let data;

async function summarize_excerpt() {
    console.log("summarize_excerpt() called");

    const excerpt = document.getElementById("textBox").value.trim();
    console.log("Excerpt content:", excerpt);

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    };

    try {
        // code for predicting bias of article using Flask endpoint (app.py)

        var flaskEndpoint = 'http://127.0.0.1:5000/predict-bias?article=' + encodeURIComponent(excerpt);
            
        fetch(flaskEndpoint)
        .then(response => response.json())
        .then(data => {

            // window.location.href = "summarize.html?demPerc=" + encodeURIComponent(data.dem_percentage) + "&repPerc=" + encodeURIComponent(data.rep_percentage);

            var demPerc = data.dem_percentage;
            var repPerc = data.rep_percentage;
    
            if (demPerc > repPerc) {
                document.getElementById("prediction").innerHTML = ((demPerc-0.50)*100).toFixed(2) + "% more Democratic";
            }
            else {
                document.getElementById("prediction").innerHTML = ((repPerc-0.50)*100).toFixed(2) + "% more Republican";
            }
        })
        .catch(error => {
            console.log(error)
        });

        // end code for bias

        const huggingfaceResponse = await query({ "inputs": excerpt });
        console.log("Huggingface API Response:", huggingfaceResponse);

        if (Array.isArray(huggingfaceResponse) && huggingfaceResponse.length > 0) {
            const firstObject = huggingfaceResponse[0];

            // Access the "summary_text" property directly
            const summaryText = firstObject.summary_text;

            console.log("Content of first object:", firstObject);
            console.log("Summary text:", summaryText);

            // Update the following line to set the summary in the 'summary' div
            // window.location.href += "&summaryText=" + encodeURIComponent(summaryText);
            document.getElementById("summarys").innerHTML = summaryText;
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Define response in the catch block
        const response = error.response || {};
        console.error("Response status:", response.status);
        console.error("Response text:", await response.text());
        throw error;
    }
}