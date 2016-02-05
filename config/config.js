module.exports = {
  'secret': 'happytrippers',
  'database': process.env.MONGOLAB_URI || 'mongodb://localhost:27017/happytrippersdb'
};