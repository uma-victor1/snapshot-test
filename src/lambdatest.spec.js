// const webdriver = require('selenium-webdriver');
// const { Builder } = webdriver;

// const username = process.env.LT_USERNAME || 'samuelemediong45';
// const accessKey = process.env.LT_ACCESS_KEY || 'your_access_key_here';

// const capabilities = {
//   'browserName': 'Chrome',
//   'browserVersion': 'latest',
//   'LT:Options': {
//     'username': username,
//     'accessKey': accessKey,
//     'platformName': 'Windows 10',
//     'project': 'Snapshot Testing',
//     'build': 'Build 1',
//     'name': 'User Card Test',
//     'w3c': true,
//     'plugin': 'node_js-node_js'
//   }
// };

// describe('UserCard on LambdaTest', function() {
//   let driver;

//   beforeAll(async function() {
//     try {
//       driver = await new Builder()
//         .usingServer(`https://${username}:${accessKey}@hub.lambdatest.com/wd/hub`)
//         .withCapabilities(capabilities)
//         .build();
//     } catch (error) {
//       console.error('Failed to create driver:', error);
//     }
//   }, 30000);

//   afterAll(async function() {
//     if (driver) {
//       await driver.quit();
//     }
//   }, 40000);

//   test('should load app', async function() {
//     await driver.get('http://localhost:3000');
//     const title = await driver.getTitle();
//     expect(title).toBeDefined();
//   }, 30000);
// });

// --------------------------------------------------------------------

const webdriver = require("selenium-webdriver");
const { Builder } = webdriver;
const http = require("http");

const username = process.env.LT_USERNAME || "samuelemediong45";
const accessKey =
  process.env.LT_ACCESS_KEY ||
  "LT_rgM3x9H3ua7PPEJMIYNksU8R6qg1VBcpolzIiLWSARrtCeB";
const appUrl = process.env.APP_URL || "http://localhost:3000";

const capabilities = {
  browserName: "Chrome",
  browserVersion: "latest",
  "LT:Options": {
    username: username,
    accessKey: accessKey,
    platformName: "Windows 10",
    project: "Snapshot Testing",
    build: "Build 1",
    name: "User Card Test",
    w3c: true,
    plugin: "node_js-node_js",
  },
};

// Helper function to check if local server is running
async function checkServerAvailability(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

describe("UserCard on LambdaTest", function () {
  let driver;

  beforeAll(async function () {
    // CRITICAL: Check if React app is running before proceeding
    console.log(`Checking if app is available at: ${appUrl}`);
    const isServerRunning = await checkServerAvailability(appUrl);

    if (!isServerRunning) {
      throw new Error(`
        APPLICATION NOT RUNNING!
        
        REQUIRED STEPS:
        1. Run "npm start" in a separate terminal first
        2. Wait for "Local: http://localhost:3000" message
        3. Then run this test
      `);
    }

    try {
      driver = await new Builder()
        .usingServer(
          `https://${username}:${accessKey}@hub.lambdatest.com/wd/hub`
        )
        .withCapabilities(capabilities)
        .build();
    } catch (error) {
      console.error("Failed to create driver:", error);
      throw error;
    }
  }, 30000);

  afterAll(async function () {
    if (driver) {
      await driver.quit();
    }
  }, 40000);

  test("should load app", async function () {
    await driver.get(appUrl);
    const title = await driver.getTitle();
    expect(title).toBeDefined();
  }, 30000);
});
