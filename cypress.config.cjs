const { defineConfig } = require('cypress');

// ✅ OBRIGATÓRIO - Load environment variables from .env
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    // ✅ OBRIGATÓRIO - Base configuration
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,

    // ✅ OBRIGATÓRIO - Test isolation
    testIsolation: true,

    // ✅ OBRIGATÓRIO - Timeouts
    defaultCommandTimeout: 5000,
    requestTimeout: 5000,
    responseTimeout: 5000,
    pageLoadTimeout: 5000,

    // ✅ OBRIGATÓRIO - Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // ✅ OBRIGATÓRIO - Video and screenshots
    video: true,
    screenshotOnRunFailure: true,

    // ✅ OBRIGATÓRIO - Test files pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents(on, config) {
      // ✅ OBRIGATÓRIO - Environment setup from .env
      config.env = {
        ...config.env,
        TEST_ADMIN_USER_EMAIL: process.env.TEST_ADMIN_USER_EMAIL,
        TEST_ADMIN_USER_PASSWORD: process.env.TEST_ADMIN_USER_PASSWORD,
      };

      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },
});
