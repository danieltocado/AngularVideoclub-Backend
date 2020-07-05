const { Movie } = require('../models');
const { Op } = require("sequelize")

const MovieController = {
    async getAllMovies(req,res) {
        try {
            const movies = await Movie.findAll({
                limit: 20
            })
            res.status(200).send(movies)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ message : 'There was a problem trying to get the movies.'})
        }
    },
    getPage(req, res) {
        const { page } = req.params;
        const skip = (page - 1) * 20
        Movie.findAll({offset:skip,limit:20})
            .then(movies => res.send(movies))
            .catch(error => {
                console.error(error);
                res.status(500).send({ message : 'There was a problem trying to get the pages.'})
            })
    },
    async searchtitle(req,res) {
        try {
            const { title } = req.params
            const movie = await Movie.findAll({
                where : {
                    title: {
                        [Op.regexp]:`.*${title}.*`
                        }
                }
            });
            if (movie === null){
                res.status(400).send({ message : 'There was a problem trying to get the movie.'});
            }
            res.status(200).send(movie);
            console.log(movie);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message : 'There was a problem trying to create the movie.'})
        }
    },
    async searchid(req,res) {
        try {
            const { id } = req.params;
            const movieId = await Movie.findOne({
                where : {
                    id : id
                }
            })
            if (movieId === null){
                res.status(400).send({ message : 'There was a problem trying to find the movie.'})
            }
            res.status(200).send(movieId);
        } catch (error) {
            console.log(error)
            res.status(500).send({ message : 'There was a problem trying to update the movie.'})
        }
    }, 
    async mostPopular(req,res) {
        try {
            const popular = await Movie.findAll({
                where : {
                    popularity:{
                        [Op.gte] : 50
                    }
                },
                limit: 20,
            });
            res.status(200).send(popular)
        } catch (error) {
            res.status(500).send({ message : 'There was a problem trying to find the movies.'})
        }
    },
    async lastMovies(req,res) {
        try {
            const lastMovies = await Movie.findAll({
                where : {
                    release_date:{
                        [Op.between]: ['2018-01-01', '2020-07-04']
                    }
                },
                limit: 20,
            });
            res.status(200).send(lastMovies)
        } catch (error) {
            res.status(500).send({ message : 'There was a problem trying to find the movies.'});
        }
    }
}

module.exports = MovieController;