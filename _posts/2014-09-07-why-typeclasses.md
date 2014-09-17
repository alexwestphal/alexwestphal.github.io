---
layout: post
title: Why Typeclasses
author: Alex Westphal
tags: scala polymorphism
---

A common argument I hear when discussing ad-hoc polymorphism and typeclasses is "But I could do that with inheritance".
While inheritance based polymorphism can replace ad-hoc polymorphism in a lot of cases, there are also a large number
of cases where it can't achieve the same result.


## Show: Typeclass vs Inheritance

The Show typeclass (which I described in [The Show Typeclass in Scala]({% post_url 2014-09-04-scala-show-typeclass %}))
describes a class of types which is showable. It could alternatively be described by an interface. In either case it
essentially boils down to function of type `A => String` where `A` is the showable type.

Using inheritance based polymorphism we can describe a type as Showable:

{% highlight scala %}
// Showable Interface
trait Showable { def show: String }

// Class Bar that is showable
class Bar extends Showable {
    def show: String = ...
}

// Usage
def foo(a: Show) = a.show
{% endhighlight %}

The is reasonably succinct compared to the typeclass version:

{% highlight scala %}
class Bar // Define Class Bar

// Define the typeclass
trait Show[A] { def show(a: A): String }

// Declare an instance of Show for type A
implicit val showBar = new Show[Bar] {
    def show(bar: Bar): String = ...
}

// Usage
def foo[A: Show](a: A) = implicitly[Show[A]].show(a)
{% endhighlight %}

The obvious advantage of the typeclass version is that it can be applied after the definition of the class rather than
at declaration time like inheritance. There are also two other major benefits that aren't obvious in this case.

## Type Constructors

A type constructor is a function that constructs a new type from a old one. For example `List[A]` is a type constructor
with `A` as its type parameter. It can be applied to a type `Bar` to yield a new type `List[Bar]`. Some type
constructors can have more than one type parameter, e.g. `Function1[A,R]` has two type parameters `A` and `R`.

In Scala a type constructor is declared as a class. For example `List` is declared as:

{% highlight scala %}
class List[A]
{% endhighlight %}

If we want all types created by the `List` type constructor to be showable, we would declare it as:

{% highlight scala %}
class List[A] extends Showable
{% endhighlight %}

What happens when we feed a type `NotShowable` into our type constructor. We get a new type `List[NotShowable]`. Should
that new type be showable? Probably not. To fix this we could restrict the types on which our type constructor can be
applied:

{% highlight scala %}
class List[A <: Showable] extends Showable
{% endhighlight %}

We can no longer have a type like `List[NotShowable]` but the primary purpose of the `List` type constructor is to
construct types that can be used as lists rather than being showable. Toward that purpose `List[NotShowable]` could be
perfectly valid as a list.

Typeclasses provide a better solution because we can use polymorphic methods to define instances of our typeclass for a
type constructor:

{% highlight scala %}
def showList[A: Show]: Show[List[A]] = ...
{% endhighlight %}

This is a sensible declaration because it provides no restriction on `List` itself yet a type produced by the `List`
type constructor is only a member of the `Show` type class if and only if the input type is a member of the `Show`
typeclass. For example `List[Bar]` and `List[List[Bar]]` are members of the `Show` typeclass if and only if `Bar` is a
member.

In this way the foo function only accepts the types it can show:

{% highlight scala %}
def foo[A: Show](a: A) = implicitly[Show[A]].show(a)

val ls: List[Showable] = ...
val lns: List[NotShowable] = ...

foo(ls) // All good
foo(lns) // Compiler Error
{% endhighlight %}


## Configurable Implementations

Because typeclass instances are defined separately from their relevant types, we call it ad-hoc polymorphism. A major
benefit of being ad-hoc is that we can select different instances depending on our needs.

{% highlight scala %}
// Assuming the syntax tricks from the "Show Typeclass in Scala" post

// Define Instances for Tuple1
object ShowTupleInstance {
  implicit def showTuple1Parens[A: Show] =
    show[A]( case (a) => "(" + a.show + ")" )

  implicit def showTuple1Brackets[A: Show] =
    show[A]( case (a) => "[" + a.show + "]" )

  implicit def showTuple1Braces[A: Show] =
    show[A]( case (a) => "{" + a.show + "}" )
}

// Select the implementation we want to use
import ShowTupleInstances.showTuple1Brackets

foo((2)) // Returns "[2]"
{% endhighlight %}

Note: This feature of typeclasses is dependent on Scala's scoping rules and so isn't available in Haskell.


