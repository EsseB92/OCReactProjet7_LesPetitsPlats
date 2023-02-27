// Initialisation d'une liste vide pour stocker les recettes filtrées
let filteredRecipes = [];
let filteredIngredients = [];
let filteredAppliances = [];
let filteredUstensils = [];
let tagIngredients = [];
let tagAppliances = [];
let tagUstensils = [];
let currentSearch = '';

window.onload = function(){
    filterRecipes();
}

// Fonction permettant de filtrer les recettes en fonction de la saisie de l'utilisateur
function filterRecipes(searchInput = currentSearch) {
    currentSearch = searchInput.toLowerCase().trim();
    // Effaçage de la liste des recettes filtrées
    filteredRecipes = [];
    filteredIngredients = [];
    filteredAppliances = [];
    filteredUstensils = [];

    // Vérification si l'entrée de recherche de l'utilisateur comporte au moins 3 caractères
    if(currentSearch.length < 3 && tagIngredients.length === 0 && tagAppliances.length === 0 && tagUstensils.length === 0) {
        updateUI([]);
        return;
    }

    // Recherche dans toutes les recettes existantes
    for (const recipe of allRecipes) {
        let isIngredientsOk = false;
        let isUstensilsOk = false;
        let isApplianceOk = false;
        
        if (
            (recipe.name.toLowerCase().includes(currentSearch) || recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).includes(currentSearch) || recipe.description.toLowerCase().includes(currentSearch))
        ) {
            if (
                tagIngredients.every(ingredient => recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).includes(ingredient)) &&
                tagUstensils.every(ustensil => recipe.ustensils.map(obj => obj.toLowerCase()).includes(ustensil)) &&
                (tagAppliances.includes(recipe.appliance.toLowerCase()) || tagAppliances.length === 0)
            ){
                console.log(recipe);
                filteredRecipes.push(recipe);
            }

            // if (tagIngredients.every(ingredient => recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).includes(ingredient))){
            //     isIngredientsOk = true;
            //     for (const ingredient of recipe.ingredients) {
            //         if (!filteredIngredients.includes(ingredient.ingredient.toLowerCase())) {
            //             filteredIngredients.push(ingredient.ingredient.toLowerCase());
            //         }
            //     }
            // }
            // if (tagUstensils.every(ustensil => recipe.ustensils.map(obj => obj.toLowerCase()).includes(ustensil)) && isIngredientsOk){
            //     isUstensilsOk = true;
            //     for (const ustensil of recipe.ustensils) {
            //         if (!filteredUstensils.includes(ustensil.toLowerCase())) {
            //             filteredUstensils.push(ustensil.toLowerCase());
            //         }
            //     }
            // }
            // if ((tagAppliances.includes(recipe.appliance.toLowerCase()) || tagAppliances.length === 0) && isIngredientsOk && isUstensilsOk){
            //     isApplianceOk = true;
            //     if (!filteredAppliances.includes(recipe.appliance.toLowerCase())) {
            //         filteredAppliances.push(recipe.appliance.toLowerCase());
            //     }
            // }
            // if (isIngredientsOk && isUstensilsOk && isApplianceOk) {
            //     console.log(recipe);
            //     filteredRecipes.push(recipe);
            // }
        }
    }

    for (const recipe of filteredRecipes) {
        for (const ingredient of recipe.ingredients) {
            if (!filteredIngredients.includes(ingredient.ingredient.toLowerCase())) {
                filteredIngredients.push(ingredient.ingredient.toLowerCase());
            }
        }
        for (const ustensil of recipe.ustensils) {
            if (!filteredUstensils.includes(ustensil.toLowerCase())) {
                filteredUstensils.push(ustensil.toLowerCase());
            }
        }
        if (!filteredAppliances.includes(recipe.appliance.toLowerCase())) {
            filteredAppliances.push(recipe.appliance.toLowerCase());
        }
    }

    

    filteredIngredients = filteredIngredients.filter(element => !tagIngredients.includes(element));
    filteredUstensils = filteredUstensils.filter(element => !tagUstensils.includes(element));
    filteredAppliances = filteredAppliances.filter(element => !tagAppliances.includes(element));

    filteredIngredients.sort(function (a, b) { return a.localeCompare(b)});
    filteredUstensils.sort(function (a, b) { return a.localeCompare(b); });
    filteredAppliances.sort(function (a, b) { return a.localeCompare(b); });
    displayIngredients(filteredIngredients);
    displayUstensils(filteredUstensils);
    displayAppliances(filteredAppliances);

    if(filteredRecipes.length === 0) {
        noUI();
        return;
    } 

    updateUI(filteredRecipes);
}



