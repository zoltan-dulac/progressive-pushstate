# progressive-pushstate
Allow pushstate/popstate support using a [progressive-enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement) design pattern.

## Why Use This Library

Let's suppose you have a page that has links on it that pass query string parameters to the same page that change the state in the page on the server side.  You want to be clever and improve performance by implemented JavaScript routines that do the same state changes on the client side in a nice, progressive-enhancement kind of way.  This library gives you a framework to do this, using the exact same URLs that you would on the server side without the need of [hash tags/fragment identifiers](https://en.wikipedia.org/wiki/Fragment_identifier).  This is important, since a lot of social media applications (e.g. Facebook) will not differentiate between pages that have different hash anchors, and will not allow different [meta information](https://developers.facebook.com/docs/sharing/webmasters) for different hash tag values.

Note that library allows the developer to not worry about browser history and back/forward button usage -- as long as s/he has set up the library correctly, everything should just work automatically (more on this later).

## What it is not

This is not a library that will include a whole bunch of page state visual effects for free.  You must know JavaScript and be able to implement these yourself. 

## How to Use it.

### Links
Let's assume you page has a bunch of links like this:

```
<a href="/path/to/page?section=support">Customer Support</a>
```

This link currently works like you (the developer) expect it to (by going to the server and fetching the relevant page), but now you want to be clever and have this link trigger an AJAX request that will only retrieve the HTML fragment of the page that is different from the original page (i.e. the content of the page without the header and footer).  

* First, add the `progressive-pushstate` script to the bottom of your page.

   ```
         <script src="/path/to/progressive-pushstate.js"></script>
      </body>
   </html>
   ```

* Next, just add the `pp-link` class to the page:

   ```
   <a class="pp-link" href="/path/to/page?section=support&level=2">Customer Support</a>
   ```

* Finally create the javascript logic in a separate JavaScript file.  You first need to ensure that you register the JavaScript function that will be triggered when a `pp-link` is clicked:

   ```
   pp.init(popstateEvent);
   ```

   Then you must implement the popstate event:

   ```
   function popstateEvent(e) {
     // insert logic here
     
     ...
   };
   ```

   Note that `e` will have a `state` property that will be an object containing the parsed CGI variables of the link that was clicked.  For example, if the URL clicked was `/path/to/page?section=support&level=2`, then the `state` object would be set to 

   ```
   {
	   section: "support",
	   level: "2"
   }
   ```

   The developer should have enough information to replicate the server side behavior on the client side.

   If the URL contains a hash tag, then that information is stored in the `state` object under the property `_ppHash`.  For example, if the URL `/path/to/page?section=support&level=2#question2` was clicked, the `state` object would be set to:

   ```
   {
	   section: "support",
	   level: "2"
	   _ppHash: "question2"
   }
   ```

   To ensure that your application maintains a progressively-enhanced design pattern, it is recommended to use hash tags only for the purpose of anchoring to a particular section to a page, since if JavaScript is turned off, these hash tags are never passed to the server, as per [section 4.1 of RFC 2396, "Uniform Resource Identifiers (URI)"](http://tools.ietf.org/html/rfc2396#section-4.1).

   For more information, there a few examples included in the `progressive-pushstate` package in the `examples` directory:

### Forms

Let's assume you page has a form that looks like this:

```
<a href="/path/to/page?section=support">Customer Support</a>
```

This form currently works like you (the developer) expect it to (by giving the form data to the server and fetching the relevant result formatted in HTML), but now you want to be clever and have a form submit trigger an AJAX request that will only retrieve the HTML fragment of the page that is different from the original page (i.e. the content of the page without the header and footer).

* First, just as before, add the `progressive-pushstate` script to the bottom of your page.

   ```
         <script src="/path/to/progressive-pushstate.js"></script>
      </body>
   </html>
   ```

* Next, just add the `pp-form` class to the form you want this AJAX magic to happen with:

   ```
   <form class="pp-form">
	 <input type="text" name="name" 
	          placeholder="Your full name (first, middle and last)." />
	 <input type="text" name="country" 
	          placeholder="The country you live in."/>
	 <input type="submit" name="submitButton" value="Submit My Country" />
   </form>
   ```

* Creating the Javascript logic for the form is about the same as the link scenerio.  You first need to ensure that you register the JavaScript function that will be triggered when a `pp-link` is clicked:

   ```
   pp.init(popstateEvent);
   ```

   Then you must implement the popstate event:

   ```
   function popstateEvent(e) {
     // insert logic here
     
     ...
   };
   ```

   Note that `e` will have a `state` property that will be an object containing the parsed CGI variables of the form that was clicked.  For example, if the form being used is like the one above, with "Zoltan" filled in as the `name` and "Canada" filled in as the `country`, then the `state` object would be set to 

   ```
   {
	   name: "Zoltan K. Hawryluk",
	   country: "Canada",
	   submitButton: "Submit My Country"
   }
   ```

   The developer should have enough information to replicate the server side behavior on the client side.


## Initialization Options

The `pp.init()` method can take an optional second parameter, which is a JavaScript oject containing a list of options.  For example:


```
pp.init(popstateEvent, {
	doPopstateOnload: true
});
```

will execute the `popstateEvent` function when the page loads. 

Other options include:


- doPopstateOnload: fire the popstateEvent onload (default: true)
- defaultState: the initial default state of the application (default: {} or if a link with class "pp-default" exists, the URL of that link).
- pushScrollState: (experimental) enables the application to keep track of scrollbar position in the app. (default: false)
- debounceTime: (experimental) sets the debounce time for resize/scroll events default: 50)
- keyDebounceTime: (experimental) sets the debounce time for form key events events default: 500)

## Dependencies

None.  This is plain ol' JavaScript, my friend.  You can use it with jQuery/Moo Tools/Dojo/etc., but you don't need to.

## Browser Support

This has been tested on the latest versions of Firefox, Safari, Opera and Chrome as well as Internet Explorer 10+.  Any browser that supports the [HTML5 Session Management API](http://caniuse.com/#search=pushstate) should support this library.

It *should* work with the [history.js HTML5 Session Management API polyfill](https://github.com/browserstate/history.js), but this hasn't been tested as of Janauary 25, 2016.  We may be doing so in the future, but since this `progressive-pushstate.js` was build with progressive enhancement in mind, it was not our main focus (especially since, if a dev uses this library correctly, any application that uses it should work with the Session Management API, because it was coded with progressive enhancement in mind).

## Other Notes

This document uses the word "we" a lot.  The only person it really refers to is [Zoltan Hawryluk](http://www.useragentman.com), since we want to make sure we are not speaking on anyone else's behalf.  However, it must be noted this libary does include code (`formData2QueryString`) originally written by [Matthew Eernisse](mde@fleegix.org) in March 2005 with bugfixes by [Mark Pruett](mark.pruett@comcast.net), multi-select support added by [Craig Anderson](craig@sitepoint.com) and HTML5 form element support by Zoltan Hawryluk.  I have never met these other developers, but they have done some great work.  Since this function is released under the Apache License, I have done the same for this whole library.

## License

This library is licensed under the Apache License, Version 2.0 (the "License").  More info at: http://www.apache.org/licenses/LICENSE-2.0

