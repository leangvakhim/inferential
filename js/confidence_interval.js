// --- State Management & Setup ---
let currentStep = 0;
let animationFrameId = null;
let activeAnimation = null;
let interactiveState = { confidence: 95, sampleSize: 100 }; // For Step 5

const canvas = document.getElementById('vis-canvas');
const ctx = canvas.getContext('2d');
const htmlOverlay = document.getElementById('vis-html-overlay');

// --- Math / Drawing Utilities ---
// Helper to handle responsive canvas resolution
function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    return { w: rect.width, h: rect.height };
}

// Simple animation loop wrapper
function animate(duration, renderFn, onComplete = null) {
    if (activeAnimation) cancelAnimationFrame(activeAnimation);
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        let progress = Math.min((timestamp - start) / duration, 1);
        // Easing function (easeOutQuart)
        let ease = 1 - Math.pow(1 - progress, 4);
        renderFn(ease, progress);
        if (progress < 1) {
            activeAnimation = requestAnimationFrame(step);
        } else if (onComplete) {
            onComplete();
        }
    }
    activeAnimation = requestAnimationFrame(step);
}

function drawAxis(ctx, w, h, yPos) {
    ctx.beginPath();
    ctx.moveTo(w * 0.1, yPos);
    ctx.lineTo(w * 0.9, yPos);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(w * 0.9 - 10, yPos - 5);
    ctx.lineTo(w * 0.9, yPos);
    ctx.lineTo(w * 0.9 - 10, yPos + 5);
    ctx.stroke();
}

