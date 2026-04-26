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
                <p class="text-xl">$$ E = \\frac{\\text{Row Total} \\times \\text{Column Total}}{\\text{Grand Total}} $$</p>
            </div>

            <p class="mb-2 font-medium">Example for Action & Popcorn:</p>
            <ul class="list-disc pl-6 mb-6 text-slate-700">
                <li>Row Total (Action) = 100</li>
                <li>Column Total (Popcorn) = 120</li>
                <li>Grand Total = 300</li>
                <li class="mt-2 text-indigo-700 font-bold">$$ E = \\frac{100 \\times 120}{300} = 40 $$</li>
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
                <p class="text-2xl text-indigo-900">$$ \\chi^2 = \\sum \\frac{(O - E)^2}{E} $$</p>
            </div>

            <p class="mb-2 font-medium">Let's calculate just one cell (Action & Popcorn):</p>
            <ol class="list-decimal pl-6 mb-6 text-slate-700 space-y-2">
                <li>Find the difference: $(O - E) = 50 - 40 = 10$</li>
                <li>Square it (removes negatives & penalizes big gaps): $10^2 = 100$</li>
                <li>Divide by Expected (standardizes the gap): $100 / 40 = 2.5$</li>
            </ol>

            <p>We repeat this for all 9 cells in our table and add the results together ($\\sum$). For our movie theater, the total sum is <strong>$\\chi^2 = 33.33$</strong>.</p>
        `
    },
    {
        title: "6. Degrees of Freedom & The Decision",
        content: `
            <p class="mb-4">Is a $\\chi^2$ score of 33.33 high enough to say there's a relationship? To know, we calculate the <strong>Degrees of Freedom ($df$)</strong>.</p>

            <div class="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
                <p class="text-center text-lg mb-2">$$ df = (\\text{Rows} - 1) \\times (\\text{Columns} - 1) $$</p>
                <p class="text-center text-slate-700">For our table: $df = (3 - 1) \\times (3 - 1) = 2 \\times 2 = 4$</p>
            </div>

            <p class="mb-4">Using a Chi-Square distribution table (with $df=4$ and a standard alpha level of $\\alpha = 0.05$), the critical threshold is <strong>9.49</strong>.</p>

            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                <h3 class="font-bold text-green-800 mb-2">Conclusion</h3>
                <p class="text-green-900">Because our calculated statistic ($33.33$) is vastly greater than the critical value ($9.49$), we <strong>Reject the Null Hypothesis ($H_0$)</strong>.</p>
                <p class="mt-2 text-green-900 font-medium italic">"We have statistically significant evidence that a moviegoer's snack choice is dependent on the genre of movie they are watching. For instance, horror fans buy significantly more candy!"</p>
            </div>
        `
    },
    {
        title: "7. Recap & Master Formulas",
        content: `
            <p class="text-lg mb-6">You've successfully walked through a Chi-Square Test of Independence! Here is your quick reference guide to all the formulas.</p>

            <div class="space-y-4">
                <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 class="font-bold text-slate-800 border-b pb-2 mb-3">1. Expected Frequency Formula</h4>
                    <p class="text-sm text-slate-500 mb-2">Used to calculate what values we expect if variables are completely independent.</p>
                    <div class="overflow-x-auto">
                        $$ E = \\frac{\\text{Row Total} \\times \\text{Column Total}}{\\text{Grand Total}} $$
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 class="font-bold text-slate-800 border-b pb-2 mb-3">2. Degrees of Freedom ($df$)</h4>
                    <p class="text-sm text-slate-500 mb-2">Determines which Chi-Square distribution curve to use based on table size.</p>
                    <div class="overflow-x-auto">
                        $$ df = (r - 1)(c - 1) $$
                    </div>
                    <p class="text-xs text-slate-400 mt-1">Where $r$ = number of rows, $c$ = number of columns.</p>
                </div>

                <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-5 shadow-sm">
                    <h4 class="font-bold text-indigo-900 border-b border-indigo-200 pb-2 mb-3">3. The Chi-Square Statistic</h4>
                    <p class="text-sm text-indigo-700 mb-2">The core formula that quantifies the difference between Observed ($O$) and Expected ($E$) data.</p>
                    <div class="overflow-x-auto text-indigo-900">
                        $$ \\chi^2 = \\sum \\frac{(O - E)^2}{E} $$
                    </div>
                </div>
            </div>
        `
    }
];

let currentStep = 0;

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
    // Only show labels on larger screens if we have space, otherwise just dots
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

async function renderStep() {
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