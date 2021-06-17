const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metálica'));
bands.addBand(new Band('New Band'));

// Sockets messages
io.on('connection', client => {
    console.log('Cliente connected');

    // Cuando un cliente se conecta, se emiten las bandas activas.
    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
    // Listen event
    client.on('message', (payload) => {
        console.log('Message!!', payload);
        // Emitir un mensaje a todos los clientes conectados
        io.emit('message', { admin: 'New message' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands() );
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands() );
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands() );
    });

    // client.on('emit-message', (payload) => {
    //     // Emitir un mensaje a todos los clientes conectados
    //     client.broadcast.emit('new-message', payload);
    // });
});