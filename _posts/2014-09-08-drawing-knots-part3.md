---
layout: post
title: Drawing Knots (Part 3)
author: Alex Westphal
tags: knots svg
---

In [Drawing Knots (Part 2)]({% post_url 2014-09-07-drawing-knots-part2 %}) we discussed paths along with line and curve
path commands. In this part we look at how we use those commands to draw sections of rope and thus knots.


## Drawing Order

Individual elements of an SVG are drawn in the order they are declared. So elements defined later get drawn on top:

{% highlight xml %}
<path d="M 50 50 H 150" stroke="blue" stroke-width="5" fill="transparent"/>
<path d="M 100 25 V 75" stroke="red" stroke-width="5" fill="transparent"/>
{% endhighlight %}

![Stacking Example](/knots/drawing/stacking1.svg)

Notice that the red line is always on top of the blue line. The only way to change this is to change the order in which
they are declared. Unsurprisingly this causes some difficulties when a rope needs to pass over then under another rope.

Typically we can resolve the stack order problem by breaking the path commands down into individual paths, then
rearrange the declaration order:

{% highlight xml %}
<path d="M 110 60 V 30" stroke="red" stroke-width="5" fill="transparent"/>
<path d="M 50 50 H 150" stroke="blue" stroke-width="5" fill="transparent"/>
<path d="M 90 30 V 60 C 90 80, 110 80, 110 60 " stroke="red" stroke-width="5" fill="transparent"/>
{% endhighlight %}

![Stacking Example](/knots/drawing/stacking2.svg)

There are also quite a few cases where a rope must pass over or under itself, so we add contrast by inserting a black
under layer with every path:

{% highlight xml %}
<path d="M 50 50 H 150" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 50 50 H 150" stroke="#D44" stroke-width="8" fill="transparent"/>

<path d="M 100 25 V 75" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 100 25 V 75" stroke="#D44" stroke-width="8" fill="transparent"/>
{% endhighlight %}

![Contrast Stacking Example](/knots/drawing/stacking3.svg)

Note: This technique of adding contrast doesn't allow a path to pass over itself as the under layer is below the
entire path.


## Sketching the Knot

Now that we have all the pieces in place we can finally start drawing the knot. To start we want to sketch the basic
lines of the knot then later we can make it look pretty.

Our first step in sketching the knot define the running and standing ends of each rope:

{% highlight xml %}
<!-- Red Rope - Running End -->
<path d="M 30 40 H 60" stroke="black" fill="transparent"/>

<!-- Red Rope - Standing End -->
<path d="M 0 60 H 60" stroke="black" fill="transparent"/>

<!-- Blue Rope - Running End -->
<path d="M 170 40 H 140" stroke="black" fill="transparent"/>

<!-- Blue Rope - Standing End -->
<path d="M 200 60 H 140" stroke="black" fill="transparent"/>
{% endhighlight %}

![Knot Sketching Step 1](/knots/drawing/sketch1.svg)

