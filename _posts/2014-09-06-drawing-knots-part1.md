---
layout: post
title: Drawing Knots (Part 1)
author: Alex Westphal
tags: knots svg
---

This is the first of a four part series. If your already familiar with SVG, you can skip to
[Drawing Knots (Part 3)]({% post_url 2014-09-08-drawing-knots-part3 %}).


## Background

Since writing an article on [The Reef Knot]({% post_url 2014-09-04-reef-knot %}), I've had several people ask how I
created the knot images. The answer is Scalable Vector Graphics (SVG) an XML based image format.

There are several graphical applications (eg Adobe Illustrator) that allow for the creation of SVGs. I find these
type of tools irritating to use, so I create SVG's using a text editor. In this article, I'm going to explain the basics
of SVG and how It can be used to draw knots.


## Usage

Each knot I create lives in its own file and is stored in the `/knots` directory of this site. To include them in an
post I just need an image tag:

{% highlight html %}
<img src="/knots/reef-knot.svg" alt="Reef Knot Diagram"/>
{% endhighlight%}

(I use Markdown to generate posts, so the actual syntax is slightly different but that's the subject of a future post.)


## Structure of a SVG File

SVG is an XML based format so every file needs a root element and a schema definition:

{% highlight xml %}
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" >
</svg>
{% endhighlight %}

I also using a fixed coordinate space of 200x100 and a default rendering size of 400x200:

{% highlight xml %}
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" viewBox="0 0 200 100" width="400" height="200">
</svg>
{% endhighlight %}

An SVG file consists of graphical elements that are drawn onto the screen one at a time. These elements are defined as
tags inside the `<svg>` tag. For example, a simple rectangle that occupies the upper left quadrant of the image:


{% highlight xml %}
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" viewBox="0 0 200 100" width="100" height="50">
    <rect x="0" y="0" width="200" height="100"/>
</svg>
{% endhighlight %}

Note: The `<svg>` tag is assumed in the examples hereafter so is omitted for clarity.

## SVG Basics

Positioning and sizing of elements is done with the unit-less coordinate system that we defined with the viewBox
attribute. Like many other computer based systems the origin is at the top-left with the X-axis running across and the
Y-axis running down.

![Coordinate System](/knots/drawing/coordinates.svg)

One of the most basic shapes that can be drawn is a rectangle. A `rectangle` requires only the `x` and `y` coordinates
for the upper left corner, a `width` and a `height`. The following will draw a 40x40 rectangle at (30,30):

{% highlight xml %}
<rect x="30" y="30" height="40" width="40" fill="#338"/>
{% endhighlight %}

In this case we have also specified the fill colour via the `fill` attribute to be `#338` (dark blue). Therefore when
drawn we see:

![Solid Rectangle](/knots/drawing/rectangle1.svg)

Often we only want a the outline of a shape, so we use the `stroke` attribute, with the `fill` attribute set to
`transparent`:

{% highlight xml %}
<rect x="30" y="30" height="40" width="40" stroke="#D44" fill="transparent"/>
{% endhighlight %}

Which looks like:

![Empty Rectangle](/knots/drawing/rectangle2.svg)

Other shapes we can draw include circles, ellipses, lines and polygons. A `circle` is defined by the coordinates of its
centre `cx`, `cy` and it's radius `r`. An `ellipse`, like a circle is defined by the coordinates of it's centre `cx`,
`cy`. Unlike a `circle` the radius of an `ellipse` is not uniform so we define it using two values `rx` and `ry`. A line
is defined by the coordinates of it's start `x1`,`y1` and the coordinates of it's end `x2`, `y2`. A polygon is defined
by a series of coordinate `points`.

{% highlight xml %}
<circle cx="50" cy="25" r="20" stroke="red" fill="transparent"/>

<ellipse cx="50" cy="75" rx="25" ry="15" stroke="blue" fill="transparent"/>

<line x1="120" x2="180" y1="10" y2="40" stroke="#CB0" fill="transparent"/>

<polygon points="155 60 155 70 165 70 165 80 155 80 155 90 145 90 145 80 135 80 135 70 145 70 145 60" stroke="green" fill="transparent"/>
{% endhighlight %}

![Shapes](/knots/drawing/shapes.svg)

Just like a rectangle all of these shapes can be configured using the `fill`, `stroke`, `stroke-width` and a variety of
other attributes.

At this point I should probably mention that the background grid in the examples isn't some magic SVG feature. It is
created using just the `rectangle` and `line` shapes that I've just explained.

In [Drawing Knots (Part 2)]({% post_url 2014-09-07-drawing-knots-part2 %}) we will look at a more powerful type of SVG
shape, the `path`.



