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