import KWMJS from "./js/kwm.js";
const config = {
    appContainer: document.querySelector('#kwmJS'),
    debugMode: true,
    webRoot: window.location.origin + window.location.pathname.replace('/index.html',''),
    apiRoot: 'https://api.neuwersch.kwmhgb.at/wp-json',
    serviceworkerPath: './js/serviceworker.js',
    templatesPath: '/templates/',
    languages: ["en", "de"],
}
new KWMJS(config);