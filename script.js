// KineticAI Virtual Sports Coach - Strict Supabase Auth + OpenAI Vision Video Frame Analyzer

// =========================================================================
// 1. CONFIGURATION (Paste your keys here OR configure them via the UI Gear button)
// =========================================================================
let SUPABASE_URL = localStorage.getItem('kinetic_sb_url') || 'YOUR_SUPABASE_PROJECT_URL';
let SUPABASE_ANON_KEY = localStorage.getItem('kinetic_sb_key') || 'YOUR_SUPABASE_ANON_KEY';
let OPENAI_API_KEY = localStorage.getItem('kinetic_openai_key') || 'YOUR_OPENAI_API_KEY';

let supabaseClient = null;

function initSupabase() {
    if (
        window.supabase &&
        SUPABASE_URL &&
        SUPABASE_URL.startsWith('http') &&
        SUPABASE_ANON_KEY &&
        SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
    ) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        supabaseClient = null;
    }
}
initSupabase();

// =========================================================================
// 2. DEFAULT SPORT PROFILES
// =========================================================================
const sportsData = {
    basketball: {
        title: "Basketball",
        overallScore: 78,
        ratingTitle: "Solid Mechanics",
        ratingDesc: "Good shot angle, but release point is early. Practice your follow-through.",
        poster: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        storageUsed: "2.4 GB / 5.0 GB",
        storagePercent: 48,
        metrics: [
            { name: "Elbow Tucked Angle", score: 85 },
            { name: "Release Height", score: 70 },
            { name: "Knee Dip Synchronization", score: 80 }
        ],
        flaws: [
            "Flaw: Elbow flares outward by 12° during jump phase.",
            "Correction: Maintain vertical alignment of wrist, elbow, and hip."
        ],
        videos: [
            {
                title: "Fix Your Shooting Form: Perfect Elbow Alignment",
                channel: "Pure Sweat Basketball",
                thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=basketball+shooting+form+elbow"
            },
            {
                title: "Mastering Higher Release Point & Wrist Snap",
                channel: "ShotMechanics",
                thumbnail: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=basketball+higher+release+point"
            }
        ],
        skeletonPose: [
            { x: 0.45, y: 0.3 },
            { x: 0.45, y: 0.45 },
            { x: 0.55, y: 0.4 },
            { x: 0.65, y: 0.35 },
            { x: 0.70, y: 0.25 },
            { x: 0.45, y: 0.65 },
            { x: 0.48, y: 0.80 },
            { x: 0.50, y: 0.95 }
        ]
    },
    volleyball: {
        title: "Volleyball",
        overallScore: 64,
        ratingTitle: "Needs Arm Swing Adjustment",
        ratingDesc: "Approach speed is good, but your hitting shoulder droops prior to contact.",
        poster: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        storageUsed: "3.8 GB / 5.0 GB",
        storagePercent: 76,
        metrics: [
            { name: "Approach Speed", score: 88 },
            { name: "Jump Vertical Peak", score: 72 },
            { name: "Arm Swing Torque", score: 55 }
        ],
        flaws: [
            "Flaw: Contacting ball 4 inches below maximum vertical height.",
            "Correction: Accelerate non-dominant arm up early to guide hitting path."
        ],
        videos: [
            {
                title: "Volleyball Spiking: How to Hit at Peak Height",
                channel: "Elevate Yourself",
                thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=volleyball+spiking+peak+height"
            },
            {
                title: "Fixing Arm Swing Biomechanics in Volleyball",
                channel: "Victoria Volleyball",
                thumbnail: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=volleyball+arm+swing+technique"
            }
        ],
        skeletonPose: [
            { x: 0.5, y: 0.2 },
            { x: 0.5, y: 0.35 },
            { x: 0.65, y: 0.25 },
            { x: 0.75, y: 0.15 },
            { x: 0.5, y: 0.55 },
            { x: 0.42, y: 0.75 },
            { x: 0.58, y: 0.75 }
        ]
    },
    boxing: {
        title: "Boxing",
        overallScore: 82,
        ratingTitle: "Sharp Punch Mechanics",
        ratingDesc: "Excellent cross turn torque, but left guard drops slightly when throwing right.",
        poster: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        storageUsed: "1.2 GB / 5.0 GB",
        storagePercent: 24,
        metrics: [
            { name: "Guard Retention", score: 68 },
            { name: "Punch Snap & Velocity", score: 92 },
            { name: "Hip Kinetic Rotation", score: 86 }
        ],
        flaws: [
            "Flaw: Opposite hand drops to chin line during power delivery.",
            "Correction: Glue non-punching cheek/glove to temple for defense coverage."
        ],
        videos: [
            {
                title: "Boxing Defense: Never Drop Your Guard While Punching",
                channel: "ExpertBoxing",
                thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=boxing+keep+guard+up"
            },
            {
                title: "Generate Maximum Power in your Right Cross",
                channel: "Tony Jeffries",
                thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80",
                url: "https://www.youtube.com/results?search_query=boxing+right+cross+power"
            }
        ],
        skeletonPose: [
            { x: 0.48, y: 0.25 },
            { x: 0.48, y: 0.40 },
            { x: 0.38, y: 0.35 },
            { x: 0.68, y: 0.38 },
            { x: 0.45, y: 0.65 },
            { x: 0.40, y: 0.85 }
        ]
    }
};

