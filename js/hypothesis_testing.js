// SVG Definitions for visuals
const svgs = {
    intro: `<svg class="w-full h-40" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="30" width="300" height="90" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="200" y="70" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e40af" text-anchor="middle">Assumption vs Reality</text>
                <text x="200" y="95" font-family="sans-serif" font-size="14" fill="#475569" text-anchor="middle">Do we have enough evidence to prove it?</text>
            </svg>`,
    distributionBase: `<svg class="w-full h-48" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- X Axis -->
                <line x1="50" y1="170" x2="450" y2="170" stroke="#94a3b8" stroke-width="2"/>
                <!-- Bell Curve -->
                <path d="M 50 170 C 120 170, 180 20, 250 20 C 320 20, 380 170, 450 170" stroke="#3b82f6" stroke-width="3" fill="none"/>
                <!-- Mean Line -->
                <line x1="250" y1="20" x2="250" y2="170" stroke="#cbd5e1" stroke-dasharray="5,5" stroke-width="2"/>
                <text x="250" y="190" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Null Hypothesis True (Mean = 30)</text>
            </svg>`,
    alphaRegion: `<svg class="w-full h-48" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="50" y1="170" x2="450" y2="170" stroke="#94a3b8" stroke-width="2"/>
                <!-- Shaded Alpha Region (Right tail) -->
                <path d="M 360 115 C 375 145, 410 170, 450 170 L 360 170 Z" fill="#ef4444" opacity="0.3"/>
                <!-- Bell Curve -->
                <path d="M 50 170 C 120 170, 180 20, 250 20 C 320 20, 380 170, 450 170" stroke="#3b82f6" stroke-width="3" fill="none"/>
                <line x1="250" y1="20" x2="250" y2="170" stroke="#cbd5e1" stroke-dasharray="5,5" stroke-width="2"/>
                <line x1="360" y1="115" x2="360" y2="170" stroke="#ef4444" stroke-width="2"/>
                <text x="405" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">$\\alpha = 0.05$</text>
                <text x="405" y="160" font-family="sans-serif" font-size="10" fill="#dc2626" text-anchor="middle">Rejection Region</text>
                <text x="250" y="190" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Mean = 30</text>
            </svg>`,
    testStat: `<svg class="w-full h-48" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="50" y1="170" x2="450" y2="170" stroke="#94a3b8" stroke-width="2"/>
                <path d="M 360 115 C 375 145, 410 170, 450 170 L 360 170 Z" fill="#ef4444" opacity="0.3"/>
                <path d="M 50 170 C 120 170, 180 20, 250 20 C 320 20, 380 170, 450 170" stroke="#3b82f6" stroke-width="3" fill="none"/>
                <line x1="250" y1="20" x2="250" y2="170" stroke="#cbd5e1" stroke-dasharray="5,5" stroke-width="2"/>
                <line x1="360" y1="115" x2="360" y2="170" stroke="#ef4444" stroke-width="2"/>
                <!-- Test Statistic Point -->
                <circle cx="390" cy="170" r="6" fill="#16a34a" />
                <line x1="390" y1="140" x2="390" y2="170" stroke="#16a34a" stroke-width="2" stroke-dasharray="3,3"/>
                <text x="390" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">t = 2.83</text>
                <text x="250" y="190" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">$\\mu = 30$</text>
                <text x="390" y="190" font-family="sans-serif" font-size="14" fill="#16a34a" text-anchor="middle">$\\bar{x} = 32$</text>
            </svg>`,
};

