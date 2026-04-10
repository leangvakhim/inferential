// Data for each step of the tutorial
const steps = [
    {
        title: "1. The Scenario",
        desc: `
            <p><strong>Real-world Example:</strong> Imagine you work for an electronics company. The marketing team claims that their brand new smartphone model has an average battery life of exactly <strong>24 hours</strong>.</p>
            <p>Based on extensive testing of similar past models, you know the population standard deviation ($\sigma$) is <strong>2 hours</strong>.</p>
            <p>We want to test if the marketing team's claim is mathematically valid using a <strong>One Sample Z-test</strong>. This test is perfect when comparing a sample mean to a population mean, and the population standard deviation is known.</p>
        `
    },
    {
        title: "2. Formulate the Hypotheses",
        desc: `
            <p>In statistics, we set up two competing claims before looking at the data.</p>
            <p><strong>Null Hypothesis ($H_0$):</strong> The claim is true. The true average battery life is 24 hours. There is no significant difference.
            $$H_0: \mu = 24$$
            </p>
            <p><strong>Alternative Hypothesis ($H_1$):</strong> The claim is false. The true average battery life is different from 24 hours.
            $$H_1: \mu \neq 24$$
            </p>
            <p><em>Since we are checking if it's different (either higher or lower), this is called a <strong>two-tailed test</strong>.</em></p>
        `
    },
    {
        title: "3. Choose the Significance Level ($\\alpha$)",
        desc: `
            <p>We need a threshold for "unusual" data. We'll use a standard significance level of <strong>5% ($\\alpha = 0.05$)</strong>. This means we accept a 5% risk of rejecting a true claim.</p>
            <p>Because it's a two-tailed test, we split the 5% risk into both extreme ends of the distribution curve (2.5% on the left, 2.5% on the right).</p>
            <p>The standard normal values (Z-values) that mark these boundaries are called <strong>Critical Values</strong>. For $\\alpha = 0.05$, they are <strong>$-1.96$ and $+1.96$</strong>. Anything outside this range is our "Rejection Region."</p>
        `
    },
    {
        title: "4. Collect Sample Data",
        desc: `
            <p>We can't test every single phone in the world, so we take a random sample.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li>Sample Size ($n$): <strong>50 phones</strong></li>
                <li>Sample Mean ($\\bar{x}$): <strong>23.2 hours</strong></li>
            </ul>
            <p class="mt-4">Our sample averaged 23.2 hours, which is 0.8 hours less than the 24-hour claim. But is this drop due to random chance, or is the 24-hour claim actually false?</p>
        `
    },
    {
        title: "5. Calculate the Z-Statistic",
        desc: `
            <p>We convert our sample mean into a <strong>Z-score</strong>. This tells us how many "standard errors" our sample is away from the claimed mean.</p>
            <p>$$Z = \\frac{\\bar{x} - \\mu_0}{\\frac{\\sigma}{\\sqrt{n}}}$$</p>
            <p>Plugging in our numbers:</p>
            <p>$$Z = \\frac{23.2 - 24}{\\frac{2}{\\sqrt{50}}} = \\frac{-0.8}{0.2828} \\approx -2.83$$</p>
            <p>Our sample is roughly 2.83 standard errors below the claimed average.</p>
        `
    },
    {
        title: "6. Make a Decision",
        desc: `
            <p>Now, we compare our Calculated Z-score to our Critical Z-values.</p>
            <p>Calculated Z: <strong>$-2.83$</strong><br>Critical Z range: <strong>$-1.96$ to $+1.96$</strong></p>
            <p>Because $-2.83$ is less than $-1.96$, it falls squarely into the red <strong>Rejection Region</strong> (look at the graph!).</p>
            <p><strong>Conclusion:</strong> We reject the Null Hypothesis ($H_0$). The probability of getting a sample average of 23.2 if the true average was 24 is less than 5%. The marketing team's claim is highly unlikely to be true.</p>
        `
    },
    {
        title: "7. Recap & Formulas",
        desc: `
            <p>Here is a complete summary of the One Sample Z-test formulas used in this scenario:</p>
            <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <ul class="space-y-4">
                    <li><strong>1. Hypotheses:</strong> $H_0: \\mu = \\mu_0$ vs $H_1: \\mu \\neq \\mu_0$</li>
                    <li><strong>2. Standard Error (SE):</strong> $$SE = \\frac{\\sigma}{\\sqrt{n}}$$</li>
                    <li><strong>3. Test Statistic (Z-score):</strong> $$Z = \\frac{\\bar{x} - \\mu_0}{SE}$$</li>
                    <li><strong>4. Decision Rule:</strong> Reject $H_0$ if $|Z_{calc}| > Z_{crit}$</li>
                </ul>
            </div>
            <p class="mt-4 text-sm text-slate-500">Note: Use a Z-test when population $\\sigma$ is known. If $\\sigma$ is unknown, a T-test should be used instead.</p>
        `
    }
];

let currentStep = 0;

// DOM Elements
const titleEl = document.getElementById('step-title');
const descEl = document.getElementById('step-desc');
const badgeEl = document.getElementById('step-badge');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const dotsContainer = document.getElementById('step-dots');
const canvas = document.getElementById('z-plot');
const ctx = canvas.getContext('2d');
const contentContainer = document.getElementById('content-container');

