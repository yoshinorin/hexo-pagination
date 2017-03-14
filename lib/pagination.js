'use strict';

var assign = require('object-assign');
var util = require('util');

function pagination(base, posts, options) {
  if (typeof base !== 'string') throw new TypeError('base must be a string!');
  if (!posts) throw new TypeError('posts is required!');
  options = options || {};

  if (base && base[base.length - 1] !== '/') base += '/';

  var length = posts.length;
  var perPage = options.hasOwnProperty('perPage') ? +options.perPage : 10;
  var total = perPage ? Math.ceil(length / perPage) : 1;
  var format = options.format || 'page/%d/';
  var layout = options.layout || ['archive', 'index'];
  var data = options.data || {};
  var result = [];
  var urlCache = {};

  function formatURL(i) {
    if (urlCache[i]) return urlCache[i];

    var url = base;
    if (i > 1) url += util.format(format, i);
    urlCache[i] = url;

    return url;
  }

  function makeData(i) {
    var data = {
      base: base,
      total: total,
      current: i,
      current_url: formatURL(i),
      posts: perPage ? posts.slice(perPage * (i - 1), perPage * i) : posts,
      first: 1,
      first_link: '',
      prev_prev: -1,
      prev_prev_link: '',
      prev: 0,
      prev_link: '',
      next: 0,
      next_link: '',
      next_next: 1,
      next_next_link: '',
      befor_last: total -1,
      befor_last_link: '',
      last: total,
      last_link: ''
    };

    if (i > 1) {
      data.prev = i - 1;
      data.prev_link = formatURL(data.prev);
    }

    if (i < total) {
      data.next = i + 1;
      data.next_link = formatURL(data.next);
    }

    data.prev_prev = data.prev - 1;
    data.next_next = data.next + 1;
    data.first_link = formatURL(data.first);    
    data.prev_prev_link = formatURL(data.prev_prev);
    data.next_next_link = formatURL(data.next_next);
    data.befor_last_link = formatURL(data.befor_last);
    data.last_link = formatURL(data.last);

    return data;
  }

  if (perPage) {
    for (var i = 1; i <= total; i++) {
      result.push({
        path: formatURL(i),
        layout: layout,
        data: assign(makeData(i), data)
      });
    }
  } else {
    result.push({
      path: base,
      layout: layout,
      data: assign(makeData(1), data)
    });
  }

  return result;
}

module.exports = pagination;
