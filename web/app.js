var e = require("./@babel/runtime/helpers/typeof");
require("./@babel/runtime/helpers/Arrayincludes");
var i = require("./@babel/runtime/helpers/objectSpread2"),
  t = require("./utils/mock-data"),
  a = t.createInitialState,
  n = t.cloneState,
  r = require("./utils/ble/monicard").disconnect,
  c = ["SN202604190001", "SN202604190002", "SN202604190003"],
  s = ["A1B2C3D4E501", "A1B2C3D4E502", "A1B2C3D4E503"];

function d(e) {
  return i(i({}, e.pendingDevice), e.devices[0] || {})
}

function o(e) {
  var i = String(e && e.id ? e.id : "");
  return /^card-\d+$/i.test(i) && !(e && (e.sourceSn || e.sourceMac))
}

function v(e, i) {
  var t = String(e || "").replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 12);
  return 12 === t.length ? t : function(e) {
    for (var i = Date.now() + 97 * e, t = [], a = 0; a < 6; a += 1) {
      var n = i >> 3 * a & 255;
      t.unshift(n.toString(16).toUpperCase().padStart(2, "0"))
    }
    return t.join("")
  }(i)
}

function l(e, i) {
  var t, a, n = i + 1,
    r = String(e && (e.sn || e.id) ? e.sn || e.id : (t = n, a = String(Date.now() + t).slice(-12), "SN".concat(a)));
  return {
    id: r,
    sn: r,
    mac: v(e && e.mac, n),
    name: e && e.name ? String(e.name) : "设备名称".concat(n)
  }
}

function u(e, t, a) {
  return i(i({}, function(e) {
    return i(i({}, d(e)), {}, {
      connected: !0,
      statusLabel: "在线"
    })
  }(e)), l(a, t))
}

