/**
***  Qlik Sense Extension - Chord Diagram v1.00
***                             
***  Developped : by Matthieu BUREL
***
***  Follow me on Tweeter : @VizMatt
**/

define(["jquery", "./ChordDiagram-Properties", "./Library/d3.min", "./Library/chroma.min"], function($, properties, d3, chroma) {
  return {
       initialProperties : {
      version: 1.0,
      qHyperCubeDef : {
        qDimensions : [],
        qMeasures : [],
        qInitialDataFetch : [{
          qWidth : 3,
          qHeight : 500
        }]
      }
    },
        
    definition : properties,
 
    snapshot : {
      canTakeSnapshot : true
    },

//------------------------------------------------------------------------------ Rendering
        paint : function($element, layout) {        
//      var qData             = layout.qHyperCube.qDataPages[0];
//      var qMatrix           = qData.qMatrix;
//      var qNomb_Row           = layout.qHyperCube.qSize.qcx;
//      var qNomb_Col           = layout.qHyperCube.qSize.qcy;
//      var qProperty_xxxx        = layout.ref;
//      var qProperty_Dim1Title     = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle; 
//      var qProperty_Dim1Cardinality   = layout.qHyperCube.qDimensionInfo[0].qCardinal;
//      var qProperty_Dim2Title     = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
//      var qProperty_Dim2Cardinality   = layout.qHyperCube.qDimensionInfo[1].qCardinal;
 
      var self    = this;            
          var data    = getBiDimensionnalMatrix(layout);         
          var display   = getDisplayArray($element);  
      var label   = getLabelArray($element, layout);
          var color   = getColorArray(layout, chroma.interpolate.bezier(layout.ColorSchema.split(", ")));
      var scale   = getScaleArray(data, display[1], layout.UnitsSystem.split(", "));
  
          rendering(self, data, display, label, color, scale, $element, layout);
    }
  };
});

//--------------------------------------------------------------------------------------------------------- D3.JS & Chroma.JS Library ---------------------------
function rendering(self, matrix, display, label, fill, scale, $element, layout) {  

  var id = "container_"+ layout.qInfo.qId;
  
  if (document.getElementById(id)) {
    $("#" + id).empty();
  }
  else {
    $element.append($('<div />').attr("id", id).width($element.width()).height($element.height()));
  }

    var chart_div = d3.select("#" + id);
  
  var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

  var width = $element.width();
  var height = $element.height();
    var innerRadius = Math.min(width, height) * display[0];
    var outerRadius = innerRadius + 16;
  var selections = layout.qHyperCube.qDimensionInfo[0].qStateCounts.qSelected;
  
    var svg = chart_div.append("svg")
    .attr("width",width)
    .attr("height",height)
      .append("g")
        .attr("transform", "translate(" + (width) / 2 + "," + (height) / 2 + ")");

  var numFormat = d3.format(',')

  if(document.getElementById("tooltip_" + id)) {
    $("#tooltip_" + id).empty();
    var tooltip = d3.select("#tooltip_" + id);
  }
  else {
    var tooltip = d3.select("body")
      .append("div")
      .attr("class","tooltip")
      .attr("id","tooltip_" +id);
  }

  tooltip
    .style("position", "absolute")
    .style("padding-top", "8px")
    .style("padding-bottom", "8px")
    .style("padding-left", "18px")
    .style("padding-right", "18px")
    .style("width", "160px")
    .style("color", "#FFFFFF")
    .style("background", "#000000")
    .style("line-height", "25px")
    .style("text-align", "left")
    .style("border-radius", "6px")
    .style("opacity", ".8");
  var opacity = 0.3;
  
    var chordGroup = svg.append("g").selectAll("path")
        .data(chord.groups)
      .enter().append("path")
        .style("fill", function(d) { return fill[d.index]; })
        .style("stroke", function(d) { return d3.rgb(fill[d.index]).darker(); })
      .attr("class","chord_path")
      .attr("id", function(d, i){return "group-" + i;})
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));
    
    
          
        
    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill[d.target.index]; })
        .style("stroke", function(d) { return d3.rgb(fill[d.target.index]).darker(); })
      .style("opacity", .5);
    
    svg.append("g").selectAll("text")
        .data(chord.groups)
      .enter().append("svg:text")
         .attr("class","text_label")
         .attr("x", ".60em")
         .attr("dy", "13px")
      .append("svg:textPath")
      .attr("xlink:href", function(d, i){return "#group-" + i;})
        .text(function(d,i) {
      return label[i][2];})
      .style("font-weight", "bold")
        .style("font-size", "13px")
      .style("font-family", "sans-serif")
      .style("fill", function(d, i) { return d3.rgb(fill[i]).darker().darker().darker(); });

    var user_click_area = d3.selectAll('.text_label,.chord_path');
    var clicked_nodes = [];
   user_click_area
     .on("click",
        function(d,i) {
          var cur_i = d.index;
          if(clicked_nodes.indexOf(cur_i)>-1) {
            clicked_nodes.splice(clicked_nodes.indexOf(cur_i));
          }
          else {
            clicked_nodes.push(cur_i);
          }
          user_click_area.on("mouseover",null);
          user_click_area.on("mouseout",function(d,i) {
            tooltip.style("visibility", "hidden")
              .html("<b>"+ label[d.index][0] + '</b><br/>Total:  <span style="text-align: right;">' + numFormat(label[d.index][1]) + "</span>");
            });
          opacity = 0.1;  
          if(layout.SelectionMode == "MONO"){
            self.selectValues(0, [label[d.index][4]], true);
          }else{
            self.selectValues(0, [label[d.index][4]], true);
            self.backendApi.selectValues(1, [label[d.index][4]], true);
          }
          if(layout.SelectionMode == "MONO"){
            
            svg.selectAll(".chord path").transition().style("opacity", opacity);
            svg.selectAll(".chord path").filter(function(d) { return clicked_nodes.indexOf(d.source.index)>-1 ; }).transition().style("opacity", 1);
          }
          else {
            svg.selectAll(".chord path").transition().style("opacity", opacity);
            svg.selectAll(".chord path").filter(function(d) { return clicked_nodes.indexOf(d.target.index)>-1  && clicked_nodes.indexOf(d.source.index)>-1 ; }).transition().style("opacity", 1);
          }
        }
      )
     .on("mouseover", 
      function(d,i){
        var cur_i = d.index;
        svg.selectAll(".chord path").filter(
          function(d) { return d.target.index != cur_i && d.source.index != cur_i; }).transition().style("opacity", opacity);
        tooltip.style("visibility", "visible")
          .html("<b>"+ label[d.index][0] + '</b><br/>Total:  <span style="text-align: right;">' + numFormat(label[d.index][1]) + "</span>");})
        .on("mousemove",
      function(d,i){
        tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
          .html("<b>"+ label[d.index][0] + '</b><br/>Total:  <span style="text-align: right;">' + numFormat(label[d.index][1]) + "</span>");})
        .on("mouseout",
      function(d,i){
        var cur_i = d.index;
        svg.selectAll(".chord path").filter(
          function(d) { return d.target.index != cur_i && d.source.index != cur_i; }).transition().style("opacity", .5);
        tooltip.style("visibility", "hidden")
          .html("<b>"+ label[d.index][0] + '</b><br/>Total:  <span style="text-align: right;">' + numFormat(label[d.index][1]) + "</span>");});
        
    var ticks = svg.append("g").selectAll("g")
        .data(chord.groups)
      .enter().append("g").selectAll("g")
        .data(groupTicks)
      .enter().append("g")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + (outerRadius) + ",0)";
        });  

    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".50em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return d.label ; })
      .style("font-size",display[2]);

  function groupTicks(d) {             
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, scale[1]*scale[0]).map(function(v, i) {
      return {
      angle: v * k + d.startAngle,
      label: i % 1 ? null : Math.round(v / scale[0]) + scale[2]
      };
    });
  }
}

