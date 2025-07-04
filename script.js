function fetchTodos() {
    const rangeInput = document.getElementById("rangeId").value;
    const table = document.getElementById("todoTable");
    const tbody = document.getElementById("todoRows");

    // Parse the range input (e.g., "1-5")
    const rangeMatch = rangeInput.match(/^(\d+)-(\d+)$/);
    if (!rangeMatch) {
        alert("Please enter a valid range (e.g., 1-5)");
        table.style.display = "none";
        return;
    }

    const minId = parseInt(rangeMatch[1]);
    const maxId = parseInt(rangeMatch[2]);

    if (minId < 1 || maxId > 200 || minId > maxId) {
        alert("Please enter valid Todo IDs (1-200) where the first ID is less than or equal to the second ID");
        table.style.display = "none";
        return;
    }

    tbody.innerHTML = "";
    table.style.display = "none";

    const fetchPromises = [];
    for (let id = minId; id <= maxId; id++) {
        fetchPromises.push(
            fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
                .then(res => res.json())
                .then(todo => {
                    return fetch(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
                        .then(res => res.json())
                        .then(user => ({ todo, user }));
                })
        );
    }

    Promise.all(fetchPromises)
        .then(results => {
            results.forEach(({ todo, user }) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${todo.id}</td>
                    <td>${user.username}</td>
                    <td>${todo.title}</td>
                    <td>${todo.completed ? ' True' : ' False'}</td>
                `;
                tbody.appendChild(row);
            });
            table.style.display = "table";
        })
        .catch(error => {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="4">Error fetching data</td>`;
            tbody.appendChild(row);
            table.style.display = "table";
        });
}