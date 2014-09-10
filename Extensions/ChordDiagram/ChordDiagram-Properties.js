/**
***  Qlik Sense Extension - Chord Diagram v1.00
***															
***  Developped : by Matthieu BUREL
***
***  Follow me on Tweeter : @VizMatt
**/

define( [], function () {
	return {
		type : "items",
		component : "accordion",
		items : {
			dimensions : {
				uses : "dimensions",
				min : 2,
				max:2
			},
			measures : {
				uses : "measures",
				min : 1,
				max: 1
			},
			sorting : {
				uses : "sorting"
			},    
			settings: {
				uses: "settings",
				items:{
				selection:{
					  ref: "SelectionMode",
					  type: "string",
					  component: "dropdown",
					  label: "Selection Mode",
					  options: 
						[ {
							value: "MONO",
							label: "1st Dimension Only"
						}, {
							value: "DUAL",
							label: "Both Dimensions"
						}],
					  defaultValue: "MONO"
				  },
				units:{
					  ref: "UnitsSystem",
					  type: "string",
					  component: "dropdown",
					  label: "Units system",
					  options: 
						[ {
							value: "k, M, G, T, P, E, Z, Y",
							label: "Scientific Scale"
						}, {
							value: "k, m, bi, ti, q, E, Z, Y",
							label: "Short Scale"
						}, {
							value: "k, m, mi, b, bi, t, ti, q",
							label: "Long Scale"
						}],
					  defaultValue: "k, M, G, T, P, E, Z, Y"
				  },
				  colors: {
					  ref: "ColorSchema",
					  type: "string",
					  component: "dropdown",
					  label: "Color and legend",
					  options: 
						[ {
							value: "#fff7bb, #fca835, #ee7617, #cb4b02, #993404",
							label: "Sequencial"
						}, {
							value: "#993404, #cb4b02, #ee7617, #fca835, #fff7bb",
							label: "Sequencial (Reverse colors)"
						}, {
							value: "#3d53a2, #77b7e5, #e7f1f6, #f9bd7e, #d24d3e",
							label: "Diverging"
						}, {
							value: "#d24d3e, #f9bd7e, #e7f1f6, #77b7e5, #3d53a2",
							label: "Diverging (Reverse colors)"
						}],
					  defaultValue: "#fff7bb, #fca835, #ee7617, #cb4b02, #993404"
				   }
				}
			}
		}
	}
});