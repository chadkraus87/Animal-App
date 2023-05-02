const apiKey = "koiPttYEv8zC3GNcbp6KImr8XI1IUdRJUJPnKb4E7NNFqw7dJM";
const apiSecret = "hma7lW4o0Qlcj2qjBnY0hHSTTeml2dqRTckHTc56";

const petUrl = "https://api.petfinder.com/v2/animals";
const availablePets = $("#availablePets");

const pets = {
  async form() {
    $("#petForm").on("submit", (e) => {
      e.preventDefault();
      const userLocation = $(".currentLocation").val();
      const petType = $("select#petType option:checked").val();
      const petSex = $("select#petSex option:checked").val();
      const petSize = $("select#petSize option:checked").val();
      console.log("click");
      pets.petsCall(userLocation, petType, petSex, petSize);
      $(".currentLocation").val("");
    });
  },

  // Call to request new authorization token from PetFinder.
  async fetchToken() {
    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch access token. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.access_token;
  },

  async petsCall(userLocation, petType, petSex, petSize) {
    console.log(userLocation, petType, petSex, petSize);

    try {
      const apiToken = await pets.fetchToken();
      const response = await fetch(
        `${petUrl}?location=${userLocation}&type=${petType}&gender=${petSex}&size=${petSize}&status=adoptable&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pets. Status: ${response.status}`);
      }

      const data = await response.json();
      const petResults = data.animals;
      console.log(petResults);
      availablePets.empty();
      for (let i = 0; i < petResults.length; ++i) {
        const petName = petResults[i].name;
        const petAge = petResults[i].age;
        const petSize = petResults[i].size;
        const petBreed = petResults[i].breeds.primary;
        const petSpayedNeutered = petResults[i].attributes.spayed_neutered;
        const petPhoto = petResults[i].photos.length
          ? petResults[i].photos[0].medium
          : "./assets/images/comingsoon300.png";
        const petUrl = petResults[i].url;

        console.log(petName);
        console.log(petAge);
        console.log(petSize);
        console.log(petPhoto);
        console.log(petBreed);
        console.log(petSpayedNeutered);
        availablePets.append(`
        <div class="pet-card">
          <a href="${petUrl}" target="_blank">
            <p>Name: ${petName} | Age: ${petAge} | Size: ${petSize} | Breed: ${petBreed} | Spayed/Neutered: ${petSpayedNeutered}</p>
            <div><img src="${petPhoto}"></div>
          </a></div>
        `);
      }
    } catch (error) {
      console.log(error);
    }
  },
};

$(document).ready(() => {
  pets.form();
});

// Start Yelp API call.
const YELP_API_KEY =
  "LqeEnmGplttcwXf6MHGR4LpPvlKsradgguL9zoDJ2_EOZsxdnx90HASmIG97NMTVZth-jpjbNh5JEW9tA8B_3qAbEVq9Nrt_0VzEeorkT-dhi4GCtrMK5r9jhypHZHYx";

// Implementing CORS Anywhere to handle successful redirects.
const yelp = {
  async search(zipCode) {
    const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
    const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${zipCode}&radius=8000&categories=restaurants,bars&attributes=good_for_animals`;

    try {
      const response = await fetch(corsAnywhereUrl + yelpUrl, {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch businesses. Status: ${response.status}`
        );
      }

      const data = await response.json();
      const businesses = data.businesses;

      let html = "<ul>";
      for (let i = 0; i < businesses.length; i++) {
        const name = businesses[i].name;
        const rating = businesses[i].rating;
        const reviewCount = businesses[i].review_count;
        const address = businesses[i].location.display_address.join(", ");
        const yelpUrl = businesses[i].url;
        html += `<li><b><a href="${yelpUrl}" target="_blank">${name}</a></b> (${rating} stars, ${reviewCount} reviews)<br>${address}</li>`;
      }
      html += "</ul>";

      $("#restaurantResults").html(html);
      $("#zipCode").val("");

      // Store the searched zip code in local storage.
      const previousZipCodes =
        JSON.parse(localStorage.getItem("previousZipCodes")) || [];
      if (!previousZipCodes.includes(zipCode)) {
        previousZipCodes.push(zipCode);
      }
      localStorage.setItem(
        "previousZipCodes",
        JSON.stringify(previousZipCodes)
      );

      // Update list of previously searched zip codes.
      const updatedPreviousZipCodes = JSON.parse(
        localStorage.getItem("previousZipCodes")
      );
      const updatedHtml = updatedPreviousZipCodes
        .map(
          (zipCode) =>
            `<li><a href="#" class="previous-zip-code">${zipCode}</a></li>`
        )
        .join("");
      $("#previousZipCodes").html(updatedHtml);
    } catch (error) {
      console.log(error);
    }
  },
};

$(document).ready(() => {
  // Load previously searched zip codes from local storage.
  const previousZipCodes =
    JSON.parse(localStorage.getItem("previousZipCodes")) || [];
  const html = previousZipCodes
    .map(
      (zipCode) =>
        `<li><a href="#" class="previous-zip-code">${zipCode}</a></li>`
    )
    .join("");
  $("#previousZipCodes").html(html);

  // Handle click on previously searched zip code link.
  $("#previousZipCodes").on("click", ".previous-zip-code", function (e) {
    e.preventDefault();
    const zipCode = $(this).text();
    yelp.search(zipCode);
  });

  $("#restaurantForm").on("submit", (e) => {
    e.preventDefault();
    const zipCode = $("#zipCode").val();
    yelp.search(zipCode);
  });
});
