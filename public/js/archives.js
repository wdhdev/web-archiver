const tableBody = document.getElementById("archives-body");

function loadArchives() {
    fetch(`/api/archives`, {
        method: "GET"
    }).then(res => res.json()).then(data => {
        data.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

        data.forEach(archive => {
            let row = tableBody.insertRow(-1);

            let c1 = row.insertCell(0);
            let c2 = row.insertCell(1);
            let c3 = row.insertCell(2);

            c1.classList = "px-4 py-2 outline outline-1 outline-gray-700";
            c2.classList = "px-4 py-2 outline outline-1 outline-gray-700";
            c3.classList = "px-4 py-2 outline outline-1 outline-gray-700";

            c1.innerText = moment.unix(archive.timestamp / 1000).format("Do MMMM YYYY, h:mm:ss a");
            c2.innerHTML = `<a href="${archive.uuid}" class="font-semibold text-blue-600 hover:text-blue-700">${archive.uuid}</a>`;
            c3.innerHTML = `<a href="${archive.website}" class="text-gray-400 underline underline-2 hover:no-underline">${archive.website}</a>`;
        })
    })
}

loadArchives();