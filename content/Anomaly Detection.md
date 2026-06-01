## 1. Introduction
**Anomaly Detection** is an **Unsupervised Machine Learning** concept used to identify outliers—data points that deviate so significantly from the rest of the dataset that they arouse suspicion.
* **The Goal:** To definitively prove whether an extreme value is a natural variation or a complete anomaly.
* **The Intuition:** Imagine grading 100 exams. Most students score between 60% and 85%. One student scores 12%. Anomaly detection provides the statistical proof to kick that 12% out of the dataset before it ruins your grading curve.

---

## 2. The Z-Score Method
The Z-Score is the standard statistical bouncer for data that roughly follows a normal distribution (a bell curve).
* **The Intuition:** The Z-Score calculates exactly how many "steps" (Standard Deviations) a specific data point is standing away from the center of the dataset (the Mean). If it crosses a specific threshold, it is kicked out.

>[!warning] Exam Trap: The Pull of the Outlier
> The standard Z-Score relies heavily on the Mean. Because the Mean includes *every* number in its calculation, one massive outlier will drag the Mean toward it, artificially hiding how extreme the outlier really is.

### Algorithm Mechanics (The Z-Score Equations)
To find the Z-Score, we use the standard score formula:

$$
Z = \frac{x - \mu}{\sigma}
$$

Before calculating $Z$, you must independently calculate the Mean ($\mu$) and Standard Deviation ($\sigma$):

* **Mean:** $$\mu = \frac{\sum x}{n}$$

* **Standard Deviation:** $$\sigma = \sqrt{\frac{\sum(x - \mu)^2}{n}}$$

### Step-by-Step Execution Example
Let's identify any anomalies in a dataset of 10 temperature readings (in **°C**) using a threshold of $|Z| > 2.5$.

**The Dataset:** 20, 21, 19, 22, 20, 21, 85, 20, 19, 21

**Step 1: Calculate the Mean ($\mu$)**
Sum all readings and divide by $n = 10$.
$$\sum x = 20 + 21 + 19 + 22 + 20 + 21 + 85 + 20 + 19 + 21 = 268$$
$$\mu = \frac{268}{10} = \mathbf{26.8}$$

**Step 2: Calculate Standard Deviation ($\sigma$)**
Find the squared deviation for each point. Building a table prevents exam mistakes.

| Temp ($x$) | Deviation ($x - 26.8$) | Squared Deviation |
| :---: | :---: | :---: |
| 20 | -6.8 | 46.24 |
| 21 | -5.8 | 33.64 |
| 19 | -7.8 | 60.84 |
| 22 | -4.8 | 23.04 |
| 20 | -6.8 | 46.24 |
| 21 | -5.8 | 33.64 |
| 85 | +58.2 | 3387.24 |
| 20 | -6.8 | 46.24 |
| 19 | -7.8 | 60.84 |
| 21 | -5.8 | 33.64 |

* **Sum of Squares:** 3771.6
* **Variance ($\sigma^2$):** $3771.6 / 10 = 377.16$
* **Standard Deviation ($\sigma$):** $\sqrt{377.16} \approx \mathbf{19.42}$

**Step 3: Calculate Z-score for Each Point**
Using $Z = \frac{x - 26.8}{19.42}$, check against $|Z| > 2.5$.

| Temp ($x$) | Z-Score ($Z$) | $|Z| > 2.5$? | Status |
| :---: | :---: | :---: | :---: |
| 20 | -0.35 | No | Normal |
| 21 | -0.30 | No | Normal |
| 19 | -0.40 | No | Normal |
| 22 | -0.25 | No | Normal |
| 85 | **+3.00** | **Yes** | **Anomaly** |

**Conclusion:**
The reading of **85°C** has a Z-score of +3.00, exceeding the threshold of 2.5. It is a definitive anomaly. All other readings sit tightly within $\pm0.40$ standard deviations.

---

## 3. The IQR Method (Tukey Fences)
The Interquartile Range (IQR) method is a non-parametric approach. Unlike Z-Score, it does not assume the data follows a normal distribution, making it highly robust against extreme outliers.
* **The Intuition:** Imagine building a "walled garden." You find the absolute middle 50% of your data (the garden) and build statistical fences a specific distance away from it. Anything that falls outside those fences is an anomaly.

>[!warning] Exam Trap: Forgetting to Sort
> You **must** sort the dataset in ascending order before doing any calculations. Forgetting to sort is the most common reason students fail IQR traces. Additionally, pay close attention to whether your dataset has an even or odd number of points when splitting it to find the quartiles.

### Algorithm Mechanics (The IQR Equations)
The IQR represents the spread of the middle 50% of the data. 

**Definitions:**
* **$Q_1$ (First Quartile):** The median of the lower half of the data (25th percentile).
* **$Q_3$ (Third Quartile):** The median of the upper half of the data (75th percentile).

**The Formulas:**
$$IQR = Q_3 - Q_1$$
$$\text{Lower Fence} = Q_1 - 1.5 \times IQR$$
$$\text{Upper Fence} = Q_3 + 1.5 \times IQR$$

