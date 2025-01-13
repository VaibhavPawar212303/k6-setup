export const options = {
    scenarios: {
      ui: {
        executor: 'shared-iterations',
        VUS: 1,
        iterations: 1,
        options: {
          browser: {
            type: 'chromium',
          },
        },
      },
    },
    thresholds: {
      checks: ['rate==1.0'],
    },
  };