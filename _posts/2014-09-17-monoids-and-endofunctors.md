---
layout: math-post
title: Monoids in the Category of Endofunctors
author: Alex Westphal
tags: haskell scala monoid monad endofunctor
---

A common criticism of Functional Programming in general and [Haskell](http://en.wikipedia.org/wiki/Haskell_(programming_language))
in particular, is the perceived complexity inherent in working with monads and other concepts from Category Theory. This
perception of complexity is due to the difficulty of comprehending how Category Theory is an abstraction of Mathematics
itself.

The perception of complexity is further reinforced by comments like the following:

> A monad is just a monoid in the category of endofunctors, what's the problem? - Philip Wadler

This quote has achieved notoriety amongst programmers, both for being obtuse and being roughly true. Fictionally
attributed to [Philip Wadler](http://en.wikipedia.org/wiki/Philip_Wadler) by James Iry in his [Brief, Incomplete and
Mostly Wrong History of Programming Languages](http://james-iry.blogspot.com/2009/05/brief-incomplete-and-mostly-wrong.html),
it is actually just a rephrasing of a quote from [Saunders Mac Lane](http://en.wikipedia.org/wiki/Saunders_Mac_Lane)
in [Categories for the Working Mathematician](http://en.wikipedia.org/wiki/Categories_for_the_Working_Mathematician).

> All told, a monad in X is just a monoid in the category of endofunctors of X, with product × replaced by composition
of endofunctors and unit set by the identity endofunctor. - Saunders Mac Lane

In this article we will look at the origins of and relationships between monoids, monads and endofunctors. We will also
explore their use in Haskell and Scala.

## What is A monoid?

Despite a common belief amongst programmers, monoids are rooted in Abstract Algebra rather than Category Theory. In
mathematics they are generally described as a [semigroup](http://en.wikipedia.org/wiki/Semigroup) with identity.

If $$S$$ is a set and $$\bullet$$ is some binary operator, $$S \times S \rightarrow S$$, then $$\langle S, \bullet\rangle$$ is a
monoid if it satisfies these laws:

$$(a \bullet b) \in S \ \forall \ a,b \in S \quad (closure)$$

$$( a \bullet b) \bullet c = a \bullet (b \bullet c) \ \forall \ a,b,c \in S \quad (associativity)$$

$$ \exists \ e \in S \:\: s.t. \:\: e \bullet a = a = a \bullet e \ \forall \ a \in S \quad (identity)$$

A good example is the natural numbers $$\mathbb{N}$$, which form a monoid under addition $$\langle\mathbb{N}, +\rangle$$
with identity element 0 or multiplication $$\langle\mathbb{N}, \times\rangle$$ with identity element 1. Another common
monoid in the world of programming is the set of all strings under concatenation $$\langle S^*, ++\rangle$$ with
identity element the empty string.

## What is a functor?

A functor $$F$$ from a category $$C$$ to a category $$D$$ is a mapping that associates:

- objects: $$X \in C$$ to $$F(X) \in D$$
- morphisms: $$f : X \rightarrow Y \in C$$ to $$F(f) : F(X) \rightarrow F(Y) \in D$$ such that:

$$F(id_x) = id_{F(x)} \ \forall \ X \in C$$

$$f(g \circ f) = F(f) \circ F(g) \ \forall f: X \rightarrow Y, g: Y \rightarrow Z$$

There is also a special kind of functors, called endofunctors which are mappings from a category to itself. In
programming we mostly work exclusively with the category of types so primarily use only endofunctors.

## What is a monad?

If $$C$$ is a category, a monad on $$C$$ consists of:

- An endofunctor $$T : C \rightarrow C$$
- A natural transformation, $$\mu : T \circ T \rightarrow T$$, where $$\circ$$ means functor composition
- A natural transformation, $$\eta : I \rightarrow T$$, where $$I$$ is the identity endofunctor on $$C$$

Satisfying these laws:

$$\mu(\mu(T \circ T) \circ T)) = \mu(T \circ \mu(T \circ T))$$

$$\mu(\eta(T)) = T = \mu(T(\eta))$$

In functional programming, the term *monad* is used with a meaning corresponding to that of a *strong monad* in
Category Theory. In functional programming a *monad* is formally defined as consisting of:

- A type constructor $$M$$ that defines, for every underlying type $$A$$, how to obtain a corresponding monadic type
$$M_A$$
- An operation *unit* that takes a value from a plain type $$A$$ and puts it into a monadic container of type $$M_A$$
- An operation *bind* that chains a monadic value of type $$M_A$$ with a function of type $$A \rightarrow M_B$$ to
create a monadic value of type $$M_B$$ (symbolically $$>\!\!>\!\!=$$)

We can reformulate the earlier monad laws using these operators:

$$( m >\!\!>\!\!= f) >\!\!>\!\!= g \equiv m >\!\!>\!\!= ( \lambda x \rightarrow (f(x) >\!\!>\!\!= g))$$

$$unit(x) >\!\!>\!\!= f \equiv f(x)$$

$$ m >\!\!>\!\!= unit \equiv m$$

## Obtuse Quotes

Getting back to the quote "A monad is just a monoid in the category of endofunctors".

Let's consider the category of the types $$T$$. A monads type constructor associates types $$A \in T \rightarrow M_A \in T$$.
Similarly a monads unit operation associates values $$ a \in A \rightarrow m \in M_A$$. Thus the type constructor
and unit operator form an endofunctor in $$T$$.

Together the unit and bind operators serves as the composition operator over endofunctors. It allows composing $$A
\rightarrow M_A$$ with $$ A \rightarrow M_B$$ yielding a new endofunctor $$A \rightarrow M_B$$. We know from our monadic
laws that endofunctor composition is associative so this suffices as our monoidal binary operator.

We also know (by our monad laws) that our unit operator applied with bind results in the provided monadic value. That is
it serves as the identity over our endofunctors. It is thus able to serve as the identity for our monoid as well.

Because a monad is a monoid in the category of endofunctors we could pretty much say that $$M = \langle T, >\!\!>\!\!=\rangle$$
with identity $$unit$$.


(I've demostrated it intuitively in regards to functional programming because I don't have the depth of knowledge of
category theory to prove it properly).

## Use in Haskell

Haskell brought Monads to the programming world, in the form of a `Monad` typeclass defined in [Control.Monad](
https://hackage.haskell.org/package/base-4.7.0.1/docs/Control-Monad.html#t:Monad). It is effectively implemented as:

{% highlight haskell %}
class Monad m where
    return  :: a -> m a
    (>>=)   :: m a -> (a -> m b) -> m b
{% endhighlight %}

Haskell provides a do-notation that allows the compiler to translate:

{% highlight haskell %}
a = do x <- [3..4]
       [1..2]
       return (x, 42)
{% endhighlight %}

into the form:

{% highlight haskell %}
a = [3..4] >>= (\x -> [1..2] >>= (\_ -> return (x, 42)))
{% endhighlight %}

This allows complex sequential pipelines to be created that allow IO amongst other things. Functors and Monoids were
later to the party and are defined in [Data.Functor](https://hackage.haskell.org/package/base-4.7.0.1/docs/Data-Functor.html)
and [Data.Monoid](https://hackage.haskell.org/package/base-4.7.0.1/docs/Data-Monoid.html) respectively:


{% highlight haskell %}
class Functor f where
    fmap :: (a -> b) -> f a -> f b

class Monoid a where
    mempty  :: a
    mappend :: a -> a -> a
{% endhighlight %}

## Use in Scala

The authors of Scala's standard library wanted to avoid scaring potential users, so skipped monoids but included
pseudo-functors and pseudo-monads without calling them that. Oddly rather than having a trait to represent classes
that are functors or monads, they instead special method names and compiler magic to allow their use in
for-comprehensions:

- Any class with a method `map` (directly, inherited, or via implicit conversion), that has a signature of approximately
`map[B](f: (A) => B): C` is auto-magically a pseudo-functor.
- Any class with a method `flatMap` (directly, inherited, or via implicit conversion), that has a signature of
approximately `flatMap[B](f: (A) => Traversable[B]): C` is auto-magically a pseudo-monad.

This compiler magic means that for-comprehensions can do similar things to the do-notation in Haskell. For example this
for-comprehension:

{% highlight scala %}
for(a <- 0 to 50 by 10 ; b <- 1 to 3) yield a + b
{% endhighlight %}

is equivalent to a combination of `map` a and `flatMap` invocations:

{% highlight scala %}
0 to 50 by 10 flatMap { a => 1 to 3 map { b => a + b } }
{% endhighlight %}

Not satisfied with this implementation, several libraries have implemented their own versions using type classes:

- Algebird - [com.twitter.algebird.Monad](http://twitter.github.io/algebird/#com.twitter.algebird.Monad) and
[com.twitter.algebird.Monoid](http://twitter.github.io/algebird/#com.twitter.algebird.Monoid)
- Scalaz - [scalaz.Functor](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.Functor),
[scalaz.Monad](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.Monad), and
[scalaz.Monoid](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.Monoid)
- Spire - [spire.algebra.Monoid](http://docs.typelevel.org/api/spire/stable/0.6.0/unidoc/#spire.algebra.Monoid)

Scalaz's implementation is effectively the following:

{% highlight scala %}
trait Functor[F[_]] {
    def map[A,B](fa: F[A])(f: A => B): F[B]
}

trait Monoid[A] {
    def zero: A
    def append(x: A, y: A): A
}

trait Monad[F[_]] {
    def point[A](a: A): F[A]
    def bind[A, B](fa: F[A])(f: (A) => F[B]): F[B]
}
{% endhighlight %}

Clever implicit conversions in [scala.syntax](http://docs.typelevel.org/api/scalaz/stable/7.0.4/doc/#scalaz.syntax.package)
provide useful operators that match or approximate mathematical operators. These include:

- Functor composition:  `∘`
- Monadic Binding: `>>=`
- Monadic Injection: `>>`
- Monoidal Binary Operator: `|+|`



