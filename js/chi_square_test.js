// --- Math Functions for Chart ---
function logGamma(z) {
    let c = [
        57.1562356658629235, -59.5979603554754912,
        14.1360979747417471, -0.491913816097620199,
        .339946499848118887e-4, .465236289270485756e-4,
        -.983744753048795646e-4, .158088703224912494e-3,
        -.210264441724104883e-3, .217439618115212643e-3,
        -.164318106536763890e-3, .844182239838527433e-4,
        -.261908384015814087e-4, .368991826595316234e-5
    ];
    let sum = 0.999999999999997092;
    for (let i = 0; i < c.length; i++) {
        sum += c[i] / (z + i + 1);
    }
    let t = z + c.length - 0.5;
    return (z + 0.5) * Math.log(t) - t + Math.log(2.5066282746310005 * sum / z);
}

function chiSquarePDF(x, k) {
    if (x < 0) return 0;
    if (x === 0) {
        if (k < 2) return null;
        if (k === 2) return 0.5;
        if (k > 2) return 0;
    }
    let logPdf = (k / 2 - 1) * Math.log(x) - (x / 2) - (k / 2) * Math.log(2) - logGamma(k / 2);
    return Math.exp(logPdf);
}

// --- Content Definitions ---
const steps = [
    {
        title: "1. The Concept: What is a Chi-Square Test?",
        content: `
            <p class="text-lg mb-4">The <strong>Chi-Square ($\\chi^2$) Test of Independence</strong> is an inferential statistical test used to determine if there is a significant relationship between two <em>categorical</em> variables.</p>

            <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
                <h3 class="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                    Real-World Example
                </h3>
                <p class="text-amber-900">Imagine you are the manager of a local movie theater. You want to know if the type of movie a customer watches (Action, Comedy, Horror) affects their choice of snack at the concession stand (Popcorn, Nachos, Candy).</p>
                <p class="mt-2 text-amber-900"><strong>Variables:</strong> <br>1. Movie Genre (Categorical)<br>2. Snack Choice (Categorical)</p>
            </div>

            <p>Instead of comparing averages (like a T-test), we compare the <strong>frequencies</strong> (counts) of how often different categories overlap.</p>
        `
    },
    {
        title: "2. Setting the Hypotheses",
        content: `
            <p class="text-lg mb-4">Before looking at the data, we must define what we are testing. We create two opposing hypotheses.</p>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                    <h3 class="text-xl font-bold text-slate-700 border-b pb-2 mb-3">Null Hypothesis ($H_0$)</h3>
                    <p class="text-slate-600 mb-2"><strong>Concept:</strong> The variables are <em>independent</em>. There is no relationship.</p>
                    <div class="bg-slate-50 p-3 rounded italic text-sm border border-slate-100">
                        "A customer's snack choice has absolutely nothing to do with the movie genre they are watching."
                    </div>
                </div>

                <div class="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm">
                    <h3 class="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-3">Alternative Hypothesis ($H_1$)</h3>
                    <p class="text-indigo-800 mb-2"><strong>Concept:</strong> The variables are <em>dependent</em>. A relationship exists.</p>
                    <div class="bg-white p-3 rounded italic text-sm text-indigo-900 border border-indigo-100">
                        "A customer's snack choice is influenced by the movie genre they are watching."
                    </div>
                </div>
            </div>

            <p>The Chi-Square test will help us decide whether we have enough evidence to reject the Null Hypothesis ($H_0$).</p>
        `
    },
    {
        title: "3. The Data: Observed Frequencies ($O$)",
        content: `
            <p class="text-lg mb-4">Over a weekend, you record the purchases of <strong>300 customers</strong>. We organize this raw data into a contingency table. These actual counts are called our <strong>Observed Frequencies ($O$)</strong>.</p>

            <div class="overflow-x-auto mb-6 rounded-lg shadow-sm border border-slate-200">
                <table class="w-full stat-table text-sm md:text-base">
                    <thead>
                        <tr>
                            <th class="bg-slate-100 w-1/4">Genre / Snack</th>
                            <th>Popcorn</th>
                            <th>Nachos</th>
                            <th>Candy</th>
                            <th class="bg-indigo-50 text-indigo-800">Row Totals</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th class="text-left bg-slate-50">Action</th>
                            <td>50</td>
                            <td>30</td>
                            <td>20</td>
                            <td class="bg-indigo-50 font-bold">100</td>
                        </tr>
                        <tr>
                            <th class="text-left bg-slate-50">Comedy</th>
                            <td>40</td>
                            <td>20</td>
                            <td>40</td>
                            <td class="bg-indigo-50 font-bold">100</td>
                        </tr>
                        <tr>
                            <th class="text-left bg-slate-50">Horror</th>
                            <td>30</td>
                            <td>10</td>
                            <td>60</td>
                            <td class="bg-indigo-50 font-bold">100</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th class="text-left bg-indigo-50 text-indigo-800">Column Totals</th>
                            <td class="bg-indigo-50 font-bold">120</td>
                            <td class="bg-indigo-50 font-bold">60</td>
                            <td class="bg-indigo-50 font-bold">120</td>
                            <td class="bg-indigo-600 text-white font-bold text-lg">Grand Total: 300</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <p>Notice that while exactly 100 people saw each genre, their snack choices vary. But is this variation just random chance, or a true pattern?</p>
        `
    },
    {
        title: "4. Calculating Expected Frequencies ($E$)",
        content: `
            <p class="mb-4">If the Null Hypothesis ($H_0$) is true (snack and movie have no connection), what counts would we <em>expect</em> to see in each cell? We calculate this using the marginal totals.</p>

            <div class="bg-slate-100 p-4 rounded-lg mb-6 text-center border border-slate-200">
                <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Expected Frequency Formula</p>
                <p class="text-xl">$$E = \\frac{\\text{Row Total} \\times \\text{Column Total}}{\\text{Grand Total}}$$</p>
            </div>

            <p class="mb-2 font-medium">Example for Action & Popcorn:</p>
            <ul class="list-disc pl-6 mb-6 text-slate-700">
                <li>Row Total (Action) = 100</li>
                <li>Column Total (Popcorn) = 120</li>
                <li>Grand Total = 300</li>
                <li class="mt-2 text-indigo-700 font-bold">$$E = \\frac{100 \\times 120}{300} = 40$$</li>
            </ul>

            <p>So, if genre doesn't matter, we would expect exactly 40 Popcorn sales for Action movies. (But our Observed data was 50!)</p>
        `
    },
    {
        title: "5. The Chi-Square Statistic ($\\chi^2$)",
        content: `
            <p class="mb-4">Now we compare our Observed ($O$) counts to our Expected ($E$) counts. The larger the difference, the more likely the variables are related.</p>

            <div class="bg-indigo-50 p-4 rounded-lg mb-6 text-center border border-indigo-100 shadow-sm">
                <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Chi-Square Formula</p>
                <p class="text-2xl text-indigo-900">$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$</p>
            </div>

            <p class="mb-2 font-medium">Let's calculate just one cell (Action & Popcorn):</p>
            <ol class="list-decimal pl-6 mb-6 text-slate-700 space-y-2">
                <li>Find the difference: $(O - E) = 50 - 40 = 10$</li>
                <li>Square it (removes negatives & penalizes big gaps): $10^2 = 100$</li>
                <li>Divide by Expected (standardizes the gap): $100 / 40 = 2.5$</li>
            </ol>

            <p>We repeat this for all 9 cells in our table and add the results together ($\\sum$). For our movie theater, the total sum is <strong>$\\chi^2 = 35$</strong>.</p>
        `
    },
    {
        title: "6. Degrees of Freedom & The Decision",
        content: `
            <p class="mb-4">Is a $\\chi^2$ score of 35 high enough to say there's a relationship? To know, we calculate the <strong>Degrees of Freedom ($df$)</strong>.</p>

            <div class="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
                <p class="text-center text-lg mb-2">$$df = (\\text{Rows} - 1) \\times (\\text{Columns} - 1)$$</p>
                <p class="text-center text-slate-700">For our table: $df = (3 - 1) \\times (3 - 1) = 2 \\times 2 = 4$</p>
            </div>

            <p class="mb-4">Using a Chi-Square distribution table (with $df=4$ and a standard alpha level of $\\alpha = 0.05$), the critical threshold is <strong>9.49</strong>.</p>

            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                <h3 class="font-bold text-green-800 mb-2">Conclusion</h3>
                <p class="text-green-900">Because our calculated statistic ($35$) is vastly greater than the critical value ($9.49$), we <strong>Reject the Null Hypothesis ($H_0$)</strong>.</p>
                <p class="mt-2 text-green-900 font-medium italic">"We have statistically significant evidence that a moviegoer's snack choice is dependent on the genre of movie they are watching. For instance, horror fans buy significantly more candy!"</p>
            </div>
        `
    },
    {
        title: "7. The Other Variation: Goodness of Fit",
        content: `
            <p class="text-lg mb-4">So far, we've explored the <strong>Test of Independence</strong> (comparing two variables). But there is another widely used variation: the <strong>Chi-Square Goodness of Fit Test</strong>.</p>

            <div class="bg-sky-50 border-l-4 border-sky-500 p-4 mb-6 rounded-r-lg shadow-sm">
                <h3 class="font-bold text-sky-800 mb-2">What is it?</h3>
                <p class="text-sky-900">It tests whether a <em>single</em> categorical variable follows a hypothesized or expected distribution.</p>
                <ul class="list-disc pl-5 mt-2 text-sky-800 text-sm">
                    <li><strong>Example 1:</strong> "Are a 6-sided die's rolls truly random?" (Expected: 1/6th chance for each side).</li>
                    <li><strong>Example 2:</strong> "Do the colors of M&Ms in a bag match the factory's published percentages?"</li>
                </ul>
            </div>

            <p class="mb-4">The core Chi-Square statistic formula ($\\chi^2 = \\sum \\frac{(O - E)^2}{E}$) remains <strong>exactly the same!</strong> However, the way we calculate Expected Frequencies ($E$) and Degrees of Freedom ($df$) changes:</p>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                    <h4 class="font-bold text-slate-700 border-b pb-2 mb-3">Expected Frequencies ($E$)</h4>
                    <p class="text-sm text-slate-600 mb-2 text-left">Calculated using the total sample size ($n$) and the theoretical probability/proportion ($p$) for that specific category.</p>
                    <div class="text-lg font-bold text-indigo-700">$$E = n \\times p$$</div>
                </div>
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                    <h4 class="font-bold text-slate-700 border-b pb-2 mb-3">Degrees of Freedom ($df$)</h4>
                    <p class="text-sm text-slate-600 mb-2 text-left">Based solely on the total number of categories ($k$), rather than rows and columns.</p>
                    <div class="text-lg font-bold text-indigo-700">$$df = k - 1$$</div>
                </div>
            </div>
        `
    },
    {
        title: "8. Visualizing the Distribution",
        content: `
            <p class="mb-4 text-slate-600">The critical threshold we used in the previous step relies on the Chi-Square Distribution. Observe how the probability density function changes dynamically as the Degrees of Freedom ($k$) increase.</p>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-4">
                <div class="flex justify-between items-end mb-4">
                    <label for="df-slider" class="block text-slate-700 font-semibold text-lg">
                        Degrees of Freedom (<span class="italic font-serif">k</span>)
                    </label>
                    <span id="df-value" class="text-3xl font-bold text-indigo-600 tabular-nums">5</span>
                </div>
                <input
                    type="range"
                    id="df-slider"
                    min="1" max="50" value="5" step="1"
                    class="w-full mb-2 cursor-pointer accent-indigo-600"
                >
                <div class="flex justify-between text-xs text-slate-400 font-medium px-1 mb-6">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                </div>

                <!-- Canvas Wrapper for Chart -->
                <div class="relative w-full h-[300px] md:h-[400px]">
                    <canvas id="chiSquareChart"></canvas>
                </div>
            </div>
            <p class="text-sm text-slate-500 italic mt-2">Notice how the graph starts heavily right-skewed and becomes more symmetrical (normal-like) as $k$ increases.</p>
        `
    },
    {
        title: "9. Recap & Master Formulas",
        content: `
            <p class="text-lg mb-6">You've successfully walked through the Chi-Square Test! Here is your quick reference guide to the formulas for both test variations.</p>

            <div class="space-y-4">
                <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-5 shadow-sm">
                    <h4 class="font-bold text-indigo-900 border-b border-indigo-200 pb-2 mb-3">1. The Universal Chi-Square Statistic</h4>
                    <p class="text-sm text-indigo-700 mb-2">The core formula that quantifies the difference between Observed ($O$) and Expected ($E$) data. Used in <strong>both</strong> tests.</p>
                    <div class="overflow-x-auto text-indigo-900">
                        $$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <!-- Test of Independence column -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 class="font-bold text-slate-800 border-b pb-2 mb-3 text-center">Test of Independence</h4>
                        <div class="mb-4">
                            <p class="text-sm font-semibold text-slate-600">Expected Frequency ($E$)</p>
                            <div class="overflow-x-auto text-sm">
                                $$E = \\frac{\\text{Row Total} \\times \\text{Col Total}}{\\text{Grand Total}}$$
                            </div>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-slate-600">Degrees of Freedom ($df$)</p>
                            <div class="overflow-x-auto text-sm">
                                $$df = (r - 1)(c - 1)$$
                            </div>
                            <p class="text-xs text-slate-400 mt-1">$r$ = rows, $c$ = columns</p>
                        </div>
                    </div>

                    <!-- Goodness of Fit column -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 class="font-bold text-slate-800 border-b pb-2 mb-3 text-center">Goodness of Fit</h4>
                        <div class="mb-4">
                            <p class="text-sm font-semibold text-slate-600">Expected Frequency ($E$)</p>
                            <div class="overflow-x-auto text-sm">
                                $$E = n \\times p$$
                            </div>
                            <p class="text-xs text-slate-400 mt-1">$n$ = total sample, $p$ = theoretical proportion</p>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-slate-600">Degrees of Freedom ($df$)</p>
                            <div class="overflow-x-auto text-sm">
                                $$df = k - 1$$
                            </div>
                            <p class="text-xs text-slate-400 mt-1">$k$ = number of categories</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
];

let currentStep = 0;
let chartInstance = null; // Store chart globally so we can destroy it if changing steps

// DOM Elements
const stepContainer = document.getElementById('step-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentStepDisplay = document.getElementById('current-step-display');
const totalStepsDisplay = document.getElementById('total-steps-display');
const progressBar = document.getElementById('progress-bar');
const stepIndicators = document.getElementById('step-indicators');

// Initialize App
function init() {
    totalStepsDisplay.textContent = steps.length;
    setupIndicators();
    renderStep();
}

function setupIndicators() {
    stepIndicators.innerHTML = '';
    steps.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `flex-1 text-center border-t-2 pt-1 transition-colors duration-300 ${index === 0 ? 'border-amber-400 text-amber-200' : 'border-indigo-800 text-indigo-800/50'}`;
        indicator.id = `indicator-${index}`;
        indicator.textContent = `S${index + 1}`;
        stepIndicators.appendChild(indicator);
    });
}

function updateIndicators() {
    steps.forEach((_, index) => {
        const indicator = document.getElementById(`indicator-${index}`);
        if (index <= currentStep) {
            indicator.className = 'flex-1 text-center border-t-2 pt-1 transition-colors duration-300 border-amber-400 text-amber-200';
        } else {
            indicator.className = 'flex-1 text-center border-t-2 pt-1 transition-colors duration-300 border-indigo-800 text-indigo-800/50';
        }
    });
}

// Initialize Chi-Square Dynamic Chart when Step 7 is rendered
function initChiSquareChart() {
    const canvas = document.getElementById('chiSquareChart');
    const slider = document.getElementById('df-slider');
    const dfDisplay = document.getElementById('df-value');

    if (!canvas || !slider) return;

    const MAX_X = 60;
    const STEP = 0.2;
    const labels = [];
    for (let i = 0; i <= MAX_X; i += STEP) {
        labels.push(parseFloat(i.toFixed(1)));
    }

    let initialK = parseInt(slider.value, 10);
    let initialData = labels.map(x => chiSquarePDF(x, initialK));

    const ctx = canvas.getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probability Density',
                data: initialData,
                borderColor: '#4f46e5',
                backgroundColor: gradient,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { size: 14, family: 'sans-serif' },
                    bodyFont: { size: 14, family: 'sans-serif' },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: (items) => `x = ${items[0].label}`,
                        label: (item) => `f(x) = ${item.raw ? item.raw.toFixed(5) : 'Infinity'}`
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'x (Value)', color: '#64748b' },
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { color: '#64748b', maxTicksLimit: 15 }
                },
                y: {
                    title: { display: true, text: 'Density f(x)', color: '#64748b' },
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { color: '#64748b' },
                    min: 0,
                    suggestedMax: 0.25
                }
            }
        }
    });

    function updateDistribution() {
        const k = parseInt(slider.value, 10);
        dfDisplay.textContent = k;

        const newData = labels.map(x => chiSquarePDF(x, k));

        if (k <= 2) {
            chartInstance.options.scales.y.suggestedMax = 0.5;
        } else if (k < 10) {
            chartInstance.options.scales.y.suggestedMax = 0.25;
        } else {
            chartInstance.options.scales.y.suggestedMax = 0.15;
        }

        chartInstance.data.datasets[0].data = newData;
        chartInstance.update();
    }

    slider.addEventListener('input', updateDistribution);
}

async function renderStep() {
    // Clean up existing chart to prevent memory leaks or "canvas already in use" errors
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const step = steps[currentStep];

    // Animation reset
    stepContainer.classList.remove('fade-enter-active');

    // Small timeout to allow CSS to reset for animation
    setTimeout(async () => {
        // Build HTML
        const html = `
            <h2 class="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-100">${step.title}</h2>
            <div class="prose max-w-none text-slate-600">
                ${step.content}
            </div>
        `;

        stepContainer.innerHTML = html;
        stepContainer.classList.add('fade-enter-active');

        // Update MathJax (Wait for Typesetting to complete)
        if (window.MathJax && window.MathJax.typesetPromise) {
            try {
                await window.MathJax.typesetPromise([stepContainer]);
            } catch (err) {
                console.error("MathJax typesetting failed: ", err);
            }
        }

        // If we are on the visualization step (index 7, which is Step 8), initialize the chart
        if (currentStep === 7) {
            initChiSquareChart();
        }

        // Update UI Controls
        currentStepDisplay.textContent = currentStep + 1;
        prevBtn.disabled = currentStep === 0;

        if (currentStep === steps.length - 1) {
            nextBtn.innerHTML = `Finish <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`;
            nextBtn.classList.replace('bg-indigo-600', 'bg-green-600');
            nextBtn.classList.replace('hover:bg-indigo-700', 'hover:bg-green-700');
            nextBtn.disabled = true; // Optionally disable or loop back
        } else {
            nextBtn.innerHTML = `Next <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>`;
            nextBtn.classList.replace('bg-green-600', 'bg-indigo-600');
            nextBtn.classList.replace('hover:bg-green-700', 'hover:bg-indigo-700');
            nextBtn.disabled = false;
        }

        // Update Progress bar
        const progressPercentage = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        updateIndicators();

    }, 50); // 50ms delay for smoother visual transition
}

// Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        renderStep();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
    }
});

// Start
window.addEventListener('DOMContentLoaded', init);