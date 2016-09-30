'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('series:series');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Book = require('./book.js');

const seriesSchema = Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  author: {type: String, required: true},
  books: [{type: Schema.Types.ObjectId, ref: 'book'}],
});

const Series = module.exports = mongoose.model('series', seriesSchema);

Series.findBookById = function(seriesID, bookID){
  debug('findBookById');
  return Series.findById(seriesID)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(series => {
    debug('series', series);
    return series.books.findById[bookID];
  })
  .then(book => {
    debug('book', book);
    return book;
  });
};

Series.findByIdAndAddBook = function(seriesID, book){
  debug('findByIdAndAddBook');
  return Series.findById(seriesID)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(series => {
    debug('series', series);
    book.seriesID = series._id;
    this.tempSeries = series;
    return new Book(book).save();
  })
  .then(book => {
    debug('book', book);
    this.tempSeries.books.push(book._id);
    this.tempBook = book;
    return this.tempSeries.save();
  })
  .then(() => {
    return Promise.resolve(this.tempBook);
  });
};
