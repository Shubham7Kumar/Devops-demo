1. Git vs GitHub

First, don't mix these two.

Git
 ↓
Version control system
 ↓
Tracks changes on your computer
GitHub
 ↓
Online platform
 ↓
Stores/shares Git repositories

Think:

Git      = notebook that tracks every change
GitHub   = cloud where you can store that notebook

You can use Git without GitHub.

2. Check Git

Open CMD and go to your project:

cd "C:\Users\SHUBHAM KUMAR\OneDrive\Desktop\DEV\devops-demo-api"

Then:

git --version

You should get something like:

git version 2.x.x
3. Initialize Git

Now run:

git init

You'll see something similar to:

Initialized empty Git repository in ...

Git has now created a hidden:

.git

directory.

Your project conceptually becomes:

devops-demo-api/
│
├── .git/              ← Git's internal database
├── src/
├── test/
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
├── .env
└── ...
🧠 Important

You normally never edit .git manually.

Git manages it.

4. Check the repository

Run:

git status

You should see files under something like:

Untracked files:

This means:

Git sees these files, but you haven't told Git to track them yet.

5. Before git add — check .gitignore

This is very important for DevOps.

Your .gitignore should contain at least:

node_modules
.env
coverage
npm-debug.log

And because you're using Docker:

Dockerfile

Do NOT add Dockerfile to .gitignore.

The Dockerfile should be committed because it's part of your application's deployment configuration.

So your .gitignore should look roughly like:

node_modules
.env
coverage
npm-debug.log

Your .env stays private.

Your .env.example can be committed.

For example:

PORT=5000
NODE_ENV=development
MONGO_URI=
REDIS_URL=

This tells another developer:

"These environment variables are required, but I'm not giving you my actual secrets."

6. Check what Git will track

Run:

git status

Look carefully.

You should see things such as:

Dockerfile
compose.yaml
package.json
package-lock.json
src/
test/
.env.example

You should NOT see:

.env
node_modules/
coverage/
7. Your first Git workflow

The basic Git cycle is:

Modify files
     ↓
git status
     ↓
git add
     ↓
git commit

Think:

Working Directory
       ↓
     git add
       ↓
Staging Area
       ↓
   git commit
       ↓
Git Repository
git add

Means:

"I want these changes included in my next snapshot."

git commit

Means:

"Create a permanent version/snapshot of these staged changes."

8. Stage your project

Once .gitignore is correct:

git add .

Then:

git status

You should now see:

Changes to be committed:

This is your staging area.

9. Create your first commit

Run:

git commit -m "Initial commit"

You should get something similar to:

[master ...] Initial commit

or:

[main ...] Initial commit

Don't worry about master vs main yet. We'll handle that next.

1. Set your Git identity for this project

From your current directory:

git config user.name "YOUR_NAME"
git config user.email "YOUR_EMAIL"

For example, if your GitHub account uses Shubham Kumar and your@email.com:

git config user.name "Shubham Kumar"
git config user.email "your@email.com"
2. Correct the existing commit

Run:

git commit --amend --reset-author --no-edit

This means:

--amend
   ↓
Modify the existing commit

--reset-author
   ↓
Use the new user.name + user.email

--no-edit
   ↓
Keep "Initial commit" as the message
3. Verify
git log -1 --format=fuller

You should now see:

Author:     Shubham Kumar <your@email.com>
Commit:     Shubham Kumar <your@email.com>
4. Verify your future Git identity
git config user.name
git config user.email
⚠️ Important

Because you haven't pushed this commit to GitHub, you do not need git push --force.

Also, if you want your identity to apply to all future Git repositories, rather than just devops-demo-api, use:

git config --global user.name "YOUR_NAME"
git config --global user.email "YOUR_EMAIL"



See your commit history

Run:

git log

You'll see something like:

commit 98e44084200b7a14bd9eaf490322c037d4116efd
Author: Shubham Kumar <...>
Date:   ...

    Initial commit

The long value:

98e44084200b7a14bd9eaf490322c037d4116efd

is the commit hash.

Think of it as the unique ID of that snapshot.

3. Short history

Usually you don't need the huge output.

Run:

git log --oneline

You'll get:

98e4408 Initial commit

Much easier to read.

The first 7 characters:

98e4408

are a shortened version of the commit hash.

4. Understand what a commit actually is

Your current history is basically:

98e4408
   │
   └── Initial commit

Imagine tomorrow you modify src/app.js:

Initial project
      │
      ↓
