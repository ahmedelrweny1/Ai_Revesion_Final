## 1. Introduction
**K-Means** is an **Unsupervised Machine Learning** algorithm used for clustering. 
* **The Goal:** To partition $N$ unlabeled data points into $K$ distinct, non-overlapping subgroups (clusters).
* **The Intuition:** Imagine throwing $K$ magnets onto a table of scattered iron filings. Each filing snaps to the closest magnet. Once they snap, you move the magnet to the exact center of all the filings attached to it. You repeat this until the magnets stop moving. 

>[!tip] Exam Note
> Unlike classification, K-means does *not* use labeled data. We do not tell the algorithm what the groups are; it discovers the underlying structures based on the spatial distance between features.

---

## 2. Algorithm Mechanics (Pseudo-code)

The algorithm minimizes the variance (Sum of Squared Errors) within each cluster. It is an iterative process of **Assignment** and **Update**.

**Inputs:** * $X$: A dataset of $N$ points
* $K$: The number of clusters (given)

**Algorithm:**
1. **INITIALIZATION:** Select $K$ random points in the space to act as initial centroids ($C_1$, $C_2$, ... $C_K$).
2. **REPEAT UNTIL CONVERGENCE** (Centroids stop moving):
    * **a) ASSIGNMENT STEP:** For each point $p$ in $X$: Calculate distance from $p$ to all centroids. Assign $p$ to the cluster of the closest centroid.
    * **b) UPDATE STEP:** For each cluster $C$: Calculate the mean (average) of all X/Y coordinates of points assigned to $C$. Move the centroid of $C$ to this new mean location.

---

## 3. Step-by-Step Execution Example

Let's trace **one full iteration** of the K-Means algorithm in a 2D feature space using **Euclidean Distance**.

**The Setup:**
* We have 5 data points: $P_1(1, 1)$, $P_2(2, 1)$, $P_3(4, 3)$, $P_4(5, 4)$, $P_5(1, 2)$
* We are given $K = 2$.
* **Initialization:** We randomly pick two points to be our starting centroids: 
  * $C_1 = (1, 1)$  *(happens to be on P1)*
  * $C_2 = (5, 4)$  *(happens to be on P4)*

### Step 3a: The Assignment Step (Distance Calculations)
We calculate the distance from every point to both $C_1$ and $C_2$, then assign it to the minimum.

$$
D = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

| Point        | Dist to $C_1(1,1)$                                   | Dist to $C_2(5,4)$                                      | Closest Centroid | Assigned Cluster |
| :----------- | :--------------------------------------------------- | :------------------------------------------------------ | :--------------- | :--------------- |
| **P1 (1,1)** | $\sqrt{(1-1)^2 + (1-1)^2} = \mathbf{0}$              | $\sqrt{(5-1)^2 + (4-1)^2} = \sqrt{16+9} = 5$            | $C_1$            | **Cluster 1**    |
| **P2 (2,1)** | $\sqrt{(2-1)^2 + (1-1)^2} = \mathbf{1}$              | $\sqrt{(5-2)^2 + (4-1)^2} = \sqrt{9+9} \approx 4.24$    | $C_1$            | **Cluster 1**    |
| **P3 (4,3)** | $\sqrt{(4-1)^2 + (3-1)^2} = \sqrt{9+4} \approx 3.61$ | $\sqrt{(5-4)^2 + (4-3)^2} = \sqrt{1+1} = \mathbf{1.41}$ | $C_2$            | **Cluster 2**    |
| **P4 (5,4)** | $\sqrt{(5-5)^2 + (4-4)^2} = 5$                       | $\sqrt{(5-5)^2 + (4-4)^2} = \mathbf{0}$                 | $C_2$            | **Cluster 2**    |
| **P5 (1,2)** | $\sqrt{(1-1)^2 + (2-1)^2} = \mathbf{1}$              | $\sqrt{(5-1)^2 + (4-2)^2} = \sqrt{16+4} \approx 4.47$   | $C_1$            | **Cluster 1**    |

### Step 3b: The Update Step (Recalculating Centroids)
Now we find the *new* locations for $C_1$ and $C_2$ by taking the average of the points assigned to them.

**Updating $C_1$:**
* Points in Cluster 1: $P_1(1,1)$, $P_2(2,1)$, $P_5(1,2)$
* New $X$ mean: $(1 + 2 + 1) / 3 = 1.33$
* New $Y$ mean: $(1 + 1 + 2) / 3 = 1.33$
* **New $C_1$ location = $(1.33, 1.33)$**

**Updating $C_2$:**
* Points in Cluster 2: $P_3(4,3)$, $P_4(5,4)$
* New $X$ mean: $(4 + 5) / 2 = 4.5$
* New $Y$ mean: $(3 + 4) / 2 = 3.5$
* **New $C_2$ location = $(4.5, 3.5)$**

*The algorithm would now loop back to Step 3a, recalculating distances using these new centroid coordinates, and stop when the centroids no longer change position.*

