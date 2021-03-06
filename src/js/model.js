import { async } from "regenerator-runtime";
import { API_KEY, API_URL, PAGE_LENGTH } from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: PAGE_LENGTH,
        page: 1
    },
    bookmarks: []
}

const createRecipeObject = function (data) {
    const { recipe } = data.data
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`)

        state.recipe = createRecipeObject(data)

        if (state.bookmarks.some(bm => bm.id === id))
            state.recipe.bookmarked = true
        else
            state.recipe.bookmarked = false
    } catch (error) {
        throw error
    }
}

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query
        const data = await getJSON(`${API_URL}?search=${query}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })
        state.search.page = 1
    } catch (error) {
        throw error
    }
}

export const getSearchResultPage = function (page = state.search.page) {
    state.search.page = page
    const start = (page - 1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage
    return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(element => {
        element.quantity = (element.quantity * newServings) / state.recipe.servings
    });

    state.recipe.servings = newServings
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}


export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe)

    // mark current recipe as boookmarked
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true

    persistBookmarks()
}

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id)
    // delete bookmark
    state.bookmarks.splice(index, 1)
    // mark current recipe as not boookmarked
    if (id === state.recipe.id)
        state.recipe.bookmarked = false

    persistBookmarks()
}

const init = function () {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}
init();


const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => {
            return entry[0].startsWith('ingredient') && entry[1] !== ''
        }).map(ing => {
            const ingArr = ing[1].replaceAll(' ', '').split(',')

            if (ingArr.length !== 3) throw new Error('Wrong ingredient format')

            const [quantity, unit, description] = ingArr

            return { quantity: quantity ? +quantity : null, unit, description }
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }
        const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe)

        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe)
        console.log(data)
    } catch (error) {
        throw error
    }


    // console.log(ingredients)
}