98e4408
      │
      │ modify app.js
      ↓
another commit

Eventually:

98e4408
   ↓
a72bc91
   ↓
c51fd32
   ↓
f9e821a

Each commit represents a snapshot of your project at that point in history.

5. git show

Now run:

git show --stat

This shows what the latest commit changed, without dumping every line.

You'll see something similar to:

15 files changed
7020 insertions(+)

You can also inspect the actual commit:

git show

This may produce a lot of output because your initial commit contains the whole project.

6. Inspect one specific commit

You can use the short hash:

git show 98e4408

Git understands the abbreviated hash as long as it uniquely identifies the commit.

7. git status vs git log

This distinction is very important.

git status

Answers:

"What is happening with my files right now?"

Working directory
       ↓
Current changes?
git log

Answers:

"What versions have I committed previously?"

Git history
    ↓
Commit 1
Commit 2
Commit 3

So:

git status → PRESENT
git log    → PAST
8. One important concept: HEAD

Run:

git log --oneline

You'll see something like:

98e4408 (HEAD -> master) Initial commit

What is:

HEAD

?

It means:

Where you are currently positioned in Git history.

Currently:

HEAD
 ↓
master
 ↓
98e4408
 ↓
Initial commit

Later, when we create branches:

             main
              ↓
A ─── B ─── C
       \
        D ─── E
             ↑
            HEAD

This will become important for GitHub and CI/CD.

9. Your first practical change

Now let's actually create a second commit.

Open:

src/app.js

Add a small comment near the top:

// DevOps learning project

Don't change application behavior.

Save it.

Then run:

git status

You should see something like:

modified:   src/app.js

This demonstrates the difference between:

Committed version
       ↓
File modified
       ↓
Git detects difference
10. See exactly what changed

Before staging it, run:

git diff

You should see your added line highlighted in the diff.

Conceptually:

- old version
+ new version

This is one of the most useful Git commands when debugging.

# Part 3 — Git Branches

## 1. What is a Branch?

A branch is an independent line of development in Git.

It allows us to work on a feature or change without directly modifying
the main stable branch.

Example:

```text
A ─── B ─── C
            ↑
          main

# Phase 3 — Part 3: Git Branches

## 1. What is a Branch?

A Git branch is a separate line of development.

It allows us to work on features, bug fixes, or experiments without directly disturbing the stable branch.

Example:

```text
A → B → C
        \
         D → E
```

`main/master` can remain at `C` while the feature branch continues with `D` and `E`.

---

## 2. Why Use Branches?

Branches are used to:

* Develop features independently
* Fix bugs separately
* Experiment safely
* Keep stable code separate
* Review changes before merging
* Allow multiple developers to work simultaneously

Common branch names:

```text
main
feature/login
feature/payment
bugfix/authentication
hotfix/security
```

---

## 3. Branch vs Commit

### Commit

A commit is a snapshot of the project at a particular point in time.

### Branch

A branch is a pointer/reference to a commit representing a line of development.

### Remember:

```text
Commit = Snapshot
Branch = Pointer
```

---

## 4. Creating a Branch

Create a branch:

```bash
git branch <branch-name>
```

Example:

```bash
git branch feature/login
```

This creates the branch but does not switch to it.

---

## 5. Create and Switch

```bash
git switch -c <branch-name>
```

Example:

```bash
git switch -c feature/login
```

This performs two operations:

```text
Create branch
     +
Switch to branch
```

---

## 6. Check Current Branch

```bash
git branch
```

Example:

```text
  master
* feature/login
```

`*` means the current branch.

---

## 7. Switch Branch

```bash
git switch <branch-name>
```

Examples:

```bash
git switch master
git switch feature/login
```

---

## 8. Branch and Commits

Example:

```text
A → B → C → D → E
        ↑        ↑
      master   feature
```

Here:

```text
master  → C
feature → E
```

The feature branch contains the newer commits while `master` remains at `C`.

---

## 9. View Branch History

```bash
git log --oneline --all --decorate
```

Useful options:

```text
--oneline   → short commit history
--all       → show all branches
--decorate  → show branch/HEAD references
```

---

## 10. Delete a Branch

Safe delete:

```bash
git branch -d <branch-name>
```

Force delete:

```bash
git branch -D <branch-name>
```

`-D` should be used carefully because it can delete an unmerged branch.

---

## 11. Typical Feature Workflow

```text
master
   ↓
create feature branch
   ↓
switch to feature
   ↓
modify code
   ↓
test
   ↓
