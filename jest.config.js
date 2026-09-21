export default {
  testEnvironment: "node",
  transform: {},
};

/**
========================================================
DEVOPS NOTEBOOK — JEST CONFIGURATION
========================================================

jest.config.js

WHAT?
Configuration file for Jest.

WHY?
It allows us to explicitly control how Jest runs tests.

Example:

export default {
  testEnvironment: "node",
  transform: {},
};

testEnvironment:
    Defines the environment in which tests execute.

transform:
    Defines whether Jest transforms source files before
    executing them.

IMPORTANT:
jest.config.js is NOT mandatory for every Jest project.

Simple projects may work with Jest defaults.

We use it here because our project uses ES Modules and
we want explicit, predictable test configuration.

========================================================*/