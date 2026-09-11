document.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll(".onepage-nav a[href^='#']")];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.querySelector("#navbarNav.show");
      if (menu && window.jQuery) {
        window.jQuery(menu).collapse("hide");
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal-section").forEach((section) => revealObserver.observe(section));

  const publicationCategories = {
    kwon2026herald: "ml-systems",
    kwon2026mage: "ml-algorithms",
    lee2025nestedfp: "ml-systems",
    kim2025aide: "computer-architecture",
    kwon2025star: "computer-architecture",
  };
  const publicationCategoryLabels = {
    "ml-systems": "ML Systems",
    "ml-algorithms": "ML Algorithms",
    "computer-architecture": "Computer Arch.",
  };
  const filterButtons = [...document.querySelectorAll("[data-publication-filter]")];
  const publicationItems = Object.entries(publicationCategories)
    .map(([id, category]) => {
      const item = document.getElementById(id)?.closest("li");
      if (item) {
        item.dataset.publicationCategory = category;

        const thumbnail = item.querySelector(".abbr");
        if (thumbnail) {
          const categoryTag = document.createElement("span");
          categoryTag.className = "publication-area-tag";
          categoryTag.dataset.publicationCategory = category;
          categoryTag.textContent = publicationCategoryLabels[category];
          thumbnail.prepend(categoryTag);
        }
      }
      return item;
    })
    .filter(Boolean);
  const emptyMessage = document.querySelector(".publication-filter-empty");

  const updatePublicationFilters = () => {
    const activeCategories = new Set(
      filterButtons.filter((button) => button.getAttribute("aria-pressed") === "true").map((button) => button.dataset.publicationFilter)
    );
    let visibleCount = 0;

    publicationItems.forEach((item) => {
      const isVisible = activeCategories.has(item.dataset.publicationCategory);
      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isActive));
      button.classList.toggle("is-active", !isActive);
      updatePublicationFilters();
    });
  });

  updatePublicationFilters();
});
