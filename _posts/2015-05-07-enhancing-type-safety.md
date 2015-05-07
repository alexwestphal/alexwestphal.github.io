---
layout: post
title: Enhancing Type Safety (with Type Classes)
author: Alex Westphal
tags: scala json scalaz
---

One annoying aspect of Scala is that it inherits certain warts from Java as a result of being on the JVM. Among these
are the lack of type safety in core operations (compare, equals, toString). Fortunately recent versions of Scala and
Scalaz together provide some nice solutions.


## The Problem

In the beginning (before Java 1.5) there were no generics or interfaces in Java. As a result a couple of core operations
were defined on Object with no type constraints whatsoever. Of interest to us today are the following:

{% highlight java %}
boolean equals(Object obj)

String toString()
{% endhighlight %}


In scala these become:

{% highlight scala %}
def equals(arg: Any): Boolean

def toString(): String
{% endhighlight %}

Because these two methods are defined for every class (as a result of inheriting from Any) there is an implication that
they are valid for every class. This is clearly not the case. It is source of frustration for many when they call
`toString` expecting a reasonable result but instead get something like `Foo@1996cd68`.

The `equals` method is even more insidious because it's failings are harder to detect. It's default behaviour is that
of reference equality leading to unexpected (but correct) results.

In an ideal world these methods would only be defined for types for which they were meaningful. Unfortunately due to the
need to maintain backwards compatibility, this will not be happening anytime soon. Thus we need to find a different
solution.


## The Solution

In Scala we could create traits that define similar but different methods:

{% highlight scala %}
trait Equals[T] {
    def isEqual(that: T): Boolean
}

trait ToStr {
    def toStr: String
}
{% endhighlight %}

The problem with this approach is that while we could have all of our own classes implement them, existing classes don't
support them leaving us not much different from where we started. Additionally any place we want to use them we have to
ensure that we've specified that the types involved must implement the traits.

The better solution therefore is to use type classes. They allow us to retrofit our required behaviour onto existing
types and because they utilise implicits they are easier to use.


## Implementing Equal

The type class for equality is rather simple:

{% highlight scala %}
trait Equal[F] { self =>
    def equal(a1: F, a2: F): Boolean
}
{% endhighlight %}

We can also define a convenience method for obtaining Equal instances:

{% highlight scala %}
object Equal {
    @inline def apply[F](implicit F: Equal[F]): Equal[F] = F
}
{% endhighlight %}

Next some instances:

{% highlight scala %}
implicit object StringEqual extends Equal[String] {
    def equal(x: String, y: String): Boolean = x.equals(y)
}
implicit def ListEqual[T: Equal] extends Equal[List[T]] {
    def equal(xs: List[T], ys: List[T]): Boolean =
        xs.zip(ys).forall({ case (x,y) => Equal[T].equal(x,y) })
}
{% endhighlight %}

We can see that for many types we can reuse the existing equality defined by equals. To make this easier we'll add a
helper method to the companion object:

{% highlight scala %}
object Equal {
    ...
    def equalA[A]: Equal[A] = new Equal[A] {
        def equal(a1: A, a2: A): Boolean = a1.equals(a2)
    }
}
{% endhighlight %}

This makes many instance much simpler:

{% highlight scala %}
implicit val StringEqual = Equal.equalA[String]
{% endhighlight %}

The next issue is the syntax for checking the equality of two objects is not particular intuitive:
{% highlight scala %}
Equal[A].equal(x, y)
{% endhighlight %}

Ideally we would be able to use `==` and `!=` but unfortunately we have to find something else. Instead we'll use `===`
and `=/=`. We can define a trait that wraps values (to provide these operators) and a trait to implicitly covert to it:

{% highlight scala %}
trait EqualOps[F] { self =>
    implicit def F: Equal[F]

    final def ===(other: F): Boolean = F.equal(self, other)
    final def =/=(other: F): Boolean = !F.equal(self, other)
}

trait ToEqualOps {
    implicit def ToEqualOps[F](v: F)(implicit F0: Equal[F]) =
        new EqualOps[F] {
            def self = v
            implicit def F: Equal[F] = F0
        }
}
object ToEqualOps extends ToEqualOps
{% endhighlight %}

Now if the instances we defined before are in scope, we can import ToEqualOps to get the improved syntax:

