## 1. Introduction
**K-Nearest Neighbours (KNN)** is a **Supervised Machine Learning** algorithm used for both Classification and Regression. 
* **The Goal:** To predict the label of a new, unseen data point by looking at the known labels of the $K$ points closest to it.
* **The Intuition:** "Tell me who your friends are, and I will tell you who you are." If a new point is dropped into a space and the 3 points closest to it are all from "Class A", the new point is highly likely to also be "Class A".

>[!danger] Exam Trap: K-Means vs. KNN
> **K-Means** is *Unsupervised* (grouping unlabeled data).
> **KNN** is *Supervised* (predicting a label based on labeled training data). 
> Furthermore, KNN is a **"Lazy Learner."** It does not build a model or learn weights during training; it literally just memorizes the training dataset and does all the heavy mathematical lifting at the exact moment you ask it for a prediction.

---

## 2. Algorithm Mechanics (Pseudo-code)

KNN is famously simple because there is no traditional "training" phase. The entire algorithm happens during inference (testing).

**Inputs:**
* $X$: A training dataset with known labels
* $x_{test}$: The new data point we want to classify
* $K$: The number of neighbours to check (usually an odd number to avoid tie votes)
* Distance Metric: Euclidean Distance

**Algorithm:**
1. **MEASURE:** Calculate the Euclidean distance from $x_{test}$ to *every single point* in the training dataset $X$.
2. **SORT:** Order the distances from smallest to largest.
3. **SELECT:** Take the top $K$ closest points (the nearest neighbours).
4. **VOTE (For Classification):** Count the labels of those $K$ neighbours. The label with the majority vote becomes the prediction for $x_{test}$.

---

## 3. Step-by-Step Execution Example

Let's trace a classification task where we predict whether a new point belongs to **Class A** or **Class B**. We will use **Euclidean Distance** and observe how changing $K$ changes the prediction.

**The Training Data (5 Labeled Points):**
* P1 (2, 3) $\rightarrow$ **Class A**
* P2 (4, 2) $\rightarrow$ **Class B**
* P3 (2, 0) $\rightarrow$ **Class B**
* P4 (0, 2) $\rightarrow$ **Class B**
* P5 (5, 5) $\rightarrow$ **Class A**

**The Target:** We are given a new, unclassified point **$T (2, 2)$**. 
![KNN.png](../Assets/KNN.png)

### Step 1 & 2: Calculate Distances and Sort
We calculate the distance from $T(2,2)$ to every point in the training set.

$$
D = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

| Training Point | Distance Calculation from $T(2,2)$ | Distance | True Label |
| :--- | :--- | :--- | :--- |
| **P1 (2,3)** | $\sqrt{(2-2)^2 + (3-2)^2} = \sqrt{0 + 1}$ | **1.00** | **Class A** |
| **P4 (0,2)** | $\sqrt{(0-2)^2 + (2-2)^2} = \sqrt{4 + 0}$ | **2.00** | **Class B** |
| **P3 (2,0)** | $\sqrt{(2-2)^2 + (0-2)^2} = \sqrt{0 + 4}$ | **2.00** | **Class B** |
| **P2 (4,2)** | $\sqrt{(4-2)^2 + (2-2)^2} = \sqrt{4 + 0}$ | **2.00** | **Class B** |
| **P5 (5,5)** | $\sqrt{(5-2)^2 + (5-2)^2} = \sqrt{9 + 9}$ | **4.24** | **Class A** |

*(Note: The table is already sorted from closest to furthest).*

---

### Step 3 & 4: Select K and Vote

This is where the magic happens. Let's look at what the algorithm decides based on different values of $K$.

**Scenario 1: We set $K = 1$**
* We look at only the **1** closest neighbour.
* Nearest Neighbour: **P1** (Distance 1.00).
* P1's Label: **Class A**.
* **Prediction for T:** **Class A**.
*(Explanation: T is sitting right next to an outlier from Class A, so a highly sensitive K=1 model assumes T is also Class A).*

**Scenario 2: We set $K = 3$**
* We look at the **3** closest neighbours.
* Nearest Neighbours: **P1, P4, P3**.
* Labels: **Class A, Class B, Class B**.
* The Vote: 1 vote for A, 2 votes for B.
* **Prediction for T:** **Class B**.
*(Explanation: By expanding our view to K=3, the algorithm realizes that while T is very close to one Class A point, it is actually completely surrounded by a broader neighbourhood of Class B points. The local noise is smoothed out).*