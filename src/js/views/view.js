import icons from '../../img/icons.svg';

export default class View {
    _data
    render(data, render=true) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
        this._data = data
        const markUp = this._generateMarkUp()
        if(!render) return markUp
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }

    update(data) {
        // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
        this._data = data
        const markUp = this._generateMarkUp()
        
        // update dom by comparing new dom with old dom
        const newDom = document.createRange().createContextualFragment(markUp)
        const newElements = Array.from(newDom.querySelectorAll('*'))
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'))

        newElements.forEach((el, i) =>{
            const curEl = currentElements[i]

            // update changed text
            if(!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = el.textContent
            }

            // update changed attributes
            if(!el.isEqualNode(curEl)){
                Array.from(el.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value)
                })
            }
        })
    }

    _clear() {
        this._parentElement.innerHTML = ''
    }

    renderSpinner() {
        const spinnerMarkUp = `
              <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkUp)
    }

    renderError(message=this._errorMessage){
        const markUp = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
          `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }

    renderMessage(message=this._message){
        const markUp = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
          `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }
}