## 1. Introduction
**Model Validation** is the process of testing a Machine Learning model to ensure it actually learned the underlying patterns of the data, rather than just memorizing the answers (Overfitting). 
* **The Goal:** To accurately estimate how well the model will perform on completely new, unseen data in the real world.
* **The Golden Rule:** You must *never* test a model on the exact same data you used to train it. That is like giving a student the answer key before an exam.

Let's explore the 5 core strategies used to split data into Training sets (studying) and Testing sets (the exam), assuming a tiny dataset of 10 samples ($S_1$ to $S_{10}$).

---

## 2. Holdout Validation (Train / Test Split)
The simplest and fastest method. You take your dataset, shuffle it, and chop it into two static pieces—usually 70% to 80% for training, and the remainder for testing. 

>[!tip] The Data Split (70/30)
> `[ S1 | S3 | S4 | S6 | S7 | S9 | S10 ]` $\leftarrow$ **TRAIN (70%)**
> `[ S2 | S5 | S8 ]` $\leftarrow$ **TEST (30%)**

### The Mechanics
You train the model exactly one time on the Train split, and you evaluate it exactly one time on the Test split.

**Numerical Example:**
Let's test our trained model on the 3 held-out samples:

| Test Sample | True Label | Predicted Label | Correct? |
| :--- | :---: | :---: | :---: |
| **S2** ($X=4$) | 0 | 0 | ✅ Yes |
| **S5** ($X=10$) | 0 | 1 | ❌ No |
| **S8** ($X=16$) | 0 | 0 | ✅ Yes |

* **Final Accuracy:** $2 / 3 = \mathbf{66.7\%}$

**Pros & Cons:**
* **Advantage:** Extremely fast computationally. Good for massive datasets.
* **Disadvantage:** Wastes data (test samples are never learned from). Highly reliant on luck; if all the "hard" examples randomly end up in the test set, your accuracy score will artificially crash.

---

## 3. Train / Validation / Test Split
An extension of the Holdout method using *three* partitions. This is strictly required when you need to tune **Hyperparameters** (like choosing the $K$ in K-Nearest Neighbors, or the Learning Rate in a Neural Network).

>[!tip] The Data Split (60 / 20 / 20)
> `[ S1 | S3 | S4 | S6 | S7 | S9 ]` $\leftarrow$ **TRAIN (60%)**
> `[ S2 | S5 ]` $\leftarrow$ **VALIDATION (20%)** *(The "Practice Exam")*
> `[ S8 | S10 ]` $\leftarrow$ **TEST (20%)** *(The "Final Exam")*

### The Mechanics
1. **Train** models with different settings on the Training Set.
2. **Evaluate** them on the Validation Set to see which setting works best.
3. **Select** the winner and do one final evaluation on the completely untouched Test Set.

**Numerical Example:**
* **Step 1:** Try hyperparameter $k=3$. Test on Validation ($S_2, S_5$). It gets 1 wrong. (Accuracy: **50%**)
* **Step 2:** Try hyperparameter $k=5$. Test on Validation ($S_2, S_5$). It gets both right! (Accuracy: **100%**)
* **Step 3:** Lock in $k=5$ as the winner. Now, test it on the untouched Test Set ($S_8, S_{10}$).

| Test Sample | True Label | Predicted (using $k=5$) | Correct? |
| :--- | :---: | :---: | :---: |
| **S8** | 0 | 1 | ❌ No |
| **S10** | 1 | 1 | ✅ Yes |

* **Final Reported Accuracy:** $1 / 2 = \mathbf{50\%}$ 

>[!warning] Exam Trap: Data Leakage
> Never use the final Test Set to tweak or choose your hyperparameters! If you adjust your model based on the test set, the model has "seen" the answers. The accuracy score becomes optimistically biased and is essentially lying to you.

---

## 4. K-Fold Cross-Validation
The industry standard. Instead of a static split, we divide the dataset into $K$ equal-sized blocks (folds). We train the model $K$ different times, rotating which block acts as the test set.

>[!tip] The Data Split (Rotation for $K=5$)
> *Run 1:* `[ TEST ] [ Train ] [ Train ] [ Train ] [ Train ]`
> *Run 2:* `[ Train ] [ TEST ] [ Train ] [ Train ] [ Train ]`
> *Run 3:* `[ Train ] [ Train ] [ TEST ] [ Train ] [ Train ]`
> *Run 4:* `[ Train ] [ Train ] [ Train ] [ TEST ] [ Train ]`
> *Run 5:* `[ Train ] [ Train ] [ Train ] [ Train ] [ TEST ]`

