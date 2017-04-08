const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StationSchema = new Schema({
    station_id: Number,
    name: String,
    gps: new Schema({ coordinates: { type: [Number], index: '2dsphere' }, type: { type: String, default: 'Point' } }),
    bikes: Number,
    racks: Number
});


const Station = mongoose.model('stations', StationSchema);

module.exports =Station;