const sampleDriveFiles = [
    { name: "Volleyball_Spike_Practice_Oct.mp4", sport: "volleyball", size: "45.2 MB", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { name: "Basketball_JumpShot_Drills.mp4", sport: "basketball", size: "38.6 MB", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { name: "Boxing_Heavybag_Combo1.mp4", sport: "boxing", size: "52.1 MB", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" }
];

const tierSpeeds = {
    free: { name: "Free Tier", latency: "~300ms", detail: "Standard Queue" },
    pro: { name: "Pro Tier", latency: "~25ms", detail: "High-Speed GPU Vision" },
    elite: { name: "Elite Tier", latency: "~5ms", detail: "Ultra-Low Latency Edge" }
};

// =========================================================================
// 3. DOM REFERENCES
// =========================================================================
const sportSelect = document.getElementById("sport-select");
const tierSelect = document.getElementById("tier-select");
const playBtn = document.getElementById("play-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const playerVideo = document.getElementById("player-video");
const videoSource = document.getElementById("video-source");
const clipUpload = document.getElementById("clip-upload");
const folderUpload = document.getElementById("folder-upload");
const activeFileBadge = document.getElementById("active-file-badge");
const folderQueueContainer = document.getElementById("folder-queue-container");
const folderQueueList = document.getElementById("folder-queue-list");
const queueCountSpan = document.getElementById("queue-count");

const canvas = document.getElementById("skeleton-canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("processing-loader");
const loaderText = document.getElementById("loader-text");
const loaderSub = document.getElementById("loader-sub");
const latencyBadge = document.getElementById("latency-badge");

// Auth DOM
const openAuthBtn = document.getElementById("open-auth-btn");
const closeAuthModalBtn = document.getElementById("close-auth-modal");
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authModalTitle = document.getElementById("auth-modal-title");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authToggleBtn = document.getElementById("auth-toggle-btn");
const authToggleText = document.getElementById("auth-toggle-text");
const nameFieldGroup = document.getElementById("name-field-group");
const authErrorBanner = document.getElementById("auth-error-banner");
const userProfile = document.getElementById("user-profile");
const userAvatar = document.getElementById("user-avatar");
const userNameDisplay = document.getElementById("user-name-display");
const logoutBtn = document.getElementById("logout-btn");

// Config Modal DOM
const openConfigBtn = document.getElementById("open-config-btn");
const closeConfigModalBtn = document.getElementById("close-config-modal");
const configModal = document.getElementById("config-modal");
const configForm = document.getElementById("config-form");

// Google Drive DOM
const gdrivePickBtn = document.getElementById("gdrive-pick-btn");
const gdriveModal = document.getElementById("gdrive-modal");
const closeGdriveModalBtn = document.getElementById("close-gdrive-modal");
const gdriveFileList = document.getElementById("gdrive-file-list");

let isSignUp = false;
let isCustomVideoActive = false;
let customFileName = "";
let uploadedFolderFiles = [];
let currentSport = "basketball";
let currentTier = "pro";

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// =========================================================================
// 4. STRICT SUPABASE AUTHENTICATION (REJECTS INVALID CREDENTIALS)
// =========================================================================
async function checkSupabaseSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (session && session.user && !error) {
        renderLoggedInUser(session.user);
    } else {
        renderLoggedOutState();
    }
}
checkSupabaseSession();

function showAuthError(msg) {
    authErrorBanner.textContent = msg;
    authErrorBanner.classList.remove("hidden");
}

function hideAuthError() {
    authErrorBanner.textContent = "";
    authErrorBanner.classList.add("hidden");
}

openAuthBtn.addEventListener("click", () => {
    hideAuthError();
    authModal.classList.remove("hidden");
});

closeAuthModalBtn.addEventListener("click", () => {
    authModal.classList.add("hidden");
});

authToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAuthError();
    isSignUp = !isSignUp;
    if (isSignUp) {
        authModalTitle.textContent = "Create KineticAI Account";
        authSubmitBtn.textContent = "Sign Up";
        authToggleText.textContent = "Already have an account?";
        authToggleBtn.textContent = "Sign In";
        nameFieldGroup.style.display = "flex";
    } else {
        authModalTitle.textContent = "Sign In to KineticAI";
        authSubmitBtn.textContent = "Sign In";
        authToggleText.textContent = "Don't have an account?";
        authToggleBtn.textContent = "Create Account";
        nameFieldGroup.style.display = "none";
    }
});

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAuthError();

    // Ensure Supabase is actually configured before accepting any input!
    if (!supabaseClient) {
        showAuthError("Supabase is not configured yet. Click '⚙️ API Keys' in the top bar and enter your Supabase URL and Anon Key.");
        return;
    }

    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    const name = document.getElementById("auth-name").value.trim() || email.split("@")[0];

    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = isSignUp ? "Creating Account..." : "Verifying Credentials...";

    try {
        if (isSignUp) {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) {
                showAuthError(error.message);
                return;
            }

            if (data.session) {
                renderLoggedInUser(data.user);
                authModal.classList.add("hidden");
                authForm.reset();
            } else {
                showAuthError("Account created! Please check your email inbox to confirm your address before signing in.");
                isSignUp = false;
                authModalTitle.textContent = "Sign In to KineticAI";
                nameFieldGroup.style.display = "none";
            }
        } else {
            // STRICT SIGN-IN: Must match exact email and password in Supabase Auth
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            // Reject immediately on wrong password, invalid email, or missing session
            if (error || !data || !data.session || !data.user) {
                showAuthError(error ? error.message : "Invalid login credentials. Access denied.");
                return;
            }

            // Validated session confirmed
            renderLoggedInUser(data.user);
            authModal.classList.add("hidden");
            authForm.reset();
        }
    } catch (err) {
        showAuthError("Authentication error: " + err.message);
    } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignUp ? "Sign Up" : "Sign In";
    }
});

