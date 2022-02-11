import * as model from './model.js';
import { MODAL_CLOSE } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';



import 'core-js/stable';
import 'regenerator-runtime/runtime';


// if(module.hot){
//   module.hot.accept()
// }


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1)
    if(!id) return
    recipeView.renderSpinner()

    resultView.update(model.getSearchResultPage())
    
    bookmarksView.update(model.state.bookmarks)
    
    // 1) loading recipe
    await model.loadRecipe(id)
    const {recipe} = model.state
    
    // 2) redering recipe
    recipeView.render(recipe)


  } catch (error) {
    recipeView.renderError()
    console.log(error)
  }
}

controlRecipes()

const controlSearchResults = async function(){
  // resultView.renderSpinner(recipeContainer)
  try {
    const query = searchView.getQuery()
    if(!query) return

    await model.loadSearchResult(query)

    // console.log(model.state.search.results)
    resultView.render(model.getSearchResultPage())
    paginationView.render(model.state.search)
  } catch (error) {
    console.log(error)
  }
}

controlSearchResults()

const controlPagination = function(goToPage){
    // render new results
    resultView.render(model.getSearchResultPage(goToPage))

    // render new pagination
    paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  // update the recipe servings(in state)
  model.updateServings(newServings)

  // update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function(){
  // Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // Update recipe view
  recipeView.update(model.state.recipe)

  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try {
    // show loading spinner
    addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    // render recipe
    recipeView.render(model.state.recipe)

    // success message
    addRecipeView.renderMessage()

    // render bookmark view
    bookmarksView.render(model.state.bookmarks)

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE*1000)
  } catch (error) {
    addRecipeView.renderError(error.message)
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerNavigatePage(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  // controlServings();
}
init()
