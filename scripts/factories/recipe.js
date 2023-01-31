function recipeFactory(data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data;

    function getRecipeDOM() {
        const article = document.createElement( 'article' );
        article.className = 'recipe';

        const div_img = document.createElement( 'div' );
        div_img.className = 'recipe__image';

        const div_header = document.createElement( 'div' );
        div_header.className = 'recipe__header';

        const p_name = document.createElement( 'p' );
        p_name.className = 'recipe__name';
        p_name.textContent = name;

        const div_duration = document.createElement( 'div' );
        div_duration.className = 'recipe__duration';

        const i = document.createElement( 'i' );
        i.classList.add('fa-regular', 'fa-clock');

        const span_time = document.createElement( 'span' );
        span_time.className = 'recipe__time';
        span_time.textContent = `${time} min`;

        const div_footer = document.createElement( 'div' );
        div_footer.className = 'recipe__footer';

        const div_foods = document.createElement( 'div' );
        div_foods.className = 'recipe__foods';

        for(let i = 0; i < ingredients.length; i++){
            const p_food = document.createElement( 'p' );
            p_food.className = 'recipe__food';
            p_food.innerHTML = `<b class="recipe__food--bold">${ingredients[i].ingredient}</b>${quantity(ingredients[i].quantity)}${unit(ingredients[i].unit)}`;
            
            div_foods.appendChild(p_food);
        }

        const p_desc = document.createElement( 'p' );
        p_desc.className = 'recipe__desc';
        p_desc.textContent = description;

        div_duration.appendChild(i);
        div_duration.appendChild(span_time);

        div_header.appendChild(p_name);
        div_header.appendChild(div_duration);

        div_footer.appendChild(div_foods);
        div_footer.appendChild(p_desc);

        article.appendChild(div_img);
        article.appendChild(div_header);
        article.appendChild(div_footer);
        
        return article;
    }

    return {getRecipeDOM}
}

function quantity(quantity){
    if(!quantity){
        return "";
    } else {
        return `: ${quantity}`
    }
}
function unit(unit){
    if(!unit){
        return "";
    }
    switch (unit) {
        case 'grammes':
        case 'gramme':
        case 'g':
            return "g";
        case 'litres':
        case 'Litres':
        case 'litre':
        case 'l':
            return "l";
        case 'ml':
        case 'cl':
        case 'kg':
            return unit;
        default:
            return ` ${unit}`;
    }

}