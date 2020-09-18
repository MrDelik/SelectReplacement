/**
 * Select Replacement
 * Select replacement is a simple component to be able to design a selectbox
 * while maintaining the normal API for smartphones
 * To work properly, the select node MUST be a child of the specified selector (.select-replacement by default)
 * Now support multiple select like tags
 */
class SelectReplacement{
    constructor( params = {} ){
        this.params = {
            selector: '.select-replacement',
            placeholderSelector: '.select-replacement-placeholder',
            optionsContainerSelector: '.select-replacement-options',
            optionsListSelector: '.select-replacement-options-list',
            optionSelector: '.select-replacement-option',
            optionsRemoverSelector: '.select-replacement-option-remover',
            badgeTemplateSelector: '#selectMultipleBadgeTemplate',
            badgeSelector: '.badge',
            badgeTextSelector: '.badge-text',
            openClass: 'open',
            emptyClass: 'empty',
            noMoreOptionsClass: 'noMore',
            selectReplacementOptionHideClass: 'hide',
            visibleOptions: 5
        };

        for(let param in params){
            if( param in this.params ){
                this.params[param] = params[param];
            }
        }

        this.removeOptionBinded = e => this.removeOption(e);

        document.querySelectorAll( this.params.selector+' select' ).forEach(( selectNode ) => {
            selectNode.selectReplacementInst = this;

            if( selectNode.multiple ){
                selectNode.parentNode.addEventListener('mousedown', e => this.open(e));
            }
            else{
                selectNode.addEventListener('mousedown', e => this.open(e));
            }

            if( selectNode.multiple && selectNode.selectedOptions.length > 0 ){
                let badgesFrag = this.createBadges( selectNode.selectedOptions );
                selectNode.nextElementSibling.appendChild(badgesFrag);
            }
        });

        document.querySelectorAll( this.params.optionsContainerSelector ).forEach(( optionsContainer ) => {
            optionsContainer.addEventListener('mousedown', (e) => e.stopImmediatePropagation());
            optionsContainer.addEventListener('click', e => this.selectOption(e));
        });
    }

