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
  console.log(newSample);

  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

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

// 1. (Deliverable 1) - Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    console.log(data);
    let samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter((sampleObj) => sampleObj.id == sample);

    let metadata = data.metadata;
    let metadataResultArray = metadata.filter(
      (sampleObj) => sampleObj.id == sample
    );

    let metadataResult = metadataResultArray[0];
    console.log(metadataResult);

    //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids
    .slice(0, 10)
    .map((otuID) => `OTU ${otuID}`)
    .reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values,
        text: otu_labels,
        type: "bar",
        orientation: "h",
      },
    ];

    // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: `Top 10 Most Prevalent Bacteria in Sample ${sample}`,
        yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      
        }
      }
   
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});
  })}


// (Deliverable 2) - Bar and Bubble charts
// Create the buildCharts function
function buildCharts(sample) {
  
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // 1. Create the trace for the bubble chart.
    // I also consulted https://plotly.com/javascript/colorscales/ for colorscales
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Jet",
        },
      },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `Bacteria Cultures in Each Sample ${sample}`,
      showlegend: false,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count" },
      automargin: true,
      hovermode: "closest"
  };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 

    var samples = data.samples;
  })}


  // Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    // Create a variable that filters the samples for the object with the desired sample number.

    // (Deliverable 3) -
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample); 

    var gaugeResult = gaugeArray[0];  

    // 2. Create a variable that holds the first sample in the metadata array.
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var wfreqs = gaugeResult.wfreq;
    console.log(wfreqs)

    // 3. Create a variable that holds the washing frequency.
    let washFreq = parseFloat(metadataResult.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: washFreq,
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week",
          font: { size: 24 },
        },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "blue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "green" },
          ],
        },
      },
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      text: "Weekly Belly Button Wash Frequency",
      font: { color: "black", family: "Arial" },
      showarrow: false
    };


    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  
  }