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

    const sampleGame = new Game({
      title: "Sample Game",
      platform: "Playstation 6",
      _id: "111",
    });

    sampleUser
      .save()
      .then(() => {
        agent.post("/login").send({
          username: "myuser",
          password: "mypassword",
        });
      })
      .then(() => {
        sampleGame.save();
      })
      .then(() => {
        done();
      });
  });

  afterEach((done) => {
    User.deleteMany({ username: { $ne: "" } })
      .then(() => Game.deleteMany({ title: { $ne: "" } }))
      .then(() => Collection.deleteMany({ name: { $ne: "" } }))
      .then(() => {
        done();
      });
  });

  it("should show all games when logged in", (done) => {
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
        done();
      });

    agent.get("/games").end((err, res) => {
      expect(res.body.collections).to.be.an("array");
      done();
    });
  });

  it("should make a new game", (done) => {
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
      });

    agent
      .post("/games/new")
      .send({
        title: "New Test Game",
        platform: "Test",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.title).to.be.equal("New Test Game");
        done();
      });
  });

  it("should make a new collection", (done) => {
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
        done();
      });

    agent
      .post("/collections/new")
      .send({
        name: "New Test Collection",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        done();
      });
  });

  it("should add a new game to the collection", (done) => {
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
        done();
      });

    agent
      .post("/collections/new")
      .send({
        name: "New Test Collection",
        _id: "123",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        done();
      });

    agent
      .post("/collections/123/add")
      .send({
        gameId: "111",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        expect(res.body.games).to.be.an("array");
        expect(res.body.games[0].name).to.be.equal("Sample Game");
        done();
      });
  });

  it("should remove a game from the collection", (done) => {
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
        done();
      });

    agent
      .post("/collections/new")
      .send({
        name: "New Test Collection",
        _id: "123",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        done();
      });

    agent
      .post("/collections/123/add")
      .send({
        gameId: "111",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        expect(res.body.games).to.be.an("array");
        expect(res.body.games[0].name).to.be.equal("Sample Game");
        done();
      });

    agent
      .post("/collections/123/remove")
      .send({
        gameId: "111",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        expect(res.body.games).to.be.an("array");
        expect(res.body.games[0]).to.be.equal(null);
        done();
      });
  });

  it("should delete a collection", (done) => {
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
        done();
      });

    agent
      .post("/collections/new")
      .send({
        name: "New Test Collection",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        done();
      });

    agent.post("/collections/delete/123").end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res.body.message).to.be.equal(
        "Collection has been successfully deleted."
      );
      done();
    });
  });

  it("should update a collection", (done) => {
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
        done();
      });

    agent
      .post("/collections/new")
      .send({
        name: "New Test Collection",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("New Test Collection");
        done();
      });

    agent
      .put("/collections/123")
      .send({
        name: "Altered Test Collection",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.name).to.be.equal("Altered Test Collection");
        done();
      });
  });

  it("should update a game", (done) => {
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
        done();
      });

    agent
      .put("/games/111")
      .send({
        title: "Altered Sample Game",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.title).to.be.equal("Altered Sample Game");
        done();
      });
  });

  it("should get a game's info", (done) => {
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
        done();
      });

    agent.get("/games/111").end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res.body.title).to.be.equal("Sample Game");
      expect(res.body.platform).to.be.equal("Playstation 6");
      done();
    });
  });
});