function initApp() {
    // Setup dots
    steps.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 rounded-full transition-colors ${i === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`;
        dot.id = `dot-${i}`;
        dotsContainer.appendChild(dot);
    });

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bind buttons
    btnPrev.addEventListener('click', () => { if (currentStep > 0) changeStep(currentStep - 1); });
    btnNext.addEventListener('click', () => { if (currentStep < steps.length - 1) changeStep(currentStep + 1); });

    renderStep();
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 48; // padding account
    canvas.height = canvas.width * 0.75;
    drawChart();
}

function changeStep(newStep) {
    contentContainer.style.opacity = 0;

    setTimeout(() => {
        // Update dots
        document.getElementById(`dot-${currentStep}`).classList.replace('bg-indigo-600', 'bg-slate-300');
        currentStep = newStep;
        document.getElementById(`dot-${currentStep}`).classList.replace('bg-slate-300', 'bg-indigo-600');

        renderStep();
        contentContainer.style.opacity = 1;
    }, 300); // match CSS transition time
}

function renderStep() {
    const stepData = steps[currentStep];
    titleEl.innerHTML = stepData.title;
    descEl.innerHTML = stepData.desc;
    badgeEl.innerText = `Step ${currentStep + 1} of ${steps.length}`;

    // Button states
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep === steps.length - 1;

    // Render Math using KaTeX
    renderMathInElement(document.body, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false
    });

    drawChart();
}

function drawChart() {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const margin = { top: 40, bottom: 40, left: 30, right: 30 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const zMin = -4;
    const zMax = 4;

    // Helper functions to map Z values to canvas coordinates
    const getX = (z) => margin.left + ((z - zMin) / (zMax - zMin)) * plotWidth;
    // Max density of std normal is approx 0.3989. Scale slightly above that.
    const getY = (y) => margin.top + plotHeight - (y / 0.45) * plotHeight;

    // 1. Draw Axis
    ctx.beginPath();
    ctx.moveTo(margin.left, getY(0));
    ctx.lineTo(width - margin.right, getY(0));
    ctx.strokeStyle = '#94a3b8'; // slate-400
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Compute Bell Curve Path
    const curvePath = new Path2D();
    curvePath.moveTo(getX(zMin), getY(0));
    for (let z = zMin; z <= zMax; z += 0.05) {
        const y = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
        curvePath.lineTo(getX(z), getY(y));
    }

    // 3. Shading (Step 3 onwards - Critical Regions)
    if (currentStep >= 2) {
        const shadeAlpha = 0.2;

        // Left Rejection Region
        ctx.beginPath();
        ctx.moveTo(getX(zMin), getY(0));
        for (let z = zMin; z <= -1.96; z += 0.05) {
            const y = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
            ctx.lineTo(getX(z), getY(y));
        }
        ctx.lineTo(getX(-1.96), getY(0));
        ctx.fillStyle = `rgba(239, 68, 68, ${shadeAlpha})`; // red-500
        ctx.fill();

        // Right Rejection Region
        ctx.beginPath();
        ctx.moveTo(getX(1.96), getY(0));
        for (let z = 1.96; z <= zMax; z += 0.05) {
            const y = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
            ctx.lineTo(getX(z), getY(y));
        }
        ctx.lineTo(getX(zMax), getY(0));
        ctx.fillStyle = `rgba(239, 68, 68, ${shadeAlpha})`;
        ctx.fill();

        // Critical Lines
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(getX(-1.96), getY(0));
        ctx.lineTo(getX(-1.96), getY(0.4));
        ctx.moveTo(getX(1.96), getY(0));
        ctx.lineTo(getX(1.96), getY(0.4));
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Critical Labels
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('-1.96', getX(-1.96), getY(0) + 15);
        ctx.fillText('+1.96', getX(1.96), getY(0) + 15);
        ctx.fillText('Rejection 2.5%', getX(-2.9), getY(0) + 30);
        ctx.fillText('Rejection 2.5%', getX(2.9), getY(0) + 30);
    }

    // 4. Draw Standard Curve Outline
    ctx.strokeStyle = '#4f46e5'; // indigo-600
    ctx.lineWidth = 3;
    ctx.stroke(curvePath);

    // 5. Draw Calculated Z-Score (Step 5 onwards)
    if (currentStep >= 4) {
        const zCalc = -2.83;

        ctx.beginPath();
        ctx.moveTo(getX(zCalc), getY(0));
        ctx.lineTo(getX(zCalc), getY(0.25));
        ctx.strokeStyle = '#059669'; // emerald-600
        ctx.lineWidth = 3;
        ctx.stroke();

        // Plot dot
        ctx.beginPath();
        ctx.arc(getX(zCalc), getY(0), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#059669';
        ctx.fill();

        // Label
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Z = -2.83', getX(zCalc), getY(0.25) - 10);

        // Add "Sample Mean" helper text if in Step 5/6
        if (currentStep < 6) {
            ctx.font = '11px sans-serif';
            ctx.fillText('(x̄ = 23.2)', getX(zCalc), getY(0.25) - 25);
        }
    }

    // 6. Center Label (Population Mean)
    ctx.fillStyle = '#334155'; // slate-700
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    if (currentStep === 0 || currentStep === 1) {
        ctx.fillText('μ = 24 hrs', getX(0), getY(0) + 15);
        ctx.beginPath();
        ctx.arc(getX(0), getY(0), 4, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        ctx.fillText('Z = 0', getX(0), getY(0) + 15);
        ctx.font = '11px sans-serif';
        ctx.fillText('(μ = 24)', getX(0), getY(0) + 28);
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);