logoutBtn.addEventListener("click", async () => {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    renderLoggedOutState();
});

function renderLoggedInUser(user) {
    const fullName = user.user_metadata?.full_name || user.email.split("@")[0];
    const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    userAvatar.textContent = initials || "AT";
    userNameDisplay.textContent = fullName;
    openAuthBtn.classList.add("hidden");
    userProfile.classList.remove("hidden");
}

function renderLoggedOutState() {
    userProfile.classList.add("hidden");
    openAuthBtn.classList.remove("hidden");
}

// =========================================================================
// 5. API KEYS CONFIGURATION MODAL
// =========================================================================
openConfigBtn.addEventListener("click", () => {
    document.getElementById("cfg-openai-key").value = OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY' ? OPENAI_API_KEY : '';
    document.getElementById("cfg-supabase-url").value = SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' ? SUPABASE_URL : '';
    document.getElementById("cfg-supabase-key").value = SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' ? SUPABASE_ANON_KEY : '';
    configModal.classList.remove("hidden");
});

closeConfigModalBtn.addEventListener("click", () => configModal.classList.add("hidden"));

configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newOpenAI = document.getElementById("cfg-openai-key").value.trim();
    const newSbUrl = document.getElementById("cfg-supabase-url").value.trim();
    const newSbKey = document.getElementById("cfg-supabase-key").value.trim();

    if (newOpenAI) {
        OPENAI_API_KEY = newOpenAI;
        localStorage.setItem('kinetic_openai_key', newOpenAI);
    }
    if (newSbUrl) {
        SUPABASE_URL = newSbUrl;
        localStorage.setItem('kinetic_sb_url', newSbUrl);
    }
    if (newSbKey) {
        SUPABASE_ANON_KEY = newSbKey;
        localStorage.setItem('kinetic_sb_key', newSbKey);
    }

    initSupabase();
    checkSupabaseSession();
    configModal.classList.add("hidden");
    alert("API keys saved! Supabase authentication and OpenAI Vision video analysis are now active.");
});

