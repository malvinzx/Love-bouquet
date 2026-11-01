const $ = s => document.querySelector(s),
    R = (a, b) => a + Math.random() * (b - a);
const sv = $("#sv"),
    env = $("#env"),
    L = $("#letter"),
    ctl = $("#ctl"),
    cap = $("#cap"),
    sk = $("#skip"),
    txt = $("#txt"),
    ttl = $("#ttl"),
    intro = $("#intro"),
    startBtn = $("#startBtn"),
    soundToggle = $("#soundToggle"),
    soundLabel = $("#soundLabel"),
    cfg = window.SURAT_CONFIG || {};
const MSG =
    Array.isArray(cfg.captions) && cfg.captions.length
        ? cfg.captions
        : [
              "Kamu bikin hari-hariku lebih berwarna ♥",
              "Terima kasih sudah ada ✿",
              "Senyummu bunga terindah ❀",
              "Semoga bahagia selalu menemanimu ♥",
              "Kamu istimewa, jangan lupa ya ✿",
              "Satu bunga untuk tiap alasan aku sayang kamu ♥"
          ];

/* Bunyi dibuat dengan Web Audio API, jadi tidak perlu file audio tambahan. */
let audioCtx = null,
    soundOn = true,
    audioReady = false;
function initAudio() {
    if (!soundOn) return false;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return false;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") audioCtx.resume();
        audioReady = true;
        return true;
    } catch (e) {
        return false;
    }
}
function tone(
    freq,
    duration,
    type = "sine",
    volume = 0.035,
    delay = 0,
    endFreq = null
) {
    if (!soundOn || !audioReady || !audioCtx) return;
    try {
        const start = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        if (endFreq)
            osc.frequency.exponentialRampToValueAtTime(
                Math.max(1, endFreq),
                start + duration
            );
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(
            Math.max(0.0002, volume),
            start + Math.min(0.025, duration * 0.22)
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.03);
    } catch (e) {
        /* Audio bersifat tambahan; animasi tetap berjalan bila tidak didukung. */
    }
}
function sfx(name) {
    if (!soundOn) return;
    if (!audioReady && !initAudio()) return;
    const patterns = {
        chime: [
            [660, 0.38, "sine", 0.04, 0],
            [880, 0.45, "sine", 0.035, 0.13],
            [1108, 0.55, "sine", 0.027, 0.26]
        ],
        bloom: [
            [523, 0.22, "sine", 0.024, 0],
            [784, 0.3, "sine", 0.022, 0.08]
        ],
        petal: [
            [740, 0.12, "sine", 0.018, 0],
            [990, 0.18, "sine", 0.015, 0.045]
        ],
        heart: [
            [196, 0.13, "triangle", 0.035, 0],
            [392, 0.22, "sine", 0.025, 0.08],
            [587, 0.25, "sine", 0.02, 0.17]
        ],
        paper: [
            [340, 0.26, "triangle", 0.018, 0, 120],
            [220, 0.3, "sine", 0.012, 0.08, 90]
        ],
        open: [
            [784, 0.26, "sine", 0.035, 0],
            [988, 0.3, "sine", 0.03, 0.12],
            [1318, 0.48, "sine", 0.025, 0.24]
        ],
        hug: [
            [523, 0.3, "sine", 0.03, 0],
            [659, 0.32, "sine", 0.03, 0.1],
            [784, 0.4, "sine", 0.028, 0.2],
            [1046, 0.55, "sine", 0.025, 0.3]
        ]
    };
    (patterns[name] || []).forEach(args => tone(...args));
}
function renderLetter() {
    const recipient = cfg.recipient || "My Queen";
    $("#introRecipient").textContent = cfg.introTitle || recipient;
    $("#introSubtitle").textContent =
        cfg.introSubtitle ||
        "Ada bunga kecil dan beberapa kata dari hati yang ingin aku sampaikan.";
    document.title = `Untuk ${recipient} ♡`;
    ttl.textContent = cfg.title || `Untuk ${recipient} ♡`;
    $("#greeting").textContent = cfg.greeting || `Hai, ${recipient}...`;
    const paragraphs = Array.isArray(cfg.paragraphs)
        ? cfg.paragraphs
        : [
              "Aku ingin menyampaikan sesuatu dari hati. Terima kasih sudah menjadi seseorang yang berarti."
          ];
    txt.replaceChildren();
    paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        txt.appendChild(p);
    });
    $("#signoff").textContent = cfg.signoff || "Dengan tulus,\nAku ♡";
    $("#microcopy").textContent =
        cfg.stageMessage ||
        "Satu buket kecil, untuk seseorang yang besar artinya ♡";
}
/* tema */
const TH = {
    rose: {
        bg: ["#4a1245", "#220a2e", "#0f0416"],
        h: ["#ff7aa8", "#e0194f"],
        f: [
            ["#ff5d8f", "#ffc2d4"],
            ["#ff3b6b", "#ff9fb5"],
            ["#ffc233", "#fff1b8"],
            ["#9d6bff", "#e0ccff"],
            ["#eeeeee", "#ffffff"],
            ["#ff8fab", "#ffd0dc"]
        ],
        p: ["#ffe3ec", "#f7a6c0"],
        pb: "#d9577f",
        rb: "#ff4d7d"
    },
    sunset: {
        bg: ["#4a1a0c", "#2a0e1c", "#12050f"],
        h: ["#ffb347", "#e8431a"],
        f: [
            ["#ff8c42", "#ffd0a0"],
            ["#ff5252", "#ffb0a0"],
            ["#ffc933", "#fff3b0"],
            ["#ff7a9c", "#ffd0dc"],
            ["#f2f2f2", "#ffffff"],
            ["#e85d04", "#ffba7a"]
        ],
        p: ["#fff0d9", "#f9b97a"],
        pb: "#c8602a",
        rb: "#ff6b35"
    },
    lilac: {
        bg: ["#1c1a52", "#150f38", "#080520"],
        h: ["#c9a0ff", "#7b3fe4"],
        f: [
            ["#9b5de5", "#e0ccff"],
            ["#f15bb5", "#ffc2e6"],
            ["#00bbf9", "#c4f0ff"],
            ["#f5d90a", "#fff7b0"],
            ["#eeeeee", "#ffffff"],
            ["#b388ff", "#f0e6ff"]
        ],
        p: ["#efe6ff", "#b9a2f5"],
        pb: "#6d4fc2",
        rb: "#9b5de5"
    }
};
function setTheme(n) {
    const t = TH[n],
        s = document.documentElement.style;
    t.bg.forEach((v, i) => s.setProperty("--bg" + (i + 1), v));
    t.h.forEach((v, i) => s.setProperty("--h" + (i + 1), v));
    t.f.forEach((v, i) => {
        s.setProperty(`--f${i}a`, v[0]);
        s.setProperty(`--f${i}b`, v[1]);
    });
    t.p.forEach((v, i) => s.setProperty("--p" + (i + 1), v));
    s.setProperty("--pb", t.pb);
    s.setProperty("--rb", t.rb);
    document
        .querySelectorAll("#themes button")
        .forEach(b => b.classList.toggle("on", b.dataset.t === n));
    try {
        localStorage.setItem("tema-love", n);
    } catch (e) {}
}
/* bunga */
function rose(r, g) {
    let s = "";
    [
        [8, 1, 0.56, 0.36],
        [7, 0.78, 0.5, 0.3],
        [5, 0.52, 0.42, 0.26]
    ].forEach(([n, k, ry, rx], l) => {
        for (let i = 0; i < n; i++)
            s += `<ellipse rx="${r * rx * k + r * 0.1}" ry="${r * ry * k + r * 0.05}" cy="${-r * 0.45 * k}" fill="url(#g${g})" stroke="rgba(0,0,0,.14)" stroke-width=".6" transform="rotate(${(i * 360) / n + l * 20})"/>`;
    });
    return (
        s +
        `<circle r="${r * 0.13}" fill="url(#g${g})" stroke="rgba(0,0,0,.2)" stroke-width=".6"/>`
    );
}
function daisy(r, g) {
    let s = "";
    for (let i = 0; i < 14; i++)
        s += `<ellipse rx="${r * 0.12}" ry="${r * 0.5}" cy="${-r * 0.5}" fill="url(#g${g})" stroke="rgba(0,0,0,.12)" stroke-width=".5" transform="rotate(${(i * 360) / 14})"/>`;
    return (
        s +
        `<circle r="${r * 0.22}" fill="#ffc233" stroke="#e59b00" stroke-width="1.5"/>`
    );
}
const ROWS = [
    [212, [165, 200, 235], 26],
    [246, [125, 165, 205, 245, 285], 28],
    [287, [88, 135, 180, 225, 270, 315], 28],
    [326, [112, 160, 210, 260, 298], 24]
];
const LEAVES = [
    [120, 350, -168],
    [140, 342, -148],
    [168, 336, -125],
    [232, 336, -55],
    [260, 342, -32],
    [280, 350, -12]
];
let FL = [];
function build() {
    FL = [];
    let defs =
        "<defs>" +
        [0, 1, 2, 3, 4, 5]
            .map(
                i =>
                    `<radialGradient id="g${i}" cx=".5" cy=".85" r=".9"><stop offset="0" style="stop-color:var(--f${i}b)"/><stop offset="1" style="stop-color:var(--f${i}a)"/></radialGradient>`
            )
            .join("") +
        `<linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--h1)"/><stop offset="1" style="stop-color:var(--h2)"/></linearGradient>` +
        `<linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--p1)"/><stop offset="1" style="stop-color:var(--p2)"/></linearGradient>` +
        `<linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1f8f4a"/><stop offset="1" stop-color="#52d27f"/></linearGradient></defs>`;
    const HP =
        "M0 55C-80 0-65-60-25-55C-10-53 0-40 0-35C0-40 10-53 25-55C65-60 80 0 0 55Z";
    const heart = `<g transform="translate(200 76) scale(.85)"><g class="hb" id="hb"><path class="hl" pathLength="1" d="${HP}" fill="none" stroke="#ffd0e0" stroke-width="3" stroke-linecap="round"/><path class="hf" d="${HP}" fill="url(#hg)"/><path class="hf" d="M-42-38C-52-30-52-14-46-6" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>`;
    let st = "",
        fl = "",
        bb = "",
        lv = "",
        lf = "",
        fi = 0;
    ROWS.forEach(([y, xs, r], ri) =>
        xs.forEach(x => {
            x += R(-5, 5);
            const yy = y + R(-5, 5),
                g = (fi * 5 + ri * 2) % 6,
                rr = r * R(0.93, 1.07);
            FL.push([x, yy]);
            st += `<path class="stem" pathLength="1" style="--d:${3.2 + fi * 0.07}s" d="M200 500Q${(200 + x) / 2} ${(yy + 500) / 2 + 30} ${x} ${yy}"/>`;
            fl += `<g transform="translate(${x} ${yy}) rotate(${R(-15, 15)})"><g class="fl"><g class="bloom" style="--d:${4 + fi * 0.18}s">${g === 4 ? daisy(rr, g) : rose(rr, g)}</g></g></g>`;
            fi++;
        })
    );
    for (let i = 0; i < 16; i++) {
        const x = R(65, 335),
            y = R(175, 300);
        bb += `<path class="stem" pathLength="1" style="--d:${3.6 + i * 0.05}s;stroke-width:1.5" d="M200 500Q${(200 + x) / 2} ${(y + 500) / 2} ${x} ${y}"/>`;
        for (let k = 0; k < 4; k++)
            bb += `<circle class="pc" style="--d:${5 + i * 0.1}s" cx="${x + R(-7, 7)}" cy="${y + R(-7, 7)}" r="${R(2, 3.2)}" fill="#fff" opacity=".92"/>`;
    }
    [
        [52, 240],
        [348, 240],
        [88, 196],
        [312, 196]
    ].forEach(([x, y], i) => {
        lv += `<path class="stem" pathLength="1" style="--d:${3.5 + i * 0.1}s;stroke:#6fa35f;stroke-width:2.5" d="M200 500Q${(200 + x) / 2} ${(y + 500) / 2 + 40} ${x} ${y}"/>`;
        for (let k = 0; k < 7; k++)
            lv += `<ellipse class="pc" style="--d:${5 + k * 0.08 + i * 0.1}s" cx="${x + (k % 2 ? 3 : -3)}" cy="${y + k * 6}" rx="3.6" ry="6" fill="#a98bff"/>`;
    });
    LEAVES.forEach(([x, y, a], i) => {
        lf += `<g transform="translate(${x} ${y})"><g class="pop" style="--d:${3.8 + i * 0.2}s"><g transform="rotate(${a})"><path d="M0 0Q30-22 64 0Q30 22 0 0Z" fill="url(#lg)"/><path d="M4 0H56" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/></g></g></g>`;
    });
    const back = `<polygon class="rise" style="--d:6.6s" points="88,340 312,340 218,546 182,546" fill="var(--pb)"/>`;
    const front = `<g class="rise" style="--d:6.8s"><polygon points="88,340 200,410 312,340 218,546 182,546" fill="url(#pg)" stroke="#fff" stroke-opacity=".5"/><polygon points="88,340 200,410 182,546" fill="#fff" opacity=".2"/><path d="M200 410L168 540M200 410L232 540M200 410L150 520M200 410L250 520" stroke="#000" stroke-opacity=".08" fill="none"/></g>`;
    const bow = `<g transform="translate(200 478) scale(1.15)"><g class="pop" style="--d:8s"><path d="M0 0L-20 40L-6 33L-2 46Z" fill="var(--rb)"/><path d="M0 0L20 40L6 33L2 46Z" fill="var(--rb)"/><path d="M0 0C-34-32-54-6-38 12C-26 24-8 8 0 0Z" fill="var(--rb)"/><path d="M0 0C34-32 54-6 38 12C26 24 8 8 0 0Z" fill="var(--rb)"/><path d="M-6-4C-24-18-36-6-28 4" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none"/><circle r="8" fill="var(--rb)" stroke="#fff" stroke-opacity=".5"/></g></g>`;
    sv.innerHTML =
        defs +
        heart +
        `<g id="bq">${back}${lv}${bb}${st}${lf}${fl}${front}${bow}</g>`;
}
/* partikel */
const cv = $("#fx"),
    c = cv.getContext("2d");
