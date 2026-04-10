// --- State Management ---
let currentStep = 0;
let animationId = 0; // Used to cancel overlapping animations if user clicks fast
const TOTAL_DOTS = 120; // Number of visual dots
let dots = []; // Store dot DOM elements and their metadata

const container = document.getElementById('canvas-container');
const popRegion = document.getElementById('population-region');
const sampleRegion = document.getElementById('sample-region');

// --- Step Data Content ---
const steps = [
    {
        title: "Population vs. Sample",
        tag: "The Basics",
        desc: "In inferential statistics, we want to learn about a large group (the Population). Because it's usually impossible to measure everyone, we select a smaller, manageable subset (the Sample) to represent them.",
        example: "<strong>Goal:</strong> Find the average cups of coffee consumed per week by adults in Brew City.<br><br><strong>Population:</strong> All 100,000 adults in the city. (Too many to ask!)<br><strong>Sample:</strong> A subset of 100 adults that we actually survey.",
        action: async (animId) => {
            sampleRegion.style.opacity = '1';
            // Reset all dots to population area
            moveAllToPopulation(animId);
            await sleep(600, animId);
            // Move a random sample to the right
            const selected = shuffleArray([...dots]).slice(0, 20);
            selected.forEach(d => {
                d.el.style.backgroundColor = '#3b82f6'; // Blue
                d.el.style.left = getRandomPercent(70, 90) + '%';
                d.el.style.top = getRandomPercent(15, 85) + '%';
            });
        }
    },
    {
        title: "Simple Random Sampling",
        tag: "Probability",
        desc: "The gold standard. Every single member of the population has an equal chance of being selected. This removes human bias and is highly representative.",
        example: "<strong>How to do it:</strong> We obtain a list of all 100,000 residents in Brew City. We use a computer's random number generator to pick exactly 100 names from that list, completely at random.",
        action: async (animId) => {
            moveAllToPopulation(animId);
            await sleep(800, animId);

            // Highlight one by one to show "random selection"
            const selected = shuffleArray([...dots]).slice(0, 15);
            for (let i = 0; i < selected.length; i++) {
                if (animId !== animationId) return;
                selected[i].el.style.backgroundColor = '#2563eb';
                selected[i].el.style.transform = 'translate(-50%, -50%) scale(1.5)';
                await sleep(100, animId);
            }

            await sleep(300, animId);
            selected.forEach(d => {
                if (animId !== animationId) return;
                d.el.style.transform = 'translate(-50%, -50%) scale(1)';
                d.el.style.left = getRandomPercent(70, 90) + '%';
                d.el.style.top = getRandomPercent(15, 85) + '%';
            });
        }
    },
    {
        title: "Stratified Sampling",
        tag: "Probability",
        desc: "The population is divided into distinct subgroups (strata) based on a specific characteristic. Then, a random sample is drawn from <strong>each</strong> subgroup proportionally.",
        example: "<strong>How to do it:</strong> Coffee habits vary by age! We divide Brew City into three age strata: 18-35 (Green), 36-55 (Red), and 56+ (Orange). We then randomly select people from *each* group so our sample accurately reflects the city's age demographics.",
        action: async (animId) => {
            // Organize dots into 3 strata in population
            const strataColors = ['#22c55e', '#ef4444', '#f59e0b'];
            const groups = [[], [], []];

            dots.forEach((d, i) => {
                d.strata = i % 3;
                groups[d.strata].push(d);
                d.el.style.backgroundColor = strataColors[d.strata];

                // Position by strata (Top, Middle, Bottom)
                let topMin = 15 + (d.strata * 25);
                d.el.style.left = getRandomPercent(10, 40) + '%';
                d.el.style.top = getRandomPercent(topMin, topMin + 20) + '%';
            });

            await sleep(1000, animId);

            // Pick 5 from each strata
            const sample = [];
            groups.forEach(g => sample.push(...shuffleArray(g).slice(0, 5)));

            sample.forEach((d, i) => {
                if (animId !== animationId) return;
                d.el.style.left = getRandomPercent(70, 90) + '%';
                // Keep their relative vertical position in the sample box
                let topMin = 15 + (d.strata * 25);
                d.el.style.top = getRandomPercent(topMin, topMin + 20) + '%';
                d.el.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
            });
        }
    },
    {
        title: "Cluster Sampling",
        tag: "Probability",
        desc: "The population is divided into naturally occurring groups (clusters), usually geographically. We randomly select entire clusters and survey <strong>everyone</strong> inside those selected clusters.",
        example: "<strong>How to do it:</strong> Brew City is divided into 20 distinct neighborhoods. Instead of driving all over town, we randomly select 3 neighborhoods and survey *every single adult* living in those 3 neighborhoods.",
        action: async (animId) => {
            // Form 5 clusters
            const clusterCenters = [
                { x: 15, y: 25 }, { x: 35, y: 25 }, { x: 25, y: 50 }, { x: 15, y: 75 }, { x: 35, y: 75 }
            ];

            dots.forEach((d, i) => {
                d.cluster = i % 5;
                d.el.style.backgroundColor = '#94a3b8'; // gray
                d.el.style.boxShadow = 'none';
                d.el.style.left = (clusterCenters[d.cluster].x + getRandomPercent(-5, 5)) + '%';
                d.el.style.top = (clusterCenters[d.cluster].y + getRandomPercent(-8, 8)) + '%';
            });

            await sleep(1000, animId);

            // Select 2 clusters completely
            const selectedClusters = [0, 4];

            dots.forEach(d => {
                if (selectedClusters.includes(d.cluster)) {
                    d.el.style.backgroundColor = '#8b5cf6'; // Purple
                    // Move to sample region, maintaining cluster shape roughly
                    setTimeout(() => {
                        if (animId !== animationId) return;
                        d.el.style.left = (d.cluster === 0 ? 75 : 85) + getRandomPercent(-4, 4) + '%';
                        d.el.style.top = (d.cluster === 0 ? 30 : 60) + getRandomPercent(-8, 8) + '%';
                    }, 300);
                } else {
                    d.el.style.opacity = '0.3'; // fade out non-selected
                }
            });
        }
    },
    {
        title: "Systematic Sampling",
        tag: "Probability",
        desc: "Individuals are ordered in a list, a random starting point is chosen, and then every <i>k</i>-th individual is selected.",
        example: "<strong>How to do it:</strong> We get the city's voter registration list ordered alphabetically. We pick a random starting name near the top, and then select every 1,000th person on the list to get our sample.",
        action: async (animId) => {
            // Arrange dots in a neat grid
            const cols = 10;
            dots.forEach((d, i) => {
                d.el.style.backgroundColor = '#94a3b8';
                d.el.style.boxShadow = 'none';
                d.el.style.opacity = '1';

                let row = Math.floor(i / cols);
                let col = i % cols;

                d.el.style.left = (10 + col * 3.5) + '%';
                d.el.style.top = (15 + row * 6) + '%';
            });

            await sleep(800, animId);

            // Select every 6th dot
            for (let i = 2; i < dots.length; i += 6) {
                if (animId !== animationId) return;
                dots[i].el.style.backgroundColor = '#0ea5e9'; // Light blue
                dots[i].el.style.transform = 'translate(-50%, -50%) scale(1.5)';
                await sleep(100, animId);
            }

            await sleep(400, animId);

            // Move them
            let count = 0;
            for (let i = 2; i < dots.length; i += 6) {
                if (animId !== animationId) return;
                dots[i].el.style.transform = 'translate(-50%, -50%) scale(1)';
                dots[i].el.style.left = (75 + (count % 3) * 8) + '%';
                dots[i].el.style.top = (20 + Math.floor(count / 3) * 12) + '%';
                count++;
            }
        }
    },
    {
        title: "Convenience Sampling",
        tag: "Non-Probability (Caution!)",
        desc: "A non-probability method where you just pick whoever is easiest to reach. This is highly prone to bias because the sample usually doesn't look like the actual population.",
        example: "<strong>How to do it:</strong> A lazy researcher stands outside a fancy independent coffee shop at 7:30 AM on a Monday and surveys the first 100 people walking by.<br><br><em>(Warning: This will heavily overestimate the city's true average coffee consumption!)</em>",
        action: async (animId) => {
            // Move all back to random pop
            moveAllToPopulation(animId);

            // Add a visual "Researcher" spot at bottom right of pop
            const researcherSpot = document.createElement('div');
            researcherSpot.className = 'absolute w-4 h-4 bg-red-600 rounded-sm transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[8px] z-20';
            researcherSpot.style.left = '42%';
            researcherSpot.style.top = '85%';
            researcherSpot.innerHTML = 'R';
            researcherSpot.id = 'researcher-temp';
            container.appendChild(researcherSpot);

            await sleep(800, animId);

            // Pick dots closest to bottom right (convenience)
            const sortedDots = [...dots].sort((a, b) => {
                const distA = Math.pow(parseFloat(a.el.style.left) - 42, 2) + Math.pow(parseFloat(a.el.style.top) - 85, 2);
                const distB = Math.pow(parseFloat(b.el.style.left) - 42, 2) + Math.pow(parseFloat(b.el.style.top) - 85, 2);
                return distA - distB;
            });

            const selected = sortedDots.slice(0, 15);
            selected.forEach(d => {
                if (animId !== animationId) return;
                d.el.style.backgroundColor = '#ec4899'; // Pink
                d.el.style.boxShadow = '0 0 10px #ec4899';
            });

            await sleep(600, animId);

            selected.forEach(d => {
                if (animId !== animationId) return;
                d.el.style.left = getRandomPercent(70, 90) + '%';
                d.el.style.top = getRandomPercent(60, 85) + '%'; // Clustered in corner of sample area
            });

            // Cleanup researcher tag on next step
            const cleanup = () => { if (document.getElementById('researcher-temp')) document.getElementById('researcher-temp').remove(); }
            setTimeout(cleanup, 3000);
        }
    },
    {
        title: "The Goal: Inference",
        tag: "Conclusion",
        desc: "Once we have a representative sample (using a good probability method), we calculate the sample statistic (like average coffee cups). We then use this to estimate the true population parameter.",
        example: "<strong>The Result:</strong> Our perfectly randomized sample average is 4.2 cups per week. Using inferential statistics, we can mathematically project: <em>'We are 95% confident that the true average for all 100,000 adults in Brew City is between 3.9 and 4.5 cups per week.'</em>",
        action: async (animId) => {
            // Clean up researcher if exists
            if (document.getElementById('researcher-temp')) document.getElementById('researcher-temp').remove();

            // Put a clean random sample in the right box
            moveAllToPopulation(animId);
            await sleep(600, animId);

            const selected = shuffleArray([...dots]).slice(0, 20);
            selected.forEach(d => {
                d.el.style.backgroundColor = '#10b981'; // Emerald
                d.el.style.left = getRandomPercent(70, 90) + '%';
                d.el.style.top = getRandomPercent(20, 80) + '%';

                // Add pulse
                let pulse = document.createElement('div');
                pulse.className = 'pulse-ring w-4 h-4';
                d.el.appendChild(pulse);
            });

            await sleep(1000, animId);

            // The "Inference" visual: colors from sample flow back to population
            const unselected = dots.filter(d => !selected.includes(d));
            unselected.forEach((d, i) => {
                setTimeout(() => {
                    if (animId !== animationId) return;
                    d.el.style.backgroundColor = 'rgba(16, 185, 129, 0.3)'; // faint emerald
                }, Math.random() * 1500);
            });
        }
    }
];

