// Define variables to access HTML input fields and elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");

// Initialize mood and temporary variable
let mood = "create";
let temp = '';

// Function to calculate the total based on input values
function getTotal() {
    if (price.value !== "") {
        let result = +price.value + +taxes.value + +ads.value - +discount.value;
        total.innerHTML = result;
        total.style.backgroundColor = "#00763d";
    } else {
        total.style.backgroundColor = "#1aafdb";
        total.innerHTML = "";
    }
}

// Create or update products
let dataProducts;
if (localStorage.products != null) {
    dataProducts = JSON.parse(localStorage.products);
} else {
    dataProducts = [];
}

create.onclick = () => {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    };

    // Check if input values are valid and within limits
    if (title.value !== '' && price.value !== '' && category.value !== '' && count.value <= 100) {
        if (mood === "create") {
            if (newPro.count > 1) {
                // If count is greater than 1, add multiple products
                for (let i = 1; i < newPro.count; i++) {
                    dataProducts.push(newPro);
                }
            } else {
                dataProducts.push(newPro);
            }
        } else {
            // Update existing product data
            dataProducts[temp] = newPro;
            mood = "create";
            create.innerHTML = "Create";
            count.style.display = "block";
        }
        clearData();
    }
    // Save data in localStorage
    localStorage.setItem("products", JSON.stringify(dataProducts));
    showData();
};

// Function to clear input fields
function clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    count.value = "";
    category.value = "";
}

// Function to display product data in the table
function showData() {
    let table = '';
    for (let i = 0; i < dataProducts.length; i++) { // Start from 1 to skip header row
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataProducts[i].title}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].category}</td>
            <td><button data-lang="Update" onclick="updatePro(${i})" id="update">Update</button></td>
            <td><button data-lang="Delete" onclick="deleteProduct(${i})" id="delete">Delete</button></td>
        </tr>`;
    }
    document.getElementById("tbody").innerHTML = table;

    // Create a "Delete All" button when there are products
    let btnDelete = document.getElementById("deleteall");
    if (dataProducts.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()" id="deleteall">Delete All (${dataProducts.length})</button>`;
        btnDelete.style.display = "flex";
    } else {
        btnDelete.innerHTML = "";
        btnDelete.style.display = "none";
    }

    getTotal();
}

// Initial display of data
showData();

// Function to delete a single product
function deleteProduct(i) {
    dataProducts.splice(i, 1);
    localStorage.products = JSON.stringify(dataProducts);
    showData();
}

// Function to delete all products and clear localStorage
function deleteAll() {
    localStorage.clear();
    dataProducts.splice(0);
    showData();
}

// Function to update product data
function updatePro(i) {
    title.value = dataProducts[i].title;
    price.value = dataProducts[i].price;
    taxes.value = dataProducts[i].taxes;
    ads.value = dataProducts[i].ads;
    discount.value = dataProducts[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataProducts[i].category;
    create.innerHTML = 'Update';
    mood = "update";
    temp = i;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// Function to set the search mood (title or category)
let searchMood = "title";
function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = "Search By " + searchMood;
    search.focus();
    search.value = '';
    showData();
}

// Function to search for products based on title or category
function searchData(value) {
    let table = '';
    for (let i = 0; i < dataProducts.length; i++) { // Start from 1 to skip header row
        if (searchMood === "title") {
            if (dataProducts[i].title.includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i}</td>
                        <td>${dataProducts[i].title}</td>
                        <td>${dataProducts[i].price}</td>
                        <td>${dataProducts[i].taxes}</td>
                        <td>${dataProducts[i].ads}</td>
                        <td>${dataProducts[i].discount}</td>
                        <td>${dataProducts[i].total}</td>
                        <td>${dataProducts[i].category}</td>
                        <td><button data-lang="Update" onclick="updatePro(${i})" id="update">Update</button></td>
                        <td><button data-lang="Delete" onclick="deleteProduct(${i})" id="delete">Delete</button></td>
                    </tr>`;
            }
        } else {
            if (dataProducts[i].category.includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i}</td>
                        <td>${dataProducts[i].title}</td>
                        <td>${dataProducts[i].price}</td>
                        <td>${dataProducts[i].taxes}</td>
                        <td>${dataProducts[i].ads}</td>
                        <td>${dataProducts[i].discount}</td>
                        <td>${dataProducts[i].total}</td>
                        <td>${dataProducts[i].category}</td>
                        <td><button data-lang="Update" onclick="updatePro(${i})" id="update">Update</button></td>
                        <td><button data-lang="Delete" onclick="deleteProduct(${i})" id="delete">Delete</button></td>
                    </tr>`;
            }
        }
    }
    document.getElementById("tbody").innerHTML = table;
}

// Change language

const translation = {
    en: {
        Product_Title: 'Title',
        Price: 'Price',
        Taxes: 'Taxes',
        Ads: 'Ads',
        Discount: 'Discount',
        Count: 'Count',
        Category: 'Category',
        Create: 'Create',
        Search: 'Search',
        Search_By_Title: 'Search by Title',
        Search_by_Category: 'Search by Category',
        DeleteAll: 'DeleteAll',
        Id: 'ID',
        Total: 'Total',
        Title_in_table: 'Title1',
        Update: 'Update',
        Delete: 'Delete',
    },
    ar: {
        Product_Title: 'اسم المنتج',
        Price: 'السعر',
        Taxes: 'الأضافات',
        Ads: 'أعلانات',
        Discount: 'خصومات',
        Count: 'العدد',
        Category: 'الفئة',
        Create: 'أنشاء',
        Search: 'بحث عن المنتج',
        Search_By_Title: 'بحث من خلال الأسم',
        Search_by_Category: 'بحث من خلال الفئة',
        DeleteAll: 'مسح جميع المنتجات',
        Id: 'ID',
        Total: 'الأجمالي',
        Title_in_table: 'اسم المنتج',
        Update: 'تعديل',
        Delete: 'حذف',
    },
};

const languageSelector = document.querySelector('select');

languageSelector.addEventListener("change", (event) => {
    changLanguage(event.target.value);
    // Save language in local storage
    localStorage.setItem('language', event.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
    changLanguage(localStorage.getItem('language'));
});

const changLanguage = (language) => {
    const elements = document.querySelectorAll('[data-lang]')
    elements.forEach((element) => {
        const translationKey = element.getAttribute('data-lang');
        element.placeholder = translation[language][translationKey];
        element.innerHTML = translation[language][translationKey];
    });
    document.dir = language === 'en' ? 'ltr' : 'rtl';
}

// Dark mode

// Function to set the theme preference in localStorage
function setTheme(theme) {
    localStorage.setItem("theme", theme);
}

// Function to get the theme from localStorage
function getTheme() {
    return localStorage.getItem("theme");
}

// Function to apply the theme
function applyTheme() {
    const theme = getTheme();
    if (theme === "Dark") {
        document.body.classList.add("Dark");
        total.style.backgroundColor = "#0261cd";
    } else {
        document.body.classList.remove("Dark");
        total.style.backgroundColor = "#1aafdb";
    }
}

// Apply the theme initially
applyTheme();

// Listen for changes to the theme checkbox
const themeToggle = document.querySelector('.theme-checkbox')
themeToggle.addEventListener("change", function () {
    if (themeToggle.checked) {
        // Dark theme
        setTheme("Dark");
        applyTheme();
    } else {
        // Light theme
        setTheme("light");
        applyTheme();
    }
});