{% highlight scala %}
import ToEqualOps._

"Foo" === "Bar" // false
"Foo" =/= "Bar" // true
{% endhighlight %}

We'll also define a few other useful helpers in the companion object:

{% highlight scala %}
object Equal {
    ...
    // Equal based on reference equality
    def equalRef[A <: AnyRef]: Equal[A] = new Equal[A] {
        def equal(a1: A, a2: A): Boolean = a1 eq a2
    }
    // Equal based on a comparison function
    def equal[A](f: (A,A) => Boolean): Equal[A] = new Equal[A] {
        def equal(a1: A, a2: A): Boolean = f(a1, a2)
    }
}
{% endhighlight %}


## Implementing Show

Rather than using the term toString, we'll switch to show (inspired by Haskell). A basic implementation of Show is
rather similar to Equal so we'll start with the full implementation and look at ways to improve it:

{% highlight scala %}
trait Show[F] { self =>
    def shows(f: F): String
}

object Show {
    // convenience method for obtaining instances
    @inline def apply[F](implicit F: Show[F]): Show[F] = F

    // Show using toString
    def showA[A]: Show[A] = new Show[A] {
        override def shows(a: A): String = f.toString
    }
    // Show using a toString function
    def shows[A](f: A => String): Show[A] = new Show[A] {
        override def shows(a: A): String = f(a)
    }
}

trait ShowOps[F] { self =>
    implicit def F: Show[F]

    final def shows: String = F.shows(self)
}

trait ToShowOps {
    implicit def ToShowOps[F](v: F)(implicit F0: Show[F]) =
        new ShowOps[F] {
            def self = v
            implicit def F: Show[F] = F0
        }
}
object ToShowOps extends ToShowOps

{% endhighlight %}

With appropriate instances we can do:

{% highlight scala %}
import ToShowOps._

foo.shows

{% endhighlight %}

While this is an improvement over `toString` because `shows` is only available if an appropriate instance exists in
scope, we still have a problem with methods like `println` that delegate to `toString`:

{% highlight scala %}
println(foo) // Calls foo.toString
{% endhighlight %}

To alleviate this we add `print` and `println` methods to `ShowOps`:

{% highlight scala %}
trait ShowOps[F] { self =>
    implicit def F: Show[F]

    final def shows: String = F.shows(self)
    final def print: Unit = Console.print(shows)
    final def println: Unit = Console.println(shows)
}
{% endhighlight %}

Thus enabling a usage that is 'safe':

{% highlight scala %}
foo.println
{% endhighlight %}

One advantage to using type classes is that they're composable. While this is convenient, doing it with strings is
inefficient. Therefore we want to add functionality to facilitate a more efficient strategy. To do this we'll use a
`scalaz.Cord`, in our type-class:

{% highlight scala %}
trait Show[F] { self =>
    def show(f: F): Cord = Cord(shows(f)
    def shows(f: F): String = show(f).toString
}
{% endhighlight %}

Notice that we've implemented the `show` and `shows` method in terms of each other. This means that we can pick either
one to implement and it all still works.


## Organisation

The type-classes described above are rather useful but take alot of work to use. You have to remember to import the
conversions and find a way to have the correct instances in scope. With some careful tuning you can provide the types,
conversions and instances for all the type-classes in two imports:

{% highlight scala %}
// Group the conversions together using trait inheritance
trait ToOps extends ToEqualOps with ToShowOps

// For each common type, group the instances together
trait StringInstance extends Equal[String] with Show[String] { ... }

// Group the instances together
trait Instances extends ListInstances with OptionInstances with StringInstance

// Add them together
trait Imports extends ToOps with Instances
object Imports extends Imports
{% endhighlight %}

Now all we need to use any of the conversions or instances is:

{% highlight scala %}
import Imports._

{% endhighlight %}

Scalaz makes effective use of this strategy to give a lot of flexibility in it's usage. To get everything:

{% highlight scala %}
import scalaz._ // Brings in all the type-classes
import Scalaz._ // Brings in all the instances and syntax conversions
{% endhighlight %}

Alternatively if I just wanted the Show type-class and the instances for String:
{% highlight scala %}
import scalaz.Show
import scalaz.syntax.ToShowOps
import scalaz.std.StringInstances._
{% endhighlight %}

