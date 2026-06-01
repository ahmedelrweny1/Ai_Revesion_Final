## 1. Introduction
**Linear Regression** is a **Supervised Machine Learning** algorithm used for *Regression* tasks (predicting continuous numerical values, like price or temperature, rather than categories).
* **The Goal:** To find the optimal straight line that best fits a set of data points by minimizing the overall error.
* **The Intuition:** Imagine plotting your data points on a board as physical nails. You hold a stiff metal rod (the line) and attach it to every single nail with a rubber band. When you let go, the tension of the rubber bands pulls the rod into the absolute perfect position of "best fit." The Ordinary Least Squares (OLS) method is the math that calculates where that rod settles.

>[!tip] Regression vs. Classification
> Remember, KNN and SVM (as we studied them) are classifiers—they output discrete labels like "Class A" or "Class B". Linear regression outputs a continuous number, like "42.5".

---

## 2. Algorithm Mechanics (The OLS Equations)

We are looking for the equation of a straight line in the classic format:

$$
y = ax + b
$$

Where:
* **$y$** = The predicted value
* **$x$** = The input feature
* **$a$** = The slope (how steep the line is)
* **$b$** = The y-intercept (where the line crosses the vertical axis)

To find the exact line of best fit without needing iterative training (like Gradient Descent), we use the Ordinary Least Squares closed-form equations. We calculate $a$ and $b$ completely independently using the sums of our dataset features.

**The Equation for Slope ($a$):**
$$
a = \frac{n \sum(xy) - \sum x \sum y}{n \sum(x^2) - (\sum x)^2}
$$

**The Equation for Intercept ($b$):**
$$
b = \frac{\sum y \sum(x^2) - \sum x \sum(xy)}{n \sum(x^2) - (\sum x)^2}
$$

*(Note: $n$ is the total number of data points).*

---

## 3. Step-by-Step Execution Example

Let's find the line of best fit for a small dataset of $n = 5$ points. 

**The Dataset:**
* $P_1 (1, 2)$
* $P_2 (2, 3)$
* $P_3 (3, 5)$
* $P_4 (4, 4)$
* $P_5 (5, 6)$

### Step 1: The Calculations Table
To use our OLS formulas, we need four specific sums: $\sum x$, $\sum y$, $\sum xy$, and $\sum x^2$. The easiest way to avoid exam mistakes is to build a table.

| Point             |  $x$   |  $y$   | $x \cdot y$ | $x^2$  |
| :---------------- | :----: | :----: | :---------: | :----: |
| **P1**            |   1    |   2    |      2      |   1    |
| **P2**            |   2    |   3    |      6      |   4    |
| **P3**            |   3    |   5    |     15      |   9    |
| **P4**            |   4    |   4    |     16      |   16   |
| **P5**            |   5    |   6    |     30      |   25   |
| **SUMS ($\sum$)** | **15** | **20** |   **69**    | **55** |

**Our known variables:**
* $n = 5$
* $\sum x = 15$
* $\sum y = 20$
* $\sum xy = 69$
* $\sum x^2 = 55$

### Step 2: Calculate the Slope ($a$)
Plug the sums directly into the slope equation. Notice that the denominator is the same for both $a$ and $b$, which saves us time.

$$
a = \frac{n \sum(xy) - \sum x \sum y}{n \sum(x^2) - (\sum x)^2}
$$

$$
a = \frac{5(69) - (15)(20)}{5(55) - (15)^2}
$$

$$
a = \frac{345 - 300}{275 - 225} = \frac{45}{50} = \mathbf{0.9}
$$

### Step 3: Calculate the Intercept ($b$)
Now, we use the independent equation for $b$.

$$
b = \frac{\sum y \sum(x^2) - \sum x \sum(xy)}{n \sum(x^2) - (\sum x)^2}
$$

$$
b = \frac{(20)(55) - (15)(69)}{5(55) - (15)^2}
$$

$$
b = \frac{1100 - 1035}{275 - 225} = \frac{65}{50} = \mathbf{1.3}
$$

### Step 4: The Final Model
We plug our calculated $a$ and $b$ back into the base formula $y = ax + b$.

$$
y = 0.9x + 1.3
$$

**Using the model:** If we receive a new, unseen data point with an input of $x = 6$, our model predicts the value will be $y = 0.9(6) + 1.3 = 5.4 + 1.3 = 6.7$.