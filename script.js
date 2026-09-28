// ===== Get the elements we need =====
const rocket = document.getElementById("rocket");
const earth = document.getElementById("earth");
const moon = document.getElementById("moon");
const space = document.querySelector(".space");
const stars = document.querySelectorAll(".stars");
const progressBar = document.getElementById("progress");
const hills = document.querySelectorAll(".hill");
const clouds = document.querySelectorAll(".cloud");
const revealItems = document.querySelectorAll(".reveal");
const topButton = document.getElementById("top-button");

// ===== Helper functions =====

// Keeps a number between a min and max value
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Returns how far a section has scrolled into view (0 = just appearing, 1 = one screen past)
function getSectionProgress(section) {
  const top = section.getBoundingClientRect().top;
  return clamp((window.innerHeight - top) / window.innerHeight, 0, 1.5);
}

// ===== Runs every time the user scrolls =====
function onScroll() {
  const scrollY = window.scrollY;
  const pageHeight = document.body.scrollHeight - window.innerHeight;
  const percent = scrollY / pageHeight; // 0 at the top, 1 at the bottom

  // 1. Progress bar
  progressBar.style.width = percent * 100 + "%";

  // 2. The sky fades into space and the stars come out
  space.style.opacity = clamp((percent - 0.2) * 3, 0, 1);
  stars.forEach(function (layer) {
    layer.style.opacity = clamp((percent - 0.35) * 3, 0, 1);
  });

  // 3. Rocket lifts off, speeding up and shrinking as it leaves
  const lift = scrollY * 1.2;
  const shrink = clamp(1 - scrollY / 1500, 0.5, 1);
  rocket.style.transform = "translateY(" + -lift + "px) scale(" + shrink + ")";

  // 4. Parallax hills: each layer moves down at its own speed
  hills.forEach(function (hill) {
    hill.style.transform = "translateY(" + scrollY * hill.dataset.speed + "px)";
  });

  // 5. Parallax clouds: each cloud slides sideways at its own speed
  clouds.forEach(function (cloud) {
    const distance = scrollY - cloud.parentElement.offsetTop;
    cloud.style.transform = "translateX(" + distance * cloud.dataset.speed + "px)";
  });

  // 6. Earth shrinks and spins as we leave it behind
  const earthProgress = getSectionProgress(earth.parentElement);
  earth.style.transform = "scale(" + (1.3 - earthProgress * 0.6) + ") rotate(" + scrollY * 0.05 + "deg)";

  // 7. The Moon rises and grows as we get closer
  const moonProgress = clamp(getSectionProgress(moon.parentElement), 0, 1);
  moon.style.transform = "translateY(" + (1 - moonProgress) * 200 + "px) scale(" + (0.5 + moonProgress * 0.5) + ")";

  // 8. Reveal text when it comes onto the screen
  revealItems.forEach(function (item) {
    if (item.getBoundingClientRect().top < window.innerHeight * 0.85) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", onScroll);
window.addEventListener("resize", onScroll);
onScroll();

// ===== Back to top button =====
topButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
