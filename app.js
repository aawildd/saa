document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('mainVideo');
    const videoContainer = document.querySelector('.video-container');
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let lastTime = 0;
    let rafId;

    // Video meta verileri yüklendiğinde
    video.addEventListener('loadedmetadata', () => {
        gsap.registerPlugin(ScrollTrigger);
        video.pause();
        
        // ScrollTrigger ayarları
        ScrollTrigger.create({
            trigger: ".content",
            start: "top top",
            end: "80% bottom",
            scrub: 0.8,
            pin: true,
            onUpdate: self => {
                const progress = self.progress;
                const targetTime = progress * video.duration;
                
                // 60 FPS'ye sabitle
                const now = performance.now();
                if (now - lastTime > 16) {
                    video.currentTime = targetTime;
                    lastTime = now;
                }
            }
        });

        // Section animasyonları
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                onEnter: () => section.classList.add('active'),
                onLeaveBack: () => section.classList.remove('active')
            });
        });

        // Mobil optimizasyon
        if(isMobile) {
            video.setAttribute('playsinline', '');
            video.setAttribute('autoplay', '');
            ScrollTrigger.normalizeScroll(true);
        }

        // Boyut değişikliklerini takip
        window.addEventListener('resize', () => ScrollTrigger.refresh());
    });

    // Request Animation Frame ile optimize edilmiş update
    function updateVideo() {
        const scrollY = window.scrollY;
        const containerHeight = videoContainer.offsetHeight; // Video konteynırının yüksekliği
        const maxScroll = containerHeight - window.innerHeight; // Video konteynırının yüksekliğine göre hesapla
        const progress = Math.min(scrollY / maxScroll, 1);
        
        if(video.readyState > 2) {
            video.currentTime = progress * video.duration;
        }
        
        rafId = requestAnimationFrame(updateVideo);
    }

    // İlk yükleme için play/pause hack'i
    if(isMobile) {
        document.addEventListener('touchstart', () => {
            video.play();
            video.pause();
        });
    }

    video.play().then(() => {
        requestAnimationFrame(updateVideo);
    }).catch(() => {
        video.controls = false;
    });
});
