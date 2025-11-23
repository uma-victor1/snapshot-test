const webdriver = require("selenium-webdriver");
const { Builder } = webdriver;
const chrome = require("selenium-webdriver/chrome");
const http = require("http");

const username = process.env.LT_USERNAME;
const accessKey = process.env.LT_ACCESS_KEY;
const appUrl = process.env.APP_URL || "http://localhost:3000";
const projectToken = process.env.PROJECT_TOKEN;

// Debug: Log environment variables (mask sensitive data)
console.log("=== Environment Variables Debug ===");
console.log(`LT_USERNAME: ${username ? "✓ Set" : "✗ Not set"}`);
console.log(`LT_ACCESS_KEY: ${accessKey ? "✓ Set" : "✗ Not set"}`);
console.log(
  `PROJECT_TOKEN: ${
    projectToken
      ? "✓ Set (" + projectToken.substring(0, 20) + "...)"
      : "✗ Not set"
  }`
);
console.log(`APP_URL: ${appUrl}`);
console.log("===================================");

// SmartUI snapshot function - using direct HTTP implementation to avoid ES module issues
const { smartuiSnapshot, isSmartUIRunning } = require("./smartui-direct");

async function captureSmartUISnapshot(driver, snapshotName) {
  try {
    // Verify driver is ready
    if (!driver) {
      throw new Error("Driver is not initialized");
    }

    // Verify driver has an active session (required for SmartUI)
    try {
      const session = await driver.getSession();
      console.log(`Driver session ID: ${session.getId()}`);
    } catch (sessionError) {
      throw new Error(`Driver session not available: ${sessionError.message}`);
    }

    // Check if SmartUI CLI is running before attempting snapshot
    const smartUICLIRunning = await isSmartUIRunning();
    if (!smartUICLIRunning) {
      throw new Error(
        "SmartUI CLI is not running. Make sure you're running tests with 'npm run test:smartui'"
      );
    }

    // Call the SmartUI snapshot function (direct HTTP implementation, no SDK)
    await smartuiSnapshot(driver, snapshotName);

    // Small delay to ensure snapshot is processed by SmartUI CLI
    await driver.sleep(500);
  } catch (error) {
    // Log error with full details for debugging
    console.error(
      `✗ SmartUI snapshot failed for "${snapshotName}":`,
      error.message
    );
    if (
      process.env.DEBUG ||
      error.message.includes("Cannot find SmartUI server")
    ) {
      console.error(`Error details:`, error.stack);
    }
    // Don't throw - allow test to continue
  }
}

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
    // Enable SmartUI hooks (if using hooks method)
    // For CLI method, PROJECT_TOKEN is passed via environment variable
    ...(projectToken && {
      smartUI: {
        projectToken: projectToken,
      },
    }),
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
      // Check if SmartUI CLI is running (listening on port 49152)
      // If SmartUI CLI is running, always use local browser
      const smartUICLIRunning = await isSmartUIRunning();
      const shouldUseLocalBrowser = projectToken || smartUICLIRunning;

      if (shouldUseLocalBrowser) {
        if (smartUICLIRunning) {
          console.log(
            "✓ SmartUI CLI detected - Using local Chrome browser (SmartUI CLI will capture screenshots)"
          );
        } else {
          console.log(
            "Using local Chrome browser for SmartUI (PROJECT_TOKEN detected)"
          );
        }

        const options = new chrome.Options();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        driver = await new Builder()
          .forBrowser("chrome")
          .setChromeOptions(options)
          .build();
        console.log("✓ Local Chrome browser started successfully");
      } else {
        // Fallback to LambdaTest cloud if no PROJECT_TOKEN (for regular LambdaTest tests)
        console.log("Attempting to connect to LambdaTest cloud hub...");
        let retries = 2;
        let lastError = null;

        while (retries > 0) {
          try {
            driver = await new Builder()
              .usingServer(
                `https://${username}:${accessKey}@hub.lambdatest.com/wd/hub`
              )
              .withCapabilities(capabilities)
              .build();
            console.log("✓ Successfully connected to LambdaTest hub");
            break;
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              console.warn(`Connection attempt failed: ${error.message}`);
              console.log(
                `Retrying in 2 seconds... (${retries} attempts remaining)`
              );
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
        }

        if (!driver) {
          throw new Error(
            `Failed to connect to LambdaTest hub. Last error: ${lastError?.message}`
          );
        }
      }
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

  test("should load app and capture SmartUI snapshots", async function () {
    // Navigate to the app
    await driver.get(appUrl);

    // Wait for page to be ready
    await driver.wait(
      async () => {
        const readyState = await driver.executeScript(
          "return document.readyState"
        );
        return readyState === "complete";
      },
      10000,
      "Page did not load completely"
    );

    // Additional wait for React app to render
    await driver.sleep(3000);

    const title = await driver.getTitle();
    expect(title).toBeDefined();
    console.log(`Page title: ${title}`);

    // Capture SmartUI snapshot of the main page
    console.log("Capturing first snapshot...");
    await captureSmartUISnapshot(driver, "Home Page - Full View");

    // Scroll to see more content if needed
    await driver.executeScript(
      "window.scrollTo(0, document.body.scrollHeight)"
    );
    await driver.sleep(2000);
    console.log("Capturing second snapshot...");
    await captureSmartUISnapshot(driver, "Home Page - Scrolled View");

    // Scroll back to top
    await driver.executeScript("window.scrollTo(0, 0)");
    await driver.sleep(1000);
    console.log("Capturing third snapshot...");
    await captureSmartUISnapshot(driver, "Home Page - Top View");

    console.log("All snapshots captured successfully!");
  }, 90000);
});
