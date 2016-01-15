## Welcome

This is a fully-functional sample application written for app developers learning the 
[Spiceworks Cloud App API](http://developers.spiceworks.com/documentation/cloud-apps).
Spiceworks Cloud Apps are hosted web applications that can be embedded within any installation
of Spiceworks, interacting with the data managed by Spiceworks, and adding value to the
day-to-day of the millions of IT Pros who use [Spiceworks](http://www.spiceworks.com).
 
## About

Spiceworks Private Notes is an app for Spiceworks admins to store private comments and notes
alongside their Spiceworks-managed assets, devices, and help desk tickets. It is available
in the [Spiceworks App Center](http://appcenter.spiceworks.com/) under the name 
[ScratchPad](https://community.spiceworks.com/appcenter/app/extension_37).

You are welcome to fork and modify this app as you please.

## Tech

This is relatively simple single-page web application using Marionette,
Parse data models via the Parse Javascript SDK, and the Materialize CSS framework. 
This app is "compiled" from source using the Middleman static site generator.
It is designed to run on the Parse platform and uses Parse Cloud Code to authenticate
and automatically login Spiceworks users.

See [Reference](#reference) for links to these frameworks.

## Setup

#### 1. Install dependencies

You need a working Ruby environment with Bundler, and Bower installed globally. Then:
 
```bash
$ bundle install
$ bower install 
```

#### 2. Configure

Sign up for [Parse](http://parse.com/) and create a new app. The name is of your choosing
and doesn't necessarily need to match the hosting URL or domain you will use eventually.
Copy the application id and Javascript key under Settings, Security.
Create a `.env` file in the root of the repository clone with these keys as follows:
 
```bash
PARSE_APP_ID=xxxyyyzzz
PARSE_JAVASCRIPT_KEY=xxxyyyzzz
```

Install the Parse Command Line and configure the local repository clone:

```
$ parse new -i
Would you like to create a new app, or add Cloud Code to an existing app?
Type "(n)ew" or "(e)xisting": e
1:	your-app-name-here
Select an App to add to config: 1
Which of these providers would you like use for running your server code:
1) Heroku (https://www.heroku.com)
2) Parse  (https://parse.com/docs/cloudcode/guide)
Type 1 or 2 to make a selection: 2
```

Install the [Spiceworks Developer Edition](http://developers.spiceworks.com/downloads/)
and create a new app. The name and namespace are of your choosing and doesn't necessarily need to
match the hosting URL or domain you will use eventually. For the other fields, use these
values for now:

|Field|Value|
|---|---|
|Full Page URL|`http://localhost:4567/app.html#notes`|
|Show on ticket|`http://localhost:4567/app.html#note/find`|
|Show on device|`http://localhost:4567/app.html#note/find`|
|Environment|Read|
|Inventory|Read|
|Help Desk|Read|
|People|None|
|Reporting|None|
|Extended Data Access|off|

Once saved, copy the app id to `.env` as follows:

```bash
SPICEWORKS_APP_ID=xxxyyyzzz
```

Also, copy the Spiceworks app namespace you chose and the secret key assigned to you
into the Parse Cloud source code near the top of [`cloud/lib/spiceworks_authorizer.js`](cloud/lib/spiceworks_authorizer.js)
as follows:

```javascript
var app_namespace = "your-app-namespace-goes-here";
var app_secret = "xxxyyyzzz";
```

Optionally, configure Rollbar for Javascript error notifications. 
Sign up for [Rollbar](http://rollbar.com/), and copy the Rollbar POST token to `.env` as follows:
 
```bash
ROLLBAR_TOKEN=xxxyyyzzz
```

#### 3. Run your app in development mode
 
Middleman runs your single-page web application, watches the filesystem for changes, and reloads
your browser tab when anything changes.
  
```
$ middleman
== The Middleman is loading
== View your site at "http://localhost:4567"
```

Also, the Parse Command Line watches the filesystem for changes and deploys your Cloud Code when
anything changes.

```bash
$ mkdir public
$ parse develop
Your changes are now live.
```

#### 4. Develop, modify, play

In your Spiceworks Developer Edition, navigate to tickets in the Help Desk and to example devices 
in Inventory in order to create private notes. Use the apps menu to see the most recent few
notes.

#### 5. Push to production

Build the static site.

```bash
$ middleman build
```

Push your static site and Cloud Code to Parse.

```bash
$ parse deploy
```

Follow Parse's documentation and best practices for deploying to production. Namely,
disallow the creation of new classes in Parse Core, and disallow the open modification of the
class structures. (See Core in the Parse console.)

Because this app uses Cloud Code to simulate username and password login via Spiceworks 
OAuth2 authentication, you should probably also disallow other methods and future methods 
of user authentication and only enable username and password-based authentication.
(See Users in the Parse console.)

Finally, create a public name for the hosted web app. Don't forget to change your web app
URLs to point to your custom Parse hosted domain! (See Hosting in the Parse console.)

## Noteable in the source code

#### Custom OAuth2 Authentication for Parse

Parse supports username and password login along with a few well known third-party logins like Facebook.
How to implement your own integration with another third-party authentication system is described briefly
[in their tutorials](https://parse.com/tutorials/adding-third-party-authentication-to-your-web-app).

The process is effectively divided into two steps: validate the OAuth2 access token granted from
the third party against the servers of the third party, and once validated, simulate username and 
password-based login by using a generated password.
  
In [`cloud/lib/spiceworks_authorizer.js`](cloud/lib/spiceworks_authorizer.js), we take the
access token granted using the Spiceworks Javascript API in the browser, combine it with
the OAuth2 application secret granted when we initially created our application in the Spiceworks
Developer Edition, and pass it to the Spiceworks servers over SSL to verify authenticity and
authorization. This follows the process documented under 
[App Authentication](http://developers.spiceworks.com/documentation/cloud-apps/authentication/)
in the Spiceworks developer documentation.

In [`cloud/lib/spiceworks_user.js`](cloud/lib/spiceworks_user.js), we create or reuse a generated
password per user that is stored using a `SpiceworksUserPassword` model, and then pass that
password to `Parse.User.logIn()` or `Parse.User.signUp()`.

The two steps are combined in the Cloud Code function whose entrypoint is in
[`cloud/main.js`](cloud/main.js).

#### Placement Awareness

Spiceworks Cloud Apps can be placed across multiple locations in the Spiceworks product UI.
An app developer has a couple of options to modify behavior depending on location.
One is to use multiple URLs across the placement locations when creating the app in
the Spiceworks Developer Edition. Another option--employed here--is to use the Spiceworks Javascript API
to obtain the placement information.

In [`source/javascripts/backbone/apps/find_note/main.js`](source/javascripts/backbone/apps/find_note/main.js)
we use the Spiceworks Environment service to obtain the placement information. With this data,
we can construct a slightly different `key` attribute for our notes object stored in Parse Core.
 
## Reference

* [Backbone](http://backbonejs.org/)
* [Bower](http://bower.io/)
* [Marionette](http://marionettejs.com/)
* [Materialize](http://materializecss.com/)
* [Middleman](https://middlemanapp.com/)
* [Parse](http://parse.com/)
