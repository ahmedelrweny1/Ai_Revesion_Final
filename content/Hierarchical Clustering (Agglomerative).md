## 1. Introduction
**Hierarchical Clustering** is an **Unsupervised Machine Learning** algorithm. Unlike K-Means, you do *not* need to specify the number of clusters ($K$) in advance. 

Instead of creating flat groups, it builds a tree of clusters (often visualized as a dendrogram). We are focusing on the **Agglomerative** (bottom-up) approach.
* **The Goal:** To merge data points one by one based on their distance until all points are swallowed into one single, massive cluster.

## 2. Algorithm Mechanics (Pseudo-code)
The algorithm relies heavily on a Distance Matrix that updates every time a merge happens. Since we are using the **MIN (Single Linkage)** metric, the distance between two groups is defined by the two closest points between those groups.

**Inputs:**
* $X$: A dataset of $N$ points
* Distance Metric: Euclidean Distance
* Linkage Criteria: MIN (Single Linkage)

**Algorithm:**
1. **INITIALIZATION:** Treat every single data point as its own independent cluster. Calculate the distance between all pairs of points to create an initial $N \times N$ Distance Matrix.
2. **REPEAT UNTIL 1 CLUSTER REMAINS:**
    * **a) FIND:** Scan the distance matrix to find the two clusters separated by the shortest distance.
    * **b) MERGE:** Combine these two clusters into a single new cluster.
    * **c) UPDATE:** Recalculate the distance matrix. To find the distance between the *new* cluster and any *existing* cluster, take the **minimum** distance from the previously calculated values.

---

## 3. Step-by-Step Execution Example

Let's trace a full Agglomerative Hierarchical Clustering execution using **Euclidean Distance** and **MIN Linkage**. 

**The Setup (5 Points):**
* P1 (0, 0)
* P2 (0, 1)
* P3 (4, 1)
* P4 (4, 3)
* P5 (7, 3)

### Step 0: The Initial Distance Matrix
First, we calculate the Euclidean distance between all points. 

$$
D = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

*Example calculation for P1 and P2:*
$$D = \sqrt{(0 - 0)^2 + (1 - 0)^2} = \sqrt{0 + 1} = 1$$

*Example calculation for P1 and P4:*
$$D = \sqrt{(4 - 0)^2 + (3 - 0)^2} = \sqrt{16 + 9} = \sqrt{25} = 5$$

**Initial Matrix Table:**

| | P1 | P2 | P3 | P4 | P5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P1** | 0.00 | **1.00** | 4.12 | 5.00 | 7.62 |
| **P2** | 1.00 | 0.00 | 4.00 | 4.47 | 7.28 |
| **P3** | 4.12 | 4.00 | 0.00 | 2.00 | 3.61 |
| **P4** | 5.00 | 4.47 | 2.00 | 0.00 | 3.00 |
| **P5** | 7.62 | 7.28 | 3.61 | 3.00 | 0.00 |

*(Note: The matrix is mirrored diagonally, so we only need to look at the numbers on one side of the zeros).*

---

### Step 1: First Merge
Looking at our matrix, the smallest distance is **1.00**, which is between **P1 and P2**.
* **Action:** Merge P1 and P2 into a new cluster: **{P1, P2}**.

Now, we update the matrix. We must calculate the distance from our new cluster **{P1, P2}** to the remaining points (P3, P4, P5) using the MIN logic. We just look at the previous table and take the smallest value.

* **dist({P1, P2}, P3)** = min(dist(P1, P3), dist(P2, P3)) = min(4.12, 4.00) = **4.00**
* **dist({P1, P2}, P4)** = min(dist(P1, P4), dist(P2, P4)) = min(5.00, 4.47) = **4.47**
* **dist({P1, P2}, P5)** = min(dist(P1, P5), dist(P2, P5)) = min(7.62, 7.28) = **7.28**

**Matrix 1 (After 1st Merge):**

| | {P1, P2} | P3 | P4 | P5 |
| :--- | :--- | :--- | :--- | :--- |
| **{P1, P2}** | 0.00 | 4.00 | 4.47 | 7.28 |
| **P3** | 4.00 | 0.00 | **2.00** | 3.61 |
| **P4** | 4.47 | **2.00** | 0.00 | 3.00 |
| **P5** | 7.28 | 3.61 | 3.00 | 0.00 |

---

### Step 2: Second Merge
Scanning Matrix 1, the smallest available distance is **2.00**, between **P3 and P4**.
* **Action:** Merge P3 and P4 into a new cluster: **{P3, P4}**.

We update the distances from **{P3, P4}** to the remaining groups ({P1, P2} and P5).

* **dist({P3, P4}, {P1, P2})** = min(dist(P3, {P1, P2}), dist(P4, {P1, P2})) = min(4.00, 4.47) = **4.00**
* **dist({P3, P4}, P5)** = min(dist(P3, P5), dist(P4, P5)) = min(3.61, 3.00) = **3.00**

**Matrix 2 (After 2nd Merge):**

| | {P1, P2} | {P3, P4} | P5 |
| :--- | :--- | :--- | :--- |
| **{P1, P2}** | 0.00 | 4.00 | 7.28 |
| **{P3, P4}** | 4.00 | 0.00 | **3.00** |
| **P5** | 7.28 | **3.00** | 0.00 |

---

### Step 3: Third Merge
Scanning Matrix 2, the smallest distance is **3.00**, between **{P3, P4}** and **P5**.
* **Action:** Merge them into a single cluster. To represent the tree depth, we nest them: **{{P3, P4}, P5}**.

Update the distance to the only remaining group:
* **dist({{P3, P4}, P5}, {P1, P2})** = min(dist({P3, P4}, {P1, P2}), dist(P5, {P1, P2})) = min(4.00, 7.28) = **4.00**

**Matrix 3 (After 3rd Merge):**

| | {P1, P2} | {{P3, P4}, P5} |
| :--- | :--- | :--- |
| **{P1, P2}** | 0.00 | **4.00** |
| **{{P3, P4}, P5}}**| **4.00** | 0.00 |

---

### Step 4: Final Merge
Only two clusters remain, separated by a distance of **4.00**. 
* **Action:** Merge **{P1, P2}** and **{{P3, P4}, P5}** into one final cluster.
* Final Tree Structure: **{{P1, P2}, {{P3, P4}, P5}}**
* All points are now in a single cluster. The algorithm terminates.

---

### Resulting Tree

![Hierarchical Clustering.png](../99_Assets/Hierarchical%20Clustering.png)