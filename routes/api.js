/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const Book = require("../models/book");

module.exports = function(app) {
  app
    .route("/api/books")
    .get(async function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        b = books.map(book => { _id: book.id, title: book.title, commentcount: book.comments.length });
        return res.status(200).json(books);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    })

    .post(async function(req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        const newBook = await Book.create({ title });
        return res.status(201).json(newBook);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
