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
    if (!this.$request.getAccessToken()){
        this.showAccountLinkingCard();
    } else {
      this.tell("Seems that your account is linked.")
    }
  },

  ON_SIGN_IN() {
    if (this.$googleAction.getSignInStatus() === 'CANCELLED') {
        this.tell("User did not link their account.")
    } else if (this.$googleAction.getSignInStatus() === 'OK') {
        this.tell("User linked its account.")
    } else if (this.$googleAction.getSignInStatus() === 'ERROR') {
        this.tell("There was an error.")
    }
}

});

module.exports = { app };
