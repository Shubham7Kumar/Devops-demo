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


# Phase 3 — Part 8: Git Merge

## 1. What is Git Merge?

`git merge` combines changes from one branch into another branch.

Mental model:

```text
Feature Branch
      ↓
    merge
      ↓
Main Branch
```

Important:

```bash
git merge <branch>
```

means:

> Merge `<branch>` INTO the CURRENT branch.

---

## 2. Basic Syntax

```bash
git merge <branch-name>
```

Example:

```bash
git switch main
git merge feature/login
```

Meaning:

```text
feature/login
      ↓
    merge
      ↓
main
```

---

## 3. Branch Example

Before merge:

```text
        D → E
       /
A → B → C
       ↑
      main
```

After merge:

```text
A → B → C → D → E
                  ↑
                 main
```

Depending on the history, Git may use a fast-forward merge or create a merge commit.

---

## 4. Fast-Forward Merge

If the target branch has not moved forward:

```text
A → B → C → D → E
```

Git can simply move the branch pointer forward.

This is called:

**Fast-forward merge**

---

## 5. Merge Commit

If both branches have new commits:

```text
        D → E
       /     \
A → B         M
       \     /
        F → G
```

`M` can be a merge commit.

---

## 6. Merge Conflict

A conflict happens when Git cannot automatically determine which changes should be kept.

Typical situation:

```text
main changes same code
        +
feature changes same code
        =
possible conflict
```

Git may show:

```text
<<<<<<< HEAD
current branch
=======
other branch
>>>>>>> feature
```

Resolve the file manually.

Then:

```bash
git add <file>
git commit
```

---

## 7. Typical Feature Workflow

```text
main
 ↓
create feature branch
 ↓
modify code
 ↓
git add
 ↓
git commit
 ↓
git push
 ↓
Pull Request
 ↓
review
 ↓
merge
 ↓
main
```

---

## 8. Local Merge

```bash
git switch main
git pull
git merge feature/health-check
git push origin main
```

---

## 9. Pull Request vs Merge

Pull Request:

* GitHub collaboration feature
* Used for review/discussion
* Usually created from a feature branch

Merge:

* Git operation
* Combines branch histories
* Can be performed locally or through GitHub

---

## 10. Useful Commands

```bash
git branch
git status
git log --oneline --decorate --graph --all
git switch <branch>
git pull
git merge <branch>
git push origin <branch>
```

---

## 11. Direction Rule

Always remember:

```bash
git merge OTHER_BRANCH
```

means:

```text
CURRENT BRANCH
      ↑
receives changes
      ↑
OTHER BRANCH
```

Example:

```bash
git switch main
git merge feature/login
```

Result:

```text
feature/login
      ↓
     main
```

---

## 12. Easy Memory

```text
branch  = separate line
commit  = snapshot
push    = local → remote
fetch   = check remote
pull    = remote → local + integrate
merge   = combine branches
PR      = request/review before merging
```

## 13. Complete Git Flow

```text
GitHub
  ↓
clone
  ↓
Local Repository
  ↓
create branch
  ↓
Feature Branch
  ↓
modify code
  ↓
git add
  ↓
git commit
  ↓
git push
  ↓
GitHub
  ↓
Pull Request
  ↓
Review
  ↓
Merge
  ↓
main
```

# Phase 3 — Part 9: Git Merge Conflicts

## 1. What is a Merge Conflict?

A merge conflict occurs when Git cannot automatically combine changes from two branches.

Common situation:

```text
main changes the same code
        +
feature changes the same code
        ↓
Git cannot safely decide
        ↓
CONFLICT
```

---

## 2. Why Does Git Need the Developer?

Git understands code changes, but it does not understand the intended business meaning.

Example:

```js
PORT = 5000;
```

versus:

```js
PORT = 8000;
```

Git cannot know which value the application actually needs.

The developer must decide.

---

## 3. Conflict Markers

Git may place markers like:

```text
<<<<<<< HEAD
CURRENT BRANCH VERSION
=======
INCOMING BRANCH VERSION
>>>>>>> feature/login
```

Meaning:

```text
<<<<<<< HEAD
Current branch
=======
Incoming branch
>>>>>>> branch-name
```

---

## 4. How to Resolve a Conflict

Basic workflow:

