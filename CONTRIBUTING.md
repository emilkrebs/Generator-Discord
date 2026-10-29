# Contributing to Generator-Discord
Thank you for your interest in Generator-Discord! We appreciate your interest in contributing to this project. This document will guide you through the process of making contributions to this open-source project.

# How to contribute
You can create an [issue](https://github.com/emilkrebs/Generator-Discord/issues/new/choose) or follow the guide below.

## 1. Fork the repository.
You will need to [fork this repository](https://github.com/emilkrebs/Generator-Discord/fork) to publish your work to the platform. The fork can then be used to contain your changes and to create a [PR](https://github.com/emilkrebs/Generator-Discord/pulls).

## 2. Change whatever you want to change
Now that your fork is ready, you can start improving the project.

# Testing the project
Testing your work will always be helpful to check everything works as intended.

### Requirements
- Node.js 22.18 or newer
- Python 3
- A Rust toolchain (`cargo`)

### 1. Install dependencies
```
npm ci
```

### 2. Run the test suite
```
npm test
```

The tests generate every template, build the TypeScript and JavaScript versions, compile the Python and Rust versions, and check that the generated bots start. No Discord token is required.

You can also use `npm link` and `yo discord` to try the generator.
  
## 3. Creating the Pull Request
After making all the changes, create a [Pull Request](https://github.com/emilkrebs/Generator-Discord/compare) selecting your fork to compare to.
![example](https://github.com/emilkrebs/Generator-Discord/assets/68400102/a3d248fc-7efb-4d95-bdb7-ad098276c630)

## 4. Wait for review
A maintainer will now review your code. We will keep you updated.