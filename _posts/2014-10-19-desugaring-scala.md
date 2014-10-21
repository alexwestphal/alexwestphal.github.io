---
layout: post
title: Desugaring Scala
author: Alex Westphal
tags: scala syntax
---

Many newcomers to Scala find the syntax to be bewildering. In general this comes down to not understanding the vast
amount of syntactic sugar provided by Scala. In this article we explore and de-sugar Scala's complex syntax and how
it relates to Java.

## Method Invocation

At it's core, Scala has the same method invocation syntax as Java. That is, the invocation target followed by `.` then
method name followed by `(` then the comma separated argument list followed by `)`. Described symbolically:
{% highlight scala %}
<target>.<method>([<arg0>, [<arg1>, ...]])
{% endhighlight %}

Concrete examples of this invocation syntax (valid in both Java and Scala):
{% highlight scala %}
str.hashCode()                  // No arguments
str.concat(str2)                // One Argument
str.substring(2,4)              // Multiple Arguments
str.concat(str2).concat(str3)   // Chained Invocation
{% endhighlight %}

There are two ways in which basic method invocation in Scala differs from Java. The first is that in the no argument
case the parenthesis can be left off yielding `str.hashCode` which looks like a field access. Note: If the method was
defined without parenthesis (eg `def hashCode: Int  = ...`), this form must be used.

The second way in which Scala differs is that it allows invocation of single argument methods without the `.` or
parenthesis at all. In a lot of cases this can help to reduce clutter and makes the code more readable. The following
example is obviously clearer than the previous one:
{% highlight scala %}
str concat str2             // One Argument
str concat str2 concat str3 // Chained Invocation
{% endhighlight %}

## Symbolic Operators

For library writers, one extremely useful feature of Scala is the ability to define symbolic operators for custom types.
Symbolic operators are realised through allowing symbols as class, field, and method names. Eg:
{% highlight scala %}
class Matrix {
    // Defined exactly as with any other method
    def +(m: Matrix): Matrix = ...
}

m1.+(m2) // 'Java style' invocation
m1 + m2  // Typical usage
m1 + m2 + m3
{% endhighlight %}

For some this may be reminiscent of Java's String concatenation operator `+` where `"ab" + "cd"` is syntactic sugar for
`"ab".concat("cd")`. The difference is that in Java, it is a compiler special case while in Scala it can be implemented
in user code. In fact Scala provides identical behaviour in Predef.StringAdd.

Some refer to the concept of symbolic operators using the term "operator overloading" which has rather negative
connotations from it's misuse in C++. Scala's difference is that they are implemented as methods and as such don't allow
many of the dangerous forms of overloading that C++ provides. For example Scala has no mechanism to overload `=`
because there is no safe and meaningful way to do so. Scala also encourages certain conventions around symbolic
operators specifically that they should only be used where the symbol is already understood in the domain (eg `+` for
matrix addition, and `++` for concatenation). Despite the conventions there are some that push the conventions, such as
Predef using `+` for String concatenation and Scalaz using `@\?/` for disjunction validation.

The Scala compiler is built to target JVM bytecode, so when compiling has to follow much the same rules as Java. One of
these rules is that the primitive symbols are not allowed as method, class or field names. To get around this the
compiler uses the names of the operator instead of the symbol (eg `+` becomes `$plus` and `+=` becomes `$plus$eq`).
This has the benefit that symbolic operators can be called from Java:
{% highlight scala %}
m1 + m2         // Scala Usage
m1.$plus(m2)    // Java Usage
{% endhighlight %}

In most cases the aforementioned binary operators are excellent but some domains need unary operators for certain things.
Unary operators come in two forms prefix (eg `-x`) and postfix (eg `e?`). Prefix operators are defined as special unary
methods (eg `def unary_- = ...`) and retricted to only a couple of operators (`+`, `-`, `!`). Postfix operators are
effectively just parameter-less symbolic methods (eg `def ? = ...`).


## Operator Associativity and Precedence

An area of Scala's syntax which can often trip people up is that of operator associativity and precedence. In general
the rules (when used without dots and parenthesis) are similar to Java and most other C family languages, that is
operators are left associative and precedence is what you learned in secondary school algebra. Scala's exact
precedence rules as as follows:

| First Char    | Precedence |
|:-------------:|:----------:|
|(any letter)   | 1          |
| \|            | 2          |
| ^             | 3          |
| &             | 4          |
| < >           | 5          |
| = !           | 6          |
| :             | 7          |
| + -           | 8          |
| * / %         | 9          |
|(other symbols)| 10         |

There is one exception to the precedence rules with regard to so called 'assignment' operators, that is operators that
end with `=` (`+=`, `/=`, etc). 'Assignment' operators always have the lowest possible precedence regardless of the
other rules. For example `3 + 4 == 1 + 2 * 3` is equivalent to `(3 + 4) == (1 + (2 * 3))`.


By far the largest confusion comes with right associative operators, that is operators that end with `:` (eg `::` `+:`,
etc). Unlike any other operator they associate and bind to the right. Thus `x :: xs` is equivalent to `xs.::(x)` and
`x :: y :: xs` is equivalent to `x :: (y :: xs)`.


