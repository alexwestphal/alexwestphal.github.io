---
layout: post
title: Date Formatting - When It Matters
author: Alex Westphal
tags: date time
---

Formatting dates is an annoying problem. They should be simple but tend to be anything but. In this post we look at a
simple case of an ambiguous date format that often leads to confusion.

## Background

On 22 February 2011, a magnitude 6.3 earthquake struck the city of Christchurch causing widespread damage. Immediately
following the quake, all three New Zealand USAR Task Forces (NZ-TF's) and all 18 New Zealand USAR Response Teams (NZ-RT's)
were deployed to Christchurch with additional assistance requested through the United Nations.

Among the the countries that responded was the United States, who deployed the Los Angeles based California Task Force
2 (CA-TF2).

##Building Markings

When searching damaged buildings, it is customary for USAR teams to put a building marking at the entrance to indicate
when they are/were in the building as well as anything of note that they found. There is quite a bit that can go into a
building marking but we are focusing on the simple constant elements: team name, time in, and time out. The layout looks
something like this:

![Building Marking Format](/knots/markings/building-format.svg)

## The Problem

During the later part of the response, (say the 5th of April 2011) a team comes upon a building marking applied by CA-TF2:

![CA-TF2 Building Marking](/knots/markings/building-catf2.svg)

How do we interpret the dates? Normally we would refer to the international building marking standard defined by the
[International Search and Rescue Advisory Group (INSARAG)](https://en.wikipedia.org/wiki/International_Search_and_Rescue_Advisory_Group).
That standard requires all dates to be formatted as `DD/MMM/YYYY`. But that requires alot of paint and space so is
commonly shortened to `DD/MM`. But remember this is an American team that is primarily deployed domestically so they may
well use the American style `MM/DD` format.

Given the two formats, the dates could be either the `4/March` or `3/April`, both of which fall into the response period.
Hence the possibility for confusion. Fortunately most of use were kept aware of deployment changes so we knew that
CA-TF2 had been redeployed to Japan in response to their earthquake of 11 March 2011. Therefore it could only be `4/March`.

## The Solution

While in the above case we were able to disambiguate because of additional situational knowledge, that isn't always the
case. So when writing dates (especially if it's something important) stop and think, is it clear which date this is? If
in doubt, write the month out using the 3 letter month abbreviation. `4/Mar` is obvious, while `4/3` might not be.