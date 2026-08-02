// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom has no Web Animations API, so use-animate-presence throws the moment a
// fading "+1" is rendered in the fortress. Enough of a stand-in to let the
// components mount: it runs the finish callback rather than animating.
if (typeof window.KeyframeEffect === 'undefined') {
  window.KeyframeEffect = class KeyframeEffect {
    constructor(target, keyframes, options) {
      Object.assign(this, { target, keyframes, options });
    }
  };
  window.Animation = class Animation {
    constructor(effect) {
      this.effect = effect;
      this.playState = 'idle';
      this.onfinish = null;
    }
    play() {
      this.playState = 'running';
    }
    cancel() {
      this.playState = 'idle';
    }
  };
}

// The jsdom that ships with this version of jest has no <dialog> implementation,
// so the Modal component's showModal()/close() calls throw. Every browser we
// actually run in has supported them for years.
const dialogPrototype = document.createElement('dialog').constructor.prototype;
if (!dialogPrototype.showModal) {
  dialogPrototype.showModal = function showModal() {
    this.open = true;
  };
  dialogPrototype.close = function close() {
    this.open = false;
  };
}