// =========================================================================
// 6. OPENAI VISION VIDEO FRAME EXTRACTION & BIOMECHANICAL ANALYSIS
// =========================================================================
async function captureVideoFrames(videoElement, frameCount = 3) {
    return new Promise(async (resolve) => {
        const frames = [];
        const offscreenCanvas = document.createElement("canvas");
        const offCtx = offscreenCanvas.getContext("2d");

        // Scale down frame width to 512px for fast, token-efficient OpenAI Vision inference
        const targetWidth = 512;
        const aspect = (videoElement.videoHeight || 720) / (videoElement.videoWidth || 1280);
        offscreenCanvas.width = targetWidth;
        offscreenCanvas.height = Math.round(targetWidth * aspect);

        const duration = videoElement.duration;

        // If duration is unavailable or stream is tainted, capture current frame
        if (!duration || isNaN(duration) || duration === Infinity) {
            try {
                offCtx.drawImage(videoElement, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
                frames.push(offscreenCanvas.toDataURL("image/jpeg", 0.8));
            } catch (e) {
                console.warn("Frame capture fallback:", e);
            }
            resolve(frames);
            return;
        }

        const wasPaused = videoElement.paused;
        const originalTime = videoElement.currentTime;
        videoElement.pause();

        const timestamps = [
            Math.max(0.1, duration * 0.2),
            Math.max(0.2, duration * 0.5),
            Math.max(0.3, duration * 0.8)
        ].slice(0, frameCount);

        for (const t of timestamps) {
            await new Promise((res) => {
                const onSeeked = () => {
                    videoElement.removeEventListener("seeked", onSeeked);
                    try {
                        offCtx.drawImage(videoElement, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
                        frames.push(offscreenCanvas.toDataURL("image/jpeg", 0.8));
                    } catch (err) {
                        console.warn("Could not draw frame:", err);
                    }
                    res();
                };
                videoElement.addEventListener("seeked", onSeeked);
                videoElement.currentTime = t;
            });
        }

        // Restore playback state
        videoElement.currentTime = originalTime;
        if (!wasPaused) {
            videoElement.play().catch(() => {});
        }
        resolve(frames);
    });
}

async function analyzeClipWithOpenAI(sportKey, fileName) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY' || !OPENAI_API_KEY.startsWith('sk-')) {
        alert("Please enter your OpenAI API Key first by clicking '⚙️ API Keys' in the top bar.");
        openConfigBtn.click();
        return;
    }

    const tier = tierSpeeds[currentTier];
    loaderText.textContent = `Extracting key motion frames from "${fileName || sportKey + ' clip'}"...`;
    loaderSub.textContent = `Sending frames to OpenAI Vision (${tier.detail})...`;
    loader.classList.remove("hidden");

    try {
        const frames = await captureVideoFrames(playerVideo, 3);
        if (frames.length === 0) {
            throw new Error("Could not extract frames from video. Please upload a local video file (.mp4/.mov) for full frame inspection.");
        }

        loaderText.textContent = `OpenAI AI Coach is grading your ${sportKey.toUpperCase()} mechanics...`;

        const contentPayload = [
            {
                type: "text",
                text: `You are an elite biomechanics and sports performance coach analyzing ${sportKey}. Inspect these sequential frames from the athlete's clip (${fileName || 'practice video'}). Grade their overall form (0-100), evaluate 3 sport-specific biomechanical metrics (0-100), and identify exact form mistakes/flaws along with actionable corrections.`
            },
            ...frames.map(base64Url => ({
                type: "image_url",
                image_url: {
                    url: base64Url,
                    detail: "low"
                }
            }))
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert AI sports biomechanics coach. Analyze the athlete's posture, joint angles, balance, and execution in the provided frames."
                    },
                    {
                        role: "user",
                        content: contentPayload
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "sports_biomechanics_analysis",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                overall_score: {
                                    type: "integer",
                                    description: "Overall form grade from 0 to 100"
                                },
                                rating_title: {
                                    type: "string",
                                    description: "Short 2-4 word summary title of form quality"
                                },
                                rating_summary: {
                                    type: "string",
                                    description: "1-2 sentence overall coaching summary of what the athlete did well and primary area to improve"
                                },
                                metrics: {
                                    type: "array",
                                    description: "Exactly 3 sport-specific biomechanical sub-scores",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            score: { type: "integer" }
                                        },
                                        required: ["name", "score"],
                                        additionalProperties: false
                                    }
                                },
                                flaws_and_corrections: {
                                    type: "array",
                                    description: "Specific mistakes detected in the clip paired with concrete corrections",
                                    items: {
                                        type: "object",
                                        properties: {
                                            flaw: { type: "string" },
                                            correction: { type: "string" }
                                        },
                                        required: ["flaw", "correction"],
                                        additionalProperties: false
                                    }
                                }
                            },
                            required: [
                                "overall_score",
                                "rating_title",
                                "rating_summary",
                                "metrics",
                                "flaws_and_corrections"
                            ],
                            additionalProperties: false
                        }
                    }
                }
            })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error?.message || "OpenAI API request failed.");
        }

        const aiReport = JSON.parse(result.choices[0].message.content);
        renderOpenAIResults(aiReport);
    } catch (err) {
        alert("OpenAI Analysis Error: " + err.message);
    } finally {
        loader.classList.add("hidden");
    }
}

