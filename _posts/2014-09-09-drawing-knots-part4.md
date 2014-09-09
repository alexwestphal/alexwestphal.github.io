---
layout: post
title: Drawing Knots (Part 4)
author: Alex Westphal
tags: knots svg
---

In [Drawing Knots (Part 3)]({% post_url 2014-09-08-drawing-knots-part3 %}) we looked drawing simple knots using SVG. In
this the final part we look at gradients and arrows and how we can use them to draw complex knots and include movement
information.


## Gradients

Simple colours are fine for the sections of rope in our knot drawings but more complex colouring is often needed for
other kinds of shapes. In our case we are going to draw a pipe that we can tie a clove hitch around.

The easiest pipe we could draw would just be a grey rectangle:

{% highlight xml %}
<rect x="0" y="40" width="200" height="20" fill="#666"/>
{% endhighlight %}

![Plain Pipe](/knots/drawing/pipe1.svg)

This is a pretty boring pipe and doesn't look very round. We can fix that by using a vertical linear gradient. To define
a gradient we need a `defs` section just after the opening `<svg>` tag. In it we can then define a gradient:

{% highlight xml %}
<defs>
    <linearGradient id="PipeGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#666"/>
        <stop offset="50%" stop-color="#CCC"/>
        <stop offset="100%" stop-color="#888"/>
    </linearGradient>
</defs>
{% endhighlight %}

This gradient will transition from `#666` at the top to `#CCC` in the middle then `#888` at the bottom, thereby
simulating a curved surface.

To actually use this gradient on our pipe we link to it via it's ID:

{% highlight xml %}
<rect x="0" y="40" width="200" height="20" fill="url(#PipeGradient)"/>
{% endhighlight %}

We then end up with something that looks much more pipe like:

![Gradient Pipe](/knots/drawing/pipe2.svg)


## Knots around Pipes

Unlike our Reef knot from last time, passing a rope around a pipe requires the ropes sections to appear in three
dimensions rather than just one. For example a crude attempt to draw a turn around a pipe:

{% highlight xml %}
<!-- Standing End -->
<path d="M 105 100 V 40" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 105 100 V 40" stroke="#D44" stroke-width="8" fill="transparent"/>

<!-- Running End -->
<path d="M 95 20 V 60" stroke="black" stroke-width="9" fill="transparent"/>
<path d="M 95 20 V 60" stroke="#D44" stroke-width="8" fill="transparent"/>
{% endhighlight %}

![Crude Pipe Wrap](/knots/drawing/pipe3.svg)

It looks very flat. To give it some depth we have it curve around and pass over itself. Lets sketch just the standing end:

{% highlight xml %}
<path d="M 105 100 V 50 C 105 30, 122 30, 122 40" stroke="black" fill="transparent"/>
{% endhighlight %}

![Curve Sketch](/knots/drawing/pipe4.svg)

Now it looks like it's curving down. Lets sketch out an entire clove hitch:

{% highlight xml %}
<!-- Standing End -->
<path d="M 105 100 V 50 C 105 30, 122 30, 122 40" stroke="black" fill="transparent"/>

<!-- Running End -->
<path d="M 95 20 V 50 C 95 70, 78 70, 78 60" stroke="black" fill="transparent"/>

<!-- Cross Section -->
<path d="M 78 40 C 78 15, 122 85, 122 60" stroke="black" fill="transparent"/>
{% endhighlight %}

![Clove Hitch Sketch](/knots/drawing/clove-hitch-sketch.svg)

We can the pretty it up and remove the grid, leaving us with a nice Clove hitch:

![Clove Hitch](/knots/clove-hitch.svg)

## Arrows

Similar to a gradient, a marker is defined in the defs section:

{% highlight xml %}
<defs>
    <marker id='head' orient='auto' markerWidth='2' markerHeight='4'
            refX='0.1' refY='2'>
      <path d='M0,0 V4 L2,2 Z' fill='black' />
    </marker>
</defs>
{% endhighlight %}

Blown up it looks like this:

![Marker Diagram](/knots/drawing/marker1.svg)

We can attach it to a path by specifying the `marker-end` attribute:

{% highlight xml %}
<path d="M 90 50 H 120" stroke="black" marker-end="url(#head)"/>
{% endhighlight %}

![Marker Usage Diagram](/knots/drawing/marker2.svg)

This concludes the series on drawing knots. I hope you've enjoyed it. If you have any questions, queries or suggestions
you can contact me on [Facebook](facebook.com/alex.westphal) or by email: alex at recloud.co.nz