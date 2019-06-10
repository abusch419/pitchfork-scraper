// function to display albums of the week on the page
function displayResults(data) {
    $("#table-body").empty()
    data.forEach(function(item) {
      
      const row = $("<tr>");
      row.append(`<td>${item.artist}</td>`);
      row.append(`<td>${item.album}</td>`);
      $("#table-body").append(row);
    })
  }
  
  $.getJSON("/all", function (data) {
    displayResults(data);
  });
 