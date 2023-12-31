document.getElementById("secondButton").addEventListener("click", summarizer);

async function summarizer() {
    let url;
    let title;
    let data;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        url = tabs[0].url;
        title = tabs[0].title;
    });
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
                headers: {
                    Authorization:
                        "Bearer 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",
                },
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
            console.log("Article title: " + title);

            document.getElementById("summarys").innerHTML = summaryText;
            document.getElementById("title2").textContent = "Article: " + title;
            window.location.href =
                "summarize.html?summaryText=" + encodeURIComponent(summaryText);
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}
