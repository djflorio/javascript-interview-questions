/******************************************************************************
What is a potential pitfall with using typeof bar === "object" to determine
if bar is an object? How can this pitfall be avoided?
******************************************************************************/

/*
The type of null is "object", so this may lead to suprising results. The
problem can be avoided by checking if the object is null first:
*/
console.log((bar !== null) && (typeof bar === "object"));


/******************************************************************************
What will the code below output to the console and why?
******************************************************************************/
(function() {
  var a = b = 3;
})();
console.log("a defined? " + (typeof a !== 'undefined'));
console.log("b defined? " + (typeof b !== 'undefined'));
/*****************************************************************************/

/*
a defined? false
b defined? true

Assuming we aren't using strict mode, a will be undefined, while b will will be
defined. This is because var a = b = 3; isn't actually shorthand for var a = 3 
and var b = 3, but rather var a = (b = 3). Since b is not declared as a var, it
is automatically put into the global scope, while a is only accessible within
the IIFE.
*/


/******************************************************************************
What will the code below output to the console and why?
******************************************************************************/
var myObject = {
  foo: "bar",
  func: function() {
    var self = this;
    console.log("outer func:  this.foo = " + this.foo);
    console.log("outer func:  self.foo = " + self.foo);
    (function() {
      console.log("inner func:  this.foo = " + this.foo);
      console.log("inner func:  self.foo = " + self.foo);
    }());
  }
};
myObject.func();
/*****************************************************************************/

/*
outer func: this.foo = bar
outer func: self.fee = bar
inner func: this.foo = undefined
inner func: self.foo = bar

The "this" in the "outer" function is bound to myObject, so this.foo is
whatever foo is defined as in the object. The self variable is equal to "this",
so it's the same. The inner function is trickier; Since it's not a method of
myObject, "this" actually refers to the global (window) object. Since the
window object doesn't have a foo property, it's undefined. The "self" variable,
however, was defined with var in the outer function, so the inner function has
access to it via the closure.
*/


/******************************************************************************
What is the significance of, and reason for, wrapping the entire content of a
JavaScript source file in a function block?
******************************************************************************/

/*
This is a modern practice used to better handle scoping and name collisions, as
well as make the code more "modular", meaning it can be easily shared between
projects and developers. In other words, it creates a "closure" around the
entire contents of the file.
*/


/******************************************************************************
What is the significance, and what are the benefits, of including 'use strict'
at the beginning of a JavaScript source file?
******************************************************************************/

/*
Strict mode enables stricter parsing and error handling of the code, and is
considered to be good practice for development. Errors that would otherwise be
ignored or fail silently will generate errors or throw exceptions.

Some of the differences include:
  - You must declare variables before using them (so b = 5 is not allowed if
    it wasn't declared somewhere else)
  - Duplicate paramter values aren't allowed.
  - Variables declared within an eval are not created in the containing scope
*/


/******************************************************************************
Consider the two functions below. Will they both return the same thing? Why or
why not?
******************************************************************************/
function foo1()
{
  return {
    bar: "hello"
  };
}

function foo2()
{
  return
  {
    bar: "hello"
  };
}
/*****************************************************************************/

/*
No, they will not. For return statements, if JavaScript sees a line break, it
will automatically insert a semicolon, ending the statement. Therefore, the
second function will actually return undefined.
*/


/******************************************************************************
What is NaN? What is its type? How can you reliably test if a value is equal to
NaN?
******************************************************************************/

/*
NaN stands for "Not a Number", and it (strangly) has a type of "number". It's a
special value that is produced when you try to perform an operation on one or
more values that are non-numeric. For example, "A" / 2 would return NaN.

The simplest (but imperfect) way to check if something is NaN is with isNan().
It's imperfect because it first tries to convert any non-numeric values to a
number. So isNaN("5") is actually false, even though it's actually a string.
This may or may not be the intended behavior of the developer. Furthermore,
since booleans are technically either 0 or 1, calling isNaN() on a boolean
will also return false, which might not be expected.

The more reliable way is to check if the value does not equal itself, like
value !== value. This takes advantage of a quirk of NaN, which is that it
doesn't equal itself. NaN === NaN returns false. So if something doesn't equal
itself, it's NaN.

Worth noting is that in ES6, there is a Number.isNan() method which is more
reliable than the old isNaN().
*/


