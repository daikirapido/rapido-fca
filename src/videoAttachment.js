
const utils = require("../utils");
const log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function sendVideoAttachment(videoStream, threadID, callback) {
    const messageAndOTID = utils.generateOfflineThreadingID();
    
    const form = {
      client: "mercury",
      upload_1024: videoStream,
      voice_clip: "false",
      attempt: "1"
    };

    defaultFuncs
      .postFormData("https://upload.facebook.com/ajax/mercury/upload.php", ctx.jar, form, {})
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }
        
        if (!resData.payload) {
          throw { error: "Upload failed" };
        }

        const messageForm = {
          client: "mercury",
          action_type: "ma-type:user-generated-message",
          author: "fbid:" + (ctx.i_userID || ctx.userID),
          timestamp: Date.now(),
          timestamp_absolute: "Today",
          timestamp_relative: utils.generateTimestampRelative(),
          timestamp_time_passed: "0",
          is_unread: false,
          is_forward: false,
          is_filtered_content: false,
          is_spoof_warning: false,
          source: "source:chat:web",
          "source_tags[0]": "source:chat",
          body: "",
          html_body: false,
          ui_push_phase: "V3",
          status: "0",
          offline_threading_id: messageAndOTID,
          message_id: messageAndOTID,
          threading_id: utils.generateThreadingID(ctx.clientID),
          manual_retry_cnt: "0",
          thread_fbid: threadID,
          video_ids: [resData.payload.metadata[0].video_id]
        };

        defaultFuncs
          .post("https://www.facebook.com/messaging/send/", ctx.jar, messageForm)
          .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
          .then(function(resData) {
            if (!resData) {
              throw { error: "Send message failed." };
            }
            if (resData.error) {
              throw resData;
            }
            callback(null, resData.payload);
          })
          .catch(function(err) {
            log.error("sendVideoAttachment", err);
            callback(err);
          });
      })
      .catch(function(err) {
        log.error("uploadVideoAttachment", err);
        callback(err);
      });
  };
};