git add
   ↓
git commit
   ↓
push branch
   ↓
Pull Request
   ↓
review
   ↓
merge
```

---

## 12. Important Commands

```bash
git branch
git branch <branch-name>
git switch <branch-name>
git switch -c <branch-name>
git branch -d <branch-name>
git branch -D <branch-name>
git log --oneline --all --decorate
```

## Mental Model

```text
Commit = Snapshot
Branch = Pointer

A → B → C
        ↑
      master
        \
         D → E
             ↑
           feature
```

`master` and `feature` share the history up to `C`, then the feature branch develops independently.


# Phase 3 — Part 4: GitHub & Remote Repository

## 1. Git vs GitHub

### Git

Git is a distributed version control system used to track code changes, commits, branches, and history locally.

### GitHub

GitHub is an online platform for hosting Git repositories and collaborating on projects.

```text
Git = Version Control Tool
GitHub = Remote Repository Hosting Platform
```

---

## 2. Local Repository

A Git repository exists locally inside the project.

```text
devops-demo-api/
└── .git/
```

The `.git` directory contains Git's repository information and history.

---

## 3. Remote Repository

A remote repository is another Git repository, usually hosted online.

Example:

```text
Local Repository
       │
       ▼
      Git
       │
       ▼
GitHub Remote Repository
```

---

## 4. What is `origin`?

`origin` is the conventional name given to the main remote repository.

Example:

```bash
git remote add origin <URL>
```

Here:

```text
origin = remote name
URL    = remote repository address
```

---

## 5. Add a Remote

```bash
git remote add origin <repository-url>
```

Example:

```bash
git remote add origin https://github.com/USERNAME/devops-demo-api.git
```

This connects the local repository to the GitHub repository.

---

## 6. Check Remotes

```bash
git remote -v
```

Example:

```text
origin  URL (fetch)
origin  URL (push)
```

### Fetch

Used when retrieving information/changes from the remote.

### Push

Used when sending local commits to the remote.

---

## 7. Local vs Remote

Before connecting:

```text
Your PC
   │
   ▼
Local Git Repository
```

After connecting:

```text
Your PC                         GitHub
   │                              │
   ▼                              ▼
Local Repository ←── origin ──→ Remote Repository
```

---

## 8. Why Connect GitHub?

GitHub provides:

* Remote backup
* Collaboration
* Pull Requests
* Code review
* GitHub Actions
* CI/CD
* Project visibility
* Deployment integration

---

## 9. Important Commands

```bash
git remote -v
```

View configured remotes.

```bash
git remote add origin <URL>
```

Add a remote.

```bash
git remote remove origin
```

Remove a remote.

```bash
git remote set-url origin <URL>
```

Change the URL of an existing remote.

---

## 10. Mental Model

```text
Local Git Repository
        │
        │ origin
        ▼
GitHub Remote Repository
```

`origin` is simply the name of the remote.

It is not a special GitHub command.

# Phase 3 — Part 6: Git Fetch & Pull

## 1. Why Fetch and Pull?

`git push` sends local commits to the remote.

`git fetch` and `git pull` bring information/changes from the remote.

```text
Local  ── push ──→  GitHub
Local  ←─ fetch/pull ──  GitHub
```

---

## 2. git fetch

`git fetch` downloads information about changes from the remote repository without integrating those changes into the current local branch.

```bash
git fetch origin
```

Mental model:

```text
fetch = Get remote information
        but don't integrate it yet
```

---

## 3. git pull

`git pull` gets changes from the remote and integrates them into the current local branch.

```bash
git pull
```

Simplified mental model:

```text
git pull
   =
git fetch
   +
integrate changes
```

---

## 4. Fetch vs Pull

### git fetch

```text
Remote
   ↓
Get information
   ↓
Remote-tracking references
```

Your current working branch is not automatically changed.

### git pull

```text
Remote
   ↓
Fetch
   ↓
Integrate
   ↓
Current local branch
```

### Remember:

```text
fetch = "See what's changed."

pull = "Bring the changes into my branch."
```

---

## 5. Remote-Tracking Branch

A remote-tracking branch represents the state of a branch on the remote.

Examples:

```text
origin/master
origin/feature/health-check
```

Example:

```text
Local branch:

A → B → C
        ↑
      master


Remote-tracking:

A → B → C → D
            ↑
       origin/master