function renderOpenAIResults(report) {
    // Update Overall Score Gauge
    const score = Math.min(100, Math.max(0, report.overall_score));
    document.getElementById("overall-score").textContent = score;
    document.getElementById("gauge-circle").style.background = `conic-gradient(#00f2fe ${score}%, #1f293d 0deg)`;
    document.getElementById("skill-rating-title").textContent = report.rating_title;
    document.getElementById("skill-rating-desc").textContent = report.rating_summary;

    // Render Dynamic Sub-Metrics
    const metricsContainer = document.getElementById("metrics-container");
    metricsContainer.innerHTML = report.metrics.map(m => `
        <div class="metric-item">
            <div class="metric-header">
                <span class="metric-name">${m.name}</span>
                <span class="metric-score">${m.score}%</span>
            </div>
            <div class="metric-bar-bg">
                <div class="metric-bar-fill" style="width: ${m.score}%;"></div>
            </div>
        </div>
    `).join("");

    // Render Identified Mistakes & Corrections
    const flawsContainer = document.getElementById("flaws-list");
    flawsContainer.innerHTML = report.flaws_and_corrections.map(item => `
        <li class="flaw-card">
            <span class="flaw-icon">⚠️</span>
            <div><strong>Mistake:</strong> ${item.flaw}</div>
        </li>
        <li class="flaw-card correction">
            <span class="flaw-icon" style="color: var(--accent-teal);">✓</span>
            <div><strong>Correction:</strong> ${item.correction}</div>
        </li>
    `).join("");

    drawSkeleton(sportsData[currentSport].skeletonPose, true);
}

