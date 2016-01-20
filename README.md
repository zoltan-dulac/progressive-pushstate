# progressive-pushstate
Allow pushstate/popstate support using a progressive-enhancement design pattern.

## Why Use This Library

You have links in a page that fire JavaScript events that change the state of the page.  You want to be able to implement "deeplinking" -- i.e., you want to ensure that if the user posts the URL of the page in an email/Facebook/Twitter, etc., that anyone who uses that link gets the exact same state of the page that the user who originally posted the link had.  This library will help you do that.

Alternatively, let's suppose you have a page that has links on it that pass query string parameters to the same page that change the state in the page on the server side.  You want to be clever and improve performance by implemented JavaScript routines that do the same state changes on the client side in a nice, progressive-enhancement kind of way.  This library gives you a framework to do this.

