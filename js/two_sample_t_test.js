// <!-- JavaScript for Interactivity -->
let currentStep = 1;
const totalSteps = 7;

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
    const progressPercentage = ((currentStep) / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('step-indicator').innerText = `Step ${currentStep} of ${totalSteps}`;

    // Update Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentStep === 1;

    if (currentStep === totalSteps) {
        nextBtn.innerText = "Finish";
        nextBtn.disabled = true; // Or you could make it redirect somewhere

        // Ensure MathJax renders formulas if they were hidden on load
        if (window.MathJax) {
            MathJax.typesetPromise().catch((err) => console.log(err.message));
        }
    } else {
        nextBtn.innerText = "Next Step →";
        nextBtn.disabled = false;
    }
}

function changeStep(direction) {
    currentStep += direction;

    // Boundary checks
    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    updateUI();
}

// Initialize UI on load
updateUI();