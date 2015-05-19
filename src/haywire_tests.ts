/// <reference path="../lib/mocha.d.ts" />
/// <reference path="../lib/chai.d.ts" />
/// <reference path="../lib/sinon.d.ts" />
/// <reference path="haywire.ts" />
describe('Haywire#Utils', () => {

  describe('_merge', () => {
    it('should combine two objects into one', () => {
      var a = { 'a': 1 }, b = { 'b': 2 };
      Haywire._merge(a, b);
      chai.assert.deepEqual(a, { 'a': 1, 'b': 2 });
      chai.assert.deepEqual(b, { 'b': 2  });
    });
  });

  describe('_extend', () => {
    it('should create a new object given two or more objects', () => {
      var a = { 'a': 1 }, b = { 'b': 2 }, c = { 'c': 3 };
      var d = Haywire._extend(a, b, c);
      chai.assert.deepEqual(d, { 'a': 1, 'b': 2, 'c': 3});
      chai.assert.deepEqual(a, { 'a': 1 });
      chai.assert.deepEqual(b, { 'b': 2 });

      // source object properties can be overriden:
      var a2 = { 'b': 2, 'a': 100 };
      var e = Haywire._extend(a, a2);
      chai.assert.deepEqual(e, { 'a': 100, 'b': 2 });
    });
  });
});

describe('Haywire#CircularBuffer', () => {
  var size = 4;
  var buffer = new Haywire.CircularBuffer(size);

  it('should store a fixed number of values', () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((it) => buffer.add(it % 2 === 0));
    chai.assert.equal(buffer.values.length, size);
  });

  it('should report all OK if every value is true', () => {
    [true, true, true, true].forEach((it) => buffer.add(it));
    chai.assert.isTrue(buffer.allOk());
  });

  it('should report all failed if every value is false', () => {
    [false, false, false, false].forEach((it) => buffer.add(it));
    chai.assert.isTrue(buffer.allFailed());
  });

  it('should report neither failed nor OK if at least one value is false', () => {
    [true, true, true, false].forEach((it) => buffer.add(it));
    chai.assert.isFalse(buffer.allOk());
    chai.assert.isFalse(buffer.allFailed());
  });
});