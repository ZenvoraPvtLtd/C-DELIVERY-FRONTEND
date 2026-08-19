const http = require('http');

const endpoints = [
  '/api/v1/health',
  '/api/v1/orders',
  '/api/v1/deliveries',
  '/api/v1/delivery-partners'
];

async function makeRequest(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get({
      hostname: 'localhost',
      port: 5000,
      path: path,
      agent: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          time: Date.now() - start,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        status: 0,
        time: Date.now() - start,
        success: false,
        error: err.message
      });
    });
  });
}

async function runTests() {
  console.log('Starting Reliability Tests...\n');
  
  // Login first to get token
  let token = '';
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          token = body.accessToken || '';
          console.log('Login successful');
        } catch(e) {}
        resolve();
      });
    });
    req.write(JSON.stringify({ email: 'admin@delivery.com', password: 'password123' }));
    req.end();
  });

  const getOptions = (path) => ({
    hostname: 'localhost',
    port: 5000,
    path: path,
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    agent: false
  });

  const makeAuthRequest = (path) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const req = http.get(getOptions(path), (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            time: Date.now() - start,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        });
      });
      req.on('error', (err) => resolve({ status: 0, time: Date.now() - start, success: false, error: err.message }));
    });
  };

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint} (20 requests)...`);
    let successes = 0;
    let failures = 0;
    let maxTime = 0;
    let totalTime = 0;
    
    for (let i = 0; i < 20; i++) {
      const result = await makeAuthRequest(endpoint);
      if (result.success) successes++;
      else {
        failures++;
        console.error(`Failed ${endpoint} with status ${result.status}`);
      }
      if (result.time > maxTime) maxTime = result.time;
      totalTime += result.time;
      await new Promise(r => setTimeout(r, 50));
    }
    
    console.log(`Results for ${endpoint}:`);
    console.log(`- Success: ${successes}/20`);
    console.log(`- Failure: ${failures}/20`);
    console.log(`- Avg Time: ${Math.round(totalTime / 20)}ms`);
    console.log(`- Max Time: ${maxTime}ms\n`);
  }
}

runTests().catch(console.error);
