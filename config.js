exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/fantasypoliticalgame' :
                            'mongodb://localhost/fantasypoliticalgame-dev'
                          );

exports.PORT = process.env.PORT || 8080;