let W,
    H,
    D,
    P = [];
function rs() {
    D = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    cv.width = W * D;
    cv.height = H * D;
    c.setTransform(D, 0, 0, D, 0, 0);
}
addEventListener("resize", rs);
rs();
const COL = ["#ff7aa8", "#ffc2d4", "#ffd166", "#ffffff", "#b388ff", "#ff5d8f"];
const pick = () => COL[0 | (Math.random() * COL.length)];
function amb() {
    if (Math.random() < 0.5)
        P.push({
            k: "a",
            t: "♥",
            x: R(0, W),
            y: H + 10,
            vx: R(-0.2, 0.2),
            vy: -R(0.5, 1.4),
            s: R(10, 26),
            a: 0.7,
            c: pick(),
            w: R(0, 6)
        });
    else
        P.push({
            k: "p",
            x: R(0, W),
            y: -12,
            vx: R(-0.3, 0.5),
            vy: R(0.5, 1.3),
            s: R(5, 9),
            a: 0.85,
            c: pick(),
            w: R(0, 6),
            r: R(0, 6)
        });
}
function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
        const a = R(0, 6.28),
            v = R(1, 4);
        P.push({
            k: "b",
            x,
            y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 1.2,
            g: 0.06,
            s: R(4, 10),
            a: 1,
            c: pick(),
            t: Math.random() < 0.4 ? "♥" : ""
        });
    }
}
function tick() {
    c.clearRect(0, 0, W, H);
    if (Math.random() < 0.08) amb();
    P = P.filter(p => p.a > 0.02 && p.y > -30 && p.y < H + 40);
    for (const p of P) {
        p.x += p.vx + (p.k !== "b" ? Math.sin((p.w += 0.03)) * 0.6 : 0);
        p.y += p.vy;
        if (p.g) p.vy += p.g;
        p.a -= p.k === "b" ? 0.013 : 0.0008;
        c.globalAlpha = Math.max(p.a, 0);
        c.fillStyle = p.c;
        if (p.t) {
            c.font = p.s + "px serif";
            c.fillText(p.t, p.x, p.y);
        } else if (p.k === "p") {
            c.beginPath();
            c.ellipse(p.x, p.y, p.s, p.s * 0.5, (p.r += 0.03), 0, 6.28);
            c.fill();
        } else {
            c.beginPath();
            c.arc(p.x, p.y, p.s / 2, 0, 6.28);
            c.fill();
        }
    }
    c.globalAlpha = 1;
    requestAnimationFrame(tick);
}
tick();
function pt(x, y) {
    const r = sv.getBoundingClientRect(),
        k = Math.min(r.width / 400, r.height / 560);
    return [
        r.left + r.width / 2 + (x - 200) * k,
        r.top + r.height / 2 + (y - 280) * k
    ];
}
/* alur otomatis */
let T = [],
    n = 0;
