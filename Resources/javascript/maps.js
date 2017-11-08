
function buildMapForStation() {

    var map = new google.maps.Map(document.getElementById('stationMap'),
        {
            zoom: 15
        });



    $('select option').each(function (i, option) {
        var $option = $(option);
		
			var marker = new google.maps.Marker({
				position: { lat: Number($option.data('lat')), lng: Number($option.data('lng')) },
				title: $option.data('name'),
				label: $option.data('bikes').toString(),
				map: map
			});
			marker.addListener('click', function () {
				setScreen($(option).val(), true);
				$('#station').selectmenu('refresh');

			});
			marker.addListener('mouseover', function () { setScreen($option.val()); $('#station').selectmenu('refresh'); $('#meter').show('Puff'); $('#meter').progressbar({ value: getStationFullPct($option.data().bikes, $option.data().racks) }); })
			let isHome = ($option.val() === '3288');
			if (isHome) {
				setScreen($option.val(), true);
				
				$('#meter').progressbar({
					value: getStationFullPct($option.data().bikes, $option.data().racks)
				});
			};

			marker.addListener('mouseout', function () { $('#meter').hide() });

        
		$('#station').selectmenu({
			change: (event, ui) => {
				//$("#station option[value='"+ ui.item.value + "']").attr('selected', true)
				setScreen(ui.item.value, true);
			}
		});
    });
	$('#station').selectmenu('refresh');

	

    function setScreen(value, recenterMap) {
        $('#station').val(value);
        let $option = $("#station option[value='" + value + "']");
        $('#racksAvailable').html(`Open Racks: ${$option.data().racks}`);
        $('#bikesAvailable').html(`Bikes Available: ${$option.data().bikes}`);
        if (recenterMap) {
            map.setCenter({ lat: $option.data().lat, lng: $option.data().lng });
        }

    }
}


function refreshPage() {
    $.ajax({
        type: "POST",
        url: "/refreshStations",
        data: { start_station_id: $('#station').val() }
    })
}
function getStationFullPct(bikes, racks) {
    return Math.floor((bikes / (bikes + racks)) * 100)
}


