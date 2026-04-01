const API_KEY = "https://www.themealdb.com/api/json/v1/1";

const ingredientInput = document.getElementById("ingredient-input");
const searchBtn = document.getElementById("search-btn");
const errMessage = document.getElementById("error-message");
const recipeGrid = document.getElementById("recipe-grid");
const resultSection = document.getElementById("results-section");
const resultTitle = document.getElementById("results-title");


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
        // console.log("Error occured: ", err);
        errMessage.textContent = "Error fetching data. Please try again later.";
        errMessage.classList.remove("hidden");
    } finally {
        searchBtn.textContent = "Discover";
        searchBtn.disabled = false;
    }
}

function displayRecipes(recipes, query){
    recipeGrid.innerHTML = "";
    resultSection.classList.remove("hidden")
    if (!recipes){
        resultTitle.textContent = `No recipes found for "${query}"`
        return;
    }else{
        recipes.forEach(meal => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            card.innerHTML = `
                <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}" class="recipe-card-img" loading="lazy">
                <div class="recipe-card-content">
                    <div class="recipe-card-meta">View Recipe</div>
                    <h3 class="recipe-card-title" title="${meal.strMeal}">${meal.strMeal}</h3>
                </div>
            `;
            recipeGrid.appendChild(card);
        });
    }
}

searchBtn.addEventListener("click", () => {
    const query = ingredientInput.value.trim();
    handleSearch(query);
});
ingredientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = ingredientInput.value.trim();
        handleSearch(query);
    }
});
