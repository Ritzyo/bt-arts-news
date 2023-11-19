document.getElementById("myButton").addEventListener("click", summarize);
let data;

async function summarize() {
    const url = "https://www.foxnews.com/live-news/hamas-attack-israel-war";
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
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer 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",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: article }),
            }
        );

        const result = await huggingfaceResponse.json();
        console.log(result);
        document.getElementById("summary").innerHTML = JSON.stringify(result);
        return JSON.stringify(result);
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
}

document.getElementById("myButton").addEventListener("click", function () {
    // Change "newpage.html" to the URL of the page you want to redirect to
    window.location.href = "summarize.html";
});
