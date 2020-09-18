# SelectReplacement
The SelectReplacement ES6 components was made to use the select with the possibility to add css style that is not usable with the classic select.

The major point of the SelectReplacement is that it allows ytou to use your own UI.

The use of a classic select node is due to be able to use the normal API on smartphone because those devices have their own way to deal with select.

## Instanciation
Like all other ES6 components you just have to import it and instanciate it with the __new__ keyword.

```javascript
import SelectReplacement from "./components/SelectReplacement.js";

new SelectReplacement({params});
```

## Structure
The SelectReplacement has been created to give to the user a maximum of possibilities concerning the UI. Unfortunately we're forced to respect a minimum of HTML structure to be sure that the component works properly.
* .select-replacement
    * select node itself
        *   option
    * .select-replacement-placeholder
    * .select-replacement-arrow
    * .select-replacement-options
        * .select-replacement-options-list
            *select-replacement-option

## Parameters
The SelectReplacement has some parameters that can be used but it's the most of the time just selector to select node.
* selector : `string`
    * The selector of the parent node to use. By default it's **.select-replacement**
* placeholderSelector : `string`
    * In the multiple mode the SelectReplacement need a placeholder like an input placholder. It's that selector. By default it's **.select-replacement-placeholder**
* optionsContainerSelector : `string`
    * Like you can see in the structure this node is to be able to animate with a padding on the options list
* optionsListSelector : `string`
    * The options container. usually an ul
* optionSelector : `string`
    * The option replacement
* optionsRemoverSelector : `string`
    * In case of a multiple select the system used is like a tag. This selector is the remover selector for the options selected
* badgeTemplateSelector : `string`
    * In a multiple select the system used is like a badge. This selector is the template selector containing the badge
* badgeSelector : `string`
    * Selector of the badge itself
* badgeTextSelector : `string`
    * selector of the text container inside the badge
* openClass : `string`
    * the class used when the select is open (options visible)
* emptyClass : `string`
    * Class used when there is no option in the select
* noMoreOptionClass : `string`
    * Class used when there is no more option to select (in a multiple case)
* selectReplacementOptionHideClass : `string`
    * When in a multiple select this class is used to hide selected option in the list
* visibleOptions : `integer`
    * Define the number of visible options when the options list is open
    
## Methods
Normally you don't have to use methods for this component. Just instanciate it. But I may not think to every possibilities

* open : return `void`
     * Parameters : e `MouseEvent`
     * Function used in the mousedown event listener on the select if not in smartphone to open the select options list
* selectOption : return `void`
    * Parameters: e `MouseEvent`
    * Function used in the click event listener to select an option
* getValueIndex : return `integer`
    * Parameters : elem `HTMLElement`
    * Get the replacement option index in the parent
* removeOption : return `void`
     * Parameters : e `MouseEvent`
     * Function used in the click event listener to remove an option in case of multiple select
* showOption : return `void`
    * Parameters : option `HTMLElement`
    * Show an option in the list in case of multiple select
* hideOption : return `void`
    * Parameters : option `HTMLElement`
    * Hide an option in the list in case of multiple select
* createBadges : return docfrag `DocumentFragment`
     * Parameters : options `HTMLCollection`
     * create the badges corresponding to the selected options
* createBadge : return template `DocumentFragment`
    * Parameters : option `HTMLOptionElement`, optionIndex `integer`, template `HTMLTemplateElement`
    * Create a badge based on a sended option
* close : return `void`
    * Parameters : nodeToClose `HTMLElement`, inst `SelectReplacement`
    * Close an opened select
    
### Author
**Kevin Goyvaerts**
+ [http://github.com/MrDeliK](http://github.com/MrDeliK)