const apiKey = "f9f421b79b6c454a96be65431703cf45";
const resultsDiv = document.getElementById("results");

window.onload = function() {
  const lastSearch = localStorage.getItem("lastIngredients");
  if (lastSearch) {
    showWelcomeFromLastSearch(lastSearch);
  } else {
    showRandomRecipes();
  }
};

async function showWelcomeFromLastSearch(ingredients) {
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=3&apiKey=${apiKey}`;
  resultsDiv.innerHTML = "<h2>Welcome back! Recipes based on your last search</h2>";
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach(displayRecipeBox);
  } catch (error) {
    console.error("Welcome suggestion error:", error);
  }
}

async function showRandomRecipes() {
  const url = `https://api.spoonacular.com/recipes/random?number=3&apiKey=${apiKey}`;
  resultsDiv.innerHTML = "<h2>Suggestions for you</h2>";
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.recipes.forEach(displayRecipeBox);
  } catch (error) {
    console.error("Random recipe error:", error);
  }
}

async function findRecipes() {
    const input = document.getElementById("ingredients").value;
    const cuisine = document.getElementById("cuisine").value;
    const url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${input}&number=10${cuisine ? `&cuisine=${cuisine}` : ""}&addRecipeInformation=true&apiKey=${apiKey}`;
  
    resultsDiv.innerHTML = "<h2>Recipes you can make:</h2>";
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const results = data.results;
  
      if (!results || results.length === 0) {
        resultsDiv.innerHTML += `
          <div class="recipe-card visible">
            <div class="recipe-content">
              <h3>Oops! Nothing tasty here...</h3>
              <p>We couldn't find anything with <strong>${input}</strong>. Try common ingredients like <em>egg</em>, <em>cheese</em>, <em>rice</em>, or <em>bread</em>.</p>
            </div>
          </div>`;
        return;
      }
  
      results.forEach(displayRecipeBox);
      localStorage.setItem("lastIngredients", input);
    } catch (error) {
      resultsDiv.innerHTML = "<p>Failed to fetch recipes. Check your internet.</p>";
      console.error(error);
    }
  }
  

async function getRandomRecipe() {
  const url = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`;

  resultsDiv.innerHTML = "<h2>Searching...</h2>";

  try {
    const response = await fetch(url);
    const data = await response.json();
    const recipe = data.recipes[0];
    resultsDiv.innerHTML = "<h2>Here's your recipe</h2>";
    displayRecipeBox(recipe);
  } catch (error) {
    resultsDiv.innerHTML = "<p>Failed to fetch a recipe.</p>";
    console.error(error);
  }
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
}

function saveRecipe(recipe) {
  let saved = JSON.parse(localStorage.getItem("favorites") || "[]");
  saved.push(recipe);
  localStorage.setItem("favorites", JSON.stringify(saved));
  alert("Recipe saved.");
}

function displayRecipeBox(recipe) {
  const box = document.createElement("div");
  box.className = "recipe-card visible";

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = recipe.title;

  const content = document.createElement("div");
  content.className = "recipe-content";
  content.innerHTML = `
    <h3>${recipe.title}</h3>
    <p><strong>Summary:</strong> ${
      recipe.summary
        ? new DOMParser().parseFromString(recipe.summary, "text/html").body.textContent.slice(0, 120)
        : "No summary"
    }...</p>
    <div class="btn-group">
      <a href="${recipe.sourceUrl || 'https://spoonacular.com/recipes/' + recipe.title.replaceAll(" ", "-") + '-' + recipe.id}" target="_blank">
        <button>View Full Recipe</button>
      </a>
      <button onclick='saveRecipe(${JSON.stringify(recipe).replace(/'/g, "&#39;")})'>Save</button>
    </div>
  `;

  box.appendChild(image);
  box.appendChild(content);
  resultsDiv.appendChild(box);
}

window.addEventListener("scroll", () => {
  document.querySelectorAll(".recipe-card").forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.classList.add("visible");
    }
  });
});

// Animated placeholder
const phrases = ["e.g. tomato, cheese, pasta", "e.g. chicken, rice, garlic", "e.g. milk, banana, oats"];
let i = 0, char = 0;
const input = document.getElementById("ingredients");

function typeEffect() {
  if (!input) return;
  if (char <= phrases[i].length) {
    input.setAttribute("placeholder", phrases[i].substring(0, char++) + "|");
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(() => {
      char = 0;
      i = (i + 1) % phrases.length;
      typeEffect();
    }, 1500);
  }
}
typeEffect();