```text
git merge
    ↓
CONFLICT
    ↓
git status
    ↓
Open conflicting file
    ↓
Understand both versions
    ↓
Choose/combine the correct code
    ↓
Remove conflict markers
    ↓
Test
    ↓
git add
    ↓
git commit
```

---

## 5. Important Commands

Check conflict:

```bash
git status
```

Stage resolved file:

```bash
git add <file>
```

Complete merge:

```bash
git commit
```

Abort merge:

```bash
git merge --abort
```

View history:

```bash
git log --oneline --decorate --graph --all
```

---

## 6. Example

Conflict:

```js
<<<<<<< HEAD
service: "production-api",
=======
service: "development-api",
>>>>>>> feature/test
```

After resolving:

```js
service: "devops-demo-api",
```

The conflict markers must be removed.

---

## 7. `git add` After Conflict

After manually fixing the file:

```bash
git add src/app.js
```

This tells Git:

> The conflict in this file has been resolved.

Then:

```bash
git commit
```

---

## 8. Abort a Merge

If you don't want to continue:

```bash
git merge --abort
```

This attempts to return the repository to the state before the merge began.

---

## 9. Normal Merge vs Conflict

Normal:

```text
git merge
   ↓
Git combines changes
   ↓
Success
```

Conflict:

```text
git merge
   ↓
Git cannot combine changes
   ↓
Conflict
   ↓
Developer resolves
   ↓
git add
   ↓
git commit
```

---

## 10. Important Rule

Never leave conflict markers in the final code:

```text
<<<<<<<
=======
>>>>>>>
```

They must be removed before completing the merge.

---

## 11. Complete Conflict-Resolution Cheat Sheet

```bash
git status

# inspect conflicting files

# manually resolve files

npm test

git add <resolved-file>

git status

git commit -m "Resolve merge conflict"

git status

git log --oneline --decorate --graph --all
```

If you want to abandon the merge:

```bash
git merge --abort
```

---

## 12. Easy Memory

```text
merge conflict
      ↓
Git asks: "Which version?"
      ↓
Developer decides
      ↓
Fix file
      ↓
Remove markers
      ↓
Test
      ↓
git add
      ↓
git commit
```

## 13. Golden Rule

```text
Git decides HOW changes can be combined.
Developer decides WHAT the final code should be.
```

# Phase 3 — Part 10: Git Restore, Reset & Revert

## 1. Three Important Undo Tools

```text
git restore → undo file changes
git reset   → move HEAD / branch history
git revert  → create a new commit that undoes an old commit
```

---

# 2. Git Areas

```text
Working Directory
       ↓ git add
Staging Area
       ↓ git commit
Repository / History
```

---

# 3. git restore

Used mainly to restore files.

Discard an unstaged modification:

```bash
git restore <file>
```

Example:

```bash
git restore src/app.js
```

Meaning:

> Restore the file to its last committed version.

⚠️ Uncommitted changes can be lost.

---

# 4. git restore --staged

Remove a file from staging while keeping the changes:

```bash
git restore --staged <file>
```

Example:

```bash
git restore --staged src/app.js
```

Meaning:

```text
STAGED
  ↓
UNSTAGED
```

The changes remain in the working directory.

---

# 5. HEAD

`HEAD` represents the current commit position.

Example:

```text
A → B → C
         ↑
        HEAD
```

---

# 6. HEAD~1

```text
HEAD   = current commit
HEAD~1 = previous commit
HEAD~2 = two commits before
```

Example:

```text
A → B → C
    ↑    ↑
  HEAD~1 HEAD
```

---

# 7. git reset

Reset moves the current branch/HEAD to another commit.

Common forms:

```bash
git reset --soft HEAD~1
git reset HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

---

# 8. Soft Reset

```bash
git reset --soft HEAD~1
```

Result:

```text
HEAD moves back
Changes remain staged
```

Mental model:

> Undo the commit but keep the changes ready to commit.

---

# 9. Mixed Reset

```bash
git reset HEAD~1
```

Default mode:

```bash
git reset --mixed HEAD~1
```

Result:

```text
HEAD moves back
Changes remain in working directory
Changes are unstaged
```

Mental model:

> Undo the commit and unstage the changes, but keep the work.

---

# 10. Hard Reset

```bash
git reset --hard HEAD~1
```

Result:

```text
HEAD moves back
Staging changes removed
Working-tree changes removed
```

Mental model:

> Make the project match the target commit.

⚠️ Dangerous because work can be discarded.

Do not use casually.

---

# 11. git revert

`git revert` creates a NEW commit that reverses an earlier commit.

Example:

```text
Before:

