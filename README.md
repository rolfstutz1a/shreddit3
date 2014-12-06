# S H R E D D I T ³

## A. Installation

* Requirements:
    * node.js
* GitHub:
    * [https://github.com/rolfstutz1a/shreddit3/](https://github.com/rolfstutz1a/shreddit3/ "GitHub source of SHREDDIT3")
* npm install

## B. Run

* cd server
* node run.js
* Link im Browser
    * [http://localhost:8640/](http://localhost:8640/ "Enter this link after staring the server")

## C. Tests

1. install nodeunit >>> npm -g install nodeunit
2. nodeunit server/test/shreddit-tests.js
3. *Alternativ:*  nodeunit server/test/shreddit-tests.js --reporter html  > c:/temp/shredditTest.html


## D. Known Bugs

* It may happen that the rating dialog will not appear when clicking on the stars.

## E. Todo

* pagination of the posting-list
* send notification when a new comment has been created.
* client-side tests
* integrate accessability
* integrate security

## Miscellaneous

* the development tool was **IntelliJ** or **WebStorm**
* the LESS file was compiled with the development tool (FileWatcher)
* the session-handling is our own implementation
* the language selection is also our own implementation
