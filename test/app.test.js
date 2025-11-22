
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const appPath = require('../index'); // index exports nothing, so we'll require via spawn? Instead test models directly.

describe('Project structure', function(){
  it('has models folder and movieModel file', function(){
    const fs = require('fs');
    const path = require('path');
    const movieModelPath = path.join(__dirname, '..', 'models', 'movieModel.js');
    const userModelPath = path.join(__dirname, '..', 'models', 'userModel.js');
    expect(fs.existsSync(movieModelPath)).to.be.true;
    expect(fs.existsSync(userModelPath)).to.be.true;
  });
});