const stepsData = [
    {
        title: "1. Introduction to Hypothesis Testing",
        concept: "Hypothesis testing is a statistical method used to make decisions or inferences about a population based on a sample of data. It helps us determine if an assumption is likely true or just a result of random chance.",
        example: `<span class="font-bold text-blue-700">The Pizza Scenario:</span> 'Luigi's Pizza' prominently advertises that their average delivery time is 30 minutes or less. As a frequent customer, you suspect they actually take much longer. You want to prove your suspicion using data, rather than just guessing.`,
        visual: svgs.intro
    },
    {
        title: "2. Formulating Hypotheses ($H_0$ and $H_1$)",
        concept: "Every test starts with two opposing statements. The <strong>Null Hypothesis ($H_0$)</strong> is the status quo or default assumption (usually containing $=, \\le,$ or $\\ge$). The <strong>Alternative Hypothesis ($H_1$ or $H_a$)</strong> is the claim you are trying to prove.",
        example: `<ul class="list-disc pl-5 mt-2 space-y-2 text-slate-700">
                    <li><strong>Null Hypothesis ($H_0$):</strong> Luigi is telling the truth. The true average delivery time ($\\mu$) is less than or equal to 30 minutes. <br> <div class="math-container border-l-4 border-blue-400 pl-4 bg-blue-50 py-2 mt-1">$$H_0: \\mu \\le 30$$</div></li>
                    <li><strong>Alternative Hypothesis ($H_1$):</strong> You are right. Luigi's deliveries take longer than 30 minutes. This is a "right-tailed" test. <br> <div class="math-container border-l-4 border-orange-400 pl-4 bg-orange-50 py-2 mt-1">$$H_1: \\mu > 30$$</div></li>
                    </ul>`,
        visual: svgs.distributionBase
    },
    {
        title: "3. Choosing the Significance Level ($\\alpha$)",
        concept: "The Significance Level ($\\alpha$) is the probability of rejecting the Null Hypothesis when it is actually true (a Type I error). It sets the threshold for how extreme our data must be before we call Luigi a liar.",
        example: `We decide to use a standard significance level of <span class="font-bold text-red-600">$\\alpha = 0.05$</span> (5%). <br><br>
                    This means we are willing to accept a 5% risk of concluding that Luigi's deliveries average more than 30 minutes, when in reality, he is actually delivering on time. The red area in the graph represents this 5% rejection region.`,
        visual: svgs.alphaRegion
    },
    {
        title: "4. Collecting Data & Test Statistic",
        concept: "We collect sample data and calculate a <strong>Test Statistic</strong> (like a Z-score or T-score). This number tells us how far our sample mean is from the hypothesized population mean, measured in standard errors.",
        example: `Over the next few months, you record the delivery times of <strong>$n = 50$</strong> pizzas. <br>
                    You calculate your sample mean: <strong>$\\bar{x} = 32$ minutes</strong>. <br>
                    The sample standard deviation is: <strong>$s = 5$ minutes</strong>. <br><br>
                    Since we don't know the population standard deviation, we use a <strong>One-Sample T-Test</strong>:
                    <div class="math-container bg-slate-100 p-4 rounded-lg mt-3 text-center">
                    $$ t = \\frac{\\bar{x} - \\mu}{\\frac{s}{\\sqrt{n}}} = \\frac{32 - 30}{\\frac{5}{\\sqrt{50}}} = \\frac{2}{0.707} \\approx 2.83 $$
                    </div>
                    Our sample average is 2.83 standard errors above Luigi's claimed average.`,
        visual: ""
    },
    {
        title: "5. The P-Value and Critical Region",
        concept: "The <strong>P-value</strong> is the probability of getting a test statistic as extreme as ours (or more extreme) assuming the Null Hypothesis ($H_0$) is perfectly true. If the P-value is smaller than $\\alpha$, we fall into the rejection region.",
        example: `Our calculated t-score is <strong>2.83</strong>. Looking this up in a t-distribution table (with $df = 49$), we get a <span class="font-bold text-blue-600">P-value of approximately 0.003</span>. <br><br>
                    This means if Luigi's true average really was 30 minutes, there is only a <strong>0.3% chance</strong> we would randomly get a sample average of 32 minutes or higher.`,
        visual: svgs.testStat
    },
    {
        title: "6. Making a Decision",
        concept: `The final step is to compare the P-value to $\\alpha$. <br>
                    &bull; If <strong>$P \\le \\alpha$</strong>: Reject $H_0$. <br>
                    &bull; If <strong>$P > \\alpha$</strong>: Fail to reject $H_0$.`,
        example: `<div class="bg-green-50 border border-green-200 rounded-xl p-5 mb-4 shadow-sm">
                    <h3 class="text-xl font-bold text-green-800 mb-2 flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Decision: Reject $H_0$
                    </h3>
                    <p class="text-green-900">Since our P-value ($0.003$) is much less than our significance level $\\alpha$ ($0.05$), we reject the null hypothesis.</p>
                    </div>
                    <strong>Conclusion in real-world terms:</strong> We have strong statistical evidence to conclude that Luigi's Pizza takes, on average, significantly longer than 30 minutes to deliver. Your suspicion was correct!`,
        visual: ""
    },
    {
        title: "7. Recap: Essential Formulas",
        concept: "Depending on your data type and what is known about the population, you will use different test statistics. Here is a cheat sheet of the most common Hypothesis Testing formulas.",
        example: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-blue-800 text-sm mb-2">One-Sample Z-Test</h4>
                    <p class="text-xs text-slate-500 mb-2">Used for means when population std dev ($\\sigma$) is known, or $n \\ge 30$.</p>
                    <div class="math-container">$$ Z = \\frac{\\bar{x} - \\mu_0}{\\frac{\\sigma}{\\sqrt{n}}} $$</div>
                </div>
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-blue-800 text-sm mb-2">One-Sample T-Test</h4>
                    <p class="text-xs text-slate-500 mb-2">Used for means when $\\sigma$ is unknown and sample size is small.</p>
                    <div class="math-container">$$ t = \\frac{\\bar{x} - \\mu_0}{\\frac{s}{\\sqrt{n}}} $$</div>
                </div>
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-blue-800 text-sm mb-2">Two-Sample Independent T-Test</h4>
                    <p class="text-xs text-slate-500 mb-2">Compares means of two independent groups (assuming unequal variances).</p>
                    <div class="math-container">$$ t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}} $$</div>
                </div>
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h4 class="font-bold text-blue-800 text-sm mb-2">One-Proportion Z-Test</h4>
                    <p class="text-xs text-slate-500 mb-2">Tests a claim about a population proportion ($p$).</p>
                    <div class="math-container">$$ Z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}} $$</div>
                </div>
            </div>
        `,
        visual: ""
    }
];

let currentStep = 0;

// DOM Elements
const contentArea = document.getElementById('contentArea');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const container = document.getElementById('content-area');

function renderStep(index) {
    const data = stepsData[index];

    // Build HTML
    let html = `
        <div class="fade-in space-y-6">
            <h2 class="text-3xl font-extrabold text-slate-800 border-b pb-3">${data.title}</h2>

            <div class="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 class="text-sm uppercase font-bold text-blue-600 mb-2 tracking-wider">The Concept</h3>
                <p class="text-lg text-slate-700 leading-relaxed">${data.concept}</p>
            </div>

            ${data.visual ? `<div class="w-full flex justify-center my-6">${data.visual}</div>` : ''}

            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 class="text-sm uppercase font-bold text-slate-500 mb-3 tracking-wider">
                    ${index === 6 ? 'Cheat Sheet' : 'Real-World Example'}
                </h3>
                <div class="text-slate-700 leading-relaxed text-lg">
                    ${data.example}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Trigger MathJax to process the new dynamically inserted formulas
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([container]).catch((err) => console.log(err.message));
    }

    // Update UI State
    btnPrev.disabled = index === 0;
    if (index === stepsData.length - 1) {
        btnNext.disabled = true;
        btnNext.innerHTML = "Finish";
    } else {
        btnNext.disabled = false;
        btnNext.innerHTML = "Next Step &rarr;";
    }

    // Update Progress
    const progressPercent = ((index + 1) / stepsData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.innerText = `Step ${index + 1} of ${stepsData.length}`;

    // Scroll to top of content
    container.scrollTop = 0;
}

// Event Listeners
btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        renderStep(currentStep);
    }
});

btnNext.addEventListener('click', () => {
    if (currentStep < stepsData.length - 1) {
        currentStep++;
        renderStep(currentStep);
    }
});

// Initialize First Step once MathJax is ready
window.onload = () => {
    renderStep(currentStep);
};