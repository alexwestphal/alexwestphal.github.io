---
layout: post
title: The Show Typeclass in Scala
author: Alex Westphal
tags: scala scalaz
---

One extremely useful typeclass that Haskell provides in the bases package is the
[Show](http://hackage.haskell.org/package/base-4.7.0.1/docs/Text-Show.html) typeclass. Unfortunately the Scala standard
standard libraries provide nothing of the sort so you have to resort to using Java's `Object.toString()`, yuck.
Fortunately [scalaz](https://github.com/scalaz/scalaz) provides us a nice implementation, so we're going to look how how
it's works.


## The Typeclass

The show typeclass in Haskell looks roughly like the following:
{% highlight haskell %}
class Show a where
    show :: a -> String
{% endhighlight %}

Translated into Scala that looks like:

{% highlight scala %}
trait Show[A] {
    def show(a: A): String
}
{% endhighlight %}


## Defining Instances

But a typeclass is useless without instances, lets declare one:

{% highlight scala %}
// Given: class Foo(val x: Int)

implicit val showFoo = new Show[Foo] {
    def show(a: Foo) = "Foo[" + a.x + "]"
}
{% endhighlight %}

This is rather verbose for something so simple. Can it be made more succinct? Yes it can. We'll add a utility method to
to the companion object that creates shows instances from functions:

{% highlight scala %}
object Show {
    def show[A](f: A => String): Show[A] = new Show[A] {
        def show(a: A): String = f(a)
    }
}
{% endhighlight %}

The instance declaration for Foo is then simply:

{% highlight scala %}
implicit val showFoo = Show.show( f => "Foo[" + f.x + "]" )
{% endhighlight %}

In a lot of case we can simply reuse the implementation provided by java's toString, so let's add a utility method for
doing that:

{% highlight scala %}
object Show {
    ⋮
    def showA[A][A]: Show[A] = new Show[A] {
        def shows(f: A): String = f.toString
    }
}
{% endhighlight %}

Then an instance for Int is:

{% highlight scala %}
implicit val showInt = SHow.showA[Int]
{% endhighlight %}


## Using the Typeclass

How do we use our lovely typeclass? Implicits and context bounds:

{% highlight scala %}
def bar[A: Show](a: A): String = implicitly[Show[A]].show(a) + ".bar"
{% endhighlight %}

That call to `implicitly` is kinda ugly. Lets add another utility method to the companion object:

{% highlight scala %}
object Show {
    ⋮
    @inline def apply[A](implicit A: Show[A]): Show[A] = A
}
{% endhighlight %}

Now rather than `implicitly[Show[A]]` we can just use `Show[A]`


## More Complex Instances

What about Tuples and List? Actually they're pretty easy too, we just need to swap the implicit val instance for a
parametric def:

{% highlight scala %}
implicit def showTuple1[A: Show]: Show[(A)] = Show show {
    case (a) => "(" + Show[A].show(a) + ")"
}

implicit def showTuple2[A: Show, B: Show]: Show[(A,B)] = Show show {
    case (a,b) => "(" + Show[A].show(a) + "," + Show[B].show(b) + ")"
}
⋮
{% endhighlight %}


## Better Syntax

Having to call `Show[A].show(a)` is still a bit clunky, what if we could reduce it to `a.show`? We can this by defining
a ShowOps trait with appropriate implicit conversions:

{% highlight scala %}
trait ShowOps[A] {
    def self: A
    implicit def S: Show[A]

    def show = S.show(self)
}

implicit def ToShowOps[A: Show](a: A) = new ShowOps[A] {
    def self = a;
    implicit def S: Show[A] = implicitly[Show[A]]
}
{% endhighlight %}

Now use is really easy:

{% highlight scala %}
def bar[A: Show](a: A): String = a.show + "bar"
{% endhighlight %}

## Scalaz

We now pretty much have the [scalaz.Show](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.Show)
implementation except that scalaz uses a [Cord](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.Cord)
rather than a String, for performance reasons.