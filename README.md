# jDom

jDom is an approachable JavaScript library providing straightforward methods for DOM manipulation and HTTP requests.

jDOM features:
* Manipulation of one or more DOM elements
* Creation and removal of DOM elements
* Queuing document ready callbacks
* Simple semantic HTTP requests 

## Start Here
The easiest way to use jDom is to simply insert the webpack output `jDom.js` into your project. Be sure to add scripts to your html as needed:

```html
<head>
<meta charset="utf-8">
<title>My Web App!</title>
<script type="text/javascript" src="../dist/jDom.js"></script>
...
</head>
```

## API
[`$j`](#j) 

[DOM Traversal](#dom-traversal) 
* [`each`](#each) 
* [`children`](#children) 
* [`parent`](#parent) 

[DOM Manipulation](#dom-manipulation) 
* [`html`](#html) 
* [`empty`](#empty) 
* [`append`](#append) 
* [`remove`](#remove) 
* [`attr`](#attr) 
* [`addClass`](#addclass) 
* [`removeClass`](#removeclass) 
* [`toggleClass`](#toggleclass) 

[Event Listeners](#event-listeners) 
* [`on`](#on) 
* [`off`](#off) 

[`$j.ajax`](#ajax) 

### $j

The jDom global object is used to select and return an array of DOM nodes (`DOMNodeCollection`).

#### `$j(selector)`

* When given a `string` with a one or more CSS selectors separated by commas, returns all elements in the document that are matched by any of the selectors in a `DOMNodeCollection`.
* When given a `HTMLElement` returns a `DOMNodeCollection` containing the element, giving it access to all jDOM methods.
* When given a function, will add that function to a queue of functions to be invoked when the DOM content has loaded.

### DOM Traversal

#### `each`

Iterates through each element in a `DOMNodeCollection` and invokes a given callback.
example: `$j('.className').each(callback)`

#### `children`

Returns a `DOMNodeCollection` containing all children of each element in the `DOMNodeCollection` invoking the function.

#### `parent`

Returns a `DOMNodeCollection` containing all parent elements of each element in the `DOMNodeCollection` invoking the function.

### DOM Manipulation

#### `html`

When given a `string` as an argument, sets the `innerHTML` of each element in a `DOMNodeCollection` to the given `string`.
When no argument is passed, returns the `innerHTML` of the first element in a DOMNodeCollection.

#### `empty`

Sets the `innerHTML` of each element in a `DOMNodeCollection` to an empty `string`.

#### `append`

Receives a `string`, `HTMLElement`, or `DOMNodeCollection` as an argument and appends it as a child to each element in a `DOMNodeCollection`.

#### `remove`

Removes each element in the `DOMNodeCollection` from the DOM.

#### `attr`

When given a DOM object attribute type as an argument, returns the value of that attribute for the first element of a `DOMNodeCollection`.
When give a DOM object attribute type and an attribute value as arguments, sets each elements corresponding attribute to the given value for each element in a `DOMNodeCollection`.

#### `addClass`

Receives a `string` as an argument and adds it as a class name to each element in a `DOMNodeCollection`.

#### `removeClass`

Receives a `string` as an argument and adds it as a class name to each element in a `DOMNodeCollection`.

### Event Listeners

#### `on`

Receives an event type and a callback. Adds a corresponding event listener to each element in the `DOMNodeCollection`.

#### `off`

Receives an event type argument and removes the corresponding event listeners from each element in a `DOMNodeCollection`.

### $j.ajax

Receives an object and creates an HTTP request based on the objects keys:

- method: type/method of HTTP request
- url: URL for the HTTP request
- success: a callback to be invoked upon a successful request
- error: a callback to be invoked on request failure
- data: the data the request is carrying
- contentType: content type of HTTP request

Example:
```javascript
$j.ajax({
method: "POST",
url: "/api/comments",
data: {
comment: {
userId: 123,
body: "comment body"
}
},
success(commentResponse) {
console.log(commentResponse.body)
},
error(errorResponse) {
console.log(errorResponse)
}
});
```
