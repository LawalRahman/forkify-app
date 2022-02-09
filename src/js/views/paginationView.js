import View from "./view";
import icons from '../../img/icons.svg';
import {Fraction} from 'fractional';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination')

    addHandlerNavigatePage(handler){
        this._parentElement.addEventListener('click', function(e){
            const target = e.target.closest('.btn--inline')
            if(!target) return

            const goToPage = +target.dataset.goto

            handler(goToPage)
        })
    }

    _generateMarkUp(){
        const currentPage = this._data.page
        const numOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
        
        if(currentPage === 1 && numOfPages > 1){
            return `
            <button data-goto = "${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }
        if(currentPage === numOfPages && numOfPages > 1){
            return `
                <button data-goto = "${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `
        }
        if(currentPage < numOfPages){
            return `
                <button data-goto = "${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
                <button data-goto = "${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }
        return ''
    }
}

export default new PaginationView()