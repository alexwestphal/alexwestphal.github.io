---
layout: math-post
title: Infinite Knots
author: Alex Westphal
tags: knots
---

Sometimes I hear people claim "I can tie every knot". In general I can disabuse them of this notion by demonstrating a
knot that they don't know (I know 60+, most of which are listed on the [knot reference page](/knot-reference)).

If the claim was from someone that knew more knots than I do (uncommon but easily possible), we can turn to
[The Ashley Book of Knots](http://en.wikipedia.org/wiki/The_Ashley_Book_of_Knots). It is highly improbable that even
Clifford W Ashley could tie all 3800+ knots listed therein without referring to some form of documentation.

Going even further, there are theoretically infinitely many knots. In this article we will look at a proof of this,
realised through twisting an overhand knot.


## The Natural Numbers

The set of th natural numbers $$\mathbb{N} = \{0,1,2,3,4,\ldots\}$$ (which will serve as a convenient proxy for
our knots) form an infinite set. Mathematically this can be denoted as:

$$\forall \ n \in \mathbb{N} \ \exists \ n+1 \in \mathbb{N}$$

That is, for all $$n$$ in the set $$\mathbb{N}$$ there exists $$n+1$$ that is also a member of the set $$\mathbb{N}$$.

## Numbering Knots

We will describe the set of knots formed by twisting an overhand knot as $$\mathbb{K} = \{k_0,k_1,k_2,k_3,k_4,\ldots\}$$
where $$k_0$$ is an un-knotted piece of rope, $$k_1$$ is the simple overhand knot, and $$k_x$$ is an overhand knot with
$$x$$ turns.

Interestingly the set of knots $$\mathbb{K}$$ is isomorphic to the set of natural number $$\mathbb{N}$$. That is, there
is a two way mapping between $$\mathbb{K}$$ and $$\mathbb{N}$$ ($$ n \in \mathbb{N} \leftrightarrow k_n \in \mathbb{K}$$).

## Visually

A table of the the knots of the first 7 knots:

| $$k_x$$ | Common Name       | Diagram                            |
|:-------:|:-----------------:| ---------------------------------- |
| $$k_0$$ | Bight             | ![k0 Knot](/knots/infinite-k0.svg) |
| $$k_1$$ | Overhand Knot     | ![k1 Knot](/knots/infinite-k1.svg) |
| $$k_2$$ | Figure Eight Knot | ![k2 Knot](/knots/infinite-k2.svg) |
| $$k_3$$ | Stevedore Knot    | ![k3 Knot](/knots/infinite-k3.svg) |
| $$k_4$$ |                   | ![k4 Knot](/knots/infinite-k4.svg) |
| $$k_5$$ |                   | ![k5 Knot](/knots/infinite-k5.svg) |
| $$k_6$$ |                   | ![k6 Knot](/knots/infinite-k6.svg) |



I hope you can see that for any knot $$k_n$$, adding extra twists yields $$k_{n+1}, k_{n+2}, \ldots$$ and thus by the
isomorphism with the natural numbers, there are infinite number of knots.
