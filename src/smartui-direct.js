// SmartUI Direct HTTP Implementation
// Bypasses SDK to avoid ES module issues - communicates directly with SmartUI CLI via HTTP

const http = require('http');

const SMARTUI_CLI_PORT = 49152;
const SMARTUI_CLI_HOST = 'localhost';

/**
 * Check if SmartUI CLI is running
 */
async function isSmartUIRunning() {
  return new Promise((resolve) => {
    const client = http.get(`http://${SMARTUI_CLI_HOST}:${SMARTUI_CLI_PORT}/healthcheck`, (res) => {
      resolve(res.statusCode === 200);
    });
    client.on('error', () => resolve(false));
    client.setTimeout(1000, () => {
      client.destroy();
      resolve(false);
    });
  });
}

/**
 * Fetch DOM serializer from SmartUI CLI
 */
async function fetchDOMSerializer() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://${SMARTUI_CLI_HOST}:${SMARTUI_CLI_PORT}/domserializer`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // SmartUI CLI returns: { body: { data: { dom: "..." } } }
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse DOM serializer response: ${error.message}. Response: ${data.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Failed to fetch DOM serializer: ${error.message}`));
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout fetching DOM serializer'));
    });
  });
}

/**
 * Post snapshot to SmartUI CLI
 */
async function postSnapshot(snapshotData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      snapshot: snapshotData,
      testType: 'js-selenium-driver'
    });

    const options = {
      hostname: SMARTUI_CLI_HOST,
      port: SMARTUI_CLI_PORT,
      path: '/snapshot',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          // Even if parsing fails, consider it successful if status is 200
          if (res.statusCode === 200) {
            resolve({ status: 'success' });
          } else {
            reject(new Error(`Failed to post snapshot: ${res.statusCode} ${data}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Failed to post snapshot: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout posting snapshot'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Capture SmartUI snapshot directly via HTTP (bypasses SDK)
 */
async function smartuiSnapshot(driver, name, options = {}) {
  if (!driver) {
    throw new Error('An instance of the selenium driver object is required.');
  }
  if (!name || typeof name !== 'string') {
    throw new Error('The `name` argument is required.');
  }

  // Check if SmartUI CLI is running
  const isRunning = await isSmartUIRunning();
  if (!isRunning) {
    throw new Error('Cannot find SmartUI server. Make sure SmartUI CLI is running.');
  }

  try {
    // Get session ID
    let sessionId = null;
    try {
      const session = await driver.getSession();
      sessionId = session.getId();
    } catch (error) {
      console.log("Unable to get session ID, continuing without it");
    }

    // Fetch DOM serializer from SmartUI CLI
    const serializerResponse = await fetchDOMSerializer();
    // Response format: { body: { data: { dom: "..." } } } or { data: { dom: "..." } }
    const domScript = serializerResponse.body?.data?.dom || 
                     serializerResponse.body?.dom ||
                     serializerResponse.data?.dom ||
                     serializerResponse.dom;
    
    if (!domScript) {
      console.error('DOM serializer response:', JSON.stringify(serializerResponse, null, 2));
      throw new Error('DOM serializer not found in response');
    }

    // Inject DOM serializer into browser
    await driver.executeScript(domScript);

    // Serialize DOM and get URL
    const { dom, url } = await driver.executeScript((options) => ({
      dom: SmartUIDOM.serialize(options),
      url: document.URL
    }), {});

    // Prepare snapshot data
    const snapshotData = {
      url,
      name,
      dom,
      options: {
        ...options,
        sessionId
      }
    };

    // Post snapshot to SmartUI CLI
    await postSnapshot(snapshotData);
    
    console.log(`✓ SmartUI snapshot captured: ${name}`);
  } catch (error) {
    console.error(`SmartUI snapshot failed "${name}":`, error.message);
    throw error;
  }
}

module.exports = {
  smartuiSnapshot,
  isSmartUIRunning
};

