## 1. Introduction
**Artificial Neural Networks (ANNs)** are the engine behind Deep Learning. They are supervised learning algorithms loosely inspired by the biological brain, designed to recognize complex patterns in data.

* **The Goal:** To find the optimal set of "weights" and "biases" so that when an input is fed into the network, it accurately predicts the correct output.
* **The Intuition:** At a low level, an ANN is not magic; it is just a massive, directed graph of simple mathematical functions. Think of it like a complex circuit board. Data flows in, gets multiplied by variable resistors (weights), accumulates in a register (the neuron), and if the voltage is high enough, it triggers an output signal (activation).

### The Architecture
A standard Feedforward Neural Network consists of three distinct parts:
1. **Input Layer:** The raw data entering the system (e.g., pixel values of an image). These nodes do *no processing*; they just hold the initial values.
2. **Hidden Layer(s):** The core processing unit. This is where the network does the heavy mathematical lifting to extract features and patterns.
3. **Output Layer:** The final prediction or decision (e.g., identifying if the image is a cat or a dog).

---

## 2. Anatomy of a Single Neuron

To understand the whole network, we must tear apart a single neuron. Every single node in the hidden and output layers behaves exactly like this.

![Single Neuron](../99_Assets/Single%20Neuron.png)

A neuron performs its processing in two distinct phases: **The Accumulation ($net$)** and **The Decision ($f(net)$)**.

### Phase 1: The Accumulation ($net$)
The neuron receives multiple inputs ($x$), each carrying a specific weight ($w$). It multiplies each input by its weight, sums them all together, and adds a constant Bias ($b$).

$$
net = \sum_{i=1}^{n} (x_i \cdot w_i) + bias
$$

* **Inputs ($x_i$):** The signals coming from the previous layer.
* **Weights ($w_i$):** The "importance" of that specific input. A high weight means the network pays close attention to that signal. A weight near zero means the signal is ignored.
* **Bias ($b$):** A threshold shifter. It acts exactly like a y-intercept in a linear equation, allowing the neuron to shift its activation point left or right to better fit the data.

>[!info] Exam Trap: The Bias Trick
> Sometimes the formula is written without explicitly showing the bias addition. This is done by treating the bias as just another weight ($w_0$) connected to an imaginary input that is always equal to $1$ ($x_0 = 1$). Mathematically, $1 \cdot w_0$ is the exact same thing as adding a standalone bias!

### Phase 2: The Decision (Activation Function)
Once the neuron calculates the raw sum ($net$), it does not just pass that number forward. It passes the raw sum through an **Activation Function** ($f$).

$$
Output = f(net)
$$

**Why do we need an Activation Function?**
If we just output the raw $net$ sum, the entire neural network would just be a series of massive linear multiplications. No matter how many millions of hidden layers you add, a purely linear network can only ever draw a straight line. 

The activation function is what introduces **non-linearity**. It allows the network to bend, curve, and wrap its decision boundaries around incredibly complex, non-linear data sets.

---
## 3. Activation Functions (The Math & Intuition)

The activation function dictates whether a neuron should "fire" (pass its signal forward) based on the accumulated $net$ value. Here are the standard functions you need to know, how they behave, and their exact formulas.

### 1. Step (Unit Step)
The simplest function. It acts like a strict binary switch.
* **The Intuition:** If the accumulated signal is negative, the neuron stays completely dead ($0$). The moment it hits zero or higher, it fires at full power ($1$).
* **The Formula:**
$$
f(net) = \begin{cases} 
0 & \text{if } net < 0 \\ 
1 & \text{if } net \ge 0 
\end{cases}
$$
![ANN.Step.png](../99_Assets/ANN.Step.png)

### 2. Signum (Sign)
Very similar to the Step function, but it outputs a negative signal instead of just turning off.
* **The Intuition:** Used when you need a strict "Yes" ($1$) or "No" ($-1$) classification without any middle ground.
* **The Formula:**
$$
f(net) = \begin{cases} 
-1 & \text{if } net < 0 \\ 
1 & \text{if } net \ge 0 
\end{cases}
$$
![ANN.Signum.png](../99_Assets/ANN.Signum.png)

