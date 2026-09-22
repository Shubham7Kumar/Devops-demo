# GitHub Actions & CI

## 1. GitHub Actions

GitHub Actions is GitHub's automation platform.

It can automatically:

* Run tests
* Build applications
* Run linting
* Build Docker images
* Deploy applications
* Execute scheduled jobs

---

## 2. CI

CI = Continuous Integration.

Basic idea:

```text
Developer pushes code
        ↓
Automated validation
        ↓
Tests / Build / Checks
        ↓
Pass or Fail
```

CI helps detect problems early.

---

## 3. CI vs CD

```text
CI
Code → Build → Test → Validate

CD
Code → Build → Test → Deploy
```

Remember:

```text
CI = Validate
CD = Deliver/Deploy
```

---

## 4. Workflow

A workflow is a YAML file describing an automated process.

Typical location:

```text
.github/workflows/ci.yml
```

---

## 5. Trigger

The `on` section defines when a workflow runs.

Example:

```yaml
on:
  push:
  pull_request:
```

Meaning:

```text
Push → run workflow

Pull Request → run workflow
```

---

## 6. Job

A job is a group of steps.

Example:

```yaml
jobs:
  test:
```

---

## 7. Runner

A runner is the machine that executes the job.

Example:

```yaml
runs-on: ubuntu-latest
```

GitHub provides the runner.

---

## 8. Step

A step is an individual operation inside a job.

Example:

```yaml
steps:
  - uses: actions/checkout@v4

  - run: npm ci

  - run: npm test
```

---

## 9. First CI Workflow

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

---

## 10. Important Actions

### Checkout

```yaml
uses: actions/checkout@v4
```

Gets repository files into the runner.

### Setup Node

```yaml
uses: actions/setup-node@v4
```

Prepares Node.js.

### Run command

```yaml
run: npm test
```

Executes a shell command on the runner.

---

## 11. `npm ci` in CI

```bash
npm ci
```

Installs dependencies using the lockfile.

It is commonly preferred for automated CI environments because it provides a clean, reproducible installation.

---

## 12. Complete Mental Model

```text
git push
    ↓
GitHub
    ↓
Workflow trigger
    ↓
Job
    ↓
Runner
    ↓
Checkout repository
    ↓
Setup Node
    ↓
npm ci
    ↓
npm test
    ↓
PASS / FAIL
```

---

## 13. Docker vs GitHub Actions

Docker:

```text
PC
 ↓
Docker
 ↓
Container
 ↓
Application
```

GitHub Actions:

```text
GitHub
 ↓
Runner
 ↓
Commands
 ↓
Tests / Build / Deployment
```

They solve different problems but can work together.

---

## 14. Important Files

```text
.github/
└── workflows/
    └── ci.yml
```

This is where GitHub Actions workflows are normally stored.