A → B → C
```

Run:

```bash
git revert C
```

After:

```text
A → B → C → D
```

Where D reverses the changes introduced by C.

The original C still exists.

---

# 12. Reset vs Revert

```text
RESET
→ moves history/HEAD

REVERT
→ adds a new commit that reverses old changes
```

Simple rule:

```text
Local/private mistake
        ↓
reset can be useful

Already shared/pushed history
        ↓
revert is generally safer
```

---

# 13. Restore vs Reset vs Revert

| Command       | Main Purpose                       |
| ------------- | ---------------------------------- |
| `git restore` | Restore file contents              |
| `git reset`   | Move HEAD / change staging/history |
| `git revert`  | Reverse a commit with a new commit |

---

# 14. Useful Commands

Discard unstaged file changes:

```bash
git restore <file>
```

Unstage file:

```bash
git restore --staged <file>
```

Soft reset:

```bash
git reset --soft HEAD~1
```

Mixed reset:

```bash
git reset HEAD~1
```

Hard reset:

```bash
git reset --hard HEAD~1
```

Revert latest commit:

```bash
git revert HEAD
```

View history:

```bash
git log --oneline --decorate --graph
```

---

# 15. Safe Undo Mental Model

```text
"I changed a file by mistake"
        ↓
git restore

"I staged the wrong file"
        ↓
git restore --staged

"I committed too early"
        ↓
git reset

"I need to undo a shared commit"
        ↓
git revert
```

---

# 16. Golden Rule

```text
restore → file
reset   → history/HEAD
revert  → new undo commit
```

And remember:

```text
git reset --hard
        ↓
Potentially destructive
        ↓
Use carefully
```
# Phase 3 — Part 11: Git Tags & Releases

## 1. What is a Git Tag?

A Git tag is a named reference to a specific commit.

Example:

```text
A → B → C → D
         ↑
       v1.0.0
```

Tag = fixed label for an important commit.

---

## 2. Branch vs Tag

```text
Branch = moving pointer
Tag    = fixed label
```

A branch normally moves when new commits are created.

A tag normally remains attached to the commit where it was created.

---

## 3. Why Use Tags?

Tags are commonly used to mark:

* Releases
* Production versions
* Stable versions
* Milestones
* Important project states

Examples:

```text
v1.0.0
v1.1.0
v1.1.1
v2.0.0
```

---

## 4. Semantic Versioning

Common format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
v2.4.1
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR
```

General convention:

```text
MAJOR → breaking changes
MINOR → new backward-compatible features
PATCH → bug fixes
```

Git itself does not enforce this convention.

---

## 5. Lightweight Tag

Create:

```bash
git tag v1.0.0
```

A lightweight tag is a simple reference to a commit.

---

## 6. Annotated Tag

Create:

```bash
git tag -a v1.0.0 -m "First stable release"
```

Annotated tags contain additional metadata such as:

* tagger
* date
* message
* referenced commit

For release versions, annotated tags are commonly useful.

---

## 7. List Tags

```bash
git tag
```

---

## 8. Show a Tag

```bash
git show v1.0.0
```

Shows information about the tag and referenced commit.

---

## 9. Push a Tag

Push one tag:

```bash
git push origin v1.0.0
```

Push all tags:

```bash
git push origin --tags
```

Important:

```text
git push
```

does not mean "push every local tag."

---

## 10. Tag a Specific Commit

First:

```bash
git log --oneline
```

Then:

```bash
git tag -a v0.9.0 <commit-hash> -m "Previous release"
```

Example:

```bash
git tag -a v0.9.0 98e4408 -m "Initial version"
```

---

## 11. Delete Local Tag

```bash
git tag -d v1.0.0
```

This removes the tag locally.

It does not delete the commit.

---

## 12. Delete Remote Tag

```bash
git push origin --delete v1.0.0
```

Removes the tag from the remote repository.

The commit still exists.

---

## 13. Git Tag vs GitHub Release

```text
Git Tag
   ↓
points to a commit

GitHub Release
   ↓
publishes information/assets around a tag
```

Tag = Git concept.

Release = GitHub publishing concept.

---