/******************************************************************************
What will the code below output? Explain your answer.
******************************************************************************/
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 == 0.3);
/*****************************************************************************/

/*
Since floating point numbers are unreliable in JavaScript, it's most correct to
say that this MIGHT log 0.3 and true respectively, but, it also might not.
Arithmatic with floats often results in very tiny deviations from the correct
answer. In this particular example, 0.1 and 0.2 add to be 0.30000000000000004,
so that would be what's logged with the first console.log, and the second will
log false. This is because 0.1 represented in binary is actually an infinitely
repeating value (0.001100110011...repeating), so it gets rounded to
0.00011001100110011. This rounding is what causes that tiny deviation in the
base 10 result.
*/


/******************************************************************************
Discuss possible ways to write a function isInteger(x) that determines if x is
an integer.
******************************************************************************/

// Option 1: Check if x raised to the 0th power is equal to x.
function isInteger(x) { return (x^0) === x; }
// Option 2: Round x to nearest integer, and check if equal to x.
function isInteger(x) { return Math.round(x) === x; }
// Option 3: Check that x is a number and that that there is no remainder if it
// is divided by 1.
function isInteger(x) { return (typeof x === "number") && (x % 1 === 0); }


/******************************************************************************
In what order will the numbers 1-4 be logged to the console when the code below
is executed? Why?
******************************************************************************/
(function() {
  console.log(1); 
  setTimeout(function(){console.log(2)}, 1000); 
  setTimeout(function(){console.log(3)}, 0); 
  console.log(4);
})();
/*****************************************************************************/

/*
1 4 3 2

The first console.log will be the first to execute. The next two console.logs
are put into the event queue with setTimeout. Since the event loop occurs after
the main call stack, those are executed AFTER the last console.log. The timout
set for those two console.logs then determines their order, thus the 3, 2.

Using setTimeout on something with a time of 0 is a way of saying, "execute
this as soon as possible" (NOT immediately).
*/


/******************************************************************************
Write a simple function (less than 160 characters) that returns a boolean
indicating whether or not a string is a palindrome.
******************************************************************************/

function isPalindrome(str) {
  str = str.replace(/\W/g, '').toLowerCase();
  return (str == str.split('').reverse().join(''));
}


/******************************************************************************
Write a sum method which will work properly when invoked using either syntax
below.
******************************************************************************/
console.log(sum(2,3));   // Outputs 5
console.log(sum(2)(3));  // Outputs 5
/*****************************************************************************/

function sum(x) {
  if (arguments.length == 2) {
    return arguments[0] + arguments[1];
  } else {
    return function(y) {
      return x + y;
    }
  }
}

sum(5, 5);
sum(5)(5);

// Another option:
function sum(x, y) {
  if (y !== undefined) {
    return x + y;
  } else {
    return function(y) { return x + y; };
  }
}


/******************************************************************************
Consider the following code snippet:
******************************************************************************/
for (var i = 0; i < 5; i++) {
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Button ' + i));
  btn.addEventListener('click', function(){ console.log(i); });
  document.body.appendChild(btn);
}
/******************************************************************************
(a) What gets logged to the console when the user clicks on �Button 4� and why?
(b) Provide one or more alternate implementations that will work as expected.
******************************************************************************/

/*
(a) 5, because by the time the user clicks the button, the for loop will have
    finished, meaning i will be at 5 (since the loop increases i by 1 each
    loop, and stops once i is no longer less than 5). Since i is function
    scoped, every button references the same variable in memory.
(b) To make this work as expected, if you're using ES6 you can simply use let
    instead of var. Since let is block scoped, each button will reference it's
    own separate variable. Another alternative is to do the following:
*/
for (var i = 0; i < 5; i++) {
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Button ' + i));
  (function(i) {
    btn.addEventListener('click', function(){ console.log(i); });
  })(i);
  document.body.appendChild(btn);
}

