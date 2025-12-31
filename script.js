document.addEventListener('mousemove', (e) => {
    // Normalize mouse position (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;

    const orbs = document.querySelectorAll('.ambient-orb');

    orbs.forEach((orb, index) => {
        // Parallax factor (balanced for visibility and smoothness)
        const factor = (index + 1) * 28;

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

// Hero Video Controls
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
    // Ensure video is unmuted if played through controls
    heroVideo.addEventListener('play', () => {
        heroVideo.muted = false;
    });

    // Handle Fullscreen Orientation Locking
    const handleFullscreenChange = () => {
        if (document.fullscreenElement === heroVideo ||
            document.webkitFullscreenElement === heroVideo ||
            document.mozFullScreenElement === heroVideo ||
            document.msFullscreenElement === heroVideo) {

            // Entering fullscreen: Try to lock to landscape on mobile
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(err => {
                    console.log("Orientation lock failed or not supported:", err);
                });
            }
        } else {
            // Exiting fullscreen: Unlock orientation
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        }
    };

    // Standard and vendor-prefixed events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
}
