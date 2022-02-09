import View from "./view";
import icons from '../../img/icons.svg';
import {Fraction} from 'fractional';

class PreviewView extends View{
    _parentElement = ''


    // _generateMarkUp(){
    //     return this._data.map(this._generateMarkUpPreview).join('')
    // }

    _generateMarkUp(){
        const id = window.location.hash.slice(1)
        return `
            <li class="preview">
                <a class="preview__link ${ this._data.id === id ? 'preview__link--active' : ''}" href="#${this._data.id}">
                <figure class="preview__fig">
                    <img src="${this._data.image}" alt="${this._data.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">${this._data.publisher}</p>
                </div>
                </a>
          </li>
        `
    }
}

export default new PreviewView()