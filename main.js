// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"package.json":[function(require,module,exports) {
module.exports = {
  "name": "clicv",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "build": "parcel --no-source-maps -t node -d . -o main.js main.ts"
  },
  "dependencies": {
    "@types/chalk": "^2.2.0",
    "@types/inquirer": "^6.5.0",
    "@types/marked": "^0.6.5",
    "@types/marked-terminal": "^3.1.1",
    "@types/node": "^12.7.8",
    "@types/nodemailer": "^6.2.1",
    "@types/terminal-kit": "^1.28.0",
    "@types/tmp": "^0.1.0",
    "@types/vorpal": "^1.12.0",
    "chalk": "^2.4.2",
    "inquirer": "^7.0.0",
    "inquirer-prompt-suggest": "^0.1.0",
    "marked": "^0.7.0",
    "marked-terminal": "^3.3.0",
    "nodemailer": "^6.3.0",
    "parcel-bundler": "^1.12.3",
    "terminal-kit": "^1.31.4",
    "tiny-cli-editor": "^0.1.1",
    "tmp": "^0.1.0",
    "ts-node": "^8.4.1",
    "typescript": "^3.6.3",
    "vorpal": "^1.12.0"
  }
};
},{}],"main.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vorpal_1 = __importDefault(require("vorpal"));

var marked_1 = __importDefault(require("marked"));

var chalk_1 = __importDefault(require("chalk"));

var inquirer_1 = __importDefault(require("inquirer"));

var terminal_kit_1 = __importDefault(require("terminal-kit"));

var marked_terminal_1 = __importDefault(require("marked-terminal"));

var nodemailer_1 = __importDefault(require("nodemailer"));

var path_1 = __importDefault(require("path"));

var fs_1 = __importDefault(require("fs"));

inquirer_1.default.registerPrompt('suggest', require('inquirer-prompt-suggest'));
var cli = new vorpal_1.default();
var term = terminal_kit_1.default.terminal;

var editor = require('tiny-cli-editor');

var package_json_1 = __importDefault(require("./package.json"));

var smtpParams = {
  host: 'core.bc8.org',
  port: 587
};
var sendTo = 'lennon+jobinfo@bc8.org';
var defaultEditorMessage = '\n\n# Enter your message above. ' + 'Type Ctrl-D to save and finish, or Ctrl-C to cancel.\n' + '# These lines will be removed automatically.';
var mail = nodemailer_1.default.createTransport(smtpParams);

var loadPage = function (page) {
  return fs_1.default.readFileSync(path_1.default.join(__dirname, 'pages', page + ".md")).toString();
};

var renderPage = function (page) {
  return term.wrap(marked_1.default(loadPage(page), {
    renderer: new marked_terminal_1.default()
  }));
};

var defaultPrompt = chalk_1.default.blueBright('resume>');
var emailPat = /^\w+[^@]+@[\w\.]+\w+$/;
cli.log("resume v" + package_json_1.default.version + " initialized");
cli.command('about', 'Background Information on @rcoder').action(function (args) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      renderPage('about');
      return [2
      /*return*/
      ];
    });
  });
});
cli.command('skills', 'Technical Skills').action(function (args) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      renderPage('skills');
      return [2
      /*return*/
      ];
    });
  });
});
cli.command('contact', 'Send email to @rcoder').action(function (args) {
  return __awaiter(void 0, void 0, void 0, function () {
    var choices, buffer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cli.hide();
          return [4
          /*yield*/
          , inquirer_1.default.prompt([{
            type: 'input',
            name: 'from',
            message: 'From:',
            validate: function (input) {
              return input.match(emailPat) ? true : 'please enter an email address';
            }
          }, {
            type: 'suggest',
            name: 'subject',
            message: 'Subject:',
            suggestions: ['Question', 'Job Opening', 'Introduction', 'Top Urgent!'].sort(function (a, b) {
              return Math.random() - 0.5;
            }),
            validate: function (input) {
              return input.match(/\w+/) ? true : 'please enter a subject';
            }
          }])];

        case 1:
          choices = _a.sent();
          buffer = editor(defaultEditorMessage);
          buffer.on('submit', function (rawBody) {
            return __awaiter(void 0, void 0, void 0, function () {
              var body, doit;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    body = rawBody.replace(defaultEditorMessage, '').slice(0, 500);
                    cli.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{green From:}    ", ""], ["{green From:}    ", ""])), choices.from));
                    cli.log(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{green Subject:} ", ""], ["{green Subject:} ", ""])), choices.subject));
                    cli.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{green Message:}\n"], ["{green Message:}\\n"]))));
                    cli.log(body);
                    cli.log('\n');
                    return [4
                    /*yield*/
                    , inquirer_1.default.prompt([{
                      type: 'confirm',
                      name: 'doit',
                      message: 'Send?',
                      default: true
                    }])];

                  case 1:
                    doit = _a.sent().doit;
                    if (!doit) return [3
                    /*break*/
                    , 3];
                    return [4
                    /*yield*/
                    , mail.sendMail({
                      to: sendTo,
                      from: choices.from,
                      subject: choices.subject,
                      text: body
                    })];

                  case 2:
                    _a.sent();

                    cli.log('Email sent!');
                    _a.label = 3;

                  case 3:
                    cli.show();
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          });
          buffer.on('abort', function () {
            return __awaiter(void 0, void 0, void 0, function () {
              return __generator(this, function (_a) {
                cli.show();
                return [2
                /*return*/
                ];
              });
            });
          });
          return [2
          /*return*/
          ];
      }
    });
  });
});
cli.exec('help');
cli.delimiter(defaultPrompt).show();
var templateObject_1, templateObject_2, templateObject_3;
},{"./package.json":"package.json"}]},{},["main.ts"], null)