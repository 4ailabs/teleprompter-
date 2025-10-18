import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';
import { createServer } from 'http';

// Use environment variable PORT or default to 8080
const PORT = process.env.PORT || 8080;

// Access key for connections (can be set via environment variable)
const ACCESS_KEY = process.env.ACCESS_KEY || 'teleprompter2024';

console.log(`🔑 Access Key: ${ACCESS_KEY}`);
console.log(`💡 Set ACCESS_KEY environment variable to change the key`);

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

const clients = new Set();
let connectionCount = 0;

// Create HTTP server for Railway health checks
const httpServer = createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'teleprompter-websocket',
      timestamp: Date.now(),
      connectedClients: clients.size,
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: 'This is a WebSocket server for Teleprompter Pro'
    }));
  }
});

// Create WebSocket server on the HTTP server
const wss = new WebSocketServer({ server: httpServer });

// Start HTTP server
httpServer.listen(PORT, () => {
  console.log(`🌐 HTTP Server listening on port ${PORT}`);
});

wss.on('connection', (ws, req) => {
  // Extract access key from query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const providedKey = url.searchParams.get('key');
  
  // Check access key
  if (providedKey !== ACCESS_KEY) {
    console.log(`❌ Connection rejected - Invalid key: ${providedKey}`);
    ws.send(JSON.stringify({
      type: 'ACCESS_DENIED',
      message: 'Invalid access key',
      timestamp: Date.now()
    }));
    ws.close(1008, 'Invalid access key');
    return;
  }

  connectionCount++;
  const clientId = `client-${connectionCount}`;

  console.log(`✅ Cliente conectado: ${clientId} (Total: ${clients.size + 1}) - Key: ${providedKey}`);

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
