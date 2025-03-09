setTimeout(() => {
    const className = "animasyon-sagsol";
    const elements = document.querySelectorAll(`.${className}`);

    if (elements.length === 0) return;

    const style = document.createElement("style");
    style.textContent = `
        .${className} {
            opacity: 0;
        }
        .${className}-sag {
            animation: ${className}-gorun-sol 0.5s linear forwards;
        }
        .${className}-sol {
            animation: ${className}-gorun-sag 0.5s linear forwards;
        }
        @keyframes ${className}-gorun-sol {
            0% { opacity: 0; transform: translateX(-200px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes ${className}-gorun-sag {
            0% { opacity: 0; transform: translateX(200px); }
            100% { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                let index = Array.from(elements).indexOf(entry.target);
                if (index % 2 === 0) {
                    entry.target.classList.add(`${className}-sag`);
                } else {
                    entry.target.classList.add(`${className}-sol`);
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}, 0);  // Sayfa yüklendikten hemen sonra çalışacak şekilde ayarlandı
