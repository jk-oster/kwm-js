<section id="main_content">
    <h1>Test Page</h1>
    <p>I am here to test the templating engine and the data-binding</p>

    <% if(this.check) { for(const a of this.arr){ %>
    <a href="#">Hi, I am <% a %></a>
    <partial name="partials/partial"></partial>
    <% }} %>

    <% if(this.check) { %>
    <partial name="partials/partial2">{arr}</partial>
    <% } %>

    <% console.log('In test.tpl ist this = ', this) %>

    <h3>Using inline JS to produce elements</h3>
    <% this.arr.map(a => '<b>'+ a +' I was mapped into a bold tag</b><br>').join('') %>
    <h3>Calculating Stuff using inline JS</h3>
    <p>Sum of <% this.arr.join('+') %> = <% this.arr.reduce((a,b) => a+b) %></p>


    <!-- I am a comment and with debugMode = false I will not be rendered -->

    <h2>Here we try the data binding</h2>
    <input type="text" data-bind="input" id="first">
    <label for="second"></label>
    <select name="name" data-bind="select" id="second">
        <option value="5">Option 5</option>
        <option value="10">Option 10</option>
        <option value="33">Option 33</option>
    </select>
    <label for="third"></label>
    <input type="text" data-bind="input" id="third">
    <p><span data-bind="text: input"></span></p>
    <p><span data-bind="text: inputComputed"></span></p>
    <p>Value of selected option = <span data-bind="text: select"></span>€</p>
</section>