// <!-- Consolidated JavaScript for Interactivity and Chart -->
let currentStep = 1;
const totalSteps = 8; // Updated to 8 steps
let chartInitialized = false; // Prevents chart rendering issues on hidden tabs

function updateUI() {
    // Update the step visibility
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        if (i === currentStep) {
            stepElement.classList.remove('hidden');
            // Small hack to re-trigger the fade-in animation
            stepElement.classList.remove('fade-in');
            void stepElement.offsetWidth; // trigger reflow
            stepElement.classList.add('fade-in');
        } else {
            stepElement.classList.add('hidden');
        }
    }

    // Update Progress Bar & Text
    const progressPercentage = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('step-indicator').innerText = `Step ${currentStep} of ${totalSteps}`;

    // Update Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentStep === 1;

    if (currentStep === totalSteps) {
        nextBtn.innerText = "Finish";
        nextBtn.disabled = true;

        // Ensure MathJax renders formulas if they were hidden on load
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise().catch((err) => console.log(err.message));
        }
    } else {
        nextBtn.innerText = "Next Step →";
        nextBtn.disabled = false;
    }

    // Initialize Chart.js ONLY when Step 6 is shown so canvas has correct dimensions
    if (currentStep === 6 && !chartInitialized) {
        initChart();
        chartInitialized = true;
    }
}

function changeStep(direction) {
    currentStep += direction;

    // Boundary checks
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    updateUI();
}

// ==========================================
// Chart.js and jStat Logic for Step 6
// ==========================================
function initChart() {
    const xValues = [];
    for (let i = -4; i <= 4; i += 0.1) {
        xValues.push(parseFloat(i.toFixed(1)));
    }

    // Standard Normal (Always the same)
    const normalValues = xValues.map(x => jStat.normal.pdf(x, 0, 1));

    // Function to generate T distribution based on df
    function calculateTDistribution(df) {
        return xValues.map(x => jStat.studentt.pdf(x, df));
    }

    // Default to 60 to match the tutorial example
    let currentDf = 60;
    let tValues = calculateTDistribution(currentDf);

    const ctx = document.getElementById('distributionChart').getContext('2d');
    const distributionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Standard Normal (Infinite df)',
                    data: normalValues,
                    borderColor: '#94a3b8', // slate-400
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4
                },
                {
                    label: `T-Distribution (df = ${currentDf})`,
                    data: tValues,
                    borderColor: '#2563eb', // blue-600
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    borderWidth: 3,
                    fill: true,
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    title: { display: true, text: 'T-Statistic / Z-Score', font: { weight: 'bold' } },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: 'Probability Density', font: { weight: 'bold' } },
                    min: 0,
                    max: 0.45
                }
            },
            plugins: {
                tooltip: { enabled: false },
                legend: { position: 'top' }
            }
        }
    });

    // Slider Event Listener
    const slider = document.getElementById('df-slider');
    const dfDisplay = document.getElementById('df-display');
    const insightText = document.getElementById('df-insight');

    slider.addEventListener('input', function (e) {
        const df = parseInt(e.target.value);
        dfDisplay.textContent = df;

        // Dynamic UI Feedback
        if (df === 1) {
            insightText.textContent = "Extreme fat tails! Low confidence.";
            insightText.className = "text-xs sm:text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 shadow-sm text-center";
        } else if (df < 10) {
            insightText.textContent = "Notice the fatter tails and lower peak.";
            insightText.className = "text-xs sm:text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm text-center";
        } else if (df >= 30 && df < 80) {
            insightText.textContent = "df ≥ 30: Almost identical to Normal curve!";
            insightText.className = "text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-sm text-center";
        } else if (df >= 80) {
            insightText.textContent = "Microscopic differences now.";
            insightText.className = "text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-sm text-center";
        }

        // Update Chart
        distributionChart.data.datasets[1].data = calculateTDistribution(df);
        distributionChart.data.datasets[1].label = `T-Distribution (df = ${df})`;
        distributionChart.update('none');
    });
}

// Initialize UI on load
document.addEventListener('DOMContentLoaded', updateUI);