```

Here the local `master` is still at `C`, while the remote-tracking reference knows that GitHub is at `D`.

---

## 6. Check Remote Branches

```bash
git branch -r
```

Example:

```text
origin/master
origin/feature/health-check
```

`-r` means remote branches.

---

## 7. Fetch Remote Changes

```bash
git fetch origin
```

Fetches information from the remote named `origin`.

---

## 8. Pull Remote Changes

```bash
git pull
```

Gets remote changes and integrates them into the current branch.

---

## 9. Important Commands

```bash
git fetch origin
git pull
git branch -r
git log --oneline --all --decorate
git status
```

---

## 10. Push vs Pull

```text
git push
     ↓
Local → GitHub


git pull
     ↓
GitHub → Local
```

More accurately:

```text
git push
= send local commits to remote

git pull
= fetch remote changes + integrate them
```

---

## 11. Typical Team Workflow

```text
        GitHub
        ↕
   git pull / push
        ↕
      Local
        ↓
     modify
        ↓
     git add
        ↓
    git commit
        ↓
     git push
```

---

## 12. Mental Model

```text
fetch = inspect/update knowledge of remote

pull = fetch + integrate

push = send local commits to remote
```

### Easy memory:

```text
PUSH → Local → Remote
PULL → Remote → Local
FETCH → Remote information without integrating
```
# Phase 3 — Part 7: Git Clone & Team Workflow

## 1. What is git clone?

`git clone` creates a local copy of an existing remote Git repository.

```bash
git clone <repository-url>
```

Example:

```bash
git clone https://github.com/USERNAME/devops-demo-api.git
```

It brings:

* Project files
* Git history
* Branch information
* `.git` repository data
* Remote configuration

---

## 2. Clone vs Download ZIP

### Download ZIP

```text
GitHub
  ↓
ZIP
  ↓
Files only
```

### Git clone

```text
GitHub
  ↓
git clone
  ↓
Files
+
Git history
+
.git
+
Remote configuration
```

Remember:

```text
ZIP   = Files
CLONE = Files + Git Repository
```

---

## 3. Clone is Usually a One-Time Operation

When you don't have the repository:

```bash
git clone <URL>
```

After cloning, use:

```bash
git pull
```

to get later changes.

```text
First time → clone
Later      → pull
```

---

## 4. Clone Automatically Configures `origin`

After:

```bash
git clone <URL>
```

Git automatically creates the remote:

```text
origin
```

Check it with:

```bash
git remote -v
```

Example:

```text
origin  <URL> (fetch)
origin  <URL> (push)
```

You normally don't need to manually run:

```bash
git remote add origin ...
```

after cloning.

---

## 5. Clone vs Pull

### git clone

Used when the repository does not exist locally.

```text
Remote Repository
       ↓
    git clone
       ↓
Local Repository
```

### git pull

Used when the repository already exists locally and you want newer remote changes.

```text
Existing Local Repository
       ↓
     git pull
       ↓
Updated Local Repository
```

---

## 6. Typical Developer Workflow

```text
git clone
   ↓
git switch -c feature/...
   ↓
Modify code
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

---

## 7. Team Workflow

Multiple developers work with the same remote repository.

```text
                 GitHub
              Remote Repo
             /     |      \
            /      |       \
           ↓       ↓        ↓
       Developer Developer Developer
           A       B         C
```

Each developer has their own local repository.

They can create separate feature branches.

---

## 8. After a Feature is Merged

If GitHub's `main` receives new commits:

```text
GitHub:
A → B → C → D
            ↑
           main
```

Local `main` may still be:

```text
A → B → C
        ↑
       main
```

Update it with:

```bash
git switch main
git pull
```

Now local `main` contains the latest remote changes.

---

## 9. Important Commands

Clone repository:

```bash
git clone <URL>
```

Check remote:

```bash
git remote -v
```

Check local branches:

```bash
git branch
```

Check remote branches:

```bash
git branch -r
```

Check history:

```bash
git log --oneline --decorate
```

Update existing repository:

```bash
git pull
```

---

## 10. Complete Mental Model

```text
                GitHub
                   │
                 clone
                   ↓
            Local Repository
                   │
            create branch
                   ↓
            Feature Branch
                   │
                modify
                   ↓
               git add
                   ↓
             git commit
                   ↓
              git push
                   ↓
                GitHub
                   │
             Pull Request
                   ↓
                Review
                   ↓
                 Merge
                   ↓
                 main
```

### Easy Memory

```text
clone → get repository first time

fetch → see remote changes

pull → bring remote changes

add → stage changes

commit → save snapshot locally

push → send commits to remote
```