// =========================================================================
// 7. VIDEO UPLOADS, FOLDER QUEUE & GOOGLE DRIVE PICKER
// =========================================================================
updateUI(currentSport);
populateDriveFiles();

gdrivePickBtn.addEventListener("click", () => gdriveModal.classList.remove("hidden"));
closeGdriveModalBtn.addEventListener("click", () => gdriveModal.classList.add("hidden"));

function populateDriveFiles() {
    gdriveFileList.innerHTML = sampleDriveFiles.map((file, index) => `
        <div class="gdrive-file-item" data-index="${index}">
            <div class="gdrive-file-info">
                <svg width="20" height="20" viewBox="0 0 87.3 78"><path fill="#0066da" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.45l5.4 9.4z"/><path fill="#00ac47" d="M43.65 25L29.9 1.2C28.55.4 27 0 25.4 0H15.9c-1.55 0-3.1.4-4.45 1.2l13.75 23.8h28.45z"/><path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.35 1.2-2.9 1.2-4.45H59.8l13.75 23.75z"/><path fill="#00832d" d="M27.5 53H59.8L43.65 80c-.8.8-1.9 1.3-3 1.3h-19.3c-1.1 0-2.2-.5-3-1.3L27.5 53z"/><path fill="#ffba00" d="M59.8 53l16.35-28.3c-.8-1.4-1.95-2.5-3.3-3.3L59.05 9.75c-1.35-.8-2.9-1.2-4.45-1.2H25.4l18.25 31.5L59.8 53z"/><path fill="#2684fc" d="M43.65 31.5L29.9 55.3h27.5L71.15 31.5H43.65z"/></svg>
                <div>
                    <div class="gdrive-file-name">${file.name}</div>
                    <div class="gdrive-file-meta">Sport: ${file.sport.toUpperCase()} • ${file.size}</div>
                </div>
            </div>
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Select</button>
        </div>
    `).join("");

    document.querySelectorAll(".gdrive-file-item").forEach(item => {
        item.addEventListener("click", () => {
            const idx = item.getAttribute("data-index");
            const selectedFile = sampleDriveFiles[idx];
            currentSport = selectedFile.sport;
            sportSelect.value = currentSport;
            isCustomVideoActive = true;
            customFileName = selectedFile.name;
            loadCustomVideoSource(selectedFile.url, selectedFile.name);
            updateUI(currentSport, true);
            gdriveModal.classList.add("hidden");
        });
    });
}

clipUpload.addEventListener("change", (event) => {
    const files = Array.from(event.target.files).filter(f => f.type.startsWith("video/"));
    if (files.length > 0) handleSelectedVideoFiles(files);
});

folderUpload.addEventListener("change", (event) => {
    const files = Array.from(event.target.files).filter(f => f.type.startsWith("video/"));
    if (files.length > 0) {
        handleSelectedVideoFiles(files);
    } else {
        alert("No video files (.mp4, .mov, .webm) found inside the selected folder.");
    }
});

function handleSelectedVideoFiles(videoFiles) {
    uploadedFolderFiles = videoFiles;
    if (videoFiles.length > 1) {
        queueCountSpan.textContent = videoFiles.length;
        folderQueueContainer.classList.remove("hidden");
        renderFolderQueue(0);
    } else {
        folderQueueContainer.classList.add("hidden");
    }
    activateCustomFile(0);
}

function renderFolderQueue(activeIndex) {
    folderQueueList.innerHTML = uploadedFolderFiles.map((file, idx) => `
        <div class="queue-item ${idx === activeIndex ? 'active' : ''}" data-idx="${idx}">
            🎥 ${file.name}
        </div>
    `).join("");

    document.querySelectorAll(".queue-item").forEach(el => {
        el.addEventListener("click", () => {
            const idx = parseInt(el.getAttribute("data-idx"));
            renderFolderQueue(idx);
            activateCustomFile(idx);
        });
    });
}

