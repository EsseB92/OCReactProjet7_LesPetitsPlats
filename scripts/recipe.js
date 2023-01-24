// Initialisation d'une liste vide pour stocker les recettes filtrées
let filteredRecipes = [];

// Fonction permettant de filtrer les recettes en fonction de la saisie de l'utilisateur
function filterRecipes(searchInput) {

    // Effaçage de la liste des recettes filtrées
    filteredRecipes = [];

    // Vérification si l'entrée de recherche de l'utilisateur comporte au moins 3 caractères
    if (searchInput.length < 3) {
        updateUI([]);
        return;
    }

    // Recherche dans toutes les recettes existantes
    for (let i = 0; i < allRecipes.length; i++) {
        let recipe = allRecipes[i];

        // Vérification si l'entrée de recherche correspond au titre, aux ingrédients ou à la description de la recette
        if (recipe.name.includes(searchInput) || recipe.ingredients.includes(searchInput) || recipe.description.includes(searchInput)) {
        // Ajout de la recette à la liste des recettes filtrées
        filteredRecipes.push(recipe);
        }
    }

    // Mise à jour de l'interface utilisateur avec la liste des recettes filtrées
    updateUI(filteredRecipes);

    // // Initialisation des champs de recherche avancée
    // let ingredientsField = document.getElementById("ingredients-field");
    // let utensilsField = document.getElementById("utensils-field");
    // let appliancesField = document.getElementById("appliances-field");

    // // Mise à jour des champs de recherche avancée avec les informations des recettes restantes
    // for (let i = 0; i < filteredRecipes.length; i++) {
    //     let recipe = filteredRecipes[i];
    //     ingredientsField.innerHTML += recipe.ingredients + " ";
    //     utensilsField.innerHTML += recipe.utensils + " ";
    //     appliancesField.innerHTML += recipe.appliances + " ";
    // }
}

// Fonction permettant d'affiner les résultats de la recherche en fonction des champs de recherche avancée
function refineSearch() {
    // Initialisation d'une nouvelle liste pour stocker les résultats de la recherche affinée
    let refinedResults = [];
  
    // Récupération de la saisie de l'utilisateur dans les champs de recherche avancée
    let ingredientsInput = document.getElementById("ingredients-input").value;
    let utensilsInput = document.getElementById("utensils-input").value;
    let appliancesInput = document.getElementById("appliances-input").value;
  
    // Comparation de la saisie de l'utilisateur avec les informations contenues dans la liste des recettes filtrées
    for (let i = 0; i < filteredRecipes.length; i++) {
        let recipe = filteredRecipes[i];
  
        // Vérification si la saisie de l'utilisateur correspond aux ingrédients, aux ustensiles ou aux appareils de la recette.
        if (recipe.ingredients.includes(ingredientsInput) || recipe.utensils.includes(utensilsInput) || recipe.appliance.includes(appliancesInput)) {
            // Ajout la recette à la liste des résultats affinés
            refinedResults.push(recipe);
        }
    }
    // Mise à jour de l'interface utilisateur avec la liste des résultats affinés
    updateUI(refinedResults);
}

// Fonction permettant de mettre à jour l'interface utilisateur avec les résultats de la recherche
function updateUI(results) {
    // Effaçage des résultats de recherche actuels de l'interface utilisateur
    let searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "";
  
    // Vérification s'il y a des résultats à afficher
    if (results.length === 0) {
        searchResultsDiv.innerHTML = "No results found. You can try searching for 'apple pie', 'fish', etc.";
        return;
    }
  
    // Affichage des résultats de la recherche dans l'interface utilisateur
    for (let i = 0; i < results.length; i++) {
        const recipe = results[i];

        const recipeModel = recipeFactory(recipe);
        const recipeDOM = recipeModel.getRecipeDOM();

        searchResultsDiv.appendChild(recipeDOM);

        // for (let j = 0; j < recipe.ingredients.length; j++){
        //     const ingredient = recipe.ingredients[i];

        //     const ingredientModel = ingredientFactory(ingredient);
        //     const ingredientDOM = ingredientModel.getIngredientDOM();

        // }
    }
  
    // Permettre à l'utilisateur de sélectionner une recette
    searchResultsDiv.addEventListener("click", function(e) {
        let selectedRecipe = e.target;
        // Perform some action with the selected recipe, such as displaying the recipe's details or adding it to a favorites list
    });
}

