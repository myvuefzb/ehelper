let activeClass='btn-active-status';
let deactivateClass='btn-deactivate-status';
import './switchButtonStatus.css';
let directive={
  bind(el,binding){
    if(binding.value){
      el.removeAttribute('disabled');
      addClass(el,activeClass);
    }else{
      el.setAttribute('disabled','true');
      addClass(el,deactivateClass);
    }
  },
  update(el,binding){
    if(binding.value){
      el.removeAttribute('disabled');
      addClass(el,activeClass);
      removeClass(el,deactivateClass)
    }else{
      el.setAttribute('disabled','true');
      addClass(el,deactivateClass);
      removeClass(el,activeClass)
    }
  }
};
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}
export default directive;
