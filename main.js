"use strict";

const url = "http://127.0.0.1:3000/experiences";

window.onload = init();

async function init() {
    const container = document.getElementById("xp-container");
    container.innerHTML = "";

    const experiences = await getData();
    if (experiences) render(experiences, container);
    else sendMessage("No work experiences found.", true)
}

async function getData() {
    const response = await fetch(url);
    return response.ok ? await response.json() : undefined;
}

function render(xps, container) {
    xps.forEach((xp) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="xp-1">
                <div class="xp-1-1">
                    <h2>${xp.companyname}</h2>
                    <h3>${xp.jobtitle}</h3>
                    <h4>${xp.location}</h4>
                </div>
            </div>
        `;

        if (xp.description) {
            div.innerHTML += `
            <div class="xp-2">
                <p><strong>Kommentar:</strong><br>${xp.description}</p>
            </div>
            `;
        }

        const deleteBtn = document.createElement("button");
        const deleteText = document.createTextNode("TA BORT");
        deleteBtn.appendChild(deleteText);
        deleteBtn.addEventListener("click", () => deleteExperience(xp._id));

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

async function deleteExperience(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "Application/json"
            }
        });
        validateResponse(response);
        init();
    } catch (err) {
        console.error(err);
    }
}

function sendMessage(message, error) {
    const container = document.getElementById("message");
    container.classList.add(error ? "error" : "success");
    container.innerHTML = `
        <p>${message}</p>
    `;
    container.style.display = "flex";

    setTimeout(() => {
        container.innerHTML = "";
        container.style.display = "none";
    }, "3000");
}

async function validateResponse(res) {
    if (res.ok) return;
    try {
        const data = await res.json();
        console.error(`Received status ${res.status}: ${data.message ?? "[No message]"}`);
        sendMessage(data.message, true);
    } catch (err) {
        console.error(err);
    }
}