'use strict';

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistantconv');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Hello World! What's your name?", 'Please tell me your name.');
  },

  MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
  },

  LinkIntent() {
    this.$googleAction.setNextScene('AccountLinkingScene');
    this.ask('Great!');    
  },

  async ON_SIGN_IN() {
    if (this.$googleAction.isAccountLinkingLinked()) {
        const profile = await this.$googleAction.$user.getGoogleProfile();
        this.tell(`Hi ${profile.given_name}`);
    } else if (this.$googleAction.isAccountLinkingRejected()) {
        this.tell('Too bad. Good bye');
    } else {
    this.tell('Something went wrong');
    }
  }

});

module.exports = { app };
