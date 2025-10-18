import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';

// Use environment variable PORT or default to 8080
const PORT = process.env.PORT || 8080;

// Get local network IP
function getLocalNetworkIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const wss = new WebSocketServer({ port: PORT });

const clients = new Set();
let connectionCount = 0;

wss.on('connection', (ws) => {
  connectionCount++;
  const clientId = `client-${connectionCount}`;

  console.log(`✅ Cliente conectado: ${clientId} (Total: ${clients.size + 1})`);

  clients.add(ws);

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    deviceId: clientId,
    timestamp: Date.now(),
    totalClients: clients.size
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Broadcast message to all other clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) { // 1 = OPEN
          client.send(JSON.stringify(message));
        }
      });

      // Log sync activity
      if (message.type === 'STATE_UPDATE') {
        const preview = typeof message.data === 'object'
          ? JSON.stringify(message.data).substring(0, 50)
          : String(message.data);
        console.log(`🔄 Sincronizando desde ${message.deviceId}: ${preview}...`);
      }
    } catch (err) {
      console.error('Error procesando mensaje:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ Cliente desconectado: ${clientId} (Total: ${clients.size})`);

    // Notify remaining clients about updated count
    const updateMessage = JSON.stringify({
      type: 'CLIENT_COUNT_UPDATE',
      totalClients: clients.size,
      timestamp: Date.now()
    });

    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(updateMessage);
      }
    });
  });

  ws.on('error', (error) => {
    console.error(`⚠️  Error en cliente ${clientId}:`, error.message);
  });
});

wss.on('error', (error) => {
  console.error('❌ Error en WebSocket Server:', error);
});

const localIP = getLocalNetworkIP();

console.log('\n🚀 Servidor WebSocket Iniciado');
console.log('================================');
console.log(`📡 Puerto: ${PORT}`);
console.log(`🌐 Red Local: ws://${localIP}:${PORT}`);
console.log(`💻 Localhost: ws://localhost:${PORT}`);
console.log('================================\n');
console.log('Esperando conexiones...\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Cerrando servidor...');
  wss.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
