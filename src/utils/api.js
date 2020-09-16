import {post, get} from './http'
import qs from 'qs'

// const api = 'http://localhost:8080'
const api = 'http://175.24.122.85:8080'

// 获取所有标签
export const getTags = () => {
  return get(api + '/getTags')
    .then(res => res)
}

// 获取常用标签
export const getUsualTags = () => {
  return get(api + '/getUsualTags')
    .then(res => res)
}

// 搜索标签
export const searchTags = params => {
  return get(api + '/searchTags?' + qs.stringify(params))
    .then(res => res)
}

// post示例
export const login = params => {
  return post(api + '/user/login', qs.stringify(params))
    .then(res => res)
}
