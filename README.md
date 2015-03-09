QlikSense_ChordDiagram
======================

Qlik Sense extension displaying the inter-relationships between data : http://en.wikipedia.org/wiki/chord_diagram

The extension is based on : 
- D3.js, using Mike Bostock's Chord Diagram : http://goo.gl/Kymhud 
- Chroma.js, using Gregor Aisch's color palette generator : http://goo.gl/A6RPWo

![Visualization](https://github.com/VizMatt/QlikSense_ChordDiagram/blob/master/Screenshots/QlikSense%20Extension%20-%20ChordDiagram%20Demo.png)


*********************************
How to read it
======================
1. A chord represents a dependency between data (ex: from "Europe" to "North America").

2. The chord base width is proportional to the value of the indicator based on the first dimension (ex : Departure from "Europe" = 41,290).

3. The chord color represents the balance of power between data, it take the color of the weakest (ex: Chord "Europe - Africa" use the color of "Africa").


*********************************
Installation & Use
*********************************
A Sense App is available in the package ("\Apps") : drag & drop qvf in the Sense Hub to open it

![Visualization](https://github.com/VizMatt/QlikSense_ChordDiagram/blob/master/Screenshots/QlikSense%20Extension%20-%20ChordDiagram%20Demo.gif)

1- Download the content and copy the ChordDiagram directory into your personnal directory
>C:\Users<user name>\Documents\Qlik\Sense\Extensions\<
(where is your personal user name on Windows)

2- Open Qlik Sense, create a new visualization app and edit a sheet to include the Chord Diagram object which should now be available in your list of chart types.

3- Drag and Drop firstly the "From / Departure" dimension, secondly the "To / Arrival" dimension and finally the metric.

4- To finish, customize the object ith the "Units system" & "Color & legend" properties.
