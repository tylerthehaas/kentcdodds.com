---
slug: using-css-grid-with-ie11
date: 2020-05-23
title: 'Using CSS Grid in IE11'
author: 'Tyler Haas'
description: '_How to use IE11 compatible CSS Grid._'
categories:
  - 'css'
  - 'css-in-js'
keywords:
  - 'css'
  - 'css-in-js'
  - 'CSS Grid'
  - 'emotion'
banner: './images/banner.jpg'
bannerCredit: 'Photo by [Asher Ward](https://unsplash.com/photos/18oNt_MP8M0)'
published: true
---

# CSS Grid

Most web apps use a grid system to control their layouts. A grid system is a way
of splitting a web page into a set of columns, usually 12 and using that as the
base of your page layout. This pattern is so common that it became standardized
as
[CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout).

# Browser Compatibility and Autoprefixer

_NOTE: In order to simplify this discussion I'll use the css-in-js library
[emotion](https://emotion.sh) as our working example of what supporting CSS Grid
looks like._

Many modern CSS features are initially supported through vendor prefixes to
account for differences in browser implementations during early adoption of a
feature. Emotion automatically adds vendor prefixes through the use of stylis's
autoprefixer plugin. This allows us to use things like flexbox without thinking
about browser differences. Unfortunately after a year of research the
maintainers of stylis determined that CSS Grid was not a feature they would be
supporting with their autoprefixer plugin. Here's the TL;DR on the
[issue](https://github.com/thysultan/stylis.js/issues/119).

> Maintainers here don't plan on working on this as it's just not that simple of
> a task and any attempts to autoprefix grid for IE11 have their edge cases.
> It's also a matter of "least surprise principle" - if we can't make it work
> for all cases, we don't want to make it at all because one could think they
> can use every grid-related feature safely when that would just not be true.
>
> [Andarist](https://github.com/thysultan/stylis.js/issues/119#issuecomment-615480598)

## problems with autoprefixing CSS Grid

Lets look at the following table to analyze the differences between the current
implementation of CSS Grid and IE11's implementation.

| CSS Grid Properties   |  IE11 Implementation  |
| :-------------------- | :-------------------: |
| grid-template-columns |   -ms-grid-columns    |
| grid-template-rows    |     -ms-grid-rows     |
| grid-template-areas   |          N/A          |
| grid-template         |          N/A          |
| grid-auto-columns     |          N/A          |
| grid-auto-rows        |          N/A          |
| grid-auto-flow        |          N/A          |
| grid                  |          N/A          |
| grid-row-start        |     -ms-grid-row      |
| grid-column-start     |    -ms-grid-column    |
| grid-row-end          |          N/A          |
| grid-column-end       |          N/A          |
| grid-column           |          N/A          |
| grid-area             |          N/A          |
| grid-row-gap          |          N/A          |
| grid-column-gap       |          N/A          |
| grid-gap              |          N/A          |
| N/A                   | -ms-grid-column-span  |
| N/A                   |   -ms-grid-row-span   |
| align-self            |  -ms-grid-row-align   |
| justify-self          | -ms-grid-column-align |

As you can see there aren't a lot of cross over between how properties map to
each other. Another big problem is that one of the major benefits to CSS grid is
that you can define spaces between columns with `grid-gap`. In IE they don't
have any support for this ability. 👎

# Manual Prefixing

Given the difficulties with automating the vendor prefixes if you need to
support IE11 then you will need to manually add vendor prefixes. These are the
strategies I employ when doing so in order to simplify things and make my life
easier.

## Make heavy use of grid templates

I've seen two styles of writing css grid. The first would look something like
this:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 10px repeat(3, 1fr);
  grid-template-rows: 100px 10px 100px;
  grid-template-areas:
    'a'
    'b b b'
    'c c';
}

.a {
  grid-area: a;
}

.b {
  grid-area: b;
}

.c {
  grid-area: c;
}
```

The second looks like this:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 10px repeat(3, 1fr);
  grid-template-rows: 100px 10px 100px;
}

.a {
  grid-column: 1;
  grid-row: 1;
}

.b {
  grid-column: 1/3;
  grid-row: 2;
}

.c {
  grid-column: 1/2;
  rid-row: 3;
}
```

Although the first is really nice for readability and has the nice benefit of
controlling all layout in the parent container I wouldn't use it if you are
worried about IE. IE doesn't support this named syntax you have to declare the
layout via `-ms-grid-row/column-span` and `-ms-grid-row/column` and using the
numbering syntax across the board keeps things as similar as possible across
browsers.

Using the second syntax we could write cross browser compatible css that would
look like this:

```css
.container {
  display: grid;
  display: -ms-grid;
  grid-template-columns: 1fr 10px repeat(3, 1fr);
  grid-template-rows: 100px 10px 100px;
}

.a {
  -ms-grid-column: 1;
  -ms-grid-row: 1;
  grid-column: 1;
  grid-row: 1;
}

.b {
  -ms-grid-column: 1;
  -ms-grid-column-span: 3;
  -ms-grid-row: 2;
  grid-column: 1/3;
  grid-row: 2;
}

.c {
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  -ms-grid-row: 3;
  grid-column: 1/2;
  rid-row: 3;
}
```

## Don't use gaps

IE's implementation of CSS Grid doesn't support gaps between columns. You could
try to simulate gaps with margin and positioning but I wouldn't recommend it.
Instead I've found it much simpler to use gaps for modern browsers and use CSS
Grids `-ms-` specific alignment properties to position the elements where you
would like. Here's an example of that.

```css
.container {
  display: grid;
  display: -ms-grid;
  grid-template-columns: 1fr 10px repeat(3, 1fr);
  grid-template-rows: 100px 10px 100px;
}

.a {
  -ms-grid-column: 1;
  -ms-grid-row: 1;
  grid-column: 1;
  grid-row: 1;
}

.b {
  -ms-grid-column: 1;
  -ms-grid-column-span: 3;
  -ms-grid-row: 2;
  -ms-grid-column-align: center;
  grid-column: 1/3;
  grid-row: 2;
}

.c {
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  -ms-grid-row: 3;
  -ms-grid-column-align: center;
  -ms-grid-row-align: center;
  grid-column: 1/2;
  rid-row: 3;
}
```

## The Good News

By now I'm sure its obvious there are some definite downsides of using Grid in
IE. Theres no sugar coating it...it sucks. They did do at least one thing right
though. All utility methods are available! Thats right `repeat`, `minmax` and
all your other favorite helper functions can be used in IE!

# Summary

Supporting CSS Grid for Internet Explorer isn't the most developer friendly
experience but by following the few recommendations I've made in this article
you will make things much easier. If you have other tips you can share I'd love
to hear them! Good luck!
