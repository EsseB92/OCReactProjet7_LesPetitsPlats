let filteredRecipes = [], filteredIngredients = [], filteredAppliances = [], filteredUstensils = [], tagIngredients = [], tagAppliances = [], tagUstensils = [], currentSearch = '';

window.onload = function(){ filterRecipes(); }

function filterRecipes(searchInput = currentSearch) {
    currentSearch = searchInput.toLowerCase().trim();
    filteredRecipes = [];
    filteredIngredients = [];
    filteredAppliances = [];
    filteredUstensils = [];

    if (currentSearch.length < 3 && !tagIngredients.length && !tagAppliances.length && !tagUstensils.length) return updateUI([]);

    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];

        let isNameIncluded = recipe.name.toLowerCase().includes(currentSearch);
        let isDescriptionIncluded = recipe.description.toLowerCase().includes(currentSearch);
        let isIngredientIncluded = false;

        for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase().includes(currentSearch)) {
                isIngredientIncluded = true;
                break;
            }
        }

        if (isNameIncluded || isDescriptionIncluded || isIngredientIncluded) {
            let areIngredientsIncluded = true;
            let areUstensilsIncluded = true;
            let isApplianceIncluded = false;

            for (let k = 0; k < tagIngredients.length; k++) {
                let isIngredientTagIncluded = false;

                for (let l = 0; l < recipe.ingredients.length; l++) {
                    if (recipe.ingredients[l].ingredient.toLowerCase() === tagIngredients[k]) {
                        isIngredientTagIncluded = true;
                        break;
                    }
                }

                if (!isIngredientTagIncluded) {
                    areIngredientsIncluded = false;
                    break;
                }
            }

            for (let m = 0; m < tagUstensils.length; m++) {
                if (!recipe.ustensils.map(ustensil => ustensil.toLowerCase()).includes(tagUstensils[m])) {
                    areUstensilsIncluded = false;
                    break;
                }
            }

            if (tagAppliances.length) {
                if (tagAppliances.includes(recipe.appliance.toLowerCase())) {
                    isApplianceIncluded = true;
                }
            } else {
                isApplianceIncluded = true;
            }

            if (areIngredientsIncluded && areUstensilsIncluded && isApplianceIncluded) {
                filteredRecipes.push(recipe);
            }
        }
    }

    for (let n = 0; n < filteredRecipes.length; n++) {
        const recipe = filteredRecipes[n];

        for (let o = 0; o < recipe.ingredients.length; o++) {
            const ingredient = recipe.ingredients[o].ingredient.toLowerCase();

            if (!filteredIngredients.includes(ingredient) && !tagIngredients.includes(ingredient)) {
                filteredIngredients.push(ingredient);
            }
        }

        for (let p = 0; p < recipe.ustensils.length; p++) {
            const ustensil = recipe.ustensils[p].toLowerCase();

            if (!filteredUstensils.includes(ustensil) && !tagUstensils.includes(ustensil)) {
                filteredUstensils.push(ustensil);
            }
        }

        const appliance = recipe.appliance.toLowerCase();

        if (!filteredAppliances.includes(appliance) && !tagAppliances.includes(appliance)) {
            filteredAppliances.push(appliance);
        }
    }

    filteredIngredients.sort((a, b) => a.localeCompare(b));
    filteredUstensils.sort((a, b) => a.localeCompare(b));
    filteredAppliances.sort((a, b) => a.localeCompare(b));

    displayIngredients(filteredIngredients);
    displayUstensils(filteredUstensils);
    displayAppliances(filteredAppliances);

    return filteredRecipes.length ? updateUI(filteredRecipes) : noUI();
}

function updateTags() {
    const tagsDiv = document.getElementById("tags");
    let html = '';
    
    for (let i = 0; i < tagIngredients.length; i++) {
        html += `
            <div class="tag ingredients-tag">
                <span class="tag__text">${tagIngredients[i]}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ingredient', '${tagIngredients[i].replace("'", "\\'")}')"></i>
            </div>
        `;
    }

    for (let i = 0; i < tagAppliances.length; i++) {
        html += `
            <div class="tag appliances-tag">
                <span class="tag__text">${tagAppliances[i]}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('appliance', '${tagAppliances[i].replace("'","\\'")}')"></i>
            </div>
        `;
    }

    for (let i = 0; i < tagUstensils.length; i++) {
        html += `
            <div class="tag ustensils-tag">
                <span class="tag__text">${tagUstensils[i]}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ustensil', '${tagUstensils[i].replace("'","\\'")}')"></i>
            </div>
        `;
    }

    tagsDiv.innerHTML = html;
}

function noUI(){
    const searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
}

