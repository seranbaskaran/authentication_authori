
// Define the API endpoint
const apiUrl = 'https://crudcrud.com/api/6d3427f09bb64c5284a053c7766f7637/employees';


// Helper function to fetch data from the API
function fetchData() {
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error; // Re-throw the error to handle it elsewhere if needed
        });
}

// Create checkboxes dynamically
function createCheckboxes() {
    const checkboxList = document.getElementById("checkboxList");

    fetchData()
        .then(data => {
            const keys = data.length ? Object.keys(data[0]) : [];
            
            keys.forEach(key => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = key;
                checkbox.value = key;
                const label = document.createElement("label");
                label.textContent = key;
                checkboxList.appendChild(checkbox);
                checkboxList.appendChild(label);
            });

            const btn = document.createElement("button");
            btn.innerText = "Show";
            btn.id = "showTableBtn";
            btn.addEventListener("click", applySorting); // Use event listener
            checkboxList.appendChild(btn);
        });
}

// Call the function to create checkboxes
createCheckboxes();

// Populate select dropdown with keys
function populateSelectKey() {
    const selectKey = document.getElementById('selectKey');
    fetchData()
        .then(data => {
            const keys = data.length ? Object.keys(data[0]) : [];
            selectKey.innerHTML = keys.map(key => `<option value="${key}">${key}</option>`).join('');
        });
}
// Call the function to populate the select dropdown
populateSelectKey();
// Creating process

