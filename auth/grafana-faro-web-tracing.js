// vendored @grafana/faro-web-tracing v1.18.1 https://unpkg.com/@grafana/faro-web-tracing@1.18.1/dist/bundle/faro-web-tracing.iife.js

var GrafanaFaroWebTracing = function (t, e) {
  "use strict";
  var n =
      "object" == typeof globalThis
        ? globalThis
        : "object" == typeof self
        ? self
        : "object" == typeof window
        ? window
        : "object" == typeof global
        ? global
        : {},
    r = "1.9.0",
    o = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  var i = (function (t) {
      var e = new Set([t]),
        n = new Set(),
        r = t.match(o);
      if (!r)
        return function () {
          return !1;
        };
      var i = +r[1],
        s = +r[2],
        a = +r[3];
      if (null != r[4])
        return function (e) {
          return e === t;
        };
      function u(t) {
        return n.add(t), !1;
      }
      function c(t) {
        return e.add(t), !0;
      }
      return function (t) {
        if (e.has(t)) return !0;
        if (n.has(t)) return !1;
        var r = t.match(o);
        if (!r) return u(t);
        var l = +r[1],
          p = +r[2],
          d = +r[3];
        return null != r[4] || i !== l
          ? u(t)
          : 0 === i
          ? s === p && a <= d
            ? c(t)
            : u(t)
          : s <= p
          ? c(t)
          : u(t);
      };
    })(r),
    s = r.split(".")[0],
    a = Symbol.for("opentelemetry.js.api." + s),
    u = n;
  function c(t, e, n, o) {
    var i;
    void 0 === o && (o = !1);
    var s = (u[a] = null !== (i = u[a]) && void 0 !== i ? i : { version: r });
    if (!o && s[t]) {
      var c = new Error(
        "@opentelemetry/api: Attempted duplicate registration of API: " + t
      );
      return n.error(c.stack || c.message), !1;
    }
    if (s.version !== r) {
      c = new Error(
        "@opentelemetry/api: Registration of version v" +
          s.version +
          " for " +
          t +
          " does not match previously registered API v" +
          r
      );
      return n.error(c.stack || c.message), !1;
    }
    return (
      (s[t] = e),
      n.debug(
        "@opentelemetry/api: Registered a global for " + t + " v" + r + "."
      ),
      !0
    );
  }
  function l(t) {
    var e,
      n,
      r = null === (e = u[a]) || void 0 === e ? void 0 : e.version;
    if (r && i(r)) return null === (n = u[a]) || void 0 === n ? void 0 : n[t];
  }
  function p(t, e) {
    e.debug(
      "@opentelemetry/api: Unregistering a global for " + t + " v" + r + "."
    );
    var n = u[a];
    n && delete n[t];
  }
  var d,
    h = function (t, e) {
      var n = "function" == typeof Symbol && t[Symbol.iterator];
      if (!n) return t;
      var r,
        o,
        i = n.call(t),
        s = [];
      try {
        for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
          s.push(r.value);
      } catch (t) {
        o = { error: t };
      } finally {
        try {
          r && !r.done && (n = i.return) && n.call(i);
        } finally {
          if (o) throw o.error;
        }
      }
      return s;
    },
    f = function (t, e, n) {
      if (n || 2 === arguments.length)
        for (var r, o = 0, i = e.length; o < i; o++)
          (!r && o in e) ||
            (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
      return t.concat(r || Array.prototype.slice.call(e));
    },
    g = (function () {
      function t(t) {
        this._namespace = t.namespace || "DiagComponentLogger";
      }
      return (
        (t.prototype.debug = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return m("debug", this._namespace, t);
        }),
        (t.prototype.error = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return m("error", this._namespace, t);
        }),
        (t.prototype.info = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return m("info", this._namespace, t);
        }),
        (t.prototype.warn = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return m("warn", this._namespace, t);
        }),
        (t.prototype.verbose = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return m("verbose", this._namespace, t);
        }),
        t
      );
    })();
  function m(t, e, n) {
    var r = l("diag");
    if (r) return n.unshift(e), r[t].apply(r, f([], h(n), !1));
  }
  !(function (t) {
    (t[(t.NONE = 0)] = "NONE"),
      (t[(t.ERROR = 30)] = "ERROR"),
      (t[(t.WARN = 50)] = "WARN"),
      (t[(t.INFO = 60)] = "INFO"),
      (t[(t.DEBUG = 70)] = "DEBUG"),
      (t[(t.VERBOSE = 80)] = "VERBOSE"),
      (t[(t.ALL = 9999)] = "ALL");
  })(d || (d = {}));
  var _ = function (t, e) {
      var n = "function" == typeof Symbol && t[Symbol.iterator];
      if (!n) return t;
      var r,
        o,
        i = n.call(t),
        s = [];
      try {
        for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
          s.push(r.value);
      } catch (t) {
        o = { error: t };
      } finally {
        try {
          r && !r.done && (n = i.return) && n.call(i);
        } finally {
          if (o) throw o.error;
        }
      }
      return s;
    },
    v = function (t, e, n) {
      if (n || 2 === arguments.length)
        for (var r, o = 0, i = e.length; o < i; o++)
          (!r && o in e) ||
            (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
      return t.concat(r || Array.prototype.slice.call(e));
    },
    y = (function () {
      function t() {
        function t(t) {
          return function () {
            for (var e = [], n = 0; n < arguments.length; n++)
              e[n] = arguments[n];
            var r = l("diag");
            if (r) return r[t].apply(r, v([], _(e), !1));
          };
        }
        var e = this;
        (e.setLogger = function (t, n) {
          var r, o, i;
          if ((void 0 === n && (n = { logLevel: d.INFO }), t === e)) {
            var s = new Error(
              "Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation"
            );
            return (
              e.error(null !== (r = s.stack) && void 0 !== r ? r : s.message),
              !1
            );
          }
          "number" == typeof n && (n = { logLevel: n });
          var a = l("diag"),
            u = (function (t, e) {
              function n(n, r) {
                var o = e[n];
                return "function" == typeof o && t >= r
                  ? o.bind(e)
                  : function () {};
              }
              return (
                t < d.NONE ? (t = d.NONE) : t > d.ALL && (t = d.ALL),
                (e = e || {}),
                {
                  error: n("error", d.ERROR),
                  warn: n("warn", d.WARN),
                  info: n("info", d.INFO),
                  debug: n("debug", d.DEBUG),
                  verbose: n("verbose", d.VERBOSE),
                }
              );
            })(null !== (o = n.logLevel) && void 0 !== o ? o : d.INFO, t);
          if (a && !n.suppressOverrideMessage) {
            var p =
              null !== (i = new Error().stack) && void 0 !== i
                ? i
                : "<failed to generate stacktrace>";
            a.warn("Current logger will be overwritten from " + p),
              u.warn(
                "Current logger will overwrite one already registered from " + p
              );
          }
          return c("diag", u, e, !0);
        }),
          (e.disable = function () {
            p("diag", e);
          }),
          (e.createComponentLogger = function (t) {
            return new g(t);
          }),
          (e.verbose = t("verbose")),
          (e.debug = t("debug")),
          (e.info = t("info")),
          (e.warn = t("warn")),
          (e.error = t("error"));
      }
      return (
        (t.instance = function () {
          return this._instance || (this._instance = new t()), this._instance;
        }),
        t
      );
    })(),
    S = function (t, e) {
      var n = "function" == typeof Symbol && t[Symbol.iterator];
      if (!n) return t;
      var r,
        o,
        i = n.call(t),
        s = [];
      try {
        for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
          s.push(r.value);
      } catch (t) {
        o = { error: t };
      } finally {
        try {
          r && !r.done && (n = i.return) && n.call(i);
        } finally {
          if (o) throw o.error;
        }
      }
      return s;
    },
    b = function (t) {
      var e = "function" == typeof Symbol && Symbol.iterator,
        n = e && t[e],
        r = 0;
      if (n) return n.call(t);
      if (t && "number" == typeof t.length)
        return {
          next: function () {
            return (
              t && r >= t.length && (t = void 0),
              { value: t && t[r++], done: !t }
            );
          },
        };
      throw new TypeError(
        e ? "Object is not iterable." : "Symbol.iterator is not defined."
      );
    },
    E = (function () {
      function t(t) {
        this._entries = t ? new Map(t) : new Map();
      }
      return (
        (t.prototype.getEntry = function (t) {
          var e = this._entries.get(t);
          if (e) return Object.assign({}, e);
        }),
        (t.prototype.getAllEntries = function () {
          return Array.from(this._entries.entries()).map(function (t) {
            var e = S(t, 2);
            return [e[0], e[1]];
          });
        }),
        (t.prototype.setEntry = function (e, n) {
          var r = new t(this._entries);
          return r._entries.set(e, n), r;
        }),
        (t.prototype.removeEntry = function (e) {
          var n = new t(this._entries);
          return n._entries.delete(e), n;
        }),
        (t.prototype.removeEntries = function () {
          for (var e, n, r = [], o = 0; o < arguments.length; o++)
            r[o] = arguments[o];
          var i = new t(this._entries);
          try {
            for (var s = b(r), a = s.next(); !a.done; a = s.next()) {
              var u = a.value;
              i._entries.delete(u);
            }
          } catch (t) {
            e = { error: t };
          } finally {
            try {
              a && !a.done && (n = s.return) && n.call(s);
            } finally {
              if (e) throw e.error;
            }
          }
          return i;
        }),
        (t.prototype.clear = function () {
          return new t();
        }),
        t
      );
    })(),
    T = Symbol("BaggageEntryMetadata"),
    w = y.instance();
  function C(t) {
    return void 0 === t && (t = {}), new E(new Map(Object.entries(t)));
  }
  function A(t) {
    return Symbol.for(t);
  }
  var O,
    R,
    N = function t(e) {
      var n = this;
      (n._currentContext = e ? new Map(e) : new Map()),
        (n.getValue = function (t) {
          return n._currentContext.get(t);
        }),
        (n.setValue = function (e, r) {
          var o = new t(n._currentContext);
          return o._currentContext.set(e, r), o;
        }),
        (n.deleteValue = function (e) {
          var r = new t(n._currentContext);
          return r._currentContext.delete(e), r;
        });
    },
    x = new N(),
    P =
      ((O = function (t, e) {
        return (
          (O =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e)
                Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            }),
          O(t, e)
        );
      }),
      function (t, e) {
        if ("function" != typeof e && null !== e)
          throw new TypeError(
            "Class extends value " + String(e) + " is not a constructor or null"
          );
        function n() {
          this.constructor = t;
        }
        O(t, e),
          (t.prototype =
            null === e
              ? Object.create(e)
              : ((n.prototype = e.prototype), new n()));
      }),
    L = (function () {
      function t() {}
      return (
        (t.prototype.createGauge = function (t, e) {
          return z;
        }),
        (t.prototype.createHistogram = function (t, e) {
          return q;
        }),
        (t.prototype.createCounter = function (t, e) {
          return $;
        }),
        (t.prototype.createUpDownCounter = function (t, e) {
          return G;
        }),
        (t.prototype.createObservableGauge = function (t, e) {
          return W;
        }),
        (t.prototype.createObservableCounter = function (t, e) {
          return K;
        }),
        (t.prototype.createObservableUpDownCounter = function (t, e) {
          return X;
        }),
        (t.prototype.addBatchObservableCallback = function (t, e) {}),
        (t.prototype.removeBatchObservableCallback = function (t) {}),
        t
      );
    })(),
    D = function () {},
    I = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), (e.prototype.add = function (t, e) {}), e;
    })(D),
    M = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), (e.prototype.add = function (t, e) {}), e;
    })(D),
    k = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), (e.prototype.record = function (t, e) {}), e;
    })(D),
    j = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), (e.prototype.record = function (t, e) {}), e;
    })(D),
    U = (function () {
      function t() {}
      return (
        (t.prototype.addCallback = function (t) {}),
        (t.prototype.removeCallback = function (t) {}),
        t
      );
    })(),
    B = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), e;
    })(U),
    F = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), e;
    })(U),
    H = (function (t) {
      function e() {
        return (null !== t && t.apply(this, arguments)) || this;
      }
      return P(e, t), e;
    })(U),
    V = new L(),
    $ = new I(),
    z = new k(),
    q = new j(),
    G = new M(),
    K = new B(),
    W = new F(),
    X = new H(),
    Q = {
      get: function (t, e) {
        if (null != t) return t[e];
      },
      keys: function (t) {
        return null == t ? [] : Object.keys(t);
      },
    },
    Y = {
      set: function (t, e, n) {
        null != t && (t[e] = n);
      },
    },
    Z = function (t, e) {
      var n = "function" == typeof Symbol && t[Symbol.iterator];
      if (!n) return t;
      var r,
        o,
        i = n.call(t),
        s = [];
      try {
        for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
          s.push(r.value);
      } catch (t) {
        o = { error: t };
      } finally {
        try {
          r && !r.done && (n = i.return) && n.call(i);
        } finally {
          if (o) throw o.error;
        }
      }
      return s;
    },
    J = function (t, e, n) {
      if (n || 2 === arguments.length)
        for (var r, o = 0, i = e.length; o < i; o++)
          (!r && o in e) ||
            (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
      return t.concat(r || Array.prototype.slice.call(e));
    },
    tt = (function () {
      function t() {}
      return (
        (t.prototype.active = function () {
          return x;
        }),
        (t.prototype.with = function (t, e, n) {
          for (var r = [], o = 3; o < arguments.length; o++)
            r[o - 3] = arguments[o];
          return e.call.apply(e, J([n], Z(r), !1));
        }),
        (t.prototype.bind = function (t, e) {
          return e;
        }),
        (t.prototype.enable = function () {
          return this;
        }),
        (t.prototype.disable = function () {
          return this;
        }),
        t
      );
    })(),
    et = function (t, e) {
      var n = "function" == typeof Symbol && t[Symbol.iterator];
      if (!n) return t;
      var r,
        o,
        i = n.call(t),
        s = [];
      try {
        for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
          s.push(r.value);
      } catch (t) {
        o = { error: t };
      } finally {
        try {
          r && !r.done && (n = i.return) && n.call(i);
        } finally {
          if (o) throw o.error;
        }
      }
      return s;
    },
    nt = function (t, e, n) {
      if (n || 2 === arguments.length)
        for (var r, o = 0, i = e.length; o < i; o++)
          (!r && o in e) ||
            (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
      return t.concat(r || Array.prototype.slice.call(e));
    },
    rt = "context",
    ot = new tt(),
    it = (function () {
      function t() {}
      return (
        (t.getInstance = function () {
          return this._instance || (this._instance = new t()), this._instance;
        }),
        (t.prototype.setGlobalContextManager = function (t) {
          return c(rt, t, y.instance());
        }),
        (t.prototype.active = function () {
          return this._getContextManager().active();
        }),
        (t.prototype.with = function (t, e, n) {
          for (var r, o = [], i = 3; i < arguments.length; i++)
            o[i - 3] = arguments[i];
          return (r = this._getContextManager()).with.apply(
            r,
            nt([t, e, n], et(o), !1)
          );
        }),
        (t.prototype.bind = function (t, e) {
          return this._getContextManager().bind(t, e);
        }),
        (t.prototype._getContextManager = function () {
          return l(rt) || ot;
        }),
        (t.prototype.disable = function () {
          this._getContextManager().disable(), p(rt, y.instance());
        }),
        t
      );
    })();
  !(function (t) {
    (t[(t.NONE = 0)] = "NONE"), (t[(t.SAMPLED = 1)] = "SAMPLED");
  })(R || (R = {}));
  var st = "0000000000000000",
    at = "00000000000000000000000000000000",
    ut = { traceId: at, spanId: st, traceFlags: R.NONE },
    ct = (function () {
      function t(t) {
        void 0 === t && (t = ut), (this._spanContext = t);
      }
      return (
        (t.prototype.spanContext = function () {
          return this._spanContext;
        }),
        (t.prototype.setAttribute = function (t, e) {
          return this;
        }),
        (t.prototype.setAttributes = function (t) {
          return this;
        }),
        (t.prototype.addEvent = function (t, e) {
          return this;
        }),
        (t.prototype.addLink = function (t) {
          return this;
        }),
        (t.prototype.addLinks = function (t) {
          return this;
        }),
        (t.prototype.setStatus = function (t) {
          return this;
        }),
        (t.prototype.updateName = function (t) {
          return this;
        }),
        (t.prototype.end = function (t) {}),
        (t.prototype.isRecording = function () {
          return !1;
        }),
        (t.prototype.recordException = function (t, e) {}),
        t
      );
    })(),
    lt = A("OpenTelemetry Context Key SPAN");
  function pt(t) {
    return t.getValue(lt) || void 0;
  }
  function dt() {
    return pt(it.getInstance().active());
  }
  function ht(t, e) {
    return t.setValue(lt, e);
  }
  function ft(t) {
    return t.deleteValue(lt);
  }
  function gt(t, e) {
    return ht(t, new ct(e));
  }
  function mt(t) {
    var e;
    return null === (e = pt(t)) || void 0 === e ? void 0 : e.spanContext();
  }
  var _t = /^([0-9a-f]{32})$/i,
    vt = /^[0-9a-f]{16}$/i;
  function yt(t) {
    return _t.test(t) && t !== at;
  }
  function St(t) {
    return yt(t.traceId) && ((e = t.spanId), vt.test(e) && e !== st);
    var e;
  }
  function bt(t) {
    return new ct(t);
  }
  var Et = it.getInstance(),
    Tt = (function () {
      function t() {}
      return (
        (t.prototype.startSpan = function (t, e, n) {
          if (
            (void 0 === n && (n = Et.active()),
            Boolean(null == e ? void 0 : e.root))
          )
            return new ct();
          var r,
            o = n && mt(n);
          return "object" == typeof (r = o) &&
            "string" == typeof r.spanId &&
            "string" == typeof r.traceId &&
            "number" == typeof r.traceFlags &&
            St(o)
            ? new ct(o)
            : new ct();
        }),
        (t.prototype.startActiveSpan = function (t, e, n, r) {
          var o, i, s;
          if (!(arguments.length < 2)) {
            2 === arguments.length
              ? (s = e)
              : 3 === arguments.length
              ? ((o = e), (s = n))
              : ((o = e), (i = n), (s = r));
            var a = null != i ? i : Et.active(),
              u = this.startSpan(t, o, a),
              c = ht(a, u);
            return Et.with(c, s, void 0, u);
          }
        }),
        t
      );
    })();
  var wt,
    Ct,
    At,
    Ot = new Tt(),
    Rt = (function () {
      function t(t, e, n, r) {
        (this._provider = t),
          (this.name = e),
          (this.version = n),
          (this.options = r);
      }
      return (
        (t.prototype.startSpan = function (t, e, n) {
          return this._getTracer().startSpan(t, e, n);
        }),
        (t.prototype.startActiveSpan = function (t, e, n, r) {
          var o = this._getTracer();
          return Reflect.apply(o.startActiveSpan, o, arguments);
        }),
        (t.prototype._getTracer = function () {
          if (this._delegate) return this._delegate;
          var t = this._provider.getDelegateTracer(
            this.name,
            this.version,
            this.options
          );
          return t ? ((this._delegate = t), this._delegate) : Ot;
        }),
        t
      );
    })(),
    Nt = new ((function () {
      function t() {}
      return (
        (t.prototype.getTracer = function (t, e, n) {
          return new Tt();
        }),
        t
      );
    })())(),
    xt = (function () {
      function t() {}
      return (
        (t.prototype.getTracer = function (t, e, n) {
          var r;
          return null !== (r = this.getDelegateTracer(t, e, n)) && void 0 !== r
            ? r
            : new Rt(this, t, e, n);
        }),
        (t.prototype.getDelegate = function () {
          var t;
          return null !== (t = this._delegate) && void 0 !== t ? t : Nt;
        }),
        (t.prototype.setDelegate = function (t) {
          this._delegate = t;
        }),
        (t.prototype.getDelegateTracer = function (t, e, n) {
          var r;
          return null === (r = this._delegate) || void 0 === r
            ? void 0
            : r.getTracer(t, e, n);
        }),
        t
      );
    })();
  !(function (t) {
    (t[(t.NOT_RECORD = 0)] = "NOT_RECORD"),
      (t[(t.RECORD = 1)] = "RECORD"),
      (t[(t.RECORD_AND_SAMPLED = 2)] = "RECORD_AND_SAMPLED");
  })(wt || (wt = {})),
    (function (t) {
      (t[(t.INTERNAL = 0)] = "INTERNAL"),
        (t[(t.SERVER = 1)] = "SERVER"),
        (t[(t.CLIENT = 2)] = "CLIENT"),
        (t[(t.PRODUCER = 3)] = "PRODUCER"),
        (t[(t.CONSUMER = 4)] = "CONSUMER");
    })(Ct || (Ct = {})),
    (function (t) {
      (t[(t.UNSET = 0)] = "UNSET"),
        (t[(t.OK = 1)] = "OK"),
        (t[(t.ERROR = 2)] = "ERROR");
    })(At || (At = {}));
  var Pt = it.getInstance(),
    Lt = y.instance(),
    Dt = new ((function () {
      function t() {}
      return (
        (t.prototype.getMeter = function (t, e, n) {
          return V;
        }),
        t
      );
    })())(),
    It = "metrics",
    Mt = (function () {
      function t() {}
      return (
        (t.getInstance = function () {
          return this._instance || (this._instance = new t()), this._instance;
        }),
        (t.prototype.setGlobalMeterProvider = function (t) {
          return c(It, t, y.instance());
        }),
        (t.prototype.getMeterProvider = function () {
          return l(It) || Dt;
        }),
        (t.prototype.getMeter = function (t, e, n) {
          return this.getMeterProvider().getMeter(t, e, n);
        }),
        (t.prototype.disable = function () {
          p(It, y.instance());
        }),
        t
      );
    })().getInstance(),
    kt = (function () {
      function t() {}
      return (
        (t.prototype.inject = function (t, e) {}),
        (t.prototype.extract = function (t, e) {
          return t;
        }),
        (t.prototype.fields = function () {
          return [];
        }),
        t
      );
    })(),
    jt = A("OpenTelemetry Baggage Key");
  function Ut(t) {
    return t.getValue(jt) || void 0;
  }
  function Bt() {
    return Ut(it.getInstance().active());
  }
  function Ft(t, e) {
    return t.setValue(jt, e);
  }
  function Ht(t) {
    return t.deleteValue(jt);
  }
  var Vt = "propagation",
    $t = new kt(),
    zt = (function () {
      function t() {
        (this.createBaggage = C),
          (this.getBaggage = Ut),
          (this.getActiveBaggage = Bt),
          (this.setBaggage = Ft),
          (this.deleteBaggage = Ht);
      }
      return (
        (t.getInstance = function () {
          return this._instance || (this._instance = new t()), this._instance;
        }),
        (t.prototype.setGlobalPropagator = function (t) {
          return c(Vt, t, y.instance());
        }),
        (t.prototype.inject = function (t, e, n) {
          return (
            void 0 === n && (n = Y), this._getGlobalPropagator().inject(t, e, n)
          );
        }),
        (t.prototype.extract = function (t, e, n) {
          return (
            void 0 === n && (n = Q),
            this._getGlobalPropagator().extract(t, e, n)
          );
        }),
        (t.prototype.fields = function () {
          return this._getGlobalPropagator().fields();
        }),
        (t.prototype.disable = function () {
          p(Vt, y.instance());
        }),
        (t.prototype._getGlobalPropagator = function () {
          return l(Vt) || $t;
        }),
        t
      );
    })(),
    qt = zt.getInstance(),
    Gt = "trace",
    Kt = (function () {
      function t() {
        (this._proxyTracerProvider = new xt()),
          (this.wrapSpanContext = bt),
          (this.isSpanContextValid = St),
          (this.deleteSpan = ft),
          (this.getSpan = pt),
          (this.getActiveSpan = dt),
          (this.getSpanContext = mt),
          (this.setSpan = ht),
          (this.setSpanContext = gt);
      }
      return (
        (t.getInstance = function () {
          return this._instance || (this._instance = new t()), this._instance;
        }),
        (t.prototype.setGlobalTracerProvider = function (t) {
          var e = c(Gt, this._proxyTracerProvider, y.instance());
          return e && this._proxyTracerProvider.setDelegate(t), e;
        }),
        (t.prototype.getTracerProvider = function () {
          return l(Gt) || this._proxyTracerProvider;
        }),
        (t.prototype.getTracer = function (t, e) {
          return this.getTracerProvider().getTracer(t, e);
        }),
        (t.prototype.disable = function () {
          p(Gt, y.instance()), (this._proxyTracerProvider = new xt());
        }),
        t
      );
    })().getInstance();
  const Wt = A("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
  function Xt(t) {
    return t.setValue(Wt, !0);
  }
  function Qt(t) {
    return !0 === t.getValue(Wt);
  }
  const Yt = "=",
    Zt = ";",
    Jt = ",",
    te = "baggage";
  function ee(t) {
    const e = t.split(Zt);
    if (e.length <= 0) return;
    const n = e.shift();
    if (!n) return;
    const r = n.indexOf(Yt);
    if (r <= 0) return;
    const o = decodeURIComponent(n.substring(0, r).trim()),
      i = decodeURIComponent(n.substring(r + 1).trim());
    let s;
    var a;
    return (
      e.length > 0 &&
        ("string" != typeof (a = e.join(Zt)) &&
          (w.error(
            "Cannot create baggage metadata from unknown type: " + typeof a
          ),
          (a = "")),
        (s = {
          __TYPE__: T,
          toString: function () {
            return a;
          },
        })),
      { key: o, value: i, metadata: s }
    );
  }
  class ne {
    inject(t, e, n) {
      const r = qt.getBaggage(t);
      if (!r || Qt(t)) return;
      const o = (function (t) {
          return t.getAllEntries().map(([t, e]) => {
            let n = `${encodeURIComponent(t)}=${encodeURIComponent(e.value)}`;
            return (
              void 0 !== e.metadata && (n += Zt + e.metadata.toString()), n
            );
          });
        })(r)
          .filter((t) => t.length <= 4096)
          .slice(0, 180),
        i = (function (t) {
          return t.reduce((t, e) => {
            const n = `${t}${"" !== t ? Jt : ""}${e}`;
            return n.length > 8192 ? t : n;
          }, "");
        })(o);
      i.length > 0 && n.set(e, te, i);
    }
    extract(t, e, n) {
      const r = n.get(e, te),
        o = Array.isArray(r) ? r.join(Jt) : r;
      if (!o) return t;
      const i = {};
      if (0 === o.length) return t;
      return (
        o.split(Jt).forEach((t) => {
          const e = ee(t);
          if (e) {
            const t = { value: e.value };
            e.metadata && (t.metadata = e.metadata), (i[e.key] = t);
          }
        }),
        0 === Object.entries(i).length
          ? t
          : qt.setBaggage(t, qt.createBaggage(i))
      );
    }
    fields() {
      return [te];
    }
  }
  function re(t) {
    const e = {};
    if ("object" != typeof t || null == t) return e;
    for (const [n, r] of Object.entries(t))
      oe(n)
        ? ie(r)
          ? Array.isArray(r)
            ? (e[n] = r.slice())
            : (e[n] = r)
          : Lt.warn(`Invalid attribute value set for key: ${n}`)
        : Lt.warn(`Invalid attribute key: ${n}`);
    return e;
  }
  function oe(t) {
    return "string" == typeof t && t.length > 0;
  }
  function ie(t) {
    return (
      null == t ||
      (Array.isArray(t)
        ? (function (t) {
            let e;
            for (const n of t)
              if (null != n) {
                if (!e) {
                  if (se(n)) {
                    e = typeof n;
                    continue;
                  }
                  return !1;
                }
                if (typeof n !== e) return !1;
              }
            return !0;
          })(t)
        : se(t))
    );
  }
  function se(t) {
    switch (typeof t) {
      case "number":
      case "boolean":
      case "string":
        return !0;
    }
    return !1;
  }
  function ae() {
    return (t) => {
      Lt.error(
        (function (t) {
          return "string" == typeof t
            ? t
            : JSON.stringify(
                (function (t) {
                  const e = {};
                  let n = t;
                  for (; null !== n; )
                    Object.getOwnPropertyNames(n).forEach((t) => {
                      if (e[t]) return;
                      const r = n[t];
                      r && (e[t] = String(r));
                    }),
                      (n = Object.getPrototypeOf(n));
                  return e;
                })(t)
              );
        })(t)
      );
    };
  }
  let ue = ae();
  function ce(t) {
    try {
      ue(t);
    } catch {}
  }
  function le(t) {}
  const pe =
      "object" == typeof globalThis
        ? globalThis
        : "object" == typeof self
        ? self
        : "object" == typeof window
        ? window
        : "object" == typeof global
        ? global
        : {},
    de = performance,
    he = "exception.type",
    fe = "exception.message",
    ge = "http.method",
    me = "http.url",
    _e = "http.host",
    ve = "http.scheme",
    ye = "http.status_code",
    Se = "http.user_agent",
    be = "http.request_content_length_uncompressed",
    Ee = "process.runtime.name",
    Te = "telemetry.sdk.name",
    we = "telemetry.sdk.language",
    Ce = "telemetry.sdk.version",
    Ae = "service.name",
    Oe = "telemetry.sdk.language",
    Re = "telemetry.sdk.name",
    Ne = "telemetry.sdk.version",
    xe = {
      [Te]: "opentelemetry",
      [Ee]: "browser",
      [we]: "webjs",
      [Ce]: "2.0.0",
    };
  function Pe(t) {}
  const Le = Math.pow(10, 6),
    De = Math.pow(10, 9);
  function Ie(t) {
    const e = t / 1e3;
    return [Math.trunc(e), Math.round((t % 1e3) * Le)];
  }
  function Me() {
    let t = de.timeOrigin;
    if ("number" != typeof t) {
      const e = de;
      t = e.timing && e.timing.fetchStart;
    }
    return t;
  }
  function ke(t) {
    return Ve(Ie(Me()), Ie("number" == typeof t ? t : de.now()));
  }
  function je(t) {
    if (Fe(t)) return t;
    if ("number" == typeof t) return t < Me() ? ke(t) : Ie(t);
    if (t instanceof Date) return Ie(t.getTime());
    throw TypeError("Invalid input type");
  }
  function Ue(t, e) {
    let n = e[0] - t[0],
      r = e[1] - t[1];
    return r < 0 && ((n -= 1), (r += De)), [n, r];
  }
  function Be(t) {
    return t[0] * De + t[1];
  }
  function Fe(t) {
    return (
      Array.isArray(t) &&
      2 === t.length &&
      "number" == typeof t[0] &&
      "number" == typeof t[1]
    );
  }
  function He(t) {
    return Fe(t) || "number" == typeof t || t instanceof Date;
  }
  function Ve(t, e) {
    const n = [t[0] + e[0], t[1] + e[1]];
    return n[1] >= De && ((n[1] -= De), (n[0] += 1)), n;
  }
  var $e;
  !(function (t) {
    (t[(t.SUCCESS = 0)] = "SUCCESS"), (t[(t.FAILED = 1)] = "FAILED");
  })($e || ($e = {}));
  class ze {
    _propagators;
    _fields;
    constructor(t = {}) {
      (this._propagators = t.propagators ?? []),
        (this._fields = Array.from(
          new Set(
            this._propagators
              .map((t) => ("function" == typeof t.fields ? t.fields() : []))
              .reduce((t, e) => t.concat(e), [])
          )
        ));
    }
    inject(t, e, n) {
      for (const r of this._propagators)
        try {
          r.inject(t, e, n);
        } catch (t) {
          Lt.warn(
            `Failed to inject with ${r.constructor.name}. Err: ${t.message}`
          );
        }
    }
    extract(t, e, n) {
      return this._propagators.reduce((t, r) => {
        try {
          return r.extract(t, e, n);
        } catch (t) {
          Lt.warn(
            `Failed to extract with ${r.constructor.name}. Err: ${t.message}`
          );
        }
        return t;
      }, t);
    }
    fields() {
      return this._fields.slice();
    }
  }
  const qe = "[_0-9a-z-*/]",
    Ge = new RegExp(
      `^(?:${`[a-z]${qe}{0,255}`}|${`[a-z0-9]${qe}{0,240}@[a-z]${qe}{0,13}`})$`
    ),
    Ke = /^[ -~]{0,255}[!-~]$/,
    We = /,|=/;
  class Xe {
    _internalState = new Map();
    constructor(t) {
      t && this._parse(t);
    }
    set(t, e) {
      const n = this._clone();
      return (
        n._internalState.has(t) && n._internalState.delete(t),
        n._internalState.set(t, e),
        n
      );
    }
    unset(t) {
      const e = this._clone();
      return e._internalState.delete(t), e;
    }
    get(t) {
      return this._internalState.get(t);
    }
    serialize() {
      return this._keys()
        .reduce((t, e) => (t.push(e + "=" + this.get(e)), t), [])
        .join(",");
    }
    _parse(t) {
      t.length > 512 ||
        ((this._internalState = t
          .split(",")
          .reverse()
          .reduce((t, e) => {
            const n = e.trim(),
              r = n.indexOf("=");
            if (-1 !== r) {
              const o = n.slice(0, r),
                i = n.slice(r + 1, e.length);
              (function (t) {
                return Ge.test(t);
              })(o) &&
                (function (t) {
                  return Ke.test(t) && !We.test(t);
                })(i) &&
                t.set(o, i);
            }
            return t;
          }, new Map())),
        this._internalState.size > 32 &&
          (this._internalState = new Map(
            Array.from(this._internalState.entries()).reverse().slice(0, 32)
          )));
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
      const t = new Xe();
      return (t._internalState = new Map(this._internalState)), t;
    }
  }
  const Qe = "traceparent",
    Ye = "tracestate",
    Ze = new RegExp(
      "^\\s?((?!ff)[\\da-f]{2})-((?![0]{32})[\\da-f]{32})-((?![0]{16})[\\da-f]{16})-([\\da-f]{2})(-.*)?\\s?$"
    );
  function Je(t) {
    const e = Ze.exec(t);
    return e
      ? "00" === e[1] && e[5]
        ? null
        : { traceId: e[2], spanId: e[3], traceFlags: parseInt(e[4], 16) }
      : null;
  }
  class tn {
    inject(t, e, n) {
      const r = Kt.getSpanContext(t);
      if (!r || Qt(t) || !St(r)) return;
      const o = `00-${r.traceId}-${r.spanId}-0${Number(
        r.traceFlags || R.NONE
      ).toString(16)}`;
      n.set(e, Qe, o), r.traceState && n.set(e, Ye, r.traceState.serialize());
    }
    extract(t, e, n) {
      const r = n.get(e, Qe);
      if (!r) return t;
      const o = Array.isArray(r) ? r[0] : r;
      if ("string" != typeof o) return t;
      const i = Je(o);
      if (!i) return t;
      i.isRemote = !0;
      const s = n.get(e, Ye);
      if (s) {
        const t = Array.isArray(s) ? s.join(",") : s;
        i.traceState = new Xe("string" == typeof t ? t : void 0);
      }
      return Kt.setSpanContext(t, i);
    }
    fields() {
      return [Qe, Ye];
    }
  }
  const en = A("OpenTelemetry SDK Context Key RPC_METADATA");
  var nn;
  !(function (t) {
    t.HTTP = "http";
  })(nn || (nn = {}));
  const rn = "[object Object]",
    on = "[object Null]",
    sn = "[object Undefined]",
    an = Function.prototype.toString,
    un = an.call(Object),
    cn = Object.getPrototypeOf,
    ln = Object.prototype,
    pn = ln.hasOwnProperty,
    dn = Symbol ? Symbol.toStringTag : void 0,
    hn = ln.toString;
  function fn(t) {
    if (
      !(function (t) {
        return null != t && "object" == typeof t;
      })(t) ||
      (function (t) {
        if (null == t) return void 0 === t ? sn : on;
        return dn && dn in Object(t)
          ? (function (t) {
              const e = pn.call(t, dn),
                n = t[dn];
              let r = !1;
              try {
                (t[dn] = void 0), (r = !0);
              } catch (t) {}
              const o = hn.call(t);
              r && (e ? (t[dn] = n) : delete t[dn]);
              return o;
            })(t)
          : (function (t) {
              return hn.call(t);
            })(t);
      })(t) !== rn
    )
      return !1;
    const e = cn(t);
    if (null === e) return !0;
    const n = pn.call(e, "constructor") && e.constructor;
    return "function" == typeof n && n instanceof n && an.call(n) === un;
  }
  const gn = 20;
  function mn(...t) {
    let e = t.shift();
    const n = new WeakMap();
    for (; t.length > 0; ) e = vn(e, t.shift(), 0, n);
    return e;
  }
  function _n(t) {
    return Sn(t) ? t.slice() : t;
  }
  function vn(t, e, n = 0, r) {
    let o;
    if (!(n > gn)) {
      if ((n++, Tn(t) || Tn(e) || bn(e))) o = _n(e);
      else if (Sn(t)) {
        if (((o = t.slice()), Sn(e)))
          for (let t = 0, n = e.length; t < n; t++) o.push(_n(e[t]));
        else if (En(e)) {
          const t = Object.keys(e);
          for (let n = 0, r = t.length; n < r; n++) {
            const r = t[n];
            o[r] = _n(e[r]);
          }
        }
      } else if (En(t))
        if (En(e)) {
          if (
            !(function (t, e) {
              if (!fn(t) || !fn(e)) return !1;
              return !0;
            })(t, e)
          )
            return e;
          o = Object.assign({}, t);
          const i = Object.keys(e);
          for (let s = 0, a = i.length; s < a; s++) {
            const a = i[s],
              u = e[a];
            if (Tn(u)) void 0 === u ? delete o[a] : (o[a] = u);
            else {
              const i = o[a],
                s = u;
              if (yn(t, a, r) || yn(e, a, r)) delete o[a];
              else {
                if (En(i) && En(s)) {
                  const n = r.get(i) || [],
                    o = r.get(s) || [];
                  n.push({ obj: t, key: a }),
                    o.push({ obj: e, key: a }),
                    r.set(i, n),
                    r.set(s, o);
                }
                o[a] = vn(o[a], u, n, r);
              }
            }
          }
        } else o = e;
      return o;
    }
  }
  function yn(t, e, n) {
    const r = n.get(t[e]) || [];
    for (let n = 0, o = r.length; n < o; n++) {
      const o = r[n];
      if (o.key === e && o.obj === t) return !0;
    }
    return !1;
  }
  function Sn(t) {
    return Array.isArray(t);
  }
  function bn(t) {
    return "function" == typeof t;
  }
  function En(t) {
    return !Tn(t) && !Sn(t) && !bn(t) && "object" == typeof t;
  }
  function Tn(t) {
    return (
      "string" == typeof t ||
      "number" == typeof t ||
      "boolean" == typeof t ||
      void 0 === t ||
      t instanceof Date ||
      t instanceof RegExp ||
      null === t
    );
  }
  class wn extends Error {
    constructor(t) {
      super(t), Object.setPrototypeOf(this, wn.prototype);
    }
  }
  function Cn(t, e) {
    return "string" == typeof e ? t === e : !!t.match(e);
  }
  function An(t, e) {
    if (!e) return !1;
    for (const n of e) if (Cn(t, n)) return !0;
    return !1;
  }
  class On {
    _promise;
    _resolve;
    _reject;
    constructor() {
      this._promise = new Promise((t, e) => {
        (this._resolve = t), (this._reject = e);
      });
    }
    get promise() {
      return this._promise;
    }
    resolve(t) {
      this._resolve(t);
    }
    reject(t) {
      this._reject(t);
    }
  }
  class Rn {
    _callback;
    _that;
    _isCalled = !1;
    _deferred = new On();
    constructor(t, e) {
      (this._callback = t), (this._that = e);
    }
    get isCalled() {
      return this._isCalled;
    }
    get promise() {
      return this._deferred.promise;
    }
    call(...t) {
      if (!this._isCalled) {
        this._isCalled = !0;
        try {
          Promise.resolve(this._callback.call(this._that, ...t)).then(
            (t) => this._deferred.resolve(t),
            (t) => this._deferred.reject(t)
          );
        } catch (t) {
          this._deferred.reject(t);
        }
      }
      return this._deferred.promise;
    }
  }
  const Nn = {
    ALL: d.ALL,
    VERBOSE: d.VERBOSE,
    DEBUG: d.DEBUG,
    INFO: d.INFO,
    WARN: d.WARN,
    ERROR: d.ERROR,
    NONE: d.NONE,
  };
  const xn = {
    _export: function (t, e) {
      return new Promise((n) => {
        Pt.with(Xt(Pt.active()), () => {
          t.export(e, (t) => {
            n(t);
          });
        });
      });
    },
  };
  var Pn = Object.freeze({
    __proto__: null,
    AnchoredClock: class {
      _monotonicClock;
      _epochMillis;
      _performanceMillis;
      constructor(t, e) {
        (this._monotonicClock = e),
          (this._epochMillis = t.now()),
          (this._performanceMillis = e.now());
      }
      now() {
        const t = this._monotonicClock.now() - this._performanceMillis;
        return this._epochMillis + t;
      }
    },
    BindOnceFuture: Rn,
    CompositePropagator: ze,
    get ExportResultCode() {
      return $e;
    },
    get RPCType() {
      return nn;
    },
    SDK_INFO: xe,
    TRACE_PARENT_HEADER: Qe,
    TRACE_STATE_HEADER: Ye,
    TimeoutError: wn,
    TraceState: Xe,
    W3CBaggagePropagator: ne,
    W3CTraceContextPropagator: tn,
    _globalThis: pe,
    addHrTimes: Ve,
    callWithTimeout: function (t, e) {
      let n;
      const r = new Promise(function (t, r) {
        n = setTimeout(function () {
          r(new wn("Operation timed out."));
        }, e);
      });
      return Promise.race([t, r]).then(
        (t) => (clearTimeout(n), t),
        (t) => {
          throw (clearTimeout(n), t);
        }
      );
    },
    deleteRPCMetadata: function (t) {
      return t.deleteValue(en);
    },
    diagLogLevelFromString: function (t) {
      if (null == t) return;
      const e = Nn[t.toUpperCase()];
      return null == e
        ? (Lt.warn(
            `Unknown log level "${t}", expected one of ${Object.keys(
              Nn
            )}, using default`
          ),
          d.INFO)
        : e;
    },
    getBooleanFromEnv: function (t) {},
    getNumberFromEnv: le,
    getRPCMetadata: function (t) {
      return t.getValue(en);
    },
    getStringFromEnv: function (t) {},
    getStringListFromEnv: function (t) {},
    getTimeOrigin: Me,
    globalErrorHandler: ce,
    hrTime: ke,
    hrTimeDuration: Ue,
    hrTimeToMicroseconds: function (t) {
      return 1e6 * t[0] + t[1] / 1e3;
    },
    hrTimeToMilliseconds: function (t) {
      return 1e3 * t[0] + t[1] / 1e6;
    },
    hrTimeToNanoseconds: Be,
    hrTimeToTimeStamp: function (t) {
      const e = `${"0".repeat(9)}${t[1]}Z`,
        n = e.substring(e.length - 9 - 1);
      return new Date(1e3 * t[0]).toISOString().replace("000Z", n);
    },
    internal: xn,
    isAttributeValue: ie,
    isTimeInput: He,
    isTimeInputHrTime: Fe,
    isTracingSuppressed: Qt,
    isUrlIgnored: An,
    loggingErrorHandler: ae,
    merge: mn,
    millisToHrTime: Ie,
    otperformance: de,
    parseKeyPairsIntoRecord: function (t) {
      return "string" != typeof t || 0 === t.length
        ? {}
        : t
            .split(Jt)
            .map((t) => ee(t))
            .filter((t) => void 0 !== t && t.value.length > 0)
            .reduce((t, e) => ((t[e.key] = e.value), t), {});
    },
    parseTraceParent: Je,
    sanitizeAttributes: re,
    setGlobalErrorHandler: function (t) {
      ue = t;
    },
    setRPCMetadata: function (t, e) {
      return t.setValue(en, e);
    },
    suppressTracing: Xt,
    timeInputToHrTime: je,
    unrefTimer: Pe,
    unsuppressTracing: function (t) {
      return t.deleteValue(Wt);
    },
    urlMatches: Cn,
  });
  function Ln(t) {
    if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
    var e = t.default;
    if ("function" == typeof e) {
      var n = function t() {
        return this instanceof t
          ? Reflect.construct(e, arguments, this.constructor)
          : e.apply(this, arguments);
      };
      n.prototype = e.prototype;
    } else n = {};
    return (
      Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.keys(t).forEach(function (e) {
        var r = Object.getOwnPropertyDescriptor(t, e);
        Object.defineProperty(
          n,
          e,
          r.get
            ? r
            : {
                enumerable: !0,
                get: function () {
                  return t[e];
                },
              }
        );
      }),
      n
    );
  }
  var Dn,
    In = {},
    Mn = {};
  function kn() {
    if (Dn) return Mn;
    function t(t) {
      return Object.keys(t).map((n) => e(n, t[n]));
    }
    function e(t, e) {
      return { key: t, value: n(e) };
    }
    function n(t) {
      const r = typeof t;
      return "string" === r
        ? { stringValue: t }
        : "number" === r
        ? Number.isInteger(t)
          ? { intValue: t }
          : { doubleValue: t }
        : "boolean" === r
        ? { boolValue: t }
        : t instanceof Uint8Array
        ? { bytesValue: t }
        : Array.isArray(t)
        ? { arrayValue: { values: t.map(n) } }
        : "object" === r && null != t
        ? {
            kvlistValue: { values: Object.entries(t).map(([t, n]) => e(t, n)) },
          }
        : {};
    }
    return (
      (Dn = 1),
      Object.defineProperty(Mn, "__esModule", { value: !0 }),
      (Mn.toAnyValue =
        Mn.toKeyValue =
        Mn.toAttributes =
        Mn.createInstrumentationScope =
        Mn.createResource =
          void 0),
      (Mn.createResource = function (e) {
        return { attributes: t(e.attributes), droppedAttributesCount: 0 };
      }),
      (Mn.createInstrumentationScope = function (t) {
        return { name: t.name, version: t.version };
      }),
      (Mn.toAttributes = t),
      (Mn.toKeyValue = e),
      (Mn.toAnyValue = n),
      Mn
    );
  }
  var jn,
    Un,
    Bn,
    Fn = {},
    Hn = Ln(Pn),
    Vn = {};
  function $n() {
    if (jn) return Vn;
    function t(t) {
      return t >= 48 && t <= 57
        ? t - 48
        : t >= 97 && t <= 102
        ? t - 87
        : t - 55;
    }
    return (
      (jn = 1),
      Object.defineProperty(Vn, "__esModule", { value: !0 }),
      (Vn.hexToBinary = void 0),
      (Vn.hexToBinary = function (e) {
        const n = new Uint8Array(e.length / 2);
        let r = 0;
        for (let o = 0; o < e.length; o += 2) {
          const i = t(e.charCodeAt(o)),
            s = t(e.charCodeAt(o + 1));
          n[r++] = (i << 4) | s;
        }
        return n;
      }),
      Vn
    );
  }
  function zn() {
    if (Un) return Fn;
    (Un = 1),
      Object.defineProperty(Fn, "__esModule", { value: !0 }),
      (Fn.getOtlpEncoder =
        Fn.encodeAsString =
        Fn.encodeAsLongBits =
        Fn.toLongBits =
        Fn.hrTimeToNanos =
          void 0);
    const t = Hn,
      e = $n();
    function n(t) {
      const e = BigInt(1e9);
      return BigInt(t[0]) * e + BigInt(t[1]);
    }
    function r(t) {
      return {
        low: Number(BigInt.asUintN(32, t)),
        high: Number(BigInt.asUintN(32, t >> BigInt(32))),
      };
    }
    function o(t) {
      return r(n(t));
    }
    function i(t) {
      return n(t).toString();
    }
    (Fn.hrTimeToNanos = n),
      (Fn.toLongBits = r),
      (Fn.encodeAsLongBits = o),
      (Fn.encodeAsString = i);
    const s = "undefined" != typeof BigInt ? i : t.hrTimeToNanoseconds;
    function a(t) {
      return t;
    }
    function u(t) {
      if (void 0 !== t) return (0, e.hexToBinary)(t);
    }
    const c = {
      encodeHrTime: o,
      encodeSpanContext: e.hexToBinary,
      encodeOptionalSpanContext: u,
    };
    return (
      (Fn.getOtlpEncoder = function (t) {
        if (void 0 === t) return c;
        const n = t.useLongBits ?? !0,
          r = t.useHex ?? !1;
        return {
          encodeHrTime: n ? o : s,
          encodeSpanContext: r ? a : e.hexToBinary,
          encodeOptionalSpanContext: r ? a : u,
        };
      }),
      Fn
    );
  }
  function qn() {
    if (Bn) return In;
    (Bn = 1),
      Object.defineProperty(In, "__esModule", { value: !0 }),
      (In.createExportTraceServiceRequest =
        In.toOtlpSpanEvent =
        In.toOtlpLink =
        In.sdkSpanToOtlpSpan =
          void 0);
    const t = kn(),
      e = zn();
    function n(e, n) {
      const i = e.spanContext(),
        s = e.status,
        a = e.parentSpanContext?.spanId
          ? n.encodeSpanContext(e.parentSpanContext?.spanId)
          : void 0;
      return {
        traceId: n.encodeSpanContext(i.traceId),
        spanId: n.encodeSpanContext(i.spanId),
        parentSpanId: a,
        traceState: i.traceState?.serialize(),
        name: e.name,
        kind: null == e.kind ? 0 : e.kind + 1,
        startTimeUnixNano: n.encodeHrTime(e.startTime),
        endTimeUnixNano: n.encodeHrTime(e.endTime),
        attributes: (0, t.toAttributes)(e.attributes),
        droppedAttributesCount: e.droppedAttributesCount,
        events: e.events.map((t) => o(t, n)),
        droppedEventsCount: e.droppedEventsCount,
        status: { code: s.code, message: s.message },
        links: e.links.map((t) => r(t, n)),
        droppedLinksCount: e.droppedLinksCount,
      };
    }
    function r(e, n) {
      return {
        attributes: e.attributes ? (0, t.toAttributes)(e.attributes) : [],
        spanId: n.encodeSpanContext(e.context.spanId),
        traceId: n.encodeSpanContext(e.context.traceId),
        traceState: e.context.traceState?.serialize(),
        droppedAttributesCount: e.droppedAttributesCount || 0,
      };
    }
    function o(e, n) {
      return {
        attributes: e.attributes ? (0, t.toAttributes)(e.attributes) : [],
        name: e.name,
        timeUnixNano: n.encodeHrTime(e.time),
        droppedAttributesCount: e.droppedAttributesCount || 0,
      };
    }
    function i(e, r) {
      const o = (function (t) {
          const e = new Map();
          for (const n of t) {
            let t = e.get(n.resource);
            t || ((t = new Map()), e.set(n.resource, t));
            const r = `${n.instrumentationScope.name}@${
              n.instrumentationScope.version || ""
            }:${n.instrumentationScope.schemaUrl || ""}`;
            let o = t.get(r);
            o || ((o = []), t.set(r, o)), o.push(n);
          }
          return e;
        })(e),
        i = [],
        s = o.entries();
      let a = s.next();
      for (; !a.done; ) {
        const [e, o] = a.value,
          u = [],
          c = o.values();
        let l = c.next();
        for (; !l.done; ) {
          const e = l.value;
          if (e.length > 0) {
            const o = e.map((t) => n(t, r));
            u.push({
              scope: (0, t.createInstrumentationScope)(
                e[0].instrumentationScope
              ),
              spans: o,
              schemaUrl: e[0].instrumentationScope.schemaUrl,
            });
          }
          l = c.next();
        }
        const p = {
          resource: (0, t.createResource)(e),
          scopeSpans: u,
          schemaUrl: void 0,
        };
        i.push(p), (a = s.next());
      }
      return i;
    }
    return (
      (In.sdkSpanToOtlpSpan = n),
      (In.toOtlpLink = r),
      (In.toOtlpSpanEvent = o),
      (In.createExportTraceServiceRequest = function (t, n) {
        return { resourceSpans: i(t, (0, e.getOtlpEncoder)(n)) };
      }),
      In
    );
  }
  var Gn,
    Kn = qn(),
    Wn = {};
  function Xn() {
    return (
      Gn ||
        ((Gn = 1),
        (function (t) {
          var e;
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ESpanKind = void 0),
            ((e = t.ESpanKind || (t.ESpanKind = {}))[
              (e.SPAN_KIND_UNSPECIFIED = 0)
            ] = "SPAN_KIND_UNSPECIFIED"),
            (e[(e.SPAN_KIND_INTERNAL = 1)] = "SPAN_KIND_INTERNAL"),
            (e[(e.SPAN_KIND_SERVER = 2)] = "SPAN_KIND_SERVER"),
            (e[(e.SPAN_KIND_CLIENT = 3)] = "SPAN_KIND_CLIENT"),
            (e[(e.SPAN_KIND_PRODUCER = 4)] = "SPAN_KIND_PRODUCER"),
            (e[(e.SPAN_KIND_CONSUMER = 5)] = "SPAN_KIND_CONSUMER");
        })(Wn)),
      Wn
    );
  }
  var Qn = Xn();
  class Yn {
    constructor(t) {
      this.config = t;
    }
    export(t, n) {
      const r = Kn.createExportTraceServiceRequest(t, {
        useHex: !0,
        useLongBits: !1,
      });
      this.config.api.pushTraces(r),
        (function (t = []) {
          var n, r;
          for (const o of t) {
            const { scopeSpans: t } = o;
            for (const o of t) {
              const { scope: t, spans: i = [] } = o;
              for (const o of i) {
                if (o.kind !== Qn.ESpanKind.SPAN_KIND_CLIENT) continue;
                const i = {
                    traceId: o.traceId.toString(),
                    spanId: o.spanId.toString(),
                  },
                  s = {};
                for (const t of o.attributes)
                  s[t.key] = String(Object.values(t.value)[0]);
                Number.isNaN(o.endTimeUnixNano) ||
                  Number.isNaN(o.startTimeUnixNano) ||
                  (s.duration_ns = String(
                    Number(o.endTimeUnixNano) - Number(o.startTimeUnixNano)
                  ));
                const a = (
                  null !== (n = null == t ? void 0 : t.name) && void 0 !== n
                    ? n
                    : ""
                ).indexOf("-");
                let u = e.unknownString;
                (null == t ? void 0 : t.name) &&
                  (-1 === a &&
                    (u =
                      null !== (r = t.name.split("/")[1]) && void 0 !== r
                        ? r
                        : t.name),
                  a > -1 && (u = null == t ? void 0 : t.name.substring(a + 1))),
                  e.faro.api.pushEvent(`faro.tracing.${u}`, s, void 0, {
                    spanContext: i,
                    timestampOverwriteMs: Number(o.endTimeUnixNano) / 1e6,
                    customPayloadTransformer: (t) => {
                      var e, n;
                      return (
                        null != s["faro.action.user.name"] &&
                          null != s["faro.action.user.parentId"] &&
                          ((t.action = {
                            name: s["faro.action.user.name"],
                            parentId: s["faro.action.user.parentId"],
                          }),
                          null === (e = t.attributes) ||
                            void 0 === e ||
                            delete e["faro.action.user.name"],
                          null === (n = t.attributes) ||
                            void 0 === n ||
                            delete n["faro.action.user.parentId"]),
                        t
                      );
                    },
                  });
              }
            }
          }
        })(r.resourceSpans),
        n({ code: $e.SUCCESS });
    }
    shutdown() {
      return Promise.resolve(void 0);
    }
  }
  const Zn = "session.id";
  "function" == typeof SuppressedError && SuppressedError;
  class Jn {
    emit(t) {}
  }
  const tr = new Jn();
  const er = new (class {
    getLogger(t, e, n) {
      return new Jn();
    }
  })();
  class nr {
    constructor(t, e, n, r) {
      (this._provider = t),
        (this.name = e),
        (this.version = n),
        (this.options = r);
    }
    emit(t) {
      this._getLogger().emit(t);
    }
    _getLogger() {
      if (this._delegate) return this._delegate;
      const t = this._provider.getDelegateLogger(
        this.name,
        this.version,
        this.options
      );
      return t ? ((this._delegate = t), this._delegate) : tr;
    }
  }
  class rr {
    getLogger(t, e, n) {
      var r;
      return null !== (r = this.getDelegateLogger(t, e, n)) && void 0 !== r
        ? r
        : new nr(this, t, e, n);
    }
    getDelegate() {
      var t;
      return null !== (t = this._delegate) && void 0 !== t ? t : er;
    }
    setDelegate(t) {
      this._delegate = t;
    }
    getDelegateLogger(t, e, n) {
      var r;
      return null === (r = this._delegate) || void 0 === r
        ? void 0
        : r.getLogger(t, e, n);
    }
  }
  const or =
      "object" == typeof globalThis
        ? globalThis
        : "object" == typeof self
        ? self
        : "object" == typeof window
        ? window
        : "object" == typeof global
        ? global
        : {},
    ir = Symbol.for("io.opentelemetry.js.api.logs"),
    sr = or;
  class ar {
    constructor() {
      this._proxyLoggerProvider = new rr();
    }
    static getInstance() {
      return this._instance || (this._instance = new ar()), this._instance;
    }
    setGlobalLoggerProvider(t) {
      return sr[ir]
        ? this.getLoggerProvider()
        : ((sr[ir] = ((e = 1), (n = t), (r = er), (t) => (t === e ? n : r))),
          this._proxyLoggerProvider.setDelegate(t),
          t);
      var e, n, r;
    }
    getLoggerProvider() {
      var t, e;
      return null !==
        (e = null === (t = sr[ir]) || void 0 === t ? void 0 : t.call(sr, 1)) &&
        void 0 !== e
        ? e
        : this._proxyLoggerProvider;
    }
    getLogger(t, e, n) {
      return this.getLoggerProvider().getLogger(t, e, n);
    }
    disable() {
      delete sr[ir], (this._proxyLoggerProvider = new rr());
    }
  }
  const ur = ar.getInstance();
  var cr, lr;
  var pr = (function () {
    if (lr) return cr;
    function t(t) {
      return "function" == typeof t;
    }
    lr = 1;
    var e = console.error.bind(console);
    function n(t, e, n) {
      var r = !!t[e] && t.propertyIsEnumerable(e);
      Object.defineProperty(t, e, {
        configurable: !0,
        enumerable: r,
        writable: !0,
        value: n,
      });
    }
    function r(n) {
      n &&
        n.logger &&
        (t(n.logger)
          ? (e = n.logger)
          : e("new logger isn't a function, not replacing"));
    }
    function o(r, o, i) {
      if (r && r[o]) {
        if (!i) return e("no wrapper function"), void e(new Error().stack);
        if (t(r[o]) && t(i)) {
          var s = r[o],
            a = i(s, o);
          return (
            n(a, "__original", s),
            n(a, "__unwrap", function () {
              r[o] === a && n(r, o, s);
            }),
            n(a, "__wrapped", !0),
            n(r, o, a),
            a
          );
        }
        e("original object and wrapper must be functions");
      } else e("no original function " + o + " to wrap");
    }
    function i(t, n) {
      return t && t[n]
        ? t[n].__unwrap
          ? t[n].__unwrap()
          : void e(
              "no original to unwrap to -- has " +
                n +
                " already been unwrapped?"
            )
        : (e("no function to unwrap."), void e(new Error().stack));
    }
    return (
      (r.wrap = o),
      (r.massWrap = function (t, n, r) {
        if (!t)
          return (
            e("must provide one or more modules to patch"),
            void e(new Error().stack)
          );
        Array.isArray(t) || (t = [t]),
          n && Array.isArray(n)
            ? t.forEach(function (t) {
                n.forEach(function (e) {
                  o(t, e, r);
                });
              })
            : e("must provide one or more functions to wrap on modules");
      }),
      (r.unwrap = i),
      (r.massUnwrap = function (t, n) {
        if (!t)
          return (
            e("must provide one or more modules to patch"),
            void e(new Error().stack)
          );
        Array.isArray(t) || (t = [t]),
          n && Array.isArray(n)
            ? t.forEach(function (t) {
                n.forEach(function (e) {
                  i(t, e);
                });
              })
            : e("must provide one or more functions to unwrap on modules");
      }),
      (cr = r)
    );
  })();
  class dr {
    instrumentationName;
    instrumentationVersion;
    _config = {};
    _tracer;
    _meter;
    _logger;
    _diag;
    constructor(t, e, n) {
      (this.instrumentationName = t),
        (this.instrumentationVersion = e),
        this.setConfig(n),
        (this._diag = Lt.createComponentLogger({ namespace: t })),
        (this._tracer = Kt.getTracer(t, e)),
        (this._meter = Mt.getMeter(t, e)),
        (this._logger = ur.getLogger(t, e)),
        this._updateMetricInstruments();
    }
    _wrap = pr.wrap;
    _unwrap = pr.unwrap;
    _massWrap = pr.massWrap;
    _massUnwrap = pr.massUnwrap;
    get meter() {
      return this._meter;
    }
    setMeterProvider(t) {
      (this._meter = t.getMeter(
        this.instrumentationName,
        this.instrumentationVersion
      )),
        this._updateMetricInstruments();
    }
    get logger() {
      return this._logger;
    }
    setLoggerProvider(t) {
      this._logger = t.getLogger(
        this.instrumentationName,
        this.instrumentationVersion
      );
    }
    getModuleDefinitions() {
      const t = this.init() ?? [];
      return Array.isArray(t) ? t : [t];
    }
    _updateMetricInstruments() {}
    getConfig() {
      return this._config;
    }
    setConfig(t) {
      this._config = { enabled: !0, ...t };
    }
    setTracerProvider(t) {
      this._tracer = t.getTracer(
        this.instrumentationName,
        this.instrumentationVersion
      );
    }
    get tracer() {
      return this._tracer;
    }
    _runSpanCustomizationHook(t, e, n, r) {
      if (t)
        try {
          t(n, r);
        } catch (t) {
          this._diag.error(
            "Error running span customization hook due to exception in handler",
            { triggerName: e },
            t
          );
        }
    }
  }
  class hr extends dr {
    constructor(t, e, n) {
      super(t, e, n), this._config.enabled && this.enable();
    }
  }
  function fr(t, e, n) {
    let r, o;
    try {
      o = t();
    } catch (t) {
      r = t;
    } finally {
      return e(r, o), o;
    }
  }
  function gr(t) {
    return (
      "function" == typeof t &&
      "function" == typeof t.__original &&
      "function" == typeof t.__unwrap &&
      !0 === t.__wrapped
    );
  }
  const mr = (t) =>
    null !== t && "object" == typeof t && "function" == typeof t.then;
  class _r {
    _rawAttributes;
    _asyncAttributesPending = !1;
    _memoizedAttributes;
    static FromAttributeList(t) {
      const e = new _r({});
      return (
        (e._rawAttributes = t),
        (e._asyncAttributesPending = t.filter(([t, e]) => mr(e)).length > 0),
        e
      );
    }
    constructor(t) {
      const e = t.attributes ?? {};
      this._rawAttributes = Object.entries(e).map(
        ([t, e]) => (mr(e) && (this._asyncAttributesPending = !0), [t, e])
      );
    }
    get asyncAttributesPending() {
      return this._asyncAttributesPending;
    }
    async waitForAsyncAttributes() {
      if (this.asyncAttributesPending) {
        for (let t = 0; t < this._rawAttributes.length; t++) {
          const [e, n] = this._rawAttributes[t];
          try {
            this._rawAttributes[t] = [e, mr(n) ? await n : n];
          } catch (n) {
            Lt.debug("a resource's async attributes promise rejected: %s", n),
              (this._rawAttributes[t] = [e, void 0]);
          }
        }
        this._asyncAttributesPending = !1;
      }
    }
    get attributes() {
      if (
        (this.asyncAttributesPending &&
          Lt.error(
            "Accessing resource attributes before async attributes settled"
          ),
        this._memoizedAttributes)
      )
        return this._memoizedAttributes;
      const t = {};
      for (const [e, n] of this._rawAttributes)
        mr(n)
          ? Lt.debug(`Unsettled resource attribute ${e} skipped`)
          : null != n && (t[e] ??= n);
      return this._asyncAttributesPending || (this._memoizedAttributes = t), t;
    }
    getRawAttributes() {
      return this._rawAttributes;
    }
    merge(t) {
      return null == t
        ? this
        : _r.FromAttributeList([
            ...t.getRawAttributes(),
            ...this.getRawAttributes(),
          ]);
    }
  }
  function vr(t) {
    return _r.FromAttributeList(Object.entries(t));
  }
  function yr() {
    return vr({
      [Ae]: "unknown_service",
      [Oe]: xe[Oe],
      [Re]: xe[Re],
      [Ne]: xe[Ne],
    });
  }
  class Sr {
    _spanContext;
    kind;
    parentSpanContext;
    attributes = {};
    links = [];
    events = [];
    startTime;
    resource;
    instrumentationScope;
    _droppedAttributesCount = 0;
    _droppedEventsCount = 0;
    _droppedLinksCount = 0;
    name;
    status = { code: At.UNSET };
    endTime = [0, 0];
    _ended = !1;
    _duration = [-1, -1];
    _spanProcessor;
    _spanLimits;
    _attributeValueLengthLimit;
    _performanceStartTime;
    _performanceOffset;
    _startTimeProvided;
    constructor(t) {
      const e = Date.now();
      (this._spanContext = t.spanContext),
        (this._performanceStartTime = de.now()),
        (this._performanceOffset = e - (this._performanceStartTime + Me())),
        (this._startTimeProvided = null != t.startTime),
        (this._spanLimits = t.spanLimits),
        (this._attributeValueLengthLimit =
          this._spanLimits.attributeValueLengthLimit || 0),
        (this._spanProcessor = t.spanProcessor),
        (this.name = t.name),
        (this.parentSpanContext = t.parentSpanContext),
        (this.kind = t.kind),
        (this.links = t.links || []),
        (this.startTime = this._getTime(t.startTime ?? e)),
        (this.resource = t.resource),
        (this.instrumentationScope = t.scope),
        null != t.attributes && this.setAttributes(t.attributes),
        this._spanProcessor.onStart(this, t.context);
    }
    spanContext() {
      return this._spanContext;
    }
    setAttribute(t, e) {
      if (null == e || this._isSpanEnded()) return this;
      if (0 === t.length) return Lt.warn(`Invalid attribute key: ${t}`), this;
      if (!ie(e))
        return Lt.warn(`Invalid attribute value set for key: ${t}`), this;
      const { attributeCountLimit: n } = this._spanLimits;
      return void 0 !== n &&
        Object.keys(this.attributes).length >= n &&
        !Object.prototype.hasOwnProperty.call(this.attributes, t)
        ? (this._droppedAttributesCount++, this)
        : ((this.attributes[t] = this._truncateToSize(e)), this);
    }
    setAttributes(t) {
      for (const [e, n] of Object.entries(t)) this.setAttribute(e, n);
      return this;
    }
    addEvent(t, e, n) {
      if (this._isSpanEnded()) return this;
      const { eventCountLimit: r } = this._spanLimits;
      if (0 === r)
        return Lt.warn("No events allowed."), this._droppedEventsCount++, this;
      void 0 !== r &&
        this.events.length >= r &&
        (0 === this._droppedEventsCount && Lt.debug("Dropping extra events."),
        this.events.shift(),
        this._droppedEventsCount++),
        He(e) && (He(n) || (n = e), (e = void 0));
      const o = re(e);
      return (
        this.events.push({
          name: t,
          attributes: o,
          time: this._getTime(n),
          droppedAttributesCount: 0,
        }),
        this
      );
    }
    addLink(t) {
      return this.links.push(t), this;
    }
    addLinks(t) {
      return this.links.push(...t), this;
    }
    setStatus(t) {
      return (
        this._isSpanEnded() ||
          ((this.status = { ...t }),
          null != this.status.message &&
            "string" != typeof t.message &&
            (Lt.warn(
              `Dropping invalid status.message of type '${typeof t.message}', expected 'string'`
            ),
            delete this.status.message)),
        this
      );
    }
    updateName(t) {
      return this._isSpanEnded() || (this.name = t), this;
    }
    end(t) {
      this._isSpanEnded()
        ? Lt.error(
            `${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`
          )
        : ((this._ended = !0),
          (this.endTime = this._getTime(t)),
          (this._duration = Ue(this.startTime, this.endTime)),
          this._duration[0] < 0 &&
            (Lt.warn(
              "Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.",
              this.startTime,
              this.endTime
            ),
            (this.endTime = this.startTime.slice()),
            (this._duration = [0, 0])),
          this._droppedEventsCount > 0 &&
            Lt.warn(
              `Dropped ${this._droppedEventsCount} events because eventCountLimit reached`
            ),
          this._spanProcessor.onEnd(this));
    }
    _getTime(t) {
      if ("number" == typeof t && t <= de.now())
        return ke(t + this._performanceOffset);
      if ("number" == typeof t) return Ie(t);
      if (t instanceof Date) return Ie(t.getTime());
      if (Fe(t)) return t;
      if (this._startTimeProvided) return Ie(Date.now());
      const e = de.now() - this._performanceStartTime;
      return Ve(this.startTime, Ie(e));
    }
    isRecording() {
      return !1 === this._ended;
    }
    recordException(t, e) {
      const n = {};
      "string" == typeof t
        ? (n[fe] = t)
        : t &&
          (t.code ? (n[he] = t.code.toString()) : t.name && (n[he] = t.name),
          t.message && (n[fe] = t.message),
          t.stack && (n["exception.stacktrace"] = t.stack)),
        n[he] || n[fe]
          ? this.addEvent("exception", n, e)
          : Lt.warn(`Failed to record an exception ${t}`);
    }
    get duration() {
      return this._duration;
    }
    get ended() {
      return this._ended;
    }
    get droppedAttributesCount() {
      return this._droppedAttributesCount;
    }
    get droppedEventsCount() {
      return this._droppedEventsCount;
    }
    get droppedLinksCount() {
      return this._droppedLinksCount;
    }
    _isSpanEnded() {
      if (this._ended) {
        const t = new Error(
          `Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`
        );
        Lt.warn(
          `Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`,
          t
        );
      }
      return this._ended;
    }
    _truncateToLimitUtil(t, e) {
      return t.length <= e ? t : t.substring(0, e);
    }
    _truncateToSize(t) {
      const e = this._attributeValueLengthLimit;
      return e <= 0
        ? (Lt.warn(`Attribute value limit must be positive, got ${e}`), t)
        : "string" == typeof t
        ? this._truncateToLimitUtil(t, e)
        : Array.isArray(t)
        ? t.map((t) =>
            "string" == typeof t ? this._truncateToLimitUtil(t, e) : t
          )
        : t;
    }
  }
  var br;
  !(function (t) {
    (t[(t.NOT_RECORD = 0)] = "NOT_RECORD"),
      (t[(t.RECORD = 1)] = "RECORD"),
      (t[(t.RECORD_AND_SAMPLED = 2)] = "RECORD_AND_SAMPLED");
  })(br || (br = {}));
  class Er {
    shouldSample() {
      return { decision: br.NOT_RECORD };
    }
    toString() {
      return "AlwaysOffSampler";
    }
  }
  class Tr {
    shouldSample() {
      return { decision: br.RECORD_AND_SAMPLED };
    }
    toString() {
      return "AlwaysOnSampler";
    }
  }
  class wr {
    _root;
    _remoteParentSampled;
    _remoteParentNotSampled;
    _localParentSampled;
    _localParentNotSampled;
    constructor(t) {
      (this._root = t.root),
        this._root ||
          (ce(
            new Error("ParentBasedSampler must have a root sampler configured")
          ),
          (this._root = new Tr())),
        (this._remoteParentSampled = t.remoteParentSampled ?? new Tr()),
        (this._remoteParentNotSampled = t.remoteParentNotSampled ?? new Er()),
        (this._localParentSampled = t.localParentSampled ?? new Tr()),
        (this._localParentNotSampled = t.localParentNotSampled ?? new Er());
    }
    shouldSample(t, e, n, r, o, i) {
      const s = Kt.getSpanContext(t);
      return s && St(s)
        ? s.isRemote
          ? s.traceFlags & R.SAMPLED
            ? this._remoteParentSampled.shouldSample(t, e, n, r, o, i)
            : this._remoteParentNotSampled.shouldSample(t, e, n, r, o, i)
          : s.traceFlags & R.SAMPLED
          ? this._localParentSampled.shouldSample(t, e, n, r, o, i)
          : this._localParentNotSampled.shouldSample(t, e, n, r, o, i)
        : this._root.shouldSample(t, e, n, r, o, i);
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
    }
  }
  class Cr {
    _ratio;
    _upperBound;
    constructor(t = 0) {
      (this._ratio = t),
        (this._ratio = this._normalize(t)),
        (this._upperBound = Math.floor(4294967295 * this._ratio));
    }
    shouldSample(t, e) {
      return {
        decision:
          yt(e) && this._accumulate(e) < this._upperBound
            ? br.RECORD_AND_SAMPLED
            : br.NOT_RECORD,
      };
    }
    toString() {
      return `TraceIdRatioBased{${this._ratio}}`;
    }
    _normalize(t) {
      return "number" != typeof t || isNaN(t) ? 0 : t >= 1 ? 1 : t <= 0 ? 0 : t;
    }
    _accumulate(t) {
      let e = 0;
      for (let n = 0; n < t.length / 8; n++) {
        const r = 8 * n;
        e = (e ^ parseInt(t.slice(r, r + 8), 16)) >>> 0;
      }
      return e;
    }
  }
  const Ar = 1;
  function Or() {
    return {
      sampler: Rr(),
      forceFlushTimeoutMillis: 3e4,
      generalLimits: {
        attributeValueLengthLimit: 1 / 0,
        attributeCountLimit: 128,
      },
      spanLimits: {
        attributeValueLengthLimit: 1 / 0,
        attributeCountLimit: 128,
        linkCountLimit: 128,
        eventCountLimit: 128,
        attributePerEventCountLimit: 128,
        attributePerLinkCountLimit: 128,
      },
    };
  }
  function Rr() {
    const t = "parentbased_always_on";
    switch (t) {
      case "always_on":
        return new Tr();
      case "always_off":
        return new Er();
      case "parentbased_always_on":
        return new wr({ root: new Tr() });
      case "parentbased_always_off":
        return new wr({ root: new Er() });
      case "traceidratio":
        return new Cr(Nr());
      case "parentbased_traceidratio":
        return new wr({ root: new Cr(Nr()) });
      default:
        return (
          Lt.error(
            `OTEL_TRACES_SAMPLER value "${t}" invalid, defaulting to "parentbased_always_on".`
          ),
          new wr({ root: new Tr() })
        );
    }
  }
  function Nr() {
    return (
      Lt.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${Ar}.`), Ar
    );
  }
  const xr = 1 / 0;
  class Pr {
    _exporter;
    _maxExportBatchSize;
    _maxQueueSize;
    _scheduledDelayMillis;
    _exportTimeoutMillis;
    _isExporting = !1;
    _finishedSpans = [];
    _timer;
    _shutdownOnce;
    _droppedSpansCount = 0;
    constructor(t, e) {
      (this._exporter = t),
        (this._maxExportBatchSize =
          "number" == typeof e?.maxExportBatchSize
            ? e.maxExportBatchSize
            : 512),
        (this._maxQueueSize =
          "number" == typeof e?.maxQueueSize ? e.maxQueueSize : 2048),
        (this._scheduledDelayMillis =
          "number" == typeof e?.scheduledDelayMillis
            ? e.scheduledDelayMillis
            : 5e3),
        (this._exportTimeoutMillis =
          "number" == typeof e?.exportTimeoutMillis
            ? e.exportTimeoutMillis
            : 3e4),
        (this._shutdownOnce = new Rn(this._shutdown, this)),
        this._maxExportBatchSize > this._maxQueueSize &&
          (Lt.warn(
            "BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"
          ),
          (this._maxExportBatchSize = this._maxQueueSize));
    }
    forceFlush() {
      return this._shutdownOnce.isCalled
        ? this._shutdownOnce.promise
        : this._flushAll();
    }
    onStart(t, e) {}
    onEnd(t) {
      this._shutdownOnce.isCalled ||
        (t.spanContext().traceFlags & R.SAMPLED && this._addToBuffer(t));
    }
    shutdown() {
      return this._shutdownOnce.call();
    }
    _shutdown() {
      return Promise.resolve()
        .then(() => this.onShutdown())
        .then(() => this._flushAll())
        .then(() => this._exporter.shutdown());
    }
    _addToBuffer(t) {
      if (this._finishedSpans.length >= this._maxQueueSize)
        return (
          0 === this._droppedSpansCount &&
            Lt.debug("maxQueueSize reached, dropping spans"),
          void this._droppedSpansCount++
        );
      this._droppedSpansCount > 0 &&
        (Lt.warn(
          `Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`
        ),
        (this._droppedSpansCount = 0)),
        this._finishedSpans.push(t),
        this._maybeStartTimer();
    }
    _flushAll() {
      return new Promise((t, e) => {
        const n = [];
        for (
          let t = 0,
            e = Math.ceil(
              this._finishedSpans.length / this._maxExportBatchSize
            );
          t < e;
          t++
        )
          n.push(this._flushOneBatch());
        Promise.all(n)
          .then(() => {
            t();
          })
          .catch(e);
      });
    }
    _flushOneBatch() {
      return (
        this._clearTimer(),
        0 === this._finishedSpans.length
          ? Promise.resolve()
          : new Promise((t, e) => {
              const n = setTimeout(() => {
                e(new Error("Timeout"));
              }, this._exportTimeoutMillis);
              Pt.with(Xt(Pt.active()), () => {
                let r;
                this._finishedSpans.length <= this._maxExportBatchSize
                  ? ((r = this._finishedSpans), (this._finishedSpans = []))
                  : (r = this._finishedSpans.splice(
                      0,
                      this._maxExportBatchSize
                    ));
                const o = () =>
                  this._exporter.export(r, (r) => {
                    clearTimeout(n),
                      r.code === $e.SUCCESS
                        ? t()
                        : e(
                            r.error ??
                              new Error(
                                "BatchSpanProcessor: span export failed"
                              )
                          );
                  });
                let i = null;
                for (let t = 0, e = r.length; t < e; t++) {
                  const e = r[t];
                  e.resource.asyncAttributesPending &&
                    e.resource.waitForAsyncAttributes &&
                    ((i ??= []), i.push(e.resource.waitForAsyncAttributes()));
                }
                null === i
                  ? o()
                  : Promise.all(i).then(o, (t) => {
                      ce(t), e(t);
                    });
              });
            })
      );
    }
    _maybeStartTimer() {
      if (this._isExporting) return;
      const t = () => {
        (this._isExporting = !0),
          this._flushOneBatch()
            .finally(() => {
              (this._isExporting = !1),
                this._finishedSpans.length > 0 &&
                  (this._clearTimer(), this._maybeStartTimer());
            })
            .catch((t) => {
              (this._isExporting = !1), ce(t);
            });
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) return t();
      void 0 === this._timer &&
        ((this._timer = setTimeout(() => t(), this._scheduledDelayMillis)),
        this._timer);
    }
    _clearTimer() {
      void 0 !== this._timer &&
        (clearTimeout(this._timer), (this._timer = void 0));
    }
  }
  class Lr extends Pr {
    _visibilityChangeListener;
    _pageHideListener;
    constructor(t, e) {
      super(t, e), this.onInit(e);
    }
    onInit(t) {
      !0 !== t?.disableAutoFlushOnDocumentHide &&
        "undefined" != typeof document &&
        ((this._visibilityChangeListener = () => {
          "hidden" === document.visibilityState &&
            this.forceFlush().catch((t) => {
              ce(t);
            });
        }),
        (this._pageHideListener = () => {
          this.forceFlush().catch((t) => {
            ce(t);
          });
        }),
        document.addEventListener(
          "visibilitychange",
          this._visibilityChangeListener
        ),
        document.addEventListener("pagehide", this._pageHideListener));
    }
    onShutdown() {
      "undefined" != typeof document &&
        (this._visibilityChangeListener &&
          document.removeEventListener(
            "visibilitychange",
            this._visibilityChangeListener
          ),
        this._pageHideListener &&
          document.removeEventListener("pagehide", this._pageHideListener));
    }
  }
  class Dr {
    generateTraceId = Mr(16);
    generateSpanId = Mr(8);
  }
  const Ir = Array(32);
  function Mr(t) {
    return function () {
      for (let e = 0; e < 2 * t; e++)
        (Ir[e] = Math.floor(16 * Math.random()) + 48),
          Ir[e] >= 58 && (Ir[e] += 39);
      return String.fromCharCode.apply(null, Ir.slice(0, 2 * t));
    };
  }
  class kr {
    _sampler;
    _generalLimits;
    _spanLimits;
    _idGenerator;
    instrumentationScope;
    _resource;
    _spanProcessor;
    constructor(t, e, n, r) {
      const o = (function (t) {
        const e = { sampler: Rr() },
          n = Or(),
          r = Object.assign({}, n, e, t);
        return (
          (r.generalLimits = Object.assign(
            {},
            n.generalLimits,
            t.generalLimits || {}
          )),
          (r.spanLimits = Object.assign({}, n.spanLimits, t.spanLimits || {})),
          r
        );
      })(e);
      (this._sampler = o.sampler),
        (this._generalLimits = o.generalLimits),
        (this._spanLimits = o.spanLimits),
        (this._idGenerator = e.idGenerator || new Dr()),
        (this._resource = n),
        (this._spanProcessor = r),
        (this.instrumentationScope = t);
    }
    startSpan(t, e = {}, n = Pt.active()) {
      e.root && (n = Kt.deleteSpan(n));
      const r = Kt.getSpan(n);
      if (Qt(n)) {
        Lt.debug("Instrumentation suppressed, returning Noop Span");
        return Kt.wrapSpanContext(ut);
      }
      const o = r?.spanContext(),
        i = this._idGenerator.generateSpanId();
      let s, a, u;
      o && Kt.isSpanContextValid(o)
        ? ((a = o.traceId), (u = o.traceState), (s = o))
        : (a = this._idGenerator.generateTraceId());
      const c = e.kind ?? Ct.INTERNAL,
        l = (e.links ?? []).map((t) => ({
          context: t.context,
          attributes: re(t.attributes),
        })),
        p = re(e.attributes),
        d = this._sampler.shouldSample(n, a, t, c, p, l);
      u = d.traceState ?? u;
      const h = {
        traceId: a,
        spanId: i,
        traceFlags: d.decision === wt.RECORD_AND_SAMPLED ? R.SAMPLED : R.NONE,
        traceState: u,
      };
      if (d.decision === wt.NOT_RECORD) {
        Lt.debug(
          "Recording is off, propagating context in a non-recording span"
        );
        return Kt.wrapSpanContext(h);
      }
      const f = re(Object.assign(p, d.attributes));
      return new Sr({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: n,
        spanContext: h,
        name: t,
        kind: c,
        links: l,
        parentSpanContext: s,
        attributes: f,
        startTime: e.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits,
      });
    }
    startActiveSpan(t, e, n, r) {
      let o, i, s;
      if (arguments.length < 2) return;
      2 === arguments.length
        ? (s = e)
        : 3 === arguments.length
        ? ((o = e), (s = n))
        : ((o = e), (i = n), (s = r));
      const a = i ?? Pt.active(),
        u = this.startSpan(t, o, a),
        c = Kt.setSpan(a, u);
      return Pt.with(c, s, void 0, u);
    }
    getGeneralLimits() {
      return this._generalLimits;
    }
    getSpanLimits() {
      return this._spanLimits;
    }
  }
  class jr {
    _spanProcessors;
    constructor(t) {
      this._spanProcessors = t;
    }
    forceFlush() {
      const t = [];
      for (const e of this._spanProcessors) t.push(e.forceFlush());
      return new Promise((e) => {
        Promise.all(t)
          .then(() => {
            e();
          })
          .catch((t) => {
            ce(t || new Error("MultiSpanProcessor: forceFlush failed")), e();
          });
      });
    }
    onStart(t, e) {
      for (const n of this._spanProcessors) n.onStart(t, e);
    }
    onEnd(t) {
      for (const e of this._spanProcessors) e.onEnd(t);
    }
    shutdown() {
      const t = [];
      for (const e of this._spanProcessors) t.push(e.shutdown());
      return new Promise((e, n) => {
        Promise.all(t).then(() => {
          e();
        }, n);
      });
    }
  }
  var Ur, Br;
  !(function (t) {
    (t[(t.resolved = 0)] = "resolved"),
      (t[(t.timeout = 1)] = "timeout"),
      (t[(t.error = 2)] = "error"),
      (t[(t.unresolved = 3)] = "unresolved");
  })(Ur || (Ur = {}));
  class Fr {
    _config;
    _tracers = new Map();
    _resource;
    _activeSpanProcessor;
    constructor(t = {}) {
      const e = mn(
        {},
        Or(),
        (function (t) {
          const e = Object.assign({}, t.spanLimits);
          return (
            (e.attributeCountLimit =
              t.spanLimits?.attributeCountLimit ??
              t.generalLimits?.attributeCountLimit ??
              void 0 ??
              void 0 ??
              128),
            (e.attributeValueLengthLimit =
              t.spanLimits?.attributeValueLengthLimit ??
              t.generalLimits?.attributeValueLengthLimit ??
              void 0 ??
              void 0 ??
              xr),
            Object.assign({}, t, { spanLimits: e })
          );
        })(t)
      );
      (this._resource = e.resource ?? yr()),
        (this._config = Object.assign({}, e, { resource: this._resource }));
      const n = [];
      t.spanProcessors?.length && n.push(...t.spanProcessors),
        (this._activeSpanProcessor = new jr(n));
    }
    getTracer(t, e, n) {
      const r = `${t}@${e || ""}:${n?.schemaUrl || ""}`;
      return (
        this._tracers.has(r) ||
          this._tracers.set(
            r,
            new kr(
              { name: t, version: e, schemaUrl: n?.schemaUrl },
              this._config,
              this._resource,
              this._activeSpanProcessor
            )
          ),
        this._tracers.get(r)
      );
    }
    forceFlush() {
      const t = this._config.forceFlushTimeoutMillis,
        e = this._activeSpanProcessor._spanProcessors.map(
          (e) =>
            new Promise((n) => {
              let r;
              const o = setTimeout(() => {
                n(
                  new Error(
                    `Span processor did not completed within timeout period of ${t} ms`
                  )
                ),
                  (r = Ur.timeout);
              }, t);
              e.forceFlush()
                .then(() => {
                  clearTimeout(o),
                    r !== Ur.timeout && ((r = Ur.resolved), n(r));
                })
                .catch((t) => {
                  clearTimeout(o), (r = Ur.error), n(t);
                });
            })
        );
      return new Promise((t, n) => {
        Promise.all(e)
          .then((e) => {
            const r = e.filter((t) => t !== Ur.resolved);
            r.length > 0 ? n(r) : t();
          })
          .catch((t) => n([t]));
      });
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown();
    }
  }
  class Hr {
    _enabled = !1;
    _currentContext = x;
    _bindFunction(t = x, e) {
      const n = this,
        r = function (...r) {
          return n.with(t, () => e.apply(this, r));
        };
      return (
        Object.defineProperty(r, "length", {
          enumerable: !1,
          configurable: !0,
          writable: !1,
          value: e.length,
        }),
        r
      );
    }
    active() {
      return this._currentContext;
    }
    bind(t, e) {
      return (
        void 0 === t && (t = this.active()),
        "function" == typeof e ? this._bindFunction(t, e) : e
      );
    }
    disable() {
      return (this._currentContext = x), (this._enabled = !1), this;
    }
    enable() {
      return (
        this._enabled || ((this._enabled = !0), (this._currentContext = x)),
        this
      );
    }
    with(t, e, n, ...r) {
      const o = this._currentContext;
      this._currentContext = t || x;
      try {
        return e.call(n, ...r);
      } finally {
        this._currentContext = o;
      }
    }
  }
  class Vr extends Fr {
    constructor(t = {}) {
      super(t);
    }
    register(t = {}) {
      var e;
      Kt.setGlobalTracerProvider(this),
        null !== (e = t.propagator) &&
          (void 0 !== e
            ? qt.setGlobalPropagator(e)
            : qt.setGlobalPropagator(
                new ze({ propagators: [new tn(), new ne()] })
              )),
        (function (t) {
          if (null !== t) {
            if (void 0 === t) {
              const t = new Hr();
              return t.enable(), void Pt.setGlobalContextManager(t);
            }
            t.enable(), Pt.setGlobalContextManager(t);
          }
        })(t.contextManager);
    }
  }
  let $r;
  function zr(t, e, n, r = !0) {
    if (
      !((o = n),
      (i = e),
      !(i in o) || "number" != typeof n[e] || (r && 0 === n[e]))
    )
      return t.addEvent(e, n[e]);
    var o, i;
  }
  function qr(t, e, n = !1, r) {
    void 0 === r && (r = 0 !== e[Br.START_TIME]),
      n ||
        (zr(t, Br.FETCH_START, e, r),
        zr(t, Br.DOMAIN_LOOKUP_START, e, r),
        zr(t, Br.DOMAIN_LOOKUP_END, e, r),
        zr(t, Br.CONNECT_START, e, r),
        zr(t, Br.SECURE_CONNECTION_START, e, r),
        zr(t, Br.CONNECT_END, e, r),
        zr(t, Br.REQUEST_START, e, r),
        zr(t, Br.RESPONSE_START, e, r),
        zr(t, Br.RESPONSE_END, e, r));
    const o = e[Br.ENCODED_BODY_SIZE];
    void 0 !== o && t.setAttribute("http.response_content_length", o);
    const i = e[Br.DECODED_BODY_SIZE];
    void 0 !== i &&
      o !== i &&
      t.setAttribute("http.response_content_length_uncompressed", i);
  }
  function Gr() {
    return "undefined" != typeof location ? location.origin : void 0;
  }
  function Kr(t, e, n, r, o = new WeakSet(), i) {
    const s = Wr(t),
      a = (function (t, e, n, r, o, i) {
        const s = Be(e),
          a = Be(n);
        let u = r.filter((e) => {
          const n = Be(je(e[Br.FETCH_START])),
            r = Be(je(e[Br.RESPONSE_END]));
          return (
            e.initiatorType.toLowerCase() === (i || "xmlhttprequest") &&
            e.name === t &&
            n >= s &&
            r <= a
          );
        });
        u.length > 0 && (u = u.filter((t) => !o.has(t)));
        return u;
      })((t = s.toString()), e, n, r, o, i);
    if (0 === a.length) return { mainRequest: void 0 };
    if (1 === a.length) return { mainRequest: a[0] };
    const u = (function (t) {
      return t.slice().sort((t, e) => {
        const n = t[Br.FETCH_START],
          r = e[Br.FETCH_START];
        return n > r ? 1 : n < r ? -1 : 0;
      });
    })(a);
    if (s.origin !== Gr() && u.length > 1) {
      let t = u[0],
        e = (function (t, e, n) {
          const r = Be(n),
            o = Be(je(e));
          let i,
            s = t[1];
          const a = t.length;
          for (let e = 1; e < a; e++) {
            const n = t[e],
              a = Be(je(n[Br.FETCH_START])),
              u = r - Be(je(n[Br.RESPONSE_END]));
            a >= o && (!i || u < i) && ((i = u), (s = n));
          }
          return s;
        })(u, t[Br.RESPONSE_END], n);
      const r = t[Br.RESPONSE_END];
      return (
        e[Br.FETCH_START] < r && ((e = t), (t = void 0)),
        { corsPreFlightRequest: t, mainRequest: e }
      );
    }
    return { mainRequest: a[0] };
  }
  function Wr(t) {
    if ("function" == typeof URL)
      return new URL(
        t,
        "undefined" != typeof document
          ? document.baseURI
          : "undefined" != typeof location
          ? location.href
          : void 0
      );
    const e = ($r || ($r = document.createElement("a")), $r);
    return (e.href = t), e;
  }
  function Xr(t, e) {
    let n = e || [];
    ("string" == typeof n || n instanceof RegExp) && (n = [n]);
    return Wr(t).origin === Gr() || n.some((e) => Cn(t, e));
  }
  var Qr;
  !(function (t) {
    (t.CONNECT_END = "connectEnd"),
      (t.CONNECT_START = "connectStart"),
      (t.DECODED_BODY_SIZE = "decodedBodySize"),
      (t.DOM_COMPLETE = "domComplete"),
      (t.DOM_CONTENT_LOADED_EVENT_END = "domContentLoadedEventEnd"),
      (t.DOM_CONTENT_LOADED_EVENT_START = "domContentLoadedEventStart"),
      (t.DOM_INTERACTIVE = "domInteractive"),
      (t.DOMAIN_LOOKUP_END = "domainLookupEnd"),
      (t.DOMAIN_LOOKUP_START = "domainLookupStart"),
      (t.ENCODED_BODY_SIZE = "encodedBodySize"),
      (t.FETCH_START = "fetchStart"),
      (t.LOAD_EVENT_END = "loadEventEnd"),
      (t.LOAD_EVENT_START = "loadEventStart"),
      (t.NAVIGATION_START = "navigationStart"),
      (t.REDIRECT_END = "redirectEnd"),
      (t.REDIRECT_START = "redirectStart"),
      (t.REQUEST_START = "requestStart"),
      (t.RESPONSE_END = "responseEnd"),
      (t.RESPONSE_START = "responseStart"),
      (t.SECURE_CONNECTION_START = "secureConnectionStart"),
      (t.START_TIME = "startTime"),
      (t.UNLOAD_EVENT_END = "unloadEventEnd"),
      (t.UNLOAD_EVENT_START = "unloadEventStart");
  })(Br || (Br = {})),
    (function (t) {
      (t.COMPONENT = "component"),
        (t.HTTP_ERROR_NAME = "http.error_name"),
        (t.HTTP_STATUS_TEXT = "http.status_text");
    })(Qr || (Qr = {}));
  const Yr = Lt.createComponentLogger({
    namespace: "@opentelemetry/opentelemetry-instrumentation-fetch/utils",
  });
  function Zr(...t) {
    if (t[0] instanceof URL || "string" == typeof t[0]) {
      const e = t[1];
      if (!e?.body) return Promise.resolve();
      if (e.body instanceof ReadableStream) {
        const { body: t, length: n } = (function (t) {
          if (!t.pipeThrough)
            return (
              Yr.warn("Platform has ReadableStream but not pipeThrough!"),
              { body: t, length: Promise.resolve(void 0) }
            );
          let e,
            n = 0;
          const r = new Promise((t) => {
              e = t;
            }),
            o = new TransformStream({
              start() {},
              async transform(t, e) {
                const r = await t;
                (n += r.byteLength), e.enqueue(t);
              },
              flush() {
                e(n);
              },
            });
          return { body: t.pipeThrough(o), length: r };
        })(e.body);
        return (e.body = t), n;
      }
      return Promise.resolve(
        (function (t) {
          if (
            ((e = t), "undefined" != typeof Document && e instanceof Document)
          )
            return new XMLSerializer().serializeToString(document).length;
          var e;
          if ("string" == typeof t) return to(t);
          if (t instanceof Blob) return t.size;
          if (t instanceof FormData)
            return (function (t) {
              let e = 0;
              for (const [n, r] of t.entries())
                (e += n.length),
                  r instanceof Blob ? (e += r.size) : (e += r.length);
              return e;
            })(t);
          if (t instanceof URLSearchParams) return to(t.toString());
          if (void 0 !== t.byteLength) return t.byteLength;
          return void Yr.warn("unknown body type");
        })(e.body)
      );
    }
    {
      const e = t[0];
      return e?.body
        ? e
            .clone()
            .text()
            .then((t) => to(t))
        : Promise.resolve();
    }
  }
  const Jr = new TextEncoder();
  function to(t) {
    return Jr.encode(t).byteLength;
  }
  const eo = "0.200.0",
    no = "object" == typeof process && "node" === process.release?.name;
  class ro extends hr {
    component = "fetch";
    version = eo;
    moduleName = this.component;
    _usedResources = new WeakSet();
    _tasksCount = 0;
    constructor(t = {}) {
      super("@opentelemetry/instrumentation-fetch", eo, t);
    }
    init() {}
    _addChildSpan(t, e) {
      const n = this.tracer.startSpan(
        "CORS Preflight",
        { startTime: e[Br.FETCH_START] },
        Kt.setSpan(Pt.active(), t)
      );
      qr(n, e, this.getConfig().ignoreNetworkEvents), n.end(e[Br.RESPONSE_END]);
    }
    _addFinalSpanAttributes(t, e) {
      const n = Wr(e.url);
      t.setAttribute(ye, e.status),
        null != e.statusText &&
          t.setAttribute(Qr.HTTP_STATUS_TEXT, e.statusText),
        t.setAttribute(_e, n.host),
        t.setAttribute(ve, n.protocol.replace(":", "")),
        "undefined" != typeof navigator &&
          t.setAttribute(Se, navigator.userAgent);
    }
    _addHeaders(t, e) {
      if (!Xr(e, this.getConfig().propagateTraceHeaderCorsUrls)) {
        const t = {};
        return (
          qt.inject(Pt.active(), t),
          void (
            Object.keys(t).length > 0 &&
            this._diag.debug("headers inject skipped due to CORS policy")
          )
        );
      }
      if (t instanceof Request)
        qt.inject(Pt.active(), t.headers, {
          set: (t, e, n) => t.set(e, "string" == typeof n ? n : String(n)),
        });
      else if (t.headers instanceof Headers)
        qt.inject(Pt.active(), t.headers, {
          set: (t, e, n) => t.set(e, "string" == typeof n ? n : String(n)),
        });
      else if (t.headers instanceof Map)
        qt.inject(Pt.active(), t.headers, {
          set: (t, e, n) => t.set(e, "string" == typeof n ? n : String(n)),
        });
      else {
        const e = {};
        qt.inject(Pt.active(), e),
          (t.headers = Object.assign({}, e, t.headers || {}));
      }
    }
    _clearResources() {
      0 === this._tasksCount &&
        this.getConfig().clearTimingResources &&
        (performance.clearResourceTimings(),
        (this._usedResources = new WeakSet()));
    }
    _createSpan(t, e = {}) {
      if (An(t, this.getConfig().ignoreUrls))
        return void this._diag.debug(
          "ignoring span as url matches ignored url"
        );
      const n = (e.method || "GET").toUpperCase(),
        r = `HTTP ${n}`;
      return this.tracer.startSpan(r, {
        kind: Ct.CLIENT,
        attributes: { [Qr.COMPONENT]: this.moduleName, [ge]: n, [me]: t },
      });
    }
    _findResourceAndAddNetworkEvents(t, e, n) {
      let r = e.entries;
      if (!r.length) {
        if (!performance.getEntriesByType) return;
        r = performance.getEntriesByType("resource");
      }
      const o = Kr(e.spanUrl, e.startTime, n, r, this._usedResources, "fetch");
      if (o.mainRequest) {
        const e = o.mainRequest;
        this._markResourceAsUsed(e);
        const n = o.corsPreFlightRequest;
        n && (this._addChildSpan(t, n), this._markResourceAsUsed(n)),
          qr(t, e, this.getConfig().ignoreNetworkEvents);
      }
    }
    _markResourceAsUsed(t) {
      this._usedResources.add(t);
    }
    _endSpan(t, e, n) {
      const r = Ie(Date.now()),
        o = ke();
      this._addFinalSpanAttributes(t, n),
        setTimeout(() => {
          e.observer?.disconnect(),
            this._findResourceAndAddNetworkEvents(t, e, o),
            this._tasksCount--,
            this._clearResources(),
            t.end(r);
        }, 300);
    }
    _patchConstructor() {
      return (t) => {
        const e = this;
        return function (...n) {
          const r = this,
            o = Wr(n[0] instanceof Request ? n[0].url : String(n[0])).href,
            i = n[0] instanceof Request ? n[0] : n[1] || {},
            s = e._createSpan(o, i);
          if (!s) return t.apply(this, n);
          const a = e._prepareSpanData(o);
          function u(t, n) {
            e._applyAttributesAfterFetch(t, i, n),
              e._endSpan(t, a, {
                status: n.status || 0,
                statusText: n.message,
                url: o,
              });
          }
          function c(t, n) {
            e._applyAttributesAfterFetch(t, i, n),
              n.status >= 200 && n.status < 400
                ? e._endSpan(t, a, n)
                : e._endSpan(t, a, {
                    status: n.status,
                    statusText: n.statusText,
                    url: o,
                  });
          }
          function l(t, e, n) {
            try {
              const e = n.clone().body;
              if (e) {
                const r = e.getReader(),
                  o = () => {
                    r.read().then(
                      ({ done: e }) => {
                        e ? c(t, n) : o();
                      },
                      (e) => {
                        u(t, e);
                      }
                    );
                  };
                o();
              } else c(t, n);
            } finally {
              e(n);
            }
          }
          function p(t, e, n) {
            try {
              u(t, n);
            } finally {
              e(n);
            }
          }
          return (
            e.getConfig().measureRequestSize &&
              Zr(...n)
                .then((t) => {
                  t && s.setAttribute(be, t);
                })
                .catch((t) => {
                  e._diag.warn("getFetchBodyLength", t);
                }),
            new Promise((n, a) =>
              Pt.with(
                Kt.setSpan(Pt.active(), s),
                () => (
                  e._addHeaders(i, o),
                  e._callRequestHook(s, i),
                  e._tasksCount++,
                  t
                    .apply(r, i instanceof Request ? [i] : [o, i])
                    .then(l.bind(r, s, n), p.bind(r, s, a))
                )
              )
            )
          );
        };
      };
    }
    _applyAttributesAfterFetch(t, e, n) {
      const r = this.getConfig().applyCustomAttributesOnSpan;
      r &&
        fr(
          () => r(t, e, n),
          (t) => {
            t && this._diag.error("applyCustomAttributesOnSpan", t);
          }
        );
    }
    _callRequestHook(t, e) {
      const n = this.getConfig().requestHook;
      n &&
        fr(
          () => n(t, e),
          (t) => {
            t && this._diag.error("requestHook", t);
          }
        );
    }
    _prepareSpanData(t) {
      const e = ke(),
        n = [];
      if ("function" != typeof PerformanceObserver)
        return { entries: n, startTime: e, spanUrl: t };
      const r = new PerformanceObserver((e) => {
        e.getEntries().forEach((e) => {
          "fetch" === e.initiatorType && e.name === t && n.push(e);
        });
      });
      return (
        r.observe({ entryTypes: ["resource"] }),
        { entries: n, observer: r, startTime: e, spanUrl: t }
      );
    }
    enable() {
      no
        ? this._diag.warn(
            "this instrumentation is intended for web usage only, it does not instrument Node.js's fetch()"
          )
        : (gr(fetch) &&
            (this._unwrap(pe, "fetch"),
            this._diag.debug("removing previous patch for constructor")),
          this._wrap(pe, "fetch", this._patchConstructor()));
    }
    disable() {
      no || (this._unwrap(pe, "fetch"), (this._usedResources = new WeakSet()));
    }
  }
  var oo;
  !(function (t) {
    (t.METHOD_OPEN = "open"),
      (t.METHOD_SEND = "send"),
      (t.EVENT_ABORT = "abort"),
      (t.EVENT_ERROR = "error"),
      (t.EVENT_LOAD = "loaded"),
      (t.EVENT_TIMEOUT = "timeout");
  })(oo || (oo = {}));
  const io = Lt.createComponentLogger({
    namespace:
      "@opentelemetry/opentelemetry-instrumentation-xml-http-request/utils",
  });
  function so(t) {
    return (
      (e = t),
      "undefined" != typeof Document && e instanceof Document
        ? new XMLSerializer().serializeToString(document).length
        : "string" == typeof t
        ? uo(t)
        : t instanceof Blob
        ? t.size
        : t instanceof FormData
        ? (function (t) {
            let e = 0;
            for (const [n, r] of t.entries())
              (e += n.length),
                r instanceof Blob ? (e += r.size) : (e += r.length);
            return e;
          })(t)
        : t instanceof URLSearchParams
        ? uo(t.toString())
        : void 0 !== t.byteLength
        ? t.byteLength
        : void io.warn("unknown body type")
    );
    var e;
  }
  const ao = new TextEncoder();
  function uo(t) {
    return ao.encode(t).byteLength;
  }
  const co = "0.200.0";
  var lo;
  !(function (t) {
    t.HTTP_STATUS_TEXT = "http.status_text";
  })(lo || (lo = {}));
  class po extends hr {
    component = "xml-http-request";
    version = co;
    moduleName = this.component;
    _tasksCount = 0;
    _xhrMem = new WeakMap();
    _usedResources = new WeakSet();
    constructor(t = {}) {
      super("@opentelemetry/instrumentation-xml-http-request", co, t);
    }
    init() {}
    _addHeaders(t, e) {
      if (!Xr(Wr(e).href, this.getConfig().propagateTraceHeaderCorsUrls)) {
        const t = {};
        return (
          qt.inject(Pt.active(), t),
          void (
            Object.keys(t).length > 0 &&
            this._diag.debug("headers inject skipped due to CORS policy")
          )
        );
      }
      const n = {};
      qt.inject(Pt.active(), n),
        Object.keys(n).forEach((e) => {
          t.setRequestHeader(e, String(n[e]));
        });
    }
    _addChildSpan(t, e) {
      Pt.with(Kt.setSpan(Pt.active(), t), () => {
        const t = this.tracer.startSpan("CORS Preflight", {
          startTime: e[Br.FETCH_START],
        });
        qr(t, e, this.getConfig().ignoreNetworkEvents),
          t.end(e[Br.RESPONSE_END]);
      });
    }
    _addFinalSpanAttributes(t, e, n) {
      if ("string" == typeof n) {
        const r = Wr(n);
        void 0 !== e.status && t.setAttribute(ye, e.status),
          void 0 !== e.statusText &&
            t.setAttribute(lo.HTTP_STATUS_TEXT, e.statusText),
          t.setAttribute(_e, r.host),
          t.setAttribute(ve, r.protocol.replace(":", "")),
          t.setAttribute(Se, navigator.userAgent);
      }
    }
    _applyAttributesAfterXHR(t, e) {
      const n = this.getConfig().applyCustomAttributesOnSpan;
      "function" == typeof n &&
        fr(
          () => n(t, e),
          (t) => {
            t && this._diag.error("applyCustomAttributesOnSpan", t);
          }
        );
    }
    _addResourceObserver(t, e) {
      const n = this._xhrMem.get(t);
      n &&
        "function" == typeof PerformanceObserver &&
        "function" == typeof PerformanceResourceTiming &&
        ((n.createdResources = {
          observer: new PerformanceObserver((t) => {
            const r = t.getEntries(),
              o = Wr(e);
            r.forEach((t) => {
              "xmlhttprequest" === t.initiatorType &&
                t.name === o.href &&
                n.createdResources &&
                n.createdResources.entries.push(t);
            });
          }),
          entries: [],
        }),
        n.createdResources.observer.observe({ entryTypes: ["resource"] }));
    }
    _clearResources() {
      0 === this._tasksCount &&
        this.getConfig().clearTimingResources &&
        (de.clearResourceTimings(),
        (this._xhrMem = new WeakMap()),
        (this._usedResources = new WeakSet()));
    }
    _findResourceAndAddNetworkEvents(t, e, n, r, o) {
      if (!(n && r && o && t.createdResources)) return;
      let i = t.createdResources.entries;
      (i && i.length) || (i = de.getEntriesByType("resource"));
      const s = Kr(Wr(n).href, r, o, i, this._usedResources);
      if (s.mainRequest) {
        const t = s.mainRequest;
        this._markResourceAsUsed(t);
        const n = s.corsPreFlightRequest;
        n && (this._addChildSpan(e, n), this._markResourceAsUsed(n)),
          qr(e, t, this.getConfig().ignoreNetworkEvents);
      }
    }
    _cleanPreviousSpanInformation(t) {
      const e = this._xhrMem.get(t);
      if (e) {
        const n = e.callbackToRemoveEvents;
        n && n(), this._xhrMem.delete(t);
      }
    }
    _createSpan(t, e, n) {
      if (An(e, this.getConfig().ignoreUrls))
        return void this._diag.debug(
          "ignoring span as url matches ignored url"
        );
      const r = n.toUpperCase(),
        o = this.tracer.startSpan(r, {
          kind: Ct.CLIENT,
          attributes: { [ge]: n, [me]: Wr(e).toString() },
        });
      return (
        o.addEvent(oo.METHOD_OPEN),
        this._cleanPreviousSpanInformation(t),
        this._xhrMem.set(t, { span: o, spanUrl: e }),
        o
      );
    }
    _markResourceAsUsed(t) {
      this._usedResources.add(t);
    }
    _patchOpen() {
      return (t) => {
        const e = this;
        return function (...n) {
          const r = n[0],
            o = n[1];
          return e._createSpan(this, o, r), t.apply(this, n);
        };
      };
    }
    _patchSend() {
      const t = this;
      function e(e, n) {
        const r = t._xhrMem.get(n);
        if (!r) return;
        (r.status = n.status),
          (r.statusText = n.statusText),
          t._xhrMem.delete(n),
          r.span && t._applyAttributesAfterXHR(r.span, n);
        const o = ke(),
          i = Date.now();
        setTimeout(() => {
          !(function (e, n, r, o) {
            const i = n.callbackToRemoveEvents;
            "function" == typeof i && i();
            const { span: s, spanUrl: a, sendStartTime: u } = n;
            s &&
              (t._findResourceAndAddNetworkEvents(n, s, a, u, r),
              s.addEvent(e, o),
              t._addFinalSpanAttributes(s, n, a),
              s.end(o),
              t._tasksCount--),
              t._clearResources();
          })(e, r, o, i);
        }, 300);
      }
      function n() {
        e(oo.EVENT_ERROR, this);
      }
      function r() {
        e(oo.EVENT_ABORT, this);
      }
      function o() {
        e(oo.EVENT_TIMEOUT, this);
      }
      function i() {
        this.status < 299 ? e(oo.EVENT_LOAD, this) : e(oo.EVENT_ERROR, this);
      }
      return (e) =>
        function (...s) {
          const a = t._xhrMem.get(this);
          if (!a) return e.apply(this, s);
          const u = a.span,
            c = a.spanUrl;
          if (u && c) {
            if (t.getConfig().measureRequestSize && s?.[0]) {
              const t = so(s[0]);
              void 0 !== t && u.setAttribute(be, t);
            }
            Pt.with(Kt.setSpan(Pt.active(), u), () => {
              t._tasksCount++,
                (a.sendStartTime = ke()),
                u.addEvent(oo.METHOD_SEND),
                this.addEventListener("abort", r),
                this.addEventListener("error", n),
                this.addEventListener("load", i),
                this.addEventListener("timeout", o),
                (a.callbackToRemoveEvents = () => {
                  !(function (e) {
                    e.removeEventListener("abort", r),
                      e.removeEventListener("error", n),
                      e.removeEventListener("load", i),
                      e.removeEventListener("timeout", o);
                    const s = t._xhrMem.get(e);
                    s && (s.callbackToRemoveEvents = void 0);
                  })(this),
                    a.createdResources &&
                      a.createdResources.observer.disconnect();
                }),
                t._addHeaders(this, c),
                t._addResourceObserver(this, c);
            });
          }
          return e.apply(this, s);
        };
    }
    enable() {
      this._diag.debug("applying patch to", this.moduleName, this.version),
        gr(XMLHttpRequest.prototype.open) &&
          (this._unwrap(XMLHttpRequest.prototype, "open"),
          this._diag.debug("removing previous patch from method open")),
        gr(XMLHttpRequest.prototype.send) &&
          (this._unwrap(XMLHttpRequest.prototype, "send"),
          this._diag.debug("removing previous patch from method send")),
        this._wrap(XMLHttpRequest.prototype, "open", this._patchOpen()),
        this._wrap(XMLHttpRequest.prototype, "send", this._patchSend());
    }
    disable() {
      this._diag.debug("removing patch from", this.moduleName, this.version),
        this._unwrap(XMLHttpRequest.prototype, "open"),
        this._unwrap(XMLHttpRequest.prototype, "send"),
        (this._tasksCount = 0),
        (this._xhrMem = new WeakMap()),
        (this._usedResources = new WeakSet());
    }
  }
  class ho extends po {
    constructor(t = {}) {
      super(t);
      this.parentCreateSpan = this._createSpan.bind(this);
    }
    _patchOpen() {
      return (t) => {
        const n = this;
        return function (...r) {
          try {
            const t = r[0];
            let o = e.getUrlFromResource(r[1]);
            n.parentCreateSpan(this, o, t);
          } catch (t) {
            e.faro.internalLogger.error(t);
          }
          return t.apply(this, r);
        };
      };
    }
  }
  function fo(t, e, n) {
    go(t, n instanceof Error ? 0 : n.status);
  }
  function go(t, e) {
    if (null == e) return;
    (0 === e || (e >= 400 && e < 600)) && t.setStatus({ code: At.ERROR });
  }
  function mo(t) {
    return (e, n, r) => {
      fo(e, 0, r), null == t || t(e, n, r);
    };
  }
  function _o(t) {
    return (e, n) => {
      !(function (t, e) {
        go(t, e.status);
      })(e, n),
        null == t || t(e, n);
    };
  }
  function vo(t = {}) {
    const { fetchInstrumentationOptions: e, xhrInstrumentationOptions: n } = t,
      r = (function (t, e) {
        var n = {};
        for (var r in t)
          Object.prototype.hasOwnProperty.call(t, r) &&
            e.indexOf(r) < 0 &&
            (n[r] = t[r]);
        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
          var o = 0;
          for (r = Object.getOwnPropertySymbols(t); o < r.length; o++)
            e.indexOf(r[o]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(t, r[o]) &&
              (n[r[o]] = t[r[o]]);
        }
        return n;
      })(t, ["fetchInstrumentationOptions", "xhrInstrumentationOptions"]),
      o = (function (t, e) {
        return Object.assign(
          Object.assign(
            Object.assign(Object.assign({}, e), { ignoreNetworkEvents: !0 }),
            t
          ),
          {
            applyCustomAttributesOnSpan: mo(
              null == t ? void 0 : t.applyCustomAttributesOnSpan
            ),
          }
        );
      })(e, r),
      i = (function (t, e) {
        return Object.assign(
          Object.assign(
            Object.assign(Object.assign({}, e), { ignoreNetworkEvents: !0 }),
            t
          ),
          {
            applyCustomAttributesOnSpan: _o(
              null == t ? void 0 : t.applyCustomAttributesOnSpan
            ),
          }
        );
      })(n, r);
    return [new ro(o), new ho(i)];
  }
  class yo {
    constructor(t, e) {
      (this.processor = t), (this.metas = e);
    }
    forceFlush() {
      return this.processor.forceFlush();
    }
    onStart(t, e) {
      var n;
      const r = this.metas.value.session;
      (null == r ? void 0 : r.id) &&
        ((t.attributes[Zn] = r.id), (t.attributes.session_id = r.id));
      const o = null !== (n = this.metas.value.user) && void 0 !== n ? n : {};
      o.email && (t.attributes["user.email"] = o.email),
        o.id && (t.attributes["user.id"] = o.id),
        o.username && (t.attributes["user.name"] = o.username),
        o.fullName && (t.attributes["user.full_name"] = o.fullName),
        o.roles &&
          (t.attributes["user.roles"] = o.roles
            .split(",")
            .map((t) => t.trim())),
        o.hash && (t.attributes["user.hash"] = o.hash),
        this.processor.onStart(t, e);
    }
    onEnd(t) {
      this.processor.onEnd(t);
    }
    shutdown() {
      return this.processor.shutdown();
    }
  }
  class So {
    constructor(t) {
      (this.processor = t),
        e.apiMessageBus.subscribe((t) => {
          t.type !== e.USER_ACTION_START
            ? [e.USER_ACTION_END, e.USER_ACTION_CANCEL].includes(t.type) &&
              (this.message = void 0)
            : (this.message = t);
        });
    }
    forceFlush() {
      return this.processor.forceFlush();
    }
    onStart(t, e) {
      var n, r;
      t.kind === Ct.CLIENT &&
        this.message &&
        ((t.attributes["faro.action.user.name"] =
          null === (n = this.message) || void 0 === n ? void 0 : n.name),
        (t.attributes["faro.action.user.parentId"] =
          null === (r = this.message) || void 0 === r ? void 0 : r.parentId)),
        this.processor.onStart(t, e);
    }
    onEnd(t) {
      this.processor.onEnd(t);
    }
    shutdown() {
      return this.processor.shutdown();
    }
  }
  function bo(t = {}) {
    var e;
    return "true" ===
      (null === (e = t.attributes) || void 0 === e ? void 0 : e.isSampled)
      ? br.RECORD_AND_SAMPLED
      : br.NOT_RECORD;
  }
  class Eo extends e.BaseInstrumentation {
    constructor(t = {}) {
      super(),
        (this.options = t),
        (this.name = "@grafana/faro-web-tracing"),
        (this.version = e.VERSION);
    }
    initialize() {
      var t, e, n, r;
      const o = this.options,
        i = {};
      this.config.app.name && (i[Ae] = this.config.app.name),
        this.config.app.namespace &&
          (i["service.namespace"] = this.config.app.namespace),
        this.config.app.version &&
          (i["service.version"] = this.config.app.version),
        this.config.app.environment &&
          ((i["deployment.environment.name"] = this.config.app.environment),
          (i["deployment.environment"] = this.config.app.environment)),
        Object.assign(i, o.resourceAttributes);
      const s = yr().merge(vr(i));
      new Vr({
        resource: s,
        sampler: {
          shouldSample: () => ({ decision: bo(this.api.getSession()) }),
        },
        spanProcessors: [
          null !== (t = o.spanProcessor) && void 0 !== t
            ? t
            : new So(
                new yo(
                  new Lr(new Yn({ api: this.api }), {
                    scheduledDelayMillis: Eo.SCHEDULED_BATCH_DELAY_MS,
                    maxExportBatchSize: 30,
                  }),
                  this.metas
                )
              ),
        ],
      }).register({
        propagator: null !== (e = o.propagator) && void 0 !== e ? e : new tn(),
        contextManager: o.contextManager,
      });
      const {
        propagateTraceHeaderCorsUrls: a,
        fetchInstrumentationOptions: u,
        xhrInstrumentationOptions: c,
      } = null !== (n = this.options.instrumentationOptions) && void 0 !== n
        ? n
        : {};
      !(function (t) {
        const e = t.tracerProvider || Kt.getTracerProvider(),
          n = t.meterProvider || Mt.getMeterProvider(),
          r = t.loggerProvider || ur.getLoggerProvider(),
          o = t.instrumentations?.flat() ?? [];
        (function (t, e, n, r) {
          for (let o = 0, i = t.length; o < i; o++) {
            const i = t[o];
            e && i.setTracerProvider(e),
              n && i.setMeterProvider(n),
              r && i.setLoggerProvider && i.setLoggerProvider(r),
              i.getConfig().enabled || i.enable();
          }
        })(o, e, n, r);
      })({
        instrumentations:
          null !== (r = o.instrumentations) && void 0 !== r
            ? r
            : vo({
                ignoreUrls: this.getIgnoreUrls(),
                propagateTraceHeaderCorsUrls: a,
                fetchInstrumentationOptions: u,
                xhrInstrumentationOptions: c,
              }),
      }),
        this.api.initOTEL(Kt, Pt);
    }
    getIgnoreUrls() {
      return this.transports.transports.flatMap((t) => t.getIgnoreUrls());
    }
  }
  return (
    (Eo.SCHEDULED_BATCH_DELAY_MS = 1e3),
    (t.FaroSessionSpanProcessor = class {
      constructor(t, e) {
        (this.processor = t), (this.metas = e);
      }
      forceFlush() {
        return this.processor.forceFlush();
      }
      onStart(t, e) {
        const n = this.metas.value.session;
        (null == n ? void 0 : n.id) &&
          ((t.attributes[Zn] = n.id), (t.attributes.session_id = n.id)),
          this.processor.onStart(t, e);
      }
      onEnd(t) {
        this.processor.onEnd(t);
      }
      shutdown() {
        return this.processor.shutdown();
      }
    }),
    (t.FaroTraceExporter = Yn),
    (t.TracingInstrumentation = Eo),
    (t.fetchCustomAttributeFunctionWithDefaults = mo),
    (t.getDefaultOTELInstrumentations = vo),
    (t.getSamplingDecision = bo),
    (t.setSpanStatusOnFetchError = fo),
    t
  );
};

export default GrafanaFaroWebTracing;