### Step-by-Step Execution Example
Let's apply the IQR method to a dataset of monthly sales figures (in **$1000s**) to detect any outliers.

**The Raw Dataset:** 45, 47, 50, 52, 48, 49, 150, 51, 46, 53

**Step 1: Sort the Data**
Sort the $n = 10$ points into ascending order.
> Sorted: 45, 46, 47, 48, 49, 50, 51, 52, 53, 150

**Step 2: Find $Q_1$ and $Q_3$**
Because $n = 10$ (an even number), we split the data perfectly in half.
* **Lower Half:** 45, 46, 47, 48, 49 $\rightarrow$ $Q_1$ is the median of this half: **47**
* **Upper Half:** 50, 51, 52, 53, 150 $\rightarrow$ $Q_3$ is the median of this half: **52**

**Step 3: Calculate IQR and Fences**
Using our $Q_1$ and $Q_3$ values, calculate the safe boundaries.
$$IQR = 52 - 47 = \mathbf{5}$$
$$\text{Lower Fence} = 47 - 1.5(5) = 47 - 7.5 = \mathbf{39.5}$$
$$\text{Upper Fence} = 52 + 1.5(5) = 52 + 7.5 = \mathbf{59.5}$$
* **Valid Range:** [39.5, 59.5]

**Step 4: Identify Outliers**
Check each value against the valid range.

| Value | Inside [39.5, 59.5]? | Status |
| :---: | :---: | :---: |
| 45–53 | Yes | Normal |
| 150 | **No** (150 > 59.5) | **Anomaly** |

**Conclusion:**
July sales of **$150,000** is a clear outlier because it lies above the upper fence of $59,500. All other months fall safely within the valid range.

---

## 4. The Modified Z-Score (MAD Method)
The Modified Z-Score addresses the fatal flaw of the standard Z-Score. By using the Median instead of the Mean, it ensures that extreme outliers cannot artificially influence the center point of the dataset calculations. 
* **The Intuition:** This is the "bulletproof bouncer." If one massive outlier enters the dataset, the Mean shifts wildly, but the Median barely moves. By basing our distance calculations on the Median, the outlier is completely exposed.

>[!info] Exam Trap: The Magic Constant
> The formula uses a magic constant of `0.6745`. This constant exists to scale the Modified Z-Score so that its results behave identically to a standard Z-Score under a normal distribution (it is the 75th percentile of the standard normal distribution).

### Algorithm Mechanics (The MAD Equations)
Instead of Standard Deviation, we use Median Absolute Deviation (MAD).

**The Formulas:**
* **Median ($\tilde{x}$):** The absolute middle value of the sorted dataset.
* **Median Absolute Deviation (MAD):** The median of the absolute deviations from the original dataset's median.
$$MAD = \text{median}(|x_i - \tilde{x}|)$$
* **Modified Z-Score ($M$):**
$$M = \frac{0.6745(x - \tilde{x})}{MAD}$$

### Step-by-Step Execution Example
Let's find clinically dangerous anomalies in a set of systolic blood pressure readings (mmHg) using a threshold of $|M| > 3.5$.

**The Raw Dataset:** 118, 122, 120, 119, 121, 118, 120, 200, 122

**Step 1: Find the Median ($\tilde{x}$)**
Sort the $n = 9$ readings into ascending order.
> Sorted: 118, 118, 119, 120, **120**, 121, 122, 122, 200

The 5th value is the median: $\tilde{x} = \mathbf{120}$
*(Notice how the massive outlier of 200 didn't pull the center away from 120 at all).*

**Step 2: Calculate Median Absolute Deviation (MAD)**
Find the absolute distance of every original point from the median (120).
* $|118 - 120| = 2$
* $|122 - 120| = 2$
* $|120 - 120| = 0$
* $|119 - 120| = 1$
* $|121 - 120| = 1$
* $|118 - 120| = 2$
* $|120 - 120| = 0$
* $|200 - 120| = 80$
* $|122 - 120| = 2$

Now, find the median of these new deviations by sorting them:
> Sorted Deviations: 0, 0, 1, 1, **2**, 2, 2, 2, 80

The 5th value is the median: $MAD = \mathbf{2}$

**Step 3: Compute Modified Z-Score for Each Point**
Using $M = \frac{0.6745(x - 120)}{2}$, calculate the score for each unique value and check against $|M| > 3.5$.

| Reading ($x$) | Calculation | M-Score ($M$) | $|M| > 3.5$? | Status |
| :---: | :---: | :---: | :---: | :---: |
| 118 | $0.6745(-2) / 2$ | -0.6745 | No | Normal |
| 119 | $0.6745(-1) / 2$ | -0.337 | No | Normal |
| 120 | $0.6745(0) / 2$ | 0.000 | No | Normal |
| 121 | $0.6745(1) / 2$ | 0.337 | No | Normal |
| 122 | $0.6745(2) / 2$ | 0.6745 | No | Normal |
| 200 | $0.6745(80) / 2$ | **26.98** | **Yes** | **Anomaly** |

**Conclusion:**
Reading #8 (**200 mmHg**) produces a massive Modified Z-Score of 26.98, far exceeding the threshold of 3.5. It is safely flagged as a dangerous anomaly.