## 14. Typical Release Workflow

```text
Develop
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
  ↓
main
  ↓
git tag v1.0.0
  ↓
git push origin v1.0.0
  ↓
Release / Deployment
```

---

## 15. Production Connection

A versioned Docker image may look like:

```text
devops-demo-api:v1.0.0
```

instead of only:

```text
devops-demo-api:latest
```

Version tags make specific releases easier to identify and reproduce.

---

## 16. Important Commands

```bash
git tag
git tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git show v1.0.0
git push origin v1.0.0
git push origin --tags
git tag -d v1.0.0
git push origin --delete v1.0.0
```

---

## 17. Easy Memory

```text
Branch → moving pointer
Tag    → fixed label
Commit → snapshot
Release → published version
```

---

## 18. Golden Mental Model

```text
Commit
  ↓
Tag
  ↓
Version
  ↓
Release
  ↓
Deployment
```

Example:

```text
commit abc123
     ↓
   v1.0.0
     ↓
GitHub Release
     ↓
Production
```
# Phase 3 — Part 12: .gitignore Deep Dive

## 1. What is .gitignore?

`.gitignore` tells Git which untracked files/directories should normally be ignored.

Example:

```text id="0a4f2x"
node_modules/
.env
coverage/
```

---

## 2. Why Use .gitignore?

Common reasons:

* Sensitive configuration
* Generated files
* Dependencies
* Build output
* Logs
* Machine-specific files

---

## 3. Important Node.js Rules

```text id="n3x7c9"
node_modules/
.env
coverage/
```

Common additional rule:

```text id="w8q2k5"
*.log
```

---

## 4. node_modules

Do not normally commit `node_modules`.

Instead commit:

```text id="4x7m2n"
package.json
package-lock.json
```

Then recreate dependencies:

```bash id="y5n8v3"
npm ci
```

Flow:

```text id="4a8r6k"
package.json
package-lock.json
       ↓
     npm ci
       ↓
node_modules
```

---

## 5. .env vs .env.example

```text id="6q1w8p"
.env
→ actual local configuration
→ usually ignored

.env.example
→ configuration template
→ usually committed
```

Example:

```env id="5v9j2k"
PORT=5000
MONGO_URI=
REDIS_URL=
```

---

## 6. Important Warning

`.gitignore` is NOT a security mechanism.

It prevents normal accidental tracking of untracked files.

It does not automatically remove a file from Git history.

---

## 7. Common Patterns

Exact file:

```text id="h6t3p1"
.env
```

Directory:

```text id="k8m4q2"
node_modules/
```

All `.log` files:

```text id="p7x1s5"
*.log
```

Root-specific directory:

```text id="z4n9c6"
/temp
```

---

## 8. Wildcard

`*` is a wildcard.

```text id="b6w2r8"
*.log
```

matches:

```text id="3m7x1q"
app.log
server.log
error.log
```

---

## 9. Negation

`!` means do not ignore the matching pattern.

Example:

```text id="c9v4k7"
*.log
!important.log
```

Meaning:

```text id="2q6n8s"
Ignore all .log files
except important.log
```

---

## 10. Already Tracked File

If a file is already tracked, adding it to `.gitignore` does not automatically stop tracking it.

Example:

```text id="w3r7m2"
.env
```

was already committed.

To stop tracking while keeping the local file:

```bash id="x6p1q8"
git rm --cached .env
```

Then:

```bash id="j9k4s2"
git commit -m "Stop tracking .env"
```

---

## 11. --cached

```bash id="v8m2x6"
git rm --cached <file>
```

means:

```text id="f2q7n1"
Git tracking → remove
Local file   → keep
```

---

## 12. If a Secret Was Already Pushed

`.gitignore` does not erase old history.

If a real credential was exposed:

```text id="r5k8q2"
1. Rotate/revoke credential
2. Remove sensitive data appropriately
3. Clean history if necessary
4. Update local configuration
```

Most important:

> Treat an exposed secret as compromised.

---

## 13. .gitignore vs .dockerignore

```text id="q8w3n6"
.gitignore
→ controls Git tracking

.dockerignore
→ controls Docker build context
```

They solve different problems.

---

## 14. Check Tracked Files

```bash id="x4m7p2"
git ls-files
```

Shows files currently tracked by Git.

---

## 15. Check Ignored Files

