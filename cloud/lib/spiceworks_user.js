'use strict';

var _ = require("underscore");

var generatePassword = function () {
  var password = "";
  _.times(48, function(i) {
    password = password + String.fromCharCode(_.random(35, 127));
  });
  return password;
}

var acl = new Parse.ACL();
acl.setPublicReadAccess(false);
acl.setPublicWriteAccess(false);

/*****************************************************************************
 * SpiceworksUserPassword:
 *
 * Model to store mapping between Spiceworks user AUIDs and generated passwords.
 * The generated passwords are used to create and login users (farther down.)
 *
 *****************************************************************************/

var SpiceworksUserPassword = Parse.Object.extend({
  className: "SpiceworksUserPassword",
  initialize: function () {
    this.setACL(acl);
    return this;
  }
});

var findPasswordForUser = function (user_auid) {
  var query = new Parse.Query(SpiceworksUserPassword);
  query.equalTo("user_auid", user_auid);
  return query.first({useMasterKey: true})
    .then(function(userPassword){
      if (userPassword){
        return userPassword.get("password");
      }
    });
}

var createPasswordForUser = function (user_auid) {
  var pass = generatePassword();
  var userPassword = new SpiceworksUserPassword();
  userPassword.set("user_auid", user_auid);
  userPassword.set("password", pass);
  return userPassword.save(null, {useMasterKey: true})
    .then(function(){
      return pass;
    })
}

var findOrCreatePasswordForUser = function (user_auid) {
  return findPasswordForUser(user_auid)
    .then(function(password){
      if (password){
        return password;
      }
      else {
        return createPasswordForUser(user_auid);
      }
    });
}

/*****************************************************************************
 *
 * Login or create and login a user by his/her AUID.
 * Assumes the AUID has been authenticated.
 *
 *****************************************************************************/

var loginOrCreate = function (user_auid) {
  return findOrCreatePasswordForUser(user_auid)
    .then(function(password){
      var username = "sw-auid-" + user_auid;
      return Parse.User.logIn(username, password)
        .done(function(user){
          console.log("User login " + user_auid);
          return user;
        })
        .fail(function(err){
          console.warn("Parse.User.logIn failed with " + JSON.stringify(err));
          return Parse.User.signUp(username, password)
            .then(function(user){
              console.log("User create and login " + user_auid);
              var userAcl = new Parse.ACL(user);
              userAcl.setPublicReadAccess(false);
              user.setACL(userAcl);
              return user.save();
            })
            .fail(function(err){
              console.warn("Parse.User.signUp failed with " + JSON.stringify(err));
              return Parse.Promise.error(err);
            });
        });
    });
}

module.exports = {
  loginOrCreate: loginOrCreate
};