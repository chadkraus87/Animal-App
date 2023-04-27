const apiKey = "koiPttYEv8zC3GNcbp6KImr8XI1IUdRJUJPnKb4E7NNFqw7dJM";
const apiToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJrb2lQdHRZRXY4ekMzR05jYnA2S0ltcjhYSTFJVWRSSlVKUG5LYjRFN05ORnF3N2RKTSIsImp0aSI6ImJlM2E0MTY3YjIyNGMxY2U4N2E3NzNmNTcwYTNiNmY2Y2U4OThhNDMzZWQxNzUzNzM3MzVmNDBlZTkyOTA3NDA0YjJmYzI4YjM4ZGY0NDQxIiwiaWF0IjoxNjgyNjE1OTg1LCJuYmYiOjE2ODI2MTU5ODUsImV4cCI6MTY4MjYxOTU4NSwic3ViIjoiIiwic2NvcGVzIjpbXX0.FFEiobG-qT9v0C8BhRpoxx4JV3KItBptSsF8scZAFO3a-YtM9TWwLNkTvnERYLpPMsNFhsVfA9IVoiRqLfpA1H6qxmgFkoG-THWfkW90_zNVIWP_s7bW3WEcOh9GOTLj2D1wtFFtLa6l6uSNdpFC7LSDCvyBDImk-zFGOpWh-rCo8lLF_LNTtF8idSj2lI40rI1dLz9dtAwAS7u6AispFvStF3MP1UAoSJM8CQmU49mJOFoKGDW1JNDx6KXUHSv9wubfw7hct782S5dCSHoYfsRXwOWL68r-zaSUaWnG7Ri9FvRH7HP8LDKUut7kRnkK5AOVEeSRGp1ou1ctmxVhDA";
const petUrl = "https://api.petfinder.com/v2/animals";
const availablePets = $("#availablePets");

const pets = {
  form() {
    $("#petForm").on("submit", (e) => {
      e.preventDefault();
      const userLocation = $(".currentLocation").val();
      const petType = $("select#petType option:checked").val();
      const petSex = $("select#petSex option:checked").val();
      console.log("click");
      pets.petsCall(userLocation, petType, petSex);
    });
  },

  petsCall(userLocation, petType, petSex) {
    console.log(userLocation, petType, petSex);
    $.ajax({
      url: petUrl,
      method: "GET",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      data: {
        location: userLocation,
        type: petType,
        gender: petSex,
        status: "adoptable",
        age: "senior",
        limit: 10,
      },
      success: (results) => {
        const petResults = results.animals;
        console.log(petResults);
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
      },
      error: (error) => {
        console.log(error);
      },
    });
  },
};

$(document).ready(() => {
  pets.form();
});