function g(t) {
  var n = a();
  if (!t || "object" !== e(t)) return n;
  var r = function(e) {
      return i(i({}, d(e)), {}, {
        battery: "--",
        usedStorageLabel: "--",
        totalStorageLabel: "--",
        storagePercent: 0,
        statusLabel: "未连接",
        signalStrength: 0,
        connected: !1,
        firmwareVersion: "--",
        latestFirmwareVersion: "--"
      })
    }(n),
    v = i(i(i({}, n), t), {}, {
      brand: i(i({}, n.brand), t.brand || {}),
      pendingDevice: i(i({}, n.pendingDevice), t.pendingDevice || {}),
      appSettings: i(i({}, n.appSettings), t.appSettings || {}),
      deviceSettings: i(i({}, n.deviceSettings), t.deviceSettings || {})
    });
  if (Array.isArray(t.devices)) {
    var g = !1;
    v.devices = t.devices.map((function(e, t) {
      return function(e, t, a) {
        return i(i(i({}, t), e || {}), l(e, a))
      }(e, r, t)
    })).filter((function(e) {
      return ! function(e) {
        if (!e) return !1;
        var i = String(e.mac || "").replace(/[^0-9a-fA-F]/g, "").toUpperCase().slice(0, 12);
        return c.includes(e.id) || c.includes(e.sn) || s.includes(i)
      }(e)
    })).filter((function(e) {
      return i = e, t = String(i && (i.sn || i.id) ? i.sn || i.id : ""), a = String(i && i.name ? i.name : ""), !/^device-\d+$/i.test(t) || "设备名称" !== a || !g && (g = !0, !0);
      var i, t, a
    }))
  } else v.devices = n.devices;
  if (v.receivedCardsByDevice = {}, t.receivedCardsByDevice && "object" === e(t.receivedCardsByDevice) && !Array.isArray(t.receivedCardsByDevice) && Object.keys(t.receivedCardsByDevice).forEach((function(e) {
      e && Array.isArray(t.receivedCardsByDevice[e]) && (v.receivedCardsByDevice[e] = t.receivedCardsByDevice[e].filter((function(e) {
        return !o(e)
      })).map((function(e) {
        return i({}, e || {})
      })))
    })), Array.isArray(t.receivedCards) && t.receivedCards.length > 0 && 0 === Object.keys(v.receivedCardsByDevice).length) {
    var D = t.receivedCards.filter((function(e) {
      return !o(e)
    })).map((function(e) {
      return i({}, e || {})
    }));
    D.length > 0 && (v.receivedCardsByDevice.__legacy__ = D)
  }
  if (v.feedbackTypes = Array.isArray(t.feedbackTypes) ? t.feedbackTypes : n.feedbackTypes, v.tagCategories = n.tagCategories, v.pendingDevice = u(n, v.devices.length + 1, t.pendingDevice || v.pendingDevice), v.devices.length > 0)
    if (v.devices.some((function(e) {
        return e.id === v.currentDeviceId || e.sn === v.currentDeviceId
      }))) {
      var h = v.devices.find((function(e) {
        return e.id === v.currentDeviceId || e.sn === v.currentDeviceId
      }));
      v.currentDeviceId = h ? h.id : v.currentDeviceId
    } else v.currentDeviceId = v.devices[0].id;
  else v.currentDeviceId = "";
  return v
}
App({
  globalData: a(),
  _disconnectTimer: null,
  onHide: function() {
    var e = this;
    this._disconnectTimer && (clearTimeout(this._disconnectTimer), this._disconnectTimer = null), this._disconnectTimer = setTimeout((function() {
      r(), e._disconnectTimer = null
    }), 8e3)
  },
  onShow: function() {
    this._disconnectTimer && (clearTimeout(this._disconnectTimer), this._disconnectTimer = null)
  },
  onUnload: function() {
    this._disconnectTimer && (clearTimeout(this._disconnectTimer), this._disconnectTimer = null), r()
  },
  onLaunch: function() {
    wx.onNeedPrivacyAuthorization && wx.onNeedPrivacyAuthorization((function(e) {
      var i = getCurrentPages(),
        t = i[i.length - 1];
      if (t) {
        var a = t.selectComponent && t.selectComponent("#privacy-popup");
        a && "function" == typeof a.show && a.show(e)
      }
    })), wx.cloud && "function" == typeof wx.cloud.init ? wx.cloud.init({
      env: "cloudbase-d0gs8ovyfc71b264e",
      traceUser: !0
    }) : console.warn("wx.cloud is unavailable"), this.loadState();
    var e = wx.getAccountInfoSync().miniProgram.version;
    e && (this.globalData.appSettings.version = e)
  },
  resetState: function() {
    return this.globalData = a(), this.persistState(), this.getState()
  },
  loadState: function() {
    try {
      var e = wx.getStorageSync("monica-app-state-v1");
      this.globalData = g(e)
    } catch (e) {
      console.warn("load state failed", e), this.globalData = a()
    }
    return this.persistState(), this.getState()
  },
  persistState: function() {
    try {
      wx.setStorageSync("monica-app-state-v1", (t = this.globalData, a = t.devices.find((function(e) {
        return e.id === t.currentDeviceId || e.sn === t.currentDeviceId
      })), r = {}, t.receivedCardsByDevice && "object" === e(t.receivedCardsByDevice) && Object.keys(t.receivedCardsByDevice).forEach((function(e) {
        e && Array.isArray(t.receivedCardsByDevice[e]) && (r[e] = t.receivedCardsByDevice[e])
      })), i(i({}, n(t)), {}, {
        currentDeviceId: a ? a.sn : "",
        devices: (t.devices || []).map((function(e, i) {
          var t = l(e, i);
          return {
            sn: t.sn,
            mac: t.mac,
            name: t.name,
            bleDeviceId: e && e.bleDeviceId ? e.bleDeviceId : "",
            cardPreview: e && e.cardPreview ? String(e.cardPreview) : "",
            tagCategory: e && e.tagCategory ? String(e.tagCategory) : "",
            tagName: e && e.tagName ? String(e.tagName) : "",
            tagCategoryId: e && Number.isFinite(Number(e.tagCategoryId)) ? Number(e.tagCategoryId) : void 0,
            tagId: e && Number.isFinite(Number(e.tagId)) ? Number(e.tagId) : void 0
          }
        })),
        pendingDevice: {
          sn: t.pendingDevice && t.pendingDevice.sn ? t.pendingDevice.sn : "",
          mac: t.pendingDevice && t.pendingDevice.mac ? v(t.pendingDevice.mac, t.devices.length + 1) : "",
          name: t.pendingDevice && t.pendingDevice.name ? t.pendingDevice.name : ""
        },
        receivedCardsByDevice: r,
        receivedCards: []
      })))
    } catch (e) {
      console.warn("persist state failed", e)
    }
    var t, a, r
  },
  getState: function() {
    return n(this.globalData)
  },
  getCurrentDevice: function() {
    var e = this;
    return this.globalData.devices.find((function(i) {
      return i.id === e.globalData.currentDeviceId || i.sn === e.globalData.currentDeviceId
    }))
  },
  getDeviceById: function(e) {
    return this.globalData.devices.find((function(i) {
      return i.id === e || i.sn === e
    }))
  },
  setCurrentDeviceId: function(e) {
    var i = this.getDeviceById(e);
    this.globalData.currentDeviceId = i ? i.id : e, this.persistState()
  },
  preparePendingDevice: function(e) {
    var t = a();
    return this.globalData.pendingDevice = u(t, this.globalData.devices.length + 1, i(i({}, this.globalData.pendingDevice), e || {})), this.persistState(), n(this.globalData.pendingDevice)
  },
  commitPendingDevice: function(e) {
    this.globalData.pendingDevice.sn && this.globalData.pendingDevice.mac || this.preparePendingDevice();
    var t = e || this.globalData.pendingDevice.name || "MoniCard";
    this.globalData.pendingDevice.name = t, this.globalData.pendingDevice.statusLabel = "在线", this.globalData.pendingDevice.connected = !0, this.globalData.pendingDevice.id = this.globalData.pendingDevice.sn;
    var a = i(i({}, this.globalData.pendingDevice), {}, {
        name: t
      }),
      n = this.globalData.devices.findIndex((function(e) {
        return e.sn === a.sn
      }));
    return n >= 0 ? this.globalData.devices.splice(n, 1, i(i({}, this.globalData.devices[n]), a)) : this.globalData.devices.unshift(a), this.globalData.currentDeviceId = a.id, this.persistState(), this.getDeviceById(a.id)
  },
  savePendingDeviceName: function(e) {
    var i = this.commitPendingDevice(e);
    return this.globalData.pendingDevice = u(a(), this.globalData.devices.length + 1), this.persistState(), i
  },
  updateDevice: function(e, t) {
    return this.globalData.devices = this.globalData.devices.map((function(a) {
      return a.id !== e ? a : i(i({}, a), t)
    })), this.persistState(), this.getDeviceById(e)
  },
  removeDevice: function(e) {
    var i = this.getDeviceById(e);
    return i ? (this.globalData.devices = this.globalData.devices.filter((function(e) {
      return e.id !== i.id && e.sn !== i.sn
    })), (this.globalData.currentDeviceId === i.id || this.globalData.currentDeviceId === i.sn) && (this.globalData.currentDeviceId = this.globalData.devices[0] ? this.globalData.devices[0].id : ""), this.globalData.receivedCardsByDevice && (delete this.globalData.receivedCardsByDevice[i.id], i.sn && i.sn !== i.id && delete this.globalData.receivedCardsByDevice[i.sn]), this.persistState(), {
      removed: !0,
      deletedDeviceId: i.id,
      nextDeviceId: this.globalData.currentDeviceId,
      deviceCount: this.globalData.devices.length
    }) : {
      removed: !1,
      nextDeviceId: this.globalData.currentDeviceId,
      deviceCount: this.globalData.devices.length
    }
  },
  updateDeviceSettings: function(e) {
    return this.globalData.deviceSettings = i(i({}, this.globalData.deviceSettings), e), this.persistState(), this.globalData.deviceSettings
  },
  getReceivedCards: function(e) {
    var i = e || this.globalData.currentDeviceId || "",
      t = this.globalData.receivedCardsByDevice && this.globalData.receivedCardsByDevice[i];
    return Array.isArray(t) ? n(t) : []
  },
  addReceivedCard: function(e, i) {
    var t = i || this.globalData.currentDeviceId || "";
    if (!t) return n(e);
    this.globalData.receivedCardsByDevice || (this.globalData.receivedCardsByDevice = {}), Array.isArray(this.globalData.receivedCardsByDevice[t]) || (this.globalData.receivedCardsByDevice[t] = []);
    var a = n(e),
      r = this.globalData.receivedCardsByDevice[t],
      c = r.findIndex((function(e) {
        return function(e, i) {
          if (!e || !i) return !1;
          if (e.sourceSn && i.sourceSn && e.sourceSn === i.sourceSn) return !0;
          var t = String(e.sourceMac || "").replace(/[^0-9a-fA-F]/g, "").toUpperCase(),
            a = String(i.sourceMac || "").replace(/[^0-9a-fA-F]/g, "").toUpperCase();
          return !(!t || !a || t !== a) || Boolean(e.id && i.id && e.id === i.id)
        }(e, a)
      }));
    return c >= 0 && r.splice(c, 1), r.unshift(a), this.persistState(), n(a)
  },
  setReceivedCards: function(e, i) {
    var t = i || this.globalData.currentDeviceId || "";
    return t ? (this.globalData.receivedCardsByDevice || (this.globalData.receivedCardsByDevice = {}), this.globalData.receivedCardsByDevice[t] = (e || []).map((function(e) {
      return n(e)
    })), this.persistState(), n(this.globalData.receivedCardsByDevice[t])) : []
  },
  updateReceivedCard: function(e, t, a) {
    var r = a || this.globalData.currentDeviceId || "";
    if (!r || !this.globalData.receivedCardsByDevice || !Array.isArray(this.globalData.receivedCardsByDevice[r])) return null;
    var c = null;
    return this.globalData.receivedCardsByDevice[r] = this.globalData.receivedCardsByDevice[r].map((function(a) {
      return a.id !== e ? a : c = i(i({}, a), n(t))
    })), this.persistState(), c ? n(c) : null
  }
});