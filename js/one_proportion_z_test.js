// --- Data & Steps Definition ---
const stepsData = [
    {
        title: "1. The Scenario & Concept",
        description: `
            <p>Welcome! A <strong>One Proportion Z-Test</strong> is used to determine whether the proportion of a specific characteristic in a sample is significantly different from a known or hypothesized population proportion.</p>
            <div class="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <strong class="text-blue-800 block mb-1">Our Real-World Scenario:</strong>
                <p class="text-blue-900 text-sm">TechCorp recently updated their mobile app interface. Before the update, the industry benchmark stated that <strong>80%</strong> ($0.80$) of users are satisfied with standard app interfaces. TechCorp suspects that their new, controversial update has actually <strong>lowered</strong> user satisfaction below the 80% benchmark.</p>
            </div>
            <p class="mt-4">We will use inferential statistics to test TechCorp's suspicion using a sample of users.</p>
        `,
        visual: `
            <div class="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex-1">
                    <div class="text-4xl mb-2">📊</div>
                    <h3 class="font-bold text-slate-800">Industry Standard</h3>
                    <p class="text-3xl font-black text-indigo-600 mt-2">80%</p>
                    <p class="text-sm text-slate-500 mt-1">Target Satisfaction</p>
                </div>
                <div class="text-3xl text-slate-400 font-bold">VS</div>
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex-1">
                    <div class="text-4xl mb-2">📱</div>
                    <h3 class="font-bold text-slate-800">TechCorp App</h3>
                    <p class="text-3xl font-black text-rose-500 mt-2">? %</p>
                    <p class="text-sm text-slate-500 mt-1">Actual Satisfaction</p>
                </div>
            </div>
        `
    },
    {
        title: "2. Stating the Hypotheses",
        description: `
            <p>Every statistical test starts with two competing claims: the <strong>Null Hypothesis ($H_0$)</strong> and the <strong>Alternative Hypothesis ($H_a$)</strong>.</p>
            <ul class="list-disc pl-5 mt-2 space-y-2">
                <li><strong>$H_0$ (The Status Quo):</strong> Assumes there is no change. The satisfaction rate is still 80%.</li>
                <li><strong>$H_a$ (The Claim):</strong> What we are trying to prove. TechCorp suspects the rate has dropped <em>below</em> 80%. This makes it a <strong>left-tailed test</strong>.</li>
            </ul>
        `,
        visual: `
            <div class="flex flex-col gap-4 w-full max-w-md mx-auto">
                <div class="bg-slate-200 p-5 rounded-xl border-2 border-slate-300 flex items-center gap-4">
                    <div class="bg-slate-400 text-white font-bold w-12 h-12 flex items-center justify-center rounded-full text-lg">$H_0$</div>
                    <div>
                        <p class="text-sm text-slate-500 uppercase font-bold">Null Hypothesis</p>
                        <p class="text-2xl font-black text-slate-800">$p = 0.80$</p>
                    </div>
                </div>
                <div class="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-200 flex items-center gap-4 shadow-sm relative overflow-hidden">
                    <div class="absolute right-0 top-0 bottom-0 w-2 bg-indigo-500"></div>
                    <div class="bg-indigo-600 text-white font-bold w-12 h-12 flex items-center justify-center rounded-full text-lg">$H_a$</div>
                    <div>
                        <p class="text-sm text-indigo-500 uppercase font-bold">Alternative Hypothesis</p>
                        <p class="text-2xl font-black text-indigo-900">$p < 0.80$</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "3. Gathering Data & Setting Alpha",
        description: `
            <p>Before collecting data, we set a significance level, denoted by <strong> $\\alpha$ (alpha)</strong>. This is our "threshold of surprise." Standard practice is to use $\\alpha = 0.05$ (5%). If the probability of seeing our data just by random chance is less than 5%, we will reject $H_0$.</p>
            <p class="mt-4">Next, TechCorp surveys a random sample of their users:</p>
            <ul class="list-disc pl-5 mt-2">
                <li>Sample Size ($n$): <strong>150 users</strong></li>
                <li>Successes ($x$ - users satisfied): <strong>111 users</strong></li>
            </ul>
            <p class="mt-4">From this, we calculate the <strong>Sample Proportion ($\\hat{p}$)</strong>.</p>
        `,
        visual: `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div class="bg-white p-4 rounded-lg shadow border border-slate-100 text-center">
                    <p class="text-sm text-slate-500 font-semibold mb-1">Significance Level</p>
                    <p class="text-2xl font-bold text-amber-500">$\\alpha = 0.05$</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border border-slate-100 text-center">
                    <p class="text-sm text-slate-500 font-semibold mb-1">Sample Size</p>
                    <p class="text-2xl font-bold text-slate-700">$n = 150$</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border border-slate-100 text-center">
                    <p class="text-sm text-slate-500 font-semibold mb-1">Satisfied Users</p>
                    <p class="text-2xl font-bold text-emerald-500">$x = 111$</p>
                </div>
                <div class="bg-indigo-50 p-4 rounded-lg shadow border border-indigo-100 text-center ring-2 ring-indigo-400">
                    <p class="text-sm text-indigo-600 font-semibold mb-1">Sample Proportion</p>
                    <p class="text-2xl font-bold text-indigo-700">$\\hat{p} = \\frac{111}{150}$</p>
                    <p class="text-xl font-black text-indigo-900 mt-1">$\\hat{p} = 0.74$</p>
                </div>
            </div>
        `
    },
    {
        title: "4. Checking Assumptions",
        description: `
            <p>To use the Normal distribution for our test, we must check the <strong>Success/Failure Condition</strong>. We expect at least 10 successes and 10 failures based on our assumed population proportion ($p_0 = 0.80$).</p>
            <p class="mt-4">Let's check the math:</p>
            <ul class="list-none space-y-3 mt-3">
                <li class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span><strong>Successes:</strong> $n \\cdot p_0 = 150 \\cdot 0.80 = 120 \\ge 10$</span>
                </li>
                <li class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span><strong>Failures:</strong> $n \\cdot (1 - p_0) = 150 \\cdot 0.20 = 30 \\ge 10$</span>
                </li>
            </ul>
            <p class="mt-4">Both conditions are met! The sample is large enough, so the sampling distribution of $\\hat{p}$ is approximately Normal.</p>
        `,
        visual: `
            <div class="relative w-full max-w-lg mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div class="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12">
                    Assumptions Met!
                </div>
                <p class="text-center text-slate-600 text-sm mb-4">Because assumptions hold, we can map our sample to the Normal Curve.</p>
                <!-- Simple visual of sample going to normal curve -->
                <div class="flex justify-center items-center gap-6">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto text-2xl">👨‍👩‍👧‍👦</div>
                        <p class="text-xs mt-2 font-bold text-slate-500">Large Sample (n=150)</p>
                    </div>
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <div class="text-center">
                        <svg class="w-20 h-16 text-indigo-500 mx-auto" viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M0,50 Q20,50 35,35 T50,5 T65,35 T100,50" />
                        </svg>
                        <p class="text-xs mt-2 font-bold text-slate-500">Normal Model</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "5. Calculating the Test Statistic (Z-Score)",
        description: `
            <p>The Test Statistic (Z) tells us how many standard deviations our sample proportion ($\\hat{p} = 0.74$) is away from the assumed population proportion ($p_0 = 0.80$).</p>
            <p class="mt-4">Here is the calculation substituting our data into the formula:</p>
            <div class="bg-white border border-slate-200 p-4 rounded-lg my-4 text-center overflow-x-auto">
                $$ z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}} $$
                $$ z = \\frac{0.74 - 0.80}{\\sqrt{\\frac{0.80(0.20)}{150}}} $$
                $$ z = \\frac{-0.06}{\\sqrt{0.0010667}} \\approx \\frac{-0.06}{0.03266} $$
            </div>
        `,
        visual: `
            <div class="flex flex-col items-center justify-center w-full">
                <p class="text-slate-500 text-sm uppercase tracking-widest mb-2 font-bold">Resulting Z-Score</p>
                <div class="bg-indigo-600 text-white text-5xl font-black py-4 px-8 rounded-2xl shadow-lg ring-4 ring-indigo-200 transform scale-105 hover:scale-110 transition-transform cursor-default">
                    Z = -1.837
                </div>
                <p class="mt-4 text-slate-600 text-sm max-w-sm text-center">
                    Our sample satisfaction rate of 74% is <strong>1.837 standard deviations below</strong> the expected 80% mark.
                </p>
            </div>
        `
    },
    {
        title: "6. Finding the P-Value",
        description: `
            <p>The <strong>P-value</strong> is the probability of getting a result as extreme (or more extreme) as our sample, assuming the null hypothesis is true. Since this is a left-tailed test ($H_a: p < 0.80$), we want the area to the left of our Z-score.</p>
            <p class="mt-4">Looking up $Z = -1.837$ on the standard normal distribution curve, we find:</p>
            <div class="text-center mt-4 mb-2">
                <span class="inline-block bg-amber-100 text-amber-900 px-4 py-2 rounded-lg font-bold shadow-sm">
                    $P\\text{-value} \\approx 0.0331$ (or 3.31%)
                </span>
            </div>
            <p class="text-sm text-slate-500">Meaning: If the true satisfaction was 80%, there is only a 3.31% chance of seeing a sample drop this low purely by random variance.</p>
        `,
        visual: `
            <div class="w-full flex flex-col items-center">
                <canvas id="normalCurveCanvas" width="600" height="250" class="max-w-full bg-white rounded-lg border border-slate-200 shadow-sm"></canvas>
                <div class="flex items-center gap-6 mt-3 text-sm">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 bg-red-400 opacity-60 rounded-full"></div> P-value Area (0.0331)</div>
                    <div class="flex items-center gap-2"><div class="w-[2px] h-4 bg-indigo-800"></div> Z = -1.837</div>
                </div>
            </div>
        `,
        onRender: () => drawNormalCurveCanvas(-1.837)
    },
    {
        title: "7. Making the Decision",
        description: `
            <p>Finally, we compare our P-value to our significance level ($\\alpha$) to make a decision.</p>
            <div class="flex justify-center items-center gap-4 text-2xl font-bold my-6">
                <span class="text-amber-600">0.0331</span>
                <span class="text-slate-400">$\\le$</span>
                <span class="text-slate-800">0.05</span>
            </div>
            <p>Since our P-value (0.0331) is <strong>less than or equal to</strong> $\\alpha$ (0.05), we reject the null hypothesis ($H_0$).</p>
            <div class="mt-6 bg-green-50 border border-green-200 p-5 rounded-lg relative overflow-hidden">
                <div class="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <h4 class="text-green-800 font-bold mb-2">Real-World Conclusion:</h4>
                <p class="text-green-900 text-sm">We have sufficient statistical evidence to conclude that the actual user satisfaction rate for TechCorp's new app interface has indeed dropped significantly <strong>below 80%</strong>. They should probably reconsider the design update!</p>
            </div>
        `,
        visual: `
            <div class="flex items-center justify-center w-full h-full">
                <div class="relative group cursor-default">
                    <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div class="relative bg-white px-8 py-6 rounded-2xl border-2 border-red-500 shadow-xl flex flex-col items-center transform rotate-[-2deg]">
                        <div class="text-red-500 font-black text-4xl tracking-widest uppercase border-4 border-red-500 px-6 py-2 rounded-lg opacity-80" style="font-family: monospace;">
                            REJECT $H_0$
                        </div>
                        <p class="text-slate-500 font-semibold mt-3 text-sm">Statistically Significant Result</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        title: "8. Recap & Formulas Reference",
        description: `
            <p>Congratulations! You've successfully walked through a One Proportion Z-Test. Here is a summary of all the variables and equations used for your future reference.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h4 class="font-bold text-slate-800 mb-3 border-b pb-2">Variables</h4>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li><strong>$p_0$</strong> : Hypothesized population proportion</li>
                        <li><strong>$\\hat{p}$</strong> : Sample proportion ($x/n$)</li>
                        <li><strong>$x$</strong> : Number of successes in sample</li>
                        <li><strong>$n$</strong> : Total sample size</li>
                        <li><strong>$\\alpha$</strong> : Significance level (usually 0.05)</li>
                    </ul>
                </div>
                <div class="bg-indigo-50 p-5 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
                    <h4 class="font-bold text-indigo-900 mb-2 border-b border-indigo-200 pb-2">The Z-Test Formula</h4>
                    <div class="text-center overflow-x-auto py-2">
                        $$ Z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}} $$
                    </div>
                    <p class="text-xs text-indigo-700 mt-2 text-center">Standard Error (Denominator) = $\\sqrt{\\frac{p_0(1-p_0)}{n}}$</p>
                </div>
            </div>
        `,
        visual: `
            <div class="w-full bg-indigo-50 p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                <h4 class=" font-bold mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Confidence Interval
                </h4>
                <p class="text-sm mb-4">If you wanted to estimate the <em>actual</em> true proportion with a 95% Confidence Interval, you would use this related formula:</p>
                <div class="text-center bg-indigo-50 py-3 rounded-lg border border-slate-700 font-serif overflow-x-auto">
                    $$ \\text{CI} = \p_0 \\pm Z^* \\sqrt{\\frac{\p_0(1-\p_0)}{n}} $$
                </div>
                <p class="text-xs mt-3 text-center">Where $Z^*$ is the critical value (1.96 for 95% confidence).</p>
            </div>
        `
    }
];

let currentStep = 0;

// DOM Elements
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const stepVisual = document.getElementById('step-visual');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const stepCounter = document.getElementById('step-counter');
const progressBar = document.getElementById('progress-bar');
const dotIndicators = document.getElementById('dot-indicators');
const contentContainer = document.getElementById('content-container');

// Initialize App
function init() {
    createDots();
    renderStep();

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentStep < stepsData.length - 1) {
            currentStep++;
            renderStep();
        }
    });
}

function createDots() {
    dotIndicators.innerHTML = '';
    stepsData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentStep ? 'bg-indigo-600' : 'bg-slate-300'}`;
        dotIndicators.appendChild(dot);
    });
}

