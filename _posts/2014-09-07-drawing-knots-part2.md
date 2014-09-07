---
layout: post
title: Drawing Knots (Part 2)
author: Alex Westphal
tags: knots svg
---


The basic shapes described in [Drawing Knots (Part 1)]({% post_url 2014-09-06-drawing-knots-part1 %}) can be useful but the true workhorse of SVG is the `path` element.
In addition to being able to replicate any of the basic shapes, a `path` can achieve a great variety of other shapes
and patterns. A 'path' is defined using path data in the form of the `d` attribute. Path data consists of a series of
commands like `M 10 10` or `L 30 50`.

A path command is specified by a letter followed by zero or more coordinates or values (depending on the command). All
of the commands come in two variants, one specified with a capital letter that uses absolute coordinates and a second
specified with a lowercase letter that uses uses coordinates relative to the command starting point.

Path commands are divided in to two types, line commands and curve commands.


## Line Commands

There are five line commands, which as the name suggests draws a straight line between two points.

The first line command is the "Move-to" command `M`. It takes an xy coordinate and moves the cursor to that point.
Somewhat confusingly it doesn't actually draw anything. Instead the "Move-to" command appears at the beginning of paths
to specify where the drawing should start.

`M x y`

or

`m dx dy`

There are three commands that draw actual lines. The most generic is the "Line-to" command `L`. It take an xy coordinate
and draws a line from the current position to the one specified by the coordinate.

`L x y`

or

`L dx dy`

In a simple example we draw two paths each consisting of two lines. The first uses the absolute variants of the
commands, and the second uses the relative variants.

{% highlight xml %}
<path d="M 20 20 L 80 20 L 80 80" fill="black"/>

<path d="m 120 20 l 60 0 l 0 60" stroke="black" fill="transparent"/>
{% endhighlight %}

![Using Line To](/knots/drawing/lines.svg)

Notice that the version with the `fill` attribute set to `black` filled the space between the lines.

There are two commands that serve as abbreviated forms of "Line-to", the "Horizontal Line-to" command `H` and the
"Vertical Line-to" command `V`. Both of them take a single argument since they only move in one direction.

`H x` or `h dx`

`V y` or `v dy`

Using these commands we can simplify the previous example:

{% highlight xml %}
<path d="M 20 20 H 80 V 80" fill="black"/>

<path d="m 120 20 h 60 v 60" stroke="black" fill="transparent"/>
{% endhighlight %}

Finally we get to the "Close-path" command `Z`. it draws a straight line from the current position back to the start of
the path. It is often placed at the end of the path, although it is not necessary to close a path.

`Z` or `z`

Using these line commands we can easily draw paths that represent any straight edged shaped. For example a pentagram:

{% highlight xml %}
<path d="M 100 20 L 118 74 L 72 40 H 128 L 82 74 Z" stroke="black" fill="transparent"/>

{% endhighlight %}

![Pentagram Lines Example](/knots/drawing/pentagram1.svg)


## Curve Commands

There are three different commands that can be used to create curves. Two types of
[Bézier Curves](http://en.wikipedia.org/wiki/Bézier_curve) and Arcs. In this series we will focus on Bézier Curves and
leave Arcs for a future post.


### Quadratic Bézier Curves

Of the two types of Bézier Curves supported by SVG, the simplest is the Quadratic. A Quadratic Bézier Curve `Q` is
defined by three points, a start point, an end point and a control point.

`Q x1 y1, x y`

or

`q dx1 dy1, dx dy`

The curve is fitted such that a forward tangent from the start point and a reverse tangent from the end point would
intersect at the control point.

{% highlight xml %}
<path d="M 50 60 Q 100 20, 150 60" stroke="black" fill="transparent"/>
{% endhighlight %}

![Quadratic Bézier Curve Example](/knots/drawing/quadratic-bezier1.svg)

When chaining Quadratic Bézier Curves, an abbreviated form `T` can be used. It requires an end point and infers the
control point from the preceding `Q` or `T` command.

`T x y`

or

`t dx dy`

Note: Unlike most other commands, the `T` command can only follow a `Q` or another `T` command.

{% highlight xml %}
<path d="M 50 30 Q 100 20, 100 50 T 150 70" stroke="black" fill="transparent"/>
{% endhighlight %}

![Quadratic Bézier Curve Example](/knots/drawing/quadratic-bezier2.svg)


### Cubic Bézier Curves

A Cubic Bézier Curve `C` is similar to a Quadratic Bézier Curve except it uses two control points rather than one.


`C x1 y1, x2 y2, x y`

or

`c dx1 dy1, dx2 dy2, dx dy`

The curve is fitted such that a forward tangent from the start point would intersect the first control point and a
revers tangent from the end point would intersect the second control point. If the two control points are the same the
curve is equivalent to a Quadratic Bézier Curve using the same start, end and control points.

{% highlight xml %}
<path d="M 50 50 C 100 25, 100 75, 150 50" stroke="black" fill="transparent"/>
{% endhighlight %}

![Chained Cubic Bézier Curve Example](/knots/drawing/cubic-bezier1.svg)

When chaining Cubic Bézier Curves, an abbreviated form `S` can be used. It requires an end point and a single control
point. It infers the other control point from the preceding `C` or `S` command.

`S x2 y2, x y`

or

`s dx2 dy2, dx dy`

Note: Much like the `T` command, the `S` command can only follow a `C` or another `S` command.

{% highlight xml %}
<path d="M 30 50 C 65 25, 65 75, 100 50 S 135 75, 170 50" stroke="black" fill="transparent"/>
{% endhighlight %}

![Chained Cubic Bézier Curve Example](/knots/drawing/cubic-bezier2.svg)

Now that with tools for drawing complex curves we can draw more elaborate shapes. Lets add some more to the pentagram:

{% highlight xml %}
<path d="M 100 20 L 120 70 L 70 40 H 130 L 80 70 Z Q 100 50, 130 40 Q 100 50, 120 70 Q 100 50, 80 70 Q 100 50, 70 40 Q 100 50, 100 20" stroke="black" fill="transparent"/>
{% endhighlight %}

![Pentagram Lines Example](/knots/drawing/pentagram2.svg)



In [Drawing Knots (Part 3)]({% post_url 2014-09-08-drawing-knots-part3 %}) we will look at how path elements stack and
how we can use paths to draw simple knots.