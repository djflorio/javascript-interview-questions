The following questions were pulled from
[Toptal's 37 Essential JavaScript Interview Questions](https://www.toptal.com/javascript/interview-questions)

I've added my own interpretations of the answers to help better my understanding.


### Q1:
What is a potential pitfall with using `typeof bar === "object"` to determine if `bar` is an object?
How can this pitfall be avoided?

### A:
One pitfall is that `null` values have a `typeof` of `"object"`, which may lead to suprising results. The
problem can be avoided by checking if the object is `null` first:
```javascript
function isAnObject(bar) {
  return bar !== null && typeof bar === "object");
}
```

---

### Q2:
What will the code below output to the console and why?
```javascript
(function() {
  var a = b = 3;
})();
console.log("a defined? " + (typeof a !== 'undefined'));
console.log("b defined? " + (typeof b !== 'undefined'));
```

### A:
The output will be:
```
a defined? false
b defined? true
```
Assuming we aren't using strict mode, `a` will be undefined, while `b` will will be
defined. This is because `var a = b = 3;` isn't actually shorthand for `var a = 3` 
and `var b = 3`, but rather `var a = (b = 3)`. Since `b` is not declared as a `var`, it
is automatically put into the global scope, while `a` is only accessible within
the IIFE (immediately-invoked function expression).

---

### Q3:
What will the code below output to the console and why?
```javascript
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
```

### A:
The output will be:
```
outer func: this.foo = bar
outer func: self.foo = bar
inner func: this.foo = undefined
inner func: self.foo = bar
```
The `this` in the "outer" function of the `func` preperty is bound to `myObject`, so `this.foo` is
whatever `foo` is defined as in the object. The `self` variable is equal to `this`,
so it's the same. The inner function is trickier; since it's not a method of
`myObject`, `this` actually refers to the global (window) object. Since the
window object doesn't have a `foo` property, it's `undefined`. The `self` variable,
however, was defined with var in the outer function, so the inner function has
access to it via the closure.

---

### Q4:
What is the significance of, and reason for, wrapping the entire content of a
JavaScript source file in a function block?

### A:
This is a modern practice used to better handle scoping and name collisions, as
well as make the code more "modular", meaning it can be easily shared between
projects and developers. In other words, it creates a "closure" around the
entire contents of the file.

---

### Q5:
What is the significance, and what are the benefits, of including 'use strict'
at the beginning of a JavaScript source file?

### A:
Strict mode enables stricter parsing and error handling of the code, and is
considered to be good practice for development. Errors that would otherwise be
ignored or fail silently will generate errors or throw exceptions.
Some of the differences include:
  - You must declare variables before using them (so `b = 5` is not allowed if
    it wasn't declared somewhere else)
  - Duplicate paramter values aren't allowed.
  - Variables declared within an eval are not created in the containing scope
  
---

### Q6:
Consider the two functions below. Will they both return the same thing? Why or
why not?
``` javascript
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
```

### A:
No, they will not. For return statements, if JavaScript sees a line break, it
will automatically insert a semicolon, ending the statement. Therefore, the
second function will actually return `undefined`.

---

### Q7:
What is `NaN`? What is its type? How can you reliably test if a value is equal to
`NaN`?

### A:
`NaN` stands for "Not a Number", and it (strangly) has a type of "number". It's a
special value that is produced when you try to perform an operation on one or
more values that are non-numeric. For example, `"A" / 2` would return `NaN`.

The simplest (but imperfect) way to check if something is `NaN` is with `isNan()`.
It's imperfect because it first tries to convert any non-numeric values to a
number. So `isNaN("5")` is actually `false`, even though `"5"` actually a string.
This may or may not be the intended behavior of the developer. Furthermore,
since booleans are technically either 0 or 1, calling `isNaN()` on a boolean
will also return false, which might not be expected.


The more reliable way is to check if the value does not equal itself, like
`value !== value`. This takes advantage of a quirk of `NaN`, which is that it
doesn't equal itself. `NaN === NaN` returns `false`. So if something doesn't equal
itself, it's `NaN`.


Worth noting is that in ES6, there is a `Number.isNan()` method which is more
reliable than the old `isNaN()`.

---

### Q8:
What will the code below output? Explain your answer.
```javascript
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 == 0.3);
```

### A:
Since floating point numbers are unreliable in JavaScript, it's most correct to
say that this MIGHT log `0.3` and `true` respectively, but, it also might not.
Arithmatic with floats often results in very tiny deviations from the correct
answer. In this particular example, 0.1 and 0.2 add to be 0.30000000000000004,
so that would be what's logged with the first `console.log`, and the second will
log `false`. This is because 0.1 represented in binary is actually an infinitely
repeating value (0.001100110011...repeating), so it gets rounded to
0.00011001100110011. This rounding is what causes that tiny deviation in the
base 10 result.

---

### Q9:
Discuss possible ways to write a function `isInteger(x)` that determines if `x` is
an integer.

### A:
**Option 1:** Check if `x` raised to the 0th power is equal to `x`.
```javascript
function isInteger(x) { return (x^0) === x; }
```

**Option 2:** Round `x` to nearest integer, and check if result is equal to `x`.
```javascript
function isInteger(x) { return Math.round(x) === x; }
```

**Option 3:** Check that `x` is a number and that that there is no remainder if it is divided by 1.
```javascript
function isInteger(x) { return (typeof x === "number") && (x % 1 === 0); }
```

---

### Q10:
In what order will the numbers 1-4 be logged to the console when the code below
is executed? Why?
```javascript
(function() {
  console.log(1); 
  setTimeout(function(){console.log(2)}, 1000); 
  setTimeout(function(){console.log(3)}, 0); 
  console.log(4);
})();
```

### A:
`1 4 3 2`

The first `console.log` will be the first to execute. The next two `console.log`s
are put into the event queue with `setTimeout`. Since the event loop occurs *after*
the main call stack, those are executed *after* the last `console.log`. The timout
set for those two `console.log`s then determines their order, thus `3` is logged before `2`.
Using `setTimeout` on something with a time of 0 is a way of saying, "execute
this as soon as possible" (NOT immediately).

---

### Q11:
Write a simple function (less than 160 characters) that returns a boolean
indicating whether or not a string is a palindrome.

### A:
```javascript
function isPalindrome(str) {
  const alphaOnly = str.replace(/\W/g, '').toLowerCase(); // remove non-alphanumeric characters
  return (alphaOnly == alphaOnly.split('').reverse().join('')); // check if same reversed
}
```

---

### Q12:
Write a sum method which will work properly when invoked using either syntax
below.
```javascript
console.log(sum(2,3));   // Outputs 5
console.log(sum(2)(3));  // Outputs 5
```

### A:
```javascript
function sum(x) {
  if (arguments.length == 2) {
    return arguments[0] + arguments[1];
  } else {
    return function(y) {
      return x + y;
    }
  }
}

sum(5, 5); // 5
sum(5)(5); // 5

// Another option:
function sum(x, y) {
  if (y !== undefined) {
    return x + y;
  } else {
    return function(y) { return x + y; };
  }
}
```

---

### Q13:
Consider the following code snippet:
```javascript
for (var i = 0; i < 5; i++) {
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Button ' + i));
  btn.addEventListener('click', function(){ console.log(i); });
  document.body.appendChild(btn);
}
```
**(a)** What gets logged to the console when the user clicks on "Button 4" and why?

**(b)** Provide one or more alternate implementations that will work as expected.

### A:
**(a)**
`5`, because by the time the user clicks the button, the for loop will have
finished, meaning `i` will be at 5 (since the loop increases `i` by 1 each
loop, and stops once `i` is no longer less than 5). Since `i` is function
scoped, every button references the same variable in memory.

**(b)**
To make this work as expected, if you're using ES6 you can simply use `let`
instead of `var`. Since `let` is block scoped, each button will reference its
own separate variable. Another alternative is to do the following:
```javascript
for (var i = 0; i < 5; i++) {
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Button ' + i));
  (function(i) {
    btn.addEventListener('click', function(){ console.log(i); });
  })(i);
  document.body.appendChild(btn);
}
```
The above creates an inner function with its own context, and by passing `i` into
it, each button will reference that block's `i` variable, which is separate from
the `i` in the outer function's scope.

---

### Q14:
Assuming `d` is an "empty" object in scope, say: `var d = {};`
...what is accomplished using the following code?
```javascript
[ 'zebra', 'horse' ].forEach(function(k) {
	d[k] = undefined;
});
```

### A:
This will add 'zebra' and 'horse' properties to the object and initialize them
to `undefined`.

---

### Q15:
What will the code below output to the console and why?
```javascript
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
```

### A:
It will output:
```
array 1: length=5 last=j,o,n,e,s
array 2: length=5 last=j,o,n,e,s
```

The important point is that the `reverse()` method mutates the array and returns
a reference to the array. So in this case, `arr2` is pointing to the same location of
memory as `arr1`, which is reversed after calling `reverse()`. The second thing
to note is that if you pass an array into the `push()` method, it will push the
entire array into a single element of the target array. Since `slice(-1)` gets the last element of an array,
we see all of `arr1` in the log.

---

### Q16:
What will the code below output to the console and why?
```javascript
console.log(1 +  "2" + "2");
console.log(1 +  +"2" + "2");
console.log(1 +  -"1" + "2");
console.log(+"1" +  "1" + "2");
console.log( "A" - "B" + "2");
console.log( "A" - "B" + 2);
```

### A:
The resulting logs will be:
```
"122"
"32"
"02"
"112"
"NaN2"
NaN
```

JavaScript performs automatic type conversion. If one of the two operands is a
string, it assumes it needs to do string concatenation, and converts the non-
string to a string. A "+" or "-" placed next to a string is called a "unary"
operator, which converts the string to a positive or negative number
respectively, and are handled before addition or subtraction. For the last two
examples, performing arithmatic on non-numbers results in `NaN`. You can add a
string to `NaN`, which converts it into a string, but trying to add a number to
`NaN` simply yields `NaN`.

---

### Q17:
The following recursive code will cause a stack overflow if the array list is
too large. How can you fix this and still retain the recursive pattern?
```javascript
var list = readHugeList();

var nextListItem = function() {
  var item = list.pop();

  if (item) {
    // process the list item...
    nextListItem();
  }
};
```

### A:
```javascript
var nextListItem2 = function() {
  var item = list.pop();

  if (item) {
    setTimeout(nextListItem2, 0);
  }
};
```

Instead of the call stack handling the recursion, we use the event loop. This
prevents a stack overflow, as all events in the event loop are handled as soon
as possible, and no sooner. In other words, this makes the nextListItem2 an
asynchronous function.

---

### Q18:
What is a "closure" in JavaScript? Provide an example.

### A:
A closure is most associated with inner functions, and the fact that they have
access to variables in the outer function's scope. For example:
```javascript
function outer() {
  var x = "woohoo";
  function inner() {
    console.log(x);
  }
  inner();
}
outer();
```

The above example would log "woohoo". To be more specific, the inner function
has access to 3 different scopes: its own, the enclosing function, and global.

---

### Q19:
What will be the output of the following code:
```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}
```

Explain your answer. How could the use of closures help here?

### A:
The output would be:
```
5, 5, 5, 5
```

Once again, this is because `setTimeout` moves the `console.log` to the event loop,
which is executed after the call stack completes. At that point, `i` will be 5
for `console.log`. You can use closures to fix this by enclosing the `setTimeout`
in its own function with its own scope, and passing in the `i` value. You can also use
ES6's `let`.
```javascript
for (var i = 0; i < 5; i++) {
  (function(i) {
    setTimeout(function() { console.log(i); }, i * 1000 );
  })(i);
}
// or, in ES6:
for (let i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}
```

---

### Q20:
What would the following lines of code output to the console?
```javascript
console.log("0 || 1 = "+(0 || 1));
console.log("1 || 2 = "+(1 || 2));
console.log("0 && 1 = "+(0 && 1));
console.log("1 && 2 = "+(1 && 2));
```

Explain your answer.

### A:
The output would be:
```
"0 || 1 = 1"
"1 || 2 = 1"
"0 && 1 = 0"
"1 && 2 = 2"
```

With logical operators, JavaScript will return the first value that satisfies
the condition. The last log is a little confusing, because you may expect it
to return `true`, but it returns 2. This is because the `&&` operator returns the
expression itself. Since it needs both sides to be truthy, it has to check the
second side no matter what. In this case, that side is 2, which is truthy even
though it isn't boolean. Since `&&` returns the expression itself, it returns that
2. This is why, in libraries like React, you can conditionally show something by
doing `{ foo === 1 && <div>foo equals 1!</div> }`.

---

### Q21:
What will be the output when the following code is executed? Explain.
```javascript
console.log(false == '0')
console.log(false === '0')
```

### A:
The output will be:
```
true
false
```

The == operator tries to make the values on each side the same type before comparing
them, while the === operator compares both the value and type.

---

### Q22:
What is the output out of the following code? Explain your answer.
```javascript
var a={},
    b={key:'b'},
    c={key:'c'};

a[b]=123;
a[c]=456;

console.log(a[b]);
```

### A:
The output will be:
```
456
```

When you set an object property, JavaScript will actually stringify the
parameter. Since objects are stringified as "[object Object]", the above
example is actually interpreted as:
```javascript
a["[object Object]"] = 123;
a["[object Object]"] = 456;
console.log(a["[object Object]"]);
```

---


### Q23:
What will the following code output to the console:
```javascript
console.log((function f(n){return ((n > 1) ? n * f(n-1) : n)})(10));
```

Explain your answer.

### A:
This is essentially the same as 10 factorial, which is 3628800. The function
is recursive, meaning it calls itself within itself until `n` is less than 1.

---

### Q24:
Consider the code snippet below. What will the console output be and why?
```javascript
(function(x) {
  return (function(y) {
    console.log(x);
  })(2)
})(1);
```

### A:
It will output `1`. The inner function has access to the outer function's variables because of
the closure.

---

### Q25:
What will the following code output to the console and why:
```javascript
var hero = {
  _name: 'John Doe',
  getSecretIdentity: function (){
      return this._name;
  }
};

var stolenSecretIdentity = hero.getSecretIdentity;

console.log(stolenSecretIdentity());
console.log(hero.getSecretIdentity());
```

What is the issue with this code and how can it be fixed?

### A:
It will output:
```
undefined
'John Doe'
```

The issue is that by setting `stoleSecretIdentity` to `hero.getSecretIdentity`, you
are basically making a copy of the method and turning it into its own stand-
alone function. When you try to execute that function, `this` no longer
refers to the hero object, but the `window` object, which doesn't have a `_name`
property.

Remember, adding parenthasis after a function name means you invoke that
function. If you do:
```javascript
var stolenSecretIdentity = hero.getSecretIdentity();
```

It would assign "John Doe" to `stolenSecretIdentity`.

The second one logs the name properly, because you're calling `getSecretIdentity`
as a method of hero, so `this` refers to the hero context.

You can fix the first console log by binding the hero object to the function:
```javascript
var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);
```

### Q26:
Create a function that, given a DOM Element on the page, will visit the element
itself and all of its descendents (not just its immediate children). For each
element visited, the function should pass that element to a provided callback
function.

The arguments to the function should be:
  - a DOM element.
  - a callback function (that takes a DOM element as its argument)

### A:
```javascript
function processDescendents(el, callback) {
  callback(el);
  const children = el.children;
  for (let i = 0; i < children.length; i++) {
    processDescendents(children[i], callback);
  }
}
```

---

### Q27:
What is the output of the following code?
```javascript
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
```

### A:
The output is:
```
10
2
```

This one is pretty fucked up. The first `fn()` in the `method` property logs 10 because it's calling the
function defined towards the top, so `this` refers to the global scope. The
second one, however, is calling `fn` within the context of the arguments array.
Therefore, this.length refers to arguments.length, which is 2.

---

### Q28:
Consider the following code. What will the output be, and why?
```javascript
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
```

### A:
It will output:
```
1
undefined
2
```

This one is also pretty fucked up. The declarations for `var x` and `var y` are hoisted to
the top of the function **without** their initial values. Those stay in the `catch` block.
In other words, after hoisting, this is what's actually happening:
```javascript
(function () {
  var x, y; // outer and hoisted
  try {
    throw new Error();
  } catch (x /* inner */) {
    x = 1; // inner x, not the outer one
    y = 2; // there is only one y, which is in the outer scope
    console.log(x /* inner */);
  }
  console.log(x);
  console.log(y);
})();
```

The `x = 1` line in the `catch` block refers to the `x` being passed into that block, NOT the `x` declared
in the outer scope. So, the `console.log`, which is in the scope of the `catch` block, will output 1. 
The second `console.log`, which is in the outer scope, will output `undefined`, because the `x` in the outer
scope does not have a value. Since the `y` in the `catch` block refers to the `y` in the outer scope, it
sets its value, which is properly logged.

---

### Q29:
What will be the output of this code?
```javascript
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl ();
```

### A:
The output will be `undefined`

While the `x` declared in the function is hoisted to the top of the function, its
value isn't hoisted, so it's undefined.

---
### Q30:
How do you clone an object?

### A:
```javascript
var clone = Object.assign({}, obj);
// Or in ES6:
var clone = ...obj;
```

These only work if the object doesn't have nested objects. If they do, those
nested objects need to be cloned individually.

---

### Q31:
What will this code print?
```javascript
for (let i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}
```

### A:
It will print:
```
0, 1, 2, 3, 4
```

Since `i` is declared with `let`, it has a block scope, so each console log refers
to the `i` variable in the for loop. The value is preserved.

---

### Q32:
What do the following lines output, and why?
```javascript
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

### A:
They output:
```
true
false
```

Conditionals are evaluated left to right. So for the first log, `1 < 2 < 3`
becomes `true < 3`. Since `true` is evaluated as 1, this is the same as `1 < 3`,
which evaluates to `true`.

For the second one, `3 > 2 > 1` becomes `true > 1`, which is evaluated as `1 > 1`,
which is `false`.

---

### Q33:
How do you add an element at the begining of an array? How do you add one at
the end?

### A:
To add to the beginning:
```javascript
array.unshift("start");
```

To add to the end:
```javascript
array.push("end");
// or in ES6:
var array = ["start", ...oldArray, "end"];
```

---

### Q34:
Imagine you have this code:
```javascript
var a = [1, 2, 3];
```

a) Will this result in a crash?
```javascript
a[10] = 99;
```

b) What will this output?
```javascript
console.log(a[6]);
```

### A:
a) No, it will not crash. It will add 99 to index 10, filling all indexes between
   with empty values.
   
b) This will output `undefined`, but the catch is that the value, `undefined`, is
   not actually stored in the array.
   
---

### Q35:
What is the value of `typeof undefined == typeof NULL`?

### A:
```
true
```

The trick is that JavaScript is case sensitive, so `NULL` is actually treated as
an undefined variable, rather than `null`.

So, `typeof undefined = "undefined"`, and `typeof NULL = "undefined"`.

---

### Q36:
What would following code return?
```javascript
console.log(typeof typeof 1);
```

### A:
```
"string"
```

`typeof` returns the type of the object as a string, since `typeof 1` equals
`"number"`, `typeof "number"` equals `"string"`.

---

### Q37:
What will the following code output and why?
```javascript
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
```

### A:
It will output `3`.

The declaration of `var b` is hoisted to the top of the inner function, but not
the value, so `b++` doesn't do anything. It's the same as:
```javascript
function inner() {
  var b;
  b++; // results in NaN
  b = 3
  console.log(3);
}
```