```bash id="n6q1w8"
git status --ignored
```

Can show ignored files/directories.

---

## 16. What to Track in This Project

```text id="a7k2m9"
package.json          → TRACK
package-lock.json     → TRACK
src/                  → TRACK
test/                 → TRACK
Dockerfile            → TRACK
compose.yaml          → TRACK
.env.example          → TRACK
.gitignore            → TRACK
```

Usually ignore:

```text id="p4x8r1"
node_modules/         → IGNORE
.env                  → IGNORE
coverage/             → IGNORE
*.log                 → IGNORE
```

---

## 17. Useful Commands

```bash id="h2m7q4"
git status
git ls-files
git status --ignored
git check-ignore <file>
```

`git check-ignore` can help determine whether a file is being ignored.

Example:

```bash id="j8q3w6"
git check-ignore -v .env
```

This can show which `.gitignore` rule caused the file to be ignored.

---

## 18. Golden Mental Model

```text id="n5x2c8"
.gitignore
    ↓
"What should Git normally ignore?"

.gitignore ≠ secret vault
.gitignore ≠ history deletion
.gitignore ≠ file deletion
```

---

## 19. Easy Memory

```text id="c7m1q9"
node_modules → dependencies → ignore
.env         → local secrets/config → ignore
.env.example → template → commit
package.json → dependency definition → commit
package-lock → exact dependency tree → commit
```
# Phase 3 — Part 13: GitHub Pull Requests & Code Review

## 1. Pull Request

A Pull Request (PR) is a GitHub collaboration mechanism used to propose changes from one branch into another.

Typical flow:

```text
feature branch
      ↓
    push
      ↓
   GitHub
      ↓
 Pull Request
      ↓
 Code Review
      ↓
    CI
      ↓
   Approval
      ↓
    Merge
```

---

## 2. Example

```text
feature/health-check
          ↓
         PR
          ↓
         main
```

The developer proposes:

> "Please review my changes and integrate them into main if they meet the project requirements."

---

## 3. Git vs GitHub

### Git

Provides:

```text
commit
branch
merge
rebase
reset
restore
revert
```

### GitHub

Provides collaboration features such as:

```text
Pull Requests
Code Review
Issues
GitHub Actions
Repository permissions
Releases
```

---

## 4. PR vs Merge

### Merge

Git operation:

```bash
git merge feature/health-check
```

Combines branch histories.

### Pull Request

GitHub workflow:

```text
branch
  ↓
PR
  ↓
review
  ↓
merge
```

A PR is not the same thing as a Git merge command.

---

## 5. PR vs git pull

### `git pull`

```bash
git pull
```

Brings remote changes into the current local branch.

### Pull Request

```text
feature branch → target branch
```

Requests integration of proposed changes through GitHub.

Memory trick:

```text
git pull
→ remote → local

Pull Request
→ my branch → another branch
```

---

## 6. Typical Feature Workflow

```bash
git switch -c feature/health-check

# modify code

npm test

git add .
git diff --staged

git commit -m "Add health endpoint test"

git push -u origin feature/health-check
```

Then create a PR on GitHub.

---

## 7. PR Diff

A PR shows the changes between the source and target branches.

Added lines:

```diff
+ new code
```

Deleted lines:

```diff
- old code
```

The reviewer primarily examines:

```text
What changed?
Why?
Does it work?
Could it break anything?
Is it consistent with the project?
```

---

## 8. Code Review

Reviewers may check:

* Correctness
* Readability
* Error handling
* Security
* Tests
* Performance where relevant
* Project conventions
* Unnecessary changes

A review may result in:

```text
Approve
```

or:

```text
Request changes
```

---

## 9. Updating an Existing PR

If changes are requested:

```text
Reviewer
   ↓
changes requested
   ↓
developer modifies branch
   ↓
new commit
   ↓
git push
   ↓
same PR updates
```

Example:

```bash
git add .
git commit -m "Add health endpoint test"
git push
```

---

## 10. CI + PR

A professional workflow can be:

```text
Feature branch
      ↓
Pull Request
      ↓
GitHub Actions
      ↓
npm
```
# Phase 3 — Part 15: Git Rebase

## 1. Definition

`git rebase` replays your branch's commits on top of a new base commit.

Mental model:

```text
rebase
=
"Move my work onto a newer starting point."
```

---

## 2. Example

Before:

