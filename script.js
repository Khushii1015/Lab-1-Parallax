// Get the elements we need
const rocket = document.getElementById("rocket");
const earth = document.getElementById("earth");
const moon = document.getElementById("moon");
const space = document.querySelector(".space");
const stars = document.querySelector(".stars");
const progressBar = document.getElementById("progress");
const clouds = document.querySelectorAll(".cloud");
const revealItems = document.querySelectorAll(".reveal");
const topButton = document.getElementById("top-button");

// This function runs every time the user scrolls
function onScroll() {
  const scrollY = window.scrollY;
  const screenHeight = window.innerHeight;
  const pageHeight = document.body.scrollHeight - screenHeight;

  // How far down the page we are (0 = top, 1 = bottom)
  const percent = scrollY / pageHeight;

  // 1. Progress bar
  progressBar.style.width = percent * 100 + "%";

  // 2. The sky turns into space
  space.style.opacity = (percent - 0.2) * 2.5;
  stars.style.opacity = (percent - 0.4) * 3;

  // 3. The rocket flies up out of the first section
  rocket.style.transform = "translateY(" + scrollY * -0.8 + "px)";

  // 4. Parallax clouds: each cloud moves sideways at its own speed
  clouds.forEach(function (cloud) {
    const speed = cloud.dataset.speed;
    const cloudSection = cloud.parentElement;
    const distance = scrollY - cloudSection.offsetTop;
    cloud.style.transform = "translateX(" + distance * speed + "px)";
  });

  // 5. Earth gets smaller as we leave it
  const earthSection = earth.parentElement;
  let earthProgress = (scrollY - earthSection.offsetTop + screenHeight) / screenHeight;
  earthProgress = Math.min(Math.max(earthProgress, 0), 1.5);
  earth.style.transform = "scale(" + (1.3 - earthProgress * 0.6) + ") rotate(" + scrollY * 0.05 + "deg)";

  // 6. The Moon rises up and gets bigger as we get closer
  const moonSection = moon.parentElement;
  let moonProgress = (scrollY - moonSection.offsetTop + screenHeight) / screenHeight;
  moonProgress = Math.min(Math.max(moonProgress, 0), 1);
  moon.style.transform = "translateY(" + (1 - moonProgress) * 200 + "px) scale(" + (0.5 + moonProgress * 0.5) + ")";

  // 7. Show text when it comes onto the screen
  revealItems.forEach(function (item) {
    const top = item.getBoundingClientRect().top;
    if (top < screenHeight * 0.85) {
      item.classList.add("show");
    }
  });
}

// Run the function when the page scrolls and once when it loads
window.addEventListener("scroll", onScroll);
onScroll();

// Back to top button
topButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
