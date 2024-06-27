```javascript
/**
 * 引入axios库
 */
import axios from "axios";

/**
 * AxiosRequest类，用于管理HTTP请求
 */
class AxiosRequest {
  /**
   * 构造函数，初始化类实例
   * @param {string} baseURL - 请求的基础URL
   */
  constructor(baseURL) {
    this.pendingRequests = new Map(); // 用于存储当前所有正在进行的请求的取消函数
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000, // 设置请求超时时间
    });

    // 请求拦截器，用于在请求发送前进行处理
    this.axiosInstance.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => Promise.reject(error)
    );

    // 响应拦截器，用于在请求返回后进行处理
    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleResponseError(error)
    );
  }

  /**
   * 处理请求，包括取消重复请求和缓存逻辑
   * @param {Object} config - axios请求配置
   * @returns {Object} - 处理后的请求配置
   */
  handleRequest(config) {
    const requestKey = this.generateRequestKey(config); // 生成请求唯一标识

    // 检查是否有重复的请求，如果有则取消该请求
    if (this.pendingRequests.has(requestKey)) {
      const cancelToken = this.pendingRequests.get(requestKey);
      if (cancelToken) cancelToken("Cancelled duplicate request");
      this.pendingRequests.delete(requestKey);
    }

    // 创建新的取消令牌，用于取消请求
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    this.pendingRequests.set(requestKey, cancelTokenSource.cancel);

    // 检查是否有缓存，并且缓存未过期，如果有的话直接返回缓存数据
    if (config.cache) {
      const cachedData = this.getCache(requestKey);
      if (cachedData) {
        return Promise.reject({
          isCache: true,
          response: cachedData,
        });
      }
    }

    return config;
  }

  /**
   * 处理成功的响应，包括删除对应的待处理请求和缓存逻辑
   * @param {Object} response - axios响应对象
   * @returns {Object} - 响应数据
   */
  handleResponse(response) {
    const requestKey = this.generateRequestKey(response.config); // 生成请求唯一标识
    this.pendingRequests.delete(requestKey); // 删除对应的待处理请求

    // 如果响应配置中设置了缓存，那么将响应数据缓存起来
    if (response.config.cache) {
      this.setCache(
        requestKey,
        response,
        response.config.cacheMaxAge || 300000 // 缓存最大有效期，默认为5分钟
      );
    }

    return response;
  }

  /**
   * 处理失败的响应，包括重试逻辑
   * @param {Object} error - 错误对象
   * @returns {Promise} - 处理结果的Promise对象
   */
  async handleResponseError(error) {
    // 如果错误是由于使用了缓存数据造成的，则直接返回缓存数据
    if (error.isCache) {
      return error.response;
    }

    const config = error.config;
    // 如果没有配置信息，则直接返回错误
    if (!config) {
      return Promise.reject(error);
    }

    this.pendingRequests.delete(this.generateRequestKey(config)); // 删除对应的待处理请求

    // 如果请求尚未达到最大重试次数，则进行重试
    config.retryCount = config.retryCount || 0;
    if (config.retryCount < (config.maxRetries || 3)) {
      config.retryCount += 1;
      return this.axiosInstance(config);
    }

    return Promise.reject(error);
  }

  /**
   * 根据请求配置生成唯一的请求标识
   * @param {Object} config - axios请求配置
   * @returns {string} - 请求唯一标识
   */
  generateRequestKey(config) {
    return `${config.method} ${config.url} ${JSON.stringify(
      config.params
    )} ${JSON.stringify(config.data)}`;
  }

  /**
   * 将响应数据缓存到localStorage
   * @param {string} key - 缓存键
   * @param {Object} response - 响应数据
   * @param {number} maxAge - 缓存最大有效期
   */
  setCache(key, response, maxAge) {
    const cacheData = {
      response,
      timestamp: Date.now(),
      maxAge,
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  /**
   * 从localStorage获取缓存数据
   * @param {string} key - 缓存键
   * @returns {Object|null} - 缓存数据或null（如果缓存不存在或已过期）
   */
  getCache(key) {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) {
      return null;
    }

    const { response, timestamp, maxAge } = JSON.parse(cachedData);
    if (Date.now() - timestamp < maxAge) {
      return response;
    } else {
      localStorage.removeItem(key); // 缓存过期，删除缓存
      return null;
    }
  }

  /**
   * 发送请求
   * @param {Object} options - 请求配置项
   * @returns {Promise} - 请求结果的Promise对象
   */
  async request(options) {
    const { url, method, data, params, maxRetries, cache, cacheMaxAge } =
      options;

    try {
      const response = await this.axiosInstance({
        url,
        method,
        data,
        params,
        maxRetries,
        cache,
        cacheMaxAge,
      });

      // 如果响应状态码大于等于400，抛出自定义错误
      if (response.status >= 400) {
        throw new Error(`Custom error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      if (error.isCache) {
        return error.response.data;
      }
      console.error("Request failed:", error);
      throw error;
    }
  }
}

export default AxiosRequest;
```