const at = (f, ms) => T.push(setTimeout(f, ms));
function say() {
    cap.textContent = MSG[n++ % MSG.length];
    cap.classList.add("on");
    sfx("petal");
}
function stage2() {
    sv.classList.add("done");
    cap.textContent = cfg.stageMessage || "Sentuh bunganya ✿ ada kejutan";
    cap.classList.add("on");
}
function run() {
    T.forEach(clearTimeout);
    T = [];
    n = 0;
    L.classList.remove("show");
    env.classList.remove("on", "open", "out");
    cap.classList.remove("on");
    ctl.classList.remove("on");
    sv.classList.remove("done");
    $("#bHug").innerHTML =
        '<span>Kirim peluk virtual</span><span aria-hidden="true">♡</span>';
    sk.classList.add("on");
    build();
    at(() => {
        burst(...pt(200, 76), 40);
        sfx("heart");
    }, 2800);
    at(() => sfx("bloom"), 4550);
    FL.forEach((f, i) =>
        at(() => burst(...pt(f[0], f[1]), 10), (4.4 + i * 0.18) * 1000)
    );
    at(() => {
        burst(...pt(200, 478), 30);
        sfx("chime");
    }, 8300);
    at(stage2, 8800);
    at(() => {
        env.classList.add("on");
        sfx("paper");
    }, 9400);
    at(() => {
        env.classList.add("open");
        sfx("open");
    }, 10400);
    at(() => env.classList.add("out"), 11100);
    at(() => {
        showLetter();
        ctl.classList.add("on");
        sk.classList.remove("on");
    }, 12600);
}
function skip() {
    T.forEach(clearTimeout);
    T = [];
    document.getAnimations().forEach(a => {
        try {
            if (isFinite(a.effect.getComputedTiming().iterations)) a.finish();
        } catch (e) {}
    });
    stage2();
    env.classList.add("on", "open", "out");
    ctl.classList.add("on");
    sk.classList.remove("on");
    sfx("open");
}
/* Interaksi */
function showLetter() {
    L.classList.add("show");
    L.setAttribute("aria-hidden", "false");
    sfx("open");
    window.setTimeout(() => $("#bClose").focus({ preventScroll: true }), 220);
}
function closeLetter() {
    L.classList.remove("show");
    L.setAttribute("aria-hidden", "true");
}
sv.addEventListener("pointerdown", e => {
    const f = e.target.closest(".fl"),
        h = e.target.closest("#hb");
    if (f) {
        f.classList.remove("w");
        void f.getBoundingClientRect();
        f.classList.add("w");
        const b = f.getBoundingClientRect();
        burst(b.left + b.width / 2, b.top + b.height / 2, 28);
        say();
    } else if (h) {
        const b = h.getBoundingClientRect();
        burst(b.left + b.width / 2, b.top + b.height / 2, 60);
        say();
        sfx("heart");
    }
});
document.addEventListener("pointerdown", e => {
    if (!e.target.closest("#sv,button,.letter,.env,.intro-card,.top"))
        burst(e.clientX, e.clientY, 15);
});
document.addEventListener("pointermove", e => {
    if (matchMedia("(pointer: coarse)").matches) return;
    sv.style.setProperty(
        "--ry",
        ((e.clientX / W - 0.5) * 10).toFixed(1) + "deg"
    );
    sv.style.setProperty(
        "--rx",
        (-(e.clientY / H - 0.5) * 7).toFixed(1) + "deg"
    );
    if (Math.random() < 0.18) burst(e.clientX, e.clientY, 1);
});
$("#bClose").addEventListener("click", closeLetter);
L.addEventListener("click", e => {
    if (e.target === L || e.target.classList.contains("letter-backdrop"))
        closeLetter();
});
$("#bOpen").addEventListener("click", showLetter);
env.addEventListener("click", showLetter);
env.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showLetter();
    }
});
$("#bAgain").addEventListener("click", () => {
    closeLetter();
    sfx("chime");
    run();
});
$("#bHug").addEventListener("click", () => {
    const rect = $(".card").getBoundingClientRect();
    burst(
        rect.left + rect.width / 2,
        rect.top + Math.min(rect.height * 0.45, 260),
        100
    );
    sfx("hug");
    const b = $("#bHug");
    b.innerHTML =
        '<span>Peluk hangat terkirim</span><span aria-hidden="true">♡</span>';
    b.classList.add("hug-sent");
});
sk.addEventListener("click", skip);
startBtn.addEventListener("click", () => {
    initAudio();
    sfx("chime");
    intro.classList.add("hide");
    window.setTimeout(() => {
        intro.setAttribute("aria-hidden", "true");
        run();
    }, 250);
});
soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    soundToggle.setAttribute("aria-pressed", String(soundOn));
    soundToggle.setAttribute(
        "aria-label",
        soundOn ? "Matikan efek suara" : "Aktifkan efek suara"
    );
    soundLabel.textContent = soundOn ? "Suara aktif" : "Suara mati";
    soundToggle.querySelector(".sound-icon").textContent = soundOn ? "♫" : "♪̸";
    if (soundOn) {
        initAudio();
        sfx("chime");
    }
});
document
    .querySelectorAll("#themes button")
    .forEach(b => b.addEventListener("click", () => setTheme(b.dataset.t)));
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && L.classList.contains("show")) closeLetter();
});
let savedTheme = null;
try {
    savedTheme = localStorage.getItem("tema-love");
} catch (e) {}
renderLetter();
setTheme(TH[savedTheme] ? savedTheme : "rose");
L.setAttribute("aria-hidden", "true");