function updateDots() {
    const dots = dotIndicators.children;
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = `w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${i === currentStep ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`;
    }
}

async function renderStep() {
    // Trigger animation
    contentContainer.classList.remove('fade-in');
    void contentContainer.offsetWidth; // trigger reflow
    contentContainer.classList.add('fade-in');

    const step = stepsData[currentStep];

    // Update Text Data
    stepTitle.innerHTML = step.title;
    stepDescription.innerHTML = step.description;
    stepVisual.innerHTML = step.visual;

    // Update UI State
    stepCounter.textContent = `Step ${currentStep + 1} of ${stepsData.length}`;
    progressBar.style.width = `${((currentStep + 1) / stepsData.length) * 100}%`;

    btnPrev.disabled = currentStep === 0;

    if (currentStep === stepsData.length - 1) {
        btnNext.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Finish`;
        btnNext.disabled = true; // Or redirect/reset logic
        btnNext.classList.remove('hover:bg-indigo-700', 'bg-indigo-600');
        btnNext.classList.add('bg-slate-300', 'text-slate-500');
    } else {
        btnNext.innerHTML = `Next <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
        btnNext.disabled = false;
        btnNext.classList.add('hover:bg-indigo-700', 'bg-indigo-600', 'text-white');
        btnNext.classList.remove('bg-slate-300', 'text-slate-500');
    }

    updateDots();

    // Check if step has specific rendering function (like canvas)
    if (step.onRender && typeof step.onRender === 'function') {
        // Wait slightly for DOM to settle before drawing canvas
        setTimeout(step.onRender, 50);
    }

    // Typeset MathJax
    if (window.MathJax) {
        try {
            await MathJax.typesetPromise([stepDescription, stepVisual]);
        } catch (err) {
            console.error("MathJax error:", err);
        }
    }
}

