const form = document.getElementById("archive");
const password = document.getElementById("password");
const url = document.getElementById("url");
const btn = document.getElementById("btn");

async function submitForm() {
    event.preventDefault();

    btn.setAttribute("disabled", true);
    btn.innerHTML = "Archiving...";

    fetch("/api/archive", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            password: password.value
        },
        body: JSON.stringify({
            url: url.value
        })
    }).then((res) => res.json()).then((data) => {
        form.reset();
        form.className += " hidden";

        btn.setAttribute("disabled", false);
        btn.innerHTML = "Archive";

        if(data.code !== "WEBSITE_ARCHIVED") alert(data.message);

        if(data.code === "WEBSITE_ARCHIVED") {
            document.getElementById("success").removeAttribute("class", "hidden");
            document.getElementById("success-url").innerHTML = `<a class="text-blue-600 hover:text-blue-700 underline underline-2 hover:no-underline" href="/archive/${data.uuid}">${data.uuid}</a>`;
        } else {
            document.getElementById("error").removeAttribute("class", "hidden");
            document.getElementById("error-message").innerHTML = data.message || "An error occurred";
        }
    })
}