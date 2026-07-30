const instagram = require("./instagram");
const facebook = require("./facebook");
const youtube = require("./youtube");
const tiktok = require("./tiktok");
const spotify = require("./spotify");

async function deliver(platform, job, supabase) {
  const name = platform.toLowerCase();

  switch (name) {
    case "instagram":
      return instagram(job, supabase);

    case "facebook":
      return facebook(job, supabase);

    case "youtube":
      return youtube(job, supabase);

    case "tiktok":
      return tiktok(job, supabase);

    case "spotify":
      return spotify(job, supabase);

    default:
      console.log("Unknown platform:", platform);
  }
}

module.exports = {
  deliver,
};