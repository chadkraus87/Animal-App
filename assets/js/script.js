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
      console.log("click");
      pets.petsCall(userLocation, petType, petSex);
    });
  },

  async fetchToken() {
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  },

  async petsCall(userLocation, petType, petSex) {
    console.log(userLocation, petType, petSex);

    try {
      const apiToken = await pets.fetchToken();
      const response = await fetch(`${petUrl}?location=${userLocation}&type=${petType}&gender=${petSex}&status=adoptable&age=senior&limit=10`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pets. Status: ${response.status}`);
      }

      const data = await response.json();
      const petResults = data.animals;
      console.log(petResults);
      availablePets.empty();
      for (let i = 0; i < petResults.length; ++i) {
        const petName = petResults[i].name;
        const petPhoto = petResults[i].photos.length
          ? petResults[i].photos[0].small
          : "https://via.placeholder.com/150";

        console.log(petName);
        console.log(petPhoto);
        availablePets.append(`<p>${petName}</p>`);
        availablePets.append(`<div><img src="${petPhoto}"></div>`);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

$(document).ready(() => {
  pets.form();
});

const YELP_API_KEY = 'LqeEnmGplttcwXf6MHGR4LpPvlKsradgguL9zoDJ2_EOZsxdnx90HASmIG97NMTVZth-jpjbNh5JEW9tA8B_3qAbEVq9Nrt_0VzEeorkT-dhi4GCtrMK5r9jhypHZHYx';

const yelp = {
  async search(zipCode) {
    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${zipCode}&radius=8000&categories=restaurants,bars&attributes=good_for_animals`;

    try {
      const response = await fetch(corsAnywhereUrl + yelpUrl, {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch businesses. Status: ${response.status}`);
      }

      const data = await response.json();
      const businesses = data.businesses;

      let html = '<ul>';
      for (let i = 0; i < businesses.length; i++) {
        const name = businesses[i].name;
        const rating = businesses[i].rating;
        const reviewCount = businesses[i].review_count;
        const address = businesses[i].location.display_address.join(', ');
        html += `<li><b>${name}</b> (${rating} stars, ${reviewCount} reviews)<br>${address}</li>`;
      }
      html += '</ul>';

      $("#restaurantResults").html(html);
    } catch (error) {
      console.log(error);
    }
  }
};

$(document).ready(() => {
  pets.form();

  $("#restaurantForm").on("submit", (e) => {
    e.preventDefault();
    const zipCode = $("#zipCode").val();
    yelp.search(zipCode);
  });
});









