const apiUrl = 'http://localhost:3002/api/data';

// Fetch and display data
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const dataList = document.getElementById('data-list');
        dataList.innerHTML = ''; // Clear existing list
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;

            // Create delete button with inline styles
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = 'rgb(253, 128, 128)';
            deleteButton.style.color = 'white';
            deleteButton.style.border = '1px solid black';
            deleteButton.style.padding = '2px 6px';
            deleteButton.style.marginLeft = '50px';
            deleteButton.style.cursor = 'pointer';

            // Add event listener for delete
            deleteButton.addEventListener('click', async () => {
                await deleteData(item.id);
                fetchData(); // Refresh list after deleting an item
            });

            li.appendChild(deleteButton);
            dataList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Handle form submission to add new data
document.getElementById('data-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = document.getElementById('data-input');
    const newItem = { id: Date.now(), name: input.value };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        if (!response.ok) throw new Error('Network response was not ok');

        input.value = ''; // Clear input
        fetchData(); // Refresh list after adding new data
    } catch (error) {
        console.error('Error adding new data:', error);
    }
});

// Delete data by ID
async function deleteData(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

// clear all data by refresh the page manually
async function clearData() {
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

// Clear data and fetch fresh data on page load
clearData().then(fetchData);