const _name = document.getElementById('name')
const _description = document.getElementById('description')
const _age = document.getElementById('age')
const _city = document.getElementById('city')
const _salary = document.getElementById('salary')
const _submit=document.getElementById('submit')
//Adding and updating function
function populateCreateForm(itemData,itenid) {
    _name.value = itemData.name;
    _description.value = itemData.description;
    _age.value = itemData.age;
    _city.value = itemData.city;
    _salary.value = itemData.salary;
    _submit.textContent = 'Update';
    _submit.setAttribute('data-id1',itenid)
}
document.getElementById('itemForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    let name = _name.value;
    let description = _description.value;
    let age = _age.value;
    let city = _city.value;
    let salary = _salary.value;

    if (!name || !description || !age || !city || !salary) {
        // Handle empty values here, e.g., show an error message
        console.error('Please fill in all fields');
        return;
    }
    const submitButton = document.querySelector('#itemForm button[type="submit"]');
    console.log(submitButton)
    if (submitButton.textContent === "Add") {
        // Perform the ADD operation
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, age, city, salary }),
        })
            .then(response => {
                if (response.ok) {
                    // Reset input fields
                    _name.value = '';
                    _description.value = '';
                    _age.value = '';
                    _city.value = '';
                    _salary.value = '';

                    // After successfully adding, fetch the updated data and update the table
                    fetchData()
                        .then(data => {
                            //console.log(data);
                            applySorting();
                        })
                        .catch(error => console.error('Error fetching updated data:', error));
                }
            })
            .catch(error => console.error('Error creating item:', error));
    } else if (submitButton.textContent === "Update") {
        const itemIdToUpdate = submitButton.getAttribute("data-id1");
        //console.log(itemIdToUpdate)
        // Perform the UPDATE operation
        fetch(`${apiUrl}/${itemIdToUpdate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, age, city, salary }),
        })
            .then(response => {
                if (response.ok) {
                    // Reset input fields
                    _name.value = '';
                    _description.value = '';
                    _age.value = '';
                    _city.value = '';
                    _salary.value = '';
                    _submit.textContent='Add';
                    // After successfully updating, fetch the updated data and update the table
                    fetchData()
                        .then(data => {
                            console.log(data);
                            applySorting();
                        })
                        .catch(error => console.error('Error fetching updated data:', error));
                }
            })
            .catch(error => console.error('Error updating item:', error));
    }
});
// Sorting function
function applySorting() {
    // debugger
    fetchData()
        .then(data => {
            
            const selectKey = document.getElementById('selectKey').value;
            const selectSort = document.getElementById('selectSort').value;
            const sortedData = data.sort((a, b) => {
                if (selectSort === 'asc') {
                    return a[selectKey] > b[selectKey] ? 1 : -1;
                } else {
                    return a[selectKey] < b[selectKey] ? 1 : -1;
                }
            });
            
            const values = document.querySelectorAll('input[type="checkbox"]:checked');
            const selectedArr = Array.from(values).map(item => item.value);
            let table = document.getElementById('dataTable');
            table.innerHTML = '';
            let tableHead = table.createTHead();
            let row = tableHead.insertRow();
            selectedArr.forEach(val => {
                let th = document.createElement('th');
                th.textContent = val;
                row.appendChild(th);
            });
            let tableBody = table.createTBody();
            sortedData.forEach(val1 => {
                let row = tableBody.insertRow();
                selectedArr.forEach(val2 => {
                    let cell = row.insertCell();
                    cell.textContent = val1[val2];
                });

                let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
                if(currentUser && currentUser.type != "user"){
                    // Add an update button to each row
                    let updateButtonCell = row.insertCell();
                    let updateButton = document.createElement('button');
                    
                    updateButton.addEventListener("click", function () {
                        const itemId = val1._id; // Get the unique ID of the item
                        fetchData()
                            .then(data => {
                                const itemToUpdate = data.find(item => item._id === itemId);
                                if (itemToUpdate) {
                                    populateCreateForm(itemToUpdate,itemId);
                                }
                            });
                    });
                    updateButton.textContent = 'Update';
                    updateButton.setAttribute('class',"update-btn");
                    updateButtonCell.appendChild(updateButton);

                    if(currentUser.type != "admin"){
                        // Add a delete button to each row
                        let deleteButtonCell = row.insertCell();
                        let deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.setAttribute("data-id", val1._id);
                        deleteButton.setAttribute("class","delete-btn");
                        deleteButton.addEventListener("click", function () {
                            // Get the _id from the data attribute
                            const itemId = this.getAttribute("data-id");

                            // Call the deleteItem function with the itemId
                            deleteItem(itemId);
                        });
                        deleteButtonCell.appendChild(deleteButton);
                    }
                }
            });
            //console.log(sortedData);
        });
}
// Function to delete an item
function deleteItem(id) {
    
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log("Successfully deleted");
            applySorting();
        }
    })
    .catch(error => console.error('Error deleting item:', error));
}
//apply filter 
// filterFunction 
function applyFiltering() {
    const dataTable = document.getElementById('dataTable');
    const filterAge = document.getElementById('filterAge').value;
    fetchData()
        .then(data => {
            const selectKey = document.getElementById('selectKey').value;
            const selectSort = document.getElementById('selectSort').value;
            const sortedData = data.filter((item) => item.age >= filterAge);
            const values = document.querySelectorAll('input[type="checkbox"]:checked');
            const selectedArr = Array.from(values).map(item => item.value);

            let table = document.getElementById('dataTable');
            table.innerHTML = '';

            let tableHead = table.createTHead();
            let row = tableHead.insertRow();
            selectedArr.forEach(val => {
                let th = document.createElement('th');
                th.textContent = val;
                row.appendChild(th);
            });

            let tableBody = table.createTBody();
            sortedData.forEach(val1 => {
                let row = tableBody.insertRow();
                selectedArr.forEach(val2 => {
                    let cell = row.insertCell();
                    cell.textContent = val1[val2];
                });

                // Add an update button to each row
                let updateButtonCell = row.insertCell();
                let updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButtonCell.appendChild(updateButton);
                updateButton.setAttribute('onclick',"updateInput(event)")
                updateButton.setAttribute('class',"update-btn")
                // Add a delete button to each row
                let deleteButtonCell = row.insertCell();
                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute("data-id", val1._id);
                deleteButton.setAttribute("class","delete-btn");
                deleteButton.addEventListener("click", function () {
                    // Get the _id from the data attribute
                    const itemId = this.getAttribute("data-id");

                    // Call the deleteItem function with the itemId
                    deleteItem(itemId);
                });
                deleteButtonCell.appendChild(deleteButton);
            });
            console.log(sortedData);
        });
}
