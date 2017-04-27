Blog for SoftUni - a team effort :) 
### Installation
If you are using MacOs :
1)`cd /*your directory*/`
2)`git clone https://github.com/ivangeorgiew/awesomeblog.git`
3)`npm i`
4)`npm i -g nodemon`
5)`mongod`
6)`npm run dev` OR `npm run test`


If you are using Windows:

6)`SET NODE_ENV=development` OR `=test` 
7)`nodemon ./server.js`






/*To Dos*/
- deploy in heroku

What I did for the project:
- changed hbs to pug;
- changed the design pattern to a clearer one;
- fixed error catching; 
- added nodemon;
- switched from global.Promise to bluebird;
- implemented register with default profile picture;
- removed some repetition;
- styling fixes;
- rearanged the articles and improved functionality;
- fixed the User settings changing (only pass, only img,
  both);
- admin can edit and delete articles and still everything is working
- add search articles option at the footer where if you type:
    'own' - your articles,
    'title' - articles with this title,
    'user#name' - articles made by that user
- commented everything;
- added unique-username functionality;
- user can delete himself and admin can delete any user;
- validated username and email;
- implemented VGeorgiev1's idea for random images because
  there isn't enough time till the deadline to wait for him
  to implement it himself