## Assignment Operator

'Assignment' operators (operators that end with `=`) can provide two different kinds of operation. The first is an
update operation, that utilises the functionality described in the Symbolic Operators section. This is achieved by
explicitly declaring the desired operator. For example `scala.collection.mutable.ListBuffer` has an 'append to' method
defined (approximately) as:
{% highlight scala %}
def ++=(xs Traversable[A]): ListBuffer = ...
{% endhighlight %}

The behaviour of this particular operator is to update the `ListBuffer` by appending the elements of the `Traversable`.
Usage looks like:
{% highlight scala %}
import collection.mutable.ListBuffer
val xs = ListBuffer(1,2) // xs is now [1,2]
xs ++= ListBuffer(3,4)   // xs is now [1,2,3,4]
{% endhighlight %}


The other kind of 'assignment' operator is the re-assignment operator. It works only if there isn't an exact matching
assignment operator but the associated operator is defined and the target is a `var` rather than a `val`. That is, for
the expression `xs ++= ys`, it is a re-assignment operator if and only if `++=` is not defined on `xs`, '++' is
defined on `xs` and `xs` was defined using `var`. The exact compiler behaviour is a translation that should be
recognisable to C family programmers. This allows for the apparent updating of immutable types:

{% highlight scala %}
var xs = List(1,2) // xs is now [1,2]
xs ++= List(3,4)   // xs is now [1,2,3,4]

// Translates to
xs = xs ++ List(3,4)

{% endhighlight %}


## Function Application

Until Java8 the JVM didn't have a mechanism for native functions, thus to simulate a function a class is defined that is
a subtype of one of the Scala Function traits. (You don't actually have to do this explicitly because of the Functional
Literal syntax described later, and other compiler magic). An explicit example:

{% highlight scala %}
// Function Definition
val f = new Function1[Int,Int] {
    def apply(x: Int): Int = 2 * x
}

// Function application
f.apply(2) // or
f(2)
{% endhighlight %}

The last example above is the actual 'Function Application' syntactic sugar is exactly equivalent to the preceding line.
This particular syntax is used to for accessing collections, due to the fact that Iterables and Maps can be consider
partial functions from indicies to values and keys to values respectively. For example:

{% highlight scala %}
val list = List(1,2,3,4)
val map = Map("a" -> 1, "b" -> 2, "c" -> 3)

list(2)     // Returns 3
map("b")    // Return 2
{% endhighlight %}

## Updates

For mutable data structure, Scala provides a means to update them in a manner familiar to Java or C family programmers.
This is provided via a special `update` method that serves as a dual to the `apply` method of mutable collections.
{% highlight scala %}
array(2) = "hello"          // Syntactic Sugar
array.update(2, "hello")    // Expanded Form
{% endhighlight %}

## Type Sugar

Scala provides a useful sugar for function types that help make them feel more natural. `Function1[T1, R]` (the one
argument function) can otherwise be written as `T1 => A`, and similarly `Function2[T1, T2, R]` (the two argument
function) can be written as `(T1, T2) => A`. This pattern is available for all function types up to `Function23`.

Much the same as for the function types, the tuple types have a useful and natural feeling sugar. `Tuple1[T1]` can be
written as `(T1)` and similarly `Tuple2[T1,T2]` can be written as `(T1,T2)`. This pattern is available for all tuple
types up to `Tuple23`.

In addition to the syntactic sugar for function and tuple types, there is a special rule regarding types that allows
what at first glaces would appear to be syntactic sugar but is in fact just cleverly named type. The rule is that any
type with exactly two type parameters can be written using infix rather than prefix notation. This allow types such as
`Tuple2[A,B]` to be written as `A Tuple2 B`. While doing so with a alphabetic type tends to be weird, this form really
shines when using symbolic class names. Scalaz makes extensive use of this feature, providing types such as `\/`
(disjunction), `@@` (type tagging), and `<~<` (Liskov substitutability).

## Function Literals

Scala is considered a functional language and as such provides a fair bit of syntactic sugar relating to functions
that improves significantly over the old Java style of defining a class for each function (up to Scala 2.12, this is
still what happens under the hood). A simple function declared using the sytactic sugar looks like:

{% highlight scala %}
val f = (x: Int) => x + 1         // Type inferred as (Int) => Int
val g = (x: Int, y: Int) => x * y // Type inferred as (Int,Int) => Int
{% endhighlight %}

The type of the argument can be left off if it can be inferred from the context:
{% highlight scala %}
def foo(f: Int => Int) = ...
def bar(f: (Int, Int) => Int) = ...

foo(x => x + 1)    // Compile knows type should be (Int) => Int
bar(x,y => x * y)  // Compile knows type should be (Int,Int) => Int
{% endhighlight %}

In case such as that above, the parameter(s) is/are used exactly once each. This is actually a fairly common situation
so Scala allows the argument list to be dropped entirely and the usage of each argument to be replaced with `_`. Hence
the previous example reduces to:

