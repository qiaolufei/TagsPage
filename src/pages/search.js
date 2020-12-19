export const search = (select, value) => {
  // 搜索
  let url = ''
  switch (select) {
    case '1':
      url = 'https://www.baidu.com/s?wd='
      break
    case '2':
      url = 'https://www.google.com/search?ie=utf-8&q='
      break
    case '3':
      url = 'https://www.sogou.com/sogou?ie=utf8&query='
      break
    case '4':
      url = 'https://search.yahoo.com/search?ei=UTF-8&p='
      break
    case '5':
      url = 'https://www.sina.com.cn/mid/search.shtml?q='
      break
    case '6':
      url = 'http://www.yodao.com/search?ue=utf8&keyfrom=web.index&q='
      break
    case '7':
      url = 'https://www.zhihu.com/search?type=content&q='
      break
    case '8':
      url = 'https://github.com/search?q='
      break
  }
  window.location.href = url + value
}
