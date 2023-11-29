document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the button when the DOM is ready
    document.getElementById("myButton").addEventListener("click", summarize);
});
let data;

async function summarize() {
    console.log("Button clicked");

    const textareaContent = document.getElementById("summarys").value;
    console.log("Textarea content:", textareaContent);
    const article = textareaContent.trim();
    console.log("Article content:", article);

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    };

    try {
        const simulatedResponse = new Response(textareaContent, { headers, status: 200 });
        data = textareaContent;

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const articleArray = Array.from(doc.querySelectorAll("p")).map(
            (p) => p.textContent
        );

        const huggingfaceResponse = await query({ "inputs": article });
        console.log("Huggingface API Response:", huggingfaceResponse);

        if (Array.isArray(huggingfaceResponse) && huggingfaceResponse.length > 0) {
            const firstObject = huggingfaceResponse[0];

            // Access the "summary_text" property directly
            const summaryText = firstObject.summary_text;

            console.log("Content of first object:", firstObject);
            console.log("Summary text:", summaryText);

            // Update the following line to set the summary in the 'summary' div
            const summaryElement = document.getElementById("summarys");
            document.getElementById("summarys").innerHTML = summaryText;
            window.location.href = "summarize.html?summaryText=" + encodeURIComponent(summaryText);


            return summaryText;

            // Redirect to "summarize.html" after setting the summary
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

// Export the summarize function directly
export { summarize };