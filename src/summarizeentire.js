document.getElementById("secondButton").addEventListener("click", summarizer);
let data;

async function summarizer() {
    const url = "https://www.foxnews.com/politics/us-china-space-race-moon-mining-heats-up";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        data = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const articleArray = Array.from(doc.querySelectorAll("p")).map(
            (p) => p.textContent
        );

        const article = articleArray.join(" ");

        const huggingfaceResponse = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: { Authorization: "Bearer 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" },
                    method: "POST",
                    body: JSON.stringify(article),
                }
            );

        const result = await huggingfaceResponse.json();
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
            const firstObject = result[0];

            // Access the "summary_text" property directly
            const summaryText = firstObject.summary_text;

            console.log("Content of first object:", firstObject);
            console.log("Summary text:", summaryText);

            // Update the following line to set the summary in the 'summary' div
            const summaryElement = document.getElementById("summarys");
            document.getElementById("summarys").innerHTML = summaryText;
            window.location.href = "summarize.html?summaryText=" + encodeURIComponent(summaryText);
        }

    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