function refineSearch(input, id) {
    let results = [];
    const inputTrimmed = input.trim().toLowerCase();
    switch (id) {
      case "ingredients-input":
        for (let i = 0; i < filteredIngredients.length; i++) {
          const ingredient = filteredIngredients[i];
          if (ingredient.includes(inputTrimmed)) {
            results.push(ingredient);
          }
        }
        displayIngredients(results);
        break;
      case "appliances-input":
        for (let i = 0; i < filteredAppliances.length; i++) {
          const appliance = filteredAppliances[i];
          if (appliance.includes(inputTrimmed)) {
            results.push(appliance);
          }
        }
        displayAppliances(results);
        break;
      case "ustensils-input":
        for (let i = 0; i < filteredUstensils.length; i++) {
          const ustensil = filteredUstensils[i];
          if (ustensil.includes(inputTrimmed)) {
            results.push(ustensil);
          }
        }
        displayUstensils(results);
        break;
    }
  }

function updateUI(results) {
    let searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "";
    
    if (results.length === 0) {
        allRecipes.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        for (let i = 0; i < allRecipes.length; i++) {
            const recipe = allRecipes[i];
            const recipeModel = recipeFactory(recipe);
            const recipeDOM = recipeModel.getRecipeDOM();
            searchResultsDiv.appendChild(recipeDOM);
            
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j];
                const ingredientLowerCase = ingredient.ingredient.toLowerCase();
                if (!filteredIngredients.includes(ingredientLowerCase)) {
                    filteredIngredients.push(ingredientLowerCase);
                }
            }
            
            for (let j = 0; j < recipe.ustensils.length; j++) {
                const ustensil = recipe.ustensils[j];
                const ustensilLowerCase = ustensil.toLowerCase();
                if (!filteredUstensils.includes(ustensilLowerCase)) {
                    filteredUstensils.push(ustensilLowerCase);
                }
            }
            
            const applianceLowerCase = recipe.appliance.toLowerCase();
            if (!filteredAppliances.includes(applianceLowerCase)) {
                filteredAppliances.push(applianceLowerCase);
            }
        }
        filteredIngredients.sort(function(a, b) {
            return a.localeCompare(b);
        });
        filteredUstensils.sort(function(a, b) {
            return a.localeCompare(b);
        });
        filteredAppliances.sort(function(a, b) {
            return a.localeCompare(b);
        });
        displayIngredients(filteredIngredients);
        displayUstensils(filteredUstensils);
        displayAppliances(filteredAppliances);

        return;
    }
  
    for (let i = 0; i < results.length; i++) {
        const recipe = results[i];
        const recipeModel = recipeFactory(recipe);
        const recipeDOM = recipeModel.getRecipeDOM();
        searchResultsDiv.appendChild(recipeDOM);
    }
}

function displayIngredients(ingredients){
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = "";

    for (const ingredient of ingredients) {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = ingredient;
        div.onclick = () => addTag('ingredient', div.innerHTML);

        ingredientsList.appendChild(div);
    }
}

function displayAppliances(appliances){
    const appliancesList = document.getElementById('appliances-list');
    appliancesList.innerHTML = "";

    for (const appliance of appliances) {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = appliance;
        div.onclick = () => addTag('appliance', div.innerHTML);

        appliancesList.appendChild(div);
    }
}

function displayUstensils(ustensils){
    const ustensilsList = document.getElementById('ustensils-list');
    ustensilsList.innerHTML = "";

    for (const ustensil of ustensils) {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = ustensil;
        div.onclick = () => addTag('ustensil', div.innerHTML);

        ustensilsList.appendChild(div);
    }
}

function openDropdownMenu(type){

    const filters = document.querySelectorAll('.filter');
    const ingredientsDOM = document.getElementById(`${type}-filter`);

    if(ingredientsDOM.classList.contains('active')) {
        ingredientsDOM.classList.remove('active');
    } else {
        filters.forEach(filter => {
            if (filter.classList.contains('active')) {
                filter.classList.remove('active');
            }
        });
        ingredientsDOM.classList.add('active');
    }
}

function addTag(tagType, value) {
    let tags = null;

    switch (tagType){
        case 'ingredient':
            tags = tagIngredients;
            break;
        case 'appliance':
            tags = tagAppliances;
            break;
        case 'ustensil':
            tags = tagUstensils;
            break;
    }

    if(!tags.includes(value.toLowerCase())) {
        tags.push(value.toLowerCase());
    }

    updateTags();
    filterRecipes();
}

function deleteTag(tagType, tagValue) {
    let tags = null;

    switch (tagType){
        case 'ingredient':
            tags = tagIngredients;
            break;
        case 'appliance':
            tags = tagAppliances;
            break;
        case 'ustensil':
            tags = tagUstensils;
            break;
        default:
            return;
    }
    const index = tags.indexOf(tagValue.toLowerCase());
    if (index !== -1) tags.splice(index, 1);

    updateTags();
    filterRecipes();
}