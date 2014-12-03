---
layout: math-post
title: 3D Modelling - The Math
author: Alex Westphal
tags: webgl threejs
---

A core requirement of a 3D system is a mechanism for sizing, position, and orienting shapes. The standard strategy for
achieving this is to consider the control points of the shape as vectors from the origin and to manipulate these vectors
using a [Transformation Matrix](http://en.wikipedia.org/wiki/Transformation_matrix).

If we consider a shape with n control points $$ \mathcal{P} = [p_0, p_1, p_2, \ldots, p_n] $$ and a linear transform
  $$A$$, we can compute the result of applying the transform to the shape as:

  $$
  \mathcal{P}\prime = A\mathcal{P} = [Ap_0, Ap_1, Ap_2 \ldots, Ap_n]
  $$

One of the primary benefits of using linear transform matrices is that the transformations can be composed by
exploiting the associativity property of matrix multiplication. That is a shape $$\mathcal{X}$$ transformed by first
$$A$$ then $$B$$ is equivalent to transforming $$\mathcal{X}$$ by $$BA$$. Symbolically:

$$
\mathcal{X}\prime = B(A\mathcal{X}) = (BA)\mathcal{X}
$$

Note: Matrix multiplication is not commutative ($$AB \ne BA $$) so the ordering of the transformations is important.

The use of matrices is so now so common that Graphics Processing Units (GPUs) are often capable of doing operations such
as matrix multiplication in hardware.


## Types of Linear Transformations

The simplest linear transformation is scaling. We describe a **scaling transformation** using a vector with three
components $$v = [v_x, v_y, v_z]$$ representing the scaling factor in the $$x$$, $$y$$, and $$z$$ directions.
Alternatively it can be represented as a 3x3 matrix:

$$
S_v =
   \begin{bmatrix}
       v_x & 0 & 0 \\
       0 & v_y & 0 \\
       0 & 0 & v_z
   \end{bmatrix}
$$

$$
R_\alpha =
    \begin{bmatrix}
        1 & 0 & 0 \\
        0 & cos(\alpha) & sin(\alpha) \\
        0 & -sin(\alpha) & cos(\alpha)
    \end{bmatrix}
\\
R_\beta =
    \begin{bmatrix}
        cos(\beta) & 0 & -sin(\beta) \\
        0 & 1 & 0 \\
        sin(\beta) & 0 & cos(\beta)
    \end{bmatrix}
\\
R_\gamma =
    \begin{bmatrix}
        cos(\gamma) & sin(\gamma) & 0 \\
        -sin(\gamma) & cos(\gamma) & 0 \\
        0 & 0 & 1
    \end{bmatrix}
$$

## Other Transformations

**Translation** is non-linear on n-dimensional [Euclidean space](http://en.wikipedia.org/wiki/Euclidean_space) $$R^n$$
and so cannot be represented as a $$n \times n$$ matrix. Instead translation can be represented as a linear
transformation on the $$n+1$$ dimensional space $$R_{n+1}$$.

$$
T_v =
   \begin{bmatrix}
       1 & 0 & 0 & v_x \\
       0 & 1 & 0 & v_y \\
       0 & 0 & 1 & v_z \\
       0 & 0 & 0 & 1
   \end{bmatrix}
$$

There are also several other types of transformations (including projective transformations) can also only be
represented on the $$n+1$$ dimensional space $$R_{n+1}$$. To maintain compatibility and efficiency it is typical to
consider all types of transforms as $$4 \times 4$$ matrices.


## Applying Transformations

$$

S_v(p) =
   \begin{bmatrix}
       v_x & 0 & 0 \\
       0 & v_y & 0 \\
       0 & 0 & v_z
   \end{bmatrix}
   \begin{bmatrix}
       p_x \\ p_y \\ p_z
   \end{bmatrix}
   =
   \begin{bmatrix}
     p_x v_x \\
     p_y v_y \\
     p_z v_z
   \end{bmatrix}
\\
T_v(p) =
   \begin{bmatrix}
       1 & 0 & 0 & v_x \\
       0 & 1 & 0 & v_y \\
       0 & 0 & 1 & v_z \\
       0 & 0 & 0 & 1
   \end{bmatrix}
   \begin{bmatrix}
       p_x \\ p_y \\ p_z \\ 1
   \end{bmatrix}
   =
   \begin{bmatrix}
      p_x + v_x \\
      p_y + v_y \\
      p_z + v_z \\
      1
  \end{bmatrix}
\\
R_\alpha(p) =
    \begin{bmatrix}
        1 & 0 & 0 \\
        0 & cos(\alpha) & sin(\alpha) \\
        0 & -sin(\alpha) & cos(\alpha)
    \end{bmatrix}
    \begin{bmatrix}
        p_x \\ p_y \\ p_z
    \end{bmatrix}
    =
    \begin{bmatrix}
        p_x \\ p_ycos(\alpha) + p_zsin(\alpha) \\ p_zcos(\alpha) - p_ysin(\alpha)
    \end{bmatrix}
\\
R_\beta(p) =
    \begin{bmatrix}
        cos(\beta) & 0 & -sin(\beta) \\
        0 & 1 & 0 \\
        sin(\beta) & 0 & cos(\beta)
    \end{bmatrix}
    \begin{bmatrix}
        p_x \\ p_y \\ p_z
    \end{bmatrix}
    =
    \begin{bmatrix}
        p_xcos(\beta) - p_zsin(\beta) \\ p_y \\ p_xsin(\beta) + p_zcos(\beta)
    \end{bmatrix}
\\
R_\gamma(p) =
    \begin{bmatrix}
        cos(\gamma) & sin(\gamma) & 0 \\
        -sin(\gamma) & cos(\gamma) & 0 \\
        0 & 0 & 1
    \end{bmatrix}
    \begin{bmatrix}
        p_x \\ p_y \\ p_z
    \end{bmatrix}
    =
    \begin{bmatrix}
        p_xcos(\gamma) + p_ysin(\gamma) \\ p_ycos(\gamma) - p_xsin(\gamma) \\ p_z
    \end{bmatrix}
\\
$$
