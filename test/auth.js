const Collection = require("../models/collection.js");
const Game = require("../models/game.js");
const User = require("../models/user.js");
const chaiJWT = require("chai-jwt");
const app = require("./../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiJWT);

const agent = chai.request.agent(app);

describe("API Collection Tests", function () {
  beforeEach((done) => {
    const sampleUser = new User({
      username: "myuser",
      password: "mypassword",
    });

    sampleUser.save().then(() => {
      done();
    });
  });

  afterEach((done) => {
    User.deleteMany({ username: { $ne: "" } })
      .then(() => Game.deleteMany({ title: { $ne: "" } }))
      .then(() => {
        done();
      });
  });

  it("should show log in message if not logged in", (done) => {
    agent.get("/").end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res).to.have.status(200);
      expect(res.body.message).to.be.equal(
        "Please sign up or log in to view your collections."
      );
      done();
    });
  });

  it("should show empty collections after sign up", (done) => {
    agent
      .post("/sign-up")
      .send({
        username: "myuser2",
        password: "mypassword2",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.collections).to.be.an("array");
        done();
      });
  });

  it("should show empty collections after log in", (done) => {
    agent
      .post("/login")
      .send({
        username: "myuser",
        password: "mypassword",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.collections).to.be.an("array");
        done();
      });
  });
});