### 3. Linear
A pure pass-through function.
* **The Intuition:** The neuron does absolutely nothing to the signal. Whatever sum goes in, is exactly what comes out. (Rarely used in hidden layers, but sometimes used in the final output layer for regression tasks).
* **The Formula:**
$$
f(net) = net
$$
![ANN.Linear.png](../99_Assets/ANN.Linear.png)

### 4. Sigmoid
The classic activation function that turns any number into a probability.
* **The Intuition:** It takes the entire number line (from $-\infty$ to $+\infty$) and gracefully "squishes" it into a tight bound between $0$ and $1$. It's perfect for predicting probabilities (e.g., "There is a 0.99 chance this is a cat").
* **The Formula:**
$$
f(net) = \frac{1}{1 + e^{-net}}
$$
![ANN.Sigmoid.png](../99_Assets/ANN.Sigmoid.png)

### 5. Hyperbolic Tangent (Tanh)
Sigmoid's bigger, balanced brother. 
* **The Intuition:** Just like Sigmoid, it squishes the number line, but it centers the data at zero, binding it between $-1$ and $1$. This centering often helps networks learn faster than Sigmoid.
* **The Formula:**
$$
f(net) = \frac{e^{net} - e^{-net}}{e^{net} + e^{-net}}
$$
![ANN.Hyperbolic.png](../99_Assets/ANN.Hyperbolic.png)

### 6. ReLU (Rectified Linear Unit)
The modern king of activation functions. It is incredibly cheap to compute.
* **The Intuition:** If the signal is negative, kill it immediately ($0$). If the signal is positive, let it pass through unaltered. 
* **The Formula:**
$$
f(net) = \max(0, net)
$$
![ANN.ReLU.png](../99_Assets/ANN.ReLU.png)

### 7. Leaky ReLU
A fix for the "Dying ReLU" problem.
* **The Intuition:** In standard ReLU, a negative signal kills the neuron completely, meaning it stops learning entirely. Leaky ReLU fixes this by allowing a tiny, slight slope (usually $0.01$) for negative numbers, keeping the neuron barely "alive" so it can still recover and learn.
* **The Formula:**
$$
f(net) = \max(0.01 \cdot net, net)
$$
![ANN.Leaky ReLU.png](../99_Assets/ANN.Leaky%20ReLU.png)

---

### 8. Softmax (The Multi-Class Decider)
Unlike the functions above, Softmax doesn't just look at a single neuron. It looks at an entire layer of neurons at the same time. It is almost exclusively used in the **final Output Layer** when you have multiple categories (e.g., predicting if an image is a Cat, Dog, or Bird).