//--------------------------------------------------------------------------------------------------------- Custom Data function --------------------------------
// Returns a variable representing the sum of all values in the array / matrix
function getSumArray(inputMatrix) {
  var outputVariable = d3.sum(inputMatrix, function(array) {
    return d3.sum(array, Number);
  });
  return outputVariable;
}

// Returns a variable representing the min value in the array / matrix
function getMinArray(inputMatrix) {
  var outputVariable = d3.min(inputMatrix, function(array) {
    return d3.min(array, Number);
  });
  return outputVariable;
}

// Returns a variable representing the max value in the array / matrix
function getMaxArray(inputMatrix) {
  var outputVariable = d3.max(inputMatrix, function(array) {
    return d3.max(array, Number);
  });
  return outputVariable;
}

// Returns an array of distinct value
function getUniqueDimension(inputLayout) {
  var inputMatrix = inputLayout.qHyperCube.qDataPages[0].qMatrix;
  var inputMatrixSize = inputLayout.qHyperCube.qSize.qcy;
  var inputArray = []; 
  var outputArray = []; 
  for (k = 0; k < inputMatrixSize; k++) {
    var i = 2 * k;
    var j = i + 1;
    inputArray[i] = inputMatrix[k][0].qText;
    inputArray[j] = inputMatrix[k][1].qText;
  }                  
  for (var i = 0; i < inputArray.length; i++){
  if ((jQuery.inArray(inputArray[i], outputArray)) == -1){
    outputArray.push(inputArray[i]);}
  }
  return outputArray;
}

// Returns an array of 2 dimensions & 1 metric
function getBiDimensionnalTable(inputLayout) {     
  var inputMatrix = inputLayout.qHyperCube.qDataPages[0].qMatrix;
  var inputMatrixSize = inputLayout.qHyperCube.qSize.qcy;
  var outputArray = [];
  for (i = 0; i < inputMatrixSize; i++) {
    outputArray[i]  = new Array(inputMatrixSize);
    outputArray[i][0] = inputMatrix[i][0].qText;
    outputArray[i][1] = inputMatrix[i][1].qText;
    outputArray[i][2] = inputMatrix[i][2].qNum;
  }
  return outputArray;
}