// --- Step Definitions ---
const stepsData = [
    {
        title: "1. The Dilemma: Population vs. Sample",
        desc: "In inferential statistics, we want to know a fact about an entire, massive group (the <strong>Population</strong>). However, measuring everyone is usually too expensive, time-consuming, or physically impossible. <br><br>Instead, we pull out a smaller, manageable subset (the <strong>Sample</strong>) and measure them to make a highly educated guess about the whole population.",
        example: "<strong>Real-World Example:</strong> Imagine trying to find the average height of every single adult in your country (Population). You can't measure millions of people! So, you randomly select 100 people (Sample) and measure their heights instead.",
        init: (w, h) => {
            // Generate random points for population
            let points = [];
            for (let i = 0; i < 250; i++) {
                // Random points within a circle
                let r = (w * 0.15) * Math.sqrt(Math.random());
                let theta = Math.random() * 2 * Math.PI;
                points.push({
                    ox: w * 0.3 + r * Math.cos(theta),
                    oy: h / 2 + r * Math.sin(theta),
                    isSample: i < 25 // Pick 25 points as the sample
                });
            }
            return { points };
        },
        render: (w, h, state, progress) => {
            ctx.clearRect(0, 0, w, h);

            // Draw Population Circle Area
            ctx.beginPath();
            ctx.arc(w * 0.3, h / 2, w * 0.18, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
            ctx.fill();
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.stroke(); ctx.setLineDash([]);

            ctx.fillStyle = '#1e40af'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('Population (All Adults)', w * 0.3, h / 2 - w * 0.2);

            // Draw Sample Circle Area
            let sampleCenter = { x: w * 0.75, y: h / 2 };
            ctx.beginPath();
            ctx.arc(sampleCenter.x, sampleCenter.y, w * 0.1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
            ctx.fill();
            ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.stroke(); ctx.setLineDash([]);

            ctx.fillStyle = '#b45309';
            ctx.fillText('Sample (100 Adults)', sampleCenter.x, h / 2 - w * 0.13);

            // Draw Points
            state.points.forEach(p => {
                let x = p.ox;
                let y = p.oy;

                if (p.isSample) {
                    // Target position inside sample circle
                    let targetX = sampleCenter.x + (p.ox - w * 0.3) * 0.6;
                    let targetY = sampleCenter.y + (p.oy - h / 2) * 0.6;
                    // Interpolate based on progress
                    x = p.ox + (targetX - p.ox) * progress;
                    y = p.oy + (targetY - p.oy) * progress;
                    ctx.fillStyle = '#f59e0b'; // Orange
                } else {
                    ctx.fillStyle = '#3b82f6'; // Blue
                }

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },
    {
        title: "2. The Point Estimate",
        desc: "Once we measure our sample, we calculate its average (mean). This single number is called our <strong>Point Estimate</strong>.<br><br>It is our absolute best guess for the true population average. But it's just a single point—a dart thrown at a board. It is almost certainly not the <em>exact</em> true average of the whole population.",
        example: "<strong>Real-World Example:</strong> You measure your 100 people and find their average height is exactly 170 cm. Your Point Estimate is 170 cm. But is the true average of the <em>entire country</em> exactly 170.0000 cm? Probably not.",
        init: () => ({}),
        render: (w, h, state, progress) => {
            ctx.clearRect(0, 0, w, h);
            let yPos = h / 2;
            let xCenter = w / 2;

            drawAxis(ctx, w, h, yPos);

            // Dropping Point
            let startY = yPos - 150;
            let currentY = startY + (yPos - startY) * progress;

            // Draw True mean marker (unknown)
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.font = 'italic 14px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("True Population Mean (?)", xCenter + 30, yPos + 40);

            if (progress > 0) {
                ctx.beginPath();
                ctx.arc(xCenter, currentY, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#3b82f6';
                ctx.fill();

                // Draw line down
                ctx.beginPath();
                ctx.moveTo(xCenter, startY);
                ctx.lineTo(xCenter, currentY);
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.stroke();

                if (progress === 1) {
                    ctx.fillStyle = '#1e40af';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText("Point Estimate: 170 cm", xCenter, yPos - 20);
                    ctx.fillText("x̄", xCenter, yPos - 40);
                }
            }
        }
    },
    {
        title: "3. Adding the Margin of Error",
        desc: "Because we know our Point Estimate isn't perfectly accurate, we need to provide a 'cushion' or 'net' around it to account for sample variance. This cushion is called the <strong>Margin of Error (MoE)</strong>.<br><br>By adding and subtracting the MoE from our Point Estimate, we create a range. This range is the <strong>Confidence Interval</strong>.",
        example: "<strong>Real-World Example:</strong> Based on the variation in your sample, you calculate a Margin of Error of ± 3 cm. You apply this to your estimate: 170 cm ± 3 cm. Your Confidence Interval is now 167 cm to 173 cm. We now estimate the true population height is somewhere within this net.",
        init: () => ({}),
        render: (w, h, state, progress) => {
            ctx.clearRect(0, 0, w, h);
            let yPos = h / 2;
            let xCenter = w / 2;
            let intervalWidth = (w * 0.4) * progress; // Expands outwards

            drawAxis(ctx, w, h, yPos);

            // Interval Bar
            if (progress > 0) {
                ctx.beginPath();
                ctx.moveTo(xCenter - intervalWidth / 2, yPos);
                ctx.lineTo(xCenter + intervalWidth / 2, yPos);
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; // Light blue thick line
                ctx.lineWidth = 14;
                ctx.stroke();
                ctx.lineWidth = 1;
            }

            // Center Point
            ctx.beginPath();
            ctx.arc(xCenter, yPos, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
            ctx.fillStyle = '#1e40af'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("170", xCenter, yPos + 25);

            if (progress > 0.5) {
                let textAlpha = (progress - 0.5) * 2;
                ctx.globalAlpha = textAlpha;

                // Left & Right bounds
                ctx.fillStyle = '#0f172a';
                ctx.beginPath(); ctx.arc(xCenter - intervalWidth / 2, yPos, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillText("167", xCenter - intervalWidth / 2, yPos + 25);

                ctx.beginPath(); ctx.arc(xCenter + intervalWidth / 2, yPos, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillText("173", xCenter + intervalWidth / 2, yPos + 25);

                // Margin of Error Bracket (Top)
                let bracketY = yPos - 20;
                ctx.beginPath();
                ctx.moveTo(xCenter, bracketY + 5);
                ctx.lineTo(xCenter, bracketY - 5);
                ctx.lineTo(xCenter + intervalWidth / 2, bracketY - 5);
                ctx.lineTo(xCenter + intervalWidth / 2, bracketY + 5);
                ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.stroke();

                ctx.fillStyle = '#475569';
                ctx.fillText("+ Margin of Error (3cm)", xCenter + intervalWidth / 4, bracketY - 10);

                ctx.globalAlpha = 1.0;
            }
        }
    },
    {
        title: "4. What does '95% Confident' mean?",
        desc: "This is the most misunderstood part! A 95% Confidence Level <strong>DOES NOT</strong> mean there is a 95% chance the true mean is in your specific interval.<br><br>It means the <em>method</em> is 95% reliable. If you took 100 completely different samples and created 100 different intervals, about 95 of them would successfully 'catch' the true population mean, and 5 would miss it completely.",
        example: "<strong>Real-World Example:</strong> Think of it like playing ring toss. The peg is the true population average. You throw 20 rings (take 20 samples). You are '95% confident' in your throwing skill. This means 19 out of your 20 rings (95%) will loop around the peg, but 1 ring (5%) will inevitably miss due to bad luck (a skewed sample).",
        init: (w, h) => {
            // Generate 20 intervals. 19 hit the center, 1 misses.
            let intervals = [];
            for (let i = 0; i < 20; i++) {
                let isMiss = (i === 14); // Force the 15th line to be the miss
                let centerOffset = isMiss ? (w * 0.15) * (Math.random() > 0.5 ? 1 : -1) : (Math.random() - 0.5) * (w * 0.15);
                if (isMiss && centerOffset > 0) centerOffset += w * 0.1; // Ensure clear miss
                if (isMiss && centerOffset < 0) centerOffset -= w * 0.1;

                intervals.push({
                    y: (h * 0.1) + i * ((h * 0.8) / 20),
                    cx: (w / 2) + centerOffset,
                    width: w * 0.15,
                    isHit: !isMiss,
                    delay: i * 0.05 // Stagger animation
                });
            }
            return { intervals };
        },
        render: (w, h, state, progress) => {
            ctx.clearRect(0, 0, w, h);
            let trueMeanX = w / 2;

            // Draw True Mean Line (The "Peg")
            ctx.beginPath();
            ctx.moveTo(trueMeanX, 0);
            ctx.lineTo(trueMeanX, h);
            ctx.strokeStyle = '#94a3b8'; // Slate 400
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#64748b'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("True Population Mean (μ)", trueMeanX, 20);

            // Draw intervals (The "Rings")
            state.intervals.forEach((inv) => {
                if (progress > inv.delay) {
                    let lineProgress = Math.min((progress - inv.delay) * 5, 1);
                    let currentWidth = inv.width * lineProgress;

                    ctx.beginPath();
                    ctx.moveTo(inv.cx - currentWidth / 2, inv.y);
                    ctx.lineTo(inv.cx + currentWidth / 2, inv.y);

                    // Color logic: Green if hitting, Red if missing
                    ctx.strokeStyle = inv.isHit ? '#22c55e' : '#ef4444';
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // Draw point estimate dot
                    ctx.beginPath();
                    ctx.arc(inv.cx, inv.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#000';
                    ctx.fill();
                }
            });
        }
    },
    {
        title: "5. Adjusting the Interval (Interactive)",
        desc: "Two main factors control how wide (imprecise) or narrow (precise) your interval is:<br><br>1. <strong>Confidence Level (Z-score):</strong> To be <em>more</em> confident (e.g., 99% vs 90%), you need a wider net to ensure you don't miss.<br>2. <strong>Sample Size (n):</strong> Taking a <em>larger</em> sample gives you better data, allowing you to have a narrower, more precise interval.",
        example: "<strong>Real-World Example:</strong> Play with the sliders! Notice how increasing Sample Size shrinks the interval (precision goes up), while demanding higher Confidence makes the interval wider (playing it safe).",
        init: (w, h) => {
            // Setup HTML UI over the canvas
            htmlOverlay.classList.remove('hidden');
            htmlOverlay.classList.add('flex');
            htmlOverlay.style.background = 'transparent'; // Let canvas show underneath
            htmlOverlay.innerHTML = `
                <div class="absolute bottom-6 w-full max-w-sm bg-white/90 p-4 rounded-xl shadow-lg border border-slate-200 backdrop-blur-sm transition-all">
                    <div class="mb-4">
                        <label class="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                            <span>Confidence Level</span>
                            <span id="conf-val" class="text-blue-600">95%</span>
                        </label>
                        <input type="range" id="slider-conf" min="80" max="99" value="95" class="w-full">
                        <div class="flex justify-between text-xs text-slate-400 mt-1"><span>80%</span><span>99%</span></div>
                    </div>
                    <div>
                        <label class="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                            <span>Sample Size (n)</span>
                            <span id="n-val" class="text-blue-600">100</span>
                        </label>
                        <input type="range" id="slider-n" min="10" max="1000" value="100" class="w-full">
                        <div class="flex justify-between text-xs text-slate-400 mt-1"><span>10</span><span>1000</span></div>
                    </div>
                </div>
            `;

            // Add listeners to update state and trigger instant canvas re-render
            document.getElementById('slider-conf').addEventListener('input', (e) => {
                interactiveState.confidence = parseInt(e.target.value);
                document.getElementById('conf-val').innerText = interactiveState.confidence + '%';
                drawStep5(w, h);
            });
            document.getElementById('slider-n').addEventListener('input', (e) => {
                interactiveState.sampleSize = parseInt(e.target.value);
                document.getElementById('n-val').innerText = interactiveState.sampleSize;
                drawStep5(w, h);
            });

            return {};
        },
        render: (w, h) => {
            // Called by init and sliders
            drawStep5(w, h);
        }
    },
    {
        title: "6. Recap & The Math Formulas",
        desc: "We've seen that a Confidence Interval is simply a <strong>Point Estimate ± Margin of Error</strong>. <br><br>The Margin of Error itself is calculated by multiplying a 'Reliability Factor' (based on your chosen Confidence Level) by the 'Standard Error' (based on your Sample Size and variance).",
        example: "<strong>Summary:</strong> Below are the actual mathematical formulas used to calculate these intervals depending on the type of data you have. Notice how they all follow the exact same structure!",
        init: (w, h) => {
            ctx.clearRect(0, 0, w, h);
            htmlOverlay.classList.remove('hidden');
            htmlOverlay.classList.add('flex');
            htmlOverlay.style.background = '#ffffff'; // Solid background to hide canvas

            // Injecting raw HTML formulas using our custom CSS classes (No external Math libs required)
            htmlOverlay.innerHTML = `
                <div class="w-full max-w-lg fade-in space-y-6">

                    <!-- Master Formula -->
                    <div class="bg-blue-600 text-white rounded-xl p-5 text-center shadow-lg my-4">
                        <h3 class="text-sm uppercase tracking-wider font-semibold text-blue-200 mb-2">The Golden Rule</h3>
                        <div class="text-xl md:text-2xl font-bold">
                            Estimate &plusmn; (Critical Value &times; Standard Error)
                        </div>
                    </div>

                    <!-- Mean (Known Sigma) -->
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h3 class="font-bold text-slate-800 mb-2">1. Mean (Population Standard Deviation <span class="italic">&sigma;</span> known)</h3>
                        <p class="text-sm text-slate-500 mb-4">Uses the Z-distribution.</p>
                        <div class="text-center text-2xl font-serif text-slate-800 flex items-center justify-center">
                            <span class="italic">x&#772;</span> &plusmn; <span class="italic">z</span><sup>*</sup>
                            <span class="mx-2">&times;</span>
                            <div class="math-fraction">
                                <span>&sigma;</span>
                                <span>&radic;<span class="italic">n</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Mean (Unknown Sigma) -->
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h3 class="font-bold text-slate-800 mb-2">2. Mean (Unknown <span class="italic">&sigma;</span>, using sample <span class="italic">s</span>)</h3>
                        <p class="text-sm text-slate-500 mb-4">Most common. Uses the t-distribution.</p>
                        <div class="text-center text-2xl font-serif text-slate-800 flex items-center justify-center">
                            <span class="italic">x&#772;</span> &plusmn; <span class="italic">t</span><sup>*</sup><sub><span class="text-xs">n-1</span></sub>
                            <span class="mx-2">&times;</span>
                            <div class="math-fraction">
                                <span>s</span>
                                <span>&radic;<span class="italic">n</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Proportions -->
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <h3 class="font-bold text-slate-800 mb-2">3. Proportions (Percentages)</h3>
                        <p class="text-sm text-slate-500 mb-4">For categorical data (e.g., % of voters).</p>
                        <div class="text-center text-2xl font-serif text-slate-800 flex items-center justify-center">
                            <span class="italic">p&#770;</span> &plusmn; <span class="italic">z</span><sup>*</sup>
                            <span class="mx-2">&times;</span>
                            <span class="text-3xl font-light align-middle translate-y-[-2px]">&radic;</span>
                            <div class="math-fraction border-t-0">
                                <span class="border-b border-black pb-1"><span class="italic">p&#770;</span>(1 - <span class="italic">p&#770;</span>)</span>
                                <span class="pt-1"><span class="italic">n</span></span>
                            </div>
                        </div>
                    </div>

                </div>
            `;
            return {};
        },
        render: () => { } // Managed by HTML overlay
    }
];

// --- Custom Drawing logic for Interactive Step 5 ---
function drawStep5(w, h) {
    ctx.clearRect(0, 0, w, h);
    let yPos = h / 2 - 40;
    let xCenter = w / 2;

    drawAxis(ctx, w, h, yPos);

    // Calculate width based on sliders
    // Map confidence (80-99) to a rough Z-score equivalent for visuals (1.28 to 2.58)
    let zScore = 1.28 + ((interactiveState.confidence - 80) / 19) * (2.58 - 1.28);
    // standard error = 1 / sqrt(n). Scale up for visual pixels.
    let standardError = 1500 / Math.sqrt(interactiveState.sampleSize);

    let moe = zScore * standardError;
    let visualWidth = moe * 2; // Total interval width

    // Draw Normal Curve lightly in background
    ctx.beginPath();
    let curveWidth = standardError * 3;
    for (let x = xCenter - curveWidth; x <= xCenter + curveWidth; x += 2) {
        let diff = (x - xCenter) / standardError;
        let curveY = yPos - 120 * Math.exp(-0.5 * diff * diff);
        if (x === xCenter - curveWidth) ctx.moveTo(x, yPos);
        ctx.lineTo(x, curveY);
    }
    ctx.lineTo(xCenter + curveWidth, yPos);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.fill();

    // Interval Bar
    ctx.beginPath();
    ctx.moveTo(xCenter - visualWidth / 2, yPos);
    ctx.lineTo(xCenter + visualWidth / 2, yPos);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.lineWidth = 1;

    // Center Point
    ctx.beginPath(); ctx.arc(xCenter, yPos, 6, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(xCenter, yPos, 6, 0, Math.PI * 2); ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 3; ctx.stroke();
    ctx.lineWidth = 1;

    // Labels
    ctx.fillStyle = '#1e40af'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText("Point Estimate", xCenter, yPos + 30);

    ctx.fillStyle = '#64748b'; ctx.font = '14px sans-serif';
    ctx.fillText(`Width based on n=${interactiveState.sampleSize}, Conf=${interactiveState.confidence}%`, xCenter, yPos - 140);
}

// --- UI Controller ---
function updateUI() {
    const stepData = stepsData[currentStep];

    // Update Text Panel with simple fade animation by re-inserting
    const textContainer = document.getElementById('text-container');
    textContainer.classList.remove('fade-in');
    void textContainer.offsetWidth; // Trigger reflow

    document.getElementById('step-title').innerHTML = stepData.title;
    document.getElementById('step-desc').innerHTML = stepData.desc;
    document.getElementById('step-example').innerHTML = stepData.example;

    textContainer.classList.add('fade-in');

    // Update Buttons
    document.getElementById('btn-prev').disabled = currentStep === 0;
    document.getElementById('btn-next').disabled = currentStep === stepsData.length - 1;

    // Update Dots
    const dotsContainer = document.getElementById('progress-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < stepsData.length; i++) {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 rounded-full transition-colors ${i === currentStep ? 'bg-blue-600 scale-125' : 'bg-slate-300'}`;
        dotsContainer.appendChild(dot);
    }

    // Prepare Canvas/Overlay
    htmlOverlay.innerHTML = '';
    htmlOverlay.classList.add('hidden');
    htmlOverlay.classList.remove('flex');

    const dimensions = resizeCanvas();
    const stepState = stepData.init(dimensions.w, dimensions.h);

    // Execute Animation/Render
    if (currentStep !== 4 && currentStep !== 5) {
        // Steps 1, 2, 3, 4 animate over time
        animate(1200, (ease, progress) => {
            stepData.render(dimensions.w, dimensions.h, stepState, ease);
        });
    } else if (currentStep === 4) {
        // Step 5 (Interactive) renders immediately and waits for input
        stepData.render(dimensions.w, dimensions.h, stepState, 1);
    } else {
        // Step 6 (Formulas) static render
        stepData.render(dimensions.w, dimensions.h, stepState, 1);
    }
}

// --- Event Listeners ---
document.getElementById('btn-next').addEventListener('click', () => {
    if (currentStep < stepsData.length - 1) {
        currentStep++;
        updateUI();
    }
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateUI();
    }
});

window.addEventListener('resize', () => {
    // Re-render current step on resize to maintain proportions
    if (activeAnimation) cancelAnimationFrame(activeAnimation);
    const dims = resizeCanvas();
    if (currentStep === 4) {
        drawStep5(dims.w, dims.h);
    } else if (currentStep !== 5) {
        // Instantly draw final state of animation on resize
        const stepData = stepsData[currentStep];
        const state = stepData.init(dims.w, dims.h);
        stepData.render(dims.w, dims.h, state, 1);
    }
});

// Initialize App
updateUI();