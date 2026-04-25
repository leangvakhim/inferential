// --- DATA & LOGIC ---

// The Dataset
const groups = [
    { id: 'A', color: '#2563eb', xPos: 16.5, data: [3, 4, 5], mean: 4 },   // Blue
    { id: 'B', color: '#16a34a', xPos: 50.0, data: [6, 8, 10], mean: 8 },  // Green
    { id: 'C', color: '#dc2626', xPos: 83.5, data: [5, 6, 7], mean: 6 }    // Red
];
const grandMean = 6;

// Application Steps
const steps = [
    {
        title: "1. What is ANOVA?",
        description: `
            <p><strong>Analysis of Variance (ANOVA)</strong> is a statistical method used to test if there are significant differences between the means of three or more independent groups.</p>
            <p>Instead of looking at just the averages, ANOVA analyzes how the data is "spread out" (the variance) to determine if the differences between groups are real or just random chance.</p>
        `,
        example: `<strong>Real-World Example:</strong> Imagine you are a farmer testing three different fertilizers (A, B, and C) on tomato plants. You grow 3 plants with each fertilizer and measure their heights. Are the fertilizers actually performing differently, or is the variation just random luck?`,
        visualMode: "scatter"
    },
    {
        title: "2. Grand Mean vs. Group Means",
        description: `
            <p>To understand variance, we first establish our baselines:</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Group Means (Colored Lines):</strong> The average height of the plants within each specific fertilizer group.</li>
                <li><strong>Grand Mean (Dashed Black Line):</strong> The average height of <em>all</em> the plants combined, regardless of the fertilizer used.</li>
            </ul>
        `,
        example: `<strong>Observation:</strong> Notice how Fertilizer B's mean is higher than the Grand Mean, while Fertilizer A's mean is lower.`,
        visualMode: "means"
    },
    {
        title: "3. The Signal: Between-Group Variance (SSB)",
        description: `
            <p>Now we look at the <strong>Between-Group Variance</strong> (Sum of Squares Between, or $SSB$).</p>
            <p>This measures how much the <strong>Group Means</strong> differ from the <strong>Grand Mean</strong>. It represents the <em>effect</em> of our independent variable (the fertilizer).</p>
            <p>If the fertilizers have a strong effect, these distances (the arrows) will be large. We call this the <strong>"Signal"</strong>.</p>
        `,
        example: `<strong>Visualizing the Signal:</strong> The arrows show the distance from the overall average to each fertilizer's specific average.`,
        visualMode: "between"
    },
    {
        title: "4. The Noise: Within-Group Variance (SSW)",
        description: `
            <p>Next is the <strong>Within-Group Variance</strong> (Sum of Squares Within, or $SSW$), also known as the error variance.</p>
            <p>This measures how much individual data points differ from their <em>own</em> <strong>Group Mean</strong>.</p>
            <p>Even with the exact same fertilizer, some plants grow taller than others due to random factors like subtle soil differences or genetics. We call this random variation the <strong>"Noise"</strong>.</p>
        `,
        example: `<strong>Visualizing the Noise:</strong> The arrows now show how individual plants deviate from their fertilizer's average.`,
        visualMode: "within"
    },
    {
        title: "5. The F-Statistic (Signal vs. Noise)",
        description: `
            <p>ANOVA compares these two types of variance using a ratio called the <strong>F-Statistic</strong>.</p>
            <p>$$ F = \\frac{\\text{Variance Between Groups (Signal)}}{\\text{Variance Within Groups (Noise)}} $$</p>
            <p>If the Signal is much larger than the Noise ($F > 1$), we can conclude that the groups are genuinely different. If the ratio is close to 1, the differences are likely just random chance.</p>
        `,
        example: `<strong>Conclusion:</strong> Because the differences <em>between</em> the fertilizers (Signal) are much bigger than the random differences <em>within</em> the identical treatments (Noise), we conclude the fertilizers have a statistically significant effect!`,
        visualMode: "f-ratio"
    },
    {
        title: "6. Recap & The ANOVA Formulas",
        description: `
            <p>Here is the complete mathematical breakdown for One-Way ANOVA. The Total Variance ($SST$) is split into Between ($SSB$) and Within ($SSW$) components.</p>
            <div class="formula-box text-sm sm:text-base">
                <p class="mb-2"><strong>Sum of Squares:</strong></p>
                <div class="overflow-x-auto">
                    $$ SST = \\sum (x_{ij} - \\bar{x}_{grand})^2 $$
                    $$ SSB = \\sum n_j (\\bar{x}_j - \\bar{x}_{grand})^2 $$
                    $$ SSW = \\sum (x_{ij} - \\bar{x}_j)^2 $$
                </div>
                <p class="mb-2 mt-4"><strong>Mean Squares & F-Ratio:</strong></p>
                <div class="overflow-x-auto">
                    $$ MSB = \\frac{SSB}{k - 1} \\quad , \\quad MSW = \\frac{SSW}{N - k} $$
                    $$ F = \\frac{MSB}{MSW} $$
                </div>
            </div>
        `,
        example: `<strong>Summary:</strong> By breaking down the variance into explained (SSB) and unexplained (SSW) parts, ANOVA gives us a mathematically rigorous way to prove whether different treatments actually work!`,
        visualMode: "formulas"
    },
    {
        title: "7. The F-Distribution Explorer",
        description: `
            <p>Because variance is mathematically squared, the calculated F-ratio is always positive ($\\ge 0$) and follows a skewed probability curve called the <strong>F-Distribution</strong>.</p>
            <p>The shape of this curve depends on our <strong>Degrees of Freedom</strong> ($df_1$ and $df_2$).</p>
            <p>If our calculated F-ratio is greater than the Critical Value (falling into the <span class="text-rose-500 font-semibold">red rejection region</span> dictated by our alpha $\\alpha$), we reject the null hypothesis!</p>
        `,
        example: `<strong>Try it out:</strong> Adjust the Degrees of Freedom and Alpha level on the right to see how the mathematical threshold for proving statistical significance shifts.`,
        visualMode: "f-distribution"
    }
];