    /**
     *
     * @param e
     */
    open( e ) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if( e.buttons === 1  ){
            let parent = e.target.closest(this.params.selector);
            let select = parent.querySelector('select');

            if (parent.classList.contains(this.params.openClass)) {
                this.close( parent.querySelector( this.params.optionsContainerSelector ), this );
            }
            else {
                parent.classList.add(this.params.openClass);

                let optionsLength = select.multiple ? parent.querySelectorAll(this.params.optionSelector+':not(.'+this.params.selectReplacementOptionHideClass+')').length : select.options.length;
                let visibleOptions = this.params.visibleOptions > optionsLength ? optionsLength : this.params.visibleOptions;
                let option = parent.querySelector(this.params.optionSelector+':not(.'+this.params.selectReplacementOptionHideClass+')');
                let optionHeight = 0;

                let optionContainer = parent.querySelector(this.params.optionsListSelector);
                let heightToAdd = 0;
                if( optionContainer !== null ){
                    let padding = window.getComputedStyle(optionContainer).getPropertyValue('padding');
                    heightToAdd = parseInt(padding);
                }

                let heightToGo;
                let openOptions = parent.querySelector(this.params.optionsContainerSelector);

                if (option !== null) {
                    optionContainer.classList.remove(this.params.noMoreOptionsClass);
                    optionHeight = option.offsetHeight;
                    heightToGo = visibleOptions * optionHeight + (heightToAdd*2)
                    heightToGo += 'px';
                }
                else {
                    optionContainer.classList.add(this.params.noMoreOptionsClass);
                    openOptions.classList.add('noMore');
                    heightToGo = 'auto';
                }

                openOptions.style.height = heightToGo;
                document.body.addEventListener('mousedown', () => {
                    this.close(openOptions, this)
                }, {once: true});
            }
        }
    }

    /**
     * Select an option from the select
     * @param e
     */
    selectOption( e ){
        if( !e.target.classList.contains(this.params.noMoreOptionsClass) &&
            !e.target.classList.contains(this.params.optionsListSelector) ){
            let parent = e.target.closest(this.params.selector);
            let select = parent.querySelector('select');
            let optionsList = parent.querySelector(this.params.optionsListSelector);

            if( select.multiple ){
                let optionIndex = this.getValueIndex(e.target);
                let selectedOption = select.options[optionIndex];

                if( selectedOption.value === e.target.dataset.value ){
                    selectedOption.selected = true;

                    let badge = this.createBadge(select.options[optionIndex], optionIndex);
                    select.nextElementSibling.appendChild(badge);
                    this.hideOption( e.target );

                    let visibleOptions = optionsList.querySelectorAll(this.params.optionSelector+':not(.'+this.params.selectReplacementOptionHideClass+')').length
                    if( visibleOptions === 0 ){
                        this.close(optionsList.parentNode, this);
                    }
                    else if( visibleOptions < this.params.visibleOptions ){
                        this.calculateHeight(optionsList);
                    }
                }
            }
            else{
                select.value = e.target.dataset.value;
                this.close( optionsList.parentNode, this);
            }
        }
    }

    /**
     * Get the option index in the parent
     * @param elem
     * @returns {number}
     */
    getValueIndex( elem ){
        let parent = elem.closest(this.params.optionsListSelector);
        return Array.from(parent.children).indexOf(elem);
    }

    /**
     * remove the option from the placeholder
     * @param e
     */
    removeOption( e ){
        e.preventDefault();
        e.stopImmediatePropagation();

        let button = e.target.closest(this.params.optionsRemoverSelector);
        let select = e.target.closest(this.params.selector).querySelector('select');

        select.options[button.value].selected = false;
        let optionsList = button.closest(this.params.selector).querySelector(this.params.optionsListSelector);
        optionsList.classList.remove(this.params.noMoreOptionsClass);
        let placeholder = button.closest(this.params.placeholderSelector);
        button.closest(this.params.badgeSelector).remove();

        if( placeholder.children.length === 0 ){
            placeholder.innerHTML = '';
        }

        this.showOption(optionsList.children[button.value]);
        if( optionsList.parentNode.clientHeight != 0 ){
            this.calculateHeight( optionsList );
        }
    }

    /**
     * Show a hidden option
     * @param option
     */
    showOption(option){
        option.classList.remove(this.params.selectReplacementOptionHideClass);
    }

    /**
     * Hide a given option
     * @param option
     */
    hideOption( option ){
        option.classList.add(this.params.selectReplacementOptionHideClass);
    }

    /**
     * Wrapper to create badges on instanciation
     * @param options
     * @returns {DocumentFragment}
     */
    createBadges( options ){
        let template = document.querySelector(this.params.badgeTemplateSelector);
        if( template !== null ){
            let docFrag = document.createDocumentFragment();
            options.forEach((option, optionIndex) => {
                let badge = this.createBadge(option, optionIndex, template);
                docFrag.appendChild(badge);
            });

            return docFrag;
        }
    }

    /**
     * Create the badge and return it
     * @param option
     * @param optionIndex
     * @param template
     * @returns {*}
     */
    createBadge( option, optionIndex, template = null){
        template = template === null ? document.querySelector(this.params.badgeTemplateSelector).content.cloneNode(true) : template;

        template.querySelector(this.params.badgeTextSelector).textContent = option.text.trim();

        let optionRemover = template.querySelector(this.params.optionsRemoverSelector);
        optionRemover.value = optionIndex;
        optionRemover.addEventListener( 'mousedown', e => e.stopPropagation() );
        optionRemover.addEventListener( 'mouseup', e => e.stopPropagation() );
        optionRemover.addEventListener( 'click', this.removeOptionBinded );

        return template;
    }

    /**
     * Calculate the height
     * @param optionsList
     */
    calculateHeight( optionsList ){
        let visibleOptions = optionsList.querySelectorAll(this.params.optionSelector+':not(.'+this.params.selectReplacementOptionHideClass+')');

        if( visibleOptions.length > 0 ){
            let padding = window.getComputedStyle(optionsList).getPropertyValue('padding');
            let heightToAdd = parseInt(padding);
            let multiplicator = visibleOptions.length > this.params.visibleOptions ? this.params.visibleOptions : visibleOptions.length;

            let height = (heightToAdd * 2) + (visibleOptions[0].offsetHeight * multiplicator);

            optionsList.parentNode.style.height = height + 'px';
        }
        else{
            this.close(optionsList.closest(this.params.optionsContainerSelector), this);
        }
    }

    /**
     * Close the Select replacement
     * @param nodeToClose
     * @param inst
     */
    close( nodeToClose, inst ){
        nodeToClose.style.height = '0';
        nodeToClose.closest( inst.params.selector ).classList.remove( inst.params.openClass );
    }
}

export default SelectReplacement;