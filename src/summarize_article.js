// document.getElementById("summarize-article-button").addEventListener("click", summarize_article);

window.onload = function() {
    summarize_article();
    console.log("!!! page loaded !!!");
};

async function summarize_article() {
    console.log("summarize_article() called");
    try {
        let url;
        const tabs = await new Promise((resolve) => {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                resolve(tabs);
            });
        });

        if (tabs && tabs.length > 0) {
            url = tabs[0].url;
            title = tabs[0].title;

            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            };

            const response = await fetch(url, { headers });

            const data = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const articleArray = Array.from(doc.querySelectorAll("p")).map(
                (p) => p.textContent
            );

            excerpt = document.getElementById('copyTextBox').innerHTML;
            const article = (excerpt.length > 25) ? excerpt : articleArray.join(" ");
            console.log("Article:", article);

            document.getElementById('copyTextBox').innerHTML = document.getElementById('copyTextBox').innerHTML + " ";
            console.log("copyTextBox:", document.getElementById('copyTextBox').innerHTML);
            if (document.getElementById('copyTextBox').innerHTML == "  ") {
                // take the middle 50% of article
                var articleLength = article.length;
                var middle = Math.floor(articleLength/2);
                var quarter = Math.floor(middle/2);
                var start = quarter;
                var end = middle + quarter;
                article = article.substring(start, end);
            }

            // code for predicting bias of article using Flask endpoint (app.py)

            var flaskEndpoint = 'http://127.0.0.1:5000/predict-bias?article=' + encodeURIComponent(article);

            fetch(flaskEndpoint)
            .then(response => response.json())
            .then(data => {

                // window.location.href = "summarize.html?demPerc=" + encodeURIComponent(data.dem_percentage) + "&repPerc=" + encodeURIComponent(data.rep_percentage);

                var demPerc = data.dem_percentage;
                var repPerc = data.rep_percentage;

                console.log("demPerc:", demPerc);
                console.log("repPerc:", repPerc);
        
                if (demPerc > repPerc) {
                    document.getElementById("prediction").innerHTML = ((demPerc-0.50)*200).toFixed(2) + "% towards Democratic";
                }
                else {
                    document.getElementById("prediction").innerHTML = ((repPerc-0.50)*200).toFixed(2) + "% towards Republican";
                }
            })
            .catch(error => {
                console.log(error)
            });

            // end code for bias

            const huggingfaceResponse = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: { Authorization: "Bearer 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" },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: article,
                        options: { max_length: 10000, min_length: 100, num_beams: 3 },
                    }),
                }
            );

            const result = await huggingfaceResponse.json();
            console.log(result);

            if (Array.isArray(result) && result.length > 0) {
                const firstObject = result[0];
                const summaryText = firstObject.summary_text;

                document.getElementById("summarys").innerHTML = summaryText;
                // window.location.href += "&summaryText=" + encodeURIComponent(summaryText);
            }
        } else {
            console.log("No active tabs found");
        }
    } catch (error) {
        console.log("Error fetching or processing data:", error);
    }
}

// document.getElementById("secondButton").addEventListener("click", summarizer);

// async function summarizer() {
//     let url;
//     let title;
//     let data;
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//         url = tabs[0].url;
//         title = tabs[0].title;
//     });
//     const headers = {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//     };

//     try {
//         const response = await fetch(url, { headers });
//         if (!response.ok) {
//             throw new Error(`Network response was not ok: ${response.status}`);
//         }

//         data = await response.text();

//         const parser = new DOMParser();
//         const doc = parser.parseFromString(data, "text/html");
//         const articleArray = Array.from(doc.querySelectorAll("p")).map(
//             (p) => p.textContent
//         );
//         const article = articleArray.join(" ");

//         const huggingfaceResponse = await fetch(
//             "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
//             {
//                 headers: {
//                     Authorization:
//                         "Bearer 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",
//                 },
//                 method: "POST",
//                 body: JSON.stringify(article),
//             }
//         );

//         const result = await huggingfaceResponse.json();
//         console.log(result);
//         if (Array.isArray(result) && result.length > 0) {
//             const firstObject = result[0];

//             // Access the "summary_text" property directly
//             const summaryText = firstObject.summary_text;

//             console.log("Content of first object:", firstObject);
//             console.log("Summary text:", summaryText);
//             console.log("Article title: " + title);

//             document.getElementById("summarys").innerHTML = summaryText;
//             document.getElementById("title2").textContent = "Article: " + title;
//             window.location.href =
//                 "summarize.html?summaryText=" + encodeURIComponent(summaryText);
//         }
//     } catch (error) {
//         console.error("Error fetching or processing data:", error);
//     }
// }