>[!tip] Demystifying Softmax
> Imagine your final output layer gives you three raw scores (called logits): **[Cat: 2.0, Dog: 1.0, Bird: -0.5]**. 
> Softmax does two magical things to these raw numbers:
> 1. **It exponentiates them:** ($e^{2.0}, e^{1.0}, e^{-0.5}$). This forces every number to be positive, and makes the bigger numbers stand out much more (magnifying the network's confidence).
> 2. **It normalizes them:** It divides each exponentiated number by the total sum of all of them. 
> 
> **The Result:** Those raw, confusing numbers are instantly converted into clean percentages that perfectly add up to $1.0$ (or $100\%$). For example: **[Cat: 70%, Dog: 24%, Bird: 6%]**.

* **The Formula:**
$$
f(net_i) = \frac{e^{net_i}}{\sum_{j} e^{net_j}}
$$
*(Where $net_i$ is the raw score of the specific class you are calculating, and the denominator is the sum of the exponentiated scores of all classes).*

>[!info] Recommended Watch: StatQuest Series
> If you are struggling to visualize how the math translates to real-world probabilities, or want to see exactly how Softmax differs from ArgMax, watch this breakdown:
> **[Neural Networks Part 5: ArgMax and SoftMax (StatQuest)](https://www.youtube.com/watch?v=KpKog-L9veg)** > *(This is part of a larger series that is highly recommended for reviewing ANN mechanics).*

---
## 4. Feedforward Trace (Step-by-Step)

To understand how a neural network makes a prediction, we must manually trace the math from the input layer to the output layer. This process is called **Feedforward** (or Forward Propagation).

Here is the exact architecture we are tracing:
* **2 Input Nodes** ($X_1, X_2$)
* **2 Hidden Nodes** ($H_1, H_2$)
* **1 Output Node** ($O_{out}$)

![FullNetwork.png](../99_Assets/FullNetwork.png)

### The Setup (Initialization)
Before we can push data through the network, we need to initialize our inputs, weights, and choose our activation functions. 
*(Note: To keep the manual trace clean and focus entirely on the weight multiplications, we will assume all **Biases = 0**).*

**The Inputs:**
* $X_1 = 2$
* $X_2 = 4$

**The Weights:**
* $W_1 = 0.5$ (Connects $X_1 \rightarrow H_1$)
* $W_2 = 0.25$ (Connects $X_2 \rightarrow H_1$)
* $W_3 = -0.5$ (Connects $X_1 \rightarrow H_2$)
* $W_4 = 0.5$ (Connects $X_2 \rightarrow H_2$)
* $W_5 = 0.8$ (Connects $H_1 \rightarrow O_{out}$)
* $W_6 = 0.6$ (Connects $H_2 \rightarrow O_{out}$)

**Activation Functions:**
* **Hidden Layer ($H_1, H_2$):** ReLU $f(net) = \max(0, net)$
* **Output Layer ($O_{out}$):** Linear $f(net) = net$

---

### Step 1: Calculate Hidden Node 1 ($H_1$)
First, we look at every arrow pointing *into* $H_1$. That is $X_1$ via $W_1$, and $X_2$ via $W_2$.

**Phase 1: Accumulation ($net$)**
$$
net_{H1} = (X_1 \cdot W_1) + (X_2 \cdot W_2)
$$
$$
net_{H1} = (2 \cdot 0.5) + (4 \cdot 0.25) = 1.0 + 1.0 = \mathbf{2.0}
$$

**Phase 2: Decision (Activation)**
We pass the sum through the ReLU activation function.
$$
Out_{H1} = \max(0, 2.0) = \mathbf{2.0}
$$

### Step 2: Calculate Hidden Node 2 ($H_2$)
Now, we look at every arrow pointing *into* $H_2$. That is $X_1$ via $W_3$, and $X_2$ via $W_4$.

**Phase 1: Accumulation ($net$)**
$$
net_{H2} = (X_1 \cdot W_3) + (X_2 \cdot W_4)
$$
$$
net_{H2} = (2 \cdot -0.5) + (4 \cdot 0.5) = -1.0 + 2.0 = \mathbf{1.0}
$$

**Phase 2: Decision (Activation)**
Pass the sum through the ReLU function.
$$
Out_{H2} = \max(0, 1.0) = \mathbf{1.0}
$$

### Step 3: Calculate the Final Output ($O_{out}$)
The hidden layer has finished processing. Now, $H_1$ and $H_2$ become the "inputs" for the final output node. We look at the arrows pointing into $O_{out}$ ($W_5$ and $W_6$).

**Phase 1: Accumulation ($net$)**
$$
net_{out} = (Out_{H1} \cdot W_5) + (Out_{H2} \cdot W_6)
$$
$$
net_{out} = (2.0 \cdot 0.8) + (1.0 \cdot 0.6) = 1.6 + 0.6 = \mathbf{2.2}
$$

**Phase 2: Decision (Activation)**
Our output layer uses a Linear function, meaning the value simply passes through unchanged.
$$
Out_{final} = \mathbf{2.2}
$$

>[!tip] Feedforward Complete!
> Our neural network has officially made a prediction. By feeding the inputs `[2, 4]` through our specific maze of weights, the network outputted a final answer of `2.2`. 
> But what if the true, actual answer was supposed to be `1.0`? That means our network made a massive mistake. To fix it, we have to use **Backpropagation**.

---
## 5. Backpropagation (The Matrix Method & Trace)

In our feedforward trace, the network predicted `2.2`. But what if the true target value was `1.2`? The network was wrong. **Backpropagation** is the algorithm used to send that error backward through the network, updating the weights so it gets smarter for the next round.

>[!tip] The Intuition: Assigning Blame
> Imagine a basketball team losing a game. The coach looks at the final score (The Error), realizes they lost, and goes into the locker room. The coach works backward, assigning "blame" to the players. The player who missed 15 shots gets a massive adjustment to their playing style. The player who played perfectly gets almost no adjustment. Backpropagation is the mathematical version of assigning blame.

### 1. The Error Equation
Before we can fix the network, we must mathematically calculate how bad the mistake was using the **Squared Error** formula:

$$
E = \frac{1}{2} (Predicted - Actual)^2
$$

*(Note: We multiply by $\frac{1}{2}$ because when we take the derivative of this error to update our weights, the $2$ from the squared exponent drops down and perfectly cancels the fraction out, leaving us with a clean $(Predicted - Actual)$ to use in our formulas!)*

### 2. The General Weight Update Equation
Before we look at the specific matrices, you must memorize the fundamental rule of Backpropagation. Every single weight in the network is updated using this exact same master equation:

$$
W_{new} = W_{old} - (\eta \times \text{Error Gradient})
$$

* **$W_{old}$:** The current, incorrect weight.
* **$\eta$ (Learning Rate):** A constant that controls how big of a step we take.
* **Error Gradient:** The mathematical "blame" assigned to this specific weight. 

Instead of using messy calculus to find that Error Gradient, we can use a highly efficient matrix shortcut to calculate it and update the weights layer by layer. 

*(Note on Notation: We will use $X$ for our Inputs ($X_1, X_2$) and $n$ for our Hidden Nodes ($H_1, H_2$)).*

**Output Layer Weights ($W_5, W_6$):**
To update the final weights, the "blame" is simply the error multiplied by the hidden nodes that fed into them.
$$
\begin{bmatrix} W_5 \\ W_6 \end{bmatrix}_{new} = \begin{bmatrix} W_5 \\ W_6 \end{bmatrix}_{old} - \eta \cdot (\text{Predicted} - \text{Actual}) \cdot \begin{bmatrix} n_1 \\ n_2 \end{bmatrix}
$$

**Hidden Layer Weights ($W_1, W_2, W_3, W_4$):**
To update the first layer, the error has to flow backward through the old output weights. The "blame" here is the error, scaled by the raw inputs ($X$) and the old output weights ($W_5, W_6$).
$$
\begin{bmatrix} W_1 & W_3 \\ W_2 & W_4 \end{bmatrix}_{new} = \begin{bmatrix} W_1 & W_3 \\ W_2 & W_4 \end{bmatrix}_{old} - \eta \cdot (\text{Predicted} - \text{Actual}) \cdot \begin{bmatrix} X_1 \\ X_2 \end{bmatrix} \times \begin{bmatrix} W_5 & W_6 \end{bmatrix}_{old}
$$

>[!warning] Exam Trap: Matrix Multiplication
> Look closely at the end of the hidden layer formula: $\begin{bmatrix} X_1 \\ X_2 \end{bmatrix} \times \begin{bmatrix} W_5 & W_6 \end{bmatrix}$. 
> This is a $(2 \times 1)$ column matrix multiplied by a $(1 \times 2)$ row matrix. The result will expand into a $(2 \times 2)$ matrix. Do not try to do a simple dot product here!

---

## 6. Backpropagation Trace (Step-by-Step)

Let's fix the weights from our Feedforward example using these exact formulas. 

**The Setup (Values from our Feedforward trace):**
* **Predicted Output:** $2.2$
* **Target (Actual) Output:** $1.2$
* **Learning Rate ($\eta$):** $0.1$
* **Inputs ($X$):** $X_1 = 2$, $X_2 = 4$
* **Hidden Nodes ($n$):** $n_1 = 2.0$, $n_2 = 1.0$
* **Old Output Weights:** $W_5 = 0.8$, $W_6 = 0.6$
* **Old Hidden Weights Matrix:** $\begin{bmatrix} 0.5 & -0.5 \\ 0.25 & 0.5 \end{bmatrix}$

**The Error Factor Calculation:**
First, let's calculate the multiplier we will use for both equations: $\eta \cdot (\text{Predicted} - \text{Actual})$
$$\text{Error Factor} = 0.1 \cdot (2.2 - 1.2) = 0.1 \cdot 1.0 = \mathbf{0.1}$$

### Step 1: Update Output Weights ($W_5, W_6$)

$$
\begin{bmatrix} W_5 \\ W_6 \end{bmatrix}_{new} = \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix} - 0.1 \cdot \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix}
$$