function updateTags() {
    let tagsDiv = document.getElementById("tags");
    tagsDiv.innerText = '';

    // Ajout des ingrédients dans la liste des tags
    for (const ingredient of tagIngredients) {
        tagsDiv.innerHTML += `
            <div class="tag ingredients-tag">
                <span class="tag__text">${ingredient}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ingredient', '${ingredient.replace("'", "\\'")}')"></i>
            </div>
        `;
    }

    // Ajout des appareils dans la liste des tags
    for (const appliance of tagAppliances) {
        tagsDiv.innerHTML += `
            <div class="tag appliances-tag">
                <span class="tag__text">${appliance}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('appliance', '${appliance.replace("'","\\'")}')"></i>
            </div>
        `;
    }

    // Ajout des ustensiles dans la liste des tags
    for (const ustensil of tagUstensils) {
        tagsDiv.innerHTML += `
            <div class="tag ustensils-tag">
                <span class="tag__text">${ustensil}</span>
                <i class="fa-regular fa-circle-xmark tag__icon" onclick="deleteTag('ustensil', '${ustensil.replace("'","\\'")}')"></i>
            </div>
        `;
    }
}

// Fonction permettant de mettre à jour l'interface utilisateur avec un simple message "d'erreur"
function noUI(){
    console.log("NoUI");
    let searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "No results found. You can try searching for 'apple pie', 'fish', etc.";
}

// Fonction permettant d'affiner les résultats de la recherche en fonction des champs de recherche avancée
function refineSearch(input, id) {
    // Initialisation d'une nouvelle liste pour stocker les résultats de la recherche affinée
    let refinedResults = [];

    switch (id){
        case 'ingredients-input':
            for (const ingredient of filteredIngredients) {
                if (ingredient.includes(input.toLowerCase())) {
                    refinedResults.push(ingredient);
                }
            }
            displayIngredients(refinedResults);
            break;
        case 'appliances-input':
            for (const appliance of filteredAppliances) {
                if (appliance.includes(input.toLowerCase())) {
                    refinedResults.push(appliance);
                }
            }
            displayAppliances(refinedResults);
            break;
        case 'ustensils-input':
            for (const ustensil of filteredUstensils) {
                if (ustensil.includes(input.toLowerCase())) {
                    refinedResults.push(ustensil);
                }
            }
            displayUstensils(refinedResults);
            break;
    }


  
    // // Comparation de la saisie de l'utilisateur avec les informations contenues dans la liste des recettes filtrées
    // for (let i = 0; i < filteredRecipes.length; i++) {
    //     let recipe = filteredRecipes[i];
  
    //     // Vérification si la saisie de l'utilisateur correspond aux ingrédients, aux ustensiles ou aux appareils de la recette.
    //     if (recipe.ingredients.includes(ingredientsInput) || recipe.utensils.includes(utensilsInput) || recipe.appliance.includes(appliancesInput)) {
    //         // Ajout la recette à la liste des résultats affinés
    //         refinedResults.push(recipe);
    //     }
    // }
    // Mise à jour de l'interface utilisateur avec la liste des résultats affinés
    //updateUI(refinedResults);
}

// Fonction permettant de mettre à jour l'interface utilisateur avec les résultats de la recherche
function updateUI(results) {
    // Effaçage des résultats de recherche actuels de l'interface utilisateur
    let searchResultsDiv = document.getElementById("recipes");
    searchResultsDiv.innerHTML = "";
    console.log(results);
    
    // Vérification s'il y a des résultats personnalisés
    if (results.length === 0) {
        // MAJ des recettes
        allRecipes.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        for (let i = 0; i < allRecipes.length; i++) {
            const recipe = allRecipes[i];
            const recipeModel = recipeFactory(recipe);
            const recipeDOM = recipeModel.getRecipeDOM();
            searchResultsDiv.appendChild(recipeDOM);
        }
        // MAJ des ingrédients, ustensiles et appareils
        for (const recipe of allRecipes) {
            for (const ingredient of recipe.ingredients) {
                if (!filteredIngredients.includes(ingredient.ingredient.toLowerCase())) {
                    filteredIngredients.push(ingredient.ingredient.toLowerCase());
                }
            }
            for (const ustensil of recipe.ustensils) {
                if (!filteredUstensils.includes(ustensil.toLowerCase())) {
                    filteredUstensils.push(ustensil.toLowerCase());
                }
            }
            if (!filteredAppliances.includes(recipe.appliance.toLowerCase())) {
                filteredAppliances.push(recipe.appliance.toLowerCase());
            }
        }
        filteredIngredients.sort(function (a, b) { return a.localeCompare(b); });
        filteredUstensils.sort(function (a, b) { return a.localeCompare(b); });
        filteredAppliances.sort(function (a, b) { return a.localeCompare(b); });
        displayIngredients(filteredIngredients);
        displayUstensils(filteredUstensils);
        displayAppliances(filteredAppliances);

        return;
    }
  
    // Affichage des résultats de la recherche dans l'interface utilisateur
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
    const filters = document.getElementsByClassName('filter');
    const ingredientsDOM = document.getElementById(`${type}-filter`);

    if(ingredientsDOM.classList.contains('active')){
        ingredientsDOM.classList.remove('active');
    }else{
        for(let i = 0; i < filters.length; i++)
            filters[i].classList.remove('active');

        ingredientsDOM.classList.add('active');
    }
}

