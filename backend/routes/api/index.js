// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const mediaRouter = require('./media.js');
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/media', mediaRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);

module.exports = router;