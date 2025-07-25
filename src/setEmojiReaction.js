
"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function setEmojiReaction(reaction, messageID, callback) {
    let resolveFunc = function(){};
    let rejectFunc = function(){};
    const returnPromise = new Promise(function(resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function(err) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc();
      };
    }

    if (!reaction) reaction = '';

    const form = {
      data: {
        client_mutation_id: ctx.clientMutationId++,
        actor_id: ctx.userID,
        action: reaction == "" ? "REMOVE_REACTION" : "ADD_REACTION",
        message_id: messageID,
        reaction: reaction
      }
    };

    defaultFuncs
      .post("https://www.facebook.com/api/graphql/", ctx.jar, {
        doc_id: "1491398900900362",
        variables: JSON.stringify(form)
      })
      .then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
      .then(function(resData) {
        if (!resData) {
          throw {error: "setEmojiReaction returned empty object."};
        }
        if (resData.error) {
          throw resData;
        }
        callback();
      })
      .catch(function(err) {
        log.error("setEmojiReaction", err);
        return callback(err);
      });

    return returnPromise;
  };
};