function addTag(type, value) {
    switch (type){
        case 'ingredient':
            if(!tagIngredients.includes(value.toLowerCase())) {
                tagIngredients.push(value.toLowerCase());
            }
            break;
        case 'appliance':
            if(!tagAppliances.includes(value.toLowerCase())) {
                tagAppliances.push(value.toLowerCase());
            }
            break;
        case 'ustensil':
            if(!tagUstensils.includes(value.toLowerCase())) {
                tagUstensils.push(value.toLowerCase());
            }
            break;
    }
    updateTags();
    filterRecipes();
}

function deleteTag(type, value) {
    let index = -1;
    // Suppression du tag correspondant
    switch (type){
        case 'ingredient':
            index = tagIngredients.indexOf(value.toLowerCase());
            if (index !== -1) {
                tagIngredients.splice(index, 1);
            }
            filteredIngredients.push(value);
            filteredIngredients.sort(function (a, b) { return a.localeCompare(b); })
            break;
        case 'appliance':
            index = tagAppliances.indexOf(value.toLowerCase());
            if (index !== -1) {
                tagAppliances.splice(index, 1);
            }
            filteredAppliances.push(value);
            filteredAppliances.sort(function (a, b) { return a.localeCompare(b); })
            break;
        case 'ustensil':
            index = tagUstensils.indexOf(value.toLowerCase());
            if (index !== -1) {
                tagUstensils.splice(index, 1);
            }
            filteredUstensils.push(value);
            filteredUstensils.sort(function (a, b) { return a.localeCompare(b); })
            break;
    }
    updateTags();
    filterRecipes();
}

function filters(){
    filteredRecipes = [];
    if (currentSearch.length < 3) {
        currentSearch = "";
    } 
    
    else if(currentSearch == "" && tagIngredients.length == 0 && tagAppliances.length == 0 && tagUstensils.length == 0) {
        filteredRecipes = allRecipes;
    } else {
        for (const recipe of allRecipes) {
            let isDisplayable = true;
            if(currentSearch != "") {
                const containIngredient = recipe.ingredients.findIndex(list => list.ingredient.toLowerCase().includes(currentSearch));

                if (!recipe.name.toLowerCase().includes(currentSearch) && !recipe.description.includes(currentSearch) && containIngredient == -1) {
                    isDisplayable = false;
                }
            }

            console.log(recipe);

            if(tagIngredients.length < 0){
                for (const tag of tagIngredients) {
                    const containIngredient = recipe.ingredients.findIndex(list => list.ingredient.includes(tag));
                    if(containIngredient == -1 && isDisplayable)
                        isDisplayable = false;
                };
            }

            if(tagAppliances.length < 0){
                for (const tag of tagAppliances) {
                    if(!recipe.appliance.includes(tag) && isDisplayable)
                        isDisplayable = false;
                };
            }

            if(tagUstensils.length < 0){
                for (const tag of tagUstensils) {
                    const containUstensil = recipe.ustensils.findIndex(list => list.includes(tag));
                    if(containUstensil == -1 && isDisplayable)
                        isDisplayable = false;
                }
            }

            if(isDisplayable)
                filteredRecipes.push(recipe);
        };
    }

    filteredIngredients = [];
    filteredAppliances = [];
    filteredUstensils = [];

    for (const recipe of filteredRecipes) {

        for (const ingredient of recipe.ingredients) {
            if(!filteredIngredients.includes(ingredient.ingredient))
                filteredIngredients.push(ingredient.ingredient);
        };

        if(!filteredAppliances.includes(recipe.appliance))
            filteredAppliances.push(recipe.appliance)

        for (const ustensil of recipe.ustensils) {
            if(!filteredUstensils.includes(ustensil))
                filteredUstensils.push(ustensil);
        };
    };

    updateUI(filteredRecipes);
}