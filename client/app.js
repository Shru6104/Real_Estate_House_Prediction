// Function to get the value of bathrooms
function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
          return parseInt(uiBathrooms[i].value); // Use the value of the selected bathroom
      }
  }
  return -1; // Invalid Value
}

// Function to get the value of BHK
function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
          return parseInt(uiBHK[i].value); // Use the value of the selected BHK
      }
  }
  return -1; // Invalid Value
}

// Function to handle the Estimate Price button click
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Validate input fields
  if (isNaN(sqft.value) || sqft.value <= 0) {
      alert("Please enter a valid square footage.");
      return;
  }
  if (bhk === -1) {
      alert("Please select a valid BHK.");
      return;
  }
  if (bathrooms === -1) {
      alert("Please select a valid number of bathrooms.");
      return;
  }
  if (location.value === "") {
      alert("Please select a location.");
      return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price"; // URL for the POST request

  // Log the data being sent to ensure it's correct
  console.log("Data being sent:", {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  });

  // Use $.ajax() to send the POST request as JSON
  $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',  // Set Content-Type to application/json
      data: JSON.stringify({
          total_sqft: parseFloat(sqft.value),
          bhk: bhk,
          bath: bathrooms,
          location: location.value
      }),
      success: function(data, status) {
          console.log("Received response:", data); // Log the full response object

          if (status === "success") {
              // Check if the response contains estimated_price
              if (data && data.estimated_price !== undefined) {
                  estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
              } else if (data.error) {
                  estPrice.innerHTML = "<h2>" + data.error + "</h2>"; // Show error message from backend
                  console.log("Error from backend:", data.error);
              } else {
                  estPrice.innerHTML = "<h2>Unable to estimate price. Please try again.</h2>";
                  console.log("Error: Estimated price is undefined.");
              }
          } else {
              alert("Error fetching the estimated price.");
          }
      },
      error: function() {
          alert("Error connecting to the backend.");
      }
  });
}

// Function to load locations when the page loads
function onPageLoad() {
  console.log("document loaded");

  //var url = "http://127.0.0.1:5000/get_location_names"; // URL for the GET request to fetch locations
  var url = "/api/predict_home_price";
  $.get(url, function(data, status) {
      console.log("got response for get_location_names request");

      if (data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty(); // Clear existing options

          // Populate the location dropdown with the fetched locations
          for (var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  }).fail(function() {
      alert("Error loading locations.");
  });
}

// Run the onPageLoad function when the window is loaded
window.onload = onPageLoad;
