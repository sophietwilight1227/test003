(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Base,
  hasProp = {}.hasOwnProperty;

module.exports = Base = (function() {
  function Base(args) {
    var key, value;
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      value = args[key];
      this[key] = value;
    }
    Object.defineProperty(this, '___runtime', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: (args != null ? args.___runtime : void 0) || {}
    });
  }

  return Base;

})();

},{}],2:[function(require,module,exports){
window.ecl = require('./index');

},{"./index":5}],3:[function(require,module,exports){
var Event,
  extend = require("extends__"),
  hasProp = {}.hasOwnProperty;

module.exports = Event = (function(superClass) {
  extend(Event, superClass);

  function Event(type, callback) {
    var args, date, perf;
    args = (typeof type === 'string' ? {
      type: type
    } : type || {});
    if (typeof callback === 'function') {
      args.callback = callback;
    }
    Event.__super__.constructor.call(this, args);
    if (this.timestamp === true) {
      date = Date.now();
      perf = (typeof performance !== "undefined" && performance !== null ? performance.now() : void 0) || 0;
      this.timestamp = 1000 * date + Math.floor(1000 * (perf - Math.floor(perf)));
    }
  }

  Event.prototype.cancel = function() {
    this.___runtime.cancel = true;
    return this;
  };

  Event.prototype.stop = function() {
    this.___runtime.stop = true;
    return this;
  };

  Event.prototype.abort = function() {
    this.aborted = true;
    return this;
  };

  return Event;

})(require('./base'));

},{"./base":1,"extends__":7}],4:[function(require,module,exports){
var Event, Evented,
  extend = require("extends__"),
  hasProp = {}.hasOwnProperty;

Event = require('./event');

module.exports = Evented = (function(superClass) {
  extend(Evented, superClass);

  function Evented() {
    Evented.__super__.constructor.apply(this, arguments);
    this.listeners = [{}, {}];
  }

  Evented.prototype.addListener = function(type, listener, capture) {
    var listeners, ref, ref1, ref2;
    if (capture == null) {
      capture = false;
    }
    if (typeof type === 'object') {
      ref = type, type = ref.type, listener = ref.listener, capture = ref.capture;
    }
    if (((ref1 = this.events) != null ? ref1[type] : void 0) && typeof listener === 'function') {
      listeners = ((ref2 = this.listeners[capture ? 1 : 0]) != null ? ref2[type] || (ref2[type] = []) : void 0);
      if (-1 === listeners.indexOf(listener)) {
        listeners.push(listener);
      }
    }
    return this;
  };

  Evented.prototype.removeListener = function(type, listener, capture) {
    var idx, listeners, ref, ref1;
    if (capture == null) {
      capture = false;
    }
    if (type instanceof Object) {
      ref = type, type = ref.type, listener = ref.listener, capture = ref.capture;
    }
    if (type && typeof listener === 'function') {
      if (listeners = (ref1 = this.listeners[capture ? 1 : 0]) != null ? ref1[type] : void 0) {
        if (-1 !== (idx = listeners.indexOf(listener))) {
          listeners.splice(idx, 1);
        }
      }
    }
    return this;
  };

  Evented.prototype.dispatchEvent = function(event) {
    var i, len, listener, listeners, phase, ref, ref1, type;
    if (!((event != null ? event.aborted : void 0) || (event != null ? event.canceled : void 0))) {
      if ((type = event != null ? event.type : void 0) && this.events[type]) {
        phase = event.phase;
        if (((3 > phase && phase > 0)) && (listeners = (ref = this.listeners) != null ? ref[2 - phase][type] : void 0)) {
          for (i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            if (((ref1 = event.___runtime) != null ? ref1.canceled : void 0) || event.aborted) {
              break;
            }
            listener.call(this, event);
          }
        }
      }
    }
    return this;
  };

  Evented.prototype.broadcastEvent = function(event, target) {
    var base, child, i, len, phase, ref, ref1, type;
    if ((type = event != null ? event.type : void 0) && (event.phase || 0) < 3) {
      if (!(event.aborted || event.___runtime.stopped)) {
        (base = event.___runtime).source || (base.source = this);
        phase = (event.phase || (event.phase = 1));
        if (event.target === this) {
          event.phase = 2;
        }
        if (event.phase === 1) {
          this.dispatchEvent(event);
          if (this.children) {
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (!(event.aborted || event.___runtime.canceled)) {
                child.broadcastEvent(event);
              } else {
                break;
              }
            }
          }
        }
        if (event.target === this) {
          event.phase = 2;
        }
        if (event.phase === 2) {
          this.dispatchEvent(event);
        }
        if (event.___runtime.source === this && event.phase < 4) {
          if ((ref1 = event.callback) != null) {
            if (typeof ref1.call === "function") {
              ref1.call(this, event);
            }
          }
          event.phase = 4;
        }
      }
    }
    return this;
  };

  return Evented;

})(require('./node'));

},{"./event":3,"./node":6,"extends__":7}],5:[function(require,module,exports){
module.exports = {
  Base: require('./base'),
  Node: require('./node'),
  Event: require('./event'),
  Evented: require('./evented')
};

},{"./base":1,"./event":3,"./evented":4,"./node":6}],6:[function(require,module,exports){
var Node,
  extend = require("extends__"),
  hasProp = {}.hasOwnProperty;

module.exports = Node = (function(superClass) {
  extend(Node, superClass);

  function Node() {
    Node.__super__.constructor.apply(this, arguments);
  }

  Node.prototype.appendChild = function(child) {
    var ref;
    if (child !== this) {
      this.children || (this.children = []);
      if (-1 === this.children.indexOf(child)) {
        if ((ref = child.parent) != null) {
          if (typeof ref.removeChild === "function") {
            ref.removeChild(child);
          }
        }
        child.parent = this;
        this.children.push(child);
      }
    }
    return this;
  };

  Node.prototype.removeChild = function(child) {
    var idx, ref;
    if (((ref = this.children) != null ? ref.length : void 0) && -1 !== (idx = this.children.indexOf(child))) {
      delete child.parent;
      this.children.splice(idx, 1);
      if (this.children.length === 0) {
        delete this.children;
      }
    }
    return this;
  };

  return Node;

})(require('./base'));

},{"./base":1,"extends__":7}],7:[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = function(ChildClass, ParentClasses) {
  var MixinClass, ParentClass, i, key, len, ref, value;
  if (ParentClasses instanceof Array && ParentClasses.length) {
    ParentClass = (function(superClass) {
      extend(ParentClass, superClass);

      function ParentClass() {
        var MixinClass, i, len;
        ParentClass.__super__.constructor.apply(this, arguments);
        for (i = 0, len = ParentClasses.length; i < len; i++) {
          MixinClass = ParentClasses[i];
          MixinClass.apply(this, arguments);
        }
      }

      return ParentClass;

    })(ParentClasses.shift());
    for (i = 0, len = ParentClasses.length; i < len; i++) {
      MixinClass = ParentClasses[i];
      ref = MixinClass.prototype;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        if (key !== 'constructor') {
          ParentClass.prototype[key] = value;
        }
      }
    }
  } else {
    ParentClass = ParentClasses;
  }
  return extend(ChildClass, ParentClass);
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9iYXNlLmpzIiwiYnVpbGQvZWNsLmpzIiwiYnVpbGQvZXZlbnQuanMiLCJidWlsZC9ldmVudGVkLmpzIiwiYnVpbGQvaW5kZXguanMiLCJidWlsZC9ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2V4dGVuZHNfXy9kaXN0L2V4dGVuZHNfXy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJhc2UsXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBCYXNlKGFyZ3MpIHtcbiAgICB2YXIga2V5LCB2YWx1ZTtcbiAgICBmb3IgKGtleSBpbiBhcmdzKSB7XG4gICAgICBpZiAoIWhhc1Byb3AuY2FsbChhcmdzLCBrZXkpKSBjb250aW51ZTtcbiAgICAgIHZhbHVlID0gYXJnc1trZXldO1xuICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX19fcnVudGltZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiAoYXJncyAhPSBudWxsID8gYXJncy5fX19ydW50aW1lIDogdm9pZCAwKSB8fCB7fVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIEJhc2U7XG5cbn0pKCk7XG4iLCJ3aW5kb3cuZWNsID0gcmVxdWlyZSgnLi9pbmRleCcpO1xuIiwidmFyIEV2ZW50LFxuICBleHRlbmQgPSByZXF1aXJlKFwiZXh0ZW5kc19fXCIpLFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoRXZlbnQsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEV2ZW50KHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFyZ3MsIGRhdGUsIHBlcmY7XG4gICAgYXJncyA9ICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB7XG4gICAgICB0eXBlOiB0eXBlXG4gICAgfSA6IHR5cGUgfHwge30pO1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyZ3MuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgRXZlbnQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgYXJncyk7XG4gICAgaWYgKHRoaXMudGltZXN0YW1wID09PSB0cnVlKSB7XG4gICAgICBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICAgIHBlcmYgPSAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsID8gcGVyZm9ybWFuY2Uubm93KCkgOiB2b2lkIDApIHx8IDA7XG4gICAgICB0aGlzLnRpbWVzdGFtcCA9IDEwMDAgKiBkYXRlICsgTWF0aC5mbG9vcigxMDAwICogKHBlcmYgLSBNYXRoLmZsb29yKHBlcmYpKSk7XG4gICAgfVxuICB9XG5cbiAgRXZlbnQucHJvdG90eXBlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX19fcnVudGltZS5jYW5jZWwgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fX19ydW50aW1lLnN0b3AgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50O1xuXG59KShyZXF1aXJlKCcuL2Jhc2UnKSk7XG4iLCJ2YXIgRXZlbnQsIEV2ZW50ZWQsXG4gIGV4dGVuZCA9IHJlcXVpcmUoXCJleHRlbmRzX19cIiksXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuRXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlZCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChFdmVudGVkLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBFdmVudGVkKCkge1xuICAgIEV2ZW50ZWQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbe30sIHt9XTtcbiAgfVxuXG4gIEV2ZW50ZWQucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgICB2YXIgbGlzdGVuZXJzLCByZWYsIHJlZjEsIHJlZjI7XG4gICAgaWYgKGNhcHR1cmUgPT0gbnVsbCkge1xuICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICByZWYgPSB0eXBlLCB0eXBlID0gcmVmLnR5cGUsIGxpc3RlbmVyID0gcmVmLmxpc3RlbmVyLCBjYXB0dXJlID0gcmVmLmNhcHR1cmU7XG4gICAgfVxuICAgIGlmICgoKHJlZjEgPSB0aGlzLmV2ZW50cykgIT0gbnVsbCA/IHJlZjFbdHlwZV0gOiB2b2lkIDApICYmIHR5cGVvZiBsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGlzdGVuZXJzID0gKChyZWYyID0gdGhpcy5saXN0ZW5lcnNbY2FwdHVyZSA/IDEgOiAwXSkgIT0gbnVsbCA/IHJlZjJbdHlwZV0gfHwgKHJlZjJbdHlwZV0gPSBbXSkgOiB2b2lkIDApO1xuICAgICAgaWYgKC0xID09PSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikpIHtcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudGVkLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gICAgdmFyIGlkeCwgbGlzdGVuZXJzLCByZWYsIHJlZjE7XG4gICAgaWYgKGNhcHR1cmUgPT0gbnVsbCkge1xuICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgcmVmID0gdHlwZSwgdHlwZSA9IHJlZi50eXBlLCBsaXN0ZW5lciA9IHJlZi5saXN0ZW5lciwgY2FwdHVyZSA9IHJlZi5jYXB0dXJlO1xuICAgIH1cbiAgICBpZiAodHlwZSAmJiB0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChsaXN0ZW5lcnMgPSAocmVmMSA9IHRoaXMubGlzdGVuZXJzW2NhcHR1cmUgPyAxIDogMF0pICE9IG51bGwgPyByZWYxW3R5cGVdIDogdm9pZCAwKSB7XG4gICAgICAgIGlmICgtMSAhPT0gKGlkeCA9IGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSkpIHtcbiAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRlZC5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGksIGxlbiwgbGlzdGVuZXIsIGxpc3RlbmVycywgcGhhc2UsIHJlZiwgcmVmMSwgdHlwZTtcbiAgICBpZiAoISgoZXZlbnQgIT0gbnVsbCA/IGV2ZW50LmFib3J0ZWQgOiB2b2lkIDApIHx8IChldmVudCAhPSBudWxsID8gZXZlbnQuY2FuY2VsZWQgOiB2b2lkIDApKSkge1xuICAgICAgaWYgKCh0eXBlID0gZXZlbnQgIT0gbnVsbCA/IGV2ZW50LnR5cGUgOiB2b2lkIDApICYmIHRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgIHBoYXNlID0gZXZlbnQucGhhc2U7XG4gICAgICAgIGlmICgoKDMgPiBwaGFzZSAmJiBwaGFzZSA+IDApKSAmJiAobGlzdGVuZXJzID0gKHJlZiA9IHRoaXMubGlzdGVuZXJzKSAhPSBudWxsID8gcmVmWzIgLSBwaGFzZV1bdHlwZV0gOiB2b2lkIDApKSB7XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIGlmICgoKHJlZjEgPSBldmVudC5fX19ydW50aW1lKSAhPSBudWxsID8gcmVmMS5jYW5jZWxlZCA6IHZvaWQgMCkgfHwgZXZlbnQuYWJvcnRlZCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudGVkLnByb3RvdHlwZS5icm9hZGNhc3RFdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCB0YXJnZXQpIHtcbiAgICB2YXIgYmFzZSwgY2hpbGQsIGksIGxlbiwgcGhhc2UsIHJlZiwgcmVmMSwgdHlwZTtcbiAgICBpZiAoKHR5cGUgPSBldmVudCAhPSBudWxsID8gZXZlbnQudHlwZSA6IHZvaWQgMCkgJiYgKGV2ZW50LnBoYXNlIHx8IDApIDwgMykge1xuICAgICAgaWYgKCEoZXZlbnQuYWJvcnRlZCB8fCBldmVudC5fX19ydW50aW1lLnN0b3BwZWQpKSB7XG4gICAgICAgIChiYXNlID0gZXZlbnQuX19fcnVudGltZSkuc291cmNlIHx8IChiYXNlLnNvdXJjZSA9IHRoaXMpO1xuICAgICAgICBwaGFzZSA9IChldmVudC5waGFzZSB8fCAoZXZlbnQucGhhc2UgPSAxKSk7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMpIHtcbiAgICAgICAgICBldmVudC5waGFzZSA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnBoYXNlID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgcmVmID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICBjaGlsZCA9IHJlZltpXTtcbiAgICAgICAgICAgICAgaWYgKCEoZXZlbnQuYWJvcnRlZCB8fCBldmVudC5fX19ydW50aW1lLmNhbmNlbGVkKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmJyb2FkY2FzdEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKSB7XG4gICAgICAgICAgZXZlbnQucGhhc2UgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5waGFzZSA9PT0gMikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50Ll9fX3J1bnRpbWUuc291cmNlID09PSB0aGlzICYmIGV2ZW50LnBoYXNlIDwgNCkge1xuICAgICAgICAgIGlmICgocmVmMSA9IGV2ZW50LmNhbGxiYWNrKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlZjEuY2FsbCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJlZjEuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGV2ZW50LnBoYXNlID0gNDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gRXZlbnRlZDtcblxufSkocmVxdWlyZSgnLi9ub2RlJykpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2U6IHJlcXVpcmUoJy4vYmFzZScpLFxuICBOb2RlOiByZXF1aXJlKCcuL25vZGUnKSxcbiAgRXZlbnQ6IHJlcXVpcmUoJy4vZXZlbnQnKSxcbiAgRXZlbnRlZDogcmVxdWlyZSgnLi9ldmVudGVkJylcbn07XG4iLCJ2YXIgTm9kZSxcbiAgZXh0ZW5kID0gcmVxdWlyZShcImV4dGVuZHNfX1wiKSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGUgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoTm9kZSwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gTm9kZSgpIHtcbiAgICBOb2RlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKGNoaWxkICE9PSB0aGlzKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuIHx8ICh0aGlzLmNoaWxkcmVuID0gW10pO1xuICAgICAgaWYgKC0xID09PSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpKSB7XG4gICAgICAgIGlmICgocmVmID0gY2hpbGQucGFyZW50KSAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZWYucmVtb3ZlQ2hpbGQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmVmLnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHZhciBpZHgsIHJlZjtcbiAgICBpZiAoKChyZWYgPSB0aGlzLmNoaWxkcmVuKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCkgJiYgLTEgIT09IChpZHggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpKSkge1xuICAgICAgZGVsZXRlIGNoaWxkLnBhcmVudDtcbiAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2hpbGRyZW47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBOb2RlO1xuXG59KShyZXF1aXJlKCcuL2Jhc2UnKSk7XG4iLCJ2YXIgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ2hpbGRDbGFzcywgUGFyZW50Q2xhc3Nlcykge1xuICB2YXIgTWl4aW5DbGFzcywgUGFyZW50Q2xhc3MsIGksIGtleSwgbGVuLCByZWYsIHZhbHVlO1xuICBpZiAoUGFyZW50Q2xhc3NlcyBpbnN0YW5jZW9mIEFycmF5ICYmIFBhcmVudENsYXNzZXMubGVuZ3RoKSB7XG4gICAgUGFyZW50Q2xhc3MgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgICAgZXh0ZW5kKFBhcmVudENsYXNzLCBzdXBlckNsYXNzKTtcblxuICAgICAgZnVuY3Rpb24gUGFyZW50Q2xhc3MoKSB7XG4gICAgICAgIHZhciBNaXhpbkNsYXNzLCBpLCBsZW47XG4gICAgICAgIFBhcmVudENsYXNzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBQYXJlbnRDbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgTWl4aW5DbGFzcyA9IFBhcmVudENsYXNzZXNbaV07XG4gICAgICAgICAgTWl4aW5DbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQYXJlbnRDbGFzcztcblxuICAgIH0pKFBhcmVudENsYXNzZXMuc2hpZnQoKSk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gUGFyZW50Q2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgTWl4aW5DbGFzcyA9IFBhcmVudENsYXNzZXNbaV07XG4gICAgICByZWYgPSBNaXhpbkNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgICBpZiAoIWhhc1Byb3AuY2FsbChyZWYsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgICBpZiAoa2V5ICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgUGFyZW50Q2xhc3MucHJvdG90eXBlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBQYXJlbnRDbGFzcyA9IFBhcmVudENsYXNzZXM7XG4gIH1cbiAgcmV0dXJuIGV4dGVuZChDaGlsZENsYXNzLCBQYXJlbnRDbGFzcyk7XG59O1xuIl19
