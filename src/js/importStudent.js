import { showLoader, hideLoader } from "./main.js";
import { showAjaxMessage } from "./main.js";

const token = document.querySelector('meta[name="csrf-token"]').content;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("students_import_form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        showLoader();

        fetch(form.action, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": token,
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to submit import request.");
                }
                return res.json();
            })
            .then((data) => {
                const resMessage = data.message;
                let fullMessage = `<p>${resMessage}</p>`;

                if (data.errors && data.errors.length > 0) {
                    fullMessage += "<ul>";
                    data.errors.forEach((err) => {
                        fullMessage += `<li>${err}</li>`;
                    });
                    fullMessage += "</ul>";
                }

                if (data.download_url) {
                    fullMessage += `<a href="${data.download_url}" class="btn btn-sm btn-warning mt-2" target="_blank">Download Error Rows Excel</a>`;
                }

                // Show message with HTML
                showAjaxMessage(fullMessage, "success", 15000);

                // Refresh students list
                return fetch("/students", {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                })
                    .then((res) => {
                        if (!res.ok)
                            throw new Error("Failed to load students page");
                        return res.text();
                    })
                    .then((html) => {
                        document.getElementById("main-content").innerHTML =
                            html;
                        history.pushState(null, "", "/students");
                    });
            })

            .catch((error) => {
                alert("⚠️ " + error.message);
            })
            .finally(() => {
                hideLoader();
            });
    });
});
