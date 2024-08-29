document.addEventListener("DOMContentLoaded", () => {
    const ratingElements = document.querySelectorAll(".rating");

    ratingElements.forEach((el) => {
      const rating = parseFloat(el.getAttribute("data-rating"));
      el.innerHTML = renderStars(rating);
      el.classList.add("animate-rating");
    });
  });

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fa fa-star star"></i>';
    }

    if (halfStar) {
      stars += '<i class="fa fa-star-half-alt star"></i>';
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      stars += '<i class="fa fa-star star-empty"></i>';
    }

    return stars;
  }