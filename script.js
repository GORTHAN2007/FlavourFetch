const API_KEY = "https://www.themealdb.com/api/json/v1/1";

const ingredientInput = document.getElementById("ingredient-input");
const searchBtn = document.getElementById("search-btn");
const errMessage = document.getElementById("error-message");
const recipeGrid = document.getElementById("recipe-grid");
const resultSection = document.getElementById("results-section");
const resultTitle = document.getElementById("results-title");
const backbtn = document.getElementById("back-btn");
const recipeDetailSection = document.getElementById("recipe-detail-section");
const recipeDetailContainer = document.getElementById("recipe-detail-container");

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
        window.scrollTo({ top: 830, behavior: 'smooth' });
        return;
    }else{
        resultTitle.textContent = `Recipes found for "${query}"`;
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
            card.addEventListener("click", () => {
                showRecipeDetails(meal.idMeal);
            });
            recipeGrid.appendChild(card);
        })
        window.scrollTo({ top: 830, behavior: 'smooth' });
    }
}

async function showRecipeDetails(id) {
    try {
        const response = await fetch(`${API_KEY}/lookup.php?i=${id}`);
        const data = await response.json();
        const meal = data.meals[0];
        let ingredientsHTML = '';
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
                ingredientsHTML += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
            }
        }
        recipeDetailContainer.innerHTML = `
            <div class="recipe-detail-header" style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="detail-img" style="max-width: 100%; border-radius: 8px; flex: 1; min-width: 250px;">
                <div class="detail-info" style="flex: 2; min-width: 250px;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${meal.strMeal}</h2>
                    <p style="margin-bottom: 0.5rem; font-size: 1.1rem;"><strong>Category:</strong> ${meal.strCategory}</p>
                    <p style="font-size: 1.1rem;"><strong>Area:</strong> ${meal.strArea}</p>
                </div>
            </div>
            <div class="recipe-detail-body" style="margin-top: 2rem;">
                <div class="ingredients" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                    <h3 style="margin-bottom: 15px; font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Ingredients</h3>
                    <ul style="line-height: 1.8; list-style-position: inside;">${ingredientsHTML}</ul>
                </div>
                <div class="instructions" style="margin-top: 2rem; padding: 1.5rem;">
                    <h3 style="margin-bottom: 15px; font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Instructions</h3>
                    <p style="line-height: 1.8; white-space: pre-wrap; font-size: 1.1rem;">${meal.strInstructions}</p>
                </div>
            </div>
        `;
        resultSection.classList.add("hidden");
        recipeDetailSection.classList.remove("hidden");
        window.scrollTo({ top: 830, behavior: 'smooth' });
    } catch (err) {
        console.error("Error fetching recipe details: ", err);
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
backbtn.addEventListener("click", () => {
    recipeDetailSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
});