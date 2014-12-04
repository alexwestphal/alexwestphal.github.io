---
layout: post
title: Agda and Peano Numbers
author: Alex Westphal
tags: date time
---

I've recently been playing around with the [Agda Programming Language](http://en.wikipedia.org/wiki/Agda_%28programming_language%29)
and it struck me just how elegant the implementation of basic data type can be.

## What is Agda?

{% highlight agda %}
data ℕ : Set where
  zero : ℕ
  suc : ℕ → ℕ
{% endhighlight %}

{% highlight agda %}
_+_ : ℕ → ℕ → ℕ
zero + m = m
(suc n) + m = suc (n + m)
{% endhighlight %}