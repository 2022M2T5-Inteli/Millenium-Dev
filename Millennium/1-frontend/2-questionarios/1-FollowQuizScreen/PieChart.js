anychart.onDocumentReady(function() {
    var data = {
      header: ["Project capacity: workload"],
      rows: [
        [1, 6000],
        [2, 6128],
        [3, 6800],
        [4, 7277],
        [5, 7037],
        [6, 7000],
        [7, 5948],
        [8, 6402],
        [9, 5974],
        [10, 6175],
        [11, 6142],
        [12, 5657],
  ]};
    var chart = anychart.area();
    chart.data(data);
    chart.container('container');
    chart.draw();
  });