import { initBotId } from "botid/client/core";

// Vercel BotID (Basic): attaches a challenge to POSTs to these paths so the Server
// Actions can call checkBotId(). Server Actions post to the page they're invoked from.
// Every path whose action calls checkBotId() must be listed, or the check fails.
initBotId({
  protect: [
    { path: "/", method: "POST" }, // newsletter signup on the home page
    { path: "/newsletter/confirm", method: "POST" }, // confirm subscription
  ],
});