```text
A ─ B ─ C ─ F ─ G    main
          \
           D ─ E     feature
```

Run:

```bash
git switch feature
git rebase main
```

After:

```text
A ─ B ─ C ─ F ─ G ─ D' ─ E'    feature
```

`D` and `E` are replayed as new commits.

---

## 3. Rebase vs Merge

### Merge

```bash
git merge main
```

Can produce:

```text
A ─ B ─ C ─ F ─ G
     \           \
      D ─ E ───── M
```

### Rebase

```bash
git rebase main
```

Produces a linear-looking history:

```text
A ─ B ─ C ─ F ─ G ─ D' ─ E'
```

---

## 4. Main Difference

```text
merge
→ combines histories

rebase
→ replays commits onto a new base
```

---

## 5. Why Rebase?

Common reasons:

* Keep feature branch updated
* Produce a cleaner linear history
* Avoid unnecessary merge commits in some workflows
* Prepare a feature branch before integration

---

## 6. Important Warning

Rebase rewrites commit history.

Therefore:

> Avoid casually rebasing shared/public history.

Rebase is commonly used on your own feature branch before integration.

---

## 7. Update Feature Branch

Typical workflow:

```bash
git fetch origin
git rebase origin/main
```

If repository uses `master`:

```bash
git fetch origin
git rebase origin/master
```

---

## 8. Rebase Conflict

If conflict occurs:

```text
rebase
  ↓
conflict
  ↓
git status
  ↓
resolve file
  ↓
git add <file>
  ↓
git rebase --continue
```

---

## 9. Cancel Rebase

```bash
git rebase --abort
```

This cancels the current rebase and returns to the previous state.

---

## 10. Rebase and Push

Because rebase creates new commit identities, a previously pushed feature branch may require:

```bash
git push --force-with-lease
```

Prefer:

```text
--force-with-lease
```

over blindly using:

```text
--force
```

when rewriting your own remote feature branch.

Do not force-push shared branches unless explicitly allowed by the team workflow.

---

## 11. `git pull --rebase`

Normal:

```bash
git pull
```

Conceptually:

```text
fetch + integrate
```

With rebase:

```bash
git pull --rebase
```

Conceptually:

```text
fetch + rebase local commits
```

---

## 12. Useful Commands

```bash
git status

git log --oneline --graph --decorate --all

git fetch origin

git rebase origin/main

git rebase --continue

git rebase --abort

git push --force-with-lease
```

---

## 13. Golden Mental Model

```text
MERGE
→ "Combine the two histories."

REBASE
→ "Take my commits and replay them on the newer base."
```

---

## 14. Beginner Rule

```text
Own feature branch
→ rebase can be useful

Shared/public branch
→ don't casually rewrite history
```

---

## 15. Final Picture

```text
             main
A ─ B ─ C ─ F ─ G
          \
           D ─ E
          feature

             ↓ rebase

A ─ B ─ C ─ F ─ G ─ D' ─ E'
                       feature
```

# Phase 3 — Part 16: Git Cherry-Pick

## 1. Definition

`git cherry-pick` applies the changes introduced by a specific commit to the current branch.

Mental model:

```text id="0a7j3x"
"I don't want the whole branch.
I only want this commit."
```

---

## 2. Basic Command

```bash id="j4k9m2"
git switch main
git cherry-pick <commit-hash>
```

Example:

```bash id="x8p3v6"
git cherry-pick a7b3c91
```

---

## 3. Find Commit Hash

```bash id="q5m7n1"
git log --oneline --all
```

Example:

```text id="w3k8r4"
f81a2de Add Redis cache
c4b921a Add health test
9e8a712 Update README
```

Then:

```bash id="m6p2x9"
git cherry-pick c4b921a
```

---

## 4. Cherry-Pick Creates a New Commit

Original:

```text id="b7q4m1"
feature
A ─ B ─ C
```

Cherry-picked:

```text id="n8x2k6"
main
A ─ B ─ C'
```

The change is applied, but the resulting commit has a new identity.

---

## 5. Merge vs Rebase vs Cherry-Pick

### Merge

```bash id="e1k7m4"
git merge feature
```

```text
Bring the branch/history together.
```

### Rebase

```bash id="r9p3x5"
git rebase main
```

```text
Replay my commits on a new base.
```

### Cherry-Pick

