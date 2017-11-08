const request = require('request-promise');
const config = require('../config.js');
const mongoose = require('mongoose');
const Stations = require('../models/stations.js');
var StationController  = {
    
 getStationReport: function (req, res, next) {
     refreshStationData
         .then(() => {
             getStationList
                 .then((stations) => {

                     res.render('index', {
                         title: 'Express',
                         station_list: stations,
                         mapUrl: 'http://maps.googleapis.com/maps/api/js?key=' + config.maps_api_key + '&callback=buildMapForStation'

                     })
                 })
                 .catch(next);
         }).catch(next);
    }, 
 refreshStationList: function (req, res, next) {
	 refreshStationData.then((list) => { console.log(list)})
    
	}
}

var refreshStationData = new Promise((resolve, reject) => {

    Stations.find({}).limit(1)
        .then((station_list) => {
            if (station_list.length === 0) {
                
                request.get('https://gbfs.citibikenyc.com/gbfs/en/station_information.json')
                    .then((station_information) => {
                        request.get('https://gbfs.citibikenyc.com/gbfs/en/station_status.json')
                            .then((station_status_list) => {
                                var { stations } = JSON.parse(station_information).data;
                                var station_status = JSON.parse(station_status_list).data.stations;
                                final_station_list = buildStationList(stations, station_status);
                                Stations.collection.insert(final_station_list, function (err, docs) {
                                    resolve(docs)
                                });

                            })
                            .catch(reject);
                    })
                    .catch(reject);

            } else {
                resolve(station_list);
            }
        });
   function buildStationList(station_information, station_status) {
        var station_list = [];

        for (let i = 0; i < station_information.length; i++) {
            let this_station = station_information[i];
            for (let j = 0; j < station_status.length; j++) {
                let this_station_status = station_status[j];
                if (this_station.station_id === this_station_status.station_id) {
                    station_list.push({ station_id: this_station.station_id, name: this_station.name, bikes: this_station_status.num_bikes_available, racks: this_station_status.num_docks_available, gps: { coordinates: [this_station.lon, this_station.lat] } })
                }
            }
        
        };

        return station_list;
    }

   
});

var getStationList = new Promise((resolve, reject) => {
    Stations.find({}).select('station_id name gps bikes racks').sort([['name', 'ascending']]).skip(300).limit(50)
        
        .then((station_list) => {
            //console.log(station_list);
            resolve(station_list);
        })
        .catch(reject);
})


    module.exports = StationController;