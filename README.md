# kwm-js
A customized vanilla JS framework for Single Page Applications / Progressive Web Applications.

This bundle is targeted to be used for the course *Progressive Web Applications with Headless CMS* at the [University of applied sciences Hagenberg](https://www.fh-ooe.at/campus-hagenberg/).

The class-bundle offers:
- Expressive and intelligent templating engine: allowing `if|else|for|while|switch` statements,
flexible asynchronous template fetching and insertion of partial-templates, smart caching of static templates
- Flexible declarative 2-way-data-binding by `Observable` and `Computed` values
- Simple translation engine with the possibility to switch language by URL parameter
- Simple hash-based routing
- Simple configuration
- Collection of handy utility functions for API calls, DOM operations and many more
- Handy and customizable shorthand convenience functions
- Small bundle size (17kb zipped)

## Installation & Usage
Download & copy the content of the `Sample Project` folder into your working directory. Feel free to change any configuration or folder structure.
Create the desired configuration and create a new instance of KWMJS.
```js
import KWMJS from "./kwm.js";
const config = {
    appContainer: document.querySelector('#kwmJS'),
    debugMode: true,
    webRoot: window.location.origin + window.location.pathname.replace('/index.html',''),
    apiRoot: 'https://your.api.com/rest/',
    serviceworkerPath: './serviceworker.js',
    templatesPath: '/templates/',
    languages: ["en", "de"],
}
new KWMJS(config);
```
After instantiation KWMJS and all its functions will always be available as global object by calling `window.kwm`.

To see how views and data binding works take a look at `view.test.js` and for templating examples see the connected template files `test.tpl`,
`partials/partial.tpl` and `partials/partial2.tpl`. Every view needs to be imported in the router and added to `routes` member array.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Authors and acknowledgment
This project was part of a study course at the [University of applied sciences Hagenberg](https://www.fh-ooe.at/campus-hagenberg/).
The structure and main components of this package have been created along with the course *Client-Web-Programming* under
guidance of our professor [Matthias Neuwersch](https://github.com/Jazzmertize).

The data binding implementation was inspired by [Jeremy Likness](https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/) 
and [Milos Protic](https://dev.to/proticm/vanilla-js-data-binding-with-classes-from-scratch-48b1), the templating engine was 
built with guidance of [@shadowtime2000](https://hackernoon.com/how-to-create-new-template-engine-using-javascript-8f26313p).

Thanks to all the contributors!