const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    fullDescription: {
      type: String,
      default: "",
    },

    tech_stack: {
      type: String,
      required: true,
      trim: true,
    },

    // PLATFORM — expanded to match seed data
    platform: {
      type: String,
      required: true,
      enum: [
        "Discord",
        "Slack",
        "Reddit",
        "Forum",
        "Telegram",
        "WhatsApp",
        "GitHub",
        "Twitter",
        "Meetup",
        "LinkedIn",
        "Blog",
        "Community",
        "Guide",
      ],
    },

    location_mode: {
      type: String,
      required: true,
      enum: [
        "Global/Online",
        "Global/Online & Offline",
        "Offline",
        "Hybrid",
        "India/Online",
      ],
    },

    tags: {
      type: [String],
      default: [],
    },

    community_page: {
      type: String,
      default: "",
    },

    joining_link: {
      type: String,
      required: true,
    },

    logo_url: {
      type: String,
      default: "",
    },

    member_count: {
      type: Number,
      default: 0,
    },

    activity_level: {
      type: String,
      enum: ["Low", "Medium", "High", "Very Active", "High (Seasonal)"],
      default: "Medium",
    },

    rules: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
communitySchema.index({ title: "text", description: "text", tags: "text" });
communitySchema.index({ tech_stack: 1 });
communitySchema.index({ platform: 1 });
communitySchema.index({ location_mode: 1 });
communitySchema.index({ activity_level: 1 });

module.exports = mongoose.model("Community", communitySchema);
