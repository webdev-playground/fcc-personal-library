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
        const b = books.map(book => ({ _id: book.id, title: book.title, commentcount: book.comments.length }));
        return res.status(200).json(b);
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

    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        return res.status(200).send('complete delete successful');
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });

  app
    .route("/api/books/:id")
    .get(async function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const foundBook = await Book.findById(bookid);
        if (!foundBook) {
          return res.status(404).send('no book exists');
        }
        return res.status(200).json(foundBook);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    })

    .post(async function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      try {
        const updatedBook = await Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true });
        if (!updatedBook) {
          return res.status(404).send('no book exists');
        }
        return res.status(200).json(updatedBook);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    })

    .delete(async function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook) {
          return res.status(404).send('no book exists');
        }
        return res.status(200).send('delete successful');  
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });
};