function activateCustomFile(index) {
    const file = uploadedFolderFiles[index];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    isCustomVideoActive = true;
    customFileName = file.name;

    const lowerName = file.name.toLowerCase();
    if (lowerName.includes("volley")) {
        currentSport = "volleyball";
        sportSelect.value = "volleyball";
    } else if (lowerName.includes("basket")) {
        currentSport = "basketball";
        sportSelect.value = "basketball";
    } else if (lowerName.includes("box")) {
        currentSport = "boxing";
        sportSelect.value = "boxing";
    }

    loadCustomVideoSource(fileURL, file.name);
    updateUI(currentSport, true);
}

function loadCustomVideoSource(url, filename) {
    playerVideo.pause();
    videoSource.src = url;
    playerVideo.load();
    playerVideo.play().catch(() => {});
    activeFileBadge.textContent = `File: ${filename}`;
    activeFileBadge.classList.remove("hidden");
}

sportSelect.addEventListener("change", (e) => {
    currentSport = e.target.value;
    isCustomVideoActive = false;
    activeFileBadge.classList.add("hidden");
    updateUI(currentSport, false);
});

tierSelect.addEventListener("change", (e) => {
    currentTier = e.target.value;
    latencyBadge.textContent = `Latency: ${tierSpeeds[currentTier].latency}`;
});

playBtn.addEventListener("click", () => {
    if (playerVideo.paused) playerVideo.play();
    else playerVideo.pause();
});

analyzeBtn.addEventListener("click", () => {
    analyzeClipWithOpenAI(currentSport, isCustomVideoActive ? customFileName : null);
});

function updateUI(sportKey, keepCustomVideo = false) {
    const data = sportsData[sportKey];
    if (!keepCustomVideo) {
        playerVideo.pause();
        playerVideo.poster = data.poster;
        videoSource.src = data.videoSrc;
        playerVideo.load();
    }

    document.getElementById("current-sport-badge").textContent = data.title;
    document.getElementById("overall-score").textContent = data.overallScore;
    document.getElementById("gauge-circle").style.background = `conic-gradient(#00f2fe ${data.overallScore}%, #1f293d 0deg)`;
    document.getElementById("skill-rating-title").textContent = data.ratingTitle;
    document.getElementById("skill-rating-desc").textContent = data.ratingDesc;

    document.getElementById("storage-text").textContent = data.storageUsed;
    document.getElementById("storage-bar").style.width = `${data.storagePercent}%`;

    const metricsContainer = document.getElementById("metrics-container");
    metricsContainer.innerHTML = data.metrics.map(m => `
        <div class="metric-item">
            <div class="metric-header">
                <span class="metric-name">${m.name}</span>
                <span class="metric-score">${m.score}%</span>
            </div>
            <div class="metric-bar-bg">
                <div class="metric-bar-fill" style="width: ${m.score}%;"></div>
            </div>
        </div>
    `).join("");

    const flawsContainer = document.getElementById("flaws-list");
    flawsContainer.innerHTML = data.flaws.map(flaw => `
        <li class="flaw-card">
            <span class="flaw-icon">⚠️</span>
            <div>${flaw}</div>
        </li>
    `).join("");

    const videosContainer = document.getElementById("recommendations-grid");
    videosContainer.innerHTML = data.videos.map(v => `
        <a href="${v.url}" target="_blank" class="video-card">
            <div class="thumbnail-container">
                <img src="${v.thumbnail}" alt="Thumbnail">
                <span class="play-badge">YouTube</span>
            </div>
            <div class="video-info">
                <div class="video-title">${v.title}</div>
                <div class="video-channel">${v.channel}</div>
            </div>
        </a>
    `).join("");

    drawSkeleton(data.skeletonPose);
}

function drawSkeleton(points) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!points || points.length === 0) return;

    ctx.strokeStyle = "#00f2fe";
    ctx.lineWidth = 4;
    ctx.fillStyle = "#10b981";

    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
        const pt1 = { x: points[i].x * canvas.width, y: points[i].y * canvas.height };
        const pt2 = { x: points[i+1].x * canvas.width, y: points[i+1].y * canvas.height };
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
    }
    ctx.stroke();

    points.forEach(pt => {
        const cx = pt.x * canvas.width;
        const cy = pt.y * canvas.height;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}