// --- Canvas Drawing Function (For Step 6) ---
function drawNormalCurveCanvas(zScoreVal) {
    const canvas = document.getElementById('normalCurveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Padding and graph bounds
    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const baselineY = height - padding;

    // Math scaling
    const minX = -4; // standard deviations
    const maxX = 4;
    const maxCurveY = 0.45; // slightly above 1/sqrt(2pi) roughly 0.3989

    // Coordinate mapping functions
    const mapX = (x) => padding + ((x - minX) / (maxX - minX)) * graphWidth;
    const mapY = (y) => baselineY - (y / maxCurveY) * graphHeight;

    // Standard Normal PDF formula: f(x) = (1 / sqrt(2*PI)) * e^(-x^2 / 2)
    const normalPDF = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);

    // Draw shaded area (P-value region) - Left tail
    ctx.beginPath();
    ctx.moveTo(mapX(minX), baselineY);
    for (let x = minX; x <= zScoreVal; x += 0.05) {
        ctx.lineTo(mapX(x), mapY(normalPDF(x)));
    }
    ctx.lineTo(mapX(zScoreVal), baselineY);
    ctx.closePath();
    ctx.fillStyle = "rgba(248, 113, 113, 0.6)"; // Red-400 with opacity
    ctx.fill();

    // Draw the curve
    ctx.beginPath();
    for (let x = minX; x <= maxX; x += 0.05) {
        const cx = mapX(x);
        const cy = mapY(normalPDF(x));
        if (x === minX) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4f46e5"; // Indigo-600
    ctx.stroke();

    // Draw baseline (X-axis)
    ctx.beginPath();
    ctx.moveTo(padding - 10, baselineY);
    ctx.lineTo(width - padding + 10, baselineY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#94a3b8"; // Slate-400
    ctx.stroke();

    // Draw axis ticks and labels
    ctx.fillStyle = "#64748b"; // Slate-500
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    for (let i = -3; i <= 3; i++) {
        const tx = mapX(i);
        // Tick
        ctx.beginPath();
        ctx.moveTo(tx, baselineY);
        ctx.lineTo(tx, baselineY + 5);
        ctx.stroke();
        // Label
        ctx.fillText(i, tx, baselineY + 20);
    }
    ctx.fillText("Z", width - padding + 20, baselineY + 5);

    // Draw Z-score line
    const zX = mapX(zScoreVal);
    ctx.beginPath();
    ctx.moveTo(zX, baselineY);
    ctx.lineTo(zX, mapY(normalPDF(zScoreVal)));
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3730a3"; // Indigo-800
    ctx.setLineDash([5, 5]); // Dashed line
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Label the Z-score line specifically
    ctx.fillStyle = "#1e1b4b"; // Indigo-950
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Z = -1.837", zX - 40, baselineY - 40);
}

// Run application
window.onload = init;