/*
The above creates an inner function with its own context, and by passing i into
it, each button will reference that block's i variable, which is separate from
the i in the outer function's scope.
*/


/******************************************************************************
Assuming d is an "empty" object in scope, say: var d = {};
...what is accomplished using the following code?
******************************************************************************/
[ 'zebra', 'horse' ].forEach(function(k) {
	d[k] = undefined;
});
/*****************************************************************************/

/*
This will add 'zebra' and 'horse' properties to the object and initialize them
to undefined.
*/


/******************************************************************************
What will the code below output to the console and why?
******************************************************************************/
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
/*****************************************************************************/

/*
array 1: length=5 last=j,o,n,e,s
array 2: length=5 last=j,o,n,e,s

The important point is that the reverse() method mutates the array and returns
a reference to the array. So in this case, arr2 is pointing to the same bit of
memory as arr1, which is reversed after calling reverse(). The second thing
to note is that if you pass an array into the push() method, it will push the
entire array into a single element of the target array.

Using slice(-1) is a way of getting the last element of an array.
*/


/******************************************************************************
What will the code below output to the console and why?
******************************************************************************/
console.log(1 +  "2" + "2");
console.log(1 +  +"2" + "2");
console.log(1 +  -"1" + "2");
console.log(+"1" +  "1" + "2");
console.log( "A" - "B" + "2");
console.log( "A" - "B" + 2);
/*****************************************************************************/

/*
"122"
"32"
"02"
"112"
"NaN2"
NaN

JavaScript performs automatic type conversion. If one of the two operands is a
string, it assumes it needs to do string concatenation, and converts the non-
string to a string. A + or - place next to a string is called a "unary"
operator, which converts the string to a positive or negative number
respectively, and are handled before addition or subtraction. For the last two
examples, performing arithmatic on non-numbers results in NaN. You can add a
string to NaN, which converts it into a string, but trying to add a number to
NaN simply yields NaN.
*/


/******************************************************************************
The following recursive code will cause a stack overflow if the array list is
too large. How can you fix this and still retain the recursive pattern?
******************************************************************************/
var list = readHugeList();

var nextListItem = function() {
  var item = list.pop();

  if (item) {
    // process the list item...
    nextListItem();
  }
};
/*****************************************************************************/

var nextListItem2 = function() {
  var item = list.pop();

  if (item) {
    setTimeout(nextListItem2, 0);
  }
};

/*
Instead of the call stack handling the recursion, we use the event loop. This
prevents a stack overflow, as all events in the event loop are handled as soon
as possible, and no sooner. In other words, this makes the nextListItem2 an
asynchronous function.
*/


/******************************************************************************
What is a "closure" in JavaScript? Provide an example.
******************************************************************************/

/*
A closure is most associated with inner functions, and the fact that they have
access to variables in the outer function's scope. For example:
*/

function outer() {
  var x = "woohoo";
  function inner() {
    console.log(x);
  }
  inner();
}
outer();

/*
The above example would log "woohoo". To be more specific, the inner function
has access to 3 different scopes: its own, the enclosing function, and global.
*/


/******************************************************************************
What will be the output of the following code:
******************************************************************************/
for (var i = 0; i < 5; i++) {
	setTimeout(function() { console.log(i); }, i * 1000 );
}
/******************************************************************************
Explain your answer. How could the use of closures help here?
******************************************************************************/

/*
5, 5, 5, 5
Once again, this is because setTimeout moves the console.log to the event loop,
which is executed after the call stack completes. At that point, i will be 5
for console.log. You can use closures to fix this, by enclosing the setTimeout
in its own function with its own scope, and passing in the i value.
*/
for (var i = 0; i < 5; i++) {
  (function(i) {
    setTimeout(function() { console.log(i); }, i * 1000 );
  })(i);
}
// or, in ES6:
for (let i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}


