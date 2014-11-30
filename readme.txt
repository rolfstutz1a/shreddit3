S H R E D D I T  3
==================



A. Installation
   ------------

  Requirements:
    - node.js

  GitHub:
    https://github.com/rolfstutz1a/shreddit3


  npm install


B. Run
   ---

  cd server
  node run.js

  link: http://localhost:8640/



C. Tests
   -----

  1. install nodeunit >>> npm -g install nodeunit

  2. nodeunit server/test/shreddit-tests.js
     or
     nodeunit server/test/shreddit-tests.js --reporter html  > c:/temp/shredditTest.html


D. Todo
   ----

  1. pagination of the posting-list
  2. send notification when a new comment has been created.
