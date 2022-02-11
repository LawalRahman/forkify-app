import View from "./view";
import icons from '../../img/icons.svg';

class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload')
    _message = 'Recipe was successfully uploaded'
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor(){
        super();
        this._addHandlerOpenModal()
        this._addHandlerCloseModal()
        // this._addHandlerUpload()
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
    }

    _addHandlerOpenModal(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }
    _addHandlerCloseModal(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault()
            const dataArr = [...new FormData(this)]
            const data = Object.fromEntries(dataArr)
            handler(data)
        })
    }

    _generateMarkUp(){
    }
}

export default new AddRecipeView()