let currentStep = 0;

// DOM Elements
const elTitle = document.getElementById('step-title');
const elDesc = document.getElementById('step-description');
const elExample = document.getElementById('step-example');
const elBadge = document.getElementById('step-badge');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const elIndicators = document.getElementById('dot-indicators');
const chartArea = document.getElementById('chart-area');
const chartElements = document.getElementById('chart-elements');
const fRatioVisual = document.getElementById('f-ratio-visual');
const fDistVisual = document.getElementById('f-dist-visual');
const chartTitle = document.getElementById('chart-title');

// Initialize Application
function init() {
    // Generate progress dots
    steps.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${index === 0 ? 'bg-blue-600' : 'bg-slate-300'}`;
        dot.id = `indicator-${index}`;
        elIndicators.appendChild(dot);
    });

    // Event Listeners
    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        }
    });

    // Initialize F-Distribution Chart components
    initFDistributionChart();

    // Initial render
    renderStep();
}

// Main Render Function
function renderStep() {
    const stepData = steps[currentStep];

    // Update Text Content
    elBadge.innerText = `Step ${currentStep + 1} of ${steps.length}`;
    elTitle.innerHTML = stepData.title;
    elDesc.innerHTML = stepData.description;
    elExample.innerHTML = stepData.example;

    // Trigger MathJax to re-render the new equations
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([elDesc]).catch((err) => console.log('MathJax error:', err));
    }

    // Update Buttons
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep === steps.length - 1;

    // Update Indicators
    steps.forEach((_, index) => {
        const dot = document.getElementById(`indicator-${index}`);
        if (index === currentStep) {
            dot.className = 'w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors bg-blue-600';
        } else {
            dot.className = 'w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors bg-slate-300';
        }
    });

    // Handle Visualizations
    handleVisualization(stepData.visualMode);
}

// Helper: Convert Y value (0-10) to percentage from top
const getYPos = (val) => `${(10 - val) / 10 * 100}%`;

function handleVisualization(mode) {
    // Reset visibilities
    chartArea.classList.add('hidden');
    fRatioVisual.classList.add('hidden');
    fRatioVisual.classList.remove('flex');
    fDistVisual.classList.add('hidden');
    fDistVisual.classList.remove('flex');
    chartTitle.classList.remove('hidden');

    if (mode === 'f-ratio') {
        fRatioVisual.classList.remove('hidden');
        fRatioVisual.classList.add('flex');
        chartTitle.innerText = "Comparing Variances";
        return;
    } else if (mode === 'formulas') {
        chartTitle.classList.add('hidden');
        return;
    } else if (mode === 'f-distribution') {
        fDistVisual.classList.remove('hidden');
        fDistVisual.classList.add('flex');
        chartTitle.innerText = "F-Distribution Curve";
        // Trigger chart update in case it was hidden during init
        if (window.fChartInstance) window.fChartInstance.update();
        return;
    }

    // For scatter, means, between, within modes:
    chartArea.classList.remove('hidden');
    chartTitle.innerText = "Plant Height Visualization";

    // Clear existing chart elements nicely or create them if first time
    if (chartElements.innerHTML === '') {
        createChartBase();
    }

    // Apply visual states based on mode
    const allDots = document.querySelectorAll('.data-dot');
    const groupLines = document.querySelectorAll('.group-mean-line');
    const grandLine = document.getElementById('grand-mean-line');

    // Clear temporary arrows
    document.querySelectorAll('.variance-arrow').forEach(el => el.remove());

    switch (mode) {
        case 'scatter':
            allDots.forEach(dot => dot.style.opacity = '1');
            groupLines.forEach(line => line.style.opacity = '0');
            if (grandLine) grandLine.style.opacity = '0';
            break;
        case 'means':
            allDots.forEach(dot => dot.style.opacity = '0.4');
            groupLines.forEach(line => line.style.opacity = '1');
            if (grandLine) grandLine.style.opacity = '1';
            break;
        case 'between':
            allDots.forEach(dot => dot.style.opacity = '0.1');
            groupLines.forEach(line => line.style.opacity = '1');
            if (grandLine) grandLine.style.opacity = '1';
            drawBetweenArrows();
            break;
        case 'within':
            allDots.forEach(dot => dot.style.opacity = '1');
            groupLines.forEach(line => line.style.opacity = '1');
            if (grandLine) grandLine.style.opacity = '0.1';
            drawWithinArrows();
            break;
    }
}

function createChartBase() {
    // 1. Grand Mean Line
    const gLine = document.createElement('div');
    gLine.id = 'grand-mean-line';
    gLine.className = 'line border-t-2 border-dashed border-slate-800 w-full z-10';
    gLine.style.top = getYPos(grandMean);
    gLine.style.left = '0';
    gLine.style.opacity = '0';

    const gLabel = document.createElement('div');
    gLabel.className = 'absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded';
    gLabel.innerText = 'Grand Mean';
    gLine.appendChild(gLabel);
    chartElements.appendChild(gLine);

    groups.forEach(group => {
        // 2. Group Mean Lines
        const mLine = document.createElement('div');
        mLine.className = 'line group-mean-line border-t-4 z-10';
        mLine.style.borderColor = group.color;
        mLine.style.width = '20%';
        mLine.style.top = getYPos(group.mean);
        mLine.style.left = `${group.xPos - 10}%`;
        mLine.style.opacity = '0';

        const mLabel = document.createElement('div');
        mLabel.className = 'absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-1 rounded shadow-sm';
        mLabel.style.backgroundColor = group.color;
        mLabel.innerText = `Mean: ${group.mean}`;
        mLine.appendChild(mLabel);
        chartElements.appendChild(mLine);

        // 3. Data Dots
        group.data.forEach((val, i) => {
            const dot = document.createElement('div');
            dot.className = 'dot data-dot shadow-sm z-20';
            dot.style.width = '16px';
            dot.style.height = '16px';
            dot.style.backgroundColor = group.color;
            dot.style.border = '2px solid white';

            const spread = (i - 1) * 3;
            dot.style.left = `calc(${group.xPos}% + ${spread}px)`;
            dot.style.top = getYPos(val);

            dot.dataset.groupMean = group.mean;
            dot.dataset.val = val;
            dot.dataset.xPos = `calc(${group.xPos}% + ${spread}px)`;

            chartElements.appendChild(dot);
        });
    });
}

function drawBetweenArrows() {
    groups.forEach(group => {
        const arrow = document.createElement('div');
        arrow.className = 'variance-arrow absolute w-0.5 z-0';
        arrow.style.backgroundColor = 'purple';
        arrow.style.left = `${group.xPos}%`;

        const topVal = Math.max(group.mean, grandMean);
        const bottomVal = Math.min(group.mean, grandMean);

        arrow.style.top = getYPos(topVal);
        const heightPercent = ((topVal - bottomVal) / 10) * 100;
        arrow.style.height = `${heightPercent}%`;

        arrow.innerHTML = `
            <div class="absolute -left-1.5 -top-1 text-purple-600 text-[10px]">▲</div>
            <div class="absolute -left-1.5 -bottom-2 text-purple-600 text-[10px]">▼</div>
            <div class="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-700 bg-white px-1 rounded shadow-sm border border-purple-200 w-max z-30">Between</div>
        `;

        chartElements.appendChild(arrow);
    });
}

function drawWithinArrows() {
    const dots = document.querySelectorAll('.data-dot');
    dots.forEach(dot => {
        const val = parseFloat(dot.dataset.val);
        const mean = parseFloat(dot.dataset.groupMean);
        const xPos = dot.dataset.xPos;

        if (val === mean) return;

        const arrow = document.createElement('div');
        arrow.className = 'variance-arrow absolute w-0.5 z-0';
        arrow.style.backgroundColor = 'orange';
        arrow.style.left = xPos;

        const topVal = Math.max(val, mean);
        const bottomVal = Math.min(val, mean);

        arrow.style.top = getYPos(topVal);
        const heightPercent = ((topVal - bottomVal) / 10) * 100;
        arrow.style.height = `${heightPercent}%`;

        chartElements.appendChild(arrow);
    });

    const label = document.createElement('div');
    label.className = 'variance-arrow absolute left-[50%] top-[20%] text-xs font-bold text-orange-700 bg-white px-1 rounded shadow-sm border border-orange-200 z-30 transform -translate-x-1/2';
    label.innerText = 'Within (Error)';
    chartElements.appendChild(label);
}

// ==========================================
// F-DISTRIBUTION CHART LOGIC
// ==========================================
function initFDistributionChart() {
    const df1Slider = document.getElementById('df1-slider');
    const df2Slider = document.getElementById('df2-slider');
    const alphaSlider = document.getElementById('alpha-slider');

    const df1Display = document.getElementById('df1-val');
    const df2Display = document.getElementById('df2-val');
    const alphaDisplay = document.getElementById('alpha-val');
    const critFDisplay = document.getElementById('crit-f-val');

    const ctx = document.getElementById('fChart').getContext('2d');

    const X_MAX = 8;
    const X_STEP = 0.05;

    function generateChartData(df1, df2, alpha) {
        const labels = [];
        const pdfData = [];
        const criticalData = [];

        const fCrit = jStat.centralF.inv(1 - alpha, df1, df2);

        for (let x = 0.01; x <= X_MAX; x += X_STEP) {
            labels.push(x.toFixed(2));
            let y = jStat.centralF.pdf(x, df1, df2);
            y = Math.min(y, 2.5);
            pdfData.push(y);

            if (x >= fCrit) {
                criticalData.push(y);
            } else {
                criticalData.push(null);
            }
        }
        return { labels, pdfData, criticalData, fCrit };
    }

    function updateChartUI() {
        const df1 = parseInt(df1Slider.value);
        const df2 = parseInt(df2Slider.value);
        const alpha = parseFloat(alphaSlider.value);

        df1Display.textContent = df1;
        df2Display.textContent = df2;
        alphaDisplay.textContent = alpha.toFixed(2);

        const data = generateChartData(df1, df2, alpha);
        critFDisplay.textContent = data.fCrit.toFixed(2);

        if (window.fChartInstance) {
            window.fChartInstance.data.labels = data.labels;
            window.fChartInstance.data.datasets[0].data = data.pdfData;
            window.fChartInstance.data.datasets[1].data = data.criticalData;
            window.fChartInstance.data.datasets[1].label = `Rejection Region (α = ${alpha.toFixed(2)})`;

            const maxVal = Math.max(...data.pdfData);
            window.fChartInstance.options.scales.y.max = maxVal > 1.0 ? Math.ceil(maxVal * 1.2 * 10) / 10 : 1.0;
            window.fChartInstance.update();
        }
    }

    // Initial Data load
    const initData = generateChartData(parseInt(df1Slider.value), parseInt(df2Slider.value), parseFloat(alphaSlider.value));

    window.fChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initData.labels,
            datasets: [
                {
                    label: 'F-Distribution',
                    data: initData.pdfData,
                    borderColor: '#4f46e5',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: `Rejection Region`,
                    data: initData.criticalData,
                    backgroundColor: 'rgba(244, 63, 94, 0.4)',
                    borderColor: '#f43f5e',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
                tooltip: { enabled: false }, // disabled tooltips for cleaner view in small space
                legend: { display: false } // hide legend to save vertical space
            },
            scales: {
                x: {
                    title: { display: true, text: 'F-Value' },
                    ticks: { maxTicksLimit: 8 }
                },
                y: {
                    display: false, // hide Y axis labels for cleaner look in step panel
                    beginAtZero: true,
                    max: 1.0
                }
            }
        }
    });

    df1Slider.addEventListener('input', updateChartUI);
    df2Slider.addEventListener('input', updateChartUI);
    alphaSlider.addEventListener('input', updateChartUI);
}

// Run application on load
window.addEventListener('DOMContentLoaded', init);