---
layout: math-post
title: Modelling the Hand
author: Alex Westphal
tags: webgl threejs
---

I've recently been working on a system for 3D visualisation of knots (and associated system). As part of this I wanted
to include semi-realistic looking hands to help indicate how the skill should be achieved. Trying to accurately model
the human hand turned out to be more complicated than I originally thought so there was enough for a full article.

## Technology

As part of the visualisation project, I've been experimenting with WebGL to make it as accessible as possible. Like all
low level 3D graphics API's, WebGL is a pain in the ass to program. I therefore chose to utilise one of the more popular
libraries ([three.js](http://threejs.org/)) that sits atop WebGL.