// Returns an bidimensionnal matrix
function getBiDimensionnalMatrix(inputLayout) {
  var inputMatrix = inputLayout.qHyperCube.qDataPages[0].qMatrix;
  var inputTable_DistinctDimension = getUniqueDimension(inputLayout);                 
  var inputVariable_DimensionsCardinality = inputLayout.qHyperCube.qSize.qcy;   
  var inputVariable_outputMatrixSize = inputTable_DistinctDimension.length;        
  var outputMatrix = new Array(inputVariable_outputMatrixSize);
  for (i = 0; i < inputVariable_outputMatrixSize; i++) {
    outputMatrix[i]= new Array(inputVariable_outputMatrixSize);
    for (j = 0; j < inputVariable_outputMatrixSize; j++){ 
      outputMatrix[i][j] = 0;
    }
  }      
  for (i = 0; i < inputVariable_DimensionsCardinality; i++) {
    var x = inputTable_DistinctDimension.indexOf(inputMatrix[i][0].qText);
    var y = inputTable_DistinctDimension.indexOf(inputMatrix[i][1].qText);           
    outputMatrix[x][y] = inputMatrix[i][2].qNum;       
  } 
  return outputMatrix;
}

// Returns an array of color palette
function getColorArray(inputLayout, inputColorDefinition) {
  var outputArray = [0];
  var outputArray = [1, 1];
  var colorPaletteSize = getUniqueDimension(inputLayout);
  var colorPaletteStep = 1 / (colorPaletteSize.length - 1);
  for (i = 0; i < colorPaletteSize.length; i++) { outputArray[i] = inputColorDefinition(i * colorPaletteStep); }
  return outputArray;
}

// Returns an array of scale caracteristics
function getScaleArray(data, scale_Number, units) {
  var outputArray = [], i = 0, j = 0;
  var scale_Template = [1, 2, 5, 10, 20, 25, 50, 75, 100, 250, 500];
  var segment_LowerBound = 0, segment_UpperBound = Math.round(getSumArray(data)); 
  var segment_Multiplier = Math.pow(10, (Math.floor((Math.ceil(Math.log(getSumArray(data) + 1) / Math.LN10)- 2) / 3) * 3));
  var segment_Division = (((segment_UpperBound - segment_LowerBound) / segment_Multiplier)  / scale_Number); 
  outputArray[0] = segment_Multiplier;
  outputArray[1] = scale_Template[scale_Template.length - 1]; 
  for(i in scale_Template){   
    var delta = segment_Division - scale_Template[i];
    if(delta < 0 && j == 0){ outputArray[1] = scale_Template[i]; j = 1;}
  }
  switch(Math.floor((Math.ceil(Math.log(getSumArray(data) + 1) / Math.LN10)- 2) / 3)) {
    case 0: outputArray[2] = ""; break;
    case 1: outputArray[2] = units[0]; break; 
    case 2: outputArray[2] = units[1]; break; 
    case 3: outputArray[2] = units[2]; break; 
    case 4: outputArray[2] = units[3]; break; 
    case 5: outputArray[2] = units[4]; break; 
    case 6: outputArray[2] = units[5]; break; 
    case 7: outputArray[2] = units[6]; break; 
    case 8: outputArray[2] = units[7]; break; 
    case 9: outputArray[2] = units[8]; break; 
    default: outputArray[2] = ""; break;
  }
  outputArray[3] = segment_Division;
  return outputArray;
}

// Returns an array of display caracteristics
function getDisplayArray($element) {
  var display = [], size = Math.min($element.width(), $element.height());
  //Ref Size coefficient
  if (size > 400) { display[0] = .38; } else { display[0] = .28; }   
  //Adjust segment division
  if (size > 300) { display[1] = 75; } else { display[1] = 20; }
  //Adjust size of indicator 
  if (size > 350) { display[2] = "13px"; } else { display[2] = "11px"; }
  if (size < 250) { display[2] = "0px"; }
  return display;
}

// Returns an array of label to display
function getLabelArray($element, layout) {
  if (Math.min($element.width(), $element.height()) > 400) { display = 1; } else { display = .75; }
  var data = getBiDimensionnalMatrix(layout);         
  var dim = getUniqueDimension(layout);
  var circonf = Math.PI*(Math.min($element.width(), $element.height()) * 0.4 * display); 
  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
  var i, j = data.length, limit, result = [], wrap = " ", words = " ";  
  
  for (i = 0; i < j; i++) {
    limit = Math.floor(((d3.sum(data[i]) / (getSumArray(data))*circonf)*.18));
    selection = qMatrix[i][1].qElemNumber;
    if(limit > 1 && Math.min($element.width(), $element.height()) > 200) {var words = dim[i].substring(0, limit)} else {var words = ""} ;
     result[i] = [dim[i], d3.sum(data[i]), words, limit, selection];
  }   
  return result;
}