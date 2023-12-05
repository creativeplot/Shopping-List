

// Making sure that i cant add the same item twice


const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const itemFilter = document.getElementById('filter')
const clearBtn = document.getElementById('clear')
let isEditMode = false;
const formBtn = itemForm.querySelector('button')


function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    if (newItem === '') {
        alert('Please add an item');
        return;
    }
    if (isEditMode) {

        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);

        itemToEdit.classList.remove('edit-mode');

        itemToEdit.remove();
        
        isEditMode = false;
    } else { 
        // using the new created function
        // i want to run this if i'm not in edit mode
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }

        // i used else here because if i click in an item to edit it and put the same name as before i still want to keep it at what it was, that's why i put else if we're not in edit mode
    }


    addItemToDOM(newItem);

    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
};



function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton ('remove-item btn-link text-red');

    li.appendChild(button);

    itemList.appendChild(li);
}



function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}


function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item))

    checkUI();
}


function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
};




function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    };
}

// Creating a function to check if the item exists
function checkIfItemExists(item) {
    // getting the items from local storage
    const itemsFromStorage = getItemsFromStorage();

    // checking to see if the item is already there, using the includes method which you can run on an array and you can see if something is included in that array
    // this will return i true or false
    /* if (itemsFromStorage.includes(item)) {
        return true;
    } else {
        return false;
    } */
    // shorter way
    // since .inlcudes(items) already returns true or false i can simply return this function with itemsFromStorage
    return itemsFromStorage.includes(item);
}





function setItemToEdit (item) {
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    
    isEditMode = true;

    item.classList.add('edit-mode');

    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';

    formBtn.style.backgroundColor = '#228b22'

    itemInput.value = item.textContent;

}


function removeItem(item) {

    item.remove();

    removeItemFromStorage(item.textContent);
    checkUI();
}


function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}



function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');

    checkUI();
};



function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text)!= -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }) 

    console.log(text);
}


function checkUI() {
    itemInput.value = '';


    const items = itemList.querySelectorAll('li')
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';

    formBtn.style.backgroundColor = '#333';


    isEditMode = false;
}


function init () {

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem)
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems)
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();

}

init();