import { debounce } from "lodash";

(function (win, lib) {
  const doc = win.document;
  const docEl = doc.documentElement;
  let metaEl = doc.querySelector('meta[name="viewport"]');
  const flexibleEl = doc.querySelector('meta[name="flexible"]');
  let dpr = 0;
  let scale = 0;
  const flexible = lib.flexible || (lib.flexible = {});

  if (metaEl) {
    const match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  } else if (flexibleEl) {
    const content = flexibleEl.getAttribute('content');
    if (content) {
      const initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      const maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
    }
  }

  if (!dpr && !scale) {
    const isAndroid = win.navigator.appVersion.match(/android/gi);
    const isIPhone = win.navigator.appVersion.match(/iphone/gi);
    const devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2;
      } else {
        dpr = 1;
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1;
    }
    scale = 1 / dpr;
  }

  docEl.setAttribute('data-dpr', dpr);
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
    } else {
      const wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  let refreshRem = function () {
    let width = docEl.getBoundingClientRect().width;
    //转换为图片
    let canvas = document.createElement('canvas');
    //获得 2d 上下文对象
    let context = canvas.getContext('2d');
    let backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    let ratio = (window.devicePixelRatio || 1) / backingStore;
    if (width / dpr * ratio < 1440) {
      width = 1440 * dpr / ratio;
    }
    // console.log(width + " . " + dpr)
    // if (width / dpr >= 2560) {
    //   width = 2560 * dpr;
    // }
    const rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
  }

  let refreshRemDebounce = debounce(refreshRem, 200)

  win.addEventListener('resize', function () {
    refreshRemDebounce();
  }, false);
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      refreshRemDebounce();
    }
  }, false);

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = 12 * dpr + 'px';
    }, false);
  }

  refreshRem();

  flexible.dpr = win.dpr = dpr;
  flexible.refreshRem = refreshRem;
  flexible.rem2px = function (d) {
    let val = parseFloat(d) * this.rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  };
  flexible.px2rem = function (d) {
    let val = parseFloat(d) / this.rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  };
})(window, window.lib || (window.lib = {}));

