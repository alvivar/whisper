/**
 * WhisperController
 *
 * @description :: Server-side logic for managing whispers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    hi: function(req, res) {
        return res.send("hi!");
    },

    bye: function(req, res) {
        return res.send("bye.")
    }
    
};