Multiply the scalar ($0.1$) into the nodes matrix:
$$
\begin{bmatrix} W_5 \\ W_6 \end{bmatrix}_{new} = \begin{bmatrix} 0.8 \\ 0.6 \end{bmatrix} - \begin{bmatrix} 0.2 \\ 0.1 \end{bmatrix}
$$

**Final Updated Output Weights:**
$$
\begin{bmatrix} W_5 \\ W_6 \end{bmatrix}_{new} = \mathbf{\begin{bmatrix} 0.6 \\ 0.5 \end{bmatrix}}
$$

### Step 2: Update Hidden Weights ($W_1, W_2, W_3, W_4$)
*Crucial: You must use the OLD $W_5$ and $W_6$ values ($0.8, 0.6$) for this calculation, not the new ones we just found!*

$$
\begin{bmatrix} W_1 & W_3 \\ W_2 & W_4 \end{bmatrix}_{new} = \begin{bmatrix} 0.5 & -0.5 \\ 0.25 & 0.5 \end{bmatrix} - 0.1 \cdot \begin{bmatrix} 2 \\ 4 \end{bmatrix} \times \begin{bmatrix} 0.8 & 0.6 \end{bmatrix}
$$

First, resolve the matrix multiplication at the end (the Exam Trap!):
$$
\begin{bmatrix} 2 \\ 4 \end{bmatrix} \times \begin{bmatrix} 0.8 & 0.6 \end{bmatrix} = \begin{bmatrix} (2 \cdot 0.8) & (2 \cdot 0.6) \\ (4 \cdot 0.8) & (4 \cdot 0.6) \end{bmatrix} = \begin{bmatrix} 1.6 & 1.2 \\ 3.2 & 2.4 \end{bmatrix}
$$

Next, multiply that result by our Error Factor ($0.1$):
$$
0.1 \cdot \begin{bmatrix} 1.6 & 1.2 \\ 3.2 & 2.4 \end{bmatrix} = \begin{bmatrix} 0.16 & 0.12 \\ 0.32 & 0.24 \end{bmatrix}
$$

Finally, subtract this from the old weight matrix:
$$
\begin{bmatrix} W_1 & W_3 \\ W_2 & W_4 \end{bmatrix}_{new} = \begin{bmatrix} 0.5 & -0.5 \\ 0.25 & 0.5 \end{bmatrix} - \begin{bmatrix} 0.16 & 0.12 \\ 0.32 & 0.24 \end{bmatrix}
$$

**Final Updated Hidden Weights:**
$$
\begin{bmatrix} W_1 & W_3 \\ W_2 & W_4 \end{bmatrix}_{new} = \mathbf{\begin{bmatrix} 0.34 & -0.62 \\ -0.07 & 0.26 \end{bmatrix}}
$$

>[!success] Iteration Complete
> The backpropagation is done! The network has successfully updated all 6 weights. If we feed $X_1 = 2$ and $X_2 = 4$ through the network again using these *new* weights, the prediction will be significantly closer to the target of `1.2`.



