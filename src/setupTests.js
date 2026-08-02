// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

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
