function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata)
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// (Deliverable 1) - Bar Chart
// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples
    console.log(samples_array)

    var filteredSamples = samples_array.filter(sample_number => sample_number.id==sample);
    //console.log(filteredSamples);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var result = filteredMetadata[0];

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    //  5. Create a variable that holds the first sample in the array 
    var firstSamples = filteredSamples[0]  
    console.log (firstSamples)    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSamples.otu_ids
    var otu_labels = firstSamples.otu_labels
    var sample_values = firstSamples.sample_values
    var washingFrequency = parseFloat(result.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var topTen = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    //var topTen = firstSamples.slice(0,10).map(<mapping function>).reverse();
      
    // 8. Create the trace for the bar chart. 
    var trace =[{
      y: topTen,
      x: sample_values.slice(0,10).reverse(),
      type: "bar",
      orientation: 'h'
    }];

    // 9. Create the layout for the bar chart. 
    var barlayout = {
      title: "Belly Button Biodiversity Dashboard",
      xaxis: {title: "Sample values" },
      yaxis: {title: "Otu ids"},
      paper_bgcolor: "#7fff00",

    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barlayout);



//(Deliverable 2)
// 1. Create the trace for the bubble chart.
// I also consulted https://plotly.com/javascript/colorscales/ for colorscales
var trace =       {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: "markers",
  marker: {
    size: sample_values,
    color: otu_ids,
    colorscale: "Jet",
  }
}
var bubbleData = [trace];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: "Bacteria Cultures in Each Sample",
  xaxis: {title: "Otu ids" },
  yaxis: {title: "Sample Values"},
  paper_bgcolor: "#7fff00",
  };
  
// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// (Deliverable 3)

// 4. Create the trace for the gauge chart.
var gaugeData = [{
  domain: { x: [0, 1], y: [0, 1] },
  value: washingFrequency,
  type: "indicator",
  mode: "gauge+number",
  title: { text: "Bellybutton Washing Frequency", font: { size: 20 } },
  gauge: {
    axis: { range: [null, 10] },
    bar: { color: "black"},
    steps: [
      { range: [0, 1], color: "red" },
      { range: [1, 2], color: "pink" },
      { range: [2, 3], color: "orange" },
      { range: [3, 4], color: "yellow" },
      { range: [4, 5], color: "limegreen"},
      { range: [5, 6], color: "green" },
      { range: [6, 7], color: "cyan" },
      { range: [7, 8], color: "turquoise" },
      { range: [8, 9], color: "blue" },
      { range: [9, 10], color: "purple" }
  
  
    ],
  }
}
];

       
// 5. Create the layout for the gauge chart.
var gaugeLayout = {
  width: 300,
  height: 225,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  paper_bgcolor: "chartreuse",
  font: { color: "black", family: "Arial" }
}; 
 

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
}
