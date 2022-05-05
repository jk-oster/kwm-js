"use strict";
/*******************************************************
 *     Template Engine of kwmJS.
 *
 *     renderTemplate is a method to render any given Template into any given DOM-Container.
 *     Optional values argument serves for dynamic-data-storage.
 *
 *     - translates %{key}
 *     - inserts values of &{key} passed in DataObject
 *     - inserts other templates with <f:template name="templateName">{optionalKeyOfVarInDataObject}</f:template>
 *     - allows powerful templating with <% JS-Code-HERE %>, use of if|for|else|switch|case|break statements is possible
 *     - caches already compiled templates to minimize fetch requests and processing time
 *
 *     @param templatePath - Give me the relative path of your template from template folder
 *
 *     @author Jakob Osterberger - 2022-03-28
 *******************************************************/
export default class KWM_Templater {
    constructor(templatePath) {
        this.templatePath = templatePath;
        this.commentRegex = /<!--(.*?)-->/g
        this.langRegex = /%{(.*?)}/g;
        this.valueRegex = /&{(.*?)}/g;
        this.jsRegex = /<% ?(.*?) ?%>/g;
        this.templRegex = /<partial name=" ?(.*?) ?"> ?{?(.*?)}? ?<\/partial>/g;
        // Caches already compiled templates
        this.templateCache = new Map();
        this.valueCache = new Map();
    }

    /**
     * Renders specified template
     * @param templateName
     * @param container HTMLElement
     * @param values object
     * @param mode 'append' to append template, 'overwrite' to empty container before
     * @param comments 'true' to skip comments
     * @returns {Promise<void>}
     */
    async renderTemplate(templateName, container, values = false, mode = 'overwrite', comments = false) {
        if (!container) {
            console.error(container);
            throw new Error(`no valid container ${container} specified for rendering : '${templateName}'`);
        }
        const htmlString = await this.insertTemplate(templateName, values, comments);
        if (mode === "append") container.innerHTML += htmlString;
        else container.innerHTML = htmlString;
    }

    /**
     * Gets template by name and compiles to HtmlString
     * @param templateName
     * @param values
     * @param comments
     * @returns {Promise<unknown>}
     */
    async insertTemplate(templateName, values, comments) {
        if (this.templateCache.get(templateName) && JSON.stringify(values) === JSON.stringify(this.valueCache.get(templateName))) {
            console.info('Template cache has been used');
            return this.templateCache.get(templateName);
        } else {
            console.info('New template has been fetched');
            const templateString = await fetch(this.templatePath + templateName + ".tpl?v=0.2").then(response => response.text());
            if (!templateString || typeof templateString !== 'string') throw new Error(`template '${templateName}' invalid: ${templateString}`);
            const result = await this.translateTemplateValues(templateString, values, comments);
            this.templateCache.set(templateName, result);
            this.valueCache.set(templateName, values);
            return result;
        }
    }

    /**
     * Takes a template and compiles to HtmlString
     * @param template
     * @param values
     * @param comments
     * @returns {Promise<KWM_Templater.compileJsTemplate>}
     */
    async translateTemplateValues(template, values, comments = kwm.conf.debugMode) {
        let result = template;
        // compile JavaScript in template
        result = await this.compileJsTemplate(result, values, comments);
        // insert other templates (optional specify which data to pass in)
        for (const match of result.matchAll(this.templRegex)) {
            result = result.replace(match[0],
                await this.insertTemplate(match[1], (match[2] ? this.insertValue(match[2], values) : values), comments));
        }
        // translate keys
        for (const match of result.matchAll(this.langRegex)) {
            result = result.replace(match[0], kwm.translator.translate(match[1]));
        }
        // insert data for keys
        for (const match of result.matchAll(this.valueRegex)) { // Insert data
            result = result.replace(match[0], this.insertValue(match[1], values));
        }
        // Remove comments
        if (!comments) {
            for (const match of result.matchAll(this.commentRegex)) {
                result = result.replace(match[0], this.insertValue(match[1], ''));
            }
        }
        return result;
    }

    insertValue(key, values) {
        if (!values) return ` --Missing data: values property is "${values}"-- `;
        if (!key in values) return ` --Missing data: non_existing_key "${key}"-- `;
        return values[key];
    }

    /**
     * Takes template with JS functions and compiles to HtmlString,
     * allows the following control structures: if|for|else|switch|case|break
     * - allows execution of JS-Functions inside the script
     * - e.q: <% if(this.check) { for(const a of this.arr){ %><a href="#"><% a %><% }} %>
     * - e.q: <% console.log(this) %>
     * - e.q: <% this.id %>
     * - e.q: <% this.arr.reduce((a,b) => a+b) %>
     * - e.q: <% this.arr.map(a => '<p>' + a + '</p>').join('') %>
     *
     * @param template template Html string to be compiled
     * @param data object to be used as 'this' in the compiled js
     * @param comments - if false html comments are removed
     */
    compileJsTemplate(template, data, comments) {
        let lastIndex = 0;
        let tempCode = 'const codeArr=[];'
        for (const match of template.matchAll(this.jsRegex)) {
            const tempString = template.slice(lastIndex, match.index);
            const jsString = match[1];
            tempCode += this.addToTempScript(tempString, false);
            tempCode += this.addToTempScript(jsString, true);
            lastIndex = match.index + match[0].length;
        }
        tempCode += this.addToTempScript(template.slice(lastIndex, template.length), false);
        tempCode += 'return codeArr.join("");';
        if(comments) console.info(tempCode);
        // Compile tempCode to JS and execute with data bound as this
        return new Function(tempCode).apply(data);
    }

    addToTempScript(line, isJs) {
        const reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
        // If Js instruction is a control structure do not push but keep for direct execution
        if (isJs) return line.match(reExp) ? line : 'codeArr.push(' + line + ');';
        else return line !== '' ? 'codeArr.push(`' + line + '`);' : '';
    }
}

/*
await kwm.render('test', kwm.conf.appContainer, {check:true, arr:[1,2,5]});
let obs = kwm.obs('TestText');
let obs2 = kwm.obs('33');
let comp = kwm.compute(()=> `${obs2.value * obs2.value} -> ich bin ${obs2.value} zum Quadrat`,[obs2]);
obs.subscribe((val)=>console.log(val))
kwm.bindings({'input': obs, 'select': obs2,'inputComputed':comp});
*/