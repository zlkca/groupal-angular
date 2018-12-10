'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var prompt = require('prompt');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

    // autoMigratePrompt(app.dataSources.mysqlDs);
    // autoMigrateAction(app.dataSources.mysqlDs);
    autoUpdate(app.dataSources.mysqlDs, []);
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});



var autoUpdate = function(dataSource, tables) {
  // if tables list is not supplied - try and extract them from datasource
  if (!tables || tables.length == 0) {
    tables = getTablesFromDataSource(dataSource);
  }
  console.log(`Starting autoupdate of tables into database ${dataSource.connector.settings.database}`);

  dataSource.autoupdate(tables, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Completed auto update of tables: ${tables.join(', ')}.`);
    }
  });
};

var getTablesFromDataSource = function(ds) {
  let modelnames = Object.keys(ds.models);
  let tables = modelnames.filter(function(modelname) {
    let model = ds.models[modelname];
    if (model && model.dataSource && model.dataSource.name === 'mysqlDs') {
      return true;
    } else {
      return false;
    }
  });
  return tables;
};


var autoMigratePrompt = function(dataSource) {
  prompt.start();
  prompt.get([{
    name: 'reply', description: 'Do you want to reset database? (y/n)',
  }], function(err, res) {
    if (res.reply == 'y') {
      // reset data in database
      autoMigrateAction(dataSource);
    } else {
      console.log('skipping automigrate');
      autoUpdate(dataSource, []);
    }
  });
};

var autoMigrateAction = function(dataSource) {
  dataSource.automigrate(function() {
    createData(dataSource)
      .then(function() {
        console.log('auto migrate completed');
      });
  });
};

// If required to load data when intializing db
var createData = function(ds) {
    return ds.models.Account.create({ username: 'admin', email: 'admin@example.com', password: 'admin', type: 'super' }
  )
    .then(function() {
      return ds.models.Role.create({ name: 'super' });
    })
    .then(function(role) {

      return role.principals.create([{
        principalType: 'ROLE',
        principalId: 1,
      }
    ]);

    })
    .then(function() {
      return ds.models.Account.create([
        { username: 'organizer', email: 'organizer@example.com', password: 'organizer', type: 'organizer' },
        { username: 'user', email: 'user@example.com', password: 'user', type: 'user' },
      ]);
    })
    .then(function() {
      return ds.models.Group.create([
        {
          name: 'group 1',
          description: 'group 1 description',
          ownerId:2,
          categoryId:1,
        },
        {
          name: 'group 2',
          description: 'group 2 description',
          ownerId:2,
          categoryId:2,
        },
        {
          name: 'group 3',
          description: 'group 3 description',
          ownerId:2,
          categoryId:3,
        },
      ]);
    })
    .then(function() {
      return ds.models.Category.create([
        {
          name: 'category 1',
          description: 'category 1 description',
        },
        {
          name: 'category 2',
          description: 'category 2 description',
        },
        {
          name: 'category 3',
          description: 'category 3 description',
        },
      ]);
    })
    .then(function() {
      return ds.models.GroupCategory.create([
        {
          groupId: 1,
          categoryId: 1,
        },
        {
          groupId: 2,
          categoryId: 2,
        },
        {
          groupId: 3,
          categoryId: 3,
        },
      ]);
    })
    .then(function() {
      return ds.models.Picture.create([
        {
          name: 'logo1',
          type: 'logo',
          index: 1,
          groupId: 1,
        },
        {
          name: 'logo2',
          type: 'logo',
          index: 1,
          groupId: 2
        },
      ]);
    })
    .then(function() {
      return ds.models.Event.create([
        {
          name: 'evnet 1',
          description: 'event 1 description',
        },
        {
          name: 'evnet 2',
          description: 'event 2 description',
        },
        {
          name: 'evnet 3',
          description: 'event 3 description',
        },
      ]);
    })
    .catch(function(err) {
      console.log(err);
    });
};