---

## 4. Master Distance Metrics Glossary

The way a model measures "similarity" completely changes its behavior. Here are the core distance functions, assuming two points $A = (x_1, y_1)$ and $B = (x_2, y_2)$ in a 2D space. 

*(For the vector examples below, let $A = (1, 2)$ and $B = (4, 6)$)*

### A. Euclidean Distance (L2 Norm)
The straight-line "as the crow flies" distance between two points.

$$
D_{euclidean} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

* **Example:** $A(1,2)$, $B(4,6)$
* $D = \sqrt{(4 - 1)^2 + (6 - 2)^2} = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5$

### B. Manhattan Distance (L1 Norm / City Block)
The distance if you could only travel along grid lines (like a taxi in Manhattan). Useful for high-dimensional spaces or grid-based pathfinding.

$$
D_{manhattan} = |x_2 - x_1| + |y_2 - y_1|
$$

* **Example:** $A(1,2)$, $B(4,6)$
* $D = |4 - 1| + |6 - 2| = 3 + 4 = 7$

### C. Chebyshev Distance (L-Infinity Norm)
The greatest distance along any single coordinate dimension. In chess, this is how a King moves (moving diagonal costs the same as moving straight).

$$
D_{chebyshev} = \max(|x_2 - x_1|, |y_2 - y_1|)
$$

* **Example:** $A(1,2)$, $B(4,6)$
* $D = \max(|4 - 1|, |6 - 2|) = \max(3, 4) = 4$

### D. Minkowski Distance
The generalized mathematical form that encompasses Euclidean, Manhattan, and Chebyshev. The behavior changes based on the parameter $p$. 
*(If p=1, it's Manhattan. If p=2, it's Euclidean. If p=∞, it's Chebyshev).*

$$
D_{minkowski} = \left( \sum_{i=1}^{n} |x_i - y_i|^p \right)^{\frac{1}{p}}
$$

* **Example:** $A(1,2)$, $B(4,6)$ with **$p = 3$**
* $D = ( |4 - 1|^3 + |6 - 2|^3 )^{1/3}$
* $D = ( 3^3 + 4^3 )^{1/3} = (27 + 64)^{1/3} = (91)^{1/3} \approx 4.5$

### E. Hamming Distance
Used strictly for categorical, binary, or string data. It is the number of positions at which the corresponding symbols/bits are different.

$$
D_{hamming} = \sum_{i=1}^{n} (x_i \neq y_i)
$$

* **Example:** * String A = `1 0 1 1 1 0 1`
* String B = `1 0 0 1 0 0 1`
* The bits differ at index 3 and index 5. Therefore, **$D = 2$**.

### F. Cosine Distance
Measures the angle between two vectors, ignoring their magnitude (length). Excellent for text analysis where word count doesn't matter, just the ratio of words.
*Distance is calculated as 1 minus the Cosine Similarity.*

$$
\text{Similarity} = \cos(\theta) = \frac{A \cdot B}{||A|| \cdot ||B||}
$$

$$
D_{cosine} = 1 - \text{Similarity}
$$

* **Example:** $A(1,2)$, $B(4,6)$
* Dot Product ($A \cdot B$): $(1 \times 4) + (2 \times 6) = 4 + 12 = 16$
* Magnitude $||A||$: $\sqrt{1^2 + 2^2} = \sqrt{5} \approx 2.236$
* Magnitude $||B||$: $\sqrt{4^2 + 6^2} = \sqrt{52} \approx 7.211$
* Similarity: $16 / (2.236 \times 7.211) = 16 / 16.12 \approx 0.992$ 
* **$D_{cosine} = 1 - 0.992 = 0.008$**

### G. Haversine Distance (Earth Metric)
Calculates the great-circle distance between two points on a sphere given their longitudes and latitudes. 
*(Where $r$ is Earth's radius, $\phi$ is latitude, and $\lambda$ is longitude in radians).*

$$
D_{haversine} = 2r \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)
$$

* **Example:** Let's find the distance from the Equator/Prime Meridian origin $P_1(0^\circ, 0^\circ)$ to a point exactly 90 degrees East along the equator $P_2(0^\circ, 90^\circ)$. Earth's radius $r \approx 6371 \text{ km}$.
* $\phi_1 = 0, \lambda_1 = 0$
* $\phi_2 = 0, \lambda_2 = \pi/2$ (90 degrees in radians)
* $D = 2(6371) \cdot \arcsin\left(\sqrt{\sin^2(0) + \cos(0)\cos(0)\sin^2(\frac{\pi/2 - 0}{2})}\right)$
* $D = 12742 \cdot \arcsin\left(\sqrt{0 + (1 \cdot 1 \cdot \sin^2(\pi/4))}\right)$
* $D = 12742 \cdot \arcsin\left(\sqrt{0.5}\right) = 12742 \cdot \arcsin(0.707) = 12742 \cdot (\pi/4)$
* **$D \approx 10,007 \text{ km}$** 