/******************************************************************************
What would the following lines of code output to the console?
******************************************************************************/
console.log("0 || 1 = "+(0 || 1));
console.log("1 || 2 = "+(1 || 2));
console.log("0 && 1 = "+(0 && 1));
console.log("1 && 2 = "+(1 && 2));
/******************************************************************************
Explain your answer.
******************************************************************************/

/*
"0 || 1 = 1"
"1 || 2 = 1"
"0 && 1 = 0"
"1 && 2 = 2"

With logical operators, JavaScript will return the first value that satisfies
the condition. The last log is a little confusing, because you may expect it
to return true, but it returns 2. This is because the && operator returns the
expression itself. Since it needs both sides to be truthy, it has to check the
second side no matter what. In this case, that side is 2, which is truthy even
though it isn't boolean. Since && returns the expression itself, it returns that
2. This is why, in libraries like React, you can conditionally show something by
doing { a === 1 && <div>A equals 1!</div> }.
*/


/******************************************************************************
What will be the output when the following code is executed? Explain.
******************************************************************************/
console.log(false == '0')
console.log(false === '0')

/*
true
false

The == operator tries to make each side the same type first before comparing
them, while the === operator compares both the value and type.
*/


/******************************************************************************
What is the output out of the following code? Explain your answer.
******************************************************************************/
var a={},
    b={key:'b'},
    c={key:'c'};

a[b]=123;
a[c]=456;

console.log(a[b]);
/*****************************************************************************/

/*
456

When you set an object property, JavaScript will actually stringify the
parameter. Since objects are stringified as "[object Object]", the above
examples is actually:

a["[object Object]"] = 123;
a["[object Object]"] = 456;

console.log(a["[object Object]"]);
*/


/******************************************************************************
What will the following code output to the console:
******************************************************************************/
console.log((function f(n){return ((n > 1) ? n * f(n-1) : n)})(10));
/******************************************************************************
Explain your answer.
******************************************************************************/

/*
This is essentially the same as 10 factorial, which is 3628800. The function
is recursive, meaning it calls itself within itself until n is less than 1.
*/


/******************************************************************************
Consider the code snippet below. What will the console output be and why?
******************************************************************************/
(function(x) {
  return (function(y) {
    console.log(x);
  })(2)
})(1);
/*****************************************************************************/

/*
1. The inner function has access to the outer function's variables because of
the closure.
*/


/******************************************************************************
What will the following code output to the console and why:
******************************************************************************/
var hero = {
  _name: 'John Doe',
  getSecretIdentity: function (){
      return this._name;
  }
};

var stoleSecretIdentity = hero.getSecretIdentity;

console.log(stoleSecretIdentity());
console.log(hero.getSecretIdentity());
/******************************************************************************
What is the issue with this code and how can it be fixed?
******************************************************************************/

/*
undefined
'John Doe'

The issue is that by setting stoleSecretIdentity to hero.getSecretIdentity, you
are basically making a copy of the method and turning it into its own stand-
alone function. When you try to execute that function, the "this" no longer
refers to the hero object, but the window object, which doesn't have a _name
property.

Remember, adding parenthasis after a function name means you invoke that
function. If you do:
var stoleSecretIdentity = hero.getSecretIdentity();
It would assign "John Doe" to stoleSecretIdentity.

The second one logs the name properly, because you're calling getSecretIdentity
as a method of hero, so "this" refers to the hero context.

You can fix the first console log by binding the hero object to the function:
*/
var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);


/******************************************************************************
Create a function that, given a DOM Element on the page, will visit the element
itself and all of its descendents (not just its immediate children). For each
element visited, the function should pass that element to a provided callback
function.

The arguments to the function should be:
  - a DOM element.
  - a callback function (that takes a DOM element as its argument)
******************************************************************************/

