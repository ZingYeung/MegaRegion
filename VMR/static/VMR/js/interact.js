$(document).ready(function(){
	initStates();
	// getAllFlows();
});

function initStates(){
	var list = {
    "states" :
    [
    	{
    		"name": "United States",
    		"abbr": "US"
    	},
        {
            "name": "Alabama",
            "abbr": "AL"

        },
        // {
        //     "name": "Alaska",
        //     "abbr": "AK"
        // },
        // {
        //     "name": "American Samoa",
        //     "abbr": "AS"
        // },
        {
            "name": "Arizona",
            "abbr": "AZ"
        },
        {
            "name": "Arkansas",
            "abbr": "AR"
        },
        {
            "name": "California",
            "abbr": "CA"
        },
        {
            "name": "Colorado",
            "abbr": "CO"
        },
        {
            "name": "Connecticut",
            "abbr": "CT"
        },
        {
            "name": "Delaware",
            "abbr": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbr": "DC"
        },
        // {
        //     "name": "Federated States Of Micronesia",
        //     "abbr": "FM"
        // },
        {
            "name": "Florida",
            "abbr": "FL"
        },
        {
            "name": "Georgia",
            "abbr": "GA"
        },
        // {
        //     "name": "Guam",
        //     "abbr": "GU"
        // },
        // {
        //     "name": "Hawaii",
        //     "abbr": "HI"
        // },
        {
            "name": "Idaho",
            "abbr": "ID"
        },
        {
            "name": "Illinois",
            "abbr": "IL"
        },
        {
            "name": "Indiana",
            "abbr": "IN"
        },
        {
            "name": "Iowa",
            "abbr": "IA"
        },
        {
            "name": "Kansas",
            "abbr": "KS"
        },
        {
            "name": "Kentucky",
            "abbr": "KY"
        },
        {
            "name": "Louisiana",
            "abbr": "LA"
        },
        {
            "name": "Maine",
            "abbr": "ME"
        },
        // {
        //     "name": "Marshall Islands",
        //     "abbr": "MH"
        // },
        {
            "name": "Maryland",
            "abbr": "MD"
        },
        {
            "name": "Massachusetts",
            "abbr": "MA"
        },
        {
            "name": "Michigan",
            "abbr": "MI"
        },
        {
            "name": "Minnesota",
            "abbr": "MN"
        },
        {
            "name": "Mississippi",
            "abbr": "MS"
        },
        {
            "name": "Missouri",
            "abbr": "MO"
        },
        {
            "name": "Montana",
            "abbr": "MT"
        },
        {
            "name": "Nebraska",
            "abbr": "NE"
        },
        {
            "name": "Nevada",
            "abbr": "NV"
        },
        {
            "name": "New Hampshire",
            "abbr": "NH"
        },
        {
            "name": "New Jersey",
            "abbr": "NJ"
        },
        {
            "name": "New Mexico",
            "abbr": "NM"
        },
        {
            "name": "New York",
            "abbr": "NY"
        },
        {
            "name": "North Carolina",
            "abbr": "NC"
        },
        {
            "name": "North Dakota",
            "abbr": "ND"
        },
        // {
        //     "name": "Northern Mariana Islands",
        //     "abbr": "MP"
        // },
        {
            "name": "Ohio",
            "abbr": "OH"
        },
        {
            "name": "Oklahoma",
            "abbr": "OK"
        },
        {
            "name": "Oregon",
            "abbr": "OR"
        },
        // {
        //     "name": "Palau",
        //     "abbr": "PW"
        // },
        {
            "name": "Pennsylvania",
            "abbr": "PA"
        },
        // {
        //     "name": "Puerto Rico",
        //     "abbr": "PR"
        // },
        {
            "name": "Rhode Island",
            "abbr": "RI"
        },
        {
            "name": "South Carolina",
            "abbr": "SC"
        },
        {
            "name": "South Dakota",
            "abbr": "SD"
        },
        {
            "name": "Tennessee",
            "abbr": "TN"
        },
        {
            "name": "Texas",
            "abbr": "TX"
        },
        {
            "name": "Utah",
            "abbr": "UT"
        },
        {
            "name": "Vermont",
            "abbr": "VT"
        },
        // {
        //     "name": "Virgin Islands",
        //     "abbr": "VI"
        // },
        {
            "name": "Virginia",
            "abbr": "VA"
        },
        {
            "name": "Washington",
            "abbr": "WA"
        },
        {
            "name": "West Virginia",
            "abbr": "WV"
        },
        {
            "name": "Wisconsin",
            "abbr": "WI"
        },
        {
            "name": "Wyoming",
            "abbr": "WY"
        }
    ]
}
	// $.ajax({
	// 	url: 'states.json',
	// 	dataType: 'application/json',
	// 	success: function(data){
	// 		$.each(data.states, function(key, value){
	// 			$("#states_list").append(
	// 				$('<option></option>').attr({"id" : value.abbr, "value" : value.name}).html("<a>" + value.name + "</a>")
	// 			);
	// 		});
	// 	}
	// });
	$.each(list.states, function(key, value){
		$("#states_list").append(
			$('<option></option>').attr({"value": value.abbr}).html("<a>" + value.name + "</a>")
		);
	});

	document.getElementById('states_list').addEventListener('change', getCountiesByState);
}

function getCountiesByState(){
	var state = document.getElementById('states_list').value;
	if(state === 'US'){
		$("#counties_list").empty().append('<option value=""><a>None</a></option>');
		return;
	}

	$.ajax({
		url: 'http://api.sba.gov/geodata/county_data_for_state_of/'+state+'.json',
		dataType: 'json',
		success: function(data){
			$("#counties_list").empty().append('<option value=""><a>None</a></option>');
			$.each(data, function(key, value){
				$("#counties_list").append(
					$('<option></option>').attr({
						"value": value.name,
						"primary_latitude": value.primary_latitude, 
						"primary_longitude": value.primary_longitude
					}).html("<a>" + value.name + "</a>")
				);
			});
		}
	});
}

// function getAllFlows(){
//     $.ajax({
//         url: '/VMR/all_flows.json',
//         dataType: 'json',
//         success: function(data){
//             var map = google.maps.Map(document.getElementById('map'));
//             map.data.addGeoJson(data)
//         }
//     });
// }