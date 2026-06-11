const form = document.getElementById("supportForm");

form.addEventListener("submit", function(event){

    event.preventDefault();

    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let concern = document.getElementById("concern").value.toLowerCase();

    let symptoms = [];

    if(concern.includes("fever")){
        symptoms.push("Fever");
    }

    if(concern.includes("headache")){
        symptoms.push("Headache");
    }

    if(concern.includes("cough")){
        symptoms.push("Cough");
    }

    if(concern.includes("cold")){
        symptoms.push("Cold");
    }

    if(concern.includes("vomiting")){
        symptoms.push("Vomiting");
    }

    if(concern.includes("dizziness")){
        symptoms.push("Dizziness");
    }

    if(concern.includes("chest pain")){
        symptoms.push("Chest Pain");
    }

    if(concern.includes("breathing")){
        symptoms.push("Breathing Difficulty");
    }

    if(concern.includes("fatigue")){
        symptoms.push("Fatigue");
    }

    let priority = "Low";

    if(
        concern.includes("chest pain") ||
        concern.includes("breathing")
    ){
        priority = "High";
    }
    else if(symptoms.length >= 2){
        priority = "Medium";
    }

    let volunteerSupport = "Not Required";
    let healthTip = "Stay hydrated and monitor your symptoms.";

    if(priority === "Medium" || priority === "High"){
        volunteerSupport = "Recommended";
    }

    let priorityClass = "";

    if(priority === "High"){
        priorityClass = "high";
    }
    else if(priority === "Medium"){
        priorityClass = "medium";
    }
    else{
        priorityClass = "low";
    }

    if(concern.includes("fever")){
    healthTip = "Drink plenty of fluids and get adequate rest.";
}

if(concern.includes("headache")){
    healthTip = "Rest in a quiet place and stay hydrated.";
}

if(concern.includes("cough")){
    healthTip = "Drink warm fluids and monitor breathing difficulties.";
}

if(concern.includes("chest pain")){
    healthTip = "Seek immediate medical attention.";
}

if(concern.includes("breathing")){
    healthTip = "Consult a healthcare professional as soon as possible.";
}

    let currentDate = new Date().toLocaleString();

    document.getElementById("result").innerHTML = `
    <div class="summary-card">

        <h2>📋 Case Summary</h2>

        <p>
            <strong>Generated On:</strong>
            ${currentDate}
        </p>

        <p>
            <strong>Patient:</strong>
            ${name}
        </p>

        <p>
            <strong>Location:</strong>
            ${location}
        </p>

        <p>
            <strong>Detected Symptoms:</strong>
            ${symptoms.length ? symptoms.join(", ") : "No major symptoms detected"}
        </p>

        <p>
            <strong>Priority:</strong>
            <span class="${priorityClass}">
                ${priority}
            </span>
        </p>

        <p>
            <strong>Volunteer Support:</strong>
            ${volunteerSupport}
        </p>

        <p>
            <strong>Health Tip:</strong>
            ${healthTip}
        </p>

        <p>
            <strong>Recommendation:</strong>
            Follow-up support suggested.
        </p>

        <button id="downloadBtn">
            Download Report
        </button>

    </div>
    `;

    const downloadBtn = document.getElementById("downloadBtn");

    downloadBtn.addEventListener("click", function(){

        const report = `
Healthcare Support Report

Generated On:
${currentDate}

Patient:
${name}

Location:
${location}

Detected Symptoms:
${symptoms.length ? symptoms.join(", ") : "No major symptoms detected"}

Priority:
${priority}

Volunteer Support:
${volunteerSupport}

Recommendation:
Follow-up support suggested.
`;

        const blob = new Blob([report], { type: "text/plain" });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "Healthcare_Report.txt";

        link.click();
    });

});

const askBtn = document.getElementById("askBtn");
const chatBody = document.getElementById("aiResponse");

askBtn.addEventListener("click", async function () {

    const question = document.getElementById("userQuestion").value;

    if(question.trim() === ""){
        return;
    }

    chatBody.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;

    document.getElementById("userQuestion").value = "";

    chatBody.innerHTML += `
        <div class="bot-message" id="typing">
            🤖 Typing...
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_GEMINI_API_KEY",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a healthcare support assistant for an NGO.

Keep answers under 100 words.
Use simple language.
Use bullet points when useful.

User Question:
${question}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        document.getElementById("typing")?.remove();

        if (!data.candidates) {

            chatBody.innerHTML += `
                <div class="bot-message">
                    AI service temporarily unavailable.
                </div>
            `;

            return;
        }

        const answer =
            data.candidates[0].content.parts[0].text;

        chatBody.innerHTML += `
            <div class="bot-message">
                ${answer}
            </div>
        `;

        chatBody.scrollTo({
    top: chatBody.scrollHeight,
    behavior: "smooth"
});

    }
    catch(error){

        document.getElementById("typing")?.remove();

        chatBody.innerHTML += `
            <div class="bot-message">
                Unable to generate response.
            </div>
        `;

        console.log(error);
    }

});

const chatIcon = document.getElementById("chatIcon");
const chatContainer = document.getElementById("chatContainer");

chatIcon.addEventListener("click", function(){

    if(chatContainer.style.display === "block"){
        chatContainer.style.display = "none";
    }
    else{
        chatContainer.style.display = "block";
    }

});