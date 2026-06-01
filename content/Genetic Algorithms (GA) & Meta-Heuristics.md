## 1. Introduction to Meta-Heuristics
When a search space is too massive for exact algorithms (like Dynamic Programming or Dijkstra's) to find the absolute best answer before the universe ends, we use **Meta-Heuristics**. 
* **The Goal:** They do not guarantee the absolute *perfect* mathematical answer. Instead, they guarantee a *"good enough"* answer in a reasonable amount of time.
* **The Intuition:** Most meta-heuristics are inspired by natural phenomena, simulating real-world optimization strategies to solve complex computer science problems. 
    * *Examples:* Genetic Algorithms (Evolution), Particle Swarm Optimization (Bird flocking), Ant Colony Optimization (Pheromone trails).

---

## 2. Introduction to Genetic Algorithms
**Genetic Algorithms (GA)** simulate the process of natural selection and biological evolution. They start with a pool of random, terrible solutions, and over thousands of generations, mathematically force them to "evolve" into highly optimized solutions.

### The Core Vocabulary
Before reading the code, you must translate the biological terms into algorithmic terms:
* **Population:** The current array of all potential solutions.
* **Chromosome (or Individual):** One single, specific solution to the problem. 
* **Gene:** A single variable or parameter inside that solution (usually represented as a bit: `0` or `1`).
* **Fitness Function:** The objective mathematical formula that scores a chromosome. A high fitness score means the solution is very strong and deserves to survive.

---

## 3. The GA Architecture & Pseudo-code

Here is the exact biological loop the algorithm follows to evolve solutions.

![GA flowchart.png](../99_Assets/GA%20flowchart.png)

### The Pseudo-Code
```python
# 1. Initialization
population = Generate_Random_Population()

# 2. Evaluation and Evolution Loop
for current_chromosome in population:
    
    fitness = Calculate_Fitness(current_chromosome)
    
    if fitness >= Threshold:
        return current_chromosome  # STOP: We found a perfect solution!
        
    else:
        found_better_child = False
        
        while not found_better_child:
            
            parent1, parent2 = Select_Pair(population)
            child = Crossover(parent1, parent2)
            new_chromosome = Mutate(child)
            
            # Step 4: Compare and Replace
            if Calculate_Fitness(current_chromosome) >
		        Calculate_Fitness(new_chromosome):
                # The old is better than the new. 
                # Scrap the child and repeat the while loop (Go to 1)
                continue 
            else:
                # The new child is better! 
                # Replace the old chromosome and break the while loop (Go to 2)
                Replace(current_chromosome, with=new_chromosome)
                found_better_child = True
```

------

## 4. Selection (Survival of the Fittest)

Once we calculate the fitness of every chromosome in our population, we need to pick parents to breed the next generation. 
* **The Goal:** Give the strongest chromosomes a much higher chance of being selected.
* **The Catch:** We *cannot* blindly pick the absolute best chromosomes every single time. If we do, we lose genetic diversity, and the algorithm gets permanently stuck in a "local optimum." We must leave a small chance for the weak chromosomes to breed too.

Before we can select parents to breed the next generation, we must evaluate them. Chromosomes are often represented as raw binary strings. We decode them into decimal values ($x$), and pass them through a **Fitness Function** $f(x)$ to get their final score.

**The Setup:**
Let's assume a population of $N=6$ binary chromosomes, and our fitness function is simply squaring the decimal value: $Fitness = x^2$.

| Chromosome | Binary | Decimal ($x$) | Fitness ($x^2$) |
| :--- | :---: | :---: | :---: |
| **C1** | `10000` | 16 | **256** |
| **C2** | `11001` | 25 | **625** |
| **C3** | `01001` | 9 | **81** |
| **C4** | `10101` | 21 | **441** |
| **C5** | `11100` | 28 | **784** |
| **C6** | `01101` | 13 | **169** |

*Total Population Fitness:* $256 + 625 + 81 + 441 + 784 + 169 = \mathbf{2356}$

---

### 1. Roulette Wheel Selection (Fitness Proportionate)
Imagine a casino roulette wheel. Every chromosome gets a slice of the wheel directly proportional to its fitness score. 
* **The Math:** $Probability = \frac{Fitness}{Total\_Fitness}$

| Chromosome | Fitness | Probability (Prop) | Accumulative Prop (The Wheel) |
| :--- | :---: | :--- | :--- |
| **C1** | 256 | $256 / 2356 = \mathbf{0.11}$ | **0.11** |
| **C2** | 625 | $625 / 2356 = \mathbf{0.26}$ | **0.37** *(0.11 + 0.26)* |
| **C3** | 81 | $81 / 2356 = \mathbf{0.03}$ | **0.40** *(0.37 + 0.03)* |
| **C4** | 441 | $441 / 2356 = \mathbf{0.19}$ | **0.59** *(0.40 + 0.19)* |
| **C5** | 784 | $784 / 2356 = \mathbf{0.33}$ | **0.92** *(0.59 + 0.33)* |
| **C6** | 169 | $169 / 2356 = \mathbf{0.07}$ | **0.99** *(~1.00 due to rounding)* |

* **The Spin:** We generate a random decimal between $0$ and $1$. If the random number is `0.75`, **C5** wins because 0.75 falls in C5's slice (between 0.59 and 0.92).

>[!warning] Exam Trap: The Domination Problem
> Look at **C5**. Because it has a massive fitness of 784, it takes up 33% of the entire wheel all by itself, while **C3** only gets 3%. C5 will be picked constantly, which can kill genetic diversity.

---

### 2. Rank Selection
Rank Selection was invented specifically to fix the "Domination Problem" seen in the Roulette Wheel. We completely ignore the raw fitness scores. Instead, we sort the population from worst to best and hand out slices of the wheel based *only* on their rank.
* **The Math:** $Total\_Rank = \frac{N(N+1)}{2}$. For $N=6$, the total is $\frac{6(7)}{2} = \mathbf{21}$.

| Chromosome | Fitness | Rank (1 is worst) | Probability (Rank / 21) | Accumulative Prop |
| :--- | :---: | :---: | :--- | :--- |
| **C3** | 81 | **1** | $1 / 21 = \mathbf{0.05}$ | **0.05** |
| **C6** | 169 | **2** | $2 / 21 = \mathbf{0.10}$ | **0.15** |
| **C1** | 256 | **3** | $3 / 21 = \mathbf{0.14}$ | **0.29** |
| **C4** | 441 | **4** | $4 / 21 = \mathbf{0.19}$ | **0.48** |
| **C2** | 625 | **5** | $5 / 21 = \mathbf{0.24}$ | **0.72** |
| **C5** | 784 | **6** | $6 / 21 = \mathbf{0.28}$ | **1.00** |

* **The Result:** Even though **C5** is almost ten times stronger than **C3**, its probability of being selected drops from 33% to a balanced 28%. The population stays diverse!

---

### 3. Tournament Selection
This is popular because it requires absolutely no fractions, probabilities, or sorting. We pick $K$ random chromosomes, throw them into an arena, and the one with the highest fitness wins.
* **The Setup:** Let's set the tournament size to $K=2$.

| Round | Fighter 1 (Random) | Fighter 2 (Random) | The Winner (Highest Fitness) |
| :--- | :--- | :--- | :--- |
| **1** | C1 (Fitness: 256) | C4 (Fitness: 441) | **C4** becomes Parent 1 |
| **2** | C6 (Fitness: 169) | C5 (Fitness: 784) | **C5** becomes Parent 2 |

>[!tip] The $K$ Parameter (Selection Pressure)
> If $K=1$, selection is completely random (nobody fights). 
> If $K=N$ (the whole population), the absolute best chromosome will win every single time. 
> Usually, $K = 2$ or $K = 3$ is the sweet spot to balance survival of the fittest with genetic randomness.

---

## 5. Crossover (Mating)

Once parents are selected, they combine their genetic material to create offspring. This is where the algorithm explores *new* potential solutions by mixing the best traits of the current generation. 

Let's assume our chromosomes are arrays of bits with a length of $n=4$.
* **Parent 1:** `[1, 1, 0, 0]`
* **Parent 2:** `[0, 0, 1, 1]`

### 1. Single-Point Crossover
A single random cut-point is chosen. Everything to the right of that point is swapped between the two parents.
* **The Cut:** After index 2.
* **Parent 1:** `[1, 1 | 0, 0]` $\rightarrow$ **Child 1:** `[1, 1, 1, 1]`
* **Parent 2:** `[0, 0 | 1, 1]` $\rightarrow$ **Child 2:** `[0, 0, 0, 0]`

### 2. Two-Point Crossover
Two random cut-points are chosen. Only the genetic material *between* those two points is swapped.
* **The Cuts:** After index 1 and index 3.
* **Parent 1:** `[1 | 1, 0 | 0]` $\rightarrow$ **Child 1:** `[1, 0, 1, 0]`
* **Parent 2:** `[0 | 0, 1 | 1]` $\rightarrow$ **Child 2:** `[0, 1, 0, 1]`

### 3. Multi-Point / Uniform Crossover
Instead of slicing the array, we flip a coin for every single gene to decide which parent it comes from.
* **The Coin Flips:** (Parent 1, Parent 2, Parent 1, Parent 2)
* **Parent 1:** `[1, 1, 0, 0]`
* **Parent 2:** `[0, 0, 1, 1]`
* **Child 1:** `[1, 0, 0, 1]`
* *(Child 2 gets the exact opposite of Child 1)* $\rightarrow$ **Child 2:** `[0, 1, 1, 0]`

---

## 6. Mutation (Evolutionary Anomalies)

If we only ever use Crossover, the algorithm will eventually run out of new ideas and get stuck. **Mutation** randomly alters a tiny percentage of the offspring to introduce brand new genetic material that didn't exist in either parent.

Let's assume our chromosome is an array of $n=4$ integers:
* **Original:** `[1, 2, 3, 4]`

### 1. Bit-Flip Mutation (For Binary)
The most common binary mutation. You select a random gene and invert it.
* **Original:** `[1, 0, 1, 0]`
* **Action:** Flip the 2nd bit.
* **Mutated:** `[1, 1, 1, 0]`

### 2. Swap Mutation
Select two random positions in the chromosome and swap their values.
* **Original:** `[1, 2, 3, 4]`
* **Action:** Swap index 1 and index 4.
* **Mutated:** `[4, 2, 3, 1]`

### 3. Inversion Mutation
Select a random sub-array within the chromosome and completely reverse its order.
* **Original:** `[1, 2, 3, 4]`
* **Action:** Invert the sub-array from index 2 to 4 `[2, 3, 4]`.
* **Mutated:** `[1, 4, 3, 2]`

### 4. Scramble Mutation
Select a random sub-array, but instead of strictly reversing it, you randomly shuffle the values inside it.
* **Original:** `[1, 2, 3, 4]`
* **Action:** Shuffle the entire array.
* **Mutated:** `[3, 1, 4, 2]`

### 5. Displacement (Insertion) Mutation
Select a random sub-array, completely remove it from the chromosome, and insert it into a new random position.
* **Original:** `[1, 2, 3, 4]`
* **Action:** Remove the sub-array `[2, 3]` and insert it at the very end.
* **Mutated:** `[1, 4, 2, 3]`

### 6. Random Resetting (Value Mutation)
*(Note: This is the specific method your professor highlighted).* Select a random gene, completely delete its current value, and replace it with a brand new, randomly generated valid value. 
* **Original:** `[1, 2, 3, 4]`
* **Action:** Reset the value at index 3 to a random new value (e.g., `9`).
* **Mutated:** `[1, 2, 9, 4]`

>[!tip] Exam Trap: Mutation Rate
> The Mutation Rate parameter is always kept extremely low (usually between $0.01$ and $0.05$). If the mutation rate is too high, the algorithm destroys good solutions faster than it can build them, turning the Genetic Algorithm into a purely random, chaotic search!