```bash id="w6n2q8"
git cherry-pick abc123
```

```text
Apply this particular commit.
```

Memory:

```text id="u4m8c1"
MERGE      → branch
REBASE     → my commits onto new base
CHERRY-PICK → one commit
```

---

## 6. Conflict Handling

If conflict occurs:

```bash id="f3q7n2"
git status
```

Resolve the files.

Then:

```bash id="k8m1v5"
git add <resolved-file>
git cherry-pick --continue
```

---

## 7. Abort

To cancel the cherry-pick:

```bash id="x2r9p6"
git cherry-pick --abort
```

---

## 8. Common Uses

Cherry-pick can be useful for:

* Applying a specific hotfix
* Moving a small fix to another branch
* Applying a particular change to a release branch
* Selectively transferring one commit

---

## 9. Golden Mental Model

```text id="p6w3k8"
MERGE
→ Bring the branch.

REBASE
→ Replay my branch on a new base.

CHERRY-PICK
→ Bring this commit.
```

---

## 10. Basic Workflow

```text id="j9v4m2"
Find commit
     ↓
git log --oneline
     ↓
Switch target branch
     ↓
git switch main
     ↓
Cherry-pick
     ↓
git cherry-pick <hash>
     ↓
Test
     ↓
Push
```

# GitHub Issues + Practical Team Workflow

## 1. GitHub Issue

An Issue is used to track work in a repository.

Common uses:

* Bug
* Feature
* Testing
* Documentation
* Improvement
* Refactoring

### Mental Model

```text
Issue = What needs to be done?
```

Example:

```text
Issue #12
Add test for /cache endpoint
```

---

## 2. Issue vs Pull Request

```text
Issue
  ↓
Describes the work/problem

Pull Request
  ↓
Proposes code changes that solve the work/problem
```

Remember:

```text
Issue = Work
PR = Code proposal
```

---

## 3. Professional Development Flow

```text
Issue
  ↓
Branch
  ↓
Code
  ↓
Commit
  ↓
Push
  ↓
Pull Request
  ↓
CI
  ↓
Code Review
  ↓
Merge
  ↓
Issue Closed
```

---

## 4. Branch Naming

Common conventions:

```text
feature/login
feature/user-profile

fix/redis-cache
fix/login-error

test/health-endpoint

docs/update-readme

chore/update-dependencies
```

The branch name should communicate its purpose.

---

## 5. Typical Commands

```bash
git switch main
git pull

git switch -c feature/example

git status

git add .

git commit -m "Add example feature"

git push -u origin feature/example
```

After the first push:

```bash
git push
```

is usually enough because upstream tracking is configured.

---

## 6. Pull Request

A PR proposes merging one branch into another.

Example:

```text
base: main
compare: feature/login
```

Meaning:

```text
feature/login
      ↓
    main
```

---

## 7. Linking an Issue

A PR can contain:

```text
Closes #12
```

This connects the PR to Issue #12.

After the PR is merged, GitHub can automatically close the linked issue.

---

## 8. What Reviewers Check

Reviewers may check:

* Correctness
* Readability
* Error handling
* Security
* Tests
* Maintainability
* Project conventions

---

## 9. Why Branches Are Used

Avoid directly putting unfinished work into `main`.

Instead:

```text
main
 │
 ├── feature/login
 ├── feature/users
 └── fix/redis
```

Each change can be developed and reviewed separately.

---

## 10. Same PR Can Receive More Commits

A PR is automatically updated when more commits are pushed to its source branch.

```text
Commit 1
   ↓
Push
   ↓
PR
   ↓
Review comment
   ↓
Commit 2
   ↓
Push
   ↓
Same PR updated
```

---

## 11. Most Important Mental Model

```text
ISSUE
"What needs to be done?"

BRANCH
"Where will I work?"

COMMIT
"What change did I make?"

PUSH
"Send it to GitHub."

PR
"Please review my change."

CI
"Does it pass automated checks?"

REVIEW
"Is the change acceptable?"

MERGE
"Integrate it."

ISSUE CLOSED
"Work completed."
```

## Quick Difference

```text
Git        → Version control system
GitHub     → Collaboration platform

Issue      → Track work
Branch     → Isolate work
Commit     → Save a change
Push       → Upload commits
PR         → Propose changes for review
Review     → Check the proposed change
Merge      → Integrate branches
```
