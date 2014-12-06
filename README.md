# S H R E D D I T  3

## A. Installation

  * Requirements:
    ** node.js

  * GitHub:
    ** https://github.com/rolfstutz1a/shreddit3

  * npm install

## B. Run

  * cd server
  * node run.js

  * Link im Browser
    ** http://localhost:8640/



## C. Tests

  1. install nodeunit >>> npm -g install nodeunit
  2. nodeunit server/test/shreddit-tests.js
  3. *Alternativ:*  nodeunit server/test/shreddit-tests.js --reporter html  > c:/temp/shredditTest.html


## D. Known Bugs

  * It may happen that the rating dialog will not appear when clicking on the stars.

## E. Todo

  * pagination of the posting-list
  * send notification when a new comment has been created.
