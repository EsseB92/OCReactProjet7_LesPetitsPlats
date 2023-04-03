let filteredRecipes = [], filteredIngredients = [], filteredAppliances = [], filteredUstensils = [], tagIngredients = [], tagAppliances = [], tagUstensils = [], currentSearch = '';

window.onload = function(){ filterRecipes(); }

function filterRecipes(searchInput = currentSearch) {
    currentSearch = searchInput.toLowerCase().trim();
    filteredRecipes = [];
    filteredIngredients = [];
    filteredAppliances = [];
    filteredUstensils = [];

    if (currentSearch.length < 3 && !tagIngredients.length && !tagAppliances.length && !tagUstensils.length) return updateUI([]);

    allRecipes.forEach(recipe => {
        if (
            (recipe.name.toLowerCase().includes(currentSearch) || recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).includes(currentSearch) || recipe.description.toLowerCase().includes(currentSearch))
        ) {
            if (
                tagIngredients.every(ingredient => recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).includes(ingredient)) &&
                tagUstensils.every(ustensil => recipe.ustensils.map(obj => obj.toLowerCase()).includes(ustensil)) &&
                (tagAppliances.includes(recipe.appliance.toLowerCase()) || !tagAppliances.length)
            ){
                filteredRecipes.push(recipe);
            }
        }
    });

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            if (!filteredIngredients.includes(ingredient.ingredient.toLowerCase())) {
                filteredIngredients.push(ingredient.ingredient.toLowerCase());
            }
        });
        recipe.ustensils.forEach(ustensil => {
            if (!filteredUstensils.includes(ustensil.toLowerCase())) {
                filteredUstensils.push(ustensil.toLowerCase());
            }
        });
        if (!filteredAppliances.includes(recipe.appliance.toLowerCase())) {
            filteredAppliances.push(recipe.appliance.toLowerCase());
        }
    })

    filteredIngredients = filteredIngredients.filter(element => !tagIngredients.includes(element)).sort((a, b) => a.localeCompare(b));
    filteredUstensils = filteredUstensils.filter(element => !tagUstensils.includes(element)).sort((a, b) => a.localeCompare(b));
    filteredAppliances = filteredAppliances.filter(element => !tagAppliances.includes(element)).sort((a, b) => a.localeCompare(b));
    
    displayIngredients(filteredIngredients);
    displayUstensils(filteredUstensils);
    displayAppliances(filteredAppliances);

    return filteredRecipes.length ? updateUI(filteredRecipes) : noUI();
}

function updateTags() {
    const tagsDiv = document.getElementById("tags");
    const html = tagIngredients.map(ingredient => `
        <div class="tag ingredients-tag">
            <span class="tag__text">${ingredient}</span>
            <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ingredient', '${ingredient.replace("'", "\\'")}')"></i>
        </div>
    `)
    .concat(tagAppliances.map(appliance => `
        <div class="tag appliances-tag">
            <span class="tag__text">${appliance}</span>
            <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('appliance', '${appliance.replace("'","\\'")}')"></i>
        </div>
    `))
    .concat(tagUstensils.map(ustensil => `
        <div class="tag ustensils-tag">
            <span class="tag__text">${ustensil}</span>
            <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ustensil', '${ustensil.replace("'","\\'")}')"></i>
        </div>
    `)).join('');

    tagsDiv.innerHTML = html;
}

function noUI(){
    const searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
}

function refineSearch(input, id) {
    let results = [];
    const inputTrimmed = input.trim().toLowerCase();
    switch (id){
        case 'ingredients-input':
            results = filteredIngredients.filter(ingredient => ingredient.includes(inputTrimmed));
            displayIngredients(results);
            break;
        case 'appliances-input':
            results = filteredAppliances.filter(appliance => appliance.includes(inputTrimmed));
            displayAppliances(results);
            break;
        case 'ustensils-input':
            results = filteredUstensils.filter(ustensil => ustensil.includes(inputTrimmed));
            displayUstensils(results);
            break;
    }
}

function updateUI(results) { 
    let searchResultsDiv = document.getElementById("recipes"); 
    searchResultsDiv.innerHTML = "";

    if (results.length === 0) {
        allRecipes.sort((a, b) => a.name.localeCompare(b.name));
        allRecipes.forEach((recipe) => {
            const recipeModel = recipeFactory(recipe);
            const recipeDOM = recipeModel.getRecipeDOM();
            searchResultsDiv.appendChild(recipeDOM);
            
            recipe.ingredients.forEach((ingredient) => {
                const ingredientLowerCase = ingredient.ingredient.toLowerCase();
                if (!filteredIngredients.includes(ingredientLowerCase)) {
                    filteredIngredients.push(ingredientLowerCase);
                }
            });
            
            recipe.ustensils.forEach((ustensil) => {
                const ustensilLowerCase = ustensil.toLowerCase();
                if (!filteredUstensils.includes(ustensilLowerCase)) {
                    filteredUstensils.push(ustensilLowerCase);
                }
            });
            
            const applianceLowerCase = recipe.appliance.toLowerCase();
            if (!filteredAppliances.includes(applianceLowerCase)) {
                filteredAppliances.push(applianceLowerCase);
            }
        });
        
        filteredIngredients.sort((a, b) => a.localeCompare(b));
        filteredUstensils.sort((a, b) => a.localeCompare(b));
        filteredAppliances.sort((a, b) => a.localeCompare(b));
        
        displayIngredients(filteredIngredients);
        displayUstensils(filteredUstensils);
        displayAppliances(filteredAppliances);
    
        return;
    }
    
    results.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeDOM = recipeModel.getRecipeDOM();
    
        searchResultsDiv.appendChild(recipeDOM);
    });
}

function displayIngredients(ingredients){
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = "";

    ingredients.forEach(ingredient => {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = ingredient;
        div.onclick = () => addTag('ingredient', div.innerHTML);
        ingredientsList.appendChild(div);
    });
}

function displayAppliances(appliances){
    const appliancesList = document.getElementById('appliances-list');
    appliancesList.innerHTML = "";

    appliances.forEach(appliance => {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = appliance;
        div.onclick = () => addTag('appliance', div.innerHTML);
        appliancesList.appendChild(div);
    });
        
}

function displayUstensils(ustensils){
    const ustensilsList = document.getElementById('ustensils-list');
    ustensilsList.innerHTML = "";

    ustensils.forEach(ustensil => {
        const div = document.createElement( 'div' );
        div.className = 'filter__item';
        div.textContent = ustensil;
        div.onclick = () => addTag('ustensil', div.innerHTML);
        ustensilsList.appendChild(div);
    });
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

function addTag(tagType, tagValue) {
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

    if(!tags.includes(tagValue.toLowerCase())) {
        tags.push(tagValue.toLowerCase());
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