(I've added the coloured dots to help illustrate the start, end points of the path segments).

If we think about a Reef knot, we realise that each rope kind of forms a bight through the knot. We can therefore we can
sketch these bights as the next step:

{% highlight xml %}
<!-- Red Rope - Running End -->
<path d="M 30 40 H 60 L 120 20" stroke="black" fill="transparent"/>

<!-- Red Rope - Standing End -->
<path d="M 0 60 H 60 L 120 80" stroke="black" fill="transparent"/>

<!-- Red Rope - Bight -->
<path d="M 120 20 V 80" stroke="black" fill="transparent"/>

<!-- Blue Rope - Running End -->
<path d="M 170 40 H 140 L 80 20" stroke="black" fill="transparent"/>

<!-- Blue Rope - Standing End -->
<path d="M 200 60 H 140 L 80 80" stroke="black" fill="transparent"/>

<!-- Blue Rope - Bight -->
<path d="M 80 20 V 80" stroke="black" fill="transparent"/>
{% endhighlight %}

![Knot Sketching Step 2](/knots/drawing/sketch2.svg)

Now if our hypothetical rope could turn sharp corners we could call our sketch complete. But real ropes don't do tight
corners so we need to adjust the sketch to look more realistic. First we will fix the bights by replacing the line
commands with Cubic Bézier Curves:

{% highlight xml %}
<!-- Red Rope - Bight -->
<path d="M 120 20 C 150 20, 150 80, 120 80" stroke="black" fill="transparent"/>

<!-- Blue Rope - Bight -->
<path d="M 80 20 C 50 20, 50 80, 80 80" stroke="black" fill="transparent"/>
{% endhighlight %}

![Knot Sketching Step 3](/knots/drawing/sketch3.svg)

(I've added the coloured line to help visualise the slope angles, and their relationship to the control points)

That looks much better. We need to do the same thing for the inside lines. In their case I'm going to use dual Quadratic
Bézier Curves:

{% highlight xml %}
<!-- Red Rope - Running End -->
<path d="M 30 40 H 60 Q 80 40, 90 30 T 120 20" stroke="black" fill="transparent"/>

<!-- Red Rope - Standing End -->
<path d="M 0 60 H 60 Q 80 60, 90 70 T 120 80" stroke="black" fill="transparent"/>

<!-- Blue Rope - Running End -->
<path d="M 170 40 H 140 Q 120 40, 110 30 T 80 20" stroke="black" fill="transparent"/>

<!-- Blue Rope - Standing End -->
<path d="M 200 60 H 140 Q 120 60, 110 70 T 80 80" stroke="black" fill="transparent"/>
{% endhighlight %}

![Knot Sketching Step 4](/knots/drawing/sketch4.svg)

If we take away all the slope and control point indicators, it really starts looking like a reef knot:

![Knot Sketching Step 5](/knots/drawing/sketch5.svg)


## Colouring and Arranging the Knot

Now that we've sketched the shape of the knot we can add some colour and texture by utilising stacked paths:

{% highlight xml %}
<!-- Red Rope - Running End -->
<path d="M 30 40 H 60 Q 80 40, 90 30 T 120 20" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 30 40 H 60 Q 80 40, 90 30 T 120 20" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Red Rope - Standing End -->
<path d="M 0 60 H 60 Q 80 60, 90 70 T 120 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 0 60 H 60 Q 80 60, 90 70 T 120 80" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Red Rope - Bight -->
<path d="M 120 20 C 150 20, 150 80, 120 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 120 20 C 150 20, 150 80, 120 80" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Blue Rope - Running End -->
<path d="M 170 40 H 140 Q 120 40, 110 30 T 80 20" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 170 40 H 140 Q 120 40, 110 30 T 80 20" stroke="#22D" stroke-width="8" fill="transparent"/>

<!-- Blue Rope - Standing End -->
<path d="M 200 60 H 140 Q 120 60, 110 70 T 80 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 200 60 H 140 Q 120 60, 110 70 T 80 80" stroke="#22D" stroke-width="8" fill="transparent"/>

<!-- Blue Rope - Bight -->
<path d="M 80 20 C 50 20, 50 80, 80 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 80 20 C 50 20, 50 80, 80 80" stroke="#22D" stroke-width="8" fill="transparent"/>
{% endhighlight %}

![Knot Colouring](/knots/drawing/colour.svg)

That's the colour sorted but the stacking order is all wrong. We want the blue bight to be at the bottom, and the red
bight to be on top. We do this by rearranging the declaration order:

{% highlight xml %}
<!-- Blue Rope - Bight -->
<path d="M 80 20 C 50 20, 50 80, 80 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 80 20 C 50 20, 50 80, 80 80" stroke="#22D" stroke-width="8" fill="transparent"/>

<!-- Red Rope - Running End -->
<path d="M 30 40 H 60 Q 80 40, 90 30 T 120 20" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 30 40 H 60 Q 80 40, 90 30 T 120 20" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Red Rope - Standing End -->
<path d="M 0 60 H 60 Q 80 60, 90 70 T 120 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 0 60 H 60 Q 80 60, 90 70 T 120 80" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Blue Rope - Running End -->
<path d="M 170 40 H 140 Q 120 40, 110 30 T 80 20" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 170 40 H 140 Q 120 40, 110 30 T 80 20" stroke="#22D" stroke-width="8" fill="transparent"/>

<!-- Blue Rope - Standing End -->
<path d="M 200 60 H 140 Q 120 60, 110 70 T 80 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 200 60 H 140 Q 120 60, 110 70 T 80 80" stroke="#22D" stroke-width="8" fill="transparent"/>

<!-- Red Rope - Bight -->
<path d="M 120 20 C 150 20, 150 80, 120 80" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 120 20 C 150 20, 150 80, 120 80" stroke="#D44" stroke-width="8" fill="transparent"/>
{% endhighlight %}

![Knot Arranging](/knots/drawing/arrangement.svg)

One last step to make the knot look pretty is to add marks to the running ends that look a bit like whippings:

{% highlight xml %}
<!-- Red Rope - Running End Cap -->
<path d="M 30 36 v 8" stroke="black" fill="transparent"/>

<!-- Blue Rope - Running End Cap -->
<path d="M 170 36 v 8" stroke="black" fill="transparent"/>

<!-- Red Rope - Running End Marks -->
<path d="M 32 36 v 8" stroke="black" fill="transparent"/>
<path d="M 34 36 v 8" stroke="black" fill="transparent"/>
<path d="M 36 36 v 8" stroke="black" fill="transparent"/>

<!-- Blue Rope - Running End Marks -->
<path d="M 168 36 v 8" stroke="black" fill="transparent"/>
<path d="M 166 36 v 8" stroke="black" fill="transparent"/>
<path d="M 164 36 v 8" stroke="black" fill="transparent"/>
{% endhighlight %}

![Knot Ends](/knots/drawing/ends.svg)

If we remove the grid we now have a complete knot:

![Complete Reef Knot](/knots/reef-knot.svg)



In [Drawing Knots (Part 4)]({% post_url 2014-09-09-drawing-knots-part4 %}) we will look at SVG gradients and arrows and
how we can use them to draw complex knots and include movement information.