function processDescendents(el, callback) {
  callback(el);
  const children = el.children;
  for (let i = 0; i < children.length; i++) {
    processDescendents(children[i], callback);
  }
}


/******************************************************************************
Testing your this knowledge in JavaScript: What is the output of the following
code?
******************************************************************************/
var length = 10;
function fn() {
	console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);
/*****************************************************************************/

/*
10
2

This one is pretty fucked up. The first fn() logs 10, because it's calling the
function defined towards the top, so "this" refers to the global scope. The
second one, however, is calling fn within the context of the arguments array.
Therefore, this.length refers to arguments.length, which is 2.
*/


/******************************************************************************
Consider the following code. What will the output be, and why?
******************************************************************************/
(function () {
  try {
    throw new Error();
  } catch (x) {
    var x = 1, y = 2;
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
/*****************************************************************************/

/*
1
undefined
2

This one is also pretty fucked up. Obviously, var x and var y are hoisted to
the top of the function. They are defined within the catch block, but the catch
is, at runtime the x in the catch block actually refers to the x being passed
into the catch block, NOT the x declared at the top of the function. So, in the
eyes of the console log, x is undefined. Since there is only one y, it works as
expected.
*/


/******************************************************************************
What will be the output of this code?
******************************************************************************/
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl ();
/*****************************************************************************/

/*
undefined

While the x declared in the function is hoisted to the top of the function, its
value isn't hoisted, so it's undefined.
*/


/******************************************************************************
How do you clone an object?
******************************************************************************/

/*
var clone = Object.assign({}, obj);

...or in ES6:
var clone = ...obj;

These only work if the object doesn't have nested objects. If they do, those
nested objects need to be cloned individually.
*/


/******************************************************************************
What will this code print?
******************************************************************************/
for (let i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}
/*****************************************************************************/

/*
0, 1, 2, 3, 4

Since i is declared with let, it has a block scope, so each console log refers
to the i variable in the for loop. The value is preserved.
*/


/******************************************************************************
What do the following lines output, and why?
******************************************************************************/
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
/*****************************************************************************/

/*
true
false

Conditionals are evaluated left to right. So the first log:
1 < 2 < 3
true < 3 (or, 1 < 3)
true

For the second one:
3 > 2 > 1
true > 1 (or, 1 > 1)
false
*/


/******************************************************************************
How do you add an element at the begining of an array? How do you add one at
the end?
******************************************************************************/

/*
To add to the beginning:
array.unshift("start");

To add to the end:
array.push("end");

...or in ES6:
var array = ["start", ...oldArray, "end"];
*/


/******************************************************************************
Imagine you have this code:
******************************************************************************/
var a = [1, 2, 3];
/******************************************************************************
a) Will this result in a crash?
******************************************************************************/
a[10] = 99;
/******************************************************************************
b) What will this output?
******************************************************************************/
console.log(a[6]);
/*****************************************************************************/

/*
a) No, it will not crash. It will add 99 to index 10, filling all index between
   with empty values.
b) This will output undefined, but the catch is that the value, undefined, is
   not actually stored in the array.
*/


/******************************************************************************
What is the value of typeof undefined == typeof NULL?
******************************************************************************/

/*
true

The trick is that JavaScript is case sensitive, so NULL is actually treated as
an undefined variable, rather than null.

So, typeof undefined = "undefined", and typeof NULL = "undefined".
*/


/******************************************************************************
What would following code return?
******************************************************************************/
console.log(typeof typeof 1);
/*****************************************************************************/

/*
"string"

typeof returns the type of the object as a string.
*/


/******************************************************************************
What will the following code output and why?
******************************************************************************/
var b = 1;
function outer(){
  var b = 2
  function inner(){
    b++;
    var b = 3;
    console.log(b)
  }
  inner();
}
outer();
/*****************************************************************************/

/*
3

The declaration of var b is hoisted to the top of the inner function, but not
the value, so b++ doesn't do anything. It's the same as:

function inner() {
  var b;
  b++; (results in NaN)
  b = 3
  console.log(3);
}
*/
