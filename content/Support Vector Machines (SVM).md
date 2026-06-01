## 1. Introduction
**Support Vector Machines (SVM)** is a powerful **Supervised Machine Learning** algorithm primarily used for classification. 
* **The Goal:** To find the optimal hyperplane (a line in 2D) that separates two classes while maximizing the **margin** (the distance between the line and the closest points).
* **The Intuition:** Imagine you are building a massive highway between two rival cities (Class +1 and Class -1). You want the highway to be as wide as possible to keep them apart. The houses built closest to the border dictate exactly where the highway goes and how wide it can be. These closest points "support" the boundary—hence the name **Support Vectors**. 

>[!info] The Golden Rule of SVM
> SVM is elitist. It entirely ignores 99% of your training data. If you delete all the data points sitting safely deep inside their clusters, the boundary will not move an inch. Only the Support Vectors matter.

---

## 2. Algorithm Mechanics (The Equations Method)

To find the boundary line $w \cdot x + b = 0$, we rely purely on the Support Vectors. We use a clever linear algebra shortcut here. 

By augmenting every Support Vector $S$ with a `1` at the rear ($S_i = [x_1, x_2, 1]$), we absorb the bias $b$ directly into the weight vector $W$. This means our final $W$ will look like $[w_1, w_2, b]$.

**The Master Generating Equation:**
To find the coefficients ($\alpha$) for each Support Vector, we use the following universal equation for every Support Vector $S_i$:

$$
\sum_{j=1}^{N} \alpha_j (S_i \cdot S_j) = \text{Cluster}(S_i)
$$
*(Where the Cluster label is either $+1$ or $-1$, and $S_i \cdot S_j$ is the dot product of the two vectors).*

**The Steps:**
1. **Augment:** Add `1` to the end of all given Support Vectors.
2. **Dot Products:** Calculate the dot products between all combinations of Support Vectors.
3. **Generate & Solve:** Plug them into the Master Equation to create a system of linear equations and solve for $\alpha$ using a calculator.
4. **Calculate W:** Find the final weights using $W = \sum (S_i \cdot \alpha_i)$.

---

## 3. Step-by-Step Execution Example

Let's build a boundary. We are given **three Support Vectors**. Two belong to the positive class 
($+1$), and one belongs to the negative class ($-1$). 

**The Given Support Vectors:**
* **$S_1 (2, 2)$** $\rightarrow$ Class $+1$
* **$S_2 (3, 1)$** $\rightarrow$ Class $+1$
* **$S_3 (1, 1)$** $\rightarrow$ Class $-1$

`[Visual Placeholder: Insert a 2D graph plotting S1, S2, S3 with a distinct gap between the +1 and -1 points]`

### Step 1: Augment the Vectors
We add `1` to the last dimension of each vector to absorb the bias.
* $S_1 = \begin{bmatrix} 2 \\ 2 \\ 1 \end{bmatrix}$
* $S_2 = \begin{bmatrix} 3 \\ 1 \\ 1 \end{bmatrix}$
* $S_3 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$

### Step 2: Generate the Equations
We use our Master Equation: $\alpha_1(S_i \cdot S_1) + \alpha_2(S_i \cdot S_2) + \alpha_3(S_i \cdot S_3) = \text{Cluster}(S_i)$.

Let's calculate the dot products:
* $S_1 \cdot S_1 = (2\cdot2) + (2\cdot2) + (1\cdot1) = 4 + 4 + 1 = \mathbf{9}$
* $S_1 \cdot S_2 = (2\cdot3) + (2\cdot1) + (1\cdot1) = 6 + 2 + 1 = \mathbf{9}$
* $S_1 \cdot S_3 = (2\cdot1) + (2\cdot1) + (1\cdot1) = 2 + 2 + 1 = \mathbf{5}$
* $S_2 \cdot S_2 = (3\cdot3) + (1\cdot1) + (1\cdot1) = 9 + 1 + 1 = \mathbf{11}$
* $S_2 \cdot S_3 = (3\cdot1) + (1\cdot1) + (1\cdot1) = 3 + 1 + 1 = \mathbf{5}$
* $S_3 \cdot S_3 = (1\cdot1) + (1\cdot1) + (1\cdot1) = 1 + 1 + 1 = \mathbf{3}$

Now we write the equations for $S_1, S_2,$ and $S_3$:

**For $S_1$ (Class +1):** $$9\alpha_1 + 9\alpha_2 + 5\alpha_3 = 1$$

**For $S_2$ (Class +1):** $$9\alpha_1 + 11\alpha_2 + 5\alpha_3 = 1$$

**For $S_3$ (Class -1):** $$5\alpha_1 + 5\alpha_2 + 3\alpha_3 = -1$$

### Step 3: Solve the System
*(Punching this $3\times3$ system of linear equations into a scientific calculator yields the following exact values):*
* **$\alpha_1 = 4$**
* **$\alpha_2 = 0$**
* **$\alpha_3 = -7$**

*(Notice how $\alpha_2 = 0$. This actually means $S_2$ wasn't a true necessary support vector after all—the boundary relies entirely on $S_1$ and $S_3$!)*

### Step 4: Calculate W and Extract b
Now we compute the final augmented weight vector using $W = \sum (S_i \cdot \alpha_i)$.

$$
W = (\alpha_1 \cdot S_1) + (\alpha_2 \cdot S_2) + (\alpha_3 \cdot S_3)
$$

$$
W = 4 \begin{bmatrix} 2 \\ 2 \\ 1 \end{bmatrix} + 0 \begin{bmatrix} 3 \\ 1 \\ 1 \end{bmatrix} + (-7) \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}
$$

Let's do the scalar multiplication:
$$
W = \begin{bmatrix} 8 \\ 8 \\ 4 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} + \begin{bmatrix} -7 \\ -7 \\ -7 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \\ -3 \end{bmatrix}
$$

**The Final Result:**
Because our augmented vector format is $W = [w_1, w_2, b]^T$, we extract our final parameters:
* **Weights ($w_1, w_2$) = [1, 1]**
* **Bias ($b$) = -3**

The equation of our optimal separating hyperplane is $W \cdot X + b = 0$, which can be written as:

$$
[1, 1] \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} - 3 = 0
$$
$$
x_1 + x_2 - 3 = 0
$$

>[!note] Dimensionality Note
> We use two $x$'s ($x_1$ and $x_2$) in our final equation because our data points exist in a 2D feature space. If we were working in 3D, we would have $x_1, x_2,$ and $x_3$.