{% highlight scala %}
foo(_ + 1)
bar(_ * _)
{% endhighlight %}

(Not quite as succinct as Haskell's `foo (1+)` and `bar (*)` but close)

Fully expanding all syntactic sugar the multiply function passed to bar becomes:
{% highlight scala %}
// Define the function type as an inner class
class $anonfun$1 extends Function2[Int, Int, Int] {
    def apply($a0: Int, $a1: Int): Int = $a0 * $a1
}
// Use the function
bar(new $anonfun$1)
{% endhighlight %}

Another case which at first glace appears special but is actually just the trivial application of the ability to leave
off a parameter list is that of code blocks. A code block is essentially just a no argument function and combined with
Scala's method invocation rules allows the defining of things that look like new control structures:

{% highlight scala %}
def doStuff(f: => Unit) = ...
doStuff {
    // Do stuff
}
{% endhighlight %}


## Tuple Literals

Tuple literals are probably the simplest form of syntactic sugar, yet they are still extremely useful. For a 3-tuple
such as `(Int, String, Int)` we can create of a value of that type as `(2, "abc", 5)`, which minus the sugar translates
to `new Tuple[Int, String, Int](2, "abc", 5)`.

## Extractors

No modern functional programming language would be complete without pattern matching and Scala is no exception. Scala's
pattern matching is provided using a special case for tuples and syntactic sugar around the `unapply` and `unapplySeq`
methods. The special case in relation to tuples is that the values in a tuple can be extracted with convenient syntax:
{% highlight scala %}
val (a,b,c) = (2, "abc", 5)
{% endhighlight %}

Scala's general pattern matching is implemented using the concept of extractors. That is objects that have an
appropriately typed `unapply` and/or `unapplySeq` method(s). For example a simple extractor that matches multiples of
ten and returns the multiple:
{% highlight scala %}
object Ten {
    def unapply(x: Int): Option[Int] =
        if(0 == x % 10) Some(x/10)
        else None
}

val Ten(x) = 30 // x is set to 3
val Ten(y) = 32 // throws scala.MatchError
{% endhighlight %}

If more than one values is to be extracted, then the return type of `unapply` is an appropriately size tuple wrapped in
an option (eg `Option[(Int, Int)]`). A useful special case exists for extracts that produce exactly two values. For this
case, the extractor can be written using either prefix or infix notation, leading to a variety of useful extracts. For
example the List extractor `::` is approximately defined and used as follows:
{% highlight scala %}
// Defining the :: extractor
object :: {
    def unapply[A](list: List[A]): Option[(A, List[A])] =
        if(list.isEmpty) None else Some((list.head, list.tail))
}

val ::(x, xs) = List(1,2,3) // x is 1, xs = List(2,3)
val y :: ys   = List(4,5,6) // y is 4, ys = List(5,6)
{% endhighlight %}

It should be obvious that `unapply` is sort of the reverse of `apply`, but if it's not clear here's a better example:
{% highlight scala %}
val List(x,y,z) = List(1,2,3)
// is roughly equivalent to
val (x,y,z) = List.unapply(List.apply(1,2,3)).get
{% endhighlight %}

(The `List` extractor is actually defined using `unapplySeq` rather that `unapply` which I will cover in more detail in
a future post)


## Case Classes

One common feature of modern functional programming languages is algebraic data types. Rather than have a special syntax
like many other languages, Scala provides them through the syntactic sugar detailed in this article. Even through you
can implement algebraic data types by hand, the authors of Scala realised that the implementation often mostly the same
so provided case classes. Just by putting `case` in front of a class declaration we get a whole bunch of useful methods
for free. For example:
{% highlight scala %}
case class Colour(r: Byte, g: Byte, b: Byte)
{% endhighlight %}
provides the equivalent of:
{% highlight scala %}
class Colour(val r: Byte, val g: Byte, val b: Byte) extends Product {
    def canEqual(that: Any): Boolean
    def equals(that: Any): Boolean
    def hashCode: Int
    def productArity: Int
    def productElement(n: Int): Any
}
object Colour {
    def apply(r: Byte, g: Byte, b: Byte): Colour
    def unapply(c: Colour): Option[(Byte, Byte, Byte)]
}
{% endhighlight %}


## Context Bounds

The most recent feature in this post, Context bounds are a feature that was added in 2.8 to support use of type classes.
As with everything else in this post, they are simply syntactic sugar. Under the covers they are just an unnamed
implicit parameter. For example to be able to sort a list we require the elements to have some kind of implicit
ordering. Therefore we can define the signature of a List sort as:
{% highlight scala %}
def sort[A: Ordering](xs: List[A]): List[A]
// which expands to
def sort[A](xs: List[A])(implicit $evidence0: Ordering[A]): List[A]
{% endhighlight %}


## Final Words

This article has detailed twelve different kinds of syntactic sugar in a reasonable amount of detail. If you look at
these example closely you'll notice that underneath all the sweetness, Scala is actually fairly Java-like. What this
means is we get Java compatibility while still having nice things.







