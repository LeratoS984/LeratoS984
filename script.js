// NJ Studio shared JavaScript
(function () {
    "use strict";

    const showToast = (message) => {
        let toast = document.querySelector(".toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    };

    const initActiveNavigation = () => {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll("nav a").forEach((link) => {
            const href = link.getAttribute("href");

            if (href === currentPage || (currentPage === "" && href === "index.html")) {
                link.classList.add("active");
            }
        });
    };

    const initMobileMenu = () => {
        const navContent = document.querySelector(".nav_content");
        const navList = document.querySelector("nav ul");

        if (!navContent || !navList) {
            return;
        }

        const button = document.createElement("button");
        button.className = "menu-toggle";
        button.type = "button";
        button.setAttribute("aria-label", "Toggle navigation menu");
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = "<span></span>";
        navContent.insertBefore(button, navList);

        button.addEventListener("click", () => {
            const isOpen = document.body.classList.toggle("menu-open");
            button.setAttribute("aria-expanded", String(isOpen));
        });

        navList.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                document.body.classList.remove("menu-open");
                button.setAttribute("aria-expanded", "false");
            }
        });
    };

    const initHomeButton = () => {
        const button = document.querySelector(".work_with_me");

        if (button) {
            button.addEventListener("click", () => {
                window.location.href = "contacts.html";
            });
        }
    };

    const initContactForm = () => {
        const form = document.querySelector(".contact-left form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const inputs = Array.from(form.querySelectorAll("input, textarea"));
            const emptyField = inputs.find((field) => field.value.trim() === "");

            if (emptyField) {
                emptyField.focus();
                showToast("Please complete all fields before sending.");
                return;
            }

            const email = inputs.find((field) => field.placeholder.toLowerCase().includes("gmail"));

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.focus();
                showToast("Please enter a valid email address.");
                return;
            }

            showToast("Thank you. Your request is ready for NJ Studio to review.");
            form.reset();
        });
    };

    const initGalleryLightbox = () => {
        const images = Array.from(document.querySelectorAll("#spinner img"));
        let currentIndex = 0;
        let zoomLevel = 1;

        if (images.length === 0) {
            return;
        }

        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.innerHTML = '<div class="lightbox-backdrop" aria-hidden="true"></div><button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button><div class="lightbox-zoom-controls" aria-label="Zoom controls"><button class="lightbox-zoom-out" type="button" aria-label="Zoom out">-</button><button class="lightbox-zoom-in" type="button" aria-label="Zoom in">+</button></div><button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous image">&#10094;</button><img alt=""><button class="lightbox-arrow lightbox-next" type="button" aria-label="Next image">&#10095;</button>';
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector("img");
        const backdrop = lightbox.querySelector(".lightbox-backdrop");
        const closeButton = lightbox.querySelector(".lightbox-close");
        const prevButton = lightbox.querySelector(".lightbox-prev");
        const nextButton = lightbox.querySelector(".lightbox-next");
        const zoomInButton = lightbox.querySelector(".lightbox-zoom-in");
        const zoomOutButton = lightbox.querySelector(".lightbox-zoom-out");

        const applyZoom = () => {
            lightboxImage.style.transform = `scale(${zoomLevel})`;
            lightboxImage.style.cursor = zoomLevel > 1 ? "zoom-out" : "zoom-in";
        };

        const setZoom = (level) => {
            zoomLevel = Math.min(Math.max(level, 1), 3);
            applyZoom();
        };

        const resetZoom = () => {
            zoomLevel = 1;
            applyZoom();
        };

        const startBackgroundSlideshow = (selectedImage) => {
            backdrop.innerHTML = "";

            const backgroundImages = images.filter((image) => image !== selectedImage);
            const track = document.createElement("div");
            track.className = "lightbox-track";

            [...backgroundImages, ...backgroundImages].forEach((image) => {
                const slide = document.createElement("img");
                slide.className = "lightbox-slide";
                slide.src = image.src;
                slide.alt = "";
                track.appendChild(slide);
            });

            if (backgroundImages.length === 0) {
                return;
            }

            backdrop.appendChild(track);
        };

        const showImage = (index) => {
            currentIndex = (index + images.length) % images.length;
            const image = images[currentIndex];
            resetZoom();
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || "NJ Studio gallery image";
            startBackgroundSlideshow(image);
        };

        const openLightbox = (image) => {
            showImage(images.indexOf(image));
            lightbox.classList.add("open");
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove("open");
            lightboxImage.removeAttribute("src");
            backdrop.innerHTML = "";
            resetZoom();
        };

        const showPreviousImage = () => {
            showImage(currentIndex - 1);
        };

        const showNextImage = () => {
            showImage(currentIndex + 1);
        };

        const gallery = document.querySelector("#spinner");

        gallery.addEventListener("click", (event) => {
            const image =
                event.target.closest("#spinner img") ||
                event.target.closest(".gallery-link")?.querySelector("img") ||
                event.target.closest(".gallery")?.querySelector("img") ||
                event.target.closest(".responsive")?.querySelector("img");

            if (!image) {
                return;
            }

            event.preventDefault();
            openLightbox(image);
        });

        images.forEach((image) => {
            image.style.cursor = "zoom-in";
            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", "Open image preview");
            image.setAttribute("title", "Click to view this picture");

            image.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
        });

        closeButton.addEventListener("click", closeLightbox);
        prevButton.addEventListener("click", showPreviousImage);
        nextButton.addEventListener("click", showNextImage);
        zoomInButton.addEventListener("click", () => setZoom(zoomLevel + 0.25));
        zoomOutButton.addEventListener("click", () => setZoom(zoomLevel - 0.25));
        lightboxImage.addEventListener("click", () => {
            setZoom(zoomLevel > 1 ? 1 : 1.75);
        });
        lightboxImage.addEventListener("wheel", (event) => {
            event.preventDefault();
            setZoom(zoomLevel + (event.deltaY < 0 ? 0.15 : -0.15));
        });

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("open")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowLeft") {
                showPreviousImage();
            } else if (event.key === "ArrowRight") {
                showNextImage();
            } else if (event.key === "+" || event.key === "=") {
                setZoom(zoomLevel + 0.25);
            } else if (event.key === "-") {
                setZoom(zoomLevel - 0.25);
            } else if (event.key === "0") {
                resetZoom();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        initActiveNavigation();
        initMobileMenu();
        initHomeButton();
        initContactForm();
        initGalleryLightbox();
    });
})();
