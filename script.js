const API_KEY = "https://www.themealdb.com/api/json/v1/1";

const ingredientInput = document.getElementById("ingredient-input");
const query = ingredientInput.value.trim();
const searchBtn = document.getElementById("search-btn");
const errMessage = document.getElementById("error-message");


async function handleSearch(query) {
    if (!query) {
       errMessage.classList.remove("hidden");
       return;
    }
    errMessage.classList.add("hidden");
    searchBtn.textContent = "Loading...";
    searchBtn.disabled = true;
    try{
        const response = await fetch(`${API_KEY}/filter.php?i=${query}`);
        const data = await response.json();
        displayRecipes(data.meals, query);
    }catch (err){
        console.log("Error occured: ", err);
        errMessage.textContent = "Error fetching data. Please try again later.";
        errMessage.classList.remove("hidden");
    } finally {
        searchBtn.textContent = "Discover";
        searchBtn.disabled = false;
    }
}

function displayRecipes(recipes, query){
    
}