// --- Helper Functions ---

// Initialize dots
function initDots() {
    for (let i = 0; i < TOTAL_DOTS; i++) {
        const el = document.createElement('div');
        el.className = 'dot bg-slate-400';
        container.appendChild(el);
        dots.push({ el, id: i });
    }
}

function moveAllToPopulation(animId) {
    dots.forEach(d => {
        if (animId && animId !== animationId) return;
        // Strip existing styles and inner elements (pulses)
        d.el.innerHTML = '';
        d.el.style.backgroundColor = '#94a3b8'; // Slate-400
        d.el.style.boxShadow = 'none';
        d.el.style.opacity = '1';
        d.el.style.transform = 'translate(-50%, -50%) scale(1)';

        // Random position in population region (left 5% to 45%)
        d.el.style.left = getRandomPercent(10, 45) + '%';
        d.el.style.top = getRandomPercent(15, 85) + '%';
    });
}

function getRandomPercent(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sleep(ms, animId) {
    return new Promise(resolve => {
        setTimeout(() => {
            // If animation ID changed during sleep, don't resolve normally, or let caller handle it
            resolve();
        }, ms);
    });
}

// --- UI Updates ---

const titleEl = document.getElementById('step-title');
const descEl = document.getElementById('step-desc');
const exampleEl = document.getElementById('step-example');
const tagEl = document.getElementById('concept-tag');
const progressEl = document.getElementById('progress-indicator');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const dotContainer = document.getElementById('dot-indicators');

function setupPagination() {
    steps.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 rounded-full transition-colors ${i === 0 ? 'bg-blue-600' : 'bg-slate-200'}`;
        dot.id = `nav-dot-${i}`;
        dotContainer.appendChild(dot);
    });
}

function updateUI() {
    const step = steps[currentStep];

    // Text
    titleEl.innerHTML = step.title;
    descEl.innerHTML = step.desc;
    exampleEl.innerHTML = step.example;
    tagEl.innerHTML = step.tag;
    progressEl.innerText = `Step ${currentStep + 1} of ${steps.length}`;

    // Buttons
    btnPrev.disabled = currentStep === 0;
    if (currentStep === steps.length - 1) {
        btnNext.disabled = true;
        btnNext.innerText = "Finished";
    } else {
        btnNext.disabled = false;
        btnNext.innerText = "Next Step →";
    }

    // Dots
    steps.forEach((_, i) => {
        document.getElementById(`nav-dot-${i}`).className = `w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-blue-600 w-4' : 'bg-slate-200'}`;
    });

    // Trigger Animation
    animationId++; // Cancel previous animations

    // Cleanup UI artifacts
    if (document.getElementById('researcher-temp')) document.getElementById('researcher-temp').remove();

    step.action(animationId);
}

// --- Event Listeners ---
btnNext.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateUI();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateUI();
    }
});

// --- Bootup ---
initDots();
setupPagination();

// Slight delay on first load to let CSS render before moving dots
setTimeout(() => {
    updateUI();
}, 100);