### The Mechanics
If $N=10$ and $K=5$, each fold gets 2 samples.

**Numerical Example:**

| Iteration | Validation Set | Training Set | Accuracy |
| :--- | :--- | :--- | :---: |
| **Fold 1** | S1, S2 | S3 $\rightarrow$ S10 | 1 / 2 = **50%** |
| **Fold 2** | S3, S4 | S1, S2, S5 $\rightarrow$ S10 | 2 / 2 = **100%** |
| **Fold 3** | S5, S6 | S1 $\rightarrow$ S4, S7 $\rightarrow$ S10 | 1 / 2 = **50%** |
| **Fold 4** | S7, S8 | S1 $\rightarrow$ S6, S9, S10 | 2 / 2 = **100%** |
| **Fold 5** | S9, S10 | S1 $\rightarrow$ S8 | 2 / 2 = **100%** |

* **Final Accuracy:** Average of all runs = $(50 + 100 + 50 + 100 + 100) / 5 = \mathbf{80\%}$

**Key Property:** Every single sample is used for validation exactly once, and used for training $K-1$ times. Zero data is wasted.

---

## 5. Leave-One-Out Cross-Validation (LOOCV)
LOOCV is just K-Fold Cross-Validation taken to the absolute extreme. We set $K$ to equal the exact total number of samples ($N$). 

>[!tip] The Data Split
> `[ TEST ] [ Train | Train | Train | Train | Train | Train | Train | Train | Train ]`
> *(Rotate the single TEST block 10 times).*

### The Mechanics
Each iteration holds out exactly **one** sample and trains on the remaining $N-1$ samples.

**Numerical Example ($N=10$):**

| Iteration | Left Out (Test) | Training On | Correct? |
| :---: | :---: | :--- | :---: |
| **1** | S1 | S2 $\rightarrow$ S10 (9 samples) | ✅ Yes |
| **2** | S2 | S1, S3 $\rightarrow$ S10 | ✅ Yes |
| **3** | S3 | S1, S2, S4 $\rightarrow$ S10 | ✅ Yes |
| **4** | S4 | S1 $\rightarrow$ S3, S5 $\rightarrow$ S10 | ❌ No |
| **...** | ... | ... | ... |
| **10** | S10 | S1 $\rightarrow$ S9 | ✅ Yes |

* **Final Accuracy:** 8 correct out of 10 runs = $\mathbf{80\%}$

>[!important] The Computation Cost
> We had to train 10 completely separate models from scratch. If you have a dataset with 50,000 images, LOOCV requires training 50,000 separate neural networks. For this reason, LOOCV is **only** practical for extremely small datasets ($N < 100$).

---

## 6. Leave-P-Out Cross-Validation
A theoretical generalization of LOOCV. Instead of leaving exactly 1 sample out, you leave exactly $P$ samples out, testing every single possible mathematical combination of the data.

### The Mechanics
To find out how many times you have to train the model, you use the Combinatorics formula:
$$
C(n, p) = \frac{n!}{p!(n-p)!}
$$

**Numerical Example ($N=10$, $P=2$):**
Using the formula, $C(10, 2) = 45$ total iterations.

| Iteration | Validation Set | Training Set | Accuracy |
| :---: | :--- | :--- | :---: |
| **1** | S1, S2 | S3 $\rightarrow$ S10 | 50% |
| **2** | S1, S3 | S2, S4 $\rightarrow$ S10 | 100% |
| **3** | S1, S4 | S2, S3, S5 $\rightarrow$ S10 | 50% |
| **...** | ... | ... | ... |
| **44** | S8, S10 | S1 $\rightarrow$ S7, S9 | 50% |
| **45** | S9, S10 | S1 $\rightarrow$ S8 | 100% |

* **Final Accuracy:** The grand average of all 45 iteration accuracies.

>[!warning] Why it is almost never used
> The math explodes exponentially. If you have a tiny dataset of 100 samples and want to leave 5 out ($P=5$), you would have to calculate $C(100, 5)$, which equals **75,287,520 iterations**. No computer is going to train a model 75 million times for a dataset of 100 rows!