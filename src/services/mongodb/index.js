module.exports = {
  connect: () => {
    require("mongoose").connect(
      process.env.MONGODB_ATLAS_URI || "mongodb://localhost/db_faisal_betest",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) return console.error(err);
        console.log("Successfully connected to MongoDB.");
      }
    );
  },
};
