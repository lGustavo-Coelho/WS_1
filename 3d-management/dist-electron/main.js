"use strict";
const electron = require("electron");
const require$$0$4 = require("path");
const require$$0$3 = require("fs");
const require$$0 = require("events");
const require$$4 = require("timers");
const require$$2$1 = require("util");
const require$$2 = require("stream");
const require$$0$1 = require("tty");
const require$$0$2 = require("os");
const require$$1 = require("url");
const require$$0$5 = require("assert");
const require$$1$1 = require("better-sqlite3");
const require$$14 = require("pg");
const require$$15 = require("pg-query-stream");
const require$$13 = require("tedious");
const require$$13$1 = require("mysql");
const require$$2$2 = require("mysql2");
const require$$0$6 = require("crypto");
const require$$3 = require("oracledb");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var tarn = { exports: {} };
var Pool = {};
var PendingOperation = {};
var TimeoutError = {};
var hasRequiredTimeoutError;
function requireTimeoutError() {
  if (hasRequiredTimeoutError) return TimeoutError;
  hasRequiredTimeoutError = 1;
  Object.defineProperty(TimeoutError, "__esModule", { value: true });
  let TimeoutError$1 = class TimeoutError extends Error {
  };
  TimeoutError.TimeoutError = TimeoutError$1;
  return TimeoutError;
}
var utils$3 = {};
var PromiseInspection = {};
var hasRequiredPromiseInspection;
function requirePromiseInspection() {
  if (hasRequiredPromiseInspection) return PromiseInspection;
  hasRequiredPromiseInspection = 1;
  Object.defineProperty(PromiseInspection, "__esModule", { value: true });
  let PromiseInspection$1 = class PromiseInspection {
    constructor(args) {
      this._value = args.value;
      this._error = args.error;
    }
    value() {
      return this._value;
    }
    reason() {
      return this._error;
    }
    isRejected() {
      return !!this._error;
    }
    isFulfilled() {
      return !!this._value;
    }
  };
  PromiseInspection.PromiseInspection = PromiseInspection$1;
  return PromiseInspection;
}
var hasRequiredUtils$3;
function requireUtils$3() {
  if (hasRequiredUtils$3) return utils$3;
  hasRequiredUtils$3 = 1;
  Object.defineProperty(utils$3, "__esModule", { value: true });
  const PromiseInspection_1 = requirePromiseInspection();
  function defer() {
    let resolve = null;
    let reject = null;
    const promise = new Promise((resolver, rejecter) => {
      resolve = resolver;
      reject = rejecter;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  utils$3.defer = defer;
  function now() {
    return Date.now();
  }
  utils$3.now = now;
  function duration(t1, t2) {
    return Math.abs(t2 - t1);
  }
  utils$3.duration = duration;
  function checkOptionalTime(time) {
    if (typeof time === "undefined") {
      return true;
    }
    return checkRequiredTime(time);
  }
  utils$3.checkOptionalTime = checkOptionalTime;
  function checkRequiredTime(time) {
    return typeof time === "number" && time === Math.round(time) && time > 0;
  }
  utils$3.checkRequiredTime = checkRequiredTime;
  function delay2(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }
  utils$3.delay = delay2;
  function reflect(promise) {
    return promise.then((value) => {
      return new PromiseInspection_1.PromiseInspection({ value });
    }).catch((error) => {
      return new PromiseInspection_1.PromiseInspection({ error });
    });
  }
  utils$3.reflect = reflect;
  function tryPromise(cb) {
    try {
      const result = cb();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  utils$3.tryPromise = tryPromise;
  return utils$3;
}
var hasRequiredPendingOperation;
function requirePendingOperation() {
  if (hasRequiredPendingOperation) return PendingOperation;
  hasRequiredPendingOperation = 1;
  Object.defineProperty(PendingOperation, "__esModule", { value: true });
  const TimeoutError_1 = requireTimeoutError();
  const utils_1 = requireUtils$3();
  let PendingOperation$1 = class PendingOperation {
    constructor(timeoutMillis) {
      this.timeoutMillis = timeoutMillis;
      this.deferred = utils_1.defer();
      this.possibleTimeoutCause = null;
      this.isRejected = false;
      this.promise = timeout2(this.deferred.promise, timeoutMillis).catch((err) => {
        if (err instanceof TimeoutError_1.TimeoutError) {
          if (this.possibleTimeoutCause) {
            err = new TimeoutError_1.TimeoutError(this.possibleTimeoutCause.message);
          } else {
            err = new TimeoutError_1.TimeoutError("operation timed out for an unknown reason");
          }
        }
        this.isRejected = true;
        return Promise.reject(err);
      });
    }
    abort() {
      this.reject(new Error("aborted"));
    }
    reject(err) {
      this.deferred.reject(err);
    }
    resolve(value) {
      this.deferred.resolve(value);
    }
  };
  PendingOperation.PendingOperation = PendingOperation$1;
  function timeout2(promise, time) {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => reject(new TimeoutError_1.TimeoutError()), time);
      promise.then((result) => {
        clearTimeout(timeoutHandle);
        resolve(result);
      }).catch((err) => {
        clearTimeout(timeoutHandle);
        reject(err);
      });
    });
  }
  return PendingOperation;
}
var Resource = {};
var hasRequiredResource;
function requireResource() {
  if (hasRequiredResource) return Resource;
  hasRequiredResource = 1;
  Object.defineProperty(Resource, "__esModule", { value: true });
  const utils_1 = requireUtils$3();
  let Resource$1 = class Resource2 {
    constructor(resource) {
      this.resource = resource;
      this.resource = resource;
      this.timestamp = utils_1.now();
      this.deferred = utils_1.defer();
    }
    get promise() {
      return this.deferred.promise;
    }
    resolve() {
      this.deferred.resolve(void 0);
      return new Resource2(this.resource);
    }
  };
  Resource.Resource = Resource$1;
  return Resource;
}
var hasRequiredPool;
function requirePool() {
  if (hasRequiredPool) return Pool;
  hasRequiredPool = 1;
  Object.defineProperty(Pool, "__esModule", { value: true });
  const PendingOperation_1 = requirePendingOperation();
  const Resource_1 = requireResource();
  const utils_1 = requireUtils$3();
  const events_1 = require$$0;
  const timers_1 = require$$4;
  let Pool$1 = class Pool {
    constructor(opt) {
      this.destroyed = false;
      this.emitter = new events_1.EventEmitter();
      opt = opt || {};
      if (!opt.create) {
        throw new Error("Tarn: opt.create function most be provided");
      }
      if (!opt.destroy) {
        throw new Error("Tarn: opt.destroy function most be provided");
      }
      if (typeof opt.min !== "number" || opt.min < 0 || opt.min !== Math.round(opt.min)) {
        throw new Error("Tarn: opt.min must be an integer >= 0");
      }
      if (typeof opt.max !== "number" || opt.max <= 0 || opt.max !== Math.round(opt.max)) {
        throw new Error("Tarn: opt.max must be an integer > 0");
      }
      if (opt.min > opt.max) {
        throw new Error("Tarn: opt.max is smaller than opt.min");
      }
      if (!utils_1.checkOptionalTime(opt.acquireTimeoutMillis)) {
        throw new Error("Tarn: invalid opt.acquireTimeoutMillis " + JSON.stringify(opt.acquireTimeoutMillis));
      }
      if (!utils_1.checkOptionalTime(opt.createTimeoutMillis)) {
        throw new Error("Tarn: invalid opt.createTimeoutMillis " + JSON.stringify(opt.createTimeoutMillis));
      }
      if (!utils_1.checkOptionalTime(opt.destroyTimeoutMillis)) {
        throw new Error("Tarn: invalid opt.destroyTimeoutMillis " + JSON.stringify(opt.destroyTimeoutMillis));
      }
      if (!utils_1.checkOptionalTime(opt.idleTimeoutMillis)) {
        throw new Error("Tarn: invalid opt.idleTimeoutMillis " + JSON.stringify(opt.idleTimeoutMillis));
      }
      if (!utils_1.checkOptionalTime(opt.reapIntervalMillis)) {
        throw new Error("Tarn: invalid opt.reapIntervalMillis " + JSON.stringify(opt.reapIntervalMillis));
      }
      if (!utils_1.checkOptionalTime(opt.createRetryIntervalMillis)) {
        throw new Error("Tarn: invalid opt.createRetryIntervalMillis " + JSON.stringify(opt.createRetryIntervalMillis));
      }
      const allowedKeys = {
        create: true,
        validate: true,
        destroy: true,
        log: true,
        min: true,
        max: true,
        acquireTimeoutMillis: true,
        createTimeoutMillis: true,
        destroyTimeoutMillis: true,
        idleTimeoutMillis: true,
        reapIntervalMillis: true,
        createRetryIntervalMillis: true,
        propagateCreateError: true
      };
      for (const key of Object.keys(opt)) {
        if (!allowedKeys[key]) {
          throw new Error(`Tarn: unsupported option opt.${key}`);
        }
      }
      this.creator = opt.create;
      this.destroyer = opt.destroy;
      this.validate = typeof opt.validate === "function" ? opt.validate : () => true;
      this.log = opt.log || (() => {
      });
      this.acquireTimeoutMillis = opt.acquireTimeoutMillis || 3e4;
      this.createTimeoutMillis = opt.createTimeoutMillis || 3e4;
      this.destroyTimeoutMillis = opt.destroyTimeoutMillis || 5e3;
      this.idleTimeoutMillis = opt.idleTimeoutMillis || 3e4;
      this.reapIntervalMillis = opt.reapIntervalMillis || 1e3;
      this.createRetryIntervalMillis = opt.createRetryIntervalMillis || 200;
      this.propagateCreateError = !!opt.propagateCreateError;
      this.min = opt.min;
      this.max = opt.max;
      this.used = [];
      this.free = [];
      this.pendingCreates = [];
      this.pendingAcquires = [];
      this.pendingDestroys = [];
      this.pendingValidations = [];
      this.destroyed = false;
      this.interval = null;
      this.eventId = 1;
    }
    numUsed() {
      return this.used.length;
    }
    numFree() {
      return this.free.length;
    }
    numPendingAcquires() {
      return this.pendingAcquires.length;
    }
    numPendingValidations() {
      return this.pendingValidations.length;
    }
    numPendingCreates() {
      return this.pendingCreates.length;
    }
    acquire() {
      const eventId = this.eventId++;
      this._executeEventHandlers("acquireRequest", eventId);
      const pendingAcquire = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
      this.pendingAcquires.push(pendingAcquire);
      pendingAcquire.promise = pendingAcquire.promise.then((resource) => {
        this._executeEventHandlers("acquireSuccess", eventId, resource);
        return resource;
      }).catch((err) => {
        this._executeEventHandlers("acquireFail", eventId, err);
        remove(this.pendingAcquires, pendingAcquire);
        return Promise.reject(err);
      });
      this._tryAcquireOrCreate();
      return pendingAcquire;
    }
    release(resource) {
      this._executeEventHandlers("release", resource);
      for (let i = 0, l = this.used.length; i < l; ++i) {
        const used = this.used[i];
        if (used.resource === resource) {
          this.used.splice(i, 1);
          this.free.push(used.resolve());
          this._tryAcquireOrCreate();
          return true;
        }
      }
      return false;
    }
    isEmpty() {
      return [
        this.numFree(),
        this.numUsed(),
        this.numPendingAcquires(),
        this.numPendingValidations(),
        this.numPendingCreates()
      ].reduce((total, value) => total + value) === 0;
    }
    /**
     * Reaping cycle.
     */
    check() {
      const timestamp2 = utils_1.now();
      const newFree = [];
      const minKeep = this.min - this.used.length;
      const maxDestroy = this.free.length - minKeep;
      let numDestroyed = 0;
      this.free.forEach((free) => {
        if (utils_1.duration(timestamp2, free.timestamp) >= this.idleTimeoutMillis && numDestroyed < maxDestroy) {
          numDestroyed++;
          this._destroy(free.resource);
        } else {
          newFree.push(free);
        }
      });
      this.free = newFree;
      if (this.isEmpty()) {
        this._stopReaping();
      }
    }
    destroy() {
      const eventId = this.eventId++;
      this._executeEventHandlers("poolDestroyRequest", eventId);
      this._stopReaping();
      this.destroyed = true;
      return utils_1.reflect(Promise.all(this.pendingCreates.map((create) => utils_1.reflect(create.promise))).then(() => {
        return new Promise((resolve, reject) => {
          if (this.numPendingValidations() === 0) {
            resolve();
            return;
          }
          const interval = setInterval(() => {
            if (this.numPendingValidations() === 0) {
              timers_1.clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }).then(() => {
        return Promise.all(this.used.map((used) => utils_1.reflect(used.promise)));
      }).then(() => {
        return Promise.all(this.pendingAcquires.map((acquire) => {
          acquire.abort();
          return utils_1.reflect(acquire.promise);
        }));
      }).then(() => {
        return Promise.all(this.free.map((free) => utils_1.reflect(this._destroy(free.resource))));
      }).then(() => {
        return Promise.all(this.pendingDestroys.map((pd) => pd.promise));
      }).then(() => {
        this.free = [];
        this.pendingAcquires = [];
      })).then((res) => {
        this._executeEventHandlers("poolDestroySuccess", eventId);
        this.emitter.removeAllListeners();
        return res;
      });
    }
    on(event, listener) {
      this.emitter.on(event, listener);
    }
    removeListener(event, listener) {
      this.emitter.removeListener(event, listener);
    }
    removeAllListeners(event) {
      this.emitter.removeAllListeners(event);
    }
    /**
     * The most important method that is called always when resources
     * are created / destroyed / acquired / released. In other words
     * every time when resources are moved from used to free or vice
     * versa.
     *
     * Either assigns free resources to pendingAcquires or creates new
     * resources if there is room for it in the pool.
     */
    _tryAcquireOrCreate() {
      if (this.destroyed) {
        return;
      }
      if (this._hasFreeResources()) {
        this._doAcquire();
      } else if (this._shouldCreateMoreResources()) {
        this._doCreate();
      }
    }
    _hasFreeResources() {
      return this.free.length > 0;
    }
    _doAcquire() {
      while (this._canAcquire()) {
        const pendingAcquire = this.pendingAcquires.shift();
        const free = this.free.pop();
        if (free === void 0 || pendingAcquire === void 0) {
          const errMessage = "this.free was empty while trying to acquire resource";
          this.log(`Tarn: ${errMessage}`, "warn");
          throw new Error(`Internal error, should never happen. ${errMessage}`);
        }
        this.pendingValidations.push(pendingAcquire);
        this.used.push(free);
        const abortAbleValidation = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
        pendingAcquire.promise.catch((err) => {
          abortAbleValidation.abort();
        });
        abortAbleValidation.promise.catch((err) => {
          this.log("Tarn: resource validator threw an exception " + err.stack, "warn");
          return false;
        }).then((validationSuccess) => {
          try {
            if (validationSuccess && !pendingAcquire.isRejected) {
              this._startReaping();
              pendingAcquire.resolve(free.resource);
            } else {
              remove(this.used, free);
              if (!validationSuccess) {
                this._destroy(free.resource);
                setTimeout(() => {
                  this._tryAcquireOrCreate();
                }, 0);
              } else {
                this.free.push(free);
              }
              if (!pendingAcquire.isRejected) {
                this.pendingAcquires.unshift(pendingAcquire);
              }
            }
          } finally {
            remove(this.pendingValidations, pendingAcquire);
          }
        });
        this._validateResource(free.resource).then((validationSuccess) => {
          abortAbleValidation.resolve(validationSuccess);
        }).catch((err) => {
          abortAbleValidation.reject(err);
        });
      }
    }
    _canAcquire() {
      return this.free.length > 0 && this.pendingAcquires.length > 0;
    }
    _validateResource(resource) {
      try {
        return Promise.resolve(this.validate(resource));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    _shouldCreateMoreResources() {
      return this.used.length + this.pendingCreates.length < this.max && this.pendingCreates.length < this.pendingAcquires.length;
    }
    _doCreate() {
      const pendingAcquiresBeforeCreate = this.pendingAcquires.slice();
      const pendingCreate = this._create();
      pendingCreate.promise.then(() => {
        this._tryAcquireOrCreate();
        return null;
      }).catch((err) => {
        if (this.propagateCreateError && this.pendingAcquires.length !== 0) {
          this.pendingAcquires[0].reject(err);
        }
        pendingAcquiresBeforeCreate.forEach((pendingAcquire) => {
          pendingAcquire.possibleTimeoutCause = err;
        });
        utils_1.delay(this.createRetryIntervalMillis).then(() => this._tryAcquireOrCreate());
      });
    }
    _create() {
      const eventId = this.eventId++;
      this._executeEventHandlers("createRequest", eventId);
      const pendingCreate = new PendingOperation_1.PendingOperation(this.createTimeoutMillis);
      pendingCreate.promise = pendingCreate.promise.catch((err) => {
        if (remove(this.pendingCreates, pendingCreate)) {
          this._executeEventHandlers("createFail", eventId, err);
        }
        throw err;
      });
      this.pendingCreates.push(pendingCreate);
      callbackOrPromise(this.creator).then((resource) => {
        if (pendingCreate.isRejected) {
          this.destroyer(resource);
          return null;
        }
        remove(this.pendingCreates, pendingCreate);
        this.free.push(new Resource_1.Resource(resource));
        pendingCreate.resolve(resource);
        this._executeEventHandlers("createSuccess", eventId, resource);
        return null;
      }).catch((err) => {
        if (pendingCreate.isRejected) {
          return null;
        }
        if (remove(this.pendingCreates, pendingCreate)) {
          this._executeEventHandlers("createFail", eventId, err);
        }
        pendingCreate.reject(err);
        return null;
      });
      return pendingCreate;
    }
    _destroy(resource) {
      const eventId = this.eventId++;
      this._executeEventHandlers("destroyRequest", eventId, resource);
      const pendingDestroy = new PendingOperation_1.PendingOperation(this.destroyTimeoutMillis);
      const retVal = Promise.resolve().then(() => this.destroyer(resource));
      retVal.then(() => {
        pendingDestroy.resolve(resource);
      }).catch((err) => {
        pendingDestroy.reject(err);
      });
      this.pendingDestroys.push(pendingDestroy);
      return pendingDestroy.promise.then((res) => {
        this._executeEventHandlers("destroySuccess", eventId, resource);
        return res;
      }).catch((err) => this._logDestroyerError(eventId, resource, err)).then((res) => {
        const index = this.pendingDestroys.findIndex((pd) => pd === pendingDestroy);
        this.pendingDestroys.splice(index, 1);
        return res;
      });
    }
    _logDestroyerError(eventId, resource, err) {
      this._executeEventHandlers("destroyFail", eventId, resource, err);
      this.log("Tarn: resource destroyer threw an exception " + err.stack, "warn");
    }
    _startReaping() {
      if (!this.interval) {
        this._executeEventHandlers("startReaping");
        this.interval = setInterval(() => this.check(), this.reapIntervalMillis);
      }
    }
    _stopReaping() {
      if (this.interval !== null) {
        this._executeEventHandlers("stopReaping");
        timers_1.clearInterval(this.interval);
      }
      this.interval = null;
    }
    _executeEventHandlers(eventName, ...args) {
      const listeners = this.emitter.listeners(eventName);
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (err) {
          this.log(`Tarn: event handler "${eventName}" threw an exception ${err.stack}`, "warn");
        }
      });
    }
  };
  Pool.Pool = Pool$1;
  function remove(arr, item) {
    const idx = arr.indexOf(item);
    if (idx === -1) {
      return false;
    } else {
      arr.splice(idx, 1);
      return true;
    }
  }
  function callbackOrPromise(func) {
    return new Promise((resolve, reject) => {
      const callback = (err, resource) => {
        if (err) {
          reject(err);
        } else {
          resolve(resource);
        }
      };
      utils_1.tryPromise(() => func(callback)).then((res) => {
        if (res) {
          resolve(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }
  return Pool;
}
var hasRequiredTarn;
function requireTarn() {
  if (hasRequiredTarn) return tarn.exports;
  hasRequiredTarn = 1;
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    const Pool_1 = requirePool();
    exports.Pool = Pool_1.Pool;
    const TimeoutError_1 = requireTimeoutError();
    exports.TimeoutError = TimeoutError_1.TimeoutError;
    module.exports = {
      Pool: Pool_1.Pool,
      TimeoutError: TimeoutError_1.TimeoutError
    };
  })(tarn, tarn.exports);
  return tarn.exports;
}
var string;
var hasRequiredString;
function requireString() {
  if (hasRequiredString) return string;
  hasRequiredString = 1;
  const charsRegex = /[\0\b\t\n\r\x1a"'\\]/g;
  const charsMap = {
    "\0": "\\0",
    "\b": "\\b",
    "	": "\\t",
    "\n": "\\n",
    "\r": "\\r",
    "": "\\Z",
    '"': '\\"',
    "'": "\\'",
    "\\": "\\\\"
  };
  function wrapEscape(escapeFn) {
    return function finalEscape(val, ctx = {}) {
      return escapeFn(val, finalEscape, ctx);
    };
  }
  function makeEscape(config = {}) {
    const finalEscapeDate = config.escapeDate || dateToString;
    const finalEscapeArray = config.escapeArray || arrayToList;
    const finalEscapeBuffer = config.escapeBuffer || bufferToString;
    const finalEscapeString = config.escapeString || escapeString;
    const finalEscapeObject = config.escapeObject || escapeObject;
    const finalWrap = config.wrap || wrapEscape;
    function escapeFn(val, finalEscape, ctx) {
      if (val === void 0 || val === null) {
        return "NULL";
      }
      switch (typeof val) {
        case "boolean":
          return val ? "true" : "false";
        case "number":
          return val + "";
        case "object":
          if (val instanceof Date) {
            val = finalEscapeDate(val, finalEscape, ctx);
          } else if (Array.isArray(val)) {
            return finalEscapeArray(val, finalEscape, ctx);
          } else if (Buffer.isBuffer(val)) {
            return finalEscapeBuffer(val, finalEscape, ctx);
          } else {
            return finalEscapeObject(val, finalEscape, ctx);
          }
      }
      return finalEscapeString(val, finalEscape, ctx);
    }
    return finalWrap ? finalWrap(escapeFn) : escapeFn;
  }
  function escapeObject(val, finalEscape, ctx) {
    if (val && typeof val.toSQL === "function") {
      return val.toSQL(ctx);
    } else {
      return JSON.stringify(val);
    }
  }
  function arrayToList(array, finalEscape, ctx) {
    let sql = "";
    for (let i = 0; i < array.length; i++) {
      const val = array[i];
      if (Array.isArray(val)) {
        sql += (i === 0 ? "" : ", ") + "(" + arrayToList(val, finalEscape, ctx) + ")";
      } else {
        sql += (i === 0 ? "" : ", ") + finalEscape(val, ctx);
      }
    }
    return sql;
  }
  function bufferToString(buffer) {
    return "X" + escapeString(buffer.toString("hex"));
  }
  function escapeString(val, finalEscape, ctx) {
    let chunkIndex = charsRegex.lastIndex = 0;
    let escapedVal = "";
    let match;
    while (match = charsRegex.exec(val)) {
      escapedVal += val.slice(chunkIndex, match.index) + charsMap[match[0]];
      chunkIndex = charsRegex.lastIndex;
    }
    if (chunkIndex === 0) {
      return "'" + val + "'";
    }
    if (chunkIndex < val.length) {
      return "'" + escapedVal + val.slice(chunkIndex) + "'";
    }
    return "'" + escapedVal + "'";
  }
  function dateToString(date, finalEscape, ctx = {}) {
    const timeZone = ctx.timeZone || "local";
    const dt = new Date(date);
    let year;
    let month;
    let day;
    let hour;
    let minute;
    let second;
    let millisecond;
    if (timeZone === "local") {
      year = dt.getFullYear();
      month = dt.getMonth() + 1;
      day = dt.getDate();
      hour = dt.getHours();
      minute = dt.getMinutes();
      second = dt.getSeconds();
      millisecond = dt.getMilliseconds();
    } else {
      const tz = convertTimezone(timeZone);
      if (tz !== false && tz !== 0) {
        dt.setTime(dt.getTime() + tz * 6e4);
      }
      year = dt.getUTCFullYear();
      month = dt.getUTCMonth() + 1;
      day = dt.getUTCDate();
      hour = dt.getUTCHours();
      minute = dt.getUTCMinutes();
      second = dt.getUTCSeconds();
      millisecond = dt.getUTCMilliseconds();
    }
    return zeroPad(year, 4) + "-" + zeroPad(month, 2) + "-" + zeroPad(day, 2) + " " + zeroPad(hour, 2) + ":" + zeroPad(minute, 2) + ":" + zeroPad(second, 2) + "." + zeroPad(millisecond, 3);
  }
  function zeroPad(number, length) {
    number = number.toString();
    while (number.length < length) {
      number = "0" + number;
    }
    return number;
  }
  function convertTimezone(tz) {
    if (tz === "Z") {
      return 0;
    }
    const m = tz.match(/([+\-\s])(\d\d):?(\d\d)?/);
    if (m) {
      return (m[1] == "-" ? -1 : 1) * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) * 60;
    }
    return false;
  }
  string = {
    arrayToList,
    bufferToString,
    dateToString,
    escapeString,
    charsRegex,
    charsMap,
    escapeObject,
    makeEscape
  };
  return string;
}
var _listCacheClear;
var hasRequired_listCacheClear;
function require_listCacheClear() {
  if (hasRequired_listCacheClear) return _listCacheClear;
  hasRequired_listCacheClear = 1;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  _listCacheClear = listCacheClear;
  return _listCacheClear;
}
var eq_1;
var hasRequiredEq;
function requireEq() {
  if (hasRequiredEq) return eq_1;
  hasRequiredEq = 1;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  eq_1 = eq;
  return eq_1;
}
var _assocIndexOf;
var hasRequired_assocIndexOf;
function require_assocIndexOf() {
  if (hasRequired_assocIndexOf) return _assocIndexOf;
  hasRequired_assocIndexOf = 1;
  var eq = requireEq();
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  _assocIndexOf = assocIndexOf;
  return _assocIndexOf;
}
var _listCacheDelete;
var hasRequired_listCacheDelete;
function require_listCacheDelete() {
  if (hasRequired_listCacheDelete) return _listCacheDelete;
  hasRequired_listCacheDelete = 1;
  var assocIndexOf = require_assocIndexOf();
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  _listCacheDelete = listCacheDelete;
  return _listCacheDelete;
}
var _listCacheGet;
var hasRequired_listCacheGet;
function require_listCacheGet() {
  if (hasRequired_listCacheGet) return _listCacheGet;
  hasRequired_listCacheGet = 1;
  var assocIndexOf = require_assocIndexOf();
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  _listCacheGet = listCacheGet;
  return _listCacheGet;
}
var _listCacheHas;
var hasRequired_listCacheHas;
function require_listCacheHas() {
  if (hasRequired_listCacheHas) return _listCacheHas;
  hasRequired_listCacheHas = 1;
  var assocIndexOf = require_assocIndexOf();
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  _listCacheHas = listCacheHas;
  return _listCacheHas;
}
var _listCacheSet;
var hasRequired_listCacheSet;
function require_listCacheSet() {
  if (hasRequired_listCacheSet) return _listCacheSet;
  hasRequired_listCacheSet = 1;
  var assocIndexOf = require_assocIndexOf();
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  _listCacheSet = listCacheSet;
  return _listCacheSet;
}
var _ListCache;
var hasRequired_ListCache;
function require_ListCache() {
  if (hasRequired_ListCache) return _ListCache;
  hasRequired_ListCache = 1;
  var listCacheClear = require_listCacheClear(), listCacheDelete = require_listCacheDelete(), listCacheGet = require_listCacheGet(), listCacheHas = require_listCacheHas(), listCacheSet = require_listCacheSet();
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  _ListCache = ListCache;
  return _ListCache;
}
var _stackClear;
var hasRequired_stackClear;
function require_stackClear() {
  if (hasRequired_stackClear) return _stackClear;
  hasRequired_stackClear = 1;
  var ListCache = require_ListCache();
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  _stackClear = stackClear;
  return _stackClear;
}
var _stackDelete;
var hasRequired_stackDelete;
function require_stackDelete() {
  if (hasRequired_stackDelete) return _stackDelete;
  hasRequired_stackDelete = 1;
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  _stackDelete = stackDelete;
  return _stackDelete;
}
var _stackGet;
var hasRequired_stackGet;
function require_stackGet() {
  if (hasRequired_stackGet) return _stackGet;
  hasRequired_stackGet = 1;
  function stackGet(key) {
    return this.__data__.get(key);
  }
  _stackGet = stackGet;
  return _stackGet;
}
var _stackHas;
var hasRequired_stackHas;
function require_stackHas() {
  if (hasRequired_stackHas) return _stackHas;
  hasRequired_stackHas = 1;
  function stackHas(key) {
    return this.__data__.has(key);
  }
  _stackHas = stackHas;
  return _stackHas;
}
var _freeGlobal;
var hasRequired_freeGlobal;
function require_freeGlobal() {
  if (hasRequired_freeGlobal) return _freeGlobal;
  hasRequired_freeGlobal = 1;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  _freeGlobal = freeGlobal;
  return _freeGlobal;
}
var _root;
var hasRequired_root;
function require_root() {
  if (hasRequired_root) return _root;
  hasRequired_root = 1;
  var freeGlobal = require_freeGlobal();
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  _root = root;
  return _root;
}
var _Symbol;
var hasRequired_Symbol;
function require_Symbol() {
  if (hasRequired_Symbol) return _Symbol;
  hasRequired_Symbol = 1;
  var root = require_root();
  var Symbol2 = root.Symbol;
  _Symbol = Symbol2;
  return _Symbol;
}
var _getRawTag;
var hasRequired_getRawTag;
function require_getRawTag() {
  if (hasRequired_getRawTag) return _getRawTag;
  hasRequired_getRawTag = 1;
  var Symbol2 = require_Symbol();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  _getRawTag = getRawTag;
  return _getRawTag;
}
var _objectToString;
var hasRequired_objectToString;
function require_objectToString() {
  if (hasRequired_objectToString) return _objectToString;
  hasRequired_objectToString = 1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  _objectToString = objectToString;
  return _objectToString;
}
var _baseGetTag;
var hasRequired_baseGetTag;
function require_baseGetTag() {
  if (hasRequired_baseGetTag) return _baseGetTag;
  hasRequired_baseGetTag = 1;
  var Symbol2 = require_Symbol(), getRawTag = require_getRawTag(), objectToString = require_objectToString();
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  _baseGetTag = baseGetTag;
  return _baseGetTag;
}
var isObject_1;
var hasRequiredIsObject;
function requireIsObject() {
  if (hasRequiredIsObject) return isObject_1;
  hasRequiredIsObject = 1;
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  isObject_1 = isObject;
  return isObject_1;
}
var isFunction_1;
var hasRequiredIsFunction;
function requireIsFunction() {
  if (hasRequiredIsFunction) return isFunction_1;
  hasRequiredIsFunction = 1;
  var baseGetTag = require_baseGetTag(), isObject = requireIsObject();
  var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  isFunction_1 = isFunction;
  return isFunction_1;
}
var _coreJsData;
var hasRequired_coreJsData;
function require_coreJsData() {
  if (hasRequired_coreJsData) return _coreJsData;
  hasRequired_coreJsData = 1;
  var root = require_root();
  var coreJsData = root["__core-js_shared__"];
  _coreJsData = coreJsData;
  return _coreJsData;
}
var _isMasked;
var hasRequired_isMasked;
function require_isMasked() {
  if (hasRequired_isMasked) return _isMasked;
  hasRequired_isMasked = 1;
  var coreJsData = require_coreJsData();
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  })();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  _isMasked = isMasked;
  return _isMasked;
}
var _toSource;
var hasRequired_toSource;
function require_toSource() {
  if (hasRequired_toSource) return _toSource;
  hasRequired_toSource = 1;
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  _toSource = toSource;
  return _toSource;
}
var _baseIsNative;
var hasRequired_baseIsNative;
function require_baseIsNative() {
  if (hasRequired_baseIsNative) return _baseIsNative;
  hasRequired_baseIsNative = 1;
  var isFunction = requireIsFunction(), isMasked = require_isMasked(), isObject = requireIsObject(), toSource = require_toSource();
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto = Function.prototype, objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  _baseIsNative = baseIsNative;
  return _baseIsNative;
}
var _getValue;
var hasRequired_getValue;
function require_getValue() {
  if (hasRequired_getValue) return _getValue;
  hasRequired_getValue = 1;
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  _getValue = getValue;
  return _getValue;
}
var _getNative;
var hasRequired_getNative;
function require_getNative() {
  if (hasRequired_getNative) return _getNative;
  hasRequired_getNative = 1;
  var baseIsNative = require_baseIsNative(), getValue = require_getValue();
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  _getNative = getNative;
  return _getNative;
}
var _Map;
var hasRequired_Map;
function require_Map() {
  if (hasRequired_Map) return _Map;
  hasRequired_Map = 1;
  var getNative = require_getNative(), root = require_root();
  var Map2 = getNative(root, "Map");
  _Map = Map2;
  return _Map;
}
var _nativeCreate;
var hasRequired_nativeCreate;
function require_nativeCreate() {
  if (hasRequired_nativeCreate) return _nativeCreate;
  hasRequired_nativeCreate = 1;
  var getNative = require_getNative();
  var nativeCreate = getNative(Object, "create");
  _nativeCreate = nativeCreate;
  return _nativeCreate;
}
var _hashClear;
var hasRequired_hashClear;
function require_hashClear() {
  if (hasRequired_hashClear) return _hashClear;
  hasRequired_hashClear = 1;
  var nativeCreate = require_nativeCreate();
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  _hashClear = hashClear;
  return _hashClear;
}
var _hashDelete;
var hasRequired_hashDelete;
function require_hashDelete() {
  if (hasRequired_hashDelete) return _hashDelete;
  hasRequired_hashDelete = 1;
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  _hashDelete = hashDelete;
  return _hashDelete;
}
var _hashGet;
var hasRequired_hashGet;
function require_hashGet() {
  if (hasRequired_hashGet) return _hashGet;
  hasRequired_hashGet = 1;
  var nativeCreate = require_nativeCreate();
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  _hashGet = hashGet;
  return _hashGet;
}
var _hashHas;
var hasRequired_hashHas;
function require_hashHas() {
  if (hasRequired_hashHas) return _hashHas;
  hasRequired_hashHas = 1;
  var nativeCreate = require_nativeCreate();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  _hashHas = hashHas;
  return _hashHas;
}
var _hashSet;
var hasRequired_hashSet;
function require_hashSet() {
  if (hasRequired_hashSet) return _hashSet;
  hasRequired_hashSet = 1;
  var nativeCreate = require_nativeCreate();
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  _hashSet = hashSet;
  return _hashSet;
}
var _Hash;
var hasRequired_Hash;
function require_Hash() {
  if (hasRequired_Hash) return _Hash;
  hasRequired_Hash = 1;
  var hashClear = require_hashClear(), hashDelete = require_hashDelete(), hashGet = require_hashGet(), hashHas = require_hashHas(), hashSet = require_hashSet();
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  _Hash = Hash;
  return _Hash;
}
var _mapCacheClear;
var hasRequired_mapCacheClear;
function require_mapCacheClear() {
  if (hasRequired_mapCacheClear) return _mapCacheClear;
  hasRequired_mapCacheClear = 1;
  var Hash = require_Hash(), ListCache = require_ListCache(), Map2 = require_Map();
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map2 || ListCache)(),
      "string": new Hash()
    };
  }
  _mapCacheClear = mapCacheClear;
  return _mapCacheClear;
}
var _isKeyable;
var hasRequired_isKeyable;
function require_isKeyable() {
  if (hasRequired_isKeyable) return _isKeyable;
  hasRequired_isKeyable = 1;
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  _isKeyable = isKeyable;
  return _isKeyable;
}
var _getMapData;
var hasRequired_getMapData;
function require_getMapData() {
  if (hasRequired_getMapData) return _getMapData;
  hasRequired_getMapData = 1;
  var isKeyable = require_isKeyable();
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  _getMapData = getMapData;
  return _getMapData;
}
var _mapCacheDelete;
var hasRequired_mapCacheDelete;
function require_mapCacheDelete() {
  if (hasRequired_mapCacheDelete) return _mapCacheDelete;
  hasRequired_mapCacheDelete = 1;
  var getMapData = require_getMapData();
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  _mapCacheDelete = mapCacheDelete;
  return _mapCacheDelete;
}
var _mapCacheGet;
var hasRequired_mapCacheGet;
function require_mapCacheGet() {
  if (hasRequired_mapCacheGet) return _mapCacheGet;
  hasRequired_mapCacheGet = 1;
  var getMapData = require_getMapData();
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  _mapCacheGet = mapCacheGet;
  return _mapCacheGet;
}
var _mapCacheHas;
var hasRequired_mapCacheHas;
function require_mapCacheHas() {
  if (hasRequired_mapCacheHas) return _mapCacheHas;
  hasRequired_mapCacheHas = 1;
  var getMapData = require_getMapData();
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  _mapCacheHas = mapCacheHas;
  return _mapCacheHas;
}
var _mapCacheSet;
var hasRequired_mapCacheSet;
function require_mapCacheSet() {
  if (hasRequired_mapCacheSet) return _mapCacheSet;
  hasRequired_mapCacheSet = 1;
  var getMapData = require_getMapData();
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  _mapCacheSet = mapCacheSet;
  return _mapCacheSet;
}
var _MapCache;
var hasRequired_MapCache;
function require_MapCache() {
  if (hasRequired_MapCache) return _MapCache;
  hasRequired_MapCache = 1;
  var mapCacheClear = require_mapCacheClear(), mapCacheDelete = require_mapCacheDelete(), mapCacheGet = require_mapCacheGet(), mapCacheHas = require_mapCacheHas(), mapCacheSet = require_mapCacheSet();
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  _MapCache = MapCache;
  return _MapCache;
}
var _stackSet;
var hasRequired_stackSet;
function require_stackSet() {
  if (hasRequired_stackSet) return _stackSet;
  hasRequired_stackSet = 1;
  var ListCache = require_ListCache(), Map2 = require_Map(), MapCache = require_MapCache();
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  _stackSet = stackSet;
  return _stackSet;
}
var _Stack;
var hasRequired_Stack;
function require_Stack() {
  if (hasRequired_Stack) return _Stack;
  hasRequired_Stack = 1;
  var ListCache = require_ListCache(), stackClear = require_stackClear(), stackDelete = require_stackDelete(), stackGet = require_stackGet(), stackHas = require_stackHas(), stackSet = require_stackSet();
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  _Stack = Stack;
  return _Stack;
}
var _arrayEach;
var hasRequired_arrayEach;
function require_arrayEach() {
  if (hasRequired_arrayEach) return _arrayEach;
  hasRequired_arrayEach = 1;
  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  _arrayEach = arrayEach;
  return _arrayEach;
}
var _defineProperty;
var hasRequired_defineProperty;
function require_defineProperty() {
  if (hasRequired_defineProperty) return _defineProperty;
  hasRequired_defineProperty = 1;
  var getNative = require_getNative();
  var defineProperty = (function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  })();
  _defineProperty = defineProperty;
  return _defineProperty;
}
var _baseAssignValue;
var hasRequired_baseAssignValue;
function require_baseAssignValue() {
  if (hasRequired_baseAssignValue) return _baseAssignValue;
  hasRequired_baseAssignValue = 1;
  var defineProperty = require_defineProperty();
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty) {
      defineProperty(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  _baseAssignValue = baseAssignValue;
  return _baseAssignValue;
}
var _assignValue;
var hasRequired_assignValue;
function require_assignValue() {
  if (hasRequired_assignValue) return _assignValue;
  hasRequired_assignValue = 1;
  var baseAssignValue = require_baseAssignValue(), eq = requireEq();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  _assignValue = assignValue;
  return _assignValue;
}
var _copyObject;
var hasRequired_copyObject;
function require_copyObject() {
  if (hasRequired_copyObject) return _copyObject;
  hasRequired_copyObject = 1;
  var assignValue = require_assignValue(), baseAssignValue = require_baseAssignValue();
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  _copyObject = copyObject;
  return _copyObject;
}
var _baseTimes;
var hasRequired_baseTimes;
function require_baseTimes() {
  if (hasRequired_baseTimes) return _baseTimes;
  hasRequired_baseTimes = 1;
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  _baseTimes = baseTimes;
  return _baseTimes;
}
var isObjectLike_1;
var hasRequiredIsObjectLike;
function requireIsObjectLike() {
  if (hasRequiredIsObjectLike) return isObjectLike_1;
  hasRequiredIsObjectLike = 1;
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  isObjectLike_1 = isObjectLike;
  return isObjectLike_1;
}
var _baseIsArguments;
var hasRequired_baseIsArguments;
function require_baseIsArguments() {
  if (hasRequired_baseIsArguments) return _baseIsArguments;
  hasRequired_baseIsArguments = 1;
  var baseGetTag = require_baseGetTag(), isObjectLike = requireIsObjectLike();
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  _baseIsArguments = baseIsArguments;
  return _baseIsArguments;
}
var isArguments_1;
var hasRequiredIsArguments;
function requireIsArguments() {
  if (hasRequiredIsArguments) return isArguments_1;
  hasRequiredIsArguments = 1;
  var baseIsArguments = require_baseIsArguments(), isObjectLike = requireIsObjectLike();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  isArguments_1 = isArguments;
  return isArguments_1;
}
var isArray_1;
var hasRequiredIsArray;
function requireIsArray() {
  if (hasRequiredIsArray) return isArray_1;
  hasRequiredIsArray = 1;
  var isArray = Array.isArray;
  isArray_1 = isArray;
  return isArray_1;
}
var isBuffer = { exports: {} };
var stubFalse_1;
var hasRequiredStubFalse;
function requireStubFalse() {
  if (hasRequiredStubFalse) return stubFalse_1;
  hasRequiredStubFalse = 1;
  function stubFalse() {
    return false;
  }
  stubFalse_1 = stubFalse;
  return stubFalse_1;
}
isBuffer.exports;
var hasRequiredIsBuffer;
function requireIsBuffer() {
  if (hasRequiredIsBuffer) return isBuffer.exports;
  hasRequiredIsBuffer = 1;
  (function(module, exports) {
    var root = require_root(), stubFalse = requireStubFalse();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var isBuffer2 = nativeIsBuffer || stubFalse;
    module.exports = isBuffer2;
  })(isBuffer, isBuffer.exports);
  return isBuffer.exports;
}
var _isIndex;
var hasRequired_isIndex;
function require_isIndex() {
  if (hasRequired_isIndex) return _isIndex;
  hasRequired_isIndex = 1;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  _isIndex = isIndex;
  return _isIndex;
}
var isLength_1;
var hasRequiredIsLength;
function requireIsLength() {
  if (hasRequiredIsLength) return isLength_1;
  hasRequiredIsLength = 1;
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  isLength_1 = isLength;
  return isLength_1;
}
var _baseIsTypedArray;
var hasRequired_baseIsTypedArray;
function require_baseIsTypedArray() {
  if (hasRequired_baseIsTypedArray) return _baseIsTypedArray;
  hasRequired_baseIsTypedArray = 1;
  var baseGetTag = require_baseGetTag(), isLength = requireIsLength(), isObjectLike = requireIsObjectLike();
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  _baseIsTypedArray = baseIsTypedArray;
  return _baseIsTypedArray;
}
var _baseUnary;
var hasRequired_baseUnary;
function require_baseUnary() {
  if (hasRequired_baseUnary) return _baseUnary;
  hasRequired_baseUnary = 1;
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  _baseUnary = baseUnary;
  return _baseUnary;
}
var _nodeUtil = { exports: {} };
_nodeUtil.exports;
var hasRequired_nodeUtil;
function require_nodeUtil() {
  if (hasRequired_nodeUtil) return _nodeUtil.exports;
  hasRequired_nodeUtil = 1;
  (function(module, exports) {
    var freeGlobal = require_freeGlobal();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = (function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    })();
    module.exports = nodeUtil;
  })(_nodeUtil, _nodeUtil.exports);
  return _nodeUtil.exports;
}
var isTypedArray_1;
var hasRequiredIsTypedArray;
function requireIsTypedArray() {
  if (hasRequiredIsTypedArray) return isTypedArray_1;
  hasRequiredIsTypedArray = 1;
  var baseIsTypedArray = require_baseIsTypedArray(), baseUnary = require_baseUnary(), nodeUtil = require_nodeUtil();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  isTypedArray_1 = isTypedArray;
  return isTypedArray_1;
}
var _arrayLikeKeys;
var hasRequired_arrayLikeKeys;
function require_arrayLikeKeys() {
  if (hasRequired_arrayLikeKeys) return _arrayLikeKeys;
  hasRequired_arrayLikeKeys = 1;
  var baseTimes = require_baseTimes(), isArguments = requireIsArguments(), isArray = requireIsArray(), isBuffer2 = requireIsBuffer(), isIndex = require_isIndex(), isTypedArray = requireIsTypedArray();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer2(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  _arrayLikeKeys = arrayLikeKeys;
  return _arrayLikeKeys;
}
var _isPrototype;
var hasRequired_isPrototype;
function require_isPrototype() {
  if (hasRequired_isPrototype) return _isPrototype;
  hasRequired_isPrototype = 1;
  var objectProto = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  _isPrototype = isPrototype;
  return _isPrototype;
}
var _overArg;
var hasRequired_overArg;
function require_overArg() {
  if (hasRequired_overArg) return _overArg;
  hasRequired_overArg = 1;
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  _overArg = overArg;
  return _overArg;
}
var _nativeKeys;
var hasRequired_nativeKeys;
function require_nativeKeys() {
  if (hasRequired_nativeKeys) return _nativeKeys;
  hasRequired_nativeKeys = 1;
  var overArg = require_overArg();
  var nativeKeys = overArg(Object.keys, Object);
  _nativeKeys = nativeKeys;
  return _nativeKeys;
}
var _baseKeys;
var hasRequired_baseKeys;
function require_baseKeys() {
  if (hasRequired_baseKeys) return _baseKeys;
  hasRequired_baseKeys = 1;
  var isPrototype = require_isPrototype(), nativeKeys = require_nativeKeys();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  _baseKeys = baseKeys;
  return _baseKeys;
}
var isArrayLike_1;
var hasRequiredIsArrayLike;
function requireIsArrayLike() {
  if (hasRequiredIsArrayLike) return isArrayLike_1;
  hasRequiredIsArrayLike = 1;
  var isFunction = requireIsFunction(), isLength = requireIsLength();
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  isArrayLike_1 = isArrayLike;
  return isArrayLike_1;
}
var keys_1;
var hasRequiredKeys;
function requireKeys() {
  if (hasRequiredKeys) return keys_1;
  hasRequiredKeys = 1;
  var arrayLikeKeys = require_arrayLikeKeys(), baseKeys = require_baseKeys(), isArrayLike = requireIsArrayLike();
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  keys_1 = keys;
  return keys_1;
}
var _baseAssign;
var hasRequired_baseAssign;
function require_baseAssign() {
  if (hasRequired_baseAssign) return _baseAssign;
  hasRequired_baseAssign = 1;
  var copyObject = require_copyObject(), keys = requireKeys();
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  _baseAssign = baseAssign;
  return _baseAssign;
}
var _nativeKeysIn;
var hasRequired_nativeKeysIn;
function require_nativeKeysIn() {
  if (hasRequired_nativeKeysIn) return _nativeKeysIn;
  hasRequired_nativeKeysIn = 1;
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  _nativeKeysIn = nativeKeysIn;
  return _nativeKeysIn;
}
var _baseKeysIn;
var hasRequired_baseKeysIn;
function require_baseKeysIn() {
  if (hasRequired_baseKeysIn) return _baseKeysIn;
  hasRequired_baseKeysIn = 1;
  var isObject = requireIsObject(), isPrototype = require_isPrototype(), nativeKeysIn = require_nativeKeysIn();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  _baseKeysIn = baseKeysIn;
  return _baseKeysIn;
}
var keysIn_1;
var hasRequiredKeysIn;
function requireKeysIn() {
  if (hasRequiredKeysIn) return keysIn_1;
  hasRequiredKeysIn = 1;
  var arrayLikeKeys = require_arrayLikeKeys(), baseKeysIn = require_baseKeysIn(), isArrayLike = requireIsArrayLike();
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  keysIn_1 = keysIn;
  return keysIn_1;
}
var _baseAssignIn;
var hasRequired_baseAssignIn;
function require_baseAssignIn() {
  if (hasRequired_baseAssignIn) return _baseAssignIn;
  hasRequired_baseAssignIn = 1;
  var copyObject = require_copyObject(), keysIn = requireKeysIn();
  function baseAssignIn(object, source) {
    return object && copyObject(source, keysIn(source), object);
  }
  _baseAssignIn = baseAssignIn;
  return _baseAssignIn;
}
var _cloneBuffer = { exports: {} };
_cloneBuffer.exports;
var hasRequired_cloneBuffer;
function require_cloneBuffer() {
  if (hasRequired_cloneBuffer) return _cloneBuffer.exports;
  hasRequired_cloneBuffer = 1;
  (function(module, exports) {
    var root = require_root();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    module.exports = cloneBuffer;
  })(_cloneBuffer, _cloneBuffer.exports);
  return _cloneBuffer.exports;
}
var _copyArray;
var hasRequired_copyArray;
function require_copyArray() {
  if (hasRequired_copyArray) return _copyArray;
  hasRequired_copyArray = 1;
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  _copyArray = copyArray;
  return _copyArray;
}
var _arrayFilter;
var hasRequired_arrayFilter;
function require_arrayFilter() {
  if (hasRequired_arrayFilter) return _arrayFilter;
  hasRequired_arrayFilter = 1;
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  _arrayFilter = arrayFilter;
  return _arrayFilter;
}
var stubArray_1;
var hasRequiredStubArray;
function requireStubArray() {
  if (hasRequiredStubArray) return stubArray_1;
  hasRequiredStubArray = 1;
  function stubArray() {
    return [];
  }
  stubArray_1 = stubArray;
  return stubArray_1;
}
var _getSymbols;
var hasRequired_getSymbols;
function require_getSymbols() {
  if (hasRequired_getSymbols) return _getSymbols;
  hasRequired_getSymbols = 1;
  var arrayFilter = require_arrayFilter(), stubArray = requireStubArray();
  var objectProto = Object.prototype;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  _getSymbols = getSymbols;
  return _getSymbols;
}
var _copySymbols;
var hasRequired_copySymbols;
function require_copySymbols() {
  if (hasRequired_copySymbols) return _copySymbols;
  hasRequired_copySymbols = 1;
  var copyObject = require_copyObject(), getSymbols = require_getSymbols();
  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }
  _copySymbols = copySymbols;
  return _copySymbols;
}
var _arrayPush;
var hasRequired_arrayPush;
function require_arrayPush() {
  if (hasRequired_arrayPush) return _arrayPush;
  hasRequired_arrayPush = 1;
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  _arrayPush = arrayPush;
  return _arrayPush;
}
var _getPrototype;
var hasRequired_getPrototype;
function require_getPrototype() {
  if (hasRequired_getPrototype) return _getPrototype;
  hasRequired_getPrototype = 1;
  var overArg = require_overArg();
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  _getPrototype = getPrototype;
  return _getPrototype;
}
var _getSymbolsIn;
var hasRequired_getSymbolsIn;
function require_getSymbolsIn() {
  if (hasRequired_getSymbolsIn) return _getSymbolsIn;
  hasRequired_getSymbolsIn = 1;
  var arrayPush = require_arrayPush(), getPrototype = require_getPrototype(), getSymbols = require_getSymbols(), stubArray = requireStubArray();
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush(result, getSymbols(object));
      object = getPrototype(object);
    }
    return result;
  };
  _getSymbolsIn = getSymbolsIn;
  return _getSymbolsIn;
}
var _copySymbolsIn;
var hasRequired_copySymbolsIn;
function require_copySymbolsIn() {
  if (hasRequired_copySymbolsIn) return _copySymbolsIn;
  hasRequired_copySymbolsIn = 1;
  var copyObject = require_copyObject(), getSymbolsIn = require_getSymbolsIn();
  function copySymbolsIn(source, object) {
    return copyObject(source, getSymbolsIn(source), object);
  }
  _copySymbolsIn = copySymbolsIn;
  return _copySymbolsIn;
}
var _baseGetAllKeys;
var hasRequired_baseGetAllKeys;
function require_baseGetAllKeys() {
  if (hasRequired_baseGetAllKeys) return _baseGetAllKeys;
  hasRequired_baseGetAllKeys = 1;
  var arrayPush = require_arrayPush(), isArray = requireIsArray();
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  _baseGetAllKeys = baseGetAllKeys;
  return _baseGetAllKeys;
}
var _getAllKeys;
var hasRequired_getAllKeys;
function require_getAllKeys() {
  if (hasRequired_getAllKeys) return _getAllKeys;
  hasRequired_getAllKeys = 1;
  var baseGetAllKeys = require_baseGetAllKeys(), getSymbols = require_getSymbols(), keys = requireKeys();
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  _getAllKeys = getAllKeys;
  return _getAllKeys;
}
var _getAllKeysIn;
var hasRequired_getAllKeysIn;
function require_getAllKeysIn() {
  if (hasRequired_getAllKeysIn) return _getAllKeysIn;
  hasRequired_getAllKeysIn = 1;
  var baseGetAllKeys = require_baseGetAllKeys(), getSymbolsIn = require_getSymbolsIn(), keysIn = requireKeysIn();
  function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn, getSymbolsIn);
  }
  _getAllKeysIn = getAllKeysIn;
  return _getAllKeysIn;
}
var _DataView;
var hasRequired_DataView;
function require_DataView() {
  if (hasRequired_DataView) return _DataView;
  hasRequired_DataView = 1;
  var getNative = require_getNative(), root = require_root();
  var DataView = getNative(root, "DataView");
  _DataView = DataView;
  return _DataView;
}
var _Promise;
var hasRequired_Promise;
function require_Promise() {
  if (hasRequired_Promise) return _Promise;
  hasRequired_Promise = 1;
  var getNative = require_getNative(), root = require_root();
  var Promise2 = getNative(root, "Promise");
  _Promise = Promise2;
  return _Promise;
}
var _Set;
var hasRequired_Set;
function require_Set() {
  if (hasRequired_Set) return _Set;
  hasRequired_Set = 1;
  var getNative = require_getNative(), root = require_root();
  var Set2 = getNative(root, "Set");
  _Set = Set2;
  return _Set;
}
var _WeakMap;
var hasRequired_WeakMap;
function require_WeakMap() {
  if (hasRequired_WeakMap) return _WeakMap;
  hasRequired_WeakMap = 1;
  var getNative = require_getNative(), root = require_root();
  var WeakMap = getNative(root, "WeakMap");
  _WeakMap = WeakMap;
  return _WeakMap;
}
var _getTag;
var hasRequired_getTag;
function require_getTag() {
  if (hasRequired_getTag) return _getTag;
  hasRequired_getTag = 1;
  var DataView = require_DataView(), Map2 = require_Map(), Promise2 = require_Promise(), Set2 = require_Set(), WeakMap = require_WeakMap(), baseGetTag = require_baseGetTag(), toSource = require_toSource();
  var mapTag = "[object Map]", objectTag = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag = "[object DataView]";
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  _getTag = getTag;
  return _getTag;
}
var _initCloneArray;
var hasRequired_initCloneArray;
function require_initCloneArray() {
  if (hasRequired_initCloneArray) return _initCloneArray;
  hasRequired_initCloneArray = 1;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  _initCloneArray = initCloneArray;
  return _initCloneArray;
}
var _Uint8Array;
var hasRequired_Uint8Array;
function require_Uint8Array() {
  if (hasRequired_Uint8Array) return _Uint8Array;
  hasRequired_Uint8Array = 1;
  var root = require_root();
  var Uint8Array = root.Uint8Array;
  _Uint8Array = Uint8Array;
  return _Uint8Array;
}
var _cloneArrayBuffer;
var hasRequired_cloneArrayBuffer;
function require_cloneArrayBuffer() {
  if (hasRequired_cloneArrayBuffer) return _cloneArrayBuffer;
  hasRequired_cloneArrayBuffer = 1;
  var Uint8Array = require_Uint8Array();
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }
  _cloneArrayBuffer = cloneArrayBuffer;
  return _cloneArrayBuffer;
}
var _cloneDataView;
var hasRequired_cloneDataView;
function require_cloneDataView() {
  if (hasRequired_cloneDataView) return _cloneDataView;
  hasRequired_cloneDataView = 1;
  var cloneArrayBuffer = require_cloneArrayBuffer();
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  _cloneDataView = cloneDataView;
  return _cloneDataView;
}
var _cloneRegExp;
var hasRequired_cloneRegExp;
function require_cloneRegExp() {
  if (hasRequired_cloneRegExp) return _cloneRegExp;
  hasRequired_cloneRegExp = 1;
  var reFlags = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  _cloneRegExp = cloneRegExp;
  return _cloneRegExp;
}
var _cloneSymbol;
var hasRequired_cloneSymbol;
function require_cloneSymbol() {
  if (hasRequired_cloneSymbol) return _cloneSymbol;
  hasRequired_cloneSymbol = 1;
  var Symbol2 = require_Symbol();
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  _cloneSymbol = cloneSymbol;
  return _cloneSymbol;
}
var _cloneTypedArray;
var hasRequired_cloneTypedArray;
function require_cloneTypedArray() {
  if (hasRequired_cloneTypedArray) return _cloneTypedArray;
  hasRequired_cloneTypedArray = 1;
  var cloneArrayBuffer = require_cloneArrayBuffer();
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  _cloneTypedArray = cloneTypedArray;
  return _cloneTypedArray;
}
var _initCloneByTag;
var hasRequired_initCloneByTag;
function require_initCloneByTag() {
  if (hasRequired_initCloneByTag) return _initCloneByTag;
  hasRequired_initCloneByTag = 1;
  var cloneArrayBuffer = require_cloneArrayBuffer(), cloneDataView = require_cloneDataView(), cloneRegExp = require_cloneRegExp(), cloneSymbol = require_cloneSymbol(), cloneTypedArray = require_cloneTypedArray();
  var boolTag = "[object Boolean]", dateTag = "[object Date]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);
      case boolTag:
      case dateTag:
        return new Ctor(+object);
      case dataViewTag:
        return cloneDataView(object, isDeep);
      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);
      case mapTag:
        return new Ctor();
      case numberTag:
      case stringTag:
        return new Ctor(object);
      case regexpTag:
        return cloneRegExp(object);
      case setTag:
        return new Ctor();
      case symbolTag:
        return cloneSymbol(object);
    }
  }
  _initCloneByTag = initCloneByTag;
  return _initCloneByTag;
}
var _baseCreate;
var hasRequired_baseCreate;
function require_baseCreate() {
  if (hasRequired_baseCreate) return _baseCreate;
  hasRequired_baseCreate = 1;
  var isObject = requireIsObject();
  var objectCreate = Object.create;
  var baseCreate = /* @__PURE__ */ (function() {
    function object() {
    }
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  })();
  _baseCreate = baseCreate;
  return _baseCreate;
}
var _initCloneObject;
var hasRequired_initCloneObject;
function require_initCloneObject() {
  if (hasRequired_initCloneObject) return _initCloneObject;
  hasRequired_initCloneObject = 1;
  var baseCreate = require_baseCreate(), getPrototype = require_getPrototype(), isPrototype = require_isPrototype();
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }
  _initCloneObject = initCloneObject;
  return _initCloneObject;
}
var _baseIsMap;
var hasRequired_baseIsMap;
function require_baseIsMap() {
  if (hasRequired_baseIsMap) return _baseIsMap;
  hasRequired_baseIsMap = 1;
  var getTag = require_getTag(), isObjectLike = requireIsObjectLike();
  var mapTag = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike(value) && getTag(value) == mapTag;
  }
  _baseIsMap = baseIsMap;
  return _baseIsMap;
}
var isMap_1;
var hasRequiredIsMap;
function requireIsMap() {
  if (hasRequiredIsMap) return isMap_1;
  hasRequiredIsMap = 1;
  var baseIsMap = require_baseIsMap(), baseUnary = require_baseUnary(), nodeUtil = require_nodeUtil();
  var nodeIsMap = nodeUtil && nodeUtil.isMap;
  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
  isMap_1 = isMap;
  return isMap_1;
}
var _baseIsSet;
var hasRequired_baseIsSet;
function require_baseIsSet() {
  if (hasRequired_baseIsSet) return _baseIsSet;
  hasRequired_baseIsSet = 1;
  var getTag = require_getTag(), isObjectLike = requireIsObjectLike();
  var setTag = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike(value) && getTag(value) == setTag;
  }
  _baseIsSet = baseIsSet;
  return _baseIsSet;
}
var isSet_1;
var hasRequiredIsSet;
function requireIsSet() {
  if (hasRequiredIsSet) return isSet_1;
  hasRequiredIsSet = 1;
  var baseIsSet = require_baseIsSet(), baseUnary = require_baseUnary(), nodeUtil = require_nodeUtil();
  var nodeIsSet = nodeUtil && nodeUtil.isSet;
  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
  isSet_1 = isSet;
  return isSet_1;
}
var _baseClone;
var hasRequired_baseClone;
function require_baseClone() {
  if (hasRequired_baseClone) return _baseClone;
  hasRequired_baseClone = 1;
  var Stack = require_Stack(), arrayEach = require_arrayEach(), assignValue = require_assignValue(), baseAssign = require_baseAssign(), baseAssignIn = require_baseAssignIn(), cloneBuffer = require_cloneBuffer(), copyArray = require_copyArray(), copySymbols = require_copySymbols(), copySymbolsIn = require_copySymbolsIn(), getAllKeys = require_getAllKeys(), getAllKeysIn = require_getAllKeysIn(), getTag = require_getTag(), initCloneArray = require_initCloneArray(), initCloneByTag = require_initCloneByTag(), initCloneObject = require_initCloneObject(), isArray = requireIsArray(), isBuffer2 = requireIsBuffer(), isMap = requireIsMap(), isObject = requireIsObject(), isSet = requireIsSet(), keys = requireKeys(), keysIn = requireKeysIn();
  var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer2(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  _baseClone = baseClone;
  return _baseClone;
}
var cloneDeep_1;
var hasRequiredCloneDeep;
function requireCloneDeep() {
  if (hasRequiredCloneDeep) return cloneDeep_1;
  hasRequiredCloneDeep = 1;
  var baseClone = require_baseClone();
  var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
  function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
  }
  cloneDeep_1 = cloneDeep;
  return cloneDeep_1;
}
var identity_1;
var hasRequiredIdentity;
function requireIdentity() {
  if (hasRequiredIdentity) return identity_1;
  hasRequiredIdentity = 1;
  function identity(value) {
    return value;
  }
  identity_1 = identity;
  return identity_1;
}
var _apply;
var hasRequired_apply;
function require_apply() {
  if (hasRequired_apply) return _apply;
  hasRequired_apply = 1;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  _apply = apply;
  return _apply;
}
var _overRest;
var hasRequired_overRest;
function require_overRest() {
  if (hasRequired_overRest) return _overRest;
  hasRequired_overRest = 1;
  var apply = require_apply();
  var nativeMax = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  _overRest = overRest;
  return _overRest;
}
var constant_1;
var hasRequiredConstant;
function requireConstant() {
  if (hasRequiredConstant) return constant_1;
  hasRequiredConstant = 1;
  function constant(value) {
    return function() {
      return value;
    };
  }
  constant_1 = constant;
  return constant_1;
}
var _baseSetToString;
var hasRequired_baseSetToString;
function require_baseSetToString() {
  if (hasRequired_baseSetToString) return _baseSetToString;
  hasRequired_baseSetToString = 1;
  var constant = requireConstant(), defineProperty = require_defineProperty(), identity = requireIdentity();
  var baseSetToString = !defineProperty ? identity : function(func, string2) {
    return defineProperty(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string2),
      "writable": true
    });
  };
  _baseSetToString = baseSetToString;
  return _baseSetToString;
}
var _shortOut;
var hasRequired_shortOut;
function require_shortOut() {
  if (hasRequired_shortOut) return _shortOut;
  hasRequired_shortOut = 1;
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  _shortOut = shortOut;
  return _shortOut;
}
var _setToString;
var hasRequired_setToString;
function require_setToString() {
  if (hasRequired_setToString) return _setToString;
  hasRequired_setToString = 1;
  var baseSetToString = require_baseSetToString(), shortOut = require_shortOut();
  var setToString = shortOut(baseSetToString);
  _setToString = setToString;
  return _setToString;
}
var _baseRest;
var hasRequired_baseRest;
function require_baseRest() {
  if (hasRequired_baseRest) return _baseRest;
  hasRequired_baseRest = 1;
  var identity = requireIdentity(), overRest = require_overRest(), setToString = require_setToString();
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + "");
  }
  _baseRest = baseRest;
  return _baseRest;
}
var _isIterateeCall;
var hasRequired_isIterateeCall;
function require_isIterateeCall() {
  if (hasRequired_isIterateeCall) return _isIterateeCall;
  hasRequired_isIterateeCall = 1;
  var eq = requireEq(), isArrayLike = requireIsArrayLike(), isIndex = require_isIndex(), isObject = requireIsObject();
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }
  _isIterateeCall = isIterateeCall;
  return _isIterateeCall;
}
var defaults_1;
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults) return defaults_1;
  hasRequiredDefaults = 1;
  var baseRest = require_baseRest(), eq = requireEq(), isIterateeCall = require_isIterateeCall(), keysIn = requireKeysIn();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var defaults = baseRest(function(object, sources) {
    object = Object(object);
    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      var props = keysIn(source);
      var propsIndex = -1;
      var propsLength = props.length;
      while (++propsIndex < propsLength) {
        var key = props[propsIndex];
        var value = object[key];
        if (value === void 0 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          object[key] = source[key];
        }
      }
    }
    return object;
  });
  defaults_1 = defaults;
  return defaults_1;
}
var _arrayMap;
var hasRequired_arrayMap;
function require_arrayMap() {
  if (hasRequired_arrayMap) return _arrayMap;
  hasRequired_arrayMap = 1;
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  _arrayMap = arrayMap;
  return _arrayMap;
}
var isSymbol_1;
var hasRequiredIsSymbol;
function requireIsSymbol() {
  if (hasRequiredIsSymbol) return isSymbol_1;
  hasRequiredIsSymbol = 1;
  var baseGetTag = require_baseGetTag(), isObjectLike = requireIsObjectLike();
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  isSymbol_1 = isSymbol;
  return isSymbol_1;
}
var _baseToString;
var hasRequired_baseToString;
function require_baseToString() {
  if (hasRequired_baseToString) return _baseToString;
  hasRequired_baseToString = 1;
  var Symbol2 = require_Symbol(), arrayMap = require_arrayMap(), isArray = requireIsArray(), isSymbol = requireIsSymbol();
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  _baseToString = baseToString;
  return _baseToString;
}
var toString_1;
var hasRequiredToString;
function requireToString() {
  if (hasRequiredToString) return toString_1;
  hasRequiredToString = 1;
  var baseToString = require_baseToString();
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  toString_1 = toString;
  return toString_1;
}
var uniqueId_1;
var hasRequiredUniqueId;
function requireUniqueId() {
  if (hasRequiredUniqueId) return uniqueId_1;
  hasRequiredUniqueId = 1;
  var toString = requireToString();
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter;
    return toString(prefix) + id;
  }
  uniqueId_1 = uniqueId;
  return uniqueId_1;
}
var timeout = {};
var hasRequiredTimeout;
function requireTimeout() {
  if (hasRequiredTimeout) return timeout;
  hasRequiredTimeout = 1;
  class KnexTimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "KnexTimeoutError";
    }
  }
  function timeout$1(promise, ms2) {
    return new Promise(function(resolve, reject) {
      const id = setTimeout(function() {
        reject(new KnexTimeoutError("operation timed out"));
      }, ms2);
      function wrappedResolve(value) {
        clearTimeout(id);
        resolve(value);
      }
      function wrappedReject(err) {
        clearTimeout(id);
        reject(err);
      }
      promise.then(wrappedResolve, wrappedReject);
    });
  }
  timeout.KnexTimeoutError = KnexTimeoutError;
  timeout.timeout = timeout$1;
  return timeout;
}
var ensureConnectionCallback_1;
var hasRequiredEnsureConnectionCallback;
function requireEnsureConnectionCallback() {
  if (hasRequiredEnsureConnectionCallback) return ensureConnectionCallback_1;
  hasRequiredEnsureConnectionCallback = 1;
  function ensureConnectionCallback(runner2) {
    runner2.client.emit("start", runner2.builder);
    runner2.builder.emit("start", runner2.builder);
    const sql = runner2.builder.toSQL();
    if (runner2.builder._debug) {
      runner2.client.logger.debug(sql);
    }
    if (Array.isArray(sql)) {
      return runner2.queryArray(sql);
    }
    return runner2.query(sql);
  }
  function ensureConnectionStreamCallback(runner2, params) {
    try {
      const sql = runner2.builder.toSQL();
      if (Array.isArray(sql) && params.hasHandler) {
        throw new Error(
          "The stream may only be used with a single query statement."
        );
      }
      return runner2.client.stream(
        runner2.connection,
        sql,
        params.stream,
        params.options
      );
    } catch (e) {
      params.stream.emit("error", e);
      throw e;
    }
  }
  ensureConnectionCallback_1 = {
    ensureConnectionCallback,
    ensureConnectionStreamCallback
  };
  return ensureConnectionCallback_1;
}
var runner;
var hasRequiredRunner;
function requireRunner() {
  if (hasRequiredRunner) return runner;
  hasRequiredRunner = 1;
  const { KnexTimeoutError } = requireTimeout();
  const { timeout: timeout2 } = requireTimeout();
  const {
    ensureConnectionCallback,
    ensureConnectionStreamCallback
  } = requireEnsureConnectionCallback();
  let Transform;
  class Runner {
    constructor(client2, builder2) {
      this.client = client2;
      this.builder = builder2;
      this.queries = [];
      this.connection = void 0;
    }
    // "Run" the target, calling "toSQL" on the builder, returning
    // an object or array of queries to run, each of which are run on
    // a single connection.
    async run() {
      const runner2 = this;
      try {
        const res = await this.ensureConnection(ensureConnectionCallback);
        runner2.builder.emit("end");
        return res;
      } catch (err) {
        if (runner2.builder._events && runner2.builder._events.error) {
          runner2.builder.emit("error", err);
        }
        throw err;
      }
    }
    // Stream the result set, by passing through to the dialect's streaming
    // capabilities. If the options are
    stream(optionsOrHandler, handlerOrNil) {
      const firstOptionIsHandler = typeof optionsOrHandler === "function" && arguments.length === 1;
      const options = firstOptionIsHandler ? {} : optionsOrHandler;
      const handler = firstOptionIsHandler ? optionsOrHandler : handlerOrNil;
      const hasHandler = typeof handler === "function";
      Transform = Transform || require$$2.Transform;
      const queryContext = this.builder.queryContext();
      const stream = new Transform({
        objectMode: true,
        transform: (chunk, _, callback) => {
          callback(null, this.client.postProcessResponse(chunk, queryContext));
        }
      });
      stream.on("close", () => {
        this.client.releaseConnection(this.connection);
      });
      stream.on("pipe", (sourceStream) => {
        const cleanSourceStream = () => {
          if (!sourceStream.closed) {
            sourceStream.destroy();
          }
        };
        if (stream.closed) {
          cleanSourceStream();
        } else {
          stream.on("close", cleanSourceStream);
        }
      });
      const connectionAcquirePromise = this.ensureConnection(
        ensureConnectionStreamCallback,
        {
          options,
          hasHandler,
          stream
        }
      ).catch((err) => {
        if (!this.connection) {
          stream.emit("error", err);
        }
      });
      if (hasHandler) {
        handler(stream);
        return connectionAcquirePromise;
      }
      return stream;
    }
    // Allow you to pipe the stream to a writable stream.
    pipe(writable, options) {
      return this.stream(options).pipe(writable);
    }
    // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
    // to run in sequence, and on the same connection, especially helpful when schema building
    // and dealing with foreign key constraints, etc.
    async query(obj) {
      const { __knexUid, __knexTxId } = this.connection;
      this.builder.emit("query", Object.assign({ __knexUid, __knexTxId }, obj));
      const runner2 = this;
      const queryContext = this.builder.queryContext();
      if (obj !== null && typeof obj === "object") {
        obj.queryContext = queryContext;
      }
      let queryPromise = this.client.query(this.connection, obj);
      if (obj.timeout) {
        queryPromise = timeout2(queryPromise, obj.timeout);
      }
      return queryPromise.then((resp) => this.client.processResponse(resp, runner2)).then((processedResponse) => {
        const postProcessedResponse = this.client.postProcessResponse(
          processedResponse,
          queryContext
        );
        this.builder.emit(
          "query-response",
          postProcessedResponse,
          Object.assign({ __knexUid, __knexTxId }, obj),
          this.builder
        );
        this.client.emit(
          "query-response",
          postProcessedResponse,
          Object.assign({ __knexUid, __knexTxId }, obj),
          this.builder
        );
        return postProcessedResponse;
      }).catch((error) => {
        if (!(error instanceof KnexTimeoutError)) {
          return Promise.reject(error);
        }
        const { timeout: timeout3, sql, bindings: bindings2 } = obj;
        let cancelQuery;
        if (obj.cancelOnTimeout) {
          cancelQuery = this.client.cancelQuery(this.connection);
        } else {
          this.connection.__knex__disposed = error;
          cancelQuery = Promise.resolve();
        }
        return cancelQuery.catch((cancelError) => {
          this.connection.__knex__disposed = error;
          throw Object.assign(cancelError, {
            message: `After query timeout of ${timeout3}ms exceeded, cancelling of query failed.`,
            sql,
            bindings: bindings2,
            timeout: timeout3
          });
        }).then(() => {
          throw Object.assign(error, {
            message: `Defined query timeout of ${timeout3}ms exceeded when running query.`,
            sql,
            bindings: bindings2,
            timeout: timeout3
          });
        });
      }).catch((error) => {
        this.builder.emit(
          "query-error",
          error,
          Object.assign({ __knexUid, __knexTxId, queryContext }, obj)
        );
        throw error;
      });
    }
    // In the case of the "schema builder" we call `queryArray`, which runs each
    // of the queries in sequence.
    async queryArray(queries) {
      if (queries.length === 1) {
        const query = queries[0];
        if (!query.statementsProducer) {
          return this.query(query);
        }
        const statements = await query.statementsProducer(
          void 0,
          this.connection
        );
        const sqlQueryObjects = statements.sql.map((statement) => ({
          sql: statement,
          bindings: query.bindings
        }));
        const preQueryObjects = statements.pre.map((statement) => ({
          sql: statement,
          bindings: query.bindings
        }));
        const postQueryObjects = statements.post.map((statement) => ({
          sql: statement,
          bindings: query.bindings
        }));
        let results2 = [];
        await this.queryArray(preQueryObjects);
        try {
          await this.client.transaction(
            async (trx) => {
              const transactionRunner = new Runner(trx.client, this.builder);
              transactionRunner.connection = this.connection;
              results2 = await transactionRunner.queryArray(sqlQueryObjects);
              if (statements.check) {
                const foreignViolations = await trx.raw(statements.check);
                if (foreignViolations.length > 0) {
                  throw new Error("FOREIGN KEY constraint failed");
                }
              }
            },
            { connection: this.connection }
          );
        } finally {
          await this.queryArray(postQueryObjects);
        }
        return results2;
      }
      const results = [];
      for (const query of queries) {
        results.push(await this.queryArray([query]));
      }
      return results;
    }
    // Check whether there's a transaction flag, and that it has a connection.
    async ensureConnection(cb, cbParams) {
      if (this.builder._connection) {
        this.connection = this.builder._connection;
      }
      if (this.connection) {
        return cb(this, cbParams);
      }
      let acquiredConnection;
      try {
        acquiredConnection = await this.client.acquireConnection();
      } catch (error) {
        if (!(error instanceof KnexTimeoutError)) {
          return Promise.reject(error);
        }
        if (this.builder) {
          error.sql = this.builder.sql;
          error.bindings = this.builder.bindings;
        }
        throw error;
      }
      try {
        this.connection = acquiredConnection;
        return await cb(this, cbParams);
      } finally {
        await this.client.releaseConnection(acquiredConnection);
      }
    }
  }
  runner = Runner;
  return runner;
}
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self2 = debug;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter2 = createDebug.formatters[format];
          if (typeof formatter2 === "function") {
            const val = args[index];
            match = formatter2.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend2;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend2(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      const len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      const namespaces = [
        ...createDebug.names.map(toNamespace),
        ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      let i;
      let len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function toNamespace(regexp) {
      return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0$2;
  const tty = require$$0$1;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    const tty = require$$0$1;
    const util = require$$2$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    src.exports = requireBrowser();
  } else {
    src.exports = requireNode();
  }
  return src.exports;
}
var _setCacheAdd;
var hasRequired_setCacheAdd;
function require_setCacheAdd() {
  if (hasRequired_setCacheAdd) return _setCacheAdd;
  hasRequired_setCacheAdd = 1;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  _setCacheAdd = setCacheAdd;
  return _setCacheAdd;
}
var _setCacheHas;
var hasRequired_setCacheHas;
function require_setCacheHas() {
  if (hasRequired_setCacheHas) return _setCacheHas;
  hasRequired_setCacheHas = 1;
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  _setCacheHas = setCacheHas;
  return _setCacheHas;
}
var _SetCache;
var hasRequired_SetCache;
function require_SetCache() {
  if (hasRequired_SetCache) return _SetCache;
  hasRequired_SetCache = 1;
  var MapCache = require_MapCache(), setCacheAdd = require_setCacheAdd(), setCacheHas = require_setCacheHas();
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  _SetCache = SetCache;
  return _SetCache;
}
var _baseFindIndex;
var hasRequired_baseFindIndex;
function require_baseFindIndex() {
  if (hasRequired_baseFindIndex) return _baseFindIndex;
  hasRequired_baseFindIndex = 1;
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  _baseFindIndex = baseFindIndex;
  return _baseFindIndex;
}
var _baseIsNaN;
var hasRequired_baseIsNaN;
function require_baseIsNaN() {
  if (hasRequired_baseIsNaN) return _baseIsNaN;
  hasRequired_baseIsNaN = 1;
  function baseIsNaN(value) {
    return value !== value;
  }
  _baseIsNaN = baseIsNaN;
  return _baseIsNaN;
}
var _strictIndexOf;
var hasRequired_strictIndexOf;
function require_strictIndexOf() {
  if (hasRequired_strictIndexOf) return _strictIndexOf;
  hasRequired_strictIndexOf = 1;
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1, length = array.length;
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }
  _strictIndexOf = strictIndexOf;
  return _strictIndexOf;
}
var _baseIndexOf;
var hasRequired_baseIndexOf;
function require_baseIndexOf() {
  if (hasRequired_baseIndexOf) return _baseIndexOf;
  hasRequired_baseIndexOf = 1;
  var baseFindIndex = require_baseFindIndex(), baseIsNaN = require_baseIsNaN(), strictIndexOf = require_strictIndexOf();
  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
  }
  _baseIndexOf = baseIndexOf;
  return _baseIndexOf;
}
var _arrayIncludes;
var hasRequired_arrayIncludes;
function require_arrayIncludes() {
  if (hasRequired_arrayIncludes) return _arrayIncludes;
  hasRequired_arrayIncludes = 1;
  var baseIndexOf = require_baseIndexOf();
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }
  _arrayIncludes = arrayIncludes;
  return _arrayIncludes;
}
var _arrayIncludesWith;
var hasRequired_arrayIncludesWith;
function require_arrayIncludesWith() {
  if (hasRequired_arrayIncludesWith) return _arrayIncludesWith;
  hasRequired_arrayIncludesWith = 1;
  function arrayIncludesWith(array, value, comparator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }
  _arrayIncludesWith = arrayIncludesWith;
  return _arrayIncludesWith;
}
var _cacheHas;
var hasRequired_cacheHas;
function require_cacheHas() {
  if (hasRequired_cacheHas) return _cacheHas;
  hasRequired_cacheHas = 1;
  function cacheHas(cache2, key) {
    return cache2.has(key);
  }
  _cacheHas = cacheHas;
  return _cacheHas;
}
var _baseDifference;
var hasRequired_baseDifference;
function require_baseDifference() {
  if (hasRequired_baseDifference) return _baseDifference;
  hasRequired_baseDifference = 1;
  var SetCache = require_SetCache(), arrayIncludes = require_arrayIncludes(), arrayIncludesWith = require_arrayIncludesWith(), arrayMap = require_arrayMap(), baseUnary = require_baseUnary(), cacheHas = require_cacheHas();
  var LARGE_ARRAY_SIZE = 200;
  function baseDifference(array, values, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
    if (!length) {
      return result;
    }
    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }
    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee == null ? value : iteratee(value);
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        } else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
    return result;
  }
  _baseDifference = baseDifference;
  return _baseDifference;
}
var _isFlattenable;
var hasRequired_isFlattenable;
function require_isFlattenable() {
  if (hasRequired_isFlattenable) return _isFlattenable;
  hasRequired_isFlattenable = 1;
  var Symbol2 = require_Symbol(), isArguments = requireIsArguments(), isArray = requireIsArray();
  var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  _isFlattenable = isFlattenable;
  return _isFlattenable;
}
var _baseFlatten;
var hasRequired_baseFlatten;
function require_baseFlatten() {
  if (hasRequired_baseFlatten) return _baseFlatten;
  hasRequired_baseFlatten = 1;
  var arrayPush = require_arrayPush(), isFlattenable = require_isFlattenable();
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  _baseFlatten = baseFlatten;
  return _baseFlatten;
}
var isArrayLikeObject_1;
var hasRequiredIsArrayLikeObject;
function requireIsArrayLikeObject() {
  if (hasRequiredIsArrayLikeObject) return isArrayLikeObject_1;
  hasRequiredIsArrayLikeObject = 1;
  var isArrayLike = requireIsArrayLike(), isObjectLike = requireIsObjectLike();
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  isArrayLikeObject_1 = isArrayLikeObject;
  return isArrayLikeObject_1;
}
var last_1;
var hasRequiredLast;
function requireLast() {
  if (hasRequiredLast) return last_1;
  hasRequiredLast = 1;
  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : void 0;
  }
  last_1 = last;
  return last_1;
}
var differenceWith_1;
var hasRequiredDifferenceWith;
function requireDifferenceWith() {
  if (hasRequiredDifferenceWith) return differenceWith_1;
  hasRequiredDifferenceWith = 1;
  var baseDifference = require_baseDifference(), baseFlatten = require_baseFlatten(), baseRest = require_baseRest(), isArrayLikeObject = requireIsArrayLikeObject(), last = requireLast();
  var differenceWith = baseRest(function(array, values) {
    var comparator = last(values);
    if (isArrayLikeObject(comparator)) {
      comparator = void 0;
    }
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), void 0, comparator) : [];
  });
  differenceWith_1 = differenceWith;
  return differenceWith_1;
}
var _isKey;
var hasRequired_isKey;
function require_isKey() {
  if (hasRequired_isKey) return _isKey;
  hasRequired_isKey = 1;
  var isArray = requireIsArray(), isSymbol = requireIsSymbol();
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  _isKey = isKey;
  return _isKey;
}
var memoize_1;
var hasRequiredMemoize;
function requireMemoize() {
  if (hasRequiredMemoize) return memoize_1;
  hasRequiredMemoize = 1;
  var MapCache = require_MapCache();
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
      if (cache2.has(key)) {
        return cache2.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache2.set(key, result) || cache2;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  memoize_1 = memoize;
  return memoize_1;
}
var _memoizeCapped;
var hasRequired_memoizeCapped;
function require_memoizeCapped() {
  if (hasRequired_memoizeCapped) return _memoizeCapped;
  hasRequired_memoizeCapped = 1;
  var memoize = requireMemoize();
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache2.size === MAX_MEMOIZE_SIZE) {
        cache2.clear();
      }
      return key;
    });
    var cache2 = result.cache;
    return result;
  }
  _memoizeCapped = memoizeCapped;
  return _memoizeCapped;
}
var _stringToPath;
var hasRequired_stringToPath;
function require_stringToPath() {
  if (hasRequired_stringToPath) return _stringToPath;
  hasRequired_stringToPath = 1;
  var memoizeCapped = require_memoizeCapped();
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string2) {
    var result = [];
    if (string2.charCodeAt(0) === 46) {
      result.push("");
    }
    string2.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  _stringToPath = stringToPath;
  return _stringToPath;
}
var _castPath;
var hasRequired_castPath;
function require_castPath() {
  if (hasRequired_castPath) return _castPath;
  hasRequired_castPath = 1;
  var isArray = requireIsArray(), isKey = require_isKey(), stringToPath = require_stringToPath(), toString = requireToString();
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }
  _castPath = castPath;
  return _castPath;
}
var _toKey;
var hasRequired_toKey;
function require_toKey() {
  if (hasRequired_toKey) return _toKey;
  hasRequired_toKey = 1;
  var isSymbol = requireIsSymbol();
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
  }
  _toKey = toKey;
  return _toKey;
}
var _baseGet;
var hasRequired_baseGet;
function require_baseGet() {
  if (hasRequired_baseGet) return _baseGet;
  hasRequired_baseGet = 1;
  var castPath = require_castPath(), toKey = require_toKey();
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  _baseGet = baseGet;
  return _baseGet;
}
var get_1;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get_1;
  hasRequiredGet = 1;
  var baseGet = require_baseGet();
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  get_1 = get;
  return get_1;
}
var isEmpty_1;
var hasRequiredIsEmpty;
function requireIsEmpty() {
  if (hasRequiredIsEmpty) return isEmpty_1;
  hasRequiredIsEmpty = 1;
  var baseKeys = require_baseKeys(), getTag = require_getTag(), isArguments = requireIsArguments(), isArray = requireIsArray(), isArrayLike = requireIsArrayLike(), isBuffer2 = requireIsBuffer(), isPrototype = require_isPrototype(), isTypedArray = requireIsTypedArray();
  var mapTag = "[object Map]", setTag = "[object Set]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer2(value) || isTypedArray(value) || isArguments(value))) {
      return !value.length;
    }
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
    if (isPrototype(value)) {
      return !baseKeys(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  isEmpty_1 = isEmpty;
  return isEmpty_1;
}
var _baseExtremum;
var hasRequired_baseExtremum;
function require_baseExtremum() {
  if (hasRequired_baseExtremum) return _baseExtremum;
  hasRequired_baseExtremum = 1;
  var isSymbol = requireIsSymbol();
  function baseExtremum(array, iteratee, comparator) {
    var index = -1, length = array.length;
    while (++index < length) {
      var value = array[index], current = iteratee(value);
      if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) {
        var computed = current, result = value;
      }
    }
    return result;
  }
  _baseExtremum = baseExtremum;
  return _baseExtremum;
}
var _baseGt;
var hasRequired_baseGt;
function require_baseGt() {
  if (hasRequired_baseGt) return _baseGt;
  hasRequired_baseGt = 1;
  function baseGt(value, other) {
    return value > other;
  }
  _baseGt = baseGt;
  return _baseGt;
}
var max_1;
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max_1;
  hasRequiredMax = 1;
  var baseExtremum = require_baseExtremum(), baseGt = require_baseGt(), identity = requireIdentity();
  function max(array) {
    return array && array.length ? baseExtremum(array, identity, baseGt) : void 0;
  }
  max_1 = max;
  return max_1;
}
var tableResolver;
var hasRequiredTableResolver;
function requireTableResolver() {
  if (hasRequiredTableResolver) return tableResolver;
  hasRequiredTableResolver = 1;
  function getTableName(tableName, schemaName) {
    return schemaName ? `${schemaName}.${tableName}` : tableName;
  }
  function getTable(trxOrKnex, tableName, schemaName) {
    return schemaName ? trxOrKnex(tableName).withSchema(schemaName) : trxOrKnex(tableName);
  }
  function getLockTableName(tableName) {
    return tableName + "_lock";
  }
  function getLockTableNameWithSchema(tableName, schemaName) {
    return schemaName ? schemaName + "." + getLockTableName(tableName) : getLockTableName(tableName);
  }
  tableResolver = {
    getLockTableName,
    getLockTableNameWithSchema,
    getTable,
    getTableName
  };
  return tableResolver;
}
var tableCreator;
var hasRequiredTableCreator;
function requireTableCreator() {
  if (hasRequiredTableCreator) return tableCreator;
  hasRequiredTableCreator = 1;
  const {
    getTable,
    getLockTableName,
    getLockTableNameWithSchema,
    getTableName
  } = requireTableResolver();
  function ensureTable(tableName, schemaName, trxOrKnex) {
    const lockTable = getLockTableName(tableName);
    return getSchemaBuilder(trxOrKnex, schemaName).hasTable(tableName).then((exists) => {
      return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
    }).then(() => {
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
    }).then((exists) => {
      return !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex);
    }).then(() => {
      return getTable(trxOrKnex, lockTable, schemaName).select("*");
    }).then((data) => {
      return !data.length && _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex);
    });
  }
  function _createMigrationTable(tableName, schemaName, trxOrKnex) {
    return getSchemaBuilder(trxOrKnex, schemaName).createTable(
      getTableName(tableName),
      function(t) {
        t.increments();
        t.string("name");
        t.integer("batch");
        t.timestamp("migration_time");
      }
    );
  }
  function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
    return getSchemaBuilder(trxOrKnex, schemaName).createTable(
      tableName,
      function(t) {
        t.increments("index").primary();
        t.integer("is_locked");
      }
    );
  }
  function _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex) {
    const lockTableWithSchema = getLockTableNameWithSchema(tableName, schemaName);
    return trxOrKnex.select("*").from(lockTableWithSchema).then((data) => {
      return !data.length ? trxOrKnex.from(lockTableWithSchema).insert({ is_locked: 0 }) : null;
    });
  }
  function getSchemaBuilder(trxOrKnex, schemaName) {
    return schemaName ? trxOrKnex.schema.withSchema(schemaName) : trxOrKnex.schema;
  }
  tableCreator = {
    ensureTable,
    getSchemaBuilder
  };
  return tableCreator;
}
var migrationListResolver;
var hasRequiredMigrationListResolver;
function requireMigrationListResolver() {
  if (hasRequiredMigrationListResolver) return migrationListResolver;
  hasRequiredMigrationListResolver = 1;
  const { getTableName } = requireTableResolver();
  const { ensureTable } = requireTableCreator();
  function listAll(migrationSource, loadExtensions) {
    return migrationSource.getMigrations(loadExtensions);
  }
  async function listCompleted(tableName, schemaName, trxOrKnex) {
    await ensureTable(tableName, schemaName, trxOrKnex);
    return await trxOrKnex.from(getTableName(tableName, schemaName)).orderBy("id").select("name");
  }
  function listAllAndCompleted(config, trxOrKnex) {
    return Promise.all([
      listAll(config.migrationSource, config.loadExtensions),
      listCompleted(config.tableName, config.schemaName, trxOrKnex)
    ]);
  }
  migrationListResolver = {
    listAll,
    listAllAndCompleted,
    listCompleted
  };
  return migrationListResolver;
}
var _createAssigner;
var hasRequired_createAssigner;
function require_createAssigner() {
  if (hasRequired_createAssigner) return _createAssigner;
  hasRequired_createAssigner = 1;
  var baseRest = require_baseRest(), isIterateeCall = require_isIterateeCall();
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  _createAssigner = createAssigner;
  return _createAssigner;
}
var assignInWith_1;
var hasRequiredAssignInWith;
function requireAssignInWith() {
  if (hasRequiredAssignInWith) return assignInWith_1;
  hasRequiredAssignInWith = 1;
  var copyObject = require_copyObject(), createAssigner = require_createAssigner(), keysIn = requireKeysIn();
  var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
    copyObject(source, keysIn(source), object, customizer);
  });
  assignInWith_1 = assignInWith;
  return assignInWith_1;
}
var isPlainObject_1;
var hasRequiredIsPlainObject;
function requireIsPlainObject() {
  if (hasRequiredIsPlainObject) return isPlainObject_1;
  hasRequiredIsPlainObject = 1;
  var baseGetTag = require_baseGetTag(), getPrototype = require_getPrototype(), isObjectLike = requireIsObjectLike();
  var objectTag = "[object Object]";
  var funcProto = Function.prototype, objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  isPlainObject_1 = isPlainObject;
  return isPlainObject_1;
}
var isError_1;
var hasRequiredIsError;
function requireIsError() {
  if (hasRequiredIsError) return isError_1;
  hasRequiredIsError = 1;
  var baseGetTag = require_baseGetTag(), isObjectLike = requireIsObjectLike(), isPlainObject = requireIsPlainObject();
  var domExcTag = "[object DOMException]", errorTag = "[object Error]";
  function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
  }
  isError_1 = isError;
  return isError_1;
}
var attempt_1;
var hasRequiredAttempt;
function requireAttempt() {
  if (hasRequiredAttempt) return attempt_1;
  hasRequiredAttempt = 1;
  var apply = require_apply(), baseRest = require_baseRest(), isError = requireIsError();
  var attempt = baseRest(function(func, args) {
    try {
      return apply(func, void 0, args);
    } catch (e) {
      return isError(e) ? e : new Error(e);
    }
  });
  attempt_1 = attempt;
  return attempt_1;
}
var _baseValues;
var hasRequired_baseValues;
function require_baseValues() {
  if (hasRequired_baseValues) return _baseValues;
  hasRequired_baseValues = 1;
  var arrayMap = require_arrayMap();
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }
  _baseValues = baseValues;
  return _baseValues;
}
var _customDefaultsAssignIn;
var hasRequired_customDefaultsAssignIn;
function require_customDefaultsAssignIn() {
  if (hasRequired_customDefaultsAssignIn) return _customDefaultsAssignIn;
  hasRequired_customDefaultsAssignIn = 1;
  var eq = requireEq();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function customDefaultsAssignIn(objValue, srcValue, key, object) {
    if (objValue === void 0 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
      return srcValue;
    }
    return objValue;
  }
  _customDefaultsAssignIn = customDefaultsAssignIn;
  return _customDefaultsAssignIn;
}
var _escapeStringChar;
var hasRequired_escapeStringChar;
function require_escapeStringChar() {
  if (hasRequired_escapeStringChar) return _escapeStringChar;
  hasRequired_escapeStringChar = 1;
  var stringEscapes = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  function escapeStringChar(chr) {
    return "\\" + stringEscapes[chr];
  }
  _escapeStringChar = escapeStringChar;
  return _escapeStringChar;
}
var _reInterpolate;
var hasRequired_reInterpolate;
function require_reInterpolate() {
  if (hasRequired_reInterpolate) return _reInterpolate;
  hasRequired_reInterpolate = 1;
  var reInterpolate = /<%=([\s\S]+?)%>/g;
  _reInterpolate = reInterpolate;
  return _reInterpolate;
}
var _basePropertyOf;
var hasRequired_basePropertyOf;
function require_basePropertyOf() {
  if (hasRequired_basePropertyOf) return _basePropertyOf;
  hasRequired_basePropertyOf = 1;
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? void 0 : object[key];
    };
  }
  _basePropertyOf = basePropertyOf;
  return _basePropertyOf;
}
var _escapeHtmlChar;
var hasRequired_escapeHtmlChar;
function require_escapeHtmlChar() {
  if (hasRequired_escapeHtmlChar) return _escapeHtmlChar;
  hasRequired_escapeHtmlChar = 1;
  var basePropertyOf = require_basePropertyOf();
  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var escapeHtmlChar = basePropertyOf(htmlEscapes);
  _escapeHtmlChar = escapeHtmlChar;
  return _escapeHtmlChar;
}
var _escape;
var hasRequired_escape;
function require_escape() {
  if (hasRequired_escape) return _escape;
  hasRequired_escape = 1;
  var escapeHtmlChar = require_escapeHtmlChar(), toString = requireToString();
  var reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  function escape(string2) {
    string2 = toString(string2);
    return string2 && reHasUnescapedHtml.test(string2) ? string2.replace(reUnescapedHtml, escapeHtmlChar) : string2;
  }
  _escape = escape;
  return _escape;
}
var _reEscape;
var hasRequired_reEscape;
function require_reEscape() {
  if (hasRequired_reEscape) return _reEscape;
  hasRequired_reEscape = 1;
  var reEscape = /<%-([\s\S]+?)%>/g;
  _reEscape = reEscape;
  return _reEscape;
}
var _reEvaluate;
var hasRequired_reEvaluate;
function require_reEvaluate() {
  if (hasRequired_reEvaluate) return _reEvaluate;
  hasRequired_reEvaluate = 1;
  var reEvaluate = /<%([\s\S]+?)%>/g;
  _reEvaluate = reEvaluate;
  return _reEvaluate;
}
var templateSettings_1;
var hasRequiredTemplateSettings;
function requireTemplateSettings() {
  if (hasRequiredTemplateSettings) return templateSettings_1;
  hasRequiredTemplateSettings = 1;
  var escape = require_escape(), reEscape = require_reEscape(), reEvaluate = require_reEvaluate(), reInterpolate = require_reInterpolate();
  var templateSettings = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "escape": reEscape,
    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "evaluate": reEvaluate,
    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "interpolate": reInterpolate,
    /**
     * Used to reference the data object in the template text.
     *
     * @memberOf _.templateSettings
     * @type {string}
     */
    "variable": "",
    /**
     * Used to import variables into the compiled template.
     *
     * @memberOf _.templateSettings
     * @type {Object}
     */
    "imports": {
      /**
       * A reference to the `lodash` function.
       *
       * @memberOf _.templateSettings.imports
       * @type {Function}
       */
      "_": { "escape": escape }
    }
  };
  templateSettings_1 = templateSettings;
  return templateSettings_1;
}
var template_1$1;
var hasRequiredTemplate$1;
function requireTemplate$1() {
  if (hasRequiredTemplate$1) return template_1$1;
  hasRequiredTemplate$1 = 1;
  var assignInWith = requireAssignInWith(), attempt = requireAttempt(), baseValues = require_baseValues(), customDefaultsAssignIn = require_customDefaultsAssignIn(), escapeStringChar = require_escapeStringChar(), isError = requireIsError(), isIterateeCall = require_isIterateeCall(), keys = requireKeys(), reInterpolate = require_reInterpolate(), templateSettings = requireTemplateSettings(), toString = requireToString();
  var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
  var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
  var reNoMatch = /($^)/;
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function template(string2, options, guard) {
    var settings = templateSettings.imports._.templateSettings || templateSettings;
    if (guard && isIterateeCall(string2, options, guard)) {
      options = void 0;
    }
    string2 = toString(string2);
    options = assignInWith({}, options, settings, customDefaultsAssignIn);
    var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
    var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
    var reDelimiters = RegExp(
      (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
      "g"
    );
    var sourceURL = hasOwnProperty.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
    string2.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);
      source += string2.slice(index, offset).replace(reUnescapedString, escapeStringChar);
      if (escapeValue) {
        isEscaping = true;
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    var variable = hasOwnProperty.call(options, "variable") && options.variable;
    if (!variable) {
      source = "with (obj) {\n" + source + "\n}\n";
    } else if (reForbiddenIdentifierChars.test(variable)) {
      throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
    }
    source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
    source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
    var result = attempt(function() {
      return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
    });
    result.source = source;
    if (isError(result)) {
      throw result;
    }
    return result;
  }
  template_1$1 = template;
  return template_1$1;
}
var flatten_1;
var hasRequiredFlatten;
function requireFlatten() {
  if (hasRequiredFlatten) return flatten_1;
  hasRequiredFlatten = 1;
  var baseFlatten = require_baseFlatten();
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }
  flatten_1 = flatten;
  return flatten_1;
}
var fs_1;
var hasRequiredFs;
function requireFs() {
  if (hasRequiredFs) return fs_1;
  hasRequiredFs = 1;
  const fs = require$$0$3;
  const flatten = requireFlatten();
  const os = require$$0$2;
  const path = require$$0$4;
  const { promisify } = require$$2$1;
  const stat = promisify(fs.stat);
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);
  const readdir = promisify(fs.readdir);
  const mkdir = promisify(fs.mkdir);
  function existsSync(path2) {
    try {
      fs.accessSync(path2);
      return true;
    } catch (e) {
      return false;
    }
  }
  function createTemp() {
    return promisify(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);
  }
  function ensureDirectoryExists(dir) {
    return stat(dir).catch(() => mkdir(dir, { recursive: true }));
  }
  async function getFilepathsInFolder(dir, recursive = false) {
    const pathsList = await readdir(dir);
    return flatten(
      await Promise.all(
        pathsList.sort().map(async (currentPath) => {
          const currentFile = path.resolve(dir, currentPath);
          const statFile = await stat(currentFile);
          if (statFile && statFile.isDirectory()) {
            if (recursive) {
              return await getFilepathsInFolder(currentFile, true);
            }
            return [];
          }
          return [currentFile];
        })
      )
    );
  }
  fs_1 = {
    existsSync,
    stat,
    readdir,
    readFile,
    writeFile,
    createTemp,
    ensureDirectoryExists,
    getFilepathsInFolder
  };
  return fs_1;
}
var template_1;
var hasRequiredTemplate;
function requireTemplate() {
  if (hasRequiredTemplate) return template_1;
  hasRequiredTemplate = 1;
  const template = requireTemplate$1();
  const { readFile, writeFile } = requireFs();
  const jsSourceTemplate = (content, options) => template(content, {
    interpolate: /<%=([\s\S]+?)%>/g,
    ...options
  });
  const jsFileTemplate = async (filePath, options) => {
    const contentBuffer = await readFile(filePath);
    return jsSourceTemplate(contentBuffer.toString(), options);
  };
  const writeJsFileUsingTemplate = async (targetFilePath, sourceFilePath, options, variables) => writeFile(
    targetFilePath,
    (await jsFileTemplate(sourceFilePath, options))(variables)
  );
  template_1 = {
    jsSourceTemplate,
    jsFileTemplate,
    writeJsFileUsingTemplate
  };
  return template_1;
}
var _arraySome;
var hasRequired_arraySome;
function require_arraySome() {
  if (hasRequired_arraySome) return _arraySome;
  hasRequired_arraySome = 1;
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  _arraySome = arraySome;
  return _arraySome;
}
var _equalArrays;
var hasRequired_equalArrays;
function require_equalArrays() {
  if (hasRequired_equalArrays) return _equalArrays;
  hasRequired_equalArrays = 1;
  var SetCache = require_SetCache(), arraySome = require_arraySome(), cacheHas = require_cacheHas();
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  _equalArrays = equalArrays;
  return _equalArrays;
}
var _mapToArray;
var hasRequired_mapToArray;
function require_mapToArray() {
  if (hasRequired_mapToArray) return _mapToArray;
  hasRequired_mapToArray = 1;
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  _mapToArray = mapToArray;
  return _mapToArray;
}
var _setToArray;
var hasRequired_setToArray;
function require_setToArray() {
  if (hasRequired_setToArray) return _setToArray;
  hasRequired_setToArray = 1;
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  _setToArray = setToArray;
  return _setToArray;
}
var _equalByTag;
var hasRequired_equalByTag;
function require_equalByTag() {
  if (hasRequired_equalByTag) return _equalByTag;
  hasRequired_equalByTag = 1;
  var Symbol2 = require_Symbol(), Uint8Array = require_Uint8Array(), eq = requireEq(), equalArrays = require_equalArrays(), mapToArray = require_mapToArray(), setToArray = require_setToArray();
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  _equalByTag = equalByTag;
  return _equalByTag;
}
var _equalObjects;
var hasRequired_equalObjects;
function require_equalObjects() {
  if (hasRequired_equalObjects) return _equalObjects;
  hasRequired_equalObjects = 1;
  var getAllKeys = require_getAllKeys();
  var COMPARE_PARTIAL_FLAG = 1;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  _equalObjects = equalObjects;
  return _equalObjects;
}
var _baseIsEqualDeep;
var hasRequired_baseIsEqualDeep;
function require_baseIsEqualDeep() {
  if (hasRequired_baseIsEqualDeep) return _baseIsEqualDeep;
  hasRequired_baseIsEqualDeep = 1;
  var Stack = require_Stack(), equalArrays = require_equalArrays(), equalByTag = require_equalByTag(), equalObjects = require_equalObjects(), getTag = require_getTag(), isArray = requireIsArray(), isBuffer2 = requireIsBuffer(), isTypedArray = requireIsTypedArray();
  var COMPARE_PARTIAL_FLAG = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer2(object)) {
      if (!isBuffer2(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  _baseIsEqualDeep = baseIsEqualDeep;
  return _baseIsEqualDeep;
}
var _baseIsEqual;
var hasRequired_baseIsEqual;
function require_baseIsEqual() {
  if (hasRequired_baseIsEqual) return _baseIsEqual;
  hasRequired_baseIsEqual = 1;
  var baseIsEqualDeep = require_baseIsEqualDeep(), isObjectLike = requireIsObjectLike();
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  _baseIsEqual = baseIsEqual;
  return _baseIsEqual;
}
var _baseIsMatch;
var hasRequired_baseIsMatch;
function require_baseIsMatch() {
  if (hasRequired_baseIsMatch) return _baseIsMatch;
  hasRequired_baseIsMatch = 1;
  var Stack = require_Stack(), baseIsEqual = require_baseIsEqual();
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  _baseIsMatch = baseIsMatch;
  return _baseIsMatch;
}
var _isStrictComparable;
var hasRequired_isStrictComparable;
function require_isStrictComparable() {
  if (hasRequired_isStrictComparable) return _isStrictComparable;
  hasRequired_isStrictComparable = 1;
  var isObject = requireIsObject();
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  _isStrictComparable = isStrictComparable;
  return _isStrictComparable;
}
var _getMatchData;
var hasRequired_getMatchData;
function require_getMatchData() {
  if (hasRequired_getMatchData) return _getMatchData;
  hasRequired_getMatchData = 1;
  var isStrictComparable = require_isStrictComparable(), keys = requireKeys();
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  _getMatchData = getMatchData;
  return _getMatchData;
}
var _matchesStrictComparable;
var hasRequired_matchesStrictComparable;
function require_matchesStrictComparable() {
  if (hasRequired_matchesStrictComparable) return _matchesStrictComparable;
  hasRequired_matchesStrictComparable = 1;
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  _matchesStrictComparable = matchesStrictComparable;
  return _matchesStrictComparable;
}
var _baseMatches;
var hasRequired_baseMatches;
function require_baseMatches() {
  if (hasRequired_baseMatches) return _baseMatches;
  hasRequired_baseMatches = 1;
  var baseIsMatch = require_baseIsMatch(), getMatchData = require_getMatchData(), matchesStrictComparable = require_matchesStrictComparable();
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  _baseMatches = baseMatches;
  return _baseMatches;
}
var _baseHasIn;
var hasRequired_baseHasIn;
function require_baseHasIn() {
  if (hasRequired_baseHasIn) return _baseHasIn;
  hasRequired_baseHasIn = 1;
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  _baseHasIn = baseHasIn;
  return _baseHasIn;
}
var _hasPath;
var hasRequired_hasPath;
function require_hasPath() {
  if (hasRequired_hasPath) return _hasPath;
  hasRequired_hasPath = 1;
  var castPath = require_castPath(), isArguments = requireIsArguments(), isArray = requireIsArray(), isIndex = require_isIndex(), isLength = requireIsLength(), toKey = require_toKey();
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
  }
  _hasPath = hasPath;
  return _hasPath;
}
var hasIn_1;
var hasRequiredHasIn;
function requireHasIn() {
  if (hasRequiredHasIn) return hasIn_1;
  hasRequiredHasIn = 1;
  var baseHasIn = require_baseHasIn(), hasPath = require_hasPath();
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  hasIn_1 = hasIn;
  return hasIn_1;
}
var _baseMatchesProperty;
var hasRequired_baseMatchesProperty;
function require_baseMatchesProperty() {
  if (hasRequired_baseMatchesProperty) return _baseMatchesProperty;
  hasRequired_baseMatchesProperty = 1;
  var baseIsEqual = require_baseIsEqual(), get = requireGet(), hasIn = requireHasIn(), isKey = require_isKey(), isStrictComparable = require_isStrictComparable(), matchesStrictComparable = require_matchesStrictComparable(), toKey = require_toKey();
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  _baseMatchesProperty = baseMatchesProperty;
  return _baseMatchesProperty;
}
var _baseProperty;
var hasRequired_baseProperty;
function require_baseProperty() {
  if (hasRequired_baseProperty) return _baseProperty;
  hasRequired_baseProperty = 1;
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  _baseProperty = baseProperty;
  return _baseProperty;
}
var _basePropertyDeep;
var hasRequired_basePropertyDeep;
function require_basePropertyDeep() {
  if (hasRequired_basePropertyDeep) return _basePropertyDeep;
  hasRequired_basePropertyDeep = 1;
  var baseGet = require_baseGet();
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  _basePropertyDeep = basePropertyDeep;
  return _basePropertyDeep;
}
var property_1;
var hasRequiredProperty;
function requireProperty() {
  if (hasRequiredProperty) return property_1;
  hasRequiredProperty = 1;
  var baseProperty = require_baseProperty(), basePropertyDeep = require_basePropertyDeep(), isKey = require_isKey(), toKey = require_toKey();
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  property_1 = property;
  return property_1;
}
var _baseIteratee;
var hasRequired_baseIteratee;
function require_baseIteratee() {
  if (hasRequired_baseIteratee) return _baseIteratee;
  hasRequired_baseIteratee = 1;
  var baseMatches = require_baseMatches(), baseMatchesProperty = require_baseMatchesProperty(), identity = requireIdentity(), isArray = requireIsArray(), property = requireProperty();
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  _baseIteratee = baseIteratee;
  return _baseIteratee;
}
var _createBaseFor;
var hasRequired_createBaseFor;
function require_createBaseFor() {
  if (hasRequired_createBaseFor) return _createBaseFor;
  hasRequired_createBaseFor = 1;
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  _createBaseFor = createBaseFor;
  return _createBaseFor;
}
var _baseFor;
var hasRequired_baseFor;
function require_baseFor() {
  if (hasRequired_baseFor) return _baseFor;
  hasRequired_baseFor = 1;
  var createBaseFor = require_createBaseFor();
  var baseFor = createBaseFor();
  _baseFor = baseFor;
  return _baseFor;
}
var _baseForOwn;
var hasRequired_baseForOwn;
function require_baseForOwn() {
  if (hasRequired_baseForOwn) return _baseForOwn;
  hasRequired_baseForOwn = 1;
  var baseFor = require_baseFor(), keys = requireKeys();
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  _baseForOwn = baseForOwn;
  return _baseForOwn;
}
var _createBaseEach;
var hasRequired_createBaseEach;
function require_createBaseEach() {
  if (hasRequired_createBaseEach) return _createBaseEach;
  hasRequired_createBaseEach = 1;
  var isArrayLike = requireIsArrayLike();
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  _createBaseEach = createBaseEach;
  return _createBaseEach;
}
var _baseEach;
var hasRequired_baseEach;
function require_baseEach() {
  if (hasRequired_baseEach) return _baseEach;
  hasRequired_baseEach = 1;
  var baseForOwn = require_baseForOwn(), createBaseEach = require_createBaseEach();
  var baseEach = createBaseEach(baseForOwn);
  _baseEach = baseEach;
  return _baseEach;
}
var _baseMap;
var hasRequired_baseMap;
function require_baseMap() {
  if (hasRequired_baseMap) return _baseMap;
  hasRequired_baseMap = 1;
  var baseEach = require_baseEach(), isArrayLike = requireIsArrayLike();
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  _baseMap = baseMap;
  return _baseMap;
}
var _baseSortBy;
var hasRequired_baseSortBy;
function require_baseSortBy() {
  if (hasRequired_baseSortBy) return _baseSortBy;
  hasRequired_baseSortBy = 1;
  function baseSortBy(array, comparer) {
    var length = array.length;
    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }
  _baseSortBy = baseSortBy;
  return _baseSortBy;
}
var _compareAscending;
var hasRequired_compareAscending;
function require_compareAscending() {
  if (hasRequired_compareAscending) return _compareAscending;
  hasRequired_compareAscending = 1;
  var isSymbol = requireIsSymbol();
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
      var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
      if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
        return 1;
      }
      if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
        return -1;
      }
    }
    return 0;
  }
  _compareAscending = compareAscending;
  return _compareAscending;
}
var _compareMultiple;
var hasRequired_compareMultiple;
function require_compareMultiple() {
  if (hasRequired_compareMultiple) return _compareMultiple;
  hasRequired_compareMultiple = 1;
  var compareAscending = require_compareAscending();
  function compareMultiple(object, other, orders) {
    var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == "desc" ? -1 : 1);
      }
    }
    return object.index - other.index;
  }
  _compareMultiple = compareMultiple;
  return _compareMultiple;
}
var _baseOrderBy;
var hasRequired_baseOrderBy;
function require_baseOrderBy() {
  if (hasRequired_baseOrderBy) return _baseOrderBy;
  hasRequired_baseOrderBy = 1;
  var arrayMap = require_arrayMap(), baseGet = require_baseGet(), baseIteratee = require_baseIteratee(), baseMap = require_baseMap(), baseSortBy = require_baseSortBy(), baseUnary = require_baseUnary(), compareMultiple = require_compareMultiple(), identity = requireIdentity(), isArray = requireIsArray();
  function baseOrderBy(collection, iteratees, orders) {
    if (iteratees.length) {
      iteratees = arrayMap(iteratees, function(iteratee) {
        if (isArray(iteratee)) {
          return function(value) {
            return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
          };
        }
        return iteratee;
      });
    } else {
      iteratees = [identity];
    }
    var index = -1;
    iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
    var result = baseMap(collection, function(value, key, collection2) {
      var criteria = arrayMap(iteratees, function(iteratee) {
        return iteratee(value);
      });
      return { "criteria": criteria, "index": ++index, "value": value };
    });
    return baseSortBy(result, function(object, other) {
      return compareMultiple(object, other, orders);
    });
  }
  _baseOrderBy = baseOrderBy;
  return _baseOrderBy;
}
var sortBy_1;
var hasRequiredSortBy;
function requireSortBy() {
  if (hasRequiredSortBy) return sortBy_1;
  hasRequiredSortBy = 1;
  var baseFlatten = require_baseFlatten(), baseOrderBy = require_baseOrderBy(), baseRest = require_baseRest(), isIterateeCall = require_isIterateeCall();
  var sortBy = baseRest(function(collection, iteratees) {
    if (collection == null) {
      return [];
    }
    var length = iteratees.length;
    if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
      iteratees = [];
    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
      iteratees = [iteratees[0]];
    }
    return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
  });
  sortBy_1 = sortBy;
  return sortBy_1;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var getPackageType = { exports: {} };
var isNodeModules_1;
var hasRequiredIsNodeModules;
function requireIsNodeModules() {
  if (hasRequiredIsNodeModules) return isNodeModules_1;
  hasRequiredIsNodeModules = 1;
  const path = require$$0$4;
  function isNodeModules(directory) {
    let basename = path.basename(directory);
    if (path.sep === "\\") {
      basename = basename.toLowerCase();
    }
    return basename === "node_modules";
  }
  isNodeModules_1 = isNodeModules;
  return isNodeModules_1;
}
var cache;
var hasRequiredCache;
function requireCache() {
  if (hasRequiredCache) return cache;
  hasRequiredCache = 1;
  cache = /* @__PURE__ */ new Map();
  return cache;
}
var async;
var hasRequiredAsync;
function requireAsync() {
  if (hasRequiredAsync) return async;
  hasRequiredAsync = 1;
  const path = require$$0$4;
  const { promisify } = require$$2$1;
  const readFile = promisify(require$$0$3.readFile);
  const isNodeModules = requireIsNodeModules();
  const resultsCache = requireCache();
  const promiseCache = /* @__PURE__ */ new Map();
  async function getDirectoryTypeActual(directory) {
    if (isNodeModules(directory)) {
      return "commonjs";
    }
    try {
      return JSON.parse(await readFile(path.resolve(directory, "package.json"))).type || "commonjs";
    } catch (_) {
    }
    const parent = path.dirname(directory);
    if (parent === directory) {
      return "commonjs";
    }
    return getDirectoryType(parent);
  }
  async function getDirectoryType(directory) {
    if (resultsCache.has(directory)) {
      return resultsCache.get(directory);
    }
    if (promiseCache.has(directory)) {
      return promiseCache.get(directory);
    }
    const promise = getDirectoryTypeActual(directory);
    promiseCache.set(directory, promise);
    const result = await promise;
    resultsCache.set(directory, result);
    promiseCache.delete(directory);
    return result;
  }
  function getPackageType2(filename) {
    return getDirectoryType(path.resolve(path.dirname(filename)));
  }
  async = getPackageType2;
  return async;
}
var sync;
var hasRequiredSync;
function requireSync() {
  if (hasRequiredSync) return sync;
  hasRequiredSync = 1;
  const path = require$$0$4;
  const { readFileSync } = require$$0$3;
  const isNodeModules = requireIsNodeModules();
  const resultsCache = requireCache();
  function getDirectoryTypeActual(directory) {
    if (isNodeModules(directory)) {
      return "commonjs";
    }
    try {
      return JSON.parse(readFileSync(path.resolve(directory, "package.json"))).type || "commonjs";
    } catch (_) {
    }
    const parent = path.dirname(directory);
    if (parent === directory) {
      return "commonjs";
    }
    return getDirectoryType(parent);
  }
  function getDirectoryType(directory) {
    if (resultsCache.has(directory)) {
      return resultsCache.get(directory);
    }
    const result = getDirectoryTypeActual(directory);
    resultsCache.set(directory, result);
    return result;
  }
  function getPackageTypeSync(filename) {
    return getDirectoryType(path.resolve(path.dirname(filename)));
  }
  sync = getPackageTypeSync;
  return sync;
}
var hasRequiredGetPackageType;
function requireGetPackageType() {
  if (hasRequiredGetPackageType) return getPackageType.exports;
  hasRequiredGetPackageType = 1;
  const getPackageType$1 = requireAsync();
  const getPackageTypeSync = requireSync();
  getPackageType.exports = (filename) => getPackageType$1(filename);
  getPackageType.exports.sync = getPackageTypeSync;
  return getPackageType.exports;
}
var isModuleType;
var hasRequiredIsModuleType;
function requireIsModuleType() {
  if (hasRequiredIsModuleType) return isModuleType;
  hasRequiredIsModuleType = 1;
  const getPackageType2 = requireGetPackageType();
  isModuleType = async function isModuleType2(filepath) {
    return filepath.endsWith(".mjs") || !filepath.endsWith(".cjs") && await getPackageType2(filepath) === "module";
  };
  return isModuleType;
}
var importFile;
var hasRequiredImportFile;
function requireImportFile() {
  if (hasRequiredImportFile) return importFile;
  hasRequiredImportFile = 1;
  const isModuleType2 = requireIsModuleType();
  importFile = async function importFile2(filepath) {
    return await isModuleType2(filepath) ? import(require$$1.pathToFileURL(filepath)) : commonjsRequire(filepath);
  };
  return importFile;
}
var MigrationsLoader;
var hasRequiredMigrationsLoader;
function requireMigrationsLoader() {
  if (hasRequiredMigrationsLoader) return MigrationsLoader;
  hasRequiredMigrationsLoader = 1;
  const path = require$$0$4;
  const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
    ".co",
    ".coffee",
    ".eg",
    ".iced",
    ".js",
    ".cjs",
    ".litcoffee",
    ".ls",
    ".ts"
  ]);
  class AbstractMigrationsLoader {
    constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
      this.sortDirsSeparately = sortDirsSeparately;
      if (!Array.isArray(migrationDirectories)) {
        migrationDirectories = [migrationDirectories];
      }
      this.migrationsPaths = migrationDirectories;
      this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
    }
    getFile(migrationsInfo) {
      const absoluteDir = path.resolve(process.cwd(), migrationsInfo.directory);
      const _path = path.join(absoluteDir, migrationsInfo.file);
      const importFile2 = requireImportFile();
      return importFile2(_path);
    }
  }
  MigrationsLoader = {
    DEFAULT_LOAD_EXTENSIONS,
    AbstractMigrationsLoader
  };
  return MigrationsLoader;
}
var fsMigrations;
var hasRequiredFsMigrations;
function requireFsMigrations() {
  if (hasRequiredFsMigrations) return fsMigrations;
  hasRequiredFsMigrations = 1;
  const path = require$$0$4;
  const sortBy = requireSortBy();
  const { readdir } = requireFs();
  const { AbstractMigrationsLoader } = requireMigrationsLoader();
  class FsMigrations extends AbstractMigrationsLoader {
    /**
     * Gets the migration names
     * @returns Promise<string[]>
     */
    getMigrations(loadExtensions) {
      const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
        const absoluteDir = path.resolve(process.cwd(), configDir);
        return readdir(absoluteDir).then((files) => ({
          files,
          configDir,
          absoluteDir
        }));
      });
      return Promise.all(readMigrationsPromises).then((allMigrations) => {
        const migrations = allMigrations.reduce((acc, migrationDirectory) => {
          if (this.sortDirsSeparately) {
            migrationDirectory.files = migrationDirectory.files.sort();
          }
          migrationDirectory.files.forEach(
            (file) => acc.push({ file, directory: migrationDirectory.configDir })
          );
          return acc;
        }, []);
        if (this.sortDirsSeparately) {
          return filterMigrations(
            this,
            migrations,
            loadExtensions || this.loadExtensions
          );
        }
        return filterMigrations(
          this,
          sortBy(migrations, "file"),
          loadExtensions || this.loadExtensions
        );
      });
    }
    getMigrationName(migration) {
      return migration.file;
    }
    getMigration(migrationInfo) {
      return this.getFile(migrationInfo);
    }
  }
  function filterMigrations(migrationSource, migrations, loadExtensions) {
    return migrations.filter((migration) => {
      const migrationName = migrationSource.getMigrationName(migration);
      const extension = path.extname(migrationName);
      return loadExtensions.includes(extension);
    });
  }
  fsMigrations = {
    FsMigrations
  };
  return fsMigrations;
}
var colorette = {};
var hasRequiredColorette;
function requireColorette() {
  if (hasRequiredColorette) return colorette;
  hasRequiredColorette = 1;
  Object.defineProperty(colorette, "__esModule", { value: true });
  var tty = require$$0$1;
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = /* @__PURE__ */ Object.create(null);
    if (e) {
      Object.keys(e).forEach(function(k) {
        if (k !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k];
            }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }
  var tty__namespace = /* @__PURE__ */ _interopNamespace(tty);
  const {
    env = {},
    argv = [],
    platform = ""
  } = typeof process === "undefined" ? {} : process;
  const isDisabled = "NO_COLOR" in env || argv.includes("--no-color");
  const isForced = "FORCE_COLOR" in env || argv.includes("--color");
  const isWindows = platform === "win32";
  const isDumbTerminal = env.TERM === "dumb";
  const isCompatibleTerminal = tty__namespace && tty__namespace.isatty && tty__namespace.isatty(1) && env.TERM && !isDumbTerminal;
  const isCI = "CI" in env && ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);
  const isColorSupported = !isDisabled && (isForced || isWindows && !isDumbTerminal || isCompatibleTerminal || isCI);
  const replaceClose = (index, string2, close, replace, head = string2.substring(0, index) + replace, tail = string2.substring(index + close.length), next = tail.indexOf(close)) => head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
  const clearBleed = (index, string2, open, close, replace) => index < 0 ? open + string2 + close : open + replaceClose(index, string2, close, replace) + close;
  const filterEmpty = (open, close, replace = open, at = open.length + 1) => (string2) => string2 || !(string2 === "" || string2 === void 0) ? clearBleed(
    ("" + string2).indexOf(close, at),
    string2,
    open,
    close,
    replace
  ) : "";
  const init = (open, close, replace) => filterEmpty(`\x1B[${open}m`, `\x1B[${close}m`, replace);
  const colors = {
    reset: init(0, 0),
    bold: init(1, 22, "\x1B[22m\x1B[1m"),
    dim: init(2, 22, "\x1B[22m\x1B[2m"),
    italic: init(3, 23),
    underline: init(4, 24),
    inverse: init(7, 27),
    hidden: init(8, 28),
    strikethrough: init(9, 29),
    black: init(30, 39),
    red: init(31, 39),
    green: init(32, 39),
    yellow: init(33, 39),
    blue: init(34, 39),
    magenta: init(35, 39),
    cyan: init(36, 39),
    white: init(37, 39),
    gray: init(90, 39),
    bgBlack: init(40, 49),
    bgRed: init(41, 49),
    bgGreen: init(42, 49),
    bgYellow: init(43, 49),
    bgBlue: init(44, 49),
    bgMagenta: init(45, 49),
    bgCyan: init(46, 49),
    bgWhite: init(47, 49),
    blackBright: init(90, 39),
    redBright: init(91, 39),
    greenBright: init(92, 39),
    yellowBright: init(93, 39),
    blueBright: init(94, 39),
    magentaBright: init(95, 39),
    cyanBright: init(96, 39),
    whiteBright: init(97, 39),
    bgBlackBright: init(100, 49),
    bgRedBright: init(101, 49),
    bgGreenBright: init(102, 49),
    bgYellowBright: init(103, 49),
    bgBlueBright: init(104, 49),
    bgMagentaBright: init(105, 49),
    bgCyanBright: init(106, 49),
    bgWhiteBright: init(107, 49)
  };
  const createColors = ({ useColor = isColorSupported } = {}) => useColor ? colors : Object.keys(colors).reduce(
    (colors2, key) => ({ ...colors2, [key]: String }),
    {}
  );
  const {
    reset,
    bold,
    dim,
    italic,
    underline,
    inverse,
    hidden,
    strikethrough,
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    gray,
    bgBlack,
    bgRed,
    bgGreen,
    bgYellow,
    bgBlue,
    bgMagenta,
    bgCyan,
    bgWhite,
    blackBright,
    redBright,
    greenBright,
    yellowBright,
    blueBright,
    magentaBright,
    cyanBright,
    whiteBright,
    bgBlackBright,
    bgRedBright,
    bgGreenBright,
    bgYellowBright,
    bgBlueBright,
    bgMagentaBright,
    bgCyanBright,
    bgWhiteBright
  } = createColors();
  colorette.bgBlack = bgBlack;
  colorette.bgBlackBright = bgBlackBright;
  colorette.bgBlue = bgBlue;
  colorette.bgBlueBright = bgBlueBright;
  colorette.bgCyan = bgCyan;
  colorette.bgCyanBright = bgCyanBright;
  colorette.bgGreen = bgGreen;
  colorette.bgGreenBright = bgGreenBright;
  colorette.bgMagenta = bgMagenta;
  colorette.bgMagentaBright = bgMagentaBright;
  colorette.bgRed = bgRed;
  colorette.bgRedBright = bgRedBright;
  colorette.bgWhite = bgWhite;
  colorette.bgWhiteBright = bgWhiteBright;
  colorette.bgYellow = bgYellow;
  colorette.bgYellowBright = bgYellowBright;
  colorette.black = black;
  colorette.blackBright = blackBright;
  colorette.blue = blue;
  colorette.blueBright = blueBright;
  colorette.bold = bold;
  colorette.createColors = createColors;
  colorette.cyan = cyan;
  colorette.cyanBright = cyanBright;
  colorette.dim = dim;
  colorette.gray = gray;
  colorette.green = green;
  colorette.greenBright = greenBright;
  colorette.hidden = hidden;
  colorette.inverse = inverse;
  colorette.isColorSupported = isColorSupported;
  colorette.italic = italic;
  colorette.magenta = magenta;
  colorette.magentaBright = magentaBright;
  colorette.red = red;
  colorette.redBright = redBright;
  colorette.reset = reset;
  colorette.strikethrough = strikethrough;
  colorette.underline = underline;
  colorette.white = white;
  colorette.whiteBright = whiteBright;
  colorette.yellow = yellow;
  colorette.yellowBright = yellowBright;
  return colorette;
}
var is;
var hasRequiredIs;
function requireIs() {
  if (hasRequiredIs) return is;
  hasRequiredIs = 1;
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  function isUndefined(value) {
    return typeof value === "undefined";
  }
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  is = {
    isString,
    isNumber,
    isBoolean,
    isUndefined,
    isObject,
    isFunction
  };
  return is;
}
var logger;
var hasRequiredLogger;
function requireLogger() {
  if (hasRequiredLogger) return logger;
  hasRequiredLogger = 1;
  const color = requireColorette();
  const { inspect } = require$$2$1;
  const { isString, isFunction } = requireIs();
  class Logger {
    constructor(config = {}) {
      const {
        log: {
          debug,
          warn,
          error,
          deprecate,
          inspectionDepth,
          enableColors
        } = {}
      } = config;
      this._inspectionDepth = inspectionDepth || 5;
      this._enableColors = resolveIsEnabledColors(enableColors);
      this._debug = debug;
      this._warn = warn;
      this._error = error;
      this._deprecate = deprecate;
    }
    _log(message, userFn, colorFn) {
      if (userFn != null && !isFunction(userFn)) {
        throw new TypeError("Extensions to knex logger must be functions!");
      }
      if (isFunction(userFn)) {
        userFn(message);
        return;
      }
      if (!isString(message)) {
        message = inspect(message, {
          depth: this._inspectionDepth,
          colors: this._enableColors
        });
      }
      console.log(colorFn ? colorFn(message) : message);
    }
    debug(message) {
      this._log(message, this._debug);
    }
    warn(message) {
      this._log(message, this._warn, color.yellow);
    }
    error(message) {
      this._log(message, this._error, color.red);
    }
    deprecate(method, alternative) {
      const message = `${method} is deprecated, please use ${alternative}`;
      this._log(message, this._deprecate, color.yellow);
    }
  }
  function resolveIsEnabledColors(enableColorsParam) {
    if (enableColorsParam != null) {
      return enableColorsParam;
    }
    if (process && process.stdout) {
      return process.stdout.isTTY;
    }
    return false;
  }
  logger = Logger;
  return logger;
}
var migratorConfigurationMerger;
var hasRequiredMigratorConfigurationMerger;
function requireMigratorConfigurationMerger() {
  if (hasRequiredMigratorConfigurationMerger) return migratorConfigurationMerger;
  hasRequiredMigratorConfigurationMerger = 1;
  const { FsMigrations } = requireFsMigrations();
  const Logger = requireLogger();
  const { DEFAULT_LOAD_EXTENSIONS } = requireMigrationsLoader();
  const defaultLogger = new Logger();
  const CONFIG_DEFAULT = Object.freeze({
    extension: "js",
    loadExtensions: DEFAULT_LOAD_EXTENSIONS,
    tableName: "knex_migrations",
    schemaName: null,
    directory: "./migrations",
    disableTransactions: false,
    disableMigrationsListValidation: false,
    sortDirsSeparately: false
  });
  function getMergedConfig(config, currentConfig, logger2 = defaultLogger) {
    const mergedConfig = Object.assign(
      {},
      CONFIG_DEFAULT,
      currentConfig || {},
      config
    );
    if (config && // If user specifies any FS related config,
    // clear specified migrationSource to avoid ambiguity
    (config.directory || config.sortDirsSeparately !== void 0 || config.loadExtensions)) {
      if (config.migrationSource) {
        logger2.warn(
          "FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations"
        );
      }
      mergedConfig.migrationSource = null;
    }
    if (!mergedConfig.migrationSource) {
      mergedConfig.migrationSource = new FsMigrations(
        mergedConfig.directory,
        mergedConfig.sortDirsSeparately,
        mergedConfig.loadExtensions
      );
    }
    return mergedConfig;
  }
  migratorConfigurationMerger = {
    getMergedConfig
  };
  return migratorConfigurationMerger;
}
var timestamp;
var hasRequiredTimestamp;
function requireTimestamp() {
  if (hasRequiredTimestamp) return timestamp;
  hasRequiredTimestamp = 1;
  function yyyymmddhhmmss() {
    const now = /* @__PURE__ */ new Date();
    return now.getUTCFullYear().toString() + (now.getUTCMonth() + 1).toString().padStart(2, "0") + now.getUTCDate().toString().padStart(2, "0") + now.getUTCHours().toString().padStart(2, "0") + now.getUTCMinutes().toString().padStart(2, "0") + now.getUTCSeconds().toString().padStart(2, "0");
  }
  timestamp = { yyyymmddhhmmss };
  return timestamp;
}
var MigrationGenerator_1;
var hasRequiredMigrationGenerator;
function requireMigrationGenerator() {
  if (hasRequiredMigrationGenerator) return MigrationGenerator_1;
  hasRequiredMigrationGenerator = 1;
  const path = require$$0$4;
  const { writeJsFileUsingTemplate } = requireTemplate();
  const { getMergedConfig } = requireMigratorConfigurationMerger();
  const { ensureDirectoryExists } = requireFs();
  const { yyyymmddhhmmss } = requireTimestamp();
  class MigrationGenerator {
    constructor(migrationConfig, logger2) {
      this.config = getMergedConfig(migrationConfig, void 0, logger2);
    }
    // Creates a new migration, with a given name.
    async make(name, config, logger2) {
      this.config = getMergedConfig(config, this.config, logger2);
      if (!name) {
        return Promise.reject(
          new Error("A name must be specified for the generated migration")
        );
      }
      await this._ensureFolder();
      const createdMigrationFilePath = await this._writeNewMigration(name);
      return createdMigrationFilePath;
    }
    // Ensures a folder for the migrations exist, dependent on the migration
    // config settings.
    _ensureFolder() {
      const dirs = this._absoluteConfigDirs();
      const promises = dirs.map(ensureDirectoryExists);
      return Promise.all(promises);
    }
    _getStubPath() {
      return this.config.stub || path.join(__dirname, "stub", this.config.extension + ".stub");
    }
    _getNewMigrationName(name) {
      if (name[0] === "-") name = name.slice(1);
      return yyyymmddhhmmss() + "_" + name + "." + this.config.extension.split("-")[0];
    }
    _getNewMigrationPath(name) {
      const fileName = this._getNewMigrationName(name);
      const dirs = this._absoluteConfigDirs();
      const dir = dirs.slice(-1)[0];
      return path.join(dir, fileName);
    }
    // Write a new migration to disk, using the config and generated filename,
    // passing any `variables` given in the config to the template.
    async _writeNewMigration(name) {
      const migrationPath = this._getNewMigrationPath(name);
      await writeJsFileUsingTemplate(
        migrationPath,
        this._getStubPath(),
        { variable: "d" },
        this.config.variables || {}
      );
      return migrationPath;
    }
    _absoluteConfigDirs() {
      const directories = Array.isArray(this.config.directory) ? this.config.directory : [this.config.directory];
      return directories.map((directory) => {
        if (!directory) {
          console.warn(
            "Failed to resolve config file, knex cannot determine where to generate migrations"
          );
        }
        return path.resolve(process.cwd(), directory);
      });
    }
  }
  MigrationGenerator_1 = MigrationGenerator;
  return MigrationGenerator_1;
}
var Migrator_1;
var hasRequiredMigrator;
function requireMigrator() {
  if (hasRequiredMigrator) return Migrator_1;
  hasRequiredMigrator = 1;
  const differenceWith = requireDifferenceWith();
  const get = requireGet();
  const isEmpty = requireIsEmpty();
  const max = requireMax();
  const {
    getLockTableName,
    getTable,
    getTableName
  } = requireTableResolver();
  const { getSchemaBuilder } = requireTableCreator();
  const migrationListResolver2 = requireMigrationListResolver();
  const MigrationGenerator = requireMigrationGenerator();
  const { getMergedConfig } = requireMigratorConfigurationMerger();
  const { isBoolean, isFunction } = requireIs();
  class LockError extends Error {
    constructor(msg) {
      super(msg);
      this.name = "MigrationLocked";
    }
  }
  class Migrator {
    constructor(knex2) {
      if (isFunction(knex2)) {
        if (!knex2.isTransaction) {
          this.knex = knex2.withUserParams({
            ...knex2.userParams
          });
        } else {
          this.knex = knex2;
        }
      } else {
        this.knex = Object.assign({}, knex2);
        this.knex.userParams = this.knex.userParams || {};
      }
      this.config = getMergedConfig(
        this.knex.client.config.migrations,
        void 0,
        this.knex.client.logger
      );
      this.generator = new MigrationGenerator(
        this.knex.client.config.migrations,
        this.knex.client.logger
      );
      this._activeMigration = {
        fileName: null
      };
    }
    // Migrators to the latest configuration.
    async latest(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      const allAndCompleted = await migrationListResolver2.listAllAndCompleted(
        this.config,
        this.knex
      );
      if (!this.config.disableMigrationsListValidation) {
        validateMigrationList(this.config.migrationSource, allAndCompleted);
      }
      const [all, completed] = allAndCompleted;
      const migrations = getNewMigrations(
        this.config.migrationSource,
        all,
        completed
      );
      const transactionForAll = !this.config.disableTransactions && !(await Promise.all(
        migrations.map(async (migration) => {
          const migrationContents = await this.config.migrationSource.getMigration(migration);
          return !this._useTransaction(migrationContents);
        })
      )).some((isTransactionUsed) => isTransactionUsed);
      if (transactionForAll) {
        return this.knex.transaction((trx) => {
          return this._runBatch(migrations, "up", trx);
        });
      } else {
        return this._runBatch(migrations, "up");
      }
    }
    // Runs the next migration that has not yet been run
    async up(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      const allAndCompleted = await migrationListResolver2.listAllAndCompleted(
        this.config,
        this.knex
      );
      if (!this.config.disableMigrationsListValidation) {
        validateMigrationList(this.config.migrationSource, allAndCompleted);
      }
      const [all, completed] = allAndCompleted;
      const newMigrations = getNewMigrations(
        this.config.migrationSource,
        all,
        completed
      );
      let migrationToRun;
      const name = this.config.name;
      if (name) {
        if (!completed.includes(name)) {
          migrationToRun = newMigrations.find((migration) => {
            return this.config.migrationSource.getMigrationName(migration) === name;
          });
          if (!migrationToRun) {
            throw new Error(`Migration "${name}" not found.`);
          }
        }
      } else {
        migrationToRun = newMigrations[0];
      }
      const useTransaction = !migrationToRun || this._useTransaction(
        await this.config.migrationSource.getMigration(migrationToRun)
      );
      const migrationsToRun = [];
      if (migrationToRun) {
        migrationsToRun.push(migrationToRun);
      }
      const transactionForAll = !this.config.disableTransactions && (!migrationToRun || useTransaction);
      if (transactionForAll) {
        return await this.knex.transaction((trx) => {
          return this._runBatch(migrationsToRun, "up", trx);
        });
      } else {
        return await this._runBatch(migrationsToRun, "up");
      }
    }
    // Rollback the last "batch", or all, of migrations that were run.
    rollback(config, all = false) {
      this._disableProcessing();
      return new Promise((resolve, reject) => {
        try {
          this.config = getMergedConfig(
            config,
            this.config,
            this.knex.client.logger
          );
        } catch (e) {
          reject(e);
        }
        migrationListResolver2.listAllAndCompleted(this.config, this.knex).then((value) => {
          if (!this.config.disableMigrationsListValidation) {
            validateMigrationList(this.config.migrationSource, value);
          }
          return value;
        }).then((val) => {
          const [allMigrations, completedMigrations] = val;
          return all ? allMigrations.filter((migration) => {
            return completedMigrations.map((migration2) => migration2.name).includes(
              this.config.migrationSource.getMigrationName(migration)
            );
          }).reverse() : this._getLastBatch(val);
        }).then((migrations) => {
          return this._runBatch(migrations, "down");
        }).then(resolve, reject);
      });
    }
    down(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      return migrationListResolver2.listAllAndCompleted(this.config, this.knex).then((value) => {
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, value);
        }
        return value;
      }).then(([all, completed]) => {
        const completedMigrations = all.filter((migration) => {
          return completed.map((migration2) => migration2.name).includes(this.config.migrationSource.getMigrationName(migration));
        });
        let migrationToRun;
        const name = this.config.name;
        if (name) {
          migrationToRun = completedMigrations.find((migration) => {
            return this.config.migrationSource.getMigrationName(migration) === name;
          });
          if (!migrationToRun) {
            throw new Error(`Migration "${name}" was not run.`);
          }
        } else {
          migrationToRun = completedMigrations[completedMigrations.length - 1];
        }
        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }
        return this._runBatch(migrationsToRun, "down");
      });
    }
    status(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      return Promise.all([
        getTable(this.knex, this.config.tableName, this.config.schemaName).select(
          "*"
        ),
        migrationListResolver2.listAll(this.config.migrationSource)
      ]).then(([db2, code]) => db2.length - code.length);
    }
    // Retrieves and returns the current migration version we're on, as a promise.
    // If no migrations have been run yet, return "none".
    currentVersion(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      return migrationListResolver2.listCompleted(this.config.tableName, this.config.schemaName, this.knex).then((completed) => {
        const val = max(completed.map((value) => value.name.split("_")[0]));
        return val === void 0 ? "none" : val;
      });
    }
    // list all migrations
    async list(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      const [all, completed] = await migrationListResolver2.listAllAndCompleted(
        this.config,
        this.knex
      );
      if (!this.config.disableMigrationsListValidation) {
        validateMigrationList(this.config.migrationSource, [all, completed]);
      }
      const newMigrations = getNewMigrations(
        this.config.migrationSource,
        all,
        completed
      );
      return [completed, newMigrations];
    }
    async forceFreeMigrationsLock(config) {
      this._disableProcessing();
      this.config = getMergedConfig(config, this.config, this.knex.client.logger);
      const { schemaName, tableName } = this.config;
      const lockTableName = getLockTableName(tableName);
      const { knex: knex2 } = this;
      const getLockTable = () => getTable(knex2, lockTableName, schemaName);
      const tableExists = await getSchemaBuilder(knex2, schemaName).hasTable(
        lockTableName
      );
      if (tableExists) {
        await getLockTable().del();
        await getLockTable().insert({
          is_locked: 0
        });
      }
    }
    // Creates a new migration, with a given name.
    make(name, config) {
      return this.generator.make(name, config, this.knex.client.logger);
    }
    _disableProcessing() {
      if (this.knex.disableProcessing) {
        this.knex.disableProcessing();
      }
    }
    _lockMigrations(trx) {
      const tableName = getLockTableName(this.config.tableName);
      return getTable(this.knex, tableName, this.config.schemaName).transacting(trx).where("is_locked", "=", 0).update({ is_locked: 1 }).then((rowCount) => {
        if (rowCount !== 1) {
          throw new Error("Migration table is already locked");
        }
      });
    }
    _getLock(trx) {
      const transact = trx ? (fn) => fn(trx) : (fn) => this.knex.transaction(fn);
      return transact((trx2) => {
        return this._lockMigrations(trx2);
      }).catch((err) => {
        throw new LockError(err.message);
      });
    }
    _freeLock(trx = this.knex) {
      const tableName = getLockTableName(this.config.tableName);
      return getTable(trx, tableName, this.config.schemaName).update({
        is_locked: 0
      });
    }
    // Run a batch of current migrations, in sequence.
    async _runBatch(migrations, direction, trx) {
      const canGetLockInTransaction = this.knex.client.driverName !== "cockroachdb";
      try {
        await this._getLock(canGetLockInTransaction ? trx : void 0);
        const completed = trx ? await migrationListResolver2.listCompleted(
          this.config.tableName,
          this.config.schemaName,
          trx
        ) : [];
        migrations = getNewMigrations(
          this.config.migrationSource,
          migrations,
          completed
        );
        await Promise.all(
          migrations.map(this._validateMigrationStructure.bind(this))
        );
        let batchNo = await this._latestBatchNumber(trx);
        if (direction === "up") batchNo++;
        const res = await this._waterfallBatch(
          batchNo,
          migrations,
          direction,
          trx
        );
        await this._freeLock(canGetLockInTransaction ? trx : void 0);
        return res;
      } catch (error) {
        let cleanupReady = Promise.resolve();
        if (error instanceof LockError) {
          this.knex.client.logger.warn(
            `Can't take lock to run migrations: ${error.message}`
          );
          this.knex.client.logger.warn(
            "If you are sure migrations are not running you can release the lock manually by running 'knex migrate:unlock'"
          );
        } else {
          if (this._activeMigration.fileName) {
            this.knex.client.logger.warn(
              `migration file "${this._activeMigration.fileName}" failed`
            );
          }
          this.knex.client.logger.warn(
            `migration failed with error: ${error.message}`
          );
          cleanupReady = this._freeLock(
            canGetLockInTransaction ? trx : void 0
          );
        }
        try {
          await cleanupReady;
        } catch (e) {
        }
        throw error;
      }
    }
    // Validates some migrations by requiring and checking for an `up` and `down`
    // function.
    async _validateMigrationStructure(migration) {
      const migrationName = this.config.migrationSource.getMigrationName(migration);
      const migrationContent = await this.config.migrationSource.getMigration(
        migration
      );
      if (typeof migrationContent.up !== "function" || typeof migrationContent.down !== "function") {
        throw new Error(
          `Invalid migration: ${migrationName} must have both an up and down function`
        );
      }
      return migration;
    }
    // Get the last batch of migrations, by name, ordered by insert id in reverse
    // order.
    async _getLastBatch([allMigrations]) {
      const { tableName, schemaName } = this.config;
      const migrationNames = await getTable(this.knex, tableName, schemaName).where("batch", function(qb) {
        qb.max("batch").from(getTableName(tableName, schemaName));
      }).orderBy("id", "desc");
      const lastBatchMigrations = migrationNames.map((migration) => {
        return allMigrations.find((entry) => {
          return this.config.migrationSource.getMigrationName(entry) === migration.name;
        });
      });
      return Promise.all(lastBatchMigrations);
    }
    // Returns the latest batch number.
    _latestBatchNumber(trx = this.knex) {
      return trx.from(getTableName(this.config.tableName, this.config.schemaName)).max("batch as max_batch").then((obj) => obj[0].max_batch || 0);
    }
    // If transaction config for a single migration is defined, use that.
    // Otherwise, rely on the common config. This allows enabling/disabling
    // transaction for a single migration at will, regardless of the common
    // config.
    _useTransaction(migrationContent, allTransactionsDisabled) {
      const singleTransactionValue = get(migrationContent, "config.transaction");
      return isBoolean(singleTransactionValue) ? singleTransactionValue : !allTransactionsDisabled;
    }
    // Runs a batch of `migrations` in a specified `direction`, saving the
    // appropriate database information as the migrations are run.
    _waterfallBatch(batchNo, migrations, direction, trx) {
      const trxOrKnex = trx || this.knex;
      const { tableName, schemaName, disableTransactions } = this.config;
      let current = Promise.resolve();
      const log = [];
      migrations.forEach((migration) => {
        const name = this.config.migrationSource.getMigrationName(migration);
        this._activeMigration.fileName = name;
        const migrationContent = this.config.migrationSource.getMigration(migration);
        current = current.then(async () => await migrationContent).then((migrationContent2) => {
          this._activeMigration.fileName = name;
          if (!trx && this._useTransaction(migrationContent2, disableTransactions)) {
            this.knex.enableProcessing();
            return this._transaction(
              this.knex,
              migrationContent2,
              direction,
              name
            );
          }
          trxOrKnex.enableProcessing();
          return checkPromise(
            this.knex.client.logger,
            migrationContent2[direction](trxOrKnex),
            name
          );
        }).then(() => {
          trxOrKnex.disableProcessing();
          this.knex.disableProcessing();
          log.push(name);
          if (direction === "up") {
            return trxOrKnex.into(getTableName(tableName, schemaName)).insert({
              name,
              batch: batchNo,
              migration_time: /* @__PURE__ */ new Date()
            });
          }
          if (direction === "down") {
            return trxOrKnex.from(getTableName(tableName, schemaName)).where({ name }).del();
          }
        });
      });
      return current.then(() => [batchNo, log]);
    }
    _transaction(knex2, migrationContent, direction, name) {
      return knex2.transaction((trx) => {
        return checkPromise(
          knex2.client.logger,
          migrationContent[direction](trx),
          name,
          () => {
            trx.commit();
          }
        );
      });
    }
  }
  function validateMigrationList(migrationSource, migrations) {
    const [all, completed] = migrations;
    const diff = getMissingMigrations(migrationSource, completed, all);
    if (!isEmpty(diff)) {
      const names = diff.map((d) => d.name);
      throw new Error(
        `The migration directory is corrupt, the following files are missing: ${names.join(
          ", "
        )}`
      );
    }
  }
  function getMissingMigrations(migrationSource, completed, all) {
    return differenceWith(completed, all, (c, a) => {
      return c.name === migrationSource.getMigrationName(a);
    });
  }
  function getNewMigrations(migrationSource, all, completed) {
    return differenceWith(all, completed, (a, c) => {
      return c.name === migrationSource.getMigrationName(a);
    });
  }
  function checkPromise(logger2, migrationPromise, name, commitFn) {
    if (!migrationPromise || typeof migrationPromise.then !== "function") {
      logger2.warn(`migration ${name} did not return a promise`);
      if (commitFn) {
        commitFn();
      }
    }
    return migrationPromise;
  }
  Migrator_1 = {
    Migrator
  };
  return Migrator_1;
}
var isString_1;
var hasRequiredIsString;
function requireIsString() {
  if (hasRequiredIsString) return isString_1;
  hasRequiredIsString = 1;
  var baseGetTag = require_baseGetTag(), isArray = requireIsArray(), isObjectLike = requireIsObjectLike();
  var stringTag = "[object String]";
  function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
  }
  isString_1 = isString;
  return isString_1;
}
var _trimmedEndIndex;
var hasRequired_trimmedEndIndex;
function require_trimmedEndIndex() {
  if (hasRequired_trimmedEndIndex) return _trimmedEndIndex;
  hasRequired_trimmedEndIndex = 1;
  var reWhitespace = /\s/;
  function trimmedEndIndex(string2) {
    var index = string2.length;
    while (index-- && reWhitespace.test(string2.charAt(index))) {
    }
    return index;
  }
  _trimmedEndIndex = trimmedEndIndex;
  return _trimmedEndIndex;
}
var _baseTrim;
var hasRequired_baseTrim;
function require_baseTrim() {
  if (hasRequired_baseTrim) return _baseTrim;
  hasRequired_baseTrim = 1;
  var trimmedEndIndex = require_trimmedEndIndex();
  var reTrimStart = /^\s+/;
  function baseTrim(string2) {
    return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
  }
  _baseTrim = baseTrim;
  return _baseTrim;
}
var toNumber_1;
var hasRequiredToNumber;
function requireToNumber() {
  if (hasRequiredToNumber) return toNumber_1;
  hasRequiredToNumber = 1;
  var baseTrim = require_baseTrim(), isObject = requireIsObject(), isSymbol = requireIsSymbol();
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  toNumber_1 = toNumber;
  return toNumber_1;
}
var toFinite_1;
var hasRequiredToFinite;
function requireToFinite() {
  if (hasRequiredToFinite) return toFinite_1;
  hasRequiredToFinite = 1;
  var toNumber = requireToNumber();
  var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  toFinite_1 = toFinite;
  return toFinite_1;
}
var toInteger_1;
var hasRequiredToInteger;
function requireToInteger() {
  if (hasRequiredToInteger) return toInteger_1;
  hasRequiredToInteger = 1;
  var toFinite = requireToFinite();
  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  toInteger_1 = toInteger;
  return toInteger_1;
}
var values_1;
var hasRequiredValues;
function requireValues() {
  if (hasRequiredValues) return values_1;
  hasRequiredValues = 1;
  var baseValues = require_baseValues(), keys = requireKeys();
  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }
  values_1 = values;
  return values_1;
}
var includes_1;
var hasRequiredIncludes;
function requireIncludes() {
  if (hasRequiredIncludes) return includes_1;
  hasRequiredIncludes = 1;
  var baseIndexOf = require_baseIndexOf(), isArrayLike = requireIsArrayLike(), isString = requireIsString(), toInteger = requireToInteger(), values = requireValues();
  var nativeMax = Math.max;
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
  }
  includes_1 = includes;
  return includes_1;
}
var fsSeeds;
var hasRequiredFsSeeds;
function requireFsSeeds() {
  if (hasRequiredFsSeeds) return fsSeeds;
  hasRequiredFsSeeds = 1;
  const path = require$$0$4;
  const flatten = requireFlatten();
  const includes = requireIncludes();
  const { AbstractMigrationsLoader } = requireMigrationsLoader();
  const { getFilepathsInFolder } = requireFs();
  const filterByLoadExtensions = (extensions) => (value) => {
    const extension = path.extname(value);
    return includes(extensions, extension);
  };
  class FsSeeds extends AbstractMigrationsLoader {
    _getConfigDirectories(logger2) {
      const directories = this.migrationsPaths;
      return directories.map((directory) => {
        if (!directory) {
          logger2.warn(
            "Empty value passed as a directory for Seeder, this is not supported."
          );
        }
        return path.resolve(process.cwd(), directory);
      });
    }
    async getSeeds(config) {
      const { loadExtensions, recursive, specific } = config;
      const seeds = flatten(
        await Promise.all(
          this._getConfigDirectories(config.logger).map(
            (d) => getFilepathsInFolder(d, recursive)
          )
        )
      );
      let files = seeds.filter(filterByLoadExtensions(loadExtensions));
      if (!this.sortDirsSeparately) {
        files.sort();
      }
      if (specific) {
        files = files.filter((file) => path.basename(file) === specific);
        if (files.length === 0) {
          throw new Error(
            `Invalid argument provided: the specific seed "${specific}" does not exist.`
          );
        }
      }
      return files;
    }
    async getSeed(filepath) {
      const importFile2 = requireImportFile();
      const seed = await importFile2(filepath);
      return seed;
    }
  }
  fsSeeds = {
    FsSeeds
  };
  return fsSeeds;
}
var seederConfigurationMerger;
var hasRequiredSeederConfigurationMerger;
function requireSeederConfigurationMerger() {
  if (hasRequiredSeederConfigurationMerger) return seederConfigurationMerger;
  hasRequiredSeederConfigurationMerger = 1;
  const { FsSeeds } = requireFsSeeds();
  const Logger = requireLogger();
  const { DEFAULT_LOAD_EXTENSIONS } = requireMigrationsLoader();
  const defaultLogger = new Logger();
  const CONFIG_DEFAULT = Object.freeze({
    extension: "js",
    directory: "./seeds",
    loadExtensions: DEFAULT_LOAD_EXTENSIONS,
    specific: null,
    timestampFilenamePrefix: false,
    recursive: false,
    sortDirsSeparately: false
  });
  function getMergedConfig(config, currentConfig, logger2 = defaultLogger) {
    const mergedConfig = Object.assign(
      {},
      CONFIG_DEFAULT,
      currentConfig || {},
      config,
      {
        logger: logger2
      }
    );
    if (config && // If user specifies any FS related config,
    // clear specified migrationSource to avoid ambiguity
    (config.directory || config.sortDirsSeparately !== void 0 || config.loadExtensions)) {
      if (config.seedSource) {
        logger2.warn(
          "FS-related option specified for seed configuration. This resets seedSource to default FsMigrations"
        );
      }
      mergedConfig.seedSource = null;
    }
    if (!mergedConfig.seedSource) {
      mergedConfig.seedSource = new FsSeeds(
        mergedConfig.directory,
        mergedConfig.sortDirsSeparately,
        mergedConfig.loadExtensions
      );
    }
    return mergedConfig;
  }
  seederConfigurationMerger = {
    getMergedConfig
  };
  return seederConfigurationMerger;
}
var Seeder_1;
var hasRequiredSeeder;
function requireSeeder() {
  if (hasRequiredSeeder) return Seeder_1;
  hasRequiredSeeder = 1;
  const path = require$$0$4;
  const { ensureDirectoryExists } = requireFs();
  const { writeJsFileUsingTemplate } = requireTemplate();
  const { yyyymmddhhmmss } = requireTimestamp();
  const { getMergedConfig } = requireSeederConfigurationMerger();
  class Seeder {
    constructor(knex2) {
      this.knex = knex2;
      this.config = this.resolveConfig(knex2.client.config.seeds);
    }
    // Runs seed files for the given environment.
    async run(config) {
      this.config = this.resolveConfig(config);
      const files = await this.config.seedSource.getSeeds(this.config);
      return this._runSeeds(files);
    }
    // Creates a new seed file, with a given name.
    async make(name, config) {
      this.config = this.resolveConfig(config);
      if (!name)
        throw new Error("A name must be specified for the generated seed");
      await this._ensureFolder(config);
      const seedPath = await this._writeNewSeed(name);
      return seedPath;
    }
    // Ensures a folder for the seeds exist, dependent on the
    // seed config settings.
    _ensureFolder() {
      const dirs = this.config.seedSource._getConfigDirectories(
        this.config.logger
      );
      const promises = dirs.map(ensureDirectoryExists);
      return Promise.all(promises);
    }
    // Run seed files, in sequence.
    async _runSeeds(seeds) {
      for (const seed of seeds) {
        await this._validateSeedStructure(seed);
      }
      return this._waterfallBatch(seeds);
    }
    async _validateSeedStructure(filepath) {
      const seed = await this.config.seedSource.getSeed(filepath);
      if (typeof seed.seed !== "function") {
        throw new Error(
          `Invalid seed file: ${filepath} must have a seed function`
        );
      }
      return filepath;
    }
    _getStubPath() {
      return this.config.stub || path.join(__dirname, "stub", this.config.extension + ".stub");
    }
    _getNewStubFileName(name) {
      if (name[0] === "-") name = name.slice(1);
      if (this.config.timestampFilenamePrefix === true) {
        name = `${yyyymmddhhmmss()}_${name}`;
      }
      return `${name}.${this.config.extension}`;
    }
    _getNewStubFilePath(name) {
      const fileName = this._getNewStubFileName(name);
      const dirs = this.config.seedSource._getConfigDirectories(
        this.config.logger
      );
      const dir = dirs.slice(-1)[0];
      return path.join(dir, fileName);
    }
    // Write a new seed to disk, using the config and generated filename,
    // passing any `variables` given in the config to the template.
    async _writeNewSeed(name) {
      const seedPath = this._getNewStubFilePath(name);
      await writeJsFileUsingTemplate(
        seedPath,
        this._getStubPath(),
        { variable: "d" },
        this.config.variables || {}
      );
      return seedPath;
    }
    async _listAll(config) {
      this.config = this.resolveConfig(config);
      return this.config.seedSource.getSeeds(this.config);
    }
    // Runs a batch of seed files.
    async _waterfallBatch(seeds) {
      const { knex: knex2 } = this;
      const log = [];
      for (const seedPath of seeds) {
        const seed = await this.config.seedSource.getSeed(seedPath);
        try {
          await seed.seed(knex2);
          log.push(seedPath);
        } catch (originalError) {
          const error = new Error(
            `Error while executing "${seedPath}" seed: ${originalError.message}`
          );
          error.original = originalError;
          error.stack = error.stack.split("\n").slice(0, 2).join("\n") + "\n" + originalError.stack;
          throw error;
        }
      }
      return [log];
    }
    resolveConfig(config) {
      return getMergedConfig(config, this.config, this.knex.client.logger);
    }
  }
  Seeder_1 = Seeder;
  return Seeder_1;
}
var FunctionHelper_1;
var hasRequiredFunctionHelper;
function requireFunctionHelper() {
  if (hasRequiredFunctionHelper) return FunctionHelper_1;
  hasRequiredFunctionHelper = 1;
  class FunctionHelper {
    constructor(client2) {
      this.client = client2;
    }
    now(precision) {
      if (typeof precision === "number") {
        return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
      }
      return this.client.raw("CURRENT_TIMESTAMP");
    }
    uuid() {
      switch (this.client.driverName) {
        case "sqlite3":
        case "better-sqlite3":
          return this.client.raw(
            "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"
          );
        case "mssql":
          return this.client.raw("(NEWID())");
        case "pg":
        case "pgnative":
        case "cockroachdb":
          return this.client.raw("(gen_random_uuid())");
        case "oracle":
        case "oracledb":
          return this.client.raw("(random_uuid())");
        case "mysql":
        case "mysql2":
          return this.client.raw("(UUID())");
        default:
          throw new Error(
            `${this.client.driverName} does not have a uuid function`
          );
      }
    }
    uuidToBin(uuid, ordered = true) {
      const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
      return ordered ? Buffer.concat([
        buf.slice(6, 8),
        buf.slice(4, 6),
        buf.slice(0, 4),
        buf.slice(8, 16)
      ]) : Buffer.concat([
        buf.slice(0, 4),
        buf.slice(4, 6),
        buf.slice(6, 8),
        buf.slice(8, 16)
      ]);
    }
    binToUuid(bin, ordered = true) {
      const buf = Buffer.from(bin, "hex");
      return ordered ? [
        buf.toString("hex", 4, 8),
        buf.toString("hex", 2, 4),
        buf.toString("hex", 0, 2),
        buf.toString("hex", 8, 10),
        buf.toString("hex", 10, 16)
      ].join("-") : [
        buf.toString("hex", 0, 4),
        buf.toString("hex", 4, 6),
        buf.toString("hex", 6, 8),
        buf.toString("hex", 8, 10),
        buf.toString("hex", 10, 16)
      ].join("-");
    }
  }
  FunctionHelper_1 = FunctionHelper;
  return FunctionHelper_1;
}
var methodConstants;
var hasRequiredMethodConstants;
function requireMethodConstants() {
  if (hasRequiredMethodConstants) return methodConstants;
  hasRequiredMethodConstants = 1;
  methodConstants = [
    "with",
    "withRecursive",
    "withMaterialized",
    "withNotMaterialized",
    "select",
    "as",
    "columns",
    "column",
    "from",
    "fromJS",
    "fromRaw",
    "into",
    "withSchema",
    "table",
    "distinct",
    "join",
    "joinRaw",
    "innerJoin",
    "leftJoin",
    "leftOuterJoin",
    "rightJoin",
    "rightOuterJoin",
    "outerJoin",
    "fullOuterJoin",
    "crossJoin",
    "where",
    "andWhere",
    "orWhere",
    "whereNot",
    "orWhereNot",
    "whereLike",
    "andWhereLike",
    "orWhereLike",
    "whereILike",
    "andWhereILike",
    "orWhereILike",
    "whereRaw",
    "whereWrapped",
    "havingWrapped",
    "orWhereRaw",
    "whereExists",
    "orWhereExists",
    "whereNotExists",
    "orWhereNotExists",
    "whereIn",
    "orWhereIn",
    "whereNotIn",
    "orWhereNotIn",
    "whereNull",
    "orWhereNull",
    "whereNotNull",
    "orWhereNotNull",
    "whereBetween",
    "whereNotBetween",
    "andWhereBetween",
    "andWhereNotBetween",
    "orWhereBetween",
    "orWhereNotBetween",
    "groupBy",
    "groupByRaw",
    "orderBy",
    "orderByRaw",
    "union",
    "unionAll",
    "intersect",
    "except",
    "having",
    "havingRaw",
    "orHaving",
    "orHavingRaw",
    "offset",
    "limit",
    "count",
    "countDistinct",
    "min",
    "max",
    "sum",
    "sumDistinct",
    "avg",
    "avgDistinct",
    "increment",
    "decrement",
    "first",
    "debug",
    "pluck",
    "clearSelect",
    "clearWhere",
    "clearGroup",
    "clearOrder",
    "clearHaving",
    "insert",
    "update",
    "returning",
    "del",
    "delete",
    "truncate",
    "transacting",
    "connection",
    // JSON methods
    // Json manipulation functions
    "jsonExtract",
    "jsonSet",
    "jsonInsert",
    "jsonRemove",
    // Wheres Json
    "whereJsonObject",
    "orWhereJsonObject",
    "andWhereJsonObject",
    "whereNotJsonObject",
    "orWhereNotJsonObject",
    "andWhereNotJsonObject",
    "whereJsonPath",
    "orWhereJsonPath",
    "andWhereJsonPath",
    "whereJsonSupersetOf",
    "orWhereJsonSupersetOf",
    "andWhereJsonSupersetOf",
    "whereJsonNotSupersetOf",
    "orWhereJsonNotSupersetOf",
    "andWhereJsonNotSupersetOf",
    "whereJsonSubsetOf",
    "orWhereJsonSubsetOf",
    "andWhereJsonSubsetOf",
    "whereJsonNotSubsetOf",
    "orWhereJsonNotSubsetOf",
    "andWhereJsonNotSubsetOf"
  ];
  return methodConstants;
}
var _assignMergeValue;
var hasRequired_assignMergeValue;
function require_assignMergeValue() {
  if (hasRequired_assignMergeValue) return _assignMergeValue;
  hasRequired_assignMergeValue = 1;
  var baseAssignValue = require_baseAssignValue(), eq = requireEq();
  function assignMergeValue(object, key, value) {
    if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  _assignMergeValue = assignMergeValue;
  return _assignMergeValue;
}
var _safeGet;
var hasRequired_safeGet;
function require_safeGet() {
  if (hasRequired_safeGet) return _safeGet;
  hasRequired_safeGet = 1;
  function safeGet(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  _safeGet = safeGet;
  return _safeGet;
}
var toPlainObject_1;
var hasRequiredToPlainObject;
function requireToPlainObject() {
  if (hasRequiredToPlainObject) return toPlainObject_1;
  hasRequiredToPlainObject = 1;
  var copyObject = require_copyObject(), keysIn = requireKeysIn();
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }
  toPlainObject_1 = toPlainObject;
  return toPlainObject_1;
}
var _baseMergeDeep;
var hasRequired_baseMergeDeep;
function require_baseMergeDeep() {
  if (hasRequired_baseMergeDeep) return _baseMergeDeep;
  hasRequired_baseMergeDeep = 1;
  var assignMergeValue = require_assignMergeValue(), cloneBuffer = require_cloneBuffer(), cloneTypedArray = require_cloneTypedArray(), copyArray = require_copyArray(), initCloneObject = require_initCloneObject(), isArguments = requireIsArguments(), isArray = requireIsArray(), isArrayLikeObject = requireIsArrayLikeObject(), isBuffer2 = requireIsBuffer(), isFunction = requireIsFunction(), isObject = requireIsObject(), isPlainObject = requireIsPlainObject(), isTypedArray = requireIsTypedArray(), safeGet = require_safeGet(), toPlainObject = requireToPlainObject();
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray(srcValue), isBuff = !isArr && isBuffer2(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }
  _baseMergeDeep = baseMergeDeep;
  return _baseMergeDeep;
}
var _baseMerge;
var hasRequired_baseMerge;
function require_baseMerge() {
  if (hasRequired_baseMerge) return _baseMerge;
  hasRequired_baseMerge = 1;
  var Stack = require_Stack(), assignMergeValue = require_assignMergeValue(), baseFor = require_baseFor(), baseMergeDeep = require_baseMergeDeep(), isObject = requireIsObject(), keysIn = requireKeysIn(), safeGet = require_safeGet();
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack());
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }
  _baseMerge = baseMerge;
  return _baseMerge;
}
var merge_1;
var hasRequiredMerge;
function requireMerge() {
  if (hasRequiredMerge) return merge_1;
  hasRequiredMerge = 1;
  var baseMerge = require_baseMerge(), createAssigner = require_createAssigner();
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  merge_1 = merge;
  return merge_1;
}
var _baseSlice;
var hasRequired_baseSlice;
function require_baseSlice() {
  if (hasRequired_baseSlice) return _baseSlice;
  hasRequired_baseSlice = 1;
  function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
  _baseSlice = baseSlice;
  return _baseSlice;
}
var chunk_1;
var hasRequiredChunk;
function requireChunk() {
  if (hasRequiredChunk) return chunk_1;
  hasRequiredChunk = 1;
  var baseSlice = require_baseSlice(), isIterateeCall = require_isIterateeCall(), toInteger = requireToInteger();
  var nativeCeil = Math.ceil, nativeMax = Math.max;
  function chunk(array, size, guard) {
    if (guard ? isIterateeCall(array, size, guard) : size === void 0) {
      size = 1;
    } else {
      size = nativeMax(toInteger(size), 0);
    }
    var length = array == null ? 0 : array.length;
    if (!length || size < 1) {
      return [];
    }
    var index = 0, resIndex = 0, result = Array(nativeCeil(length / size));
    while (index < length) {
      result[resIndex++] = baseSlice(array, index, index += size);
    }
    return result;
  }
  chunk_1 = chunk;
  return chunk_1;
}
var delay;
var hasRequiredDelay;
function requireDelay() {
  if (hasRequiredDelay) return delay;
  hasRequiredDelay = 1;
  delay = (delay2) => new Promise((resolve) => setTimeout(resolve, delay2));
  return delay;
}
var batchInsert_1;
var hasRequiredBatchInsert;
function requireBatchInsert() {
  if (hasRequiredBatchInsert) return batchInsert_1;
  hasRequiredBatchInsert = 1;
  const chunk = requireChunk();
  const flatten = requireFlatten();
  const delay2 = requireDelay();
  const { isNumber } = requireIs();
  function batchInsert(client2, tableName, batch, chunkSize = 1e3) {
    let returning = void 0;
    let transaction2 = null;
    if (!isNumber(chunkSize) || chunkSize < 1) {
      throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
    }
    if (!Array.isArray(batch)) {
      throw new TypeError(`Invalid batch: Expected array, got ${typeof batch}`);
    }
    const chunks = chunk(batch, chunkSize);
    const runInTransaction = (cb) => {
      if (transaction2) {
        return cb(transaction2);
      }
      return client2.transaction(cb);
    };
    return Object.assign(
      Promise.resolve().then(async () => {
        await delay2(1);
        return runInTransaction(async (tr) => {
          const chunksResults = [];
          for (const items of chunks) {
            chunksResults.push(await tr(tableName).insert(items, returning));
          }
          return flatten(chunksResults);
        });
      }),
      {
        returning(columns) {
          returning = columns;
          return this;
        },
        transacting(tr) {
          transaction2 = tr;
          return this;
        }
      }
    );
  }
  batchInsert_1 = batchInsert;
  return batchInsert_1;
}
var security;
var hasRequiredSecurity;
function requireSecurity() {
  if (hasRequiredSecurity) return security;
  hasRequiredSecurity = 1;
  function setHiddenProperty(target, source, propertyName = "password") {
    if (!source) {
      source = target;
    }
    Object.defineProperty(target, propertyName, {
      enumerable: false,
      value: source[propertyName]
    });
  }
  security = {
    setHiddenProperty
  };
  return security;
}
var makeKnex_1;
var hasRequiredMakeKnex;
function requireMakeKnex() {
  if (hasRequiredMakeKnex) return makeKnex_1;
  hasRequiredMakeKnex = 1;
  const { EventEmitter } = require$$0;
  const { Migrator } = requireMigrator();
  const Seeder = requireSeeder();
  const FunctionHelper = requireFunctionHelper();
  const QueryInterface = requireMethodConstants();
  const merge = requireMerge();
  const batchInsert = requireBatchInsert();
  const { isObject } = requireIs();
  const { setHiddenProperty } = requireSecurity();
  const KNEX_PROPERTY_DEFINITIONS = {
    client: {
      get() {
        return this.context.client;
      },
      set(client2) {
        this.context.client = client2;
      },
      configurable: true
    },
    userParams: {
      get() {
        return this.context.userParams;
      },
      set(userParams) {
        this.context.userParams = userParams;
      },
      configurable: true
    },
    schema: {
      get() {
        return this.client.schemaBuilder();
      },
      configurable: true
    },
    migrate: {
      get() {
        return new Migrator(this);
      },
      configurable: true
    },
    seed: {
      get() {
        return new Seeder(this);
      },
      configurable: true
    },
    fn: {
      get() {
        return new FunctionHelper(this.client);
      },
      configurable: true
    }
  };
  const CONTEXT_METHODS = [
    "raw",
    "batchInsert",
    "transaction",
    "transactionProvider",
    "initialize",
    "destroy",
    "ref",
    "withUserParams",
    "queryBuilder",
    "disableProcessing",
    "enableProcessing"
  ];
  for (const m of CONTEXT_METHODS) {
    KNEX_PROPERTY_DEFINITIONS[m] = {
      value: function(...args) {
        return this.context[m](...args);
      },
      configurable: true
    };
  }
  function makeKnex(client2) {
    function knex2(tableName, options) {
      return createQueryBuilder(knex2.context, tableName, options);
    }
    redefineProperties(knex2, client2);
    return knex2;
  }
  function initContext(knexFn) {
    const knexContext = knexFn.context || {};
    Object.assign(knexContext, {
      queryBuilder() {
        return this.client.queryBuilder();
      },
      raw() {
        return this.client.raw.apply(this.client, arguments);
      },
      batchInsert(table, batch, chunkSize = 1e3) {
        return batchInsert(this, table, batch, chunkSize);
      },
      // Creates a new transaction.
      // If container is provided, returns a promise for when the transaction is resolved.
      // If container is not provided, returns a promise with a transaction that is resolved
      // when transaction is ready to be used.
      transaction(container, _config) {
        if (!_config && isObject(container)) {
          _config = container;
          container = null;
        }
        const config = Object.assign({}, _config);
        config.userParams = this.userParams || {};
        if (config.doNotRejectOnRollback === void 0) {
          config.doNotRejectOnRollback = true;
        }
        return this._transaction(container, config);
      },
      // Internal method that actually establishes the Transaction.  It makes no assumptions
      // about the `config` or `outerTx`, and expects the caller to handle these details.
      _transaction(container, config, outerTx = null) {
        if (container) {
          const trx = this.client.transaction(container, config, outerTx);
          return trx;
        } else {
          return new Promise((resolve, reject) => {
            this.client.transaction(resolve, config, outerTx).catch(reject);
          });
        }
      },
      transactionProvider(config) {
        let trx;
        return () => {
          if (!trx) {
            trx = this.transaction(void 0, config);
          }
          return trx;
        };
      },
      // Typically never needed, initializes the pool for a knex client.
      initialize(config) {
        return this.client.initializePool(config);
      },
      // Convenience method for tearing down the pool.
      destroy(callback) {
        return this.client.destroy(callback);
      },
      ref(ref2) {
        return this.client.ref(ref2);
      },
      // Do not document this as public API until naming and API is improved for general consumption
      // This method exists to disable processing of internal queries in migrations
      disableProcessing() {
        if (this.userParams.isProcessingDisabled) {
          return;
        }
        this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
        this.userParams.postProcessResponse = this.client.config.postProcessResponse;
        this.client.config.wrapIdentifier = null;
        this.client.config.postProcessResponse = null;
        this.userParams.isProcessingDisabled = true;
      },
      // Do not document this as public API until naming and API is improved for general consumption
      // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
      enableProcessing() {
        if (!this.userParams.isProcessingDisabled) {
          return;
        }
        this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
        this.client.config.postProcessResponse = this.userParams.postProcessResponse;
        this.userParams.isProcessingDisabled = false;
      },
      withUserParams(params) {
        const knexClone = shallowCloneFunction(knexFn);
        if (this.client) {
          knexClone.client = Object.create(this.client.constructor.prototype);
          merge(knexClone.client, this.client);
          knexClone.client.config = Object.assign({}, this.client.config);
          if (this.client.config.password) {
            setHiddenProperty(knexClone.client.config, this.client.config);
          }
        }
        redefineProperties(knexClone, knexClone.client);
        _copyEventListeners("query", knexFn, knexClone);
        _copyEventListeners("query-error", knexFn, knexClone);
        _copyEventListeners("query-response", knexFn, knexClone);
        _copyEventListeners("start", knexFn, knexClone);
        knexClone.userParams = params;
        return knexClone;
      }
    });
    if (!knexFn.context) {
      knexFn.context = knexContext;
    }
  }
  function _copyEventListeners(eventName, sourceKnex, targetKnex) {
    const listeners = sourceKnex.listeners(eventName);
    listeners.forEach((listener) => {
      targetKnex.on(eventName, listener);
    });
  }
  function redefineProperties(knex2, client2) {
    for (let i = 0; i < QueryInterface.length; i++) {
      const method = QueryInterface[i];
      knex2[method] = function() {
        const builder2 = this.queryBuilder();
        return builder2[method].apply(builder2, arguments);
      };
    }
    Object.defineProperties(knex2, KNEX_PROPERTY_DEFINITIONS);
    initContext(knex2);
    knex2.client = client2;
    knex2.userParams = {};
    const ee = new EventEmitter();
    for (const key in ee) {
      knex2[key] = ee[key];
    }
    if (knex2._internalListeners) {
      knex2._internalListeners.forEach(({ eventName, listener }) => {
        knex2.client.removeListener(eventName, listener);
      });
    }
    knex2._internalListeners = [];
    _addInternalListener(knex2, "start", (obj) => {
      knex2.emit("start", obj);
    });
    _addInternalListener(knex2, "query", (obj) => {
      knex2.emit("query", obj);
    });
    _addInternalListener(knex2, "query-error", (err, obj) => {
      knex2.emit("query-error", err, obj);
    });
    _addInternalListener(knex2, "query-response", (response, obj, builder2) => {
      knex2.emit("query-response", response, obj, builder2);
    });
  }
  function _addInternalListener(knex2, eventName, listener) {
    knex2.client.on(eventName, listener);
    knex2._internalListeners.push({
      eventName,
      listener
    });
  }
  function createQueryBuilder(knexContext, tableName, options) {
    const qb = knexContext.queryBuilder();
    if (!tableName)
      knexContext.client.logger.warn(
        "calling knex without a tableName is deprecated. Use knex.queryBuilder() instead."
      );
    return tableName ? qb.table(tableName, options) : qb;
  }
  function shallowCloneFunction(originalFunction) {
    const fnContext = Object.create(
      Object.getPrototypeOf(originalFunction),
      Object.getOwnPropertyDescriptors(originalFunction)
    );
    const knexContext = {};
    const knexFnWrapper = (tableName, options) => {
      return createQueryBuilder(knexContext, tableName, options);
    };
    const clonedFunction = knexFnWrapper.bind(fnContext);
    Object.assign(clonedFunction, originalFunction);
    clonedFunction.context = knexContext;
    return clonedFunction;
  }
  makeKnex_1 = makeKnex;
  return makeKnex_1;
}
var noop;
var hasRequiredNoop$1;
function requireNoop$1() {
  if (hasRequiredNoop$1) return noop;
  hasRequiredNoop$1 = 1;
  noop = function() {
  };
  return noop;
}
var finallyMixin_1;
var hasRequiredFinallyMixin;
function requireFinallyMixin() {
  if (hasRequiredFinallyMixin) return finallyMixin_1;
  hasRequiredFinallyMixin = 1;
  const noop2 = requireNoop$1();
  const finallyMixin = (prototype) => Object.assign(prototype, {
    finally(onFinally) {
      return this.then().finally(onFinally);
    }
  });
  finallyMixin_1 = Promise.prototype.finally ? finallyMixin : noop2;
  return finallyMixin_1;
}
var transaction$5;
var hasRequiredTransaction$5;
function requireTransaction$5() {
  if (hasRequiredTransaction$5) return transaction$5;
  hasRequiredTransaction$5 = 1;
  const { EventEmitter } = require$$0;
  const Debug = requireSrc();
  const uniqueId = requireUniqueId();
  const { callbackify } = require$$2$1;
  const makeKnex = requireMakeKnex();
  const { timeout: timeout2, KnexTimeoutError } = requireTimeout();
  const finallyMixin = requireFinallyMixin();
  const debug = Debug("knex:tx");
  function DEFAULT_CONFIG() {
    return {
      userParams: {},
      doNotRejectOnRollback: true
    };
  }
  const validIsolationLevels = [
    // Doesn't really work in postgres, it treats it as read committed
    "read uncommitted",
    "read committed",
    "snapshot",
    // snapshot and repeatable read are basically the same, most "repeatable
    // read" implementations are actually "snapshot" also known as Multi Version
    // Concurrency Control (MVCC). Mssql's repeatable read doesn't stop
    // repeated reads for inserts as it uses a pessimistic locking system so
    // you should probably use 'snapshot' to stop read skew.
    "repeatable read",
    // mysql pretends to have serializable, but it is not
    "serializable"
  ];
  class Transaction extends EventEmitter {
    constructor(client2, container, config = DEFAULT_CONFIG(), outerTx = null) {
      super();
      this.userParams = config.userParams;
      this.doNotRejectOnRollback = config.doNotRejectOnRollback;
      const txid = this.txid = uniqueId("trx");
      this.client = client2;
      this.logger = client2.logger;
      this.outerTx = outerTx;
      this.trxClient = void 0;
      this._completed = false;
      this._debug = client2.config && client2.config.debug;
      this.readOnly = config.readOnly;
      if (config.isolationLevel) {
        this.setIsolationLevel(config.isolationLevel);
      }
      debug(
        "%s: Starting %s transaction",
        txid,
        outerTx ? "nested" : "top level"
      );
      this._lastChild = Promise.resolve();
      const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();
      const basePromise = _previousSibling.then(
        () => this._evaluateContainer(config, container)
      );
      this._promise = basePromise.then((x) => x);
      if (outerTx) {
        outerTx._lastChild = basePromise.catch(() => {
        });
      }
    }
    isCompleted() {
      return this._completed || this.outerTx && this.outerTx.isCompleted() || false;
    }
    begin(conn) {
      const trxMode = [
        this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
        this.readOnly ? "READ ONLY" : ""
      ].join(" ").trim();
      if (trxMode.length === 0) {
        return this.query(conn, "BEGIN;");
      }
      return this.query(conn, `SET TRANSACTION ${trxMode};`).then(
        () => this.query(conn, "BEGIN;")
      );
    }
    savepoint(conn) {
      return this.query(conn, `SAVEPOINT ${this.txid};`);
    }
    commit(conn, value) {
      return this.query(conn, "COMMIT;", 1, value);
    }
    release(conn, value) {
      return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
    }
    setIsolationLevel(isolationLevel) {
      if (!validIsolationLevels.includes(isolationLevel)) {
        throw new Error(
          `Invalid isolationLevel, supported isolation levels are: ${JSON.stringify(
            validIsolationLevels
          )}`
        );
      }
      this.isolationLevel = isolationLevel;
      return this;
    }
    rollback(conn, error) {
      return timeout2(this.query(conn, "ROLLBACK", 2, error), 5e3).catch(
        (err) => {
          if (!(err instanceof KnexTimeoutError)) {
            return Promise.reject(err);
          }
          this._rejecter(error);
        }
      );
    }
    rollbackTo(conn, error) {
      return timeout2(
        this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
        5e3
      ).catch((err) => {
        if (!(err instanceof KnexTimeoutError)) {
          return Promise.reject(err);
        }
        this._rejecter(error);
      });
    }
    query(conn, sql, status, value) {
      const q = this.trxClient.query(conn, sql).catch((err) => {
        status = 2;
        value = err;
        this._completed = true;
        debug("%s error running transaction query", this.txid);
      }).then((res) => {
        if (status === 1) {
          this._resolver(value);
        }
        if (status === 2) {
          if (value === void 0) {
            if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              this._resolver();
              return;
            }
            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          this._rejecter(value);
        }
        return res;
      });
      if (status === 1 || status === 2) {
        this._completed = true;
      }
      return q;
    }
    debug(enabled) {
      this._debug = arguments.length ? enabled : true;
      return this;
    }
    async _evaluateContainer(config, container) {
      return this.acquireConnection(config, (connection) => {
        const trxClient = this.trxClient = makeTxClient(
          this,
          this.client,
          connection
        );
        const init = this.client.transacting ? this.savepoint(connection) : this.begin(connection);
        const executionPromise = new Promise((resolver, rejecter) => {
          this._resolver = resolver;
          this._rejecter = rejecter;
        });
        init.then(() => {
          return makeTransactor(this, connection, trxClient);
        }).then((transactor) => {
          this.transactor = transactor;
          if (this.outerTx) {
            transactor.parentTransaction = this.outerTx.transactor;
          }
          transactor.executionPromise = executionPromise;
          let result;
          try {
            result = container(transactor);
          } catch (err) {
            result = Promise.reject(err);
          }
          if (result && result.then && typeof result.then === "function") {
            result.then((val) => {
              return transactor.commit(val);
            }).catch((err) => {
              return transactor.rollback(err);
            });
          }
          return null;
        }).catch((e) => {
          return this._rejecter(e);
        });
        return executionPromise;
      });
    }
    // Acquire a connection and create a disposer - either using the one passed
    // via config or getting one off the client. The disposer will be called once
    // the original promise is marked completed.
    async acquireConnection(config, cb) {
      const configConnection = config && config.connection;
      const connection = configConnection || await this.client.acquireConnection();
      try {
        connection.__knexTxId = this.txid;
        return await cb(connection);
      } finally {
        if (!configConnection) {
          debug("%s: releasing connection", this.txid);
          this.client.releaseConnection(connection);
        } else {
          debug("%s: not releasing external connection", this.txid);
        }
      }
    }
    then(onResolve, onReject) {
      return this._promise.then(onResolve, onReject);
    }
    catch(...args) {
      return this._promise.catch(...args);
    }
    asCallback(cb) {
      callbackify(() => this._promise)(cb);
      return this._promise;
    }
  }
  finallyMixin(Transaction.prototype);
  function makeTransactor(trx, connection, trxClient) {
    const transactor = makeKnex(trxClient);
    transactor.context.withUserParams = () => {
      throw new Error(
        "Cannot set user params on a transaction - it can only inherit params from main knex instance"
      );
    };
    transactor.isTransaction = true;
    transactor.userParams = trx.userParams || {};
    transactor.context.transaction = function(container, options) {
      if (!options) {
        options = { doNotRejectOnRollback: true };
      } else if (options.doNotRejectOnRollback === void 0) {
        options.doNotRejectOnRollback = true;
      }
      return this._transaction(container, options, trx);
    };
    transactor.savepoint = function(container, options) {
      return transactor.transaction(container, options);
    };
    if (trx.client.transacting) {
      transactor.commit = (value) => trx.release(connection, value);
      transactor.rollback = (error) => trx.rollbackTo(connection, error);
    } else {
      transactor.commit = (value) => trx.commit(connection, value);
      transactor.rollback = (error) => trx.rollback(connection, error);
    }
    transactor.isCompleted = () => trx.isCompleted();
    return transactor;
  }
  function makeTxClient(trx, client2, connection) {
    const trxClient = Object.create(client2.constructor.prototype);
    trxClient.version = client2.version;
    trxClient.config = client2.config;
    trxClient.driver = client2.driver;
    trxClient.connectionSettings = client2.connectionSettings;
    trxClient.transacting = true;
    trxClient.valueForUndefined = client2.valueForUndefined;
    trxClient.logger = client2.logger;
    trxClient.on("start", function(arg) {
      trx.emit("start", arg);
      client2.emit("start", arg);
    });
    trxClient.on("query", function(arg) {
      trx.emit("query", arg);
      client2.emit("query", arg);
    });
    trxClient.on("query-error", function(err, obj) {
      trx.emit("query-error", err, obj);
      client2.emit("query-error", err, obj);
    });
    trxClient.on("query-response", function(response, obj, builder2) {
      trx.emit("query-response", response, obj, builder2);
      client2.emit("query-response", response, obj, builder2);
    });
    const _query = trxClient.query;
    trxClient.query = function(conn, obj) {
      const completed = trx.isCompleted();
      return new Promise(function(resolve, reject) {
        try {
          if (conn !== connection)
            throw new Error("Invalid connection for transaction query.");
          if (completed) completedError(trx, obj);
          resolve(_query.call(trxClient, conn, obj));
        } catch (e) {
          reject(e);
        }
      });
    };
    const _stream = trxClient.stream;
    trxClient.stream = function(conn, obj, stream, options) {
      const completed = trx.isCompleted();
      return new Promise(function(resolve, reject) {
        try {
          if (conn !== connection)
            throw new Error("Invalid connection for transaction query.");
          if (completed) completedError(trx, obj);
          resolve(_stream.call(trxClient, conn, obj, stream, options));
        } catch (e) {
          reject(e);
        }
      });
    };
    trxClient.acquireConnection = function() {
      return Promise.resolve(connection);
    };
    trxClient.releaseConnection = function() {
      return Promise.resolve();
    };
    return trxClient;
  }
  function completedError(trx, obj) {
    const sql = typeof obj === "string" ? obj : obj && obj.sql;
    debug("%s: Transaction completed: %s", trx.txid, sql);
    throw new Error(
      "Transaction query already complete, run with DEBUG=knex:tx for more info"
    );
  }
  transaction$5 = Transaction;
  return transaction$5;
}
var queryExecutioner;
var hasRequiredQueryExecutioner;
function requireQueryExecutioner() {
  if (hasRequiredQueryExecutioner) return queryExecutioner;
  hasRequiredQueryExecutioner = 1;
  const _debugQuery = requireSrc()("knex:query");
  const debugBindings = requireSrc()("knex:bindings");
  const debugQuery = (sql, txId) => _debugQuery(sql.replace(/%/g, "%%"), txId);
  const { isString } = requireIs();
  function formatQuery(sql, bindings2, timeZone, client2) {
    bindings2 = bindings2 == null ? [] : [].concat(bindings2);
    let index = 0;
    return sql.replace(/\\?\?/g, (match) => {
      if (match === "\\?") {
        return "?";
      }
      if (index === bindings2.length) {
        return match;
      }
      const value = bindings2[index++];
      return client2._escapeBinding(value, { timeZone });
    });
  }
  function enrichQueryObject(connection, queryParam, client2) {
    const queryObject = isString(queryParam) ? { sql: queryParam } : queryParam;
    queryObject.bindings = client2.prepBindings(queryObject.bindings);
    queryObject.sql = client2.positionBindings(queryObject.sql);
    const { __knexUid, __knexTxId } = connection;
    client2.emit("query", Object.assign({ __knexUid, __knexTxId }, queryObject));
    debugQuery(queryObject.sql, __knexTxId);
    debugBindings(queryObject.bindings, __knexTxId);
    return queryObject;
  }
  function executeQuery(connection, queryObject, client2) {
    return client2._query(connection, queryObject).catch((err) => {
      if (client2.config && client2.config.compileSqlOnError === false) {
        err.message = queryObject.sql + " - " + err.message;
      } else {
        err.message = formatQuery(queryObject.sql, queryObject.bindings, void 0, client2) + " - " + err.message;
      }
      client2.emit(
        "query-error",
        err,
        Object.assign(
          { __knexUid: connection.__knexUid, __knexTxId: connection.__knexUid },
          queryObject
        )
      );
      throw err;
    });
  }
  queryExecutioner = {
    enrichQueryObject,
    executeQuery,
    formatQuery
  };
  return queryExecutioner;
}
var assign_1;
var hasRequiredAssign;
function requireAssign() {
  if (hasRequiredAssign) return assign_1;
  hasRequiredAssign = 1;
  var assignValue = require_assignValue(), copyObject = require_copyObject(), createAssigner = require_createAssigner(), isArrayLike = requireIsArrayLike(), isPrototype = require_isPrototype(), keys = requireKeys();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var assign = createAssigner(function(object, source) {
    if (isPrototype(source) || isArrayLike(source)) {
      copyObject(source, keys(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        assignValue(object, key, source[key]);
      }
    }
  });
  assign_1 = assign;
  return assign_1;
}
var clone_1;
var hasRequiredClone;
function requireClone() {
  if (hasRequiredClone) return clone_1;
  hasRequiredClone = 1;
  var baseClone = require_baseClone();
  var CLONE_SYMBOLS_FLAG = 4;
  function clone(value) {
    return baseClone(value, CLONE_SYMBOLS_FLAG);
  }
  clone_1 = clone;
  return clone_1;
}
var _castFunction;
var hasRequired_castFunction;
function require_castFunction() {
  if (hasRequired_castFunction) return _castFunction;
  hasRequired_castFunction = 1;
  var identity = requireIdentity();
  function castFunction(value) {
    return typeof value == "function" ? value : identity;
  }
  _castFunction = castFunction;
  return _castFunction;
}
var forEach_1;
var hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach_1;
  hasRequiredForEach = 1;
  var arrayEach = require_arrayEach(), baseEach = require_baseEach(), castFunction = require_castFunction(), isArray = requireIsArray();
  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, castFunction(iteratee));
  }
  forEach_1 = forEach;
  return forEach_1;
}
var each;
var hasRequiredEach;
function requireEach() {
  if (hasRequiredEach) return each;
  hasRequiredEach = 1;
  each = requireForEach();
  return each;
}
var _baseFilter;
var hasRequired_baseFilter;
function require_baseFilter() {
  if (hasRequired_baseFilter) return _baseFilter;
  hasRequired_baseFilter = 1;
  var baseEach = require_baseEach();
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection2) {
      if (predicate(value, index, collection2)) {
        result.push(value);
      }
    });
    return result;
  }
  _baseFilter = baseFilter;
  return _baseFilter;
}
var negate_1;
var hasRequiredNegate;
function requireNegate() {
  if (hasRequiredNegate) return negate_1;
  hasRequiredNegate = 1;
  var FUNC_ERROR_TEXT = "Expected a function";
  function negate(predicate) {
    if (typeof predicate != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return !predicate.call(this);
        case 1:
          return !predicate.call(this, args[0]);
        case 2:
          return !predicate.call(this, args[0], args[1]);
        case 3:
          return !predicate.call(this, args[0], args[1], args[2]);
      }
      return !predicate.apply(this, args);
    };
  }
  negate_1 = negate;
  return negate_1;
}
var reject_1;
var hasRequiredReject;
function requireReject() {
  if (hasRequiredReject) return reject_1;
  hasRequiredReject = 1;
  var arrayFilter = require_arrayFilter(), baseFilter = require_baseFilter(), baseIteratee = require_baseIteratee(), isArray = requireIsArray(), negate = requireNegate();
  function reject(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, negate(baseIteratee(predicate, 3)));
  }
  reject_1 = reject;
  return reject_1;
}
var tail_1;
var hasRequiredTail;
function requireTail() {
  if (hasRequiredTail) return tail_1;
  hasRequiredTail = 1;
  var baseSlice = require_baseSlice();
  function tail(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseSlice(array, 1, length) : [];
  }
  tail_1 = tail;
  return tail_1;
}
var _iteratorToArray;
var hasRequired_iteratorToArray;
function require_iteratorToArray() {
  if (hasRequired_iteratorToArray) return _iteratorToArray;
  hasRequired_iteratorToArray = 1;
  function iteratorToArray(iterator) {
    var data, result = [];
    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }
  _iteratorToArray = iteratorToArray;
  return _iteratorToArray;
}
var _asciiToArray;
var hasRequired_asciiToArray;
function require_asciiToArray() {
  if (hasRequired_asciiToArray) return _asciiToArray;
  hasRequired_asciiToArray = 1;
  function asciiToArray(string2) {
    return string2.split("");
  }
  _asciiToArray = asciiToArray;
  return _asciiToArray;
}
var _hasUnicode;
var hasRequired_hasUnicode;
function require_hasUnicode() {
  if (hasRequired_hasUnicode) return _hasUnicode;
  hasRequired_hasUnicode = 1;
  var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
  var rsZWJ = "\\u200d";
  var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
  function hasUnicode(string2) {
    return reHasUnicode.test(string2);
  }
  _hasUnicode = hasUnicode;
  return _hasUnicode;
}
var _unicodeToArray;
var hasRequired_unicodeToArray;
function require_unicodeToArray() {
  if (hasRequired_unicodeToArray) return _unicodeToArray;
  hasRequired_unicodeToArray = 1;
  var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
  var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
  var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
  var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
  function unicodeToArray(string2) {
    return string2.match(reUnicode) || [];
  }
  _unicodeToArray = unicodeToArray;
  return _unicodeToArray;
}
var _stringToArray;
var hasRequired_stringToArray;
function require_stringToArray() {
  if (hasRequired_stringToArray) return _stringToArray;
  hasRequired_stringToArray = 1;
  var asciiToArray = require_asciiToArray(), hasUnicode = require_hasUnicode(), unicodeToArray = require_unicodeToArray();
  function stringToArray(string2) {
    return hasUnicode(string2) ? unicodeToArray(string2) : asciiToArray(string2);
  }
  _stringToArray = stringToArray;
  return _stringToArray;
}
var toArray_1;
var hasRequiredToArray;
function requireToArray() {
  if (hasRequiredToArray) return toArray_1;
  hasRequiredToArray = 1;
  var Symbol2 = require_Symbol(), copyArray = require_copyArray(), getTag = require_getTag(), isArrayLike = requireIsArrayLike(), isString = requireIsString(), iteratorToArray = require_iteratorToArray(), mapToArray = require_mapToArray(), setToArray = require_setToArray(), stringToArray = require_stringToArray(), values = requireValues();
  var mapTag = "[object Map]", setTag = "[object Set]";
  var symIterator = Symbol2 ? Symbol2.iterator : void 0;
  function toArray(value) {
    if (!value) {
      return [];
    }
    if (isArrayLike(value)) {
      return isString(value) ? stringToArray(value) : copyArray(value);
    }
    if (symIterator && value[symIterator]) {
      return iteratorToArray(value[symIterator]());
    }
    var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
    return func(value);
  }
  toArray_1 = toArray;
  return toArray_1;
}
var constants$1;
var hasRequiredConstants$1;
function requireConstants$1() {
  if (hasRequiredConstants$1) return constants$1;
  hasRequiredConstants$1 = 1;
  const CLIENT_ALIASES = Object.freeze({
    pg: "postgres",
    postgresql: "postgres",
    sqlite: "sqlite3"
  });
  const SUPPORTED_CLIENTS = Object.freeze(
    [
      "mssql",
      "mysql",
      "mysql2",
      "oracledb",
      "postgres",
      "pgnative",
      "redshift",
      "sqlite3",
      "cockroachdb",
      "better-sqlite3"
    ].concat(Object.keys(CLIENT_ALIASES))
  );
  const DRIVER_NAMES = Object.freeze({
    MsSQL: "mssql",
    MySQL: "mysql",
    MySQL2: "mysql2",
    Oracle: "oracledb",
    PostgreSQL: "pg",
    PgNative: "pgnative",
    Redshift: "pg-redshift",
    SQLite: "sqlite3",
    CockroachDB: "cockroachdb",
    BetterSQLite3: "better-sqlite3"
  });
  const POOL_CONFIG_OPTIONS = Object.freeze([
    "maxWaitingClients",
    "testOnBorrow",
    "fifo",
    "priorityRange",
    "autostart",
    "evictionRunIntervalMillis",
    "numTestsPerRun",
    "softIdleTimeoutMillis",
    "Promise"
  ]);
  const COMMA_NO_PAREN_REGEX = /,[\s](?![^(]*\))/g;
  constants$1 = {
    CLIENT_ALIASES,
    SUPPORTED_CLIENTS,
    POOL_CONFIG_OPTIONS,
    COMMA_NO_PAREN_REGEX,
    DRIVER_NAMES
  };
  return constants$1;
}
var helpers$1;
var hasRequiredHelpers$1;
function requireHelpers$1() {
  if (hasRequiredHelpers$1) return helpers$1;
  hasRequiredHelpers$1 = 1;
  const isPlainObject = requireIsPlainObject();
  const isTypedArray = requireIsTypedArray();
  const { CLIENT_ALIASES } = requireConstants$1();
  const { isFunction } = requireIs();
  function normalizeArr(...args) {
    if (Array.isArray(args[0])) {
      return args[0];
    }
    return args;
  }
  function containsUndefined(mixed) {
    let argContainsUndefined = false;
    if (isTypedArray(mixed)) return false;
    if (mixed && isFunction(mixed.toSQL)) {
      return argContainsUndefined;
    }
    if (Array.isArray(mixed)) {
      for (let i = 0; i < mixed.length; i++) {
        if (argContainsUndefined) break;
        argContainsUndefined = containsUndefined(mixed[i]);
      }
    } else if (isPlainObject(mixed)) {
      Object.keys(mixed).forEach((key) => {
        if (!argContainsUndefined) {
          argContainsUndefined = containsUndefined(mixed[key]);
        }
      });
    } else {
      argContainsUndefined = mixed === void 0;
    }
    return argContainsUndefined;
  }
  function getUndefinedIndices(mixed) {
    const indices = [];
    if (Array.isArray(mixed)) {
      mixed.forEach((item, index) => {
        if (containsUndefined(item)) {
          indices.push(index);
        }
      });
    } else if (isPlainObject(mixed)) {
      Object.keys(mixed).forEach((key) => {
        if (containsUndefined(mixed[key])) {
          indices.push(key);
        }
      });
    } else {
      indices.push(0);
    }
    return indices;
  }
  function addQueryContext(Target) {
    Target.prototype.queryContext = function(context) {
      if (context === void 0) {
        return this._queryContext;
      }
      this._queryContext = context;
      return this;
    };
  }
  function resolveClientNameWithAliases(clientName) {
    return CLIENT_ALIASES[clientName] || clientName;
  }
  function toNumber(val, fallback) {
    if (val === void 0 || val === null) return fallback;
    const number = parseInt(val, 10);
    return isNaN(number) ? fallback : number;
  }
  helpers$1 = {
    addQueryContext,
    containsUndefined,
    getUndefinedIndices,
    normalizeArr,
    resolveClientNameWithAliases,
    toNumber
  };
  return helpers$1;
}
var joinclause;
var hasRequiredJoinclause;
function requireJoinclause() {
  if (hasRequiredJoinclause) return joinclause;
  hasRequiredJoinclause = 1;
  const assert = require$$0$5;
  function getClauseFromArguments(compilerType, bool, first2, operator, second) {
    if (typeof first2 === "function") {
      return {
        type: "onWrapped",
        value: first2,
        bool
      };
    }
    switch (arguments.length) {
      case 3:
        return { type: "onRaw", value: first2, bool };
      case 4:
        return {
          type: compilerType,
          column: first2,
          operator: "=",
          value: operator,
          bool
        };
      default:
        return {
          type: compilerType,
          column: first2,
          operator,
          value: second,
          bool
        };
    }
  }
  class JoinClause {
    constructor(table, type, schema) {
      this.schema = schema;
      this.table = table;
      this.joinType = type;
      this.and = this;
      this.clauses = [];
    }
    get or() {
      return this._bool("or");
    }
    // Adds an "on" clause to the current join object.
    on(first2) {
      if (typeof first2 === "object" && typeof first2.toSQL !== "function") {
        const keys = Object.keys(first2);
        let i = -1;
        const method = this._bool() === "or" ? "orOn" : "on";
        while (++i < keys.length) {
          this[method](keys[i], first2[keys[i]]);
        }
        return this;
      }
      const data = getClauseFromArguments("onBasic", this._bool(), ...arguments);
      if (data) {
        this.clauses.push(data);
      }
      return this;
    }
    // Adds an "or on" clause to the current join object.
    orOn(first2, operator, second) {
      return this._bool("or").on.apply(this, arguments);
    }
    onJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
      this.clauses.push({
        type: "onJsonPathEquals",
        columnFirst,
        jsonPathFirst,
        columnSecond,
        jsonPathSecond,
        bool: this._bool(),
        not: this._not()
      });
      return this;
    }
    orOnJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
      return this._bool("or").onJsonPathEquals.apply(this, arguments);
    }
    // Adds a "using" clause to the current join.
    using(column) {
      return this.clauses.push({ type: "onUsing", column, bool: this._bool() });
    }
    onVal(first2) {
      if (typeof first2 === "object" && typeof first2.toSQL !== "function") {
        const keys = Object.keys(first2);
        let i = -1;
        const method = this._bool() === "or" ? "orOnVal" : "onVal";
        while (++i < keys.length) {
          this[method](keys[i], first2[keys[i]]);
        }
        return this;
      }
      const data = getClauseFromArguments("onVal", this._bool(), ...arguments);
      if (data) {
        this.clauses.push(data);
      }
      return this;
    }
    andOnVal() {
      return this.onVal(...arguments);
    }
    orOnVal() {
      return this._bool("or").onVal(...arguments);
    }
    onBetween(column, values) {
      assert(
        Array.isArray(values),
        "The second argument to onBetween must be an array."
      );
      assert(
        values.length === 2,
        "You must specify 2 values for the onBetween clause"
      );
      this.clauses.push({
        type: "onBetween",
        column,
        value: values,
        bool: this._bool(),
        not: this._not()
      });
      return this;
    }
    onNotBetween(column, values) {
      return this._not(true).onBetween(column, values);
    }
    orOnBetween(column, values) {
      return this._bool("or").onBetween(column, values);
    }
    orOnNotBetween(column, values) {
      return this._bool("or")._not(true).onBetween(column, values);
    }
    onIn(column, values) {
      if (Array.isArray(values) && values.length === 0) return this.on(1, "=", 0);
      this.clauses.push({
        type: "onIn",
        column,
        value: values,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    onNotIn(column, values) {
      return this._not(true).onIn(column, values);
    }
    orOnIn(column, values) {
      return this._bool("or").onIn(column, values);
    }
    orOnNotIn(column, values) {
      return this._bool("or")._not(true).onIn(column, values);
    }
    onNull(column) {
      this.clauses.push({
        type: "onNull",
        column,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orOnNull(callback) {
      return this._bool("or").onNull(callback);
    }
    onNotNull(callback) {
      return this._not(true).onNull(callback);
    }
    orOnNotNull(callback) {
      return this._not(true)._bool("or").onNull(callback);
    }
    onExists(callback) {
      this.clauses.push({
        type: "onExists",
        value: callback,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orOnExists(callback) {
      return this._bool("or").onExists(callback);
    }
    onNotExists(callback) {
      return this._not(true).onExists(callback);
    }
    orOnNotExists(callback) {
      return this._not(true)._bool("or").onExists(callback);
    }
    // Explicitly set the type of join, useful within a function when creating a grouped join.
    type(type) {
      this.joinType = type;
      return this;
    }
    _bool(bool) {
      if (arguments.length === 1) {
        this._boolFlag = bool;
        return this;
      }
      const ret = this._boolFlag || "and";
      this._boolFlag = "and";
      return ret;
    }
    _not(val) {
      if (arguments.length === 1) {
        this._notFlag = val;
        return this;
      }
      const ret = this._notFlag;
      this._notFlag = false;
      return ret;
    }
  }
  Object.assign(JoinClause.prototype, {
    grouping: "join"
  });
  JoinClause.prototype.andOn = JoinClause.prototype.on;
  JoinClause.prototype.andOnIn = JoinClause.prototype.onIn;
  JoinClause.prototype.andOnNotIn = JoinClause.prototype.onNotIn;
  JoinClause.prototype.andOnNull = JoinClause.prototype.onNull;
  JoinClause.prototype.andOnNotNull = JoinClause.prototype.onNotNull;
  JoinClause.prototype.andOnExists = JoinClause.prototype.onExists;
  JoinClause.prototype.andOnNotExists = JoinClause.prototype.onNotExists;
  JoinClause.prototype.andOnBetween = JoinClause.prototype.onBetween;
  JoinClause.prototype.andOnNotBetween = JoinClause.prototype.onNotBetween;
  JoinClause.prototype.andOnJsonPathEquals = JoinClause.prototype.onJsonPathEquals;
  joinclause = JoinClause;
  return joinclause;
}
var analytic;
var hasRequiredAnalytic;
function requireAnalytic() {
  if (hasRequiredAnalytic) return analytic;
  hasRequiredAnalytic = 1;
  const assert = require$$0$5;
  class Analytic {
    constructor(method, schema, alias, orderBy, partitions) {
      this.schema = schema;
      this.type = "analytic";
      this.method = method;
      this.order = orderBy || [];
      this.partitions = partitions || [];
      this.alias = alias;
      this.and = this;
      this.grouping = "columns";
    }
    partitionBy(column, direction) {
      assert(
        Array.isArray(column) || typeof column === "string",
        `The argument to an analytic partitionBy function must be either a string
            or an array of string.`
      );
      if (Array.isArray(column)) {
        this.partitions = this.partitions.concat(column);
      } else {
        this.partitions.push({ column, order: direction });
      }
      return this;
    }
    orderBy(column, direction) {
      assert(
        Array.isArray(column) || typeof column === "string",
        `The argument to an analytic orderBy function must be either a string
            or an array of string.`
      );
      if (Array.isArray(column)) {
        this.order = this.order.concat(column);
      } else {
        this.order.push({ column, order: direction });
      }
      return this;
    }
  }
  analytic = Analytic;
  return analytic;
}
var saveAsyncStack;
var hasRequiredSaveAsyncStack;
function requireSaveAsyncStack() {
  if (hasRequiredSaveAsyncStack) return saveAsyncStack;
  hasRequiredSaveAsyncStack = 1;
  saveAsyncStack = function saveAsyncStack2(instance, lines) {
    if (instance.client.config.asyncStackTraces) {
      instance._asyncStack = {
        error: new Error(),
        lines
      };
    }
  };
  return saveAsyncStack;
}
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  constants = {
    lockMode: {
      forShare: "forShare",
      forUpdate: "forUpdate",
      forNoKeyUpdate: "forNoKeyUpdate",
      forKeyShare: "forKeyShare"
    },
    waitMode: {
      skipLocked: "skipLocked",
      noWait: "noWait"
    }
  };
  return constants;
}
var builderInterfaceAugmenter;
var hasRequiredBuilderInterfaceAugmenter;
function requireBuilderInterfaceAugmenter() {
  if (hasRequiredBuilderInterfaceAugmenter) return builderInterfaceAugmenter;
  hasRequiredBuilderInterfaceAugmenter = 1;
  const clone = requireClone();
  const isEmpty = requireIsEmpty();
  const { callbackify } = require$$2$1;
  const finallyMixin = requireFinallyMixin();
  const { formatQuery } = requireQueryExecutioner();
  function augmentWithBuilderInterface(Target) {
    Target.prototype.toQuery = function(tz) {
      let data = this.toSQL(this._method, tz);
      if (!Array.isArray(data)) data = [data];
      if (!data.length) {
        return "";
      }
      return data.map((statement) => {
        return formatQuery(statement.sql, statement.bindings, tz, this.client);
      }).reduce((a, c) => a.concat(a.endsWith(";") ? "\n" : ";\n", c));
    };
    Target.prototype.then = function() {
      let result = this.client.runner(this).run();
      if (this.client.config.asyncStackTraces) {
        result = result.catch((err) => {
          err.originalStack = err.stack;
          const firstLine = err.stack.split("\n")[0];
          const { error, lines } = this._asyncStack;
          const stackByLines = error.stack.split("\n");
          const asyncStack = stackByLines.slice(lines);
          asyncStack.unshift(firstLine);
          err.stack = asyncStack.join("\n");
          throw err;
        });
      }
      return result.then.apply(result, arguments);
    };
    Target.prototype.options = function(opts) {
      this._options = this._options || [];
      this._options.push(clone(opts) || {});
      return this;
    };
    Target.prototype.connection = function(connection) {
      this._connection = connection;
      this.client.processPassedConnection(connection);
      return this;
    };
    Target.prototype.debug = function(enabled) {
      this._debug = arguments.length ? enabled : true;
      return this;
    };
    Target.prototype.transacting = function(transaction2) {
      if (transaction2 && transaction2.client) {
        if (!transaction2.client.transacting) {
          transaction2.client.logger.warn(
            `Invalid transaction value: ${transaction2.client}`
          );
        } else {
          this.client = transaction2.client;
        }
      }
      if (isEmpty(transaction2)) {
        this.client.logger.error(
          "Invalid value on transacting call, potential bug"
        );
        throw Error(
          "Invalid transacting value (null, undefined or empty object)"
        );
      }
      return this;
    };
    Target.prototype.stream = function(options) {
      return this.client.runner(this).stream(options);
    };
    Target.prototype.pipe = function(writable, options) {
      return this.client.runner(this).pipe(writable, options);
    };
    Target.prototype.asCallback = function(cb) {
      const promise = this.then();
      callbackify(() => promise)(cb);
      return promise;
    };
    Target.prototype.catch = function(onReject) {
      return this.then().catch(onReject);
    };
    Object.defineProperty(Target.prototype, Symbol.toStringTag, {
      get: () => "object"
    });
    finallyMixin(Target.prototype);
  }
  builderInterfaceAugmenter = {
    augmentWithBuilderInterface
  };
  return builderInterfaceAugmenter;
}
var querybuilder;
var hasRequiredQuerybuilder;
function requireQuerybuilder() {
  if (hasRequiredQuerybuilder) return querybuilder;
  hasRequiredQuerybuilder = 1;
  const assert = require$$0$5;
  const { EventEmitter } = require$$0;
  const assign = requireAssign();
  const clone = requireClone();
  const each2 = requireEach();
  const isEmpty = requireIsEmpty();
  const isPlainObject = requireIsPlainObject();
  const last = requireLast();
  const reject = requireReject();
  const tail = requireTail();
  const toArray = requireToArray();
  const { addQueryContext, normalizeArr } = requireHelpers$1();
  const JoinClause = requireJoinclause();
  const Analytic = requireAnalytic();
  const saveAsyncStack2 = requireSaveAsyncStack();
  const {
    isBoolean,
    isNumber,
    isObject,
    isString,
    isFunction
  } = requireIs();
  const { lockMode, waitMode } = requireConstants();
  const {
    augmentWithBuilderInterface
  } = requireBuilderInterfaceAugmenter();
  const SELECT_COMMANDS = /* @__PURE__ */ new Set(["pluck", "first", "select"]);
  const CLEARABLE_STATEMENTS = /* @__PURE__ */ new Set([
    "with",
    "select",
    "columns",
    "hintComments",
    "where",
    "union",
    "join",
    "group",
    "order",
    "having",
    "limit",
    "offset",
    "counter",
    "counters"
  ]);
  const LOCK_MODES = /* @__PURE__ */ new Set([
    lockMode.forShare,
    lockMode.forUpdate,
    lockMode.forNoKeyUpdate,
    lockMode.forKeyShare
  ]);
  class Builder extends EventEmitter {
    constructor(client2) {
      super();
      this.client = client2;
      this.and = this;
      this._single = {};
      this._comments = [];
      this._statements = [];
      this._method = "select";
      if (client2.config) {
        saveAsyncStack2(this, 5);
        this._debug = client2.config.debug;
      }
      this._joinFlag = "inner";
      this._boolFlag = "and";
      this._notFlag = false;
      this._asColumnFlag = false;
    }
    toString() {
      return this.toQuery();
    }
    // Convert the current query "toSQL"
    toSQL(method, tz) {
      return this.client.queryCompiler(this).toSQL(method || this._method, tz);
    }
    // Create a shallow clone of the current query builder.
    clone() {
      const cloned = new this.constructor(this.client);
      cloned._method = this._method;
      cloned._single = clone(this._single);
      cloned._comments = clone(this._comments);
      cloned._statements = clone(this._statements);
      cloned._debug = this._debug;
      if (this._options !== void 0) {
        cloned._options = clone(this._options);
      }
      if (this._queryContext !== void 0) {
        cloned._queryContext = clone(this._queryContext);
      }
      if (this._connection !== void 0) {
        cloned._connection = this._connection;
      }
      return cloned;
    }
    timeout(ms2, { cancel } = {}) {
      if (isNumber(ms2) && ms2 > 0) {
        this._timeout = ms2;
        if (cancel) {
          this.client.assertCanCancelQuery();
          this._cancelOnTimeout = true;
        }
      }
      return this;
    }
    // With
    // ------
    isValidStatementArg(statement) {
      return typeof statement === "function" || statement instanceof Builder || statement && statement.isRawInstance;
    }
    _validateWithArgs(alias, statementOrColumnList, nothingOrStatement, method) {
      const [query, columnList] = typeof nothingOrStatement === "undefined" ? [statementOrColumnList, void 0] : [nothingOrStatement, statementOrColumnList];
      if (typeof alias !== "string") {
        throw new Error(`${method}() first argument must be a string`);
      }
      if (this.isValidStatementArg(query) && typeof columnList === "undefined") {
        return;
      }
      const isNonEmptyNameList = Array.isArray(columnList) && columnList.length > 0 && columnList.every((it) => typeof it === "string");
      if (!isNonEmptyNameList) {
        throw new Error(
          `${method}() second argument must be a statement or non-empty column name list.`
        );
      }
      if (this.isValidStatementArg(query)) {
        return;
      }
      throw new Error(
        `${method}() third argument must be a function / QueryBuilder or a raw when its second argument is a column name list`
      );
    }
    with(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "with"
      );
      return this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
    }
    withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      throw new Error("With materialized is not supported by this dialect");
    }
    withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      throw new Error("With materialized is not supported by this dialect");
    }
    // Helper for compiling any advanced `with` queries.
    withWrapped(alias, statementOrColumnList, nothingOrStatement, materialized) {
      const [query, columnList] = typeof nothingOrStatement === "undefined" ? [statementOrColumnList, void 0] : [nothingOrStatement, statementOrColumnList];
      const statement = {
        grouping: "with",
        type: "withWrapped",
        alias,
        columnList,
        value: query
      };
      if (materialized !== void 0) {
        statement.materialized = materialized;
      }
      this._statements.push(statement);
      return this;
    }
    // With Recursive
    // ------
    withRecursive(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "withRecursive"
      );
      return this.withRecursiveWrapped(
        alias,
        statementOrColumnList,
        nothingOrStatement
      );
    }
    // Helper for compiling any advanced `withRecursive` queries.
    withRecursiveWrapped(alias, statementOrColumnList, nothingOrStatement) {
      this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
      this._statements[this._statements.length - 1].recursive = true;
      return this;
    }
    // Select
    // ------
    // Adds a column or columns to the list of "columns"
    // being selected on the query.
    columns(column) {
      if (!column && column !== 0) return this;
      this._statements.push({
        grouping: "columns",
        value: normalizeArr(...arguments)
      });
      return this;
    }
    // Adds a comment to the query
    comment(txt) {
      if (!isString(txt)) {
        throw new Error("Comment must be a string");
      }
      const forbiddenChars = ["/*", "*/", "?"];
      if (forbiddenChars.some((chars) => txt.includes(chars))) {
        throw new Error(`Cannot include ${forbiddenChars.join(", ")} in comment`);
      }
      this._comments.push({
        comment: txt
      });
      return this;
    }
    // Allow for a sub-select to be explicitly aliased as a column,
    // without needing to compile the query in a where.
    as(column) {
      this._single.as = column;
      return this;
    }
    // Adds a single hint or an array of hits to the list of "hintComments" on the query.
    hintComment(hints) {
      hints = Array.isArray(hints) ? hints : [hints];
      if (hints.some((hint) => !isString(hint))) {
        throw new Error("Hint comment must be a string");
      }
      if (hints.some((hint) => hint.includes("/*") || hint.includes("*/"))) {
        throw new Error('Hint comment cannot include "/*" or "*/"');
      }
      if (hints.some((hint) => hint.includes("?"))) {
        throw new Error('Hint comment cannot include "?"');
      }
      this._statements.push({
        grouping: "hintComments",
        value: hints
      });
      return this;
    }
    // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
    withSchema(schemaName) {
      this._single.schema = schemaName;
      return this;
    }
    // Sets the `tableName` on the query.
    // Alias to "from" for select and "into" for insert statements
    // e.g. builder.insert({a: value}).into('tableName')
    // `options`: options object containing keys:
    //   - `only`: whether the query should use SQL's ONLY to not return
    //           inheriting table data. Defaults to false.
    table(tableName, options = {}) {
      this._single.table = tableName;
      this._single.only = options.only === true;
      return this;
    }
    // Adds a `distinct` clause to the query.
    distinct(...args) {
      this._statements.push({
        grouping: "columns",
        value: normalizeArr(...args),
        distinct: true
      });
      return this;
    }
    distinctOn(...args) {
      if (isEmpty(args)) {
        throw new Error("distinctOn requires at least on argument");
      }
      this._statements.push({
        grouping: "columns",
        value: normalizeArr(...args),
        distinctOn: true
      });
      return this;
    }
    // Adds a join clause to the query, allowing for advanced joins
    // with an anonymous function as the second argument.
    join(table, first2, ...args) {
      let join;
      const schema = table instanceof Builder || typeof table === "function" ? void 0 : this._single.schema;
      const joinType = this._joinType();
      if (typeof first2 === "function") {
        join = new JoinClause(table, joinType, schema);
        first2.call(join, join);
      } else if (joinType === "raw") {
        join = new JoinClause(this.client.raw(table, first2), "raw");
      } else {
        join = new JoinClause(table, joinType, schema);
        if (first2) {
          join.on(first2, ...args);
        }
      }
      this._statements.push(join);
      return this;
    }
    using(tables) {
      throw new Error(
        "'using' function is only available in PostgreSQL dialect with Delete statements."
      );
    }
    // JOIN blocks:
    innerJoin(...args) {
      return this._joinType("inner").join(...args);
    }
    leftJoin(...args) {
      return this._joinType("left").join(...args);
    }
    leftOuterJoin(...args) {
      return this._joinType("left outer").join(...args);
    }
    rightJoin(...args) {
      return this._joinType("right").join(...args);
    }
    rightOuterJoin(...args) {
      return this._joinType("right outer").join(...args);
    }
    outerJoin(...args) {
      return this._joinType("outer").join(...args);
    }
    fullOuterJoin(...args) {
      return this._joinType("full outer").join(...args);
    }
    crossJoin(...args) {
      return this._joinType("cross").join(...args);
    }
    joinRaw(...args) {
      return this._joinType("raw").join(...args);
    }
    // Where modifiers:
    get or() {
      return this._bool("or");
    }
    get not() {
      return this._not(true);
    }
    // The where function can be used in several ways:
    // The most basic is `where(key, value)`, which expands to
    // where key = value.
    where(column, operator, value) {
      const argsLength = arguments.length;
      if (column === false || column === true) {
        return this.where(1, "=", column ? 1 : 0);
      }
      if (typeof column === "function") {
        return this.whereWrapped(column);
      }
      if (isObject(column) && !column.isRawInstance)
        return this._objectWhere(column);
      if (column && column.isRawInstance && argsLength === 1)
        return this.whereRaw(column);
      if (argsLength === 2) {
        value = operator;
        operator = "=";
        if (value === null) {
          return this.whereNull(column);
        }
      }
      const checkOperator = `${operator}`.toLowerCase().trim();
      if (argsLength === 3) {
        if (checkOperator === "in" || checkOperator === "not in") {
          return this._not(checkOperator === "not in").whereIn(column, value);
        }
        if (checkOperator === "between" || checkOperator === "not between") {
          return this._not(checkOperator === "not between").whereBetween(
            column,
            value
          );
        }
      }
      if (value === null) {
        if (checkOperator === "is" || checkOperator === "is not") {
          return this._not(checkOperator === "is not").whereNull(column);
        }
      }
      this._statements.push({
        grouping: "where",
        type: "whereBasic",
        column,
        operator,
        value,
        not: this._not(),
        bool: this._bool(),
        asColumn: this._asColumnFlag
      });
      return this;
    }
    whereColumn(...args) {
      this._asColumnFlag = true;
      this.where(...args);
      this._asColumnFlag = false;
      return this;
    }
    // Adds an `or where` clause to the query.
    orWhere(column, ...args) {
      this._bool("or");
      const obj = column;
      if (isObject(obj) && !obj.isRawInstance) {
        return this.whereWrapped(function() {
          for (const key in obj) {
            this.andWhere(key, obj[key]);
          }
        });
      }
      return this.where(column, ...args);
    }
    orWhereColumn(column, ...args) {
      this._bool("or");
      const obj = column;
      if (isObject(obj) && !obj.isRawInstance) {
        return this.whereWrapped(function() {
          for (const key in obj) {
            this.andWhereColumn(key, "=", obj[key]);
          }
        });
      }
      return this.whereColumn(column, ...args);
    }
    // Adds an `not where` clause to the query.
    whereNot(column, ...args) {
      if (args.length >= 2) {
        if (args[0] === "in" || args[0] === "between") {
          this.client.logger.warn(
            'whereNot is not suitable for "in" and "between" type subqueries. You should use "not in" and "not between" instead.'
          );
        }
      }
      return this._not(true).where(column, ...args);
    }
    whereNotColumn(...args) {
      return this._not(true).whereColumn(...args);
    }
    // Adds an `or not where` clause to the query.
    orWhereNot(...args) {
      return this._bool("or").whereNot(...args);
    }
    orWhereNotColumn(...args) {
      return this._bool("or").whereNotColumn(...args);
    }
    // Processes an object literal provided in a "where" clause.
    _objectWhere(obj) {
      const boolVal = this._bool();
      const notVal = this._not() ? "Not" : "";
      for (const key in obj) {
        this[boolVal + "Where" + notVal](key, obj[key]);
      }
      return this;
    }
    // Adds a raw `where` clause to the query.
    whereRaw(sql, bindings2) {
      const raw2 = sql.isRawInstance ? sql : this.client.raw(sql, bindings2);
      this._statements.push({
        grouping: "where",
        type: "whereRaw",
        value: raw2,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orWhereRaw(sql, bindings2) {
      return this._bool("or").whereRaw(sql, bindings2);
    }
    // Helper for compiling any advanced `where` queries.
    whereWrapped(callback) {
      this._statements.push({
        grouping: "where",
        type: "whereWrapped",
        value: callback,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds a `where exists` clause to the query.
    whereExists(callback) {
      this._statements.push({
        grouping: "where",
        type: "whereExists",
        value: callback,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds an `or where exists` clause to the query.
    orWhereExists(callback) {
      return this._bool("or").whereExists(callback);
    }
    // Adds a `where not exists` clause to the query.
    whereNotExists(callback) {
      return this._not(true).whereExists(callback);
    }
    // Adds a `or where not exists` clause to the query.
    orWhereNotExists(callback) {
      return this._bool("or").whereNotExists(callback);
    }
    // Adds a `where in` clause to the query.
    whereIn(column, values) {
      if (Array.isArray(values) && isEmpty(values))
        return this.where(this._not());
      this._statements.push({
        grouping: "where",
        type: "whereIn",
        column,
        value: values,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds a `or where in` clause to the query.
    orWhereIn(column, values) {
      return this._bool("or").whereIn(column, values);
    }
    // Adds a `where not in` clause to the query.
    whereNotIn(column, values) {
      return this._not(true).whereIn(column, values);
    }
    // Adds a `or where not in` clause to the query.
    orWhereNotIn(column, values) {
      return this._bool("or")._not(true).whereIn(column, values);
    }
    // Adds a `where null` clause to the query.
    whereNull(column) {
      this._statements.push({
        grouping: "where",
        type: "whereNull",
        column,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds a `or where null` clause to the query.
    orWhereNull(column) {
      return this._bool("or").whereNull(column);
    }
    // Adds a `where not null` clause to the query.
    whereNotNull(column) {
      return this._not(true).whereNull(column);
    }
    // Adds a `or where not null` clause to the query.
    orWhereNotNull(column) {
      return this._bool("or").whereNotNull(column);
    }
    // Adds a `where between` clause to the query.
    whereBetween(column, values) {
      assert(
        Array.isArray(values),
        "The second argument to whereBetween must be an array."
      );
      assert(
        values.length === 2,
        "You must specify 2 values for the whereBetween clause"
      );
      this._statements.push({
        grouping: "where",
        type: "whereBetween",
        column,
        value: values,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds a `where not between` clause to the query.
    whereNotBetween(column, values) {
      return this._not(true).whereBetween(column, values);
    }
    // Adds a `or where between` clause to the query.
    orWhereBetween(column, values) {
      return this._bool("or").whereBetween(column, values);
    }
    // Adds a `or where not between` clause to the query.
    orWhereNotBetween(column, values) {
      return this._bool("or").whereNotBetween(column, values);
    }
    _whereLike(type, column, value) {
      this._statements.push({
        grouping: "where",
        type,
        column,
        value,
        not: this._not(),
        bool: this._bool(),
        asColumn: this._asColumnFlag
      });
      return this;
    }
    // Adds a `where like` clause to the query.
    whereLike(column, value) {
      return this._whereLike("whereLike", column, value);
    }
    // Adds a `or where like` clause to the query.
    orWhereLike(column, value) {
      return this._bool("or")._whereLike("whereLike", column, value);
    }
    // Adds a `where ilike` clause to the query.
    whereILike(column, value) {
      return this._whereLike("whereILike", column, value);
    }
    // Adds a `or where ilike` clause to the query.
    orWhereILike(column, value) {
      return this._bool("or")._whereLike("whereILike", column, value);
    }
    // Adds a `group by` clause to the query.
    groupBy(item) {
      if (item && item.isRawInstance) {
        return this.groupByRaw.apply(this, arguments);
      }
      this._statements.push({
        grouping: "group",
        type: "groupByBasic",
        value: normalizeArr(...arguments)
      });
      return this;
    }
    // Adds a raw `group by` clause to the query.
    groupByRaw(sql, bindings2) {
      const raw2 = sql.isRawInstance ? sql : this.client.raw(sql, bindings2);
      this._statements.push({
        grouping: "group",
        type: "groupByRaw",
        value: raw2
      });
      return this;
    }
    // Adds a `order by` clause to the query.
    orderBy(column, direction, nulls = "") {
      if (Array.isArray(column)) {
        return this._orderByArray(column);
      }
      this._statements.push({
        grouping: "order",
        type: "orderByBasic",
        value: column,
        direction,
        nulls
      });
      return this;
    }
    // Adds a `order by` with multiple columns to the query.
    _orderByArray(columnDefs) {
      for (let i = 0; i < columnDefs.length; i++) {
        const columnInfo = columnDefs[i];
        if (isObject(columnInfo)) {
          this._statements.push({
            grouping: "order",
            type: "orderByBasic",
            value: columnInfo["column"],
            direction: columnInfo["order"],
            nulls: columnInfo["nulls"]
          });
        } else if (isString(columnInfo) || isNumber(columnInfo)) {
          this._statements.push({
            grouping: "order",
            type: "orderByBasic",
            value: columnInfo
          });
        }
      }
      return this;
    }
    // Add a raw `order by` clause to the query.
    orderByRaw(sql, bindings2) {
      const raw2 = sql.isRawInstance ? sql : this.client.raw(sql, bindings2);
      this._statements.push({
        grouping: "order",
        type: "orderByRaw",
        value: raw2
      });
      return this;
    }
    _union(clause, args) {
      let callbacks = args[0];
      let wrap = args[1];
      if (args.length === 1 || args.length === 2 && isBoolean(wrap)) {
        if (!Array.isArray(callbacks)) {
          callbacks = [callbacks];
        }
        for (let i = 0, l = callbacks.length; i < l; i++) {
          this._statements.push({
            grouping: "union",
            clause,
            value: callbacks[i],
            wrap: wrap || false
          });
        }
      } else {
        callbacks = toArray(args).slice(0, args.length - 1);
        wrap = args[args.length - 1];
        if (!isBoolean(wrap)) {
          callbacks.push(wrap);
          wrap = false;
        }
        this._union(clause, [callbacks, wrap]);
      }
      return this;
    }
    // Add a union statement to the query.
    union(...args) {
      return this._union("union", args);
    }
    // Adds a union all statement to the query.
    unionAll(...args) {
      return this._union("union all", args);
    }
    intersect(...args) {
      return this._union("intersect", args);
    }
    except(...args) {
      return this._union("except", args);
    }
    // Adds a `having` clause to the query.
    having(column, operator, value) {
      if (column.isRawInstance && arguments.length === 1) {
        return this.havingRaw(column);
      }
      if (typeof column === "function") {
        return this.havingWrapped(column);
      }
      this._statements.push({
        grouping: "having",
        type: "havingBasic",
        column,
        operator,
        value,
        bool: this._bool(),
        not: this._not()
      });
      return this;
    }
    orHaving(column, ...args) {
      this._bool("or");
      const obj = column;
      if (isObject(obj) && !obj.isRawInstance) {
        return this.havingWrapped(function() {
          for (const key in obj) {
            this.andHaving(key, obj[key]);
          }
        });
      }
      return this.having(column, ...args);
    }
    // Helper for compiling any advanced `having` queries.
    havingWrapped(callback) {
      this._statements.push({
        grouping: "having",
        type: "havingWrapped",
        value: callback,
        bool: this._bool(),
        not: this._not()
      });
      return this;
    }
    havingNull(column) {
      this._statements.push({
        grouping: "having",
        type: "havingNull",
        column,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orHavingNull(callback) {
      return this._bool("or").havingNull(callback);
    }
    havingNotNull(callback) {
      return this._not(true).havingNull(callback);
    }
    orHavingNotNull(callback) {
      return this._not(true)._bool("or").havingNull(callback);
    }
    havingExists(callback) {
      this._statements.push({
        grouping: "having",
        type: "havingExists",
        value: callback,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orHavingExists(callback) {
      return this._bool("or").havingExists(callback);
    }
    havingNotExists(callback) {
      return this._not(true).havingExists(callback);
    }
    orHavingNotExists(callback) {
      return this._not(true)._bool("or").havingExists(callback);
    }
    havingBetween(column, values) {
      assert(
        Array.isArray(values),
        "The second argument to havingBetween must be an array."
      );
      assert(
        values.length === 2,
        "You must specify 2 values for the havingBetween clause"
      );
      this._statements.push({
        grouping: "having",
        type: "havingBetween",
        column,
        value: values,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    orHavingBetween(column, values) {
      return this._bool("or").havingBetween(column, values);
    }
    havingNotBetween(column, values) {
      return this._not(true).havingBetween(column, values);
    }
    orHavingNotBetween(column, values) {
      return this._not(true)._bool("or").havingBetween(column, values);
    }
    havingIn(column, values) {
      if (Array.isArray(values) && isEmpty(values))
        return this.where(this._not());
      this._statements.push({
        grouping: "having",
        type: "havingIn",
        column,
        value: values,
        not: this._not(),
        bool: this._bool()
      });
      return this;
    }
    // Adds a `or where in` clause to the query.
    orHavingIn(column, values) {
      return this._bool("or").havingIn(column, values);
    }
    // Adds a `where not in` clause to the query.
    havingNotIn(column, values) {
      return this._not(true).havingIn(column, values);
    }
    // Adds a `or where not in` clause to the query.
    orHavingNotIn(column, values) {
      return this._bool("or")._not(true).havingIn(column, values);
    }
    // Adds a raw `having` clause to the query.
    havingRaw(sql, bindings2) {
      const raw2 = sql.isRawInstance ? sql : this.client.raw(sql, bindings2);
      this._statements.push({
        grouping: "having",
        type: "havingRaw",
        value: raw2,
        bool: this._bool(),
        not: this._not()
      });
      return this;
    }
    orHavingRaw(sql, bindings2) {
      return this._bool("or").havingRaw(sql, bindings2);
    }
    // set the skip binding parameter (= insert the raw value in the query) for an attribute.
    _setSkipBinding(attribute, options) {
      let skipBinding = options;
      if (isObject(options)) {
        skipBinding = options.skipBinding;
      }
      this._single.skipBinding = this._single.skipBinding || {};
      this._single.skipBinding[attribute] = skipBinding;
    }
    // Only allow a single "offset" to be set for the current query.
    offset(value, options) {
      if (value == null || value.isRawInstance || value instanceof Builder) {
        this._single.offset = value;
      } else {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
          this.client.logger.warn("A valid integer must be provided to offset");
        } else if (val < 0) {
          throw new Error(`A non-negative integer must be provided to offset.`);
        } else {
          this._single.offset = val;
        }
      }
      this._setSkipBinding("offset", options);
      return this;
    }
    // Only allow a single "limit" to be set for the current query.
    limit(value, options) {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        this.client.logger.warn("A valid integer must be provided to limit");
      } else {
        this._single.limit = val;
        this._setSkipBinding("limit", options);
      }
      return this;
    }
    // Retrieve the "count" result of the query.
    count(column, options) {
      return this._aggregate("count", column || "*", options);
    }
    // Retrieve the minimum value of a given column.
    min(column, options) {
      return this._aggregate("min", column, options);
    }
    // Retrieve the maximum value of a given column.
    max(column, options) {
      return this._aggregate("max", column, options);
    }
    // Retrieve the sum of the values of a given column.
    sum(column, options) {
      return this._aggregate("sum", column, options);
    }
    // Retrieve the average of the values of a given column.
    avg(column, options) {
      return this._aggregate("avg", column, options);
    }
    // Retrieve the "count" of the distinct results of the query.
    countDistinct(...columns) {
      let options;
      if (columns.length > 1 && isPlainObject(last(columns))) {
        [options] = columns.splice(columns.length - 1, 1);
      }
      if (!columns.length) {
        columns = "*";
      } else if (columns.length === 1) {
        columns = columns[0];
      }
      return this._aggregate("count", columns, { ...options, distinct: true });
    }
    // Retrieve the sum of the distinct values of a given column.
    sumDistinct(column, options) {
      return this._aggregate("sum", column, { ...options, distinct: true });
    }
    // Retrieve the vg of the distinct results of the query.
    avgDistinct(column, options) {
      return this._aggregate("avg", column, { ...options, distinct: true });
    }
    // Increments a column's value by the specified amount.
    increment(column, amount = 1) {
      if (isObject(column)) {
        for (const key in column) {
          this._counter(key, column[key]);
        }
        return this;
      }
      return this._counter(column, amount);
    }
    // Decrements a column's value by the specified amount.
    decrement(column, amount = 1) {
      if (isObject(column)) {
        for (const key in column) {
          this._counter(key, -column[key]);
        }
        return this;
      }
      return this._counter(column, -amount);
    }
    // Clears increments/decrements
    clearCounters() {
      this._single.counter = {};
      return this;
    }
    // Sets the values for a `select` query, informing that only the first
    // row should be returned (limit 1).
    first(...args) {
      if (this._method && this._method !== "select") {
        throw new Error(`Cannot chain .first() on "${this._method}" query`);
      }
      this.select(normalizeArr(...args));
      this._method = "first";
      this.limit(1);
      return this;
    }
    // Use existing connection to execute the query
    // Same value that client.acquireConnection() for an according client returns should be passed
    connection(_connection) {
      this._connection = _connection;
      this.client.processPassedConnection(_connection);
      return this;
    }
    // Pluck a column from a query.
    pluck(column) {
      if (this._method && this._method !== "select") {
        throw new Error(`Cannot chain .pluck() on "${this._method}" query`);
      }
      this._method = "pluck";
      this._single.pluck = column;
      this._statements.push({
        grouping: "columns",
        type: "pluck",
        value: column
      });
      return this;
    }
    // Deprecated. Remove everything from select clause
    clearSelect() {
      this._clearGrouping("columns");
      return this;
    }
    // Deprecated. Remove everything from where clause
    clearWhere() {
      this._clearGrouping("where");
      return this;
    }
    // Deprecated. Remove everything from group clause
    clearGroup() {
      this._clearGrouping("group");
      return this;
    }
    // Deprecated. Remove everything from order clause
    clearOrder() {
      this._clearGrouping("order");
      return this;
    }
    // Deprecated. Remove everything from having clause
    clearHaving() {
      this._clearGrouping("having");
      return this;
    }
    // Remove everything from statement clause
    clear(statement) {
      if (!CLEARABLE_STATEMENTS.has(statement))
        throw new Error(`Knex Error: unknown statement '${statement}'`);
      if (statement.startsWith("counter")) return this.clearCounters();
      if (statement === "select") {
        statement = "columns";
      }
      this._clearGrouping(statement);
      return this;
    }
    // Insert & Update
    // ------
    // Sets the values for an `insert` query.
    insert(values, returning, options) {
      this._method = "insert";
      if (!isEmpty(returning)) this.returning(returning, options);
      this._single.insert = values;
      return this;
    }
    // Sets the values for an `update`, allowing for both
    // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
    update(values, returning, options) {
      let ret;
      const obj = this._single.update || {};
      this._method = "update";
      if (isString(values)) {
        if (isPlainObject(returning)) {
          obj[values] = JSON.stringify(returning);
        } else {
          obj[values] = returning;
        }
        if (arguments.length > 2) {
          ret = arguments[2];
        }
      } else {
        const keys = Object.keys(values);
        if (this._single.update) {
          this.client.logger.warn("Update called multiple times with objects.");
        }
        let i = -1;
        while (++i < keys.length) {
          obj[keys[i]] = values[keys[i]];
        }
        ret = arguments[1];
      }
      if (!isEmpty(ret)) this.returning(ret, options);
      this._single.update = obj;
      return this;
    }
    // Sets the returning value for the query.
    returning(returning, options) {
      this._single.returning = returning;
      this._single.options = options;
      return this;
    }
    onConflict(columns) {
      if (typeof columns === "string") {
        columns = [columns];
      }
      return new OnConflictBuilder(this, columns || true);
    }
    // Delete
    // ------
    // Executes a delete statement on the query;
    delete(ret, options) {
      this._method = "del";
      if (!isEmpty(ret)) this.returning(ret, options);
      return this;
    }
    // Truncates a table, ends the query chain.
    truncate(tableName) {
      this._method = "truncate";
      if (tableName) {
        this._single.table = tableName;
      }
      return this;
    }
    // Retrieves columns for the table specified by `knex(tableName)`
    columnInfo(column) {
      this._method = "columnInfo";
      this._single.columnInfo = column;
      return this;
    }
    // Set a lock for update constraint.
    forUpdate(...tables) {
      this._single.lock = lockMode.forUpdate;
      if (tables.length === 1 && Array.isArray(tables[0])) {
        this._single.lockTables = tables[0];
      } else {
        this._single.lockTables = tables;
      }
      return this;
    }
    // Set a lock for share constraint.
    forShare(...tables) {
      this._single.lock = lockMode.forShare;
      this._single.lockTables = tables;
      return this;
    }
    // Set a lock for no key update constraint.
    forNoKeyUpdate(...tables) {
      this._single.lock = lockMode.forNoKeyUpdate;
      this._single.lockTables = tables;
      return this;
    }
    // Set a lock for key share constraint.
    forKeyShare(...tables) {
      this._single.lock = lockMode.forKeyShare;
      this._single.lockTables = tables;
      return this;
    }
    // Skips locked rows when using a lock constraint.
    skipLocked() {
      if (!this._isSelectQuery()) {
        throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
      }
      if (!this._hasLockMode()) {
        throw new Error(
          ".skipLocked() can only be used after a call to .forShare() or .forUpdate()!"
        );
      }
      if (this._single.waitMode === waitMode.noWait) {
        throw new Error(".skipLocked() cannot be used together with .noWait()!");
      }
      this._single.waitMode = waitMode.skipLocked;
      return this;
    }
    // Causes error when acessing a locked row instead of waiting for it to be released.
    noWait() {
      if (!this._isSelectQuery()) {
        throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
      }
      if (!this._hasLockMode()) {
        throw new Error(
          ".noWait() can only be used after a call to .forShare() or .forUpdate()!"
        );
      }
      if (this._single.waitMode === waitMode.skipLocked) {
        throw new Error(".noWait() cannot be used together with .skipLocked()!");
      }
      this._single.waitMode = waitMode.noWait;
      return this;
    }
    // Takes a JS object of methods to call and calls them
    fromJS(obj) {
      each2(obj, (val, key) => {
        if (typeof this[key] !== "function") {
          this.client.logger.warn(`Knex Error: unknown key ${key}`);
        }
        if (Array.isArray(val)) {
          this[key].apply(this, val);
        } else {
          this[key](val);
        }
      });
      return this;
    }
    fromRaw(sql, bindings2) {
      const raw2 = sql.isRawInstance ? sql : this.client.raw(sql, bindings2);
      return this.from(raw2);
    }
    // Passes query to provided callback function, useful for e.g. composing
    // domain-specific helpers
    modify(callback) {
      callback.apply(this, [this].concat(tail(arguments)));
      return this;
    }
    upsert(values, returning, options) {
      throw new Error(
        `Upsert is not yet supported for dialect ${this.client.dialect}`
      );
    }
    // JSON support functions
    _json(nameFunction, params) {
      this._statements.push({
        grouping: "columns",
        type: "json",
        method: nameFunction,
        params
      });
      return this;
    }
    jsonExtract() {
      const column = arguments[0];
      let path;
      let alias;
      let singleValue = true;
      if (arguments.length >= 2) {
        path = arguments[1];
      }
      if (arguments.length >= 3) {
        alias = arguments[2];
      }
      if (arguments.length === 4) {
        singleValue = arguments[3];
      }
      if (arguments.length === 2 && Array.isArray(arguments[0]) && isBoolean(arguments[1])) {
        singleValue = arguments[1];
      }
      return this._json("jsonExtract", {
        column,
        path,
        alias,
        singleValue
        // boolean used only in MSSQL to use function for extract value instead of object/array.
      });
    }
    jsonSet(column, path, value, alias) {
      return this._json("jsonSet", {
        column,
        path,
        value,
        alias
      });
    }
    jsonInsert(column, path, value, alias) {
      return this._json("jsonInsert", {
        column,
        path,
        value,
        alias
      });
    }
    jsonRemove(column, path, alias) {
      return this._json("jsonRemove", {
        column,
        path,
        alias
      });
    }
    // Wheres for JSON
    _isJsonObject(jsonValue) {
      return isObject(jsonValue) && !(jsonValue instanceof Builder);
    }
    _whereJsonWrappedValue(type, column, value) {
      const whereJsonClause = {
        grouping: "where",
        type,
        column,
        value,
        not: this._not(),
        bool: this._bool(),
        asColumn: this._asColumnFlag
      };
      if (arguments[3]) {
        whereJsonClause.operator = arguments[3];
      }
      if (arguments[4]) {
        whereJsonClause.jsonPath = arguments[4];
      }
      this._statements.push(whereJsonClause);
    }
    whereJsonObject(column, value) {
      this._whereJsonWrappedValue("whereJsonObject", column, value);
      return this;
    }
    orWhereJsonObject(column, value) {
      return this._bool("or").whereJsonObject(column, value);
    }
    whereNotJsonObject(column, value) {
      return this._not(true).whereJsonObject(column, value);
    }
    orWhereNotJsonObject(column, value) {
      return this._bool("or").whereNotJsonObject(column, value);
    }
    whereJsonPath(column, path, operator, value) {
      this._whereJsonWrappedValue("whereJsonPath", column, value, operator, path);
      return this;
    }
    orWhereJsonPath(column, path, operator, value) {
      return this._bool("or").whereJsonPath(column, path, operator, value);
    }
    // Json superset wheres
    whereJsonSupersetOf(column, value) {
      this._whereJsonWrappedValue("whereJsonSupersetOf", column, value);
      return this;
    }
    whereJsonNotSupersetOf(column, value) {
      return this._not(true).whereJsonSupersetOf(column, value);
    }
    orWhereJsonSupersetOf(column, value) {
      return this._bool("or").whereJsonSupersetOf(column, value);
    }
    orWhereJsonNotSupersetOf(column, value) {
      return this._bool("or").whereJsonNotSupersetOf(column, value);
    }
    // Json subset wheres
    whereJsonSubsetOf(column, value) {
      this._whereJsonWrappedValue("whereJsonSubsetOf", column, value);
      return this;
    }
    whereJsonNotSubsetOf(column, value) {
      return this._not(true).whereJsonSubsetOf(column, value);
    }
    orWhereJsonSubsetOf(column, value) {
      return this._bool("or").whereJsonSubsetOf(column, value);
    }
    orWhereJsonNotSubsetOf(column, value) {
      return this._bool("or").whereJsonNotSubsetOf(column, value);
    }
    whereJsonHasNone(column, values) {
      this._not(true).whereJsonHasAll(column, values);
      return this;
    }
    // end of wheres for JSON
    _analytic(alias, second, third) {
      let analytic2;
      const { schema } = this._single;
      const method = this._analyticMethod();
      alias = typeof alias === "string" ? alias : null;
      assert(
        typeof second === "function" || second.isRawInstance || Array.isArray(second) || typeof second === "string" || typeof second === "object",
        `The second argument to an analytic function must be either a function, a raw,
       an array of string or object, an object or a single string.`
      );
      if (third) {
        assert(
          Array.isArray(third) || typeof third === "string" || typeof third === "object",
          "The third argument to an analytic function must be either a string, an array of string or object or an object."
        );
      }
      if (isFunction(second)) {
        analytic2 = new Analytic(method, schema, alias);
        second.call(analytic2, analytic2);
      } else if (second.isRawInstance) {
        const raw2 = second;
        analytic2 = {
          grouping: "columns",
          type: "analytic",
          method,
          raw: raw2,
          alias
        };
      } else {
        const order = !Array.isArray(second) ? [second] : second;
        let partitions = third || [];
        partitions = !Array.isArray(partitions) ? [partitions] : partitions;
        analytic2 = {
          grouping: "columns",
          type: "analytic",
          method,
          order,
          alias,
          partitions
        };
      }
      this._statements.push(analytic2);
      return this;
    }
    rank(...args) {
      return this._analyticMethod("rank")._analytic(...args);
    }
    denseRank(...args) {
      return this._analyticMethod("dense_rank")._analytic(...args);
    }
    rowNumber(...args) {
      return this._analyticMethod("row_number")._analytic(...args);
    }
    // ----------------------------------------------------------------------
    // Helper for the incrementing/decrementing queries.
    _counter(column, amount) {
      amount = parseFloat(amount);
      this._method = "update";
      this._single.counter = this._single.counter || {};
      this._single.counter[column] = amount;
      return this;
    }
    // Helper to get or set the "boolFlag" value.
    _bool(val) {
      if (arguments.length === 1) {
        this._boolFlag = val;
        return this;
      }
      const ret = this._boolFlag;
      this._boolFlag = "and";
      return ret;
    }
    // Helper to get or set the "notFlag" value.
    _not(val) {
      if (arguments.length === 1) {
        this._notFlag = val;
        return this;
      }
      const ret = this._notFlag;
      this._notFlag = false;
      return ret;
    }
    // Helper to get or set the "joinFlag" value.
    _joinType(val) {
      if (arguments.length === 1) {
        this._joinFlag = val;
        return this;
      }
      const ret = this._joinFlag || "inner";
      this._joinFlag = "inner";
      return ret;
    }
    _analyticMethod(val) {
      if (arguments.length === 1) {
        this._analyticFlag = val;
        return this;
      }
      return this._analyticFlag || "row_number";
    }
    // Helper for compiling any aggregate queries.
    _aggregate(method, column, options = {}) {
      this._statements.push({
        grouping: "columns",
        type: column.isRawInstance ? "aggregateRaw" : "aggregate",
        method,
        value: column,
        aggregateDistinct: options.distinct || false,
        alias: options.as
      });
      return this;
    }
    // Helper function for clearing or reseting a grouping type from the builder
    _clearGrouping(grouping) {
      if (grouping in this._single) {
        this._single[grouping] = void 0;
      } else {
        this._statements = reject(this._statements, { grouping });
      }
    }
    // Helper function that checks if the builder will emit a select query
    _isSelectQuery() {
      return SELECT_COMMANDS.has(this._method);
    }
    // Helper function that checks if the query has a lock mode set
    _hasLockMode() {
      return LOCK_MODES.has(this._single.lock);
    }
  }
  Builder.prototype.select = Builder.prototype.columns;
  Builder.prototype.column = Builder.prototype.columns;
  Builder.prototype.andWhereNot = Builder.prototype.whereNot;
  Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
  Builder.prototype.andWhere = Builder.prototype.where;
  Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
  Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
  Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
  Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
  Builder.prototype.andWhereJsonObject = Builder.prototype.whereJsonObject;
  Builder.prototype.andWhereNotJsonObject = Builder.prototype.whereNotJsonObject;
  Builder.prototype.andWhereJsonPath = Builder.prototype.whereJsonPath;
  Builder.prototype.andWhereLike = Builder.prototype.whereLike;
  Builder.prototype.andWhereILike = Builder.prototype.whereILike;
  Builder.prototype.andHaving = Builder.prototype.having;
  Builder.prototype.andHavingIn = Builder.prototype.havingIn;
  Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
  Builder.prototype.andHavingNull = Builder.prototype.havingNull;
  Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
  Builder.prototype.andHavingExists = Builder.prototype.havingExists;
  Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
  Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
  Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
  Builder.prototype.from = Builder.prototype.table;
  Builder.prototype.into = Builder.prototype.table;
  Builder.prototype.del = Builder.prototype.delete;
  augmentWithBuilderInterface(Builder);
  addQueryContext(Builder);
  Builder.extend = (methodName, fn) => {
    if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
      throw new Error(
        `Can't extend QueryBuilder with existing method ('${methodName}').`
      );
    }
    assign(Builder.prototype, { [methodName]: fn });
  };
  class OnConflictBuilder {
    constructor(builder2, columns) {
      this.builder = builder2;
      this._columns = columns;
    }
    // Sets insert query to ignore conflicts
    ignore() {
      this.builder._single.onConflict = this._columns;
      this.builder._single.ignore = true;
      return this.builder;
    }
    // Sets insert query to update on conflict
    merge(updates) {
      this.builder._single.onConflict = this._columns;
      this.builder._single.merge = { updates };
      return this.builder;
    }
    // Prevent
    then() {
      throw new Error(
        "Incomplete onConflict clause. .onConflict() must be directly followed by either .merge() or .ignore()"
      );
    }
  }
  querybuilder = Builder;
  return querybuilder;
}
var _arrayReduce;
var hasRequired_arrayReduce;
function require_arrayReduce() {
  if (hasRequired_arrayReduce) return _arrayReduce;
  hasRequired_arrayReduce = 1;
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
  _arrayReduce = arrayReduce;
  return _arrayReduce;
}
var _baseReduce;
var hasRequired_baseReduce;
function require_baseReduce() {
  if (hasRequired_baseReduce) return _baseReduce;
  hasRequired_baseReduce = 1;
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection2) {
      accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
    });
    return accumulator;
  }
  _baseReduce = baseReduce;
  return _baseReduce;
}
var reduce_1;
var hasRequiredReduce;
function requireReduce() {
  if (hasRequiredReduce) return reduce_1;
  hasRequiredReduce = 1;
  var arrayReduce = require_arrayReduce(), baseEach = require_baseEach(), baseIteratee = require_baseIteratee(), baseReduce = require_baseReduce(), isArray = requireIsArray();
  function reduce(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
    return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
  }
  reduce_1 = reduce;
  return reduce_1;
}
var transform_1;
var hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform_1;
  hasRequiredTransform = 1;
  var arrayEach = require_arrayEach(), baseCreate = require_baseCreate(), baseForOwn = require_baseForOwn(), baseIteratee = require_baseIteratee(), getPrototype = require_getPrototype(), isArray = requireIsArray(), isBuffer2 = requireIsBuffer(), isFunction = requireIsFunction(), isObject = requireIsObject(), isTypedArray = requireIsTypedArray();
  function transform(object, iteratee, accumulator) {
    var isArr = isArray(object), isArrLike = isArr || isBuffer2(object) || isTypedArray(object);
    iteratee = baseIteratee(iteratee, 4);
    if (accumulator == null) {
      var Ctor = object && object.constructor;
      if (isArrLike) {
        accumulator = isArr ? new Ctor() : [];
      } else if (isObject(object)) {
        accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
      } else {
        accumulator = {};
      }
    }
    (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
      return iteratee(accumulator, value, index, object2);
    });
    return accumulator;
  }
  transform_1 = transform;
  return transform_1;
}
var formatterUtils;
var hasRequiredFormatterUtils;
function requireFormatterUtils() {
  if (hasRequiredFormatterUtils) return formatterUtils;
  hasRequiredFormatterUtils = 1;
  const { isObject } = requireIs();
  function compileCallback(callback, method, client2, bindingsHolder) {
    const builder2 = client2.queryBuilder();
    callback.call(builder2, builder2);
    const compiler2 = client2.queryCompiler(builder2, bindingsHolder.bindings);
    return compiler2.toSQL(method || builder2._method || "select");
  }
  function wrapAsIdentifier(value, builder2, client2) {
    const queryContext = builder2.queryContext();
    return client2.wrapIdentifier((value || "").trim(), queryContext);
  }
  function formatDefault(value, type, client2) {
    if (value === void 0) {
      return "";
    } else if (value === null) {
      return "null";
    } else if (value && value.isRawInstance) {
      return value.toQuery();
    } else if (type === "bool") {
      if (value === "false") value = 0;
      return `'${value ? 1 : 0}'`;
    } else if ((type === "json" || type === "jsonb") && isObject(value)) {
      return `'${JSON.stringify(value)}'`;
    } else {
      return client2._escapeBinding(value.toString());
    }
  }
  formatterUtils = {
    compileCallback,
    wrapAsIdentifier,
    formatDefault
  };
  return formatterUtils;
}
var wrappingFormatter;
var hasRequiredWrappingFormatter;
function requireWrappingFormatter() {
  if (hasRequiredWrappingFormatter) return wrappingFormatter;
  hasRequiredWrappingFormatter = 1;
  const transform = requireTransform();
  const QueryBuilder = requireQuerybuilder();
  const { compileCallback, wrapAsIdentifier } = requireFormatterUtils();
  const orderBys = ["asc", "desc"];
  const operators = transform(
    [
      "=",
      "<",
      ">",
      "<=",
      ">=",
      "<>",
      "!=",
      "like",
      "not like",
      "between",
      "not between",
      "ilike",
      "not ilike",
      "exists",
      "not exist",
      "rlike",
      "not rlike",
      "regexp",
      "not regexp",
      "match",
      "&",
      "|",
      "^",
      "<<",
      ">>",
      "~",
      "~=",
      "~*",
      "!~",
      "!~*",
      "#",
      "&&",
      "@>",
      "<@",
      "||",
      "&<",
      "&>",
      "-|-",
      "@@",
      "!!",
      ["?", "\\?"],
      ["?|", "\\?|"],
      ["?&", "\\?&"]
    ],
    (result, key) => {
      if (Array.isArray(key)) {
        result[key[0]] = key[1];
      } else {
        result[key] = key;
      }
    },
    {}
  );
  function columnize(target, builder2, client2, bindingHolder) {
    const columns = Array.isArray(target) ? target : [target];
    let str = "", i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ", ";
      str += wrap(columns[i], void 0, builder2, client2, bindingHolder);
    }
    return str;
  }
  function wrap(value, isParameter, builder2, client2, bindingHolder) {
    const raw2 = unwrapRaw(value, isParameter, builder2, client2, bindingHolder);
    if (raw2) return raw2;
    switch (typeof value) {
      case "function":
        return outputQuery(
          compileCallback(value, void 0, client2, bindingHolder),
          true,
          builder2,
          client2
        );
      case "object":
        return parseObject(value, builder2, client2, bindingHolder);
      case "number":
        return value;
      default:
        return wrapString(value + "", builder2, client2);
    }
  }
  function unwrapRaw(value, isParameter, builder2, client2, bindingsHolder) {
    let query;
    if (value instanceof QueryBuilder) {
      query = client2.queryCompiler(value).toSQL();
      if (query.bindings) {
        bindingsHolder.bindings.push(...query.bindings);
      }
      return outputQuery(query, isParameter, builder2, client2);
    }
    if (value && value.isRawInstance) {
      value.client = client2;
      if (builder2._queryContext) {
        value.queryContext = () => {
          return builder2._queryContext;
        };
      }
      query = value.toSQL();
      if (query.bindings) {
        bindingsHolder.bindings.push(...query.bindings);
      }
      return query.sql;
    }
    if (isParameter) {
      bindingsHolder.bindings.push(value);
    }
  }
  function operator(value, builder2, client2, bindingsHolder) {
    const raw2 = unwrapRaw(value, void 0, builder2, client2, bindingsHolder);
    if (raw2) return raw2;
    const operator2 = operators[(value || "").toLowerCase()];
    if (!operator2) {
      throw new TypeError(`The operator "${value}" is not permitted`);
    }
    return operator2;
  }
  function wrapString(value, builder2, client2) {
    const asIndex = value.toLowerCase().indexOf(" as ");
    if (asIndex !== -1) {
      const first2 = value.slice(0, asIndex);
      const second = value.slice(asIndex + 4);
      return client2.alias(
        wrapString(first2, builder2, client2),
        wrapAsIdentifier(second, builder2, client2)
      );
    }
    const wrapped = [];
    let i = -1;
    const segments = value.split(".");
    while (++i < segments.length) {
      value = segments[i];
      if (i === 0 && segments.length > 1) {
        wrapped.push(wrapString((value || "").trim(), builder2, client2));
      } else {
        wrapped.push(wrapAsIdentifier(value, builder2, client2));
      }
    }
    return wrapped.join(".");
  }
  function parseObject(obj, builder2, client2, formatter2) {
    const ret = [];
    for (const alias in obj) {
      const queryOrIdentifier = obj[alias];
      if (typeof queryOrIdentifier === "function") {
        const compiled = compileCallback(
          queryOrIdentifier,
          void 0,
          client2,
          formatter2
        );
        compiled.as = alias;
        ret.push(outputQuery(compiled, true, builder2, client2));
      } else if (queryOrIdentifier instanceof QueryBuilder) {
        ret.push(
          client2.alias(
            `(${wrap(queryOrIdentifier, void 0, builder2, client2, formatter2)})`,
            wrapAsIdentifier(alias, builder2, client2)
          )
        );
      } else {
        ret.push(
          client2.alias(
            wrap(queryOrIdentifier, void 0, builder2, client2, formatter2),
            wrapAsIdentifier(alias, builder2, client2)
          )
        );
      }
    }
    return ret.join(", ");
  }
  function outputQuery(compiled, isParameter, builder2, client2) {
    let sql = compiled.sql || "";
    if (sql) {
      if ((compiled.method === "select" || compiled.method === "first") && (isParameter || compiled.as)) {
        sql = `(${sql})`;
        if (compiled.as)
          return client2.alias(sql, wrapString(compiled.as, builder2, client2));
      }
    }
    return sql;
  }
  function rawOrFn(value, method, builder2, client2, bindingHolder) {
    if (typeof value === "function") {
      return outputQuery(
        compileCallback(value, method, client2, bindingHolder),
        void 0,
        builder2,
        client2
      );
    }
    return unwrapRaw(value, void 0, builder2, client2, bindingHolder) || "";
  }
  function direction(value, builder2, client2, bindingsHolder) {
    const raw2 = unwrapRaw(value, void 0, builder2, client2, bindingsHolder);
    if (raw2) return raw2;
    return orderBys.indexOf((value || "").toLowerCase()) !== -1 ? value : "asc";
  }
  wrappingFormatter = {
    columnize,
    direction,
    operator,
    outputQuery,
    rawOrFn,
    unwrapRaw,
    wrap,
    wrapString
  };
  return wrappingFormatter;
}
var rawFormatter;
var hasRequiredRawFormatter;
function requireRawFormatter() {
  if (hasRequiredRawFormatter) return rawFormatter;
  hasRequiredRawFormatter = 1;
  const { columnize } = requireWrappingFormatter();
  function replaceRawArrBindings(raw2, client2) {
    const bindingsHolder = {
      bindings: []
    };
    const builder2 = raw2;
    const expectedBindings = raw2.bindings.length;
    const values = raw2.bindings;
    let index = 0;
    const sql = raw2.sql.replace(/\\?\?\??/g, function(match) {
      if (match === "\\?") {
        return match;
      }
      const value = values[index++];
      if (match === "??") {
        return columnize(value, builder2, client2, bindingsHolder);
      }
      return client2.parameter(value, builder2, bindingsHolder);
    });
    if (expectedBindings !== index) {
      throw new Error(`Expected ${expectedBindings} bindings, saw ${index}`);
    }
    return {
      method: "raw",
      sql,
      bindings: bindingsHolder.bindings
    };
  }
  function replaceKeyBindings(raw2, client2) {
    const bindingsHolder = {
      bindings: []
    };
    const builder2 = raw2;
    const values = raw2.bindings;
    const regex = /\\?(:(\w+):(?=::)|:(\w+):(?!:)|:(\w+))/g;
    const sql = raw2.sql.replace(regex, function(match, p1, p2, p3, p4) {
      if (match !== p1) {
        return p1;
      }
      const part = p2 || p3 || p4;
      const key = match.trim();
      const isIdentifier = key[key.length - 1] === ":";
      const value = values[part];
      if (value === void 0) {
        if (Object.prototype.hasOwnProperty.call(values, part)) {
          bindingsHolder.bindings.push(value);
        }
        return match;
      }
      if (isIdentifier) {
        return match.replace(
          p1,
          columnize(value, builder2, client2, bindingsHolder)
        );
      }
      return match.replace(p1, client2.parameter(value, builder2, bindingsHolder));
    });
    return {
      method: "raw",
      sql,
      bindings: bindingsHolder.bindings
    };
  }
  rawFormatter = {
    replaceKeyBindings,
    replaceRawArrBindings
  };
  return rawFormatter;
}
var nanoid_1;
var hasRequiredNanoid;
function requireNanoid() {
  if (hasRequiredNanoid) return nanoid_1;
  hasRequiredNanoid = 1;
  const urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
  const numberAlphabet = "0123456789";
  function nanoid(size = 21) {
    let id = "";
    let i = size;
    while (i--) {
      id += urlAlphabet[Math.random() * 64 | 0];
    }
    return id;
  }
  function nanonum(size = 21) {
    let id = "";
    let i = size;
    while (i--) {
      id += numberAlphabet[Math.random() * 10 | 0];
    }
    return id;
  }
  nanoid_1 = { nanoid, nanonum };
  return nanoid_1;
}
var raw;
var hasRequiredRaw;
function requireRaw() {
  if (hasRequiredRaw) return raw;
  hasRequiredRaw = 1;
  const { EventEmitter } = require$$0;
  const debug = requireSrc();
  const assign = requireAssign();
  const isPlainObject = requireIsPlainObject();
  const reduce = requireReduce();
  const {
    replaceRawArrBindings,
    replaceKeyBindings
  } = requireRawFormatter();
  const helpers2 = requireHelpers$1();
  const saveAsyncStack2 = requireSaveAsyncStack();
  const { nanoid } = requireNanoid();
  const { isNumber, isObject } = requireIs();
  const {
    augmentWithBuilderInterface
  } = requireBuilderInterfaceAugmenter();
  const debugBindings = debug("knex:bindings");
  class Raw extends EventEmitter {
    constructor(client2) {
      super();
      this.client = client2;
      this.sql = "";
      this.bindings = [];
      this._wrappedBefore = void 0;
      this._wrappedAfter = void 0;
      if (client2 && client2.config) {
        this._debug = client2.config.debug;
        saveAsyncStack2(this, 4);
      }
    }
    set(sql, bindings2) {
      this.sql = sql;
      this.bindings = isObject(bindings2) && !bindings2.toSQL || bindings2 === void 0 ? bindings2 : [bindings2];
      return this;
    }
    timeout(ms2, { cancel } = {}) {
      if (isNumber(ms2) && ms2 > 0) {
        this._timeout = ms2;
        if (cancel) {
          this.client.assertCanCancelQuery();
          this._cancelOnTimeout = true;
        }
      }
      return this;
    }
    // Wraps the current sql with `before` and `after`.
    wrap(before, after) {
      this._wrappedBefore = before;
      this._wrappedAfter = after;
      return this;
    }
    // Calls `toString` on the Knex object.
    toString() {
      return this.toQuery();
    }
    // Returns the raw sql for the query.
    toSQL(method, tz) {
      let obj;
      if (Array.isArray(this.bindings)) {
        obj = replaceRawArrBindings(this, this.client);
      } else if (this.bindings && isPlainObject(this.bindings)) {
        obj = replaceKeyBindings(this, this.client);
      } else {
        obj = {
          method: "raw",
          sql: this.sql,
          bindings: this.bindings === void 0 ? [] : [this.bindings]
        };
      }
      if (this._wrappedBefore) {
        obj.sql = this._wrappedBefore + obj.sql;
      }
      if (this._wrappedAfter) {
        obj.sql = obj.sql + this._wrappedAfter;
      }
      obj.options = reduce(this._options, assign, {});
      if (this._timeout) {
        obj.timeout = this._timeout;
        if (this._cancelOnTimeout) {
          obj.cancelOnTimeout = this._cancelOnTimeout;
        }
      }
      obj.bindings = obj.bindings || [];
      if (helpers2.containsUndefined(obj.bindings)) {
        const undefinedBindingIndices = helpers2.getUndefinedIndices(
          this.bindings
        );
        debugBindings(obj.bindings);
        throw new Error(
          `Undefined binding(s) detected for keys [${undefinedBindingIndices}] when compiling RAW query: ${obj.sql}`
        );
      }
      obj.__knexQueryUid = nanoid();
      Object.defineProperties(obj, {
        toNative: {
          value: () => ({
            sql: this.client.positionBindings(obj.sql),
            bindings: this.client.prepBindings(obj.bindings)
          }),
          enumerable: false
        }
      });
      return obj;
    }
  }
  Raw.prototype.isRawInstance = true;
  augmentWithBuilderInterface(Raw);
  helpers2.addQueryContext(Raw);
  raw = Raw;
  return raw;
}
var compact_1;
var hasRequiredCompact;
function requireCompact() {
  if (hasRequiredCompact) return compact_1;
  hasRequiredCompact = 1;
  function compact(array) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  compact_1 = compact;
  return compact_1;
}
var _arrayAggregator;
var hasRequired_arrayAggregator;
function require_arrayAggregator() {
  if (hasRequired_arrayAggregator) return _arrayAggregator;
  hasRequired_arrayAggregator = 1;
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }
  _arrayAggregator = arrayAggregator;
  return _arrayAggregator;
}
var _baseAggregator;
var hasRequired_baseAggregator;
function require_baseAggregator() {
  if (hasRequired_baseAggregator) return _baseAggregator;
  hasRequired_baseAggregator = 1;
  var baseEach = require_baseEach();
  function baseAggregator(collection, setter, iteratee, accumulator) {
    baseEach(collection, function(value, key, collection2) {
      setter(accumulator, value, iteratee(value), collection2);
    });
    return accumulator;
  }
  _baseAggregator = baseAggregator;
  return _baseAggregator;
}
var _createAggregator;
var hasRequired_createAggregator;
function require_createAggregator() {
  if (hasRequired_createAggregator) return _createAggregator;
  hasRequired_createAggregator = 1;
  var arrayAggregator = require_arrayAggregator(), baseAggregator = require_baseAggregator(), baseIteratee = require_baseIteratee(), isArray = requireIsArray();
  function createAggregator(setter, initializer) {
    return function(collection, iteratee) {
      var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
      return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
    };
  }
  _createAggregator = createAggregator;
  return _createAggregator;
}
var groupBy_1;
var hasRequiredGroupBy;
function requireGroupBy() {
  if (hasRequiredGroupBy) return groupBy_1;
  hasRequiredGroupBy = 1;
  var baseAssignValue = require_baseAssignValue(), createAggregator = require_createAggregator();
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var groupBy = createAggregator(function(result, value, key) {
    if (hasOwnProperty.call(result, key)) {
      result[key].push(value);
    } else {
      baseAssignValue(result, key, [value]);
    }
  });
  groupBy_1 = groupBy;
  return groupBy_1;
}
var _baseHas;
var hasRequired_baseHas;
function require_baseHas() {
  if (hasRequired_baseHas) return _baseHas;
  hasRequired_baseHas = 1;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseHas(object, key) {
    return object != null && hasOwnProperty.call(object, key);
  }
  _baseHas = baseHas;
  return _baseHas;
}
var has_1;
var hasRequiredHas;
function requireHas() {
  if (hasRequiredHas) return has_1;
  hasRequiredHas = 1;
  var baseHas = require_baseHas(), hasPath = require_hasPath();
  function has(object, path) {
    return object != null && hasPath(object, path, baseHas);
  }
  has_1 = has;
  return has_1;
}
var map_1;
var hasRequiredMap;
function requireMap() {
  if (hasRequiredMap) return map_1;
  hasRequiredMap = 1;
  var arrayMap = require_arrayMap(), baseIteratee = require_baseIteratee(), baseMap = require_baseMap(), isArray = requireIsArray();
  function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee, 3));
  }
  map_1 = map;
  return map_1;
}
var _baseSet;
var hasRequired_baseSet;
function require_baseSet() {
  if (hasRequired_baseSet) return _baseSet;
  hasRequired_baseSet = 1;
  var assignValue = require_assignValue(), castPath = require_castPath(), isIndex = require_isIndex(), isObject = requireIsObject(), toKey = require_toKey();
  function baseSet(object, path, value, customizer) {
    if (!isObject(object)) {
      return object;
    }
    path = castPath(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  _baseSet = baseSet;
  return _baseSet;
}
var _basePickBy;
var hasRequired_basePickBy;
function require_basePickBy() {
  if (hasRequired_basePickBy) return _basePickBy;
  hasRequired_basePickBy = 1;
  var baseGet = require_baseGet(), baseSet = require_baseSet(), castPath = require_castPath();
  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object, path);
      if (predicate(value, path)) {
        baseSet(result, castPath(path, object), value);
      }
    }
    return result;
  }
  _basePickBy = basePickBy;
  return _basePickBy;
}
var pickBy_1;
var hasRequiredPickBy;
function requirePickBy() {
  if (hasRequiredPickBy) return pickBy_1;
  hasRequiredPickBy = 1;
  var arrayMap = require_arrayMap(), baseIteratee = require_baseIteratee(), basePickBy = require_basePickBy(), getAllKeysIn = require_getAllKeysIn();
  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = arrayMap(getAllKeysIn(object), function(prop) {
      return [prop];
    });
    predicate = baseIteratee(predicate);
    return basePickBy(object, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }
  pickBy_1 = pickBy;
  return pickBy_1;
}
var omitBy_1;
var hasRequiredOmitBy;
function requireOmitBy() {
  if (hasRequiredOmitBy) return omitBy_1;
  hasRequiredOmitBy = 1;
  var baseIteratee = require_baseIteratee(), negate = requireNegate(), pickBy = requirePickBy();
  function omitBy(object, predicate) {
    return pickBy(object, negate(baseIteratee(predicate)));
  }
  omitBy_1 = omitBy;
  return omitBy_1;
}
var querycompiler;
var hasRequiredQuerycompiler;
function requireQuerycompiler() {
  if (hasRequiredQuerycompiler) return querycompiler;
  hasRequiredQuerycompiler = 1;
  const helpers2 = requireHelpers$1();
  const Raw = requireRaw();
  const QueryBuilder = requireQuerybuilder();
  const JoinClause = requireJoinclause();
  const debug = requireSrc();
  const assign = requireAssign();
  const compact = requireCompact();
  const groupBy = requireGroupBy();
  const has = requireHas();
  const isEmpty = requireIsEmpty();
  const map = requireMap();
  const omitBy = requireOmitBy();
  const reduce = requireReduce();
  const { nanoid } = requireNanoid();
  const { isString, isUndefined } = requireIs();
  const {
    columnize: columnize_,
    direction: direction_,
    operator: operator_,
    wrap: wrap_,
    unwrapRaw: unwrapRaw_,
    rawOrFn: rawOrFn_
  } = requireWrappingFormatter();
  const debugBindings = debug("knex:bindings");
  const components = [
    "comments",
    "columns",
    "join",
    "where",
    "union",
    "group",
    "having",
    "order",
    "limit",
    "offset",
    "lock",
    "waitMode"
  ];
  class QueryCompiler {
    constructor(client2, builder2, bindings2) {
      this.client = client2;
      this.method = builder2._method || "select";
      this.options = builder2._options;
      this.single = builder2._single;
      this.queryComments = builder2._comments;
      this.timeout = builder2._timeout || false;
      this.cancelOnTimeout = builder2._cancelOnTimeout || false;
      this.grouped = groupBy(builder2._statements, "grouping");
      this.formatter = client2.formatter(builder2);
      this._emptyInsertValue = "default values";
      this.first = this.select;
      this.bindings = bindings2 || [];
      this.formatter.bindings = this.bindings;
      this.bindingsHolder = this;
      this.builder = this.formatter.builder;
    }
    // Collapse the builder into a single object
    toSQL(method, tz) {
      this._undefinedInWhereClause = false;
      this.undefinedBindingsInfo = [];
      method = method || this.method;
      const val = this[method]() || "";
      const query = {
        method,
        options: reduce(this.options, assign, {}),
        timeout: this.timeout,
        cancelOnTimeout: this.cancelOnTimeout,
        bindings: this.bindingsHolder.bindings || [],
        __knexQueryUid: nanoid()
      };
      Object.defineProperties(query, {
        toNative: {
          value: () => {
            return {
              sql: this.client.positionBindings(query.sql),
              bindings: this.client.prepBindings(query.bindings)
            };
          },
          enumerable: false
        }
      });
      if (isString(val)) {
        query.sql = val;
      } else {
        assign(query, val);
      }
      if (method === "select" || method === "first") {
        if (this.single.as) {
          query.as = this.single.as;
        }
      }
      if (this._undefinedInWhereClause) {
        debugBindings(query.bindings);
        throw new Error(
          `Undefined binding(s) detected when compiling ${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
            ", "
          )}] query: ${query.sql}`
        );
      }
      return query;
    }
    // Compiles the `select` statement, or nested sub-selects by calling each of
    // the component compilers, trimming out the empties, and returning a
    // generated query string.
    select() {
      let sql = this.with();
      let unionStatement = "";
      const firstStatements = [];
      const endStatements = [];
      components.forEach((component) => {
        const statement = this[component](this);
        switch (component) {
          case "union":
            unionStatement = statement;
            break;
          case "comments":
          case "columns":
          case "join":
          case "where":
            firstStatements.push(statement);
            break;
          default:
            endStatements.push(statement);
            break;
        }
      });
      const wrapMainQuery = this.grouped.union && this.grouped.union.map((u) => u.wrap).some((u) => u);
      if (this.onlyUnions()) {
        const statements = compact(firstStatements.concat(endStatements)).join(
          " "
        );
        sql += unionStatement + (statements ? " " + statements : "");
      } else {
        const allStatements = (wrapMainQuery ? "(" : "") + compact(firstStatements).join(" ") + (wrapMainQuery ? ")" : "");
        const endStat = compact(endStatements).join(" ");
        sql += allStatements + (unionStatement ? " " + unionStatement : "") + (endStat ? " " + endStat : endStat);
      }
      return sql;
    }
    pluck() {
      let toPluck = this.single.pluck;
      if (toPluck.indexOf(".") !== -1) {
        toPluck = toPluck.split(".").slice(-1)[0];
      }
      return {
        sql: this.select(),
        pluck: toPluck
      };
    }
    // Compiles an "insert" query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      const insertValues = this.single.insert || [];
      const sql = this.with() + `insert into ${this.tableName} `;
      const body = this._insertBody(insertValues);
      return body === "" ? "" : sql + body;
    }
    _onConflictClause(columns) {
      return columns instanceof Raw ? this.formatter.wrap(columns) : `(${this.formatter.columnize(columns)})`;
    }
    _buildInsertValues(insertData) {
      let sql = "";
      let i = -1;
      while (++i < insertData.values.length) {
        if (i !== 0) sql += "), (";
        sql += this.client.parameterize(
          insertData.values[i],
          this.client.valueForUndefined,
          this.builder,
          this.bindingsHolder
        );
      }
      return sql;
    }
    _insertBody(insertValues) {
      let sql = "";
      if (Array.isArray(insertValues)) {
        if (insertValues.length === 0) {
          return "";
        }
      } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
        return sql + this._emptyInsertValue;
      }
      const insertData = this._prepInsert(insertValues);
      if (typeof insertData === "string") {
        sql += insertData;
      } else {
        if (insertData.columns.length) {
          sql += `(${columnize_(
            insertData.columns,
            this.builder,
            this.client,
            this.bindingsHolder
          )}`;
          sql += ") values (" + this._buildInsertValues(insertData) + ")";
        } else if (insertValues.length === 1 && insertValues[0]) {
          sql += this._emptyInsertValue;
        } else {
          sql = "";
        }
      }
      return sql;
    }
    // Compiles the "update" query.
    update() {
      const withSQL = this.with();
      const { tableName } = this;
      const updateData = this._prepUpdate(this.single.update);
      const wheres = this.where();
      return withSQL + `update ${this.single.only ? "only " : ""}${tableName} set ` + updateData.join(", ") + (wheres ? ` ${wheres}` : "");
    }
    _hintComments() {
      let hints = this.grouped.hintComments || [];
      hints = hints.map((hint) => compact(hint.value).join(" "));
      hints = compact(hints).join(" ");
      return hints ? `/*+ ${hints} */ ` : "";
    }
    // Compiles the columns in the query, specifying if an item was distinct.
    columns() {
      let distinctClause = "";
      if (this.onlyUnions()) return "";
      const hints = this._hintComments();
      const columns = this.grouped.columns || [];
      let i = -1, sql = [];
      if (columns) {
        while (++i < columns.length) {
          const stmt = columns[i];
          if (stmt.distinct) distinctClause = "distinct ";
          if (stmt.distinctOn) {
            distinctClause = this.distinctOn(stmt.value);
            continue;
          }
          if (stmt.type === "aggregate") {
            sql.push(...this.aggregate(stmt));
          } else if (stmt.type === "aggregateRaw") {
            sql.push(this.aggregateRaw(stmt));
          } else if (stmt.type === "analytic") {
            sql.push(this.analytic(stmt));
          } else if (stmt.type === "json") {
            sql.push(this.json(stmt));
          } else if (stmt.value && stmt.value.length > 0) {
            sql.push(
              columnize_(
                stmt.value,
                this.builder,
                this.client,
                this.bindingsHolder
              )
            );
          }
        }
      }
      if (sql.length === 0) sql = ["*"];
      const select = this.onlyJson() ? "" : "select ";
      return `${select}${hints}${distinctClause}` + sql.join(", ") + (this.tableName ? ` from ${this.single.only ? "only " : ""}${this.tableName}` : "");
    }
    // Add comments to the query
    comments() {
      if (!this.queryComments.length) return "";
      return this.queryComments.map((comment) => `/* ${comment.comment} */`).join(" ");
    }
    _aggregate(stmt, { aliasSeparator = " as ", distinctParentheses } = {}) {
      const value = stmt.value;
      const method = stmt.method;
      const distinct = stmt.aggregateDistinct ? "distinct " : "";
      const wrap = (identifier) => wrap_(
        identifier,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
      const addAlias = (value2, alias2) => {
        if (alias2) {
          return value2 + aliasSeparator + wrap(alias2);
        }
        return value2;
      };
      const aggregateArray = (value2, alias2) => {
        let columns = value2.map(wrap).join(", ");
        if (distinct) {
          const openParen = distinctParentheses ? "(" : " ";
          const closeParen = distinctParentheses ? ")" : "";
          columns = distinct.trim() + openParen + columns + closeParen;
        }
        const aggregated = `${method}(${columns})`;
        return addAlias(aggregated, alias2);
      };
      const aggregateString = (value2, alias2) => {
        const aggregated = `${method}(${distinct + wrap(value2)})`;
        return addAlias(aggregated, alias2);
      };
      if (Array.isArray(value)) {
        return [aggregateArray(value)];
      }
      if (typeof value === "object") {
        if (stmt.alias) {
          throw new Error("When using an object explicit alias can not be used");
        }
        return Object.entries(value).map(([alias2, column2]) => {
          if (Array.isArray(column2)) {
            return aggregateArray(column2, alias2);
          }
          return aggregateString(column2, alias2);
        });
      }
      const splitOn = value.toLowerCase().indexOf(" as ");
      let column = value;
      let { alias } = stmt;
      if (splitOn !== -1) {
        column = value.slice(0, splitOn);
        if (alias) {
          throw new Error(`Found multiple aliases for same column: ${column}`);
        }
        alias = value.slice(splitOn + 4);
      }
      return [aggregateString(column, alias)];
    }
    aggregate(stmt) {
      return this._aggregate(stmt);
    }
    aggregateRaw(stmt) {
      const distinct = stmt.aggregateDistinct ? "distinct " : "";
      return `${stmt.method}(${distinct + unwrapRaw_(
        stmt.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      )})`;
    }
    _joinTable(join) {
      return join.schema && !(join.table instanceof Raw) ? `${join.schema}.${join.table}` : join.table;
    }
    // Compiles all each of the `join` clauses on the query,
    // including any nested join queries.
    join() {
      let sql = "";
      let i = -1;
      const joins = this.grouped.join;
      if (!joins) return "";
      while (++i < joins.length) {
        const join = joins[i];
        const table = this._joinTable(join);
        if (i > 0) sql += " ";
        if (join.joinType === "raw") {
          sql += unwrapRaw_(
            join.table,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          );
        } else {
          sql += join.joinType + " join " + wrap_(
            table,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          );
          let ii = -1;
          while (++ii < join.clauses.length) {
            const clause = join.clauses[ii];
            if (ii > 0) {
              sql += ` ${clause.bool} `;
            } else {
              sql += ` ${clause.type === "onUsing" ? "using" : "on"} `;
            }
            const val = this[clause.type](clause);
            if (val) {
              sql += val;
            }
          }
        }
      }
      return sql;
    }
    onBetween(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._not(statement, "between") + " " + statement.value.map(
        (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
      ).join(" and ");
    }
    onNull(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " is " + this._not(statement, "null");
    }
    onExists(statement) {
      return this._not(statement, "exists") + " (" + rawOrFn_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ")";
    }
    onIn(statement) {
      if (Array.isArray(statement.column)) return this.multiOnIn(statement);
      let values;
      if (statement.value instanceof Raw) {
        values = this.client.parameter(
          statement.value,
          this.builder,
          this.formatter
        );
      } else {
        values = this.client.parameterize(
          statement.value,
          void 0,
          this.builder,
          this.bindingsHolder
        );
      }
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._not(statement, "in ") + this.wrap(values);
    }
    multiOnIn(statement) {
      let i = -1, sql = `(${columnize_(
        statement.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}) `;
      sql += this._not(statement, "in ") + "((";
      while (++i < statement.value.length) {
        if (i !== 0) sql += "),(";
        sql += this.client.parameterize(
          statement.value[i],
          void 0,
          this.builder,
          this.bindingsHolder
        );
      }
      return sql + "))";
    }
    // Compiles all `where` statements on the query.
    where() {
      const wheres = this.grouped.where;
      if (!wheres) return;
      const sql = [];
      let i = -1;
      while (++i < wheres.length) {
        const stmt = wheres[i];
        if (Object.prototype.hasOwnProperty.call(stmt, "value") && helpers2.containsUndefined(stmt.value)) {
          this.undefinedBindingsInfo.push(stmt.column);
          this._undefinedInWhereClause = true;
        }
        const val = this[stmt.type](stmt);
        if (val) {
          if (sql.length === 0) {
            sql[0] = "where";
          } else {
            sql.push(stmt.bool);
          }
          sql.push(val);
        }
      }
      return sql.length > 1 ? sql.join(" ") : "";
    }
    group() {
      return this._groupsOrders("group");
    }
    order() {
      return this._groupsOrders("order");
    }
    // Compiles the `having` statements.
    having() {
      const havings = this.grouped.having;
      if (!havings) return "";
      const sql = ["having"];
      for (let i = 0, l = havings.length; i < l; i++) {
        const s = havings[i];
        const val = this[s.type](s);
        if (val) {
          if (sql.length === 0) {
            sql[0] = "where";
          }
          if (sql.length > 1 || sql.length === 1 && sql[0] !== "having") {
            sql.push(s.bool);
          }
          sql.push(val);
        }
      }
      return sql.length > 1 ? sql.join(" ") : "";
    }
    havingRaw(statement) {
      return this._not(statement, "") + unwrapRaw_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    }
    havingWrapped(statement) {
      const val = rawOrFn_(
        statement.value,
        "where",
        this.builder,
        this.client,
        this.bindingsHolder
      );
      return val && this._not(statement, "") + "(" + val.slice(6) + ")" || "";
    }
    havingBasic(statement) {
      return this._not(statement, "") + wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + operator_(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this.client.parameter(statement.value, this.builder, this.bindingsHolder);
    }
    havingNull(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " is " + this._not(statement, "null");
    }
    havingExists(statement) {
      return this._not(statement, "exists") + " (" + rawOrFn_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ")";
    }
    havingBetween(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._not(statement, "between") + " " + statement.value.map(
        (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
      ).join(" and ");
    }
    havingIn(statement) {
      if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._not(statement, "in ") + this.wrap(
        this.client.parameterize(
          statement.value,
          void 0,
          this.builder,
          this.bindingsHolder
        )
      );
    }
    multiHavingIn(statement) {
      return this.multiOnIn(statement);
    }
    // Compile the "union" queries attached to the main query.
    union() {
      const onlyUnions = this.onlyUnions();
      const unions = this.grouped.union;
      if (!unions) return "";
      let sql = "";
      for (let i = 0, l = unions.length; i < l; i++) {
        const union = unions[i];
        if (i > 0) sql += " ";
        if (i > 0 || !onlyUnions) sql += union.clause + " ";
        const statement = rawOrFn_(
          union.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
        if (statement) {
          const wrap = union.wrap;
          if (wrap) sql += "(";
          sql += statement;
          if (wrap) sql += ")";
        }
      }
      return sql;
    }
    // If we haven't specified any columns or a `tableName`, we're assuming this
    // is only being used for unions.
    onlyUnions() {
      return (!this.grouped.columns || !!this.grouped.columns[0].value) && this.grouped.union && !this.tableName;
    }
    _getValueOrParameterFromAttribute(attribute, rawValue) {
      if (this.single.skipBinding[attribute] === true) {
        return rawValue !== void 0 && rawValue !== null ? rawValue : this.single[attribute];
      }
      return this.client.parameter(
        this.single[attribute],
        this.builder,
        this.bindingsHolder
      );
    }
    onlyJson() {
      return !this.tableName && this.grouped.columns && this.grouped.columns.length === 1 && this.grouped.columns[0].type === "json";
    }
    limit() {
      const noLimit = !this.single.limit && this.single.limit !== 0;
      if (noLimit) return "";
      return `limit ${this._getValueOrParameterFromAttribute("limit")}`;
    }
    offset() {
      if (!this.single.offset) return "";
      return `offset ${this._getValueOrParameterFromAttribute("offset")}`;
    }
    // Compiles a `delete` query.
    del() {
      const { tableName } = this;
      const withSQL = this.with();
      const wheres = this.where();
      const joins = this.join();
      const deleteSelector = joins ? tableName + " " : "";
      return withSQL + `delete ${deleteSelector}from ${this.single.only ? "only " : ""}${tableName}` + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "");
    }
    // Compiles a `truncate` query.
    truncate() {
      return `truncate ${this.tableName}`;
    }
    // Compiles the "locks".
    lock() {
      if (this.single.lock) {
        return this[this.single.lock]();
      }
    }
    // Compiles the wait mode on the locks.
    waitMode() {
      if (this.single.waitMode) {
        return this[this.single.waitMode]();
      }
    }
    // Fail on unsupported databases
    skipLocked() {
      throw new Error(
        ".skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+"
      );
    }
    // Fail on unsupported databases
    noWait() {
      throw new Error(
        ".noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+"
      );
    }
    distinctOn(value) {
      throw new Error(".distinctOn() is currently only supported on PostgreSQL");
    }
    // On Clause
    // ------
    onWrapped(clause) {
      const self2 = this;
      const wrapJoin = new JoinClause();
      clause.value.call(wrapJoin, wrapJoin);
      let sql = "";
      for (let ii = 0; ii < wrapJoin.clauses.length; ii++) {
        const wrapClause = wrapJoin.clauses[ii];
        if (ii > 0) {
          sql += ` ${wrapClause.bool} `;
        }
        const val = self2[wrapClause.type](wrapClause);
        if (val) {
          sql += val;
        }
      }
      if (sql.length) {
        return `(${sql})`;
      }
      return "";
    }
    onBasic(clause) {
      const toWrap = clause.value instanceof QueryBuilder;
      return wrap_(
        clause.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + operator_(
        clause.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + (toWrap ? "(" : "") + wrap_(
        clause.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + (toWrap ? ")" : "");
    }
    onVal(clause) {
      return wrap_(
        clause.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + operator_(
        clause.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this.client.parameter(clause.value, this.builder, this.bindingsHolder);
    }
    onRaw(clause) {
      return unwrapRaw_(
        clause.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    }
    onUsing(clause) {
      return "(" + columnize_(
        clause.column,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ")";
    }
    // Where Clause
    // ------
    _valueClause(statement) {
      return statement.asColumn ? wrap_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) : this.client.parameter(
        statement.value,
        this.builder,
        this.bindingsHolder
      );
    }
    _columnClause(statement) {
      let columns;
      if (Array.isArray(statement.column)) {
        columns = `(${columnize_(
          statement.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )})`;
      } else {
        columns = wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      }
      return columns;
    }
    whereIn(statement) {
      const values = this.client.values(
        statement.value,
        this.builder,
        this.bindingsHolder
      );
      return `${this._columnClause(statement)} ${this._not(
        statement,
        "in "
      )}${values}`;
    }
    whereLike(statement) {
      return `${this._columnClause(statement)} ${this._not(
        statement,
        "like "
      )}${this._valueClause(statement)}`;
    }
    whereILike(statement) {
      return `${this._columnClause(statement)} ${this._not(
        statement,
        "ilike "
      )}${this._valueClause(statement)}`;
    }
    whereNull(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " is " + this._not(statement, "null");
    }
    // Compiles a basic "where" clause.
    whereBasic(statement) {
      return this._not(statement, "") + wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + operator_(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._valueClause(statement);
    }
    whereExists(statement) {
      return this._not(statement, "exists") + " (" + rawOrFn_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ")";
    }
    whereWrapped(statement) {
      const val = rawOrFn_(
        statement.value,
        "where",
        this.builder,
        this.client,
        this.bindingsHolder
      );
      return val && this._not(statement, "") + "(" + val.slice(6) + ")" || "";
    }
    whereBetween(statement) {
      return wrap_(
        statement.column,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + " " + this._not(statement, "between") + " " + statement.value.map(
        (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
      ).join(" and ");
    }
    // Compiles a "whereRaw" query.
    whereRaw(statement) {
      return this._not(statement, "") + unwrapRaw_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
    }
    _jsonWrapValue(jsonValue) {
      if (!this.builder._isJsonObject(jsonValue)) {
        try {
          return JSON.stringify(JSON.parse(jsonValue.replace(/\n|\t/g, "")));
        } catch (e) {
          return jsonValue;
        }
      }
      return JSON.stringify(jsonValue);
    }
    _jsonValueClause(statement) {
      statement.value = this._jsonWrapValue(statement.value);
      return this._valueClause(statement);
    }
    whereJsonObject(statement) {
      return `${this._columnClause(statement)} ${statement.not ? "!=" : "="} ${this._jsonValueClause(statement)}`;
    }
    wrap(str) {
      if (str.charAt(0) !== "(") return `(${str})`;
      return str;
    }
    json(stmt) {
      return this[stmt.method](stmt.params);
    }
    analytic(stmt) {
      let sql = "";
      const self2 = this;
      sql += stmt.method + "() over (";
      if (stmt.raw) {
        sql += stmt.raw;
      } else {
        if (stmt.partitions.length) {
          sql += "partition by ";
          sql += map(stmt.partitions, function(partition) {
            if (isString(partition)) {
              return self2.formatter.columnize(partition);
            } else return self2.formatter.columnize(partition.column) + (partition.order ? " " + partition.order : "");
          }).join(", ") + " ";
        }
        sql += "order by ";
        sql += map(stmt.order, function(order) {
          if (isString(order)) {
            return self2.formatter.columnize(order);
          } else return self2.formatter.columnize(order.column) + (order.order ? " " + order.order : "");
        }).join(", ");
      }
      sql += ")";
      if (stmt.alias) {
        sql += " as " + stmt.alias;
      }
      return sql;
    }
    // Compiles all `with` statements on the query.
    with() {
      if (!this.grouped.with || !this.grouped.with.length) {
        return "";
      }
      const withs = this.grouped.with;
      if (!withs) return;
      const sql = [];
      let i = -1;
      let isRecursive = false;
      while (++i < withs.length) {
        const stmt = withs[i];
        if (stmt.recursive) {
          isRecursive = true;
        }
        const val = this[stmt.type](stmt);
        sql.push(val);
      }
      return `with ${isRecursive ? "recursive " : ""}${sql.join(", ")} `;
    }
    withWrapped(statement) {
      const val = rawOrFn_(
        statement.value,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
      const columnList = statement.columnList ? "(" + columnize_(
        statement.columnList,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ")" : "";
      const materialized = statement.materialized === void 0 ? "" : statement.materialized ? "materialized " : "not materialized ";
      return val && columnize_(
        statement.alias,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + columnList + " as " + materialized + "(" + val + ")" || "";
    }
    // Determines whether to add a "not" prefix to the where clause.
    _not(statement, str) {
      if (statement.not) return `not ${str}`;
      return str;
    }
    _prepInsert(data) {
      const isRaw = rawOrFn_(
        data,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      );
      if (isRaw) return isRaw;
      let columns = [];
      const values = [];
      if (!Array.isArray(data)) data = data ? [data] : [];
      let i = -1;
      while (++i < data.length) {
        if (data[i] == null) break;
        if (i === 0) columns = Object.keys(data[i]).sort();
        const row = new Array(columns.length);
        const keys = Object.keys(data[i]);
        let j = -1;
        while (++j < keys.length) {
          const key = keys[j];
          let idx = columns.indexOf(key);
          if (idx === -1) {
            columns = columns.concat(key).sort();
            idx = columns.indexOf(key);
            let k = -1;
            while (++k < values.length) {
              values[k].splice(idx, 0, void 0);
            }
            row.splice(idx, 0, void 0);
          }
          row[idx] = data[i][key];
        }
        values.push(row);
      }
      return {
        columns,
        values
      };
    }
    // "Preps" the update.
    _prepUpdate(data = {}) {
      const { counter = {} } = this.single;
      for (const column of Object.keys(counter)) {
        if (has(data, column)) {
          this.client.logger.warn(
            `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
          );
          continue;
        }
        let value = counter[column];
        const symbol = value < 0 ? "-" : "+";
        if (symbol === "-") {
          value = -value;
        }
        data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
      }
      data = omitBy(data, isUndefined);
      const vals = [];
      const columns = Object.keys(data);
      let i = -1;
      while (++i < columns.length) {
        vals.push(
          wrap_(
            columns[i],
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          ) + " = " + this.client.parameter(
            data[columns[i]],
            this.builder,
            this.bindingsHolder
          )
        );
      }
      if (isEmpty(vals)) {
        throw new Error(
          [
            "Empty .update() call detected!",
            "Update data does not contain any values to update.",
            "This will result in a faulty query.",
            this.single.table ? `Table: ${this.single.table}.` : "",
            this.single.update ? `Columns: ${Object.keys(this.single.update)}.` : ""
          ].join(" ")
        );
      }
      return vals;
    }
    _formatGroupsItemValue(value, nulls) {
      const { formatter: formatter2 } = this;
      let nullOrder = "";
      if (nulls === "last") {
        nullOrder = " is null";
      } else if (nulls === "first") {
        nullOrder = " is not null";
      }
      let groupOrder;
      if (value instanceof Raw) {
        groupOrder = unwrapRaw_(
          value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      } else if (value instanceof QueryBuilder || nulls) {
        groupOrder = "(" + formatter2.columnize(value) + nullOrder + ")";
      } else {
        groupOrder = formatter2.columnize(value);
      }
      return groupOrder;
    }
    _basicGroupOrder(item, type) {
      const column = this._formatGroupsItemValue(item.value, item.nulls);
      const direction = type === "order" && item.type !== "orderByRaw" ? ` ${direction_(
        item.direction,
        this.builder,
        this.client,
        this.bindingsHolder
      )}` : "";
      return column + direction;
    }
    _groupOrder(item, type) {
      return this._basicGroupOrder(item, type);
    }
    _groupOrderNulls(item, type) {
      const column = this._formatGroupsItemValue(item.value);
      const direction = type === "order" && item.type !== "orderByRaw" ? ` ${direction_(
        item.direction,
        this.builder,
        this.client,
        this.bindingsHolder
      )}` : "";
      if (item.nulls && !(item.value instanceof Raw)) {
        return `${column}${direction ? direction : ""} nulls ${item.nulls}`;
      }
      return column + direction;
    }
    // Compiles the `order by` statements.
    _groupsOrders(type) {
      const items = this.grouped[type];
      if (!items) return "";
      const sql = items.map((item) => {
        return this._groupOrder(item, type);
      });
      return sql.length ? type + " by " + sql.join(", ") : "";
    }
    // Get the table name, wrapping it if necessary.
    // Implemented as a property to prevent ordering issues as described in #704.
    get tableName() {
      if (!this._tableName) {
        let tableName = this.single.table;
        const schemaName = this.single.schema;
        if (tableName && schemaName) {
          const isQueryBuilder = tableName instanceof QueryBuilder;
          const isRawQuery = tableName instanceof Raw;
          const isFunction = typeof tableName === "function";
          if (!isQueryBuilder && !isRawQuery && !isFunction) {
            tableName = `${schemaName}.${tableName}`;
          }
        }
        this._tableName = tableName ? (
          // Wrap subQuery with parenthesis, #3485
          wrap_(
            tableName,
            tableName instanceof QueryBuilder,
            this.builder,
            this.client,
            this.bindingsHolder
          )
        ) : "";
      }
      return this._tableName;
    }
    _jsonPathWrap(extraction) {
      return this.client.parameter(
        extraction.path || extraction[1],
        this.builder,
        this.bindingsHolder
      );
    }
    // Json common functions
    _jsonExtract(nameFunction, params) {
      let extractions;
      if (Array.isArray(params.column)) {
        extractions = params.column;
      } else {
        extractions = [params];
      }
      if (!Array.isArray(nameFunction)) {
        nameFunction = [nameFunction];
      }
      return extractions.map((extraction) => {
        let jsonCol = `${columnize_(
          extraction.column || extraction[0],
          this.builder,
          this.client,
          this.bindingsHolder
        )}, ${this._jsonPathWrap(extraction)}`;
        nameFunction.forEach((f) => {
          jsonCol = f + "(" + jsonCol + ")";
        });
        const alias = extraction.alias || extraction[2];
        return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
      }).join(", ");
    }
    _jsonSet(nameFunction, params) {
      const jsonSet = `${nameFunction}(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}, ${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )}, ${this.client.parameter(
        params.value,
        this.builder,
        this.bindingsHolder
      )})`;
      return params.alias ? this.client.alias(jsonSet, this.formatter.wrap(params.alias)) : jsonSet;
    }
    _whereJsonPath(nameFunction, statement) {
      return `${nameFunction}(${this._columnClause(
        statement
      )}, ${this._jsonPathWrap({ path: statement.jsonPath })}) ${operator_(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      )} ${this._jsonValueClause(statement)}`;
    }
    _onJsonPathEquals(nameJoinFunction, clause) {
      return nameJoinFunction + "(" + wrap_(
        clause.columnFirst,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ", " + this.client.parameter(
        clause.jsonPathFirst,
        this.builder,
        this.bindingsHolder
      ) + ") = " + nameJoinFunction + "(" + wrap_(
        clause.columnSecond,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ", " + this.client.parameter(
        clause.jsonPathSecond,
        this.builder,
        this.bindingsHolder
      ) + ")";
    }
  }
  querycompiler = QueryCompiler;
  return querycompiler;
}
var builder;
var hasRequiredBuilder;
function requireBuilder() {
  if (hasRequiredBuilder) return builder;
  hasRequiredBuilder = 1;
  const { EventEmitter } = require$$0;
  const toArray = requireToArray();
  const assign = requireAssign();
  const { addQueryContext } = requireHelpers$1();
  const saveAsyncStack2 = requireSaveAsyncStack();
  const {
    augmentWithBuilderInterface
  } = requireBuilderInterfaceAugmenter();
  class SchemaBuilder extends EventEmitter {
    constructor(client2) {
      super();
      this.client = client2;
      this._sequence = [];
      if (client2.config) {
        this._debug = client2.config.debug;
        saveAsyncStack2(this, 4);
      }
    }
    withSchema(schemaName) {
      this._schema = schemaName;
      return this;
    }
    toString() {
      return this.toQuery();
    }
    toSQL() {
      return this.client.schemaCompiler(this).toSQL();
    }
    async generateDdlCommands() {
      return await this.client.schemaCompiler(this).generateDdlCommands();
    }
  }
  [
    "createTable",
    "createTableIfNotExists",
    "createTableLike",
    "createView",
    "createViewOrReplace",
    "createMaterializedView",
    "refreshMaterializedView",
    "dropView",
    "dropViewIfExists",
    "dropMaterializedView",
    "dropMaterializedViewIfExists",
    "createSchema",
    "createSchemaIfNotExists",
    "dropSchema",
    "dropSchemaIfExists",
    "createExtension",
    "createExtensionIfNotExists",
    "dropExtension",
    "dropExtensionIfExists",
    "table",
    "alterTable",
    "view",
    "alterView",
    "hasTable",
    "hasColumn",
    "dropTable",
    "renameTable",
    "renameView",
    "dropTableIfExists",
    "raw"
  ].forEach(function(method) {
    SchemaBuilder.prototype[method] = function() {
      if (method === "createTableIfNotExists") {
        this.client.logger.warn(
          [
            "Use async .hasTable to check if table exists and then use plain .createTable. Since ",
            '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
            "query it will not work correctly if there are any alter table queries generated for ",
            "columns afterwards. To not break old migrations this function is left untouched for now",
            ", but it should not be used when writing new code and it is removed from documentation."
          ].join("")
        );
      }
      if (method === "table") method = "alterTable";
      if (method === "view") method = "alterView";
      this._sequence.push({
        method,
        args: toArray(arguments)
      });
      return this;
    };
  });
  SchemaBuilder.extend = (methodName, fn) => {
    if (Object.prototype.hasOwnProperty.call(SchemaBuilder.prototype, methodName)) {
      throw new Error(
        `Can't extend SchemaBuilder with existing method ('${methodName}').`
      );
    }
    assign(SchemaBuilder.prototype, { [methodName]: fn });
  };
  augmentWithBuilderInterface(SchemaBuilder);
  addQueryContext(SchemaBuilder);
  builder = SchemaBuilder;
  return builder;
}
var helpers;
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers) return helpers;
  hasRequiredHelpers = 1;
  const tail = requireTail();
  const { isString } = requireIs();
  function pushQuery(query) {
    if (!query) return;
    if (isString(query)) {
      query = { sql: query };
    }
    if (!query.bindings) {
      query.bindings = this.bindingsHolder.bindings;
    }
    this.sequence.push(query);
    this.formatter = this.client.formatter(this._commonBuilder);
    this.bindings = [];
    this.formatter.bindings = this.bindings;
  }
  function pushAdditional(fn) {
    const child = new this.constructor(
      this.client,
      this.tableCompiler,
      this.columnBuilder
    );
    fn.call(child, tail(arguments));
    this.sequence.additional = (this.sequence.additional || []).concat(
      child.sequence
    );
  }
  function unshiftQuery(query) {
    if (!query) return;
    if (isString(query)) {
      query = { sql: query };
    }
    if (!query.bindings) {
      query.bindings = this.bindingsHolder.bindings;
    }
    this.sequence.unshift(query);
    this.formatter = this.client.formatter(this._commonBuilder);
    this.bindings = [];
    this.formatter.bindings = this.bindings;
  }
  helpers = {
    pushAdditional,
    pushQuery,
    unshiftQuery
  };
  return helpers;
}
var compiler$1;
var hasRequiredCompiler$1;
function requireCompiler$1() {
  if (hasRequiredCompiler$1) return compiler$1;
  hasRequiredCompiler$1 = 1;
  const {
    pushQuery,
    pushAdditional,
    unshiftQuery
  } = requireHelpers();
  class SchemaCompiler {
    constructor(client2, builder2) {
      this.builder = builder2;
      this._commonBuilder = this.builder;
      this.client = client2;
      this.schema = builder2._schema;
      this.bindings = [];
      this.bindingsHolder = this;
      this.formatter = client2.formatter(builder2);
      this.formatter.bindings = this.bindings;
      this.sequence = [];
    }
    createSchema() {
      throwOnlyPGError("createSchema");
    }
    createSchemaIfNotExists() {
      throwOnlyPGError("createSchemaIfNotExists");
    }
    dropSchema() {
      throwOnlyPGError("dropSchema");
    }
    dropSchemaIfExists() {
      throwOnlyPGError("dropSchemaIfExists");
    }
    dropTable(tableName) {
      this.pushQuery(
        this.dropTablePrefix + this.formatter.wrap(prefixedTableName(this.schema, tableName))
      );
    }
    dropTableIfExists(tableName) {
      this.pushQuery(
        this.dropTablePrefix + "if exists " + this.formatter.wrap(prefixedTableName(this.schema, tableName))
      );
    }
    dropView(viewName) {
      this._dropView(viewName, false, false);
    }
    dropViewIfExists(viewName) {
      this._dropView(viewName, true, false);
    }
    dropMaterializedView(viewName) {
      throw new Error("materialized views are not supported by this dialect.");
    }
    dropMaterializedViewIfExists(viewName) {
      throw new Error("materialized views are not supported by this dialect.");
    }
    renameView(from, to) {
      throw new Error(
        "rename view is not supported by this dialect (instead drop then create another view)."
      );
    }
    refreshMaterializedView() {
      throw new Error("materialized views are not supported by this dialect.");
    }
    _dropView(viewName, ifExists, materialized) {
      this.pushQuery(
        (materialized ? this.dropMaterializedViewPrefix : this.dropViewPrefix) + (ifExists ? "if exists " : "") + this.formatter.wrap(prefixedTableName(this.schema, viewName))
      );
    }
    raw(sql, bindings2) {
      this.sequence.push(this.client.raw(sql, bindings2).toSQL());
    }
    toSQL() {
      const sequence = this.builder._sequence;
      for (let i = 0, l = sequence.length; i < l; i++) {
        const query = sequence[i];
        this[query.method].apply(this, query.args);
      }
      return this.sequence;
    }
    async generateDdlCommands() {
      const generatedCommands = this.toSQL();
      return {
        pre: [],
        sql: Array.isArray(generatedCommands) ? generatedCommands : [generatedCommands],
        check: null,
        post: []
      };
    }
  }
  SchemaCompiler.prototype.dropTablePrefix = "drop table ";
  SchemaCompiler.prototype.dropViewPrefix = "drop view ";
  SchemaCompiler.prototype.dropMaterializedViewPrefix = "drop materialized view ";
  SchemaCompiler.prototype.alterViewPrefix = "alter view ";
  SchemaCompiler.prototype.alterTable = buildTable("alter");
  SchemaCompiler.prototype.createTable = buildTable("create");
  SchemaCompiler.prototype.createTableIfNotExists = buildTable("createIfNot");
  SchemaCompiler.prototype.createTableLike = buildTable("createLike");
  SchemaCompiler.prototype.createView = buildView("create");
  SchemaCompiler.prototype.createViewOrReplace = buildView("createOrReplace");
  SchemaCompiler.prototype.createMaterializedView = buildView(
    "createMaterializedView"
  );
  SchemaCompiler.prototype.alterView = buildView("alter");
  SchemaCompiler.prototype.pushQuery = pushQuery;
  SchemaCompiler.prototype.pushAdditional = pushAdditional;
  SchemaCompiler.prototype.unshiftQuery = unshiftQuery;
  function build(builder2) {
    const queryContext = this.builder.queryContext();
    if (queryContext !== void 0 && builder2.queryContext() === void 0) {
      builder2.queryContext(queryContext);
    }
    builder2.setSchema(this.schema);
    const sql = builder2.toSQL();
    for (let i = 0, l = sql.length; i < l; i++) {
      this.sequence.push(sql[i]);
    }
  }
  function buildTable(type) {
    if (type === "createLike") {
      return function(tableName, tableNameLike, fn) {
        const builder2 = this.client.tableBuilder(
          type,
          tableName,
          tableNameLike,
          fn
        );
        build.call(this, builder2);
      };
    } else {
      return function(tableName, fn) {
        const builder2 = this.client.tableBuilder(type, tableName, null, fn);
        build.call(this, builder2);
      };
    }
  }
  function buildView(type) {
    return function(viewName, fn) {
      const builder2 = this.client.viewBuilder(type, viewName, fn);
      build.call(this, builder2);
    };
  }
  function prefixedTableName(prefix, table) {
    return prefix ? `${prefix}.${table}` : table;
  }
  function throwOnlyPGError(operationName) {
    throw new Error(
      `${operationName} is not supported for this dialect (only PostgreSQL supports it currently).`
    );
  }
  compiler$1 = SchemaCompiler;
  return compiler$1;
}
var assignIn_1;
var hasRequiredAssignIn;
function requireAssignIn() {
  if (hasRequiredAssignIn) return assignIn_1;
  hasRequiredAssignIn = 1;
  var copyObject = require_copyObject(), createAssigner = require_createAssigner(), keysIn = requireKeysIn();
  var assignIn = createAssigner(function(object, source) {
    copyObject(source, keysIn(source), object);
  });
  assignIn_1 = assignIn;
  return assignIn_1;
}
var extend;
var hasRequiredExtend;
function requireExtend() {
  if (hasRequiredExtend) return extend;
  hasRequiredExtend = 1;
  extend = requireAssignIn();
  return extend;
}
var tablebuilder;
var hasRequiredTablebuilder;
function requireTablebuilder() {
  if (hasRequiredTablebuilder) return tablebuilder;
  hasRequiredTablebuilder = 1;
  const each2 = requireEach();
  const extend2 = requireExtend();
  const assign = requireAssign();
  const toArray = requireToArray();
  const helpers2 = requireHelpers$1();
  const { isString, isFunction, isObject } = requireIs();
  class TableBuilder {
    constructor(client2, method, tableName, tableNameLike, fn) {
      this.client = client2;
      this._fn = fn;
      this._method = method;
      this._schemaName = void 0;
      this._tableName = tableName;
      this._tableNameLike = tableNameLike;
      this._statements = [];
      this._single = {};
      if (!tableNameLike && !isFunction(this._fn)) {
        throw new TypeError(
          "A callback function must be supplied to calls against `.createTable` and `.table`"
        );
      }
    }
    setSchema(schemaName) {
      this._schemaName = schemaName;
    }
    // Convert the current tableBuilder object "toSQL"
    // giving us additional methods if we're altering
    // rather than creating the table.
    toSQL() {
      if (this._method === "alter") {
        extend2(this, AlterMethods);
      }
      if (this._fn) {
        this._fn.call(this, this);
      }
      return this.client.tableCompiler(this).toSQL();
    }
    // The "timestamps" call is really just sets the `created_at` and `updated_at` columns.
    timestamps(useTimestamps, defaultToNow, useCamelCase) {
      if (isObject(useTimestamps)) {
        ({ useTimestamps, defaultToNow, useCamelCase } = useTimestamps);
      }
      const method = useTimestamps === true ? "timestamp" : "datetime";
      const createdAt = this[method](useCamelCase ? "createdAt" : "created_at");
      const updatedAt = this[method](useCamelCase ? "updatedAt" : "updated_at");
      if (defaultToNow === true) {
        const now = this.client.raw("CURRENT_TIMESTAMP");
        createdAt.notNullable().defaultTo(now);
        updatedAt.notNullable().defaultTo(now);
      }
    }
    // Set the comment value for a table, they're only allowed to be called
    // once per table.
    comment(value) {
      if (typeof value !== "string") {
        throw new TypeError("Table comment must be string");
      }
      this._single.comment = value;
    }
    // Set a foreign key on the table, calling
    // `table.foreign('column_name').references('column').on('table').onDelete()...
    // Also called from the ColumnBuilder context when chaining.
    foreign(column, keyName) {
      const foreignData = { column, keyName };
      this._statements.push({
        grouping: "alterTable",
        method: "foreign",
        args: [foreignData]
      });
      let returnObj = {
        references(tableColumn) {
          let pieces;
          if (isString(tableColumn)) {
            pieces = tableColumn.split(".");
          }
          if (!pieces || pieces.length === 1) {
            foreignData.references = pieces ? pieces[0] : tableColumn;
            return {
              on(tableName) {
                if (typeof tableName !== "string") {
                  throw new TypeError(
                    `Expected tableName to be a string, got: ${typeof tableName}`
                  );
                }
                foreignData.inTable = tableName;
                return returnObj;
              },
              inTable() {
                return this.on.apply(this, arguments);
              }
            };
          }
          foreignData.inTable = pieces[0];
          foreignData.references = pieces[1];
          return returnObj;
        },
        withKeyName(keyName2) {
          foreignData.keyName = keyName2;
          return returnObj;
        },
        onUpdate(statement) {
          foreignData.onUpdate = statement;
          return returnObj;
        },
        onDelete(statement) {
          foreignData.onDelete = statement;
          return returnObj;
        },
        deferrable: (type) => {
          const unSupported = [
            "mysql",
            "mssql",
            "redshift",
            "mysql2",
            "oracledb"
          ];
          if (unSupported.indexOf(this.client.dialect) !== -1) {
            throw new Error(`${this.client.dialect} does not support deferrable`);
          }
          foreignData.deferrable = type;
          return returnObj;
        },
        _columnBuilder(builder2) {
          extend2(builder2, returnObj);
          returnObj = builder2;
          return builder2;
        }
      };
      return returnObj;
    }
    check(checkPredicate, bindings2, constraintName) {
      this._statements.push({
        grouping: "checks",
        args: [checkPredicate, bindings2, constraintName]
      });
      return this;
    }
  }
  [
    // Each of the index methods can be called individually, with the
    // column name to be used, e.g. table.unique('column').
    "index",
    "primary",
    "unique",
    // Key specific
    "dropPrimary",
    "dropUnique",
    "dropIndex",
    "dropForeign"
  ].forEach((method) => {
    TableBuilder.prototype[method] = function() {
      this._statements.push({
        grouping: "alterTable",
        method,
        args: toArray(arguments)
      });
      return this;
    };
  });
  const specialMethods = {
    mysql: ["engine", "charset", "collate"],
    postgresql: ["inherits"]
  };
  each2(specialMethods, function(methods, dialect) {
    methods.forEach(function(method) {
      TableBuilder.prototype[method] = function(value) {
        if (this.client.dialect !== dialect) {
          throw new Error(
            `Knex only supports ${method} statement with ${dialect}.`
          );
        }
        if (this._method === "alter") {
          throw new Error(
            `Knex does not support altering the ${method} outside of create table, please use knex.raw statement.`
          );
        }
        this._single[method] = value;
      };
    });
  });
  helpers2.addQueryContext(TableBuilder);
  const columnTypes = [
    // Numeric
    "tinyint",
    "smallint",
    "mediumint",
    "int",
    "bigint",
    "decimal",
    "float",
    "double",
    "real",
    "bit",
    "boolean",
    "serial",
    // Date / Time
    "date",
    "datetime",
    "timestamp",
    "time",
    "year",
    // Geometry
    "geometry",
    "geography",
    "point",
    // String
    "char",
    "varchar",
    "tinytext",
    "tinyText",
    "text",
    "mediumtext",
    "mediumText",
    "longtext",
    "longText",
    "binary",
    "varbinary",
    "tinyblob",
    "tinyBlob",
    "mediumblob",
    "mediumBlob",
    "blob",
    "longblob",
    "longBlob",
    "enum",
    "set",
    // Increments, Aliases, and Additional
    "bool",
    "dateTime",
    "increments",
    "bigincrements",
    "bigIncrements",
    "integer",
    "biginteger",
    "bigInteger",
    "string",
    "json",
    "jsonb",
    "uuid",
    "enu",
    "specificType"
  ];
  columnTypes.forEach((type) => {
    TableBuilder.prototype[type] = function() {
      const args = toArray(arguments);
      const builder2 = this.client.columnBuilder(this, type, args);
      this._statements.push({
        grouping: "columns",
        builder: builder2
      });
      return builder2;
    };
  });
  const AlterMethods = {
    // Renames the current column `from` the current
    // TODO: this.column(from).rename(to)
    renameColumn(from, to) {
      this._statements.push({
        grouping: "alterTable",
        method: "renameColumn",
        args: [from, to]
      });
      return this;
    },
    dropTimestamps() {
      return this.dropColumns(
        arguments[0] === true ? ["createdAt", "updatedAt"] : ["created_at", "updated_at"]
      );
    },
    setNullable(column) {
      this._statements.push({
        grouping: "alterTable",
        method: "setNullable",
        args: [column]
      });
      return this;
    },
    check(checkPredicate, bindings2, constraintName) {
      this._statements.push({
        grouping: "alterTable",
        method: "check",
        args: [checkPredicate, bindings2, constraintName]
      });
    },
    dropChecks() {
      this._statements.push({
        grouping: "alterTable",
        method: "dropChecks",
        args: toArray(arguments)
      });
    },
    dropNullable(column) {
      this._statements.push({
        grouping: "alterTable",
        method: "dropNullable",
        args: [column]
      });
      return this;
    }
    // TODO: changeType
  };
  AlterMethods.dropColumn = AlterMethods.dropColumns = function() {
    this._statements.push({
      grouping: "alterTable",
      method: "dropColumn",
      args: toArray(arguments)
    });
    return this;
  };
  TableBuilder.extend = (methodName, fn) => {
    if (Object.prototype.hasOwnProperty.call(TableBuilder.prototype, methodName)) {
      throw new Error(
        `Can't extend TableBuilder with existing method ('${methodName}').`
      );
    }
    assign(TableBuilder.prototype, { [methodName]: fn });
  };
  tablebuilder = TableBuilder;
  return tablebuilder;
}
var indexOf_1;
var hasRequiredIndexOf;
function requireIndexOf() {
  if (hasRequiredIndexOf) return indexOf_1;
  hasRequiredIndexOf = 1;
  var baseIndexOf = require_baseIndexOf(), toInteger = requireToInteger();
  var nativeMax = Math.max;
  function indexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return baseIndexOf(array, value, index);
  }
  indexOf_1 = indexOf;
  return indexOf_1;
}
var tablecompiler;
var hasRequiredTablecompiler;
function requireTablecompiler() {
  if (hasRequiredTablecompiler) return tablecompiler;
  hasRequiredTablecompiler = 1;
  const {
    pushAdditional,
    pushQuery,
    unshiftQuery
  } = requireHelpers();
  const helpers2 = requireHelpers$1();
  const groupBy = requireGroupBy();
  const indexOf = requireIndexOf();
  const isEmpty = requireIsEmpty();
  const tail = requireTail();
  const { normalizeArr } = requireHelpers$1();
  class TableCompiler {
    constructor(client2, tableBuilder) {
      this.client = client2;
      this.tableBuilder = tableBuilder;
      this._commonBuilder = this.tableBuilder;
      this.method = tableBuilder._method;
      this.schemaNameRaw = tableBuilder._schemaName;
      this.tableNameRaw = tableBuilder._tableName;
      this.tableNameLikeRaw = tableBuilder._tableNameLike;
      this.single = tableBuilder._single;
      this.grouped = groupBy(tableBuilder._statements, "grouping");
      this.formatter = client2.formatter(tableBuilder);
      this.bindings = [];
      this.formatter.bindings = this.bindings;
      this.bindingsHolder = this;
      this.sequence = [];
      this._formatting = client2.config && client2.config.formatting;
      this.checksCount = 0;
    }
    // Convert the tableCompiler toSQL
    toSQL() {
      this[this.method]();
      return this.sequence;
    }
    // Column Compilation
    // -------
    // If this is a table "creation", we need to first run through all
    // of the columns to build them into a single string,
    // and then run through anything else and push it to the query sequence.
    create(ifNot, like) {
      const columnBuilders = this.getColumns();
      const columns = columnBuilders.map((col) => col.toSQL());
      const columnTypes = this.getColumnTypes(columns);
      if (this.createAlterTableMethods) {
        this.alterTableForCreate(columnTypes);
      }
      this.createQuery(columnTypes, ifNot, like);
      this.columnQueries(columns);
      delete this.single.comment;
      this.alterTable();
    }
    // Only create the table if it doesn't exist.
    createIfNot() {
      this.create(true);
    }
    createLike() {
      this.create(false, true);
    }
    createLikeIfNot() {
      this.create(true, true);
    }
    // If we're altering the table, we need to one-by-one
    // go through and handle each of the queries associated
    // with altering the table's schema.
    alter() {
      const addColBuilders = this.getColumns();
      const addColumns = addColBuilders.map((col) => col.toSQL());
      const alterColBuilders = this.getColumns("alter");
      const alterColumns = alterColBuilders.map((col) => col.toSQL());
      const addColumnTypes = this.getColumnTypes(addColumns);
      const alterColumnTypes = this.getColumnTypes(alterColumns);
      this.addColumns(addColumnTypes);
      this.alterColumns(alterColumnTypes, alterColBuilders);
      this.columnQueries(addColumns);
      this.columnQueries(alterColumns);
      this.alterTable();
    }
    foreign(foreignData) {
      if (foreignData.inTable && foreignData.references) {
        const keyName = foreignData.keyName ? this.formatter.wrap(foreignData.keyName) : this._indexCommand("foreign", this.tableNameRaw, foreignData.column);
        const column = this.formatter.columnize(foreignData.column);
        const references = this.formatter.columnize(foreignData.references);
        const inTable = this.formatter.wrap(foreignData.inTable);
        const onUpdate = foreignData.onUpdate ? (this.lowerCase ? " on update " : " ON UPDATE ") + foreignData.onUpdate : "";
        const onDelete = foreignData.onDelete ? (this.lowerCase ? " on delete " : " ON DELETE ") + foreignData.onDelete : "";
        const deferrable = foreignData.deferrable ? this.lowerCase ? ` deferrable initially ${foreignData.deferrable.toLowerCase()} ` : ` DEFERRABLE INITIALLY ${foreignData.deferrable.toUpperCase()} ` : "";
        if (this.lowerCase) {
          this.pushQuery(
            (!this.forCreate ? `alter table ${this.tableName()} add ` : "") + "constraint " + keyName + " foreign key (" + column + ") references " + inTable + " (" + references + ")" + onUpdate + onDelete + deferrable
          );
        } else {
          this.pushQuery(
            (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : "") + "CONSTRAINT " + keyName + " FOREIGN KEY (" + column + ") REFERENCES " + inTable + " (" + references + ")" + onUpdate + onDelete + deferrable
          );
        }
      }
    }
    // Get all of the column sql & bindings individually for building the table queries.
    getColumnTypes(columns) {
      return columns.reduce(
        function(memo, columnSQL) {
          const column = columnSQL[0];
          memo.sql.push(column.sql);
          memo.bindings.concat(column.bindings);
          return memo;
        },
        { sql: [], bindings: [] }
      );
    }
    // Adds all of the additional queries from the "column"
    columnQueries(columns) {
      const queries = columns.reduce(function(memo, columnSQL) {
        const column = tail(columnSQL);
        if (!isEmpty(column)) return memo.concat(column);
        return memo;
      }, []);
      for (const q of queries) {
        this.pushQuery(q);
      }
    }
    // All of the columns to "add" for the query
    addColumns(columns, prefix) {
      prefix = prefix || this.addColumnsPrefix;
      if (columns.sql.length > 0) {
        const columnSql = columns.sql.map((column) => {
          return prefix + column;
        });
        this.pushQuery({
          sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + columnSql.join(", "),
          bindings: columns.bindings
        });
      }
    }
    alterColumns(columns, colBuilders) {
      if (columns.sql.length > 0) {
        this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
      }
    }
    // Compile the columns as needed for the current create or alter table
    getColumns(method) {
      const columns = this.grouped.columns || [];
      method = method || "add";
      const queryContext = this.tableBuilder.queryContext();
      return columns.filter((column) => column.builder._method === method).map((column) => {
        if (queryContext !== void 0 && column.builder.queryContext() === void 0) {
          column.builder.queryContext(queryContext);
        }
        return this.client.columnCompiler(this, column.builder);
      });
    }
    tableName() {
      const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.tableNameRaw}` : this.tableNameRaw;
      return this.formatter.wrap(name);
    }
    tableNameLike() {
      const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.tableNameLikeRaw}` : this.tableNameLikeRaw;
      return this.formatter.wrap(name);
    }
    // Generate all of the alter column statements necessary for the query.
    alterTable() {
      const alterTable = this.grouped.alterTable || [];
      for (let i = 0, l = alterTable.length; i < l; i++) {
        const statement = alterTable[i];
        if (this[statement.method]) {
          this[statement.method].apply(this, statement.args);
        } else {
          this.client.logger.error(`Debug: ${statement.method} does not exist`);
        }
      }
      for (const item in this.single) {
        if (typeof this[item] === "function") this[item](this.single[item]);
      }
    }
    alterTableForCreate(columnTypes) {
      this.forCreate = true;
      const savedSequence = this.sequence;
      const alterTable = this.grouped.alterTable || [];
      this.grouped.alterTable = [];
      for (let i = 0, l = alterTable.length; i < l; i++) {
        const statement = alterTable[i];
        if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
          this.grouped.alterTable.push(statement);
          continue;
        }
        if (this[statement.method]) {
          this.sequence = [];
          this[statement.method].apply(this, statement.args);
          columnTypes.sql.push(this.sequence[0].sql);
        } else {
          this.client.logger.error(`Debug: ${statement.method} does not exist`);
        }
      }
      this.sequence = savedSequence;
      this.forCreate = false;
    }
    // Drop the index on the current table.
    dropIndex(value) {
      this.pushQuery(`drop index${value}`);
    }
    dropUnique() {
      throw new Error("Method implemented in the dialect driver");
    }
    dropForeign() {
      throw new Error("Method implemented in the dialect driver");
    }
    dropColumn() {
      const columns = helpers2.normalizeArr.apply(null, arguments);
      const drops = (Array.isArray(columns) ? columns : [columns]).map(
        (column) => {
          return this.dropColumnPrefix + this.formatter.wrap(column);
        }
      );
      this.pushQuery(
        (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + drops.join(", ")
      );
    }
    //Default implementation of setNullable. Overwrite on dialect-specific tablecompiler when needed
    //(See postgres/mssql for reference)
    _setNullableState(column, nullable) {
      const tableName = this.tableName();
      const columnName = this.formatter.columnize(column);
      const alterColumnPrefix = this.alterColumnsPrefix;
      return this.pushQuery({
        sql: "SELECT 1",
        output: () => {
          return this.client.queryBuilder().from(this.tableNameRaw).columnInfo(column).then((columnInfo) => {
            if (isEmpty(columnInfo)) {
              throw new Error(
                `.setNullable: Column ${columnName} does not exist in table ${tableName}.`
              );
            }
            const nullableType = nullable ? "null" : "not null";
            const columnType = columnInfo.type + (columnInfo.maxLength ? `(${columnInfo.maxLength})` : "");
            const defaultValue = columnInfo.defaultValue !== null && columnInfo.defaultValue !== void 0 ? `default '${columnInfo.defaultValue}'` : "";
            const sql = `alter table ${tableName} ${alterColumnPrefix} ${columnName} ${columnType} ${nullableType} ${defaultValue}`;
            return this.client.raw(sql);
          });
        }
      });
    }
    setNullable(column) {
      return this._setNullableState(column, true);
    }
    dropNullable(column) {
      return this._setNullableState(column, false);
    }
    dropChecks(checkConstraintNames) {
      if (checkConstraintNames === void 0) return "";
      checkConstraintNames = normalizeArr(checkConstraintNames);
      const tableName = this.tableName();
      const sql = `alter table ${tableName} ${checkConstraintNames.map((constraint) => `drop constraint ${constraint}`).join(", ")}`;
      this.pushQuery(sql);
    }
    check(checkPredicate, bindings2, constraintName) {
      const tableName = this.tableName();
      let checkConstraint = constraintName;
      if (!checkConstraint) {
        this.checksCount++;
        checkConstraint = tableName + "_" + this.checksCount;
      }
      const sql = `alter table ${tableName} add constraint ${checkConstraint} check(${checkPredicate})`;
      this.pushQuery(sql);
    }
    _addChecks() {
      if (this.grouped.checks) {
        return ", " + this.grouped.checks.map((c) => {
          return `${c.args[2] ? "constraint " + c.args[2] + " " : ""}check (${this.client.raw(c.args[0], c.args[1])})`;
        }).join(", ");
      }
      return "";
    }
    // If no name was specified for this index, we will create one using a basic
    // convention of the table name, followed by the columns, followed by an
    // index type, such as primary or index, which makes the index unique.
    _indexCommand(type, tableName, columns) {
      if (!Array.isArray(columns)) columns = columns ? [columns] : [];
      const table = tableName.replace(/\.|-/g, "_");
      const indexName = (table + "_" + columns.join("_") + "_" + type).toLowerCase();
      return this.formatter.wrap(indexName);
    }
    _getPrimaryKeys() {
      return (this.grouped.alterTable || []).filter((a) => a.method === "primary").flatMap((a) => a.args).flat();
    }
    _canBeAddPrimaryKey(options) {
      return options.primaryKey && this._getPrimaryKeys().length === 0;
    }
    _getIncrementsColumnNames() {
      return this.grouped.columns.filter((c) => c.builder._type === "increments").map((c) => c.builder._args[0]);
    }
    _getBigIncrementsColumnNames() {
      return this.grouped.columns.filter((c) => c.builder._type === "bigincrements").map((c) => c.builder._args[0]);
    }
  }
  TableCompiler.prototype.pushQuery = pushQuery;
  TableCompiler.prototype.pushAdditional = pushAdditional;
  TableCompiler.prototype.unshiftQuery = unshiftQuery;
  TableCompiler.prototype.lowerCase = true;
  TableCompiler.prototype.createAlterTableMethods = null;
  TableCompiler.prototype.addColumnsPrefix = "add column ";
  TableCompiler.prototype.alterColumnsPrefix = "alter column ";
  TableCompiler.prototype.modifyColumnPrefix = "modify column ";
  TableCompiler.prototype.dropColumnPrefix = "drop column ";
  tablecompiler = TableCompiler;
  return tablecompiler;
}
var columnbuilder;
var hasRequiredColumnbuilder;
function requireColumnbuilder() {
  if (hasRequiredColumnbuilder) return columnbuilder;
  hasRequiredColumnbuilder = 1;
  const extend2 = requireExtend();
  const assign = requireAssign();
  const toArray = requireToArray();
  const { addQueryContext } = requireHelpers$1();
  class ColumnBuilder {
    constructor(client2, tableBuilder, type, args) {
      this.client = client2;
      this._method = "add";
      this._single = {};
      this._modifiers = {};
      this._statements = [];
      this._type = columnAlias[type] || type;
      this._args = args;
      this._tableBuilder = tableBuilder;
      if (tableBuilder._method === "alter") {
        extend2(this, AlterMethods);
      }
    }
    // Specify that the current column "references" a column,
    // which may be tableName.column or just "column"
    references(value) {
      return this._tableBuilder.foreign.call(this._tableBuilder, this._args[0], void 0, this)._columnBuilder(this).references(value);
    }
  }
  const modifiers = [
    "default",
    "defaultsTo",
    "defaultTo",
    "unsigned",
    "nullable",
    "first",
    "after",
    "comment",
    "collate",
    "check",
    "checkPositive",
    "checkNegative",
    "checkIn",
    "checkNotIn",
    "checkBetween",
    "checkLength",
    "checkRegex"
  ];
  const aliasMethod = {
    default: "defaultTo",
    defaultsTo: "defaultTo"
  };
  modifiers.forEach(function(method) {
    const key = aliasMethod[method] || method;
    ColumnBuilder.prototype[method] = function() {
      this._modifiers[key] = toArray(arguments);
      return this;
    };
  });
  addQueryContext(ColumnBuilder);
  ColumnBuilder.prototype.notNull = ColumnBuilder.prototype.notNullable = function notNullable() {
    return this.nullable(false);
  };
  ["index", "primary", "unique"].forEach(function(method) {
    ColumnBuilder.prototype[method] = function() {
      if (this._type.toLowerCase().indexOf("increments") === -1) {
        this._tableBuilder[method].apply(
          this._tableBuilder,
          [this._args[0]].concat(toArray(arguments))
        );
      }
      return this;
    };
  });
  ColumnBuilder.extend = (methodName, fn) => {
    if (Object.prototype.hasOwnProperty.call(ColumnBuilder.prototype, methodName)) {
      throw new Error(
        `Can't extend ColumnBuilder with existing method ('${methodName}').`
      );
    }
    assign(ColumnBuilder.prototype, { [methodName]: fn });
  };
  const AlterMethods = {};
  AlterMethods.drop = function() {
    this._single.drop = true;
    return this;
  };
  AlterMethods.alterType = function(type) {
    this._statements.push({
      grouping: "alterType",
      value: type
    });
    return this;
  };
  AlterMethods.alter = function({
    alterNullable = true,
    alterType = true
  } = {}) {
    this._method = "alter";
    this.alterNullable = alterNullable;
    this.alterType = alterType;
    return this;
  };
  const columnAlias = {
    float: "floating",
    enum: "enu",
    boolean: "bool",
    string: "varchar",
    bigint: "bigInteger"
  };
  columnbuilder = ColumnBuilder;
  return columnbuilder;
}
var head_1;
var hasRequiredHead;
function requireHead() {
  if (hasRequiredHead) return head_1;
  hasRequiredHead = 1;
  function head(array) {
    return array && array.length ? array[0] : void 0;
  }
  head_1 = head;
  return head_1;
}
var first;
var hasRequiredFirst;
function requireFirst() {
  if (hasRequiredFirst) return first;
  hasRequiredFirst = 1;
  first = requireHead();
  return first;
}
var columncompiler;
var hasRequiredColumncompiler;
function requireColumncompiler() {
  if (hasRequiredColumncompiler) return columncompiler;
  hasRequiredColumncompiler = 1;
  const helpers2 = requireHelpers();
  const groupBy = requireGroupBy();
  const first2 = requireFirst();
  const has = requireHas();
  const tail = requireTail();
  const { toNumber } = requireHelpers$1();
  const { formatDefault } = requireFormatterUtils();
  const { operator: operator_ } = requireWrappingFormatter();
  class ColumnCompiler {
    constructor(client2, tableCompiler, columnBuilder) {
      this.client = client2;
      this.tableCompiler = tableCompiler;
      this.columnBuilder = columnBuilder;
      this._commonBuilder = this.columnBuilder;
      this.args = columnBuilder._args;
      this.type = columnBuilder._type.toLowerCase();
      this.grouped = groupBy(columnBuilder._statements, "grouping");
      this.modified = columnBuilder._modifiers;
      this.isIncrements = this.type.indexOf("increments") !== -1;
      this.formatter = client2.formatter(columnBuilder);
      this.bindings = [];
      this.formatter.bindings = this.bindings;
      this.bindingsHolder = this;
      this.sequence = [];
      this.modifiers = [];
      this.checksCount = 0;
    }
    _addCheckModifiers() {
      this.modifiers.push(
        "check",
        "checkPositive",
        "checkNegative",
        "checkIn",
        "checkNotIn",
        "checkBetween",
        "checkLength",
        "checkRegex"
      );
    }
    defaults(label) {
      if (Object.prototype.hasOwnProperty.call(this._defaultMap, label)) {
        return this._defaultMap[label].bind(this)();
      } else {
        throw new Error(
          `There is no default for the specified identifier ${label}`
        );
      }
    }
    // To convert to sql, we first go through and build the
    // column as it would be in the insert statement
    toSQL() {
      this.pushQuery(this.compileColumn());
      if (this.sequence.additional) {
        this.sequence = this.sequence.concat(this.sequence.additional);
      }
      return this.sequence;
    }
    // Compiles a column.
    compileColumn() {
      return this.formatter.wrap(this.getColumnName()) + " " + this.getColumnType() + this.getModifiers();
    }
    // Assumes the autoincrementing key is named `id` if not otherwise specified.
    getColumnName() {
      const value = first2(this.args);
      return value || this.defaults("columnName");
    }
    getColumnType() {
      if (!this._columnType) {
        const type = this[this.type];
        this._columnType = typeof type === "function" ? type.apply(this, tail(this.args)) : type;
      }
      return this._columnType;
    }
    getModifiers() {
      const modifiers = [];
      for (let i = 0, l = this.modifiers.length; i < l; i++) {
        const modifier = this.modifiers[i];
        if (!this.isIncrements || this.isIncrements && modifier === "comment") {
          if (has(this.modified, modifier)) {
            const val = this[modifier].apply(this, this.modified[modifier]);
            if (val) modifiers.push(val);
          }
        }
      }
      return modifiers.length > 0 ? ` ${modifiers.join(" ")}` : "";
    }
    // Types
    // ------
    varchar(length) {
      return `varchar(${toNumber(length, 255)})`;
    }
    floating(precision, scale) {
      return `float(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    decimal(precision, scale) {
      if (precision === null) {
        throw new Error(
          "Specifying no precision on decimal columns is not supported for that SQL dialect."
        );
      }
      return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    // Used to support custom types
    specifictype(type) {
      return type;
    }
    // Modifiers
    // -------
    nullable(nullable) {
      return nullable === false ? "not null" : "null";
    }
    notNullable() {
      return this.nullable(false);
    }
    defaultTo(value) {
      return `default ${formatDefault(value, this.type, this.client)}`;
    }
    increments(options = { primaryKey: true }) {
      return "integer not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "") + " autoincrement";
    }
    bigincrements(options = { primaryKey: true }) {
      return this.increments(options);
    }
    _pushAlterCheckQuery(checkPredicate, constraintName) {
      let checkName = constraintName;
      if (!checkName) {
        this.checksCount++;
        checkName = this.tableCompiler.tableNameRaw + "_" + this.getColumnName() + "_" + this.checksCount;
      }
      this.pushAdditional(function() {
        this.pushQuery(
          `alter table ${this.tableCompiler.tableName()} add constraint ${checkName} check(${checkPredicate})`
        );
      });
    }
    _checkConstraintName(constraintName) {
      return constraintName ? `constraint ${constraintName} ` : "";
    }
    _check(checkPredicate, constraintName) {
      if (this.columnBuilder._method === "alter") {
        this._pushAlterCheckQuery(checkPredicate, constraintName);
        return "";
      }
      return `${this._checkConstraintName(
        constraintName
      )}check (${checkPredicate})`;
    }
    checkPositive(constraintName) {
      return this._check(
        `${this.formatter.wrap(this.getColumnName())} ${operator_(
          ">",
          this.columnBuilder,
          this.bindingsHolder
        )} 0`,
        constraintName
      );
    }
    checkNegative(constraintName) {
      return this._check(
        `${this.formatter.wrap(this.getColumnName())} ${operator_(
          "<",
          this.columnBuilder,
          this.bindingsHolder
        )} 0`,
        constraintName
      );
    }
    _checkIn(values, constraintName, not) {
      return this._check(
        `${this.formatter.wrap(this.getColumnName())} ${not ? "not " : ""}in (${values.map((v) => this.client._escapeBinding(v)).join(",")})`,
        constraintName
      );
    }
    checkIn(values, constraintName) {
      return this._checkIn(values, constraintName);
    }
    checkNotIn(values, constraintName) {
      return this._checkIn(values, constraintName, true);
    }
    checkBetween(intervals, constraintName) {
      if (intervals.length === 2 && !Array.isArray(intervals[0]) && !Array.isArray(intervals[1])) {
        intervals = [intervals];
      }
      const intervalChecks = intervals.map((interval) => {
        return `${this.formatter.wrap(
          this.getColumnName()
        )} between ${this.client._escapeBinding(
          interval[0]
        )} and ${this.client._escapeBinding(interval[1])}`;
      }).join(" or ");
      return this._check(intervalChecks, constraintName);
    }
    checkLength(operator, length, constraintName) {
      return this._check(
        `length(${this.formatter.wrap(this.getColumnName())}) ${operator_(
          operator,
          this.columnBuilder,
          this.bindingsHolder
        )} ${toNumber(length)}`,
        constraintName
      );
    }
  }
  ColumnCompiler.prototype.binary = "blob";
  ColumnCompiler.prototype.bool = "boolean";
  ColumnCompiler.prototype.date = "date";
  ColumnCompiler.prototype.datetime = "datetime";
  ColumnCompiler.prototype.time = "time";
  ColumnCompiler.prototype.timestamp = "timestamp";
  ColumnCompiler.prototype.geometry = "geometry";
  ColumnCompiler.prototype.geography = "geography";
  ColumnCompiler.prototype.point = "point";
  ColumnCompiler.prototype.enu = "varchar";
  ColumnCompiler.prototype.bit = ColumnCompiler.prototype.json = "text";
  ColumnCompiler.prototype.uuid = ({
    useBinaryUuid = false,
    primaryKey = false
  } = {}) => useBinaryUuid ? "binary(16)" : "char(36)";
  ColumnCompiler.prototype.integer = ColumnCompiler.prototype.smallint = ColumnCompiler.prototype.mediumint = "integer";
  ColumnCompiler.prototype.biginteger = "bigint";
  ColumnCompiler.prototype.text = "text";
  ColumnCompiler.prototype.tinyint = "tinyint";
  ColumnCompiler.prototype.pushQuery = helpers2.pushQuery;
  ColumnCompiler.prototype.pushAdditional = helpers2.pushAdditional;
  ColumnCompiler.prototype.unshiftQuery = helpers2.unshiftQuery;
  ColumnCompiler.prototype._defaultMap = {
    columnName: function() {
      if (!this.isIncrements) {
        throw new Error(
          `You did not specify a column name for the ${this.type} column.`
        );
      }
      return "id";
    }
  };
  columncompiler = ColumnCompiler;
  return columncompiler;
}
var ref;
var hasRequiredRef;
function requireRef() {
  if (hasRequiredRef) return ref;
  hasRequiredRef = 1;
  const Raw = requireRaw();
  class Ref extends Raw {
    constructor(client2, ref2) {
      super(client2);
      this.ref = ref2;
      this._schema = null;
      this._alias = null;
    }
    withSchema(schema) {
      this._schema = schema;
      return this;
    }
    as(alias) {
      this._alias = alias;
      return this;
    }
    toSQL() {
      const string2 = this._schema ? `${this._schema}.${this.ref}` : this.ref;
      const formatter2 = this.client.formatter(this);
      const ref2 = formatter2.columnize(string2);
      const sql = this._alias ? `${ref2} as ${formatter2.wrap(this._alias)}` : ref2;
      this.set(sql, []);
      return super.toSQL(...arguments);
    }
  }
  ref = Ref;
  return ref;
}
var formatter;
var hasRequiredFormatter;
function requireFormatter() {
  if (hasRequiredFormatter) return formatter;
  hasRequiredFormatter = 1;
  const {
    columnize: columnize_,
    wrap: wrap_
  } = requireWrappingFormatter();
  class Formatter {
    constructor(client2, builder2) {
      this.client = client2;
      this.builder = builder2;
      this.bindings = [];
    }
    // Accepts a string or array of columns to wrap as appropriate.
    columnize(target) {
      return columnize_(target, this.builder, this.client, this);
    }
    // Puts the appropriate wrapper around a value depending on the database
    // engine, unless it's a knex.raw value, in which case it's left alone.
    wrap(value, isParameter) {
      return wrap_(value, isParameter, this.builder, this.client, this);
    }
  }
  formatter = Formatter;
  return formatter;
}
var viewbuilder;
var hasRequiredViewbuilder;
function requireViewbuilder() {
  if (hasRequiredViewbuilder) return viewbuilder;
  hasRequiredViewbuilder = 1;
  const helpers2 = requireHelpers$1();
  const extend2 = requireExtend();
  const assign = requireAssign();
  class ViewBuilder {
    constructor(client2, method, viewName, fn) {
      this.client = client2;
      this._method = method;
      this._schemaName = void 0;
      this._columns = void 0;
      this._fn = fn;
      this._viewName = viewName;
      this._statements = [];
      this._single = {};
    }
    setSchema(schemaName) {
      this._schemaName = schemaName;
    }
    columns(columns) {
      this._columns = columns;
    }
    as(selectQuery) {
      this._selectQuery = selectQuery;
    }
    checkOption() {
      throw new Error(
        "check option definition is not supported by this dialect."
      );
    }
    localCheckOption() {
      throw new Error(
        "check option definition is not supported by this dialect."
      );
    }
    cascadedCheckOption() {
      throw new Error(
        "check option definition is not supported by this dialect."
      );
    }
    toSQL() {
      if (this._method === "alter") {
        extend2(this, AlterMethods);
      }
      this._fn.call(this, this);
      return this.client.viewCompiler(this).toSQL();
    }
  }
  const AlterMethods = {
    column(column) {
      const self2 = this;
      return {
        rename: function(newName) {
          self2._statements.push({
            grouping: "alterView",
            method: "renameColumn",
            args: [column, newName]
          });
          return this;
        },
        defaultTo: function(defaultValue) {
          self2._statements.push({
            grouping: "alterView",
            method: "defaultTo",
            args: [column, defaultValue]
          });
          return this;
        }
      };
    }
  };
  helpers2.addQueryContext(ViewBuilder);
  ViewBuilder.extend = (methodName, fn) => {
    if (Object.prototype.hasOwnProperty.call(ViewBuilder.prototype, methodName)) {
      throw new Error(
        `Can't extend ViewBuilder with existing method ('${methodName}').`
      );
    }
    assign(ViewBuilder.prototype, { [methodName]: fn });
  };
  viewbuilder = ViewBuilder;
  return viewbuilder;
}
var viewcompiler;
var hasRequiredViewcompiler;
function requireViewcompiler() {
  if (hasRequiredViewcompiler) return viewcompiler;
  hasRequiredViewcompiler = 1;
  const { pushQuery } = requireHelpers();
  const groupBy = requireGroupBy();
  const { columnize: columnize_ } = requireWrappingFormatter();
  class ViewCompiler {
    constructor(client2, viewBuilder) {
      this.client = client2;
      this.viewBuilder = viewBuilder;
      this._commonBuilder = this.viewBuilder;
      this.method = viewBuilder._method;
      this.schemaNameRaw = viewBuilder._schemaName;
      this.viewNameRaw = viewBuilder._viewName;
      this.single = viewBuilder._single;
      this.selectQuery = viewBuilder._selectQuery;
      this.columns = viewBuilder._columns;
      this.grouped = groupBy(viewBuilder._statements, "grouping");
      this.formatter = client2.formatter(viewBuilder);
      this.bindings = [];
      this.formatter.bindings = this.bindings;
      this.bindingsHolder = this;
      this.sequence = [];
    }
    // Convert the tableCompiler toSQL
    toSQL() {
      this[this.method]();
      return this.sequence;
    }
    // Column Compilation
    // -------
    create() {
      this.createQuery(this.columns, this.selectQuery);
    }
    createOrReplace() {
      throw new Error("replace views is not supported by this dialect.");
    }
    createMaterializedView() {
      throw new Error("materialized views are not supported by this dialect.");
    }
    createQuery(columns, selectQuery, materialized, replace) {
      const createStatement = "create " + (materialized ? "materialized " : "") + (replace ? "or replace " : "") + "view ";
      const columnList = columns ? " (" + columnize_(
        columns,
        this.viewBuilder,
        this.client,
        this.bindingsHolder
      ) + ")" : "";
      let sql = createStatement + this.viewName() + columnList;
      sql += " as ";
      sql += selectQuery.toString();
      switch (this.single.checkOption) {
        case "default_option":
          sql += " with check option";
          break;
        case "local":
          sql += " with local check option";
          break;
        case "cascaded":
          sql += " with cascaded check option";
          break;
      }
      this.pushQuery({
        sql
      });
    }
    renameView(from, to) {
      throw new Error(
        "rename view is not supported by this dialect (instead drop, then create another view)."
      );
    }
    refreshMaterializedView() {
      throw new Error("materialized views are not supported by this dialect.");
    }
    alter() {
      this.alterView();
    }
    alterView() {
      const alterView = this.grouped.alterView || [];
      for (let i = 0, l = alterView.length; i < l; i++) {
        const statement = alterView[i];
        if (this[statement.method]) {
          this[statement.method].apply(this, statement.args);
        } else {
          this.client.logger.error(`Debug: ${statement.method} does not exist`);
        }
      }
      for (const item in this.single) {
        if (typeof this[item] === "function") this[item](this.single[item]);
      }
    }
    renameColumn(from, to) {
      throw new Error("rename column of views is not supported by this dialect.");
    }
    defaultTo(column, defaultValue) {
      throw new Error(
        "change default values of views is not supported by this dialect."
      );
    }
    viewName() {
      const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.viewNameRaw}` : this.viewNameRaw;
      return this.formatter.wrap(name);
    }
  }
  ViewCompiler.prototype.pushQuery = pushQuery;
  viewcompiler = ViewCompiler;
  return viewcompiler;
}
var client;
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  const { Pool: Pool2, TimeoutError: TimeoutError2 } = requireTarn();
  const { EventEmitter } = require$$0;
  const { promisify } = require$$2$1;
  const { makeEscape } = requireString();
  const cloneDeep = requireCloneDeep();
  const defaults = requireDefaults();
  const uniqueId = requireUniqueId();
  const Runner = requireRunner();
  const Transaction = requireTransaction$5();
  const {
    executeQuery,
    enrichQueryObject
  } = requireQueryExecutioner();
  const QueryBuilder = requireQuerybuilder();
  const QueryCompiler = requireQuerycompiler();
  const SchemaBuilder = requireBuilder();
  const SchemaCompiler = requireCompiler$1();
  const TableBuilder = requireTablebuilder();
  const TableCompiler = requireTablecompiler();
  const ColumnBuilder = requireColumnbuilder();
  const ColumnCompiler = requireColumncompiler();
  const { KnexTimeoutError } = requireTimeout();
  const { outputQuery, unwrapRaw } = requireWrappingFormatter();
  const { compileCallback } = requireFormatterUtils();
  const Raw = requireRaw();
  const Ref = requireRef();
  const Formatter = requireFormatter();
  const Logger = requireLogger();
  const { POOL_CONFIG_OPTIONS } = requireConstants$1();
  const ViewBuilder = requireViewbuilder();
  const ViewCompiler = requireViewcompiler();
  const isPlainObject = requireIsPlainObject();
  const { setHiddenProperty } = requireSecurity();
  const debug = requireSrc()("knex:client");
  class Client extends EventEmitter {
    constructor(config = {}) {
      super();
      this.config = config;
      this.logger = new Logger(config);
      if (this.config.connection && this.config.connection.password) {
        setHiddenProperty(this.config.connection);
      }
      if (this.dialect && !this.config.client) {
        this.logger.warn(
          `Using 'this.dialect' to identify the client is deprecated and support for it will be removed in the future. Please use configuration option 'client' instead.`
        );
      }
      const dbClient = this.config.client || this.dialect;
      if (!dbClient) {
        throw new Error(
          `knex: Required configuration option 'client' is missing.`
        );
      }
      if (config.version) {
        this.version = config.version;
      }
      if (config.connection && config.connection instanceof Function) {
        this.connectionConfigProvider = config.connection;
        this.connectionConfigExpirationChecker = () => true;
      } else {
        this.connectionSettings = cloneDeep(config.connection || {});
        if (config.connection && config.connection.password) {
          setHiddenProperty(this.connectionSettings, config.connection);
        }
        this.connectionConfigExpirationChecker = null;
      }
      if (this.driverName && config.connection) {
        this.initializeDriver();
        if (!config.pool || config.pool && config.pool.max !== 0) {
          this.initializePool(config);
        }
      }
      this.valueForUndefined = this.raw("DEFAULT");
      if (config.useNullAsDefault) {
        this.valueForUndefined = null;
      }
    }
    formatter(builder2) {
      return new Formatter(this, builder2);
    }
    queryBuilder() {
      return new QueryBuilder(this);
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    schemaBuilder() {
      return new SchemaBuilder(this);
    }
    schemaCompiler(builder2) {
      return new SchemaCompiler(this, builder2);
    }
    tableBuilder(type, tableName, tableNameLike, fn) {
      return new TableBuilder(this, type, tableName, tableNameLike, fn);
    }
    viewBuilder(type, viewBuilder, fn) {
      return new ViewBuilder(this, type, viewBuilder, fn);
    }
    tableCompiler(tableBuilder) {
      return new TableCompiler(this, tableBuilder);
    }
    viewCompiler(viewCompiler) {
      return new ViewCompiler(this, viewCompiler);
    }
    columnBuilder(tableBuilder, type, args) {
      return new ColumnBuilder(this, tableBuilder, type, args);
    }
    columnCompiler(tableBuilder, columnBuilder) {
      return new ColumnCompiler(this, tableBuilder, columnBuilder);
    }
    runner(builder2) {
      return new Runner(this, builder2);
    }
    transaction(container, config, outerTx) {
      return new Transaction(this, container, config, outerTx);
    }
    raw() {
      return new Raw(this).set(...arguments);
    }
    ref() {
      return new Ref(this, ...arguments);
    }
    query(connection, queryParam) {
      const queryObject = enrichQueryObject(connection, queryParam, this);
      return executeQuery(connection, queryObject, this);
    }
    stream(connection, queryParam, stream, options) {
      const queryObject = enrichQueryObject(connection, queryParam, this);
      return this._stream(connection, queryObject, stream, options);
    }
    prepBindings(bindings2) {
      return bindings2;
    }
    positionBindings(sql) {
      return sql;
    }
    postProcessResponse(resp, queryContext) {
      if (this.config.postProcessResponse) {
        return this.config.postProcessResponse(resp, queryContext);
      }
      return resp;
    }
    wrapIdentifier(value, queryContext) {
      return this.customWrapIdentifier(
        value,
        this.wrapIdentifierImpl,
        queryContext
      );
    }
    customWrapIdentifier(value, origImpl, queryContext) {
      if (this.config.wrapIdentifier) {
        return this.config.wrapIdentifier(value, origImpl, queryContext);
      }
      return origImpl(value);
    }
    wrapIdentifierImpl(value) {
      return value !== "*" ? `"${value.replace(/"/g, '""')}"` : "*";
    }
    initializeDriver() {
      try {
        this.driver = this._driver();
      } catch (e) {
        const message = `Knex: run
$ npm install ${this.driverName} --save`;
        this.logger.error(`${message}
${e.message}
${e.stack}`);
        throw new Error(`${message}
${e.message}`);
      }
    }
    poolDefaults() {
      return { min: 2, max: 10, propagateCreateError: true };
    }
    getPoolSettings(poolConfig) {
      poolConfig = defaults({}, poolConfig, this.poolDefaults());
      POOL_CONFIG_OPTIONS.forEach((option) => {
        if (option in poolConfig) {
          this.logger.warn(
            [
              `Pool config option "${option}" is no longer supported.`,
              `See https://github.com/Vincit/tarn.js for possible pool config options.`
            ].join(" ")
          );
        }
      });
      const DEFAULT_ACQUIRE_TIMEOUT = 6e4;
      const timeouts = [
        this.config.acquireConnectionTimeout,
        poolConfig.acquireTimeoutMillis
      ].filter((timeout2) => timeout2 !== void 0);
      if (!timeouts.length) {
        timeouts.push(DEFAULT_ACQUIRE_TIMEOUT);
      }
      poolConfig.acquireTimeoutMillis = Math.min(...timeouts);
      const updatePoolConnectionSettingsFromProvider = async () => {
        if (!this.connectionConfigProvider) {
          return;
        }
        if (!this.connectionConfigExpirationChecker || !this.connectionConfigExpirationChecker()) {
          return;
        }
        const providerResult = await this.connectionConfigProvider();
        if (providerResult.expirationChecker) {
          this.connectionConfigExpirationChecker = providerResult.expirationChecker;
          delete providerResult.expirationChecker;
        } else {
          this.connectionConfigExpirationChecker = null;
        }
        this.connectionSettings = providerResult;
      };
      return Object.assign(poolConfig, {
        create: async () => {
          await updatePoolConnectionSettingsFromProvider();
          const connection = await this.acquireRawConnection();
          connection.__knexUid = uniqueId("__knexUid");
          if (poolConfig.afterCreate) {
            await promisify(poolConfig.afterCreate)(connection);
          }
          return connection;
        },
        destroy: (connection) => {
          if (connection !== void 0) {
            return this.destroyRawConnection(connection);
          }
        },
        validate: (connection) => {
          if (connection.__knex__disposed) {
            this.logger.warn(`Connection Error: ${connection.__knex__disposed}`);
            return false;
          }
          return this.validateConnection(connection);
        }
      });
    }
    initializePool(config = this.config) {
      if (this.pool) {
        this.logger.warn("The pool has already been initialized");
        return;
      }
      const tarnPoolConfig = {
        ...this.getPoolSettings(config.pool)
      };
      if (tarnPoolConfig.afterCreate) {
        delete tarnPoolConfig.afterCreate;
      }
      this.pool = new Pool2(tarnPoolConfig);
    }
    validateConnection(connection) {
      return true;
    }
    // Acquire a connection from the pool.
    async acquireConnection() {
      if (!this.pool) {
        throw new Error("Unable to acquire a connection");
      }
      try {
        const connection = await this.pool.acquire().promise;
        debug("acquired connection from pool: %s", connection.__knexUid);
        if (connection.config) {
          if (connection.config.password) {
            setHiddenProperty(connection.config);
          }
          if (connection.config.authentication && connection.config.authentication.options && connection.config.authentication.options.password) {
            setHiddenProperty(connection.config.authentication.options);
          }
        }
        return connection;
      } catch (error) {
        let convertedError = error;
        if (error instanceof TimeoutError2) {
          convertedError = new KnexTimeoutError(
            "Knex: Timeout acquiring a connection. The pool is probably full. Are you missing a .transacting(trx) call?"
          );
        }
        throw convertedError;
      }
    }
    // Releases a connection back to the connection pool,
    // returning a promise resolved when the connection is released.
    releaseConnection(connection) {
      debug("releasing connection to pool: %s", connection.__knexUid);
      const didRelease = this.pool.release(connection);
      if (!didRelease) {
        debug("pool refused connection: %s", connection.__knexUid);
      }
      return Promise.resolve();
    }
    // Destroy the current connection pool for the client.
    async destroy(callback) {
      try {
        if (this.pool && this.pool.destroy) {
          await this.pool.destroy();
        }
        this.pool = void 0;
        if (typeof callback === "function") {
          callback();
        }
      } catch (err) {
        if (typeof callback === "function") {
          return callback(err);
        }
        throw err;
      }
    }
    // Return the database being used by this client.
    database() {
      return this.connectionSettings.database;
    }
    toString() {
      return "[object KnexClient]";
    }
    assertCanCancelQuery() {
      if (!this.canCancelQuery) {
        throw new Error("Query cancelling not supported for this dialect");
      }
    }
    cancelQuery() {
      throw new Error("Query cancelling not supported for this dialect");
    }
    // Formatter part
    alias(first2, second) {
      return first2 + " as " + second;
    }
    // Checks whether a value is a function... if it is, we compile it
    // otherwise we check whether it's a raw
    parameter(value, builder2, bindingsHolder) {
      if (typeof value === "function") {
        return outputQuery(
          compileCallback(value, void 0, this, bindingsHolder),
          true,
          builder2,
          this
        );
      }
      return unwrapRaw(value, true, builder2, this, bindingsHolder) || "?";
    }
    // Turns a list of values into a list of ?'s, joining them with commas unless
    // a "joining" value is specified (e.g. ' and ')
    parameterize(values, notSetValue, builder2, bindingsHolder) {
      if (typeof values === "function")
        return this.parameter(values, builder2, bindingsHolder);
      values = Array.isArray(values) ? values : [values];
      let str = "", i = -1;
      while (++i < values.length) {
        if (i > 0) str += ", ";
        let value = values[i];
        if (isPlainObject(value)) {
          value = JSON.stringify(value);
        }
        str += this.parameter(
          value === void 0 ? notSetValue : value,
          builder2,
          bindingsHolder
        );
      }
      return str;
    }
    // Formats `values` into a parenthesized list of parameters for a `VALUES`
    // clause.
    //
    // [1, 2]                  -> '(?, ?)'
    // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
    // knex('table')           -> '(select * from "table")'
    // knex.raw('select ?', 1) -> '(select ?)'
    //
    values(values, builder2, bindingsHolder) {
      if (Array.isArray(values)) {
        if (Array.isArray(values[0])) {
          return `(${values.map(
            (value) => `(${this.parameterize(
              value,
              void 0,
              builder2,
              bindingsHolder
            )})`
          ).join(", ")})`;
        }
        return `(${this.parameterize(
          values,
          void 0,
          builder2,
          bindingsHolder
        )})`;
      }
      if (values && values.isRawInstance) {
        return `(${this.parameter(values, builder2, bindingsHolder)})`;
      }
      return this.parameter(values, builder2, bindingsHolder);
    }
    processPassedConnection(connection) {
    }
    toPathForJson(jsonPath) {
      return jsonPath;
    }
  }
  Object.assign(Client.prototype, {
    _escapeBinding: makeEscape({
      escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
      }
    }),
    canCancelQuery: false
  });
  client = Client;
  return client;
}
var pgConnectionString;
var hasRequiredPgConnectionString;
function requirePgConnectionString() {
  if (hasRequiredPgConnectionString) return pgConnectionString;
  hasRequiredPgConnectionString = 1;
  function parse(str) {
    if (str.charAt(0) === "/") {
      const config2 = str.split(" ");
      return { host: config2[0], database: config2[1] };
    }
    const config = {};
    let result;
    let dummyHost = false;
    if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
      str = encodeURI(str).replace(/\%25(\d\d)/g, "%$1");
    }
    try {
      result = new URL(str, "postgres://base");
    } catch (e) {
      result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
      dummyHost = true;
    }
    for (const entry of result.searchParams.entries()) {
      config[entry[0]] = entry[1];
    }
    config.user = config.user || decodeURIComponent(result.username);
    config.password = config.password || decodeURIComponent(result.password);
    if (result.protocol == "socket:") {
      config.host = decodeURI(result.pathname);
      config.database = result.searchParams.get("db");
      config.client_encoding = result.searchParams.get("encoding");
      return config;
    }
    const hostname = dummyHost ? "" : result.hostname;
    if (!config.host) {
      config.host = decodeURIComponent(hostname);
    } else if (hostname && /^%2f/i.test(hostname)) {
      result.pathname = hostname + result.pathname;
    }
    if (!config.port) {
      config.port = result.port;
    }
    const pathname = result.pathname.slice(1) || null;
    config.database = pathname ? decodeURI(pathname) : null;
    if (config.ssl === "true" || config.ssl === "1") {
      config.ssl = true;
    }
    if (config.ssl === "0") {
      config.ssl = false;
    }
    if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
      config.ssl = {};
    }
    const fs = config.sslcert || config.sslkey || config.sslrootcert ? require$$0$3 : null;
    if (config.sslcert) {
      config.ssl.cert = fs.readFileSync(config.sslcert).toString();
    }
    if (config.sslkey) {
      config.ssl.key = fs.readFileSync(config.sslkey).toString();
    }
    if (config.sslrootcert) {
      config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
    }
    switch (config.sslmode) {
      case "disable": {
        config.ssl = false;
        break;
      }
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full": {
        break;
      }
      case "no-verify": {
        config.ssl.rejectUnauthorized = false;
        break;
      }
    }
    return config;
  }
  pgConnectionString = parse;
  parse.parse = parse;
  return pgConnectionString;
}
var parseConnection;
var hasRequiredParseConnection;
function requireParseConnection() {
  if (hasRequiredParseConnection) return parseConnection;
  hasRequiredParseConnection = 1;
  const { parse } = requirePgConnectionString();
  const parsePG = parse;
  const isWindows = process && process.platform && process.platform === "win32";
  function tryParse(str) {
    try {
      return new URL(str);
    } catch (e) {
      return null;
    }
  }
  parseConnection = function parseConnectionString(str) {
    const parsed = tryParse(str);
    const isDriveLetter = isWindows && parsed && parsed.protocol.length === 2;
    if (!parsed || isDriveLetter) {
      return {
        client: "sqlite3",
        connection: {
          filename: str
        }
      };
    }
    let { protocol } = parsed;
    if (protocol.slice(-1) === ":") {
      protocol = protocol.slice(0, -1);
    }
    const isPG = ["postgresql", "postgres"].includes(protocol);
    return {
      client: protocol,
      connection: isPG ? parsePG(str) : connectionObject(parsed)
    };
  };
  function connectionObject(parsed) {
    const connection = {};
    let db2 = parsed.pathname;
    if (db2[0] === "/") {
      db2 = db2.slice(1);
    }
    connection.database = db2;
    if (parsed.hostname) {
      if (parsed.protocol.indexOf("mssql") === 0) {
        connection.server = parsed.hostname;
      } else {
        connection.host = parsed.hostname;
      }
    }
    if (parsed.port) {
      connection.port = parsed.port;
    }
    if (parsed.username || parsed.password) {
      connection.user = decodeURIComponent(parsed.username);
    }
    if (parsed.password) {
      connection.password = decodeURIComponent(parsed.password);
    }
    if (parsed.searchParams) {
      for (const [key, value] of parsed.searchParams.entries()) {
        const isNestedConfigSupported = ["mysql:", "mariadb:", "mssql:"].includes(
          parsed.protocol
        );
        if (isNestedConfigSupported) {
          try {
            connection[key] = JSON.parse(value);
          } catch (err) {
            connection[key] = value;
          }
        } else {
          connection[key] = value;
        }
      }
    }
    return connection;
  }
  return parseConnection;
}
var dialects = {};
var sqliteTransaction;
var hasRequiredSqliteTransaction;
function requireSqliteTransaction() {
  if (hasRequiredSqliteTransaction) return sqliteTransaction;
  hasRequiredSqliteTransaction = 1;
  const Transaction = requireTransaction$5();
  class Transaction_Sqlite extends Transaction {
    begin(conn) {
      if (this.isolationLevel) {
        this.client.logger.warn(
          "sqlite3 only supports serializable transactions, ignoring the isolation level param"
        );
      }
      if (this.readOnly) {
        this.client.logger.warn(
          "sqlite3 implicitly handles read vs write transactions"
        );
      }
      return this.query(conn, "BEGIN;");
    }
  }
  sqliteTransaction = Transaction_Sqlite;
  return sqliteTransaction;
}
var sqliteQuerycompiler;
var hasRequiredSqliteQuerycompiler;
function requireSqliteQuerycompiler() {
  if (hasRequiredSqliteQuerycompiler) return sqliteQuerycompiler;
  hasRequiredSqliteQuerycompiler = 1;
  const constant = requireConstant();
  const each2 = requireEach();
  const identity = requireIdentity();
  const isEmpty = requireIsEmpty();
  const reduce = requireReduce();
  const QueryCompiler = requireQuerycompiler();
  const noop2 = requireNoop$1();
  const { isString } = requireIs();
  const {
    wrapString,
    columnize: columnize_
  } = requireWrappingFormatter();
  const emptyStr = constant("");
  class QueryCompiler_SQLite3 extends QueryCompiler {
    constructor(client2, builder2, formatter2) {
      super(client2, builder2, formatter2);
      this.forShare = emptyStr;
      this.forKeyShare = emptyStr;
      this.forUpdate = emptyStr;
      this.forNoKeyUpdate = emptyStr;
    }
    // SQLite requires us to build the multi-row insert as a listing of select with
    // unions joining them together. So we'll build out this list of columns and
    // then join them all together with select unions to complete the queries.
    insert() {
      const insertValues = this.single.insert || [];
      let sql = this.with() + `insert into ${this.tableName} `;
      if (Array.isArray(insertValues)) {
        if (insertValues.length === 0) {
          return "";
        } else if (insertValues.length === 1 && insertValues[0] && isEmpty(insertValues[0])) {
          return {
            sql: sql + this._emptyInsertValue
          };
        }
      } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
        return {
          sql: sql + this._emptyInsertValue
        };
      }
      const insertData = this._prepInsert(insertValues);
      if (isString(insertData)) {
        return {
          sql: sql + insertData
        };
      }
      if (insertData.columns.length === 0) {
        return {
          sql: ""
        };
      }
      sql += `(${this.formatter.columnize(insertData.columns)})`;
      if (this.client.valueForUndefined !== null) {
        insertData.values.forEach((bindings2) => {
          each2(bindings2, (binding) => {
            if (binding === void 0)
              throw new TypeError(
                "`sqlite` does not support inserting default values. Specify values explicitly or use the `useNullAsDefault` config flag. (see docs https://knexjs.org/guide/query-builder.html#insert)."
              );
          });
        });
      }
      if (insertData.values.length === 1) {
        const parameters = this.client.parameterize(
          insertData.values[0],
          this.client.valueForUndefined,
          this.builder,
          this.bindingsHolder
        );
        sql += ` values (${parameters})`;
        const { onConflict: onConflict2, ignore: ignore2, merge: merge2 } = this.single;
        if (onConflict2 && ignore2) sql += this._ignore(onConflict2);
        else if (onConflict2 && merge2) {
          sql += this._merge(merge2.updates, onConflict2, insertValues);
          const wheres = this.where();
          if (wheres) sql += ` ${wheres}`;
        }
        const { returning: returning2 } = this.single;
        if (returning2) {
          sql += this._returning(returning2);
        }
        return {
          sql,
          returning: returning2
        };
      }
      const blocks = [];
      let i = -1;
      while (++i < insertData.values.length) {
        let i2 = -1;
        const block = blocks[i] = [];
        let current = insertData.values[i];
        current = current === void 0 ? this.client.valueForUndefined : current;
        while (++i2 < insertData.columns.length) {
          block.push(
            this.client.alias(
              this.client.parameter(
                current[i2],
                this.builder,
                this.bindingsHolder
              ),
              this.formatter.wrap(insertData.columns[i2])
            )
          );
        }
        blocks[i] = block.join(", ");
      }
      sql += " select " + blocks.join(" union all select ");
      const { onConflict, ignore, merge } = this.single;
      if (onConflict && ignore) sql += " where true" + this._ignore(onConflict);
      else if (onConflict && merge) {
        sql += " where true" + this._merge(merge.updates, onConflict, insertValues);
      }
      const { returning } = this.single;
      if (returning) sql += this._returning(returning);
      return {
        sql,
        returning
      };
    }
    // Compiles an `update` query, allowing for a return value.
    update() {
      const withSQL = this.with();
      const updateData = this._prepUpdate(this.single.update);
      const wheres = this.where();
      const { returning } = this.single;
      return {
        sql: withSQL + `update ${this.single.only ? "only " : ""}${this.tableName} set ${updateData.join(", ")}` + (wheres ? ` ${wheres}` : "") + this._returning(returning),
        returning
      };
    }
    _ignore(columns) {
      if (columns === true) {
        return " on conflict do nothing";
      }
      return ` on conflict ${this._onConflictClause(columns)} do nothing`;
    }
    _merge(updates, columns, insert) {
      let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
      if (updates && Array.isArray(updates)) {
        sql += updates.map(
          (column) => wrapString(
            column.split(".").pop(),
            this.formatter.builder,
            this.client,
            this.formatter
          )
        ).map((column) => `${column} = excluded.${column}`).join(", ");
        return sql;
      } else if (updates && typeof updates === "object") {
        const updateData = this._prepUpdate(updates);
        if (typeof updateData === "string") {
          sql += updateData;
        } else {
          sql += updateData.join(",");
        }
        return sql;
      } else {
        const insertData = this._prepInsert(insert);
        if (typeof insertData === "string") {
          throw new Error(
            "If using merge with a raw insert query, then updates must be provided"
          );
        }
        sql += insertData.columns.map(
          (column) => wrapString(column.split(".").pop(), this.builder, this.client)
        ).map((column) => `${column} = excluded.${column}`).join(", ");
        return sql;
      }
    }
    _returning(value) {
      return value ? ` returning ${this.formatter.columnize(value)}` : "";
    }
    // Compile a truncate table statement into SQL.
    truncate() {
      const { table } = this.single;
      return {
        sql: `delete from ${this.tableName}`,
        output() {
          return this.query({
            sql: `delete from sqlite_sequence where name = '${table}'`
          }).catch(noop2);
        }
      };
    }
    // Compiles a `columnInfo` query
    columnInfo() {
      const column = this.single.columnInfo;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      return {
        sql: `PRAGMA table_info(\`${table}\`)`,
        output(resp) {
          const maxLengthRegex = /.*\((\d+)\)/;
          const out = reduce(
            resp,
            function(columns, val) {
              let { type } = val;
              let maxLength = type.match(maxLengthRegex);
              if (maxLength) {
                maxLength = maxLength[1];
              }
              type = maxLength ? type.split("(")[0] : type;
              columns[val.name] = {
                type: type.toLowerCase(),
                maxLength,
                nullable: !val.notnull,
                defaultValue: val.dflt_value
              };
              return columns;
            },
            {}
          );
          return column && out[column] || out;
        }
      };
    }
    limit() {
      const noLimit = !this.single.limit && this.single.limit !== 0;
      if (noLimit && !this.single.offset) return "";
      this.single.limit = noLimit ? -1 : this.single.limit;
      return `limit ${this._getValueOrParameterFromAttribute("limit")}`;
    }
    // Json functions
    jsonExtract(params) {
      return this._jsonExtract("json_extract", params);
    }
    jsonSet(params) {
      return this._jsonSet("json_set", params);
    }
    jsonInsert(params) {
      return this._jsonSet("json_insert", params);
    }
    jsonRemove(params) {
      const jsonCol = `json_remove(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )},${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )})`;
      return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
    }
    whereJsonPath(statement) {
      return this._whereJsonPath("json_extract", statement);
    }
    whereJsonSupersetOf(statement) {
      throw new Error(
        "Json superset where clause not actually supported by SQLite"
      );
    }
    whereJsonSubsetOf(statement) {
      throw new Error(
        "Json subset where clause not actually supported by SQLite"
      );
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("json_extract", clause);
    }
  }
  sqliteQuerycompiler = QueryCompiler_SQLite3;
  return sqliteQuerycompiler;
}
var _baseSome;
var hasRequired_baseSome;
function require_baseSome() {
  if (hasRequired_baseSome) return _baseSome;
  hasRequired_baseSome = 1;
  var baseEach = require_baseEach();
  function baseSome(collection, predicate) {
    var result;
    baseEach(collection, function(value, index, collection2) {
      result = predicate(value, index, collection2);
      return !result;
    });
    return !!result;
  }
  _baseSome = baseSome;
  return _baseSome;
}
var some_1;
var hasRequiredSome;
function requireSome() {
  if (hasRequiredSome) return some_1;
  hasRequiredSome = 1;
  var arraySome = require_arraySome(), baseIteratee = require_baseIteratee(), baseSome = require_baseSome(), isArray = requireIsArray(), isIterateeCall = require_isIterateeCall();
  function some(collection, predicate, guard) {
    var func = isArray(collection) ? arraySome : baseSome;
    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee(predicate, 3));
  }
  some_1 = some;
  return some_1;
}
var sqliteCompiler;
var hasRequiredSqliteCompiler;
function requireSqliteCompiler() {
  if (hasRequiredSqliteCompiler) return sqliteCompiler;
  hasRequiredSqliteCompiler = 1;
  const SchemaCompiler = requireCompiler$1();
  const some = requireSome();
  class SchemaCompiler_SQLite3 extends SchemaCompiler {
    constructor(client2, builder2) {
      super(client2, builder2);
    }
    // Compile the query to determine if a table exists.
    hasTable(tableName) {
      const sql = `select * from sqlite_master where type = 'table' and name = ${this.client.parameter(
        this.formatter.wrap(tableName).replace(/`/g, ""),
        this.builder,
        this.bindingsHolder
      )}`;
      this.pushQuery({ sql, output: (resp) => resp.length > 0 });
    }
    // Compile the query to determine if a column exists.
    hasColumn(tableName, column) {
      this.pushQuery({
        sql: `PRAGMA table_info(${this.formatter.wrap(tableName)})`,
        output(resp) {
          return some(resp, (col) => {
            return this.client.wrapIdentifier(col.name.toLowerCase()) === this.client.wrapIdentifier(column.toLowerCase());
          });
        }
      });
    }
    // Compile a rename table command.
    renameTable(from, to) {
      this.pushQuery(
        `alter table ${this.formatter.wrap(from)} rename to ${this.formatter.wrap(
          to
        )}`
      );
    }
    async generateDdlCommands() {
      const sequence = this.builder._sequence;
      for (let i = 0, l = sequence.length; i < l; i++) {
        const query = sequence[i];
        this[query.method].apply(this, query.args);
      }
      const commandSources = this.sequence;
      if (commandSources.length === 1 && commandSources[0].statementsProducer) {
        return commandSources[0].statementsProducer();
      } else {
        const result = [];
        for (const commandSource of commandSources) {
          const command = commandSource.sql;
          if (Array.isArray(command)) {
            result.push(...command);
          } else {
            result.push(command);
          }
        }
        return { pre: [], sql: result, check: null, post: [] };
      }
    }
  }
  sqliteCompiler = SchemaCompiler_SQLite3;
  return sqliteCompiler;
}
var sqliteColumncompiler;
var hasRequiredSqliteColumncompiler;
function requireSqliteColumncompiler() {
  if (hasRequiredSqliteColumncompiler) return sqliteColumncompiler;
  hasRequiredSqliteColumncompiler = 1;
  const ColumnCompiler = requireColumncompiler();
  class ColumnCompiler_SQLite3 extends ColumnCompiler {
    constructor() {
      super(...arguments);
      this.modifiers = ["nullable", "defaultTo"];
      this._addCheckModifiers();
    }
    // Types
    // -------
    enu(allowed) {
      return `text check (${this.formatter.wrap(
        this.args[0]
      )} in ('${allowed.join("', '")}'))`;
    }
    _pushAlterCheckQuery(checkPredicate, constraintName) {
      throw new Error(
        `Alter table with to add constraints is not permitted in SQLite`
      );
    }
    checkRegex(regexes, constraintName) {
      return this._check(
        `${this.formatter.wrap(
          this.getColumnName()
        )} REGEXP ${this.client._escapeBinding(regexes)}`,
        constraintName
      );
    }
  }
  ColumnCompiler_SQLite3.prototype.json = "json";
  ColumnCompiler_SQLite3.prototype.jsonb = "json";
  ColumnCompiler_SQLite3.prototype.double = ColumnCompiler_SQLite3.prototype.decimal = ColumnCompiler_SQLite3.prototype.floating = "float";
  ColumnCompiler_SQLite3.prototype.timestamp = "datetime";
  ColumnCompiler_SQLite3.prototype.increments = ColumnCompiler_SQLite3.prototype.bigincrements = "integer not null primary key autoincrement";
  sqliteColumncompiler = ColumnCompiler_SQLite3;
  return sqliteColumncompiler;
}
var filter_1;
var hasRequiredFilter;
function requireFilter() {
  if (hasRequiredFilter) return filter_1;
  hasRequiredFilter = 1;
  var arrayFilter = require_arrayFilter(), baseFilter = require_baseFilter(), baseIteratee = require_baseIteratee(), isArray = requireIsArray();
  function filter(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, baseIteratee(predicate, 3));
  }
  filter_1 = filter;
  return filter_1;
}
var sqliteTablecompiler;
var hasRequiredSqliteTablecompiler;
function requireSqliteTablecompiler() {
  if (hasRequiredSqliteTablecompiler) return sqliteTablecompiler;
  hasRequiredSqliteTablecompiler = 1;
  const filter = requireFilter();
  const values = requireValues();
  const identity = requireIdentity();
  const { isObject } = requireIs();
  const TableCompiler = requireTablecompiler();
  const { formatDefault } = requireFormatterUtils();
  class TableCompiler_SQLite3 extends TableCompiler {
    constructor() {
      super(...arguments);
    }
    // Create a new table.
    createQuery(columns, ifNot, like) {
      const createStatement = ifNot ? "create table if not exists " : "create table ";
      let sql = createStatement + this.tableName();
      if (like && this.tableNameLike()) {
        sql += " as select * from " + this.tableNameLike() + " where 0=1";
      } else {
        sql += " (" + columns.sql.join(", ");
        sql += this.foreignKeys() || "";
        sql += this.primaryKeys() || "";
        sql += this._addChecks();
        sql += ")";
      }
      this.pushQuery(sql);
      if (like) {
        this.addColumns(columns, this.addColumnsPrefix);
      }
    }
    addColumns(columns, prefix, colCompilers) {
      if (prefix === this.alterColumnsPrefix) {
        const compiler2 = this;
        const columnsInfo = colCompilers.map((col) => {
          const name = this.client.customWrapIdentifier(
            col.getColumnName(),
            identity,
            col.columnBuilder.queryContext()
          );
          const type = col.getColumnType();
          const defaultTo = col.modified["defaultTo"] ? formatDefault(col.modified["defaultTo"][0], col.type, this.client) : null;
          const notNull = col.modified["nullable"] && col.modified["nullable"][0] === false;
          return { name, type, defaultTo, notNull };
        });
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          statementsProducer(pragma, connection) {
            return compiler2.client.ddl(compiler2, pragma, connection).alterColumn(columnsInfo);
          }
        });
      } else {
        for (let i = 0, l = columns.sql.length; i < l; i++) {
          this.pushQuery({
            sql: `alter table ${this.tableName()} add column ${columns.sql[i]}`,
            bindings: columns.bindings[i]
          });
        }
      }
    }
    // Compile a drop unique key command.
    dropUnique(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      this.pushQuery(`drop index ${indexName}`);
    }
    // Compile a drop foreign key command.
    dropForeign(columns, indexName) {
      const compiler2 = this;
      columns = Array.isArray(columns) ? columns : [columns];
      columns = columns.map(
        (column) => this.client.customWrapIdentifier(column, identity)
      );
      indexName = this.client.customWrapIdentifier(indexName, identity);
      this.pushQuery({
        sql: `PRAGMA table_info(${this.tableName()})`,
        output(pragma) {
          return compiler2.client.ddl(compiler2, pragma, this.connection).dropForeign(columns, indexName);
        }
      });
    }
    // Compile a drop primary key command.
    dropPrimary(constraintName) {
      const compiler2 = this;
      constraintName = this.client.customWrapIdentifier(constraintName, identity);
      this.pushQuery({
        sql: `PRAGMA table_info(${this.tableName()})`,
        output(pragma) {
          return compiler2.client.ddl(compiler2, pragma, this.connection).dropPrimary(constraintName);
        }
      });
    }
    dropIndex(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      this.pushQuery(`drop index ${indexName}`);
    }
    // Compile a unique key command.
    unique(columns, indexName) {
      let deferrable;
      let predicate;
      if (isObject(indexName)) {
        ({ indexName, deferrable, predicate } = indexName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `sqlite3: unique index \`${indexName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
        );
      }
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      columns = this.formatter.columnize(columns);
      const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
      this.pushQuery(
        `create unique index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
      );
    }
    // Compile a plain index key command.
    index(columns, indexName, options) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      columns = this.formatter.columnize(columns);
      let predicate;
      if (isObject(options)) {
        ({ predicate } = options);
      }
      const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
      this.pushQuery(
        `create index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
      );
    }
    /**
     * Add a primary key to an existing table.
     *
     * @NOTE The `createQuery` method above handles table creation. Don't do anything regarding table
     *       creation in this method
     *
     * @param {string | string[]} columns - Column name(s) to assign as primary keys
     * @param {string} [constraintName] - Custom name for the PK constraint
     */
    primary(columns, constraintName) {
      const compiler2 = this;
      columns = Array.isArray(columns) ? columns : [columns];
      columns = columns.map(
        (column) => this.client.customWrapIdentifier(column, identity)
      );
      let deferrable;
      if (isObject(constraintName)) {
        ({ constraintName, deferrable } = constraintName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `sqlite3: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
        );
      }
      constraintName = this.client.customWrapIdentifier(constraintName, identity);
      if (this.method !== "create" && this.method !== "createIfNot") {
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          output(pragma) {
            return compiler2.client.ddl(compiler2, pragma, this.connection).primary(columns, constraintName);
          }
        });
      }
    }
    /**
     * Add a foreign key constraint to an existing table
     *
     * @NOTE The `createQuery` method above handles foreign key constraints on table creation. Don't do
     *       anything regarding table creation in this method
     *
     * @param {object} foreignInfo - Information about the current column foreign setup
     * @param {string | string[]} [foreignInfo.column] - Column in the current constraint
     * @param {string | undefined} foreignInfo.keyName - Name of the foreign key constraint
     * @param {string | string[]} foreignInfo.references - What column it references in the other table
     * @param {string} foreignInfo.inTable - What table is referenced in this constraint
     * @param {string} [foreignInfo.onUpdate] - What to do on updates
     * @param {string} [foreignInfo.onDelete] - What to do on deletions
     */
    foreign(foreignInfo) {
      const compiler2 = this;
      if (this.method !== "create" && this.method !== "createIfNot") {
        foreignInfo.column = Array.isArray(foreignInfo.column) ? foreignInfo.column : [foreignInfo.column];
        foreignInfo.column = foreignInfo.column.map(
          (column) => this.client.customWrapIdentifier(column, identity)
        );
        foreignInfo.inTable = this.client.customWrapIdentifier(
          foreignInfo.inTable,
          identity
        );
        foreignInfo.references = Array.isArray(foreignInfo.references) ? foreignInfo.references : [foreignInfo.references];
        foreignInfo.references = foreignInfo.references.map(
          (column) => this.client.customWrapIdentifier(column, identity)
        );
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          statementsProducer(pragma, connection) {
            return compiler2.client.ddl(compiler2, pragma, connection).foreign(foreignInfo);
          }
        });
      }
    }
    primaryKeys() {
      const pks = filter(this.grouped.alterTable || [], { method: "primary" });
      if (pks.length > 0 && pks[0].args.length > 0) {
        const columns = pks[0].args[0];
        let constraintName = pks[0].args[1] || "";
        if (constraintName) {
          constraintName = " constraint " + this.formatter.wrap(constraintName);
        }
        const needUniqueCols = this.grouped.columns.filter((t) => t.builder._type === "increments").length > 0;
        return `,${constraintName} ${needUniqueCols ? "unique" : "primary key"} (${this.formatter.columnize(columns)})`;
      }
    }
    foreignKeys() {
      let sql = "";
      const foreignKeys = filter(this.grouped.alterTable || [], {
        method: "foreign"
      });
      for (let i = 0, l = foreignKeys.length; i < l; i++) {
        const foreign = foreignKeys[i].args[0];
        const column = this.formatter.columnize(foreign.column);
        const references = this.formatter.columnize(foreign.references);
        const foreignTable = this.formatter.wrap(foreign.inTable);
        let constraintName = foreign.keyName || "";
        if (constraintName) {
          constraintName = " constraint " + this.formatter.wrap(constraintName);
        }
        sql += `,${constraintName} foreign key(${column}) references ${foreignTable}(${references})`;
        if (foreign.onDelete) sql += ` on delete ${foreign.onDelete}`;
        if (foreign.onUpdate) sql += ` on update ${foreign.onUpdate}`;
      }
      return sql;
    }
    createTableBlock() {
      return this.getColumns().concat().join(",");
    }
    renameColumn(from, to) {
      this.pushQuery({
        sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
          from
        )} to ${this.formatter.wrap(to)}`
      });
    }
    _setNullableState(column, isNullable) {
      const compiler2 = this;
      this.pushQuery({
        sql: `PRAGMA table_info(${this.tableName()})`,
        statementsProducer(pragma, connection) {
          return compiler2.client.ddl(compiler2, pragma, connection).setNullable(column, isNullable);
        }
      });
    }
    dropColumn() {
      const compiler2 = this;
      const columns = values(arguments);
      const columnsWrapped = columns.map(
        (column) => this.client.customWrapIdentifier(column, identity)
      );
      this.pushQuery({
        sql: `PRAGMA table_info(${this.tableName()})`,
        output(pragma) {
          return compiler2.client.ddl(compiler2, pragma, this.connection).dropColumn(columnsWrapped);
        }
      });
    }
  }
  sqliteTablecompiler = TableCompiler_SQLite3;
  return sqliteTablecompiler;
}
var sqliteViewcompiler;
var hasRequiredSqliteViewcompiler;
function requireSqliteViewcompiler() {
  if (hasRequiredSqliteViewcompiler) return sqliteViewcompiler;
  hasRequiredSqliteViewcompiler = 1;
  const ViewCompiler = requireViewcompiler();
  const {
    columnize: columnize_
  } = requireWrappingFormatter();
  class ViewCompiler_SQLite3 extends ViewCompiler {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
    createOrReplace() {
      const columns = this.columns;
      const selectQuery = this.selectQuery.toString();
      const viewName = this.viewName();
      const columnList = columns ? " (" + columnize_(
        columns,
        this.viewBuilder,
        this.client,
        this.bindingsHolder
      ) + ")" : "";
      const dropSql = `drop view if exists ${viewName}`;
      const createSql = `create view ${viewName}${columnList} as ${selectQuery}`;
      this.pushQuery({
        sql: dropSql
      });
      this.pushQuery({
        sql: createSql
      });
    }
  }
  sqliteViewcompiler = ViewCompiler_SQLite3;
  return sqliteViewcompiler;
}
var sqliteDdlOperations;
var hasRequiredSqliteDdlOperations;
function requireSqliteDdlOperations() {
  if (hasRequiredSqliteDdlOperations) return sqliteDdlOperations;
  hasRequiredSqliteDdlOperations = 1;
  function copyData(sourceTable, targetTable, columns) {
    return `INSERT INTO "${targetTable}" SELECT ${columns === void 0 ? "*" : columns.map((column) => `"${column}"`).join(", ")} FROM "${sourceTable}";`;
  }
  function dropOriginal(tableName) {
    return `DROP TABLE "${tableName}"`;
  }
  function renameTable(tableName, alteredName) {
    return `ALTER TABLE "${tableName}" RENAME TO "${alteredName}"`;
  }
  function getTableSql(tableName) {
    return `SELECT type, sql FROM sqlite_master WHERE (type='table' OR (type='index' AND sql IS NOT NULL)) AND lower(tbl_name)='${tableName.toLowerCase()}'`;
  }
  function isForeignCheckEnabled() {
    return `PRAGMA foreign_keys`;
  }
  function setForeignCheck(enable) {
    return `PRAGMA foreign_keys = ${enable ? "ON" : "OFF"}`;
  }
  function executeForeignCheck() {
    return `PRAGMA foreign_key_check`;
  }
  sqliteDdlOperations = {
    copyData,
    dropOriginal,
    renameTable,
    getTableSql,
    isForeignCheckEnabled,
    setForeignCheck,
    executeForeignCheck
  };
  return sqliteDdlOperations;
}
var tokenizer;
var hasRequiredTokenizer;
function requireTokenizer() {
  if (hasRequiredTokenizer) return tokenizer;
  hasRequiredTokenizer = 1;
  function tokenize(text, tokens) {
    const compiledRegex = new RegExp(
      Object.entries(tokens).map(([type, regex]) => `(?<${type}>${regex.source})`).join("|"),
      "yi"
    );
    let index = 0;
    const ast = [];
    while (index < text.length) {
      compiledRegex.lastIndex = index;
      const result = text.match(compiledRegex);
      if (result !== null) {
        const [type, text2] = Object.entries(result.groups).find(
          ([name, group]) => group !== void 0
        );
        index += text2.length;
        if (!type.startsWith("_")) {
          ast.push({ type, text: text2 });
        }
      } else {
        throw new Error(
          `No matching tokenizer rule found at: [${text.substring(index)}]`
        );
      }
    }
    return ast;
  }
  tokenizer = {
    tokenize
  };
  return tokenizer;
}
var parserCombinator;
var hasRequiredParserCombinator;
function requireParserCombinator() {
  if (hasRequiredParserCombinator) return parserCombinator;
  hasRequiredParserCombinator = 1;
  function s(sequence, post = (v) => v) {
    return function({ index = 0, input }) {
      let position = index;
      const ast = [];
      for (const parser2 of sequence) {
        const result = parser2({ index: position, input });
        if (result.success) {
          position = result.index;
          ast.push(result.ast);
        } else {
          return result;
        }
      }
      return { success: true, ast: post(ast), index: position, input };
    };
  }
  function a(alternative, post = (v) => v) {
    return function({ index = 0, input }) {
      for (const parser2 of alternative) {
        const result = parser2({ index, input });
        if (result.success) {
          return {
            success: true,
            ast: post(result.ast),
            index: result.index,
            input
          };
        }
      }
      return { success: false, ast: null, index, input };
    };
  }
  function m(many, post = (v) => v) {
    return function({ index = 0, input }) {
      let result = {};
      let position = index;
      const ast = [];
      do {
        result = many({ index: position, input });
        if (result.success) {
          position = result.index;
          ast.push(result.ast);
        }
      } while (result.success);
      if (ast.length > 0) {
        return { success: true, ast: post(ast), index: position, input };
      } else {
        return { success: false, ast: null, index: position, input };
      }
    };
  }
  function o(optional, post = (v) => v) {
    return function({ index = 0, input }) {
      const result = optional({ index, input });
      if (result.success) {
        return {
          success: true,
          ast: post(result.ast),
          index: result.index,
          input
        };
      } else {
        return { success: true, ast: post(null), index, input };
      }
    };
  }
  function l(lookahead, post = (v) => v) {
    return function({ index = 0, input }) {
      const result = lookahead.do({ index, input });
      if (result.success) {
        const resultNext = lookahead.next({ index: result.index, input });
        if (resultNext.success) {
          return {
            success: true,
            ast: post(result.ast),
            index: result.index,
            input
          };
        }
      }
      return { success: false, ast: null, index, input };
    };
  }
  function n(negative, post = (v) => v) {
    return function({ index = 0, input }) {
      const result = negative.do({ index, input });
      if (result.success) {
        const resultNot = negative.not({ index, input });
        if (!resultNot.success) {
          return {
            success: true,
            ast: post(result.ast),
            index: result.index,
            input
          };
        }
      }
      return { success: false, ast: null, index, input };
    };
  }
  function t(token, post = (v) => v.text) {
    return function({ index = 0, input }) {
      const result = input[index];
      if (result !== void 0 && (token.type === void 0 || token.type === result.type) && (token.text === void 0 || token.text.toUpperCase() === result.text.toUpperCase())) {
        return {
          success: true,
          ast: post(result),
          index: index + 1,
          input
        };
      } else {
        return { success: false, ast: null, index, input };
      }
    };
  }
  const e = function({ index = 0, input }) {
    return { success: true, ast: null, index, input };
  };
  const f = function({ index = 0, input }) {
    return { success: index === input.length, ast: null, index, input };
  };
  parserCombinator = { s, a, m, o, l, n, t, e, f };
  return parserCombinator;
}
var parser;
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser;
  hasRequiredParser = 1;
  const { tokenize } = requireTokenizer();
  const { s, a, m, o, l, n, t, e, f } = requireParserCombinator();
  const TOKENS = {
    keyword: /(?:ABORT|ACTION|ADD|AFTER|ALL|ALTER|ALWAYS|ANALYZE|AND|AS|ASC|ATTACH|AUTOINCREMENT|BEFORE|BEGIN|BETWEEN|BY|CASCADE|CASE|CAST|CHECK|COLLATE|COLUMN|COMMIT|CONFLICT|CONSTRAINT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|DATABASE|DEFAULT|DEFERRED|DEFERRABLE|DELETE|DESC|DETACH|DISTINCT|DO|DROP|END|EACH|ELSE|ESCAPE|EXCEPT|EXCLUSIVE|EXCLUDE|EXISTS|EXPLAIN|FAIL|FILTER|FIRST|FOLLOWING|FOR|FOREIGN|FROM|FULL|GENERATED|GLOB|GROUP|GROUPS|HAVING|IF|IGNORE|IMMEDIATE|IN|INDEX|INDEXED|INITIALLY|INNER|INSERT|INSTEAD|INTERSECT|INTO|IS|ISNULL|JOIN|KEY|LAST|LEFT|LIKE|LIMIT|MATCH|MATERIALIZED|NATURAL|NO|NOT|NOTHING|NOTNULL|NULL|NULLS|OF|OFFSET|ON|OR|ORDER|OTHERS|OUTER|OVER|PARTITION|PLAN|PRAGMA|PRECEDING|PRIMARY|QUERY|RAISE|RANGE|RECURSIVE|REFERENCES|REGEXP|REINDEX|RELEASE|RENAME|REPLACE|RESTRICT|RETURNING|RIGHT|ROLLBACK|ROW|ROWS|SAVEPOINT|SELECT|SET|TABLE|TEMP|TEMPORARY|THEN|TIES|TO|TRANSACTION|TRIGGER|UNBOUNDED|UNION|UNIQUE|UPDATE|USING|VACUUM|VALUES|VIEW|VIRTUAL|WHEN|WHERE|WINDOW|WITH|WITHOUT)(?=\s+|-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\.)/,
    id: /"[^"]*(?:""[^"]*)*"|`[^`]*(?:``[^`]*)*`|\[[^[\]]*\]|[a-z_][a-z0-9_$]*/,
    string: /'[^']*(?:''[^']*)*'/,
    blob: /x'(?:[0-9a-f][0-9a-f])+'/,
    numeric: /(?:\d+(?:\.\d*)?|\.\d+)(?:e(?:\+|-)?\d+)?|0x[0-9a-f]+/,
    variable: /\?\d*|[@$:][a-z0-9_$]+/,
    operator: /-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\./,
    _ws: /\s+/
  };
  function parseCreateTable(sql) {
    const result = createTable({ input: tokenize(sql, TOKENS) });
    if (!result.success) {
      throw new Error(
        `Parsing CREATE TABLE failed at [${result.input.slice(result.index).map((t2) => t2.text).join(" ")}] of "${sql}"`
      );
    }
    return result.ast;
  }
  function parseCreateIndex(sql) {
    const result = createIndex({ input: tokenize(sql, TOKENS) });
    if (!result.success) {
      throw new Error(
        `Parsing CREATE INDEX failed at [${result.input.slice(result.index).map((t2) => t2.text).join(" ")}] of "${sql}"`
      );
    }
    return result.ast;
  }
  function createTable(ctx) {
    return s(
      [
        t({ text: "CREATE" }, (v) => null),
        temporary,
        t({ text: "TABLE" }, (v) => null),
        exists,
        schema,
        table,
        t({ text: "(" }, (v) => null),
        columnDefinitionList,
        tableConstraintList,
        t({ text: ")" }, (v) => null),
        rowid,
        f
      ],
      (v) => Object.assign({}, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function temporary(ctx) {
    return a([t({ text: "TEMP" }), t({ text: "TEMPORARY" }), e], (v) => ({
      temporary: v !== null
    }))(ctx);
  }
  function rowid(ctx) {
    return o(s([t({ text: "WITHOUT" }), t({ text: "ROWID" })]), (v) => ({
      rowid: v !== null
    }))(ctx);
  }
  function columnDefinitionList(ctx) {
    return a([
      s([columnDefinition, t({ text: "," }), columnDefinitionList], (v) => ({
        columns: [v[0]].concat(v[2].columns)
      })),
      s([columnDefinition], (v) => ({ columns: [v[0]] }))
    ])(ctx);
  }
  function columnDefinition(ctx) {
    return s(
      [s([identifier], (v) => ({ name: v[0] })), typeName, columnConstraintList],
      (v) => Object.assign({}, ...v)
    )(ctx);
  }
  function typeName(ctx) {
    return o(
      s(
        [
          m(t({ type: "id" })),
          a([
            s(
              [
                t({ text: "(" }),
                signedNumber,
                t({ text: "," }),
                signedNumber,
                t({ text: ")" })
              ],
              (v) => `(${v[1]}, ${v[3]})`
            ),
            s(
              [t({ text: "(" }), signedNumber, t({ text: ")" })],
              (v) => `(${v[1]})`
            ),
            e
          ])
        ],
        (v) => `${v[0].join(" ")}${v[1] || ""}`
      ),
      (v) => ({ type: v })
    )(ctx);
  }
  function columnConstraintList(ctx) {
    return o(m(columnConstraint), (v) => ({
      constraints: Object.assign(
        {
          primary: null,
          notnull: null,
          null: null,
          unique: null,
          check: null,
          default: null,
          collate: null,
          references: null,
          as: null
        },
        ...v || []
      )
    }))(ctx);
  }
  function columnConstraint(ctx) {
    return a([
      primaryColumnConstraint,
      notnullColumnConstraint,
      nullColumnConstraint,
      uniqueColumnConstraint,
      checkColumnConstraint,
      defaultColumnConstraint,
      collateColumnConstraint,
      referencesColumnConstraint,
      asColumnConstraint
    ])(ctx);
  }
  function primaryColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "PRIMARY" }, (v) => null),
        t({ text: "KEY" }, (v) => null),
        order,
        conflictClause,
        autoincrement
      ],
      (v) => ({ primary: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function autoincrement(ctx) {
    return o(t({ text: "AUTOINCREMENT" }), (v) => ({
      autoincrement: v !== null
    }))(ctx);
  }
  function notnullColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "NOT" }, (v) => null),
        t({ text: "NULL" }, (v) => null),
        conflictClause
      ],
      (v) => ({ notnull: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function nullColumnConstraint(ctx) {
    return s(
      [constraintName, t({ text: "NULL" }, (v) => null), conflictClause],
      (v) => ({ null: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function uniqueColumnConstraint(ctx) {
    return s(
      [constraintName, t({ text: "UNIQUE" }, (v) => null), conflictClause],
      (v) => ({ unique: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function checkColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "CHECK" }, (v) => null),
        t({ text: "(" }, (v) => null),
        s([expression], (v) => ({ expression: v[0] })),
        t({ text: ")" }, (v) => null)
      ],
      (v) => ({ check: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function defaultColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "DEFAULT" }, (v) => null),
        a([
          s([t({ text: "(" }), expression, t({ text: ")" })], (v) => ({
            value: v[1],
            expression: true
          })),
          s([literalValue], (v) => ({ value: v[0], expression: false })),
          s([signedNumber], (v) => ({ value: v[0], expression: false }))
        ])
      ],
      (v) => ({ default: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function collateColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "COLLATE" }, (v) => null),
        t({ type: "id" }, (v) => ({ collation: v.text }))
      ],
      (v) => ({ collate: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function referencesColumnConstraint(ctx) {
    return s(
      [constraintName, s([foreignKeyClause], (v) => v[0].references)],
      (v) => ({
        references: Object.assign({}, ...v.filter((x) => x !== null))
      })
    )(ctx);
  }
  function asColumnConstraint(ctx) {
    return s(
      [
        constraintName,
        o(s([t({ text: "GENERATED" }), t({ text: "ALWAYS" })]), (v) => ({
          generated: v !== null
        })),
        t({ text: "AS" }, (v) => null),
        t({ text: "(" }, (v) => null),
        s([expression], (v) => ({ expression: v[0] })),
        t({ text: ")" }, (v) => null),
        a([t({ text: "STORED" }), t({ text: "VIRTUAL" }), e], (v) => ({
          mode: v ? v.toUpperCase() : null
        }))
      ],
      (v) => ({ as: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function tableConstraintList(ctx) {
    return o(m(s([t({ text: "," }), tableConstraint], (v) => v[1])), (v) => ({
      constraints: v || []
    }))(ctx);
  }
  function tableConstraint(ctx) {
    return a([
      primaryTableConstraint,
      uniqueTableConstraint,
      checkTableConstraint,
      foreignTableConstraint
    ])(ctx);
  }
  function primaryTableConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "PRIMARY" }, (v) => null),
        t({ text: "KEY" }, (v) => null),
        t({ text: "(" }, (v) => null),
        indexedColumnList,
        t({ text: ")" }, (v) => null),
        conflictClause
      ],
      (v) => Object.assign({ type: "PRIMARY KEY" }, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function uniqueTableConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "UNIQUE" }, (v) => null),
        t({ text: "(" }, (v) => null),
        indexedColumnList,
        t({ text: ")" }, (v) => null),
        conflictClause
      ],
      (v) => Object.assign({ type: "UNIQUE" }, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function conflictClause(ctx) {
    return o(
      s(
        [
          t({ text: "ON" }),
          t({ text: "CONFLICT" }),
          a([
            t({ text: "ROLLBACK" }),
            t({ text: "ABORT" }),
            t({ text: "FAIL" }),
            t({ text: "IGNORE" }),
            t({ text: "REPLACE" })
          ])
        ],
        (v) => v[2]
      ),
      (v) => ({ conflict: v ? v.toUpperCase() : null })
    )(ctx);
  }
  function checkTableConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "CHECK" }, (v) => null),
        t({ text: "(" }, (v) => null),
        s([expression], (v) => ({ expression: v[0] })),
        t({ text: ")" }, (v) => null)
      ],
      (v) => Object.assign({ type: "CHECK" }, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function foreignTableConstraint(ctx) {
    return s(
      [
        constraintName,
        t({ text: "FOREIGN" }, (v) => null),
        t({ text: "KEY" }, (v) => null),
        t({ text: "(" }, (v) => null),
        columnNameList,
        t({ text: ")" }, (v) => null),
        foreignKeyClause
      ],
      (v) => Object.assign({ type: "FOREIGN KEY" }, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function foreignKeyClause(ctx) {
    return s(
      [
        t({ text: "REFERENCES" }, (v) => null),
        table,
        columnNameListOptional,
        o(
          m(a([deleteReference, updateReference, matchReference])),
          (v) => Object.assign({ delete: null, update: null, match: null }, ...v || [])
        ),
        deferrable
      ],
      (v) => ({ references: Object.assign({}, ...v.filter((x) => x !== null)) })
    )(ctx);
  }
  function columnNameListOptional(ctx) {
    return o(
      s([t({ text: "(" }), columnNameList, t({ text: ")" })], (v) => v[1]),
      (v) => ({ columns: v ? v.columns : [] })
    )(ctx);
  }
  function columnNameList(ctx) {
    return s(
      [
        o(
          m(s([identifier, t({ text: "," })], (v) => v[0])),
          (v) => v !== null ? v : []
        ),
        identifier
      ],
      (v) => ({ columns: v[0].concat([v[1]]) })
    )(ctx);
  }
  function deleteReference(ctx) {
    return s([t({ text: "ON" }), t({ text: "DELETE" }), onAction], (v) => ({
      delete: v[2]
    }))(ctx);
  }
  function updateReference(ctx) {
    return s([t({ text: "ON" }), t({ text: "UPDATE" }), onAction], (v) => ({
      update: v[2]
    }))(ctx);
  }
  function matchReference(ctx) {
    return s(
      [t({ text: "MATCH" }), a([t({ type: "keyword" }), t({ type: "id" })])],
      (v) => ({ match: v[1] })
    )(ctx);
  }
  function deferrable(ctx) {
    return o(
      s([
        o(t({ text: "NOT" })),
        t({ text: "DEFERRABLE" }),
        o(
          s(
            [
              t({ text: "INITIALLY" }),
              a([t({ text: "DEFERRED" }), t({ text: "IMMEDIATE" })])
            ],
            (v) => v[1].toUpperCase()
          )
        )
      ]),
      (v) => ({ deferrable: v ? { not: v[0] !== null, initially: v[2] } : null })
    )(ctx);
  }
  function constraintName(ctx) {
    return o(
      s([t({ text: "CONSTRAINT" }), identifier], (v) => v[1]),
      (v) => ({ name: v })
    )(ctx);
  }
  function createIndex(ctx) {
    return s(
      [
        t({ text: "CREATE" }, (v) => null),
        unique,
        t({ text: "INDEX" }, (v) => null),
        exists,
        schema,
        index,
        t({ text: "ON" }, (v) => null),
        table,
        t({ text: "(" }, (v) => null),
        indexedColumnList,
        t({ text: ")" }, (v) => null),
        where,
        f
      ],
      (v) => Object.assign({}, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function unique(ctx) {
    return o(t({ text: "UNIQUE" }), (v) => ({ unique: v !== null }))(ctx);
  }
  function exists(ctx) {
    return o(
      s([t({ text: "IF" }), t({ text: "NOT" }), t({ text: "EXISTS" })]),
      (v) => ({ exists: v !== null })
    )(ctx);
  }
  function schema(ctx) {
    return o(
      s([identifier, t({ text: "." })], (v) => v[0]),
      (v) => ({ schema: v })
    )(ctx);
  }
  function index(ctx) {
    return s([identifier], (v) => ({ index: v[0] }))(ctx);
  }
  function table(ctx) {
    return s([identifier], (v) => ({ table: v[0] }))(ctx);
  }
  function where(ctx) {
    return o(
      s([t({ text: "WHERE" }), expression], (v) => v[1]),
      (v) => ({ where: v })
    )(ctx);
  }
  function indexedColumnList(ctx) {
    return a([
      s([indexedColumn, t({ text: "," }), indexedColumnList], (v) => ({
        columns: [v[0]].concat(v[2].columns)
      })),
      s([indexedColumnExpression, t({ text: "," }), indexedColumnList], (v) => ({
        columns: [v[0]].concat(v[2].columns)
      })),
      l({ do: indexedColumn, next: t({ text: ")" }) }, (v) => ({
        columns: [v]
      })),
      l({ do: indexedColumnExpression, next: t({ text: ")" }) }, (v) => ({
        columns: [v]
      }))
    ])(ctx);
  }
  function indexedColumn(ctx) {
    return s(
      [
        s([identifier], (v) => ({ name: v[0], expression: false })),
        collation,
        order
      ],
      (v) => Object.assign({}, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function indexedColumnExpression(ctx) {
    return s(
      [
        s([indexedExpression], (v) => ({ name: v[0], expression: true })),
        collation,
        order
      ],
      (v) => Object.assign({}, ...v.filter((x) => x !== null))
    )(ctx);
  }
  function collation(ctx) {
    return o(
      s([t({ text: "COLLATE" }), t({ type: "id" })], (v) => v[1]),
      (v) => ({ collation: v })
    )(ctx);
  }
  function order(ctx) {
    return a([t({ text: "ASC" }), t({ text: "DESC" }), e], (v) => ({
      order: v ? v.toUpperCase() : null
    }))(ctx);
  }
  function indexedExpression(ctx) {
    return m(
      a([
        n({
          do: t({ type: "keyword" }),
          not: a([
            t({ text: "COLLATE" }),
            t({ text: "ASC" }),
            t({ text: "DESC" })
          ])
        }),
        t({ type: "id" }),
        t({ type: "string" }),
        t({ type: "blob" }),
        t({ type: "numeric" }),
        t({ type: "variable" }),
        n({
          do: t({ type: "operator" }),
          not: a([t({ text: "(" }), t({ text: ")" }), t({ text: "," })])
        }),
        s([t({ text: "(" }), o(expression), t({ text: ")" })], (v) => v[1] || [])
      ])
    )(ctx);
  }
  function expression(ctx) {
    return m(
      a([
        t({ type: "keyword" }),
        t({ type: "id" }),
        t({ type: "string" }),
        t({ type: "blob" }),
        t({ type: "numeric" }),
        t({ type: "variable" }),
        n({
          do: t({ type: "operator" }),
          not: a([t({ text: "(" }), t({ text: ")" })])
        }),
        s([t({ text: "(" }), o(expression), t({ text: ")" })], (v) => v[1] || [])
      ])
    )(ctx);
  }
  function identifier(ctx) {
    return a(
      [t({ type: "id" }), t({ type: "string" })],
      (v) => /^["`['][^]*["`\]']$/.test(v) ? v.substring(1, v.length - 1) : v
    )(ctx);
  }
  function onAction(ctx) {
    return a(
      [
        s([t({ text: "SET" }), t({ text: "NULL" })], (v) => `${v[0]} ${v[1]}`),
        s([t({ text: "SET" }), t({ text: "DEFAULT" })], (v) => `${v[0]} ${v[1]}`),
        t({ text: "CASCADE" }),
        t({ text: "RESTRICT" }),
        s([t({ text: "NO" }), t({ text: "ACTION" })], (v) => `${v[0]} ${v[1]}`)
      ],
      (v) => v.toUpperCase()
    )(ctx);
  }
  function literalValue(ctx) {
    return a([
      t({ type: "numeric" }),
      t({ type: "string" }),
      t({ type: "id" }),
      t({ type: "blob" }),
      t({ text: "NULL" }),
      t({ text: "TRUE" }),
      t({ text: "FALSE" }),
      t({ text: "CURRENT_TIME" }),
      t({ text: "CURRENT_DATE" }),
      t({ text: "CURRENT_TIMESTAMP" })
    ])(ctx);
  }
  function signedNumber(ctx) {
    return s(
      [a([t({ text: "+" }), t({ text: "-" }), e]), t({ type: "numeric" })],
      (v) => `${v[0] || ""}${v[1]}`
    )(ctx);
  }
  parser = {
    parseCreateTable,
    parseCreateIndex
  };
  return parser;
}
var compiler;
var hasRequiredCompiler;
function requireCompiler() {
  if (hasRequiredCompiler) return compiler;
  hasRequiredCompiler = 1;
  function compileCreateTable(ast, wrap = (v) => v) {
    return createTable(ast, wrap);
  }
  function compileCreateIndex(ast, wrap = (v) => v) {
    return createIndex(ast, wrap);
  }
  function createTable(ast, wrap) {
    return `CREATE${temporary(ast)} TABLE${exists(ast)} ${schema(
      ast,
      wrap
    )}${table(ast, wrap)} (${columnDefinitionList(
      ast,
      wrap
    )}${tableConstraintList(ast, wrap)})${rowid(ast)}`;
  }
  function temporary(ast, wrap) {
    return ast.temporary ? " TEMP" : "";
  }
  function rowid(ast, wrap) {
    return ast.rowid ? " WITHOUT ROWID" : "";
  }
  function columnDefinitionList(ast, wrap) {
    return ast.columns.map((column) => columnDefinition(column, wrap)).join(", ");
  }
  function columnDefinition(ast, wrap) {
    return `${identifier(ast.name, wrap)}${typeName(
      ast
    )}${columnConstraintList(ast.constraints, wrap)}`;
  }
  function typeName(ast, wrap) {
    return ast.type !== null ? ` ${ast.type}` : "";
  }
  function columnConstraintList(ast, wrap) {
    return `${primaryColumnConstraint(ast, wrap)}${notnullColumnConstraint(
      ast,
      wrap
    )}${nullColumnConstraint(ast, wrap)}${uniqueColumnConstraint(
      ast,
      wrap
    )}${checkColumnConstraint(ast, wrap)}${defaultColumnConstraint(
      ast,
      wrap
    )}${collateColumnConstraint(ast, wrap)}${referencesColumnConstraint(
      ast,
      wrap
    )}${asColumnConstraint(ast, wrap)}`;
  }
  function primaryColumnConstraint(ast, wrap) {
    return ast.primary !== null ? ` ${constraintName(ast.primary, wrap)}PRIMARY KEY${order(
      ast.primary
    )}${conflictClause(ast.primary)}${autoincrement(ast.primary)}` : "";
  }
  function autoincrement(ast, wrap) {
    return ast.autoincrement ? " AUTOINCREMENT" : "";
  }
  function notnullColumnConstraint(ast, wrap) {
    return ast.notnull !== null ? ` ${constraintName(ast.notnull, wrap)}NOT NULL${conflictClause(
      ast.notnull
    )}` : "";
  }
  function nullColumnConstraint(ast, wrap) {
    return ast.null !== null ? ` ${constraintName(ast.null, wrap)}NULL${conflictClause(ast.null)}` : "";
  }
  function uniqueColumnConstraint(ast, wrap) {
    return ast.unique !== null ? ` ${constraintName(ast.unique, wrap)}UNIQUE${conflictClause(
      ast.unique
    )}` : "";
  }
  function checkColumnConstraint(ast, wrap) {
    return ast.check !== null ? ` ${constraintName(ast.check, wrap)}CHECK (${expression(
      ast.check.expression
    )})` : "";
  }
  function defaultColumnConstraint(ast, wrap) {
    return ast.default !== null ? ` ${constraintName(ast.default, wrap)}DEFAULT ${!ast.default.expression ? ast.default.value : `(${expression(ast.default.value)})`}` : "";
  }
  function collateColumnConstraint(ast, wrap) {
    return ast.collate !== null ? ` ${constraintName(ast.collate, wrap)}COLLATE ${ast.collate.collation}` : "";
  }
  function referencesColumnConstraint(ast, wrap) {
    return ast.references !== null ? ` ${constraintName(ast.references, wrap)}${foreignKeyClause(
      ast.references,
      wrap
    )}` : "";
  }
  function asColumnConstraint(ast, wrap) {
    return ast.as !== null ? ` ${constraintName(ast.as, wrap)}${ast.as.generated ? "GENERATED ALWAYS " : ""}AS (${expression(ast.as.expression)})${ast.as.mode !== null ? ` ${ast.as.mode}` : ""}` : "";
  }
  function tableConstraintList(ast, wrap) {
    return ast.constraints.reduce(
      (constraintList, constraint) => `${constraintList}, ${tableConstraint(constraint, wrap)}`,
      ""
    );
  }
  function tableConstraint(ast, wrap) {
    switch (ast.type) {
      case "PRIMARY KEY":
        return primaryTableConstraint(ast, wrap);
      case "UNIQUE":
        return uniqueTableConstraint(ast, wrap);
      case "CHECK":
        return checkTableConstraint(ast, wrap);
      case "FOREIGN KEY":
        return foreignTableConstraint(ast, wrap);
    }
  }
  function primaryTableConstraint(ast, wrap) {
    return `${constraintName(ast, wrap)}PRIMARY KEY (${indexedColumnList(
      ast,
      wrap
    )})${conflictClause(ast)}`;
  }
  function uniqueTableConstraint(ast, wrap) {
    return `${constraintName(ast, wrap)}UNIQUE (${indexedColumnList(
      ast,
      wrap
    )})${conflictClause(ast)}`;
  }
  function conflictClause(ast, wrap) {
    return ast.conflict !== null ? ` ON CONFLICT ${ast.conflict}` : "";
  }
  function checkTableConstraint(ast, wrap) {
    return `${constraintName(ast, wrap)}CHECK (${expression(
      ast.expression
    )})`;
  }
  function foreignTableConstraint(ast, wrap) {
    return `${constraintName(ast, wrap)}FOREIGN KEY (${columnNameList(
      ast,
      wrap
    )}) ${foreignKeyClause(ast.references, wrap)}`;
  }
  function foreignKeyClause(ast, wrap) {
    return `REFERENCES ${table(ast, wrap)}${columnNameListOptional(
      ast,
      wrap
    )}${deleteUpdateMatchList(ast)}${deferrable(ast.deferrable)}`;
  }
  function columnNameListOptional(ast, wrap) {
    return ast.columns.length > 0 ? ` (${columnNameList(ast, wrap)})` : "";
  }
  function columnNameList(ast, wrap) {
    return ast.columns.map((column) => identifier(column, wrap)).join(", ");
  }
  function deleteUpdateMatchList(ast, wrap) {
    return `${deleteReference(ast)}${updateReference(
      ast
    )}${matchReference(ast)}`;
  }
  function deleteReference(ast, wrap) {
    return ast.delete !== null ? ` ON DELETE ${ast.delete}` : "";
  }
  function updateReference(ast, wrap) {
    return ast.update !== null ? ` ON UPDATE ${ast.update}` : "";
  }
  function matchReference(ast, wrap) {
    return ast.match !== null ? ` MATCH ${ast.match}` : "";
  }
  function deferrable(ast, wrap) {
    return ast !== null ? ` ${ast.not ? "NOT " : ""}DEFERRABLE${ast.initially !== null ? ` INITIALLY ${ast.initially}` : ""}` : "";
  }
  function constraintName(ast, wrap) {
    return ast.name !== null ? `CONSTRAINT ${identifier(ast.name, wrap)} ` : "";
  }
  function createIndex(ast, wrap) {
    return `CREATE${unique(ast)} INDEX${exists(ast)} ${schema(
      ast,
      wrap
    )}${index(ast, wrap)} on ${table(ast, wrap)} (${indexedColumnList(
      ast,
      wrap
    )})${where(ast)}`;
  }
  function unique(ast, wrap) {
    return ast.unique ? " UNIQUE" : "";
  }
  function exists(ast, wrap) {
    return ast.exists ? " IF NOT EXISTS" : "";
  }
  function schema(ast, wrap) {
    return ast.schema !== null ? `${identifier(ast.schema, wrap)}.` : "";
  }
  function index(ast, wrap) {
    return identifier(ast.index, wrap);
  }
  function table(ast, wrap) {
    return identifier(ast.table, wrap);
  }
  function where(ast, wrap) {
    return ast.where !== null ? ` where ${expression(ast.where)}` : "";
  }
  function indexedColumnList(ast, wrap) {
    return ast.columns.map(
      (column) => !column.expression ? indexedColumn(column, wrap) : indexedColumnExpression(column)
    ).join(", ");
  }
  function indexedColumn(ast, wrap) {
    return `${identifier(ast.name, wrap)}${collation(ast)}${order(
      ast
    )}`;
  }
  function indexedColumnExpression(ast, wrap) {
    return `${indexedExpression(ast.name)}${collation(ast)}${order(
      ast
    )}`;
  }
  function collation(ast, wrap) {
    return ast.collation !== null ? ` COLLATE ${ast.collation}` : "";
  }
  function order(ast, wrap) {
    return ast.order !== null ? ` ${ast.order}` : "";
  }
  function indexedExpression(ast, wrap) {
    return expression(ast);
  }
  function expression(ast, wrap) {
    return ast.reduce(
      (expr, e) => Array.isArray(e) ? `${expr}(${expression(e)})` : !expr ? e : `${expr} ${e}`,
      ""
    );
  }
  function identifier(ast, wrap) {
    return wrap(ast);
  }
  compiler = {
    compileCreateTable,
    compileCreateIndex
  };
  return compiler;
}
var utils$2;
var hasRequiredUtils$2;
function requireUtils$2() {
  if (hasRequiredUtils$2) return utils$2;
  hasRequiredUtils$2 = 1;
  function isEqualId(first2, second) {
    return first2.toLowerCase() === second.toLowerCase();
  }
  function includesId(list, id) {
    return list.some((item) => isEqualId(item, id));
  }
  utils$2 = {
    isEqualId,
    includesId
  };
  return utils$2;
}
var ddl;
var hasRequiredDdl;
function requireDdl() {
  if (hasRequiredDdl) return ddl;
  hasRequiredDdl = 1;
  const identity = requireIdentity();
  const { nanonum } = requireNanoid();
  const {
    copyData,
    dropOriginal,
    renameTable,
    getTableSql,
    isForeignCheckEnabled,
    setForeignCheck,
    executeForeignCheck
  } = requireSqliteDdlOperations();
  const { parseCreateTable, parseCreateIndex } = requireParser();
  const {
    compileCreateTable,
    compileCreateIndex
  } = requireCompiler();
  const { isEqualId, includesId } = requireUtils$2();
  class SQLite3_DDL {
    constructor(client2, tableCompiler, pragma, connection) {
      this.client = client2;
      this.tableCompiler = tableCompiler;
      this.pragma = pragma;
      this.tableNameRaw = this.tableCompiler.tableNameRaw;
      this.alteredName = `_knex_temp_alter${nanonum(3)}`;
      this.connection = connection;
      this.formatter = (value) => this.client.customWrapIdentifier(value, identity);
      this.wrap = (value) => this.client.wrapIdentifierImpl(value);
    }
    tableName() {
      return this.formatter(this.tableNameRaw);
    }
    getTableSql() {
      const tableName = this.tableName();
      return this.client.transaction(
        async (trx) => {
          trx.disableProcessing();
          const result = await trx.raw(getTableSql(tableName));
          trx.enableProcessing();
          return {
            createTable: result.filter((create) => create.type === "table")[0].sql,
            createIndices: result.filter((create) => create.type === "index").map((create) => create.sql)
          };
        },
        { connection: this.connection }
      );
    }
    async isForeignCheckEnabled() {
      const result = await this.client.raw(isForeignCheckEnabled()).connection(this.connection);
      return result[0].foreign_keys === 1;
    }
    async setForeignCheck(enable) {
      await this.client.raw(setForeignCheck(enable)).connection(this.connection);
    }
    renameTable(trx) {
      return trx.raw(renameTable(this.alteredName, this.tableName()));
    }
    dropOriginal(trx) {
      return trx.raw(dropOriginal(this.tableName()));
    }
    copyData(trx, columns) {
      return trx.raw(copyData(this.tableName(), this.alteredName, columns));
    }
    async alterColumn(columns) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      parsedTable.columns = parsedTable.columns.map((column) => {
        const newColumnInfo = columns.find((c) => isEqualId(c.name, column.name));
        if (newColumnInfo) {
          column.type = newColumnInfo.type;
          column.constraints.default = newColumnInfo.defaultTo !== null ? {
            name: null,
            value: newColumnInfo.defaultTo,
            expression: false
          } : null;
          column.constraints.notnull = newColumnInfo.notNull ? { name: null, conflict: null } : null;
          column.constraints.null = newColumnInfo.notNull ? null : column.constraints.null;
        }
        return column;
      });
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.generateAlterCommands(newTable, createIndices);
    }
    async dropColumn(columns) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      parsedTable.columns = parsedTable.columns.filter(
        (parsedColumn) => parsedColumn.expression || !includesId(columns, parsedColumn.name)
      );
      if (parsedTable.columns.length === 0) {
        throw new Error("Unable to drop last column from table");
      }
      parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
        if (constraint.type === "PRIMARY KEY" || constraint.type === "UNIQUE") {
          return constraint.columns.every(
            (constraintColumn) => constraintColumn.expression || !includesId(columns, constraintColumn.name)
          );
        } else if (constraint.type === "FOREIGN KEY") {
          return constraint.columns.every(
            (constraintColumnName) => !includesId(columns, constraintColumnName)
          ) && (constraint.references.table !== parsedTable.table || constraint.references.columns.every(
            (referenceColumnName) => !includesId(columns, referenceColumnName)
          ));
        } else {
          return true;
        }
      });
      const newColumns = parsedTable.columns.map((column) => column.name);
      const newTable = compileCreateTable(parsedTable, this.wrap);
      const newIndices = [];
      for (const createIndex of createIndices) {
        const parsedIndex = parseCreateIndex(createIndex);
        parsedIndex.columns = parsedIndex.columns.filter(
          (parsedColumn) => parsedColumn.expression || !includesId(columns, parsedColumn.name)
        );
        if (parsedIndex.columns.length > 0) {
          newIndices.push(compileCreateIndex(parsedIndex, this.wrap));
        }
      }
      return this.alter(newTable, newIndices, newColumns);
    }
    async dropForeign(columns, foreignKeyName) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      if (!foreignKeyName) {
        parsedTable.columns = parsedTable.columns.map((column) => ({
          ...column,
          references: includesId(columns, column.name) ? null : column.references
        }));
      }
      parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
        if (constraint.type === "FOREIGN KEY") {
          if (foreignKeyName) {
            return !constraint.name || !isEqualId(constraint.name, foreignKeyName);
          }
          return constraint.columns.every(
            (constraintColumnName) => !includesId(columns, constraintColumnName)
          );
        } else {
          return true;
        }
      });
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.alter(newTable, createIndices);
    }
    async dropPrimary(constraintName) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      parsedTable.columns = parsedTable.columns.map((column) => ({
        ...column,
        primary: null
      }));
      parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
        if (constraint.type === "PRIMARY KEY") {
          if (constraintName) {
            return !constraint.name || !isEqualId(constraint.name, constraintName);
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.alter(newTable, createIndices);
    }
    async primary(columns, constraintName) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      parsedTable.columns = parsedTable.columns.map((column) => ({
        ...column,
        primary: null
      }));
      parsedTable.constraints = parsedTable.constraints.filter(
        (constraint) => constraint.type !== "PRIMARY KEY"
      );
      parsedTable.constraints.push({
        type: "PRIMARY KEY",
        name: constraintName || null,
        columns: columns.map((column) => ({
          name: column,
          expression: false,
          collation: null,
          order: null
        })),
        conflict: null
      });
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.alter(newTable, createIndices);
    }
    async foreign(foreignInfo) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      parsedTable.constraints.push({
        type: "FOREIGN KEY",
        name: foreignInfo.keyName || null,
        columns: foreignInfo.column,
        references: {
          table: foreignInfo.inTable,
          columns: foreignInfo.references,
          delete: foreignInfo.onDelete || null,
          update: foreignInfo.onUpdate || null,
          match: null,
          deferrable: null
        }
      });
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.generateAlterCommands(newTable, createIndices);
    }
    async setNullable(column, isNullable) {
      const { createTable, createIndices } = await this.getTableSql();
      const parsedTable = parseCreateTable(createTable);
      parsedTable.table = this.alteredName;
      const parsedColumn = parsedTable.columns.find(
        (c) => isEqualId(column, c.name)
      );
      if (!parsedColumn) {
        throw new Error(
          `.setNullable: Column ${column} does not exist in table ${this.tableName()}.`
        );
      }
      parsedColumn.constraints.notnull = isNullable ? null : { name: null, conflict: null };
      parsedColumn.constraints.null = isNullable ? parsedColumn.constraints.null : null;
      const newTable = compileCreateTable(parsedTable, this.wrap);
      return this.generateAlterCommands(newTable, createIndices);
    }
    async alter(newSql, createIndices, columns) {
      const wasForeignCheckEnabled = await this.isForeignCheckEnabled();
      if (wasForeignCheckEnabled) {
        await this.setForeignCheck(false);
      }
      try {
        await this.client.transaction(
          async (trx) => {
            await trx.raw(newSql);
            await this.copyData(trx, columns);
            await this.dropOriginal(trx);
            await this.renameTable(trx);
            for (const createIndex of createIndices) {
              await trx.raw(createIndex);
            }
            if (wasForeignCheckEnabled) {
              const foreignViolations = await trx.raw(executeForeignCheck());
              if (foreignViolations.length > 0) {
                throw new Error("FOREIGN KEY constraint failed");
              }
            }
          },
          { connection: this.connection }
        );
      } finally {
        if (wasForeignCheckEnabled) {
          await this.setForeignCheck(true);
        }
      }
    }
    async generateAlterCommands(newSql, createIndices, columns) {
      const sql = [];
      const pre = [];
      const post = [];
      let check = null;
      sql.push(newSql);
      sql.push(copyData(this.tableName(), this.alteredName, columns));
      sql.push(dropOriginal(this.tableName()));
      sql.push(renameTable(this.alteredName, this.tableName()));
      for (const createIndex of createIndices) {
        sql.push(createIndex);
      }
      const isForeignCheckEnabled2 = await this.isForeignCheckEnabled();
      if (isForeignCheckEnabled2) {
        pre.push(setForeignCheck(false));
        post.push(setForeignCheck(true));
        check = executeForeignCheck();
      }
      return { pre, sql, check, post };
    }
  }
  ddl = SQLite3_DDL;
  return ddl;
}
var sqliteQuerybuilder;
var hasRequiredSqliteQuerybuilder;
function requireSqliteQuerybuilder() {
  if (hasRequiredSqliteQuerybuilder) return sqliteQuerybuilder;
  hasRequiredSqliteQuerybuilder = 1;
  const QueryBuilder = requireQuerybuilder();
  sqliteQuerybuilder = class QueryBuilder_SQLite3 extends QueryBuilder {
    withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "with"
      );
      return this.withWrapped(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        true
      );
    }
    withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "with"
      );
      return this.withWrapped(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        false
      );
    }
  };
  return sqliteQuerybuilder;
}
var sqlite3$1 = { exports: {} };
var bindings = { exports: {} };
var fileUriToPath_1;
var hasRequiredFileUriToPath;
function requireFileUriToPath() {
  if (hasRequiredFileUriToPath) return fileUriToPath_1;
  hasRequiredFileUriToPath = 1;
  var sep = require$$0$4.sep || "/";
  fileUriToPath_1 = fileUriToPath;
  function fileUriToPath(uri) {
    if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    }
    var rest = decodeURI(uri.substring(7));
    var firstSlash = rest.indexOf("/");
    var host = rest.substring(0, firstSlash);
    var path = rest.substring(firstSlash + 1);
    if ("localhost" == host) host = "";
    if (host) {
      host = sep + sep + host;
    }
    path = path.replace(/^(.+)\|/, "$1:");
    if (sep == "\\") {
      path = path.replace(/\//g, "\\");
    }
    if (/^.+\:/.test(path)) ;
    else {
      path = sep + path;
    }
    return host + path;
  }
  return fileUriToPath_1;
}
var hasRequiredBindings;
function requireBindings() {
  if (hasRequiredBindings) return bindings.exports;
  hasRequiredBindings = 1;
  (function(module, exports) {
    var fs = require$$0$3, path = require$$0$4, fileURLToPath = requireFileUriToPath(), join = path.join, dirname = path.dirname, exists = fs.accessSync && function(path2) {
      try {
        fs.accessSync(path2);
      } catch (e) {
        return false;
      }
      return true;
    } || fs.existsSync || path.existsSync, defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings2(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts)) opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports.getRoot(exports.getFileName());
      }
      if (path.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
      var tries = [], i = 0, l = opts.try.length, n, b, err;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p) {
            return opts[p] || p;
          })
        );
        tries.push(n);
        try {
          b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b.path = n;
          }
          return b;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err.tries = tries;
      throw err;
    }
    module.exports = exports = bindings2;
    exports.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath(fileName);
      }
      return fileName;
    };
    exports.getRoot = function getRoot(file) {
      var dir = dirname(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  })(bindings, bindings.exports);
  return bindings.exports;
}
var sqlite3Binding;
var hasRequiredSqlite3Binding;
function requireSqlite3Binding() {
  if (hasRequiredSqlite3Binding) return sqlite3Binding;
  hasRequiredSqlite3Binding = 1;
  sqlite3Binding = requireBindings()("node_sqlite3.node");
  return sqlite3Binding;
}
var trace = {};
var hasRequiredTrace;
function requireTrace() {
  if (hasRequiredTrace) return trace;
  hasRequiredTrace = 1;
  const util = require$$2$1;
  function extendTrace(object, property, pos) {
    const old = object[property];
    object[property] = function() {
      const error = new Error();
      const name = object.constructor.name + "#" + property + "(" + Array.prototype.slice.call(arguments).map(function(el) {
        return util.inspect(el, false, 0);
      }).join(", ") + ")";
      if (typeof pos === "undefined") pos = -1;
      if (pos < 0) pos += arguments.length;
      const cb = arguments[pos];
      if (typeof arguments[pos] === "function") {
        arguments[pos] = function replacement() {
          const err = arguments[0];
          if (err && err.stack && !err.__augmented) {
            err.stack = filter(err).join("\n");
            err.stack += "\n--> in " + name;
            err.stack += "\n" + filter(error).slice(1).join("\n");
            err.__augmented = true;
          }
          return cb.apply(this, arguments);
        };
      }
      return old.apply(this, arguments);
    };
  }
  trace.extendTrace = extendTrace;
  function filter(error) {
    return error.stack.split("\n").filter(function(line) {
      return line.indexOf(__filename) < 0;
    });
  }
  return trace;
}
var hasRequiredSqlite3$1;
function requireSqlite3$1() {
  if (hasRequiredSqlite3$1) return sqlite3$1.exports;
  hasRequiredSqlite3$1 = 1;
  (function(module, exports) {
    const path = require$$0$4;
    const sqlite32 = requireSqlite3Binding();
    const EventEmitter = require$$0.EventEmitter;
    module.exports = sqlite32;
    function normalizeMethod(fn) {
      return function(sql) {
        let errBack;
        const args = Array.prototype.slice.call(arguments, 1);
        if (typeof args[args.length - 1] === "function") {
          const callback = args[args.length - 1];
          errBack = function(err) {
            if (err) {
              callback(err);
            }
          };
        }
        const statement = new Statement(this, sql, errBack);
        return fn.call(this, statement, args);
      };
    }
    function inherits(target, source) {
      for (const k in source.prototype)
        target.prototype[k] = source.prototype[k];
    }
    sqlite32.cached = {
      Database: function(file, a, b) {
        if (file === "" || file === ":memory:") {
          return new Database(file, a, b);
        }
        let db2;
        file = path.resolve(file);
        if (!sqlite32.cached.objects[file]) {
          db2 = sqlite32.cached.objects[file] = new Database(file, a, b);
        } else {
          db2 = sqlite32.cached.objects[file];
          const callback = typeof a === "number" ? b : a;
          if (typeof callback === "function") {
            let cb = function() {
              callback.call(db2, null);
            };
            if (db2.open) process.nextTick(cb);
            else db2.once("open", cb);
          }
        }
        return db2;
      },
      objects: {}
    };
    const Database = sqlite32.Database;
    const Statement = sqlite32.Statement;
    const Backup = sqlite32.Backup;
    inherits(Database, EventEmitter);
    inherits(Statement, EventEmitter);
    inherits(Backup, EventEmitter);
    Database.prototype.prepare = normalizeMethod(function(statement, params) {
      return params.length ? statement.bind.apply(statement, params) : statement;
    });
    Database.prototype.run = normalizeMethod(function(statement, params) {
      statement.run.apply(statement, params).finalize();
      return this;
    });
    Database.prototype.get = normalizeMethod(function(statement, params) {
      statement.get.apply(statement, params).finalize();
      return this;
    });
    Database.prototype.all = normalizeMethod(function(statement, params) {
      statement.all.apply(statement, params).finalize();
      return this;
    });
    Database.prototype.each = normalizeMethod(function(statement, params) {
      statement.each.apply(statement, params).finalize();
      return this;
    });
    Database.prototype.map = normalizeMethod(function(statement, params) {
      statement.map.apply(statement, params).finalize();
      return this;
    });
    Database.prototype.backup = function() {
      let backup;
      if (arguments.length <= 2) {
        backup = new Backup(this, arguments[0], "main", "main", true, arguments[1]);
      } else {
        backup = new Backup(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
      }
      backup.retryErrors = [sqlite32.BUSY, sqlite32.LOCKED];
      return backup;
    };
    Statement.prototype.map = function() {
      const params = Array.prototype.slice.call(arguments);
      const callback = params.pop();
      params.push(function(err, rows) {
        if (err) return callback(err);
        const result = {};
        if (rows.length) {
          const keys = Object.keys(rows[0]);
          const key = keys[0];
          if (keys.length > 2) {
            for (let i = 0; i < rows.length; i++) {
              result[rows[i][key]] = rows[i];
            }
          } else {
            const value = keys[1];
            for (let i = 0; i < rows.length; i++) {
              result[rows[i][key]] = rows[i][value];
            }
          }
        }
        callback(err, result);
      });
      return this.all.apply(this, params);
    };
    let isVerbose = false;
    const supportedEvents = ["trace", "profile", "change"];
    Database.prototype.addListener = Database.prototype.on = function(type) {
      const val = EventEmitter.prototype.addListener.apply(this, arguments);
      if (supportedEvents.indexOf(type) >= 0) {
        this.configure(type, true);
      }
      return val;
    };
    Database.prototype.removeListener = function(type) {
      const val = EventEmitter.prototype.removeListener.apply(this, arguments);
      if (supportedEvents.indexOf(type) >= 0 && !this._events[type]) {
        this.configure(type, false);
      }
      return val;
    };
    Database.prototype.removeAllListeners = function(type) {
      const val = EventEmitter.prototype.removeAllListeners.apply(this, arguments);
      if (supportedEvents.indexOf(type) >= 0) {
        this.configure(type, false);
      }
      return val;
    };
    sqlite32.verbose = function() {
      if (!isVerbose) {
        const trace2 = requireTrace();
        [
          "prepare",
          "get",
          "run",
          "all",
          "each",
          "map",
          "close",
          "exec"
        ].forEach(function(name) {
          trace2.extendTrace(Database.prototype, name);
        });
        [
          "bind",
          "get",
          "run",
          "all",
          "each",
          "map",
          "reset",
          "finalize"
        ].forEach(function(name) {
          trace2.extendTrace(Statement.prototype, name);
        });
        isVerbose = true;
      }
      return sqlite32;
    };
  })(sqlite3$1);
  return sqlite3$1.exports;
}
var sqlite3;
var hasRequiredSqlite3;
function requireSqlite3() {
  if (hasRequiredSqlite3) return sqlite3;
  hasRequiredSqlite3 = 1;
  const defaults = requireDefaults();
  const map = requireMap();
  const { promisify } = require$$2$1;
  const Client = requireClient();
  const Raw = requireRaw();
  const Transaction = requireSqliteTransaction();
  const SqliteQueryCompiler = requireSqliteQuerycompiler();
  const SchemaCompiler = requireSqliteCompiler();
  const ColumnCompiler = requireSqliteColumncompiler();
  const TableCompiler = requireSqliteTablecompiler();
  const ViewCompiler = requireSqliteViewcompiler();
  const SQLite3_DDL = requireDdl();
  const Formatter = requireFormatter();
  const QueryBuilder = requireSqliteQuerybuilder();
  class Client_SQLite3 extends Client {
    constructor(config) {
      super(config);
      if (config.connection && config.connection.filename === void 0) {
        this.logger.warn(
          "Could not find `connection.filename` in config. Please specify the database path and name to avoid errors. (see docs https://knexjs.org/guide/#configuration-options)"
        );
      }
      if (config.useNullAsDefault === void 0) {
        this.logger.warn(
          "sqlite does not support inserting default values. Set the `useNullAsDefault` flag to hide this warning. (see docs https://knexjs.org/guide/query-builder.html#insert)."
        );
      }
    }
    _driver() {
      return requireSqlite3$1();
    }
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    transaction() {
      return new Transaction(this, ...arguments);
    }
    queryCompiler(builder2, formatter2) {
      return new SqliteQueryCompiler(this, builder2, formatter2);
    }
    queryBuilder() {
      return new QueryBuilder(this);
    }
    viewCompiler(builder2, formatter2) {
      return new ViewCompiler(this, builder2, formatter2);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    ddl(compiler2, pragma, connection) {
      return new SQLite3_DDL(this, compiler2, pragma, connection);
    }
    wrapIdentifierImpl(value) {
      return value !== "*" ? `\`${value.replace(/`/g, "``")}\`` : "*";
    }
    // Get a raw connection from the database, returning a promise with the connection object.
    acquireRawConnection() {
      return new Promise((resolve, reject) => {
        let flags = this.driver.OPEN_READWRITE | this.driver.OPEN_CREATE;
        if (this.connectionSettings.flags) {
          if (!Array.isArray(this.connectionSettings.flags)) {
            throw new Error(`flags must be an array of strings`);
          }
          this.connectionSettings.flags.forEach((_flag) => {
            if (!_flag.startsWith("OPEN_") || !this.driver[_flag]) {
              throw new Error(`flag ${_flag} not supported by node-sqlite3`);
            }
            flags = flags | this.driver[_flag];
          });
        }
        const db2 = new this.driver.Database(
          this.connectionSettings.filename,
          flags,
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve(db2);
          }
        );
      });
    }
    // Used to explicitly close a connection, called internally by the pool when
    // a connection times out or the pool is shutdown.
    async destroyRawConnection(connection) {
      const close = promisify((cb) => connection.close(cb));
      return close();
    }
    // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.
    _query(connection, obj) {
      if (!obj.sql) throw new Error("The query is empty");
      const { method } = obj;
      let callMethod;
      switch (method) {
        case "insert":
        case "update":
          callMethod = obj.returning ? "all" : "run";
          break;
        case "counter":
        case "del":
          callMethod = "run";
          break;
        default:
          callMethod = "all";
      }
      return new Promise(function(resolver, rejecter) {
        if (!connection || !connection[callMethod]) {
          return rejecter(
            new Error(`Error calling ${callMethod} on connection.`)
          );
        }
        connection[callMethod](obj.sql, obj.bindings, function(err, response) {
          if (err) return rejecter(err);
          obj.response = response;
          obj.context = this;
          return resolver(obj);
        });
      });
    }
    _stream(connection, obj, stream) {
      if (!obj.sql) throw new Error("The query is empty");
      const client2 = this;
      return new Promise(function(resolver, rejecter) {
        stream.on("error", rejecter);
        stream.on("end", resolver);
        return client2._query(connection, obj).then((obj2) => obj2.response).then((rows) => rows.forEach((row) => stream.write(row))).catch(function(err) {
          stream.emit("error", err);
        }).then(function() {
          stream.end();
        });
      });
    }
    // Ensures the response is returned in the same format as other clients.
    processResponse(obj, runner2) {
      const ctx = obj.context;
      const { response, returning } = obj;
      if (obj.output) return obj.output.call(runner2, response);
      switch (obj.method) {
        case "select":
          return response;
        case "first":
          return response[0];
        case "pluck":
          return map(response, obj.pluck);
        case "insert": {
          if (returning) {
            if (response) {
              return response;
            }
          }
          return [ctx.lastID];
        }
        case "update": {
          if (returning) {
            if (response) {
              return response;
            }
          }
          return ctx.changes;
        }
        case "del":
        case "counter":
          return ctx.changes;
        default: {
          return response;
        }
      }
    }
    poolDefaults() {
      return defaults({ min: 1, max: 1 }, super.poolDefaults());
    }
    formatter(builder2) {
      return new Formatter(this, builder2);
    }
    values(values, builder2, formatter2) {
      if (Array.isArray(values)) {
        if (Array.isArray(values[0])) {
          return `( values ${values.map(
            (value) => `(${this.parameterize(value, void 0, builder2, formatter2)})`
          ).join(", ")})`;
        }
        return `(${this.parameterize(values, void 0, builder2, formatter2)})`;
      }
      if (values instanceof Raw) {
        return `(${this.parameter(values, builder2, formatter2)})`;
      }
      return this.parameter(values, builder2, formatter2);
    }
  }
  Object.assign(Client_SQLite3.prototype, {
    dialect: "sqlite3",
    driverName: "sqlite3"
  });
  sqlite3 = Client_SQLite3;
  return sqlite3;
}
var betterSqlite3;
var hasRequiredBetterSqlite3;
function requireBetterSqlite3() {
  if (hasRequiredBetterSqlite3) return betterSqlite3;
  hasRequiredBetterSqlite3 = 1;
  const Client_SQLite3 = requireSqlite3();
  class Client_BetterSQLite3 extends Client_SQLite3 {
    _driver() {
      return require$$1$1;
    }
    // Get a raw connection from the database, returning a promise with the connection object.
    async acquireRawConnection() {
      const options = this.connectionSettings.options || {};
      return new this.driver(this.connectionSettings.filename, {
        nativeBinding: options.nativeBinding,
        readonly: !!options.readonly
      });
    }
    // Used to explicitly close a connection, called internally by the pool when
    // a connection times out or the pool is shutdown.
    async destroyRawConnection(connection) {
      return connection.close();
    }
    // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.
    async _query(connection, obj) {
      if (!obj.sql) throw new Error("The query is empty");
      if (!connection) {
        throw new Error("No connection provided");
      }
      const statement = connection.prepare(obj.sql);
      const bindings2 = this._formatBindings(obj.bindings);
      if (statement.reader) {
        const response2 = await statement.all(bindings2);
        obj.response = response2;
        return obj;
      }
      const response = await statement.run(bindings2);
      obj.response = response;
      obj.context = {
        lastID: response.lastInsertRowid,
        changes: response.changes
      };
      return obj;
    }
    _formatBindings(bindings2) {
      if (!bindings2) {
        return [];
      }
      return bindings2.map((binding) => {
        if (binding instanceof Date) {
          return binding.valueOf();
        }
        if (typeof binding === "boolean") {
          return Number(binding);
        }
        return binding;
      });
    }
  }
  Object.assign(Client_BetterSQLite3.prototype, {
    // The "dialect", for reference .
    driverName: "better-sqlite3"
  });
  betterSqlite3 = Client_BetterSQLite3;
  return betterSqlite3;
}
var pgTransaction;
var hasRequiredPgTransaction;
function requirePgTransaction() {
  if (hasRequiredPgTransaction) return pgTransaction;
  hasRequiredPgTransaction = 1;
  const Transaction = requireTransaction$5();
  class Transaction_PG extends Transaction {
    begin(conn) {
      const trxMode = [
        this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
        this.readOnly ? "READ ONLY" : ""
      ].join(" ").trim();
      if (trxMode.length === 0) {
        return this.query(conn, "BEGIN;");
      }
      return this.query(conn, `BEGIN TRANSACTION ${trxMode};`);
    }
  }
  pgTransaction = Transaction_PG;
  return pgTransaction;
}
var pgQuerycompiler;
var hasRequiredPgQuerycompiler;
function requirePgQuerycompiler() {
  if (hasRequiredPgQuerycompiler) return pgQuerycompiler;
  hasRequiredPgQuerycompiler = 1;
  const identity = requireIdentity();
  const reduce = requireReduce();
  const QueryCompiler = requireQuerycompiler();
  const {
    wrapString,
    columnize: columnize_,
    operator: operator_,
    wrap: wrap_
  } = requireWrappingFormatter();
  class QueryCompiler_PG extends QueryCompiler {
    constructor(client2, builder2, formatter2) {
      super(client2, builder2, formatter2);
      this._defaultInsertValue = "default";
    }
    // Compiles a truncate query.
    truncate() {
      return `truncate ${this.tableName} restart identity`;
    }
    // is used if the an array with multiple empty values supplied
    // Compiles an `insert` query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      let sql = super.insert();
      if (sql === "") return sql;
      const { returning, onConflict, ignore, merge, insert } = this.single;
      if (onConflict && ignore) sql += this._ignore(onConflict);
      if (onConflict && merge) {
        sql += this._merge(merge.updates, onConflict, insert);
        const wheres = this.where();
        if (wheres) sql += ` ${wheres}`;
      }
      if (returning) sql += this._returning(returning);
      return {
        sql,
        returning
      };
    }
    // Compiles an `update` query, allowing for a return value.
    update() {
      const withSQL = this.with();
      const updateData = this._prepUpdate(this.single.update);
      const wheres = this.where();
      const { returning, updateFrom } = this.single;
      return {
        sql: withSQL + `update ${this.single.only ? "only " : ""}${this.tableName} set ${updateData.join(", ")}` + this._updateFrom(updateFrom) + (wheres ? ` ${wheres}` : "") + this._returning(returning),
        returning
      };
    }
    using() {
      const usingTables = this.single.using;
      if (!usingTables) return;
      let sql = "using ";
      if (Array.isArray(usingTables)) {
        sql += usingTables.map((table) => {
          return this.formatter.wrap(table);
        }).join(",");
      } else {
        sql += this.formatter.wrap(usingTables);
      }
      return sql;
    }
    // Compiles an `delete` query, allowing for a return value.
    del() {
      const { tableName } = this;
      const withSQL = this.with();
      let wheres = this.where() || "";
      let using = this.using() || "";
      const joins = this.grouped.join;
      const tableJoins = [];
      if (Array.isArray(joins)) {
        for (const join of joins) {
          tableJoins.push(
            wrap_(
              this._joinTable(join),
              void 0,
              this.builder,
              this.client,
              this.bindingsHolder
            )
          );
          const joinWheres = [];
          for (const clause of join.clauses) {
            joinWheres.push(
              this.whereBasic({
                column: clause.column,
                operator: "=",
                value: clause.value,
                asColumn: true
              })
            );
          }
          if (joinWheres.length > 0) {
            wheres += (wheres ? " and " : "where ") + joinWheres.join(" and ");
          }
        }
        if (tableJoins.length > 0) {
          using += (using ? "," : "using ") + tableJoins.join(",");
        }
      }
      const sql = withSQL + `delete from ${this.single.only ? "only " : ""}${tableName}` + (using ? ` ${using}` : "") + (wheres ? ` ${wheres}` : "");
      const { returning } = this.single;
      return {
        sql: sql + this._returning(returning),
        returning
      };
    }
    aggregate(stmt) {
      return this._aggregate(stmt, { distinctParentheses: true });
    }
    _returning(value) {
      return value ? ` returning ${this.formatter.columnize(value)}` : "";
    }
    _updateFrom(name) {
      return name ? ` from ${this.formatter.wrap(name)}` : "";
    }
    _ignore(columns) {
      if (columns === true) {
        return " on conflict do nothing";
      }
      return ` on conflict ${this._onConflictClause(columns)} do nothing`;
    }
    _merge(updates, columns, insert) {
      let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
      if (updates && Array.isArray(updates)) {
        sql += updates.map(
          (column) => wrapString(
            column.split(".").pop(),
            this.formatter.builder,
            this.client,
            this.formatter
          )
        ).map((column) => `${column} = excluded.${column}`).join(", ");
        return sql;
      } else if (updates && typeof updates === "object") {
        const updateData = this._prepUpdate(updates);
        if (typeof updateData === "string") {
          sql += updateData;
        } else {
          sql += updateData.join(",");
        }
        return sql;
      } else {
        const insertData = this._prepInsert(insert);
        if (typeof insertData === "string") {
          throw new Error(
            "If using merge with a raw insert query, then updates must be provided"
          );
        }
        sql += insertData.columns.map(
          (column) => wrapString(column.split(".").pop(), this.builder, this.client)
        ).map((column) => `${column} = excluded.${column}`).join(", ");
        return sql;
      }
    }
    // Join array of table names and apply default schema.
    _tableNames(tables) {
      const schemaName = this.single.schema;
      const sql = [];
      for (let i = 0; i < tables.length; i++) {
        let tableName = tables[i];
        if (tableName) {
          if (schemaName) {
            tableName = `${schemaName}.${tableName}`;
          }
          sql.push(this.formatter.wrap(tableName));
        }
      }
      return sql.join(", ");
    }
    _lockingClause(lockMode) {
      const tables = this.single.lockTables || [];
      return lockMode + (tables.length ? " of " + this._tableNames(tables) : "");
    }
    _groupOrder(item, type) {
      return super._groupOrderNulls(item, type);
    }
    forUpdate() {
      return this._lockingClause("for update");
    }
    forShare() {
      return this._lockingClause("for share");
    }
    forNoKeyUpdate() {
      return this._lockingClause("for no key update");
    }
    forKeyShare() {
      return this._lockingClause("for key share");
    }
    skipLocked() {
      return "skip locked";
    }
    noWait() {
      return "nowait";
    }
    // Compiles a columnInfo query
    columnInfo() {
      const column = this.single.columnInfo;
      let schema = this.single.schema;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      if (schema) {
        schema = this.client.customWrapIdentifier(schema, identity);
      }
      const sql = "select * from information_schema.columns where table_name = ? and table_catalog = current_database()";
      const bindings2 = [table];
      return this._buildColumnInfoQuery(schema, sql, bindings2, column);
    }
    _buildColumnInfoQuery(schema, sql, bindings2, column) {
      if (schema) {
        sql += " and table_schema = ?";
        bindings2.push(schema);
      } else {
        sql += " and table_schema = current_schema()";
      }
      return {
        sql,
        bindings: bindings2,
        output(resp) {
          const out = reduce(
            resp.rows,
            function(columns, val) {
              columns[val.column_name] = {
                type: val.data_type,
                maxLength: val.character_maximum_length,
                nullable: val.is_nullable === "YES",
                defaultValue: val.column_default
              };
              return columns;
            },
            {}
          );
          return column && out[column] || out;
        }
      };
    }
    distinctOn(value) {
      return "distinct on (" + this.formatter.columnize(value) + ") ";
    }
    // Json functions
    jsonExtract(params) {
      return this._jsonExtract("jsonb_path_query", params);
    }
    jsonSet(params) {
      return this._jsonSet(
        "jsonb_set",
        Object.assign({}, params, {
          path: this.client.toPathForJson(params.path)
        })
      );
    }
    jsonInsert(params) {
      return this._jsonSet(
        "jsonb_insert",
        Object.assign({}, params, {
          path: this.client.toPathForJson(params.path)
        })
      );
    }
    jsonRemove(params) {
      const jsonCol = `${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )} #- ${this.client.parameter(
        this.client.toPathForJson(params.path),
        this.builder,
        this.bindingsHolder
      )}`;
      return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
    }
    whereJsonPath(statement) {
      let castValue = "";
      if (!isNaN(statement.value) && parseInt(statement.value)) {
        castValue = "::int";
      } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
        castValue = "::float";
      } else {
        castValue = " #>> '{}'";
      }
      return `jsonb_path_query_first(${this._columnClause(
        statement
      )}, ${this.client.parameter(
        statement.jsonPath,
        this.builder,
        this.bindingsHolder
      )})${castValue} ${operator_(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      )} ${this._jsonValueClause(statement)}`;
    }
    whereJsonSupersetOf(statement) {
      return this._not(
        statement,
        `${wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        )} @> ${this._jsonValueClause(statement)}`
      );
    }
    whereJsonSubsetOf(statement) {
      return this._not(
        statement,
        `${columnize_(
          statement.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )} <@ ${this._jsonValueClause(statement)}`
      );
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("jsonb_path_query_first", clause);
    }
  }
  pgQuerycompiler = QueryCompiler_PG;
  return pgQuerycompiler;
}
var pgQuerybuilder;
var hasRequiredPgQuerybuilder;
function requirePgQuerybuilder() {
  if (hasRequiredPgQuerybuilder) return pgQuerybuilder;
  hasRequiredPgQuerybuilder = 1;
  const QueryBuilder = requireQuerybuilder();
  pgQuerybuilder = class QueryBuilder_PostgreSQL extends QueryBuilder {
    updateFrom(name) {
      this._single.updateFrom = name;
      return this;
    }
    using(tables) {
      this._single.using = tables;
      return this;
    }
    withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "with"
      );
      return this.withWrapped(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        true
      );
    }
    withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
      this._validateWithArgs(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        "with"
      );
      return this.withWrapped(
        alias,
        statementOrColumnList,
        nothingOrStatement,
        false
      );
    }
  };
  return pgQuerybuilder;
}
var pgColumncompiler;
var hasRequiredPgColumncompiler;
function requirePgColumncompiler() {
  if (hasRequiredPgColumncompiler) return pgColumncompiler;
  hasRequiredPgColumncompiler = 1;
  const ColumnCompiler = requireColumncompiler();
  const { isObject } = requireIs();
  const { toNumber } = requireHelpers$1();
  const commentEscapeRegex = new RegExp("(?<!')'(?!')", "g");
  class ColumnCompiler_PG extends ColumnCompiler {
    constructor(client2, tableCompiler, columnBuilder) {
      super(client2, tableCompiler, columnBuilder);
      this.modifiers = ["nullable", "defaultTo", "comment"];
      this._addCheckModifiers();
    }
    // Types
    // ------
    bit(column) {
      return column.length !== false ? `bit(${column.length})` : "bit";
    }
    // Create the column definition for an enum type.
    // Using method "2" here: http://stackoverflow.com/a/10984951/525714
    enu(allowed, options) {
      options = options || {};
      const values = options.useNative && options.existingType ? void 0 : allowed.join("', '");
      if (options.useNative) {
        let enumName = "";
        const schemaName = options.schemaName || this.tableCompiler.schemaNameRaw;
        if (schemaName) {
          enumName += `"${schemaName}".`;
        }
        enumName += `"${options.enumName}"`;
        if (!options.existingType) {
          this.tableCompiler.unshiftQuery(
            `create type ${enumName} as enum ('${values}')`
          );
        }
        return enumName;
      }
      return `text check (${this.formatter.wrap(this.args[0])} in ('${values}'))`;
    }
    decimal(precision, scale) {
      if (precision === null) return "decimal";
      return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    json(jsonb) {
      if (jsonb) this.client.logger.deprecate("json(true)", "jsonb()");
      return jsonColumn(this.client, jsonb);
    }
    jsonb() {
      return jsonColumn(this.client, true);
    }
    checkRegex(regex, constraintName) {
      return this._check(
        `${this.formatter.wrap(
          this.getColumnName()
        )} ~ ${this.client._escapeBinding(regex)}`,
        constraintName
      );
    }
    datetime(withoutTz = false, precision) {
      let useTz;
      if (isObject(withoutTz)) {
        ({ useTz, precision } = withoutTz);
      } else {
        useTz = !withoutTz;
      }
      useTz = typeof useTz === "boolean" ? useTz : true;
      precision = precision !== void 0 && precision !== null ? "(" + precision + ")" : "";
      return `${useTz ? "timestamptz" : "timestamp"}${precision}`;
    }
    timestamp(withoutTz = false, precision) {
      return this.datetime(withoutTz, precision);
    }
    // Modifiers:
    // ------
    comment(comment) {
      const columnName = this.args[0] || this.defaults("columnName");
      const escapedComment = comment ? `'${comment.replace(commentEscapeRegex, "''")}'` : "NULL";
      this.pushAdditional(function() {
        this.pushQuery(
          `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(columnName) + ` is ${escapedComment}`
        );
      }, comment);
    }
    increments(options = { primaryKey: true }) {
      return "serial" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
    bigincrements(options = { primaryKey: true }) {
      return "bigserial" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
    uuid(options = { primaryKey: false }) {
      return "uuid" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
  }
  ColumnCompiler_PG.prototype.bigint = "bigint";
  ColumnCompiler_PG.prototype.binary = "bytea";
  ColumnCompiler_PG.prototype.bool = "boolean";
  ColumnCompiler_PG.prototype.double = "double precision";
  ColumnCompiler_PG.prototype.floating = "real";
  ColumnCompiler_PG.prototype.smallint = "smallint";
  ColumnCompiler_PG.prototype.tinyint = "smallint";
  function jsonColumn(client2, jsonb) {
    if (!client2.version || client2.config.client === "cockroachdb" || client2.config.jsonbSupport === true || parseFloat(client2.version) >= 9.2) {
      return jsonb ? "jsonb" : "json";
    }
    return "text";
  }
  pgColumncompiler = ColumnCompiler_PG;
  return pgColumncompiler;
}
var pgTablecompiler;
var hasRequiredPgTablecompiler;
function requirePgTablecompiler() {
  if (hasRequiredPgTablecompiler) return pgTablecompiler;
  hasRequiredPgTablecompiler = 1;
  const has = requireHas();
  const TableCompiler = requireTablecompiler();
  const { isObject, isString } = requireIs();
  class TableCompiler_PG extends TableCompiler {
    constructor(client2, tableBuilder) {
      super(client2, tableBuilder);
    }
    // Compile a rename column command.
    renameColumn(from, to) {
      return this.pushQuery({
        sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
          from
        )} to ${this.formatter.wrap(to)}`
      });
    }
    _setNullableState(column, isNullable) {
      const constraintAction = isNullable ? "drop not null" : "set not null";
      const sql = `alter table ${this.tableName()} alter column ${this.formatter.wrap(
        column
      )} ${constraintAction}`;
      return this.pushQuery({
        sql
      });
    }
    compileAdd(builder2) {
      const table = this.formatter.wrap(builder2);
      const columns = this.prefixArray("add column", this.getColumns(builder2));
      return this.pushQuery({
        sql: `alter table ${table} ${columns.join(", ")}`
      });
    }
    // Adds the "create" query to the query sequence.
    createQuery(columns, ifNot, like) {
      const createStatement = ifNot ? "create table if not exists " : "create table ";
      const columnsSql = ` (${columns.sql.join(", ")}${this.primaryKeys() || ""}${this._addChecks()})`;
      let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " (like " + this.tableNameLike() + " including all" + (columns.sql.length ? ", " + columns.sql.join(", ") : "") + ")" : columnsSql);
      if (this.single.inherits)
        sql += ` inherits (${this.formatter.wrap(this.single.inherits)})`;
      this.pushQuery({
        sql,
        bindings: columns.bindings
      });
      const hasComment = has(this.single, "comment");
      if (hasComment) this.comment(this.single.comment);
    }
    primaryKeys() {
      const pks = (this.grouped.alterTable || []).filter(
        (k) => k.method === "primary"
      );
      if (pks.length > 0 && pks[0].args.length > 0) {
        const columns = pks[0].args[0];
        let constraintName = pks[0].args[1] || "";
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        return `, constraint ${constraintName} primary key (${this.formatter.columnize(
          columns
        )})${deferrable}`;
      }
    }
    addColumns(columns, prefix, colCompilers) {
      if (prefix === this.alterColumnsPrefix) {
        for (const col of colCompilers) {
          this._addColumn(col);
        }
      } else {
        super.addColumns(columns, prefix);
      }
    }
    _addColumn(col) {
      const quotedTableName = this.tableName();
      const type = col.getColumnType();
      const colName = this.client.wrapIdentifier(
        col.getColumnName(),
        col.columnBuilder.queryContext()
      );
      const isEnum = col.type === "enu";
      this.pushQuery({
        sql: `alter table ${quotedTableName} alter column ${colName} drop default`,
        bindings: []
      });
      const alterNullable = col.columnBuilder.alterNullable;
      if (alterNullable) {
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} drop not null`,
          bindings: []
        });
      }
      const alterType = col.columnBuilder.alterType;
      if (alterType) {
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} type ${type} using (${colName}${isEnum ? "::text::" : "::"}${type})`,
          bindings: []
        });
      }
      const defaultTo = col.modified["defaultTo"];
      if (defaultTo) {
        const modifier = col.defaultTo.apply(col, defaultTo);
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} set ${modifier}`,
          bindings: []
        });
      }
      if (alterNullable) {
        const nullable = col.modified["nullable"];
        if (nullable && nullable[0] === false) {
          this.pushQuery({
            sql: `alter table ${quotedTableName} alter column ${colName} set not null`,
            bindings: []
          });
        }
      }
    }
    // Compiles the comment on the table.
    comment(comment) {
      this.pushQuery(
        `comment on table ${this.tableName()} is '${this.single.comment}'`
      );
    }
    // Indexes:
    // -------
    primary(columns, constraintName) {
      let deferrable;
      if (isObject(constraintName)) {
        ({ constraintName, deferrable } = constraintName);
      }
      deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
      if (this.method !== "create" && this.method !== "createIfNot") {
        this.pushQuery(
          `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
            columns
          )})${deferrable}`
        );
      }
    }
    unique(columns, indexName) {
      let deferrable;
      let useConstraint = true;
      let predicate;
      if (isObject(indexName)) {
        ({ indexName, deferrable, useConstraint, predicate } = indexName);
        if (useConstraint === void 0) {
          useConstraint = !!deferrable || !predicate;
        }
      }
      if (!useConstraint && deferrable && deferrable !== "not deferrable") {
        throw new Error("postgres cannot create deferrable index");
      }
      if (useConstraint && predicate) {
        throw new Error("postgres cannot create constraint with predicate");
      }
      deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      if (useConstraint) {
        this.pushQuery(
          `alter table ${this.tableName()} add constraint ${indexName} unique (` + this.formatter.columnize(columns) + ")" + deferrable
        );
      } else {
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
        this.pushQuery(
          `create unique index ${indexName} on ${this.tableName()} (${this.formatter.columnize(
            columns
          )})${predicateQuery}`
        );
      }
    }
    index(columns, indexName, options) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      let predicate;
      let storageEngineIndexType;
      let indexType;
      if (isString(options)) {
        storageEngineIndexType = options;
      } else if (isObject(options)) {
        ({ indexType, storageEngineIndexType, predicate } = options);
      }
      const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
      this.pushQuery(
        `create${typeof indexType === "string" && indexType.toLowerCase() === "unique" ? " unique" : ""} index ${indexName} on ${this.tableName()}${storageEngineIndexType && ` using ${storageEngineIndexType}` || ""} (` + this.formatter.columnize(columns) + `)${predicateQuery}`
      );
    }
    dropPrimary(constraintName) {
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(this.tableNameRaw + "_pkey");
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${constraintName}`
      );
    }
    dropIndex(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      indexName = this.schemaNameRaw ? `${this.formatter.wrap(this.schemaNameRaw)}.${indexName}` : indexName;
      this.pushQuery(`drop index ${indexName}`);
    }
    dropUnique(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${indexName}`
      );
    }
    dropForeign(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${indexName}`
      );
    }
  }
  pgTablecompiler = TableCompiler_PG;
  return pgTablecompiler;
}
var pgViewcompiler;
var hasRequiredPgViewcompiler;
function requirePgViewcompiler() {
  if (hasRequiredPgViewcompiler) return pgViewcompiler;
  hasRequiredPgViewcompiler = 1;
  const ViewCompiler = requireViewcompiler();
  class ViewCompiler_PG extends ViewCompiler {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
    renameColumn(from, to) {
      return this.pushQuery({
        sql: `alter view ${this.viewName()} rename ${this.formatter.wrap(
          from
        )} to ${this.formatter.wrap(to)}`
      });
    }
    defaultTo(column, defaultValue) {
      return this.pushQuery({
        sql: `alter view ${this.viewName()} alter ${this.formatter.wrap(
          column
        )} set default ${defaultValue}`
      });
    }
    createOrReplace() {
      this.createQuery(this.columns, this.selectQuery, false, true);
    }
    createMaterializedView() {
      this.createQuery(this.columns, this.selectQuery, true);
    }
  }
  pgViewcompiler = ViewCompiler_PG;
  return pgViewcompiler;
}
var pgViewbuilder;
var hasRequiredPgViewbuilder;
function requirePgViewbuilder() {
  if (hasRequiredPgViewbuilder) return pgViewbuilder;
  hasRequiredPgViewbuilder = 1;
  const ViewBuilder = requireViewbuilder();
  class ViewBuilder_PG extends ViewBuilder {
    constructor() {
      super(...arguments);
    }
    checkOption() {
      this._single.checkOption = "default_option";
    }
    localCheckOption() {
      this._single.checkOption = "local";
    }
    cascadedCheckOption() {
      this._single.checkOption = "cascaded";
    }
  }
  pgViewbuilder = ViewBuilder_PG;
  return pgViewbuilder;
}
var pgCompiler;
var hasRequiredPgCompiler;
function requirePgCompiler() {
  if (hasRequiredPgCompiler) return pgCompiler;
  hasRequiredPgCompiler = 1;
  const SchemaCompiler = requireCompiler$1();
  class SchemaCompiler_PG extends SchemaCompiler {
    constructor(client2, builder2) {
      super(client2, builder2);
    }
    // Check whether the current table
    hasTable(tableName) {
      let sql = "select * from information_schema.tables where table_name = ?";
      const bindings2 = [tableName];
      if (this.schema) {
        sql += " and table_schema = ?";
        bindings2.push(this.schema);
      } else {
        sql += " and table_schema = current_schema()";
      }
      this.pushQuery({
        sql,
        bindings: bindings2,
        output(resp) {
          return resp.rows.length > 0;
        }
      });
    }
    // Compile the query to determine if a column exists in a table.
    hasColumn(tableName, columnName) {
      let sql = "select * from information_schema.columns where table_name = ? and column_name = ?";
      const bindings2 = [tableName, columnName];
      if (this.schema) {
        sql += " and table_schema = ?";
        bindings2.push(this.schema);
      } else {
        sql += " and table_schema = current_schema()";
      }
      this.pushQuery({
        sql,
        bindings: bindings2,
        output(resp) {
          return resp.rows.length > 0;
        }
      });
    }
    qualifiedTableName(tableName) {
      const name = this.schema ? `${this.schema}.${tableName}` : tableName;
      return this.formatter.wrap(name);
    }
    // Compile a rename table command.
    renameTable(from, to) {
      this.pushQuery(
        `alter table ${this.qualifiedTableName(
          from
        )} rename to ${this.formatter.wrap(to)}`
      );
    }
    createSchema(schemaName) {
      this.pushQuery(`create schema ${this.formatter.wrap(schemaName)}`);
    }
    createSchemaIfNotExists(schemaName) {
      this.pushQuery(
        `create schema if not exists ${this.formatter.wrap(schemaName)}`
      );
    }
    dropSchema(schemaName, cascade = false) {
      this.pushQuery(
        `drop schema ${this.formatter.wrap(schemaName)}${cascade ? " cascade" : ""}`
      );
    }
    dropSchemaIfExists(schemaName, cascade = false) {
      this.pushQuery(
        `drop schema if exists ${this.formatter.wrap(schemaName)}${cascade ? " cascade" : ""}`
      );
    }
    dropExtension(extensionName) {
      this.pushQuery(`drop extension ${this.formatter.wrap(extensionName)}`);
    }
    dropExtensionIfExists(extensionName) {
      this.pushQuery(
        `drop extension if exists ${this.formatter.wrap(extensionName)}`
      );
    }
    createExtension(extensionName) {
      this.pushQuery(`create extension ${this.formatter.wrap(extensionName)}`);
    }
    createExtensionIfNotExists(extensionName) {
      this.pushQuery(
        `create extension if not exists ${this.formatter.wrap(extensionName)}`
      );
    }
    renameView(from, to) {
      this.pushQuery(
        this.alterViewPrefix + `${this.formatter.wrap(from)} rename to ${this.formatter.wrap(to)}`
      );
    }
    refreshMaterializedView(viewName, concurrently = false) {
      this.pushQuery({
        sql: `refresh materialized view${concurrently ? " concurrently" : ""} ${this.formatter.wrap(viewName)}`
      });
    }
    dropMaterializedView(viewName) {
      this._dropView(viewName, false, true);
    }
    dropMaterializedViewIfExists(viewName) {
      this._dropView(viewName, true, true);
    }
  }
  pgCompiler = SchemaCompiler_PG;
  return pgCompiler;
}
var postgres;
var hasRequiredPostgres;
function requirePostgres() {
  if (hasRequiredPostgres) return postgres;
  hasRequiredPostgres = 1;
  const extend2 = requireExtend();
  const map = requireMap();
  const { promisify } = require$$2$1;
  const Client = requireClient();
  const Transaction = requirePgTransaction();
  const QueryCompiler = requirePgQuerycompiler();
  const QueryBuilder = requirePgQuerybuilder();
  const ColumnCompiler = requirePgColumncompiler();
  const TableCompiler = requirePgTablecompiler();
  const ViewCompiler = requirePgViewcompiler();
  const ViewBuilder = requirePgViewbuilder();
  const SchemaCompiler = requirePgCompiler();
  const { makeEscape } = requireString();
  const { isString } = requireIs();
  class Client_PG extends Client {
    constructor(config) {
      super(config);
      if (config.returning) {
        this.defaultReturning = config.returning;
      }
      if (config.searchPath) {
        this.searchPath = config.searchPath;
      }
    }
    transaction() {
      return new Transaction(this, ...arguments);
    }
    queryBuilder() {
      return new QueryBuilder(this);
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    viewBuilder() {
      return new ViewBuilder(this, ...arguments);
    }
    _driver() {
      return require$$14;
    }
    wrapIdentifierImpl(value) {
      if (value === "*") return value;
      let arrayAccessor = "";
      const arrayAccessorMatch = value.match(/(.*?)(\[[0-9]+\])/);
      if (arrayAccessorMatch) {
        value = arrayAccessorMatch[1];
        arrayAccessor = arrayAccessorMatch[2];
      }
      return `"${value.replace(/"/g, '""')}"${arrayAccessor}`;
    }
    _acquireOnlyConnection() {
      const connection = new this.driver.Client(this.connectionSettings);
      connection.on("error", (err) => {
        connection.__knex__disposed = err;
      });
      connection.on("end", (err) => {
        connection.__knex__disposed = err || "Connection ended unexpectedly";
      });
      return connection.connect().then(() => connection);
    }
    // Get a raw connection, called by the `pool` whenever a new
    // connection needs to be added to the pool.
    acquireRawConnection() {
      const client2 = this;
      return this._acquireOnlyConnection().then(function(connection) {
        if (!client2.version) {
          return client2.checkVersion(connection).then(function(version) {
            client2.version = version;
            return connection;
          });
        }
        return connection;
      }).then(async function setSearchPath(connection) {
        await client2.setSchemaSearchPath(connection);
        return connection;
      });
    }
    // Used to explicitly close a connection, called internally by the pool
    // when a connection times out or the pool is shutdown.
    async destroyRawConnection(connection) {
      const end = promisify((cb) => connection.end(cb));
      return end();
    }
    // In PostgreSQL, we need to do a version check to do some feature
    // checking on the database.
    checkVersion(connection) {
      return new Promise((resolve, reject) => {
        connection.query("select version();", (err, resp) => {
          if (err) return reject(err);
          resolve(this._parseVersion(resp.rows[0].version));
        });
      });
    }
    _parseVersion(versionString) {
      return /^PostgreSQL (.*?)( |$)/.exec(versionString)[1];
    }
    // Position the bindings for the query. The escape sequence for question mark
    // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
    positionBindings(sql) {
      let questionCount = 0;
      return sql.replace(/(\\*)(\?)/g, function(match, escapes) {
        if (escapes.length % 2) {
          return "?";
        } else {
          questionCount++;
          return `$${questionCount}`;
        }
      });
    }
    setSchemaSearchPath(connection, searchPath) {
      let path = searchPath || this.searchPath;
      if (!path) return Promise.resolve(true);
      if (!Array.isArray(path) && !isString(path)) {
        throw new TypeError(
          `knex: Expected searchPath to be Array/String, got: ${typeof path}`
        );
      }
      if (isString(path)) {
        if (path.includes(",")) {
          const parts = path.split(",");
          const arraySyntax = `[${parts.map((searchPath2) => `'${searchPath2}'`).join(", ")}]`;
          this.logger.warn(
            `Detected comma in searchPath "${path}".If you are trying to specify multiple schemas, use Array syntax: ${arraySyntax}`
          );
        }
        path = [path];
      }
      path = path.map((schemaName) => `"${schemaName}"`).join(",");
      return new Promise(function(resolver, rejecter) {
        connection.query(`set search_path to ${path}`, function(err) {
          if (err) return rejecter(err);
          resolver(true);
        });
      });
    }
    _stream(connection, obj, stream, options) {
      if (!obj.sql) throw new Error("The query is empty");
      const PGQueryStream = process.browser ? void 0 : require$$15;
      const sql = obj.sql;
      return new Promise(function(resolver, rejecter) {
        const queryStream = connection.query(
          new PGQueryStream(sql, obj.bindings, options),
          (err) => {
            rejecter(err);
          }
        );
        queryStream.on("error", function(error) {
          rejecter(error);
          stream.emit("error", error);
        });
        stream.on("end", resolver);
        queryStream.pipe(stream);
      });
    }
    // Runs the query on the specified connection, providing the bindings
    // and any other necessary prep work.
    _query(connection, obj) {
      if (!obj.sql) throw new Error("The query is empty");
      let queryConfig = {
        text: obj.sql,
        values: obj.bindings || []
      };
      if (obj.options) {
        queryConfig = extend2(queryConfig, obj.options);
      }
      return new Promise(function(resolver, rejecter) {
        connection.query(queryConfig, function(err, response) {
          if (err) return rejecter(err);
          obj.response = response;
          resolver(obj);
        });
      });
    }
    // Ensures the response is returned in the same format as other clients.
    processResponse(obj, runner2) {
      const resp = obj.response;
      if (obj.output) return obj.output.call(runner2, resp);
      if (obj.method === "raw") return resp;
      const { returning } = obj;
      if (resp.command === "SELECT") {
        if (obj.method === "first") return resp.rows[0];
        if (obj.method === "pluck") return map(resp.rows, obj.pluck);
        return resp.rows;
      }
      if (returning) {
        const returns = [];
        for (let i = 0, l = resp.rows.length; i < l; i++) {
          const row = resp.rows[i];
          returns[i] = row;
        }
        return returns;
      }
      if (resp.command === "UPDATE" || resp.command === "DELETE") {
        return resp.rowCount;
      }
      return resp;
    }
    async cancelQuery(connectionToKill) {
      const conn = await this.acquireRawConnection();
      try {
        return await this._wrappedCancelQueryCall(conn, connectionToKill);
      } finally {
        await this.destroyRawConnection(conn).catch((err) => {
          this.logger.warn(`Connection Error: ${err}`);
        });
      }
    }
    _wrappedCancelQueryCall(conn, connectionToKill) {
      return this._query(conn, {
        sql: "SELECT pg_cancel_backend($1);",
        bindings: [connectionToKill.processID],
        options: {}
      });
    }
    toPathForJson(jsonPath) {
      const PG_PATH_REGEX = /^{.*}$/;
      if (jsonPath.match(PG_PATH_REGEX)) {
        return jsonPath;
      }
      return "{" + jsonPath.replace(/^(\$\.)/, "").replace(".", ",").replace(/\[([0-9]+)]/, ",$1") + // transform [number] to ,number
      "}";
    }
  }
  Object.assign(Client_PG.prototype, {
    dialect: "postgresql",
    driverName: "pg",
    canCancelQuery: true,
    _escapeBinding: makeEscape({
      escapeArray(val, esc) {
        return esc(arrayString(val, esc));
      },
      escapeString(str) {
        let hasBackslash = false;
        let escaped = "'";
        for (let i = 0; i < str.length; i++) {
          const c = str[i];
          if (c === "'") {
            escaped += c + c;
          } else if (c === "\\") {
            escaped += c + c;
            hasBackslash = true;
          } else {
            escaped += c;
          }
        }
        escaped += "'";
        if (hasBackslash === true) {
          escaped = "E" + escaped;
        }
        return escaped;
      },
      escapeObject(val, prepareValue, timezone, seen = []) {
        if (val && typeof val.toPostgres === "function") {
          seen = seen || [];
          if (seen.indexOf(val) !== -1) {
            throw new Error(
              `circular reference detected while preparing "${val}" for query`
            );
          }
          seen.push(val);
          return prepareValue(val.toPostgres(prepareValue), seen);
        }
        return JSON.stringify(val);
      }
    })
  });
  function arrayString(arr, esc) {
    let result = "{";
    for (let i = 0; i < arr.length; i++) {
      if (i > 0) result += ",";
      const val = arr[i];
      if (val === null || typeof val === "undefined") {
        result += "NULL";
      } else if (Array.isArray(val)) {
        result += arrayString(val, esc);
      } else if (typeof val === "number") {
        result += val;
      } else {
        result += JSON.stringify(typeof val === "string" ? val : esc(val));
      }
    }
    return result + "}";
  }
  postgres = Client_PG;
  return postgres;
}
var crdbQuerycompiler;
var hasRequiredCrdbQuerycompiler;
function requireCrdbQuerycompiler() {
  if (hasRequiredCrdbQuerycompiler) return crdbQuerycompiler;
  hasRequiredCrdbQuerycompiler = 1;
  const QueryCompiler_PG = requirePgQuerycompiler();
  const {
    columnize: columnize_,
    wrap: wrap_,
    operator: operator_
  } = requireWrappingFormatter();
  class QueryCompiler_CRDB extends QueryCompiler_PG {
    truncate() {
      return `truncate ${this.tableName}`;
    }
    upsert() {
      let sql = this._upsert();
      if (sql === "") return sql;
      const { returning } = this.single;
      if (returning) sql += this._returning(returning);
      return {
        sql,
        returning
      };
    }
    _upsert() {
      const upsertValues = this.single.upsert || [];
      const sql = this.with() + `upsert into ${this.tableName} `;
      const body = this._insertBody(upsertValues);
      return body === "" ? "" : sql + body;
    }
    _groupOrder(item, type) {
      return this._basicGroupOrder(item, type);
    }
    whereJsonPath(statement) {
      let castValue = "";
      if (!isNaN(statement.value) && parseInt(statement.value)) {
        castValue = "::int";
      } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
        castValue = "::float";
      } else {
        castValue = " #>> '{}'";
      }
      return `json_extract_path(${this._columnClause(
        statement
      )}, ${this.client.toArrayPathFromJsonPath(
        statement.jsonPath,
        this.builder,
        this.bindingsHolder
      )})${castValue} ${operator_(
        statement.operator,
        this.builder,
        this.client,
        this.bindingsHolder
      )} ${this._jsonValueClause(statement)}`;
    }
    // Json common functions
    _jsonExtract(nameFunction, params) {
      let extractions;
      if (Array.isArray(params.column)) {
        extractions = params.column;
      } else {
        extractions = [params];
      }
      return extractions.map((extraction) => {
        const jsonCol = `json_extract_path(${columnize_(
          extraction.column || extraction[0],
          this.builder,
          this.client,
          this.bindingsHolder
        )}, ${this.client.toArrayPathFromJsonPath(
          extraction.path || extraction[1],
          this.builder,
          this.bindingsHolder
        )})`;
        const alias = extraction.alias || extraction[2];
        return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
      }).join(", ");
    }
    _onJsonPathEquals(nameJoinFunction, clause) {
      return "json_extract_path(" + wrap_(
        clause.columnFirst,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ", " + this.client.toArrayPathFromJsonPath(
        clause.jsonPathFirst,
        this.builder,
        this.bindingsHolder
      ) + ") = json_extract_path(" + wrap_(
        clause.columnSecond,
        void 0,
        this.builder,
        this.client,
        this.bindingsHolder
      ) + ", " + this.client.toArrayPathFromJsonPath(
        clause.jsonPathSecond,
        this.builder,
        this.bindingsHolder
      ) + ")";
    }
  }
  crdbQuerycompiler = QueryCompiler_CRDB;
  return crdbQuerycompiler;
}
var crdbColumncompiler;
var hasRequiredCrdbColumncompiler;
function requireCrdbColumncompiler() {
  if (hasRequiredCrdbColumncompiler) return crdbColumncompiler;
  hasRequiredCrdbColumncompiler = 1;
  const ColumnCompiler_PG = requirePgColumncompiler();
  class ColumnCompiler_CRDB extends ColumnCompiler_PG {
    uuid(options = { primaryKey: false }) {
      return "uuid" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key default gen_random_uuid()" : "");
    }
  }
  crdbColumncompiler = ColumnCompiler_CRDB;
  return crdbColumncompiler;
}
var crdbTablecompiler;
var hasRequiredCrdbTablecompiler;
function requireCrdbTablecompiler() {
  if (hasRequiredCrdbTablecompiler) return crdbTablecompiler;
  hasRequiredCrdbTablecompiler = 1;
  const TableCompiler = requirePgTablecompiler();
  class TableCompiler_CRDB extends TableCompiler {
    constructor(client2, tableBuilder) {
      super(client2, tableBuilder);
    }
    addColumns(columns, prefix, colCompilers) {
      if (prefix === this.alterColumnsPrefix) {
        for (const col of colCompilers) {
          this.client.logger.warn(
            "Experimental alter column in use, see issue: https://github.com/cockroachdb/cockroach/issues/49329"
          );
          this.pushQuery({
            sql: "SET enable_experimental_alter_column_type_general = true",
            bindings: []
          });
          super._addColumn(col);
        }
      } else {
        super.addColumns(columns, prefix);
      }
    }
    dropUnique(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      this.pushQuery(`drop index ${this.tableName()}@${indexName} cascade `);
    }
  }
  crdbTablecompiler = TableCompiler_CRDB;
  return crdbTablecompiler;
}
var crdbViewcompiler;
var hasRequiredCrdbViewcompiler;
function requireCrdbViewcompiler() {
  if (hasRequiredCrdbViewcompiler) return crdbViewcompiler;
  hasRequiredCrdbViewcompiler = 1;
  const ViewCompiler_PG = requirePgViewcompiler();
  class ViewCompiler_CRDB extends ViewCompiler_PG {
    renameColumn(from, to) {
      throw new Error("rename column of views is not supported by this dialect.");
    }
    defaultTo(column, defaultValue) {
      throw new Error(
        "change default values of views is not supported by this dialect."
      );
    }
  }
  crdbViewcompiler = ViewCompiler_CRDB;
  return crdbViewcompiler;
}
var crdbQuerybuilder;
var hasRequiredCrdbQuerybuilder;
function requireCrdbQuerybuilder() {
  if (hasRequiredCrdbQuerybuilder) return crdbQuerybuilder;
  hasRequiredCrdbQuerybuilder = 1;
  const QueryBuilder = requireQuerybuilder();
  const isEmpty = requireIsEmpty();
  crdbQuerybuilder = class QueryBuilder_CockroachDB extends QueryBuilder {
    upsert(values, returning, options) {
      this._method = "upsert";
      if (!isEmpty(returning)) this.returning(returning, options);
      this._single.upsert = values;
      return this;
    }
  };
  return crdbQuerybuilder;
}
var cockroachdb;
var hasRequiredCockroachdb;
function requireCockroachdb() {
  if (hasRequiredCockroachdb) return cockroachdb;
  hasRequiredCockroachdb = 1;
  const Client_PostgreSQL = requirePostgres();
  const Transaction = requirePgTransaction();
  const QueryCompiler = requireCrdbQuerycompiler();
  const ColumnCompiler = requireCrdbColumncompiler();
  const TableCompiler = requireCrdbTablecompiler();
  const ViewCompiler = requireCrdbViewcompiler();
  const QueryBuilder = requireCrdbQuerybuilder();
  class Client_CockroachDB extends Client_PostgreSQL {
    transaction() {
      return new Transaction(this, ...arguments);
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    queryBuilder() {
      return new QueryBuilder(this);
    }
    _parseVersion(versionString) {
      return versionString.split(" ")[2];
    }
    async cancelQuery(connectionToKill) {
      try {
        return await this._wrappedCancelQueryCall(null, connectionToKill);
      } catch (err) {
        this.logger.warn(`Connection Error: ${err}`);
        throw err;
      }
    }
    _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
      if (connectionToKill.activeQuery.processID === 0 && connectionToKill.activeQuery.secretKey === 0) {
        return;
      }
      return connectionToKill.cancel(
        connectionToKill,
        connectionToKill.activeQuery
      );
    }
    toArrayPathFromJsonPath(jsonPath, builder2, bindingsHolder) {
      return jsonPath.replace(/^(\$\.)/, "").replace(/\[([0-9]+)]/, ".$1").split(".").map(
        (function(v) {
          return this.parameter(v, builder2, bindingsHolder);
        }).bind(this)
      ).join(", ");
    }
  }
  Object.assign(Client_CockroachDB.prototype, {
    // The "dialect", for reference elsewhere.
    driverName: "cockroachdb"
  });
  cockroachdb = Client_CockroachDB;
  return cockroachdb;
}
var isNil_1;
var hasRequiredIsNil;
function requireIsNil() {
  if (hasRequiredIsNil) return isNil_1;
  hasRequiredIsNil = 1;
  function isNil(value) {
    return value == null;
  }
  isNil_1 = isNil;
  return isNil_1;
}
var mssqlFormatter;
var hasRequiredMssqlFormatter;
function requireMssqlFormatter() {
  if (hasRequiredMssqlFormatter) return mssqlFormatter;
  hasRequiredMssqlFormatter = 1;
  const Formatter = requireFormatter();
  class MSSQL_Formatter extends Formatter {
    // Accepts a string or array of columns to wrap as appropriate.
    columnizeWithPrefix(prefix, target) {
      const columns = typeof target === "string" ? [target] : target;
      let str = "", i = -1;
      while (++i < columns.length) {
        if (i > 0) str += ", ";
        str += prefix + this.wrap(columns[i]);
      }
      return str;
    }
    /**
     * Returns its argument with single quotes escaped, so it can be included into a single-quoted string.
     *
     * For example, it converts "has'quote" to "has''quote".
     *
     * This assumes QUOTED_IDENTIFIER ON so it is only ' that need escaping,
     * never ", because " cannot be used to quote a string when that's on;
     * otherwise we'd need to be aware of whether the string is quoted with " or '.
     *
     * This assumption is consistent with the SQL Knex generates.
     * @param {string} string
     * @returns {string}
     */
    escapingStringDelimiters(string2) {
      return (string2 || "").replace(/'/g, "''");
    }
  }
  mssqlFormatter = MSSQL_Formatter;
  return mssqlFormatter;
}
var transaction$4;
var hasRequiredTransaction$4;
function requireTransaction$4() {
  if (hasRequiredTransaction$4) return transaction$4;
  hasRequiredTransaction$4 = 1;
  const Transaction = requireTransaction$5();
  const debug = requireSrc()("knex:tx");
  class Transaction_MSSQL extends Transaction {
    begin(conn) {
      debug("transaction::begin id=%s", this.txid);
      return new Promise((resolve, reject) => {
        conn.beginTransaction(
          (err) => {
            if (err) {
              debug(
                "transaction::begin error id=%s message=%s",
                this.txid,
                err.message
              );
              return reject(err);
            }
            resolve();
          },
          this.outerTx ? this.txid : void 0,
          nameToIsolationLevelEnum(this.isolationLevel)
        );
      }).then(this._resolver, this._rejecter);
    }
    savepoint(conn) {
      debug("transaction::savepoint id=%s", this.txid);
      return new Promise((resolve, reject) => {
        conn.saveTransaction(
          (err) => {
            if (err) {
              debug(
                "transaction::savepoint id=%s message=%s",
                this.txid,
                err.message
              );
              return reject(err);
            }
            this.trxClient.emit("query", {
              __knexUid: this.trxClient.__knexUid,
              __knexTxId: this.trxClient.__knexTxId,
              autogenerated: true,
              sql: this.outerTx ? `SAVE TRANSACTION [${this.txid}]` : `SAVE TRANSACTION`
            });
            resolve();
          },
          this.outerTx ? this.txid : void 0
        );
      });
    }
    commit(conn, value) {
      debug("transaction::commit id=%s", this.txid);
      return new Promise((resolve, reject) => {
        conn.commitTransaction(
          (err) => {
            if (err) {
              debug(
                "transaction::commit error id=%s message=%s",
                this.txid,
                err.message
              );
              return reject(err);
            }
            this._completed = true;
            resolve(value);
          },
          this.outerTx ? this.txid : void 0
        );
      }).then(() => this._resolver(value), this._rejecter);
    }
    release(conn, value) {
      return this._resolver(value);
    }
    rollback(conn, error) {
      this._completed = true;
      debug("transaction::rollback id=%s", this.txid);
      return new Promise((_resolve, reject) => {
        if (!conn.inTransaction) {
          return reject(
            error || new Error("Transaction rejected with non-error: undefined")
          );
        }
        if (conn.state.name !== "LoggedIn") {
          return reject(
            new Error(
              "Can't rollback transaction. There is a request in progress"
            )
          );
        }
        conn.rollbackTransaction(
          (err) => {
            if (err) {
              debug(
                "transaction::rollback error id=%s message=%s",
                this.txid,
                err.message
              );
            }
            reject(
              err || error || new Error("Transaction rejected with non-error: undefined")
            );
          },
          this.outerTx ? this.txid : void 0
        );
      }).catch((err) => {
        if (!error && this.doNotRejectOnRollback) {
          this._resolver();
          return;
        }
        if (error) {
          try {
            err.originalError = error;
          } catch (_err) {
          }
        }
        this._rejecter(err);
      });
    }
    rollbackTo(conn, error) {
      return this.rollback(conn, error).then(
        () => void this.trxClient.emit("query", {
          __knexUid: this.trxClient.__knexUid,
          __knexTxId: this.trxClient.__knexTxId,
          autogenerated: true,
          sql: `ROLLBACK TRANSACTION`
        })
      );
    }
  }
  transaction$4 = Transaction_MSSQL;
  function nameToIsolationLevelEnum(level) {
    if (!level) return;
    level = level.toUpperCase().replace(" ", "_");
    const knownEnum = isolationEnum[level];
    if (!knownEnum) {
      throw new Error(
        `Unknown Isolation level, was expecting one of: ${JSON.stringify(
          humanReadableKeys
        )}`
      );
    }
    return knownEnum;
  }
  const isolationEnum = {
    READ_UNCOMMITTED: 1,
    READ_COMMITTED: 2,
    REPEATABLE_READ: 3,
    SERIALIZABLE: 4,
    SNAPSHOT: 5
  };
  const humanReadableKeys = Object.keys(isolationEnum).map(
    (key) => key.toLowerCase().replace("_", " ")
  );
  return transaction$4;
}
var mssqlQuerycompiler;
var hasRequiredMssqlQuerycompiler;
function requireMssqlQuerycompiler() {
  if (hasRequiredMssqlQuerycompiler) return mssqlQuerycompiler;
  hasRequiredMssqlQuerycompiler = 1;
  const QueryCompiler = requireQuerycompiler();
  const compact = requireCompact();
  const identity = requireIdentity();
  const isEmpty = requireIsEmpty();
  const Raw = requireRaw();
  const {
    columnize: columnize_
  } = requireWrappingFormatter();
  const components = [
    "comments",
    "columns",
    "join",
    "lock",
    "where",
    "union",
    "group",
    "having",
    "order",
    "limit",
    "offset"
  ];
  class QueryCompiler_MSSQL extends QueryCompiler {
    constructor(client2, builder2, formatter2) {
      super(client2, builder2, formatter2);
      const { onConflict } = this.single;
      if (onConflict) {
        throw new Error(".onConflict() is not supported for mssql.");
      }
      this._emptyInsertValue = "default values";
    }
    with() {
      const undoList = [];
      if (this.grouped.with) {
        for (const stmt of this.grouped.with) {
          if (stmt.recursive) {
            undoList.push(stmt);
            stmt.recursive = false;
          }
        }
      }
      const result = super.with();
      for (const stmt of undoList) {
        stmt.recursive = true;
      }
      return result;
    }
    select() {
      const sql = this.with();
      const statements = components.map((component) => this[component](this));
      return sql + compact(statements).join(" ");
    }
    //#region Insert
    // Compiles an "insert" query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      if (this.single.options && this.single.options.includeTriggerModifications) {
        return this.insertWithTriggers();
      } else {
        return this.standardInsert();
      }
    }
    insertWithTriggers() {
      const insertValues = this.single.insert || [];
      const { returning } = this.single;
      let sql = this.with() + `${this._buildTempTable(returning)}insert into ${this.tableName} `;
      const returningSql = returning ? this._returning("insert", returning, true) + " " : "";
      if (Array.isArray(insertValues)) {
        if (insertValues.length === 0) {
          return "";
        }
      } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
        return {
          sql: sql + returningSql + this._emptyInsertValue + this._buildReturningSelect(returning),
          returning
        };
      }
      sql += this._buildInsertData(insertValues, returningSql);
      if (returning) {
        sql += this._buildReturningSelect(returning);
      }
      return {
        sql,
        returning
      };
    }
    _buildInsertData(insertValues, returningSql) {
      let sql = "";
      const insertData = this._prepInsert(insertValues);
      if (typeof insertData === "string") {
        sql += insertData;
      } else {
        if (insertData.columns.length) {
          sql += `(${this.formatter.columnize(insertData.columns)}`;
          sql += `) ${returningSql}values (` + this._buildInsertValues(insertData) + ")";
        } else if (insertValues.length === 1 && insertValues[0]) {
          sql += returningSql + this._emptyInsertValue;
        } else {
          return "";
        }
      }
      return sql;
    }
    standardInsert() {
      const insertValues = this.single.insert || [];
      let sql = this.with() + `insert into ${this.tableName} `;
      const { returning } = this.single;
      const returningSql = returning ? this._returning("insert", returning) + " " : "";
      if (Array.isArray(insertValues)) {
        if (insertValues.length === 0) {
          return "";
        }
      } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
        return {
          sql: sql + returningSql + this._emptyInsertValue,
          returning
        };
      }
      sql += this._buildInsertData(insertValues, returningSql);
      return {
        sql,
        returning
      };
    }
    //#endregion
    //#region Update
    // Compiles an `update` query, allowing for a return value.
    update() {
      if (this.single.options && this.single.options.includeTriggerModifications) {
        return this.updateWithTriggers();
      } else {
        return this.standardUpdate();
      }
    }
    updateWithTriggers() {
      const top = this.top();
      const withSQL = this.with();
      const updates = this._prepUpdate(this.single.update);
      const join = this.join();
      const where = this.where();
      const order = this.order();
      const { returning } = this.single;
      const declaredTemp = this._buildTempTable(returning);
      return {
        sql: withSQL + declaredTemp + `update ${top ? top + " " : ""}${this.tableName} set ` + updates.join(", ") + (returning ? ` ${this._returning("update", returning, true)}` : "") + (join ? ` from ${this.tableName} ${join}` : "") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : this._buildReturningSelect(returning)),
        returning: returning || "@@rowcount"
      };
    }
    _formatGroupsItemValue(value, nulls) {
      const column = super._formatGroupsItemValue(value);
      if (nulls && !(value instanceof Raw)) {
        const collNulls = `IIF(${column} is null,`;
        if (nulls === "first") {
          return `${collNulls}0,1)`;
        } else if (nulls === "last") {
          return `${collNulls}1,0)`;
        }
      }
      return column;
    }
    standardUpdate() {
      const top = this.top();
      const withSQL = this.with();
      const updates = this._prepUpdate(this.single.update);
      const join = this.join();
      const where = this.where();
      const order = this.order();
      const { returning } = this.single;
      return {
        sql: withSQL + `update ${top ? top + " " : ""}${this.tableName} set ` + updates.join(", ") + (returning ? ` ${this._returning("update", returning)}` : "") + (join ? ` from ${this.tableName} ${join}` : "") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : ""),
        returning: returning || "@@rowcount"
      };
    }
    //#endregion
    //#region Delete
    // Compiles a `delete` query.
    del() {
      if (this.single.options && this.single.options.includeTriggerModifications) {
        return this.deleteWithTriggers();
      } else {
        return this.standardDelete();
      }
    }
    deleteWithTriggers() {
      const withSQL = this.with();
      const { tableName } = this;
      const wheres = this.where();
      const joins = this.join();
      const { returning } = this.single;
      const returningStr = returning ? ` ${this._returning("del", returning, true)}` : "";
      const deleteSelector = joins ? `${tableName}${returningStr} ` : "";
      return {
        sql: withSQL + `${this._buildTempTable(
          returning
        )}delete ${deleteSelector}from ${tableName}` + (!joins ? returningStr : "") + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : this._buildReturningSelect(returning)),
        returning: returning || "@@rowcount"
      };
    }
    standardDelete() {
      const withSQL = this.with();
      const { tableName } = this;
      const wheres = this.where();
      const joins = this.join();
      const { returning } = this.single;
      const returningStr = returning ? ` ${this._returning("del", returning)}` : "";
      const deleteSelector = joins ? `${tableName}${returningStr} ` : "";
      return {
        sql: withSQL + `delete ${deleteSelector}from ${tableName}` + (!joins ? returningStr : "") + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : ""),
        returning: returning || "@@rowcount"
      };
    }
    //#endregion
    // Compiles the columns in the query, specifying if an item was distinct.
    columns() {
      let distinctClause = "";
      if (this.onlyUnions()) return "";
      const top = this.top();
      const hints = this._hintComments();
      const columns = this.grouped.columns || [];
      let i = -1, sql = [];
      if (columns) {
        while (++i < columns.length) {
          const stmt = columns[i];
          if (stmt.distinct) distinctClause = "distinct ";
          if (stmt.distinctOn) {
            distinctClause = this.distinctOn(stmt.value);
            continue;
          }
          if (stmt.type === "aggregate") {
            sql.push(...this.aggregate(stmt));
          } else if (stmt.type === "aggregateRaw") {
            sql.push(this.aggregateRaw(stmt));
          } else if (stmt.type === "analytic") {
            sql.push(this.analytic(stmt));
          } else if (stmt.type === "json") {
            sql.push(this.json(stmt));
          } else if (stmt.value && stmt.value.length > 0) {
            sql.push(this.formatter.columnize(stmt.value));
          }
        }
      }
      if (sql.length === 0) sql = ["*"];
      const select = this.onlyJson() ? "" : "select ";
      return `${select}${hints}${distinctClause}` + (top ? top + " " : "") + sql.join(", ") + (this.tableName ? ` from ${this.tableName}` : "");
    }
    _returning(method, value, withTrigger) {
      switch (method) {
        case "update":
        case "insert":
          return value ? `output ${this.formatter.columnizeWithPrefix("inserted.", value)}${withTrigger ? " into #out" : ""}` : "";
        case "del":
          return value ? `output ${this.formatter.columnizeWithPrefix("deleted.", value)}${withTrigger ? " into #out" : ""}` : "";
        case "rowcount":
          return value ? ";select @@rowcount" : "";
      }
    }
    _buildTempTable(values) {
      if (values && values.length > 0) {
        let selections = "";
        if (Array.isArray(values)) {
          selections = values.map((value) => `[t].${this.formatter.columnize(value)}`).join(",");
        } else {
          selections = `[t].${this.formatter.columnize(values)}`;
        }
        let sql = `select top(0) ${selections} into #out `;
        sql += `from ${this.tableName} as t `;
        sql += `left join ${this.tableName} on 0=1;`;
        return sql;
      }
      return "";
    }
    _buildReturningSelect(values) {
      if (values && values.length > 0) {
        let selections = "";
        if (Array.isArray(values)) {
          selections = values.map((value) => `${this.formatter.columnize(value)}`).join(",");
        } else {
          selections = this.formatter.columnize(values);
        }
        let sql = `; select ${selections} from #out; `;
        sql += `drop table #out;`;
        return sql;
      }
      return "";
    }
    // Compiles a `truncate` query.
    truncate() {
      return `truncate table ${this.tableName}`;
    }
    forUpdate() {
      return "with (UPDLOCK)";
    }
    forShare() {
      return "with (HOLDLOCK)";
    }
    // Compiles a `columnInfo` query.
    columnInfo() {
      const column = this.single.columnInfo;
      let schema = this.single.schema;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      if (schema) {
        schema = this.client.customWrapIdentifier(schema, identity);
      }
      let sql = `select [COLUMN_NAME], [COLUMN_DEFAULT], [DATA_TYPE], [CHARACTER_MAXIMUM_LENGTH], [IS_NULLABLE] from INFORMATION_SCHEMA.COLUMNS where table_name = ? and table_catalog = ?`;
      const bindings2 = [table, this.client.database()];
      if (schema) {
        sql += " and table_schema = ?";
        bindings2.push(schema);
      } else {
        sql += ` and table_schema = 'dbo'`;
      }
      return {
        sql,
        bindings: bindings2,
        output(resp) {
          const out = resp.reduce((columns, val) => {
            columns[val[0].value] = {
              defaultValue: val[1].value,
              type: val[2].value,
              maxLength: val[3].value,
              nullable: val[4].value === "YES"
            };
            return columns;
          }, {});
          return column && out[column] || out;
        }
      };
    }
    top() {
      const noLimit = !this.single.limit && this.single.limit !== 0;
      const noOffset = !this.single.offset;
      if (noLimit || !noOffset) return "";
      return `top (${this._getValueOrParameterFromAttribute("limit")})`;
    }
    limit() {
      return "";
    }
    offset() {
      const noLimit = !this.single.limit && this.single.limit !== 0;
      const noOffset = !this.single.offset;
      if (noOffset) return "";
      let offset = `offset ${noOffset ? "0" : this._getValueOrParameterFromAttribute("offset")} rows`;
      if (!noLimit) {
        offset += ` fetch next ${this._getValueOrParameterFromAttribute(
          "limit"
        )} rows only`;
      }
      return offset;
    }
    whereLike(statement) {
      return `${this._columnClause(
        statement
      )} collate SQL_Latin1_General_CP1_CS_AS ${this._not(
        statement,
        "like "
      )}${this._valueClause(statement)}`;
    }
    whereILike(statement) {
      return `${this._columnClause(
        statement
      )} collate SQL_Latin1_General_CP1_CI_AS ${this._not(
        statement,
        "like "
      )}${this._valueClause(statement)}`;
    }
    jsonExtract(params) {
      return this._jsonExtract(
        params.singleValue ? "JSON_VALUE" : "JSON_QUERY",
        params
      );
    }
    jsonSet(params) {
      return this._jsonSet("JSON_MODIFY", params);
    }
    jsonInsert(params) {
      return this._jsonSet("JSON_MODIFY", params);
    }
    jsonRemove(params) {
      const jsonCol = `JSON_MODIFY(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )},${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )}, NULL)`;
      return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
    }
    whereJsonPath(statement) {
      return this._whereJsonPath("JSON_VALUE", statement);
    }
    whereJsonSupersetOf(statement) {
      throw new Error(
        "Json superset where clause not actually supported by MSSQL"
      );
    }
    whereJsonSubsetOf(statement) {
      throw new Error("Json subset where clause not actually supported by MSSQL");
    }
    _getExtracts(statement, operator) {
      const column = columnize_(
        statement.column,
        this.builder,
        this.client,
        this.bindingsHolder
      );
      return (Array.isArray(statement.values) ? statement.values : [statement.values]).map(function(value) {
        return "JSON_VALUE(" + column + "," + this.client.parameter(value, this.builder, this.bindingsHolder) + ")";
      }, this).join(operator);
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("JSON_VALUE", clause);
    }
  }
  mssqlQuerycompiler = QueryCompiler_MSSQL;
  return mssqlQuerycompiler;
}
var mssqlCompiler;
var hasRequiredMssqlCompiler;
function requireMssqlCompiler() {
  if (hasRequiredMssqlCompiler) return mssqlCompiler;
  hasRequiredMssqlCompiler = 1;
  const SchemaCompiler = requireCompiler$1();
  class SchemaCompiler_MSSQL extends SchemaCompiler {
    constructor(client2, builder2) {
      super(client2, builder2);
    }
    dropTableIfExists(tableName) {
      const name = this.formatter.wrap(prefixedTableName(this.schema, tableName));
      this.pushQuery(
        `if object_id('${name}', 'U') is not null DROP TABLE ${name}`
      );
    }
    dropViewIfExists(viewName) {
      const name = this.formatter.wrap(prefixedTableName(this.schema, viewName));
      this.pushQuery(
        `if object_id('${name}', 'V') is not null DROP VIEW ${name}`
      );
    }
    // Rename a table on the schema.
    renameTable(tableName, to) {
      this.pushQuery(
        `exec sp_rename ${this.client.parameter(
          prefixedTableName(this.schema, tableName),
          this.builder,
          this.bindingsHolder
        )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
      );
    }
    renameView(viewTable, to) {
      this.pushQuery(
        `exec sp_rename ${this.client.parameter(
          prefixedTableName(this.schema, viewTable),
          this.builder,
          this.bindingsHolder
        )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
      );
    }
    // Check whether a table exists on the query.
    hasTable(tableName) {
      const formattedTable = this.client.parameter(
        prefixedTableName(this.schema, tableName),
        this.builder,
        this.bindingsHolder
      );
      const bindings2 = [tableName];
      let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ${formattedTable}`;
      if (this.schema) {
        sql += " AND TABLE_SCHEMA = ?";
        bindings2.push(this.schema);
      }
      this.pushQuery({ sql, bindings: bindings2, output: (resp) => resp.length > 0 });
    }
    // Check whether a column exists on the schema.
    hasColumn(tableName, column) {
      const formattedColumn = this.client.parameter(
        column,
        this.builder,
        this.bindingsHolder
      );
      const formattedTable = this.client.parameter(
        this.formatter.wrap(prefixedTableName(this.schema, tableName)),
        this.builder,
        this.bindingsHolder
      );
      const sql = `select object_id from sys.columns where name = ${formattedColumn} and object_id = object_id(${formattedTable})`;
      this.pushQuery({ sql, output: (resp) => resp.length > 0 });
    }
  }
  SchemaCompiler_MSSQL.prototype.dropTablePrefix = "DROP TABLE ";
  function prefixedTableName(prefix, table) {
    return prefix ? `${prefix}.${table}` : table;
  }
  mssqlCompiler = SchemaCompiler_MSSQL;
  return mssqlCompiler;
}
var mssqlTablecompiler;
var hasRequiredMssqlTablecompiler;
function requireMssqlTablecompiler() {
  if (hasRequiredMssqlTablecompiler) return mssqlTablecompiler;
  hasRequiredMssqlTablecompiler = 1;
  const TableCompiler = requireTablecompiler();
  const helpers2 = requireHelpers$1();
  const { isObject } = requireIs();
  class TableCompiler_MSSQL extends TableCompiler {
    constructor(client2, tableBuilder) {
      super(client2, tableBuilder);
    }
    createQuery(columns, ifNot, like) {
      let createStatement = ifNot ? `if object_id('${this.tableName()}', 'U') is null ` : "";
      if (like) {
        createStatement += `SELECT * INTO ${this.tableName()} FROM ${this.tableNameLike()} WHERE 0=1`;
      } else {
        createStatement += "CREATE TABLE " + this.tableName() + (this._formatting ? " (\n    " : " (") + columns.sql.join(this._formatting ? ",\n    " : ", ") + this._addChecks() + ")";
      }
      this.pushQuery(createStatement);
      if (this.single.comment) {
        this.comment(this.single.comment);
      }
      if (like) {
        this.addColumns(columns, this.addColumnsPrefix);
      }
    }
    comment(comment) {
      if (!comment) {
        return;
      }
      if (comment.length > 7500 / 2) {
        this.client.logger.warn(
          "Your comment might be longer than the max comment length for MSSQL of 7,500 bytes."
        );
      }
      const value = this.formatter.escapingStringDelimiters(comment);
      const level0name = this.formatter.escapingStringDelimiters(
        this.schemaNameRaw || "dbo"
      );
      const level1name = this.formatter.escapingStringDelimiters(
        this.tableNameRaw
      );
      const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}'`;
      const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', NULL, NULL))`;
      this.pushQuery(
        `IF ${isAlreadyDefined}
  EXEC sys.sp_updateextendedproperty ${args}
ELSE
  EXEC sys.sp_addextendedproperty ${args}`
      );
    }
    // Compiles column add.  Multiple columns need only one ADD clause (not one ADD per column) so core addColumns doesn't work.  #1348
    addColumns(columns, prefix) {
      prefix = prefix || this.addColumnsPrefix;
      if (columns.sql.length > 0) {
        this.pushQuery({
          sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + prefix + columns.sql.join(", "),
          bindings: columns.bindings
        });
      }
    }
    alterColumns(columns, colBuilder) {
      for (let i = 0, l = colBuilder.length; i < l; i++) {
        const builder2 = colBuilder[i];
        if (builder2.modified.defaultTo) {
          const schema = this.schemaNameRaw || "dbo";
          const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${this.tableNameRaw}'
                                                  AND all_columns.name = '${builder2.getColumnName()}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${this.tableNameRaw} DROP CONSTRAINT ' + @constraint)`;
          this.pushQuery(baseQuery);
        }
      }
      columns.sql.forEach((sql) => {
        this.pushQuery({
          sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + (this.lowerCase ? this.alterColumnPrefix.toLowerCase() : this.alterColumnPrefix) + sql,
          bindings: columns.bindings
        });
      });
    }
    // Compiles column drop.  Multiple columns need only one DROP clause (not one DROP per column) so core dropColumn doesn't work.  #1348
    dropColumn() {
      const _this2 = this;
      const columns = helpers2.normalizeArr.apply(null, arguments);
      const columnsArray = Array.isArray(columns) ? columns : [columns];
      const drops = columnsArray.map((column) => _this2.formatter.wrap(column));
      const schema = this.schemaNameRaw || "dbo";
      for (const column of columns) {
        const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${this.tableNameRaw}'
                                                  AND all_columns.name = '${column}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${this.tableNameRaw} DROP CONSTRAINT ' + @constraint)`;
        this.pushQuery(baseQuery);
      }
      this.pushQuery(
        (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + this.dropColumnPrefix + drops.join(", ")
      );
    }
    changeType() {
    }
    // Renames a column on the table.
    renameColumn(from, to) {
      this.pushQuery(
        `exec sp_rename ${this.client.parameter(
          this.tableName() + "." + from,
          this.tableBuilder,
          this.bindingsHolder
        )}, ${this.client.parameter(
          to,
          this.tableBuilder,
          this.bindingsHolder
        )}, 'COLUMN'`
      );
    }
    dropFKRefs(runner2, refs) {
      const formatter2 = this.client.formatter(this.tableBuilder);
      return Promise.all(
        refs.map(function(ref2) {
          const constraintName = formatter2.wrap(ref2.CONSTRAINT_NAME);
          const tableName = formatter2.wrap(ref2.TABLE_NAME);
          return runner2.query({
            sql: `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`
          });
        })
      );
    }
    createFKRefs(runner2, refs) {
      const formatter2 = this.client.formatter(this.tableBuilder);
      return Promise.all(
        refs.map(function(ref2) {
          const tableName = formatter2.wrap(ref2.TABLE_NAME);
          const keyName = formatter2.wrap(ref2.CONSTRAINT_NAME);
          const column = formatter2.columnize(ref2.COLUMN_NAME);
          const references = formatter2.columnize(ref2.REFERENCED_COLUMN_NAME);
          const inTable = formatter2.wrap(ref2.REFERENCED_TABLE_NAME);
          const onUpdate = ` ON UPDATE ${ref2.UPDATE_RULE}`;
          const onDelete = ` ON DELETE ${ref2.DELETE_RULE}`;
          return runner2.query({
            sql: `ALTER TABLE ${tableName} ADD CONSTRAINT ${keyName} FOREIGN KEY (` + column + ") REFERENCES " + inTable + " (" + references + ")" + onUpdate + onDelete
          });
        })
      );
    }
    index(columns, indexName, options) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      let predicate;
      if (isObject(options)) {
        ({ predicate } = options);
      }
      const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
      this.pushQuery(
        `CREATE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
          columns
        )})${predicateQuery}`
      );
    }
    /**
     * Create a primary key.
     *
     * @param {undefined | string | string[]} columns
     * @param {string | {constraintName: string, deferrable?: 'not deferrable'|'deferred'|'immediate' }} constraintName
     */
    primary(columns, constraintName) {
      let deferrable;
      if (isObject(constraintName)) {
        ({ constraintName, deferrable } = constraintName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `mssql: primary key constraint [${constraintName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
        );
      }
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
      if (!this.forCreate) {
        this.pushQuery(
          `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
            columns
          )})`
        );
      } else {
        this.pushQuery(
          `CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
            columns
          )})`
        );
      }
    }
    /**
     * Create a unique index.
     *
     * @param {string | string[]} columns
     * @param {string | {indexName: undefined | string, deferrable?: 'not deferrable'|'deferred'|'immediate', useConstraint?: true|false, predicate?: QueryBuilder }} indexName
     */
    unique(columns, indexName) {
      let deferrable;
      let useConstraint = false;
      let predicate;
      if (isObject(indexName)) {
        ({ indexName, deferrable, useConstraint, predicate } = indexName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `mssql: unique index [${indexName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
        );
      }
      if (useConstraint && predicate) {
        throw new Error("mssql cannot create constraint with predicate");
      }
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      if (!Array.isArray(columns)) {
        columns = [columns];
      }
      if (useConstraint) {
        this.pushQuery(
          `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${indexName} UNIQUE (${this.formatter.columnize(
            columns
          )})`
        );
      } else {
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : " WHERE " + columns.map((column) => this.formatter.columnize(column) + " IS NOT NULL").join(" AND ");
        this.pushQuery(
          `CREATE UNIQUE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
            columns
          )})${predicateQuery}`
        );
      }
    }
    // Compile a drop index command.
    dropIndex(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
    }
    // Compile a drop foreign key command.
    dropForeign(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
      this.pushQuery(
        `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${indexName}`
      );
    }
    // Compile a drop primary key command.
    dropPrimary(constraintName) {
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
      this.pushQuery(
        `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${constraintName}`
      );
    }
    // Compile a drop unique key command.
    dropUnique(column, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, column);
      this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
    }
  }
  TableCompiler_MSSQL.prototype.createAlterTableMethods = ["foreign", "primary"];
  TableCompiler_MSSQL.prototype.lowerCase = false;
  TableCompiler_MSSQL.prototype.addColumnsPrefix = "ADD ";
  TableCompiler_MSSQL.prototype.dropColumnPrefix = "DROP COLUMN ";
  TableCompiler_MSSQL.prototype.alterColumnPrefix = "ALTER COLUMN ";
  mssqlTablecompiler = TableCompiler_MSSQL;
  return mssqlTablecompiler;
}
var mssqlViewcompiler;
var hasRequiredMssqlViewcompiler;
function requireMssqlViewcompiler() {
  if (hasRequiredMssqlViewcompiler) return mssqlViewcompiler;
  hasRequiredMssqlViewcompiler = 1;
  const ViewCompiler = requireViewcompiler();
  const {
    columnize: columnize_
  } = requireWrappingFormatter();
  class ViewCompiler_MSSQL extends ViewCompiler {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
    createQuery(columns, selectQuery, materialized, replace) {
      const createStatement = "CREATE " + (replace ? "OR ALTER " : "") + "VIEW ";
      let sql = createStatement + this.viewName();
      const columnList = columns ? " (" + columnize_(
        columns,
        this.viewBuilder,
        this.client,
        this.bindingsHolder
      ) + ")" : "";
      sql += columnList;
      sql += " AS ";
      sql += selectQuery.toString();
      this.pushQuery({
        sql
      });
    }
    renameColumn(from, to) {
      this.pushQuery(
        `exec sp_rename ${this.client.parameter(
          this.viewName() + "." + from,
          this.viewBuilder,
          this.bindingsHolder
        )}, ${this.client.parameter(
          to,
          this.viewBuilder,
          this.bindingsHolder
        )}, 'COLUMN'`
      );
    }
    createOrReplace() {
      this.createQuery(this.columns, this.selectQuery, false, true);
    }
  }
  mssqlViewcompiler = ViewCompiler_MSSQL;
  return mssqlViewcompiler;
}
var mssqlColumncompiler;
var hasRequiredMssqlColumncompiler;
function requireMssqlColumncompiler() {
  if (hasRequiredMssqlColumncompiler) return mssqlColumncompiler;
  hasRequiredMssqlColumncompiler = 1;
  const ColumnCompiler = requireColumncompiler();
  const { toNumber } = requireHelpers$1();
  const { formatDefault } = requireFormatterUtils();
  const { operator: operator_ } = requireWrappingFormatter();
  class ColumnCompiler_MSSQL extends ColumnCompiler {
    constructor(client2, tableCompiler, columnBuilder) {
      super(client2, tableCompiler, columnBuilder);
      this.modifiers = ["nullable", "defaultTo", "first", "after", "comment"];
      this._addCheckModifiers();
    }
    // Types
    // ------
    double(precision, scale) {
      return "float";
    }
    floating(precision, scale) {
      return `float`;
    }
    integer() {
      return "int";
    }
    tinyint() {
      return "tinyint";
    }
    varchar(length) {
      return `nvarchar(${toNumber(length, 255)})`;
    }
    timestamp({ useTz = false } = {}) {
      return useTz ? "datetimeoffset" : "datetime2";
    }
    bit(length) {
      if (length > 1) {
        this.client.logger.warn("Bit field is exactly 1 bit length for MSSQL");
      }
      return "bit";
    }
    binary(length) {
      return length ? `varbinary(${toNumber(length)})` : "varbinary(max)";
    }
    // Modifiers
    // ------
    first() {
      this.client.logger.warn("Column first modifier not available for MSSQL");
      return "";
    }
    after(column) {
      this.client.logger.warn("Column after modifier not available for MSSQL");
      return "";
    }
    defaultTo(value, { constraintName } = {}) {
      const formattedValue = formatDefault(value, this.type, this.client);
      constraintName = typeof constraintName !== "undefined" ? constraintName : `${this.tableCompiler.tableNameRaw}_${this.getColumnName()}_default`.toLowerCase();
      if (this.columnBuilder._method === "alter") {
        this.pushAdditional(function() {
          this.pushQuery(
            `ALTER TABLE ${this.tableCompiler.tableName()} ADD CONSTRAINT ${this.formatter.wrap(
              constraintName
            )} DEFAULT ${formattedValue} FOR ${this.formatter.wrap(
              this.getColumnName()
            )}`
          );
        });
        return "";
      }
      if (!constraintName) {
        return `DEFAULT ${formattedValue}`;
      }
      return `CONSTRAINT ${this.formatter.wrap(
        constraintName
      )} DEFAULT ${formattedValue}`;
    }
    comment(comment) {
      if (!comment) {
        return;
      }
      if (comment && comment.length > 7500 / 2) {
        this.client.logger.warn(
          "Your comment might be longer than the max comment length for MSSQL of 7,500 bytes."
        );
      }
      const value = this.formatter.escapingStringDelimiters(comment);
      const level0name = this.tableCompiler.schemaNameRaw || "dbo";
      const level1name = this.formatter.escapingStringDelimiters(
        this.tableCompiler.tableNameRaw
      );
      const level2name = this.formatter.escapingStringDelimiters(
        this.args[0] || this.defaults("columnName")
      );
      const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'`;
      this.pushAdditional(function() {
        const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'))`;
        this.pushQuery(
          `IF ${isAlreadyDefined}
  EXEC sys.sp_updateextendedproperty ${args}
ELSE
  EXEC sys.sp_addextendedproperty ${args}`
        );
      });
      return "";
    }
    checkLength(operator, length, constraintName) {
      return this._check(
        `LEN(${this.formatter.wrap(this.getColumnName())}) ${operator_(
          operator,
          this.columnBuilder,
          this.bindingsHolder
        )} ${toNumber(length)}`,
        constraintName
      );
    }
    checkRegex(regex, constraintName) {
      return this._check(
        `${this.formatter.wrap(
          this.getColumnName()
        )} LIKE ${this.client._escapeBinding("%" + regex + "%")}`,
        constraintName
      );
    }
    increments(options = { primaryKey: true }) {
      return "int identity(1,1) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
    bigincrements(options = { primaryKey: true }) {
      return "bigint identity(1,1) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
  }
  ColumnCompiler_MSSQL.prototype.bigint = "bigint";
  ColumnCompiler_MSSQL.prototype.mediumint = "int";
  ColumnCompiler_MSSQL.prototype.smallint = "smallint";
  ColumnCompiler_MSSQL.prototype.text = "nvarchar(max)";
  ColumnCompiler_MSSQL.prototype.mediumtext = "nvarchar(max)";
  ColumnCompiler_MSSQL.prototype.longtext = "nvarchar(max)";
  ColumnCompiler_MSSQL.prototype.json = ColumnCompiler_MSSQL.prototype.jsonb = "nvarchar(max)";
  ColumnCompiler_MSSQL.prototype.enu = "nvarchar(100)";
  ColumnCompiler_MSSQL.prototype.uuid = ({ useBinaryUuid = false } = {}) => useBinaryUuid ? "binary(16)" : "uniqueidentifier";
  ColumnCompiler_MSSQL.prototype.datetime = "datetime2";
  ColumnCompiler_MSSQL.prototype.bool = "bit";
  mssqlColumncompiler = ColumnCompiler_MSSQL;
  return mssqlColumncompiler;
}
var mssql;
var hasRequiredMssql;
function requireMssql() {
  if (hasRequiredMssql) return mssql;
  hasRequiredMssql = 1;
  const map = requireMap();
  const isNil = requireIsNil();
  const Client = requireClient();
  const MSSQL_Formatter = requireMssqlFormatter();
  const Transaction = requireTransaction$4();
  const QueryCompiler = requireMssqlQuerycompiler();
  const SchemaCompiler = requireMssqlCompiler();
  const TableCompiler = requireMssqlTablecompiler();
  const ViewCompiler = requireMssqlViewcompiler();
  const ColumnCompiler = requireMssqlColumncompiler();
  const QueryBuilder = requireQuerybuilder();
  const { setHiddenProperty } = requireSecurity();
  const debug = requireSrc()("knex:mssql");
  const SQL_INT4 = { MIN: -2147483648, MAX: 2147483647 };
  const SQL_BIGINT_SAFE = { MIN: -9007199254740991, MAX: 9007199254740991 };
  class Client_MSSQL extends Client {
    constructor(config = {}) {
      super(config);
    }
    /**
     * @param {import('knex').Config} options
     */
    _generateConnection() {
      const settings = this.connectionSettings;
      settings.options = settings.options || {};
      const cfg = {
        authentication: {
          type: settings.type || "default",
          options: {
            userName: settings.userName || settings.user,
            password: settings.password,
            domain: settings.domain,
            token: settings.token,
            clientId: settings.clientId,
            clientSecret: settings.clientSecret,
            tenantId: settings.tenantId,
            msiEndpoint: settings.msiEndpoint
          }
        },
        server: settings.server || settings.host,
        options: {
          database: settings.database,
          encrypt: settings.encrypt || false,
          port: settings.port || 1433,
          connectTimeout: settings.connectionTimeout || settings.timeout || 15e3,
          requestTimeout: !isNil(settings.requestTimeout) ? settings.requestTimeout : 15e3,
          rowCollectionOnDone: false,
          rowCollectionOnRequestCompletion: false,
          useColumnNames: false,
          tdsVersion: settings.options.tdsVersion || "7_4",
          appName: settings.options.appName || "knex",
          trustServerCertificate: false,
          ...settings.options
        }
      };
      if (cfg.authentication.options.password) {
        setHiddenProperty(cfg.authentication.options);
      }
      if (cfg.options.instanceName) delete cfg.options.port;
      if (isNaN(cfg.options.requestTimeout)) cfg.options.requestTimeout = 15e3;
      if (cfg.options.requestTimeout === Infinity) cfg.options.requestTimeout = 0;
      if (cfg.options.requestTimeout < 0) cfg.options.requestTimeout = 0;
      if (settings.debug) {
        cfg.options.debug = {
          packet: true,
          token: true,
          data: true,
          payload: true
        };
      }
      return cfg;
    }
    _driver() {
      const tds = require$$13;
      return tds;
    }
    formatter() {
      return new MSSQL_Formatter(this, ...arguments);
    }
    transaction() {
      return new Transaction(this, ...arguments);
    }
    queryCompiler() {
      return new QueryCompiler(this, ...arguments);
    }
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    queryBuilder() {
      const b = new QueryBuilder(this);
      return b;
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    wrapIdentifierImpl(value) {
      if (value === "*") {
        return "*";
      }
      return `[${value.replace(/[[\]]+/g, "")}]`;
    }
    // Get a raw connection, called by the `pool` whenever a new
    // connection needs to be added to the pool.
    acquireRawConnection() {
      return new Promise((resolver, rejecter) => {
        debug("connection::connection new connection requested");
        const Driver = this._driver();
        const settings = Object.assign({}, this._generateConnection());
        const connection = new Driver.Connection(settings);
        connection.connect((err) => {
          if (err) {
            debug("connection::connect error: %s", err.message);
            return rejecter(err);
          }
          debug("connection::connect connected to server");
          connection.connected = true;
          connection.on("error", (e) => {
            debug("connection::error message=%s", e.message);
            connection.__knex__disposed = e;
            connection.connected = false;
          });
          connection.once("end", () => {
            connection.connected = false;
            connection.__knex__disposed = "Connection to server was terminated.";
            debug("connection::end connection ended.");
          });
          return resolver(connection);
        });
      });
    }
    validateConnection(connection) {
      return connection && connection.connected;
    }
    // Used to explicitly close a connection, called internally by the pool
    // when a connection times out or the pool is shutdown.
    destroyRawConnection(connection) {
      debug("connection::destroy");
      return new Promise((resolve) => {
        connection.once("end", () => {
          resolve();
        });
        connection.close();
      });
    }
    // Position the bindings for the query.
    positionBindings(sql) {
      let questionCount = -1;
      return sql.replace(/\\?\?/g, (match) => {
        if (match === "\\?") {
          return "?";
        }
        questionCount += 1;
        return `@p${questionCount}`;
      });
    }
    _chomp(connection) {
      if (connection.state.name === "LoggedIn") {
        const nextRequest = this.requestQueue.pop();
        if (nextRequest) {
          debug(
            "connection::query executing query, %d more in queue",
            this.requestQueue.length
          );
          connection.execSql(nextRequest);
        }
      }
    }
    _enqueueRequest(request, connection) {
      this.requestQueue.push(request);
      this._chomp(connection);
    }
    _makeRequest(query, callback) {
      const Driver = this._driver();
      const sql = typeof query === "string" ? query : query.sql;
      let rowCount = 0;
      if (!sql) throw new Error("The query is empty");
      debug("request::request sql=%s", sql);
      const request = new Driver.Request(sql, (err, remoteRowCount) => {
        if (err) {
          debug("request::error message=%s", err.message);
          return callback(err);
        }
        rowCount = remoteRowCount;
        debug("request::callback rowCount=%d", rowCount);
      });
      request.on("prepared", () => {
        debug("request %s::request prepared", this.id);
      });
      request.on("done", (rowCount2, more) => {
        debug("request::done rowCount=%d more=%s", rowCount2, more);
      });
      request.on("doneProc", (rowCount2, more) => {
        debug(
          "request::doneProc id=%s rowCount=%d more=%s",
          request.id,
          rowCount2,
          more
        );
      });
      request.on("doneInProc", (rowCount2, more) => {
        debug(
          "request::doneInProc id=%s rowCount=%d more=%s",
          request.id,
          rowCount2,
          more
        );
      });
      request.once("requestCompleted", () => {
        debug("request::completed id=%s", request.id);
        return callback(null, rowCount);
      });
      request.on("error", (err) => {
        debug("request::error id=%s message=%s", request.id, err.message);
        return callback(err);
      });
      return request;
    }
    // Grab a connection, run the query via the MSSQL streaming interface,
    // and pass that through to the stream we've sent back to the client.
    _stream(connection, query, stream) {
      return new Promise((resolve, reject) => {
        const request = this._makeRequest(query, (err) => {
          if (err) {
            stream.emit("error", err);
            return reject(err);
          }
          resolve();
        });
        request.on("row", (row) => {
          stream.write(
            row.reduce(
              (prev, curr) => ({
                ...prev,
                [curr.metadata.colName]: curr.value
              }),
              {}
            )
          );
        });
        request.on("error", (err) => {
          stream.emit("error", err);
          reject(err);
        });
        request.once("requestCompleted", () => {
          stream.end();
          resolve();
        });
        this._assignBindings(request, query.bindings);
        this._enqueueRequest(request, connection);
      });
    }
    _assignBindings(request, bindings2) {
      if (Array.isArray(bindings2)) {
        for (let i = 0; i < bindings2.length; i++) {
          const binding = bindings2[i];
          this._setReqInput(request, i, binding);
        }
      }
    }
    _scaleForBinding(binding) {
      if (binding % 1 === 0) {
        throw new Error(`The binding value ${binding} must be a decimal number.`);
      }
      return { scale: 10 };
    }
    _typeForBinding(binding) {
      const Driver = this._driver();
      if (this.connectionSettings.options && this.connectionSettings.options.mapBinding) {
        const result = this.connectionSettings.options.mapBinding(binding);
        if (result) {
          return [result.value, result.type];
        }
      }
      switch (typeof binding) {
        case "string":
          return [binding, Driver.TYPES.NVarChar];
        case "boolean":
          return [binding, Driver.TYPES.Bit];
        case "number": {
          if (binding % 1 !== 0) {
            return [binding, Driver.TYPES.Float];
          }
          if (binding < SQL_INT4.MIN || binding > SQL_INT4.MAX) {
            if (binding < SQL_BIGINT_SAFE.MIN || binding > SQL_BIGINT_SAFE.MAX) {
              throw new Error(
                `Bigint must be safe integer or must be passed as string, saw ${binding}`
              );
            }
            return [binding, Driver.TYPES.BigInt];
          }
          return [binding, Driver.TYPES.Int];
        }
        default: {
          if (binding instanceof Date) {
            return [binding, Driver.TYPES.DateTime];
          }
          if (binding instanceof Buffer) {
            return [binding, Driver.TYPES.VarBinary];
          }
          return [binding, Driver.TYPES.NVarChar];
        }
      }
    }
    // Runs the query on the specified connection, providing the bindings
    // and any other necessary prep work.
    _query(connection, query) {
      return new Promise((resolve, reject) => {
        const rows = [];
        const request = this._makeRequest(query, (err, count) => {
          if (err) {
            return reject(err);
          }
          query.response = rows;
          process.nextTick(() => this._chomp(connection));
          resolve(query);
        });
        request.on("row", (row) => {
          debug("request::row");
          rows.push(row);
        });
        this._assignBindings(request, query.bindings);
        this._enqueueRequest(request, connection);
      });
    }
    // sets a request input parameter. Detects bigints and decimals and sets type appropriately.
    _setReqInput(req, i, inputBinding) {
      const [binding, tediousType] = this._typeForBinding(inputBinding);
      const bindingName = "p".concat(i);
      let options;
      if (typeof binding === "number" && binding % 1 !== 0) {
        options = this._scaleForBinding(binding);
      }
      debug(
        "request::binding pos=%d type=%s value=%s",
        i,
        tediousType.name,
        binding
      );
      if (Buffer.isBuffer(binding)) {
        options = {
          length: "max"
        };
      }
      req.addParameter(bindingName, tediousType, binding, options);
    }
    // Process the response as returned from the query.
    processResponse(query, runner2) {
      if (query == null) return;
      let { response } = query;
      const { method } = query;
      if (query.output) {
        return query.output.call(runner2, response);
      }
      response = response.map(
        (row) => row.reduce((columns, r) => {
          const colName = r.metadata.colName;
          if (columns[colName]) {
            if (!Array.isArray(columns[colName])) {
              columns[colName] = [columns[colName]];
            }
            columns[colName].push(r.value);
          } else {
            columns[colName] = r.value;
          }
          return columns;
        }, {})
      );
      if (query.output) return query.output.call(runner2, response);
      switch (method) {
        case "select":
          return response;
        case "first":
          return response[0];
        case "pluck":
          return map(response, query.pluck);
        case "insert":
        case "del":
        case "update":
        case "counter":
          if (query.returning) {
            if (query.returning === "@@rowcount") {
              return response[0][""];
            }
          }
          return response;
        default:
          return response;
      }
    }
  }
  Object.assign(Client_MSSQL.prototype, {
    requestQueue: [],
    dialect: "mssql",
    driverName: "mssql"
  });
  mssql = Client_MSSQL;
  return mssql;
}
var _baseDelay;
var hasRequired_baseDelay;
function require_baseDelay() {
  if (hasRequired_baseDelay) return _baseDelay;
  hasRequired_baseDelay = 1;
  var FUNC_ERROR_TEXT = "Expected a function";
  function baseDelay(func, wait, args) {
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return setTimeout(function() {
      func.apply(void 0, args);
    }, wait);
  }
  _baseDelay = baseDelay;
  return _baseDelay;
}
var defer_1;
var hasRequiredDefer;
function requireDefer() {
  if (hasRequiredDefer) return defer_1;
  hasRequiredDefer = 1;
  var baseDelay = require_baseDelay(), baseRest = require_baseRest();
  var defer = baseRest(function(func, args) {
    return baseDelay(func, 1, args);
  });
  defer_1 = defer;
  return defer_1;
}
var transaction$3;
var hasRequiredTransaction$3;
function requireTransaction$3() {
  if (hasRequiredTransaction$3) return transaction$3;
  hasRequiredTransaction$3 = 1;
  const Transaction = requireTransaction$5();
  const Debug = requireSrc();
  const debug = Debug("knex:tx");
  class Transaction_MySQL extends Transaction {
    query(conn, sql, status, value) {
      const t = this;
      const q = this.trxClient.query(conn, sql).catch((err) => {
        if (err.errno === 1305) {
          this.trxClient.logger.warn(
            "Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)"
          );
          return;
        }
        status = 2;
        value = err;
        t._completed = true;
        debug("%s error running transaction query", t.txid);
      }).then(function(res) {
        if (status === 1) t._resolver(value);
        if (status === 2) {
          if (value === void 0) {
            if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              t._resolver();
              return;
            }
            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          t._rejecter(value);
        }
        return res;
      });
      if (status === 1 || status === 2) {
        t._completed = true;
      }
      return q;
    }
  }
  transaction$3 = Transaction_MySQL;
  return transaction$3;
}
var mysqlQuerybuilder;
var hasRequiredMysqlQuerybuilder;
function requireMysqlQuerybuilder() {
  if (hasRequiredMysqlQuerybuilder) return mysqlQuerybuilder;
  hasRequiredMysqlQuerybuilder = 1;
  const QueryBuilder = requireQuerybuilder();
  const isEmpty = requireIsEmpty();
  mysqlQuerybuilder = class QueryBuilder_MySQL extends QueryBuilder {
    upsert(values, returning, options) {
      this._method = "upsert";
      if (!isEmpty(returning)) {
        this.returning(returning, options);
      }
      this._single.upsert = values;
      return this;
    }
  };
  return mysqlQuerybuilder;
}
var mysqlQuerycompiler;
var hasRequiredMysqlQuerycompiler;
function requireMysqlQuerycompiler() {
  if (hasRequiredMysqlQuerycompiler) return mysqlQuerycompiler;
  hasRequiredMysqlQuerycompiler = 1;
  const assert = require$$0$5;
  const identity = requireIdentity();
  const isPlainObject = requireIsPlainObject();
  const isEmpty = requireIsEmpty();
  const QueryCompiler = requireQuerycompiler();
  const { wrapAsIdentifier } = requireFormatterUtils();
  const {
    columnize: columnize_,
    wrap: wrap_
  } = requireWrappingFormatter();
  const isPlainObjectOrArray = (value) => isPlainObject(value) || Array.isArray(value);
  class QueryCompiler_MySQL extends QueryCompiler {
    constructor(client2, builder2, formatter2) {
      super(client2, builder2, formatter2);
      const { returning } = this.single;
      if (returning) {
        this.client.logger.warn(
          ".returning() is not supported by mysql and will not have any effect."
        );
      }
      this._emptyInsertValue = "() values ()";
    }
    // Compiles an `delete` allowing comments
    del() {
      const sql = super.del();
      if (sql === "") return sql;
      const comments = this.comments();
      return (comments === "" ? "" : comments + " ") + sql;
    }
    // Compiles an `insert` query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      let sql = super.insert();
      if (sql === "") return sql;
      const comments = this.comments();
      sql = (comments === "" ? "" : comments + " ") + sql;
      const { ignore, merge, insert } = this.single;
      if (ignore) sql = sql.replace("insert into", "insert ignore into");
      if (merge) {
        sql += this._merge(merge.updates, insert);
        const wheres = this.where();
        if (wheres) {
          throw new Error(
            ".onConflict().merge().where() is not supported for mysql"
          );
        }
      }
      return sql;
    }
    upsert() {
      const upsertValues = this.single.upsert || [];
      const sql = this.with() + `replace into ${this.tableName} `;
      const body = this._insertBody(upsertValues);
      return body === "" ? "" : sql + body;
    }
    // Compiles merge for onConflict, allowing for different merge strategies
    _merge(updates, insert) {
      const sql = " on duplicate key update ";
      if (updates && Array.isArray(updates)) {
        return sql + updates.map(
          (column) => wrapAsIdentifier(column, this.formatter.builder, this.client)
        ).map((column) => `${column} = values(${column})`).join(", ");
      } else if (updates && typeof updates === "object") {
        const updateData = this._prepUpdate(updates);
        return sql + updateData.join(",");
      } else {
        const insertData = this._prepInsert(insert);
        if (typeof insertData === "string") {
          throw new Error(
            "If using merge with a raw insert query, then updates must be provided"
          );
        }
        return sql + insertData.columns.map((column) => wrapAsIdentifier(column, this.builder, this.client)).map((column) => `${column} = values(${column})`).join(", ");
      }
    }
    // Update method, including joins, wheres, order & limits.
    update() {
      const comments = this.comments();
      const withSQL = this.with();
      const join = this.join();
      const updates = this._prepUpdate(this.single.update);
      const where = this.where();
      const order = this.order();
      const limit = this.limit();
      return (comments === "" ? "" : comments + " ") + withSQL + `update ${this.tableName}` + (join ? ` ${join}` : "") + " set " + updates.join(", ") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (limit ? ` ${limit}` : "");
    }
    forUpdate() {
      return "for update";
    }
    forShare() {
      return "lock in share mode";
    }
    // Only supported on MySQL 8.0+
    skipLocked() {
      return "skip locked";
    }
    // Supported on MySQL 8.0+ and MariaDB 10.3.0+
    noWait() {
      return "nowait";
    }
    // Compiles a `columnInfo` query.
    columnInfo() {
      const column = this.single.columnInfo;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      return {
        sql: "select * from information_schema.columns where table_name = ? and table_schema = ?",
        bindings: [table, this.client.database()],
        output(resp) {
          const out = resp.reduce(function(columns, val) {
            columns[val.COLUMN_NAME] = {
              defaultValue: val.COLUMN_DEFAULT === "NULL" ? null : val.COLUMN_DEFAULT,
              type: val.DATA_TYPE,
              maxLength: val.CHARACTER_MAXIMUM_LENGTH,
              nullable: val.IS_NULLABLE === "YES"
            };
            return columns;
          }, {});
          return column && out[column] || out;
        }
      };
    }
    limit() {
      const noLimit = !this.single.limit && this.single.limit !== 0;
      if (noLimit && !this.single.offset) return "";
      const limit = this.single.offset && noLimit ? "18446744073709551615" : this._getValueOrParameterFromAttribute("limit");
      return `limit ${limit}`;
    }
    whereBasic(statement) {
      assert(
        !isPlainObjectOrArray(statement.value),
        "The values in where clause must not be object or array."
      );
      return super.whereBasic(statement);
    }
    whereRaw(statement) {
      assert(
        isEmpty(statement.value.bindings) || !Object.values(statement.value.bindings).some(isPlainObjectOrArray),
        "The values in where clause must not be object or array."
      );
      return super.whereRaw(statement);
    }
    whereLike(statement) {
      return `${this._columnClause(statement)} ${this._not(
        statement,
        "like "
      )}${this._valueClause(statement)} COLLATE utf8_bin`;
    }
    whereILike(statement) {
      return `${this._columnClause(statement)} ${this._not(
        statement,
        "like "
      )}${this._valueClause(statement)}`;
    }
    // Json functions
    jsonExtract(params) {
      return this._jsonExtract(["json_extract", "json_unquote"], params);
    }
    jsonSet(params) {
      return this._jsonSet("json_set", params);
    }
    jsonInsert(params) {
      return this._jsonSet("json_insert", params);
    }
    jsonRemove(params) {
      const jsonCol = `json_remove(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )},${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )})`;
      return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
    }
    whereJsonObject(statement) {
      return this._not(
        statement,
        `json_contains(${this._columnClause(statement)}, ${this._jsonValueClause(
          statement
        )})`
      );
    }
    whereJsonPath(statement) {
      return this._whereJsonPath("json_extract", statement);
    }
    whereJsonSupersetOf(statement) {
      return this._not(
        statement,
        `json_contains(${wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        )},${this._jsonValueClause(statement)})`
      );
    }
    whereJsonSubsetOf(statement) {
      return this._not(
        statement,
        `json_contains(${this._jsonValueClause(statement)},${wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        )})`
      );
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("json_extract", clause);
    }
  }
  mysqlQuerycompiler = QueryCompiler_MySQL;
  return mysqlQuerycompiler;
}
var mysqlCompiler;
var hasRequiredMysqlCompiler;
function requireMysqlCompiler() {
  if (hasRequiredMysqlCompiler) return mysqlCompiler;
  hasRequiredMysqlCompiler = 1;
  const SchemaCompiler = requireCompiler$1();
  class SchemaCompiler_MySQL extends SchemaCompiler {
    constructor(client2, builder2) {
      super(client2, builder2);
    }
    // Rename a table on the schema.
    renameTable(tableName, to) {
      this.pushQuery(
        `rename table ${this.formatter.wrap(tableName)} to ${this.formatter.wrap(
          to
        )}`
      );
    }
    renameView(from, to) {
      this.renameTable(from, to);
    }
    // Check whether a table exists on the query.
    hasTable(tableName) {
      let sql = "select * from information_schema.tables where table_name = ?";
      const bindings2 = [tableName];
      if (this.schema) {
        sql += " and table_schema = ?";
        bindings2.push(this.schema);
      } else {
        sql += " and table_schema = database()";
      }
      this.pushQuery({
        sql,
        bindings: bindings2,
        output: function output(resp) {
          return resp.length > 0;
        }
      });
    }
    // Check whether a column exists on the schema.
    hasColumn(tableName, column) {
      this.pushQuery({
        sql: `show columns from ${this.formatter.wrap(tableName)}`,
        output(resp) {
          return resp.some((row) => {
            return this.client.wrapIdentifier(row.Field.toLowerCase()) === this.client.wrapIdentifier(column.toLowerCase());
          });
        }
      });
    }
  }
  mysqlCompiler = SchemaCompiler_MySQL;
  return mysqlCompiler;
}
var mysqlTablecompiler;
var hasRequiredMysqlTablecompiler;
function requireMysqlTablecompiler() {
  if (hasRequiredMysqlTablecompiler) return mysqlTablecompiler;
  hasRequiredMysqlTablecompiler = 1;
  const TableCompiler = requireTablecompiler();
  const { isObject, isString } = requireIs();
  class TableCompiler_MySQL extends TableCompiler {
    constructor(client2, tableBuilder) {
      super(client2, tableBuilder);
    }
    createQuery(columns, ifNot, like) {
      const createStatement = ifNot ? "create table if not exists " : "create table ";
      const { client: client2 } = this;
      let conn = {};
      let columnsSql = " (" + columns.sql.join(", ");
      columnsSql += this.primaryKeys() || "";
      columnsSql += this._addChecks();
      columnsSql += ")";
      let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " like " + this.tableNameLike() : columnsSql);
      if (client2.connectionSettings) {
        conn = client2.connectionSettings;
      }
      const charset = this.single.charset || conn.charset || "";
      const collation = this.single.collate || conn.collate || "";
      const engine = this.single.engine || "";
      if (charset && !like) sql += ` default character set ${charset}`;
      if (collation) sql += ` collate ${collation}`;
      if (engine) sql += ` engine = ${engine}`;
      if (this.single.comment) {
        const comment = this.single.comment || "";
        const MAX_COMMENT_LENGTH = 1024;
        if (comment.length > MAX_COMMENT_LENGTH)
          this.client.logger.warn(
            `The max length for a table comment is ${MAX_COMMENT_LENGTH} characters`
          );
        sql += ` comment = '${comment}'`;
      }
      this.pushQuery(sql);
      if (like) {
        this.addColumns(columns, this.addColumnsPrefix);
      }
    }
    // Compiles the comment on the table.
    comment(comment) {
      this.pushQuery(`alter table ${this.tableName()} comment = '${comment}'`);
    }
    changeType() {
    }
    // Renames a column on the table.
    renameColumn(from, to) {
      const compiler2 = this;
      const table = this.tableName();
      const wrapped = this.formatter.wrap(from) + " " + this.formatter.wrap(to);
      this.pushQuery({
        sql: `show full fields from ${table} where field = ` + this.client.parameter(from, this.tableBuilder, this.bindingsHolder),
        output(resp) {
          const column = resp[0];
          const runner2 = this;
          return compiler2.getFKRefs(runner2).then(
            ([refs]) => new Promise((resolve, reject) => {
              try {
                if (!refs.length) {
                  resolve();
                }
                resolve(compiler2.dropFKRefs(runner2, refs));
              } catch (e) {
                reject(e);
              }
            }).then(function() {
              let sql = `alter table ${table} change ${wrapped} ${column.Type}`;
              if (String(column.Null).toUpperCase() !== "YES") {
                sql += ` NOT NULL`;
              } else {
                sql += ` NULL`;
              }
              if (column.Default !== void 0 && column.Default !== null) {
                sql += ` DEFAULT '${column.Default}'`;
              }
              if (column.Collation !== void 0 && column.Collation !== null) {
                sql += ` COLLATE '${column.Collation}'`;
              }
              if (column.Extra == "auto_increment") {
                sql += ` AUTO_INCREMENT`;
              }
              return runner2.query({
                sql
              });
            }).then(function() {
              if (!refs.length) {
                return;
              }
              return compiler2.createFKRefs(
                runner2,
                refs.map(function(ref2) {
                  if (ref2.REFERENCED_COLUMN_NAME === from) {
                    ref2.REFERENCED_COLUMN_NAME = to;
                  }
                  if (ref2.COLUMN_NAME === from) {
                    ref2.COLUMN_NAME = to;
                  }
                  return ref2;
                })
              );
            })
          );
        }
      });
    }
    primaryKeys() {
      const pks = (this.grouped.alterTable || []).filter(
        (k) => k.method === "primary"
      );
      if (pks.length > 0 && pks[0].args.length > 0) {
        const columns = pks[0].args[0];
        let constraintName = pks[0].args[1] || "";
        if (constraintName) {
          constraintName = " constraint " + this.formatter.wrap(constraintName);
        }
        if (this.grouped.columns) {
          const incrementsCols = this._getIncrementsColumnNames();
          if (incrementsCols.length) {
            incrementsCols.forEach((c) => {
              if (!columns.includes(c)) {
                columns.unshift(c);
              }
            });
          }
          const bigIncrementsCols = this._getBigIncrementsColumnNames();
          if (bigIncrementsCols.length) {
            bigIncrementsCols.forEach((c) => {
              if (!columns.includes(c)) {
                columns.unshift(c);
              }
            });
          }
        }
        return `,${constraintName} primary key (${this.formatter.columnize(
          columns
        )})`;
      }
    }
    getFKRefs(runner2) {
      const bindingsHolder = {
        bindings: []
      };
      const sql = "SELECT KCU.CONSTRAINT_NAME, KCU.TABLE_NAME, KCU.COLUMN_NAME,        KCU.REFERENCED_TABLE_NAME, KCU.REFERENCED_COLUMN_NAME,        RC.UPDATE_RULE, RC.DELETE_RULE FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC        USING(CONSTRAINT_NAME)WHERE KCU.REFERENCED_TABLE_NAME = " + this.client.parameter(
        this.tableNameRaw,
        this.tableBuilder,
        bindingsHolder
      ) + "   AND KCU.CONSTRAINT_SCHEMA = " + this.client.parameter(
        this.client.database(),
        this.tableBuilder,
        bindingsHolder
      ) + "   AND RC.CONSTRAINT_SCHEMA = " + this.client.parameter(
        this.client.database(),
        this.tableBuilder,
        bindingsHolder
      );
      return runner2.query({
        sql,
        bindings: bindingsHolder.bindings
      });
    }
    dropFKRefs(runner2, refs) {
      const formatter2 = this.client.formatter(this.tableBuilder);
      return Promise.all(
        refs.map(function(ref2) {
          const constraintName = formatter2.wrap(ref2.CONSTRAINT_NAME);
          const tableName = formatter2.wrap(ref2.TABLE_NAME);
          return runner2.query({
            sql: `alter table ${tableName} drop foreign key ${constraintName}`
          });
        })
      );
    }
    createFKRefs(runner2, refs) {
      const formatter2 = this.client.formatter(this.tableBuilder);
      return Promise.all(
        refs.map(function(ref2) {
          const tableName = formatter2.wrap(ref2.TABLE_NAME);
          const keyName = formatter2.wrap(ref2.CONSTRAINT_NAME);
          const column = formatter2.columnize(ref2.COLUMN_NAME);
          const references = formatter2.columnize(ref2.REFERENCED_COLUMN_NAME);
          const inTable = formatter2.wrap(ref2.REFERENCED_TABLE_NAME);
          const onUpdate = ` ON UPDATE ${ref2.UPDATE_RULE}`;
          const onDelete = ` ON DELETE ${ref2.DELETE_RULE}`;
          return runner2.query({
            sql: `alter table ${tableName} add constraint ${keyName} foreign key (` + column + ") references " + inTable + " (" + references + ")" + onUpdate + onDelete
          });
        })
      );
    }
    index(columns, indexName, options) {
      let storageEngineIndexType;
      let indexType;
      if (isString(options)) {
        indexType = options;
      } else if (isObject(options)) {
        ({ indexType, storageEngineIndexType } = options);
      }
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      storageEngineIndexType = storageEngineIndexType ? ` using ${storageEngineIndexType}` : "";
      this.pushQuery(
        `alter table ${this.tableName()} add${indexType ? ` ${indexType}` : ""} index ${indexName}(${this.formatter.columnize(
          columns
        )})${storageEngineIndexType}`
      );
    }
    primary(columns, constraintName) {
      let deferrable;
      if (isObject(constraintName)) {
        ({ constraintName, deferrable } = constraintName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `mysql: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
        );
      }
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
      const primaryCols = columns;
      let incrementsCols = [];
      let bigIncrementsCols = [];
      if (this.grouped.columns) {
        incrementsCols = this._getIncrementsColumnNames();
        if (incrementsCols) {
          incrementsCols.forEach((c) => {
            if (!primaryCols.includes(c)) {
              primaryCols.unshift(c);
            }
          });
        }
        bigIncrementsCols = this._getBigIncrementsColumnNames();
        if (bigIncrementsCols) {
          bigIncrementsCols.forEach((c) => {
            if (!primaryCols.includes(c)) {
              primaryCols.unshift(c);
            }
          });
        }
      }
      if (this.method !== "create" && this.method !== "createIfNot") {
        this.pushQuery(
          `alter table ${this.tableName()} add primary key ${constraintName}(${this.formatter.columnize(
            primaryCols
          )})`
        );
      }
      if (incrementsCols.length) {
        this.pushQuery(
          `alter table ${this.tableName()} modify column ${this.formatter.columnize(
            incrementsCols
          )} int unsigned not null auto_increment`
        );
      }
      if (bigIncrementsCols.length) {
        this.pushQuery(
          `alter table ${this.tableName()} modify column ${this.formatter.columnize(
            bigIncrementsCols
          )} bigint unsigned not null auto_increment`
        );
      }
    }
    unique(columns, indexName) {
      let storageEngineIndexType;
      let deferrable;
      if (isObject(indexName)) {
        ({ indexName, deferrable, storageEngineIndexType } = indexName);
      }
      if (deferrable && deferrable !== "not deferrable") {
        this.client.logger.warn(
          `mysql: unique index \`${indexName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
        );
      }
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      storageEngineIndexType = storageEngineIndexType ? ` using ${storageEngineIndexType}` : "";
      this.pushQuery(
        `alter table ${this.tableName()} add unique ${indexName}(${this.formatter.columnize(
          columns
        )})${storageEngineIndexType}`
      );
    }
    // Compile a drop index command.
    dropIndex(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
    }
    // Compile a drop foreign key command.
    dropForeign(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} drop foreign key ${indexName}`
      );
    }
    // Compile a drop primary key command.
    dropPrimary() {
      this.pushQuery(`alter table ${this.tableName()} drop primary key`);
    }
    // Compile a drop unique key command.
    dropUnique(column, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, column);
      this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
    }
  }
  TableCompiler_MySQL.prototype.addColumnsPrefix = "add ";
  TableCompiler_MySQL.prototype.alterColumnsPrefix = "modify ";
  TableCompiler_MySQL.prototype.dropColumnPrefix = "drop ";
  mysqlTablecompiler = TableCompiler_MySQL;
  return mysqlTablecompiler;
}
var mysqlColumncompiler;
var hasRequiredMysqlColumncompiler;
function requireMysqlColumncompiler() {
  if (hasRequiredMysqlColumncompiler) return mysqlColumncompiler;
  hasRequiredMysqlColumncompiler = 1;
  const ColumnCompiler = requireColumncompiler();
  const { isObject } = requireIs();
  const { toNumber } = requireHelpers$1();
  const commentEscapeRegex = new RegExp("(?<!\\\\)'", "g");
  class ColumnCompiler_MySQL extends ColumnCompiler {
    constructor(client2, tableCompiler, columnBuilder) {
      super(client2, tableCompiler, columnBuilder);
      this.modifiers = [
        "unsigned",
        "nullable",
        "defaultTo",
        "comment",
        "collate",
        "first",
        "after"
      ];
      this._addCheckModifiers();
    }
    // Types
    // ------
    double(precision, scale) {
      if (!precision) return "double";
      return `double(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    integer(length) {
      length = length ? `(${toNumber(length, 11)})` : "";
      return `int${length}`;
    }
    tinyint(length) {
      length = length ? `(${toNumber(length, 1)})` : "";
      return `tinyint${length}`;
    }
    text(column) {
      switch (column) {
        case "medium":
        case "mediumtext":
          return "mediumtext";
        case "long":
        case "longtext":
          return "longtext";
        default:
          return "text";
      }
    }
    mediumtext() {
      return this.text("medium");
    }
    longtext() {
      return this.text("long");
    }
    enu(allowed) {
      return `enum('${allowed.join("', '")}')`;
    }
    datetime(precision) {
      if (isObject(precision)) {
        ({ precision } = precision);
      }
      return typeof precision === "number" ? `datetime(${precision})` : "datetime";
    }
    timestamp(precision) {
      if (isObject(precision)) {
        ({ precision } = precision);
      }
      return typeof precision === "number" ? `timestamp(${precision})` : "timestamp";
    }
    time(precision) {
      if (isObject(precision)) {
        ({ precision } = precision);
      }
      return typeof precision === "number" ? `time(${precision})` : "time";
    }
    bit(length) {
      return length ? `bit(${toNumber(length)})` : "bit";
    }
    binary(length) {
      return length ? `varbinary(${toNumber(length)})` : "blob";
    }
    json() {
      return "json";
    }
    jsonb() {
      return "json";
    }
    // Modifiers
    // ------
    defaultTo(value) {
      if (value === null || value === void 0) {
        return;
      }
      if ((this.type === "json" || this.type === "jsonb") && isObject(value)) {
        return `default ('${JSON.stringify(value)}')`;
      }
      const defaultVal = super.defaultTo.apply(this, arguments);
      if (this.type !== "blob" && this.type.indexOf("text") === -1) {
        return defaultVal;
      }
      return "";
    }
    unsigned() {
      return "unsigned";
    }
    comment(comment) {
      if (comment && comment.length > 255) {
        this.client.logger.warn(
          "Your comment is longer than the max comment length for MySQL"
        );
      }
      return comment && `comment '${comment.replace(commentEscapeRegex, "\\'")}'`;
    }
    first() {
      return "first";
    }
    after(column) {
      return `after ${this.formatter.wrap(column)}`;
    }
    collate(collation) {
      return collation && `collate '${collation}'`;
    }
    checkRegex(regex, constraintName) {
      return this._check(
        `${this.formatter.wrap(
          this.getColumnName()
        )} REGEXP ${this.client._escapeBinding(regex)}`,
        constraintName
      );
    }
    increments(options = { primaryKey: true }) {
      return "int unsigned not null" + // In MySQL autoincrement are always a primary key. If you already have a primary key, we
      // initialize this column as classic int column then modify it later in table compiler
      (this.tableCompiler._canBeAddPrimaryKey(options) ? " auto_increment primary key" : "");
    }
    bigincrements(options = { primaryKey: true }) {
      return "bigint unsigned not null" + // In MySQL autoincrement are always a primary key. If you already have a primary key, we
      // initialize this column as classic int column then modify it later in table compiler
      (this.tableCompiler._canBeAddPrimaryKey(options) ? " auto_increment primary key" : "");
    }
  }
  ColumnCompiler_MySQL.prototype.bigint = "bigint";
  ColumnCompiler_MySQL.prototype.mediumint = "mediumint";
  ColumnCompiler_MySQL.prototype.smallint = "smallint";
  mysqlColumncompiler = ColumnCompiler_MySQL;
  return mysqlColumncompiler;
}
var mysqlViewcompiler;
var hasRequiredMysqlViewcompiler;
function requireMysqlViewcompiler() {
  if (hasRequiredMysqlViewcompiler) return mysqlViewcompiler;
  hasRequiredMysqlViewcompiler = 1;
  const ViewCompiler = requireViewcompiler();
  class ViewCompiler_MySQL extends ViewCompiler {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
    createOrReplace() {
      this.createQuery(this.columns, this.selectQuery, false, true);
    }
  }
  mysqlViewcompiler = ViewCompiler_MySQL;
  return mysqlViewcompiler;
}
var mysqlViewbuilder;
var hasRequiredMysqlViewbuilder;
function requireMysqlViewbuilder() {
  if (hasRequiredMysqlViewbuilder) return mysqlViewbuilder;
  hasRequiredMysqlViewbuilder = 1;
  const ViewBuilder = requireViewbuilder();
  class ViewBuilder_MySQL extends ViewBuilder {
    constructor() {
      super(...arguments);
    }
    checkOption() {
      this._single.checkOption = "default_option";
    }
    localCheckOption() {
      this._single.checkOption = "local";
    }
    cascadedCheckOption() {
      this._single.checkOption = "cascaded";
    }
  }
  mysqlViewbuilder = ViewBuilder_MySQL;
  return mysqlViewbuilder;
}
var mysql;
var hasRequiredMysql;
function requireMysql() {
  if (hasRequiredMysql) return mysql;
  hasRequiredMysql = 1;
  const defer = requireDefer();
  const map = requireMap();
  const { promisify } = require$$2$1;
  const Client = requireClient();
  const Transaction = requireTransaction$3();
  const QueryBuilder = requireMysqlQuerybuilder();
  const QueryCompiler = requireMysqlQuerycompiler();
  const SchemaCompiler = requireMysqlCompiler();
  const TableCompiler = requireMysqlTablecompiler();
  const ColumnCompiler = requireMysqlColumncompiler();
  const { makeEscape } = requireString();
  const ViewCompiler = requireMysqlViewcompiler();
  const ViewBuilder = requireMysqlViewbuilder();
  class Client_MySQL extends Client {
    _driver() {
      return require$$13$1;
    }
    queryBuilder() {
      return new QueryBuilder(this);
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    viewBuilder() {
      return new ViewBuilder(this, ...arguments);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    transaction() {
      return new Transaction(this, ...arguments);
    }
    wrapIdentifierImpl(value) {
      return value !== "*" ? `\`${value.replace(/`/g, "``")}\`` : "*";
    }
    // Get a raw connection, called by the `pool` whenever a new
    // connection needs to be added to the pool.
    acquireRawConnection() {
      return new Promise((resolver, rejecter) => {
        const connection = this.driver.createConnection(this.connectionSettings);
        connection.on("error", (err) => {
          connection.__knex__disposed = err;
        });
        connection.connect((err) => {
          if (err) {
            connection.removeAllListeners();
            return rejecter(err);
          }
          resolver(connection);
        });
      });
    }
    // Used to explicitly close a connection, called internally by the pool
    // when a connection times out or the pool is shutdown.
    async destroyRawConnection(connection) {
      try {
        const end = promisify((cb) => connection.end(cb));
        return await end();
      } catch (err) {
        connection.__knex__disposed = err;
      } finally {
        defer(() => connection.removeAllListeners());
      }
    }
    validateConnection(connection) {
      return connection.state === "connected" || connection.state === "authenticated";
    }
    // Grab a connection, run the query via the MySQL streaming interface,
    // and pass that through to the stream we've sent back to the client.
    _stream(connection, obj, stream, options) {
      if (!obj.sql) throw new Error("The query is empty");
      options = options || {};
      const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
      return new Promise((resolver, rejecter) => {
        stream.on("error", rejecter);
        stream.on("end", resolver);
        const queryStream = connection.query(queryOptions, obj.bindings).stream(options);
        queryStream.on("error", (err) => {
          rejecter(err);
          stream.emit("error", err);
        });
        queryStream.pipe(stream);
      });
    }
    // Runs the query on the specified connection, providing the bindings
    // and any other necessary prep work.
    _query(connection, obj) {
      if (!obj || typeof obj === "string") obj = { sql: obj };
      if (!obj.sql) throw new Error("The query is empty");
      return new Promise(function(resolver, rejecter) {
        if (!obj.sql) {
          resolver();
          return;
        }
        const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
        connection.query(
          queryOptions,
          obj.bindings,
          function(err, rows, fields) {
            if (err) return rejecter(err);
            obj.response = [rows, fields];
            resolver(obj);
          }
        );
      });
    }
    // Process the response as returned from the query.
    processResponse(obj, runner2) {
      if (obj == null) return;
      const { response } = obj;
      const { method } = obj;
      const rows = response[0];
      const fields = response[1];
      if (obj.output) return obj.output.call(runner2, rows, fields);
      switch (method) {
        case "select":
          return rows;
        case "first":
          return rows[0];
        case "pluck":
          return map(rows, obj.pluck);
        case "insert":
          return [rows.insertId];
        case "del":
        case "update":
        case "counter":
          return rows.affectedRows;
        default:
          return response;
      }
    }
    async cancelQuery(connectionToKill) {
      const conn = await this.acquireRawConnection();
      try {
        return await this._wrappedCancelQueryCall(conn, connectionToKill);
      } finally {
        await this.destroyRawConnection(conn);
        if (conn.__knex__disposed) {
          this.logger.warn(`Connection Error: ${conn.__knex__disposed}`);
        }
      }
    }
    _wrappedCancelQueryCall(conn, connectionToKill) {
      return this._query(conn, {
        sql: "KILL QUERY ?",
        bindings: [connectionToKill.threadId],
        options: {}
      });
    }
  }
  Object.assign(Client_MySQL.prototype, {
    dialect: "mysql",
    driverName: "mysql",
    _escapeBinding: makeEscape(),
    canCancelQuery: true
  });
  mysql = Client_MySQL;
  return mysql;
}
var transaction$2;
var hasRequiredTransaction$2;
function requireTransaction$2() {
  if (hasRequiredTransaction$2) return transaction$2;
  hasRequiredTransaction$2 = 1;
  const Transaction = requireTransaction$5();
  const debug = requireSrc()("knex:tx");
  class Transaction_MySQL2 extends Transaction {
    query(conn, sql, status, value) {
      const t = this;
      const q = this.trxClient.query(conn, sql).catch((err) => {
        if (err.code === "ER_SP_DOES_NOT_EXIST") {
          this.trxClient.logger.warn(
            "Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)"
          );
          return;
        }
        status = 2;
        value = err;
        t._completed = true;
        debug("%s error running transaction query", t.txid);
      }).then(function(res) {
        if (status === 1) t._resolver(value);
        if (status === 2) {
          if (value === void 0) {
            if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              t._resolver();
              return;
            }
            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          t._rejecter(value);
          return res;
        }
      });
      if (status === 1 || status === 2) {
        t._completed = true;
      }
      return q;
    }
  }
  transaction$2 = Transaction_MySQL2;
  return transaction$2;
}
var mysql2;
var hasRequiredMysql2;
function requireMysql2() {
  if (hasRequiredMysql2) return mysql2;
  hasRequiredMysql2 = 1;
  const Client_MySQL = requireMysql();
  const Transaction = requireTransaction$2();
  class Client_MySQL2 extends Client_MySQL {
    transaction() {
      return new Transaction(this, ...arguments);
    }
    _driver() {
      return require$$2$2;
    }
    initializeDriver() {
      try {
        this.driver = this._driver();
      } catch (e) {
        let message = `Knex: run
$ npm install ${this.driverName}`;
        const nodeMajorVersion = process.version.replace(/^v/, "").split(".")[0];
        if (nodeMajorVersion <= 12) {
          message += `@3.2.0`;
          this.logger.error(
            "Mysql2 version 3.2.0 is the latest version to support Node.js 12 or lower."
          );
        }
        message += ` --save`;
        this.logger.error(`${message}
${e.message}
${e.stack}`);
        throw new Error(`${message}
${e.message}`);
      }
    }
    validateConnection(connection) {
      return connection && !connection._fatalError && !connection._protocolError && !connection._closing && !connection.stream.destroyed;
    }
  }
  Object.assign(Client_MySQL2.prototype, {
    // The "dialect", for reference elsewhere.
    driverName: "mysql2"
  });
  mysql2 = Client_MySQL2;
  return mysql2;
}
var utils$1;
var hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  class NameHelper {
    constructor(oracleVersion) {
      this.oracleVersion = oracleVersion;
      const versionParts = oracleVersion.split(".").map((versionPart) => parseInt(versionPart));
      if (versionParts[0] > 12 || versionParts[0] === 12 && versionParts[1] >= 2) {
        this.limit = 128;
      } else {
        this.limit = 30;
      }
    }
    generateCombinedName(logger2, postfix, name, subNames) {
      const crypto = require$$0$6;
      if (!Array.isArray(subNames)) subNames = subNames ? [subNames] : [];
      const table = name.replace(/\.|-/g, "_");
      const subNamesPart = subNames.join("_");
      let result = `${table}_${subNamesPart.length ? subNamesPart + "_" : ""}${postfix}`.toLowerCase();
      if (result.length > this.limit) {
        logger2.warn(
          `Automatically generated name "${result}" exceeds ${this.limit} character limit for Oracle Database ${this.oracleVersion}. Using base64 encoded sha1 of that name instead.`
        );
        result = crypto.createHash("sha1").update(result).digest("base64").replace("=", "");
      }
      return result;
    }
  }
  function wrapSqlWithCatch(sql, errorNumberToCatch) {
    return `begin execute immediate '${sql.replace(/'/g, "''")}'; exception when others then if sqlcode != ${errorNumberToCatch} then raise; end if; end;`;
  }
  function ReturningHelper(columnName) {
    this.columnName = columnName;
  }
  ReturningHelper.prototype.toString = function() {
    return `[object ReturningHelper:${this.columnName}]`;
  };
  function isConnectionError(err) {
    return [
      "DPI-1010",
      // not connected
      "DPI-1080",
      // connection was closed by ORA-%d
      "ORA-03114",
      // not connected to ORACLE
      "ORA-03113",
      // end-of-file on communication channel
      "ORA-03135",
      // connection lost contact
      "ORA-12514",
      // listener does not currently know of service requested in connect descriptor
      "ORA-00022",
      // invalid session ID; access denied
      "ORA-00028",
      // your session has been killed
      "ORA-00031",
      // your session has been marked for kill
      "ORA-00045",
      // your session has been terminated with no replay
      "ORA-00378",
      // buffer pools cannot be created as specified
      "ORA-00602",
      // internal programming exception
      "ORA-00603",
      // ORACLE server session terminated by fatal error
      "ORA-00609",
      // could not attach to incoming connection
      "ORA-01012",
      // not logged on
      "ORA-01041",
      // internal error. hostdef extension doesn't exist
      "ORA-01043",
      // user side memory corruption
      "ORA-01089",
      // immediate shutdown or close in progress
      "ORA-01092",
      // ORACLE instance terminated. Disconnection forced
      "ORA-02396",
      // exceeded maximum idle time, please connect again
      "ORA-03122",
      // attempt to close ORACLE-side window on user side
      "ORA-12153",
      // TNS'not connected
      "ORA-12537",
      // TNS'connection closed
      "ORA-12547",
      // TNS'lost contact
      "ORA-12570",
      // TNS'packet reader failure
      "ORA-12583",
      // TNS'no reader
      "ORA-27146",
      // post/wait initialization failed
      "ORA-28511",
      // lost RPC connection
      "ORA-56600",
      // an illegal OCI function call was issued
      "NJS-024",
      "NJS-003"
    ].some(function(prefix) {
      return err.message.indexOf(prefix) === 0;
    });
  }
  utils$1 = {
    NameHelper,
    isConnectionError,
    wrapSqlWithCatch,
    ReturningHelper
  };
  return utils$1;
}
var trigger;
var hasRequiredTrigger;
function requireTrigger() {
  if (hasRequiredTrigger) return trigger;
  hasRequiredTrigger = 1;
  const { NameHelper } = requireUtils$1();
  class Trigger {
    constructor(oracleVersion) {
      this.nameHelper = new NameHelper(oracleVersion);
    }
    renameColumnTrigger(logger2, tableName, columnName, to) {
      const triggerName = this.nameHelper.generateCombinedName(
        logger2,
        "autoinc_trg",
        tableName
      );
      const sequenceName = this.nameHelper.generateCombinedName(
        logger2,
        "seq",
        tableName
      );
      return `DECLARE PK_NAME VARCHAR(200); IS_AUTOINC NUMBER := 0; BEGIN  EXECUTE IMMEDIATE ('ALTER TABLE "${tableName}" RENAME COLUMN "${columnName}" TO "${to}"');  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';  IF (IS_AUTOINC > 0) THEN    SELECT cols.column_name INTO PK_NAME    FROM all_constraints cons, all_cons_columns cols    WHERE cons.constraint_type = 'P'    AND cons.constraint_name = cols.constraint_name    AND cons.owner = cols.owner    AND cols.table_name = '${tableName}';    IF ('${to}' = PK_NAME) THEN      EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');      EXECUTE IMMEDIATE ('create or replace trigger "${triggerName}"      BEFORE INSERT on "${tableName}" for each row        declare        checking number := 1;        begin          if (:new."${to}" is null) then            while checking >= 1 loop              select "${sequenceName}".nextval into :new."${to}" from dual;              select count("${to}") into checking from "${tableName}"              where "${to}" = :new."${to}";            end loop;          end if;        end;');    end if;  end if;END;`;
    }
    createAutoIncrementTrigger(logger2, tableName, schemaName) {
      const tableQuoted = `"${tableName}"`;
      const tableUnquoted = tableName;
      const schemaQuoted = schemaName ? `"${schemaName}".` : "";
      const constraintOwner = schemaName ? `'${schemaName}'` : "cols.owner";
      const triggerName = this.nameHelper.generateCombinedName(
        logger2,
        "autoinc_trg",
        tableName
      );
      const sequenceNameUnquoted = this.nameHelper.generateCombinedName(
        logger2,
        "seq",
        tableName
      );
      const sequenceNameQuoted = `"${sequenceNameUnquoted}"`;
      return `DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE ${schemaQuoted}${sequenceNameQuoted}');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = ${constraintOwner}  AND cols.table_name = '${tableUnquoted}';  execute immediate ('create or replace trigger ${schemaQuoted}"${triggerName}"  BEFORE INSERT on ${schemaQuoted}${tableQuoted}  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select ${schemaQuoted}${sequenceNameQuoted}.nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from ${schemaQuoted}${tableQuoted}        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END;`;
    }
    renameTableAndAutoIncrementTrigger(logger2, tableName, to) {
      const triggerName = this.nameHelper.generateCombinedName(
        logger2,
        "autoinc_trg",
        tableName
      );
      const sequenceName = this.nameHelper.generateCombinedName(
        logger2,
        "seq",
        tableName
      );
      const toTriggerName = this.nameHelper.generateCombinedName(
        logger2,
        "autoinc_trg",
        to
      );
      const toSequenceName = this.nameHelper.generateCombinedName(
        logger2,
        "seq",
        to
      );
      return `DECLARE PK_NAME VARCHAR(200); IS_AUTOINC NUMBER := 0; BEGIN  EXECUTE IMMEDIATE ('RENAME "${tableName}" TO "${to}"');  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';  IF (IS_AUTOINC > 0) THEN    EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');    EXECUTE IMMEDIATE ('RENAME "${sequenceName}" TO "${toSequenceName}"');    SELECT cols.column_name INTO PK_NAME    FROM all_constraints cons, all_cons_columns cols    WHERE cons.constraint_type = 'P'    AND cons.constraint_name = cols.constraint_name    AND cons.owner = cols.owner    AND cols.table_name = '${to}';    EXECUTE IMMEDIATE ('create or replace trigger "${toTriggerName}"    BEFORE INSERT on "${to}" for each row      declare      checking number := 1;      begin        if (:new."' || PK_NAME || '" is null) then          while checking >= 1 loop            select "${toSequenceName}".nextval into :new."' || PK_NAME || '" from dual;            select count("' || PK_NAME || '") into checking from "${to}"            where "' || PK_NAME || '" = :new."' || PK_NAME || '";          end loop;        end if;      end;');  end if;END;`;
    }
  }
  trigger = Trigger;
  return trigger;
}
var oracleCompiler;
var hasRequiredOracleCompiler;
function requireOracleCompiler() {
  if (hasRequiredOracleCompiler) return oracleCompiler;
  hasRequiredOracleCompiler = 1;
  const SchemaCompiler = requireCompiler$1();
  const utils2 = requireUtils$1();
  const Trigger = requireTrigger();
  class SchemaCompiler_Oracle extends SchemaCompiler {
    constructor() {
      super(...arguments);
    }
    // Rename a table on the schema.
    renameTable(tableName, to) {
      const trigger2 = new Trigger(this.client.version);
      const renameTable = trigger2.renameTableAndAutoIncrementTrigger(
        this.client.logger,
        tableName,
        to
      );
      this.pushQuery(renameTable);
    }
    // Check whether a table exists on the query.
    hasTable(tableName) {
      this.pushQuery({
        sql: "select TABLE_NAME from USER_TABLES where TABLE_NAME = " + this.client.parameter(tableName, this.builder, this.bindingsHolder),
        output(resp) {
          return resp.length > 0;
        }
      });
    }
    // Check whether a column exists on the schema.
    hasColumn(tableName, column) {
      const sql = `select COLUMN_NAME from ALL_TAB_COLUMNS where TABLE_NAME = ${this.client.parameter(
        tableName,
        this.builder,
        this.bindingsHolder
      )} and COLUMN_NAME = ${this.client.parameter(
        column,
        this.builder,
        this.bindingsHolder
      )}`;
      this.pushQuery({ sql, output: (resp) => resp.length > 0 });
    }
    dropSequenceIfExists(sequenceName) {
      const prefix = this.schema ? `"${this.schema}".` : "";
      this.pushQuery(
        utils2.wrapSqlWithCatch(
          `drop sequence ${prefix}${this.formatter.wrap(sequenceName)}`,
          -2289
        )
      );
    }
    _dropRelatedSequenceIfExists(tableName) {
      const nameHelper = new utils2.NameHelper(this.client.version);
      const sequenceName = nameHelper.generateCombinedName(
        this.client.logger,
        "seq",
        tableName
      );
      this.dropSequenceIfExists(sequenceName);
    }
    dropTable(tableName) {
      const prefix = this.schema ? `"${this.schema}".` : "";
      this.pushQuery(`drop table ${prefix}${this.formatter.wrap(tableName)}`);
      this._dropRelatedSequenceIfExists(tableName);
    }
    dropTableIfExists(tableName) {
      this.dropObject(tableName, "table");
    }
    dropViewIfExists(viewName) {
      this.dropObject(viewName, "view");
    }
    dropObject(objectName, type) {
      const prefix = this.schema ? `"${this.schema}".` : "";
      let errorCode = -942;
      if (type === "materialized view") {
        errorCode = -12003;
      }
      this.pushQuery(
        utils2.wrapSqlWithCatch(
          `drop ${type} ${prefix}${this.formatter.wrap(objectName)}`,
          errorCode
        )
      );
      this._dropRelatedSequenceIfExists(objectName);
    }
    refreshMaterializedView(viewName) {
      return this.pushQuery({
        sql: `BEGIN DBMS_MVIEW.REFRESH('${this.schemaNameRaw ? this.schemaNameRaw + "." : ""}${viewName}'); END;`
      });
    }
    dropMaterializedView(viewName) {
      this._dropView(viewName, false, true);
    }
    dropMaterializedViewIfExists(viewName) {
      this.dropObject(viewName, "materialized view");
    }
  }
  oracleCompiler = SchemaCompiler_Oracle;
  return oracleCompiler;
}
var oracleColumnbuilder;
var hasRequiredOracleColumnbuilder;
function requireOracleColumnbuilder() {
  if (hasRequiredOracleColumnbuilder) return oracleColumnbuilder;
  hasRequiredOracleColumnbuilder = 1;
  const ColumnBuilder = requireColumnbuilder();
  const toArray = requireToArray();
  class ColumnBuilder_Oracle extends ColumnBuilder {
    constructor() {
      super(...arguments);
    }
    // checkIn added to the builder to allow the column compiler to change the
    // order via the modifiers ("check" must be after "default")
    checkIn() {
      this._modifiers.checkIn = toArray(arguments);
      return this;
    }
  }
  oracleColumnbuilder = ColumnBuilder_Oracle;
  return oracleColumnbuilder;
}
var noop_1;
var hasRequiredNoop;
function requireNoop() {
  if (hasRequiredNoop) return noop_1;
  hasRequiredNoop = 1;
  function noop2() {
  }
  noop_1 = noop2;
  return noop_1;
}
var _createSet;
var hasRequired_createSet;
function require_createSet() {
  if (hasRequired_createSet) return _createSet;
  hasRequired_createSet = 1;
  var Set2 = require_Set(), noop2 = requireNoop(), setToArray = require_setToArray();
  var INFINITY = 1 / 0;
  var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop2 : function(values) {
    return new Set2(values);
  };
  _createSet = createSet;
  return _createSet;
}
var _baseUniq;
var hasRequired_baseUniq;
function require_baseUniq() {
  if (hasRequired_baseUniq) return _baseUniq;
  hasRequired_baseUniq = 1;
  var SetCache = require_SetCache(), arrayIncludes = require_arrayIncludes(), arrayIncludesWith = require_arrayIncludesWith(), cacheHas = require_cacheHas(), createSet = require_createSet(), setToArray = require_setToArray();
  var LARGE_ARRAY_SIZE = 200;
  function baseUniq(array, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
    if (comparator) {
      isCommon = false;
      includes = arrayIncludesWith;
    } else if (length >= LARGE_ARRAY_SIZE) {
      var set = iteratee ? null : createSet(array);
      if (set) {
        return setToArray(set);
      }
      isCommon = false;
      includes = cacheHas;
      seen = new SetCache();
    } else {
      seen = iteratee ? [] : result;
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        } else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
    return result;
  }
  _baseUniq = baseUniq;
  return _baseUniq;
}
var uniq_1;
var hasRequiredUniq;
function requireUniq() {
  if (hasRequiredUniq) return uniq_1;
  hasRequiredUniq = 1;
  var baseUniq = require_baseUniq();
  function uniq(array) {
    return array && array.length ? baseUniq(array) : [];
  }
  uniq_1 = uniq;
  return uniq_1;
}
var incrementUtils;
var hasRequiredIncrementUtils;
function requireIncrementUtils() {
  if (hasRequiredIncrementUtils) return incrementUtils;
  hasRequiredIncrementUtils = 1;
  const Trigger = requireTrigger();
  function createAutoIncrementTriggerAndSequence(columnCompiler) {
    const trigger2 = new Trigger(columnCompiler.client.version);
    columnCompiler.pushAdditional(function() {
      const tableName = this.tableCompiler.tableNameRaw;
      const schemaName = this.tableCompiler.schemaNameRaw;
      const createTriggerSQL = trigger2.createAutoIncrementTrigger(
        this.client.logger,
        tableName,
        schemaName
      );
      this.pushQuery(createTriggerSQL);
    });
  }
  incrementUtils = {
    createAutoIncrementTriggerAndSequence
  };
  return incrementUtils;
}
var oracleColumncompiler;
var hasRequiredOracleColumncompiler;
function requireOracleColumncompiler() {
  if (hasRequiredOracleColumncompiler) return oracleColumncompiler;
  hasRequiredOracleColumncompiler = 1;
  const uniq = requireUniq();
  const Raw = requireRaw();
  const ColumnCompiler = requireColumncompiler();
  const {
    createAutoIncrementTriggerAndSequence
  } = requireIncrementUtils();
  const { toNumber } = requireHelpers$1();
  class ColumnCompiler_Oracle extends ColumnCompiler {
    constructor() {
      super(...arguments);
      this.modifiers = ["defaultTo", "checkIn", "nullable", "comment"];
    }
    increments(options = { primaryKey: true }) {
      createAutoIncrementTriggerAndSequence(this);
      return "integer not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
    bigincrements(options = { primaryKey: true }) {
      createAutoIncrementTriggerAndSequence(this);
      return "number(20, 0) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
    }
    floating(precision) {
      const parsedPrecision = toNumber(precision, 0);
      return `float${parsedPrecision ? `(${parsedPrecision})` : ""}`;
    }
    double(precision, scale) {
      return `number(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    decimal(precision, scale) {
      if (precision === null) return "decimal";
      return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
    }
    integer(length) {
      return length ? `number(${toNumber(length, 11)})` : "integer";
    }
    enu(allowed) {
      allowed = uniq(allowed);
      const maxLength = (allowed || []).reduce(
        (maxLength2, name) => Math.max(maxLength2, String(name).length),
        1
      );
      this.columnBuilder._modifiers.checkIn = [allowed];
      return `varchar2(${maxLength})`;
    }
    datetime(without) {
      return without ? "timestamp" : "timestamp with time zone";
    }
    timestamp(without) {
      return without ? "timestamp" : "timestamp with time zone";
    }
    bool() {
      this.columnBuilder._modifiers.checkIn = [[0, 1]];
      return "number(1, 0)";
    }
    varchar(length) {
      return `varchar2(${toNumber(length, 255)})`;
    }
    // Modifiers
    // ------
    comment(comment) {
      const columnName = this.args[0] || this.defaults("columnName");
      this.pushAdditional(function() {
        this.pushQuery(
          `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(columnName) + " is '" + (comment || "") + "'"
        );
      }, comment);
    }
    checkIn(value) {
      if (value === void 0) {
        return "";
      } else if (value instanceof Raw) {
        value = value.toQuery();
      } else if (Array.isArray(value)) {
        value = value.map((v) => `'${v}'`).join(", ");
      } else {
        value = `'${value}'`;
      }
      return `check (${this.formatter.wrap(this.args[0])} in (${value}))`;
    }
  }
  ColumnCompiler_Oracle.prototype.tinyint = "smallint";
  ColumnCompiler_Oracle.prototype.smallint = "smallint";
  ColumnCompiler_Oracle.prototype.mediumint = "integer";
  ColumnCompiler_Oracle.prototype.biginteger = "number(20, 0)";
  ColumnCompiler_Oracle.prototype.text = "clob";
  ColumnCompiler_Oracle.prototype.time = "timestamp with time zone";
  ColumnCompiler_Oracle.prototype.bit = "clob";
  ColumnCompiler_Oracle.prototype.json = "clob";
  oracleColumncompiler = ColumnCompiler_Oracle;
  return oracleColumncompiler;
}
var oracleTablecompiler;
var hasRequiredOracleTablecompiler;
function requireOracleTablecompiler() {
  if (hasRequiredOracleTablecompiler) return oracleTablecompiler;
  hasRequiredOracleTablecompiler = 1;
  const utils2 = requireUtils$1();
  const TableCompiler = requireTablecompiler();
  const helpers2 = requireHelpers$1();
  const Trigger = requireTrigger();
  const { isObject } = requireIs();
  class TableCompiler_Oracle extends TableCompiler {
    constructor() {
      super(...arguments);
    }
    addColumns(columns, prefix) {
      if (columns.sql.length > 0) {
        prefix = prefix || this.addColumnsPrefix;
        const columnSql = columns.sql;
        const alter = this.lowerCase ? "alter table " : "ALTER TABLE ";
        let sql = `${alter}${this.tableName()} ${prefix}`;
        if (columns.sql.length > 1) {
          sql += `(${columnSql.join(", ")})`;
        } else {
          sql += columnSql.join(", ");
        }
        this.pushQuery({
          sql,
          bindings: columns.bindings
        });
      }
    }
    // Compile a rename column command.
    renameColumn(from, to) {
      const tableName = this.tableName().slice(1, -1);
      const trigger2 = new Trigger(this.client.version);
      return this.pushQuery(
        trigger2.renameColumnTrigger(this.client.logger, tableName, from, to)
      );
    }
    compileAdd(builder2) {
      const table = this.formatter.wrap(builder2);
      const columns = this.prefixArray("add column", this.getColumns(builder2));
      return this.pushQuery({
        sql: `alter table ${table} ${columns.join(", ")}`
      });
    }
    // Adds the "create" query to the query sequence.
    createQuery(columns, ifNot, like) {
      const columnsSql = like && this.tableNameLike() ? " as (select * from " + this.tableNameLike() + " where 0=1)" : " (" + columns.sql.join(", ") + this._addChecks() + ")";
      const sql = `create table ${this.tableName()}${columnsSql}`;
      this.pushQuery({
        // catch "name is already used by an existing object" for workaround for "if not exists"
        sql: ifNot ? utils2.wrapSqlWithCatch(sql, -955) : sql,
        bindings: columns.bindings
      });
      if (this.single.comment) this.comment(this.single.comment);
      if (like) {
        this.addColumns(columns, this.addColumnsPrefix);
      }
    }
    // Compiles the comment on the table.
    comment(comment) {
      this.pushQuery(`comment on table ${this.tableName()} is '${comment}'`);
    }
    dropColumn() {
      const columns = helpers2.normalizeArr.apply(null, arguments);
      this.pushQuery(
        `alter table ${this.tableName()} drop (${this.formatter.columnize(
          columns
        )})`
      );
    }
    _indexCommand(type, tableName, columns) {
      const nameHelper = new utils2.NameHelper(this.client.version);
      return this.formatter.wrap(
        nameHelper.generateCombinedName(
          this.client.logger,
          type,
          tableName,
          columns
        )
      );
    }
    primary(columns, constraintName) {
      let deferrable;
      if (isObject(constraintName)) {
        ({ constraintName, deferrable } = constraintName);
      }
      deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
      const primaryCols = columns;
      let incrementsCols = [];
      if (this.grouped.columns) {
        incrementsCols = this._getIncrementsColumnNames();
        if (incrementsCols) {
          incrementsCols.forEach((c) => {
            if (!primaryCols.includes(c)) {
              primaryCols.unshift(c);
            }
          });
        }
      }
      this.pushQuery(
        `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
          primaryCols
        )})${deferrable}`
      );
    }
    dropPrimary(constraintName) {
      constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(this.tableNameRaw + "_pkey");
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${constraintName}`
      );
    }
    index(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      this.pushQuery(
        `create index ${indexName} on ${this.tableName()} (` + this.formatter.columnize(columns) + ")"
      );
    }
    dropIndex(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
      this.pushQuery(`drop index ${indexName}`);
    }
    unique(columns, indexName) {
      let deferrable;
      if (isObject(indexName)) {
        ({ indexName, deferrable } = indexName);
      }
      deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} add constraint ${indexName} unique (` + this.formatter.columnize(columns) + ")" + deferrable
      );
    }
    dropUnique(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${indexName}`
      );
    }
    dropForeign(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
      this.pushQuery(
        `alter table ${this.tableName()} drop constraint ${indexName}`
      );
    }
  }
  TableCompiler_Oracle.prototype.addColumnsPrefix = "add ";
  TableCompiler_Oracle.prototype.alterColumnsPrefix = "modify ";
  oracleTablecompiler = TableCompiler_Oracle;
  return oracleTablecompiler;
}
var oracle;
var hasRequiredOracle;
function requireOracle() {
  if (hasRequiredOracle) return oracle;
  hasRequiredOracle = 1;
  const { ReturningHelper } = requireUtils$1();
  const { isConnectionError } = requireUtils$1();
  const Client = requireClient();
  const SchemaCompiler = requireOracleCompiler();
  const ColumnBuilder = requireOracleColumnbuilder();
  const ColumnCompiler = requireOracleColumncompiler();
  const TableCompiler = requireOracleTablecompiler();
  class Client_Oracle extends Client {
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    columnBuilder() {
      return new ColumnBuilder(this, ...arguments);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    // Return the database for the Oracle client.
    database() {
      return this.connectionSettings.database;
    }
    // Position the bindings for the query.
    positionBindings(sql) {
      let questionCount = 0;
      return sql.replace(/\?/g, function() {
        questionCount += 1;
        return `:${questionCount}`;
      });
    }
    _stream(connection, obj, stream, options) {
      if (!obj.sql) throw new Error("The query is empty");
      return new Promise(function(resolver, rejecter) {
        stream.on("error", (err) => {
          if (isConnectionError(err)) {
            connection.__knex__disposed = err;
          }
          rejecter(err);
        });
        stream.on("end", resolver);
        const queryStream = connection.queryStream(
          obj.sql,
          obj.bindings,
          options
        );
        queryStream.pipe(stream);
        queryStream.on("error", function(error) {
          rejecter(error);
          stream.emit("error", error);
        });
      });
    }
    // Formatter part
    alias(first2, second) {
      return first2 + " " + second;
    }
    parameter(value, builder2, formatter2) {
      if (value instanceof ReturningHelper && this.driver) {
        value = new this.driver.OutParam(this.driver.OCCISTRING);
      } else if (typeof value === "boolean") {
        value = value ? 1 : 0;
      }
      return super.parameter(value, builder2, formatter2);
    }
  }
  Object.assign(Client_Oracle.prototype, {
    dialect: "oracle",
    driverName: "oracle"
  });
  oracle = Client_Oracle;
  return oracle;
}
var oracleQuerycompiler;
var hasRequiredOracleQuerycompiler;
function requireOracleQuerycompiler() {
  if (hasRequiredOracleQuerycompiler) return oracleQuerycompiler;
  hasRequiredOracleQuerycompiler = 1;
  const compact = requireCompact();
  const identity = requireIdentity();
  const isEmpty = requireIsEmpty();
  const isPlainObject = requireIsPlainObject();
  const reduce = requireReduce();
  const QueryCompiler = requireQuerycompiler();
  const { ReturningHelper } = requireUtils$1();
  const { isString } = requireIs();
  const components = [
    "comments",
    "columns",
    "join",
    "where",
    "union",
    "group",
    "having",
    "order",
    "lock"
  ];
  class QueryCompiler_Oracle extends QueryCompiler {
    constructor(client2, builder2, formatter2) {
      super(client2, builder2, formatter2);
      const { onConflict } = this.single;
      if (onConflict) {
        throw new Error(".onConflict() is not supported for oracledb.");
      }
      this.first = this.select;
    }
    // Compiles an "insert" query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      let insertValues = this.single.insert || [];
      let { returning } = this.single;
      if (!Array.isArray(insertValues) && isPlainObject(this.single.insert)) {
        insertValues = [this.single.insert];
      }
      if (returning && !Array.isArray(returning)) {
        returning = [returning];
      }
      if (Array.isArray(insertValues) && insertValues.length === 1 && isEmpty(insertValues[0])) {
        return this._addReturningToSqlAndConvert(
          `insert into ${this.tableName} (${this.formatter.wrap(
            this.single.returning
          )}) values (default)`,
          returning,
          this.tableName
        );
      }
      if (isEmpty(this.single.insert) && typeof this.single.insert !== "function") {
        return "";
      }
      const insertData = this._prepInsert(insertValues);
      const sql = {};
      if (isString(insertData)) {
        return this._addReturningToSqlAndConvert(
          `insert into ${this.tableName} ${insertData}`,
          returning
        );
      }
      if (insertData.values.length === 1) {
        return this._addReturningToSqlAndConvert(
          `insert into ${this.tableName} (${this.formatter.columnize(
            insertData.columns
          )}) values (${this.client.parameterize(
            insertData.values[0],
            void 0,
            this.builder,
            this.bindingsHolder
          )})`,
          returning,
          this.tableName
        );
      }
      const insertDefaultsOnly = insertData.columns.length === 0;
      sql.sql = "begin " + insertData.values.map((value) => {
        let returningHelper;
        const parameterizedValues = !insertDefaultsOnly ? this.client.parameterize(
          value,
          this.client.valueForUndefined,
          this.builder,
          this.bindingsHolder
        ) : "";
        const returningValues = Array.isArray(returning) ? returning : [returning];
        let subSql = `insert into ${this.tableName} `;
        if (returning) {
          returningHelper = new ReturningHelper(returningValues.join(":"));
          sql.outParams = (sql.outParams || []).concat(returningHelper);
        }
        if (insertDefaultsOnly) {
          subSql += `(${this.formatter.wrap(
            this.single.returning
          )}) values (default)`;
        } else {
          subSql += `(${this.formatter.columnize(
            insertData.columns
          )}) values (${parameterizedValues})`;
        }
        subSql += returning ? ` returning ROWID into ${this.client.parameter(
          returningHelper,
          this.builder,
          this.bindingsHolder
        )}` : "";
        subSql = this.formatter.client.positionBindings(subSql);
        const parameterizedValuesWithoutDefault = parameterizedValues.replace("DEFAULT, ", "").replace(", DEFAULT", "");
        return `execute immediate '${subSql.replace(/'/g, "''")}` + (parameterizedValuesWithoutDefault || returning ? "' using " : "") + parameterizedValuesWithoutDefault + (parameterizedValuesWithoutDefault && returning ? ", " : "") + (returning ? "out ?" : "") + ";";
      }).join(" ") + "end;";
      if (returning) {
        sql.returning = returning;
        sql.returningSql = `select ${this.formatter.columnize(returning)} from ` + this.tableName + " where ROWID in (" + sql.outParams.map((v, i) => `:${i + 1}`).join(", ") + ") order by case ROWID " + sql.outParams.map((v, i) => `when CHARTOROWID(:${i + 1}) then ${i}`).join(" ") + " end";
      }
      return sql;
    }
    // Update method, including joins, wheres, order & limits.
    update() {
      const updates = this._prepUpdate(this.single.update);
      const where = this.where();
      let { returning } = this.single;
      const sql = `update ${this.tableName} set ` + updates.join(", ") + (where ? ` ${where}` : "");
      if (!returning) {
        return sql;
      }
      if (!Array.isArray(returning)) {
        returning = [returning];
      }
      return this._addReturningToSqlAndConvert(sql, returning, this.tableName);
    }
    // Compiles a `truncate` query.
    truncate() {
      return `truncate table ${this.tableName}`;
    }
    forUpdate() {
      return "for update";
    }
    forShare() {
      this.client.logger.warn(
        "lock for share is not supported by oracle dialect"
      );
      return "";
    }
    // Compiles a `columnInfo` query.
    columnInfo() {
      const column = this.single.columnInfo;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      const sql = `select * from xmltable( '/ROWSET/ROW'
      passing dbms_xmlgen.getXMLType('
      select char_col_decl_length, column_name, data_type, data_default, nullable
      from all_tab_columns where table_name = ''${table}'' ')
      columns
      CHAR_COL_DECL_LENGTH number, COLUMN_NAME varchar2(200), DATA_TYPE varchar2(106),
      DATA_DEFAULT clob, NULLABLE varchar2(1))`;
      return {
        sql,
        output(resp) {
          const out = reduce(
            resp,
            function(columns, val) {
              columns[val.COLUMN_NAME] = {
                type: val.DATA_TYPE,
                defaultValue: val.DATA_DEFAULT,
                maxLength: val.CHAR_COL_DECL_LENGTH,
                nullable: val.NULLABLE === "Y"
              };
              return columns;
            },
            {}
          );
          return column && out[column] || out;
        }
      };
    }
    select() {
      let query = this.with();
      const statements = components.map((component) => {
        return this[component]();
      });
      query += compact(statements).join(" ");
      return this._surroundQueryWithLimitAndOffset(query);
    }
    aggregate(stmt) {
      return this._aggregate(stmt, { aliasSeparator: " " });
    }
    // for single commands only
    _addReturningToSqlAndConvert(sql, returning, tableName) {
      const res = {
        sql
      };
      if (!returning) {
        return res;
      }
      const returningValues = Array.isArray(returning) ? returning : [returning];
      const returningHelper = new ReturningHelper(returningValues.join(":"));
      res.sql = sql + " returning ROWID into " + this.client.parameter(returningHelper, this.builder, this.bindingsHolder);
      res.returningSql = `select ${this.formatter.columnize(
        returning
      )} from ${tableName} where ROWID = :1`;
      res.outParams = [returningHelper];
      res.returning = returning;
      return res;
    }
    _surroundQueryWithLimitAndOffset(query) {
      let { limit } = this.single;
      const { offset } = this.single;
      const hasLimit = limit || limit === 0 || limit === "0";
      limit = +limit;
      if (!hasLimit && !offset) return query;
      query = query || "";
      if (hasLimit && !offset) {
        return `select * from (${query}) where rownum <= ${this._getValueOrParameterFromAttribute(
          "limit",
          limit
        )}`;
      }
      const endRow = +offset + (hasLimit ? limit : 1e13);
      return "select * from (select row_.*, ROWNUM rownum_ from (" + query + ") row_ where rownum <= " + (this.single.skipBinding["offset"] ? endRow : this.client.parameter(endRow, this.builder, this.bindingsHolder)) + ") where rownum_ > " + this._getValueOrParameterFromAttribute("offset", offset);
    }
  }
  oracleQuerycompiler = QueryCompiler_Oracle;
  return oracleQuerycompiler;
}
var utils;
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  const Utils = requireUtils$1();
  const { promisify } = require$$2$1;
  const stream = require$$2;
  function BlobHelper(columnName, value) {
    this.columnName = columnName;
    this.value = value;
    this.returning = false;
  }
  BlobHelper.prototype.toString = function() {
    return "[object BlobHelper:" + this.columnName + "]";
  };
  function readStream(stream2, type) {
    return new Promise((resolve, reject) => {
      let data = type === "string" ? "" : Buffer.alloc(0);
      stream2.on("error", function(err) {
        reject(err);
      });
      stream2.on("data", function(chunk) {
        if (type === "string") {
          data += chunk;
        } else {
          data = Buffer.concat([data, chunk]);
        }
      });
      stream2.on("end", function() {
        resolve(data);
      });
    });
  }
  const lobProcessing = function(stream2) {
    const oracledb2 = require$$3;
    let type;
    if (stream2.type) {
      if (stream2.type === oracledb2.BLOB) {
        type = "buffer";
      } else if (stream2.type === oracledb2.CLOB) {
        type = "string";
      }
    } else if (stream2.iLob) {
      if (stream2.iLob.type === oracledb2.CLOB) {
        type = "string";
      } else if (stream2.iLob.type === oracledb2.BLOB) {
        type = "buffer";
      }
    } else {
      throw new Error("Unrecognized oracledb lob stream type");
    }
    if (type === "string") {
      stream2.setEncoding("utf-8");
    }
    return readStream(stream2, type);
  };
  function monkeyPatchConnection(connection, client2) {
    if (connection.executeAsync) {
      return;
    }
    connection.commitAsync = function() {
      return new Promise((commitResolve, commitReject) => {
        this.commit(function(err) {
          if (err) {
            return commitReject(err);
          }
          commitResolve();
        });
      });
    };
    connection.rollbackAsync = function() {
      return new Promise((rollbackResolve, rollbackReject) => {
        this.rollback(function(err) {
          if (err) {
            return rollbackReject(err);
          }
          rollbackResolve();
        });
      });
    };
    const fetchAsync = promisify(function(sql, bindParams, options, cb) {
      options = options || {};
      options.outFormat = client2.driver.OUT_FORMAT_OBJECT || client2.driver.OBJECT;
      if (!options.outFormat) {
        throw new Error("not found oracledb.outFormat constants");
      }
      if (options.resultSet) {
        connection.execute(
          sql,
          bindParams || [],
          options,
          function(err, result) {
            if (err) {
              if (Utils.isConnectionError(err)) {
                connection.close().catch(function(err2) {
                });
                connection.__knex__disposed = err;
              }
              return cb(err);
            }
            const fetchResult = { rows: [], resultSet: result.resultSet };
            const numRows = 100;
            const fetchRowsFromRS = function(connection2, resultSet, numRows2) {
              resultSet.getRows(numRows2, function(err2, rows) {
                if (err2) {
                  if (Utils.isConnectionError(err2)) {
                    connection2.close().catch(function(err3) {
                    });
                    connection2.__knex__disposed = err2;
                  }
                  resultSet.close(function() {
                    return cb(err2);
                  });
                } else if (rows.length === 0) {
                  return cb(null, fetchResult);
                } else if (rows.length > 0) {
                  if (rows.length === numRows2) {
                    fetchResult.rows = fetchResult.rows.concat(rows);
                    fetchRowsFromRS(connection2, resultSet, numRows2);
                  } else {
                    fetchResult.rows = fetchResult.rows.concat(rows);
                    return cb(null, fetchResult);
                  }
                }
              });
            };
            fetchRowsFromRS(connection, result.resultSet, numRows);
          }
        );
      } else {
        connection.execute(
          sql,
          bindParams || [],
          options,
          function(err, result) {
            if (err) {
              if (Utils.isConnectionError(err)) {
                connection.close().catch(function(err2) {
                });
                connection.__knex__disposed = err;
              }
              return cb(err);
            }
            return cb(null, result);
          }
        );
      }
    });
    connection.executeAsync = function(sql, bindParams, options) {
      return fetchAsync(sql, bindParams, options).then(async (results) => {
        const closeResultSet = () => {
          return results.resultSet ? promisify(results.resultSet.close).call(results.resultSet) : Promise.resolve();
        };
        const lobs = [];
        if (results.rows) {
          if (Array.isArray(results.rows)) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows[i];
              for (const column in row) {
                if (row[column] instanceof stream.Readable) {
                  lobs.push({ index: i, key: column, stream: row[column] });
                }
              }
            }
          }
        }
        try {
          for (const lob of lobs) {
            results.rows[lob.index][lob.key] = await lobProcessing(lob.stream);
          }
        } catch (e) {
          await closeResultSet().catch(() => {
          });
          throw e;
        }
        await closeResultSet();
        return results;
      });
    };
  }
  Utils.BlobHelper = BlobHelper;
  Utils.monkeyPatchConnection = monkeyPatchConnection;
  utils = Utils;
  return utils;
}
var oracledbQuerycompiler;
var hasRequiredOracledbQuerycompiler;
function requireOracledbQuerycompiler() {
  if (hasRequiredOracledbQuerycompiler) return oracledbQuerycompiler;
  hasRequiredOracledbQuerycompiler = 1;
  const clone = requireClone();
  const each2 = requireEach();
  const isEmpty = requireIsEmpty();
  const isPlainObject = requireIsPlainObject();
  const Oracle_Compiler = requireOracleQuerycompiler();
  const ReturningHelper = requireUtils().ReturningHelper;
  const BlobHelper = requireUtils().BlobHelper;
  const { isString } = requireIs();
  const {
    columnize: columnize_
  } = requireWrappingFormatter();
  class Oracledb_Compiler extends Oracle_Compiler {
    // Compiles an "insert" query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      const self2 = this;
      const outBindPrep = this._prepOutbindings(
        this.single.insert,
        this.single.returning
      );
      const outBinding = outBindPrep.outBinding;
      const returning = outBindPrep.returning;
      const insertValues = outBindPrep.values;
      if (Array.isArray(insertValues) && insertValues.length === 1 && isEmpty(insertValues[0])) {
        const returningFragment = this.single.returning ? " (" + this.formatter.wrap(this.single.returning) + ")" : "";
        return this._addReturningToSqlAndConvert(
          "insert into " + this.tableName + returningFragment + " values (default)",
          outBinding[0],
          this.tableName,
          returning
        );
      }
      if (isEmpty(this.single.insert) && typeof this.single.insert !== "function") {
        return "";
      }
      const insertData = this._prepInsert(insertValues);
      const sql = {};
      if (isString(insertData)) {
        return this._addReturningToSqlAndConvert(
          "insert into " + this.tableName + " " + insertData,
          outBinding[0],
          this.tableName,
          returning
        );
      }
      if (insertData.values.length === 1) {
        return this._addReturningToSqlAndConvert(
          "insert into " + this.tableName + " (" + this.formatter.columnize(insertData.columns) + ") values (" + this.client.parameterize(
            insertData.values[0],
            void 0,
            this.builder,
            this.bindingsHolder
          ) + ")",
          outBinding[0],
          this.tableName,
          returning
        );
      }
      const insertDefaultsOnly = insertData.columns.length === 0;
      sql.returning = returning;
      sql.sql = "begin " + insertData.values.map(function(value, index) {
        const parameterizedValues = !insertDefaultsOnly ? self2.client.parameterize(
          value,
          self2.client.valueForUndefined,
          self2.builder,
          self2.bindingsHolder
        ) : "";
        let subSql = "insert into " + self2.tableName;
        if (insertDefaultsOnly) {
          subSql += " (" + self2.formatter.wrap(self2.single.returning) + ") values (default)";
        } else {
          subSql += " (" + self2.formatter.columnize(insertData.columns) + ") values (" + parameterizedValues + ")";
        }
        let returningClause = "";
        let intoClause = "";
        let usingClause = "";
        let outClause = "";
        each2(value, function(val) {
          if (!(val instanceof BlobHelper)) {
            usingClause += " ?,";
          }
        });
        usingClause = usingClause.slice(0, -1);
        outBinding[index].forEach(function(ret) {
          const columnName = ret.columnName || ret;
          returningClause += self2.formatter.wrap(columnName) + ",";
          intoClause += " ?,";
          outClause += " out ?,";
          if (ret instanceof BlobHelper) {
            return self2.formatter.bindings.push(ret);
          }
          self2.formatter.bindings.push(new ReturningHelper(columnName));
        });
        returningClause = returningClause.slice(0, -1);
        intoClause = intoClause.slice(0, -1);
        outClause = outClause.slice(0, -1);
        if (returningClause && intoClause) {
          subSql += " returning " + returningClause + " into" + intoClause;
        }
        subSql = self2.formatter.client.positionBindings(subSql);
        const parameterizedValuesWithoutDefaultAndBlob = parameterizedValues.replace(/DEFAULT, /g, "").replace(/, DEFAULT/g, "").replace("EMPTY_BLOB(), ", "").replace(", EMPTY_BLOB()", "");
        return "execute immediate '" + subSql.replace(/'/g, "''") + (parameterizedValuesWithoutDefaultAndBlob || value ? "' using " : "") + parameterizedValuesWithoutDefaultAndBlob + (parameterizedValuesWithoutDefaultAndBlob && outClause ? "," : "") + outClause + ";";
      }).join(" ") + "end;";
      sql.outBinding = outBinding;
      if (returning[0] === "*") {
        sql.returningSql = function() {
          return "select * from " + self2.tableName + " where ROWID in (" + this.outBinding.map(function(v, i) {
            return ":" + (i + 1);
          }).join(", ") + ") order by case ROWID " + this.outBinding.map(function(v, i) {
            return "when CHARTOROWID(:" + (i + 1) + ") then " + i;
          }).join(" ") + " end";
        };
      }
      return sql;
    }
    with() {
      const undoList = [];
      if (this.grouped.with) {
        for (const stmt of this.grouped.with) {
          if (stmt.recursive) {
            undoList.push(stmt);
            stmt.recursive = false;
          }
        }
      }
      const result = super.with();
      for (const stmt of undoList) {
        stmt.recursive = true;
      }
      return result;
    }
    _addReturningToSqlAndConvert(sql, outBinding, tableName, returning) {
      const self2 = this;
      const res = {
        sql
      };
      if (!outBinding) {
        return res;
      }
      const returningValues = Array.isArray(outBinding) ? outBinding : [outBinding];
      let returningClause = "";
      let intoClause = "";
      returningValues.forEach(function(ret) {
        const columnName = ret.columnName || ret;
        returningClause += self2.formatter.wrap(columnName) + ",";
        intoClause += "?,";
        if (ret instanceof BlobHelper) {
          return self2.formatter.bindings.push(ret);
        }
        self2.formatter.bindings.push(new ReturningHelper(columnName));
      });
      res.sql = sql;
      returningClause = returningClause.slice(0, -1);
      intoClause = intoClause.slice(0, -1);
      if (returningClause && intoClause) {
        res.sql += " returning " + returningClause + " into " + intoClause;
      }
      res.outBinding = [outBinding];
      if (returning[0] === "*") {
        res.returningSql = function() {
          return "select * from " + self2.tableName + " where ROWID = :1";
        };
      }
      res.returning = returning;
      return res;
    }
    _prepOutbindings(paramValues, paramReturning) {
      const result = {};
      let params = paramValues || [];
      let returning = paramReturning || [];
      if (!Array.isArray(params) && isPlainObject(paramValues)) {
        params = [params];
      }
      if (returning && !Array.isArray(returning)) {
        returning = [returning];
      }
      const outBinding = [];
      each2(params, function(values, index) {
        if (returning[0] === "*") {
          outBinding[index] = ["ROWID"];
        } else {
          outBinding[index] = clone(returning);
        }
        each2(values, function(value, key) {
          if (value instanceof Buffer) {
            values[key] = new BlobHelper(key, value);
            const blobIndex = outBinding[index].indexOf(key);
            if (blobIndex >= 0) {
              outBinding[index].splice(blobIndex, 1);
              values[key].returning = true;
            }
            outBinding[index].push(values[key]);
          }
          if (value === void 0) {
            delete params[index][key];
          }
        });
      });
      result.returning = returning;
      result.outBinding = outBinding;
      result.values = params;
      return result;
    }
    _groupOrder(item, type) {
      return super._groupOrderNulls(item, type);
    }
    update() {
      const self2 = this;
      const sql = {};
      const outBindPrep = this._prepOutbindings(
        this.single.update || this.single.counter,
        this.single.returning
      );
      const outBinding = outBindPrep.outBinding;
      const returning = outBindPrep.returning;
      const updates = this._prepUpdate(this.single.update);
      const where = this.where();
      let returningClause = "";
      let intoClause = "";
      if (isEmpty(updates) && typeof this.single.update !== "function") {
        return "";
      }
      outBinding.forEach(function(out) {
        out.forEach(function(ret) {
          const columnName = ret.columnName || ret;
          returningClause += self2.formatter.wrap(columnName) + ",";
          intoClause += " ?,";
          if (ret instanceof BlobHelper) {
            return self2.formatter.bindings.push(ret);
          }
          self2.formatter.bindings.push(new ReturningHelper(columnName));
        });
      });
      returningClause = returningClause.slice(0, -1);
      intoClause = intoClause.slice(0, -1);
      sql.outBinding = outBinding;
      sql.returning = returning;
      sql.sql = "update " + this.tableName + " set " + updates.join(", ") + (where ? " " + where : "");
      if (outBinding.length && !isEmpty(outBinding[0])) {
        sql.sql += " returning " + returningClause + " into" + intoClause;
      }
      if (returning[0] === "*") {
        sql.returningSql = function() {
          let sql2 = "select * from " + self2.tableName;
          const modifiedRowsCount = this.rowsAffected.length || this.rowsAffected;
          let returningSqlIn = " where ROWID in (";
          let returningSqlOrderBy = ") order by case ROWID ";
          for (let i = 0; i < modifiedRowsCount; i++) {
            if (this.returning[0] === "*") {
              returningSqlIn += ":" + (i + 1) + ", ";
              returningSqlOrderBy += "when CHARTOROWID(:" + (i + 1) + ") then " + i + " ";
            }
          }
          if (this.returning[0] === "*") {
            this.returning = this.returning.slice(0, -1);
            returningSqlIn = returningSqlIn.slice(0, -2);
            returningSqlOrderBy = returningSqlOrderBy.slice(0, -1);
          }
          return sql2 += returningSqlIn + returningSqlOrderBy + " end";
        };
      }
      return sql;
    }
    _jsonPathWrap(extraction) {
      return `'${extraction.path || extraction[1]}'`;
    }
    // Json functions
    jsonExtract(params) {
      return this._jsonExtract(
        params.singleValue ? "json_value" : "json_query",
        params
      );
    }
    jsonSet(params) {
      return `json_transform(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}, set ${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )} = ${this.client.parameter(
        params.value,
        this.builder,
        this.bindingsHolder
      )})`;
    }
    jsonInsert(params) {
      return `json_transform(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}, insert ${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )} = ${this.client.parameter(
        params.value,
        this.builder,
        this.bindingsHolder
      )})`;
    }
    jsonRemove(params) {
      const jsonCol = `json_transform(${columnize_(
        params.column,
        this.builder,
        this.client,
        this.bindingsHolder
      )}, remove ${this.client.parameter(
        params.path,
        this.builder,
        this.bindingsHolder
      )})`;
      return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
    }
    whereJsonPath(statement) {
      return this._whereJsonPath("json_value", statement);
    }
    whereJsonSupersetOf(statement) {
      throw new Error(
        "Json superset where clause not actually supported by Oracle"
      );
    }
    whereJsonSubsetOf(statement) {
      throw new Error(
        "Json subset where clause not actually supported by Oracle"
      );
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("json_value", clause);
    }
  }
  oracledbQuerycompiler = Oracledb_Compiler;
  return oracledbQuerycompiler;
}
var oracledbTablecompiler;
var hasRequiredOracledbTablecompiler;
function requireOracledbTablecompiler() {
  if (hasRequiredOracledbTablecompiler) return oracledbTablecompiler;
  hasRequiredOracledbTablecompiler = 1;
  const TableCompiler_Oracle = requireOracleTablecompiler();
  class TableCompiler_Oracledb extends TableCompiler_Oracle {
    constructor(client2, tableBuilder) {
      super(client2, tableBuilder);
    }
    _setNullableState(column, isNullable) {
      const nullability = isNullable ? "NULL" : "NOT NULL";
      const sql = `alter table ${this.tableName()} modify (${this.formatter.wrap(
        column
      )} ${nullability})`;
      return this.pushQuery({
        sql
      });
    }
  }
  oracledbTablecompiler = TableCompiler_Oracledb;
  return oracledbTablecompiler;
}
var oracledbColumncompiler;
var hasRequiredOracledbColumncompiler;
function requireOracledbColumncompiler() {
  if (hasRequiredOracledbColumncompiler) return oracledbColumncompiler;
  hasRequiredOracledbColumncompiler = 1;
  const ColumnCompiler_Oracle = requireOracleColumncompiler();
  const { isObject } = requireIs();
  class ColumnCompiler_Oracledb extends ColumnCompiler_Oracle {
    constructor() {
      super(...arguments);
      this.modifiers = ["defaultTo", "nullable", "comment", "checkJson"];
      this._addCheckModifiers();
    }
    datetime(withoutTz) {
      let useTz;
      if (isObject(withoutTz)) {
        ({ useTz } = withoutTz);
      } else {
        useTz = !withoutTz;
      }
      return useTz ? "timestamp with local time zone" : "timestamp";
    }
    timestamp(withoutTz) {
      let useTz;
      if (isObject(withoutTz)) {
        ({ useTz } = withoutTz);
      } else {
        useTz = !withoutTz;
      }
      return useTz ? "timestamp with local time zone" : "timestamp";
    }
    checkRegex(regex, constraintName) {
      return this._check(
        `REGEXP_LIKE(${this.formatter.wrap(
          this.getColumnName()
        )},${this.client._escapeBinding(regex)})`,
        constraintName
      );
    }
    json() {
      this.columnBuilder._modifiers.checkJson = [
        this.formatter.columnize(this.getColumnName())
      ];
      return "varchar2(4000)";
    }
    jsonb() {
      return this.json();
    }
    checkJson(column) {
      return `check (${column} is json)`;
    }
  }
  ColumnCompiler_Oracledb.prototype.time = "timestamp with local time zone";
  ColumnCompiler_Oracledb.prototype.uuid = ({ useBinaryUuid = false } = {}) => useBinaryUuid ? "raw(16)" : "char(36)";
  oracledbColumncompiler = ColumnCompiler_Oracledb;
  return oracledbColumncompiler;
}
var oracledbViewcompiler;
var hasRequiredOracledbViewcompiler;
function requireOracledbViewcompiler() {
  if (hasRequiredOracledbViewcompiler) return oracledbViewcompiler;
  hasRequiredOracledbViewcompiler = 1;
  const ViewCompiler = requireViewcompiler();
  class ViewCompiler_Oracledb extends ViewCompiler {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
    createOrReplace() {
      this.createQuery(this.columns, this.selectQuery, false, true);
    }
    createMaterializedView() {
      this.createQuery(this.columns, this.selectQuery, true);
    }
  }
  oracledbViewcompiler = ViewCompiler_Oracledb;
  return oracledbViewcompiler;
}
var oracledbViewbuilder;
var hasRequiredOracledbViewbuilder;
function requireOracledbViewbuilder() {
  if (hasRequiredOracledbViewbuilder) return oracledbViewbuilder;
  hasRequiredOracledbViewbuilder = 1;
  const ViewBuilder = requireViewbuilder();
  class ViewBuilder_Oracledb extends ViewBuilder {
    constructor() {
      super(...arguments);
    }
    checkOption() {
      this._single.checkOption = "default_option";
    }
  }
  oracledbViewbuilder = ViewBuilder_Oracledb;
  return oracledbViewbuilder;
}
var transaction$1;
var hasRequiredTransaction$1;
function requireTransaction$1() {
  if (hasRequiredTransaction$1) return transaction$1;
  hasRequiredTransaction$1 = 1;
  const Transaction = requireTransaction$5();
  const { timeout: timeout2, KnexTimeoutError } = requireTimeout();
  const debugTx = requireSrc()("knex:tx");
  transaction$1 = class Oracle_Transaction extends Transaction {
    // disable autocommit to allow correct behavior (default is true)
    begin(conn) {
      if (this.isolationLevel) {
        {
          this.client.logger.warn(
            "Transaction isolation is not currently supported for Oracle"
          );
        }
      }
      return Promise.resolve();
    }
    async commit(conn, value) {
      this._completed = true;
      try {
        await conn.commitAsync();
        this._resolver(value);
      } catch (err) {
        this._rejecter(err);
      }
    }
    release(conn, value) {
      return this._resolver(value);
    }
    rollback(conn, err) {
      this._completed = true;
      debugTx("%s: rolling back", this.txid);
      return timeout2(conn.rollbackAsync(), 5e3).catch((e) => {
        if (!(e instanceof KnexTimeoutError)) {
          return Promise.reject(e);
        }
        this._rejecter(e);
      }).then(() => {
        if (err === void 0) {
          if (this.doNotRejectOnRollback) {
            this._resolver();
            return;
          }
          err = new Error(`Transaction rejected with non-error: ${err}`);
        }
        this._rejecter(err);
      });
    }
    savepoint(conn) {
      return this.query(conn, `SAVEPOINT ${this.txid}`);
    }
    async acquireConnection(config, cb) {
      const configConnection = config && config.connection;
      const connection = configConnection || await this.client.acquireConnection();
      try {
        connection.__knexTxId = this.txid;
        connection.isTransaction = true;
        return await cb(connection);
      } finally {
        debugTx("%s: releasing connection", this.txid);
        connection.isTransaction = false;
        try {
          await connection.commitAsync();
        } catch (err) {
          this._rejecter(err);
        } finally {
          if (!configConnection) {
            await this.client.releaseConnection(connection);
          } else {
            debugTx("%s: not releasing external connection", this.txid);
          }
        }
      }
    }
  };
  return transaction$1;
}
var oracledb;
var hasRequiredOracledb;
function requireOracledb() {
  if (hasRequiredOracledb) return oracledb;
  hasRequiredOracledb = 1;
  const each2 = requireEach();
  const flatten = requireFlatten();
  const isEmpty = requireIsEmpty();
  const map = requireMap();
  const Formatter = requireFormatter();
  const QueryCompiler = requireOracledbQuerycompiler();
  const TableCompiler = requireOracledbTablecompiler();
  const ColumnCompiler = requireOracledbColumncompiler();
  const {
    BlobHelper,
    ReturningHelper,
    monkeyPatchConnection
  } = requireUtils();
  const ViewCompiler = requireOracledbViewcompiler();
  const ViewBuilder = requireOracledbViewbuilder();
  const Transaction = requireTransaction$1();
  const Client_Oracle = requireOracle();
  const { isString } = requireIs();
  const { outputQuery, unwrapRaw } = requireWrappingFormatter();
  const { compileCallback } = requireFormatterUtils();
  class Client_Oracledb extends Client_Oracle {
    constructor(config) {
      super(config);
      if (this.version) {
        this.version = parseVersion(this.version);
      }
      if (this.driver) {
        process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 1;
        process.env.UV_THREADPOOL_SIZE = parseInt(process.env.UV_THREADPOOL_SIZE) + this.driver.poolMax;
      }
    }
    _driver() {
      const client2 = this;
      const oracledb2 = require$$3;
      client2.fetchAsString = [];
      if (this.config.fetchAsString && Array.isArray(this.config.fetchAsString)) {
        this.config.fetchAsString.forEach(function(type) {
          if (!isString(type)) return;
          type = type.toUpperCase();
          if (oracledb2[type]) {
            if (type !== "NUMBER" && type !== "DATE" && type !== "CLOB" && type !== "BUFFER") {
              this.logger.warn(
                'Only "date", "number", "clob" and "buffer" are supported for fetchAsString'
              );
            }
            client2.fetchAsString.push(oracledb2[type]);
          }
        });
      }
      return oracledb2;
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    viewBuilder() {
      return new ViewBuilder(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    formatter(builder2) {
      return new Formatter(this, builder2);
    }
    transaction() {
      return new Transaction(this, ...arguments);
    }
    prepBindings(bindings2) {
      return map(bindings2, (value) => {
        if (value instanceof BlobHelper && this.driver) {
          return { type: this.driver.BLOB, dir: this.driver.BIND_OUT };
        } else if (value instanceof ReturningHelper && this.driver) {
          return { type: this.driver.STRING, dir: this.driver.BIND_OUT };
        } else if (typeof value === "boolean") {
          return value ? 1 : 0;
        }
        return value;
      });
    }
    // Checks whether a value is a function... if it is, we compile it
    // otherwise we check whether it's a raw
    parameter(value, builder2, formatter2) {
      if (typeof value === "function") {
        return outputQuery(
          compileCallback(value, void 0, this, formatter2),
          true,
          builder2,
          this
        );
      } else if (value instanceof BlobHelper) {
        formatter2.bindings.push(value.value);
        return "?";
      }
      return unwrapRaw(value, true, builder2, this, formatter2) || "?";
    }
    // Get a raw connection, called by the `pool` whenever a new
    // connection needs to be added to the pool.
    acquireRawConnection() {
      return new Promise((resolver, rejecter) => {
        const oracleDbConfig = this.connectionSettings.externalAuth ? { externalAuth: this.connectionSettings.externalAuth } : {
          user: this.connectionSettings.user,
          password: this.connectionSettings.password
        };
        oracleDbConfig.connectString = resolveConnectString(
          this.connectionSettings
        );
        if (this.connectionSettings.prefetchRowCount) {
          oracleDbConfig.prefetchRows = this.connectionSettings.prefetchRowCount;
        }
        if (this.connectionSettings.stmtCacheSize !== void 0) {
          oracleDbConfig.stmtCacheSize = this.connectionSettings.stmtCacheSize;
        }
        this.driver.fetchAsString = this.fetchAsString;
        this.driver.getConnection(oracleDbConfig, (err, connection) => {
          if (err) {
            return rejecter(err);
          }
          monkeyPatchConnection(connection, this);
          resolver(connection);
        });
      });
    }
    // Used to explicitly close a connection, called internally by the pool
    // when a connection times out or the pool is shutdown.
    destroyRawConnection(connection) {
      return connection.release();
    }
    // Handle oracle version resolution on acquiring connection from pool instead of connection creation.
    // Must do this here since only the client used to create a connection would be updated with version
    // information on creation. Poses a problem when knex instance is cloned since instances share the
    // connection pool while having their own client instances.
    async acquireConnection() {
      const connection = await super.acquireConnection();
      this.checkVersion(connection);
      return connection;
    }
    // In Oracle, we need to check the version to dynamically determine
    // certain limits. If user did not specify a version, get it from the connection.
    checkVersion(connection) {
      if (this.version) {
        return this.version;
      }
      const detectedVersion = parseVersion(connection.oracleServerVersionString);
      if (!detectedVersion) {
        throw new Error(
          this.version === null ? "Invalid Oracledb version number format passed to knex. Unable to successfully auto-detect as fallback. Please specify a valid oracledb version." : "Unable to detect Oracledb version number automatically. Please specify the version in knex configuration."
        );
      }
      this.version = detectedVersion;
      return detectedVersion;
    }
    // Runs the query on the specified connection, providing the bindings
    // and any other necessary prep work.
    _query(connection, obj) {
      if (!obj.sql) throw new Error("The query is empty");
      const options = Object.assign({}, obj.options, { autoCommit: false });
      if (obj.method === "select") {
        options.resultSet = true;
      }
      return connection.executeAsync(obj.sql, obj.bindings, options).then(async function(response) {
        let outBinds = flatten(response.outBinds);
        obj.response = response.rows || [];
        obj.rowsAffected = response.rows ? response.rows.rowsAffected : response.rowsAffected;
        if (obj.method === "raw" && outBinds.length > 0) {
          return {
            response: outBinds
          };
        }
        if (obj.method === "update") {
          const modifiedRowsCount = obj.rowsAffected.length || obj.rowsAffected;
          const updatedObjOutBinding = [];
          const updatedOutBinds = [];
          const updateOutBinds = (i) => function(value, index) {
            const OutBindsOffset = index * modifiedRowsCount;
            updatedOutBinds.push(outBinds[i + OutBindsOffset]);
          };
          for (let i = 0; i < modifiedRowsCount; i++) {
            updatedObjOutBinding.push(obj.outBinding[0]);
            each2(obj.outBinding[0], updateOutBinds(i));
          }
          outBinds = updatedOutBinds;
          obj.outBinding = updatedObjOutBinding;
        }
        if (!obj.returning && outBinds.length === 0) {
          if (!connection.isTransaction) {
            await connection.commitAsync();
          }
          return obj;
        }
        const rowIds = [];
        let offset = 0;
        for (let line = 0; line < obj.outBinding.length; line++) {
          const ret = obj.outBinding[line];
          offset = offset + (obj.outBinding[line - 1] ? obj.outBinding[line - 1].length : 0);
          for (let index = 0; index < ret.length; index++) {
            const out = ret[index];
            await new Promise(function(bindResolver, bindRejecter) {
              if (out instanceof BlobHelper) {
                const blob = outBinds[index + offset];
                if (out.returning) {
                  obj.response[line] = obj.response[line] || {};
                  obj.response[line][out.columnName] = out.value;
                }
                blob.on("error", function(err) {
                  bindRejecter(err);
                });
                blob.on("finish", function() {
                  bindResolver();
                });
                blob.write(out.value);
                blob.end();
              } else if (obj.outBinding[line][index] === "ROWID") {
                rowIds.push(outBinds[index + offset]);
                bindResolver();
              } else {
                obj.response[line] = obj.response[line] || {};
                obj.response[line][out] = outBinds[index + offset];
                bindResolver();
              }
            });
          }
        }
        if (obj.returningSql) {
          const response2 = await connection.executeAsync(
            obj.returningSql(),
            rowIds,
            { resultSet: true }
          );
          obj.response = response2.rows;
        }
        if (connection.isTransaction) {
          return obj;
        }
        await connection.commitAsync();
        return obj;
      });
    }
    // Process the response as returned from the query.
    processResponse(obj, runner2) {
      const { response } = obj;
      if (obj.output) {
        return obj.output.call(runner2, response);
      }
      switch (obj.method) {
        case "select":
          return response;
        case "first":
          return response[0];
        case "pluck":
          return map(response, obj.pluck);
        case "insert":
        case "del":
        case "update":
        case "counter":
          if (obj.returning && !isEmpty(obj.returning) || obj.returningSql) {
            return response;
          } else if (obj.rowsAffected !== void 0) {
            return obj.rowsAffected;
          } else {
            return 1;
          }
        default:
          return response;
      }
    }
    processPassedConnection(connection) {
      this.checkVersion(connection);
      monkeyPatchConnection(connection, this);
    }
  }
  Client_Oracledb.prototype.driverName = "oracledb";
  function parseVersion(versionString) {
    try {
      const versionParts = versionString.split(".").slice(0, 2);
      versionParts.forEach((versionPart, idx) => {
        versionParts[idx] = versionPart.replace(/\D$/, "");
      });
      const version = versionParts.join(".");
      return version.match(/^\d+\.?\d*$/) ? version : null;
    } catch (err) {
      return null;
    }
  }
  function resolveConnectString(connectionSettings) {
    if (connectionSettings.connectString) {
      return connectionSettings.connectString;
    }
    if (!connectionSettings.port) {
      return connectionSettings.host + "/" + connectionSettings.database;
    }
    return connectionSettings.host + ":" + connectionSettings.port + "/" + connectionSettings.database;
  }
  oracledb = Client_Oracledb;
  return oracledb;
}
var pgnative;
var hasRequiredPgnative;
function requirePgnative() {
  if (hasRequiredPgnative) return pgnative;
  hasRequiredPgnative = 1;
  const Client_PG = requirePostgres();
  class Client_PgNative extends Client_PG {
    constructor(...args) {
      super(...args);
      this.driverName = "pgnative";
      this.canCancelQuery = true;
    }
    _driver() {
      return require$$14.native;
    }
    _stream(connection, obj, stream, options) {
      if (!obj.sql) throw new Error("The query is empty");
      const client2 = this;
      return new Promise((resolver, rejecter) => {
        stream.on("error", rejecter);
        stream.on("end", resolver);
        return client2._query(connection, obj).then((obj2) => obj2.response).then(({ rows }) => rows.forEach((row) => stream.write(row))).catch(function(err) {
          stream.emit("error", err);
        }).then(function() {
          stream.end();
        });
      });
    }
    async cancelQuery(connectionToKill) {
      try {
        return await this._wrappedCancelQueryCall(null, connectionToKill);
      } catch (err) {
        this.logger.warn(`Connection Error: ${err}`);
        throw err;
      }
    }
    _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
      return new Promise(function(resolve, reject) {
        connectionToKill.native.cancel(function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        });
      });
    }
  }
  pgnative = Client_PgNative;
  return pgnative;
}
var transaction;
var hasRequiredTransaction;
function requireTransaction() {
  if (hasRequiredTransaction) return transaction;
  hasRequiredTransaction = 1;
  const Transaction = requireTransaction$5();
  transaction = class Redshift_Transaction extends Transaction {
    begin(conn) {
      const trxMode = [
        this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
        this.readOnly ? "READ ONLY" : ""
      ].join(" ").trim();
      if (trxMode.length === 0) {
        return this.query(conn, "BEGIN;");
      }
      return this.query(conn, `BEGIN ${trxMode};`);
    }
    savepoint(conn) {
      this.trxClient.logger("Redshift does not support savepoints.");
      return Promise.resolve();
    }
    release(conn, value) {
      this.trxClient.logger("Redshift does not support savepoints.");
      return Promise.resolve();
    }
    rollbackTo(conn, error) {
      this.trxClient.logger("Redshift does not support savepoints.");
      return Promise.resolve();
    }
  };
  return transaction;
}
var redshiftQuerycompiler;
var hasRequiredRedshiftQuerycompiler;
function requireRedshiftQuerycompiler() {
  if (hasRequiredRedshiftQuerycompiler) return redshiftQuerycompiler;
  hasRequiredRedshiftQuerycompiler = 1;
  const QueryCompiler = requireQuerycompiler();
  const QueryCompiler_PG = requirePgQuerycompiler();
  const identity = requireIdentity();
  const {
    columnize: columnize_
  } = requireWrappingFormatter();
  class QueryCompiler_Redshift extends QueryCompiler_PG {
    truncate() {
      return `truncate ${this.tableName.toLowerCase()}`;
    }
    // Compiles an `insert` query, allowing for multiple
    // inserts using a single query statement.
    insert() {
      const sql = QueryCompiler.prototype.insert.apply(this, arguments);
      if (sql === "") return sql;
      this._slightReturn();
      return {
        sql
      };
    }
    // Compiles an `update` query, warning on unsupported returning
    update() {
      const sql = QueryCompiler.prototype.update.apply(this, arguments);
      this._slightReturn();
      return {
        sql
      };
    }
    // Compiles an `delete` query, warning on unsupported returning
    del() {
      const sql = QueryCompiler.prototype.del.apply(this, arguments);
      this._slightReturn();
      return {
        sql
      };
    }
    // simple: if trying to return, warn
    _slightReturn() {
      if (this.single.isReturning) {
        this.client.logger.warn(
          "insert/update/delete returning is not supported by redshift dialect"
        );
      }
    }
    forUpdate() {
      this.client.logger.warn("table lock is not supported by redshift dialect");
      return "";
    }
    forShare() {
      this.client.logger.warn(
        "lock for share is not supported by redshift dialect"
      );
      return "";
    }
    forNoKeyUpdate() {
      this.client.logger.warn("table lock is not supported by redshift dialect");
      return "";
    }
    forKeyShare() {
      this.client.logger.warn(
        "lock for share is not supported by redshift dialect"
      );
      return "";
    }
    // Compiles a columnInfo query
    columnInfo() {
      const column = this.single.columnInfo;
      let schema = this.single.schema;
      const table = this.client.customWrapIdentifier(this.single.table, identity);
      if (schema) {
        schema = this.client.customWrapIdentifier(schema, identity);
      }
      const sql = "select * from information_schema.columns where table_name = ? and table_catalog = ?";
      const bindings2 = [
        table.toLowerCase(),
        this.client.database().toLowerCase()
      ];
      return this._buildColumnInfoQuery(schema, sql, bindings2, column);
    }
    jsonExtract(params) {
      let extractions;
      if (Array.isArray(params.column)) {
        extractions = params.column;
      } else {
        extractions = [params];
      }
      return extractions.map((extraction) => {
        const jsonCol = `json_extract_path_text(${columnize_(
          extraction.column || extraction[0],
          this.builder,
          this.client,
          this.bindingsHolder
        )}, ${this.client.toPathForJson(
          params.path || extraction[1],
          this.builder,
          this.bindingsHolder
        )})`;
        const alias = extraction.alias || extraction[2];
        return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
      }).join(", ");
    }
    jsonSet(params) {
      throw new Error("Json set is not supported by Redshift");
    }
    jsonInsert(params) {
      throw new Error("Json insert is not supported by Redshift");
    }
    jsonRemove(params) {
      throw new Error("Json remove is not supported by Redshift");
    }
    whereJsonPath(statement) {
      return this._whereJsonPath(
        "json_extract_path_text",
        Object.assign({}, statement, {
          path: this.client.toPathForJson(statement.path)
        })
      );
    }
    whereJsonSupersetOf(statement) {
      throw new Error("Json superset is not supported by Redshift");
    }
    whereJsonSubsetOf(statement) {
      throw new Error("Json subset is not supported by Redshift");
    }
    onJsonPathEquals(clause) {
      return this._onJsonPathEquals("json_extract_path_text", clause);
    }
  }
  redshiftQuerycompiler = QueryCompiler_Redshift;
  return redshiftQuerycompiler;
}
var redshiftColumnbuilder;
var hasRequiredRedshiftColumnbuilder;
function requireRedshiftColumnbuilder() {
  if (hasRequiredRedshiftColumnbuilder) return redshiftColumnbuilder;
  hasRequiredRedshiftColumnbuilder = 1;
  const ColumnBuilder = requireColumnbuilder();
  class ColumnBuilder_Redshift extends ColumnBuilder {
    constructor() {
      super(...arguments);
    }
    // primary needs to set not null on non-preexisting columns, or fail
    primary() {
      this.notNullable();
      return super.primary(...arguments);
    }
    index() {
      this.client.logger.warn(
        "Redshift does not support the creation of indexes."
      );
      return this;
    }
  }
  redshiftColumnbuilder = ColumnBuilder_Redshift;
  return redshiftColumnbuilder;
}
var redshiftColumncompiler;
var hasRequiredRedshiftColumncompiler;
function requireRedshiftColumncompiler() {
  if (hasRequiredRedshiftColumncompiler) return redshiftColumncompiler;
  hasRequiredRedshiftColumncompiler = 1;
  const ColumnCompiler_PG = requirePgColumncompiler();
  const ColumnCompiler = requireColumncompiler();
  class ColumnCompiler_Redshift extends ColumnCompiler_PG {
    constructor() {
      super(...arguments);
    }
    // Types:
    // ------
    bit(column) {
      return column.length !== false ? `char(${column.length})` : "char(1)";
    }
    datetime(without) {
      return without ? "timestamp" : "timestamptz";
    }
    timestamp(without) {
      return without ? "timestamp" : "timestamptz";
    }
    // Modifiers:
    // ------
    comment(comment) {
      this.pushAdditional(function() {
        this.pushQuery(
          `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(this.args[0]) + " is " + (comment ? `'${comment}'` : "NULL")
        );
      }, comment);
    }
  }
  ColumnCompiler_Redshift.prototype.increments = ({ primaryKey = true } = {}) => "integer identity(1,1)" + (primaryKey ? " primary key" : "") + " not null";
  ColumnCompiler_Redshift.prototype.bigincrements = ({
    primaryKey = true
  } = {}) => "bigint identity(1,1)" + (primaryKey ? " primary key" : "") + " not null";
  ColumnCompiler_Redshift.prototype.binary = "varchar(max)";
  ColumnCompiler_Redshift.prototype.blob = "varchar(max)";
  ColumnCompiler_Redshift.prototype.enu = "varchar(255)";
  ColumnCompiler_Redshift.prototype.enum = "varchar(255)";
  ColumnCompiler_Redshift.prototype.json = "varchar(max)";
  ColumnCompiler_Redshift.prototype.jsonb = "varchar(max)";
  ColumnCompiler_Redshift.prototype.longblob = "varchar(max)";
  ColumnCompiler_Redshift.prototype.mediumblob = "varchar(16777218)";
  ColumnCompiler_Redshift.prototype.set = "text";
  ColumnCompiler_Redshift.prototype.text = "varchar(max)";
  ColumnCompiler_Redshift.prototype.tinyblob = "varchar(256)";
  ColumnCompiler_Redshift.prototype.uuid = ColumnCompiler.prototype.uuid;
  ColumnCompiler_Redshift.prototype.varbinary = "varchar(max)";
  ColumnCompiler_Redshift.prototype.bigint = "bigint";
  ColumnCompiler_Redshift.prototype.bool = "boolean";
  ColumnCompiler_Redshift.prototype.double = "double precision";
  ColumnCompiler_Redshift.prototype.floating = "real";
  ColumnCompiler_Redshift.prototype.smallint = "smallint";
  ColumnCompiler_Redshift.prototype.tinyint = "smallint";
  redshiftColumncompiler = ColumnCompiler_Redshift;
  return redshiftColumncompiler;
}
var redshiftTablecompiler;
var hasRequiredRedshiftTablecompiler;
function requireRedshiftTablecompiler() {
  if (hasRequiredRedshiftTablecompiler) return redshiftTablecompiler;
  hasRequiredRedshiftTablecompiler = 1;
  const has = requireHas();
  const TableCompiler_PG = requirePgTablecompiler();
  class TableCompiler_Redshift extends TableCompiler_PG {
    constructor() {
      super(...arguments);
    }
    index(columns, indexName, options) {
      this.client.logger.warn(
        "Redshift does not support the creation of indexes."
      );
    }
    dropIndex(columns, indexName) {
      this.client.logger.warn(
        "Redshift does not support the deletion of indexes."
      );
    }
    // TODO: have to disable setting not null on columns that already exist...
    // Adds the "create" query to the query sequence.
    createQuery(columns, ifNot, like) {
      const createStatement = ifNot ? "create table if not exists " : "create table ";
      const columnsSql = " (" + columns.sql.join(", ") + this._addChecks() + ")";
      let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " (like " + this.tableNameLike() + ")" : columnsSql);
      if (this.single.inherits)
        sql += ` like (${this.formatter.wrap(this.single.inherits)})`;
      this.pushQuery({
        sql,
        bindings: columns.bindings
      });
      const hasComment = has(this.single, "comment");
      if (hasComment) this.comment(this.single.comment);
      if (like) {
        this.addColumns(columns, this.addColumnsPrefix);
      }
    }
    primary(columns, constraintName) {
      const self2 = this;
      constraintName = constraintName ? self2.formatter.wrap(constraintName) : self2.formatter.wrap(`${this.tableNameRaw}_pkey`);
      if (columns.constructor !== Array) {
        columns = [columns];
      }
      const thiscolumns = self2.grouped.columns;
      if (thiscolumns) {
        for (let i = 0; i < columns.length; i++) {
          let exists = thiscolumns.find(
            (tcb) => tcb.grouping === "columns" && tcb.builder && tcb.builder._method === "add" && tcb.builder._args && tcb.builder._args.indexOf(columns[i]) > -1
          );
          if (exists) {
            exists = exists.builder;
          }
          const nullable = !(exists && exists._modifiers && exists._modifiers["nullable"] && exists._modifiers["nullable"][0] === false);
          if (nullable) {
            if (exists) {
              return this.client.logger.warn(
                "Redshift does not allow primary keys to contain nullable columns."
              );
            } else {
              return this.client.logger.warn(
                "Redshift does not allow primary keys to contain nonexistent columns."
              );
            }
          }
        }
      }
      return self2.pushQuery(
        `alter table ${self2.tableName()} add constraint ${constraintName} primary key (${self2.formatter.columnize(
          columns
        )})`
      );
    }
    // Compiles column add. Redshift can only add one column per ALTER TABLE, so core addColumns doesn't work.  #2545
    addColumns(columns, prefix, colCompilers) {
      if (prefix === this.alterColumnsPrefix) {
        super.addColumns(columns, prefix, colCompilers);
      } else {
        prefix = prefix || this.addColumnsPrefix;
        colCompilers = colCompilers || this.getColumns();
        for (const col of colCompilers) {
          const quotedTableName = this.tableName();
          const colCompiled = col.compileColumn();
          this.pushQuery({
            sql: `alter table ${quotedTableName} ${prefix}${colCompiled}`,
            bindings: []
          });
        }
      }
    }
  }
  redshiftTablecompiler = TableCompiler_Redshift;
  return redshiftTablecompiler;
}
var redshiftCompiler;
var hasRequiredRedshiftCompiler;
function requireRedshiftCompiler() {
  if (hasRequiredRedshiftCompiler) return redshiftCompiler;
  hasRequiredRedshiftCompiler = 1;
  const SchemaCompiler_PG = requirePgCompiler();
  class SchemaCompiler_Redshift extends SchemaCompiler_PG {
    constructor() {
      super(...arguments);
    }
  }
  redshiftCompiler = SchemaCompiler_Redshift;
  return redshiftCompiler;
}
var redshiftViewcompiler;
var hasRequiredRedshiftViewcompiler;
function requireRedshiftViewcompiler() {
  if (hasRequiredRedshiftViewcompiler) return redshiftViewcompiler;
  hasRequiredRedshiftViewcompiler = 1;
  const ViewCompiler_PG = requirePgViewcompiler();
  class ViewCompiler_Redshift extends ViewCompiler_PG {
    constructor(client2, viewCompiler) {
      super(client2, viewCompiler);
    }
  }
  redshiftViewcompiler = ViewCompiler_Redshift;
  return redshiftViewcompiler;
}
var redshift;
var hasRequiredRedshift;
function requireRedshift() {
  if (hasRequiredRedshift) return redshift;
  hasRequiredRedshift = 1;
  const Client_PG = requirePostgres();
  const map = requireMap();
  const Transaction = requireTransaction();
  const QueryCompiler = requireRedshiftQuerycompiler();
  const ColumnBuilder = requireRedshiftColumnbuilder();
  const ColumnCompiler = requireRedshiftColumncompiler();
  const TableCompiler = requireRedshiftTablecompiler();
  const SchemaCompiler = requireRedshiftCompiler();
  const ViewCompiler = requireRedshiftViewcompiler();
  class Client_Redshift extends Client_PG {
    transaction() {
      return new Transaction(this, ...arguments);
    }
    queryCompiler(builder2, formatter2) {
      return new QueryCompiler(this, builder2, formatter2);
    }
    columnBuilder() {
      return new ColumnBuilder(this, ...arguments);
    }
    columnCompiler() {
      return new ColumnCompiler(this, ...arguments);
    }
    tableCompiler() {
      return new TableCompiler(this, ...arguments);
    }
    schemaCompiler() {
      return new SchemaCompiler(this, ...arguments);
    }
    viewCompiler() {
      return new ViewCompiler(this, ...arguments);
    }
    _driver() {
      return require$$14;
    }
    // Ensures the response is returned in the same format as other clients.
    processResponse(obj, runner2) {
      const resp = obj.response;
      if (obj.output) return obj.output.call(runner2, resp);
      if (obj.method === "raw") return resp;
      if (resp.command === "SELECT") {
        if (obj.method === "first") return resp.rows[0];
        if (obj.method === "pluck") return map(resp.rows, obj.pluck);
        return resp.rows;
      }
      if (resp.command === "INSERT" || resp.command === "UPDATE" || resp.command === "DELETE") {
        return resp.rowCount;
      }
      return resp;
    }
    toPathForJson(jsonPath, builder2, bindingsHolder) {
      return jsonPath.replace(/^(\$\.)/, "").split(".").map(
        (function(v) {
          return this.parameter(v, builder2, bindingsHolder);
        }).bind(this)
      ).join(", ");
    }
  }
  Object.assign(Client_Redshift.prototype, {
    dialect: "redshift",
    driverName: "pg-redshift"
  });
  redshift = Client_Redshift;
  return redshift;
}
var hasRequiredDialects;
function requireDialects() {
  if (hasRequiredDialects) return dialects;
  hasRequiredDialects = 1;
  Object.defineProperty(dialects, "__esModule", { value: true });
  dialects.getDialectByNameOrAlias = void 0;
  const { resolveClientNameWithAliases } = requireHelpers$1();
  const dbNameToDialectLoader = Object.freeze({
    "better-sqlite3": () => requireBetterSqlite3(),
    cockroachdb: () => requireCockroachdb(),
    mssql: () => requireMssql(),
    mysql: () => requireMysql(),
    mysql2: () => requireMysql2(),
    oracle: () => requireOracle(),
    oracledb: () => requireOracledb(),
    pgnative: () => requirePgnative(),
    postgres: () => requirePostgres(),
    redshift: () => requireRedshift(),
    sqlite3: () => requireSqlite3()
  });
  function getDialectByNameOrAlias(clientName) {
    const resolvedClientName = resolveClientNameWithAliases(clientName);
    const dialectLoader = dbNameToDialectLoader[resolvedClientName];
    if (!dialectLoader) {
      throw new Error(`Invalid clientName given: ${clientName}`);
    }
    return dialectLoader();
  }
  dialects.getDialectByNameOrAlias = getDialectByNameOrAlias;
  return dialects;
}
var configResolver;
var hasRequiredConfigResolver;
function requireConfigResolver() {
  if (hasRequiredConfigResolver) return configResolver;
  hasRequiredConfigResolver = 1;
  const Client = requireClient();
  const { SUPPORTED_CLIENTS } = requireConstants$1();
  const parseConnection2 = requireParseConnection();
  const { getDialectByNameOrAlias } = requireDialects();
  function resolveConfig(config) {
    let Dialect;
    let resolvedConfig;
    const parsedConfig = typeof config === "string" ? Object.assign(parseConnection2(config), arguments[2]) : config;
    if (arguments.length === 0 || !parsedConfig.client && !parsedConfig.dialect) {
      Dialect = Client;
    } else if (typeof parsedConfig.client === "function") {
      Dialect = parsedConfig.client;
    } else {
      const clientName = parsedConfig.client || parsedConfig.dialect;
      if (!SUPPORTED_CLIENTS.includes(clientName)) {
        throw new Error(
          `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
        );
      }
      Dialect = getDialectByNameOrAlias(clientName);
    }
    if (typeof parsedConfig.connection === "string") {
      resolvedConfig = Object.assign({}, parsedConfig, {
        connection: parseConnection2(parsedConfig.connection).connection
      });
    } else {
      resolvedConfig = Object.assign({}, parsedConfig);
    }
    return {
      resolvedConfig,
      Dialect
    };
  }
  configResolver = {
    resolveConfig
  };
  return configResolver;
}
var Knex;
var hasRequiredKnex;
function requireKnex() {
  if (hasRequiredKnex) return Knex;
  hasRequiredKnex = 1;
  const Client = requireClient();
  const QueryBuilder = requireQuerybuilder();
  const QueryInterface = requireMethodConstants();
  const makeKnex = requireMakeKnex();
  const { KnexTimeoutError } = requireTimeout();
  const { resolveConfig } = requireConfigResolver();
  const SchemaBuilder = requireBuilder();
  const ViewBuilder = requireViewbuilder();
  const ColumnBuilder = requireColumnbuilder();
  const TableBuilder = requireTablebuilder();
  function knex2(config) {
    const { resolvedConfig, Dialect } = resolveConfig(...arguments);
    const newKnex = makeKnex(new Dialect(resolvedConfig));
    if (resolvedConfig.userParams) {
      newKnex.userParams = resolvedConfig.userParams;
    }
    return newKnex;
  }
  knex2.Client = Client;
  knex2.KnexTimeoutError = KnexTimeoutError;
  knex2.QueryBuilder = {
    extend: function(methodName, fn) {
      QueryBuilder.extend(methodName, fn);
      QueryInterface.push(methodName);
    }
  };
  knex2.SchemaBuilder = {
    extend: function(methodName, fn) {
      SchemaBuilder.extend(methodName, fn);
    }
  };
  knex2.ViewBuilder = {
    extend: function(methodName, fn) {
      ViewBuilder.extend(methodName, fn);
    }
  };
  knex2.ColumnBuilder = {
    extend: function(methodName, fn) {
      ColumnBuilder.extend(methodName, fn);
    }
  };
  knex2.TableBuilder = {
    extend: function(methodName, fn) {
      TableBuilder.extend(methodName, fn);
    }
  };
  Knex = knex2;
  return Knex;
}
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  const Knex2 = requireKnex();
  lib = Knex2;
  return lib;
}
var libExports = requireLib();
const knex = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
let db = null;
function initDatabase() {
  if (db) return db;
  const isDev2 = process.env.NODE_ENV === "development";
  const userDataPath = electron.app.getPath("userData");
  const dbDir = isDev2 ? require$$0$4.join(process.cwd(), "data") : userDataPath;
  if (!require$$0$3.existsSync(dbDir)) {
    require$$0$3.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = require$$0$4.join(dbDir, "3d-management.sqlite");
  db = knex({
    client: "sqlite3",
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true,
    migrations: {
      directory: require$$0$4.join(__dirname, "migrations")
    },
    seeds: {
      directory: require$$0$4.join(__dirname, "seeds")
    }
  });
  console.log(`Database initialized at: ${dbPath}`);
  return db;
}
function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}
async function closeDatabase() {
  if (db) {
    await db.destroy();
    db = null;
  }
}
const ALLOWED_TABLES = [
  "filaments",
  "components",
  "printers",
  "products",
  "print_jobs",
  "quotes",
  "sales",
  "transactions",
  "investments",
  "settings",
  "users"
];
function validateTable(table) {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error(`Invalid table: ${table}`);
  }
}
function validateParams(params) {
  validateTable(params.table);
  if (params.limit && (params.limit < 1 || params.limit > 1e3)) {
    throw new Error("Limit must be between 1 and 1000");
  }
  if (params.offset && params.offset < 0) {
    throw new Error("Offset must be non-negative");
  }
}
function setupIpcHandlers() {
  electron.ipcMain.handle("db:query", async (_event, params) => {
    try {
      validateParams(params);
      const db2 = getDatabase();
      let query = db2(params.table);
      if (params.select) {
        query = query.select(params.select);
      }
      if (params.where) {
        query = query.where(params.where);
      }
      if (params.orderBy) {
        query = query.orderBy(params.orderBy.column, params.orderBy.order);
      }
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.offset(params.offset);
      }
      const results = await query;
      return { success: true, data: results };
    } catch (error) {
      console.error("Database query error:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("db:insert", async (_event, params) => {
    try {
      validateTable(params.table);
      if (!params.data) {
        throw new Error("No data provided for insert");
      }
      const db2 = getDatabase();
      const [id] = await db2(params.table).insert(params.data);
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Database insert error:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("db:update", async (_event, params) => {
    try {
      validateTable(params.table);
      if (!params.data) {
        throw new Error("No data provided for update");
      }
      if (!params.where) {
        throw new Error("No where clause provided for update");
      }
      const db2 = getDatabase();
      const count = await db2(params.table).where(params.where).update(params.data);
      return { success: true, data: { count } };
    } catch (error) {
      console.error("Database update error:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("db:delete", async (_event, params) => {
    try {
      validateTable(params.table);
      if (!params.where) {
        throw new Error("No where clause provided for delete");
      }
      const db2 = getDatabase();
      const count = await db2(params.table).where(params.where).delete();
      return { success: true, data: { count } };
    } catch (error) {
      console.error("Database delete error:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("db:migrate", async () => {
    try {
      const db2 = getDatabase();
      await db2.migrate.latest();
      return { success: true };
    } catch (error) {
      console.error("Migration error:", error);
      return { success: false, error: error.message };
    }
  });
}
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const isDev = !!VITE_DEV_SERVER_URL;
const DIST_PATH = isDev ? require$$0$4.join(__dirname, "../dist") : require$$0$4.join(process.resourcesPath, "dist");
const PUBLIC_PATH = isDev ? require$$0$4.join(__dirname, "../public") : DIST_PATH;
const ICON_PATH = (() => {
  const candidate = require$$0$4.join(PUBLIC_PATH, "vite.svg");
  return require$$0$3.existsSync(candidate) ? candidate : void 0;
})();
function createWindow() {
  const windowOptions = {
    width: 1280,
    height: 800,
    webPreferences: {
      preload: require$$0$4.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  };
  if (ICON_PATH) {
    windowOptions.icon = ICON_PATH;
  }
  const win = new electron.BrowserWindow(windowOptions);
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) electron.shell.openExternal(url);
    return { action: "deny" };
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(require$$0$4.join(DIST_PATH, "index.html"));
  }
}
electron.app.whenReady().then(async () => {
  try {
    const db2 = initDatabase();
    await db2.migrate.latest();
    console.log("Database migrations completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
  setupIpcHandlers();
  createWindow();
});
electron.app.on("window-all-closed", async () => {
  await closeDatabase();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
