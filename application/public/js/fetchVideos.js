let numPhotos = 0;
const counter = document.getElementById("post-counter");

function updatePostCount() {
  // Display the number of photos being displayed
  counter.textContent = `The ${numPhotos} latests posts`;
}

function decrementPostCount() {
  numPhotos--;
  updatePostCount();
}

// Get a reference to the HTML element where we'll display the photos
const postsListContainer = document.getElementById("posts-list");

// Fetch the photos from the API
fetch("https://jsonplaceholder.typicode.com/albums/2/photos")
  .then((response) => response.json())
  .then((photos) => {
    numPhotos = photos.length;
    updatePostCount();

    // Loop through the photos and create HTML elements for each one
    photos.forEach((photo) => {
      // Create a div to hold the photo and title
      const photoDiv = document.createElement("li");
      photoDiv.className = "post";

      photoDiv.addEventListener("click", function () {
        // Trigger fadeout animation using CSS
        photoDiv.style.animation = "fade-out 1s";
        // Wait for fadeout animation to complete
        setTimeout(() => {
          // Remove element from DOM
          photoDiv.remove();

          // Update photo count
          decrementPostCount();
        }, 1000); // Wait for 1 second for fadeout animation to complete
      });

      // Create an image element for the photo
      const photoImg = document.createElement("img");
      photoImg.src = photo.url;
      photoImg.alt = photo.title;
      photoDiv.appendChild(photoImg);

      // Create a p element for the title
      const titleElement = document.createElement("h3");
      titleElement.textContent = photo.title;
      photoDiv.appendChild(titleElement);

      // Add the photo div to the container element
      postsListContainer.appendChild(photoDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching photos:", error);
  });
