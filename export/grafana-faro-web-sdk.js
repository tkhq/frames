// vendored @grafana/faro-web-sdk v1.18.1 https://unpkg.com/@grafana/faro-web-sdk@1.18.1/dist/bundle/faro-web-sdk.iife.js

var GrafanaFaroWebSdk = (function (e) {
  "use strict";
  function t(e, t) {
    return typeof e === t;
  }
  function n(e, t) {
    return Object.prototype.toString.call(e) === `[object ${t}]`;
  }
  function i(e, t) {
    try {
      return e instanceof t;
    } catch (e) {
      return !1;
    }
  }
  const r = (e) => t(e, "null"),
    o = (e) => t(e, "string"),
    s = (e) => (t(e, "number") && !isNaN(e)) || t(e, "bigint"),
    a = (e) => t(e, "boolean"),
    u = (e) => !r(e) && t(e, "object"),
    c = (e) => t(e, "function"),
    l = (e) => n(e, "Array"),
    d = (e) => !u(e) && !c(e),
    f = "undefined" != typeof Event,
    p = (e) => f && i(e, Event),
    g = "undefined" != typeof Error,
    m = (e) => g && i(e, Error),
    v = (e) => n(e, "ErrorEvent"),
    h = (e) => n(e, "DOMError"),
    b = (e) => n(e, "DOMException"),
    w = "undefined" != typeof Element,
    y = "undefined" != typeof Map;
  function S(e) {
    return (
      null == e ||
      (l(e) || o(e) ? 0 === e.length : !!u(e) && 0 === Object.keys(e).length)
    );
  }
  function T(e, n) {
    if (e === n) return !0;
    if (t(e, "number") && isNaN(e)) return t(n, "number") && isNaN(n);
    const i = l(e),
      r = l(n);
    if (i !== r) return !1;
    if (i && r) {
      const t = e.length;
      if (t !== n.length) return !1;
      for (let i = t; 0 != i--; ) if (!T(e[i], n[i])) return !1;
      return !0;
    }
    const o = u(e),
      s = u(n);
    if (o !== s) return !1;
    if (e && n && o && s) {
      const t = Object.keys(e),
        i = Object.keys(n);
      if (t.length !== i.length) return !1;
      for (let e of t) if (!i.includes(e)) return !1;
      for (let i of t) if (!T(e[i], n[i])) return !1;
      return !0;
    }
    return !1;
  }
  function E() {
    return Date.now();
  }
  function I() {
    return new Date().toISOString();
  }
  function k(e) {
    return new Date(e).toISOString();
  }
  var O;
  (e.LogLevel = void 0),
    ((O = e.LogLevel || (e.LogLevel = {})).TRACE = "trace"),
    (O.DEBUG = "debug"),
    (O.INFO = "info"),
    (O.LOG = "log"),
    (O.WARN = "warn"),
    (O.ERROR = "error");
  const x = e.LogLevel.LOG,
    L = [
      e.LogLevel.TRACE,
      e.LogLevel.DEBUG,
      e.LogLevel.INFO,
      e.LogLevel.LOG,
      e.LogLevel.WARN,
      e.LogLevel.ERROR,
    ];
  function C() {}
  function A(e) {
    const { size: t, concurrency: n } = e,
      i = [];
    let r = 0;
    const o = () => {
      if (r < n && i.length) {
        const { producer: e, resolve: t, reject: n } = i.shift();
        r++,
          e().then(
            (e) => {
              r--, o(), t(e);
            },
            (e) => {
              r--, o(), n(e);
            }
          );
      }
    };
    return {
      add: (e) => {
        if (i.length + r >= t) throw new Error("Task buffer full");
        return new Promise((t, n) => {
          i.push({ producer: e, resolve: t, reject: n }), o();
        });
      },
    };
  }
  const P = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  function M(e = 10) {
    return Array.from(Array(e))
      .map(() => P[Math.floor(Math.random() * P.length)])
      .join("");
  }
  const j =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : void 0;
  function N(e = {}) {
    return JSON.stringify(
      null != e ? e : {},
      (function () {
        const e = new WeakSet();
        return function (t, n) {
          if (u(n) && null !== n) {
            if (e.has(n)) return null;
            e.add(n);
          }
          return n;
        };
      })()
    );
  }
  function _(e = {}) {
    const t = {};
    for (const [n, i] of Object.entries(e))
      t[n] = u(i) && null !== i ? N(i) : String(i);
    return t;
  }
  class D {
    constructor() {
      this.subscribers = [];
    }
    subscribe(e) {
      return (
        this.subscribers.push(e), { unsubscribe: () => this.unsubscribe(e) }
      );
    }
    unsubscribe(e) {
      this.subscribers = this.subscribers.filter((t) => t !== e);
    }
    notify(e) {
      this.subscribers.forEach((t) => t(e));
    }
    first() {
      const e = new D(),
        t = (t) => {
          e.notify(t), n.unsubscribe();
        },
        n = this.subscribe(t),
        i = e.unsubscribe.bind(e);
      return this.withUnsubscribeOverride(e, i, t);
    }
    takeWhile(e) {
      const t = new D(),
        n = (i) => {
          e(i) ? t.notify(i) : t.unsubscribe(n);
        };
      this.subscribe(n);
      const i = t.unsubscribe.bind(t);
      return this.withUnsubscribeOverride(t, i, n);
    }
    filter(e) {
      const t = new D(),
        n = (n) => {
          e(n) && t.notify(n);
        };
      this.subscribe(n);
      const i = t.unsubscribe.bind(t);
      return this.withUnsubscribeOverride(t, i, n);
    }
    merge(...e) {
      const t = new D(),
        n = [];
      e.forEach((e) => {
        const i = e.subscribe((e) => {
          t.notify(e);
        });
        n.push(i);
      });
      const i = t.unsubscribeAll.bind(t);
      return (
        (t.unsubscribe = () => {
          n.forEach((e) => e.unsubscribe()), i();
        }),
        t
      );
    }
    withUnsubscribeOverride(e, t, n) {
      return (
        (e.unsubscribe = (e) => {
          t(e), this.unsubscribe(n);
        }),
        e
      );
    }
    unsubscribeAll() {
      this.subscribers = [];
    }
  }
  class R {
    constructor(e, t) {
      var n, i;
      (this.signalBuffer = []),
        (this.itemLimit =
          null !== (n = null == t ? void 0 : t.itemLimit) && void 0 !== n
            ? n
            : 50),
        (this.sendTimeout =
          null !== (i = null == t ? void 0 : t.sendTimeout) && void 0 !== i
            ? i
            : 250),
        (this.paused = (null == t ? void 0 : t.paused) || !1),
        (this.sendFn = e),
        (this.flushInterval = -1),
        this.paused || this.start(),
        document.addEventListener("visibilitychange", () => {
          "hidden" === document.visibilityState && this.flush();
        });
    }
    addItem(e) {
      this.paused ||
        (this.signalBuffer.push(e),
        this.signalBuffer.length >= this.itemLimit && this.flush());
    }
    start() {
      (this.paused = !1),
        this.sendTimeout > 0 &&
          (this.flushInterval = window.setInterval(
            () => this.flush(),
            this.sendTimeout
          ));
    }
    pause() {
      (this.paused = !0), clearInterval(this.flushInterval);
    }
    groupItems(e) {
      const t = new Map();
      return (
        e.forEach((e) => {
          const n = JSON.stringify(e.meta);
          let i = t.get(n);
          (i = void 0 === i ? [e] : [...i, e]), t.set(n, i);
        }),
        Array.from(t.values())
      );
    }
    flush() {
      if (this.paused || 0 === this.signalBuffer.length) return;
      this.groupItems(this.signalBuffer).forEach(this.sendFn),
        (this.signalBuffer = []);
    }
  }
  var U;
  (e.TransportItemType = void 0),
    ((U = e.TransportItemType || (e.TransportItemType = {})).EXCEPTION =
      "exception"),
    (U.LOG = "log"),
    (U.MEASUREMENT = "measurement"),
    (U.TRACE = "trace"),
    (U.EVENT = "event");
  const B = {
    [e.TransportItemType.EXCEPTION]: "exceptions",
    [e.TransportItemType.LOG]: "logs",
    [e.TransportItemType.MEASUREMENT]: "measurements",
    [e.TransportItemType.TRACE]: "traces",
    [e.TransportItemType.EVENT]: "events",
  };
  function F(e, t, n, i) {
    var r;
    t.debug("Initializing transports");
    const o = [];
    let s = n.paused,
      a = [];
    const u = (e) => {
        let t = e;
        for (const e of a) {
          const i = t.map(e).filter(Boolean);
          if (0 === i.length) return [];
          t = z(i, n);
        }
        return t;
      },
      c = (e) => {
        const n = u(e);
        if (0 !== n.length)
          for (const e of o)
            t.debug(`Transporting item using ${e.name}\n`, n),
              e.isBatched() && e.send(n);
      };
    let l;
    (null === (r = n.batching) || void 0 === r ? void 0 : r.enabled) &&
      (l = new R(c, {
        sendTimeout: n.batching.sendTimeout,
        itemLimit: n.batching.itemLimit,
        paused: s,
      }));
    return {
      add: (...r) => {
        t.debug("Adding transports"),
          r.forEach((r) => {
            t.debug(`Adding "${r.name}" transport`);
            o.some((e) => e === r)
              ? t.warn(`Transport ${r.name} is already added`)
              : ((r.unpatchedConsole = e),
                (r.internalLogger = t),
                (r.config = n),
                (r.metas = i),
                o.push(r));
          });
      },
      addBeforeSendHooks: (...e) => {
        t.debug("Adding beforeSendHooks\n", a),
          e.forEach((e) => {
            e && a.push(e);
          });
      },
      getBeforeSendHooks: () => [...a],
      execute: (e) => {
        var i;
        s ||
          ((null === (i = n.batching) || void 0 === i ? void 0 : i.enabled) &&
            (null == l || l.addItem(e)),
          ((e) => {
            var i, r;
            if (
              (null === (i = n.batching) || void 0 === i
                ? void 0
                : i.enabled) &&
              o.every((e) => e.isBatched())
            )
              return;
            const [s] = u([e]);
            if (void 0 !== s)
              for (const e of o)
                t.debug(`Transporting item using ${e.name}\n`, s),
                  e.isBatched()
                    ? (null === (r = n.batching) || void 0 === r
                        ? void 0
                        : r.enabled) || e.send([s])
                    : e.send(s);
          })(e));
      },
      isPaused: () => s,
      pause: () => {
        t.debug("Pausing transports"), null == l || l.pause(), (s = !0);
      },
      remove: (...e) => {
        t.debug("Removing transports"),
          e.forEach((e) => {
            t.debug(`Removing "${e.name}" transport`);
            const n = o.indexOf(e);
            -1 !== n
              ? o.splice(n, 1)
              : t.warn(`Transport "${e.name}" is not added`);
          });
      },
      removeBeforeSendHooks: (...e) => {
        a.filter((t) => !e.includes(t));
      },
      get transports() {
        return [...o];
      },
      unpause: () => {
        t.debug("Unpausing transports"), null == l || l.start(), (s = !1);
      },
    };
  }
  function z(t, n) {
    if (n.preserveOriginalError)
      for (const n of t)
        n.type === e.TransportItemType.EXCEPTION &&
          delete n.payload.originalError;
    return t;
  }
  var q;
  (e.InternalLoggerLevel = void 0),
    ((q = e.InternalLoggerLevel || (e.InternalLoggerLevel = {}))[(q.OFF = 0)] =
      "OFF"),
    (q[(q.ERROR = 1)] = "ERROR"),
    (q[(q.WARN = 2)] = "WARN"),
    (q[(q.INFO = 3)] = "INFO"),
    (q[(q.VERBOSE = 4)] = "VERBOSE");
  const V = { debug: C, error: C, info: C, prefix: "Faro", warn: C },
    $ = e.InternalLoggerLevel.ERROR,
    G = Object.assign({}, console);
  let H = G;
  function W(e) {
    var t;
    return (H = null !== (t = e.unpatchedConsole) && void 0 !== t ? t : H), H;
  }
  function K(t = G, n = $) {
    const i = V;
    return (
      n > e.InternalLoggerLevel.OFF &&
        ((i.error =
          n >= e.InternalLoggerLevel.ERROR
            ? function (...e) {
                t.error(`${i.prefix}\n`, ...e);
              }
            : C),
        (i.warn =
          n >= e.InternalLoggerLevel.WARN
            ? function (...e) {
                t.warn(`${i.prefix}\n`, ...e);
              }
            : C),
        (i.info =
          n >= e.InternalLoggerLevel.INFO
            ? function (...e) {
                t.info(`${i.prefix}\n`, ...e);
              }
            : C),
        (i.debug =
          n >= e.InternalLoggerLevel.VERBOSE
            ? function (...e) {
                t.debug(`${i.prefix}\n`, ...e);
              }
            : C)),
      i
    );
  }
  let X = V;
  function J(e, t) {
    return (X = K(e, t.internalLoggerLevel)), X;
  }
  class Z {
    constructor() {
      (this.unpatchedConsole = G),
        (this.internalLogger = V),
        (this.config = {}),
        (this.metas = {});
    }
    logDebug(...e) {
      this.internalLogger.debug(`${this.name}\n`, ...e);
    }
    logInfo(...e) {
      this.internalLogger.info(`${this.name}\n`, ...e);
    }
    logWarn(...e) {
      this.internalLogger.warn(`${this.name}\n`, ...e);
    }
    logError(...e) {
      this.internalLogger.error(`${this.name}\n`, ...e);
    }
  }
  class Y extends Z {
    isBatched() {
      return !1;
    }
    getIgnoreUrls() {
      return [];
    }
  }
  function Q(e, t) {
    var n, i;
    if (void 0 === t) return e;
    if (void 0 === e) return { resourceSpans: t };
    const r = null === (n = e.resourceSpans) || void 0 === n ? void 0 : n[0];
    if (void 0 === r) return e;
    const o = (null == r ? void 0 : r.scopeSpans) || [],
      s =
        (null === (i = null == t ? void 0 : t[0]) || void 0 === i
          ? void 0
          : i.scopeSpans) || [];
    return Object.assign(Object.assign({}, e), {
      resourceSpans: [
        Object.assign(Object.assign({}, r), { scopeSpans: [...o, ...s] }),
      ],
    });
  }
  function ee(t) {
    let n = { meta: {} };
    return (
      void 0 !== t[0] && (n.meta = t[0].meta),
      t.forEach((t) => {
        switch (t.type) {
          case e.TransportItemType.LOG:
          case e.TransportItemType.EVENT:
          case e.TransportItemType.EXCEPTION:
          case e.TransportItemType.MEASUREMENT:
            const i = B[t.type],
              r = n[i];
            n = Object.assign(Object.assign({}, n), {
              [i]: void 0 === r ? [t.payload] : [...r, t.payload],
            });
            break;
          case e.TransportItemType.TRACE:
            n = Object.assign(Object.assign({}, n), {
              traces: Q(n.traces, t.payload.resourceSpans),
            });
        }
      }),
      n
    );
  }
  const te = "user-action-start",
    ne = "user-action-end",
    ie = "user-action-cancel",
    re = "user-action-halt";
  const oe = "Error",
    se = (e) => e.map((e) => (u(e) ? N(e) : String(e))).join(" ");
  let ae;
  function ue({
    internalLogger: t,
    config: n,
    metas: i,
    transports: s,
    tracesApi: a,
    actionBuffer: c,
    getMessage: d,
  }) {
    var f;
    t.debug("Initializing exceptions API");
    let p = null;
    ae = null !== (f = n.parseStacktrace) && void 0 !== f ? f : ae;
    const g = (e) => {
        t.debug("Changing stacktrace parser"), (ae = null != e ? e : ae);
      },
      { ignoreErrors: v = [], preserveOriginalError: h } = n;
    return (
      g(n.parseStacktrace),
      {
        changeStacktraceParser: g,
        getStacktraceParser: () => ae,
        pushError: (
          f,
          {
            skipDedupe: g,
            stackFrames: b,
            type: w,
            context: y,
            spanContext: E,
            timestampOverwriteMs: O,
            originalError: x,
          } = {}
        ) => {
          if (
            !(function (e, t) {
              const { message: n, name: i, stack: r } = t;
              return (
                (s = e),
                (a = n + " " + i + " " + r),
                s.some((e) => (o(e) ? a.includes(e) : !!a.match(e)))
              );
              var s, a;
            })(v, null != x ? x : f)
          )
            try {
              const o = _(
                  Object.assign(
                    Object.assign(
                      {},
                      (function (e) {
                        let t = e.cause;
                        m(t)
                          ? (t = e.cause.toString())
                          : null !== t && (u(e.cause) || l(e.cause))
                          ? (t = N(e.cause))
                          : null != t && (t = e.cause.toString());
                        return null == t ? {} : { cause: t };
                      })(null != x ? x : f)
                    ),
                    null != y ? y : {}
                  )
                ),
                v = {
                  meta: i.value,
                  payload: Object.assign(
                    Object.assign(
                      {
                        type: w || f.name || oe,
                        value: f.message,
                        timestamp: O ? k(O) : I(),
                        trace: E
                          ? { trace_id: E.traceId, span_id: E.spanId }
                          : a.getTraceContext(),
                      },
                      S(o) ? {} : { context: o }
                    ),
                    h ? { originalError: x } : {}
                  ),
                  type: e.TransportItemType.EXCEPTION,
                };
              (null ==
              (b =
                null != b
                  ? b
                  : f.stack
                  ? null == ae
                    ? void 0
                    : ae(f).frames
                  : void 0)
                ? void 0
                : b.length) && (v.payload.stacktrace = { frames: b });
              const L = {
                type: v.payload.type,
                value: v.payload.value,
                stackTrace: v.payload.stacktrace,
                context: v.payload.context,
              };
              if (!g && n.dedupe && !r(p) && T(L, p))
                return void t.debug(
                  "Skipping error push because it is the same as the last one\n",
                  v.payload
                );
              (p = L), t.debug("Pushing exception\n", v);
              const C = d();
              C && C.type === te ? c.addItem(v) : s.execute(v);
            } catch (e) {
              t.error("Error pushing event", e);
            }
        },
      }
    );
  }
  const ce = (e) =>
    e
      .map((e) => {
        try {
          return String(e);
        } catch (e) {
          return "";
        }
      })
      .join(" ");
  class le {
    constructor() {
      this.buffer = [];
    }
    addItem(e) {
      this.buffer.push(e);
    }
    flushBuffer(e) {
      if (c(e)) for (const t of this.buffer) e(t);
      this.buffer.length = 0;
    }
    size() {
      return this.buffer.length;
    }
  }
  function de({ apiMessageBus: t, transports: n, config: i }) {
    const r = new le(),
      o = i.trackUserActionsExcludeItem;
    let s;
    t.subscribe((t) => {
      if (te !== t.type && re !== t.type) {
        if (t.type === ne) {
          const { id: i, name: a } = t;
          return (
            r.flushBuffer((t) => {
              if (
                (function (t, n) {
                  return (
                    (null == n ? void 0 : n(t)) ||
                    (t.type === e.TransportItemType.MEASUREMENT &&
                      "web-vitals" === t.payload.type)
                  );
                })(t, o)
              )
                return void n.execute(t);
              const r = Object.assign(Object.assign({}, t), {
                payload: Object.assign(Object.assign({}, t.payload), {
                  action: { parentId: i, name: a },
                }),
              });
              n.execute(r);
            }),
            void (s = void 0)
          );
        }
        t.type === ie &&
          ((s = void 0),
          r.flushBuffer((e) => {
            n.execute(e);
          }));
      } else s = t;
    });
    return { actionBuffer: r, getMessage: () => s };
  }
  const fe = new D();
  function pe(t, n, i, s, a) {
    n.debug("Initializing API");
    const { actionBuffer: u, getMessage: c } = de({
        apiMessageBus: fe,
        transports: a,
        config: i,
      }),
      l = (function (t, n, i, r, o) {
        let s;
        return (
          n.debug("Initializing traces API"),
          {
            getOTEL: () => s,
            getTraceContext: () => {
              const e =
                null == s ? void 0 : s.trace.getSpanContext(s.context.active());
              return e ? { trace_id: e.traceId, span_id: e.spanId } : void 0;
            },
            initOTEL: (e, t) => {
              n.debug("Initializing OpenTelemetry"),
                (s = { trace: e, context: t });
            },
            isOTELInitialized: () => !!s,
            pushTraces: (t) => {
              try {
                const i = {
                  type: e.TransportItemType.TRACE,
                  payload: t,
                  meta: r.value,
                };
                n.debug("Pushing trace\n", i), o.execute(i);
              } catch (e) {
                n.error("Error pushing trace\n", e);
              }
            },
          }
        );
      })(0, n, 0, s, a),
      d = {
        unpatchedConsole: t,
        internalLogger: n,
        config: i,
        metas: s,
        transports: a,
        tracesApi: l,
        actionBuffer: u,
        getMessage: c,
      };
    return Object.assign(
      Object.assign(
        Object.assign(
          Object.assign(
            Object.assign(Object.assign({}, l), ue(d)),
            (function ({ internalLogger: e, metas: t }) {
              let n, i, r, s;
              e.debug("Initializing meta API");
              const a = (e) => {
                  i && t.remove(i), (i = { user: e }), t.add(i);
                },
                u = (e, i) => {
                  var r;
                  const o = null == i ? void 0 : i.overrides,
                    s = o
                      ? {
                          overrides: Object.assign(
                            Object.assign(
                              {},
                              null === (r = null == n ? void 0 : n.session) ||
                                void 0 === r
                                ? void 0
                                : r.overrides
                            ),
                            o
                          ),
                        }
                      : {};
                  n && t.remove(n),
                    (n = {
                      session: Object.assign(
                        Object.assign({}, S(e) ? void 0 : e),
                        s
                      ),
                    }),
                    t.add(n);
                },
                c = () => t.value.session,
                l = () => t.value.page;
              return {
                setUser: a,
                resetUser: a,
                setSession: u,
                resetSession: u,
                getSession: c,
                setView: (e, n) => {
                  var i;
                  if (
                    ((null == n ? void 0 : n.overrides) &&
                      u(c(), { overrides: n.overrides }),
                    (null === (i = null == r ? void 0 : r.view) || void 0 === i
                      ? void 0
                      : i.name) === (null == e ? void 0 : e.name))
                  )
                    return;
                  const o = r;
                  (r = { view: e }), t.add(r), o && t.remove(o);
                },
                getView: () => t.value.view,
                setPage: (e) => {
                  var n;
                  const i = o(e)
                    ? Object.assign(
                        Object.assign(
                          {},
                          null !== (n = null == s ? void 0 : s.page) &&
                            void 0 !== n
                            ? n
                            : l()
                        ),
                        { id: e }
                      )
                    : e;
                  s && t.remove(s), (s = { page: i }), t.add(s);
                },
                getPage: l,
              };
            })(d)
          ),
          (function ({
            internalLogger: t,
            config: n,
            metas: i,
            transports: o,
            tracesApi: s,
            actionBuffer: a,
            getMessage: u,
          }) {
            var c;
            t.debug("Initializing logs API");
            let l = null;
            const d =
              null !== (c = n.logArgsSerializer) && void 0 !== c ? c : ce;
            return {
              pushLog: (
                c,
                {
                  context: f,
                  level: p,
                  skipDedupe: g,
                  spanContext: m,
                  timestampOverwriteMs: v,
                } = {}
              ) => {
                try {
                  const h = _(f),
                    b = {
                      type: e.TransportItemType.LOG,
                      payload: {
                        message: d(c),
                        level: null != p ? p : x,
                        context: S(h) ? void 0 : h,
                        timestamp: v ? k(v) : I(),
                        trace: m
                          ? { trace_id: m.traceId, span_id: m.spanId }
                          : s.getTraceContext(),
                      },
                      meta: i.value,
                    },
                    w = {
                      message: b.payload.message,
                      level: b.payload.level,
                      context: b.payload.context,
                    };
                  if (!g && n.dedupe && !r(l) && T(w, l))
                    return void t.debug(
                      "Skipping log push because it is the same as the last one\n",
                      b.payload
                    );
                  (l = w), t.debug("Pushing log\n", b);
                  const y = u();
                  y && y.type === te ? a.addItem(b) : o.execute(b);
                } catch (e) {
                  t.error("Error pushing log\n", e);
                }
              },
            };
          })(d)
        ),
        (function ({
          internalLogger: t,
          config: n,
          metas: i,
          transports: o,
          tracesApi: s,
          actionBuffer: a,
          getMessage: u,
        }) {
          t.debug("Initializing measurements API");
          let c = null;
          return {
            pushMeasurement: (
              l,
              {
                skipDedupe: d,
                context: f,
                spanContext: p,
                timestampOverwriteMs: g,
              } = {}
            ) => {
              try {
                const m = _(f),
                  v = {
                    type: e.TransportItemType.MEASUREMENT,
                    payload: Object.assign(Object.assign({}, l), {
                      trace: p
                        ? { trace_id: p.traceId, span_id: p.spanId }
                        : s.getTraceContext(),
                      timestamp: g ? k(g) : I(),
                      context: S(m) ? void 0 : m,
                    }),
                    meta: i.value,
                  },
                  h = {
                    type: v.payload.type,
                    values: v.payload.values,
                    context: v.payload.context,
                  };
                if (!d && n.dedupe && !r(c) && T(h, c))
                  return void t.debug(
                    "Skipping measurement push because it is the same as the last one\n",
                    v.payload
                  );
                (c = h), t.debug("Pushing measurement\n", v);
                const b = u();
                b && b.type === te ? a.addItem(v) : o.execute(v);
              } catch (e) {
                t.error("Error pushing measurement\n", e);
              }
            },
          };
        })(d)
      ),
      (function ({
        internalLogger: t,
        config: n,
        metas: i,
        transports: o,
        tracesApi: s,
        actionBuffer: a,
        getMessage: u,
      }) {
        let c = null;
        return {
          pushEvent: (
            l,
            d,
            f,
            {
              skipDedupe: p,
              spanContext: g,
              timestampOverwriteMs: m,
              customPayloadTransformer: v = (e) => e,
            } = {}
          ) => {
            try {
              const h = _(d),
                b = {
                  meta: i.value,
                  payload: v({
                    name: l,
                    domain: null != f ? f : n.eventDomain,
                    attributes: S(h) ? void 0 : h,
                    timestamp: m ? k(m) : I(),
                    trace: g
                      ? { trace_id: g.traceId, span_id: g.spanId }
                      : s.getTraceContext(),
                  }),
                  type: e.TransportItemType.EVENT,
                },
                w = {
                  name: b.payload.name,
                  attributes: b.payload.attributes,
                  domain: b.payload.domain,
                };
              if (!p && n.dedupe && !r(c) && T(w, c))
                return void t.debug(
                  "Skipping event push because it is the same as the last one\n",
                  b.payload
                );
              (c = w), t.debug("Pushing event\n", b);
              const y = u();
              y && y.type === te ? a.addItem(b) : o.execute(b);
            } catch (e) {
              t.error("Error pushing event", e);
            }
          },
        };
      })(d)
    );
  }
  class ge extends Z {
    constructor() {
      super(...arguments), (this.api = {}), (this.transports = {});
    }
  }
  const me = "1.18.1";
  const ve = "_faroInternal";
  function he(e) {
    e.config.isolate
      ? e.internalLogger.debug(
          "Skipping registering internal Faro instance on global object"
        )
      : (e.internalLogger.debug(
          "Registering internal Faro instance on global object"
        ),
        Object.defineProperty(j, ve, {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: e,
        }));
  }
  function be() {
    return ve in j;
  }
  function we(t, n, i, r, o, s, a) {
    return (
      n.debug("Initializing Faro"),
      (e.faro = {
        api: s,
        config: i,
        instrumentations: a,
        internalLogger: n,
        metas: r,
        pause: o.pause,
        transports: o,
        unpatchedConsole: t,
        unpause: o.unpause,
      }),
      he(e.faro),
      (function (e) {
        if (e.config.preventGlobalExposure)
          e.internalLogger.debug(
            "Skipping registering public Faro instance in the global scope"
          );
        else {
          if (
            (e.internalLogger.debug(
              `Registering public faro reference in the global scope using "${e.config.globalObjectKey}" key`
            ),
            e.config.globalObjectKey in j)
          )
            return void e.internalLogger.warn(
              `Skipping global registration due to key "${e.config.globalObjectKey}" being used already. Please set "globalObjectKey" to something else or set "preventGlobalExposure" to "true"`
            );
          Object.defineProperty(j, e.config.globalObjectKey, {
            configurable: !1,
            writable: !1,
            value: e,
          });
        }
      })(e.faro),
      e.faro
    );
  }
  function ye(e) {
    const t = W(e),
      n = J(t, e);
    if (be() && !e.isolate)
      return void n.error(
        'Faro is already registered. Either add instrumentations, transports etc. to the global faro instance or use the "isolate" property'
      );
    n.debug("Initializing");
    const i = (function (e, t) {
        let n = [],
          i = [];
        const r = () =>
            n.reduce((e, t) => Object.assign(e, c(t) ? t() : t), {}),
          o = () => {
            if (i.length) {
              const e = r();
              i.forEach((t) => t(e));
            }
          };
        return {
          add: (...e) => {
            t.debug("Adding metas\n", e), n.push(...e), o();
          },
          remove: (...e) => {
            t.debug("Removing metas\n", e),
              (n = n.filter((t) => !e.includes(t))),
              o();
          },
          addListener: (e) => {
            t.debug("Adding metas listener\n", e), i.push(e);
          },
          removeListener: (e) => {
            t.debug("Removing metas listener\n", e),
              (i = i.filter((t) => t !== e));
          },
          get value() {
            return r();
          },
        };
      })(0, n),
      r = F(t, n, e, i),
      o = pe(t, n, e, i, r),
      s = (function (e, t, n, i, r, o) {
        t.debug("Initializing instrumentations");
        const s = [];
        return {
          add: (...a) => {
            t.debug("Adding instrumentations"),
              a.forEach((a) => {
                t.debug(`Adding "${a.name}" instrumentation`),
                  s.some((e) => e.name === a.name)
                    ? t.warn(`Instrumentation ${a.name} is already added`)
                    : ((a.unpatchedConsole = e),
                      (a.internalLogger = t),
                      (a.config = n),
                      (a.metas = i),
                      (a.transports = r),
                      (a.api = o),
                      s.push(a),
                      a.initialize());
              });
          },
          get instrumentations() {
            return [...s];
          },
          remove: (...e) => {
            t.debug("Removing instrumentations"),
              e.forEach((e) => {
                var n, i;
                t.debug(`Removing "${e.name}" instrumentation`);
                const r = s.reduce(
                  (t, n, i) => (null === t && n.name === e.name ? i : null),
                  null
                );
                r
                  ? (null === (i = (n = s[r]).destroy) ||
                      void 0 === i ||
                      i.call(n),
                    s.splice(r, 1))
                  : t.warn(`Instrumentation "${e.name}" is not added`);
              });
          },
        };
      })(t, n, e, i, r, o),
      a = we(t, n, e, i, r, o, s);
    return (
      (function (e) {
        var t, n;
        const i = {
          sdk: { version: me },
          app: {
            bundleId:
              e.config.app.name &&
              ((r = e.config.app.name),
              null == j ? void 0 : j[`__faroBundleId_${r}`]),
          },
        };
        var r;
        const o =
          null === (t = e.config.sessionTracking) || void 0 === t
            ? void 0
            : t.session;
        o && e.api.setSession(o),
          e.config.app &&
            (i.app = Object.assign(Object.assign({}, e.config.app), i.app)),
          e.config.user && (i.user = e.config.user),
          e.config.view && (i.view = e.config.view),
          e.metas.add(
            i,
            ...(null !== (n = e.config.metas) && void 0 !== n ? n : [])
          );
      })(a),
      (function (e) {
        e.transports.add(...e.config.transports),
          e.transports.addBeforeSendHooks(e.config.beforeSend);
      })(a),
      (function (e) {
        e.instrumentations.add(...e.config.instrumentations);
      })(a),
      a
    );
  }
  e.faro = {};
  const Se = "faro",
    Te = { enabled: !0, sendTimeout: 250, itemLimit: 50 },
    Ee = "view_changed",
    Ie = "session_start",
    ke = "session_resume",
    Oe = "session_extend",
    xe = "service_name_override",
    Le = "unknown";
  var Ce,
    Ae = { exports: {} },
    Pe = Ae.exports;
  var Me =
    (Ce ||
      ((Ce = 1),
      (function (e, t) {
        !(function (n, i) {
          var r = "function",
            o = "undefined",
            s = "object",
            a = "string",
            u = "major",
            c = "model",
            l = "name",
            d = "type",
            f = "vendor",
            p = "version",
            g = "architecture",
            m = "console",
            v = "mobile",
            h = "tablet",
            b = "smarttv",
            w = "wearable",
            y = "embedded",
            S = "Amazon",
            T = "Apple",
            E = "ASUS",
            I = "BlackBerry",
            k = "Browser",
            O = "Chrome",
            x = "Firefox",
            L = "Google",
            C = "Huawei",
            A = "LG",
            P = "Microsoft",
            M = "Motorola",
            j = "Opera",
            N = "Samsung",
            _ = "Sharp",
            D = "Sony",
            R = "Xiaomi",
            U = "Zebra",
            B = "Facebook",
            F = "Chromium OS",
            z = "Mac OS",
            q = " Browser",
            V = function (e) {
              for (var t = {}, n = 0; n < e.length; n++)
                t[e[n].toUpperCase()] = e[n];
              return t;
            },
            $ = function (e, t) {
              return typeof e === a && -1 !== G(t).indexOf(G(e));
            },
            G = function (e) {
              return e.toLowerCase();
            },
            H = function (e, t) {
              if (typeof e === a)
                return (
                  (e = e.replace(/^\s\s*/, "")),
                  typeof t === o ? e : e.substring(0, 500)
                );
            },
            W = function (e, t) {
              for (var n, o, a, u, c, l, d = 0; d < t.length && !c; ) {
                var f = t[d],
                  p = t[d + 1];
                for (n = o = 0; n < f.length && !c && f[n]; )
                  if ((c = f[n++].exec(e)))
                    for (a = 0; a < p.length; a++)
                      (l = c[++o]),
                        typeof (u = p[a]) === s && u.length > 0
                          ? 2 === u.length
                            ? typeof u[1] == r
                              ? (this[u[0]] = u[1].call(this, l))
                              : (this[u[0]] = u[1])
                            : 3 === u.length
                            ? typeof u[1] !== r || (u[1].exec && u[1].test)
                              ? (this[u[0]] = l ? l.replace(u[1], u[2]) : i)
                              : (this[u[0]] = l ? u[1].call(this, l, u[2]) : i)
                            : 4 === u.length &&
                              (this[u[0]] = l
                                ? u[3].call(this, l.replace(u[1], u[2]))
                                : i)
                          : (this[u] = l || i);
                d += 2;
              }
            },
            K = function (e, t) {
              for (var n in t)
                if (typeof t[n] === s && t[n].length > 0) {
                  for (var r = 0; r < t[n].length; r++)
                    if ($(t[n][r], e)) return "?" === n ? i : n;
                } else if ($(t[n], e)) return "?" === n ? i : n;
              return t.hasOwnProperty("*") ? t["*"] : e;
            },
            X = {
              ME: "4.90",
              "NT 3.11": "NT3.51",
              "NT 4.0": "NT4.0",
              2e3: "NT 5.0",
              XP: ["NT 5.1", "NT 5.2"],
              Vista: "NT 6.0",
              7: "NT 6.1",
              8: "NT 6.2",
              8.1: "NT 6.3",
              10: ["NT 6.4", "NT 10.0"],
              RT: "ARM",
            },
            J = {
              browser: [
                [/\b(?:crmo|crios)\/([\w\.]+)/i],
                [p, [l, "Chrome"]],
                [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                [p, [l, "Edge"]],
                [
                  /(opera mini)\/([-\w\.]+)/i,
                  /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
                  /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
                ],
                [l, p],
                [/opios[\/ ]+([\w\.]+)/i],
                [p, [l, j + " Mini"]],
                [/\bop(?:rg)?x\/([\w\.]+)/i],
                [p, [l, j + " GX"]],
                [/\bopr\/([\w\.]+)/i],
                [p, [l, j]],
                [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
                [p, [l, "Baidu"]],
                [/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i],
                [p, [l, "Maxthon"]],
                [
                  /(kindle)\/([\w\.]+)/i,
                  /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
                  /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
                  /(?:ms|\()(ie) ([\w\.]+)/i,
                  /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon)\/([-\w\.]+)/i,
                  /(heytap|ovi|115)browser\/([\d\.]+)/i,
                  /(weibo)__([\d\.]+)/i,
                ],
                [l, p],
                [/quark(?:pc)?\/([-\w\.]+)/i],
                [p, [l, "Quark"]],
                [/\bddg\/([\w\.]+)/i],
                [p, [l, "DuckDuckGo"]],
                [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
                [p, [l, "UC" + k]],
                [
                  /microm.+\bqbcore\/([\w\.]+)/i,
                  /\bqbcore\/([\w\.]+).+microm/i,
                  /micromessenger\/([\w\.]+)/i,
                ],
                [p, [l, "WeChat"]],
                [/konqueror\/([\w\.]+)/i],
                [p, [l, "Konqueror"]],
                [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
                [p, [l, "IE"]],
                [/ya(?:search)?browser\/([\w\.]+)/i],
                [p, [l, "Yandex"]],
                [/slbrowser\/([\w\.]+)/i],
                [p, [l, "Smart Lenovo " + k]],
                [/(avast|avg)\/([\w\.]+)/i],
                [[l, /(.+)/, "$1 Secure " + k], p],
                [/\bfocus\/([\w\.]+)/i],
                [p, [l, x + " Focus"]],
                [/\bopt\/([\w\.]+)/i],
                [p, [l, j + " Touch"]],
                [/coc_coc\w+\/([\w\.]+)/i],
                [p, [l, "Coc Coc"]],
                [/dolfin\/([\w\.]+)/i],
                [p, [l, "Dolphin"]],
                [/coast\/([\w\.]+)/i],
                [p, [l, j + " Coast"]],
                [/miuibrowser\/([\w\.]+)/i],
                [p, [l, "MIUI" + q]],
                [/fxios\/([\w\.-]+)/i],
                [p, [l, x]],
                [/\bqihoobrowser\/?([\w\.]*)/i],
                [p, [l, "360"]],
                [/\b(qq)\/([\w\.]+)/i],
                [[l, /(.+)/, "$1Browser"], p],
                [/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],
                [[l, /(.+)/, "$1" + q], p],
                [/samsungbrowser\/([\w\.]+)/i],
                [p, [l, N + " Internet"]],
                [/metasr[\/ ]?([\d\.]+)/i],
                [p, [l, "Sogou Explorer"]],
                [/(sogou)mo\w+\/([\d\.]+)/i],
                [[l, "Sogou Mobile"], p],
                [
                  /(electron)\/([\w\.]+) safari/i,
                  /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
                  /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i,
                ],
                [l, p],
                [/(lbbrowser|rekonq)/i, /\[(linkedin)app\]/i],
                [l],
                [
                  /ome\/([\w\.]+) \w* ?(iron) saf/i,
                  /ome\/([\w\.]+).+qihu (360)[es]e/i,
                ],
                [p, l],
                [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
                [[l, B], p],
                [
                  /(Klarna)\/([\w\.]+)/i,
                  /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
                  /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
                  /safari (line)\/([\w\.]+)/i,
                  /\b(line)\/([\w\.]+)\/iab/i,
                  /(alipay)client\/([\w\.]+)/i,
                  /(twitter)(?:and| f.+e\/([\w\.]+))/i,
                  /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i,
                ],
                [l, p],
                [/\bgsa\/([\w\.]+) .*safari\//i],
                [p, [l, "GSA"]],
                [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
                [p, [l, "TikTok"]],
                [/headlesschrome(?:\/([\w\.]+)| )/i],
                [p, [l, O + " Headless"]],
                [/ wv\).+(chrome)\/([\w\.]+)/i],
                [[l, O + " WebView"], p],
                [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
                [p, [l, "Android " + k]],
                [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
                [l, p],
                [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
                [p, [l, "Mobile Safari"]],
                [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
                [p, l],
                [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
                [
                  l,
                  [
                    p,
                    K,
                    {
                      "1.0": "/8",
                      1.2: "/1",
                      1.3: "/3",
                      "2.0": "/412",
                      "2.0.2": "/416",
                      "2.0.3": "/417",
                      "2.0.4": "/419",
                      "?": "/",
                    },
                  ],
                ],
                [/(webkit|khtml)\/([\w\.]+)/i],
                [l, p],
                [/(navigator|netscape\d?)\/([-\w\.]+)/i],
                [[l, "Netscape"], p],
                [/(wolvic|librewolf)\/([\w\.]+)/i],
                [l, p],
                [/mobile vr; rv:([\w\.]+)\).+firefox/i],
                [p, [l, x + " Reality"]],
                [
                  /ekiohf.+(flow)\/([\w\.]+)/i,
                  /(swiftfox)/i,
                  /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
                  /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                  /(firefox)\/([\w\.]+)/i,
                  /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
                  /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                  /(links) \(([\w\.]+)/i,
                ],
                [l, [p, /_/g, "."]],
                [/(cobalt)\/([\w\.]+)/i],
                [l, [p, /master.|lts./, ""]],
              ],
              cpu: [
                [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
                [[g, "amd64"]],
                [/(ia32(?=;))/i],
                [[g, G]],
                [/((?:i[346]|x)86)[;\)]/i],
                [[g, "ia32"]],
                [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
                [[g, "arm64"]],
                [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                [[g, "armhf"]],
                [/windows (ce|mobile); ppc;/i],
                [[g, "arm"]],
                [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
                [[g, /ower/, "", G]],
                [/(sun4\w)[;\)]/i],
                [[g, "sparc"]],
                [
                  /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
                ],
                [[g, G]],
              ],
              device: [
                [
                  /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
                ],
                [c, [f, N], [d, h]],
                [
                  /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
                  /samsung[- ]((?!sm-[lr])[-\w]+)/i,
                  /sec-(sgh\w+)/i,
                ],
                [c, [f, N], [d, v]],
                [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
                [c, [f, T], [d, v]],
                [
                  /\((ipad);[-\w\),; ]+apple/i,
                  /applecoremedia\/[\w\.]+ \((ipad)/i,
                  /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
                ],
                [c, [f, T], [d, h]],
                [/(macintosh);/i],
                [c, [f, T]],
                [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
                [c, [f, _], [d, v]],
                [/(?:honor)([-\w ]+)[;\)]/i],
                [c, [f, "Honor"], [d, v]],
                [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
                [c, [f, C], [d, h]],
                [
                  /(?:huawei)([-\w ]+)[;\)]/i,
                  /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
                ],
                [c, [f, C], [d, v]],
                [
                  /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
                  /\b; (\w+) build\/hm\1/i,
                  /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
                  /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
                  /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
                  /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,
                ],
                [
                  [c, /_/g, " "],
                  [f, R],
                  [d, v],
                ],
                [
                  /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,
                  /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i,
                ],
                [
                  [c, /_/g, " "],
                  [f, R],
                  [d, h],
                ],
                [
                  /; (\w+) bui.+ oppo/i,
                  /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
                ],
                [c, [f, "OPPO"], [d, v]],
                [/\b(opd2\d{3}a?) bui/i],
                [c, [f, "OPPO"], [d, h]],
                [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
                [c, [f, "Vivo"], [d, v]],
                [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
                [c, [f, "Realme"], [d, v]],
                [
                  /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
                  /\bmot(?:orola)?[- ](\w*)/i,
                  /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
                ],
                [c, [f, M], [d, v]],
                [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
                [c, [f, M], [d, h]],
                [
                  /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i,
                ],
                [c, [f, A], [d, h]],
                [
                  /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
                  /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
                  /\blg-?([\d\w]+) bui/i,
                ],
                [c, [f, A], [d, v]],
                [
                  /(ideatab[-\w ]+)/i,
                  /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
                ],
                [c, [f, "Lenovo"], [d, h]],
                [
                  /(?:maemo|nokia).*(n900|lumia \d+)/i,
                  /nokia[-_ ]?([-\w\.]*)/i,
                ],
                [
                  [c, /_/g, " "],
                  [f, "Nokia"],
                  [d, v],
                ],
                [/(pixel c)\b/i],
                [c, [f, L], [d, h]],
                [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
                [c, [f, L], [d, v]],
                [
                  /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
                ],
                [c, [f, D], [d, v]],
                [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
                [
                  [c, "Xperia Tablet"],
                  [f, D],
                  [d, h],
                ],
                [
                  / (kb2005|in20[12]5|be20[12][59])\b/i,
                  /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
                ],
                [c, [f, "OnePlus"], [d, v]],
                [
                  /(alexa)webm/i,
                  /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
                  /(kf[a-z]+)( bui|\)).+silk\//i,
                ],
                [c, [f, S], [d, h]],
                [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
                [
                  [c, /(.+)/g, "Fire Phone $1"],
                  [f, S],
                  [d, v],
                ],
                [/(playbook);[-\w\),; ]+(rim)/i],
                [c, f, [d, h]],
                [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
                [c, [f, I], [d, v]],
                [
                  /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
                ],
                [c, [f, E], [d, h]],
                [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
                [c, [f, E], [d, v]],
                [/(nexus 9)/i],
                [c, [f, "HTC"], [d, h]],
                [
                  /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
                  /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
                  /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i,
                ],
                [f, [c, /_/g, " "], [d, v]],
                [
                  /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i,
                ],
                [c, [f, "TCL"], [d, h]],
                [/(itel) ((\w+))/i],
                [
                  [f, G],
                  c,
                  [d, K, { tablet: ["p10001l", "w7001"], "*": "mobile" }],
                ],
                [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
                [c, [f, "Acer"], [d, h]],
                [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
                [c, [f, "Meizu"], [d, v]],
                [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
                [c, [f, "Ulefone"], [d, v]],
                [
                  /; (energy ?\w+)(?: bui|\))/i,
                  /; energizer ([\w ]+)(?: bui|\))/i,
                ],
                [c, [f, "Energizer"], [d, v]],
                [
                  /; cat (b35);/i,
                  /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i,
                ],
                [c, [f, "Cat"], [d, v]],
                [/((?:new )?andromax[\w- ]+)(?: bui|\))/i],
                [c, [f, "Smartfren"], [d, v]],
                [/droid.+; (a(?:015|06[35]|142p?))/i],
                [c, [f, "Nothing"], [d, v]],
                [
                  /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
                  /; (imo) ((?!tab)[\w ]+?)(?: bui|\))/i,
                  /(hp) ([\w ]+\w)/i,
                  /(asus)-?(\w+)/i,
                  /(microsoft); (lumia[\w ]+)/i,
                  /(lenovo)[-_ ]?([-\w]+)/i,
                  /(jolla)/i,
                  /(oppo) ?([\w ]+) bui/i,
                ],
                [f, c, [d, v]],
                [
                  /(imo) (tab \w+)/i,
                  /(kobo)\s(ereader|touch)/i,
                  /(archos) (gamepad2?)/i,
                  /(hp).+(touchpad(?!.+tablet)|tablet)/i,
                  /(kindle)\/([\w\.]+)/i,
                  /(nook)[\w ]+build\/(\w+)/i,
                  /(dell) (strea[kpr\d ]*[\dko])/i,
                  /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
                  /(trinity)[- ]*(t\d{3}) bui/i,
                  /(gigaset)[- ]+(q\w{1,9}) bui/i,
                  /(vodafone) ([\w ]+)(?:\)| bui)/i,
                ],
                [f, c, [d, h]],
                [/(surface duo)/i],
                [c, [f, P], [d, h]],
                [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
                [c, [f, "Fairphone"], [d, v]],
                [/(u304aa)/i],
                [c, [f, "AT&T"], [d, v]],
                [/\bsie-(\w*)/i],
                [c, [f, "Siemens"], [d, v]],
                [/\b(rct\w+) b/i],
                [c, [f, "RCA"], [d, h]],
                [/\b(venue[\d ]{2,7}) b/i],
                [c, [f, "Dell"], [d, h]],
                [/\b(q(?:mv|ta)\w+) b/i],
                [c, [f, "Verizon"], [d, h]],
                [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
                [c, [f, "Barnes & Noble"], [d, h]],
                [/\b(tm\d{3}\w+) b/i],
                [c, [f, "NuVision"], [d, h]],
                [/\b(k88) b/i],
                [c, [f, "ZTE"], [d, h]],
                [/\b(nx\d{3}j) b/i],
                [c, [f, "ZTE"], [d, v]],
                [/\b(gen\d{3}) b.+49h/i],
                [c, [f, "Swiss"], [d, v]],
                [/\b(zur\d{3}) b/i],
                [c, [f, "Swiss"], [d, h]],
                [/\b((zeki)?tb.*\b) b/i],
                [c, [f, "Zeki"], [d, h]],
                [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
                [[f, "Dragon Touch"], c, [d, h]],
                [/\b(ns-?\w{0,9}) b/i],
                [c, [f, "Insignia"], [d, h]],
                [/\b((nxa|next)-?\w{0,9}) b/i],
                [c, [f, "NextBook"], [d, h]],
                [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
                [[f, "Voice"], c, [d, v]],
                [/\b(lvtel\-)?(v1[12]) b/i],
                [[f, "LvTel"], c, [d, v]],
                [/\b(ph-1) /i],
                [c, [f, "Essential"], [d, v]],
                [/\b(v(100md|700na|7011|917g).*\b) b/i],
                [c, [f, "Envizen"], [d, h]],
                [/\b(trio[-\w\. ]+) b/i],
                [c, [f, "MachSpeed"], [d, h]],
                [/\btu_(1491) b/i],
                [c, [f, "Rotor"], [d, h]],
                [/(shield[\w ]+) b/i],
                [c, [f, "Nvidia"], [d, h]],
                [/(sprint) (\w+)/i],
                [f, c, [d, v]],
                [/(kin\.[onetw]{3})/i],
                [
                  [c, /\./g, " "],
                  [f, P],
                  [d, v],
                ],
                [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                [c, [f, U], [d, h]],
                [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
                [c, [f, U], [d, v]],
                [/smart-tv.+(samsung)/i],
                [f, [d, b]],
                [/hbbtv.+maple;(\d+)/i],
                [
                  [c, /^/, "SmartTV"],
                  [f, N],
                  [d, b],
                ],
                [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
                [
                  [f, A],
                  [d, b],
                ],
                [/(apple) ?tv/i],
                [f, [c, T + " TV"], [d, b]],
                [/crkey/i],
                [
                  [c, O + "cast"],
                  [f, L],
                  [d, b],
                ],
                [/droid.+aft(\w+)( bui|\))/i],
                [c, [f, S], [d, b]],
                [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
                [c, [f, _], [d, b]],
                [/(bravia[\w ]+)( bui|\))/i],
                [c, [f, D], [d, b]],
                [/(mitv-\w{5}) bui/i],
                [c, [f, R], [d, b]],
                [/Hbbtv.*(technisat) (.*);/i],
                [f, c, [d, b]],
                [
                  /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
                  /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i,
                ],
                [
                  [f, H],
                  [c, H],
                  [d, b],
                ],
                [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
                [[d, b]],
                [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
                [f, c, [d, m]],
                [/droid.+; (shield) bui/i],
                [c, [f, "Nvidia"], [d, m]],
                [/(playstation [345portablevi]+)/i],
                [c, [f, D], [d, m]],
                [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
                [c, [f, P], [d, m]],
                [/\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i],
                [c, [f, N], [d, w]],
                [/((pebble))app/i],
                [f, c, [d, w]],
                [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
                [c, [f, T], [d, w]],
                [/droid.+; (glass) \d/i],
                [c, [f, L], [d, w]],
                [/droid.+; (wt63?0{2,3})\)/i],
                [c, [f, U], [d, w]],
                [/droid.+; (glass) \d/i],
                [c, [f, L], [d, w]],
                [/(pico) (4|neo3(?: link|pro)?)/i],
                [f, c, [d, w]],
                [/; (quest( \d| pro)?)/i],
                [c, [f, B], [d, w]],
                [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
                [f, [d, y]],
                [/(aeobc)\b/i],
                [c, [f, S], [d, y]],
                [
                  /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i,
                ],
                [c, [d, v]],
                [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
                [c, [d, h]],
                [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
                [[d, h]],
                [
                  /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i,
                ],
                [[d, v]],
                [/(android[-\w\. ]{0,9});.+buil/i],
                [c, [f, "Generic"]],
              ],
              engine: [
                [/windows.+ edge\/([\w\.]+)/i],
                [p, [l, "EdgeHTML"]],
                [/(arkweb)\/([\w\.]+)/i],
                [l, p],
                [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                [p, [l, "Blink"]],
                [
                  /(presto)\/([\w\.]+)/i,
                  /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
                  /ekioh(flow)\/([\w\.]+)/i,
                  /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
                  /(icab)[\/ ]([23]\.[\d\.]+)/i,
                  /\b(libweb)/i,
                ],
                [l, p],
                [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                [p, l],
              ],
              os: [
                [/microsoft (windows) (vista|xp)/i],
                [l, p],
                [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],
                [l, [p, K, X]],
                [
                  /windows nt 6\.2; (arm)/i,
                  /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
                  /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i,
                ],
                [
                  [p, K, X],
                  [l, "Windows"],
                ],
                [
                  /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
                  /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
                  /cfnetwork\/.+darwin/i,
                ],
                [
                  [p, /_/g, "."],
                  [l, "iOS"],
                ],
                [
                  /(mac os x) ?([\w\. ]*)/i,
                  /(macintosh|mac_powerpc\b)(?!.+haiku)/i,
                ],
                [
                  [l, z],
                  [p, /_/g, "."],
                ],
                [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],
                [p, l],
                [
                  /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish|openharmony)[-\/ ]?([\w\.]*)/i,
                  /(blackberry)\w*\/([\w\.]*)/i,
                  /(tizen|kaios)[\/ ]([\w\.]+)/i,
                  /\((series40);/i,
                ],
                [l, p],
                [/\(bb(10);/i],
                [p, [l, I]],
                [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
                [p, [l, "Symbian"]],
                [
                  /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
                ],
                [p, [l, x + " OS"]],
                [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                [p, [l, "webOS"]],
                [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
                [p, [l, "watchOS"]],
                [/crkey\/([\d\.]+)/i],
                [p, [l, O + "cast"]],
                [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
                [[l, F], p],
                [
                  /panasonic;(viera)/i,
                  /(netrange)mmh/i,
                  /(nettv)\/(\d+\.[\w\.]+)/i,
                  /(nintendo|playstation) ([wids345portablevuch]+)/i,
                  /(xbox); +xbox ([^\);]+)/i,
                  /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
                  /(mint)[\/\(\) ]?(\w*)/i,
                  /(mageia|vectorlinux)[; ]/i,
                  /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                  /(hurd|linux) ?([\w\.]*)/i,
                  /(gnu) ?([\w\.]*)/i,
                  /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
                  /(haiku) (\w+)/i,
                ],
                [l, p],
                [/(sunos) ?([\w\.\d]*)/i],
                [[l, "Solaris"], p],
                [
                  /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
                  /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
                  /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
                  /(unix) ?([\w\.]*)/i,
                ],
                [l, p],
              ],
            },
            Z = function (e, t) {
              if ((typeof e === s && ((t = e), (e = i)), !(this instanceof Z)))
                return new Z(e, t).getResult();
              var m = typeof n !== o && n.navigator ? n.navigator : i,
                b = e || (m && m.userAgent ? m.userAgent : ""),
                w = m && m.userAgentData ? m.userAgentData : i,
                y = t
                  ? (function (e, t) {
                      var n = {};
                      for (var i in e)
                        t[i] && t[i].length % 2 == 0
                          ? (n[i] = t[i].concat(e[i]))
                          : (n[i] = e[i]);
                      return n;
                    })(J, t)
                  : J,
                S = m && m.userAgent == b;
              return (
                (this.getBrowser = function () {
                  var e,
                    t = {};
                  return (
                    (t[l] = i),
                    (t[p] = i),
                    W.call(t, b, y.browser),
                    (t[u] =
                      typeof (e = t[p]) === a
                        ? e.replace(/[^\d\.]/g, "").split(".")[0]
                        : i),
                    S &&
                      m &&
                      m.brave &&
                      typeof m.brave.isBrave == r &&
                      (t[l] = "Brave"),
                    t
                  );
                }),
                (this.getCPU = function () {
                  var e = {};
                  return (e[g] = i), W.call(e, b, y.cpu), e;
                }),
                (this.getDevice = function () {
                  var e = {};
                  return (
                    (e[f] = i),
                    (e[c] = i),
                    (e[d] = i),
                    W.call(e, b, y.device),
                    S && !e[d] && w && w.mobile && (e[d] = v),
                    S &&
                      "Macintosh" == e[c] &&
                      m &&
                      typeof m.standalone !== o &&
                      m.maxTouchPoints &&
                      m.maxTouchPoints > 2 &&
                      ((e[c] = "iPad"), (e[d] = h)),
                    e
                  );
                }),
                (this.getEngine = function () {
                  var e = {};
                  return (e[l] = i), (e[p] = i), W.call(e, b, y.engine), e;
                }),
                (this.getOS = function () {
                  var e = {};
                  return (
                    (e[l] = i),
                    (e[p] = i),
                    W.call(e, b, y.os),
                    S &&
                      !e[l] &&
                      w &&
                      w.platform &&
                      "Unknown" != w.platform &&
                      (e[l] = w.platform
                        .replace(/chrome os/i, F)
                        .replace(/macos/i, z)),
                    e
                  );
                }),
                (this.getResult = function () {
                  return {
                    ua: this.getUA(),
                    browser: this.getBrowser(),
                    engine: this.getEngine(),
                    os: this.getOS(),
                    device: this.getDevice(),
                    cpu: this.getCPU(),
                  };
                }),
                (this.getUA = function () {
                  return b;
                }),
                (this.setUA = function (e) {
                  return (
                    (b = typeof e === a && e.length > 500 ? H(e, 500) : e), this
                  );
                }),
                this.setUA(b),
                this
              );
            };
          (Z.VERSION = "1.0.40"),
            (Z.BROWSER = V([l, p, u])),
            (Z.CPU = V([g])),
            (Z.DEVICE = V([c, f, d, m, v, b, h, w, y])),
            (Z.ENGINE = Z.OS = V([l, p])),
            e.exports && (t = e.exports = Z),
            (t.UAParser = Z);
          var Y = typeof n !== o && (n.jQuery || n.Zepto);
          if (Y && !Y.ua) {
            var Q = new Z();
            (Y.ua = Q.getResult()),
              (Y.ua.get = function () {
                return Q.getUA();
              }),
              (Y.ua.set = function (e) {
                Q.setUA(e);
                var t = Q.getResult();
                for (var n in t) Y.ua[n] = t[n];
              });
          }
        })("object" == typeof window ? window : Pe);
      })(Ae, Ae.exports)),
    Ae.exports);
  const je = () => {
    const e = new Me.UAParser(),
      { name: t, version: n } = e.getBrowser(),
      { name: i, version: r } = e.getOS(),
      o = e.getUA(),
      s = navigator.language,
      a = navigator.userAgent.includes("Mobi"),
      u = (function () {
        if (!t || !n) return;
        if ("userAgentData" in navigator && navigator.userAgentData)
          return navigator.userAgentData.brands;
        return;
      })();
    return {
      browser: {
        name: null != t ? t : Le,
        version: null != n ? n : Le,
        os: `${null != i ? i : Le} ${null != r ? r : Le}`,
        userAgent: null != o ? o : Le,
        language: null != s ? s : Le,
        mobile: a,
        brands: null != u ? u : Le,
        viewportWidth: `${window.innerWidth}`,
        viewportHeight: `${window.innerHeight}`,
      },
    };
  };
  function Ne(t) {
    var n, i, r, o;
    return {
      id:
        null !==
          (o =
            null ===
              (r =
                null ===
                  (i =
                    null === (n = e.faro.config) || void 0 === n
                      ? void 0
                      : n.sessionTracking) || void 0 === i
                  ? void 0
                  : i.generateSessionId) || void 0 === r
              ? void 0
              : r.call(i)) && void 0 !== o
          ? o
          : M(),
      attributes: t,
    };
  }
  const _e = { session: "sessionStorage", local: "localStorage" };
  function De(t) {
    var n;
    try {
      let e;
      e = window[t];
      const n = "__faro_storage_test__";
      return e.setItem(n, n), e.removeItem(n), !0;
    } catch (i) {
      return (
        null === (n = e.faro.internalLogger) ||
          void 0 === n ||
          n.info(`Web storage of type ${t} is not available. Reason: ${i}`),
        !1
      );
    }
  }
  function Re(e, t) {
    return qe(t) ? window[t].getItem(e) : null;
  }
  function Ue(e, t, n) {
    if (qe(n))
      try {
        window[n].setItem(e, t);
      } catch (e) {}
  }
  function Be(e, t) {
    qe(t) && window[t].removeItem(e);
  }
  const Fe = De(_e.local),
    ze = De(_e.session);
  function qe(e) {
    return e === _e.local ? Fe : e === _e.session && ze;
  }
  function Ve(e, t) {
    let n,
      i = !1;
    const r = () => {
      null != n ? (e(...n), (n = null), setTimeout(r, t)) : (i = !1);
    };
    return (...o) => {
      i ? (n = o) : (e(...o), (i = !0), setTimeout(r, t));
    };
  }
  function $e() {
    return e.faro.transports.transports.flatMap((e) => e.getIgnoreUrls());
  }
  function Ge(e = "") {
    return $e().some((t) => e && null != e.match(t));
  }
  function He(e) {
    return o(e)
      ? e
      : e instanceof URL
      ? e.href
      : !S(e) && c(null == e ? void 0 : e.toString)
      ? e.toString()
      : void 0;
  }
  const We = "com.grafana.faro.session",
    Ke = 144e5,
    Xe = 9e5,
    Je = Xe,
    Ze = { enabled: !0, persistent: !1, maxSessionPersistenceTime: Je };
  function Ye() {
    var t, n, i;
    const r = e.faro.config.sessionTracking;
    let o =
      null !==
        (i =
          null !==
            (n =
              null === (t = null == r ? void 0 : r.sampler) || void 0 === t
                ? void 0
                : t.call(r, { metas: e.faro.metas.value })) && void 0 !== n
            ? n
            : null == r
            ? void 0
            : r.samplingRate) && void 0 !== i
        ? i
        : 1;
    if ("number" != typeof o) {
      o = 0;
    }
    return Math.random() < o;
  }
  function Qe({
    sessionId: t,
    started: n,
    lastActivity: i,
    isSampled: r = !0,
  } = {}) {
    var o, s;
    const a = E(),
      u =
        null ===
          (s =
            null === (o = e.faro.config) || void 0 === o
              ? void 0
              : o.sessionTracking) || void 0 === s
          ? void 0
          : s.generateSessionId;
    return (
      null == t && (t = "function" == typeof u ? u() : M()),
      {
        sessionId: t,
        lastActivity: null != i ? i : a,
        started: null != n ? n : a,
        isSampled: r,
      }
    );
  }
  function et(e) {
    if (null == e) return !1;
    const t = E();
    if (!(t - e.started < Ke)) return !1;
    return t - e.lastActivity < Xe;
  }
  function tt({ fetchUserSession: t, storeUserSession: n }) {
    return function ({ forceSessionExtend: i } = { forceSessionExtend: !1 }) {
      var r, o, s;
      if (!t || !n) return;
      const a = e.faro.config.sessionTracking,
        u = null == a ? void 0 : a.persistent;
      if ((u && !Fe) || (!u && !ze)) return;
      const c = t();
      if (!1 === i && et(c))
        n(Object.assign(Object.assign({}, c), { lastActivity: E() }));
      else {
        let t = nt(Qe({ isSampled: Ye() }), c);
        n(t),
          null === (r = e.faro.api) ||
            void 0 === r ||
            r.setSession(t.sessionMeta),
          null === (o = null == a ? void 0 : a.onSessionChange) ||
            void 0 === o ||
            o.call(
              a,
              null !== (s = null == c ? void 0 : c.sessionMeta) && void 0 !== s
                ? s
                : null,
              t.sessionMeta
            );
      }
    };
  }
  function nt(t, n) {
    var i, r, o, s, a, u, c;
    const l = Object.assign(Object.assign({}, t), {
        sessionMeta: {
          id: t.sessionId,
          attributes: Object.assign(
            Object.assign(
              Object.assign(
                {},
                null ===
                  (r =
                    null === (i = e.faro.config.sessionTracking) || void 0 === i
                      ? void 0
                      : i.session) || void 0 === r
                  ? void 0
                  : r.attributes
              ),
              null !==
                (s =
                  null === (o = e.faro.metas.value.session) || void 0 === o
                    ? void 0
                    : o.attributes) && void 0 !== s
                ? s
                : {}
            ),
            { isSampled: t.isSampled.toString() }
          ),
        },
      }),
      d =
        null !==
          (u =
            null === (a = e.faro.metas.value.session) || void 0 === a
              ? void 0
              : a.overrides) && void 0 !== u
          ? u
          : null === (c = null == n ? void 0 : n.sessionMeta) || void 0 === c
          ? void 0
          : c.overrides;
    S(d) || (l.sessionMeta.overrides = d);
    const f = null == n ? void 0 : n.sessionId;
    return null != f && (l.sessionMeta.attributes.previousSession = f), l;
  }
  function it({ fetchUserSession: t, storeUserSession: n }) {
    return function (i) {
      const r = i.session,
        o = t();
      let s = null == r ? void 0 : r.id;
      const a = null == r ? void 0 : r.attributes,
        u = null == r ? void 0 : r.overrides,
        c = null == o ? void 0 : o.sessionMeta,
        l = null == c ? void 0 : c.overrides,
        d = !!u && !T(u, l),
        f = !!a && !T(a, null == c ? void 0 : c.attributes);
      if ((!!r && s !== (null == o ? void 0 : o.sessionId)) || f || d) {
        const t = nt(Qe({ sessionId: s, isSampled: Ye() }), o);
        n(t),
          (function (t, n = {}, i = {}) {
            var r, o, s;
            if (!t) return;
            const a = n.serviceName,
              u =
                null !==
                  (s =
                    null !== (r = i.serviceName) && void 0 !== r
                      ? r
                      : null === (o = e.faro.metas.value.app) || void 0 === o
                      ? void 0
                      : o.name) && void 0 !== s
                  ? s
                  : "";
            a &&
              a !== u &&
              e.faro.api.pushEvent(xe, {
                serviceName: a,
                previousServiceName: u,
              });
          })(d, u, l),
          e.faro.api.setSession(t.sessionMeta);
      }
    };
  }
  class rt {
    constructor() {
      (this.updateSession = Ve(() => this.updateUserSession(), 1e3)),
        (this.updateUserSession = tt({
          fetchUserSession: rt.fetchUserSession,
          storeUserSession: rt.storeUserSession,
        })),
        this.init();
    }
    static removeUserSession() {
      Be(We, rt.storageTypeLocal);
    }
    static storeUserSession(e) {
      Ue(We, N(e), rt.storageTypeLocal);
    }
    static fetchUserSession() {
      const e = Re(We, rt.storageTypeLocal);
      return e ? JSON.parse(e) : null;
    }
    init() {
      document.addEventListener("visibilitychange", () => {
        "visible" === document.visibilityState && this.updateSession();
      }),
        e.faro.metas.addListener(
          it({
            fetchUserSession: rt.fetchUserSession,
            storeUserSession: rt.storeUserSession,
          })
        );
    }
  }
  rt.storageTypeLocal = _e.local;
  class ot {
    constructor() {
      (this.updateSession = Ve(() => this.updateUserSession(), 1e3)),
        (this.updateUserSession = tt({
          fetchUserSession: ot.fetchUserSession,
          storeUserSession: ot.storeUserSession,
        })),
        this.init();
    }
    static removeUserSession() {
      Be(We, ot.storageTypeSession);
    }
    static storeUserSession(e) {
      Ue(We, N(e), ot.storageTypeSession);
    }
    static fetchUserSession() {
      const e = Re(We, ot.storageTypeSession);
      return e ? JSON.parse(e) : null;
    }
    init() {
      document.addEventListener("visibilitychange", () => {
        "visible" === document.visibilityState && this.updateSession();
      }),
        e.faro.metas.addListener(
          it({
            fetchUserSession: ot.fetchUserSession,
            storeUserSession: ot.storeUserSession,
          })
        );
    }
  }
  function st(e) {
    return (null == e ? void 0 : e.persistent) ? rt : ot;
  }
  ot.storageTypeSession = _e.session;
  class at extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-session"),
        (this.version = me);
    }
    sendSessionStartEvent(e) {
      var t, n;
      const i = e.session;
      if (
        i &&
        i.id !==
          (null === (t = this.notifiedSession) || void 0 === t ? void 0 : t.id)
      ) {
        if (
          this.notifiedSession &&
          this.notifiedSession.id ===
            (null === (n = i.attributes) || void 0 === n
              ? void 0
              : n.previousSession)
        )
          return (
            this.api.pushEvent(Oe, {}, void 0, { skipDedupe: !0 }),
            void (this.notifiedSession = i)
          );
        (this.notifiedSession = i),
          this.api.pushEvent(Ie, {}, void 0, { skipDedupe: !0 });
      }
    }
    createInitialSession(e, t) {
      var n, i, r, o, s, a;
      let u,
        c,
        l = e.fetchUserSession();
      if (t.persistent && t.maxSessionPersistenceTime && l) {
        const e = E();
        l.lastActivity < e - t.maxSessionPersistenceTime &&
          (rt.removeUserSession(), (l = null));
      }
      if (et(l)) {
        const e = null == l ? void 0 : l.sessionId;
        c = Qe({
          sessionId: e,
          isSampled: l.isSampled || !1,
          started: null == l ? void 0 : l.started,
        });
        const r = null == l ? void 0 : l.sessionMeta,
          o = Object.assign(
            Object.assign(
              {},
              null === (n = t.session) || void 0 === n ? void 0 : n.overrides
            ),
            null == r ? void 0 : r.overrides
          );
        (c.sessionMeta = Object.assign(Object.assign({}, t.session), {
          id: e,
          attributes: Object.assign(
            Object.assign(
              Object.assign(
                {},
                null === (i = t.session) || void 0 === i ? void 0 : i.attributes
              ),
              null == r ? void 0 : r.attributes
            ),
            { isSampled: c.isSampled.toString() }
          ),
          overrides: o,
        })),
          (u = ke);
      } else {
        const e =
          null !==
            (o = null === (r = t.session) || void 0 === r ? void 0 : r.id) &&
          void 0 !== o
            ? o
            : Ne().id;
        c = Qe({ sessionId: e, isSampled: Ye() });
        const n =
          null === (s = t.session) || void 0 === s ? void 0 : s.overrides;
        (c.sessionMeta = Object.assign(
          {
            id: e,
            attributes: Object.assign(
              { isSampled: c.isSampled.toString() },
              null === (a = t.session) || void 0 === a ? void 0 : a.attributes
            ),
          },
          n ? { overrides: n } : {}
        )),
          (u = Ie);
      }
      return { initialSession: c, lifecycleType: u };
    }
    registerBeforeSendHook(e) {
      var t;
      const { updateSession: n } = new e();
      null === (t = this.transports) ||
        void 0 === t ||
        t.addBeforeSendHooks((e) => {
          var t, i, r;
          n();
          const o =
            null === (t = e.meta.session) || void 0 === t
              ? void 0
              : t.attributes;
          if (o && "true" === (null == o ? void 0 : o.isSampled)) {
            let t = JSON.parse(JSON.stringify(e));
            const n =
              null === (i = t.meta.session) || void 0 === i
                ? void 0
                : i.attributes;
            return (
              null == n || delete n.isSampled,
              0 === Object.keys(null != n ? n : {}).length &&
                (null === (r = t.meta.session) ||
                  void 0 === r ||
                  delete r.attributes),
              t
            );
          }
          return null;
        });
    }
    initialize() {
      this.logDebug("init session instrumentation");
      const e = this.config.sessionTracking;
      if (null == e ? void 0 : e.enabled) {
        const t = st(e);
        this.registerBeforeSendHook(t);
        const { initialSession: n, lifecycleType: i } =
          this.createInitialSession(t, e);
        t.storeUserSession(n);
        const r = n.sessionMeta;
        (this.notifiedSession = r),
          this.api.setSession(r),
          i === Ie && this.api.pushEvent(Ie, {}, void 0, { skipDedupe: !0 }),
          i === ke && this.api.pushEvent(ke, {}, void 0, { skipDedupe: !0 });
      }
      this.metas.addListener(this.sendSessionStartEvent.bind(this));
    }
  }
  const ut = "DOMError",
    ct = "DOMException",
    lt = "Non-Error exception captured with keys:",
    dt = "?",
    ft =
      /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
  const pt = "\n",
    gt = "eval",
    mt = "?",
    vt = "@",
    ht =
      /^\s*at (?:(.*\).*?|.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    bt = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    wt = "eval",
    yt = "address at ",
    St = yt.length,
    Tt =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|safari-extension|safari-web-extension|capacitor)?:\/.*?|\[native code]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
    Et = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    It = " > eval",
    kt = "safari-extension",
    Ot = "safari-web-extension",
    xt = /Minified React error #\d+;/i;
  function Lt(e, t, n, i) {
    const r = { filename: e || document.location.href, function: t || mt };
    return void 0 !== n && (r.lineno = n), void 0 !== i && (r.colno = i), r;
  }
  function Ct(e, t) {
    const n = null == e ? void 0 : e.includes(kt),
      i = !n && (null == e ? void 0 : e.includes(Ot));
    return n || i
      ? [
          (null == e ? void 0 : e.includes(vt)) ? e.split(vt)[0] : e,
          n ? `${kt}:${t}` : `${Ot}:${t}`,
        ]
      : [e, t];
  }
  function At(e) {
    let t = [];
    e.stacktrace
      ? (t = e.stacktrace.split(pt).filter((e, t) => t % 2 == 0))
      : e.stack && (t = e.stack.split(pt));
    const n = t.reduce((t, n, i) => {
      let r, o, a, u, c;
      if ((r = ht.exec(n))) {
        if (
          ((o = r[1]),
          (a = r[2]),
          (u = r[3]),
          (c = r[4]),
          null == a ? void 0 : a.startsWith(wt))
        ) {
          const e = bt.exec(a);
          e && ((a = e[1]), (u = e[2]), (c = e[3]));
        }
        (a = (null == a ? void 0 : a.startsWith(yt)) ? a.substring(St) : a),
          ([o, a] = Ct(o, a));
      } else if ((r = Tt.exec(n))) {
        if (
          ((o = r[1]), (a = r[3]), (u = r[4]), (c = r[5]), a && a.includes(It))
        ) {
          const e = Et.exec(a);
          e && ((o = o || gt), (a = e[1]), (u = e[2]));
        } else
          0 === i &&
            !c &&
            s(e.columnNumber) &&
            (c = String(e.columnNumber + 1));
        [o, a] = Ct(o, a);
      }
      return (
        (a || o) &&
          t.push(Lt(a, o, u ? Number(u) : void 0, c ? Number(c) : void 0)),
        t
      );
    }, []);
    return xt.test(e.message) ? n.slice(1) : n;
  }
  function Pt(e) {
    return { frames: At(e) };
  }
  function Mt(e) {
    let t,
      n,
      i,
      r,
      o = [];
    if (v(e) && e.error)
      (t = e.error.message), (n = e.error.name), (o = At(e.error));
    else if ((i = h(e)) || b(e)) {
      const { name: r, message: o } = e;
      (n = null != r ? r : i ? ut : ct), (t = o ? `${n}: ${o}` : n);
    } else
      m(e)
        ? ((t = e.message), (o = At(e)))
        : (u(e) || (r = p(e))) &&
          ((n = r ? e.constructor.name : void 0),
          (t = `${lt} ${Object.keys(e)}`));
    return [t, n, o];
  }
  function jt(e) {
    const [t, n, i, r, s] = e;
    let a,
      u,
      c = [];
    const l = o(t),
      d = Lt(n, dt, i, r);
    return (
      s || !l
        ? (([a, u, c] = Mt(null != s ? s : t)), 0 === c.length && (c = [d]))
        : l &&
          (([a, u] = (function (e) {
            var t, n;
            const i = e.match(ft),
              r =
                null !== (t = null == i ? void 0 : i[1]) && void 0 !== t
                  ? t
                  : oe;
            return [
              null !== (n = null == i ? void 0 : i[2]) && void 0 !== n ? n : e,
              r,
            ];
          })(t)),
          (c = [d])),
      { value: a, type: u, stackFrames: c }
    );
  }
  function Nt(e, t) {
    return m(e[0]) ? jt(e) : { value: t(e) };
  }
  class _t extends ge {
    constructor(e = {}) {
      super(),
        (this.options = e),
        (this.name = "@grafana/faro-web-sdk:instrumentation-console"),
        (this.version = me),
        (this.errorSerializer = ce);
    }
    initialize() {
      var t, n, i, r;
      this.options = Object.assign(
        Object.assign({}, this.options),
        this.config.consoleInstrumentation
      );
      const o =
        (null === (t = this.options) || void 0 === t
          ? void 0
          : t.serializeErrors) ||
        !!(null === (n = this.options) || void 0 === n
          ? void 0
          : n.errorSerializer);
      (this.errorSerializer = o
        ? null !==
            (r =
              null === (i = this.options) || void 0 === i
                ? void 0
                : i.errorSerializer) && void 0 !== r
          ? r
          : se
        : ce),
        L.filter((e) => {
          var t, n;
          return !(
            null !==
              (n =
                null === (t = this.options) || void 0 === t
                  ? void 0
                  : t.disabledLevels) && void 0 !== n
              ? n
              : _t.defaultDisabledLevels
          ).includes(e);
        }).forEach((t) => {
          console[t] = (...n) => {
            var i, r;
            try {
              if (
                t !== e.LogLevel.ERROR ||
                (null === (i = this.options) || void 0 === i
                  ? void 0
                  : i.consoleErrorAsLog)
              )
                if (
                  t === e.LogLevel.ERROR &&
                  (null === (r = this.options) || void 0 === r
                    ? void 0
                    : r.consoleErrorAsLog)
                ) {
                  const {
                    value: e,
                    type: i,
                    stackFrames: r,
                  } = Nt(n, this.errorSerializer);
                  this.api.pushLog(e ? [_t.consoleErrorPrefix + e] : n, {
                    level: t,
                    context: {
                      value: null != e ? e : "",
                      type: null != i ? i : "",
                      stackFrames: (null == r ? void 0 : r.length) ? se(r) : "",
                    },
                  });
                } else this.api.pushLog(n, { level: t });
              else {
                const {
                  value: e,
                  type: t,
                  stackFrames: i,
                } = Nt(n, this.errorSerializer);
                if (e && !t && !i)
                  return void this.api.pushError(
                    new Error(_t.consoleErrorPrefix + e)
                  );
                this.api.pushError(new Error(_t.consoleErrorPrefix + e), {
                  type: t,
                  stackFrames: i,
                });
              }
            } catch (e) {
              this.logError(e);
            } finally {
              this.unpatchedConsole[t](...n);
            }
          };
        });
    }
  }
  (_t.defaultDisabledLevels = [
    e.LogLevel.DEBUG,
    e.LogLevel.TRACE,
    e.LogLevel.LOG,
  ]),
    (_t.consoleErrorPrefix = "console.error: ");
  class Dt extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-errors"),
        (this.version = me);
    }
    initialize() {
      var e;
      this.logDebug("Initializing"),
        (function (e) {
          const t = window.onerror;
          window.onerror = (...n) => {
            try {
              const { value: t, type: i, stackFrames: r } = jt(n),
                o = n[4];
              if (t) {
                const n = { type: i, stackFrames: r };
                null != o && (n.originalError = o),
                  e.pushError(new Error(t), n);
              }
            } finally {
              null == t || t.apply(window, n);
            }
          };
        })(this.api),
        (e = this.api),
        window.addEventListener("unhandledrejection", (t) => {
          var n, i;
          let r,
            o,
            s = t;
          s.reason
            ? (s = t.reason)
            : (null === (n = t.detail) || void 0 === n ? void 0 : n.reason) &&
              (s = null === (i = t.detail) || void 0 === i ? void 0 : i.reason);
          let a = [];
          d(s)
            ? ((r = `Non-Error promise rejection captured with value: ${String(
                s
              )}`),
              (o = "UnhandledRejection"))
            : ([r, o, a] = Mt(s)),
            r && e.pushError(new Error(r), { type: o, stackFrames: a });
        });
    }
  }
  class Rt extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-view"),
        (this.version = me);
    }
    sendViewChangedEvent(e) {
      var t, n, i, r;
      const o = e.view;
      o &&
        o.name !==
          (null === (t = this.notifiedView) || void 0 === t
            ? void 0
            : t.name) &&
        (this.api.pushEvent(
          Ee,
          {
            fromView:
              null !==
                (i =
                  null === (n = this.notifiedView) || void 0 === n
                    ? void 0
                    : n.name) && void 0 !== i
                ? i
                : Le,
            toView: null !== (r = o.name) && void 0 !== r ? r : Le,
          },
          void 0,
          { skipDedupe: !0 }
        ),
        (this.notifiedView = o));
    }
    initialize() {
      this.metas.addListener(this.sendViewChangedEvent.bind(this));
    }
  }
  var Ut,
    Bt,
    Ft,
    zt,
    qt,
    Vt = -1,
    $t = function (e) {
      addEventListener(
        "pageshow",
        function (t) {
          t.persisted && ((Vt = t.timeStamp), e(t));
        },
        !0
      );
    },
    Gt = function () {
      var e =
        self.performance &&
        performance.getEntriesByType &&
        performance.getEntriesByType("navigation")[0];
      if (e && e.responseStart > 0 && e.responseStart < performance.now())
        return e;
    },
    Ht = function () {
      var e = Gt();
      return (e && e.activationStart) || 0;
    },
    Wt = function (e, t) {
      var n = Gt(),
        i = "navigate";
      return (
        Vt >= 0
          ? (i = "back-forward-cache")
          : n &&
            (document.prerendering || Ht() > 0
              ? (i = "prerender")
              : document.wasDiscarded
              ? (i = "restore")
              : n.type && (i = n.type.replace(/_/g, "-"))),
        {
          name: e,
          value: void 0 === t ? -1 : t,
          rating: "good",
          delta: 0,
          entries: [],
          id: "v4-"
            .concat(Date.now(), "-")
            .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
          navigationType: i,
        }
      );
    },
    Kt = function (e, t, n) {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(e)) {
          var i = new PerformanceObserver(function (e) {
            Promise.resolve().then(function () {
              t(e.getEntries());
            });
          });
          return (
            i.observe(Object.assign({ type: e, buffered: !0 }, n || {})), i
          );
        }
      } catch (e) {}
    },
    Xt = function (e, t, n, i) {
      var r, o;
      return function (s) {
        t.value >= 0 &&
          (s || i) &&
          ((o = t.value - (r || 0)) || void 0 === r) &&
          ((r = t.value),
          (t.delta = o),
          (t.rating = (function (e, t) {
            return e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good";
          })(t.value, n)),
          e(t));
      };
    },
    Jt = function (e) {
      requestAnimationFrame(function () {
        return requestAnimationFrame(function () {
          return e();
        });
      });
    },
    Zt = function (e) {
      document.addEventListener("visibilitychange", function () {
        "hidden" === document.visibilityState && e();
      });
    },
    Yt = function (e) {
      var t = !1;
      return function () {
        t || (e(), (t = !0));
      };
    },
    Qt = -1,
    en = function () {
      return "hidden" !== document.visibilityState || document.prerendering
        ? 1 / 0
        : 0;
    },
    tn = function (e) {
      "hidden" === document.visibilityState &&
        Qt > -1 &&
        ((Qt = "visibilitychange" === e.type ? e.timeStamp : 0), rn());
    },
    nn = function () {
      addEventListener("visibilitychange", tn, !0),
        addEventListener("prerenderingchange", tn, !0);
    },
    rn = function () {
      removeEventListener("visibilitychange", tn, !0),
        removeEventListener("prerenderingchange", tn, !0);
    },
    on = function () {
      return (
        Qt < 0 &&
          ((Qt = en()),
          nn(),
          $t(function () {
            setTimeout(function () {
              (Qt = en()), nn();
            }, 0);
          })),
        {
          get firstHiddenTime() {
            return Qt;
          },
        }
      );
    },
    sn = function (e) {
      document.prerendering
        ? addEventListener(
            "prerenderingchange",
            function () {
              return e();
            },
            !0
          )
        : e();
    },
    an = [1800, 3e3],
    un = function (e, t) {
      (t = t || {}),
        sn(function () {
          var n,
            i = on(),
            r = Wt("FCP"),
            o = Kt("paint", function (e) {
              e.forEach(function (e) {
                "first-contentful-paint" === e.name &&
                  (o.disconnect(),
                  e.startTime < i.firstHiddenTime &&
                    ((r.value = Math.max(e.startTime - Ht(), 0)),
                    r.entries.push(e),
                    n(!0)));
              });
            });
          o &&
            ((n = Xt(e, r, an, t.reportAllChanges)),
            $t(function (i) {
              (r = Wt("FCP")),
                (n = Xt(e, r, an, t.reportAllChanges)),
                Jt(function () {
                  (r.value = performance.now() - i.timeStamp), n(!0);
                });
            }));
        });
    },
    cn = [0.1, 0.25],
    ln = 0,
    dn = 1 / 0,
    fn = 0,
    pn = function (e) {
      e.forEach(function (e) {
        e.interactionId &&
          ((dn = Math.min(dn, e.interactionId)),
          (fn = Math.max(fn, e.interactionId)),
          (ln = fn ? (fn - dn) / 7 + 1 : 0));
      });
    },
    gn = function () {
      return Ut ? ln : performance.interactionCount || 0;
    },
    mn = [],
    vn = new Map(),
    hn = 0,
    bn = [],
    wn = function (e) {
      if (
        (bn.forEach(function (t) {
          return t(e);
        }),
        e.interactionId || "first-input" === e.entryType)
      ) {
        var t = mn[mn.length - 1],
          n = vn.get(e.interactionId);
        if (n || mn.length < 10 || e.duration > t.latency) {
          if (n)
            e.duration > n.latency
              ? ((n.entries = [e]), (n.latency = e.duration))
              : e.duration === n.latency &&
                e.startTime === n.entries[0].startTime &&
                n.entries.push(e);
          else {
            var i = { id: e.interactionId, latency: e.duration, entries: [e] };
            vn.set(i.id, i), mn.push(i);
          }
          mn.sort(function (e, t) {
            return t.latency - e.latency;
          }),
            mn.length > 10 &&
              mn.splice(10).forEach(function (e) {
                return vn.delete(e.id);
              });
        }
      }
    },
    yn = function (e) {
      var t = self.requestIdleCallback || self.setTimeout,
        n = -1;
      return (
        (e = Yt(e)),
        "hidden" === document.visibilityState ? e() : ((n = t(e)), Zt(e)),
        n
      );
    },
    Sn = [200, 500],
    Tn = [2500, 4e3],
    En = {},
    In = [800, 1800],
    kn = function e(t) {
      document.prerendering
        ? sn(function () {
            return e(t);
          })
        : "complete" !== document.readyState
        ? addEventListener(
            "load",
            function () {
              return e(t);
            },
            !0
          )
        : setTimeout(t, 0);
    },
    On = { passive: !0, capture: !0 },
    xn = new Date(),
    Ln = function (e, t) {
      Bt ||
        ((Bt = t), (Ft = e), (zt = new Date()), Pn(removeEventListener), Cn());
    },
    Cn = function () {
      if (Ft >= 0 && Ft < zt - xn) {
        var e = {
          entryType: "first-input",
          name: Bt.type,
          target: Bt.target,
          cancelable: Bt.cancelable,
          startTime: Bt.timeStamp,
          processingStart: Bt.timeStamp + Ft,
        };
        qt.forEach(function (t) {
          t(e);
        }),
          (qt = []);
      }
    },
    An = function (e) {
      if (e.cancelable) {
        var t =
          (e.timeStamp > 1e12 ? new Date() : performance.now()) - e.timeStamp;
        "pointerdown" == e.type
          ? (function (e, t) {
              var n = function () {
                  Ln(e, t), r();
                },
                i = function () {
                  r();
                },
                r = function () {
                  removeEventListener("pointerup", n, On),
                    removeEventListener("pointercancel", i, On);
                };
              addEventListener("pointerup", n, On),
                addEventListener("pointercancel", i, On);
            })(t, e)
          : Ln(t, e);
      }
    },
    Pn = function (e) {
      ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (
        t
      ) {
        return e(t, An, On);
      });
    },
    Mn = [100, 300];
  class jn {
    constructor(e, t) {
      (this.pushMeasurement = e), (this.webVitalConfig = t);
    }
    initialize() {
      Object.entries(jn.mapping).forEach(([e, t]) => {
        var n;
        t(
          (t) => {
            this.pushMeasurement({
              type: "web-vitals",
              values: { [e]: t.value },
            });
          },
          {
            reportAllChanges:
              null === (n = this.webVitalConfig) || void 0 === n
                ? void 0
                : n.reportAllChanges,
          }
        );
      });
    }
  }
  jn.mapping = {
    cls: function (e, t) {
      (t = t || {}),
        un(
          Yt(function () {
            var n,
              i = Wt("CLS", 0),
              r = 0,
              o = [],
              s = function (e) {
                e.forEach(function (e) {
                  if (!e.hadRecentInput) {
                    var t = o[0],
                      n = o[o.length - 1];
                    r &&
                    e.startTime - n.startTime < 1e3 &&
                    e.startTime - t.startTime < 5e3
                      ? ((r += e.value), o.push(e))
                      : ((r = e.value), (o = [e]));
                  }
                }),
                  r > i.value && ((i.value = r), (i.entries = o), n());
              },
              a = Kt("layout-shift", s);
            a &&
              ((n = Xt(e, i, cn, t.reportAllChanges)),
              Zt(function () {
                s(a.takeRecords()), n(!0);
              }),
              $t(function () {
                (r = 0),
                  (i = Wt("CLS", 0)),
                  (n = Xt(e, i, cn, t.reportAllChanges)),
                  Jt(function () {
                    return n();
                  });
              }),
              setTimeout(n, 0));
          })
        );
    },
    fcp: un,
    fid: function (e, t) {
      (t = t || {}),
        sn(function () {
          var n,
            i = on(),
            r = Wt("FID"),
            o = function (e) {
              e.startTime < i.firstHiddenTime &&
                ((r.value = e.processingStart - e.startTime),
                r.entries.push(e),
                n(!0));
            },
            s = function (e) {
              e.forEach(o);
            },
            a = Kt("first-input", s);
          (n = Xt(e, r, Mn, t.reportAllChanges)),
            a &&
              (Zt(
                Yt(function () {
                  s(a.takeRecords()), a.disconnect();
                })
              ),
              $t(function () {
                var i;
                (r = Wt("FID")),
                  (n = Xt(e, r, Mn, t.reportAllChanges)),
                  (qt = []),
                  (Ft = -1),
                  (Bt = null),
                  Pn(addEventListener),
                  (i = o),
                  qt.push(i),
                  Cn();
              }));
        });
    },
    inp: function (e, t) {
      "PerformanceEventTiming" in self &&
        "interactionId" in PerformanceEventTiming.prototype &&
        ((t = t || {}),
        sn(function () {
          var n;
          "interactionCount" in performance ||
            Ut ||
            (Ut = Kt("event", pn, {
              type: "event",
              buffered: !0,
              durationThreshold: 0,
            }));
          var i,
            r = Wt("INP"),
            o = function (e) {
              yn(function () {
                e.forEach(wn);
                var t = (function () {
                  var e = Math.min(mn.length - 1, Math.floor((gn() - hn) / 50));
                  return mn[e];
                })();
                t &&
                  t.latency !== r.value &&
                  ((r.value = t.latency), (r.entries = t.entries), i());
              });
            },
            s = Kt("event", o, {
              durationThreshold:
                null !== (n = t.durationThreshold) && void 0 !== n ? n : 40,
            });
          (i = Xt(e, r, Sn, t.reportAllChanges)),
            s &&
              (s.observe({ type: "first-input", buffered: !0 }),
              Zt(function () {
                o(s.takeRecords()), i(!0);
              }),
              $t(function () {
                (hn = gn()),
                  (mn.length = 0),
                  vn.clear(),
                  (r = Wt("INP")),
                  (i = Xt(e, r, Sn, t.reportAllChanges));
              }));
        }));
    },
    lcp: function (e, t) {
      (t = t || {}),
        sn(function () {
          var n,
            i = on(),
            r = Wt("LCP"),
            o = function (e) {
              t.reportAllChanges || (e = e.slice(-1)),
                e.forEach(function (e) {
                  e.startTime < i.firstHiddenTime &&
                    ((r.value = Math.max(e.startTime - Ht(), 0)),
                    (r.entries = [e]),
                    n());
                });
            },
            s = Kt("largest-contentful-paint", o);
          if (s) {
            n = Xt(e, r, Tn, t.reportAllChanges);
            var a = Yt(function () {
              En[r.id] ||
                (o(s.takeRecords()), s.disconnect(), (En[r.id] = !0), n(!0));
            });
            ["keydown", "click"].forEach(function (e) {
              addEventListener(
                e,
                function () {
                  return yn(a);
                },
                { once: !0, capture: !0 }
              );
            }),
              Zt(a),
              $t(function (i) {
                (r = Wt("LCP")),
                  (n = Xt(e, r, Tn, t.reportAllChanges)),
                  Jt(function () {
                    (r.value = performance.now() - i.timeStamp),
                      (En[r.id] = !0),
                      n(!0);
                  });
              });
          }
        });
    },
    ttfb: function (e, t) {
      t = t || {};
      var n = Wt("TTFB"),
        i = Xt(e, n, In, t.reportAllChanges);
      kn(function () {
        var r = Gt();
        r &&
          ((n.value = Math.max(r.responseStart - Ht(), 0)),
          (n.entries = [r]),
          i(!0),
          $t(function () {
            (n = Wt("TTFB", 0)), (i = Xt(e, n, In, t.reportAllChanges))(!0);
          }));
      });
    },
  };
  var Nn,
    _n,
    Dn = function () {
      var e =
        self.performance &&
        performance.getEntriesByType &&
        performance.getEntriesByType("navigation")[0];
      if (e && e.responseStart > 0 && e.responseStart < performance.now())
        return e;
    },
    Rn = function (e) {
      if ("loading" === document.readyState) return "loading";
      var t = Dn();
      if (t) {
        if (e < t.domInteractive) return "loading";
        if (
          0 === t.domContentLoadedEventStart ||
          e < t.domContentLoadedEventStart
        )
          return "dom-interactive";
        if (0 === t.domComplete || e < t.domComplete)
          return "dom-content-loaded";
      }
      return "complete";
    },
    Un = function (e) {
      var t = e.nodeName;
      return 1 === e.nodeType
        ? t.toLowerCase()
        : t.toUpperCase().replace(/^#/, "");
    },
    Bn = function (e, t) {
      var n = "";
      try {
        for (; e && 9 !== e.nodeType; ) {
          var i = e,
            r = i.id
              ? "#" + i.id
              : Un(i) +
                (i.classList &&
                i.classList.value &&
                i.classList.value.trim() &&
                i.classList.value.trim().length
                  ? "." + i.classList.value.trim().replace(/\s+/g, ".")
                  : "");
          if (n.length + r.length > (t || 100) - 1) return n || r;
          if (((n = n ? r + ">" + n : r), i.id)) break;
          e = i.parentNode;
        }
      } catch (e) {}
      return n;
    },
    Fn = -1,
    zn = function () {
      return Fn;
    },
    qn = function (e) {
      addEventListener(
        "pageshow",
        function (t) {
          t.persisted && ((Fn = t.timeStamp), e(t));
        },
        !0
      );
    },
    Vn = function () {
      var e = Dn();
      return (e && e.activationStart) || 0;
    },
    $n = function (e, t) {
      var n = Dn(),
        i = "navigate";
      return (
        zn() >= 0
          ? (i = "back-forward-cache")
          : n &&
            (document.prerendering || Vn() > 0
              ? (i = "prerender")
              : document.wasDiscarded
              ? (i = "restore")
              : n.type && (i = n.type.replace(/_/g, "-"))),
        {
          name: e,
          value: void 0 === t ? -1 : t,
          rating: "good",
          delta: 0,
          entries: [],
          id: "v4-"
            .concat(Date.now(), "-")
            .concat(Math.floor(8999999999999 * Math.random()) + 1e12),
          navigationType: i,
        }
      );
    },
    Gn = function (e, t, n) {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(e)) {
          var i = new PerformanceObserver(function (e) {
            Promise.resolve().then(function () {
              t(e.getEntries());
            });
          });
          return (
            i.observe(Object.assign({ type: e, buffered: !0 }, n || {})), i
          );
        }
      } catch (e) {}
    },
    Hn = function (e, t, n, i) {
      var r, o;
      return function (s) {
        t.value >= 0 &&
          (s || i) &&
          ((o = t.value - (r || 0)) || void 0 === r) &&
          ((r = t.value),
          (t.delta = o),
          (t.rating = (function (e, t) {
            return e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good";
          })(t.value, n)),
          e(t));
      };
    },
    Wn = function (e) {
      requestAnimationFrame(function () {
        return requestAnimationFrame(function () {
          return e();
        });
      });
    },
    Kn = function (e) {
      document.addEventListener("visibilitychange", function () {
        "hidden" === document.visibilityState && e();
      });
    },
    Xn = function (e) {
      var t = !1;
      return function () {
        t || (e(), (t = !0));
      };
    },
    Jn = -1,
    Zn = function () {
      return "hidden" !== document.visibilityState || document.prerendering
        ? 1 / 0
        : 0;
    },
    Yn = function (e) {
      "hidden" === document.visibilityState &&
        Jn > -1 &&
        ((Jn = "visibilitychange" === e.type ? e.timeStamp : 0), ei());
    },
    Qn = function () {
      addEventListener("visibilitychange", Yn, !0),
        addEventListener("prerenderingchange", Yn, !0);
    },
    ei = function () {
      removeEventListener("visibilitychange", Yn, !0),
        removeEventListener("prerenderingchange", Yn, !0);
    },
    ti = function () {
      return (
        Jn < 0 &&
          ((Jn = Zn()),
          Qn(),
          qn(function () {
            setTimeout(function () {
              (Jn = Zn()), Qn();
            }, 0);
          })),
        {
          get firstHiddenTime() {
            return Jn;
          },
        }
      );
    },
    ni = function (e) {
      document.prerendering
        ? addEventListener(
            "prerenderingchange",
            function () {
              return e();
            },
            !0
          )
        : e();
    },
    ii = [1800, 3e3],
    ri = function (e, t) {
      (t = t || {}),
        ni(function () {
          var n,
            i = ti(),
            r = $n("FCP"),
            o = Gn("paint", function (e) {
              e.forEach(function (e) {
                "first-contentful-paint" === e.name &&
                  (o.disconnect(),
                  e.startTime < i.firstHiddenTime &&
                    ((r.value = Math.max(e.startTime - Vn(), 0)),
                    r.entries.push(e),
                    n(!0)));
              });
            });
          o &&
            ((n = Hn(e, r, ii, t.reportAllChanges)),
            qn(function (i) {
              (r = $n("FCP")),
                (n = Hn(e, r, ii, t.reportAllChanges)),
                Wn(function () {
                  (r.value = performance.now() - i.timeStamp), n(!0);
                });
            }));
        });
    },
    oi = [0.1, 0.25],
    si = 0,
    ai = 1 / 0,
    ui = 0,
    ci = function (e) {
      e.forEach(function (e) {
        e.interactionId &&
          ((ai = Math.min(ai, e.interactionId)),
          (ui = Math.max(ui, e.interactionId)),
          (si = ui ? (ui - ai) / 7 + 1 : 0));
      });
    },
    li = function () {
      return Nn ? si : performance.interactionCount || 0;
    },
    di = function () {
      "interactionCount" in performance ||
        Nn ||
        (Nn = Gn("event", ci, {
          type: "event",
          buffered: !0,
          durationThreshold: 0,
        }));
    },
    fi = [],
    pi = new Map(),
    gi = 0,
    mi = [],
    vi = function (e) {
      if (
        (mi.forEach(function (t) {
          return t(e);
        }),
        e.interactionId || "first-input" === e.entryType)
      ) {
        var t = fi[fi.length - 1],
          n = pi.get(e.interactionId);
        if (n || fi.length < 10 || e.duration > t.latency) {
          if (n)
            e.duration > n.latency
              ? ((n.entries = [e]), (n.latency = e.duration))
              : e.duration === n.latency &&
                e.startTime === n.entries[0].startTime &&
                n.entries.push(e);
          else {
            var i = { id: e.interactionId, latency: e.duration, entries: [e] };
            pi.set(i.id, i), fi.push(i);
          }
          fi.sort(function (e, t) {
            return t.latency - e.latency;
          }),
            fi.length > 10 &&
              fi.splice(10).forEach(function (e) {
                return pi.delete(e.id);
              });
        }
      }
    },
    hi = function (e) {
      var t = self.requestIdleCallback || self.setTimeout,
        n = -1;
      return (
        (e = Xn(e)),
        "hidden" === document.visibilityState ? e() : ((n = t(e)), Kn(e)),
        n
      );
    },
    bi = [200, 500],
    wi = function (e, t) {
      "PerformanceEventTiming" in self &&
        "interactionId" in PerformanceEventTiming.prototype &&
        ((t = t || {}),
        ni(function () {
          var n;
          di();
          var i,
            r = $n("INP"),
            o = function (e) {
              hi(function () {
                e.forEach(vi);
                var t = (function () {
                  var e = Math.min(fi.length - 1, Math.floor((li() - gi) / 50));
                  return fi[e];
                })();
                t &&
                  t.latency !== r.value &&
                  ((r.value = t.latency), (r.entries = t.entries), i());
              });
            },
            s = Gn("event", o, {
              durationThreshold:
                null !== (n = t.durationThreshold) && void 0 !== n ? n : 40,
            });
          (i = Hn(e, r, bi, t.reportAllChanges)),
            s &&
              (s.observe({ type: "first-input", buffered: !0 }),
              Kn(function () {
                o(s.takeRecords()), i(!0);
              }),
              qn(function () {
                (gi = li()),
                  (fi.length = 0),
                  pi.clear(),
                  (r = $n("INP")),
                  (i = Hn(e, r, bi, t.reportAllChanges));
              }));
        }));
    },
    yi = [],
    Si = [],
    Ti = 0,
    Ei = new WeakMap(),
    Ii = new Map(),
    ki = -1,
    Oi = function (e) {
      (yi = yi.concat(e)), xi();
    },
    xi = function () {
      ki < 0 && (ki = hi(Li));
    },
    Li = function () {
      Ii.size > 10 &&
        Ii.forEach(function (e, t) {
          pi.has(t) || Ii.delete(t);
        });
      var e = fi.map(function (e) {
          return Ei.get(e.entries[0]);
        }),
        t = Si.length - 50;
      Si = Si.filter(function (n, i) {
        return i >= t || e.includes(n);
      });
      for (var n = new Set(), i = 0; i < Si.length; i++) {
        var r = Si[i];
        ji(r.startTime, r.processingEnd).forEach(function (e) {
          n.add(e);
        });
      }
      var o = yi.length - 1 - 50;
      (yi = yi.filter(function (e, t) {
        return (e.startTime > Ti && t > o) || n.has(e);
      })),
        (ki = -1);
    };
  mi.push(
    function (e) {
      e.interactionId &&
        e.target &&
        !Ii.has(e.interactionId) &&
        Ii.set(e.interactionId, e.target);
    },
    function (e) {
      var t,
        n = e.startTime + e.duration;
      Ti = Math.max(Ti, e.processingEnd);
      for (var i = Si.length - 1; i >= 0; i--) {
        var r = Si[i];
        if (Math.abs(n - r.renderTime) <= 8) {
          ((t = r).startTime = Math.min(e.startTime, t.startTime)),
            (t.processingStart = Math.min(
              e.processingStart,
              t.processingStart
            )),
            (t.processingEnd = Math.max(e.processingEnd, t.processingEnd)),
            t.entries.push(e);
          break;
        }
      }
      t ||
        ((t = {
          startTime: e.startTime,
          processingStart: e.processingStart,
          processingEnd: e.processingEnd,
          renderTime: n,
          entries: [e],
        }),
        Si.push(t)),
        (e.interactionId || "first-input" === e.entryType) && Ei.set(e, t),
        xi();
    }
  );
  var Ci,
    Ai,
    Pi,
    Mi,
    ji = function (e, t) {
      for (var n, i = [], r = 0; (n = yi[r]); r++)
        if (!(n.startTime + n.duration < e)) {
          if (n.startTime > t) break;
          i.push(n);
        }
      return i;
    },
    Ni = [2500, 4e3],
    _i = {},
    Di = [800, 1800],
    Ri = function e(t) {
      document.prerendering
        ? ni(function () {
            return e(t);
          })
        : "complete" !== document.readyState
        ? addEventListener(
            "load",
            function () {
              return e(t);
            },
            !0
          )
        : setTimeout(t, 0);
    },
    Ui = function (e, t) {
      t = t || {};
      var n = $n("TTFB"),
        i = Hn(e, n, Di, t.reportAllChanges);
      Ri(function () {
        var r = Dn();
        r &&
          ((n.value = Math.max(r.responseStart - Vn(), 0)),
          (n.entries = [r]),
          i(!0),
          qn(function () {
            (n = $n("TTFB", 0)), (i = Hn(e, n, Di, t.reportAllChanges))(!0);
          }));
      });
    },
    Bi = { passive: !0, capture: !0 },
    Fi = new Date(),
    zi = function (e, t) {
      Ci ||
        ((Ci = t), (Ai = e), (Pi = new Date()), $i(removeEventListener), qi());
    },
    qi = function () {
      if (Ai >= 0 && Ai < Pi - Fi) {
        var e = {
          entryType: "first-input",
          name: Ci.type,
          target: Ci.target,
          cancelable: Ci.cancelable,
          startTime: Ci.timeStamp,
          processingStart: Ci.timeStamp + Ai,
        };
        Mi.forEach(function (t) {
          t(e);
        }),
          (Mi = []);
      }
    },
    Vi = function (e) {
      if (e.cancelable) {
        var t =
          (e.timeStamp > 1e12 ? new Date() : performance.now()) - e.timeStamp;
        "pointerdown" == e.type
          ? (function (e, t) {
              var n = function () {
                  zi(e, t), r();
                },
                i = function () {
                  r();
                },
                r = function () {
                  removeEventListener("pointerup", n, Bi),
                    removeEventListener("pointercancel", i, Bi);
                };
              addEventListener("pointerup", n, Bi),
                addEventListener("pointercancel", i, Bi);
            })(t, e)
          : zi(t, e);
      }
    },
    $i = function (e) {
      ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (
        t
      ) {
        return e(t, Vi, Bi);
      });
    },
    Gi = [100, 300],
    Hi = function (e, t) {
      !(function (e, t) {
        (t = t || {}),
          ni(function () {
            var n,
              i = ti(),
              r = $n("FID"),
              o = function (e) {
                e.startTime < i.firstHiddenTime &&
                  ((r.value = e.processingStart - e.startTime),
                  r.entries.push(e),
                  n(!0));
              },
              s = function (e) {
                e.forEach(o);
              },
              a = Gn("first-input", s);
            (n = Hn(e, r, Gi, t.reportAllChanges)),
              a &&
                (Kn(
                  Xn(function () {
                    s(a.takeRecords()), a.disconnect();
                  })
                ),
                qn(function () {
                  var i;
                  (r = $n("FID")),
                    (n = Hn(e, r, Gi, t.reportAllChanges)),
                    (Mi = []),
                    (Ai = -1),
                    (Ci = null),
                    $i(addEventListener),
                    (i = o),
                    Mi.push(i),
                    qi();
                }));
          });
      })(function (t) {
        var n = (function (e) {
          var t = e.entries[0],
            n = {
              eventTarget: Bn(t.target),
              eventType: t.name,
              eventTime: t.startTime,
              eventEntry: t,
              loadState: Rn(t.startTime),
            };
          return Object.assign(e, { attribution: n });
        })(t);
        e(n);
      }, t);
    };
  const Wi = "com.grafana.faro.lastNavigationId",
    Ki = "load_state",
    Xi = "time_to_first_byte";
  class Ji {
    constructor(e, t) {
      (this.corePushMeasurement = e), (this.webVitalConfig = t);
    }
    initialize() {
      this.measureCLS(),
        this.measureFCP(),
        this.measureFID(),
        this.measureINP(),
        this.measureLCP(),
        this.measureTTFB();
    }
    measureCLS() {
      var e;
      !(function (e, t) {
        !(function (e, t) {
          (t = t || {}),
            ri(
              Xn(function () {
                var n,
                  i = $n("CLS", 0),
                  r = 0,
                  o = [],
                  s = function (e) {
                    e.forEach(function (e) {
                      if (!e.hadRecentInput) {
                        var t = o[0],
                          n = o[o.length - 1];
                        r &&
                        e.startTime - n.startTime < 1e3 &&
                        e.startTime - t.startTime < 5e3
                          ? ((r += e.value), o.push(e))
                          : ((r = e.value), (o = [e]));
                      }
                    }),
                      r > i.value && ((i.value = r), (i.entries = o), n());
                  },
                  a = Gn("layout-shift", s);
                a &&
                  ((n = Hn(e, i, oi, t.reportAllChanges)),
                  Kn(function () {
                    s(a.takeRecords()), n(!0);
                  }),
                  qn(function () {
                    (r = 0),
                      (i = $n("CLS", 0)),
                      (n = Hn(e, i, oi, t.reportAllChanges)),
                      Wn(function () {
                        return n();
                      });
                  }),
                  setTimeout(n, 0));
              })
            );
        })(function (t) {
          var n = (function (e) {
            var t,
              n = {};
            if (e.entries.length) {
              var i = e.entries.reduce(function (e, t) {
                return e && e.value > t.value ? e : t;
              });
              if (i && i.sources && i.sources.length) {
                var r =
                  (t = i.sources).find(function (e) {
                    return e.node && 1 === e.node.nodeType;
                  }) || t[0];
                r &&
                  (n = {
                    largestShiftTarget: Bn(r.node),
                    largestShiftTime: i.startTime,
                    largestShiftValue: i.value,
                    largestShiftSource: r,
                    largestShiftEntry: i,
                    loadState: Rn(i.startTime),
                  });
              }
            }
            return Object.assign(e, { attribution: n });
          })(t);
          e(n);
        }, t);
      })(
        (e) => {
          const {
              loadState: t,
              largestShiftValue: n,
              largestShiftTime: i,
              largestShiftTarget: r,
            } = e.attribution,
            o = this.buildInitialValues(e);
          this.addIfPresent(o, "largest_shift_value", n),
            this.addIfPresent(o, "largest_shift_time", i);
          const s = this.buildInitialContext(e);
          this.addIfPresent(s, Ki, t),
            this.addIfPresent(s, "largest_shift_target", r),
            this.pushMeasurement(o, s);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    measureFCP() {
      var e;
      !(function (e, t) {
        ri(function (t) {
          var n = (function (e) {
            var t = {
              timeToFirstByte: 0,
              firstByteToFCP: e.value,
              loadState: Rn(zn()),
            };
            if (e.entries.length) {
              var n = Dn(),
                i = e.entries[e.entries.length - 1];
              if (n) {
                var r = n.activationStart || 0,
                  o = Math.max(0, n.responseStart - r);
                t = {
                  timeToFirstByte: o,
                  firstByteToFCP: e.value - o,
                  loadState: Rn(e.entries[0].startTime),
                  navigationEntry: n,
                  fcpEntry: i,
                };
              }
            }
            return Object.assign(e, { attribution: t });
          })(t);
          e(n);
        }, t);
      })(
        (e) => {
          const {
              firstByteToFCP: t,
              timeToFirstByte: n,
              loadState: i,
            } = e.attribution,
            r = this.buildInitialValues(e);
          this.addIfPresent(r, "first_byte_to_fcp", t),
            this.addIfPresent(r, Xi, n);
          const o = this.buildInitialContext(e);
          this.addIfPresent(o, Ki, i), this.pushMeasurement(r, o);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    measureFID() {
      var e;
      Hi(
        (e) => {
          const {
              eventTime: t,
              eventTarget: n,
              eventType: i,
              loadState: r,
            } = e.attribution,
            o = this.buildInitialValues(e);
          this.addIfPresent(o, "event_time", t);
          const s = this.buildInitialContext(e);
          this.addIfPresent(s, "event_target", n),
            this.addIfPresent(s, "event_type", i),
            this.addIfPresent(s, Ki, r),
            this.pushMeasurement(o, s);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    measureINP() {
      var e;
      !(function (e, t) {
        _n || (_n = Gn("long-animation-frame", Oi)),
          wi(function (t) {
            var n = (function (e) {
              var t = e.entries[0],
                n = Ei.get(t),
                i = t.processingStart,
                r = n.processingEnd,
                o = n.entries.sort(function (e, t) {
                  return e.processingStart - t.processingStart;
                }),
                s = ji(t.startTime, r),
                a = e.entries.find(function (e) {
                  return e.target;
                }),
                u = (a && a.target) || Ii.get(t.interactionId),
                c = [t.startTime + t.duration, r].concat(
                  s.map(function (e) {
                    return e.startTime + e.duration;
                  })
                ),
                l = Math.max.apply(Math, c),
                d = {
                  interactionTarget: Bn(u),
                  interactionTargetElement: u,
                  interactionType: t.name.startsWith("key")
                    ? "keyboard"
                    : "pointer",
                  interactionTime: t.startTime,
                  nextPaintTime: l,
                  processedEventEntries: o,
                  longAnimationFrameEntries: s,
                  inputDelay: i - t.startTime,
                  processingDuration: r - i,
                  presentationDelay: Math.max(l - r, 0),
                  loadState: Rn(t.startTime),
                };
              return Object.assign(e, { attribution: d });
            })(t);
            e(n);
          }, t);
      })(
        (e) => {
          const {
              interactionTime: t,
              presentationDelay: n,
              inputDelay: i,
              processingDuration: r,
              nextPaintTime: o,
              loadState: s,
              interactionTarget: a,
              interactionType: u,
            } = e.attribution,
            c = this.buildInitialValues(e);
          this.addIfPresent(c, "interaction_time", t),
            this.addIfPresent(c, "presentation_delay", n),
            this.addIfPresent(c, "input_delay", i),
            this.addIfPresent(c, "processing_duration", r),
            this.addIfPresent(c, "next_paint_time", o);
          const l = this.buildInitialContext(e);
          this.addIfPresent(l, Ki, s),
            this.addIfPresent(l, "interaction_target", a),
            this.addIfPresent(l, "interaction_type", u),
            this.pushMeasurement(c, l);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    measureLCP() {
      var e;
      !(function (e, t) {
        !(function (e, t) {
          (t = t || {}),
            ni(function () {
              var n,
                i = ti(),
                r = $n("LCP"),
                o = function (e) {
                  t.reportAllChanges || (e = e.slice(-1)),
                    e.forEach(function (e) {
                      e.startTime < i.firstHiddenTime &&
                        ((r.value = Math.max(e.startTime - Vn(), 0)),
                        (r.entries = [e]),
                        n());
                    });
                },
                s = Gn("largest-contentful-paint", o);
              if (s) {
                n = Hn(e, r, Ni, t.reportAllChanges);
                var a = Xn(function () {
                  _i[r.id] ||
                    (o(s.takeRecords()),
                    s.disconnect(),
                    (_i[r.id] = !0),
                    n(!0));
                });
                ["keydown", "click"].forEach(function (e) {
                  addEventListener(
                    e,
                    function () {
                      return hi(a);
                    },
                    { once: !0, capture: !0 }
                  );
                }),
                  Kn(a),
                  qn(function (i) {
                    (r = $n("LCP")),
                      (n = Hn(e, r, Ni, t.reportAllChanges)),
                      Wn(function () {
                        (r.value = performance.now() - i.timeStamp),
                          (_i[r.id] = !0),
                          n(!0);
                      });
                  });
              }
            });
        })(function (t) {
          var n = (function (e) {
            var t = {
              timeToFirstByte: 0,
              resourceLoadDelay: 0,
              resourceLoadDuration: 0,
              elementRenderDelay: e.value,
            };
            if (e.entries.length) {
              var n = Dn();
              if (n) {
                var i = n.activationStart || 0,
                  r = e.entries[e.entries.length - 1],
                  o =
                    r.url &&
                    performance
                      .getEntriesByType("resource")
                      .filter(function (e) {
                        return e.name === r.url;
                      })[0],
                  s = Math.max(0, n.responseStart - i),
                  a = Math.max(s, o ? (o.requestStart || o.startTime) - i : 0),
                  u = Math.max(a, o ? o.responseEnd - i : 0),
                  c = Math.max(u, r.startTime - i);
                (t = {
                  element: Bn(r.element),
                  timeToFirstByte: s,
                  resourceLoadDelay: a - s,
                  resourceLoadDuration: u - a,
                  elementRenderDelay: c - u,
                  navigationEntry: n,
                  lcpEntry: r,
                }),
                  r.url && (t.url = r.url),
                  o && (t.lcpResourceEntry = o);
              }
            }
            return Object.assign(e, { attribution: t });
          })(t);
          e(n);
        }, t);
      })(
        (e) => {
          const {
              elementRenderDelay: t,
              resourceLoadDelay: n,
              resourceLoadDuration: i,
              timeToFirstByte: r,
              element: o,
            } = e.attribution,
            s = this.buildInitialValues(e);
          this.addIfPresent(s, "element_render_delay", t),
            this.addIfPresent(s, "resource_load_delay", n),
            this.addIfPresent(s, "resource_load_duration", i),
            this.addIfPresent(s, Xi, r);
          const a = this.buildInitialContext(e);
          this.addIfPresent(a, "element", o), this.pushMeasurement(s, a);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    measureTTFB() {
      var e;
      !(function (e, t) {
        Ui(function (t) {
          var n = (function (e) {
            var t = {
              waitingDuration: 0,
              cacheDuration: 0,
              dnsDuration: 0,
              connectionDuration: 0,
              requestDuration: 0,
            };
            if (e.entries.length) {
              var n = e.entries[0],
                i = n.activationStart || 0,
                r = Math.max((n.workerStart || n.fetchStart) - i, 0),
                o = Math.max(n.domainLookupStart - i, 0),
                s = Math.max(n.connectStart - i, 0),
                a = Math.max(n.connectEnd - i, 0);
              t = {
                waitingDuration: r,
                cacheDuration: o - r,
                dnsDuration: s - o,
                connectionDuration: a - s,
                requestDuration: e.value - a,
                navigationEntry: n,
              };
            }
            return Object.assign(e, { attribution: t });
          })(t);
          e(n);
        }, t);
      })(
        (e) => {
          const {
              dnsDuration: t,
              connectionDuration: n,
              requestDuration: i,
              waitingDuration: r,
              cacheDuration: o,
            } = e.attribution,
            s = this.buildInitialValues(e);
          this.addIfPresent(s, "dns_duration", t),
            this.addIfPresent(s, "connection_duration", n),
            this.addIfPresent(s, "request_duration", i),
            this.addIfPresent(s, "waiting_duration", r),
            this.addIfPresent(s, "cache_duration", o);
          const a = this.buildInitialContext(e);
          this.pushMeasurement(s, a);
        },
        {
          reportAllChanges:
            null === (e = this.webVitalConfig) || void 0 === e
              ? void 0
              : e.reportAllChanges,
        }
      );
    }
    buildInitialValues(e) {
      const t = e.name.toLowerCase();
      return { [t]: e.value, delta: e.delta };
    }
    buildInitialContext(e) {
      var t;
      const n = null !== (t = Re(Wi, _e.session)) && void 0 !== t ? t : Le;
      return {
        id: e.id,
        rating: e.rating,
        navigation_type: e.navigationType,
        navigation_entry_id: n,
      };
    }
    pushMeasurement(e, t) {
      this.corePushMeasurement(
        { type: "web-vitals", values: e },
        { context: t }
      );
    }
    addIfPresent(e, t, n) {
      n && (e[t] = n);
    }
  }
  class Zi extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-web-vitals"),
        (this.version = me);
    }
    initialize() {
      this.logDebug("Initializing");
      this.intializeWebVitalsInstrumentation().initialize();
    }
    intializeWebVitalsInstrumentation() {
      var e, t, n;
      return !1 ===
        (null === (e = this.config) || void 0 === e
          ? void 0
          : e.trackWebVitalsAttribution) ||
        !1 ===
          (null ===
            (n =
              null === (t = this.config) || void 0 === t
                ? void 0
                : t.webVitalsInstrumentation) || void 0 === n
            ? void 0
            : n.trackAttribution)
        ? new jn(this.api.pushMeasurement, this.config.webVitalsInstrumentation)
        : new Ji(
            this.api.pushMeasurement,
            this.config.webVitalsInstrumentation
          );
    }
  }
  function Yi(e, t) {
    var n = {};
    for (var i in e)
      Object.prototype.hasOwnProperty.call(e, i) &&
        t.indexOf(i) < 0 &&
        (n[i] = e[i]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++)
        t.indexOf(i[r]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, i[r]) &&
          (n[i[r]] = e[i[r]]);
    }
    return n;
  }
  function Qi(e, t, n, i) {
    return new (n || (n = Promise))(function (r, o) {
      function s(e) {
        try {
          u(i.next(e));
        } catch (e) {
          o(e);
        }
      }
      function a(e) {
        try {
          u(i.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function u(e) {
        var t;
        e.done
          ? r(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(s, a);
      }
      u((i = i.apply(e, t || [])).next());
    });
  }
  "function" == typeof SuppressedError && SuppressedError;
  const er = "resource",
    tr = /^00-[a-f0-9]{32}-[a-f0-9]{16}-[0-9]{1,2}$/;
  function nr(e = []) {
    for (const t of e)
      if ("traceparent" === t.name) {
        if (!tr.test(t.description)) continue;
        const [, e, n] = t.description.split("-");
        if (null != e && null != n) return { traceId: e, spanId: n };
        break;
      }
  }
  function ir(e, t = {}) {
    for (const [n, i] of Object.entries(t)) {
      const t = e[n];
      return null != t && (l(i) ? i.includes(t) : t === i);
    }
    return !0;
  }
  function rr(e) {
    const {
      connectEnd: t,
      connectStart: n,
      decodedBodySize: i,
      domainLookupEnd: r,
      domainLookupStart: o,
      duration: s,
      encodedBodySize: a,
      fetchStart: u,
      initiatorType: c,
      name: l,
      nextHopProtocol: d,
      redirectEnd: f,
      redirectStart: p,
      renderBlockingStatus: g,
      requestStart: m,
      responseEnd: v,
      responseStart: h,
      responseStatus: b,
      secureConnectionStart: w,
      transferSize: y,
      workerStart: S,
    } = e;
    return {
      name: l,
      duration: sr(s),
      tcpHandshakeTime: sr(t - n),
      dnsLookupTime: sr(r - o),
      tlsNegotiationTime: sr(t - w),
      responseStatus: sr(b),
      redirectTime: sr(f - p),
      requestTime: sr(h - m),
      responseTime: sr(v - h),
      fetchTime: sr(v - u),
      serviceWorkerTime: sr(u - S),
      decodedBodySize: sr(i),
      encodedBodySize: sr(a),
      cacheHitStatus: (function () {
        let e = "fullLoad";
        0 === y
          ? i > 0 && (e = "cache")
          : null != b
          ? 304 === b && (e = "conditionalFetch")
          : a > 0 && y < a && (e = "conditionalFetch");
        return e;
      })(),
      renderBlockingStatus: sr(g),
      protocol: d,
      initiatorType: c,
      visibilityState: document.visibilityState,
      ttfb: sr(h - m),
      transferSize: sr(y),
    };
  }
  function or(e) {
    const {
        activationStart: t,
        domComplete: n,
        domContentLoadedEventEnd: i,
        domContentLoadedEventStart: r,
        domInteractive: o,
        fetchStart: s,
        loadEventEnd: a,
        loadEventStart: u,
        responseStart: c,
        type: l,
      } = e,
      d = (function () {
        var e;
        if (
          null !=
          (null === (e = performance.timing) || void 0 === e
            ? void 0
            : e.domLoading)
        )
          return performance.timing.domLoading - performance.timeOrigin;
        return null;
      })();
    return Object.assign(Object.assign({}, rr(e)), {
      pageLoadTime: sr(n - s),
      documentParsingTime: sr(d ? o - d : null),
      domProcessingTime: sr(n - o),
      domContentLoadHandlerTime: sr(i - r),
      onLoadTime: sr(a - u),
      ttfb: sr(Math.max(c - (null != t ? t : 0), 0)),
      type: l,
    });
  }
  function sr(e) {
    return null == e
      ? Le
      : "number" == typeof e
      ? Math.round(e > 0 ? e : 0).toString()
      : e.toString();
  }
  const ar = { initiatorType: ["xmlhttprequest", "fetch"] };
  const ur = new D();
  class cr extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-performance"),
        (this.version = me);
    }
    initialize() {
      "PerformanceObserver" in window
        ? (function (e) {
            if ("complete" === document.readyState) e();
            else {
              const t = () => {
                "complete" === document.readyState &&
                  (e(), document.removeEventListener("readystatechange", t));
              };
              document.addEventListener("readystatechange", t);
            }
          })(() =>
            Qi(this, void 0, void 0, function* () {
              const t = this.api.pushEvent,
                { faroNavigationId: n } = yield (function (e) {
                  let t;
                  const n = new Promise((e) => {
                    t = e;
                  });
                  return (
                    new PerformanceObserver((n) => {
                      var i;
                      const [r] = n.getEntries();
                      if (null == r || Ge(r.name)) return;
                      const o = r.toJSON();
                      let s = nr(null == o ? void 0 : o.serverTiming);
                      const a =
                          null !== (i = Re(Wi, _e.session)) && void 0 !== i
                            ? i
                            : Le,
                        u = Object.assign(Object.assign({}, or(o)), {
                          faroNavigationId: M(),
                          faroPreviousNavigationId: a,
                        });
                      Ue(Wi, u.faroNavigationId, _e.session),
                        e("faro.performance.navigation", u, void 0, {
                          spanContext: s,
                          timestampOverwriteMs:
                            performance.timeOrigin + o.startTime,
                        }),
                        t(u);
                    }).observe({ type: "navigation", buffered: !0 }),
                    n
                  );
                })(t);
              null != n &&
                (function (t, n, i) {
                  const r = e.faro.config.trackResources;
                  new PerformanceObserver((o) => {
                    const s = o.getEntries();
                    for (const o of s) {
                      if (Ge(o.name)) return;
                      const s = o.toJSON();
                      let a = nr(null == s ? void 0 : s.serverTiming);
                      if ((null == r && ir(s, ar)) || r) {
                        const r = Object.assign(Object.assign({}, rr(s)), {
                          faroNavigationId: t,
                          faroResourceId: M(),
                        });
                        e.faro.config.trackUserActionsPreview &&
                          (null == i || i.notify({ type: er })),
                          n("faro.performance.resource", r, void 0, {
                            spanContext: a,
                            timestampOverwriteMs:
                              performance.timeOrigin + s.startTime,
                          });
                      }
                    }
                  }).observe({ type: er, buffered: !0 });
                })(n, t, ur);
            })
          )
        : this.logDebug(
            "performance observer not supported. Disable performance instrumentation."
          );
    }
  }
  const lr = "resource-entry",
    dr = "http-request-start",
    fr = "http-request-end",
    pr = "dom-mutation",
    gr = "data-faro-user-action-name";
  const mr = "fetch",
    vr = "xhr";
  function hr() {
    const e = new D();
    function t(t) {
      e.notify({ type: dr, request: t });
    }
    function n(t) {
      e.notify({ type: fr, request: t });
    }
    return (
      (function ({ onRequestEnd: e, onRequestStart: t }) {
        const n = window.fetch;
        window.fetch = function () {
          var i, r;
          const o = null !== (i = He(arguments[0])) && void 0 !== i ? i : "",
            s = Ge(o),
            a = (null !== (r = arguments[1]) && void 0 !== r ? r : {}).method,
            u = M();
          return (
            s || t({ url: o, method: a, requestId: u, apiType: mr }),
            n
              .apply(this, arguments)
              .then(
                (t) => (
                  s || e({ url: o, method: a, requestId: u, apiType: mr }), t
                )
              )
              .catch((t) => {
                throw (
                  (s || e({ url: o, method: a, requestId: u, apiType: mr }), t)
                );
              })
          );
        };
      })({ onRequestStart: t, onRequestEnd: n }),
      (function ({ onRequestStart: e, onRequestEnd: t }) {
        const n = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
          const i = arguments[1],
            r = Ge(i),
            o = arguments[0],
            s = M();
          this.addEventListener("loadstart", function () {
            r || e({ url: i, method: o, requestId: s, apiType: vr });
          }),
            this.addEventListener("load", function () {
              r || t({ url: i, method: o, requestId: s, apiType: vr });
            }),
            this.addEventListener("error", function () {
              r || t({ url: i, method: o, requestId: s, apiType: vr });
            }),
            this.addEventListener("abort", function () {
              r || t({ url: i, method: o, requestId: s, apiType: vr });
            }),
            n.apply(this, arguments);
        };
      })({ onRequestStart: t, onRequestEnd: n }),
      e
    );
  }
  function br(e) {
    const { api: t, config: n } = e,
      i = hr(),
      r = (function () {
        const e = new D();
        return (
          new MutationObserver((t, n) => {
            e.notify({ type: pr });
          }).observe(document, {
            attributes: !0,
            childList: !0,
            subtree: !0,
            characterData: !0,
          }),
          e
        );
      })(),
      o = (function () {
        const e = new D();
        return (
          ur.subscribe((t) => {
            t.type === er && e.notify({ type: lr });
          }),
          e
        );
      })();
    let s,
      a = !1;
    return function (e) {
      var u;
      let c;
      const l = "apiEvent" === (d = e).type && "string" == typeof d.name;
      var d;
      if (
        ((c = l
          ? e.name
          : (function (e, t) {
              const n = (function (e) {
                  const t = e.split("data-")[1],
                    n =
                      null == t
                        ? void 0
                        : t.replace(/-(.)/g, (e, t) => t.toUpperCase());
                  return null == n ? void 0 : n.replace(/-/g, "");
                })(t),
                i = e.dataset;
              for (const e in i) if (e === n) return i[e];
              return;
            })(
              e.target,
              null !== (u = n.trackUserActionsDataAttributeName) && void 0 !== u
                ? u
                : "faroUserActionName"
            )),
        a || null == c)
      )
        return;
      a = !0;
      const f = E();
      let p;
      const g = M();
      fe.notify({ type: te, name: c, startTime: f, parentId: g }),
        (s = yr(
          s,
          () => {
            (p = E()),
              (a = !1),
              (function (e, t) {
                fe.notify({ type: ie, name: e, parentId: t });
              })(c, g);
          },
          100
        ));
      const m = new Map();
      let v,
        h = !1;
      const b = new D()
        .merge(i, r, o)
        .takeWhile(() => a)
        .filter((e) => !!(!h || (Tr(e) && m.has(e.request.requestId))))
        .subscribe((n) => {
          (function (e) {
            return e.type === dr;
          })(n) && m.set(n.request.requestId, n.request),
            Tr(n) && m.delete(n.request.requestId),
            (s = yr(
              s,
              () => {
                p = E();
                const n = Object.assign(
                    {
                      api: t,
                      userActionName: c,
                      startTime: f,
                      endTime: p,
                      actionId: g,
                      event: e,
                    },
                    l ? { attributes: e.attributes } : {}
                  ),
                  i = m.size > 0;
                h && !i && (clearTimeout(v), (h = !1)),
                  i
                    ? ((h = !0),
                      fe.notify({
                        type: re,
                        name: c,
                        parentId: g,
                        reason: "pending-requests",
                        haltTime: E(),
                      }),
                      (v = yr(
                        void 0,
                        () => {
                          Sr(b), wr(n), (a = !1), (h = !1);
                        },
                        1e4
                      )))
                    : (Sr(b), wr(n), (a = !1), (h = !1));
              },
              100
            ));
        });
    };
  }
  function wr(e) {
    const {
        api: t,
        userActionName: n,
        startTime: i,
        endTime: r,
        actionId: o,
        event: s,
        attributes: a,
      } = e,
      u = r - i,
      c = s.type;
    fe.notify({
      type: ne,
      name: n,
      id: o,
      startTime: i,
      endTime: r,
      duration: u,
      eventType: c,
    }),
      t.pushEvent(
        n,
        Object.assign(
          {
            userActionStartTime: i.toString(),
            userActionEndTime: r.toString(),
            userActionDuration: u.toString(),
            userActionEventType: c,
          },
          _(a)
        ),
        void 0,
        {
          timestampOverwriteMs: i,
          customPayloadTransformer: (e) => ((e.action = { id: o, name: n }), e),
        }
      );
  }
  function yr(e, t, n) {
    return (
      e && clearTimeout(e),
      (e = setTimeout(() => {
        t();
      }, n))
    );
  }
  function Sr(e) {
    null == e || e.unsubscribe(), (e = void 0);
  }
  function Tr(e) {
    return e.type === fr;
  }
  let Er;
  class Ir extends ge {
    constructor() {
      super(...arguments),
        (this.name = "@grafana/faro-web-sdk:instrumentation-user-action"),
        (this.version = me);
    }
    initialize() {
      (Er = br(e.faro)),
        window.addEventListener("pointerdown", Er),
        window.addEventListener("keydown", Er);
    }
  }
  function kr(e = {}) {
    const t = [new Ir(), new Dt(), new Zi(), new at(), new Rt()];
    return (
      !1 !== e.enablePerformanceInstrumentation && t.unshift(new cr()),
      !1 !== e.captureConsole &&
        t.push(new _t({ disabledLevels: e.captureConsoleDisabledLevels })),
      t
    );
  }
  const Or = "browser",
    xr = () => {
      const e = window.k6;
      return {
        k6: Object.assign(
          { isK6Browser: !0 },
          (null == e ? void 0 : e.testRunId) && {
            testRunId: null == e ? void 0 : e.testRunId,
          }
        ),
      };
    };
  let Lr, Cr;
  function Ar({ generatePageId: e, initialPageMeta: t } = {}) {
    return () => {
      const n = location.href;
      return (
        c(e) && Lr !== n && ((Lr = n), (Cr = e(location))),
        {
          page: Object.assign(
            Object.assign({ url: n }, Cr ? { id: Cr } : {}),
            t
          ),
        }
      );
    };
  }
  class Pr extends Y {
    constructor(e) {
      var t, n, i, r;
      super(),
        (this.options = e),
        (this.name = "@grafana/faro-web-sdk:transport-fetch"),
        (this.version = me),
        (this.disabledUntil = new Date()),
        (this.rateLimitBackoffMs =
          null !== (t = e.defaultRateLimitBackoffMs) && void 0 !== t ? t : 5e3),
        (this.getNow =
          null !== (n = e.getNow) && void 0 !== n ? n : () => Date.now()),
        (this.promiseBuffer = A({
          size: null !== (i = e.bufferSize) && void 0 !== i ? i : 30,
          concurrency: null !== (r = e.concurrency) && void 0 !== r ? r : 5,
        }));
    }
    send(e) {
      return Qi(this, void 0, void 0, function* () {
        try {
          if (this.disabledUntil > new Date(this.getNow()))
            return (
              this.logWarn(
                `Dropping transport item due to too many requests. Backoff until ${this.disabledUntil}`
              ),
              Promise.resolve()
            );
          yield this.promiseBuffer.add(() => {
            const t = JSON.stringify(ee(e)),
              { url: n, requestOptions: i, apiKey: r } = this.options,
              o = null != i ? i : {},
              { headers: s } = o,
              a = Yi(o, ["headers"]);
            let u;
            const c = this.metas.value.session;
            return (
              null != c && (u = c.id),
              fetch(
                n,
                Object.assign(
                  {
                    method: "POST",
                    headers: Object.assign(
                      Object.assign(
                        Object.assign(
                          { "Content-Type": "application/json" },
                          null != s ? s : {}
                        ),
                        r ? { "x-api-key": r } : {}
                      ),
                      u ? { "x-faro-session-id": u } : {}
                    ),
                    body: t,
                    keepalive: t.length <= 6e4,
                  },
                  null != a ? a : {}
                )
              )
                .then((e) =>
                  Qi(this, void 0, void 0, function* () {
                    if (202 === e.status) {
                      "invalid" === e.headers.get("X-Faro-Session-Status") &&
                        this.extendFaroSession(this.config, this.logDebug);
                    }
                    return (
                      429 === e.status &&
                        ((this.disabledUntil = this.getRetryAfterDate(e)),
                        this.logWarn(
                          `Too many requests, backing off until ${this.disabledUntil}`
                        )),
                      e.text().catch(C),
                      e
                    );
                  })
                )
                .catch((e) => {
                  this.logError(
                    "Failed sending payload to the receiver\n",
                    JSON.parse(t),
                    e
                  );
                })
            );
          });
        } catch (e) {
          this.logError(e);
        }
      });
    }
    getIgnoreUrls() {
      var e;
      return [this.options.url].concat(
        null !== (e = this.config.ignoreUrls) && void 0 !== e ? e : []
      );
    }
    isBatched() {
      return !0;
    }
    getRetryAfterDate(e) {
      const t = this.getNow(),
        n = e.headers.get("Retry-After");
      if (n) {
        const e = Number(n);
        if (!isNaN(e)) return new Date(1e3 * e + t);
        const i = Date.parse(n);
        if (!isNaN(i)) return new Date(i);
      }
      return new Date(t + this.rateLimitBackoffMs);
    }
    extendFaroSession(e, t) {
      const n = "Session expired",
        i = e.sessionTracking;
      if (null == i ? void 0 : i.enabled) {
        const { fetchUserSession: e, storeUserSession: r } = st(i);
        tt({ fetchUserSession: e, storeUserSession: r })({
          forceSessionExtend: !0,
        }),
          t(`${n} created new session.`);
      } else t(`${n}.`);
    }
  }
  function Mr(e) {
    var t;
    const n = [],
      i = K(e.unpatchedConsole, e.internalLoggerLevel);
    e.transports
      ? ((e.url || e.apiKey) &&
          i.error(
            'if "transports" is defined, "url" and "apiKey" should not be defined'
          ),
        n.push(...e.transports))
      : e.url
      ? n.push(new Pr({ url: e.url, apiKey: e.apiKey }))
      : i.error('either "url" or "transports" must be defined');
    const {
        dedupe: r = !0,
        eventDomain: o = Or,
        globalObjectKey: s = Se,
        instrumentations: a = kr(),
        internalLoggerLevel: u = $,
        isolate: c = !1,
        logArgsSerializer: l = ce,
        metas: d = Nr(e),
        paused: f = !1,
        preventGlobalExposure: p = !1,
        unpatchedConsole: g = G,
        trackUserActionsPreview: m = !1,
        trackUserActionsDataAttributeName: v = gr,
      } = e,
      h = Yi(e, [
        "dedupe",
        "eventDomain",
        "globalObjectKey",
        "instrumentations",
        "internalLoggerLevel",
        "isolate",
        "logArgsSerializer",
        "metas",
        "paused",
        "preventGlobalExposure",
        "unpatchedConsole",
        "trackUserActionsPreview",
        "trackUserActionsDataAttributeName",
      ]);
    return Object.assign(Object.assign({}, h), {
      batching: Object.assign(Object.assign({}, Te), e.batching),
      dedupe: r,
      globalObjectKey: s,
      instrumentations: jr(a, e),
      internalLoggerLevel: u,
      isolate: c,
      logArgsSerializer: l,
      metas: d,
      parseStacktrace: Pt,
      paused: f,
      preventGlobalExposure: p,
      transports: n,
      unpatchedConsole: g,
      eventDomain: o,
      ignoreUrls: (null !== (t = e.ignoreUrls) && void 0 !== t ? t : []).concat(
        [/\/collect(?:\/[\w]*)?$/]
      ),
      sessionTracking: Object.assign(
        Object.assign(Object.assign({}, Ze), e.sessionTracking),
        _r({
          trackGeolocation: e.trackGeolocation,
          sessionTracking: e.sessionTracking,
        })
      ),
      trackUserActionsPreview: m,
      trackUserActionsDataAttributeName: v,
    });
  }
  function jr(e, { trackUserActionsPreview: t }) {
    return e.filter(
      (e) =>
        !("@grafana/faro-web-sdk:instrumentation-user-action" === e.name && !t)
    );
  }
  function Nr(e) {
    var t, n;
    const { page: i, generatePageId: r } =
        null !== (t = null == e ? void 0 : e.pageTracking) && void 0 !== t
          ? t
          : {},
      o = [
        je,
        Ar({ generatePageId: r, initialPageMeta: i }),
        ...(null !== (n = e.metas) && void 0 !== n ? n : []),
      ];
    return u(window.k6) ? [...o, xr] : o;
  }
  function _r({ trackGeolocation: e, sessionTracking: t }) {
    var n;
    const i = {};
    return (
      a(e) && (i.geoLocationTrackingEnabled = e),
      S(i)
        ? {}
        : {
            session: Object.assign(
              Object.assign(
                {},
                null !== (n = null == t ? void 0 : t.session) && void 0 !== n
                  ? n
                  : {}
              ),
              { overrides: i }
            ),
          }
    );
  }
  return (
    (e.BaseExtension = Z),
    (e.BaseInstrumentation = ge),
    (e.BaseTransport = Y),
    (e.ConsoleInstrumentation = _t),
    (e.ConsoleTransport = class extends Y {
      constructor(e = {}) {
        super(),
          (this.options = e),
          (this.name = "@grafana/faro-web-sdk:transport-console"),
          (this.version = me);
      }
      send(t) {
        var n;
        return this.unpatchedConsole[
          null !== (n = this.options.level) && void 0 !== n
            ? n
            : e.LogLevel.DEBUG
        ]("New event", ee([t]));
      }
    }),
    (e.Conventions = {
      EventNames: {
        CLICK: "click",
        NAVIGATION: "navigation",
        SESSION_START: "session_start",
        VIEW_CHANGED: "view_changed",
      },
    }),
    (e.EVENT_CLICK = "click"),
    (e.EVENT_NAVIGATION = "navigation"),
    (e.EVENT_ROUTE_CHANGE = "route_change"),
    (e.EVENT_SESSION_EXTEND = Oe),
    (e.EVENT_SESSION_RESUME = ke),
    (e.EVENT_SESSION_START = Ie),
    (e.EVENT_VIEW_CHANGED = Ee),
    (e.ErrorsInstrumentation = Dt),
    (e.FetchTransport = Pr),
    (e.MAX_SESSION_PERSISTENCE_TIME = Je),
    (e.MAX_SESSION_PERSISTENCE_TIME_BUFFER = 6e4),
    (e.Observable = D),
    (e.PerformanceInstrumentation = cr),
    (e.PersistentSessionsManager = rt),
    (e.SESSION_EXPIRATION_TIME = Ke),
    (e.SESSION_INACTIVITY_TIME = Xe),
    (e.STORAGE_KEY = We),
    (e.SessionInstrumentation = at),
    (e.USER_ACTION_CANCEL = ie),
    (e.USER_ACTION_END = ne),
    (e.USER_ACTION_START = te),
    (e.UserActionInstrumentation = Ir),
    (e.VERSION = me),
    (e.ViewInstrumentation = Rt),
    (e.VolatileSessionsManager = ot),
    (e.WebVitalsInstrumentation = Zi),
    (e.allLogLevels = L),
    (e.apiMessageBus = fe),
    (e.browserMeta = je),
    (e.buildStackFrame = Lt),
    (e.createInternalLogger = K),
    (e.createPromiseBuffer = A),
    (e.createSession = Ne),
    (e.deepEqual = T),
    (e.defaultEventDomain = Or),
    (e.defaultExceptionType = oe),
    (e.defaultGlobalObjectKey = Se),
    (e.defaultInternalLoggerLevel = $),
    (e.defaultLogLevel = x),
    (e.genShortID = M),
    (e.getCurrentTimestamp = I),
    (e.getDataFromSafariExtensions = Ct),
    (e.getIgnoreUrls = $e),
    (e.getInternalFaroFromGlobalObject = function () {
      return j[ve];
    }),
    (e.getStackFramesFromError = At),
    (e.getTransportBody = ee),
    (e.getUrlFromResource = He),
    (e.getWebInstrumentations = kr),
    (e.globalObject = j),
    (e.initializeFaro = function (e) {
      const t = Mr(e);
      if (t) return ye(t);
    }),
    (e.internalGlobalObjectKey = ve),
    (e.isArray = l),
    (e.isBoolean = a),
    (e.isDomError = h),
    (e.isDomException = b),
    (e.isElement = (e) => w && i(e, Element)),
    (e.isElementDefined = w),
    (e.isEmpty = S),
    (e.isError = m),
    (e.isErrorDefined = g),
    (e.isErrorEvent = v),
    (e.isEvent = p),
    (e.isEventDefined = f),
    (e.isFunction = c),
    (e.isInstanceOf = i),
    (e.isInt = (e) => s(e) && Number.isInteger(e)),
    (e.isInternalFaroOnGlobalObject = be),
    (e.isMap = (e) => y && i(e, Map)),
    (e.isMapDefined = y),
    (e.isNull = r),
    (e.isNumber = s),
    (e.isObject = u),
    (e.isPrimitive = d),
    (e.isRegExp = (e) => n(e, "RegExp")),
    (e.isString = o),
    (e.isSymbol = (e) => t(e, "symbol")),
    (e.isSyntheticEvent = (e) =>
      u(e) &&
      "nativeEvent" in e &&
      "preventDefault" in e &&
      "stopPropagation" in e),
    (e.isThenable = (e) => c(null == e ? void 0 : e.then)),
    (e.isToString = n),
    (e.isTypeof = t),
    (e.isUndefined = (e) => t(e, "undefined")),
    (e.makeCoreConfig = Mr),
    (e.noop = C),
    (e.parseStacktrace = Pt),
    (e.sdkMeta = () => ({
      sdk: {
        name: "@grafana/faro-core",
        version: me,
        integrations: e.faro.config.instrumentations.map(
          ({ name: e, version: t }) => ({ name: e, version: t })
        ),
      },
    })),
    (e.setInternalFaroOnGlobalObject = he),
    (e.startUserAction = function (e, t) {
      null == Er ||
        Er(
          (function (e, t) {
            return { name: e, attributes: t, type: "apiEvent" };
          })(e, t)
        );
    }),
    (e.transportItemTypeToBodyKey = B),
    (e.unknownString = Le),
    (e.userActionDataAttribute = gr),
    e
  );
})({});

export default GrafanaFaroWebSdk;
