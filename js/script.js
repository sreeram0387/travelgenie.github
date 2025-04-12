document.addEventListener("DOMContentLoaded", () => {
    let navbar = document.querySelector('.navbar');
    let menuBtn = document.querySelector('#menu-btn');

    if (menuBtn) {
        menuBtn.onclick = () => {
            navbar.classList.toggle('active');
        };
    }

    // Ensure the video control buttons are initialized only after the DOM is loaded
    document.querySelectorAll('.about .video-container .controls .control-btn').forEach(btn => {
        btn.onclick = () => {
            let src = btn.getAttribute('data-src');
            let videoElement = document.querySelector('.about .video-container .video');

            if (videoElement) {
                videoElement.src = src;
            } else {
                console.error("Video element not found");
            }
        };
    });
});
