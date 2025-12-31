document.addEventListener('mousemove', (e) => {
    // Normalize mouse position (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;

    const orbs = document.querySelectorAll('.ambient-orb');

    orbs.forEach((orb, index) => {
        // Parallax factor (different for each orb for depth)
        const factor = (index + 1) * 20;

        const tx = x * factor;
        const ty = y * factor;

        // Set CSS variables
        orb.style.setProperty('--tx', `${tx}px`);
        orb.style.setProperty('--ty', `${ty}px`);
    });
});

// Focus-Based Scroll Observer
const observerOptions = {
    threshold: [0.1, 0.6], // Trigger points: 10% (enter) and 60% (focus)
    rootMargin: "-10% 0px -10% 0px" // Shrink hit area to center focus
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const ratio = entry.intersectionRatio;
        const target = entry.target;

        if (ratio > 0.6) {
            // Highly visible: Focus
            target.classList.add('focused');
            target.classList.add('in-view');
        } else if (ratio > 0.1) {
            // Partially visible: Dim
            target.classList.remove('focused');
            target.classList.add('in-view');
        } else {
            // Gone: Reset
            target.classList.remove('focused');
            target.classList.remove('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
});

// Bio Read More Toggle
const bioToggle = document.getElementById('bioToggle');
const authorBio = document.querySelector('.author-bio');

if (bioToggle && authorBio) {
    bioToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = authorBio.classList.toggle('expanded');
        bioToggle.textContent = isExpanded ? 'Read less' : 'Read more';
    });
}

// Hero Video Click-to-Play
const heroVideo = document.getElementById('heroVideo');
const videoOverlay = document.getElementById('videoOverlay');

if (heroVideo && videoOverlay) {
    // Play video when overlay is clicked
    videoOverlay.addEventListener('click', () => {
        heroVideo.muted = false; // Unmute to enable audio
        heroVideo.currentTime = 0; // Start from beginning
        heroVideo.play();
        videoOverlay.classList.add('hidden');
    });

    // Show overlay again when video ends
    heroVideo.addEventListener('ended', () => {
        videoOverlay.classList.remove('hidden');
    });

    // Also show overlay when video is paused (optional - user can click video to pause)
    heroVideo.addEventListener('pause', () => {
        // Only show overlay if video is not at the beginning (avoid showing on initial load)
        if (heroVideo.currentTime > 0 && heroVideo.currentTime < heroVideo.duration) {
            videoOverlay.classList.remove('hidden');
        }
    });

    // Allow clicking the video itself to pause
    heroVideo.addEventListener('click', () => {
        if (!heroVideo.paused) {
            heroVideo.pause();
        }
    });
}
