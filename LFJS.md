# LFJS documentation

## Introduction
LFJS is the custom JavaScript API for LiteForge-Evo. It provides a set of functions to interact with the game's data and perform various tasks without writing huge chunks of code.

## Table of contents
[Creating geometric shapes](#creating-geometric-shapes)

## Documentation
### Creating geometric shapes
We can create objects dynamically using the `lfjs.createShape` api. This api takes five parameters: the object type, x-position, y-position, width (which is also the radius for circles and innerRadius for arc's) and finally the height (which is also the outerRadius for arc's).

**Example**:
```js
lfjs.createShape('circle', 100 /* x position */, 200 /* y position */, 50 /* radius */); // creates a circle

lfjs.createShape('rectangle', 100 /* x position */, 200 /* y position */, 100 /* width */, 50 /* height */); // creates a rectangle

lfjs.createShape('arc', 100 /* x position */, 200 /* y position */, 100 /* innerRadius */, 50 /* outerRadius */); // creates an arc
```